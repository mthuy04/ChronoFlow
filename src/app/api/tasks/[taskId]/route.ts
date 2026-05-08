import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma, Priority, TaskType } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

type StreakActivityTaskRow = {
  id: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  completed: number | boolean;
  updatedAt: Date;
};

type StreakActivityFocusRow = {
  id: string;
  startedAt: Date;
};

type StreakRewardResult = {
  awarded: boolean;
  milestone: number;
  coinsEarned: number;
  currentStreak: number;
  nextCoinBalance: number;
};

type TaskPatchResponsePayload = {
  success: true;
  task: unknown;
  awardedCoins: number;
  nextCoinBalance: number;
  streakReward: StreakRewardResult | null;
};

const STREAK_REWARD_MILESTONE = 7;
const STREAK_REWARD_COINS = 70;

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

function getScheduleFields(scheduledTime: string) {
  const value = scheduledTime.trim();

  if (!value || value.toUpperCase() === "BACKLOG") {
    return {
      scheduledTime: "BACKLOG",
      isBacklog: true,
      scheduledDate: null,
      startTime: null,
      endTime: null,
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

function calculateTaskCoins(task: {
  priority: Priority;
  type: TaskType;
  duration: string;
}) {
  const priorityCoins: Record<Priority, number> = {
    HIGH: 18,
    MEDIUM: 12,
    LOW: 8,
  };

  const typeBonus: Partial<Record<TaskType, number>> = {
    DEEP_WORK: 7,
    STUDY: 5,
    CREATIVE: 5,
  };

  const durationMatch = task.duration.match(/\d+/);
  const durationNumber = durationMatch ? Number(durationMatch[0]) : 0;
  const durationBonus =
    durationNumber >= 90 ? 8 : durationNumber >= 45 ? 4 : 0;

  return Math.min(
    40,
    priorityCoins[task.priority] + (typeBonus[task.type] ?? 0) + durationBonus,
  );
}

function toVietnamDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getTaskDateKey(task: StreakActivityTaskRow) {
  if (task.scheduledDate) return task.scheduledDate.slice(0, 10);

  const raw = String(task.scheduledTime || "").trim();
  const dateMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);

  if (dateMatch) return dateMatch[1];

  const pipeParts = raw.split("|");

  if (
    pipeParts.length >= 1 &&
    /^\d{4}-\d{2}-\d{2}$/.test(pipeParts[0])
  ) {
    return pipeParts[0];
  }

  return toVietnamDateKey(task.updatedAt);
}

function computeProductivityStreak(params: {
  tasks: StreakActivityTaskRow[];
  focusSessions: StreakActivityFocusRow[];
}) {
  const activeDateKeys = new Set<string>();

  params.tasks.forEach((task) => {
    if (Boolean(task.completed)) {
      activeDateKeys.add(getTaskDateKey(task));
    }
  });

  params.focusSessions.forEach((session) => {
    activeDateKeys.add(toVietnamDateKey(session.startedAt));
  });

  let streak = 0;
  const today = new Date();

  for (let offset = 0; offset < 365; offset += 1) {
    const key = toVietnamDateKey(addDays(today, -offset));

    if (!activeDateKeys.has(key)) break;

    streak += 1;
  }

  return streak;
}

async function getAuthorizedUserAndTask(taskId: string, email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      coinBalance: true,
    },
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

async function getCurrentCoinBalance(params: {
  tx: Prisma.TransactionClient;
  userId: string;
}) {
  const user = await params.tx.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      coinBalance: true,
    },
  });

  return user?.coinBalance ?? 0;
}

async function insertCoinTransaction(params: {
  tx: Prisma.TransactionClient;
  userId: string;
  type: string;
  amount: number;
  balanceAfter: number;
  sourceType: string;
  sourceId: string;
  description: string;
}) {
  await params.tx.coinTransaction.create({
    data: {
      userId: params.userId,
      type: params.type,
      amount: params.amount,
      balanceAfter: params.balanceAfter,
      sourceType: params.sourceType,
      sourceId: params.sourceId,
      description: params.description,
    },
  });
}

