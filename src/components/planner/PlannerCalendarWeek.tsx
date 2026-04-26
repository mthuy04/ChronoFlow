"use client";

import { getWeekDates, PlannerTask, taskTypeColor, toDateKey } from "@/lib/planner";

export default function PlannerCalendarWeek({
  baseDate,
  tasks,
  onTaskClick,
}: {
  baseDate: string;
  tasks: PlannerTask[];
  onTaskClick: (task: PlannerTask) => void;
}) {
  const weekDates = getWeekDates(new Date(baseDate));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[980px] rounded-[24px] border border-[#ECE8FF] bg-[#FCFBFF] p-4">
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date) => {
            const key = toDateKey(date);
            const dayTasks = tasks.filter(
              (task) => task.scheduledDate === key && !task.isBacklog
            );

            return (
              <div
                key={key}
                className="rounded-[20px] border border-[#ECE8FF] bg-white p-3"
              >
                <div className="mb-3 border-b border-[#F1EEFB] pb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-[#8A84A3]">
                    {date.toLocaleDateString("vi-VN", { weekday: "short" })}
                  </div>
                  <div className="text-[14px] font-[900] text-[#1A1528]">
                    {date.toLocaleDateString("vi-VN")}
                  </div>
                </div>

                <div className="space-y-2">
                  {dayTasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#D9CEFF] px-3 py-4 text-[12px] text-[#8A84A3]">
                      Trống
                    </div>
                  ) : (
                    dayTasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onTaskClick(task)}
                        className={`w-full rounded-2xl border px-3 py-3 text-left text-[12px] shadow-sm transition hover:scale-[1.01] ${taskTypeColor[task.type]}`}
                      >
                        <div className="font-[900]">{task.name}</div>
                        <div className="mt-1 opacity-80">
                          {task.startTime} - {task.endTime}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}