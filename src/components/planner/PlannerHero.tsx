"use client";

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Layers3,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { PlannerInsight } from "./PlannerBoard";

interface PlannerHeroProps {
  userName: string;
  chronotypeLabel: string;
  chronotypeSubtitle: string;
  headlineNote: string;
  energyLine: string;
  selectedDateLabel: string;
  pendingCount: number;
  completedCount: number;
  focusWindow: string;
  supportWindow: string;
  latestInsight: PlannerInsight | null;
  isOverloaded: boolean;
  onOpenAdd: () => void;
  onJumpToday: () => void;
}

function getInsightRange(latestInsight: PlannerInsight | null) {
  if (!latestInsight) return "Chưa có insight tuần";

  return latestInsight.weekLabel;
}

function getInsightSummary(latestInsight: PlannerInsight | null) {
  if (!latestInsight) {
    return "ChronoFlow cần thêm task, focus session và check-in năng lượng để đọc nhịp làm việc thật của bạn trong tuần.";
  }

  return latestInsight.summary;
}

function getHeroDescription({
  chronotypeLabel,
  focusWindow,
  supportWindow,
  pendingCount,
}: {
  chronotypeLabel: string;
  focusWindow: string;
  supportWindow: string;
  pendingCount: number;
}) {
  return `Planner này không chỉ là danh sách việc cần làm. ChronoFlow giúp bạn đặt task vào đúng khung năng lượng của nhịp ${chronotypeLabel}, ưu tiên việc khó trong ${focusWindow}, đẩy việc nhẹ sang ${supportWindow}, và giữ lịch đủ thoáng để không bị quá tải. Hiện bạn còn ${pendingCount} task cần xử lý trong planner.`;
}

export default function PlannerHero({
  userName,
  chronotypeLabel,
  chronotypeSubtitle,
  headlineNote,
  energyLine,
  selectedDateLabel,
  pendingCount,
  completedCount,
  focusWindow,
  supportWindow,
  latestInsight,
  isOverloaded,
  onOpenAdd,
  onJumpToday,
}: PlannerHeroProps) {
  const heroDescription = getHeroDescription({
    chronotypeLabel,
    focusWindow,
    supportWindow,
    pendingCount,
  });

  return (
   <section className="relative overflow-hidden rounded-[48px] border border-white/80 bg-[radial-gradient(circle_at_16%_8%,rgba(124,92,250,0.18)_0%,transparent_32%),radial-gradient(circle_at_86%_18%,rgba(96,165,250,0.22)_0%,transparent_34%),linear-gradient(135deg,rgba(250,248,255,0.98)_0%,rgba(240,234,255,0.94)_48%,rgba(232,240,255,0.92)_100%)] px-5 py-7 font-sans shadow-[0_32px_100px_rgba(92,72,190,0.13)] backdrop-blur-xl md:px-8 md:py-9 xl:px-10 xl:py-10">
<div className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-5 py-12 md:rounded-[48px] md:px-10 md:py-16">

        <div className="relative z-10 grid gap-10 xl:grid-cols-[minmax(0,1.04fr)_420px] xl:items-center">
          <div className="mx-auto max-w-4xl text-center xl:mx-0 xl:text-left">
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              ChronoFlow Planner
            </div>

            <h1 className="text-[clamp(2.2rem,4vw,3.8rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
  Kế hoạch hôm nay của{" "}
  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
    {userName}
  </span>
</h1>
<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
  <Zap className="h-3.5 w-3.5" />
  Theo nhịp {chronotypeLabel}
</div>

            <p className="mx-auto mt-6 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px] xl:mx-0">
              {heroDescription}
            </p>

            <p className="mx-auto mt-3 max-w-[720px] text-[14px] font-medium leading-relaxed text-[#7A7391] md:text-[14.5px] xl:mx-0">
              {headlineNote}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 xl:justify-start">
              <HeroPill
                icon={<Zap className="h-4 w-4" />}
                label={chronotypeSubtitle}
                tone="purple"
              />

              <HeroPill
                icon={<CalendarDays className="h-4 w-4" />}
                label={`Hôm nay: ${selectedDateLabel}`}
                tone="blue"
              />

              <HeroPill
                icon={<CheckCircle2 className="h-4 w-4" />}
                label={`${completedCount} task đã xong`}
                tone="green"
              />

              <HeroPill
                icon={<Clock3 className="h-4 w-4" />}
                label={`${pendingCount} task chờ xử lý`}
                tone="orange"
              />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3 xl:justify-start">
              <button
                type="button"
                onClick={onOpenAdd}
                className="group flex min-h-[58px] items-center gap-3 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-black"
              >
                <Plus className="h-4 w-4 text-[#4DA8FF]" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold uppercase leading-none tracking-wider text-gray-400">
                    Planner
                  </span>
                  <span className="text-[14px] font-bold leading-tight">
                    Thêm task vào planner
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={onJumpToday}
                className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/85 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F0FF]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#6F59FF]" />
                </div>
                <span className="text-[14px] font-bold leading-tight">
                  Quay về hôm nay
                </span>
              </button>
            </div>
          </div>

          <div className="hidden xl:block">
            <RhythmPreviewCard
              focusWindow={focusWindow}
              pendingCount={pendingCount}
              completedCount={completedCount}
              isOverloaded={isOverloaded}
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-10 grid max-w-[1120px] gap-5 pb-10 lg:grid-cols-2">
          <OverviewCard
            energyLine={energyLine}
            focusWindow={focusWindow}
            supportWindow={supportWindow}
            isOverloaded={isOverloaded}
          />

          <InsightPreviewCard
            latestInsight={latestInsight}
            pendingCount={pendingCount}
            completedCount={completedCount}
          />
        </div>
      </div>
    </section>
  );
}

