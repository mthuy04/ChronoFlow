import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RedeemBody = {
  rewardItemId?: string;
  recipientName?: string;
  phone?: string;
  address?: string;
  note?: string;
};

type UserCoinRow = {
  id: string;
  name: string | null;
  email: string;
  coinBalance: number | null;
};

type RewardItemRow = {
  id: string;
  slug: string;
  title: string;
  pointsCost: number;
  active: number | boolean;
  stock: number | null;
  perUserLimit: number | null;
  category: string | null;
};

type BalanceRow = {
  coinBalance: number | null;
};

type ExistingRedemptionCountRow = {
  total: bigint | number;
};

type UpdateResultRow = {
  affectedRows?: number;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value: unknown) {
  const normalized = normalizeString(value);
  return normalized ? normalized : null;
}

function normalizeActive(value: number | boolean) {
  return value === true || value === 1;
}

function getCountValue(value: bigint | number) {
  return typeof value === "bigint" ? Number(value) : value;
}

function validatePhone(value: string) {
  return /^[0-9+\-\s()]{8,20}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn cần đăng nhập để đổi quà.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => null)) as RedeemBody | null;

    const rewardItemId = normalizeString(body?.rewardItemId);
    const recipientName = normalizeString(body?.recipientName);
    const phone = normalizeString(body?.phone);
    const address = normalizeString(body?.address);
    const note = normalizeOptionalString(body?.note);

    if (!rewardItemId) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu rewardItemId.",
        },
        { status: 400 },
      );
    }

    if (!recipientName) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập họ tên nhận quà.",
        },
        { status: 400 },
      );
    }

    if (!phone || !validatePhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập số điện thoại hợp lệ.",
        },
        { status: 400 },
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập địa chỉ nhận quà.",
        },
        { status: 400 },
      );
    }

    const users = await prisma.$queryRaw<UserCoinRow[]>`
      SELECT
        id,
        name,
        email,
        COALESCE(coinBalance, 0) AS coinBalance
      FROM \`User\`
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy tài khoản.",
        },
        { status: 404 },
      );
    }

    const rewards = await prisma.$queryRaw<RewardItemRow[]>`
      SELECT
        id,
        slug,
        title,
        pointsCost,
        active,
        stock,
        perUserLimit,
        category
      FROM \`RewardItem\`
      WHERE id = ${rewardItemId}
      LIMIT 1
    `;

    const reward = rewards[0];

    if (!reward) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy phần thưởng.",
        },
        { status: 404 },
      );
    }

    if (!normalizeActive(reward.active)) {
      return NextResponse.json(
        {
          success: false,
          error: "Phần thưởng này hiện chưa khả dụng.",
        },
        { status: 400 },
      );
    }

    if (typeof reward.stock === "number" && reward.stock <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Phần thưởng này hiện đã hết hàng.",
        },
        { status: 400 },
      );
    }

    const limit = reward.perUserLimit ?? 1;

    if (limit > 0) {
      const existingCounts = await prisma.$queryRaw<ExistingRedemptionCountRow[]>`
        SELECT COUNT(*) AS total
        FROM \`RewardRedemption\`
        WHERE userId = ${user.id}
          AND rewardItemId = ${reward.id}
          AND status NOT IN ('REJECTED', 'CANCELLED')
      `;

      const currentCount = getCountValue(existingCounts[0]?.total ?? 0);

      if (currentCount >= limit) {
        return NextResponse.json(
          {
            success: false,
            error: "Bạn đã đạt giới hạn đổi phần thưởng này.",
          },
          { status: 400 },
        );
      }
    }

    const currentBalance = user.coinBalance ?? 0;

    if (currentBalance < reward.pointsCost) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn chưa đủ coin để đổi phần thưởng này.",
        },
        { status: 400 },
      );
    }

    const redemptionId = randomUUID();

    const result = await prisma.$transaction(async (tx) => {
      const updateRows = await tx.$queryRaw<UpdateResultRow[]>`
        UPDATE \`User\`
        SET
          coinBalance = COALESCE(coinBalance, 0) - ${reward.pointsCost},
          updatedAt = NOW()
        WHERE id = ${user.id}
          AND COALESCE(coinBalance, 0) >= ${reward.pointsCost}
      `;

      const affectedRows = updateRows[0]?.affectedRows ?? 0;

      if (affectedRows === 0) {
        throw new Error("Coin balance changed. Please try again.");
      }

      if (typeof reward.stock === "number") {
        await tx.$executeRaw`
          UPDATE \`RewardItem\`
          SET
            stock = GREATEST(COALESCE(stock, 0) - 1, 0),
            updatedAt = NOW()
          WHERE id = ${reward.id}
            AND COALESCE(stock, 0) > 0
        `;
      }

      const balanceRows = await tx.$queryRaw<BalanceRow[]>`
        SELECT COALESCE(coinBalance, 0) AS coinBalance
        FROM \`User\`
        WHERE id = ${user.id}
        LIMIT 1
      `;

      const nextCoinBalance = balanceRows[0]?.coinBalance ?? 0;

      await tx.$executeRaw`
        INSERT INTO \`RewardRedemption\`
          (
            id,
            userId,
            rewardItemId,
            rewardId,
            rewardTitle,
            pointsCost,
            recipientName,
            phone,
            address,
            note,
            status,
            createdAt,
            updatedAt
          )
        VALUES
          (
            ${redemptionId},
            ${user.id},
            ${reward.id},
            ${reward.slug},
            ${reward.title},
            ${reward.pointsCost},
            ${recipientName},
            ${phone},
            ${address},
            ${note},
            'PENDING',
            NOW(),
            NOW()
          )
      `;

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
            ${user.id},
            'REWARD_REDEEM',
            ${-reward.pointsCost},
            ${nextCoinBalance},
            'RewardRedemption',
            ${redemptionId},
            ${`Đổi phần thưởng: ${reward.title}`},
            NOW()
          )
      `;

      return {
        nextCoinBalance,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Đã gửi yêu cầu đổi "${reward.title}".`,
      redemption: {
        id: redemptionId,
        rewardItemId: reward.id,
        userId: user.id,
        pointsCost: reward.pointsCost,
        status: "PENDING",
      },
      nextCoinBalance: result.nextCoinBalance,
    });
  } catch (error) {
    console.error("REDEEM REWARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể đổi phần thưởng.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}