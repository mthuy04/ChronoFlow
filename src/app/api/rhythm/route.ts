import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type {
  ChronotypeResult,
  Task,
  User,
  WeeklyInsight,
} from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ChronotypeKey = "lion" | "bear" | "wolf" | "dolphin";

type RhythmWindowSource = "energy_checkin" | "chronotype_reference" | "missing";

type EnergyCheckinRow = {
  id: string;
  userId: string;
  score: number;
  note: string | null;
  source: string;
  checkedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type FocusSessionRow = {
  id: string;
  userId: string;
  taskId: string | null;
  status: string;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number;
  coinsEarned: number;
  createdAt: Date;
  updatedAt: Date;
};

type EnergyPoint = {
  hour: string;
  hourNumber: number;
  value: number;
  count: number;
};

type PersonalWindows = {
  peakWindow: string | null;
  lowWindow: string | null;
  recoveryWindow: string | null;
  creativeWindow: string | null;
  source: RhythmWindowSource;
  sourceLabel: string;
};

type RhythmWindow = {
  title: string;
  time: string;
  description: string;
  type: "peak" | "light" | "recovery" | "creative" | "neutral";
};

type DailyTimelineItem = {
  time: string;
  title: string;
  description: string;
  type: "peak" | "light" | "recovery" | "creative" | "neutral";
  shouldDo: string;
  shouldAvoid: string;
};

type RhythmTask = {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  priority: string;
  completed: boolean;
  startTime: string | null;
  endTime: string | null;
  scheduledDate: string | null;
  duration: string | null;
  focusMinutes: number | null;
  explanation: string | null;
};

type SuggestedReschedule = {
  id: string;
  title: string;
  currentTime: string | null;
  currentEndTime: string | null;
  suggestedWindow: string;
  reason: string;
};

type WeeklyRhythm = {
  date: string;
  label: string;
  energyScore: number | null;
  focusMinutes: number;
  totalTasks: number;
  completedTasks: number;
  focusTasks: number;
  alignedTasks: number;
  isToday: boolean;
};

type AssessmentScore = {
  label: string;
  value: number;
  percent: number;
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
  type: "deep" | "admin" | "recovery" | "creative";
};

type PatchPayload = {
  taskId?: string;
  suggestedWindow?: string;
};

const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

const CHRONOTYPE_REFERENCE: Record<
  ChronotypeKey,
  {
    label: string;
    emoji: string;
    summary: string;
    description: string;
    peakWindow: string;
    lowWindow: string;
    recoveryWindow: string;
    creativeWindow: string;
  }
> = {
  lion: {
    label: "Sư tử",
    emoji: "🦁",
    summary: "Bạn thường tỉnh táo sớm, hợp xử lý việc quan trọng vào buổi sáng.",
    description:
      "Sư tử thường có nhịp năng lượng lên sớm, phù hợp với deep work đầu ngày và nên giảm tải vào cuối chiều.",
    peakWindow: "08:00 - 11:00",
    lowWindow: "14:00 - 16:00",
    recoveryWindow: "21:00 - 22:30",
    creativeWindow: "06:30 - 08:00",
  },
  bear: {
    label: "Gấu",
    emoji: "🐻",
    summary: "Bạn thường hợp nhịp làm việc ban ngày, ổn nhất khi lịch đều đặn.",
    description:
      "Gấu thường đi theo nhịp mặt trời, dễ duy trì hiệu suất nếu có giấc ngủ và lịch làm việc ổn định.",
    peakWindow: "09:00 - 12:00",
    lowWindow: "14:00 - 16:00",
    recoveryWindow: "21:30 - 23:00",
    creativeWindow: "10:00 - 12:00",
  },
  wolf: {
    label: "Sói",
    emoji: "🐺",
    summary: "Bạn thường vào guồng muộn hơn, hợp xử lý việc khó vào chiều/tối.",
    description:
      "Sói thường khó bắt đầu sớm nhưng có thể tập trung tốt hơn vào cuối ngày nếu biết bảo vệ năng lượng.",
    peakWindow: "16:00 - 19:00",
    lowWindow: "08:00 - 10:00",
    recoveryWindow: "23:00 - 00:30",
    creativeWindow: "20:00 - 22:00",
  },
  dolphin: {
    label: "Cá heo",
    emoji: "🐬",
    summary: "Bạn nhạy hơn với giấc ngủ, môi trường và áp lực; hợp block ngắn, rõ mục tiêu.",
    description:
      "Cá heo thường cần nhịp làm việc linh hoạt hơn. Các block tập trung ngắn, ít nhiễu và có recovery rõ ràng sẽ phù hợp hơn.",
    peakWindow: "10:00 - 12:00",
    lowWindow: "15:00 - 17:00",
    recoveryWindow: "20:30 - 22:00",
    creativeWindow: "08:30 - 10:00",
  },
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để xem trang Nhịp của tôi." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản người dùng." },
        { status: 404 },
      );
    }

    const todayKey = getVietnamDateKey(new Date());
    const weekRange = getCurrentWeekRange();
    const weekDateKeys = getWeekDateKeys().map((day) => day.key);

    const [
      latestResult,
      tasks,
      energyCheckins,
      focusSessions,
      weeklyInsights,
    ] = await Promise.all([
      prisma.chronotypeResult.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.findMany({
        where: {
          userId: user.id,
          isBacklog: false,
          OR: [
            { scheduledDate: { in: weekDateKeys } },
            { scheduledDate: null },
          ],
        },
        orderBy: [
          { scheduledDate: "asc" },
          { orderIndex: "asc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.energyCheckin.findMany({
        where: {
          userId: user.id,
          checkedAt: {
            gte: getDateDaysAgo(14),
          },
        },
        orderBy: { checkedAt: "asc" },
      }),
      prisma.focusSession.findMany({
        where: {
          userId: user.id,
          startedAt: {
            gte: weekRange.start,
            lt: weekRange.end,
          },
        },
        orderBy: { startedAt: "asc" },
      }),
      prisma.weeklyInsight.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 2,
      }),
    ]);

    const typedEnergyCheckins: EnergyCheckinRow[] = energyCheckins;
    const typedFocusSessions: FocusSessionRow[] = focusSessions;

    const chronotypeKey = getChronotypeKey(user, latestResult);
    const personalWindows = buildPersonalWindows(
      typedEnergyCheckins,
      chronotypeKey,
    );
    const reference = chronotypeKey ? CHRONOTYPE_REFERENCE[chronotypeKey] : null;

    const energyCurve = buildEnergyCurve(typedEnergyCheckins);
    const latestCheckin = getLatestEnergyCheckin(typedEnergyCheckins);

    const taskAlignment = buildTaskAlignment({
      tasks,
      personalWindows,
      todayKey,
    });

    const suggestedReschedules = buildSuggestedReschedules({
      misalignedTasks: taskAlignment.misalignedTasks,
      unscheduledTasks: taskAlignment.unscheduledTasks,
      personalWindows,
    });

    const weekly = buildWeeklyRhythm({
      tasks,
      focusSessions: typedFocusSessions,
      energyCheckins: typedEnergyCheckins,
      todayKey,
      peakWindow: personalWindows.peakWindow,
    });

    const currentWeeklyInsight = weeklyInsights[0] ?? null;
    const previousWeeklyInsight = weeklyInsights[1] ?? null;

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
      dataQuality: {
        energyCheckinCount: typedEnergyCheckins.length,
        hasPersonalEnergyCurve:
          personalWindows.source === "energy_checkin" && energyCurve.length >= 2,
        windowSource: personalWindows.source,
        sourceLabel: personalWindows.sourceLabel,
      },
      chronotype: {
        type: chronotypeKey,
        label: reference?.label ?? null,
        emoji: reference?.emoji ?? null,
        summary: reference?.summary ?? null,
        confidence: getConfidence(latestResult),
        peakWindow: personalWindows.peakWindow,
        lowWindow: personalWindows.lowWindow,
        recoveryWindow: personalWindows.recoveryWindow,
        creativeWindow: personalWindows.creativeWindow,
        description: reference?.description ?? null,
        source: personalWindows.source,
        sourceLabel: personalWindows.sourceLabel,
      },
      currentStatus: buildCurrentStatus({
        latestCheckin,
        personalWindows,
        chronotypeKey,
      }),
      energyCurve: energyCurve.map((item) => ({
        hour: item.hour,
        value: item.value,
        count: item.count,
      })),
      energyCheckins: typedEnergyCheckins
        .slice(-8)
        .reverse()
        .map((item) => ({
          id: item.id,
          score: item.score,
          note: item.note,
          source: item.source,
          checkedAt: item.checkedAt.toISOString(),
        })),
      windows: buildRhythmWindows(personalWindows),
      dailyTimeline: buildDailyTimeline(personalWindows),
      suggestedReschedules,
      weekComparison: buildWeekComparison(
        currentWeeklyInsight,
        previousWeeklyInsight,
      ),
      recoveryWarning: buildRecoveryWarning(user),
      weekly,
      recommendations: buildRecommendations({
        tasks,
        taskAlignment,
        latestCheckin,
        personalWindows,
        focusSessions: typedFocusSessions,
      }),
      taskAlignment,
      sleepRecovery: {
        targetSleepTime: user.targetSleepTime,
        targetWakeTime: user.targetWakeTime,
        recoveryWindow: personalWindows.recoveryWindow,
        hasSleepData: Boolean(user.targetSleepTime && user.targetWakeTime),
      },
      assessment: {
        scores: buildAssessmentScores(latestResult),
        createdAt: latestResult?.createdAt.toISOString() ?? null,
      },
      weeklyInsight: buildWeeklyInsightResponse(currentWeeklyInsight),
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[RHYTHM_GET]", error);

    return NextResponse.json(
      { message: "Không thể tải dữ liệu Nhịp của tôi." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để cập nhật task." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản người dùng." },
        { status: 404 },
      );
    }

    const payload = (await request.json().catch(() => null)) as PatchPayload | null;

    if (!payload?.taskId || !payload.suggestedWindow) {
      return NextResponse.json(
        { message: "Thiếu task hoặc khung giờ cần sắp." },
        { status: 400 },
      );
    }

    const parsedWindow = parseWindow(payload.suggestedWindow);

    if (!parsedWindow) {
      return NextResponse.json(
        { message: "Khung giờ đề xuất không hợp lệ." },
        { status: 400 },
      );
    }

    const task = await prisma.task.findFirst({
      where: {
        id: payload.taskId,
        userId: user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { message: "Không tìm thấy task cần cập nhật." },
        { status: 404 },
      );
    }

    const todayKey = getVietnamDateKey(new Date());

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: {
        scheduledDate: task.scheduledDate ?? todayKey,
        startTime: parsedWindow.startTime,
        endTime: parsedWindow.endTime,
      },
    });

    return NextResponse.json({
      message: "Đã sắp task vào khung giờ phù hợp hơn.",
      task: mapTask(updatedTask),
    });
  } catch (error) {
    console.error("[RHYTHM_PATCH]", error);

    return NextResponse.json(
      { message: "Không thể cập nhật lịch task." },
      { status: 500 },
    );
  }
}

