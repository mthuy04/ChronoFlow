"use client";

import type { PlannerChronotype } from "./types";
import {
  formatMinutes,
  getChronotypeIcon,
  getChronotypeTitle,
  getDayName,
} from "./utils";

type DailyReviewSectionProps = {
  selectedDateKey: string;
  selectedDaySummary: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    minutes: number;
  };
  chronotype: PlannerChronotype;
};

export default function DailyReviewSection({
  selectedDateKey,
  selectedDaySummary,
  chronotype,
}: DailyReviewSectionProps) {
  return (
    <section className="rounded-[36px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_50px_rgba(133,108,255,0.06)] backdrop-blur-xl md:p-8">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">
        Selected day
      </div>
      <h2 className="mt-3 text-[clamp(1.8rem,2.5vw,2.7rem)] font-black tracking-tight">
        Tóm tắt {getDayName(selectedDateKey)}
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-[#665F7F]">
        Tổng quan nhanh theo dữ liệu task thật của ngày đang chọn.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MiniInfoCard label="Task trong ngày" value={String(selectedDaySummary.totalTasks)} />
        <MiniInfoCard label="Đã hoàn thành" value={String(selectedDaySummary.completedTasks)} />
        <MiniInfoCard label="Chưa xong" value={String(selectedDaySummary.pendingTasks)} />
        <MiniInfoCard label="Tổng thời lượng" value={formatMinutes(selectedDaySummary.minutes)} />
      </div>

      <div className="mt-5 rounded-[26px] border border-violet-100 bg-[linear-gradient(135deg,#FAF8FF_0%,#FFFFFF_100%)] p-5">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">
          Khung mạnh của bạn
        </div>
        <div className="mt-2 text-[1.8rem] font-black text-[#241F3D]">
          {chronotype.focusWindow ?? "Chưa có"}
        </div>
        <p className="mt-3 text-[15px] leading-7 text-[#615C7A]">
          {getChronotypeTitle(chronotype.key, chronotype.label)}{" "}
          {getChronotypeIcon(chronotype.key)} — {chronotype.guidance}
        </p>
      </div>
    </section>
  );
}

function MiniInfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[#ECE8FF] bg-white px-4 py-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-[#9288B4]">
        {label}
      </div>
      <div className="mt-2 text-[1.5rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
    </div>
  );
}