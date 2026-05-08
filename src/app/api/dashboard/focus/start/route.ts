import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type StartFocusBody = {
  taskId?: string | null;
};

type ActiveFocusRow = {
  id: string;
  userId: string;
  taskId: string | null;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  startedAt: Date;
  task: {
    id: string;
    name: string;
    type: string;
    startTime: string | null;
    endTime: string | null;
    duration: string | null;
  } | null;
};

function mapFocusRow(row: ActiveFocusRow) {
  return {
    id: row.id,
    userId: row.userId,
    taskId: row.taskId,
    status: row.status,
    startedAt: row.startedAt,
    task: row.task
      ? {
          id: row.task.id,
          name: row.task.name || "Task",
          type: row.task.type || "DEEP_WORK",
          startTime: row.task.startTime,
          endTime: row.task.endTime,
          duration: row.task.duration,
        }
      : null,
  };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Bạn cần đăng nhập." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy tài khoản." }, { status: 404 });
    }

    const body = (await request.json()) as StartFocusBody;
    const taskId = body.taskId ? String(body.taskId) : null;

    if (taskId) {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          userId: user.id,
        },
        select: { id: true },
      });

      if (!task) {
        return NextResponse.json({ message: "Task không tồn tại hoặc không thuộc tài khoản của bạn." }, { status: 404 });
      }
    }

    const activeFocusSession = await prisma.focusSession.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      orderBy: {
        startedAt: "desc",
      },
      include: {
        task: {
          select: {
            id: true,
            name: true,
            type: true,
            startTime: true,
            endTime: true,
            duration: true,
          },
        },
      },
    });

    if (activeFocusSession) {
      return NextResponse.json({
        message: "Bạn đang có một phiên focus đang chạy.",
        focusSession: mapFocusRow(activeFocusSession),
      });
    }

    const focusSession = await prisma.focusSession.create({
      data: {
        userId: user.id,
        taskId,
        status: "ACTIVE",
        durationMinutes: 0,
        coinsEarned: 0,
      },
      include: {
        task: {
          select: {
            id: true,
            name: true,
            type: true,
            startTime: true,
            endTime: true,
            duration: true,
          },
        },
      },
    });

    return NextResponse.json(
      { focusSession: mapFocusRow(focusSession) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Start focus error:", error);
    return NextResponse.json({ message: "Không thể bắt đầu focus session." }, { status: 500 });
  }
}
