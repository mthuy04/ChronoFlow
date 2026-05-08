import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { RewardRedemptionStatus } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type UpdateRedemptionBody = {
  status?: string;
  adminNote?: string;
};

const VALID_STATUSES = new Set<RewardRedemptionStatus>([
  "PENDING",
  "APPROVED",
  "FULFILLED",
  "REJECTED",
]);

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function getAdminUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      role: true,
    },
  });

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

    const nextStatus = normalizeString(
      body?.status,
    ).toUpperCase() as RewardRedemptionStatus;
    const adminNote = normalizeString(body?.adminNote);

    if (!VALID_STATUSES.has(nextStatus)) {
      return NextResponse.json(
        { success: false, error: "Trạng thái không hợp lệ." },
        { status: 400 },
      );
    }

    const redemption = await prisma.rewardRedemption.findUnique({
      where: {
        id: redemptionId,
      },
      select: {
        id: true,
        userId: true,
        rewardItemId: true,
        rewardTitle: true,
        pointsCost: true,
        status: true,
        note: true,
      },
    });

    if (!redemption) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy yêu cầu đổi quà." },
        { status: 404 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const shouldRefund =
        nextStatus === "REJECTED" &&
        redemption.status !== "REJECTED";

      await tx.rewardRedemption.update({
        where: {
          id: redemption.id,
        },
        data: {
          status: nextStatus,
          note: adminNote
            ? `${redemption.note ? `${redemption.note}\n` : ""}Admin note: ${adminNote}`
            : undefined,
        },
      });

      if (!shouldRefund) {
        return {
          refunded: false,
          nextCoinBalance: null as number | null,
        };
      }

      const existingRefund = await tx.coinTransaction.findFirst({
        where: {
          userId: redemption.userId,
          sourceType: "RewardRedemption",
          sourceId: redemption.id,
          type: "REWARD_REFUND",
        },
        select: {
          id: true,
        },
      });

      if (existingRefund) {
        return {
          refunded: false,
          nextCoinBalance: null as number | null,
        };
      }

      const updatedUser = await tx.user.update({
        where: {
          id: redemption.userId,
        },
        data: {
          coinBalance: {
            increment: redemption.pointsCost,
          },
        },
        select: {
          coinBalance: true,
        },
      });

      if (redemption.rewardItemId) {
        await tx.rewardItem.updateMany({
          where: {
            id: redemption.rewardItemId,
            stock: {
              not: null,
            },
          },
          data: {
            stock: {
              increment: 1,
            },
          },
        });
      }

      const nextCoinBalance = updatedUser.coinBalance ?? 0;

      await tx.coinTransaction.create({
        data: {
          userId: redemption.userId,
          type: "REWARD_REFUND",
          amount: redemption.pointsCost,
          balanceAfter: nextCoinBalance,
          sourceType: "RewardRedemption",
          sourceId: redemption.id,
          description: `Hoàn coin do yêu cầu đổi "${redemption.rewardTitle}" bị từ chối.`,
        },
      });

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
