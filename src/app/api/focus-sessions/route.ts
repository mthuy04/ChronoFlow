import { randomUUID } from "crypto";
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

type UserCoinRow = {
  id: string;
  coinBalance: number | null;
};

type TaskOwnerRow = {
  id: string;
  name: string;
};

type CreatedFocusSessionRow = {
  id: string;
  taskId: string | null;
  durationMinutes: number;
  startedAt: Date;
  endedAt: Date | null;
  coinsEarned: number;
  createdAt: Date;
};

type BalanceRow = {
  coinBalance: number | null;
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

async function getCurrentCoinBalance(params: {
  tx: Prisma.TransactionClient;
  userId: string;
}) {
  const balanceRows = await params.tx.$queryRaw<BalanceRow[]>`
    SELECT COALESCE(coinBalance, 0) AS coinBalance
    FROM \`User\`
    WHERE id = ${params.userId}
    LIMIT 1
  `;

  return balanceRows[0]?.coinBalance ?? 0;
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
  await params.tx.$executeRaw`
    INSERT INTO \`CoinTransaction\`
      (
        id,
        userId,
        type,
        amount,
        balanceAfter,
        sourceType,
        sourceId,
        description,
        createdAt
      )
    VALUES
      (
        ${randomUUID()},
        ${params.userId},
        ${params.type},
        ${params.amount},
        ${params.balanceAfter},
        ${params.sourceType},
        ${params.sourceId},
        ${params.description},
        NOW()
      )
  `;
}

async function awardSevenDayStreakRewardIfEligible(params: {
  tx: Prisma.TransactionClient;
  userId: string;
  currentCoinBalance: number;
}): Promise<StreakRewardResult> {
  const tasks = await params.tx.$queryRaw<StreakActivityTaskRow[]>`
    SELECT
      id,
      scheduledDate,
      scheduledTime,
      completed,
      updatedAt
    FROM \`Task\`
    WHERE userId = ${params.userId}
      AND completed = 1
  `;

  const focusSessions = await params.tx.$queryRaw<StreakActivityFocusRow[]>`
    SELECT
      id,
      startedAt
    FROM \`FocusSession\`
    WHERE userId = ${params.userId}
      AND status = 'COMPLETED'
  `;

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

  const streakRewardId = randomUUID();

  const insertedRows = await params.tx.$executeRaw`
    INSERT IGNORE INTO \`StreakReward\`
      (id, userId, milestone, coinsEarned, awardedAt, createdAt, updatedAt)
    VALUES
      (
        ${streakRewardId},
        ${params.userId},
        ${STREAK_REWARD_MILESTONE},
        ${STREAK_REWARD_COINS},
        NOW(),
        NOW(),
        NOW()
      )
  `;

  if (insertedRows === 0) {
    return {
      awarded: false,
      milestone: STREAK_REWARD_MILESTONE,
      coinsEarned: 0,
      currentStreak,
      nextCoinBalance: params.currentCoinBalance,
    };
  }

  await params.tx.$executeRaw`
    UPDATE \`User\`
    SET
      coinBalance = COALESCE(coinBalance, 0) + ${STREAK_REWARD_COINS},
      updatedAt = NOW()
    WHERE id = ${params.userId}
  `;

  const nextCoinBalance = params.currentCoinBalance + STREAK_REWARD_COINS;

  await insertCoinTransaction({
    tx: params.tx,
    userId: params.userId,
    type: "STREAK_7_DAYS",
    amount: STREAK_REWARD_COINS,
    balanceAfter: nextCoinBalance,
    sourceType: "StreakReward",
    sourceId: streakRewardId,
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

    const body = (await req.json()) as CreateFocusSessionBody;

    const taskId = normalizeString(body.taskId);
    const durationMinutes = normalizeDuration(body.durationMinutes);
    const startedAt = normalizeDate(body.startedAt);
    const endedAt = normalizeDate(body.endedAt);

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

    const users = await prisma.$queryRaw<UserCoinRow[]>`
      SELECT id, COALESCE(coinBalance, 0) AS coinBalance
      FROM \`User\`
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const tasks = await prisma.$queryRaw<TaskOwnerRow[]>`
      SELECT id, name
      FROM \`Task\`
      WHERE id = ${taskId}
        AND userId = ${user.id}
      LIMIT 1
    `;

    const task = tasks[0];

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const focusSessionId = randomUUID();
    const awardedCoins = calculateFocusCoins(durationMinutes);

    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO \`FocusSession\`
          (
            id,
            userId,
            taskId,
            status,
            startedAt,
            endedAt,
            durationMinutes,
            coinsEarned,
            createdAt,
            updatedAt
          )
        VALUES
          (
            ${focusSessionId},
            ${user.id},
            ${task.id},
            'COMPLETED',
            ${startedAt},
            ${endedAt},
            ${durationMinutes},
            ${awardedCoins},
            NOW(),
            NOW()
          )
      `;

      await tx.$executeRaw`
        UPDATE \`Task\`
        SET
          focusMinutes = COALESCE(focusMinutes, 0) + ${durationMinutes},
          updatedAt = NOW()
        WHERE id = ${task.id}
          AND userId = ${user.id}
      `;

      let nextCoinBalance = user.coinBalance ?? 0;

      if (awardedCoins > 0) {
        await tx.$executeRaw`
          UPDATE \`User\`
          SET
            coinBalance = COALESCE(coinBalance, 0) + ${awardedCoins},
            updatedAt = NOW()
          WHERE id = ${user.id}
        `;

        nextCoinBalance += awardedCoins;

        await insertCoinTransaction({
          tx,
          userId: user.id,
          type: "FOCUS_SESSION",
          amount: awardedCoins,
          balanceAfter: nextCoinBalance,
          sourceType: "FocusSession",
          sourceId: focusSessionId,
          description: `Hoàn thành phiên focus ${durationMinutes} phút cho task: ${task.name}`,
        });
      }

      const streakReward = await awardSevenDayStreakRewardIfEligible({
        tx,
        userId: user.id,
        currentCoinBalance: nextCoinBalance,
      });

      const finalCoinBalance = await getCurrentCoinBalance({
        tx,
        userId: user.id,
      });

      return {
        streakReward,
        nextCoinBalance: finalCoinBalance,
      };
    });

    const createdRows = await prisma.$queryRaw<CreatedFocusSessionRow[]>`
      SELECT
        id,
        taskId,
        durationMinutes,
        startedAt,
        endedAt,
        coinsEarned,
        createdAt
      FROM \`FocusSession\`
      WHERE id = ${focusSessionId}
      LIMIT 1
    `;

    return NextResponse.json(
      {
        success: true,
        session: createdRows[0],
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