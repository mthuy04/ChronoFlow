import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type TaskCategory = "deep" | "admin" | "creative" | "recovery";
type TaskStatus = "todo" | "done";
type SuggestionTone = "warning" | "info" | "success";
type FocusStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
type RedemptionStatus = "PENDING" | "APPROVED" | "REJECTED" | "FULFILLED";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  chronotype: string | null;
  hasCompletedAssessment: boolean;
};

type TaskRecord = {
  id: string;
  userId: string;
  name: string;
  type: string;
  priority: string;
  duration: string;
  deadline: string | null;
  scheduledTime: string;
  explanation: string;
  completed: boolean;
  isBacklog: boolean;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  focusMode: string | null;
  focusMinutes: number | null;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

type WeeklyInsightRecord = {
  id: string;
  userId: string;
  weekLabel: string;
  alignmentScore: number;
  completedCount: number;
  totalCount: number;
  deepWorkCount: number;
  recommendation: string;
  summary: string;
  createdAt: Date;
};

type FocusSessionRawRow = {
  id: string;
  userId: string;
  taskId: string | null;
  status: FocusStatus;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number;
  coinsEarned: number;
  createdAt: Date;
  updatedAt: Date;
  task_id: string | null;
  task_name: string | null;
  task_type: string | null;
  task_startTime: string | null;
  task_endTime: string | null;
  task_duration: string | null;
};

type FocusSessionRecord = {
  id: string;
  userId: string;
  taskId: string | null;
  status: FocusStatus;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number;
  coinsEarned: number;
  createdAt: Date;
  updatedAt: Date;
  task: {
    id: string;
    name: string;
    type: string;
    startTime: string | null;
    endTime: string | null;
    duration: string;
  } | null;
};

type RewardRedemptionRecord = {
  id: string;
  userId: string;
  rewardItemId: string | null;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  recipientName: string;
  phone: string;
  address: string;
  note: string | null;
  status: RedemptionStatus;
  createdAt: Date;
  updatedAt: Date;
};

type RewardItemRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  pointsCost: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type EnergyCheckinRecord = {
  id: string;
  userId: string;
  score: number;
  note: string | null;
  source: string;
  checkedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type EnergyPoint = {
  hour: string;
  value: number;
};

type EnergyRecommendation = {
  status: "aligned" | "move_to_peak" | "recovery" | "low_energy_ok" | "unscheduled";
  label: string;
  description: string;
};

type DashboardTask = {
  id: string;
  title: string;
  type: TaskCategory;
  originalType: string;
  typeLabel: string;
  priority: string;
  priorityWeight: number;
  status: TaskStatus;
  startTime: string | null;
  endTime: string | null;
  estimatedMinutes: number | null;
  focusMinutes: number;
  coins: number;
  explanation: string | null;
  isAligned: boolean;
  alignmentLabel: string;
  energyRecommendation: EnergyRecommendation;
};

type SmartSuggestion = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  tone: SuggestionTone;
};

type AlertItem = {
  id: string;
  title: string;
  description: string;
  type: SuggestionTone;
};

function toDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getCurrentTime() {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function minutesFromTime(time?: string | null) {
  if (!time) return null;

  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  return hour * 60 + minute;
}

function hourFromDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const hourPart = parts.find((part) => part.type === "hour")?.value;
  const hour = Number(hourPart);

  return Number.isFinite(hour) ? hour : null;
}

function isInsideWindow(startTime: string | null, windowText: string | null) {
  if (!windowText) return false;

  const [start, end] = windowText.split(" - ");
  const startMinutes = minutesFromTime(startTime);
  const windowStart = minutesFromTime(start);
  const windowEnd = minutesFromTime(end);

  if (startMinutes === null || windowStart === null || windowEnd === null) return false;

  return startMinutes >= windowStart && startMinutes <= windowEnd;
}

function getTaskDate(task: TaskRecord) {
  if (task.scheduledDate) return task.scheduledDate.slice(0, 10);

  const raw = task.scheduledTime.trim();
  const dateMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) return dateMatch[1];

  const pipeParts = raw.split("|");
  if (pipeParts.length >= 1 && /^\d{4}-\d{2}-\d{2}$/.test(pipeParts[0])) return pipeParts[0];

  return null;
}

