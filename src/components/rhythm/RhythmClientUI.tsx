"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Coffee,
  Compass,
  Loader2,
  MoonStar,
  RefreshCw,
  Sparkles,
  Sun,
  Target,
  Timer,
  X,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type WindowSource = "energy_checkin" | "chronotype_reference" | "missing" | string;

type EnergyPoint = {
  hour: string;
  value: number;
  count?: number;
};

type RhythmWindow = {
  title: string;
  time: string;
  description: string;
  type: "peak" | "light" | "recovery" | "creative" | "neutral" | string;
};

type DailyTimelineItem = {
  time: string;
  title: string;
  description: string;
  type: "peak" | "light" | "recovery" | "creative" | "neutral" | string;
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
  label?: string;
  energyScore?: number | null;
  focusMinutes?: number | null;
  totalTasks?: number | null;
  completedTasks?: number | null;
  focusTasks?: number | null;
  alignedTasks?: number | null;
  isToday?: boolean;
};

type RhythmData = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  dataQuality?: {
    energyCheckinCount?: number;
    hasPersonalEnergyCurve?: boolean;
    windowSource?: WindowSource;
    sourceLabel?: string;
  };
  chronotype?: {
    type?: string | null;
    label?: string | null;
    emoji?: string | null;
    summary?: string | null;
    confidence?: number | null;
    peakWindow?: string | null;
    lowWindow?: string | null;
    recoveryWindow?: string | null;
    creativeWindow?: string | null;
    description?: string | null;
    source?: WindowSource;
    sourceLabel?: string;
  } | null;
  energyCurve?: EnergyPoint[];
  energyCheckins?: {
    id: string;
    score: number;
    note: string | null;
    source: string;
    checkedAt: string;
  }[];
  windows?: RhythmWindow[];
  dailyTimeline?: DailyTimelineItem[];
  currentStatus?: DailyTimelineItem;
  suggestedReschedules?: SuggestedReschedule[];
  weekComparison?: {
    currentWeek: string;
    previousWeek: string;
    alignmentDelta: number;
    completedDelta: number;
    deepWorkDelta: number;
  } | null;
  recoveryWarning?: {
    level: string;
    title: string;
    description: string;
    action: string;
  };
  weekly?: WeeklyRhythm[];
  recommendations?: {
    id: string;
    title: string;
    description: string;
    type?: "deep" | "admin" | "recovery" | "creative" | string;
  }[];
  taskAlignment?: {
    score: number;
    focusWindow: string;
    alignedTasks: RhythmTask[];
    misalignedTasks: RhythmTask[];
    unscheduledTasks: RhythmTask[];
    alignedCount: number;
    misalignedCount: number;
    unscheduledCount: number;
    focusTaskCount: number;
  };
  sleepRecovery?: {
    targetSleepTime?: string | null;
    targetWakeTime?: string | null;
    recoveryWindow?: string | null;
    hasSleepData?: boolean;
  };
  assessment?: {
    scores:
      | {
          label: string;
          value: number;
          percent: number;
        }[]
      | null;
    createdAt?: string | null;
  };
  weeklyInsight?: {
    weekLabel?: string;
    alignmentScore?: number;
    completedCount?: number;
    totalCount?: number;
    deepWorkCount?: number;
    recommendation?: string;
    summary?: string;
  } | null;
  lastUpdated?: string | null;
};

type EnergyCheckinForm = {
  score: string;
  note: string;
};

type BasicApiResponse = {
  message?: string;
};

export default function RhythmClientUI() {
  const [data, setData] = useState<RhythmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [energyOpen, setEnergyOpen] = useState(false);
  const [energyForm, setEnergyForm] = useState<EnergyCheckinForm>({
    score: "",
    note: "",
  });
  const [energyLoading, setEnergyLoading] = useState(false);
  const [energyError, setEnergyError] = useState<string | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  async function loadRhythm(showRefreshing = false) {
    try {
      if (showRefreshing) setRefreshing(true);
      setError(null);

      const res = await fetch("/api/rhythm", {
        method: "GET",
        cache: "no-store",
      });

      const json = (await res.json().catch(() => null)) as
        | (RhythmData & BasicApiResponse)
        | null;

      if (res.status === 401) {
        throw new Error("Bạn cần đăng nhập để xem trang Nhịp của tôi.");
      }

      if (!res.ok) {
        throw new Error(json?.message || "Không thể tải dữ liệu nhịp.");
      }

      setData(json);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi tải trang Nhịp của tôi.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadRhythm();
  }, []);

  async function submitEnergyCheckin(event: React.FormEvent<HTMLFormElement>) {
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
          note: energyForm.note.trim() || undefined,
        }),
      });

      const json = (await res.json().catch(() => null)) as BasicApiResponse | null;

      if (!res.ok) {
        throw new Error(json?.message || "Không thể lưu check-in năng lượng.");
      }

      setEnergyForm({ score: "", note: "" });
      setEnergyOpen(false);
      await loadRhythm(true);
    } catch (err) {
      setEnergyError(
        err instanceof Error ? err.message : "Không thể lưu check-in năng lượng.",
      );
    } finally {
      setEnergyLoading(false);
    }
  }

  async function rescheduleTask(item: SuggestedReschedule) {
    try {
      setActionLoadingId(item.id);
      setActionMessage(null);

      const res = await fetch("/api/rhythm", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: item.id,
          suggestedWindow: item.suggestedWindow,
        }),
      });

      const json = (await res.json().catch(() => null)) as BasicApiResponse | null;

      if (!res.ok) {
        throw new Error(json?.message || "Không thể dời lịch task.");
      }

      setActionMessage(`Đã dời "${item.title}" sang ${item.suggestedWindow}.`);
      await loadRhythm(true);
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Không thể dời lịch task.",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  const displayName = data?.user?.name || "bạn";
  const chronotype = data?.chronotype ?? null;
  const energyCurve = data?.energyCurve ?? [];
  const rhythmWindows = data?.windows ?? [];
  const weekly = data?.weekly ?? [];
  const checkinCount = data?.dataQuality?.energyCheckinCount ?? 0;
  const hasPersonalEnergyCurve = Boolean(data?.dataQuality?.hasPersonalEnergyCurve);

  const heroSourceText = getHeroSourceText(data);

  if (loading) {
    return (
      <RhythmShell>
        <LoadingState />
      </RhythmShell>
    );
  }

  if (error) {
    return (
      <RhythmShell>
        <ErrorState error={error} onRetry={() => loadRhythm(true)} />
      </RhythmShell>
    );
  }

  return (
    <RhythmShell>
      <section className="relative overflow-hidden rounded-[40px] border border-white bg-white/75 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px]">
        <BackgroundGlow />

        <div className="relative z-10 px-5 py-8 md:px-8 md:py-10 lg:px-10">
          <HeroIntro
            displayName={displayName}
            refreshing={refreshing}
            chronotype={chronotype}
            status={data?.currentStatus}
            sourceText={heroSourceText}
            onRefresh={() => loadRhythm(true)}
            onOpenEnergy={() => setEnergyOpen(true)}
          />

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-stretch">
            <CurrentRhythmStatusPanel
              status={data?.currentStatus}
              onOpenEnergy={() => setEnergyOpen(true)}
            />
            <ChronotypeProfile
              chronotype={chronotype}
              dataQuality={data?.dataQuality}
            />
          </div>

          <div className="mt-6">
            <EnergyCurvePanel
              energyCurve={energyCurve}
              checkinCount={checkinCount}
              hasPersonalEnergyCurve={hasPersonalEnergyCurve}
              onOpenEnergy={() => setEnergyOpen(true)}
            />
          </div>

          <div className="mt-6">
            <DailyTimelinePanel
              items={data?.dailyTimeline ?? []}
              sourceLabel={data?.dataQuality?.sourceLabel}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr] xl:items-start">
            <RhythmWindows
              windows={rhythmWindows}
              sourceLabel={data?.dataQuality?.sourceLabel}
            />
            <RecommendationPanel
              recommendations={data?.recommendations ?? []}
              onOpenEnergy={() => setEnergyOpen(true)}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
            <TaskAlignmentPanel
              alignment={data?.taskAlignment}
              suggestedReschedules={data?.suggestedReschedules ?? []}
              actionLoadingId={actionLoadingId}
              actionMessage={actionMessage}
              onReschedule={rescheduleTask}
            />
            <SleepRecoveryPanel
              sleepRecovery={data?.sleepRecovery}
              recoveryWarning={data?.recoveryWarning}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <WeeklyRhythmPanel weekly={weekly} />
            <RhythmExplanation
              chronotype={chronotype}
              dataQuality={data?.dataQuality}
              lastUpdated={data?.lastUpdated}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <AssessmentPanel assessment={data?.assessment} />
            <WeeklyInsightPanel
              insight={data?.weeklyInsight}
              comparison={data?.weekComparison ?? null}
            />
          </div>

          <div className="mt-6">
            <QuickActionsPanel onOpenEnergy={() => setEnergyOpen(true)} />
          </div>
        </div>
      </section>

      <EnergyCheckinModal
        open={energyOpen}
        form={energyForm}
        loading={energyLoading}
        error={energyError}
        onClose={() => setEnergyOpen(false)}
        onChange={setEnergyForm}
        onSubmit={submitEnergyCheckin}
      />
    </RhythmShell>
  );
}

function RhythmShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <Navbar />

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-8">
        {children}
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}

function HeroIntro({
  displayName,
  refreshing,
  onRefresh,
  onOpenEnergy,
  chronotype,
  status,
  sourceText,
}: {
  displayName: string;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenEnergy: () => void;
  chronotype: RhythmData["chronotype"];
  status?: RhythmData["currentStatus"];
  sourceText: string;
}) {
  return (
    <section className="relative -mx-5 -mt-8 overflow-hidden rounded-t-[40px] border-b border-white/60 bg-[radial-gradient(circle_at_14%_10%,rgba(124,92,250,0.22)_0%,transparent_34%),radial-gradient(circle_at_88%_16%,rgba(96,165,250,0.24)_0%,transparent_34%),linear-gradient(135deg,rgba(247,243,255,0.98)_0%,rgba(238,233,255,0.96)_46%,rgba(229,240,255,0.94)_100%)] px-5 py-10 shadow-[inset_0_-1px_0_rgba(255,255,255,0.45)] md:-mx-8 md:-mt-10 md:rounded-t-[48px] md:px-8 md:py-12 lg:-mx-10 lg:px-10 lg:py-14">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#8B5CF6]/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#60A5FA]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-white/50 blur-3xl" />

      <div className="relative z-10 w-full text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E3DAFF] bg-white/78 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#765BFF] shadow-[0_10px_28px_rgba(95,90,119,0.06)] backdrop-blur-md">
          <MoonStar className="h-4 w-4" />
          Nhịp của tôi
        </div>

        <h1 className="mx-auto mt-7 max-w-[1040px] text-[clamp(2rem,4vw,4rem)] font-black leading-[1.02] tracking-[-0.05em] text-[#17122B]">
          <span className="block">Nhịp làm việc riêng của</span>
          <span className="mt-1 block bg-[linear-gradient(135deg,#6B5BFF_0%,#7286FF_46%,#55B4FF_100%)] bg-clip-text text-transparent">
            {displayName},
          </span>
          <span className="mt-1 block bg-[linear-gradient(135deg,#6B5BFF_0%,#7286FF_46%,#55B4FF_100%)] bg-clip-text text-transparent">
            tập trung đúng lúc hơn
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[820px] text-[15px] font-medium leading-8 text-[#5F5977] md:text-[17px] md:leading-9">
          Khám phá thời điểm bạn dễ tập trung nhất, lúc nào nên xử lý việc nhẹ
          và khi nào nên nghỉ để giữ năng lượng ổn định suốt ngày.
        </p>

        <div className="mx-auto mt-6 max-w-[880px] rounded-[24px] border border-white/80 bg-white/72 px-5 py-4 text-[14px] font-medium leading-7 text-[#6B647C] shadow-[0_12px_34px_rgba(95,90,119,0.06)] backdrop-blur-md">
          <span className="font-black text-[#6F59FF]">
            Cá nhân hoá hiện tại:
          </span>{" "}
          {sourceText}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-6 text-[15px] font-black text-[#241F3D] shadow-[0_14px_34px_rgba(95,90,119,0.08)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#6F59FF]" />
            ) : (
              <RefreshCw className="h-4 w-4 text-[#6F59FF]" />
            )}
            Làm mới
          </button>

          <button
            type="button"
            onClick={onOpenEnergy}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#17122B] px-7 text-[15px] font-black text-white shadow-[0_18px_42px_rgba(23,18,43,0.22)] transition hover:-translate-y-0.5 hover:bg-black"
          >
            <Activity className="h-4 w-4 text-[#4DA8FF]" />
            Check-in năng lượng
          </button>

          <Link
            href="/planner"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#E3DAFF] bg-white/78 px-7 text-[15px] font-black text-[#6F59FF] shadow-[0_14px_34px_rgba(95,90,119,0.07)] transition hover:-translate-y-0.5 hover:bg-white"
          >
            <CalendarClock className="h-4 w-4" />
            Sắp lịch theo nhịp
          </Link>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <HeroMetricCard
            label="Chronotype"
            value={
              chronotype?.label
                ? `${chronotype.label} ${chronotype.emoji ?? ""}`
                : "Chưa có"
            }
          />
          <HeroMetricCard
            label="Peak focus"
            value={chronotype?.peakWindow || "Chưa có"}
          />
          <HeroMetricCard
            label="Trạng thái hiện tại"
            value={status?.title || "Chưa check-in"}
          />
          <HeroMetricCard
            label="Recovery"
            value={chronotype?.recoveryWindow || "Chưa có"}
          />
        </div>
      </div>
    </section>
  );
}

function HeroMetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-sm backdrop-blur-md">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[18px] font-[900] leading-snug text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function CurrentRhythmStatusPanel({
  status,
  onOpenEnergy,
}: {
  status?: RhythmData["currentStatus"];
  onOpenEnergy: () => void;
}) {
  if (!status) {
    return (
      <Card>
        <SectionLabel icon={<Timer className="h-3.5 w-3.5" />} tone="purple">
          Gợi ý lúc này
        </SectionLabel>

        <h2 className="mt-4 text-[30px] font-[900] leading-tight tracking-[-0.04em]">
          Chưa có trạng thái hiện tại
        </h2>

        <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#6B647C]">
          Check-in năng lượng để ChronoFlow biết hiện tại bạn nên làm việc nặng,
          việc nhẹ hay nghỉ ngắn.
        </p>

        <button
          type="button"
          onClick={onOpenEnergy}
          className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black"
        >
          <Activity className="h-4 w-4 text-[#4DA8FF]" />
          Check-in năng lượng
        </button>
      </Card>
    );
  }

  const tone = getWindowTone(status.type);

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/82 p-6 shadow-[0_20px_60px_rgba(26,21,40,0.055)] backdrop-blur-xl md:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#DCCEFF]/70 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[-90px] left-[-80px] h-72 w-72 rounded-full bg-[#D9EAFF]/70 blur-[100px]" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <SectionLabel icon={<Timer className="h-3.5 w-3.5" />} tone="purple">
            Gợi ý lúc này
          </SectionLabel>

          <h2 className="mt-4 text-[clamp(1.9rem,2.5vw,2.5rem)] font-[900] leading-[1.02] tracking-[-0.035em] text-[#1A1528]">
            Bây giờ bạn đang ở:{" "}
            <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
              {status.title}
            </span>
          </h2>

          <p className="mt-4 text-[14px] font-medium leading-relaxed text-[#5B566E]">
            {status.description}
          </p>
        </div>

        <div className={`mt-6 rounded-[28px] border p-5 shadow-sm ${tone.card}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${tone.text}`}
            >
              {tone.icon}
            </div>

            <div
              className={`rounded-full px-3 py-1.5 text-[11px] font-black ${tone.pill}`}
            >
              {status.time}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBox label="Nên làm" value={status.shouldDo} tone="green" />
            <InfoBox label="Không nên" value={status.shouldAvoid} tone="orange" />
          </div>

          <button
            type="button"
            onClick={onOpenEnergy}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-4 text-[13px] font-bold text-white"
          >
            <Activity className="h-4 w-4 text-[#4DA8FF]" />
            Cập nhật năng lượng
          </button>
        </div>
      </div>
    </div>
  );
}

function ChronotypeProfile({
  chronotype,
  dataQuality,
}: {
  chronotype: RhythmData["chronotype"];
  dataQuality?: RhythmData["dataQuality"];
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#EDE7FF] blur-[70px]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SectionLabel icon={<Brain className="h-3.5 w-3.5" />} tone="purple">
              Chronotype profile
            </SectionLabel>

            <h2 className="mt-5 text-[34px] font-[900] leading-tight tracking-[-0.04em] md:text-[35px]">
              {chronotype?.label || "Chưa xác định"} {chronotype?.emoji || ""}
            </h2>

            <p className="mt-4 max-w-[560px] text-[15px] font-medium leading-relaxed text-[#5B566E]">
              {chronotype?.summary ||
                chronotype?.description ||
                "Làm bài đánh giá để ChronoFlow xác định chronotype và gợi ý khung làm việc phù hợp."}
            </p>
          </div>

          <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-[28px] bg-white text-[54px] shadow-sm md:flex">
            {chronotype?.emoji || "🧭"}
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          <MiniMetric
            label="Nguồn"
            value={
              dataQuality?.hasPersonalEnergyCurve ? "Check-in thật" : "Chronotype"
            }
            tone="purple"
          />
          <MiniMetric
            label="Peak focus"
            value={chronotype?.peakWindow || "Chưa có"}
            tone="blue"
          />
          <MiniMetric
            label="Recovery"
            value={chronotype?.recoveryWindow || "Chưa có"}
            tone="green"
          />
        </div>

        <div className="mt-6 rounded-[24px] border border-[#E9E5FF] bg-[#FBF9FF] p-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            <span>Dữ liệu cá nhân hoá</span>
            <span className="text-[#6F59FF]">
              {dataQuality?.energyCheckinCount ?? 0} check-in
            </span>
          </div>

          <p className="text-[13px] font-medium leading-relaxed text-[#5B566E]">
            {dataQuality?.sourceLabel ||
              chronotype?.sourceLabel ||
              "Chưa có đủ dữ liệu check-in để cá nhân hoá sâu hơn."}
          </p>
        </div>
      </div>
    </Card>
  );
}