function getChronotypeKey(
  user: User,
  latestResult: ChronotypeResult | null,
): ChronotypeKey | null {
  const rawValue = latestResult?.chronotype ?? user.chronotype;

  if (!rawValue) return null;

  const value = rawValue.toLowerCase();

  if (value.includes("lion") || value.includes("sư tử")) return "lion";
  if (value.includes("bear") || value.includes("gấu")) return "bear";
  if (value.includes("wolf") || value.includes("sói")) return "wolf";
  if (value.includes("dolphin") || value.includes("cá heo")) return "dolphin";

  return null;
}

function getConfidence(latestResult: ChronotypeResult | null) {
  if (!latestResult) return null;

  const scores = [
    latestResult.lionScore,
    latestResult.bearScore,
    latestResult.wolfScore,
    latestResult.dolphinScore,
  ];

  const total = scores.reduce((sum, score) => sum + score, 0);
  const max = Math.max(...scores);

  if (total <= 0) return null;

  return Math.round((max / total) * 100);
}

function buildPersonalWindows(
  energyCheckins: EnergyCheckinRow[],
  chronotypeKey: ChronotypeKey | null,
): PersonalWindows {
  const curve = buildEnergyCurve(energyCheckins);
  const reference = chronotypeKey ? CHRONOTYPE_REFERENCE[chronotypeKey] : null;

  if (curve.length >= 3) {
    const sortedByValue = [...curve].sort((a, b) => b.value - a.value);
    const peakPoint = sortedByValue[0];
    const creativePoint = sortedByValue[1] ?? peakPoint;

    const sortedLow = [...curve].sort((a, b) => a.value - b.value);
    const lowPoint = sortedLow[0];

    return {
      peakWindow: formatWindowFromHour(peakPoint.hourNumber, 2),
      lowWindow: formatWindowFromHour(lowPoint.hourNumber, 2),
      recoveryWindow:
        reference?.recoveryWindow ?? formatWindowFromHour(lowPoint.hourNumber, 1),
      creativeWindow: formatWindowFromHour(creativePoint.hourNumber, 2),
      source: "energy_checkin",
      sourceLabel: `Cá nhân hóa từ ${energyCheckins.length} check-in năng lượng thật`,
    };
  }

  if (reference) {
    return {
      peakWindow: reference.peakWindow,
      lowWindow: reference.lowWindow,
      recoveryWindow: reference.recoveryWindow,
      creativeWindow: reference.creativeWindow,
      source: "chronotype_reference",
      sourceLabel:
        energyCheckins.length > 0
          ? `Dựa trên chronotype và ${energyCheckins.length} check-in gần đây`
          : "Dựa trên chronotype assessment",
    };
  }

  return {
    peakWindow: null,
    lowWindow: null,
    recoveryWindow: null,
    creativeWindow: null,
    source: "missing",
    sourceLabel: "Chưa đủ dữ liệu cá nhân hóa",
  };
}

