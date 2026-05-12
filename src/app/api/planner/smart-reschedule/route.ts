import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Priority, TaskType } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { forbiddenPlanResponse, hasFeatureAccess } from "@/lib/plan-access";
import { prisma } from "@/lib/prisma";

type PlannerChronotype = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

type PlannerTaskDto = {
  id: string;
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  deadline: string | null;
  scheduledTime: string;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  focusMode: string | null;
  focusMinutes: number | null;
  isBacklog: boolean;
  orderIndex: number;
  explanation: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type SmartSuggestionDto = {
  id: string;
  title: string;
  description: string;
  task: PlannerTaskDto;
  suggestedStart: string;
  suggestedEnd: string;
  dateKey: string;
  confidence: number;
  tone: "purple" | "blue" | "orange" | "green";
};

type ParsedSchedule = {
  dateKey: string;
  start: string;
  end: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function normalizeChronotype(value?: string | null): PlannerChronotype {
  if (
    value === "LION" ||
    value === "BEAR" ||
    value === "WOLF" ||
    value === "DOLPHIN"
  ) {
    return value;
  }

  return "BEAR";
}

function parseMinutesFromDuration(duration: string) {
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
  const safeTotal = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hour = Math.floor(safeTotal / 60);
  const minute = safeTotal % 60;

  return `${pad(hour)}:${pad(minute)}`;
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

function getChronotypeWindows(chronotype: PlannerChronotype) {
  switch (chronotype) {
    case "LION":
      return {
        peakStart: "07:00",
        peakEnd: "10:00",
        supportStart: "13:00",
        supportEnd: "16:00",
      };
    case "WOLF":
      return {
        peakStart: "14:30",
        peakEnd: "18:00",
        supportStart: "19:00",
        supportEnd: "21:00",
      };
    case "DOLPHIN":
      return {
        peakStart: "10:00",
        peakEnd: "11:30",
        supportStart: "16:00",
        supportEnd: "18:00",
      };
    case "BEAR":
    default:
      return {
        peakStart: "09:00",
        peakEnd: "12:00",
        supportStart: "14:00",
        supportEnd: "16:00",
      };
  }
}

function isFocusType(type: TaskType) {
  return type === "DEEP_WORK" || type === "STUDY";
}

function isLightType(type: TaskType) {
  return type === "ADMIN" || type === "ROUTINE" || type === "PERSONAL";
}

function isTimeInsideWindow(time: string, start: string, end: string) {
  const valueMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  return valueMinutes >= startMinutes && valueMinutes < endMinutes;
}

function parseTaskSchedule(task: PlannerTaskDto): ParsedSchedule | null {
  if (task.isBacklog) return null;

  if (task.scheduledDate && task.startTime && task.endTime) {
    return {
      dateKey: task.scheduledDate,
      start: task.startTime,
      end: task.endTime,
    };
  }

  const raw = String(task.scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");

  if (pipeParts.length === 3) {
    const [dateKey, start, end] = pipeParts;

    if (!dateKey || !start || !end) return null;

    return { dateKey, start, end };
  }

  const match = raw.match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/,
  );

  if (match) {
    return {
      dateKey: match[1],
      start: match[2],
      end: match[3],
    };
  }

  return null;
}

function getDeadlineStatus(deadline: string | null) {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return { daysLeft };
}

function buildSuggestionId(taskId: string, dateKey: string, start: string) {
  return `${taskId}-${dateKey}-${start}`.replace(/[^a-zA-Z0-9-_]/g, "-");
}

function buildSuggestion({
  task,
  title,
  description,
  dateKey,
  suggestedStart,
  tone,
  confidence,
}: {
  task: PlannerTaskDto;
  title: string;
  description: string;
  dateKey: string;
  suggestedStart: string;
  tone: SmartSuggestionDto["tone"];
  confidence: number;
}): SmartSuggestionDto {
  const suggestedEnd = addMinutesToTime(
    suggestedStart,
    parseMinutesFromDuration(task.duration),
  );

  return {
    id: buildSuggestionId(task.id, dateKey, suggestedStart),
    title,
    description,
    task,
    suggestedStart,
    suggestedEnd,
    dateKey,
    confidence,
    tone,
  };
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Bạn cần đăng nhập để xem Smart Reschedule.",
        },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const dateKey = url.searchParams.get("dateKey") || formatDateKey(new Date());

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        chronotype: true,
        planTier: true,
        planExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "USER_NOT_FOUND",
          message: "Không tìm thấy tài khoản.",
        },
        { status: 404 },
      );
    }

    if (!hasFeatureAccess(user, "SMART_RESCHEDULE")) {
      return forbiddenPlanResponse("SMART_RESCHEDULE");
    }

    const chronotype = normalizeChronotype(user.chronotype);
    const windows = getChronotypeWindows(chronotype);

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        {
          completed: "asc",
        },
        {
          priority: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        name: true,
        type: true,
        priority: true,
        duration: true,
        deadline: true,
        scheduledTime: true,
        scheduledDate: true,
        startTime: true,
        endTime: true,
        focusMode: true,
        focusMinutes: true,
        isBacklog: true,
        orderIndex: true,
        explanation: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const suggestions: SmartSuggestionDto[] = [];

    const activeTasks = tasks.filter((task) => !task.completed);

    activeTasks.forEach((task) => {
      const parsed = parseTaskSchedule(task);

      if (
        parsed &&
        isFocusType(task.type) &&
        !isTimeInsideWindow(parsed.start, windows.peakStart, windows.peakEnd)
      ) {
        suggestions.push(
          buildSuggestion({
            task,
            title: `Dời “${task.name}” vào peak window`,
            description:
              "Task tập trung đang nằm ngoài khung năng lượng mạnh. Đưa task về peak window giúp giảm hao năng lượng và tăng khả năng hoàn thành.",
            dateKey: parsed.dateKey,
            suggestedStart: windows.peakStart,
            tone: "purple",
            confidence: 90,
          }),
        );
      }
    });

    activeTasks
      .filter((task) => task.isBacklog && isFocusType(task.type))
      .slice(0, 4)
      .forEach((task) => {
        suggestions.push(
          buildSuggestion({
            task,
            title: `Gắn lịch cho “${task.name}”`,
            description:
              "Task quan trọng vẫn đang ở backlog. Hãy đưa vào calendar để tránh bị trôi việc.",
            dateKey,
            suggestedStart: windows.peakStart,
            tone: "blue",
            confidence: 84,
          }),
        );
      });

    activeTasks.forEach((task) => {
      const parsed = parseTaskSchedule(task);

      if (
        parsed &&
        isLightType(task.type) &&
        isTimeInsideWindow(parsed.start, windows.peakStart, windows.peakEnd)
      ) {
        suggestions.push(
          buildSuggestion({
            task,
            title: `Chuyển “${task.name}” sang khung phụ`,
            description:
              "Việc nhẹ đang chiếm peak window. Nên chuyển sang khung phụ để giữ giờ mạnh cho deep work hoặc học tập.",
            dateKey: parsed.dateKey,
            suggestedStart: windows.supportStart,
            tone: "orange",
            confidence: 78,
          }),
        );
      }
    });

    activeTasks
      .filter((task) => task.isBacklog)
      .forEach((task) => {
        const deadline = getDeadlineStatus(task.deadline);

        if (!deadline || deadline.daysLeft > 3) return;

        suggestions.push(
          buildSuggestion({
            task,
            title: `Đưa “${task.name}” ra khỏi backlog trước deadline`,
            description:
              deadline.daysLeft <= 0
                ? "Task đã tới hoặc quá deadline nhưng vẫn chưa được gắn lịch."
                : `Task còn ${deadline.daysLeft} ngày tới deadline nhưng vẫn chưa được gắn lịch.`,
            dateKey,
            suggestedStart: isFocusType(task.type)
              ? windows.peakStart
              : windows.supportStart,
            tone: deadline.daysLeft <= 1 ? "orange" : "green",
            confidence: deadline.daysLeft <= 1 ? 92 : 80,
          }),
        );
      });

    const uniqueSuggestions = Array.from(
      new Map(suggestions.map((item) => [item.id, item])).values(),
    )
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      suggestions: uniqueSuggestions,
    });
  } catch (error) {
    console.error("SMART RESCHEDULE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "SMART_RESCHEDULE_FAILED",
        message: "Không tải được gợi ý Smart Reschedule.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}