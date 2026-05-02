import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Priority, TaskType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateTaskBody = {
  name?: string;
  type?: string;
  priority?: string;
  durationMinutes?: number;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
};

function isTaskType(value: string): value is TaskType {
  return Object.values(TaskType).includes(value as TaskType);
}

function isPriority(value: string): value is Priority {
  return Object.values(Priority).includes(value as Priority);
}

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function pad(num: number) {
  return String(num).padStart(2, "0");
}

function addMinutesToTime(startTime: string, minutes: number) {
  const match = startTime.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "";

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const total = hour * 60 + minute + minutes;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;

  return `${pad(nextHour)}:${pad(nextMinute)}`;
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

    const body = (await request.json()) as CreateTaskBody;

    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ message: "Tên task không được để trống." }, { status: 400 });
    }

    const durationMinutes = Number(body.durationMinutes || 45);
    if (!Number.isFinite(durationMinutes) || durationMinutes < 5 || durationMinutes > 480) {
      return NextResponse.json({ message: "Thời lượng task không hợp lệ." }, { status: 400 });
    }

    const rawType = String(body.type || "DEEP_WORK");
    const rawPriority = String(body.priority || "MEDIUM");

    const type = isTaskType(rawType) ? rawType : TaskType.DEEP_WORK;
    const priority = isPriority(rawPriority) ? rawPriority : Priority.MEDIUM;

    const scheduledDate = String(body.scheduledDate || todayKey()).slice(0, 10);
    const startTime = String(body.startTime || "").trim();
    const endTime = String(body.endTime || (startTime ? addMinutesToTime(startTime, durationMinutes) : "")).trim();

    const lastTask = await prisma.task.findFirst({
      where: { userId: user.id, scheduledDate },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true },
    });

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        name,
        type,
        priority,
        duration: `${durationMinutes} phút`,
        deadline: null,
        scheduledTime: startTime && endTime ? `${scheduledDate}|${startTime}|${endTime}` : "",
        explanation: "Task được tạo nhanh từ dashboard.",
        completed: false,
        isBacklog: false,
        scheduledDate,
        startTime: startTime || null,
        endTime: endTime || null,
        focusMode: null,
        focusMinutes: null,
        orderIndex: (lastTask?.orderIndex ?? 0) + 1,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create dashboard task error:", error);
    return NextResponse.json({ message: "Không thể tạo task." }, { status: 500 });
  }
}