function getTaskStartTime(task: TaskRecord) {
  if (task.startTime) return task.startTime;

  const raw = task.scheduledTime.trim();
  const pipeParts = raw.split("|");
  if (pipeParts.length >= 2) return pipeParts[1];

  const rangeMatch = raw.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (rangeMatch) return rangeMatch[1];

  const singleMatch = raw.match(/(\d{1,2}:\d{2})/);
  if (singleMatch) return singleMatch[1];

  return null;
}

function getTaskEndTime(task: TaskRecord) {
  if (task.endTime) return task.endTime;

  const raw = task.scheduledTime.trim();
  const pipeParts = raw.split("|");
  if (pipeParts.length >= 3) return pipeParts[2];

  const rangeMatch = raw.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (rangeMatch) return rangeMatch[2];

  return null;
}

function getTaskType(type: string): TaskCategory {
  const map: Record<string, TaskCategory> = {
    DEEP_WORK: "deep",
    STUDY: "deep",
    CREATIVE: "creative",
    ADMIN: "admin",
    ROUTINE: "recovery",
    PERSONAL: "admin",
  };

  return map[type] || "deep";
}

function getTaskTypeLabel(type: string) {
  const map: Record<string, string> = {
    DEEP_WORK: "Deep work",
    STUDY: "Học tập",
    CREATIVE: "Sáng tạo",
    ADMIN: "Việc nhẹ",
    ROUTINE: "Routine",
    PERSONAL: "Cá nhân",
  };

  return map[type] || "Deep work";
}

function getPriorityWeight(priority?: string | null) {
  if (priority === "HIGH") return 3;
  if (priority === "MEDIUM") return 2;
  if (priority === "LOW") return 1;
  return 0;
}

function getEstimatedMinutes(duration?: string | null, focusMinutes?: number | null) {
  if (typeof focusMinutes === "number" && focusMinutes > 0) return focusMinutes;

  const match = String(duration || "").match(/\d+/);
  if (!match) return null;

  return Number(match[0]);
}

function getPotentialTaskCoins(minutes?: number | null) {
  return Math.max(5, Math.floor(Number(minutes || 0) / 25) * 5);
}

function getEnergyRecommendation(
  taskType: TaskCategory,
  startTime: string | null,
  peakWindow: string | null,
  lowWindow: string | null,
): EnergyRecommendation {
  if (!startTime) {
    return {
      status: "unscheduled",
      label: "Chưa đặt giờ",
      description: "Hãy chọn khung giờ để ChronoFlow kiểm tra độ khớp năng lượng.",
    };
  }

  if (!peakWindow && !lowWindow) {
    return {
      status: "unscheduled",
      label: "Chưa đủ dữ liệu",
      description: "Cần thêm focus session hoặc energy check-in để tính khung năng lượng cá nhân.",
    };
  }

  if (taskType === "deep") {
    if (isInsideWindow(startTime, peakWindow)) {
      return {
        status: "aligned",
        label: "Đúng nhịp",
        description: "Task nặng đang nằm trong khung tập trung tốt nhất theo dữ liệu thật của bạn.",
      };
    }

    return {
      status: "move_to_peak",
      label: "Nên dời sang peak",
      description: peakWindow ? `Nên chuyển task này vào ${peakWindow}.` : "Chưa đủ dữ liệu để đề xuất peak window.",
    };
  }

  if ((taskType === "admin" || taskType === "recovery") && isInsideWindow(startTime, lowWindow)) {
    return {
      status: "low_energy_ok",
      label: "Hợp việc nhẹ",
      description: "Task nhẹ phù hợp với khung năng lượng thấp theo dữ liệu thật.",
    };
  }

  return {
    status: "aligned",
    label: "Ổn",
    description: "Task này không xung đột lớn với dữ liệu năng lượng hiện có.",
  };
}