function buildEnergyCurve(energyCheckins: EnergyCheckinRow[]): EnergyPoint[] {
  const buckets = new Map<number, { total: number; count: number }>();

  energyCheckins.forEach((checkin) => {
    const hour = getVietnamHour(checkin.checkedAt);
    const current = buckets.get(hour) ?? { total: 0, count: 0 };

    buckets.set(hour, {
      total: current.total + checkin.score,
      count: current.count + 1,
    });
  });

  return Array.from(buckets.entries())
    .map(([hourNumber, value]) => ({
      hour: `${String(hourNumber).padStart(2, "0")}h`,
      hourNumber,
      value: Math.round(value.total / value.count),
      count: value.count,
    }))
    .sort((a, b) => a.hourNumber - b.hourNumber);
}

function getLatestEnergyCheckin(
  energyCheckins: EnergyCheckinRow[],
): EnergyCheckinRow | null {
  if (energyCheckins.length === 0) return null;

  return [...energyCheckins].sort(
    (a, b) => b.checkedAt.getTime() - a.checkedAt.getTime(),
  )[0];
}

function buildCurrentStatus({
  latestCheckin,
  personalWindows,
  chronotypeKey,
}: {
  latestCheckin: EnergyCheckinRow | null;
  personalWindows: PersonalWindows;
  chronotypeKey: ChronotypeKey | null;
}) {
  const reference = chronotypeKey ? CHRONOTYPE_REFERENCE[chronotypeKey] : null;

  if (!latestCheckin) {
    return {
      label: "Chưa có check-in",
      score: null,
      description:
        "Check-in năng lượng để ChronoFlow đọc trạng thái hiện tại của bạn.",
      shouldDo: "Cập nhật năng lượng hiện tại.",
      shouldAvoid: "Đừng để planner dựa hoàn toàn vào ước lượng.",
      checkedAt: null,
    };
  }

  const score = latestCheckin.score;

  if (score >= 75) {
    return {
      label: "Năng lượng cao",
      score,
      description:
        "Đây là lúc phù hợp để xử lý task quan trọng, học sâu hoặc phân tích.",
      shouldDo: "Ưu tiên deep work, học sâu, phân tích.",
      shouldAvoid: "Tránh để việc vụn chiếm khung năng lượng tốt.",
      checkedAt: latestCheckin.checkedAt.toISOString(),
    };
  }

  if (score >= 45) {
    return {
      label: "Năng lượng ổn định",
      score,
      description:
        "Bạn có thể xử lý việc vừa sức, review planner hoặc hoàn thiện task đang dang dở.",
      shouldDo: "Làm task vừa sức, checklist, follow-up.",
      shouldAvoid: "Không ép bản thân vào block quá nặng.",
      checkedAt: latestCheckin.checkedAt.toISOString(),
    };
  }

  return {
    label: "Năng lượng thấp",
    score,
    description:
      "Nên giảm tải, nghỉ ngắn hoặc chuyển sang việc nhẹ để giữ nhịp bền hơn.",
    shouldDo: personalWindows.recoveryWindow
      ? `Ưu tiên hồi phục, nhất là gần ${personalWindows.recoveryWindow}.`
      : "Nghỉ ngắn hoặc xử lý việc nhẹ.",
    shouldAvoid: reference
      ? `Tránh ép deep work dài khi nhịp ${reference.label} đang xuống.`
      : "Tránh task quá nặng khi cơ thể đang báo thấp.",
    checkedAt: latestCheckin.checkedAt.toISOString(),
  };
}

