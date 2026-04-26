import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Priority, TaskType } from "@prisma/client";

type UpdateTaskBody = {
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

async function getAuthorizedUserAndTask(taskId: string, email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return { user: null, task: null };
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: user.id,
    },
  });

  return { user, task };
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required." },
        { status: 400 }
      );
    }

    const body = (await req.json()) as UpdateTaskBody;
    const { user, task } = await getAuthorizedUserAndTask(id, session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (!task) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    const data: {
      name?: string;
      type?: TaskType;
      priority?: Priority;
      duration?: string;
      deadline?: string | null;
      scheduledTime?: string;
      explanation?: string;
      completed?: boolean;
    } = {};

    if (body.name !== undefined) {
      const name = normalizeString(body.name);
      if (!name) {
        return NextResponse.json(
          { error: "Task name cannot be empty." },
          { status: 400 }
        );
      }
      data.name = name;
    }

    if (body.type !== undefined) {
      const type = normalizeTaskType(body.type);
      if (!type) {
        return NextResponse.json(
          { error: "Invalid task type." },
          { status: 400 }
        );
      }
      data.type = type;
    }

    if (body.priority !== undefined) {
      const priority = normalizePriority(body.priority);
      if (!priority) {
        return NextResponse.json(
          { error: "Invalid priority." },
          { status: 400 }
        );
      }
      data.priority = priority;
    }

    if (body.duration !== undefined) {
      const duration = normalizeString(body.duration);
      if (!duration) {
        return NextResponse.json(
          { error: "Duration cannot be empty." },
          { status: 400 }
        );
      }
      data.duration = duration;
    }

    if (body.deadline !== undefined) {
      data.deadline =
        typeof body.deadline === "string" && body.deadline.trim()
          ? body.deadline.trim()
          : null;
    }

    if (body.scheduledTime !== undefined) {
      const scheduledTime = normalizeString(body.scheduledTime);
      if (!scheduledTime) {
        return NextResponse.json(
          { error: "Scheduled time cannot be empty." },
          { status: 400 }
        );
      }
      data.scheduledTime = scheduledTime;
    }

    if (body.explanation !== undefined) {
      data.explanation = normalizeString(body.explanation);
    }

    if (body.completed !== undefined) {
      if (typeof body.completed !== "boolean") {
        return NextResponse.json(
          { error: "Completed must be a boolean." },
          { status: 400 }
        );
      }
      data.completed = body.completed;
    }

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data,
    });

    return NextResponse.json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update task.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required." },
        { status: 400 }
      );
    }

    const { user, task } = await getAuthorizedUserAndTask(id, session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (!task) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: task.id },
    });

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete task.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}