function createDashboardTask(task: TaskRecord, peakWindow: string | null, lowWindow: string | null): DashboardTask {
  const estimatedMinutes = getEstimatedMinutes(task.duration, task.focusMinutes);
  const category = getTaskType(task.type);
  const startTime = getTaskStartTime(task);
  const energyRecommendation = getEnergyRecommendation(category, startTime, peakWindow, lowWindow);
  const isAligned = energyRecommendation.status === "aligned" || energyRecommendation.status === "low_energy_ok";

  return {
    id: task.id,
    title: task.name,
    type: category,
    originalType: task.type,
    typeLabel: getTaskTypeLabel(task.type),
    priority: task.priority,
    priorityWeight: getPriorityWeight(task.priority),
    status: task.completed ? "done" : "todo",
    startTime,
    endTime: getTaskEndTime(task),
    estimatedMinutes,
    focusMinutes: Number(task.focusMinutes || 0),
    coins: task.completed ? getPotentialTaskCoins(task.focusMinutes || estimatedMinutes) : getPotentialTaskCoins(estimatedMinutes),
    explanation: task.explanation || null,
    isAligned,
    alignmentLabel: energyRecommendation.label,
    energyRecommendation,
  };
}

function mapFocusSessionRows(rows: FocusSessionRawRow[]): FocusSessionRecord[] {
  return rows.map((item) => ({
    id: item.id,
    userId: item.userId,
    taskId: item.taskId,
    status: item.status,
    startedAt: item.startedAt,
    endedAt: item.endedAt,
    durationMinutes: item.durationMinutes,
    coinsEarned: item.coinsEarned,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    task: item.task_id
      ? {
          id: item.task_id,
          name: item.task_name || "Task",
          type: item.task_type || "DEEP_WORK",
          startTime: item.task_startTime,
          endTime: item.task_endTime,
          duration: item.task_duration || "",
        }
      : null,
  }));
}

function getPointSummary(focusSessions: FocusSessionRecord[], rewardRedemptions: RewardRedemptionRecord[]) {
  const earned = focusSessions
    .filter((item) => item.status === "COMPLETED")
    .reduce((sum: number, item: FocusSessionRecord) => sum + item.coinsEarned, 0);

  const spent = rewardRedemptions
    .filter((item) => item.status !== "REJECTED")
    .reduce((sum: number, item: RewardRedemptionRecord) => sum + item.pointsCost, 0);

  return {
    earned,
    spent,
    available: Math.max(0, earned - spent),
  };
}

function buildEnergyCurve(checkins: EnergyCheckinRecord[]): EnergyPoint[] {
  const grouped = checkins.reduce<Record<string, { total: number; count: number }>>(
    (acc, item) => {
      const hour = hourFromDate(item.checkedAt);

      if (hour === null) return acc;

      const hourKey = `${String(hour).padStart(2, "0")}h`;
      const current = acc[hourKey] || { total: 0, count: 0 };

      acc[hourKey] = {
        total: current.total + item.score,
        count: current.count + 1,
      };

      return acc;
    },
    {},
  );

  return Object.entries(grouped)
    .map(([hour, value]) => ({
      hour,
      value: Math.round(value.total / value.count),
    }))
    .sort((a, b) => Number(a.hour.replace("h", "")) - Number(b.hour.replace("h", "")));
}

function formatClockHour(hour: number) {
  if (!Number.isFinite(hour)) return null;

  const safeHour = Math.max(0, Math.min(23, Math.round(hour)));
  return `${String(safeHour).padStart(2, "0")}:00`;
}

function formatWindow(startHour: number, durationHours: number) {
  const start = formatClockHour(startHour);
  const end = formatClockHour(Math.min(23, startHour + durationHours));

  if (!start || !end) return null;

  return `${start} - ${end}`;
}

function hourNumberFromEnergyPoint(point: EnergyPoint | undefined) {
  if (!point) return null;

  const match = point.hour.match(/^(\d{1,2})h$/);
  if (!match) return null;

  const hour = Number(match[1]);

  return Number.isFinite(hour) ? hour : null;
}

