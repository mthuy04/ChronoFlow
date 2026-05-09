import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Priority, TaskType } from "@prisma/client";

type CreateTaskBody = {
  name?: string;
  type?: string;
  priority?: string;
  duration?: string;
  deadline?: string | null;
  scheduledDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  scheduledTime?: string;
  explanation?: string;
  focusMode?: string | null;
  focusMinutes?: number | null;
  isBacklog?: boolean;
  orderIndex?: number;
  completed?: boolean;
};

function getScheduleFields({
  scheduledTime,
  scheduledDate,
  startTime,
  endTime,
  isBacklog,
}: {
  scheduledTime: string;
  scheduledDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  isBacklog?: boolean;
}) {
  const value = scheduledTime.trim();
  const explicitDate = normalizeNullableString(scheduledDate);
  const explicitStart = normalizeNullableString(startTime);
  const explicitEnd = normalizeNullableString(endTime);

  if (isBacklog || !value || value.toUpperCase() === "BACKLOG") {
    return {
      scheduledTime: "BACKLOG",
      isBacklog: true,
      scheduledDate: null,
      startTime: null,
      endTime: null,
    };
  }

  if (explicitDate && explicitStart && explicitEnd) {
    return {
      scheduledTime: `${explicitDate}|${explicitStart}|${explicitEnd}`,
      isBacklog: false,
      scheduledDate: explicitDate,
      startTime: explicitStart,
      endTime: explicitEnd,
    };
  }

  const parts = value.split("|");

  if (parts.length === 3) {
    const [scheduledDate, startTime, endTime] = parts;

    return {
      scheduledTime: value,
      isBacklog: false,
      scheduledDate: scheduledDate || null,
      startTime: startTime || null,
      endTime: endTime || null,
    };
  }

  const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
  const timeMatches = value.match(/\b\d{2}:\d{2}\b/g);

  return {
    scheduledTime: value,
    isBacklog: false,
    scheduledDate: dateMatch?.[1] ?? null,
    startTime: timeMatches?.[0] ?? null,
    endTime: timeMatches?.[1] ?? null,
  };
}

function isValidTaskType(value: string): value is TaskType {
  return Object.values(TaskType).includes(value as TaskType);
}

function isValidPriority(value: string): value is Priority {
  return Object.values(Priority).includes(value as Priority);
}

function normalizeTaskType(value?: string): TaskType | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return isValidTaskType(normalized) ? normalized : null;
}

function normalizePriority(value?: string): Priority | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return isValidPriority(normalized) ? normalized : null;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableString(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized ? normalized : null;
}

function normalizeOptionalNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(value);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: [{ completed: "asc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load tasks.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = (await req.json()) as CreateTaskBody;

    const name = normalizeString(body.name);
    const duration = normalizeString(body.duration);
    const requestedScheduledTime = normalizeString(body.scheduledTime);
    const explanation = normalizeString(body.explanation);
    const type = normalizeTaskType(body.type);
    const priority = normalizePriority(body.priority);

    const deadline =
      typeof body.deadline === "string" && body.deadline.trim()
        ? body.deadline.trim()
        : null;

    const completed = typeof body.completed === "boolean" ? body.completed : false;
    const isBacklog = typeof body.isBacklog === "boolean" ? body.isBacklog : false;
    const focusMode = normalizeNullableString(body.focusMode);
    const focusMinutes = normalizeOptionalNumber(body.focusMinutes);

    if (!name) {
      return NextResponse.json(
        { error: "Task name is required." },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Invalid task type." },
        { status: 400 }
      );
    }

    if (!priority) {
      return NextResponse.json(
        { error: "Invalid priority." },
        { status: 400 }
      );
    }

    if (!duration) {
      return NextResponse.json(
        { error: "Duration is required." },
        { status: 400 }
      );
    }

    if (!requestedScheduledTime && !isBacklog) {
      return NextResponse.json(
        { error: "Scheduled time is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const scheduleFields = getScheduleFields({
      scheduledTime: requestedScheduledTime || "BACKLOG",
      scheduledDate: body.scheduledDate,
      startTime: body.startTime,
      endTime: body.endTime,
      isBacklog,
    });

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        name,
        type,
        priority,
        duration,
        deadline,
        ...scheduleFields,
        explanation,
        focusMode,
        focusMinutes,
        orderIndex:
          typeof body.orderIndex === "number" && Number.isFinite(body.orderIndex)
            ? Math.round(body.orderIndex)
            : 0,
        completed,
      },
    });

    return NextResponse.json(
      {
        success: true,
        task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create task.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
