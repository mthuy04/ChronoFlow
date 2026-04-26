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
  scheduledTime?: string;
  explanation?: string;
  completed?: boolean;
};

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
    const scheduledTime = normalizeString(body.scheduledTime);
    const explanation = normalizeString(body.explanation);
    const type = normalizeTaskType(body.type);
    const priority = normalizePriority(body.priority);

    const deadline =
      typeof body.deadline === "string" && body.deadline.trim()
        ? body.deadline.trim()
        : null;

    const completed = typeof body.completed === "boolean" ? body.completed : false;

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

    if (!scheduledTime) {
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

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        name,
        type,
        priority,
        duration,
        deadline,
        scheduledTime,
        explanation,
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