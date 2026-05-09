"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { emitCoinLanded } from "@/lib/coin-reward-events";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Coins,
  Coffee,
  Flame,
  Gift,
  Loader2,
  PackageCheck,
  Play,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  Target,
  Timer,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

type Tone = "purple" | "blue" | "orange" | "green";
type SuggestionTone = "warning" | "info" | "success";
type TaskTypeValue =
  | "DEEP_WORK"
  | "STUDY"
  | "CREATIVE"
  | "ADMIN"
  | "ROUTINE"
  | "PERSONAL";
type PriorityValue = "HIGH" | "MEDIUM" | "LOW";

type EnergyPoint = {
  hour: string;
  value: number;
};

type EnergyCheckin = {
  id: string;
  userId: string;
  score: number;
  note: string | null;
  source: string;
  checkedAt: string;
  createdAt: string;
  updatedAt: string;
};

type EnergyRecommendation = {
  status: "aligned" | "move_to_peak" | "recovery" | "low_energy_ok" | "unscheduled";
  label: string;
  description: string;
};

type DashboardTask = {
  id: string;
  title: string;
  type?: "deep" | "admin" | "creative" | "recovery" | string;
  originalType?: string;
  typeLabel?: string;
  priority?: string;
  priorityWeight?: number;
  status?: "todo" | "in_progress" | "done" | string;
  startTime?: string | null;
  endTime?: string | null;
  estimatedMinutes?: number | null;
  focusMinutes?: number | null;
  coins?: number | null;
  explanation?: string | null;
  isAligned?: boolean;
  alignmentLabel?: string;
  energyRecommendation?: EnergyRecommendation;
};

type FocusSession = {
  id: string;
  taskTitle?: string | null;
  durationMinutes: number;
  coinsEarned?: number | null;
  createdAt?: string | null;
};

type ActiveFocusSession = {
  id: string;
  taskId?: string | null;
  startedAt: string;
  task?: {
    id: string;
    name: string;
    type: string;
    startTime?: string | null;
    endTime?: string | null;
    duration?: string | null;
  } | null;
};

type ActionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  tone?: SuggestionTone;
};

type RewardMilestone = {
  id: string;
  slug?: string;
  title: string;
  description?: string | null;
  points: number;
  unlocked: boolean;
};

type RewardRedemption = {
  id: string;
  rewardItemId?: string | null;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  recipientName: string;
  phone: string;
  address: string;
  note?: string | null;
  status: string;
  createdAt: string;
};

type DashboardData = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  chronotype?: {
    type?: string | null;
    label?: string | null;
    peakWindow?: string | null;
    lowWindow?: string | null;
    recoveryWindow?: string | null;
    description?: string | null;
  } | null;
  today?: {
    energyScore?: number | null;
    focusMinutes?: number | null;
    coins?: number | null;
    coinsToday?: number | null;
    streak?: number | null;
    completedTasks?: number | null;
    totalTasks?: number | null;
    pendingTasks?: number | null;
    activeTasks?: number | null;
    backlogTasks?: number | null;
    allCompletedTasks?: number | null;
    completionRate?: number | null;
    alignmentScore?: number | null;
  } | null;
  nowStatus?: {
    label: string;
    description: string;
    tone: string;
    currentTime?: string;
  };
  energyInsight?: {
    currentTime?: string;
    summary?: string;
    peakWindow?: string | null;
    recoveryWindow?: string | null;
  };
  energyCurve?: EnergyPoint[];
  energyCheckins?: EnergyCheckin[];
  tasks?: DashboardTask[];
  nextTask?: DashboardTask | null;
  priorityQueue?: DashboardTask[];
  activeFocusSession?: ActiveFocusSession | null;
  focusSessions?: FocusSession[];
  weekly?: {
    date: string;
    label?: string;
    focusMinutes?: number | null;
    completedTasks?: number | null;
    totalTasks?: number | null;
    coins?: number | null;
    energyScore?: number | null;
    isToday?: boolean;
  }[];
  alerts?: {
    id: string;
    title: string;
    description: string;
    type?: SuggestionTone;
  }[];
  decisionActions?: ActionItem[];
  focusAlignment?: {
    alignedCount: number;
    misalignedCount: number;
    alignedTasks: DashboardTask[];
    misalignedTasks: DashboardTask[];
    score?: number;
  };
  rewards?: {
    currentPoints: number;
    earnedPoints?: number;
    spentPoints?: number;
    nextMilestone?: RewardMilestone | null;
    milestones: RewardMilestone[];
    progressToNext: number;
    earningRule?: string;
    recentRedemptions?: RewardRedemption[];
  };
  smartSuggestions?: ActionItem[];
  weeklyInsight?: {
    weekLabel?: string;
    alignmentScore?: number;
    completedCount?: number;
    totalCount?: number;
    deepWorkCount?: number;
    recommendation?: string;
    summary?: string;
  } | null;
};

type TaskTone = {
  label: string;
  pill: string;
  dot: string;
  card: string;
};

type QuickTaskForm = {
  name: string;
  type: TaskTypeValue;
  priority: PriorityValue;
  durationMinutes: string;
  scheduledDate: string;
  startTime: string;
};

type EnergyCheckinForm = {
  score: string;
  note: string;
};

type RedeemForm = {
  rewardItemId: string;
  recipientName: string;
  phone: string;
  address: string;
  note: string;
};

type StartFocusResponse = {
  message?: string;
  focusSession?: ActiveFocusSession;
};

type StreakRewardResponse = {
  awarded: boolean;
  milestone: number;
  coinsEarned: number;
  currentStreak: number;
  nextCoinBalance: number;
};

type FinishFocusResponse = {
  message?: string;
  durationMinutes?: number;
  coinsEarned?: number;
  taskCoinsEarned?: number;
  nextCoinBalance?: number;
  streakReward?: StreakRewardResponse | null;
};

type BasicApiResponse = {
  message?: string;
  nextCoinBalance?: number;
};

