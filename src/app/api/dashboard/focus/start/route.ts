import { randomUUID } from "crypto";
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
  task_id: string | null;
  task_name: string | null;
  task_type: string | null;
  task_startTime: string | null;
  task_endTime: string | null;
  task_duration: string | null;
};

function mapFocusRow(row: ActiveFocusRow) {
  return {
    id: row.id,
    userId: row.userId,
    taskId: row.taskId,
    status: row.status,
    startedAt: row.startedAt,
    task: row.task_id
      ? {
          id: row.task_id,
          name: row.task_name || "Task",
          type: row.task_type || "DEEP_WORK",
          startTime: row.task_startTime,
          endTime: row.task_endTime,
          duration: row.task_duration,
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

    const activeRows = await prisma.$queryRaw<ActiveFocusRow[]>`
      SELECT
        fs.id,
        fs.userId,
        fs.taskId,
        fs.status,
        fs.startedAt,
        t.id AS task_id,
        t.name AS task_name,
        t.type AS task_type,
        t.startTime AS task_startTime,
        t.endTime AS task_endTime,
        t.duration AS task_duration
      FROM FocusSession fs
      LEFT JOIN Task t ON t.id = fs.taskId
      WHERE fs.userId = ${user.id}
        AND fs.status = 'ACTIVE'
      ORDER BY fs.startedAt DESC
      LIMIT 1
    `;

    if (activeRows[0]) {
      return NextResponse.json({
        message: "Bạn đang có một phiên focus đang chạy.",
        focusSession: mapFocusRow(activeRows[0]),
      });
    }

    const focusSessionId = randomUUID();

    await prisma.$executeRaw`
      INSERT INTO FocusSession (
        id,
        userId,
        taskId,
        status,
        startedAt,
        durationMinutes,
        coinsEarned,
        createdAt,
        updatedAt
      )
      VALUES (
        ${focusSessionId},
        ${user.id},
        ${taskId},
        'ACTIVE',
        NOW(),
        0,
        0,
        NOW(),
        NOW()
      )
    `;

    const createdRows = await prisma.$queryRaw<ActiveFocusRow[]>`
      SELECT
        fs.id,
        fs.userId,
        fs.taskId,
        fs.status,
        fs.startedAt,
        t.id AS task_id,
        t.name AS task_name,
        t.type AS task_type,
        t.startTime AS task_startTime,
        t.endTime AS task_endTime,
        t.duration AS task_duration
      FROM FocusSession fs
      LEFT JOIN Task t ON t.id = fs.taskId
      WHERE fs.id = ${focusSessionId}
      LIMIT 1
    `;

    return NextResponse.json({ focusSession: createdRows[0] ? mapFocusRow(createdRows[0]) : null }, { status: 201 });
  } catch (error) {
    console.error("Start focus error:", error);
    return NextResponse.json({ message: "Không thể bắt đầu focus session." }, { status: 500 });
  }
}