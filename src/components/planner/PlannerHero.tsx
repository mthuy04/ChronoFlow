"use client";

import { AlertTriangle, CalendarClock, CheckCircle2, Plus, Sparkles, Zap } from "lucide-react";
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
  return (
    <section className="overflow-hidden rounded-[40px] border border-white/80 bg-white/92 shadow-[0_28px_90px_rgba(97,76,197,0.10)] backdrop-blur-xl">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F3EEFF_0%,#EDE6FF_42%,#E6DEFF_100%)] px-5 py-8 md:px-8 md:py-9 xl:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[7%] top-[-15%] h-[220px] w-[220px] rounded-full bg-[#DCCEFF]/70 blur-[90px]" />
          <div className="absolute right-[8%] top-[8%] h-[170px] w-[170px] rounded-full bg-[#D9EAFF]/60 blur-[90px]" />
        </div>

        <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_22px_rgba(111,89,255,0.08)] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              ChronoFlow Planner
            </div>

            <h1 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
              Kế hoạch của{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                {userName}
              </span>
              , <br className="hidden sm:block" />
              theo nhịp{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                {chronotypeLabel}
              </span>
              .
            </h1>
            

            <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
              {headlineNote} {energyLine}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/92 px-4 py-3 text-[13px] font-bold text-[#5F5A77] shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
                <Zap className="h-4 w-4 text-[#7C5CFA]" />
                {chronotypeSubtitle}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/92 px-4 py-3 text-[13px] font-bold text-[#5F5A77] shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
                <CalendarClock className="h-4 w-4 text-[#7C5CFA]" />
                Hôm nay: {selectedDateLabel}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/92 px-4 py-3 text-[13px] font-bold text-[#5F5A77] shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
                <CheckCircle2 className="h-4 w-4 text-[#7C5CFA]" />
                {completedCount} task đã xong
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenAdd}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(26,21,40,0.22)] transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                Thêm task vào planner
              </button>

              <button
                type="button"
                onClick={onJumpToday}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-6 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
              >
                Quay về hôm nay
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[30px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_40px_rgba(97,76,197,0.08)] backdrop-blur-xl">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                    Tổng quan hôm nay
                  </div>
                  <div className="mt-2 text-[1.35rem] font-black tracking-tight text-[#241F3D]">
                    Planner đang ở trạng thái nào?
                  </div>
                </div>

                {isOverloaded ? (
                  <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#D85B5B]">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA]">
                    <Zap className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)] p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                    Focus window
                  </div>
                  <div className="mt-2 text-[1.45rem] font-black tracking-tight text-[#241F3D]">
                    {focusWindow}
                  </div>
                  <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">
                    Khung nên giữ cho việc khó.
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)] p-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                    Khung phụ
                  </div>
                  <div className="mt-2 text-[1.45rem] font-black tracking-tight text-[#241F3D]">
                    {supportWindow}
                  </div>
                  <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">
                    Hợp cho việc nhẹ hoặc nhịp chậm hơn.
                  </div>
                </div>
              </div>

              <div
                className={`mt-4 rounded-[22px] border px-4 py-3 ${
                  isOverloaded
                    ? "border-[#FFD8D8] bg-[linear-gradient(135deg,#FFF7F7_0%,#FFF1F1_100%)] text-[#8F4A4A]"
                    : "border-[#DAF2E5] bg-[linear-gradient(135deg,#F7FFFA_0%,#F1FFF7_100%)] text-[#2E7C59]"
                }`}
              >
                <div className="font-black">
                  {isOverloaded
                    ? "Lịch hôm nay đang khá dày"
                    : "Lịch hôm nay vẫn còn khoảng thở tốt"}
                </div>
                <div className="mt-1 text-[13px] leading-6">
                  {isOverloaded
                    ? "Bạn nên cân nhắc đẩy bớt việc nhẹ sang backlog hoặc reschedule để bảo vệ block tập trung."
                    : "Đây là trạng thái tốt để giữ chất lượng deep work và tránh vỡ nhịp cuối ngày."}
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/80 bg-white/85 p-5 shadow-[0_16px_40px_rgba(97,76,197,0.08)] backdrop-blur-xl">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                Insight gần nhất
              </div>

              <div className="mt-3 text-[1.2rem] font-black tracking-tight text-[#241F3D]">
                {latestInsight?.weekLabel || "Chưa có insight tuần"}
              </div>

              <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
                {latestInsight?.summary ||
                  "Planner sẽ mạnh hơn khi bạn thêm task thật, hoàn thành task và bắt đầu để hệ thống hiểu nhịp làm việc của bạn."}
              </p>

              {latestInsight?.recommendation ? (
                <div className="mt-4 rounded-[20px] border border-[#ECE8FF] bg-[#FAF9FF] px-4 py-3 text-[13px] leading-6 text-[#5F5A77]">
                  {latestInsight.recommendation}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-2 text-[12px] font-bold text-[#5F5A77]">
                  {pendingCount} task chờ xử lý
                </div>
                <div className="rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-2 text-[12px] font-bold text-[#5F5A77]">
                  {completedCount} task hoàn thành
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}