function buildPersonalWindows(checkins: EnergyCheckinRecord[]) {
  if (checkins.length < 3) {
    return {
      peakWindow: null,
      lowWindow: null,
      recoveryWindow: null,
    };
  }

  const curve = buildEnergyCurve(checkins);

  if (curve.length === 0) {
    return {
      peakWindow: null,
      lowWindow: null,
      recoveryWindow: null,
    };
  }

  const highest = [...curve].sort((a, b) => b.value - a.value)[0];
  const lowest = [...curve].sort((a, b) => a.value - b.value)[0];

  const peakHour = hourNumberFromEnergyPoint(highest);
  const lowHour = hourNumberFromEnergyPoint(lowest);

  const peakWindow = peakHour === null ? null : formatWindow(peakHour, 2);
  const lowWindow = lowHour === null ? null : formatWindow(lowHour, 1);

  return {
    peakWindow,
    lowWindow,
    recoveryWindow: null,
  };
}
function getLatestEnergyStatus(latestCheckin: EnergyCheckinRecord | null) {
  if (!latestCheckin) {
    return {
      label: "Chưa có check-in năng lượng",
      description: "Hãy cập nhật năng lượng hiện tại để ChronoFlow phân tích bằng dữ liệu thật.",
      tone: "missing",
      currentTime: getCurrentTime(),
    };
  }

  const twoHoursMs = 2 * 60 * 60 * 1000;
  const isRecent = Date.now() - latestCheckin.checkedAt.getTime() <= twoHoursMs;

  if (!isRecent) {
    return {
      label: "Chưa có check-in gần đây",
      description: "Lần check-in gần nhất đã quá 2 giờ. Hãy cập nhật lại để dashboard phản ánh đúng trạng thái hiện tại.",
      tone: "stale",
      currentTime: getCurrentTime(),
    };
  }

  if (latestCheckin.score >= 75) {
    return {
      label: "Năng lượng cao",
      description: "Dựa trên check-in gần nhất, đây là thời điểm phù hợp để xử lý task quan trọng.",
      tone: "focus",
      currentTime: getCurrentTime(),
    };
  }

  if (latestCheckin.score >= 45) {
    return {
      label: "Năng lượng ổn định",
      description: "Dựa trên check-in gần nhất, bạn có thể xử lý task vừa sức hoặc tiếp tục phiên focus ngắn.",
      tone: "stable",
      currentTime: getCurrentTime(),
    };
  }

  return {
    label: "Năng lượng thấp",
    description: "Dựa trên check-in gần nhất, nên ưu tiên việc nhẹ hoặc nghỉ ngắn.",
    tone: "low",
    currentTime: getCurrentTime(),
  };
}