const taskToneMap: Record<string, TaskTone> = {
  deep: {
    label: "Deep work",
    pill: "bg-[#F3F0FF] text-[#6F59FF]",
    dot: "bg-[#6F59FF]",
    card: "border-[#E9E5FF] bg-[#FBF9FF]",
  },
  admin: {
    label: "Việc nhẹ",
    pill: "bg-[#EEF6FF] text-[#4DA8FF]",
    dot: "bg-[#4DA8FF]",
    card: "border-[#DDEEFF] bg-[#F8FCFF]",
  },
  creative: {
    label: "Sáng tạo",
    pill: "bg-[#FFF7ED] text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    card: "border-[#FFE6C7] bg-[#FFFDF8]",
  },
  recovery: {
    label: "Hồi phục",
    pill: "bg-[#ECFDF5] text-[#10B981]",
    dot: "bg-[#10B981]",
    card: "border-[#D1FAE5] bg-[#FBFFFE]",
  },
};

const taskTypeOptions: { value: TaskTypeValue; label: string }[] = [
  { value: "DEEP_WORK", label: "Deep work" },
  { value: "STUDY", label: "Học tập" },
  { value: "CREATIVE", label: "Sáng tạo" },
  { value: "ADMIN", label: "Việc nhẹ" },
  { value: "ROUTINE", label: "Routine" },
  { value: "PERSONAL", label: "Cá nhân" },
];

const priorityOptions: { value: PriorityValue; label: string }[] = [
  { value: "HIGH", label: "Cao" },
  { value: "MEDIUM", label: "Vừa" },
  { value: "LOW", label: "Thấp" },
];

export default function DashboardClientUI() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickTaskForm, setQuickTaskForm] = useState<QuickTaskForm>({
    name: "",
    type: "DEEP_WORK",
    priority: "MEDIUM",
    durationMinutes: "45",
    scheduledDate: todayKey(),
    startTime: "",
  });
  const [quickAddLoading, setQuickAddLoading] = useState(false);
  const [quickAddError, setQuickAddError] = useState<string | null>(null);

  const [energyOpen, setEnergyOpen] = useState(false);
  const [energyForm, setEnergyForm] = useState<EnergyCheckinForm>({
    score: "",
    note: "",
  });
  const [energyLoading, setEnergyLoading] = useState(false);
  const [energyError, setEnergyError] = useState<string | null>(null);

  const [activeFocus, setActiveFocus] = useState<ActiveFocusSession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [focusLoading, setFocusLoading] = useState(false);
  const [focusMessage, setFocusMessage] = useState<string | null>(null);

  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [redeemForm, setRedeemForm] = useState<RedeemForm>({
    rewardItemId: "",
    recipientName: "",
    phone: "",
    address: "",
    note: "",
  });

  async function loadDashboard(showRefreshing = false) {
    try {
      if (showRefreshing) setRefreshing(true);
      setError(null);

      const res = await fetch("/api/dashboard", {
        method: "GET",
        cache: "no-store",
      });

      if (res.status === 401) {
        throw new Error("Bạn cần đăng nhập để xem dashboard.");
      }

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as BasicApiResponse | null;
        throw new Error(json?.message || "Không thể tải dữ liệu dashboard.");
      }

      const json = (await res.json()) as DashboardData;
      setData(json);
      setActiveFocus(json.activeFocusSession || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      loadDashboard(false);
    }, 60000);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!activeFocus) {
      setElapsedSeconds(0);
      return;
    }

    const updateElapsed = () => {
      const startedAt = new Date(activeFocus.startedAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - startedAt) / 1000));
      setElapsedSeconds(diff);
    };

    updateElapsed();

    const id = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(id);
  }, [activeFocus]);

  const today = data?.today;
  const tasks = data?.tasks ?? [];
  const priorityQueue = data?.priorityQueue ?? [];
  const focusSessions = data?.focusSessions ?? [];
  const weekly = data?.weekly ?? [];
  const chronotype = data?.chronotype;
  const displayName = data?.user?.name || "bạn";
  const energyCurve = data?.energyCurve ?? [];

  const nextTask = useMemo(() => {
    return (
      data?.nextTask ||
      priorityQueue[0] ||
      tasks.find((task) => task.status !== "done") ||
      null
    );
  }, [data, priorityQueue, tasks]);

  const donePercent = useMemo(() => {
    const total = today?.totalTasks ?? tasks.length;
    const done = today?.completedTasks ?? tasks.filter((task) => task.status === "done").length;

    if (!total) return 0;
    return Math.round((done / total) * 100);
  }, [today, tasks]);

  const decisionActions = useMemo<ActionItem[]>(() => {
    if (data?.decisionActions?.length) return data.decisionActions;

    if (nextTask) {
      return [
        {
          id: "next-task",
          title: `Làm tiếp: ${nextTask.title}`,
          description: `${nextTask.typeLabel || "Task"} · ${formatTimeRange(
            nextTask.startTime,
            nextTask.endTime,
          )}`,
          href: `/planner?taskId=${nextTask.id}`,
          cta: "Mở task",
          tone: "success",
        },
      ];
    }

    return [
      {
        id: "create-task",
        title: "Bắt đầu bằng một task quan trọng",
        description: "Thêm task đầu tiên và chọn khung giờ dự kiến.",
        href: "/planner",
        cta: "Thêm task",
        tone: "info",
      },
    ];
  }, [data, nextTask]);

  const suggestedPeakStart = useMemo(() => {
    return getStartFromWindow(chronotype?.peakWindow || data?.energyInsight?.peakWindow || null);
  }, [chronotype, data]);

  async function handleCreateTask(formOverride?: Partial<QuickTaskForm>) {
    try {
      setQuickAddLoading(true);
      setQuickAddError(null);

      const payload = {
        ...quickTaskForm,
        ...formOverride,
      };

      const name = payload.name.trim();
      if (!name) {
        throw new Error("Tên task không được để trống.");
      }

      const res = await fetch("/api/dashboard/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type: payload.type,
          priority: payload.priority,
          durationMinutes: Number(payload.durationMinutes || 45),
          scheduledDate: payload.scheduledDate || todayKey(),
          startTime: payload.startTime,
        }),
      });

      const json = (await res.json().catch(() => null)) as BasicApiResponse | null;

      if (!res.ok) {
        throw new Error(json?.message || "Không thể tạo task.");
      }

      setQuickAddOpen(false);
      setQuickTaskForm({
        name: "",
        type: "DEEP_WORK",
        priority: "MEDIUM",
        durationMinutes: "45",
        scheduledDate: todayKey(),
        startTime: "",
      });

      await loadDashboard(true);
    } catch (err) {
      setQuickAddError(err instanceof Error ? err.message : "Không thể tạo task.");
    } finally {
      setQuickAddLoading(false);
    }
  }

  async function handleEnergyCheckinSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setEnergyLoading(true);
      setEnergyError(null);

      const score = Number(energyForm.score);

      const res = await fetch("/api/dashboard/energy/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          note: energyForm.note,
        }),
      });

      const json = (await res.json().catch(() => null)) as BasicApiResponse | null;

      if (!res.ok) {
        throw new Error(json?.message || "Không thể lưu check-in năng lượng.");
      }

      setEnergyOpen(false);
      setEnergyForm({ score: "", note: "" });
      await loadDashboard(true);
    } catch (err) {
      setEnergyError(err instanceof Error ? err.message : "Không thể lưu check-in năng lượng.");
    } finally {
      setEnergyLoading(false);
    }
  }

  async function handleStartFocus(taskId?: string | null) {
    try {
      setFocusLoading(true);
      setFocusMessage(null);

      const res = await fetch("/api/dashboard/focus/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId || null,
        }),
      });

      const json = (await res.json().catch(() => null)) as StartFocusResponse | null;

      if (!res.ok) {
        throw new Error(json?.message || "Không thể bắt đầu focus session.");
      }

      if (json?.focusSession) {
        setActiveFocus(json.focusSession);
      }

      setFocusMessage("Phiên focus đã bắt đầu.");
      await loadDashboard(false);
    } catch (err) {
      setFocusMessage(err instanceof Error ? err.message : "Không thể bắt đầu focus session.");
    } finally {
      setFocusLoading(false);
    }
  }

  async function handleFinishFocus(completeTask = true) {
    try {
      if (!activeFocus) return;

      setFocusLoading(true);
      setFocusMessage(null);

      const res = await fetch("/api/dashboard/focus/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          focusSessionId: activeFocus.id,
          completeTask,
        }),
      });

      const json = (await res.json().catch(() => null)) as FinishFocusResponse | null;

      if (!res.ok) {
        throw new Error(json?.message || "Không thể kết thúc focus session.");
      }

      const streakRewardText = json?.streakReward?.awarded
        ? ` 🔥 Bạn mở khóa streak ${json.streakReward.milestone} ngày và nhận thêm +${json.streakReward.coinsEarned} coins!`
        : "";

      setActiveFocus(null);
      setElapsedSeconds(0);
      setFocusMessage(
        `Đã lưu ${json?.durationMinutes ?? 0} phút focus và +${
          json?.coinsEarned ?? 0
        } điểm.${streakRewardText}`,
      );

      const totalAwardedCoins =
        (json?.coinsEarned ?? 0) +
        (json?.taskCoinsEarned ?? 0) +
        (json?.streakReward?.awarded ? json.streakReward.coinsEarned : 0);

      if (
        typeof json?.nextCoinBalance === "number" ||
        totalAwardedCoins !== 0
      ) {
        emitCoinLanded({
          amount: totalAwardedCoins,
          nextBalance: json?.nextCoinBalance,
        });
      }

      await loadDashboard(true);
    } catch (err) {
      setFocusMessage(err instanceof Error ? err.message : "Không thể kết thúc focus session.");
    } finally {
      setFocusLoading(false);
    }
  }

  function openRedeemModal(reward?: RewardMilestone | null) {
    const firstReward =
      reward || data?.rewards?.nextMilestone || data?.rewards?.milestones?.[0] || null;

    setRedeemForm({
      rewardItemId: firstReward?.id || "",
      recipientName: displayName === "bạn" ? "" : displayName,
      phone: "",
      address: "",
      note: "",
    });
    setRedeemError(null);
    setRedeemSuccess(null);
    setRedeemOpen(true);
  }

  async function handleRedeemSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setRedeemLoading(true);
      setRedeemError(null);
      setRedeemSuccess(null);

      const res = await fetch("/api/dashboard/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(redeemForm),
      });

      const json = (await res.json().catch(() => null)) as BasicApiResponse | null;

      if (!res.ok) {
        throw new Error(json?.message || "Không thể gửi yêu cầu đổi thưởng.");
      }

      const redeemedReward = data?.rewards?.milestones.find(
        (item) => item.id === redeemForm.rewardItemId,
      );

      if (typeof json?.nextCoinBalance === "number") {
        emitCoinLanded({
          amount: redeemedReward ? -redeemedReward.points : 0,
          nextBalance: json.nextCoinBalance,
        });
      }

      setRedeemSuccess("Yêu cầu đổi thưởng đã được ghi nhận.");
      await loadDashboard(true);
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : "Không thể gửi yêu cầu đổi thưởng.");
    } finally {
      setRedeemLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-[32px] border border-white/80 bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(26,21,40,0.08)] backdrop-blur-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#6F59FF]" />
            <div className="mt-4 text-[18px] font-[900] text-[#1A1528]">
              Đang tải dashboard...
            </div>
            <p className="mt-2 text-[14px] font-medium text-[#6B647C]">
              ChronoFlow đang lấy dữ liệu thật từ tài khoản của bạn.
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="max-w-[520px] rounded-[36px] border border-white/80 bg-white/85 p-8 text-center shadow-[0_24px_80px_rgba(26,21,40,0.08)] backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F59E0B]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-[28px] font-[900] tracking-[-0.03em] text-[#1A1528]">
              Dashboard chưa tải được
            </h1>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#6B647C]">
              {error}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => loadDashboard(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[14px] font-bold text-white shadow-xl transition hover:-translate-y-0.5"
              >
                <RefreshCw className="h-4 w-4" />
                Tải lại
              </button>
              <Link
                href="/auth/login?callbackUrl=/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-5 py-3 text-[14px] font-bold text-[#1A1528] shadow-sm transition hover:-translate-y-0.5"
              >
                Đăng nhập
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <HeroHeader
        displayName={displayName}
        refreshing={refreshing}
        onRefresh={() => loadDashboard(true)}
        onOpenQuickAdd={() => setQuickAddOpen(true)}
        onOpenEnergy={() => setEnergyOpen(true)}
        currentTime={data?.energyInsight?.currentTime || data?.nowStatus?.currentTime}
      />

      <SectionWrapper>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Năng lượng hiện tại"
            value={formatEnergyScore(today?.energyScore)}
            helper={getEnergyLabel(today?.energyScore)}
            icon={<Activity className="h-5 w-5" />}
            tone="purple"
          />
          <StatCard
            label="Focus hôm nay"
            value={formatMinutes(today?.focusMinutes ?? 0)}
            helper={`${focusSessions.length} phiên đã ghi nhận`}
            icon={<Timer className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Điểm khả dụng"
            value={`${today?.coins ?? 0}`}
            helper={`+${today?.coinsToday ?? 0} điểm hôm nay`}
            icon={<Coins className="h-5 w-5" />}
            tone="orange"
          />
          <StatCard
            label="Tiến độ hôm nay"
            value={`${donePercent}%`}
            helper={`${today?.completedTasks ?? 0}/${today?.totalTasks ?? 0} task hoàn thành`}
            icon={<Flame className="h-5 w-5" />}
            tone="green"
          />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <CommandCenter
          today={today}
          nextTask={nextTask}
          chronotype={chronotype}
          nowStatus={data?.nowStatus}
          donePercent={donePercent}
          actions={decisionActions}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
          onOpenEnergy={() => setEnergyOpen(true)}
          onCreateSampleTask={(sample) => handleCreateTask(sample)}
          suggestedPeakStart={suggestedPeakStart}
          quickAddLoading={quickAddLoading}
        />
      </SectionWrapper>

      <SectionWrapper>
        <EnergyPanel
          chronotype={chronotype}
          energyCurve={energyCurve}
          energyScore={today?.energyScore ?? null}
          insight={data?.energyInsight}
          checkins={data?.energyCheckins ?? []}
          onOpenEnergy={() => setEnergyOpen(true)}
        />
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid items-start gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <FocusCard
            nextTask={nextTask}
            chronotype={chronotype}
            activeFocus={activeFocus}
            elapsedSeconds={elapsedSeconds}
            focusLoading={focusLoading}
            focusMessage={focusMessage}
            onStartFocus={handleStartFocus}
            onFinishFocus={handleFinishFocus}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
          />
          <SmartSuggestions
            suggestions={data?.smartSuggestions ?? []}
            onOpenQuickAdd={() => setQuickAddOpen(true)}
            onOpenEnergy={() => setEnergyOpen(true)}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <PlannerBoard tasks={tasks} priorityQueue={priorityQueue} onOpenQuickAdd={() => setQuickAddOpen(true)} />
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <FocusAlignmentPanel alignment={data?.focusAlignment} />
          <RewardProgress rewards={data?.rewards} onRedeem={openRedeemModal} />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <WeekCalendar weekly={weekly} />
          <RecentFocus sessions={focusSessions} />
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <WeeklyInsightPanel data={data} />
          <AttentionPanel alerts={data?.alerts ?? []} tasks={tasks} />
        </div>
      </SectionWrapper>

      <QuickAddTaskModal
        open={quickAddOpen}
        form={quickTaskForm}
        loading={quickAddLoading}
        error={quickAddError}
        suggestedPeakStart={suggestedPeakStart}
        onClose={() => setQuickAddOpen(false)}
        onChange={setQuickTaskForm}
        onSubmit={() => handleCreateTask()}
      />

      <EnergyCheckinModal
        open={energyOpen}
        form={energyForm}
        loading={energyLoading}
        error={energyError}
        onClose={() => setEnergyOpen(false)}
        onChange={setEnergyForm}
        onSubmit={handleEnergyCheckinSubmit}
      />

      <RedeemModal
        open={redeemOpen}
        form={redeemForm}
        rewards={data?.rewards?.milestones ?? []}
        availablePoints={data?.rewards?.currentPoints ?? 0}
        loading={redeemLoading}
        error={redeemError}
        success={redeemSuccess}
        onClose={() => setRedeemOpen(false)}
        onChange={setRedeemForm}
        onSubmit={handleRedeemSubmit}
      />
    </DashboardShell>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] pb-24 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <BackgroundPattern />

        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}

