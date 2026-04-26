"use client";

import { PlannerTask, getWeekDates, toDateKey } from "@/lib/planner";

export default function WeeklyHeatmap({
  selectedDate,
  tasks,
}: {
  selectedDate: string;
  tasks: PlannerTask[];
}) {
  const weekDates = getWeekDates(new Date(selectedDate));

  return (
    <section className="rounded-[30px] border border-white bg-white/90 p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
      <h2 className="mb-5 text-[1.08rem] font-[900] text-[#1A1528]">
        Weekly heatmap
      </h2>

      <div className="grid grid-cols-7 gap-3">
        {weekDates.map((date) => {
          const key = toDateKey(date);
          const dayTasks = tasks.filter(
            (task) => task.scheduledDate === key && !task.isBacklog && !task.completed
          );
          const load = dayTasks.length;

          const tone =
            load >= 6
              ? "bg-rose-200"
              : load >= 4
              ? "bg-amber-200"
              : load >= 2
              ? "bg-violet-200"
              : "bg-slate-100";

          return (
            <div key={key} className="text-center">
              <div className="mb-2 text-[11px] font-bold text-[#8A84A3]">
                {date.toLocaleDateString("vi-VN", { weekday: "short" })}
              </div>
              <div className={`rounded-2xl px-2 py-5 text-[13px] font-[900] text-[#1A1528] ${tone}`}>
                {load}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[12px] leading-6 text-[#615C7A]">
        Heatmap giúp bạn thấy ngày nào đang quá dày, ngày nào còn trống để cân đối cả tuần.
      </p>
    </section>
  );
}