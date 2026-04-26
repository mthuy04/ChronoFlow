"use client";

import { PlannerTask, taskTypeLabel } from "@/lib/planner";
import { ArchiveRestore, ChevronRight } from "lucide-react";

export default function BacklogPanel({
  tasks,
  selectedDate,
  onTaskClick,
  onQuickReschedule,
}: {
  tasks: PlannerTask[];
  selectedDate: string;
  onTaskClick: (task: PlannerTask) => void;
  onQuickReschedule: (taskId: string, type: PlannerTask["type"]) => Promise<void>;
}) {
  return (
    <section className="rounded-[30px] border border-white bg-white/90 p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF]">
          <ArchiveRestore className="h-5 w-5 text-[#6F59FF]" />
        </div>
        <div>
          <h2 className="text-[1.08rem] font-[900] text-[#1A1528]">Backlog</h2>
          <p className="text-[13px] leading-6 text-[#615C7A]">
            Những task chưa xếp lịch ngay. Có thể dời nhanh vào ngày {selectedDate}.
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#D9CEFF] bg-[#FCFBFF] px-4 py-6 text-[13px] text-[#6B6287]">
          Backlog đang trống.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-[22px] border border-[#ECE8FF] bg-[#FCFBFF] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onTaskClick(task)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="text-[14px] font-[900] text-[#1A1528]">
                    {task.name}
                  </div>
                  <div className="mt-1 text-[12px] text-[#8A84A3]">
                    {taskTypeLabel[task.type]}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onQuickReschedule(task.id, task.type)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-3 py-2 text-[12px] font-semibold text-[#4F4A68] transition hover:bg-[#F8F6FF]"
                >
                  Dời nhanh
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}