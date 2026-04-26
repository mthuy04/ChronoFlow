"use client";

import { ListTodo, Plus } from "lucide-react";
import type { PlannerTask } from "./PlannerBoard";

interface BacklogCardProps {
  tasks: PlannerTask[];
  onSelectTask: (task: PlannerTask) => void;
  onAddTask: () => void;
}

export default function BacklogCard({
  tasks,
  onSelectTask,
  onAddTask,
}: BacklogCardProps) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/92 shadow-[0_20px_70px_rgba(97,76,197,0.08)] backdrop-blur-xl">
      <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              Backlog
            </div>
            <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
              Task chưa gán lịch
            </h3>
          </div>

          <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA]">
            <ListTodo className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-3 text-[13px] leading-7 text-[#615C7A]">
          Những task này chưa vào calendar. Hãy chọn task để xem chi tiết hoặc gán
          lịch lại sau.
        </p>
      </div>

      <div className="space-y-3 p-5">
        {tasks.length === 0 ? (
          <div className="rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] p-5 text-center">
            <div className="text-[15px] font-black text-[#241F3D]">
              Backlog đang trống
            </div>
            <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
              Đây là tín hiệu tốt nếu bạn đã gán lịch hầu hết công việc quan trọng.
            </p>

            <button
              type="button"
              onClick={onAddTask}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1A1528] px-5 py-3 text-[13px] font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Thêm task mới
            </button>
          </div>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelectTask(task)}
              className="block w-full rounded-[22px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(97,76,197,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[15px] font-black tracking-tight text-[#241F3D]">
                    {task.name}
                  </div>
                  <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">
                    {task.duration} • {task.priority}
                  </div>
                </div>

                <div className="rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#7C5CFA]">
                  Backlog
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}