function buildRhythmWindows(personalWindows: PersonalWindows): RhythmWindow[] {
  const windows: RhythmWindow[] = [];

  if (personalWindows.peakWindow) {
    windows.push({
      title: "Deep work",
      time: personalWindows.peakWindow,
      description:
        "Khung nên ưu tiên task khó, học sâu, viết báo cáo hoặc phân tích.",
      type: "peak",
    });
  }

  if (personalWindows.lowWindow) {
    windows.push({
      title: "Việc nhẹ",
      time: personalWindows.lowWindow,
      description:
        "Phù hợp cho email, checklist, admin task, follow-up hoặc chuẩn bị tài liệu.",
      type: "light",
    });
  }

  if (personalWindows.creativeWindow) {
    windows.push({
      title: "Sáng tạo",
      time: personalWindows.creativeWindow,
      description:
        "Khung có thể dùng cho brainstorming, viết ý tưởng, thiết kế nhẹ hoặc task mở.",
      type: "creative",
    });
  }

  if (personalWindows.recoveryWindow) {
    windows.push({
      title: "Recovery",
      time: personalWindows.recoveryWindow,
      description:
        "Giảm cường độ, nghỉ ngắn, reflection hoặc chuẩn bị cho ngày tiếp theo.",
      type: "recovery",
    });
  }

  return windows;
}

