import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

type TaskRow = {
  id: string;
  name: string;
  type: string;
  priority: string;
  duration: string;
  deadline: string | null;
  scheduledTime: string | null;
  explanation: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type FocusSessionRow = {
  id: string;
  taskId: string | null;
  durationMinutes: number;
  startedAt: Date;
  endedAt: Date | null;
  createdAt: Date;
};

type EnergyCheckinRow = {
  id: string;
  score: number;
  note: string | null;
  source: string;
  createdAt: Date;
};

type DailyInsightPoint = {
  dateKey: string;
  label: string;
  focusMinutes: number;
  completedTasks: number;
  plannedMinutes: number;
  energyScore: number | null;
  taskCount: number;
  loadLevel: "empty" | "light" | "balanced" | "heavy";
};

type TaskTypePoint = {
  type: string;
  label: string;
  count: number;
  completed: number;
  percentage: number;
};

type Recommendation = {
  title: string;
  description: string;
  tone: "purple" | "blue" | "orange" | "green" | "red";
};

type RuleInsight = {
  title: string;
  description: string;
  metric: string;
  tone: "purple" | "blue" | "orange" | "green" | "red";
};

type DeadlineRisk = {
  taskId: string;
  taskName: string;
  priority: string;
  deadline: string;
  daysLeft: number;
  status: "overdue" | "today" | "soon" | "upcoming";
  reason: string;
};

type ActionableInsight = {
  id: string;
  taskId: string;
  taskName: string;
  title: string;
  description: string;
  currentSchedule: string;
  suggestedSchedule: string;
  tone: "purple" | "blue" | "orange" | "green" | "red";
};

type PatternInsight = {
  title: string;
  description: string;
  evidence: string;
  tone: "purple" | "blue" | "orange" | "green" | "red";
};

type TrendPoint = {
  dateKey: string;
  label: string;
  value: number;
};

type PeakComparison = {
  peakMinutes: number;
  offPeakMinutes: number;
  peakTasks: number;
  offPeakTasks: number;
};

type PlannerScoreBreakdown = {
  alignment: number;
  completion: number;
  overload: number;
  consistency: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function getDateLabel(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function getWeekDates() {
  const today = startOfDay(new Date());
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(today, mondayOffset);

  return Array.from({ length: 7 }).map((_, index) => addDays(monday, index));
}

function getLastNDates(days: number) {
  const today = startOfDay(new Date());

  return Array.from({ length: days }).map((_, index) =>
    addDays(today, index - days + 1),
  );
}

function normalizeChronotype(value: string | null | undefined): ChronotypeKey {
  const key = String(value || "").toUpperCase();

  if (key.includes("LION")) return "LION";
  if (key.includes("WOLF")) return "WOLF";
  if (key.includes("DOLPHIN")) return "DOLPHIN";

  return "BEAR";
}

function getChronotypeLabel(chronotype: ChronotypeKey) {
  if (chronotype === "LION") return "Sư tử";
  if (chronotype === "WOLF") return "Sói";
  if (chronotype === "DOLPHIN") return "Cá heo";

  return "Gấu";
}

function getPeakWindow(chronotype: ChronotypeKey) {
  if (chronotype === "LION") {
    return { start: "07:00", end: "10:00", label: "07:00 - 10:00" };
  }

  if (chronotype === "WOLF") {
    return { start: "14:30", end: "18:00", label: "14:30 - 18:00" };
  }

  if (chronotype === "DOLPHIN") {
    return { start: "10:00", end: "11:30", label: "10:00 - 11:30" };
  }

  return { start: "09:00", end: "12:00", label: "09:00 - 12:00" };
}

function getPrimaryStart(chronotype: ChronotypeKey) {
  if (chronotype === "LION") return "07:30";
  if (chronotype === "WOLF") return "15:00";
  if (chronotype === "DOLPHIN") return "10:00";

  return "09:00";
}

function parseMinutes(duration: string) {
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

function isInsideWindow(time: string | null, start: string, end: string) {
  if (!time) return false;

  const value = timeToMinutes(time);

  return value >= timeToMinutes(start) && value < timeToMinutes(end);
}

function parseScheduledTime(task: TaskRow) {
  const raw = String(task.scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");

  if (pipeParts.length === 3) {
    return {
      dateKey: pipeParts[0],
      start: pipeParts[1],
      end: pipeParts[2],
    };
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

function isDeepTask(type: string) {
  return type === "DEEP_WORK" || type === "STUDY";
}

function isHeavyTask(type: string) {
  return type === "DEEP_WORK" || type === "STUDY" || type === "CREATIVE";
}

function getTaskTypeLabel(type: string) {
  const labels: Record<string, string> = {
    DEEP_WORK: "Deep work",
    STUDY: "Học tập",
    CREATIVE: "Sáng tạo",
    ADMIN: "Admin",
    ROUTINE: "Routine",
    PERSONAL: "Cá nhân",
  };

  return labels[type] ?? type;
}

function getLoadLevel(
  plannedMinutes: number,
  taskCount: number,
): DailyInsightPoint["loadLevel"] {
  if (plannedMinutes === 0 && taskCount === 0) return "empty";
  if (plannedMinutes >= 420 || taskCount >= 6) return "heavy";
  if (plannedMinutes >= 240 || taskCount >= 4) return "balanced";

  return "light";
}

function calculateCheckinStreak(checkins: EnergyCheckinRow[]) {
  const keys = new Set(checkins.map((item) => formatDateKey(item.createdAt)));
  let streak = 0;
  let cursor = startOfDay(new Date());

  while (keys.has(formatDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function buildDailySeries({
  tasks,
  focusSessions,
  energyCheckins,
}: {
  tasks: TaskRow[];
  focusSessions: FocusSessionRow[];
  energyCheckins: EnergyCheckinRow[];
}) {
  return getWeekDates().map((date) => {
    const dateKey = formatDateKey(date);
    const label = getDateLabel(date);

    const dayTasks = tasks.filter((task) => {
      const parsed = parseScheduledTime(task);
      return parsed?.dateKey === dateKey || formatDateKey(task.createdAt) === dateKey;
    });

    const scheduledTasks = tasks.filter((task) => {
      const parsed = parseScheduledTime(task);
      return parsed?.dateKey === dateKey;
    });

    const dayFocusSessions = focusSessions.filter(
      (session) => formatDateKey(session.startedAt) === dateKey,
    );

    const dayCheckins = energyCheckins.filter(
      (checkin) => formatDateKey(checkin.createdAt) === dateKey,
    );

    const focusMinutes = dayFocusSessions.reduce(
      (sum, session) => sum + session.durationMinutes,
      0,
    );

    const plannedMinutes = scheduledTasks.reduce(
      (sum, task) => sum + parseMinutes(task.duration),
      0,
    );

    const energyScore =
      dayCheckins.length > 0
        ? Math.round(
            dayCheckins.reduce((sum, checkin) => sum + checkin.score, 0) /
              dayCheckins.length,
          )
        : null;

    return {
      dateKey,
      label,
      focusMinutes,
      plannedMinutes,
      energyScore,
      taskCount: scheduledTasks.length,
      completedTasks: dayTasks.filter((task) => task.completed).length,
      loadLevel: getLoadLevel(plannedMinutes, scheduledTasks.length),
    };
  });
}

function buildTaskTypeBreakdown(tasks: TaskRow[]) {
  const map = new Map<string, { count: number; completed: number }>();

  tasks.forEach((task) => {
    const current = map.get(task.type) ?? { count: 0, completed: 0 };

    map.set(task.type, {
      count: current.count + 1,
      completed: current.completed + (task.completed ? 1 : 0),
    });
  });

  return Array.from(map.entries())
    .map(([type, value]): TaskTypePoint => ({
      type,
      label: getTaskTypeLabel(type),
      count: value.count,
      completed: value.completed,
      percentage: tasks.length > 0 ? Math.round((value.count / tasks.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildTrendSeries({
  tasks,
  focusSessions,
  energyCheckins,
  chronotype,
}: {
  tasks: TaskRow[];
  focusSessions: FocusSessionRow[];
  energyCheckins: EnergyCheckinRow[];
  chronotype: ChronotypeKey;
}) {
  const dates = getLastNDates(14);
  const peakWindow = getPeakWindow(chronotype);

  const focusTrend: TrendPoint[] = [];
  const completionTrend: TrendPoint[] = [];
  const alignmentTrend: TrendPoint[] = [];

  dates.forEach((date) => {
    const dateKey = formatDateKey(date);
    const label = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);

    const dayFocus = focusSessions
      .filter((session) => formatDateKey(session.startedAt) === dateKey)
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    const dayTasks = tasks.filter((task) => {
      const parsed = parseScheduledTime(task);
      return parsed?.dateKey === dateKey || formatDateKey(task.createdAt) === dateKey;
    });

    const completed = dayTasks.filter((task) => task.completed).length;
    const completionRate =
      dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0;

    const scheduledDeepTasks = tasks.filter((task) => {
      const parsed = parseScheduledTime(task);
      return isDeepTask(task.type) && parsed?.dateKey === dateKey;
    });

    const alignedDeepTasks = scheduledDeepTasks.filter((task) => {
      const parsed = parseScheduledTime(task);
      return isInsideWindow(parsed?.start ?? null, peakWindow.start, peakWindow.end);
    });

    const alignmentRate =
      scheduledDeepTasks.length > 0
        ? Math.round((alignedDeepTasks.length / scheduledDeepTasks.length) * 100)
        : 0;

    focusTrend.push({ dateKey, label, value: dayFocus });
    completionTrend.push({ dateKey, label, value: completionRate });
    alignmentTrend.push({ dateKey, label, value: alignmentRate });
  });

  const energyFocusCorrelation = dates.map((date) => {
    const dateKey = formatDateKey(date);
    const label = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);

    const dayFocus = focusSessions
      .filter((session) => formatDateKey(session.startedAt) === dateKey)
      .reduce((sum, session) => sum + session.durationMinutes, 0);

    const dayCheckins = energyCheckins.filter(
      (checkin) => formatDateKey(checkin.createdAt) === dateKey,
    );

    const energyScore =
      dayCheckins.length > 0
        ? Math.round(
            dayCheckins.reduce((sum, checkin) => sum + checkin.score, 0) /
              dayCheckins.length,
          )
        : null;

    return {
      dateKey,
      label,
      energyScore,
      focusMinutes: dayFocus,
    };
  });

  return {
    focusTrend,
    completionTrend,
    alignmentTrend,
    energyFocusCorrelation,
  };
}

function buildPeakComparison({
  tasks,
  chronotype,
}: {
  tasks: TaskRow[];
  chronotype: ChronotypeKey;
}): PeakComparison {
  const peakWindow = getPeakWindow(chronotype);

  const scheduledDeepTasks = tasks.filter(
    (task) => isDeepTask(task.type) && parseScheduledTime(task),
  );

  const peakTasks = scheduledDeepTasks.filter((task) => {
    const parsed = parseScheduledTime(task);
    return isInsideWindow(parsed?.start ?? null, peakWindow.start, peakWindow.end);
  });

  const offPeakTasks = scheduledDeepTasks.filter((task) => {
    const parsed = parseScheduledTime(task);
    return !isInsideWindow(parsed?.start ?? null, peakWindow.start, peakWindow.end);
  });

  return {
    peakTasks: peakTasks.length,
    offPeakTasks: offPeakTasks.length,
    peakMinutes: peakTasks.reduce((sum, task) => sum + parseMinutes(task.duration), 0),
    offPeakMinutes: offPeakTasks.reduce(
      (sum, task) => sum + parseMinutes(task.duration),
      0,
    ),
  };
}

function getDaysLeft(deadline: string) {
  const today = startOfDay(new Date());
  const date = startOfDay(new Date(deadline));

  if (Number.isNaN(date.getTime())) return null;

  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function buildDeadlineRisks(tasks: TaskRow[]): DeadlineRisk[] {
  return tasks
    .filter((task) => !task.completed && task.deadline)
    .map((task) => {
      const daysLeft = getDaysLeft(task.deadline ?? "");

      if (daysLeft === null) return null;

      const parsed = parseScheduledTime(task);
      const isScheduled = Boolean(parsed);

      let status: DeadlineRisk["status"] = "upcoming";
      let reason = "Task có deadline sắp tới.";

      if (daysLeft < 0) {
        status = "overdue";
        reason = "Task đã quá deadline nhưng chưa hoàn thành.";
      } else if (daysLeft === 0) {
        status = "today";
        reason = "Task tới deadline hôm nay.";
      } else if (daysLeft <= 3) {
        status = "soon";
        reason = isScheduled
          ? "Task sắp tới deadline, cần ưu tiên hoàn thành."
          : "Task sắp tới deadline nhưng chưa được gắn lịch.";
      } else if (!isScheduled && task.priority === "HIGH") {
        reason = "Task ưu tiên cao có deadline nhưng chưa được gắn lịch.";
      }

      if (daysLeft > 7 && isScheduled) return null;

      return {
        taskId: task.id,
        taskName: task.name,
        priority: task.priority,
        deadline: task.deadline ?? "",
        daysLeft,
        status,
        reason,
      };
    })
    .filter((risk): risk is DeadlineRisk => risk !== null)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 8);
}

function buildActionableInsights({
  tasks,
  chronotype,
}: {
  tasks: TaskRow[];
  chronotype: ChronotypeKey;
}): ActionableInsight[] {
  const peakWindow = getPeakWindow(chronotype);
  const primaryStart = getPrimaryStart(chronotype);

  const insights: ActionableInsight[] = [];

  tasks.forEach((task) => {
    const parsed = parseScheduledTime(task);
    const isBacklog = !parsed;

    if (task.completed) return;

    if (isDeepTask(task.type) && parsed) {
      const aligned = isInsideWindow(parsed.start, peakWindow.start, peakWindow.end);

      if (!aligned) {
        insights.push({
          id: `move-deep-${task.id}`,
          taskId: task.id,
          taskName: task.name,
          title: `Dời “${task.name}” vào peak window`,
          description:
            "Task tập trung đang nằm ngoài khung năng lượng mạnh, nên dễ tốn sức hơn.",
          currentSchedule: `${parsed.dateKey} • ${parsed.start} - ${parsed.end}`,
          suggestedSchedule: `${parsed.dateKey} • ${primaryStart}`,
          tone: "purple",
        });
      }
    }

    if (isDeepTask(task.type) && isBacklog) {
      insights.push({
        id: `schedule-backlog-deep-${task.id}`,
        taskId: task.id,
        taskName: task.name,
        title: `Gắn lịch cho “${task.name}”`,
        description:
          "Task tập trung còn nằm trong backlog, dễ bị trôi nếu không có khung giờ cụ thể.",
        currentSchedule: "Backlog",
        suggestedSchedule: `Khung mạnh ${peakWindow.label}`,
        tone: "blue",
      });
    }

    if (
      !isDeepTask(task.type) &&
      parsed &&
      isInsideWindow(parsed.start, peakWindow.start, peakWindow.end)
    ) {
      insights.push({
        id: `move-light-${task.id}`,
        taskId: task.id,
        taskName: task.name,
        title: `Đẩy “${task.name}” ra khỏi giờ mạnh`,
        description:
          "Việc nhẹ đang chiếm peak window. Nên giữ khung này cho Deep work hoặc Học tập.",
        currentSchedule: `${parsed.dateKey} • ${parsed.start} - ${parsed.end}`,
        suggestedSchedule: "Khung phụ / cuối ngày",
        tone: "orange",
      });
    }

    const daysLeft = task.deadline ? getDaysLeft(task.deadline) : null;

    if (daysLeft !== null && daysLeft <= 3 && isBacklog) {
      insights.push({
        id: `deadline-risk-${task.id}`,
        taskId: task.id,
        taskName: task.name,
        title: `Ưu tiên deadline cho “${task.name}”`,
        description:
          "Task sắp tới deadline nhưng chưa có lịch cụ thể. Đây là rủi ro cần xử lý trước.",
        currentSchedule: "Backlog",
        suggestedSchedule: `Hôm nay hoặc ngày mai • ${primaryStart}`,
        tone: "red",
      });
    }
  });

  return insights.slice(0, 8);
}

function buildPatterns({
  dailySeries,
  energyFocusCorrelation,
  peakComparison,
  focusTrend,
}: {
  dailySeries: DailyInsightPoint[];
  energyFocusCorrelation: Array<{
    dateKey: string;
    label: string;
    energyScore: number | null;
    focusMinutes: number;
  }>;
  peakComparison: PeakComparison;
  focusTrend: TrendPoint[];
}): PatternInsight[] {
  const patterns: PatternInsight[] = [];

  const bestFocusDay = [...dailySeries].sort(
    (a, b) => b.focusMinutes - a.focusMinutes,
  )[0];

  if (bestFocusDay && bestFocusDay.focusMinutes > 0) {
    patterns.push({
      title: "Ngày focus tốt nhất",
      description:
        "Đây là ngày bạn ghi nhận nhiều phút focus nhất trong tuần. Có thể dùng ngày này làm mẫu để sắp lịch các tuần sau.",
      evidence: `${bestFocusDay.label} • ${bestFocusDay.focusMinutes} phút focus`,
      tone: "green",
    });
  }

  const heavyDays = dailySeries.filter((day) => day.loadLevel === "heavy");

  if (heavyDays.length > 0) {
    patterns.push({
      title: "Có pattern quá tải trong tuần",
      description:
        "Một số ngày có tổng planned minutes hoặc số task cao. Nên tránh dồn deep work vào những ngày này.",
      evidence: `${heavyDays.length} ngày quá tải`,
      tone: "red",
    });
  }

  const highEnergyDays = energyFocusCorrelation.filter(
    (point) => point.energyScore !== null && point.energyScore >= 70,
  );
  const lowEnergyDays = energyFocusCorrelation.filter(
    (point) => point.energyScore !== null && point.energyScore < 55,
  );

  const highEnergyAvg =
    highEnergyDays.length > 0
      ? Math.round(
          highEnergyDays.reduce((sum, point) => sum + point.focusMinutes, 0) /
            highEnergyDays.length,
        )
      : 0;

  const lowEnergyAvg =
    lowEnergyDays.length > 0
      ? Math.round(
          lowEnergyDays.reduce((sum, point) => sum + point.focusMinutes, 0) /
            lowEnergyDays.length,
        )
      : 0;

  if (highEnergyDays.length > 0 && lowEnergyDays.length > 0) {
    patterns.push({
      title: "Energy có liên quan tới focus",
      description:
        highEnergyAvg > lowEnergyAvg
          ? "Khi energy check-in cao hơn, focus minutes của bạn cũng có xu hướng tốt hơn."
          : "Energy cao chưa chuyển hóa rõ thành focus minutes. Có thể lịch task vẫn chưa khớp nhịp.",
      evidence: `Energy cao: ${highEnergyAvg} phút • Energy thấp: ${lowEnergyAvg} phút`,
      tone: highEnergyAvg > lowEnergyAvg ? "green" : "orange",
    });
  }

  if (peakComparison.offPeakTasks > peakComparison.peakTasks) {
    patterns.push({
      title: "Deep work đang lệch ra ngoài peak",
      description:
        "Số task tập trung ngoài peak window đang nhiều hơn trong peak window.",
      evidence: `${peakComparison.offPeakTasks} off-peak vs ${peakComparison.peakTasks} peak`,
      tone: "orange",
    });
  }

  const recent = focusTrend.slice(-7);
  const previous = focusTrend.slice(0, 7);
  const recentAvg =
    recent.length > 0
      ? Math.round(recent.reduce((sum, point) => sum + point.value, 0) / recent.length)
      : 0;
  const previousAvg =
    previous.length > 0
      ? Math.round(
          previous.reduce((sum, point) => sum + point.value, 0) / previous.length,
        )
      : 0;

  if (recentAvg > previousAvg) {
    patterns.push({
      title: "Focus trend đang tăng",
      description:
        "7 ngày gần đây có trung bình focus minutes cao hơn giai đoạn trước đó.",
      evidence: `${recentAvg} phút/ngày vs ${previousAvg} phút/ngày`,
      tone: "green",
    });
  } else if (recentAvg < previousAvg) {
    patterns.push({
      title: "Focus trend đang giảm",
      description:
        "7 ngày gần đây có trung bình focus minutes thấp hơn giai đoạn trước đó.",
      evidence: `${recentAvg} phút/ngày vs ${previousAvg} phút/ngày`,
      tone: "orange",
    });
  }

  if (patterns.length === 0) {
    patterns.push({
      title: "Chưa đủ pattern mạnh",
      description:
        "Hãy lưu thêm focus session và check-in năng lượng để ChronoFlow phát hiện pattern rõ hơn.",
      evidence: "Cần thêm dữ liệu",
      tone: "blue",
    });
  }

  return patterns.slice(0, 6);
}

function buildPlannerScore({
  alignmentRate,
  completedTasks,
  totalTasks,
  overloadedDays,
  checkinStreak,
}: {
  alignmentRate: number;
  completedTasks: number;
  totalTasks: number;
  overloadedDays: number;
  checkinStreak: number;
}) {
  const completion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overload = Math.max(0, 100 - overloadedDays * 18);
  const consistency = Math.min(100, checkinStreak * 20);

  const breakdown: PlannerScoreBreakdown = {
    alignment: alignmentRate,
    completion,
    overload,
    consistency,
  };

  const score = Math.round(
    breakdown.alignment * 0.4 +
      breakdown.completion * 0.3 +
      breakdown.overload * 0.2 +
      breakdown.consistency * 0.1,
  );

  return {
    score,
    breakdown,
  };
}

function buildInsights({
  tasks,
  dailySeries,
  alignmentRate,
  focusMinutes,
  energyCheckins,
  deadlineRisks,
  plannerScore,
}: {
  tasks: TaskRow[];
  dailySeries: DailyInsightPoint[];
  alignmentRate: number;
  focusMinutes: number;
  energyCheckins: EnergyCheckinRow[];
  deadlineRisks: DeadlineRisk[];
  plannerScore: number;
}) {
  const insights: RuleInsight[] = [];
  const recommendations: Recommendation[] = [];

  const heavyDays = dailySeries.filter((day) => day.loadLevel === "heavy").length;
  const averageEnergy =
    energyCheckins.length > 0
      ? Math.round(
          energyCheckins.reduce((sum, checkin) => sum + checkin.score, 0) /
            energyCheckins.length,
        )
      : null;

  const backlogCount = tasks.filter((task) => !parseScheduledTime(task)).length;

  insights.push({
    title: "Planner quality score",
    description:
      "Điểm tổng hợp từ alignment, completion, overload và consistency check-in.",
    metric: `${plannerScore}/100`,
    tone: plannerScore >= 75 ? "green" : plannerScore >= 50 ? "orange" : "red",
  });

  if (alignmentRate < 60) {
    insights.push({
      title: "Deep work đang lệch peak window",
      description:
        "Nhiều task tập trung chưa nằm trong khung năng lượng mạnh. Điều này có thể làm bạn tốn sức hơn cho cùng một lượng việc.",
      metric: `${alignmentRate}% đúng nhịp`,
      tone: "orange",
    });

    recommendations.push({
      title: "Dời deep work vào khung mạnh",
      description:
        "Ưu tiên dời task Deep work/Học tập vào focus window trước khi thêm task mới.",
      tone: "purple",
    });
  } else {
    insights.push({
      title: "Lịch tập trung đang khá đúng nhịp",
      description:
        "Tỷ lệ task tập trung nằm đúng peak window đang ổn. Hãy tiếp tục bảo vệ khung giờ này.",
      metric: `${alignmentRate}% đúng nhịp`,
      tone: "green",
    });
  }

  if (heavyDays > 0) {
    insights.push({
      title: "Có ngày đang quá tải",
      description:
        "Một số ngày trong tuần có tổng thời lượng hoặc số task khá cao. Nên thêm buffer để tránh vỡ nhịp.",
      metric: `${heavyDays} ngày dày`,
      tone: "red",
    });

    recommendations.push({
      title: "Thêm buffer 10–15 phút",
      description:
        "Sau block Deep work/Học tập dài, hãy chừa thời gian nghỉ hoặc chuyển nhịp trước task tiếp theo.",
      tone: "orange",
    });
  }

  if (deadlineRisks.length > 0) {
    recommendations.push({
      title: "Xử lý deadline risk trước",
      description:
        "Có task sắp tới hạn hoặc quá hạn. Nên ưu tiên gắn lịch và hoàn thành trước các task mới.",
      tone: "red",
    });
  }

  if (backlogCount > 0) {
    recommendations.push({
      title: "Gắn lịch cho backlog",
      description:
        "Backlog còn task chưa có thời gian cụ thể. Hãy auto-schedule hoặc kéo task vào calendar.",
      tone: "blue",
    });
  }

  if (averageEnergy !== null && averageEnergy < 55) {
    insights.push({
      title: "Năng lượng trung bình đang thấp",
      description:
        "Các check-in gần đây cho thấy năng lượng chưa cao. Nên giảm task nặng và ưu tiên block ngắn.",
      metric: `${averageEnergy}/100`,
      tone: "orange",
    });
  }

  if (focusMinutes === 0) {
    recommendations.push({
      title: "Bắt đầu lưu focus session",
      description:
        "Insights sẽ chính xác hơn khi bạn lưu các phiên focus thật trong Planner.",
      tone: "purple",
    });
  }

  return {
    insights: insights.slice(0, 6),
    recommendations: recommendations.slice(0, 6),
  };
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
      select: {
        id: true,
        name: true,
        chronotypeResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            chronotype: true,
            lionScore: true,
            bearScore: true,
            wolfScore: true,
            dolphinScore: true,
          },
        },
        weeklyInsights: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        type: true,
        priority: true,
        duration: true,
        deadline: true,
        scheduledTime: true,
        explanation: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const focusSessionsRaw = await prisma.focusSession.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      take: 300,
      select: {
        id: true,
        taskId: true,
        durationMinutes: true,
        startedAt: true,
        endedAt: true,
        createdAt: true,
      },
    });
    
    const focusSessions: FocusSessionRow[] = focusSessionsRaw.map((item) => ({
      id: item.id,
      taskId: item.taskId,
      durationMinutes: item.durationMinutes,
      startedAt: item.startedAt,
      endedAt: item.endedAt,
      createdAt: item.createdAt,
    }));
    
    const energyCheckinsRaw = await prisma.energyCheckin.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 300,
      select: {
        id: true,
        score: true,
        note: true,
        source: true,
        createdAt: true,
      },
    });
    
    const energyCheckins: EnergyCheckinRow[] = energyCheckinsRaw.map((item) => ({
      id: item.id,
      score: item.score,
      note: item.note,
      source: item.source,
      createdAt: item.createdAt,
    }));

    const latestChronotype = user.chronotypeResults[0];
    const chronotype = normalizeChronotype(latestChronotype?.chronotype);
    const peakWindow = getPeakWindow(chronotype);

    const deepTasks = tasks.filter((task) => isDeepTask(task.type));
    const scheduledDeepTasks = deepTasks.filter((task) => parseScheduledTime(task));

    const alignedDeepTasks = scheduledDeepTasks.filter((task) => {
      const parsed = parseScheduledTime(task);
      return isInsideWindow(parsed?.start ?? null, peakWindow.start, peakWindow.end);
    });

    const alignmentRate =
      scheduledDeepTasks.length > 0
        ? Math.round((alignedDeepTasks.length / scheduledDeepTasks.length) * 100)
        : 0;

    const focusMinutes = focusSessions.reduce(
      (sum, focusSession) => sum + focusSession.durationMinutes,
      0,
    );

    const dailySeries = buildDailySeries({
      tasks,
      focusSessions,
      energyCheckins,
    });

    const overloadedDays = dailySeries.filter(
      (day) => day.loadLevel === "heavy",
    ).length;

    const completedTasks = tasks.filter((task) => task.completed).length;
    const checkinStreak = calculateCheckinStreak(energyCheckins);
    const taskTypeBreakdown = buildTaskTypeBreakdown(tasks);
    const deadlineRisks = buildDeadlineRisks(tasks);

    const { score: plannerScore, breakdown: plannerScoreBreakdown } =
      buildPlannerScore({
        alignmentRate,
        completedTasks,
        totalTasks: tasks.length,
        overloadedDays,
        checkinStreak,
      });

    const trendData = buildTrendSeries({
      tasks,
      focusSessions,
      energyCheckins,
      chronotype,
    });

    const peakComparison = buildPeakComparison({
      tasks,
      chronotype,
    });

    const actionableInsights = buildActionableInsights({
      tasks,
      chronotype,
    });

    const patterns = buildPatterns({
      dailySeries,
      energyFocusCorrelation: trendData.energyFocusCorrelation,
      peakComparison,
      focusTrend: trendData.focusTrend,
    });

    const { insights, recommendations } = buildInsights({
      tasks,
      dailySeries,
      alignmentRate,
      focusMinutes,
      energyCheckins,
      deadlineRisks,
      plannerScore,
    });

    return NextResponse.json({
      success: true,
      user: {
        name: user.name ?? "bạn",
        chronotype,
        chronotypeLabel: getChronotypeLabel(chronotype),
        peakWindow: peakWindow.label,
      },
      summary: {
        focusScore: alignmentRate,
        focusMinutes,
        completedTasks,
        totalTasks: tasks.length,
        alignmentRate,
        overloadedDays,
        checkinStreak,
        backlogCount: tasks.filter((task) => !parseScheduledTime(task)).length,
      },
      charts: {
        dailySeries,
        taskTypeBreakdown,
        alignment: {
          aligned: alignedDeepTasks.length,
          misaligned: Math.max(0, scheduledDeepTasks.length - alignedDeepTasks.length),
          unscheduled: Math.max(0, deepTasks.length - scheduledDeepTasks.length),
        },
      },
      advanced: {
        plannerScore,
        plannerScoreBreakdown,
        focusTrend: trendData.focusTrend,
        completionTrend: trendData.completionTrend,
        alignmentTrend: trendData.alignmentTrend,
        energyFocusCorrelation: trendData.energyFocusCorrelation,
        peakComparison,
        deadlineRisks,
        actionableInsights,
        patterns,
      },
      insights,
      recommendations,
      latestWeeklyInsight: user.weeklyInsights[0] ?? null,
    });
  } catch (error) {
    console.error("INSIGHTS_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load insights.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}