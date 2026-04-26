"use client";

import { PlannerTask, taskTypeColor } from "@/lib/planner";

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

export default function PlannerCalendarDay({
  date,
  tasks,
  onTaskClick,
}: {
  date: string;
  tasks: PlannerTask[];
  onTaskClick: (task: PlannerTask) => void;
}) {
  const dayTasks = tasks.filter(
    (task) => task.scheduledDate === date && !task.isBacklog
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px] rounded-[24px] border border-[#ECE8FF] bg-[#FCFBFF]">
        {HOURS.map((hour) => {
          const timeLabel = `${String(hour).padStart(2, "0")}:00`;
          const tasksAtHour = dayTasks.filter((task) => {
            if (!task.startTime) return false;
            const taskHour = Number(task.startTime.split(":")[0]);
            return taskHour === hour;
          });

          return (
            <div
              key={hour}
              className="grid grid-cols-[90px_1fr] border-b border-[#F1EEFB] last:border-b-0"
            >
              <div className="px-4 py-5 text-[12px] font-bold text-[#8A84A3]">
                {timeLabel}
              </div>
              <div className="min-h-[76px] px-3 py-3">
                <div className="space-y-2">
                  {tasksAtHour.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => onTaskClick(task)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left shadow-sm transition hover:scale-[1.01] ${taskTypeColor[task.type]}`}
                    >
                      <div className="text-[13px] font-[900]">{task.name}</div>
                      <div className="mt-1 text-[11px] font-medium opacity-80">
                        {task.startTime} - {task.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}