function BackgroundPattern() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-5%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/60 blur-[110px]" />
        <div className="absolute right-[-7%] top-[8%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/60 blur-[110px]" />
        <div className="absolute bottom-[12%] left-[35%] h-[460px] w-[460px] rounded-full bg-white/70 blur-[120px]" />
      </div>
    </>
  );
}

function SectionWrapper({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/62 px-5 py-8 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl md:px-8 md:py-10"
    >
      {children}
    </section>
  );
}

function HeroHeader({
  displayName,
  refreshing,
  currentTime,
  onRefresh,
  onOpenQuickAdd,
  onOpenEnergy,
}: {
  displayName: string;
  refreshing: boolean;
  currentTime?: string;
  onRefresh: () => void;
  onOpenQuickAdd: () => void;
  onOpenEnergy: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white bg-white shadow-[0_22px_80px_rgba(26,21,40,0.06)] md:rounded-[48px]">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-5 py-12 md:px-10 md:py-16">
        <div className="pointer-events-none absolute left-[8%] top-[-20%] h-[360px] w-[360px] rounded-full bg-white/45 blur-[90px]" />
        <div className="pointer-events-none absolute right-[-8%] top-[12%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/70 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Dashboard cá nhân
            {currentTime ? <span className="text-[#8A84A3]">· {currentTime}</span> : null}
          </div>

          <h1 className="mx-auto max-w-[900px] text-[clamp(2rem,4vw,4rem)] font-[900] leading-[1.02] tracking-tight text-[#1A1528]">
            Chào {displayName}, chọn đúng việc cho{" "}
            <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
              đúng thời điểm
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[700px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16.5px]">
            Theo dõi task, focus session, năng lượng và điểm thưởng bằng dữ liệu thật từ hành vi sử dụng của bạn.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenQuickAdd}
              className="group flex min-h-[58px] items-center gap-3 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-black"
            >
              <Plus className="h-4 w-4 text-[#4DA8FF]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold uppercase leading-none tracking-wider text-gray-400">
                  HÀNH ĐỘNG
                </span>
                <span className="text-[14px] font-bold leading-tight">
                  Thêm task mới
                </span>
              </div>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onOpenEnergy}
              className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/85 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F0FF]">
                <Activity className="h-3.5 w-3.5 text-[#6F59FF]" />
              </div>
              <span className="text-[14px] font-bold leading-tight">
                Check-in năng lượng
              </span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/70 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white disabled:opacity-60"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#6F59FF]" />
              ) : (
                <RefreshCw className="h-4 w-4 text-[#6F59FF]" />
              )}
              <span className="text-[14px] font-bold leading-tight">Làm mới</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone: Tone;
}) {
  const style = getTone(tone);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] transition-all duration-300 ${style.card}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/55 blur-3xl" />

      <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        <div className={style.text}>{icon}</div>
      </div>

      <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.18em] text-[#8A84A3]">
        {label}
      </div>
      <div className="relative z-10 mt-2 text-[30px] font-[900] leading-none text-[#1A1528]">
        {value}
      </div>
      <p className="relative z-10 mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {helper}
      </p>
    </motion.div>
  );
}