function buildDailyTimeline(
  personalWindows: PersonalWindows,
): DailyTimelineItem[] {
  const timeline: DailyTimelineItem[] = [];

  if (personalWindows.lowWindow) {
    timeline.push({
      time: personalWindows.lowWindow,
      title: "Khởi động nhẹ",
      description:
        "Chuẩn bị môi trường và xử lý task nhỏ trước khi vào việc khó.",
      type: "light",
      shouldDo: "Setup môi trường, review planner, gom tài liệu.",
      shouldAvoid: "Không mở quá nhiều task nặng cùng lúc.",
    });
  }

  if (personalWindows.peakWindow) {
    timeline.push({
      time: personalWindows.peakWindow,
      title: "Deep work",
      description: "Khung nên ưu tiên việc khó, học sâu hoặc phân tích.",
      type: "peak",
      shouldDo: "Làm task quan trọng, học tập, viết báo cáo.",
      shouldAvoid: "Tránh họp vụn, email, mạng xã hội.",
    });
  }

  if (personalWindows.creativeWindow) {
    timeline.push({
      time: personalWindows.creativeWindow,
      title: "Sáng tạo",
      description: "Khung có thể dùng cho ý tưởng, nội dung, thiết kế nhẹ.",
      type: "creative",
      shouldDo: "Brainstorm, viết ý tưởng, thiết kế nhẹ.",
      shouldAvoid: "Không dồn quá nhiều block liên tiếp.",
    });
  }

  if (personalWindows.recoveryWindow) {
    timeline.push({
      time: personalWindows.recoveryWindow,
      title: "Recovery",
      description: "Giảm kích thích, reflection và chuẩn bị cho ngày sau.",
      type: "recovery",
      shouldDo: "Nghỉ, reflection, chuẩn bị ngày mai.",
      shouldAvoid: "Tránh task mới quá muộn.",
    });
  }

  return timeline;
}

