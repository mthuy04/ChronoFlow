import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UpdateRedemptionBody = {
  status?: string;
  adminNote?: string;
};

type AdminUserRow = {
  id: string;
  role: string;
};

type RedemptionRow = {
  id: string;
  userId: string;
  rewardItemId: string | null;
  rewardTitle: string;
  pointsCost: number;
  status: string;
};

type UserBalanceRow = {
  coinBalance: number | null;
};

type RefundTransactionRow = {
  id: string;
};

const VALID_STATUSES = new Set([
  "PENDING",
  "APPROVED",
  "FULFILLED",
  "REJECTED",
  "CANCELLED",
]);

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function getAdminUser(email: string) {
  const users = await prisma.$queryRaw<AdminUserRow[]>`
    SELECT id, role
    FROM \`User\`
    WHERE email = ${email}
    LIMIT 1
  `;

  const user = users[0];

  if (!user || user.role !== "ADMIN") return null;

  return user;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ redemptionId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const admin = await getAdminUser(session.user.email);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden." },
        { status: 403 },
      );
    }

    const { redemptionId } = await context.params;
    const body = (await request.json().catch(() => null)) as
      | UpdateRedemptionBody
      | null;

    const nextStatus = normalizeString(body?.status).toUpperCase();
    const adminNote = normalizeString(body?.adminNote);

    if (!VALID_STATUSES.has(nextStatus)) {
      return NextResponse.json(
        { success: false, error: "Trạng thái không hợp lệ." },
        { status: 400 },
      );
    }

    const redemptions = await prisma.$queryRaw<RedemptionRow[]>`
      SELECT
        id,
        userId,
        rewardItemId,
        rewardTitle,
        pointsCost,
        status
      FROM \`RewardRedemption\`
      WHERE id = ${redemptionId}
      LIMIT 1
    `;

    const redemption = redemptions[0];

    if (!redemption) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy yêu cầu đổi quà." },
        { status: 404 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const shouldRefund =
        nextStatus === "REJECTED" &&
        redemption.status !== "REJECTED" &&
        redemption.status !== "CANCELLED";

      await tx.$executeRaw`
        UPDATE \`RewardRedemption\`
        SET
          status = ${nextStatus},
          note = CASE
            WHEN ${adminNote} <> '' THEN CONCAT(COALESCE(note, ''), '\nAdmin note: ', ${adminNote})
            ELSE note
          END,
          updatedAt = NOW()
        WHERE id = ${redemption.id}
      `;

      if (!shouldRefund) {
        return {
          refunded: false,
          nextCoinBalance: null as number | null,
        };
      }

      const existingRefunds = await tx.$queryRaw<RefundTransactionRow[]>`
        SELECT id
        FROM \`CoinTransaction\`
        WHERE userId = ${redemption.userId}
          AND sourceType = 'RewardRedemption'
          AND sourceId = ${redemption.id}
          AND type = 'REWARD_REFUND'
        LIMIT 1
      `;

      if (existingRefunds.length > 0) {
        return {
          refunded: false,
          nextCoinBalance: null as number | null,
        };
      }

      await tx.$executeRaw`
        UPDATE \`User\`
        SET
          coinBalance = COALESCE(coinBalance, 0) + ${redemption.pointsCost},
          updatedAt = NOW()
        WHERE id = ${redemption.userId}
      `;

      if (redemption.rewardItemId) {
        await tx.$executeRaw`
          UPDATE \`RewardItem\`
          SET
            stock = CASE
              WHEN stock IS NULL THEN NULL
              ELSE stock + 1
            END,
            updatedAt = NOW()
          WHERE id = ${redemption.rewardItemId}
        `;
      }

      const balances = await tx.$queryRaw<UserBalanceRow[]>`
        SELECT COALESCE(coinBalance, 0) AS coinBalance
        FROM \`User\`
        WHERE id = ${redemption.userId}
        LIMIT 1
      `;

      const nextCoinBalance = balances[0]?.coinBalance ?? 0;

      await tx.$executeRaw`
        INSERT INTO \`CoinTransaction\`
          (
            id,
            userId,
            type,
            amount,
            balanceAfter,
            sourceType,
            sourceId,
            description,
            createdAt
          )
        VALUES
          (
            ${randomUUID()},
            ${redemption.userId},
            'REWARD_REFUND',
            ${redemption.pointsCost},
            ${nextCoinBalance},
            'RewardRedemption',
            ${redemption.id},
            ${`Hoàn coin do yêu cầu đổi "${redemption.rewardTitle}" bị từ chối.`},
            NOW()
          )
      `;

      return {
        refunded: true,
        nextCoinBalance,
      };
    });

    return NextResponse.json({
      success: true,
      status: nextStatus,
      refunded: result.refunded,
      nextCoinBalance: result.nextCoinBalance,
    });
  } catch (error) {
    console.error("UPDATE REDEMPTION STATUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật trạng thái đổi quà.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}