function computeStreak(params: {
  tasks: TaskRecord[];
  focusSessions: FocusSessionRecord[];
}) {
  let streak = 0;
  const today = new Date();

  for (let offset = 0; offset < 365; offset += 1) {
    const date = addDays(today, -offset);
    const key = toDateKey(date);

    const hasCompletedTask = params.tasks.some((task) => getTaskDate(task) === key && task.completed);
    const hasCompletedFocus = params.focusSessions.some((session) => {
      return session.status === "COMPLETED" && toDateKey(session.startedAt) === key;
    });

    if (hasCompletedTask || hasCompletedFocus) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "Chưa đặt giờ";
  if (start && end) return `${start} - ${end}`;
  return start || end || "Chưa đặt giờ";
}

function makeDecisionActions(params: {
  nextTask: DashboardTask | null;
  latestCheckin: EnergyCheckinRecord | null;
  focusMisalignedCount: number;
  tasksWithoutTimeCount: number;
  peakWindow: string | null;
}) {
  const actions: SmartSuggestion[] = [];

  if (params.nextTask) {
    actions.push({
      id: "next-task",
      title: `Làm tiếp: ${params.nextTask.title}`,
      description: `${params.nextTask.typeLabel} · ${formatTimeRange(params.nextTask.startTime, params.nextTask.endTime)} · +${params.nextTask.coins} điểm tiềm năng`,
      href: `/planner?taskId=${params.nextTask.id}`,
      cta: "Mở task",
      tone: "success",
    });
  } else {
    actions.push({
      id: "create-task",
      title: "Tạo task đầu tiên cho hôm nay",
      description: "Thêm task vào planner để bắt đầu theo dõi tiến độ thật.",
      href: "/planner",
      cta: "Thêm task",
      tone: "info",
    });
  }

  if (!params.latestCheckin) {
    actions.push({
      id: "energy-checkin",
      title: "Cập nhật năng lượng hiện tại",
      description: "Dashboard cần check-in thật để tính energy score và đường năng lượng cá nhân.",
      href: "/dashboard",
      cta: "Check-in",
      tone: "info",
    });
  }

  if (params.focusMisalignedCount > 0 && params.peakWindow) {
    actions.push({
      id: "realign",
      title: `${params.focusMisalignedCount} task nặng đang lệch peak window`,
      description: `Nên chuyển deep work vào ${params.peakWindow}.`,
      href: "/planner",
      cta: "Chỉnh lịch",
      tone: "warning",
    });
  }

  if (params.tasksWithoutTimeCount > 0) {
    actions.push({
      id: "schedule",
      title: `${params.tasksWithoutTimeCount} task chưa có khung giờ`,
      description: "Task chưa có giờ sẽ không được tính vào alignment score.",
      href: "/planner",
      cta: "Gán giờ",
      tone: "warning",
    });
  }

  return actions.slice(0, 4);
}

async function upsertWeeklyInsight(params: {
  userId: string;
  weekLabel: string;
  alignmentScore: number;
  completedCount: number;
  totalCount: number;
  deepWorkCount: number;
  recommendation: string;
  summary: string;
}) {
  await prisma.weeklyInsight.upsert({
    where: {
      userId_weekLabel: {
        userId: params.userId,
        weekLabel: params.weekLabel,
      },
    },
    update: {
      alignmentScore: params.alignmentScore,
      completedCount: params.completedCount,
      totalCount: params.totalCount,
      deepWorkCount: params.deepWorkCount,
      recommendation: params.recommendation,
      summary: params.summary,
    },
    create: {
      userId: params.userId,
      weekLabel: params.weekLabel,
      alignmentScore: params.alignmentScore,
      completedCount: params.completedCount,
      totalCount: params.totalCount,
      deepWorkCount: params.deepWorkCount,
      recommendation: params.recommendation,
      summary: params.summary,
    },
  });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Bạn cần đăng nhập để xem dashboard." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        chronotype: true,
        hasCompletedAssessment: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy tài khoản." }, { status: 404 });
    }

    const safeUser: UserRecord = {
      id: user.id,
      name: user.name,
      email: user.email,
      chronotype: user.chronotype,
      hasCompletedAssessment: user.hasCompletedAssessment,
    };

    const [allTasksRaw, weeklyInsightsRaw, focusSessionRows, rewardRedemptions, rewardItems, energyCheckins] = await Promise.all([
      prisma.task.findMany({
        where: { userId: safeUser.id },
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
      }),
      prisma.weeklyInsight.findMany({
        where: { userId: safeUser.id },
        orderBy: { createdAt: "desc" },
        take: 1,
      }),
      prisma.$queryRaw<FocusSessionRawRow[]>`
        SELECT
          fs.id,
          fs.userId,
          fs.taskId,
          fs.status,
          fs.startedAt,
          fs.endedAt,
          fs.durationMinutes,
          fs.coinsEarned,
          fs.createdAt,
          fs.updatedAt,
          t.id AS task_id,
          t.name AS task_name,
          t.type AS task_type,
          t.startTime AS task_startTime,
          t.endTime AS task_endTime,
          t.duration AS task_duration
        FROM FocusSession fs
        LEFT JOIN Task t ON t.id = fs.taskId
        WHERE fs.userId = ${safeUser.id}
        ORDER BY fs.startedAt DESC
        LIMIT 100
      `,
      prisma.$queryRaw<RewardRedemptionRecord[]>`
        SELECT
          id,
          userId,
          rewardItemId,
          rewardId,
          rewardTitle,
          pointsCost,
          recipientName,
          phone,
          address,
          note,
          status,
          createdAt,
          updatedAt
        FROM RewardRedemption
        WHERE userId = ${safeUser.id}
        ORDER BY createdAt DESC
        LIMIT 20
      `,
      prisma.$queryRaw<RewardItemRecord[]>`
        SELECT
          id,
          slug,
          title,
          description,
          pointsCost,
          active,
          createdAt,
          updatedAt
        FROM RewardItem
        WHERE active = true
        ORDER BY pointsCost ASC
      `,
      prisma.$queryRaw<EnergyCheckinRecord[]>`
        SELECT
          id,
          userId,
          score,
          note,
          source,
          checkedAt,
          createdAt,
          updatedAt
        FROM EnergyCheckin
        WHERE userId = ${safeUser.id}
          AND checkedAt >= DATE_SUB(NOW(), INTERVAL 14 DAY)
        ORDER BY checkedAt DESC
      `,
    ]);

    const typedTasks: TaskRecord[] = allTasksRaw.map((task) => ({
      id: task.id,
      userId: task.userId,
      name: task.name,
      type: String(task.type),
      priority: String(task.priority),
      duration: task.duration,
      deadline: task.deadline,
      scheduledTime: task.scheduledTime,
      explanation: task.explanation,
      completed: task.completed,
      isBacklog: task.isBacklog,
      scheduledDate: task.scheduledDate,
      startTime: task.startTime,
      endTime: task.endTime,
      focusMode: task.focusMode,
      focusMinutes: task.focusMinutes,
      orderIndex: task.orderIndex,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    const typedWeeklyInsights: WeeklyInsightRecord[] = weeklyInsightsRaw.map((item) => ({
      id: item.id,
      userId: item.userId,
      weekLabel: item.weekLabel,
      alignmentScore: item.alignmentScore,
      completedCount: item.completedCount,
      totalCount: item.totalCount,
      deepWorkCount: item.deepWorkCount,
      recommendation: item.recommendation,
      summary: item.summary,
      createdAt: item.createdAt,
    }));

    const focusSessions = mapFocusSessionRows(focusSessionRows);
    const todayDateKey = toDateKey(new Date());
    const weekStart = getStartOfWeek(new Date());
    const weekEnd = addDays(weekStart, 6);
    const weekLabel = `${toDateKey(weekStart)} - ${toDateKey(weekEnd)}`;

    const latestCheckin = energyCheckins[0] || null;
    const energyCurve = buildEnergyCurve(energyCheckins);
    const personalWindows = buildPersonalWindows(energyCheckins);
    const energyScore = latestCheckin?.score ?? null;

    const activeFocusSession = focusSessions.find((item) => item.status === "ACTIVE") || null;
    const completedFocusSessions = focusSessions.filter((item) => item.status === "COMPLETED");

    const activeTasks = typedTasks.filter((task) => !task.completed && !task.isBacklog);
    const completedAllTasks = typedTasks.filter((task) => task.completed);
    const backlogTasks = typedTasks.filter((task) => task.isBacklog);

    const todayTasksRaw = typedTasks.filter((task) => getTaskDate(task) === todayDateKey && !task.isBacklog);

    const todayTasks = todayTasksRaw.map((task) => {
      return createDashboardTask(task, personalWindows.peakWindow, personalWindows.lowWindow);
    });

    const completedToday = todayTasks.filter((task) => task.status === "done");
    const pendingToday = todayTasks.filter((task) => task.status !== "done");
    const tasksWithoutTime = pendingToday.filter((task) => !task.startTime);

    const todayFocusSessions = completedFocusSessions.filter((item) => toDateKey(item.startedAt) === todayDateKey);

    const focusMinutesToday = todayFocusSessions.reduce((sum: number, item: FocusSessionRecord) => {
      return sum + item.durationMinutes;
    }, 0);

    const coinsToday = todayFocusSessions.reduce((sum: number, item: FocusSessionRecord) => {
      return sum + item.coinsEarned;
    }, 0);

    const pointSummary = getPointSummary(focusSessions, rewardRedemptions);
    const streak = computeStreak({ tasks: typedTasks, focusSessions });

    const weekDates = Array.from({ length: 7 }).map((_: unknown, index: number) => {
      const date = addDays(weekStart, index);
      const key = toDateKey(date);

      const daySessions = completedFocusSessions.filter((item) => toDateKey(item.startedAt) === key);
      const dayTasks = typedTasks.filter((task) => getTaskDate(task) === key && !task.isBacklog);
      const completedTasks = dayTasks.filter((task) => task.completed);

      return {
        date: key,
        label: new Intl.DateTimeFormat("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          weekday: "short",
        })
          .format(date)
          .replace(".", "")
          .toUpperCase(),
        focusMinutes: daySessions.reduce((sum: number, item: FocusSessionRecord) => sum + item.durationMinutes, 0),
        completedTasks: completedTasks.length,
        totalTasks: dayTasks.length,
        coins: daySessions.reduce((sum: number, item: FocusSessionRecord) => sum + item.coinsEarned, 0),
        energyScore: null,
        isToday: key === todayDateKey,
      };
    });

    const priorityQueue = [...pendingToday]
      .sort((a, b) => {
        const priorityDiff = Number(b.priorityWeight || 0) - Number(a.priorityWeight || 0);
        if (priorityDiff !== 0) return priorityDiff;

        const aTime = minutesFromTime(a.startTime) ?? 9999;
        const bTime = minutesFromTime(b.startTime) ?? 9999;

        return aTime - bTime;
      })
      .slice(0, 6);

    const focusAlignedTasks = todayTasks.filter((task) => task.type === "deep" && task.startTime && task.isAligned);
    const focusMisalignedTasks = todayTasks.filter((task) => task.type === "deep" && task.startTime && !task.isAligned);
    const alignmentTotal = focusAlignedTasks.length + focusMisalignedTasks.length;
    const alignmentScore = alignmentTotal > 0 ? Math.round((focusAlignedTasks.length / alignmentTotal) * 100) : 0;

    const nextTask = priorityQueue[0] || null;
    const completionRate = todayTasks.length === 0 ? 0 : Math.round((completedToday.length / todayTasks.length) * 100);

    const datedTasks = typedTasks.filter((task) => getTaskDate(task) !== null);
    const completedDatedTasks = datedTasks.filter((task) => task.completed);
    const deepWorkCount = typedTasks.filter((task) => task.type === "DEEP_WORK" || task.type === "STUDY").length;

    const summary =
      completedFocusSessions.length > 0 || completedDatedTasks.length > 0 || energyCheckins.length > 0
        ? `Tuần này có ${completedDatedTasks.length}/${datedTasks.length} task đã hoàn thành, ${completedFocusSessions.length} phiên focus và ${energyCheckins.length} check-in năng lượng trong 14 ngày gần nhất.`
        : "Chưa đủ dữ liệu thật để tạo tổng kết tuần.";

    const recommendation =
      focusMisalignedTasks.length > 0 && personalWindows.peakWindow
        ? `Có ${focusMisalignedTasks.length} task nặng đang lệch peak window ${personalWindows.peakWindow}.`
        : "Chưa phát hiện xung đột lớn từ dữ liệu hiện có.";

    await upsertWeeklyInsight({
      userId: safeUser.id,
      weekLabel,
      alignmentScore,
      completedCount: completedDatedTasks.length,
      totalCount: datedTasks.length,
      deepWorkCount,
      recommendation,
      summary,
    });

    const updatedWeeklyInsight = {
      weekLabel,
      alignmentScore,
      completedCount: completedDatedTasks.length,
      totalCount: datedTasks.length,
      deepWorkCount,
      recommendation,
      summary,
    };

    const rewardMilestones = rewardItems.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      points: item.pointsCost,
      unlocked: pointSummary.available >= item.pointsCost,
    }));

    const nextMilestone = rewardMilestones.find((item) => !item.unlocked) || rewardMilestones[rewardMilestones.length - 1] || null;

    const smartSuggestions: SmartSuggestion[] = [
      !safeUser.hasCompletedAssessment
        ? {
            id: "assessment",
            title: "Hoàn thành bài test chronotype",
            description: "Bài test giúp lưu hồ sơ chronotype thật vào tài khoản.",
            href: "/assessment",
            cta: "Làm bài test",
            tone: "warning",
          }
        : null,
      !latestCheckin
        ? {
            id: "energy-checkin",
            title: "Check-in năng lượng hôm nay",
            description: "Dashboard cần dữ liệu check-in thật để tính energy score.",
            href: "/dashboard",
            cta: "Check-in",
            tone: "info",
          }
        : null,
      todayTasks.length === 0
        ? {
            id: "create-task",
            title: "Thêm task đầu tiên cho hôm nay",
            description: "Task thật trong planner sẽ được dùng để tính tiến độ và alignment.",
            href: "/planner",
            cta: "Mở planner",
            tone: "info",
          }
        : null,
      tasksWithoutTime.length > 0
        ? {
            id: "schedule-task",
            title: "Gán giờ cho task chưa có timeline",
            description: `${tasksWithoutTime.length} task chưa có start time nên chưa thể tối ưu theo dữ liệu năng lượng.`,
            href: "/planner",
            cta: "Sắp lịch",
            tone: "warning",
          }
        : null,
    ].filter((item): item is SmartSuggestion => item !== null);

    const alerts: AlertItem[] = [
      rewardItems.length === 0
        ? {
            id: "no-rewards",
            title: "Chưa có phần thưởng khả dụng",
            description: "Cần thêm RewardItem trong database để user có thể đổi thưởng thật.",
            type: "warning",
          }
        : null,
      energyCheckins.length < 3
        ? {
            id: "not-enough-energy-data",
            title: "Chưa đủ dữ liệu năng lượng",
            description: "Cần ít nhất vài check-in để vẽ đường năng lượng cá nhân đáng tin hơn.",
            type: "info",
          }
        : null,
      focusMisalignedTasks.length > 0
        ? {
            id: "misaligned-alert",
            title: "Task nặng đang lệch nhịp",
            description: personalWindows.peakWindow
              ? `${focusMisalignedTasks.length} task deep work không nằm trong peak window ${personalWindows.peakWindow}.`
              : "Có task nặng nhưng chưa đủ dữ liệu để xác định peak window.",
            type: "warning",
          }
        : null,
    ].filter((item): item is AlertItem => item !== null);

    return NextResponse.json({
      user: {
        name: safeUser.name,
        email: safeUser.email,
      },
      chronotype: {
        type: safeUser.chronotype,
        label: safeUser.chronotype || "Chưa có chronotype",
        peakWindow: personalWindows.peakWindow,
        lowWindow: personalWindows.lowWindow,
        recoveryWindow: personalWindows.recoveryWindow,
        description: safeUser.chronotype
          ? "Chronotype được lưu từ hồ sơ người dùng. Energy score và curve lấy từ check-in thật."
          : "Chưa có chronotype. Hãy hoàn thành bài test để lưu hồ sơ cá nhân.",
      },
      today: {
        energyScore,
        focusMinutes: focusMinutesToday,
        coins: pointSummary.available,
        coinsToday,
        streak,
        completedTasks: completedToday.length,
        totalTasks: todayTasks.length,
        pendingTasks: pendingToday.length,
        activeTasks: activeTasks.length,
        backlogTasks: backlogTasks.length,
        allCompletedTasks: completedAllTasks.length,
        completionRate,
        alignmentScore,
      },
      nowStatus: getLatestEnergyStatus(latestCheckin),
      energyInsight: {
        currentTime: getCurrentTime(),
        summary: latestCheckin
          ? `Check-in gần nhất: ${latestCheckin.score}/100.`
          : "Chưa có check-in năng lượng hôm nay.",
        peakWindow: personalWindows.peakWindow,
        recoveryWindow: personalWindows.recoveryWindow,
      },
      energyCurve,
      energyCheckins: energyCheckins.slice(0, 10),
      tasks: todayTasks,
      nextTask,
      priorityQueue,
      activeFocusSession: activeFocusSession
        ? {
            id: activeFocusSession.id,
            taskId: activeFocusSession.taskId,
            startedAt: activeFocusSession.startedAt,
            task: activeFocusSession.task,
          }
        : null,
      focusSessions: todayFocusSessions.slice(0, 6).map((item) => ({
        id: item.id,
        taskTitle: item.task?.name || "Focus session",
        durationMinutes: item.durationMinutes,
        coinsEarned: item.coinsEarned,
        createdAt: item.startedAt,
      })),
      weekly: weekDates,
      alerts,
      decisionActions: makeDecisionActions({
        nextTask,
        latestCheckin,
        focusMisalignedCount: focusMisalignedTasks.length,
        tasksWithoutTimeCount: tasksWithoutTime.length,
        peakWindow: personalWindows.peakWindow,
      }),
      focusAlignment: {
        alignedCount: focusAlignedTasks.length,
        misalignedCount: focusMisalignedTasks.length,
        alignedTasks: focusAlignedTasks.slice(0, 4),
        misalignedTasks: focusMisalignedTasks.slice(0, 4),
        score: alignmentScore,
      },
      rewards: {
        currentPoints: pointSummary.available,
        earnedPoints: pointSummary.earned,
        spentPoints: pointSummary.spent,
        nextMilestone,
        milestones: rewardMilestones,
        progressToNext: nextMilestone ? Math.min(100, Math.round((pointSummary.available / nextMilestone.points) * 100)) : 0,
        earningRule: "Điểm được tính từ FocusSession COMPLETED trong database.",
        recentRedemptions: rewardRedemptions,
      },
      smartSuggestions,
      weeklyInsight: typedWeeklyInsights[0] || updatedWeeklyInsight,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ message: "Có lỗi xảy ra khi tải dashboard." }, { status: 500 });
  }
}