function buildTaskAlignment({
  tasks,
  personalWindows,
  todayKey,
}: {
  tasks: Task[];
  personalWindows: PersonalWindows;
  todayKey: string;
}) {
  const focusWindow = personalWindows.peakWindow ?? "chưa xác định";
  const parsedPeak = personalWindows.peakWindow
    ? parseWindow(personalWindows.peakWindow)
    : null;

  const todayTasks = tasks.filter(
    (task) =>
      !task.completed &&
      (task.scheduledDate === todayKey || task.scheduledDate === null),
  );

  const focusTasks = todayTasks.filter((task) =>
    isFocusTask(String(task.type)),
  );

  const alignedTasks: RhythmTask[] = [];
  const misalignedTasks: RhythmTask[] = [];
  const unscheduledTasks: RhythmTask[] = [];

  focusTasks.forEach((task) => {
    const mappedTask = mapTask(task);

    if (!task.startTime || !parsedPeak) {
      unscheduledTasks.push(mappedTask);
      return;
    }

    const taskHour = parseStartHour(task.startTime);

    if (taskHour === null) {
      unscheduledTasks.push(mappedTask);
      return;
    }

    if (taskHour >= parsedPeak.startHour && taskHour < parsedPeak.endHour) {
      alignedTasks.push(mappedTask);
    } else {
      misalignedTasks.push(mappedTask);
    }
  });

  const focusTaskCount = focusTasks.length;
  const score =
    focusTaskCount > 0
      ? Math.round((alignedTasks.length / focusTaskCount) * 100)
      : 0;

  return {
    score,
    focusWindow,
    alignedTasks,
    misalignedTasks,
    unscheduledTasks,
    alignedCount: alignedTasks.length,
    misalignedCount: misalignedTasks.length,
    unscheduledCount: unscheduledTasks.length,
    focusTaskCount,
  };
}

function buildSuggestedReschedules({
  misalignedTasks,
  unscheduledTasks,
  personalWindows,
}: {
  misalignedTasks: RhythmTask[];
  unscheduledTasks: RhythmTask[];
  personalWindows: PersonalWindows;
}): SuggestedReschedule[] {
  if (!personalWindows.peakWindow) return [];

  const candidates = [
    ...misalignedTasks.map((task) => ({
      task,
      reason:
        "Task deep work / học tập đang nằm ngoài peak window hiện tại của bạn.",
    })),
    ...unscheduledTasks.map((task) => ({
      task,
      reason:
        "Task deep work / học tập chưa có giờ bắt đầu nên ChronoFlow chưa thể xếp đúng nhịp.",
    })),
  ];

  return candidates.slice(0, 5).map((candidate, index) => {
    const suggestedWindow = buildSuggestedWindowSlot(
      personalWindows.peakWindow ?? "",
      index,
    );

    return {
      id: candidate.task.id,
      title: candidate.task.title,
      currentTime: candidate.task.startTime,
      currentEndTime: candidate.task.endTime,
      suggestedWindow,
      reason: candidate.reason,
    };
  });
}

function buildSuggestedWindowSlot(window: string, index: number) {
  const parsed = parseWindow(window);

  if (!parsed) return window;

  const startHour = clampHour(parsed.startHour + index);
  const endHour = clampHour(startHour + 1);

  if (startHour >= parsed.endHour) return window;

  return `${formatClockHour(startHour)} - ${formatClockHour(endHour)}`;
}

function buildWeeklyRhythm({
  tasks,
  focusSessions,
  energyCheckins,
  todayKey,
  peakWindow,
}: {
  tasks: Task[];
  focusSessions: FocusSessionRow[];
  energyCheckins: EnergyCheckinRow[];
  todayKey: string;
  peakWindow: string | null;
}): WeeklyRhythm[] {
  const weekDays = getWeekDateKeys();
  const parsedPeak = peakWindow ? parseWindow(peakWindow) : null;

  return weekDays.map((day) => {
    const dayTasks = tasks.filter((task) => task.scheduledDate === day.key);
    const focusTasks = dayTasks.filter((task) => isFocusTask(String(task.type)));
    const completedTasks = dayTasks.filter((task) => task.completed);

    const alignedTasks = focusTasks.filter((task) => {
      if (!task.startTime || !parsedPeak) return false;

      const startHour = parseStartHour(task.startTime);
      if (startHour === null) return false;

      return startHour >= parsedPeak.startHour && startHour < parsedPeak.endHour;
    });

    const dayFocusMinutes = focusSessions
      .filter((sessionItem) => getVietnamDateKey(sessionItem.startedAt) === day.key)
      .reduce((sum, sessionItem) => sum + sessionItem.durationMinutes, 0);

    const latestDayCheckin =
      energyCheckins
        .filter((checkin) => getVietnamDateKey(checkin.checkedAt) === day.key)
        .sort((a, b) => b.checkedAt.getTime() - a.checkedAt.getTime())[0] ??
      null;

    return {
      date: day.key,
      label: day.label,
      energyScore: latestDayCheckin?.score ?? null,
      focusMinutes: dayFocusMinutes,
      totalTasks: dayTasks.length,
      completedTasks: completedTasks.length,
      focusTasks: focusTasks.length,
      alignedTasks: alignedTasks.length,
      isToday: day.key === todayKey,
    };
  });
}