function HeroGlow() {
  return (
    <>
      <div className="pointer-events-none absolute left-[8%] top-[-18%] h-[360px] w-[360px] rounded-full bg-white/45 blur-[90px]" />
      <div className="pointer-events-none absolute right-[-8%] top-[8%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/70 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[34%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/45 blur-[110px]" />
    </>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#6F59FF] via-[#6B6DFF] to-[#4DA8FF] bg-clip-text font-black text-transparent drop-shadow-[0_0_0.01px_rgba(26,21,40,0.35)]">
      {children}
    </span>
  );
}

function RhythmPreviewCard({
  focusWindow,
  pendingCount,
  completedCount,
  isOverloaded,
}: {
  focusWindow: string;
  pendingCount: number;
  completedCount: number;
  isOverloaded: boolean;
}) {
  return (
    <div className="relative rounded-[38px] border border-white/80 bg-white/70 p-5 shadow-[0_28px_70px_rgba(65,48,145,0.12)] backdrop-blur-2xl">
      <div className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center rounded-[24px] border border-white/80 bg-[#F3F0FF] text-[#6F59FF] shadow-[0_18px_40px_rgba(111,89,255,0.15)]">
        <Zap className="h-7 w-7" />
      </div>

      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF]">
        Today rhythm snapshot
      </div>

      <h2 className="mt-4 max-w-[310px] text-[1.8rem] font-[900] leading-[1.06] tracking-tight text-[#1A1528]">
        Giữ việc khó trong giờ não sáng nhất.
      </h2>

      <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#5B566E]">
        ChronoFlow đang đọc task thật để nhắc bạn khi lịch bị lệch peak window,
        backlog tăng hoặc ngày làm việc bắt đầu quá dày.
      </p>

      <div className="mt-6 rounded-[28px] border border-[#E9E5FF] bg-[#FCFBFF] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
              Focus window
            </div>
            <div className="mt-2 text-[1.45rem] font-[900] tracking-tight text-[#1A1528]">
              {focusWindow}
            </div>
          </div>

          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
            <Target className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#EEE9FF] shadow-inner">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <PreviewMetric label="Pending" value={String(pendingCount)} tone="orange" />
        <PreviewMetric label="Done" value={String(completedCount)} tone="green" />
      </div>

      <StatusCard isOverloaded={isOverloaded} compact />
    </div>
  );
}

function OverviewCard({
  energyLine,
  focusWindow,
  supportWindow,
  isOverloaded,
}: {
  energyLine: string;
  focusWindow: string;
  supportWindow: string;
  isOverloaded: boolean;
}) {
  return (
    <div className="rounded-[34px] border border-white/80 bg-white/84 p-5 shadow-[0_20px_54px_rgba(31,22,74,0.07)] backdrop-blur-xl md:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <SectionPill
            icon={<Target className="h-3.5 w-3.5" />}
            label="Tổng quan hôm nay"
          />

          <h2 className="mt-4 text-[1.65rem] font-[900] leading-tight tracking-tight text-[#1A1528] md:text-[1.8rem]">
            Planner đang ở trạng thái nào?
          </h2>

          <p className="mt-3 max-w-xl text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
            {energyLine}
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF] shadow-sm">
          <Activity className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniWindowCard
          label="Focus window"
          value={focusWindow}
          description="Khung nên giữ cho việc khó, học tập hoặc deep work."
          tone="purple"
        />

        <MiniWindowCard
          label="Khung phụ"
          value={supportWindow}
          description="Hợp cho việc nhẹ, admin hoặc các task ít hao năng lượng."
          tone="blue"
        />
      </div>

      <StatusCard isOverloaded={isOverloaded} />
    </div>
  );
}

