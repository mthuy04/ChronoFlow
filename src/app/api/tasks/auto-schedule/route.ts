import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Priority, TaskType } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type AutoScheduleTask = {
  id: string;
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  deadline: string | null;
  scheduledTime: string;
};

type ExistingEvent = {
  id: string;
  dateKey: string;
  start: string;
  end: string;
  type: TaskType;
};

type ScheduleCandidate = {
  task: AutoScheduleTask;
  dateKey: string;
  start: string;
  end: string;
  scheduledTime: string;
  warning: string | null;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function parseDurationMinutes(duration: string) {
  const numeric = Number(duration.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 60;
}

function timeToMinutes(time: string) {
  const [hourRaw = "0", minuteRaw = "0"] = time.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;

  return hour * 60 + minute;
}

function minutesToTime(totalMinutes: number) {
  const safe = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hour = Math.floor(safe / 60);
  const minute = safe % 60;

  return `${pad(hour)}:${pad(minute)}`;
}

function addMinutes(time: string, minutes: number) {
  return minutesToTime(timeToMinutes(time) + minutes);
}

function parseScheduledTime(task: AutoScheduleTask): ExistingEvent | null {
  const raw = String(task.scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const parts = raw.split("|");

  if (parts.length === 3) {
    return {
      id: task.id,
      dateKey: parts[0],
      start: parts[1],
      end: parts[2],
      type: task.type,
    };
  }

  return null;
}

function isHeavyTask(type: TaskType) {
  return type === "DEEP_WORK" || type === "STUDY" || type === "CREATIVE";
}

function getChronotypeSlots(chronotype: string) {
  if (chronotype === "LION") {
    return ["07:30", "09:00", "10:30", "13:30", "15:00"];
  }

  if (chronotype === "WOLF") {
    return ["10:00", "13:30", "15:00", "16:30", "19:00"];
  }

  if (chronotype === "DOLPHIN") {
    return ["10:00", "11:15", "14:30", "16:00", "17:15"];
  }

  return ["09:00", "10:30", "14:00", "15:30", "17:00"];
}

function getLightSlots() {
  return ["11:30", "13:30", "15:30", "16:30", "18:00"];
}

function buildScheduledTime(dateKey: string, start: string, end: string) {
  return `${dateKey}|${start}|${end}`;
}

function overlaps(
  candidateStart: string,
  candidateEnd: string,
  eventStart: string,
  eventEnd: string,
) {
  const startA = timeToMinutes(candidateStart);
  const endA = timeToMinutes(candidateEnd);
  const startB = timeToMinutes(eventStart);
  const endB = timeToMinutes(eventEnd);

  return startA < endB && endA > startB;
}

function hasConflict(candidate: ExistingEvent, events: ExistingEvent[]) {
  return events.some(
    (event) =>
      event.dateKey === candidate.dateKey &&
      overlaps(candidate.start, candidate.end, event.start, event.end),
  );
}

function getDeadlineDistance(deadline: string | null) {
  if (!deadline) return Number.POSITIVE_INFINITY;

  const today = new Date();
  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) return Number.POSITIVE_INFINITY;

  const diff = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function sortBacklogTasks(tasks: AutoScheduleTask[]) {
  const priorityWeight: Record<Priority, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2,
  };

  return [...tasks].sort((a, b) => {
    const priorityDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    return getDeadlineDistance(a.deadline) - getDeadlineDistance(b.deadline);
  });
}

function buildDeadlineWarning(task: AutoScheduleTask) {
  const distance = getDeadlineDistance(task.deadline);

  if (distance <= 0) return "Task đã tới hoặc quá deadline.";
  if (distance === 1) return "Task còn 1 ngày tới deadline.";
  if (distance <= 3) return `Task còn ${distance} ngày tới deadline.`;

  return null;
}

function findSlotForTask({
  task,
  chronotype,
  existingEvents,
}: {
  task: AutoScheduleTask;
  chronotype: string;
  existingEvents: ExistingEvent[];
}): ScheduleCandidate | null {
  const duration = parseDurationMinutes(task.duration);
  const buffer = isHeavyTask(task.type) ? 15 : 5;
  const slotStarts = isHeavyTask(task.type)
    ? getChronotypeSlots(chronotype)
    : getLightSlots();

  const deadlineDistance = getDeadlineDistance(task.deadline);
  const maxDays = Number.isFinite(deadlineDistance)
    ? Math.max(0, Math.min(6, deadlineDistance))
    : 6;

  for (let dayOffset = 0; dayOffset <= maxDays; dayOffset += 1) {
    const dateKey = formatDateKey(addDays(new Date(), dayOffset));

    for (const slotStart of slotStarts) {
      const start = slotStart;
      const end = addMinutes(start, duration);
      const endWithBuffer = addMinutes(end, buffer);

      const candidate: ExistingEvent = {
        id: task.id,
        dateKey,
        start,
        end: endWithBuffer,
        type: task.type,
      };

      if (!hasConflict(candidate, existingEvents)) {
        return {
          task,
          dateKey,
          start,
          end,
          scheduledTime: buildScheduledTime(dateKey, start, end),
          warning: buildDeadlineWarning(task),
        };
      }
    }
  }

  return null;
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        chronotypeResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { chronotype: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const chronotype = user.chronotypeResults[0]?.chronotype ?? "BEAR";

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        completed: false,
      },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        type: true,
        priority: true,
        duration: true,
        deadline: true,
        scheduledTime: true,
      },
    });

    const normalizedTasks: AutoScheduleTask[] = tasks.map((task) => ({
      ...task,
      deadline: task.deadline ?? null,
      scheduledTime: task.scheduledTime ?? "BACKLOG",
    }));

    const backlogTasks = normalizedTasks.filter((task) => {
      const raw = String(task.scheduledTime || "").trim();
      return !raw || raw.toUpperCase() === "BACKLOG";
    });

    const existingEvents = normalizedTasks
      .map((task) => parseScheduledTime(task))
      .filter((event): event is ExistingEvent => event !== null);

    if (backlogTasks.length === 0) {
      return NextResponse.json({
        success: true,
        updatedTasks: [],
        skippedTasks: [],
        message: "Không có task backlog cần tự sắp lịch.",
      });
    }

    const scheduledCandidates: ScheduleCandidate[] = [];
    const skippedTasks: Array<{ id: string; name: string; reason: string }> = [];
    const workingEvents = [...existingEvents];

    for (const task of sortBacklogTasks(backlogTasks)) {
      const candidate = findSlotForTask({
        task,
        chronotype,
        existingEvents: workingEvents,
      });

      if (!candidate) {
        skippedTasks.push({
          id: task.id,
          name: task.name,
          reason: "Không tìm được slot trống phù hợp trong tuần này.",
        });
        continue;
      }

      scheduledCandidates.push(candidate);
      workingEvents.push({
        id: task.id,
        dateKey: candidate.dateKey,
        start: candidate.start,
        end: isHeavyTask(task.type)
          ? addMinutes(candidate.end, 15)
          : addMinutes(candidate.end, 5),
        type: task.type,
      });
    }

    const updatedTasks = await prisma.$transaction(
      scheduledCandidates.map((candidate) =>
        prisma.task.update({
          where: { id: candidate.task.id },
          data: { scheduledTime: candidate.scheduledTime },
        }),
      ),
    );

    return NextResponse.json({
      success: true,
      updatedTasks,
      skippedTasks,
      warnings: scheduledCandidates
        .filter((candidate) => candidate.warning)
        .map((candidate) => ({
          taskId: candidate.task.id,
          taskName: candidate.task.name,
          warning: candidate.warning,
        })),
    });
  } catch (error) {
    console.error("AUTO SCHEDULE TASKS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to auto-schedule tasks.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}