function buildRecommendations({
  tasks,
  taskAlignment,
  latestCheckin,
  personalWindows,
  focusSessions,
}: {
  tasks: Task[];
  taskAlignment: ReturnType<typeof buildTaskAlignment>;
  latestCheckin: EnergyCheckinRow | null;
  personalWindows: PersonalWindows;
  focusSessions: FocusSessionRow[];
}): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (!latestCheckin) {
    recommendations.push({
      id: "energy-checkin",
      title: "Check-in năng lượng",
      description:
        "Cập nhật trạng thái hiện tại để ChronoFlow gợi ý nên làm việc nặng hay việc nhẹ.",
      type: "recovery",
    });
  }

  if (taskAlignment.misalignedCount > 0) {
    recommendations.push({
      id: "reschedule-focus-task",
      title: "Sắp lại task lệch nhịp",
      description: `${taskAlignment.misalignedCount} task deep work / học tập đang nằm ngoài peak window.`,
      type: "deep",
    });
  }

  if (taskAlignment.unscheduledCount > 0) {
    recommendations.push({
      id: "schedule-unscheduled-task",
      title: "Gắn giờ cho task quan trọng",
      description: `${taskAlignment.unscheduledCount} task deep work / học tập chưa có giờ bắt đầu nên chưa thể đo alignment.`,
      type: "admin",
    });
  }

  const incompleteTasks = tasks.filter((task) => !task.completed);

  if (incompleteTasks.length === 0) {
    recommendations.push({
      id: "add-first-task",
      title: "Thêm task đầu tiên cho hôm nay",
      description: personalWindows.peakWindow
        ? `Đặt task quan trọng vào ${personalWindows.peakWindow} để ChronoFlow theo dõi độ khớp.`
        : "Thêm task vào planner để ChronoFlow bắt đầu đọc nhịp làm việc của bạn.",
      type: "admin",
    });
  }

  const completedFocusMinutes = focusSessions.reduce(
    (sum, sessionItem) => sum + sessionItem.durationMinutes,
    0,
  );

  if (completedFocusMinutes === 0) {
    recommendations.push({
      id: "start-focus-session",
      title: "Bắt đầu một focus session thật",
      description:
        "Focus session giúp Rhythm page có dữ liệu thực tế về thời gian tập trung.",
      type: "deep",
    });
  }

  if (personalWindows.source === "chronotype_reference") {
    recommendations.push({
      id: "add-more-checkins",
      title: "Check-in ở nhiều khung giờ hơn",
      description:
        "Dữ liệu hiện tại vẫn đang dựa nhiều vào chronotype. Hãy check-in thêm sáng, chiều và tối để cá nhân hóa chính xác hơn.",
      type: "creative",
    });
  }

  if (latestCheckin && latestCheckin.score <= 40) {
    recommendations.push({
      id: "recovery-now",
      title: "Ưu tiên hồi phục",
      description:
        "Check-in gần nhất đang thấp. Nên chọn việc nhẹ hoặc nghỉ ngắn trước khi làm task nặng.",
      type: "recovery",
    });
  }

  return recommendations.slice(0, 4);
}

function buildRecoveryWarning(user: User) {
  if (!user.targetSleepTime || !user.targetWakeTime) {
    return {
      level: "warning",
      title: "Chưa có dữ liệu giấc ngủ mục tiêu",
      description:
        "Cập nhật giờ ngủ và giờ dậy để ChronoFlow cá nhân hóa recovery tốt hơn.",
      action: "Cập nhật hồ sơ",
    };
  }

  return undefined;
}

function buildAssessmentScores(
  latestResult: ChronotypeResult | null,
): AssessmentScore[] | null {
  if (!latestResult) return null;

  const scores = [
    { label: "Sư tử", value: latestResult.lionScore },
    { label: "Gấu", value: latestResult.bearScore },
    { label: "Sói", value: latestResult.wolfScore },
    { label: "Cá heo", value: latestResult.dolphinScore },
  ];

  const max = Math.max(...scores.map((score) => score.value), 1);

  return scores.map((score) => ({
    label: score.label,
    value: score.value,
    percent: Math.round((score.value / max) * 100),
  }));
}