function EnergyCurvePanel({
  energyCurve,
  checkinCount,
  hasPersonalEnergyCurve,
  onOpenEnergy,
}: {
  energyCurve: EnergyPoint[];
  checkinCount: number;
  hasPersonalEnergyCurve: boolean;
  onOpenEnergy: () => void;
}) {
  const values = energyCurve.map((item) => item.value);
  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const avg = values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : null;

  return (
    <Card>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] xl:items-stretch">
        <div>
          <SectionLabel icon={<BarChart3 className="h-3.5 w-3.5" />} tone="blue">
            Energy curve
          </SectionLabel>

          <h2 className="mt-5 text-[34px] font-[900] leading-tight tracking-[-0.04em] md:text-[35px]">
            Đường năng lượng cá nhân
          </h2>

          <p className="mt-4 max-w-[560px] text-[15px] font-medium leading-relaxed text-[#5B566E]">
            Biểu đồ này được vẽ từ các lần check-in năng lượng thật của bạn.
            Khi chưa đủ dữ liệu, ChronoFlow sẽ để trống và nhắc bạn check-in thêm.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-4">
            <MiniMetric label="Check-in" value={`${checkinCount}`} tone="purple" />
            <MiniMetric
              label="Thấp nhất"
              value={min === null ? "Chưa có" : `${min}%`}
              tone="purple"
            />
            <MiniMetric
              label="Cao nhất"
              value={max === null ? "Chưa có" : `${max}%`}
              tone="blue"
            />
            <MiniMetric
              label="Trung bình"
              value={avg === null ? "Chưa có" : `${avg}%`}
              tone="green"
            />
          </div>
        </div>

        <div className="rounded-[30px] border border-[#DDEEFF] bg-[#F8FCFF] p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-[12px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
              24h view
            </div>

            <button
              type="button"
              onClick={onOpenEnergy}
              className="rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#4DA8FF] shadow-sm transition hover:-translate-y-0.5"
            >
              Check-in năng lượng
            </button>
          </div>

          {hasPersonalEnergyCurve && energyCurve.length >= 2 ? (
            <EnergyLineChart points={energyCurve} />
          ) : (
            <EmptyState
              icon={<Activity className="h-6 w-6" />}
              title="Chưa đủ dữ liệu năng lượng"
              description="Check-in ít nhất vài lần trong ngày để ChronoFlow vẽ đường năng lượng cá nhân."
              actionLabel="Check-in ngay"
              onAction={onOpenEnergy}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

function DailyTimelinePanel({
  items,
  sourceLabel,
}: {
  items: DailyTimelineItem[];
  sourceLabel?: string;
}) {
  return (
    <Card>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <SectionLabel icon={<CalendarClock className="h-3.5 w-3.5" />} tone="purple">
            Daily timeline
          </SectionLabel>

          <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[35px]">
            Một ngày nên chia nhịp như thế nào?
          </h2>

          <p className="mt-3 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E]">
            Timeline giúp bạn nhìn nhanh cả ngày: lúc nào nên khởi động, lúc nào
            nên deep work, lúc nào xử lý việc nhẹ và lúc nào nên recovery.
          </p>

          {sourceLabel ? (
            <div className="mt-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#FBF9FF] px-4 py-2 text-[12px] font-bold text-[#6F59FF]">
              {sourceLabel}
            </div>
          ) : null}
        </div>

        <Link
          href="/planner"
          className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#E9E5FF] bg-white px-5 text-[14px] font-bold text-[#6F59FF] shadow-sm transition hover:-translate-y-0.5"
        >
          Sắp lịch theo timeline <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <TimelineCard key={`${item.time}-${item.title}`} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarClock className="h-6 w-6" />}
          title="Chưa có timeline"
          description="Khi API trả về timeline từ dữ liệu thật, ChronoFlow sẽ hiển thị nhịp trong ngày ở đây."
          actionHref="/planner"
          actionLabel="Mở planner"
        />
      )}
    </Card>
  );
}

function TimelineCard({ item }: { item: DailyTimelineItem }) {
  const tone = getWindowTone(item.type);

  return (
    <div className={`rounded-[26px] border p-5 ${tone.card}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${tone.text}`}
        >
          {tone.icon}
        </div>

        <div
          className={`rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-black ${tone.text}`}
        >
          {item.time}
        </div>
      </div>

      <h3 className="text-[22px] font-[900] leading-tight tracking-[-0.035em]">
        {item.title}
      </h3>

      <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#6B647C]">
        {item.description}
      </p>

      <div className="mt-5 rounded-[18px] border border-[#BBF7D0] bg-white/70 p-3">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#10B981]">
          Nên làm
        </div>
        <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#5B566E]">
          {item.shouldDo}
        </p>
      </div>

      <div className="mt-3 rounded-[18px] border border-[#FED7AA] bg-white/70 p-3">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#F59E0B]">
          Không nên
        </div>
        <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#5B566E]">
          {item.shouldAvoid}
        </p>
      </div>
    </div>
  );
}