function CommandCenter({
  today,
  nextTask,
  chronotype,
  nowStatus,
  donePercent,
  actions,
  onOpenQuickAdd,
  onOpenEnergy,
  onCreateSampleTask,
  suggestedPeakStart,
  quickAddLoading,
}: {
  today: DashboardData["today"];
  nextTask: DashboardTask | null;
  chronotype?: DashboardData["chronotype"];
  nowStatus?: DashboardData["nowStatus"];
  donePercent: number;
  actions: ActionItem[];
  onOpenQuickAdd: () => void;
  onOpenEnergy: () => void;
  onCreateSampleTask: (sample: Partial<QuickTaskForm>) => void;
  suggestedPeakStart: string;
  quickAddLoading: boolean;
}) {
  return (
    <Panel className="overflow-hidden p-0">
      <div className="relative grid items-start gap-6 bg-[linear-gradient(135deg,#F5F3FF_0%,#EEF6FF_52%,#FFFFFF_100%)] p-5 md:p-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#DCCEFF]/70 blur-[90px]" />

        <div className="relative z-10">
          <Pill tone="purple" icon={<Target className="h-3.5 w-3.5" />}>
            Điều hướng hôm nay
          </Pill>
          <h2 className="mt-3 text-[28px] font-[900] leading-tight text-[#1A1528]">
            Gợi ý cho thời điểm hiện tại
          </h2>
          <p className="mt-2 max-w-[560px] text-[14px] font-medium leading-relaxed text-[#6B647C]">
            {nowStatus?.description || "Hãy thêm task hoặc check-in năng lượng để dashboard có dữ liệu thật."}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Task xong" value={`${today?.completedTasks ?? 0}/${today?.totalTasks ?? 0}`} />
            <MiniMetric label="Hoàn thành" value={`${donePercent}%`} />
            <MiniMetric label="Đúng nhịp" value={`${today?.alignmentScore ?? 0}%`} />
          </div>

          <div className="mt-4 rounded-[24px] border border-white/80 bg-white/82 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                  Trạng thái hiện tại
                </div>
                <div className="mt-1 text-[18px] font-[900] text-[#1A1528]">
                  {nowStatus?.label || "Chưa đủ dữ liệu"}
                </div>
              </div>
              <div className="rounded-2xl bg-[#F3F0FF] px-3 py-2 text-[13px] font-black text-[#6F59FF]">
                {nowStatus?.currentTime || "Now"}
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenEnergy}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#1A1528] px-4 py-2.5 text-[13px] font-bold text-white"
            >
              <Activity className="h-4 w-4 text-[#4DA8FF]" />
              Cập nhật năng lượng
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniMetric label="Peak" value={chronotype?.peakWindow || "Chưa đủ dữ liệu"} />
            <MiniMetric label="Recovery" value={chronotype?.recoveryWindow || "Chưa đủ dữ liệu"} />
          </div>
        </div>

        <div className="relative z-10 grid gap-4 rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(26,21,40,0.06)] backdrop-blur-xl">
          <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Bước nên làm tiếp
          </div>

          {nextTask ? (
            <div className="rounded-[24px] border border-[#E9E5FF] bg-[#FBF9FF] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#6F59FF] shadow-sm">
                  {nextTask.typeLabel || "Task"}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#8A84A3] shadow-sm">
                  {formatTimeRange(nextTask.startTime, nextTask.endTime)}
                </span>
                {nextTask.energyRecommendation ? (
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-black ${getRecommendationPill(
                      nextTask.energyRecommendation.status,
                    )}`}
                  >
                    {nextTask.energyRecommendation.label}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 text-[21px] font-[900] leading-tight text-[#1A1528]">
                {nextTask.title}
              </div>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#6B647C]">
                {nextTask.energyRecommendation?.description ||
                  nextTask.explanation ||
                  `Hoàn thành task này để giữ tiến độ hôm nay và nhận khoảng ${
                    nextTask.coins ?? 0
                  } điểm.`}
              </p>
              <Link
                href={`/planner?taskId=${nextTask.id}`}
                className="mt-5 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5"
              >
                Mở task này <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="rounded-[26px] border border-[#EEF0F6] bg-[#F8F9FE] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[16px] font-[900] text-[#1A1528]">
                    Bắt đầu bằng dữ liệu thật
                  </div>
                  <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#6B647C]">
                    Thêm task thật hoặc check-in năng lượng để ChronoFlow có dữ liệu phân tích.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <SampleTaskButton
                  disabled={quickAddLoading}
                  label="Deep Work 45p"
                  helper={suggestedPeakStart || "Chưa có peak"}
                  onClick={() =>
                    onCreateSampleTask({
                      name: "Deep Work 45 phút",
                      type: "DEEP_WORK",
                      priority: "HIGH",
                      durationMinutes: "45",
                      scheduledDate: todayKey(),
                      startTime: suggestedPeakStart,
                    })
                  }
                />
                <SampleTaskButton
                  disabled={quickAddLoading}
                  label="Việc nhẹ 20p"
                  helper="Admin"
                  onClick={() =>
                    onCreateSampleTask({
                      name: "Việc nhẹ 20 phút",
                      type: "ADMIN",
                      priority: "MEDIUM",
                      durationMinutes: "20",
                      scheduledDate: todayKey(),
                      startTime: "",
                    })
                  }
                />
                <button
                  type="button"
                  onClick={onOpenEnergy}
                  className="rounded-[20px] border border-white bg-white/85 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="text-[13px] font-[900] text-[#1A1528]">
                    Check-in năng lượng
                  </div>
                  <div className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Manual
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenQuickAdd}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4 text-[#4DA8FF]" />
                Tự thêm task
              </button>
            </div>
          )}

          {actions.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {actions.slice(0, 2).map((action) => (
                <ActionRow key={action.id} action={action} compact />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

function SampleTaskButton({
  label,
  helper,
  disabled,
  onClick,
}: {
  label: string;
  helper: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-[20px] border border-white bg-white/85 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="text-[13px] font-[900] text-[#1A1528]">{label}</div>
      <div className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
        {helper}
      </div>
    </button>
  );
}

function EnergyPanel({
  chronotype,
  energyCurve,
  energyScore,
  insight,
  checkins,
  onOpenEnergy,
}: {
  chronotype?: DashboardData["chronotype"];
  energyCurve: EnergyPoint[];
  energyScore: number | null;
  insight?: DashboardData["energyInsight"];
  checkins: EnergyCheckin[];
  onOpenEnergy: () => void;
}) {
  const chronotypeLabel = chronotype?.label || "Chưa có chronotype";
  const peak = chronotype?.peakWindow || insight?.peakWindow || "Chưa đủ dữ liệu";
  const recovery = chronotype?.recoveryWindow || insight?.recoveryWindow || "Chưa đủ dữ liệu";
  const hasCurve = energyCurve.length >= 2;

  return (
    <Panel className="p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Pill tone="purple" icon={<BarChart3 className="h-3.5 w-3.5" />}>
            Bản đồ năng lượng thật
          </Pill>
          <h2 className="mt-3 text-[30px] font-[900] leading-tight text-[#1A1528]">
            {chronotypeLabel}
          </h2>
          <p className="mt-2 max-w-[660px] text-[14px] font-medium leading-relaxed text-[#6B647C]">
            {insight?.summary || "Energy score và đường năng lượng được lấy từ check-in thật của bạn."}
          </p>
          <Link
            href="/assessment"
            className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-4 text-[12px] font-black text-[#6F59FF] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FAF8FF]"
          >
            <Brain className="h-4 w-4" />
            Cập nhật chronotype
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
          <MiniMetric label="Energy" value={formatEnergyScore(energyScore)} />
          <MiniMetric label="Check-ins" value={`${checkins.length}`} />
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-[30px] border border-[#E9E5FF] bg-[#FBF9FF] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              Đường năng lượng từ check-in
            </div>
            <button
              type="button"
              onClick={onOpenEnergy}
              className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#6F59FF] shadow-sm"
            >
              Check-in
            </button>
          </div>

          {hasCurve ? (
            <EnergyLineChart points={energyCurve} />
          ) : (
            <EmptyState
              icon={<Activity className="h-5 w-5" />}
              title="Chưa đủ dữ liệu năng lượng"
              desc="Bạn cần check-in năng lượng vài lần trong ngày để ChronoFlow vẽ đường năng lượng cá nhân."
              cta="Check-in ngay"
              onAction={onOpenEnergy}
            />
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard
            icon={<Zap className="h-5 w-5" />}
            title="Khung deep work"
            value={peak}
            desc="Được suy ra từ dữ liệu check-in thật. Nếu chưa đủ dữ liệu, hệ thống sẽ không tự bịa."
            tone="purple"
          />
          <InsightCard
            icon={<Coffee className="h-5 w-5" />}
            title="Khung hồi phục"
            value={recovery}
            desc="Chỉ hiển thị khi có đủ dữ liệu thật hoặc được lưu từ hệ thống."
            tone="green"
          />
        </div>
      </div>
    </Panel>
  );
}

function EnergyLineChart({ points }: { points: EnergyPoint[] }) {
  const safe = points.map((point) => ({ hour: point.hour, value: clamp(point.value, 0, 100) }));
  const width = 640;
  const height = 220;
  const paddingX = 26;
  const paddingY = 22;
  const step = safe.length > 1 ? (width - paddingX * 2) / (safe.length - 1) : 0;
  const coords = safe.map((point, index) => {
    const x = paddingX + index * step;
    const y = height - paddingY - (clamp(point.value, 0, 100) / 100) * (height - paddingY * 2);
    return { ...point, x, y };
  });
  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  return (
    <div>
      <div className="relative overflow-hidden rounded-[26px] border border-white bg-white/75 p-3 shadow-inner">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full" role="img" aria-label="Energy curve">
          <defs>
            <linearGradient id="energyStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6F59FF" />
              <stop offset="100%" stopColor="#4DA8FF" />
            </linearGradient>
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6F59FF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#4DA8FF" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[25, 50, 75].map((line) => {
            const y = height - paddingY - (line / 100) * (height - paddingY * 2);
            return <line key={line} x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="#E9E5FF" strokeDasharray="6 8" />;
          })}

          <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} d={area} fill="url(#energyFill)" />
          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} d={path} fill="none" stroke="url(#energyStroke)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

          {coords.map((point) => (
            <g key={point.hour}>
              <circle cx={point.x} cy={point.y} r="7" fill="white" stroke="#6F59FF" strokeWidth="4" />
              <text x={point.x} y={height - 2} textAnchor="middle" className="fill-[#8A84A3] text-[18px] font-bold">
                {point.hour}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <MiniMetric label="Thấp nhất" value={`${Math.min(...safe.map((p) => p.value))}%`} />
        <MiniMetric label="Cao nhất" value={`${Math.max(...safe.map((p) => p.value))}%`} />
        <MiniMetric label="Trung bình" value={`${Math.round(safe.reduce((s, p) => s + p.value, 0) / safe.length)}%`} />
      </div>
    </div>
  );
}

function FocusCard({
  nextTask,
  chronotype,
  activeFocus,
  elapsedSeconds,
  focusLoading,
  focusMessage,
  onStartFocus,
  onFinishFocus,
  onOpenQuickAdd,
}: {
  nextTask: DashboardTask | null;
  chronotype?: DashboardData["chronotype"];
  activeFocus: ActiveFocusSession | null;
  elapsedSeconds: number;
  focusLoading: boolean;
  focusMessage: string | null;
  onStartFocus: (taskId?: string | null) => void;
  onFinishFocus: (completeTask?: boolean) => void;
  onOpenQuickAdd: () => void;
}) {
  return (
    <Panel className="overflow-hidden p-0">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1528] via-[#201A35] to-[#111827] p-6 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#6F59FF]/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-70px] left-10 h-48 w-48 rounded-full bg-[#4DA8FF]/25 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white/80">
            <Timer className="h-3.5 w-3.5 text-[#4DA8FF]" />
            Phiên tập trung
          </div>

          <h2 className="text-[26px] font-[900] leading-tight">
            {activeFocus ? "Đang focus" : "Phiên tiếp theo"}
          </h2>

          {activeFocus ? (
            <>
              <div className="mt-5 rounded-[26px] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
                  Timer
                </div>
                <div className="mt-2 text-[44px] font-[900] leading-none tracking-[-0.04em]">
                  {formatElapsed(elapsedSeconds)}
                </div>
                <div className="mt-3 text-[14px] font-semibold text-white/70">
                  {activeFocus.task?.name || "Focus session không gắn task"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={focusLoading}
                  onClick={() => onFinishFocus(true)}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white px-5 text-[14px] font-black text-[#1A1528] shadow-xl transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {focusLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#6F59FF]" /> : <Square className="h-4 w-4 text-[#6F59FF]" />}
                  Kết thúc & hoàn thành
                </button>

                <button
                  type="button"
                  disabled={focusLoading}
                  onClick={() => onFinishFocus(false)}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 text-[14px] font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15 disabled:opacity-60"
                >
                  Chỉ lưu thời gian
                </button>
              </div>
            </>
          ) : nextTask ? (
            <>
              <div className="mt-5 rounded-[26px] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
                  Task đề xuất
                </div>
                <div className="mt-2 text-[20px] font-[900]">{nextTask.title}</div>
                <div className="mt-2 text-[13px] font-semibold text-white/65">
                  {formatTimeRange(nextTask.startTime, nextTask.endTime)} ·{" "}
                  {formatMinutesShort(nextTask.estimatedMinutes ?? 0)}
                </div>
                {nextTask.energyRecommendation ? (
                  <div className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-[12px] font-semibold leading-relaxed text-white/70">
                    {nextTask.energyRecommendation.description}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                disabled={focusLoading}
                onClick={() => onStartFocus(nextTask.id)}
                className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-[14px] font-black text-[#1A1528] shadow-xl transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {focusLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#6F59FF]" /> : <Play className="h-4 w-4 text-[#6F59FF]" />}
                Bắt đầu focus
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <div className="mt-5 rounded-[26px] border border-white/10 bg-white/10 p-4 text-[14px] font-medium leading-relaxed text-white/70 backdrop-blur-md">
                Chưa có phiên tập trung sẵn sàng. Hãy thêm một task thật để bắt đầu focus.
              </div>
              <button
                type="button"
                onClick={onOpenQuickAdd}
                className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-[14px] font-black text-[#1A1528] shadow-xl transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4 text-[#6F59FF]" />
                Thêm task để focus
              </button>
            </>
          )}

          {focusMessage ? (
            <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-[12px] font-bold text-white/75">
              {focusMessage}
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <DarkMiniMetric label="Peak" value={chronotype?.peakWindow || "Chưa đủ dữ liệu"} />
            <DarkMiniMetric label="Recovery" value={chronotype?.recoveryWindow || "Chưa đủ dữ liệu"} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SmartSuggestions({
  suggestions,
  onOpenQuickAdd,
  onOpenEnergy,
}: {
  suggestions: ActionItem[];
  onOpenQuickAdd: () => void;
  onOpenEnergy: () => void;
}) {
  return (
    <Panel className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <Pill tone="blue" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Gợi ý thông minh
          </Pill>
          <h2 className="mt-3 text-[22px] font-[900] text-[#1A1528]">
            Việc nên ưu tiên
          </h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onOpenEnergy} className="rounded-2xl bg-[#EEF6FF] px-4 py-2 text-[12px] font-black text-[#4DA8FF] transition hover:-translate-y-0.5">
            Check-in
          </button>
          <button type="button" onClick={onOpenQuickAdd} className="rounded-2xl bg-[#F3F0FF] px-4 py-2 text-[12px] font-black text-[#6F59FF] transition hover:-translate-y-0.5">
            Thêm task
          </button>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <SuccessBox title="Không có gợi ý khẩn cấp" desc="Dashboard chưa phát hiện vấn đề từ dữ liệu hiện có." />
      ) : (
        <div className="space-y-3">
          {suggestions.slice(0, 4).map((item) => (
            <ActionRow key={item.id} action={item} />
          ))}
        </div>
      )}
    </Panel>
  );
}

function PlannerBoard({
  tasks,
  priorityQueue,
  onOpenQuickAdd,
}: {
  tasks: DashboardTask[];
  priorityQueue: DashboardTask[];
  onOpenQuickAdd: () => void;
}) {
  const hasTasks = tasks.length > 0 || priorityQueue.length > 0;

  return (
    <Panel className="p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Pill tone="blue" icon={<CalendarDays className="h-3.5 w-3.5" />}>
            Kế hoạch hôm nay
          </Pill>
          <h2 className="mt-3 text-[26px] font-[900] text-[#1A1528]">
            Timeline & hàng đợi ưu tiên
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenQuickAdd}
          className="inline-flex items-center gap-2 text-[13px] font-black text-[#6F59FF]"
        >
          Thêm task <Plus className="h-4 w-4" />
        </button>
      </div>

      {hasTasks ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <TodayTimeline tasks={tasks} />
          <PriorityQueue tasks={priorityQueue} embedded />
        </div>
      ) : (
        <div className="rounded-[30px] border border-[#EEF0F6] bg-[#F8F9FE] p-6">
          <EmptyState
            icon={<CalendarDays className="h-5 w-5" />}
            title="Lịch hôm nay đang trống"
            desc="Thêm task thật và chọn thời gian dự kiến để tạo timeline làm việc trong ngày."
            cta="Thêm task"
            onAction={onOpenQuickAdd}
          />
        </div>
      )}
    </Panel>
  );
}

function TodayTimeline({ tasks }: { tasks: DashboardTask[] }) {
  const sorted = [...tasks].sort((a, b) => {
    const aTime = minutesFromTime(a.startTime) ?? 9999;
    const bTime = minutesFromTime(b.startTime) ?? 9999;
    return aTime - bTime;
  });

  return (
    <div className="rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          Timeline
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#6F59FF] shadow-sm">
          {tasks.length} task
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-5 w-5" />}
          title="Chưa có task trong timeline"
          desc="Task có khung giờ sẽ xuất hiện ở đây."
          cta="Xem planner"
          href="/planner"
        />
      ) : (
        <div className="space-y-3">
          {sorted.slice(0, 5).map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function PriorityQueue({ tasks, embedded = false }: { tasks: DashboardTask[]; embedded?: boolean }) {
  const content =
    tasks.length === 0 ? (
      <EmptyState
        icon={<CheckCircle2 className="h-5 w-5" />}
        title="Không có task chờ xử lý"
        desc="Các task chưa hoàn thành hôm nay sẽ xuất hiện ở đây."
        cta="Mở planner"
        href="/planner"
      />
    ) : (
      <div className="space-y-3">
        {tasks.slice(0, 5).map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    );

  if (embedded) {
    return (
      <div className="rounded-[28px] border border-[#EEF0F6] bg-white/75 p-5">
        <div className="mb-4 text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          Priority queue
        </div>
        {content}
      </div>
    );
  }

  return <Panel className="p-5">{content}</Panel>;
}

function TaskRow({ task }: { task: DashboardTask }) {
  const tone = taskToneMap[String(task.type || "deep")] || taskToneMap.deep;
  const done = task.status === "done";
  const recommendation = task.energyRecommendation;

  return (
    <Link
      href={`/planner?taskId=${task.id}`}
      className={`group flex items-center gap-4 rounded-[24px] border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${tone.card}`}
    >
      <div className={`h-3 w-3 shrink-0 rounded-full ${done ? "bg-[#10B981]" : tone.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="truncate text-[15px] font-[900] text-[#1A1528]">{task.title}</div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${tone.pill}`}>
            {task.typeLabel || tone.label}
          </span>
          {recommendation ? (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${getRecommendationPill(recommendation.status)}`}>
              {recommendation.label}
            </span>
          ) : null}
        </div>
        <div className="mt-1 text-[12px] font-bold text-[#8A84A3]">
          {formatTimeRange(task.startTime, task.endTime)} · {formatMinutesShort(task.estimatedMinutes ?? 0)} · +{task.coins ?? 0} điểm
        </div>
        {recommendation ? (
          <div className="mt-2 text-[12px] font-semibold leading-relaxed text-[#6B647C]">
            {recommendation.description}
          </div>
        ) : null}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#8A84A3] transition group-hover:translate-x-1 group-hover:text-[#6F59FF]" />
    </Link>
  );
}

function FocusAlignmentPanel({ alignment }: { alignment?: DashboardData["focusAlignment"] }) {
  const aligned = alignment?.alignedCount ?? 0;
  const misaligned = alignment?.misalignedCount ?? 0;
  const total = aligned + misaligned;
  const score = alignment?.score ?? (total === 0 ? 0 : Math.round((aligned / total) * 100));
  const misalignedTasks = alignment?.misalignedTasks ?? [];

  return (
    <Panel className="p-5">
      <div className="mb-5">
        <Pill tone="purple" icon={<Target className="h-3.5 w-3.5" />}>
          Độ khớp nhịp
        </Pill>
        <h2 className="mt-3 text-[22px] font-[900] text-[#1A1528]">
          Task có đúng dữ liệu năng lượng không?
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MiniMetric label="Score" value={`${score}%`} />
        <MiniMetric label="Đúng nhịp" value={`${aligned}`} />
        <MiniMetric label="Lệch nhịp" value={`${misaligned}`} />
      </div>

      <ProgressBar value={score} className="mt-5" />

      {total === 0 ? (
        <p className="mt-4 text-[13px] font-medium leading-relaxed text-[#6B647C]">
          Cần task có giờ và đủ dữ liệu check-in để tính alignment.
        </p>
      ) : (
        <p className="mt-4 text-[13px] font-medium leading-relaxed text-[#6B647C]">
          {score >= 70
            ? "Lịch hôm nay khá khớp với dữ liệu năng lượng hiện có."
            : "Một số task nặng đang lệch khỏi khung năng lượng tốt nhất."}
        </p>
      )}

      {misalignedTasks.length > 0 ? (
        <div className="mt-4 space-y-2">
          {misalignedTasks.slice(0, 3).map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      ) : null}
    </Panel>
  );
}

function RewardProgress({
  rewards,
  onRedeem,
}: {
  rewards?: DashboardData["rewards"];
  onRedeem: (reward?: RewardMilestone | null) => void;
}) {
  const points = rewards?.currentPoints ?? 0;
  const earned = rewards?.earnedPoints ?? points;
  const spent = rewards?.spentPoints ?? 0;
  const progress = rewards?.progressToNext ?? 0;
  const next = rewards?.nextMilestone ?? null;
  const redemptions = rewards?.recentRedemptions ?? [];
  const milestones = rewards?.milestones ?? [];

  return (
    <Panel className="overflow-hidden p-0">
      <div className="bg-[linear-gradient(135deg,#FFF8EF_0%,#F8F4FF_52%,#EEF7FF_100%)] p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <Pill tone="orange" icon={<Gift className="h-3.5 w-3.5" />}>
              Planner Kit
            </Pill>
            <h2 className="mt-3 text-[22px] font-[900] text-[#1A1528]">
              Tiến độ đổi thưởng
            </h2>
            <p className="mt-1 text-[13px] font-medium text-[#6B647C]">
              {points} điểm khả dụng · đã dùng {spent} điểm
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#F59E0B] shadow-sm">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        {milestones.length === 0 ? (
          <EmptyState
            icon={<Gift className="h-5 w-5" />}
            title="Chưa có phần thưởng khả dụng"
            desc="Kho phần thưởng đang được cập nhật. Bạn vẫn có thể tích coin bằng task, focus session hoặc streak."
            cta="Không có reward"
            href="/dashboard"
          />
        ) : (
          <>
            <div className="rounded-[24px] border border-white/80 bg-white/70 p-4">
              <div className="mb-2 flex justify-between gap-3 text-[13px] font-black">
                <span>{next?.title || "Đã đủ tất cả mốc hiện có"}</span>
                <span className="text-[#6F59FF]">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
              <div className="mt-3 text-[12px] font-bold text-[#6B647C]">
                Đã kiếm: {earned} điểm · Mốc tiếp theo: {next?.points ?? 0} điểm
              </div>
              <div className="mt-3 rounded-[18px] bg-white px-4 py-3 text-[12px] font-bold leading-relaxed text-[#6B647C]">
                {rewards?.earningRule ||
                  "Coin khả dụng được cập nhật sau mỗi task, focus session, streak hoặc lần đổi thưởng."}
              </div>
              <button
                type="button"
                onClick={() => onRedeem(next)}
                disabled={!next}
                className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5 disabled:opacity-50"
              >
                <PackageCheck className="h-4 w-4 text-[#F59E0B]" />
                Đổi thưởng
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {milestones.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onRedeem(item)}
                  className="flex items-center justify-between rounded-[18px] bg-white/70 px-4 py-3 text-left text-[13px] font-bold transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span>{item.title}</span>
                  <span className={item.unlocked ? "text-[#10B981]" : "text-[#8A84A3]"}>
                    {item.unlocked ? "Đủ điểm" : `${item.points} điểm`}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {redemptions.length > 0 ? (
          <div className="mt-4 rounded-[22px] border border-white/70 bg-white/60 p-4">
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              Yêu cầu gần đây
            </div>
            <div className="space-y-2">
              {redemptions.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 text-[12px] font-bold">
                  <span>{item.rewardTitle}</span>
                  <span className="text-[#6F59FF]">{translateRedemptionStatus(item.status)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

function WeekCalendar({ weekly }: { weekly: NonNullable<DashboardData["weekly"]> }) {
  const days = normalizeWeek(weekly);
  const maxFocus = Math.max(60, ...days.map((day) => day.focusMinutes ?? 0));

  return (
    <Panel className="p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <Pill tone="blue" icon={<CalendarDays className="h-3.5 w-3.5" />}>
            Tuần này
          </Pill>
          <h2 className="mt-3 text-[22px] font-[900] text-[#1A1528]">
            Lịch tuần trực quan
          </h2>
        </div>
        <Link href="/planner" className="inline-flex items-center gap-1 text-[12px] font-black text-[#6F59FF]">
          Xem lịch <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const height = clamp(Math.round(((day.focusMinutes ?? 0) / maxFocus) * 100), 8, 100);
          return (
            <div
              key={day.date}
              className={`rounded-[20px] border p-2 text-center ${
                day.isToday ? "border-[#C9BEFF] bg-[#F3F0FF]" : "border-[#EEF0F6] bg-[#F8F9FE]"
              }`}
            >
              <div className="text-[11px] font-black text-[#8A84A3]">{day.label}</div>
              <div className="mt-3 flex h-28 items-end justify-center rounded-full bg-white/80 p-1 shadow-inner">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.55 }}
                  className="w-full rounded-full bg-gradient-to-t from-[#6F59FF] to-[#4DA8FF]"
                />
              </div>
              <div className="mt-2 text-[11px] font-black text-[#1A1528]">
                {formatMinutesShort(day.focusMinutes ?? 0)}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function RecentFocus({ sessions }: { sessions: FocusSession[] }) {
  return (
    <Panel className="p-5">
      <div className="mb-5">
        <Pill tone="green" icon={<Target className="h-3.5 w-3.5" />}>
          Focus gần đây
        </Pill>
        <h2 className="mt-3 text-[22px] font-[900] text-[#1A1528]">
          Lịch sử phiên tập trung
        </h2>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={<Timer className="h-5 w-5" />}
          title="Chưa có phiên focus"
          desc="Hoàn thành task có thời lượng tập trung để ghi nhận tiến độ và tích điểm."
          cta="Mở planner"
          href="/planner"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {sessions.slice(0, 4).map((session) => (
            <div key={session.id} className="flex items-center justify-between gap-3 rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
              <div>
                <div className="text-[14px] font-[900] text-[#1A1528]">
                  {session.taskTitle || "Focus session"}
                </div>
                <div className="mt-1 text-[12px] font-bold text-[#8A84A3]">
                  {formatMinutes(session.durationMinutes)}
                </div>
              </div>
              <div className="rounded-full bg-white px-3 py-1.5 text-[12px] font-black text-[#F59E0B] shadow-sm">
                +{session.coinsEarned ?? 0} điểm
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function WeeklyInsightPanel({ data }: { data: DashboardData | null }) {
  const insight = data?.weeklyInsight;

  return (
    <Panel className="p-5">
      <div className="mb-5">
        <Pill tone="purple" icon={<TrendingUp className="h-3.5 w-3.5" />}>
          Tổng kết tuần
        </Pill>
        <h2 className="mt-3 text-[22px] font-[900] text-[#1A1528]">
          Nhìn lại dữ liệu tuần
        </h2>
      </div>

      {insight ? (
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#EEF0F6] bg-[#F8F9FE] p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              {insight.weekLabel || "Tuần gần nhất"}
            </div>
            <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#5B566E]">
              {insight.summary || "Chưa có tổng kết chi tiết."}
            </p>
            {insight.recommendation ? (
              <div className="mt-4 rounded-[20px] border border-[#E9E5FF] bg-white p-4 text-[13px] font-medium leading-relaxed text-[#5B566E]">
                <span className="font-black text-[#6F59FF]">Gợi ý: </span>
                {insight.recommendation}
              </div>
            ) : null}
          </div>
          <div className="grid gap-3">
            <MiniMetric label="Alignment" value={`${insight.alignmentScore ?? 0}%`} />
            <MiniMetric label="Task xong" value={`${insight.completedCount ?? 0}/${insight.totalCount ?? 0}`} />
            <MiniMetric label="Deep work" value={`${insight.deepWorkCount ?? 0}`} />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="Chưa đủ dữ liệu tuần"
          desc="Sau vài ngày sử dụng, ChronoFlow sẽ tổng hợp dữ liệu thật từ task, focus session và check-in."
          cta="Mở planner"
          href="/planner"
        />
      )}
    </Panel>
  );
}

function AttentionPanel({
  alerts,
  tasks,
}: {
  alerts: NonNullable<DashboardData["alerts"]>;
  tasks: DashboardTask[];
}) {
  const derivedAlerts = useMemo(() => {
    if (alerts.length > 0) return alerts;

    const noTimeTasks = tasks.filter((task) => task.status !== "done" && !task.startTime);
    if (noTimeTasks.length > 0) {
      return [
        {
          id: "no-time",
          title: "Có task chưa được đặt giờ",
          description: "Một số task chưa có khung thời gian. Hãy đưa chúng vào timeline để dashboard trực quan hơn.",
          type: "warning" as const,
        },
      ];
    }

    return [];
  }, [alerts, tasks]);

  return (
    <Panel className="p-5">
      <div className="mb-5">
        <Pill tone="orange" icon={<AlertTriangle className="h-3.5 w-3.5" />}>
          Cần chú ý
        </Pill>
        <h2 className="mt-3 text-[22px] font-[900] text-[#1A1528]">
          Việc nên xử lý sớm
        </h2>
      </div>

      {derivedAlerts.length === 0 ? (
        <SuccessBox title="Không có cảnh báo lớn" desc="Dashboard chưa phát hiện vấn đề từ dữ liệu hiện có." />
      ) : (
        <div className="space-y-3">
          {derivedAlerts.map((alert) => (
            <div key={alert.id} className="rounded-[24px] border border-[#FFE6C7] bg-[#FFFDF8] p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />
                <div>
                  <div className="text-[15px] font-[900] text-[#1A1528]">{alert.title}</div>
                  <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#5B566E]">
                    {alert.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function QuickAddTaskModal({
  open,
  form,
  loading,
  error,
  suggestedPeakStart,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  form: QuickTaskForm;
  loading: boolean;
  error: string | null;
  suggestedPeakStart: string;
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<QuickTaskForm>>;
  onSubmit: () => void;
}) {
  if (!open) return null;

  function updateField<K extends keyof QuickTaskForm>(key: K, value: QuickTaskForm[K]) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="w-full max-w-[560px] rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_30px_120px_rgba(26,21,40,0.20)]">
        <ModalHeader title="Thêm task nhanh" desc="Tạo task thật ngay trên dashboard và lưu vào planner." onClose={onClose} />

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <Field label="Tên task">
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Ví dụ: Viết báo cáo, học tiếng Trung..."
              className="input-base"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Loại task">
              <select
                value={form.type}
                onChange={(event) => updateField("type", event.target.value as TaskTypeValue)}
                className="input-base"
              >
                {taskTypeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Độ ưu tiên">
              <select
                value={form.priority}
                onChange={(event) => updateField("priority", event.target.value as PriorityValue)}
                className="input-base"
              >
                {priorityOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Ngày">
              <input
                value={form.scheduledDate}
                onChange={(event) => updateField("scheduledDate", event.target.value)}
                type="date"
                className="input-base"
              />
            </Field>

            <Field label="Bắt đầu">
              <input
                value={form.startTime}
                onChange={(event) => updateField("startTime", event.target.value)}
                type="time"
                className="input-base"
              />
            </Field>

            <Field label="Thời lượng">
              <input
                value={form.durationMinutes}
                onChange={(event) => updateField("durationMinutes", event.target.value)}
                type="number"
                min={5}
                max={480}
                className="input-base"
              />
            </Field>
          </div>

          <div className="rounded-[22px] border border-[#E9E5FF] bg-[#FBF9FF] p-4">
            <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              Gợi ý nhanh
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    name: "Deep Work 45 phút",
                    type: "DEEP_WORK",
                    priority: "HIGH",
                    durationMinutes: "45",
                    startTime: suggestedPeakStart,
                  }))
                }
                className="rounded-2xl bg-white px-4 py-3 text-left text-[13px] font-black text-[#1A1528] shadow-sm transition hover:-translate-y-0.5"
              >
                Deep Work 45p {suggestedPeakStart ? `· ${suggestedPeakStart}` : ""}
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    name: "Việc nhẹ 20 phút",
                    type: "ADMIN",
                    priority: "MEDIUM",
                    durationMinutes: "20",
                    startTime: "",
                  }))
                }
                className="rounded-2xl bg-white px-4 py-3 text-left text-[13px] font-black text-[#1A1528] shadow-sm transition hover:-translate-y-0.5"
              >
                Việc nhẹ 20p
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-[13px] font-bold text-[#F59E0B]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="min-h-[48px] rounded-2xl border border-[#EEF0F6] bg-white px-5 text-[14px] font-bold text-[#1A1528]">
              Huỷ
            </button>
            <button type="submit" disabled={loading} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 text-[#4DA8FF]" />}
              Tạo task
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}

function EnergyCheckinModal({
  open,
  form,
  loading,
  error,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  form: EnergyCheckinForm;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<EnergyCheckinForm>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  if (!open) return null;

  function updateField<K extends keyof EnergyCheckinForm>(key: K, value: EnergyCheckinForm[K]) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="w-full max-w-[520px] rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_30px_120px_rgba(26,21,40,0.20)]">
        <ModalHeader title="Check-in năng lượng" desc="Lưu mức năng lượng thật của bạn tại thời điểm hiện tại." onClose={onClose} />

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Field label="Điểm năng lượng 0–100">
            <input
              value={form.score}
              onChange={(event) => updateField("score", event.target.value)}
              type="number"
              min={0}
              max={100}
              placeholder="Ví dụ: 75"
              className="input-base"
            />
          </Field>

          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 90].map((score) => (
              <button
                type="button"
                key={score}
                onClick={() => updateField("score", String(score))}
                className="rounded-2xl border border-[#EEF0F6] bg-[#F8F9FE] px-3 py-3 text-[13px] font-black text-[#1A1528] transition hover:-translate-y-0.5 hover:bg-white"
              >
                {score}
              </button>
            ))}
          </div>

          <Field label="Ghi chú">
            <textarea
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              rows={3}
              placeholder="Ví dụ: ngủ ít, vừa uống cà phê, đang tỉnh táo..."
              className="input-base resize-none py-3"
            />
          </Field>

          {error ? (
            <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-[13px] font-bold text-[#F59E0B]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="min-h-[48px] rounded-2xl border border-[#EEF0F6] bg-white px-5 text-[14px] font-bold text-[#1A1528]">
              Huỷ
            </button>
            <button type="submit" disabled={loading} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4 text-[#4DA8FF]" />}
              Lưu check-in
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}

function RedeemModal({
  open,
  form,
  rewards,
  availablePoints,
  loading,
  error,
  success,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  form: RedeemForm;
  rewards: RewardMilestone[];
  availablePoints: number;
  loading: boolean;
  error: string | null;
  success: string | null;
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<RedeemForm>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  if (!open) return null;

  const selectedReward = rewards.find((item) => item.id === form.rewardItemId) || rewards[0] || null;
  const enoughPoints = selectedReward ? availablePoints >= selectedReward.points : false;

  function updateField<K extends keyof RedeemForm>(key: K, value: RedeemForm[K]) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="w-full max-w-[620px] rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_30px_120px_rgba(26,21,40,0.20)]">
        <ModalHeader title="Đổi Planner Kit" desc="Gửi yêu cầu đổi thưởng bằng điểm focus thật đã tích luỹ." onClose={onClose} />

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Field label="Phần thưởng">
            <select value={form.rewardItemId} onChange={(event) => updateField("rewardItemId", event.target.value)} className="input-base" disabled={rewards.length === 0}>
              {rewards.length === 0 ? (
                <option value="">Chưa có phần thưởng khả dụng</option>
              ) : (
                rewards.map((reward) => (
                  <option key={reward.id} value={reward.id}>
                    {reward.title} · {reward.points} điểm
                  </option>
                ))
              )}
            </select>
          </Field>

          <div className={`rounded-[22px] border p-4 ${enoughPoints ? "border-[#D1FAE5] bg-[#ECFDF5]" : "border-[#FFE6C7] bg-[#FFF7ED]"}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-[900] text-[#1A1528]">
                  {selectedReward?.title || "Chưa có phần thưởng"}
                </div>
                <div className="mt-1 text-[12px] font-bold text-[#6B647C]">
                  Bạn có {availablePoints} điểm khả dụng
                </div>
              </div>
              <div className={`rounded-full px-3 py-1.5 text-[12px] font-black ${enoughPoints ? "bg-white text-[#10B981]" : "bg-white text-[#F59E0B]"}`}>
                {selectedReward ? (enoughPoints ? "Đủ điểm" : "Chưa đủ điểm") : "Không có reward"}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên người nhận">
              <input value={form.recipientName} onChange={(event) => updateField("recipientName", event.target.value)} className="input-base" />
            </Field>
            <Field label="Số điện thoại">
              <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="input-base" />
            </Field>
          </div>

          <Field label="Địa chỉ nhận kit">
            <input value={form.address} onChange={(event) => updateField("address", event.target.value)} className="input-base" />
          </Field>

          <Field label="Ghi chú">
            <textarea value={form.note} onChange={(event) => updateField("note", event.target.value)} rows={3} className="input-base resize-none py-3" />
          </Field>

          {error ? (
            <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-[13px] font-bold text-[#F59E0B]">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-2xl bg-[#ECFDF5] px-4 py-3 text-[13px] font-bold text-[#10B981]">
              {success}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="min-h-[48px] rounded-2xl border border-[#EEF0F6] bg-white px-5 text-[14px] font-bold text-[#1A1528]">
              Đóng
            </button>
            <button type="submit" disabled={loading || !enoughPoints || !selectedReward} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-[#F59E0B]" />}
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8">
      <button type="button" aria-label="Đóng modal" onClick={onClose} className="absolute inset-0 bg-[#1A1528]/45 backdrop-blur-sm" />
      <div className="relative z-10 max-h-[90vh] w-full overflow-y-auto">{children}</div>
    </div>
  );
}

function ModalHeader({ title, desc, onClose }: { title: string; desc: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[28px] font-[900] tracking-[-0.03em] text-[#1A1528]">
          {title}
        </h2>
        <p className="mt-1 text-[14px] font-medium leading-relaxed text-[#6B647C]">
          {desc}
        </p>
      </div>
      <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F8F9FE] text-[#6B647C] transition hover:bg-[#F3F0FF] hover:text-[#6F59FF]">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </span>
      {children}
    </label>
  );
}

function ActionRow({ action, compact = false }: { action: ActionItem; compact?: boolean }) {
  const styles = getSuggestionStyle(action.tone || "info");

  return (
    <Link href={action.href} className={`group block rounded-[24px] border transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm ${compact ? "p-3" : "p-4"} ${styles.card}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${styles.icon}`}>
          {action.tone === "warning" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : action.tone === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-[900] text-[#1A1528]">{action.title}</div>
          <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#6B647C]">
            {action.description}
          </p>
          <div className={`mt-3 inline-flex items-center gap-1 text-[12px] font-black ${styles.text}`}>
            {action.cta}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function SuccessBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[24px] border border-[#D1FAE5] bg-[#ECFDF5] p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#10B981]" />
        <div>
          <div className="text-[15px] font-[900] text-[#1A1528]">{title}</div>
          <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#5B566E]">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`self-start rounded-[32px] border border-white/80 bg-white/82 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function Pill({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tone: Tone;
}) {
  const style = {
    purple: "border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]",
    blue: "border-[#DDEEFF] bg-[#EEF6FF] text-[#4DA8FF]",
    orange: "border-[#FED7AA] bg-[#FFF7ED] text-[#F59E0B]",
    green: "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]",
  }[tone];

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] shadow-sm ${style}`}>
      {icon}
      {children}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/82 px-4 py-3 shadow-sm backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 text-[18px] font-[900] leading-tight text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function DarkMiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
        {label}
      </div>
      <div className="mt-1 text-[15px] font-[900] text-white">{value}</div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  value,
  desc,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
  tone: "purple" | "green";
}) {
  const style =
    tone === "purple"
      ? { card: "border-[#E9E5FF] bg-[#F3F0FF]", icon: "bg-white text-[#6F59FF]" }
      : { card: "border-[#D1FAE5] bg-[#ECFDF5]", icon: "bg-white text-[#10B981]" };

  return (
    <div className={`rounded-[28px] border p-5 ${style.card}`}>
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${style.icon}`}>
        {icon}
      </div>
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {title}
      </div>
      <div className="mt-2 text-[24px] font-[900] text-[#1A1528]">{value}</div>
      <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {desc}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  desc,
  href,
  cta,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href?: string;
  cta: string;
  onAction?: () => void;
}) {
  const buttonClass =
    "mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black";

  return (
    <div className="rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white text-[#6F59FF] shadow-sm">
        {icon}
      </div>
      <div className="text-[17px] font-[900] text-[#1A1528]">{title}</div>
      <p className="mx-auto mt-2 max-w-[360px] text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {desc}
      </p>

      {onAction ? (
        <button type="button" onClick={onAction} className={buttonClass}>
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <Link href={href || "/planner"} className={buttonClass}>
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-3 overflow-hidden rounded-full bg-[#EEE9FF] ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamp(value, 0, 100)}%` }}
        transition={{ duration: 0.55 }}
        className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
      />
    </div>
  );
}

function getTone(tone: Tone) {
  const styles = {
    purple: {
      text: "text-[#6F59FF]",
      card: "from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF] border-[#D6CBFF]",
    },
    blue: {
      text: "text-[#4DA8FF]",
      card: "from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF] border-[#BFDDFF]",
    },
    orange: {
      text: "text-[#F59E0B]",
      card: "from-[#FFF8F0] via-[#FFEDD6] to-[#FFE0B2] border-[#FCD34D]",
    },
    green: {
      text: "text-[#10B981]",
      card: "from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] border-[#6EE7B7]",
    },
  };

  return styles[tone];
}

function getSuggestionStyle(tone: SuggestionTone) {
  const styles = {
    warning: {
      card: "border-[#FFE6C7] bg-[#FFFDF8]",
      icon: "text-[#F59E0B]",
      text: "text-[#F59E0B]",
    },
    info: {
      card: "border-[#DDEEFF] bg-[#F8FCFF]",
      icon: "text-[#4DA8FF]",
      text: "text-[#4DA8FF]",
    },
    success: {
      card: "border-[#D1FAE5] bg-[#FBFFFE]",
      icon: "text-[#10B981]",
      text: "text-[#10B981]",
    },
  };

  return styles[tone];
}

function getRecommendationPill(status: EnergyRecommendation["status"]) {
  const map: Record<EnergyRecommendation["status"], string> = {
    aligned: "bg-[#ECFDF5] text-[#10B981]",
    move_to_peak: "bg-[#FFF7ED] text-[#F59E0B]",
    recovery: "bg-[#ECFDF5] text-[#10B981]",
    low_energy_ok: "bg-[#EEF6FF] text-[#4DA8FF]",
    unscheduled: "bg-[#F8F9FE] text-[#8A84A3]",
  };

  return map[status];
}

function normalizeWeek(weekly: NonNullable<DashboardData["weekly"]>) {
  const fallback = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((label, index) => ({
    date: String(index),
    label,
    focusMinutes: 0,
    completedTasks: 0,
    totalTasks: 0,
    coins: 0,
    energyScore: null,
    isToday: false,
  }));

  if (!weekly.length) return fallback;

  return weekly.slice(0, 7).map((day, index) => ({
    ...day,
    label: day.label || fallback[index]?.label || "",
  }));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function minutesFromTime(time?: string | null) {
  if (!time) return null;

  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}

function formatMinutes(minutes: number) {
  const safe = Math.max(0, minutes);
  const h = Math.floor(safe / 60);
  const m = safe % 60;

  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h}h`;

  return `${h}h ${m}p`;
}

function formatMinutesShort(minutes: number) {
  if (!minutes) return "0p";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m}p`;
  if (m === 0) return `${h}h`;

  return `${h}h${m}`;
}

function formatElapsed(seconds: number) {
  const safe = Math.max(0, seconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;

  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "Chưa đặt giờ";
  if (start && end) return `${start} – ${end}`;

  return start || end || "Chưa đặt giờ";
}

function formatEnergyScore(score?: number | null) {
  if (score == null) return "Chưa check-in";
  return `${score}%`;
}

function getEnergyLabel(score?: number | null) {
  if (score == null) return "Cần check-in năng lượng";
  if (score >= 80) return "Năng lượng cao";
  if (score >= 55) return "Năng lượng ổn";
  if (score >= 35) return "Nên làm việc nhẹ";

  return "Nên hồi phục";
}

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getStartFromWindow(windowText: string | null) {
  if (!windowText) return "";
  const [start] = windowText.split(" - ");
  return start || "";
}

function pad(num: number) {
  return String(num).padStart(2, "0");
}

function translateRedemptionStatus(status: string) {
  const map: Record<string, string> = {
    PENDING: "Đang chờ",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    FULFILLED: "Đã gửi",
  };

  return map[status] || status;
}