function buildWeeklyInsightResponse(insight: WeeklyInsight | null) {
  if (!insight) return null;

  return {
    weekLabel: insight.weekLabel,
    alignmentScore: insight.alignmentScore,
    completedCount: insight.completedCount,
    totalCount: insight.totalCount,
    deepWorkCount: insight.deepWorkCount,
    recommendation: insight.recommendation,
    summary: insight.summary,
  };
}

function buildWeekComparison(
  current: WeeklyInsight | null,
  previous: WeeklyInsight | null,
) {
  if (!current || !previous) return null;

  return {
    currentWeek: current.weekLabel,
    previousWeek: previous.weekLabel,
    alignmentDelta: current.alignmentScore - previous.alignmentScore,
    completedDelta: current.completedCount - previous.completedCount,
    deepWorkDelta: current.deepWorkCount - previous.deepWorkCount,
  };
}

function mapTask(task: Task): RhythmTask {
  return {
    id: task.id,
    title: task.name,
    type: String(task.type),
    typeLabel: getTaskTypeLabel(String(task.type)),
    priority: String(task.priority),
    completed: task.completed,
    startTime: task.startTime,
    endTime: task.endTime,
    scheduledDate: task.scheduledDate,
    duration: task.duration,
    focusMinutes: task.focusMinutes,
    explanation: task.explanation,
  };
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

  return labels[type] ?? "Task";
}

function isFocusTask(type: string) {
  return type === "DEEP_WORK" || type === "STUDY";
}

function parseStartHour(time: string) {
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?/);

  if (!match) return null;

  const hour = Number(match[1]);

  if (!Number.isFinite(hour)) return null;

  return clampHour(hour);
}

function parseWindow(window: string) {
  const matches = window.matchAll(/(\d{1,2}):(\d{2})/g);
  const parsed = Array.from(matches).map((match) => ({
    hour: Number(match[1]),
    minute: Number(match[2]),
  }));

  if (parsed.length < 2) return null;

  const start = parsed[0];
  const end = parsed[1];

  if (
    !Number.isFinite(start.hour) ||
    !Number.isFinite(start.minute) ||
    !Number.isFinite(end.hour) ||
    !Number.isFinite(end.minute)
  ) {
    return null;
  }

  return {
    startHour: clampHour(start.hour),
    endHour: clampHour(end.hour),
    startTime: `${String(clampHour(start.hour)).padStart(2, "0")}:${String(
      start.minute,
    ).padStart(2, "0")}`,
    endTime: `${String(clampHour(end.hour)).padStart(2, "0")}:${String(
      end.minute,
    ).padStart(2, "0")}`,
  };
}

function formatWindowFromHour(startHour: number, durationHours: number) {
  const safeStart = clampHour(startHour);
  const safeEnd = clampHour(safeStart + durationHours);

  return `${formatClockHour(safeStart)} - ${formatClockHour(safeEnd)}`;
}

function formatClockHour(hour: number) {
  return `${String(clampHour(hour)).padStart(2, "0")}:00`;
}

function clampHour(hour: number) {
  if (!Number.isFinite(hour)) return 0;

  if (hour < 0) return 0;
  if (hour > 23) return 23;

  return Math.round(hour);
}

function getVietnamHour(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: VIETNAM_TIMEZONE,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hourPart = parts.find((part) => part.type === "hour");
  const hour = Number(hourPart?.value ?? "0");

  if (!Number.isFinite(hour)) return 0;

  return clampHour(hour);
}

function getVietnamDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function getDateDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return date;
}

function getCurrentWeekRange() {
  const now = new Date();
  const vietnamDateKey = getVietnamDateKey(now);
  const vietnamToday = new Date(`${vietnamDateKey}T00:00:00+07:00`);
  const day = vietnamToday.getDay() || 7;

  const start = new Date(vietnamToday);
  start.setDate(vietnamToday.getDate() - day + 1);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

function getWeekDateKeys() {
  const range = getCurrentWeekRange();
  const labels = ["TH 2", "TH 3", "TH 4", "TH 5", "TH 6", "TH 7", "CN"];

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(range.start);
    date.setDate(range.start.getDate() + index);

    return {
      key: getVietnamDateKey(date),
      label: labels[index] ?? "",
    };
  });
}