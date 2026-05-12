import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { forbiddenPlanResponse, hasFeatureAccess } from "@/lib/plan-access";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để xem lịch sử focus.",
        },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const taskId = url.searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        {
          success: false,
          error: "TASK_ID_REQUIRED",
          message: "Task id is required.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        planTier: true,
        planExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "USER_NOT_FOUND",
          message: "Không tìm thấy tài khoản.",
        },
        { status: 404 },
      );
    }

    if (!hasFeatureAccess(user, "FOCUS_HISTORY")) {
      return forbiddenPlanResponse("FOCUS_HISTORY");
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: "TASK_NOT_FOUND",
          message: "Không tìm thấy task.",
        },
        { status: 404 },
      );
    }

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId: user.id,
        taskId: task.id,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        taskId: true,
        status: true,
        durationMinutes: true,
        coinsEarned: true,
        startedAt: true,
        endedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("FOCUS SESSION HISTORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "FOCUS_HISTORY_LOAD_FAILED",
        message: "Không tải được lịch sử focus.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}