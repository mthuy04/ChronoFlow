import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Priority, TaskType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PlannerChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN" | "UNKNOWN";

type PlannerTaskDto = {
  id: string;
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  durationMinutes: number;
  deadline: string | null;
  scheduledTime: string;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  explanation: string;
  completed: boolean;
  isBacklog: boolean;
  createdAt: string;
  updatedAt: string;
};

type PlannerResponse = {
  success: true;
  user: {
    id: string;
    name: string;
    email: string;
  };
  chronotype: {
    key: PlannerChronotypeKey;
    label: string | null;
    focusWindow: string | null;
    secondaryWindow: string | null;
    guidance: string;
  };
  tasks: PlannerTaskDto[];
};

function parseDurationToMinutes(duration: string): number {
  const numeric = Number(duration.replace(/[^\d]/g, ""));

  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }

  return 0;
}

function normalizeChronotype(
  rawValue: string | null | undefined,
): PlannerChronotypeKey {
  const value = typeof rawValue === "string" ? rawValue.trim().toUpperCase() : "";

  if (value === "LION") return "LION";
  if (value === "BEAR") return "BEAR";
  if (value === "WOLF") return "WOLF";
  if (value === "DOLPHIN") return "DOLPHIN";

  return "UNKNOWN";
}

function getChronotypeMeta(key: PlannerChronotypeKey) {
  if (key === "LION") {
    return {
      label: "Sư tử",
      focusWindow: "07:30 - 10:00",
      secondaryWindow: "13:30 - 15:00",
      guidance:
        "Ưu tiên việc khó vào buổi sáng, giữ đầu chiều cho việc vừa và nhẹ.",
    };
  }

  if (key === "BEAR") {
    return {
      label: "Gấu",
      focusWindow: "09:00 - 11:30",
      secondaryWindow: "14:00 - 16:00",
      guidance:
        "Lịch ổn định nhất khi bạn gom task quan trọng vào cuối sáng và đầu chiều.",
    };
  }

  if (key === "WOLF") {
    return {
      label: "Sói",
      focusWindow: "14:30 - 17:30",
      secondaryWindow: "19:00 - 21:00",
      guidance: "Giữ buổi sáng nhẹ hơn, để deep work vào nửa sau của ngày.",
    };
  }

  if (key === "DOLPHIN") {
    return {
      label: "Cá heo",
      focusWindow: "10:00 - 11:30",
      secondaryWindow: "16:00 - 18:00",
      guidance:
        "Ưu tiên block gọn, ít nhiễu và có khoảng đệm rõ ràng để tránh quá tải.",
    };
  }

  return {
    label: null,
    focusWindow: null,
    secondaryWindow: null,
    guidance:
      "Bạn chưa có chronotype rõ ràng. Planner vẫn hiển thị task thật, nhưng chưa thể tối ưu sâu theo nhịp sinh học.",
  };
}

function extractSchedule(rawValue: string) {
  const value = rawValue.trim();

  if (!value || value.toUpperCase() === "BACKLOG") {
    return {
      isBacklog: true,
      scheduledDate: null,
      startTime: null,
      endTime: null,
    };
  }

  const pipeParts = value.split("|");

  if (pipeParts.length === 3) {
    return {
      isBacklog: false,
      scheduledDate: pipeParts[0] || null,
      startTime: pipeParts[1] || null,
      endTime: pipeParts[2] || null,
    };
  }

  const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
  const timeMatches = value.match(/\b\d{2}:\d{2}\b/g);

  return {
    isBacklog: false,
    scheduledDate: dateMatch?.[1] ?? null,
    startTime: timeMatches?.[0] ?? null,
    endTime: timeMatches?.[1] ?? null,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const [taskRows, chronotypeRow] = await Promise.all([
      prisma.task.findMany({
        where: { userId: user.id },
        orderBy: [{ completed: "asc" }, { updatedAt: "desc" }],
      }),
      prisma.chronotypeResult.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const chronotypeKey = normalizeChronotype(chronotypeRow?.chronotype);
    const meta = getChronotypeMeta(chronotypeKey);

    const tasks: PlannerTaskDto[] = taskRows.map((task) => {
      const schedule = extractSchedule(task.scheduledTime);

      return {
        id: task.id,
        name: task.name,
        type: task.type,
        priority: task.priority,
        duration: task.duration,
        durationMinutes: parseDurationToMinutes(task.duration),
        deadline: task.deadline,
        scheduledTime: task.scheduledTime,
        scheduledDate: schedule.scheduledDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        explanation: task.explanation ?? "",
        completed: task.completed,
        isBacklog: schedule.isBacklog,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      };
    });

    const response: PlannerResponse = {
      success: true,
      user: {
        id: user.id,
        name: user.name ?? "Bạn",
        email: user.email ?? session.user.email,
      },
      chronotype: {
        key: chronotypeKey,
        label: meta.label,
        focusWindow: meta.focusWindow,
        secondaryWindow: meta.secondaryWindow,
        guidance: meta.guidance,
      },
      tasks,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET PLANNER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load planner data.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}