async function awardSevenDayStreakRewardIfEligible(params: {
  tx: Prisma.TransactionClient;
  userId: string;
  currentCoinBalance: number;
}): Promise<StreakRewardResult> {
  const tasks = await params.tx.task.findMany({
    where: {
      userId: params.userId,
      completed: true,
    },
    select: {
      id: true,
      scheduledDate: true,
      scheduledTime: true,
      completed: true,
      updatedAt: true,
    },
  });

  const focusSessions = await params.tx.focusSession.findMany({
    where: {
      userId: params.userId,
      status: "COMPLETED",
    },
    select: {
      id: true,
      startedAt: true,
    },
  });

  const currentStreak = computeProductivityStreak({
    tasks,
    focusSessions,
  });

  if (currentStreak < STREAK_REWARD_MILESTONE) {
    return {
      awarded: false,
      milestone: STREAK_REWARD_MILESTONE,
      coinsEarned: 0,
      currentStreak,
      nextCoinBalance: params.currentCoinBalance,
    };
  }

  const existingReward = await params.tx.streakReward.findUnique({
    where: {
      userId_milestone: {
        userId: params.userId,
        milestone: STREAK_REWARD_MILESTONE,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingReward) {
    return {
      awarded: false,
      milestone: STREAK_REWARD_MILESTONE,
      coinsEarned: 0,
      currentStreak,
      nextCoinBalance: params.currentCoinBalance,
    };
  }

  const streakReward = await params.tx.streakReward.create({
    data: {
      userId: params.userId,
      milestone: STREAK_REWARD_MILESTONE,
      coinsEarned: STREAK_REWARD_COINS,
    },
    select: {
      id: true,
    },
  });

  const updatedUser = await params.tx.user.update({
    where: {
      id: params.userId,
    },
    data: {
      coinBalance: {
        increment: STREAK_REWARD_COINS,
      },
    },
    select: {
      coinBalance: true,
    },
  });

  const nextCoinBalance = updatedUser.coinBalance ?? 0;

  await insertCoinTransaction({
    tx: params.tx,
    userId: params.userId,
    type: "STREAK_7_DAYS",
    amount: STREAK_REWARD_COINS,
    balanceAfter: nextCoinBalance,
    sourceType: "StreakReward",
    sourceId: streakReward.id,
    description: "Mở khóa streak 7 ngày.",
  });

  return {
    awarded: true,
    milestone: STREAK_REWARD_MILESTONE,
    coinsEarned: STREAK_REWARD_COINS,
    currentStreak,
    nextCoinBalance,
  };
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ taskId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { taskId } = await context.params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task id is required." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as UpdateTaskBody;

    const { user, task } = await getAuthorizedUserAndTask(
      taskId,
      session.user.email,
    );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const data: Prisma.TaskUpdateInput = {};

    if (body.name !== undefined) {
      const name = normalizeString(body.name);

      if (!name) {
        return NextResponse.json(
          { error: "Task name cannot be empty." },
          { status: 400 },
        );
      }

      data.name = name;
    }

    if (body.type !== undefined) {
      const type = normalizeTaskType(body.type);

      if (!type) {
        return NextResponse.json(
          { error: "Invalid task type." },
          { status: 400 },
        );
      }

      data.type = type;
    }

    if (body.priority !== undefined) {
      const priority = normalizePriority(body.priority);

      if (!priority) {
        return NextResponse.json(
          { error: "Invalid priority." },
          { status: 400 },
        );
      }

      data.priority = priority;
    }

    if (body.duration !== undefined) {
      const duration = normalizeString(body.duration);

      if (!duration) {
        return NextResponse.json(
          { error: "Duration cannot be empty." },
          { status: 400 },
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
          { status: 400 },
        );
      }

      Object.assign(data, getScheduleFields(scheduledTime));
    }

    if (body.explanation !== undefined) {
      data.explanation = normalizeString(body.explanation);
    }

    if (body.completed !== undefined) {
      if (typeof body.completed !== "boolean") {
        return NextResponse.json(
          { error: "Completed must be a boolean." },
          { status: 400 },
        );
      }

      data.completed = body.completed;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 },
      );
    }

    const shouldAwardCoins =
      body.completed === true && task.completed === false;

    const awardedCoins = shouldAwardCoins ? calculateTaskCoins(task) : 0;

    const result = await prisma.$transaction(async (tx) => {
      const updatedTask = await tx.task.update({
        where: { id: task.id },
        data,
      });

      let nextCoinBalance = user.coinBalance ?? 0;

      if (shouldAwardCoins && awardedCoins > 0) {
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            coinBalance: {
              increment: awardedCoins,
            },
          },
          select: {
            coinBalance: true,
          },
        });

        nextCoinBalance = updatedUser.coinBalance ?? nextCoinBalance + awardedCoins;

        await insertCoinTransaction({
          tx,
          userId: user.id,
          type: "TASK_COMPLETED",
          amount: awardedCoins,
          balanceAfter: nextCoinBalance,
          sourceType: "Task",
          sourceId: task.id,
          description: `Hoàn thành task: ${task.name}`,
        });
      }

      let streakReward: StreakRewardResult | null = null;

      if (body.completed === true) {
        streakReward = await awardSevenDayStreakRewardIfEligible({
          tx,
          userId: user.id,
          currentCoinBalance: nextCoinBalance,
        });

        nextCoinBalance = streakReward.nextCoinBalance;
      }

      const finalCoinBalance = await getCurrentCoinBalance({
        tx,
        userId: user.id,
      });

      return {
        updatedTask,
        nextCoinBalance: finalCoinBalance,
        streakReward,
      };
    });

    return NextResponse.json({
      success: true,
      task: result.updatedTask,
      awardedCoins,
      nextCoinBalance: result.nextCoinBalance,
      streakReward: result.streakReward,
    } satisfies TaskPatchResponsePayload);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update task.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ taskId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { taskId } = await context.params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task id is required." },
        { status: 400 },
      );
    }

    const { user, task } = await getAuthorizedUserAndTask(
      taskId,
      session.user.email,
    );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
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
      { status: 500 },
    );
  }
}
