import { NextResponse } from "next/server";
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

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value: unknown) {
  const normalized = normalizeString(value);
  return normalized ? normalized : null;
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

const userEmail = session.user.email;

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

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          id: true,
          name: true,
          email: true,
          coinBalance: true,
        },
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const reward = await tx.rewardItem.findUnique({
        where: {
          id: rewardItemId,
        },
        select: {
          id: true,
          slug: true,
          title: true,
          pointsCost: true,
          active: true,
          stock: true,
          perUserLimit: true,
          category: true,
        },
      });

      if (!reward) {
        throw new Error("REWARD_NOT_FOUND");
      }

      if (!reward.active) {
        throw new Error("REWARD_INACTIVE");
      }

      if (typeof reward.stock === "number" && reward.stock <= 0) {
        throw new Error("REWARD_OUT_OF_STOCK");
      }

      const limit = reward.perUserLimit ?? 1;

      if (limit > 0) {
        const currentCount = await tx.rewardRedemption.count({
          where: {
            userId: user.id,
            rewardItemId: reward.id,
            status: {
              not: "REJECTED",
            },
          },
        });

        if (currentCount >= limit) {
          throw new Error("REWARD_LIMIT_REACHED");
        }
      }

      const currentBalance = user.coinBalance ?? 0;

      if (currentBalance < reward.pointsCost) {
        throw new Error("NOT_ENOUGH_COINS");
      }

      const userUpdate = await tx.user.updateMany({
        where: {
          id: user.id,
          coinBalance: {
            gte: reward.pointsCost,
          },
        },
        data: {
          coinBalance: {
            decrement: reward.pointsCost,
          },
        },
      });

      if (userUpdate.count === 0) {
        throw new Error("COIN_BALANCE_CHANGED");
      }

      if (typeof reward.stock === "number") {
        const stockUpdate = await tx.rewardItem.updateMany({
          where: {
            id: reward.id,
            stock: {
              gt: 0,
            },
          },
          data: {
            stock: {
              decrement: 1,
            },
          },
        });

        if (stockUpdate.count === 0) {
          throw new Error("REWARD_OUT_OF_STOCK");
        }
      }

      const updatedUser = await tx.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          coinBalance: true,
        },
      });

      const nextCoinBalance = updatedUser?.coinBalance ?? 0;

      const redemption = await tx.rewardRedemption.create({
        data: {
          userId: user.id,
          rewardItemId: reward.id,
          rewardId: reward.slug,
          rewardTitle: reward.title,
          pointsCost: reward.pointsCost,
          recipientName,
          phone,
          address,
          note,
          status: "PENDING",
        },
        select: {
          id: true,
          rewardItemId: true,
          userId: true,
          pointsCost: true,
          status: true,
          createdAt: true,
        },
      });

      await tx.coinTransaction.create({
        data: {
          userId: user.id,
          type: "REWARD_REDEEM",
          amount: -reward.pointsCost,
          balanceAfter: nextCoinBalance,
          sourceType: "RewardRedemption",
          sourceId: redemption.id,
          description: `Đổi phần thưởng: ${reward.title}`,
        },
      });

      return {
        reward,
        redemption,
        nextCoinBalance,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Đã gửi yêu cầu đổi "${result.reward.title}".`,
      redemption: result.redemption,
      nextCoinBalance: result.nextCoinBalance,
    });
  } catch (error) {
    console.error("REDEEM REWARD ERROR:", error);

    if (error instanceof Error) {
      const errorMap: Record<string, { error: string; status: number }> = {
        USER_NOT_FOUND: {
          error: "Không tìm thấy tài khoản.",
          status: 404,
        },
        REWARD_NOT_FOUND: {
          error: "Không tìm thấy phần thưởng.",
          status: 404,
        },
        REWARD_INACTIVE: {
          error: "Phần thưởng này hiện chưa khả dụng.",
          status: 400,
        },
        REWARD_OUT_OF_STOCK: {
          error: "Phần thưởng này hiện đã hết hàng.",
          status: 400,
        },
        REWARD_LIMIT_REACHED: {
          error: "Bạn đã đạt giới hạn đổi phần thưởng này.",
          status: 400,
        },
        NOT_ENOUGH_COINS: {
          error: "Bạn chưa đủ coin để đổi phần thưởng này.",
          status: 400,
        },
        COIN_BALANCE_CHANGED: {
          error: "Số dư coin vừa thay đổi. Vui lòng thử lại.",
          status: 409,
        },
      };

      const mapped = errorMap[error.message];

      if (mapped) {
        return NextResponse.json(
          {
            success: false,
            error: mapped.error,
          },
          { status: mapped.status },
        );
      }
    }

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