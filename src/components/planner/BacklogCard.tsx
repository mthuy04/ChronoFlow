"use client";

import type { DragEvent } from "react";
import {
  ArchiveRestore,
  GripVertical,
  ListTodo,
  Plus,
  Sparkles,
} from "lucide-react";

import type { PlannerTask, PlannerTaskType } from "./PlannerBoard";

interface BacklogCardProps {
  tasks: PlannerTask[];
  onSelectTask: (task: PlannerTask) => void;
  onAddTask: () => void;
  onDropToBacklog: (taskId: string) => void;
}

function getTaskTypeLabel(type: PlannerTaskType) {
  switch (type) {
    case "DEEP_WORK":
      return "Deep work";
    case "STUDY":
      return "Học tập";
    case "CREATIVE":
      return "Sáng tạo";
    case "ADMIN":
      return "Admin";
    case "ROUTINE":
      return "Routine";
    case "PERSONAL":
      return "Cá nhân";
    default:
      return type;
  }
}

function getPriorityClass(priority: PlannerTask["priority"]) {
  if (priority === "HIGH") return "bg-[#FFF0F0] text-[#D85B5B]";
  if (priority === "MEDIUM") return "bg-[#F3F0FF] text-[#7C5CFA]";
  return "bg-[#F7FFFA] text-[#2E9D67]";
}

function extractTaskId(event: DragEvent<HTMLElement>) {
  return event.dataTransfer.getData("text/plain");
}

function handleDragStart(event: DragEvent<HTMLButtonElement>, taskId: string) {
  event.dataTransfer.setData("text/plain", taskId);
  event.dataTransfer.effectAllowed = "move";
}

export default function BacklogCard({
  tasks,
  onSelectTask,
  onAddTask,
  onDropToBacklog,
}: BacklogCardProps) {
  return (
    <div className="overflow-hidden rounded-[36px] border border-white/80 bg-white/92 shadow-[0_20px_70px_rgba(97,76,197,0.08)] backdrop-blur-xl">
      <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE5FF] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              <ListTodo className="h-3.5 w-3.5" />
              Backlog
            </div>

            <h3 className="mt-3 text-[1.25rem] font-black tracking-tight text-[#241F3D]">
              Task chưa gán lịch
            </h3>
          </div>

          <button
            type="button"
            onClick={onAddTask}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#7C5CFA] transition hover:-translate-y-0.5"
            aria-label="Thêm task"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-[13px] leading-7 text-[#615C7A]">
          Kéo task từ đây vào calendar để gắn lịch. Hoặc kéo task đã có lịch vào
          vùng bên dưới để đưa về backlog.
        </p>
      </div>

      <div className="p-5">
        <div
          role="button"
          tabIndex={0}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            event.preventDefault();
            const taskId = extractTaskId(event);
            if (taskId) onDropToBacklog(taskId);
          }}
          className="mb-4 rounded-[26px] border border-dashed border-[#CFC5FF] bg-[linear-gradient(135deg,#F8F6FF_0%,#F2F7FF_100%)] p-4 transition hover:border-[#7C5CFA] hover:bg-[#F5F1FF]"
        >
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#7C5CFA] shadow-sm">
              <ArchiveRestore className="h-5 w-5" />
            </div>

            <div>
              <div className="text-[14px] font-black text-[#241F3D]">
                Đưa task về backlog
              </div>
              <p className="mt-1 text-[12px] leading-6 text-[#6B6287]">
                Thả task từ calendar vào đây nếu bạn muốn bỏ lịch nhưng vẫn giữ
                task trong hệ thống.
              </p>
            </div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-[26px] border border-[#DAF2E5] bg-[linear-gradient(135deg,#F7FFFA_0%,#F1FFF7_100%)] p-5 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#2E9D67] shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="mt-4 text-[15px] font-black text-[#241F3D]">
              Backlog đang trống
            </div>

            <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
              Tốt đó — các task quan trọng đã được đưa vào lịch. Bạn vẫn có thể
              kéo task từ calendar về đây nếu muốn đổi kế hoạch.
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
          <div className="space-y-3">
            {tasks.slice(0, 7).map((task) => (
              <button
                key={task.id}
                type="button"
                draggable
                onDragStart={(event) => handleDragStart(event, task.id)}
                onClick={() => onSelectTask(task)}
                className="group block w-full rounded-[24px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(97,76,197,0.08)]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-xl bg-[#F3F0FF] p-2 text-[#7C5CFA] opacity-70 transition group-hover:opacity-100">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="line-clamp-2 text-[15px] font-black tracking-tight text-[#241F3D]">
                          {task.name}
                        </div>

                        <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">
                          {getTaskTypeLabel(task.type)} • {task.duration}
                        </div>
                      </div>

                      <div
                        className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] ${getPriorityClass(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#7C5CFA]">
                        Kéo vào lịch
                      </span>

                      <span className="text-[11px] font-bold text-[#A19AB8]">
                        Click để xem chi tiết
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {tasks.length > 7 ? (
              <div className="rounded-[20px] border border-[#ECE8FF] bg-[#FAF9FF] px-4 py-3 text-center text-[12px] font-semibold text-[#615C7A]">
                Còn {tasks.length - 7} task khác trong backlog. Mở Task board để
                xem toàn bộ.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}