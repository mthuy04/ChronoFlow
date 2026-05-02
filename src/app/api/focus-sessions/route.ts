import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateFocusSessionBody = {
  taskId?: string | null;
  durationMinutes?: number;
  startedAt?: string;
  endedAt?: string;
};

type FocusStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

type StreakActivityTask = {
  id: string;
  scheduledDate: string | null;
  scheduledTime: string;
  completed: boolean;
  updatedAt: Date;
};

type StreakActivityFocus = {
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

const STREAK_REWARD_MILESTONE = 7;
const STREAK_REWARD_COINS = 70;

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDuration(value: unknown): number | null {
  if (typeof value !== "number") return null;
  if (!Number.isFinite(value)) return null;

  const rounded = Math.round(value);
  return rounded > 0 ? rounded : null;
}

function normalizeDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateFocusCoins(durationMinutes: number) {
  if (durationMinutes < 1) return 0;

  const base = 5;
  const focusBlockBonus = Math.floor(durationMinutes / 25) * 5;
  const longSessionBonus = durationMinutes >= 50 ? 10 : 0;

  return Math.min(80, base + focusBlockBonus + longSessionBonus);
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

function getTaskDateKey(task: StreakActivityTask) {
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
  tasks: StreakActivityTask[];
  focusSessions: StreakActivityFocus[];
}) {
  const activeDateKeys = new Set<string>();

  params.tasks.forEach((task) => {
    if (task.completed) {
      activeDateKeys.add(getTaskDateKey(task));
    }
  });

  params.focusSessions.forEach((sessionItem) => {
    activeDateKeys.add(toVietnamDateKey(sessionItem.startedAt));
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

  const nextCoinBalance = updatedUser.coinBalance ?? params.currentCoinBalance;

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as
      | CreateFocusSessionBody
      | null;

    const taskId = normalizeString(body?.taskId);
    const durationMinutes = normalizeDuration(body?.durationMinutes);
    const startedAt = normalizeDate(body?.startedAt);
    const endedAt = normalizeDate(body?.endedAt);

    if (!taskId) {
      return NextResponse.json(
        { error: "Task id is required." },
        { status: 400 },
      );
    }

    if (!durationMinutes) {
      return NextResponse.json(
        { error: "Duration minutes must be a positive number." },
        { status: 400 },
      );
    }

    if (!startedAt || !endedAt) {
      return NextResponse.json(
        { error: "Started time and ended time are required." },
        { status: 400 },
      );
    }

    if (endedAt.getTime() < startedAt.getTime()) {
      return NextResponse.json(
        { error: "Ended time must be after started time." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        coinBalance: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const awardedCoins = calculateFocusCoins(durationMinutes);

    const result = await prisma.$transaction(async (tx) => {
      const focusSession = await tx.focusSession.create({
        data: {
          userId: user.id,
          taskId: task.id,
          status: "COMPLETED" satisfies FocusStatus,
          startedAt,
          endedAt,
          durationMinutes,
          coinsEarned: awardedCoins,
        },
        select: {
          id: true,
          taskId: true,
          durationMinutes: true,
          startedAt: true,
          endedAt: true,
          coinsEarned: true,
          createdAt: true,
        },
      });

      await tx.task.update({
        where: {
          id: task.id,
        },
        data: {
          focusMinutes: {
            increment: durationMinutes,
          },
        },
      });

      let nextCoinBalance = user.coinBalance ?? 0;

      if (awardedCoins > 0) {
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
          type: "FOCUS_SESSION",
          amount: awardedCoins,
          balanceAfter: nextCoinBalance,
          sourceType: "FocusSession",
          sourceId: focusSession.id,
          description: `Hoàn thành phiên focus ${durationMinutes} phút cho task: ${task.name}`,
        });
      }

      const streakReward = await awardSevenDayStreakRewardIfEligible({
        tx,
        userId: user.id,
        currentCoinBalance: nextCoinBalance,
      });

      const finalUser = await tx.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          coinBalance: true,
        },
      });

      return {
        focusSession,
        streakReward,
        nextCoinBalance: finalUser?.coinBalance ?? nextCoinBalance,
      };
    });

    return NextResponse.json(
      {
        success: true,
        session: result.focusSession,
        awardedCoins,
        nextCoinBalance: result.nextCoinBalance,
        streakReward: result.streakReward,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE FOCUS SESSION ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create focus session.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}