function InsightPreviewCard({
  latestInsight,
  pendingCount,
  completedCount,
}: {
  latestInsight: PlannerInsight | null;
  pendingCount: number;
  completedCount: number;
}) {
  return (
    <div className="rounded-[34px] border border-white/80 bg-white/84 p-5 shadow-[0_20px_54px_rgba(31,22,74,0.07)] backdrop-blur-xl md:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <SectionPill
            icon={<Layers3 className="h-3.5 w-3.5" />}
            label="Insight gần nhất"
          />

          <h2 className="mt-4 text-[1.65rem] font-[900] leading-tight tracking-tight text-[#1A1528] md:text-[1.7rem]">
            {getInsightRange(latestInsight)}
          </h2>

          <p className="mt-3 max-w-xl text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
            {getInsightSummary(latestInsight)}
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-[#DDEEFF] bg-[#EEF6FF] text-[#4DA8FF] shadow-sm">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[#E9E5FF] bg-[#FCFBFF] px-4 py-4 text-[14px] font-medium leading-relaxed text-[#5B566E] shadow-sm">
        {latestInsight?.recommendation ||
          "Khi có thêm dữ liệu task, focus session và check-in năng lượng, ChronoFlow sẽ đưa ra gợi ý điều chỉnh lịch chính xác hơn."}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <StatChip label={`${pendingCount} task chờ xử lý`} tone="orange" />
        <StatChip label={`${completedCount} task hoàn thành`} tone="green" />
        {latestInsight ? (
          <StatChip
            label={`${latestInsight.alignmentScore}% đúng nhịp`}
            tone="purple"
          />
        ) : null}
      </div>
    </div>
  );
}

function HeroPill({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "purple" | "blue" | "green" | "orange";
}) {
  const style = {
    purple: "border-[#E9E5FF] bg-white/84 text-[#6F59FF]",
    blue: "border-[#DDEEFF] bg-white/84 text-[#4DA8FF]",
    green: "border-[#D1FAE5] bg-white/84 text-[#10B981]",
    orange: "border-[#FED7AA] bg-white/84 text-[#F59E0B]",
  }[tone];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[13.5px] font-bold shadow-[0_10px_24px_rgba(95,90,119,0.05)] backdrop-blur-md ${style}`}
    >
      <span>{icon}</span>
      <span className="text-[#5B566E]">{label}</span>
    </div>
  );
}

function SectionPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F3F0FF] px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
      {icon}
      {label}
    </div>
  );
}

function PreviewMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "orange" | "green";
}) {
  const style =
    tone === "orange"
      ? "border-[#FED7AA] bg-[#FFF7ED] text-[#F59E0B]"
      : "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]";

  return (
    <div className={`rounded-[22px] border p-4 shadow-sm ${style}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[1.45rem] font-[900] tracking-tight text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function MiniWindowCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: "purple" | "blue";
}) {
  const style =
    tone === "purple"
      ? "border-[#E9E5FF] bg-[#F3F0FF]"
      : "border-[#DDEEFF] bg-[#EEF6FF]";

  return (
    <div className={`rounded-[24px] border p-4 shadow-sm ${style}`}>
      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>

      <div className="mt-3 text-[1.25rem] font-[900] tracking-tight text-[#1A1528] md:text-[1.45rem]">
        {value}
      </div>

      <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
    </div>
  );
}

function StatusCard({
  isOverloaded,
  compact = false,
}: {
  isOverloaded: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`mt-4 rounded-[24px] border px-4 py-3 shadow-sm ${
        isOverloaded
          ? "border-[#FECACA] bg-[#FFF7F7] text-[#C55454]"
          : "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]"
      }`}
    >
      <div className="text-[15px] font-[900]">
        {isOverloaded ? "Lịch đang hơi dày" : "Lịch còn khoảng thở tốt"}
      </div>
      <p
        className={`mt-1 font-medium leading-relaxed ${
          compact ? "text-[12.5px]" : "text-[13.5px]"
        } ${isOverloaded ? "text-[#8F4A4A]" : "text-[#4F7D61]"}`}
      >
        {isOverloaded
          ? "Nên dời bớt task nhẹ để bảo vệ focus window."
          : "Bạn vẫn còn không gian để giữ nhịp làm việc ổn định."}
      </p>
    </div>
  );
}

function StatChip({
  label,
  tone,
}: {
  label: string;
  tone: "purple" | "green" | "orange";
}) {
  const style = {
    purple: "border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]",
    green: "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]",
    orange: "border-[#FED7AA] bg-[#FFF7ED] text-[#F59E0B]",
  }[tone];

  return (
    <div
      className={`inline-flex items-center rounded-full border px-4 py-2.5 text-[13px] font-bold shadow-sm ${style}`}
    >
      {label}
    </div>
  );
}