function RhythmWindows({
  windows,
  sourceLabel,
}: {
  windows: RhythmWindow[];
  sourceLabel?: string;
}) {
  return (
    <Card>
      <SectionLabel icon={<Clock3 className="h-3.5 w-3.5" />} tone="purple">
        Rhythm windows
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Khung giờ nên ưu tiên
      </h2>

      <p className="mt-3 text-[15px] font-medium leading-relaxed text-[#5B566E]">
        Mỗi loại việc nên được đặt vào một nhịp phù hợp: tập trung sâu, việc nhẹ,
        sáng tạo hoặc hồi phục.
      </p>

      {sourceLabel ? (
        <div className="mt-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#FBF9FF] px-4 py-2 text-[12px] font-bold text-[#6F59FF]">
          {sourceLabel}
        </div>
      ) : null}

      {windows.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {windows.map((window) => {
            const tone = getWindowTone(window.type);

            return (
              <div
                key={`${window.title}-${window.time}`}
                className={`rounded-[26px] border p-5 ${tone.card}`}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${tone.text}`}
                  >
                    {tone.icon}
                  </div>

                  <span
                    className={`rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-black ${tone.text}`}
                  >
                    {window.time}
                  </span>
                </div>

                <h3 className="text-[22px] font-[900] tracking-[-0.035em]">
                  {window.title}
                </h3>

                <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#5B566E]">
                  {window.description}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Clock3 className="h-6 w-6" />}
          title="Chưa có rhythm window"
          description="Khi API trả về khung giờ từ chronotype hoặc check-in thật, ChronoFlow sẽ hiển thị ở đây."
          actionHref="/assessment"
          actionLabel="Làm bài test"
        />
      )}
    </Card>
  );
}

function RecommendationPanel({
  recommendations,
  onOpenEnergy,
}: {
  recommendations: NonNullable<RhythmData["recommendations"]>;
  onOpenEnergy: () => void;
}) {
  return (
    <Card>
      <SectionLabel icon={<Compass className="h-3.5 w-3.5" />} tone="green">
        Recommendation
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Gợi ý cá nhân hóa
      </h2>

      <div className="mt-6 space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((item) => (
            <SuggestionRow
              key={item.id}
              item={item}
              onOpenEnergy={onOpenEnergy}
            />
          ))
        ) : (
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="Chưa có gợi ý"
            description="Thêm task, focus session hoặc check-in năng lượng để ChronoFlow tạo gợi ý phù hợp hơn."
            actionHref="/planner"
            actionLabel="Mở planner"
          />
        )}
      </div>
    </Card>
  );
}

function SuggestionRow({
  item,
  onOpenEnergy,
}: {
  item: NonNullable<RhythmData["recommendations"]>[number];
  onOpenEnergy: () => void;
}) {
  const tone = getWindowTone(item.type || "peak");

  return (
    <div className="flex gap-4 rounded-[24px] border border-[#ECEAF4] bg-[#F7F8FE] p-4 shadow-sm">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${tone.text}`}
      >
        {tone.icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[17px] font-[900] tracking-[-0.02em]">
          {item.title}
        </h3>

        <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#6B647C]">
          {item.description}
        </p>

        {item.id === "energy-checkin" ? (
          <button
            type="button"
            onClick={onOpenEnergy}
            className="mt-3 inline-flex items-center gap-2 text-[12px] font-black text-[#6F59FF]"
          >
            Check-in ngay <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TaskAlignmentPanel({
  alignment,
  suggestedReschedules,
  actionLoadingId,
  actionMessage,
  onReschedule,
}: {
  alignment?: RhythmData["taskAlignment"];
  suggestedReschedules: SuggestedReschedule[];
  actionLoadingId: string | null;
  actionMessage: string | null;
  onReschedule: (item: SuggestedReschedule) => void;
}) {
  const score = alignment?.score ?? 0;

  return (
    <Card>
      <SectionLabel icon={<Target className="h-3.5 w-3.5" />} tone="purple">
        Task alignment
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Task có đang đúng nhịp không?
      </h2>

      <p className="mt-3 text-[15px] font-medium leading-relaxed text-[#5B566E]">
        Các task deep work / học tập nên nằm trong peak window:{" "}
        <span className="font-black text-[#6F59FF]">
          {alignment?.focusWindow || "chưa xác định"}
        </span>
        .
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <MiniMetric label="Alignment" value={`${score}%`} tone="purple" />
        <MiniMetric
          label="Đúng nhịp"
          value={`${alignment?.alignedCount ?? 0}`}
          tone="green"
        />
        <MiniMetric
          label="Lệch nhịp"
          value={`${alignment?.misalignedCount ?? 0}`}
          tone="orange"
        />
        <MiniMetric
          label="Chưa có giờ"
          value={`${alignment?.unscheduledCount ?? 0}`}
          tone="blue"
        />
      </div>

      <ProgressBar value={score} className="mt-5" />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <TaskBucket
          title="Đúng peak window"
          tasks={alignment?.alignedTasks ?? []}
          tone="green"
          empty="Chưa có task nào đúng peak."
        />
        <TaskBucket
          title="Lệch peak window"
          tasks={alignment?.misalignedTasks ?? []}
          tone="orange"
          empty="Chưa có task lệch peak."
        />
        <TaskBucket
          title="Chưa có giờ"
          tasks={alignment?.unscheduledTasks ?? []}
          tone="purple"
          empty="Không có task nào thiếu giờ bắt đầu."
        />
      </div>

      {suggestedReschedules.length > 0 ? (
        <div className="mt-6 rounded-[28px] border border-[#FED7AA] bg-[#FFFBF5] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#F59E0B] shadow-sm">
              <RefreshCw className="h-5 w-5" />
            </div>

            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#F59E0B]">
                Suggested reschedule
              </div>

              <h3 className="mt-1 text-[22px] font-[900] tracking-[-0.03em]">
                Task nên dời lịch
              </h3>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {suggestedReschedules.map((item) => (
              <div
                key={item.id}
                className="rounded-[22px] border border-[#FED7AA] bg-white/80 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-[15px] font-[900]">{item.title}</h4>

                    <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#6B647C]">
                      Đang ở{" "}
                      <span className="font-black text-[#F59E0B]">
                        {formatTimeRange(item.currentTime, item.currentEndTime)}
                      </span>{" "}
                      → nên dời về{" "}
                      <span className="font-black text-[#6F59FF]">
                        {item.suggestedWindow}
                      </span>
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#8A84A3]">
                      {item.reason}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={actionLoadingId === item.id}
                    onClick={() => onReschedule(item)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-4 text-[13px] font-bold text-white disabled:opacity-60"
                  >
                    {actionLoadingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-[#F59E0B]" />
                    )}
                    Dời sang peak
                  </button>
                </div>
              </div>
            ))}
          </div>

          {actionMessage ? (
            <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-[13px] font-bold text-[#6F59FF]">
              {actionMessage}
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

function TaskBucket({
  title,
  tasks,
  tone,
  empty,
}: {
  title: string;
  tasks: RhythmTask[];
  tone: "green" | "orange" | "purple";
  empty: string;
}) {
  const toneClass = {
    green: "border-[#BBF7D0] bg-[#ECFDF5]",
    orange: "border-[#FED7AA] bg-[#FFFBF5]",
    purple: "border-[#E9E5FF] bg-[#FBF9FF]",
  }[tone];

  return (
    <div className={`rounded-[24px] border p-4 ${toneClass}`}>
      <h3 className="text-[17px] font-[900] tracking-[-0.02em]">{title}</h3>

      <div className="mt-4 space-y-3">
        {tasks.length > 0 ? (
          tasks.slice(0, 4).map((task) => (
            <Link
              key={task.id}
              href={`/planner?taskId=${task.id}`}
              className="block rounded-[18px] bg-white/82 p-3 shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="text-[14px] font-[900]">{task.title}</div>
              <div className="mt-1 text-[12px] font-medium text-[#6B647C]">
                {task.typeLabel || task.type || "Task"} •{" "}
                {formatTimeRange(task.startTime, task.endTime)}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-[13px] font-medium leading-relaxed text-[#6B647C]">
            {empty}
          </p>
        )}
      </div>
    </div>
  );
}

function SleepRecoveryPanel({
  sleepRecovery,
  recoveryWarning,
}: {
  sleepRecovery?: RhythmData["sleepRecovery"];
  recoveryWarning?: RhythmData["recoveryWarning"];
}) {
  return (
    <Card>
      <SectionLabel icon={<MoonStar className="h-3.5 w-3.5" />} tone="blue">
        Sleep & Recovery
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Giấc ngủ và hồi phục
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MiniMetric
          label="Giờ ngủ"
          value={sleepRecovery?.targetSleepTime || "Chưa đặt"}
          tone="purple"
        />
        <MiniMetric
          label="Giờ dậy"
          value={sleepRecovery?.targetWakeTime || "Chưa đặt"}
          tone="blue"
        />
        <MiniMetric
          label="Recovery"
          value={sleepRecovery?.recoveryWindow || "Chưa có"}
          tone="green"
        />
      </div>

      {recoveryWarning ? (
        <div className="mt-6 rounded-[24px] border border-[#FED7AA] bg-[#FFFBF5] p-5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-[#F59E0B]" />

            <div>
              <h3 className="text-[18px] font-[900]">{recoveryWarning.title}</h3>

              <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#6B647C]">
                {recoveryWarning.description}
              </p>

              <Link
                href="/profile"
                className="mt-4 inline-flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.12em] text-[#6F59FF]"
              >
                {recoveryWarning.action} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[24px] border border-[#BBF7D0] bg-[#ECFDF5] p-5">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#10B981]" />

            <div>
              <h3 className="text-[18px] font-[900]">Recovery đang ổn</h3>

              <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#6B647C]">
                Hãy giữ nhịp nghỉ ngắn và tránh task nặng quá muộn trong ngày.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function WeeklyRhythmPanel({ weekly }: { weekly: WeeklyRhythm[] }) {
  return (
    <Card>
      <SectionLabel icon={<CalendarClock className="h-3.5 w-3.5" />} tone="orange">
        Weekly rhythm
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Nhịp tuần này
      </h2>

      <p className="mt-3 text-[15px] font-medium leading-relaxed text-[#5B566E]">
        Điểm càng cao nghĩa là task deep work / học tập trong ngày đó càng nằm
        đúng peak window.
      </p>

      {weekly.length > 0 ? (
        <div className="mt-6 grid grid-cols-7 gap-3">
          {weekly.map((item) => (
            <WeeklyBar key={item.date} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarClock className="h-6 w-6" />}
          title="Chưa có dữ liệu tuần"
          description="Khi bạn có task hoặc focus session trong tuần, ChronoFlow sẽ hiển thị nhịp tuần ở đây."
          actionHref="/planner"
          actionLabel="Mở planner"
        />
      )}
    </Card>
  );
}

function WeeklyBar({ item }: { item: WeeklyRhythm }) {
  const focusTasks = item.focusTasks ?? 0;
  const alignedTasks = item.alignedTasks ?? 0;
  const hasData = focusTasks > 0 || (item.totalTasks ?? 0) > 0 || (item.focusMinutes ?? 0) > 0;
  const alignmentPercent = focusTasks > 0 ? Math.round((alignedTasks / focusTasks) * 100) : null;
  const barHeight = alignmentPercent === null ? 8 : Math.max(12, alignmentPercent);

  return (
    <div
      className={`rounded-[22px] border p-3 text-center ${
        item.isToday
          ? "border-[#FCD34D] bg-[#FFF7ED]"
          : "border-[#ECEAF4] bg-[#F8F7FC]"
      }`}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.08em] text-[#8A84A3]">
        {item.label || shortDateLabel(item.date)}
      </div>

      <div className="mt-4 flex h-32 items-end justify-center rounded-full bg-white px-2 py-2 shadow-inner">
        <div
          className="w-full rounded-full bg-gradient-to-t from-[#6F59FF] to-[#4DA8FF]"
          style={{ height: `${barHeight}%`, opacity: hasData ? 1 : 0.25 }}
        />
      </div>

      <div className="mt-3 text-[13px] font-[900] text-[#1A1528]">
        {alignmentPercent === null ? "—" : `${alignmentPercent}%`}
      </div>

      <div className="mt-1 text-[11px] font-bold text-[#8A84A3]">
        {item.completedTasks ?? 0}/{item.totalTasks ?? 0} task
      </div>
    </div>
  );
}

function RhythmExplanation({
  chronotype,
  dataQuality,
  lastUpdated,
}: {
  chronotype: RhythmData["chronotype"];
  dataQuality?: RhythmData["dataQuality"];
  lastUpdated?: string | null;
}) {
  return (
    <div className="relative overflow-hidden rounded-[34px] bg-[#171326] p-7 text-white shadow-[0_25px_70px_rgba(26,21,40,0.16)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#6F59FF]/30 blur-[80px]" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-[#4DA8FF]" />
          Rhythm insight
        </div>

        <h2 className="mt-5 text-[34px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
          Cách đọc nhịp của bạn
        </h2>

        <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/70">
          Chronotype là điểm khởi đầu. Khi bạn có thêm check-in, task và focus
          session, ChronoFlow sẽ đọc nhịp sát hơn với thói quen thật.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <DarkMetric label="Chronotype" value={chronotype?.label || "Chưa có"} />
          <DarkMetric
            label="Nguồn"
            value={dataQuality?.hasPersonalEnergyCurve ? "Check-in thật" : "Chronotype"}
          />
          <DarkMetric label="Cập nhật" value={formatDate(lastUpdated)} />
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/10 p-5">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#10B981]" />

            <p className="text-[14px] font-medium leading-relaxed text-white/75">
              {dataQuality?.sourceLabel ||
                "Hãy tiếp tục dùng planner, focus session và check-in để ChronoFlow có thêm dữ liệu cá nhân hoá."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssessmentPanel({ assessment }: { assessment?: RhythmData["assessment"] }) {
  const scores = assessment?.scores ?? [];

  return (
    <Card>
      <SectionLabel icon={<Brain className="h-3.5 w-3.5" />} tone="purple">
        Assessment score
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Phân bổ điểm chronotype
      </h2>

      <div className="mt-6 space-y-3">
        {scores.length > 0 ? (
          scores.map((score) => (
            <div
              key={score.label}
              className="rounded-[22px] border border-[#ECEAF4] bg-[#F8F7FC] p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[15px] font-[900]">{score.label}</span>
                <span className="text-[13px] font-black text-[#6F59FF]">
                  {score.value} điểm
                </span>
              </div>

              <ProgressBar value={score.percent} />
            </div>
          ))
        ) : (
          <EmptyState
            icon={<Brain className="h-6 w-6" />}
            title="Chưa có điểm bài test"
            description="Hoàn thành assessment để xem phân bổ điểm chronotype."
            actionHref="/assessment"
            actionLabel="Làm bài test"
          />
        )}
      </div>
    </Card>
  );
}

function WeeklyInsightPanel({
  insight,
  comparison,
}: {
  insight?: RhythmData["weeklyInsight"];
  comparison: RhythmData["weekComparison"];
}) {
  return (
    <Card>
      <SectionLabel icon={<BarChart3 className="h-3.5 w-3.5" />} tone="green">
        Weekly insight
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Nhìn lại tuần gần nhất
      </h2>

      {insight ? (
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.75fr]">
          <div className="rounded-[24px] border border-[#ECEAF4] bg-[#F8F7FC] p-5">
            <div className="text-[12px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
              {insight.weekLabel}
            </div>

            <p className="mt-4 text-[15px] font-medium leading-relaxed text-[#5B566E]">
              {insight.summary}
            </p>

            {insight.recommendation ? (
              <div className="mt-5 rounded-[18px] border border-[#E9E5FF] bg-white p-4 text-[14px] font-medium leading-relaxed text-[#6B647C]">
                <span className="font-black text-[#6F59FF]">Gợi ý:</span>{" "}
                {insight.recommendation}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3">
            <MiniMetric
              label="Alignment"
              value={`${insight.alignmentScore ?? 0}%`}
              tone="purple"
            />
            <MiniMetric
              label="Task xong"
              value={`${insight.completedCount ?? 0}/${insight.totalCount ?? 0}`}
              tone="green"
            />
            <MiniMetric
              label="Deep work"
              value={`${insight.deepWorkCount ?? 0}`}
              tone="blue"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<BarChart3 className="h-6 w-6" />}
          title="Chưa có tổng kết tuần"
          description="Sau vài ngày dùng planner và focus session, ChronoFlow sẽ tạo insight tuần cho bạn."
          actionHref="/planner"
          actionLabel="Mở planner"
        />
      )}

      {comparison ? (
        <div className="mt-5 rounded-[24px] border border-[#DDEEFF] bg-[#F8FCFF] p-4">
          <h3 className="text-[15px] font-[900] text-[#1A1528]">
            So sánh với tuần trước
          </h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <MiniMetric
              label="Alignment"
              value={formatDelta(comparison.alignmentDelta, "%")}
              tone="purple"
            />
            <MiniMetric
              label="Task xong"
              value={formatDelta(comparison.completedDelta, "")}
              tone="green"
            />
            <MiniMetric
              label="Deep work"
              value={formatDelta(comparison.deepWorkDelta, "")}
              tone="blue"
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-[24px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 text-[13px] font-medium leading-relaxed text-[#6B647C]">
          Chưa đủ dữ liệu tuần trước để so sánh xu hướng tăng/giảm.
        </div>
      )}
    </Card>
  );
}

function QuickActionsPanel({ onOpenEnergy }: { onOpenEnergy: () => void }) {
  return (
    <Card>
      <SectionLabel icon={<ArrowRight className="h-3.5 w-3.5" />} tone="blue">
        Quick actions
      </SectionLabel>

      <h2 className="mt-5 text-[32px] font-[900] leading-tight tracking-[-0.04em] md:text-[36px]">
        Hành động tiếp theo
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <QuickAction
          href="/planner"
          icon={<CalendarClock className="h-5 w-5" />}
          title="Mở planner"
          desc="Sắp lại task theo peak window."
        />

        <button
          type="button"
          onClick={onOpenEnergy}
          className="group flex items-center gap-4 rounded-[24px] border border-[#ECEAF4] bg-[#F8F7FC] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
            <Activity className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-[900]">Check-in năng lượng</h3>
            <p className="mt-1 text-[13px] font-medium text-[#6B647C]">
              Cập nhật trạng thái hiện tại.
            </p>
          </div>

          <ArrowRight className="h-4 w-4 text-[#6F59FF] transition group-hover:translate-x-1" />
        </button>

        <QuickAction
          href="/dashboard"
          icon={<BarChart3 className="h-5 w-5" />}
          title="Về dashboard"
          desc="Xem tổng quan task, focus và điểm đổi thưởng."
        />
      </div>
    </Card>
  );
}

function QuickAction({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[24px] border border-[#ECEAF4] bg-[#F8F7FC] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-[900]">{title}</h3>
        <p className="mt-1 text-[13px] font-medium text-[#6B647C]">{desc}</p>
      </div>

      <ArrowRight className="h-4 w-4 text-[#6F59FF] transition group-hover:translate-x-1" />
    </Link>
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

  function updateField<K extends keyof EnergyCheckinForm>(
    key: K,
    value: EnergyCheckinForm[K],
  ) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Đóng modal"
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1528]/45 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-[520px] rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_30px_120px_rgba(26,21,40,0.20)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-[900] tracking-[-0.03em] text-[#1A1528]">
              Check-in năng lượng
            </h2>

            <p className="mt-1 text-[14px] font-medium leading-relaxed text-[#6B647C]">
              Lưu mức năng lượng thật tại thời điểm hiện tại.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F8F9FE] text-[#6B647C] transition hover:bg-[#F3F0FF] hover:text-[#6F59FF]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Field label="Điểm năng lượng 0–100">
            <input
              value={form.score}
              onChange={(event) => updateField("score", event.target.value)}
              type="number"
              min={0}
              max={100}
              placeholder="Ví dụ: 75"
              className="min-h-[48px] w-full rounded-2xl border border-[#EEF0F6] bg-[#F8F9FE] px-4 text-[14px] font-bold outline-none focus:border-[#C9BEFF] focus:bg-white"
            />
          </Field>

          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 90].map((score) => (
              <button
                type="button"
                key={score}
                onClick={() => updateField("score", String(score))}
                className="rounded-2xl border border-[#EEF0F6] bg-[#F8F9FE] px-3 py-3 text-[13px] font-black text-[#1A1528] transition hover:bg-white"
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
              className="min-h-[96px] w-full resize-none rounded-2xl border border-[#EEF0F6] bg-[#F8F9FE] px-4 py-3 text-[14px] font-bold outline-none focus:border-[#C9BEFF] focus:bg-white"
            />
          </Field>

          {error ? (
            <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-[13px] font-bold text-[#F59E0B]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] rounded-2xl border border-[#EEF0F6] bg-white px-5 text-[14px] font-bold text-[#1A1528]"
            >
              Huỷ
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4 text-[#4DA8FF]" />
              )}
              Lưu check-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`rounded-[34px] border border-white/80 bg-white/84 p-6 shadow-[0_20px_60px_rgba(26,21,40,0.055)] backdrop-blur-xl md:p-7 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tone: "purple" | "blue" | "green" | "orange";
}) {
  const toneClass = {
    purple: "bg-[#F3F0FF] text-[#6F59FF]",
    blue: "bg-[#EEF7FF] text-[#4DA8FF]",
    green: "bg-[#ECFDF5] text-[#10B981]",
    orange: "bg-[#FFF7ED] text-[#F59E0B]",
  }[tone];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] ${toneClass}`}
    >
      {icon}
      {children}
    </div>
  );
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "purple" | "blue" | "green" | "orange";
}) {
  const toneClass = {
    purple: "bg-[#F3F0FF] border-[#E9E5FF]",
    blue: "bg-[#F8FCFF] border-[#DDEEFF]",
    green: "bg-[#ECFDF5] border-[#BBF7D0]",
    orange: "bg-[#FFFBF5] border-[#FED7AA]",
  }[tone];

  return (
    <div className={`rounded-[22px] border p-4 shadow-sm ${toneClass}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[22px] font-[900] leading-tight tracking-[-0.03em] text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
        {label}
      </div>
      <div className="mt-2 text-[19px] font-[900] text-white">{value}</div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "orange";
}) {
  return (
    <div className="rounded-[22px] bg-white/80 p-4 shadow-sm">
      <div
        className={`text-[10px] font-black uppercase tracking-[0.14em] ${
          tone === "green" ? "text-[#10B981]" : "text-[#F59E0B]"
        }`}
      >
        {label}
      </div>
      <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {value}
      </p>
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

function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const actionClass =
    "mt-5 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black";

  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[28px] border border-[#ECEAF4] bg-[#F8F7FC] p-6 text-center">
      <div className="max-w-[420px]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
          {icon}
        </div>

        <h3 className="mt-4 text-[20px] font-[900] tracking-[-0.03em]">
          {title}
        </h3>

        <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#6B647C]">
          {description}
        </p>

        {onAction && actionLabel ? (
          <button type="button" onClick={onAction} className={actionClass}>
            {actionLabel} <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}

        {!onAction && actionHref && actionLabel ? (
          <Link href={actionHref} className={actionClass}>
            {actionLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-3 overflow-hidden rounded-full bg-[#EEEAFB] ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function EnergyLineChart({ points }: { points: EnergyPoint[] }) {
  const width = 760;
  const height = 280;
  const paddingX = 36;
  const paddingY = 34;
  const max = 100;
  const min = 0;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const coords = points.map((point, index) => {
    const x = paddingX + (usableWidth / Math.max(points.length - 1, 1)) * index;
    const y = paddingY + usableHeight - ((point.value - min) / (max - min)) * usableHeight;

    return { x, y, ...point };
  });

  const path = coords
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const fillPath = `${path} L${coords[coords.length - 1].x},${height - paddingY} L${coords[0].x},${height - paddingY} Z`;

  return (
    <div className="overflow-hidden rounded-[24px] bg-white/70 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full">
        <defs>
          <linearGradient id="energyStrokeRhythm" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#6F59FF" />
            <stop offset="100%" stopColor="#4DA8FF" />
          </linearGradient>
          <linearGradient id="energyFillRhythm" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6F59FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4DA8FF" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[25, 50, 75].map((line) => {
          const y = paddingY + usableHeight - ((line - min) / (max - min)) * usableHeight;

          return (
            <line
              key={line}
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
              stroke="#ECEAF4"
              strokeDasharray="8 8"
            />
          );
        })}

        <path d={fillPath} fill="url(#energyFillRhythm)" />
        <path
          d={path}
          fill="none"
          stroke="url(#energyStrokeRhythm)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((point) => (
          <g key={point.hour}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="white"
              stroke="#6F59FF"
              strokeWidth="4"
            />
            <text
              x={point.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-[#8A84A3] text-[18px] font-bold"
            >
              {point.hour}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -left-[8%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/70 blur-[110px]" />
      <div className="absolute right-[-10%] top-[12%] h-[420px] w-[420px] rounded-full bg-[#D9EAFF]/75 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-white/80 blur-[100px]" />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[560px] items-center justify-center rounded-[40px] border border-white bg-white/75 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#F3F0FF] text-[#6F59FF]">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>

        <div>
          <h1 className="text-[24px] font-[900] text-[#1A1528]">
            Đang tải nhịp của bạn
          </h1>
          <p className="mt-2 text-[14px] font-medium text-[#6B647C]">
            ChronoFlow đang chuẩn bị dữ liệu cho trang này.
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[560px] items-center justify-center rounded-[40px] border border-white bg-white/75 p-6 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl">
      <div className="max-w-[520px] text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#FFF7ED] text-[#F59E0B]">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="mt-5 text-[26px] font-[900] tracking-[-0.03em] text-[#1A1528]">
          Không tải được trang Nhịp của tôi
        </h1>

        <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#6B647C]">
          {error}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </button>
      </div>
    </div>
  );
}

function getWindowTone(type?: string) {
  if (type === "recovery") {
    return {
      card: "border-[#BBF7D0] bg-[#ECFDF5]",
      text: "text-[#10B981]",
      pill: "bg-[#D1FAE5] text-[#10B981]",
      icon: <Coffee className="h-5 w-5" />,
    };
  }

  if (type === "light" || type === "neutral") {
    return {
      card: "border-[#DDEEFF] bg-[#F8FCFF]",
      text: "text-[#4DA8FF]",
      pill: "bg-[#EEF7FF] text-[#4DA8FF]",
      icon: <Clock3 className="h-5 w-5" />,
    };
  }

  if (type === "creative") {
    return {
      card: "border-[#FED7AA] bg-[#FFFBF5]",
      text: "text-[#F59E0B]",
      pill: "bg-[#FFF7ED] text-[#F59E0B]",
      icon: <Sun className="h-5 w-5" />,
    };
  }

  return {
    card: "border-[#E9E5FF] bg-[#FBF9FF]",
    text: "text-[#6F59FF]",
    pill: "bg-[#F3F0FF] text-[#6F59FF]",
    icon: <Zap className="h-5 w-5" />,
  };
}

function getHeroSourceText(data: RhythmData | null) {
  if (data?.dataQuality?.hasPersonalEnergyCurve) {
    return "Gợi ý hôm nay đang dựa trên các lần check-in năng lượng gần đây của bạn.";
  }

  if (data?.chronotype?.label) {
    return "Trang đang bắt đầu từ chronotype của bạn. Check-in thêm để ChronoFlow cá nhân hoá sát hơn.";
  }

  return "Làm bài test chronotype để ChronoFlow xác định nhịp làm việc phù hợp với bạn.";
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start && !end) return "Chưa có giờ";
  if (start && end) return `${start} – ${end}`;
  return start || end || "Chưa có giờ";
}

function shortDateLabel(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("vi-VN", {
    weekday: "short",
  });
}

function formatDate(date?: string | null) {
  if (!date) return "Chưa có";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("vi-VN");
}

function formatDelta(value: number, suffix: string) {
  if (value > 0) return `+${value}${suffix}`;
  if (value < 0) return `${value}${suffix}`;
  return `0${suffix}`;
}