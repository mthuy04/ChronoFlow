import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectivePlan } from "@/lib/plan-access";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          ok: false,
          error: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để xem gói hiện tại.",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        planTier: true,
        planActivatedAt: true,
        planExpiresAt: true,
        planSource: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "USER_NOT_FOUND",
          message: "Không tìm thấy tài khoản.",
        },
        { status: 404 },
      );
    }

    const effectivePlan = getEffectivePlan(user);

    return NextResponse.json({
      ok: true,
      plan: {
        tier: effectivePlan,
        rawTier: user.planTier,
        activatedAt: user.planActivatedAt,
        expiresAt: user.planExpiresAt,
        source: user.planSource,
        isActive: effectivePlan !== "FREE" || user.planTier === "FREE",
      },
    });
  } catch (error) {
    console.error("ACCOUNT PLAN ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "PLAN_LOAD_FAILED",
        message: "Không tải được thông tin gói hiện tại.",
      },
      { status: 500 },
    );
  }
}