import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma, Priority, TaskType } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type FinishFocusBody = {
  focusSessionId?: string;
  completeTask?: boolean;
};

type UserCoinRow = {
  id: string;
  coinBalance: number | null;
};

type FocusSessionRow = {
  id: string;
  userId: string;
  taskId: string | null;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  startedAt: Date;
};

type FocusLinkedTaskRow = {
  id: string;
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  completed: number | boolean;
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

type BalanceRow = {
  coinBalance: number | null;
};

type StreakRewardResult = {
  awarded: boolean;
  milestone: number;
  coinsEarned: number;
  currentStreak: number;
  nextCoinBalance: number;
};

type FinishFocusResponse = {
  durationMinutes: number;
  coinsEarned: number;
  taskCoinsEarned: number;
  nextCoinBalance: number;
  streakReward: StreakRewardResult | null;
};

const STREAK_REWARD_MILESTONE = 7;
const STREAK_REWARD_COINS = 70;

function calculateFocusCoins(durationMinutes: number) {
  if (durationMinutes < 5) return 0;

  const base = 5;
  const focusBonus = Math.floor(durationMinutes / 25) * 5;

  return Math.min(80, base + focusBonus);
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập." },
        { status: 401 },
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
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    const body = (await request.json()) as FinishFocusBody;
    const focusSessionId = String(body.focusSessionId || "");

    if (!focusSessionId) {
      return NextResponse.json(
        { message: "Thiếu focusSessionId." },
        { status: 400 },
      );
    }

    const rows = await prisma.$queryRaw<FocusSessionRow[]>`
      SELECT id, userId, taskId, status, startedAt
      FROM \`FocusSession\`
      WHERE id = ${focusSessionId}
        AND userId = ${user.id}
        AND status = 'ACTIVE'
      LIMIT 1
    `;

    const focusSession = rows[0];

    if (!focusSession) {
      return NextResponse.json(
        { message: "Không tìm thấy phiên focus đang chạy." },
        { status: 404 },
      );
    }

    const endedAt = new Date();
    const diffMs = endedAt.getTime() - focusSession.startedAt.getTime();
    const durationMinutes = Math.max(1, Math.round(diffMs / 60000));
    const focusCoinsEarned = calculateFocusCoins(durationMinutes);
    const completeTaskValue = body.completeTask ?? true;

    const result = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        UPDATE \`FocusSession\`
        SET
          status = 'COMPLETED',
          endedAt = ${endedAt},
          durationMinutes = ${durationMinutes},
          coinsEarned = ${focusCoinsEarned},
          updatedAt = NOW()
        WHERE id = ${focusSession.id}
      `;

      let nextCoinBalance = user.coinBalance ?? 0;

      if (focusCoinsEarned > 0) {
        await tx.$executeRaw`
          UPDATE \`User\`
          SET
            coinBalance = COALESCE(coinBalance, 0) + ${focusCoinsEarned},
            updatedAt = NOW()
          WHERE id = ${user.id}
        `;

        nextCoinBalance += focusCoinsEarned;

        await insertCoinTransaction({
          tx,
          userId: user.id,
          type: "FOCUS_SESSION",
          amount: focusCoinsEarned,
          balanceAfter: nextCoinBalance,
          sourceType: "FocusSession",
          sourceId: focusSession.id,
          description: `Hoàn thành phiên focus ${durationMinutes} phút.`,
        });
      }

      let taskCoinsEarned = 0;

      if (focusSession.taskId) {
        const linkedTasks = await tx.$queryRaw<FocusLinkedTaskRow[]>`
          SELECT
            id,
            name,
            type,
            priority,
            duration,
            completed
          FROM \`Task\`
          WHERE id = ${focusSession.taskId}
            AND userId = ${user.id}
          LIMIT 1
        `;

        const linkedTask = linkedTasks[0];

        if (completeTaskValue) {
          await tx.$executeRaw`
            UPDATE \`Task\`
            SET
              focusMinutes = COALESCE(focusMinutes, 0) + ${durationMinutes},
              completed = 1,
              updatedAt = NOW()
            WHERE id = ${focusSession.taskId}
              AND userId = ${user.id}
          `;

          const shouldAwardTaskCoins =
            linkedTask && Boolean(linkedTask.completed) === false;

          if (shouldAwardTaskCoins) {
            taskCoinsEarned = calculateTaskCoins(linkedTask);

            if (taskCoinsEarned > 0) {
              await tx.$executeRaw`
                UPDATE \`User\`
                SET
                  coinBalance = COALESCE(coinBalance, 0) + ${taskCoinsEarned},
                  updatedAt = NOW()
                WHERE id = ${user.id}
              `;

              nextCoinBalance += taskCoinsEarned;

              await insertCoinTransaction({
                tx,
                userId: user.id,
                type: "TASK_COMPLETED",
                amount: taskCoinsEarned,
                balanceAfter: nextCoinBalance,
                sourceType: "Task",
                sourceId: linkedTask.id,
                description: `Hoàn thành task: ${linkedTask.name}`,
              });
            }
          }
        } else {
          await tx.$executeRaw`
            UPDATE \`Task\`
            SET
              focusMinutes = COALESCE(focusMinutes, 0) + ${durationMinutes},
              updatedAt = NOW()
            WHERE id = ${focusSession.taskId}
              AND userId = ${user.id}
          `;
        }
      }

      const streakReward = await awardSevenDayStreakRewardIfEligible({
        tx,
        userId: user.id,
        currentCoinBalance: nextCoinBalance,
      });

      nextCoinBalance = streakReward.nextCoinBalance;

      const finalCoinBalance = await getCurrentCoinBalance({
        tx,
        userId: user.id,
      });

      return {
        taskCoinsEarned,
        nextCoinBalance: finalCoinBalance,
        streakReward,
      };
    });

    return NextResponse.json({
      durationMinutes,
      coinsEarned: focusCoinsEarned,
      taskCoinsEarned: result.taskCoinsEarned,
      nextCoinBalance: result.nextCoinBalance,
      streakReward: result.streakReward,
    } satisfies FinishFocusResponse);
  } catch (error) {
    console.error("Finish focus error:", error);

    return NextResponse.json(
      {
        message: "Không thể kết thúc focus session.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}