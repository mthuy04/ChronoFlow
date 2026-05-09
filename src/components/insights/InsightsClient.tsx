"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Layers3,
  LineChart,
  Loader2,
  PieChart,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

type Tone = "purple" | "blue" | "orange" | "green" | "red";

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
  tone: Tone;
};

type RuleInsight = {
  title: string;
  description: string;
  metric: string;
  tone: Tone;
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
  tone: Tone;
};

type PatternInsight = {
  title: string;
  description: string;
  evidence: string;
  tone: Tone;
};

type TrendPoint = {
  dateKey: string;
  label: string;
  value: number;
};

type EnergyFocusPoint = {
  dateKey: string;
  label: string;
  energyScore: number | null;
  focusMinutes: number;
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

type InsightsResponse = {
  success: boolean;
  error?: string;
  detail?: string;
  user?: {
    name: string;
    chronotype: "LION" | "BEAR" | "WOLF" | "DOLPHIN";
    chronotypeLabel: string;
    peakWindow: string;
  };
  summary?: {
    focusScore: number;
    focusMinutes: number;
    completedTasks: number;
    totalTasks: number;
    alignmentRate: number;
    overloadedDays: number;
    checkinStreak: number;
    backlogCount: number;
  };
  charts?: {
    dailySeries: DailyInsightPoint[];
    taskTypeBreakdown: TaskTypePoint[];
    alignment: {
      aligned: number;
      misaligned: number;
      unscheduled: number;
    };
  };
  advanced?: {
    plannerScore: number;
    plannerScoreBreakdown: PlannerScoreBreakdown;
    focusTrend: TrendPoint[];
    completionTrend: TrendPoint[];
    alignmentTrend: TrendPoint[];
    energyFocusCorrelation: EnergyFocusPoint[];
    peakComparison: PeakComparison;
    deadlineRisks: DeadlineRisk[];
    actionableInsights: ActionableInsight[];
    patterns: PatternInsight[];
  };
  insights?: RuleInsight[];
  recommendations?: Recommendation[];
};

const TONE_CLASS: Record<Tone, string> = {
  purple:
    "border-[#D6CBFF] bg-gradient-to-br from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF] text-[#6F59FF]",
  blue:
    "border-[#BFDDFF] bg-gradient-to-br from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF] text-[#4DA8FF]",
  orange:
    "border-[#FCD34D] bg-gradient-to-br from-[#FFF8F0] via-[#FFEDD6] to-[#FFE0B2] text-[#F59E0B]",
  green:
    "border-[#6EE7B7] bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] text-[#10B981]",
  red:
    "border-[#FECACA] bg-gradient-to-br from-[#FFF7F7] via-[#FEE2E2] to-[#FECACA] text-[#C55454]",
};

function getMax(values: number[]) {
  return Math.max(...values, 1);
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} phút`;

  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;

  return remain > 0 ? `${hours}h${remain}` : `${hours}h`;
}

function getLoadClass(level: DailyInsightPoint["loadLevel"]) {
  if (level === "heavy") return "bg-[#C55454]";
  if (level === "balanced") return "bg-[#F59E0B]";
  if (level === "light") return "bg-[#6F59FF]";
  return "bg-[#E9E5FF]";
}

function getRiskTone(status: DeadlineRisk["status"]): Tone {
  if (status === "overdue" || status === "today") return "red";
  if (status === "soon") return "orange";
  return "blue";
}

function getScoreTone(score: number): Tone {
  if (score >= 75) return "green";
  if (score >= 50) return "orange";
  return "red";
}

function getCorrelationLabel(points: EnergyFocusPoint[]) {
  const valid = points.filter((point) => point.energyScore !== null);

  if (valid.length < 2) {
    return "Cần thêm check-in";
  }

  const highEnergy = valid.filter((point) => (point.energyScore ?? 0) >= 70);
  const lowEnergy = valid.filter((point) => (point.energyScore ?? 0) < 55);

  if (highEnergy.length === 0 || lowEnergy.length === 0) {
    return "Chưa rõ pattern";
  }

  const highAvg = Math.round(
    highEnergy.reduce((sum, point) => sum + point.focusMinutes, 0) /
      highEnergy.length,
  );
  const lowAvg = Math.round(
    lowEnergy.reduce((sum, point) => sum + point.focusMinutes, 0) /
      lowEnergy.length,
  );

  if (highAvg > lowAvg) return "Energy cao → focus tốt hơn";
  if (highAvg < lowAvg) return "Energy cao chưa chuyển hóa thành focus";
  return "Energy và focus khá cân bằng";
}

export default function InsightsClient() {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadInsights() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/insights", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as
        | InsightsResponse
        | null;

      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.detail || payload?.error || "Không thể tải insights.",
        );
      }

      setData(payload);
    } catch (error) {
      setData({
        success: false,
        error: error instanceof Error ? error.message : "Không thể tải insights.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadInsights();
  }, []);

  const maxWeeklyFocus = useMemo(
    () => getMax(data?.charts?.dailySeries.map((item) => item.focusMinutes) ?? []),
    [data],
  );

  const maxFocusTrend = useMemo(
    () => getMax(data?.advanced?.focusTrend.map((item) => item.value) ?? []),
    [data],
  );

  const maxCorrelationFocus = useMemo(
    () =>
      getMax(
        data?.advanced?.energyFocusCorrelation.map(
          (item) => item.focusMinutes,
        ) ?? [],
      ),
    [data],
  );

  if (isLoading) {
    return (
      <InsightsShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-[34px] border border-white/80 bg-white/82 p-8 text-center shadow-[0_24px_80px_rgba(26,21,40,0.08)] backdrop-blur-xl">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#6F59FF]" />
            <div className="mt-4 text-[18px] font-[900] text-[#1A1528]">
              Đang đọc dữ liệu insights...
            </div>
            <p className="mx-auto mt-2 max-w-[420px] text-[14px] font-medium leading-relaxed text-[#5B566E]">
              ChronoFlow đang tổng hợp task, focus session và energy check-in từ
              dữ liệu thật của bạn.
            </p>
          </div>
        </div>
      </InsightsShell>
    );
  }

  if (!data?.summary || !data.charts || !data.user || !data.advanced) {
    return (
      <InsightsShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="max-w-[620px] rounded-[40px] border border-white/80 bg-white/85 p-8 text-center shadow-[0_24px_80px_rgba(26,21,40,0.08)] backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FECACA] bg-[#FFF7F7] text-[#C55454]">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h1 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-tight tracking-tight text-[#1A1528]">
              Chưa tải được{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                Insights
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-[500px] text-[15px] font-medium leading-relaxed text-[#5B566E]">
              {data?.error ||
                "Hãy đăng nhập và tạo thêm dữ liệu planner để xem phân tích."}
            </p>

            <button
              type="button"
              onClick={() => void loadInsights()}
              className="mt-6 inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
            >
              <RefreshCw className="h-4 w-4 text-[#4DA8FF]" />
              Tải lại
            </button>
          </div>
        </div>
      </InsightsShell>
    );
  }

  const summary = data.summary;
  const charts = data.charts;
  const user = data.user;
  const advanced = data.advanced;
  const insights = data.insights ?? [];
  const recommendations = data.recommendations ?? [];
  const plannerTone = getScoreTone(advanced.plannerScore);
  const correlationLabel = getCorrelationLabel(advanced.energyFocusCorrelation);
  const peakTotal =
    advanced.peakComparison.peakMinutes +
    advanced.peakComparison.offPeakMinutes;
  const peakPercent =
    peakTotal > 0
      ? Math.round((advanced.peakComparison.peakMinutes / peakTotal) * 100)
      : 0;

  return (
    <InsightsShell>
      <HeroSection user={user} summary={summary} />

      <SectionWrapper>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Target className="h-6 w-6" />}
            label="Focus score"
            value={`${summary.focusScore}%`}
            description="Deep work đúng peak window"
            tone="purple"
          />
          <MetricCard
            icon={<Clock3 className="h-6 w-6" />}
            label="Focus minutes"
            value={formatMinutes(summary.focusMinutes)}
            description="Tổng focus session đã lưu"
            tone="blue"
          />
          <MetricCard
            icon={<CheckCircle2 className="h-6 w-6" />}
            label="Completed"
            value={`${summary.completedTasks}/${summary.totalTasks}`}
            description="Task đã hoàn thành"
            tone="green"
          />
          <MetricCard
            icon={<AlertTriangle className="h-6 w-6" />}
            label="Overload days"
            value={String(summary.overloadedDays)}
            description="Ngày có tải cao trong tuần"
            tone="orange"
          />
        </div>
      </SectionWrapper>

      <SectionWrapper id="planner-score">
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <PlannerScoreCard
            score={advanced.plannerScore}
            tone={plannerTone}
            breakdown={advanced.plannerScoreBreakdown}
          />

          <ChartShell
            icon={<Sparkles className="h-4 w-4" />}
            eyebrow="Pattern detection"
            title="ChronoFlow phát hiện pattern gì?"
            description="Các pattern được rút ra từ task, focus session và check-in thật."
          >
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {advanced.patterns.map((pattern) => (
                <PatternCard key={pattern.title} item={pattern} />
              ))}
            </div>
          </ChartShell>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <ChartShell
            icon={<BarChart3 className="h-4 w-4" />}
            eyebrow="Weekly focus"
            title="Focus minutes theo tuần"
            description="Mỗi cột là tổng số phút focus đã lưu trong ngày."
          >
            <div className="mt-6 flex h-[280px] items-end gap-3 rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-inner">
              {charts.dailySeries.map((day) => (
                <div
                  key={day.dateKey}
                  className="flex h-full min-w-0 flex-1 flex-col justify-end"
                >
                  <div className="flex flex-1 items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${Math.max(
                          8,
                          (day.focusMinutes / maxWeeklyFocus) * 100,
                        )}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-full rounded-t-2xl bg-gradient-to-b from-[#6F59FF] to-[#4DA8FF] shadow-[0_14px_30px_rgba(111,89,255,0.18)]"
                    />
                  </div>
                  <div className="mt-3 truncate text-center text-[11px] font-bold text-[#8A84A3]">
                    {day.label}
                  </div>
                  <div className="mt-1 text-center text-[11px] font-black text-[#1A1528]">
                    {day.focusMinutes}p
                  </div>
                </div>
              ))}
            </div>
          </ChartShell>

          <ChartShell
            icon={<PieChart className="h-4 w-4" />}
            eyebrow="Task type"
            title="Phân bổ loại task"
            description="Tỷ trọng task theo nhóm công việc."
          >
            <div className="mt-6 space-y-4">
              {charts.taskTypeBreakdown.length > 0 ? (
                charts.taskTypeBreakdown.map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] font-black text-[#1A1528]">
                        {item.label}
                      </div>
                      <div className="text-[12px] font-bold text-[#8A84A3]">
                        {item.count} task • {item.percentage}%
                      </div>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#EEE9FF]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.55 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyMini text="Chưa có task để phân tích loại công việc." />
              )}
            </div>
          </ChartShell>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartShell
            icon={<LineChart className="h-4 w-4" />}
            eyebrow="Focus trend"
            title="Xu hướng focus 14 ngày"
            description="Theo dõi số phút focus theo thời gian để thấy bạn đang tăng hay giảm nhịp."
          >
            <TrendBars
              points={advanced.focusTrend}
              maxValue={maxFocusTrend}
              suffix="p"
            />
          </ChartShell>

          <ChartShell
            icon={<TrendingUp className="h-4 w-4" />}
            eyebrow="Completion trend"
            title="Tỷ lệ hoàn thành theo ngày"
            description="Mỗi cột thể hiện phần trăm task hoàn thành trong ngày."
          >
            <TrendBars
              points={advanced.completionTrend}
              maxValue={100}
              suffix="%"
            />
          </ChartShell>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartShell
            icon={<Activity className="h-4 w-4" />}
            eyebrow="Energy ↔ Focus"
            title="Energy và focus có đi cùng nhau không?"
            description={correlationLabel}
          >
            <div className="mt-6 space-y-4">
              {advanced.energyFocusCorrelation.map((point) => (
                <div
                  key={point.dateKey}
                  className="rounded-[24px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[13px] font-black text-[#1A1528]">
                      {point.label}
                    </div>
                    <div className="text-[12px] font-bold text-[#8A84A3]">
                      Energy {point.energyScore ?? "—"} • {point.focusMinutes}p
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <div className="h-3 overflow-hidden rounded-full bg-white shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(4, point.energyScore ?? 0)}%`,
                        }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#A7F3D0]"
                      />
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(
                            4,
                            (point.focusMinutes / maxCorrelationFocus) * 100,
                          )}%`,
                        }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartShell>

          <ChartShell
            icon={<Target className="h-4 w-4" />}
            eyebrow="Peak vs off-peak"
            title="Deep work trong peak hay ngoài peak?"
            description="So sánh tổng phút deep work/học tập nằm đúng khung mạnh với ngoài khung mạnh."
          >
            <div className="mt-6 rounded-[28px] border border-[#E9E5FF] bg-[#FBF9FF] p-5 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                    Peak ratio
                  </div>
                  <div className="mt-2 text-[3rem] font-[900] leading-none tracking-tight text-[#1A1528]">
                    {peakPercent}%
                  </div>
                  <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
                    {advanced.peakComparison.peakMinutes} phút peak •{" "}
                    {advanced.peakComparison.offPeakMinutes} phút off-peak
                  </p>
                </div>

                <div className="relative grid h-34 w-34 place-items-center rounded-full border-[16px] border-[#EEE9FF] bg-white p-2 shadow-sm">
                  <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-[1.35rem] font-[900] text-white shadow-[0_16px_35px_rgba(111,89,255,0.18)]">
                    {advanced.peakComparison.peakTasks}/
                    {advanced.peakComparison.peakTasks +
                      advanced.peakComparison.offPeakTasks}
                  </div>
                </div>
              </div>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-white shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${peakPercent}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
                />
              </div>
            </div>
          </ChartShell>
        </div>
      </SectionWrapper>

      <SectionWrapper id="deadline-risk">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <ChartShell
            icon={<Layers3 className="h-4 w-4" />}
            eyebrow="Actionable insights"
            title="Insight theo từng task thật"
            description="Các gợi ý cụ thể dựa trên task đang lệch nhịp, backlog hoặc deadline risk."
          >
            <div className="mt-6 space-y-4">
              {advanced.actionableInsights.length > 0 ? (
                advanced.actionableInsights.map((item) => (
                  <ActionableInsightCard key={item.id} item={item} />
                ))
              ) : (
                <EmptyMini text="Chưa có task-level insight mạnh. Planner của bạn đang khá gọn hoặc cần thêm dữ liệu task." />
              )}
            </div>
          </ChartShell>

          <ChartShell
            icon={<AlertTriangle className="h-4 w-4" />}
            eyebrow="Deadline risk"
            title="Task có nguy cơ trễ hạn"
            description="Ưu tiên các task gần deadline, quá deadline hoặc chưa được gắn lịch."
          >
            <div className="mt-6 space-y-4">
              {advanced.deadlineRisks.length > 0 ? (
                advanced.deadlineRisks.map((risk) => (
                  <DeadlineRiskCard key={risk.taskId} item={risk} />
                ))
              ) : (
                <EmptyMini text="Chưa phát hiện task có rủi ro deadline lớn." />
              )}
            </div>
          </ChartShell>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <ChartShell
          icon={<CalendarDays className="h-4 w-4" />}
          eyebrow="Daily load heatmap"
          title="Bản đồ tải công việc trong tuần"
          description="Ô càng đậm nghĩa là ngày đó càng nhiều task hoặc nhiều planned minutes."
        >
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {charts.dailySeries.map((day) => (
              <div
                key={day.dateKey}
                className="rounded-[24px] border border-[#EEF0F6] bg-white/82 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(26,21,40,0.07)]"
              >
                <div
                  className={`h-20 rounded-[20px] shadow-inner ${getLoadClass(
                    day.loadLevel,
                  )}`}
                />
                <div className="mt-3 text-[13px] font-black text-[#1A1528]">
                  {day.label}
                </div>
                <div className="mt-1 text-[12px] font-medium leading-relaxed text-[#5B566E]">
                  {day.plannedMinutes} phút • {day.taskCount} task
                </div>
              </div>
            ))}
          </div>
        </ChartShell>
      </SectionWrapper>

      <SectionWrapper>
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartShell
            icon={<Sparkles className="h-4 w-4" />}
            eyebrow="Rule-based insights"
            title="ChronoFlow phát hiện gì?"
            description="Các insight được tạo từ dữ liệu thật, chưa dùng dữ liệu giả."
          >
            <div className="mt-6 space-y-4">
              {insights.length > 0 ? (
                insights.map((item) => <InsightCard key={item.title} item={item} />)
              ) : (
                <EmptyMini text="Chưa có rule-based insight nổi bật từ dữ liệu hiện tại." />
              )}
            </div>
          </ChartShell>

          <ChartShell
            icon={<TrendingUp className="h-4 w-4" />}
            eyebrow="Recommended actions"
            title="Nên làm gì tiếp theo?"
            description="Các hành động ưu tiên để cải thiện planner tuần này."
          >
            <div className="mt-6 space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((item) => (
                  <RecommendationCard key={item.title} item={item} />
                ))
              ) : (
                <EmptyMini text="Chưa có recommendation mạnh. Planner của bạn đang khá ổn." />
              )}
            </div>
          </ChartShell>
        </div>
      </SectionWrapper>
    </InsightsShell>
  );
}

function InsightsShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] pb-24 pt-6 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <BackgroundPattern />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 lg:px-8">
        {children}
      </div>
    </main>
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
        <div className="absolute bottom-[18%] left-[32%] h-[500px] w-[500px] rounded-full bg-white/70 blur-[120px]" />
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

function HeroSection({
  user,
  summary,
}: {
  user: NonNullable<InsightsResponse["user"]>;
  summary: NonNullable<InsightsResponse["summary"]>;
}) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white bg-white shadow-[0_22px_80px_rgba(26,21,40,0.06)] md:rounded-[48px]">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-5 py-12 md:px-10 md:py-16">
        <div className="pointer-events-none absolute left-[8%] top-[-20%] h-[360px] w-[360px] rounded-full bg-white/45 blur-[90px]" />
        <div className="pointer-events-none absolute right-[-8%] top-[12%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/70 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            ChronoFlow Insights
          </div>

          <h1 className="mx-auto max-w-[920px] text-[clamp(2rem,4vw,4rem)] font-[900] leading-[1.02] tracking-tight text-[#1A1528]">
            Hiểu nhịp làm việc thật của{" "}
            <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
              {user.name}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16.5px]">
            Trang này tổng hợp task, focus session và energy check-in để cho bạn
            thấy ngày nào làm tốt, deep work có đúng peak window không, lịch có
            đang quá tải không, và nên điều chỉnh gì tiếp theo.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <HeroPill
              icon={<Brain className="h-4 w-4" />}
              label={`Chronotype: ${user.chronotypeLabel}`}
            />
            <HeroPill
              icon={<Zap className="h-4 w-4" />}
              label={`Peak window: ${user.peakWindow}`}
            />
            <HeroPill
              icon={<Flame className="h-4 w-4" />}
              label={`${summary.checkinStreak} ngày check-in streak`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 bg-white px-6 py-10 md:grid-cols-3 md:px-10 lg:px-14">
        <TopFeature
          icon={<Target className="h-5 w-5 text-[#6F59FF]" />}
          title="Đọc nhịp làm việc"
          description="Tổng hợp focus minutes, task hoàn thành và alignment với peak window."
        />
        <TopFeature
          icon={<Activity className="h-5 w-5 text-[#4DA8FF]" />}
          title="So năng lượng với focus"
          description="Đối chiếu energy check-in và focus session để tìm pattern thật."
        />
        <TopFeature
          icon={<TrendingUp className="h-5 w-5 text-[#10B981]" />}
          title="Gợi ý cải thiện"
          description="Đưa ra insight cụ thể cho planner, deadline risk và thói quen tuần này."
        />
      </div>
    </section>
  );
}

function HeroPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/84 px-5 py-3 text-[13.5px] font-bold text-[#5B566E] shadow-[0_10px_24px_rgba(95,90,119,0.05)] backdrop-blur-md">
      <span className="text-[#6F59FF]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function TopFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="text-[17px] font-[900] leading-tight text-[#1A1528]">
          {title}
        </h4>
        <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          {description}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone: Exclude<Tone, "red">;
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
        {description}
      </p>
    </motion.div>
  );
}

function PlannerScoreCard({
  score,
  tone,
  breakdown,
}: {
  score: number;
  tone: Tone;
  breakdown: PlannerScoreBreakdown;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border p-6 shadow-[0_20px_60px_rgba(26,21,40,0.06)] ${TONE_CLASS[tone]}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/55 blur-3xl" />

      <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/78 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
        <Gauge className="h-3.5 w-3.5" />
        Planner score
      </div>

      <div className="relative z-10 mt-6 text-[4.2rem] font-[900] leading-none tracking-tight text-[#1A1528]">
        {score}
        <span className="text-[1.5rem] tracking-tight text-[#8A84A3]">
          /100
        </span>
      </div>

      <p className="relative z-10 mt-4 text-[14px] font-medium leading-relaxed text-[#5B566E]">
        Điểm tổng hợp từ alignment, completion, overload và consistency check-in.
      </p>

      <div className="relative z-10 mt-6 space-y-4">
        <ScoreBreakdown label="Alignment" value={breakdown.alignment} />
        <ScoreBreakdown label="Completion" value={breakdown.completion} />
        <ScoreBreakdown label="Overload balance" value={breakdown.overload} />
        <ScoreBreakdown label="Consistency" value={breakdown.consistency} />
      </div>
    </section>
  );
}

function ScoreBreakdown({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-black uppercase tracking-[0.12em] text-[#5B566E]">
          {label}
        </div>
        <div className="text-[12px] font-black text-[#1A1528]">{value}%</div>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/80 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.55 }}
          className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
        />
      </div>
    </div>
  );
}

function ChartShell({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl md:p-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F3F0FF] px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
        {icon}
        {eyebrow}
      </div>
      <h2 className="mt-4 text-[clamp(1.45rem,2.4vw,1.9rem)] font-[900] leading-tight tracking-tight text-[#1A1528]">
        {title}
      </h2>
      <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
      {children}
    </section>
  );
}

function TrendBars({
  points,
  maxValue,
  suffix,
}: {
  points: TrendPoint[];
  maxValue: number;
  suffix: string;
}) {
  return (
    <div className="mt-6 flex h-[260px] items-end gap-2 rounded-[28px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-inner">
      {points.map((point) => (
        <div
          key={point.dateKey}
          className="flex h-full min-w-0 flex-1 flex-col justify-end"
        >
          <div className="flex flex-1 items-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{
                height: `${Math.max(6, (point.value / maxValue) * 100)}%`,
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="w-full rounded-t-2xl bg-gradient-to-b from-[#6F59FF] to-[#4DA8FF] shadow-[0_12px_28px_rgba(111,89,255,0.14)]"
            />
          </div>
          <div className="mt-3 truncate text-center text-[10px] font-bold text-[#8A84A3]">
            {point.label}
          </div>
          <div className="mt-1 text-center text-[10px] font-black text-[#1A1528]">
            {point.value}
            {suffix}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionableInsightCard({ item }: { item: ActionableInsight }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border p-5 shadow-[0_16px_38px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${TONE_CLASS[item.tone]}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/50 blur-3xl" />
      <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.16em]">
        Task-level action
      </div>
      <h3 className="relative z-10 mt-3 text-[1.1rem] font-[900] tracking-tight text-[#1A1528]">
        {item.title}
      </h3>
      <p className="relative z-10 mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {item.description}
      </p>

      <div className="relative z-10 mt-4 grid gap-3 md:grid-cols-2">
        <MiniInfo label="Hiện tại" value={item.currentSchedule} />
        <MiniInfo label="Gợi ý" value={item.suggestedSchedule} />
      </div>
    </div>
  );
}

function DeadlineRiskCard({ item }: { item: DeadlineRisk }) {
  const tone = getRiskTone(item.status);

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-5 shadow-[0_16px_38px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${TONE_CLASS[tone]}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/50 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em]">
            {item.priority} priority
          </div>
          <h3 className="mt-2 text-[1rem] font-[900] text-[#1A1528]">
            {item.taskName}
          </h3>
        </div>
        <div className="rounded-full bg-white/76 px-3 py-1.5 text-[12px] font-black text-[#1A1528] shadow-sm">
          {item.daysLeft < 0
            ? `Quá ${Math.abs(item.daysLeft)} ngày`
            : item.daysLeft === 0
              ? "Hôm nay"
              : `Còn ${item.daysLeft} ngày`}
        </div>
      </div>

      <p className="relative z-10 mt-3 text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {item.reason}
      </p>
      <div className="relative z-10 mt-3 rounded-[18px] bg-white/72 px-4 py-3 text-[12px] font-bold text-[#5B566E] shadow-sm">
        Deadline: {item.deadline}
      </div>
    </div>
  );
}

function PatternCard({ item }: { item: PatternInsight }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-5 shadow-[0_16px_38px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${TONE_CLASS[item.tone]}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/50 blur-3xl" />
      <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.16em]">
        Pattern
      </div>
      <h3 className="relative z-10 mt-3 text-[1rem] font-[900] text-[#1A1528]">
        {item.title}
      </h3>
      <p className="relative z-10 mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {item.description}
      </p>
      <div className="relative z-10 mt-4 rounded-[18px] bg-white/72 px-4 py-3 text-[12px] font-black text-[#1A1528] shadow-sm">
        {item.evidence}
      </div>
    </div>
  );
}

function InsightCard({ item }: { item: RuleInsight }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-5 shadow-[0_16px_38px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${TONE_CLASS[item.tone]}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/50 blur-3xl" />
      <div className="relative z-10 text-[1.35rem] font-[900] tracking-tight text-[#1A1528]">
        {item.metric}
      </div>
      <h3 className="relative z-10 mt-2 text-[1rem] font-[900] text-[#1A1528]">
        {item.title}
      </h3>
      <p className="relative z-10 mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {item.description}
      </p>
    </div>
  );
}

function RecommendationCard({ item }: { item: Recommendation }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border p-5 shadow-[0_16px_38px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${TONE_CLASS[item.tone]}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/50 blur-3xl" />

      <div className="relative z-10 flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border border-white/80 bg-white/70 p-2 text-[#6F59FF] shadow-sm">
          <Layers3 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-[1rem] font-[900] text-[#1A1528]">
            {item.title}
          </h3>
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-white/76 px-4 py-3 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 text-[12px] font-black leading-relaxed text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function EmptyMini({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-[#EEF0F6] bg-[#F8F9FE] p-5 text-[13px] font-medium leading-relaxed text-[#5B566E]">
      {text}
    </div>
  );
}

function getTone(tone: Exclude<Tone, "red">) {
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
