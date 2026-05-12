import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { forbiddenPlanResponse, hasFeatureAccess } from "@/lib/plan-access";
import { prisma } from "@/lib/prisma";

type ApplyRescheduleBody = {
  taskId?: string;
  suggestedDate?: string;
  suggestedStart?: string;
  suggestedEnd?: string;
};

function isBodyObject(value: unknown): value is ApplyRescheduleBody {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để áp dụng Smart Reschedule.",
        },
        { status: 401 },
      );
    }

    const body: unknown = await request.json().catch(() => null);

    if (!isBodyObject(body)) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_BODY",
          message: "Dữ liệu gửi lên không hợp lệ.",
        },
        { status: 400 },
      );
    }

    const taskId = body.taskId?.trim();
    const suggestedDate = body.suggestedDate?.trim();
    const suggestedStart = body.suggestedStart?.trim();
    const suggestedEnd = body.suggestedEnd?.trim();

    if (!taskId || !suggestedDate || !suggestedStart || !suggestedEnd) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_FIELDS",
          message: "Thiếu task hoặc khung giờ gợi ý.",
        },
        { status: 400 },
      );
    }

    if (
      !isValidDateKey(suggestedDate) ||
      !isValidTime(suggestedStart) ||
      !isValidTime(suggestedEnd)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_SCHEDULE",
          message: "Ngày hoặc giờ gợi ý không hợp lệ.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
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

    if (!hasFeatureAccess(user, "SMART_RESCHEDULE")) {
      return forbiddenPlanResponse("SMART_RESCHEDULE");
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          error: "TASK_NOT_FOUND",
          message: "Không tìm thấy task để dời lịch.",
        },
        { status: 404 },
      );
    }

    const scheduledTime = `${suggestedDate}|${suggestedStart}|${suggestedEnd}`;

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        scheduledTime,
        scheduledDate: suggestedDate,
        startTime: suggestedStart,
        endTime: suggestedEnd,
        isBacklog: false,
        explanation: "Đã áp dụng Smart Reschedule từ ChronoFlow.",
      },
    });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("APPLY SMART RESCHEDULE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "APPLY_RESCHEDULE_FAILED",
        message: "Không áp dụng được Smart Reschedule.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}