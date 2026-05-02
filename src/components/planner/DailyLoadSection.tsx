"use client";

import type { PlannerTask, WeekDayItem } from "./types";
import { cn, formatMinutes, getDaySummary, getLoadTone } from "./utils";

type DailyLoadSectionProps = {
  weekDays: WeekDayItem[];
  tasks: PlannerTask[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
};

export default function DailyLoadSection({
  weekDays,
  tasks,
  selectedDateKey,
  onSelectDate,
}: DailyLoadSectionProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-[40px] border border-white/90 bg-white/86 shadow-[0_18px_56px_rgba(133,108,255,0.07)] backdrop-blur-xl">
      <div className="border-b border-[#F1ECFF] px-6 py-7 md:px-8">
        <div className="max-w-[860px]">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">
            Daily load
          </div>
          <h2 className="mt-3 text-[clamp(2rem,3.2vw,3.4rem)] font-black leading-tight tracking-tight text-[#241F3D]">
            Ngày nào đang quá tải?
          </h2>
          <p className="mt-3 text-[1rem] leading-8 text-[#635C7C]">
            Theo dõi tổng thời lượng task thật trong tuần để tránh dồn quá nhiều việc nặng vào cùng một ngày.
          </p>
        </div>
      </div>

      <div className="grid gap-4 px-4 py-4 md:grid-cols-2 md:px-6 md:py-6 xl:grid-cols-7">
        {weekDays.map((day) => {
          const summary = getDaySummary(tasks, day.dateKey);
          const selected = day.dateKey === selectedDateKey;

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onSelectDate(day.dateKey)}
              className={cn(
                "rounded-[28px] border p-5 text-left transition hover:-translate-y-0.5",
                getLoadTone(summary.minutes),
                selected && "ring-2 ring-violet-300",
              )}
            >
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[#9188B2]">
                {day.weekday}
              </div>
              <div className="mt-2 text-[2rem] font-black tracking-tight text-[#241F3D]">
                {day.dateLabel}
              </div>
              <div className="mt-4 text-[1.05rem] font-black text-[#2C2744]">
                {summary.minutes >= 240
                  ? "Nặng"
                  : summary.minutes >= 150
                    ? "Vừa"
                    : "Thoáng"}
              </div>
              <div className="mt-2 text-sm font-medium text-[#6A6383]">
                {formatMinutes(summary.minutes)} • {summary.totalTasks} task
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}