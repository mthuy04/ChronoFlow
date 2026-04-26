"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import type { PlannerChronotype, PlannerTask } from "./PlannerBoard";
import FocusTimerCard from "./FocusTimerCard";

interface TaskDetailDrawerProps {
  open: boolean;
  task: PlannerTask | null;
  chronotype: PlannerChronotype;
  onClose: () => void;
  onUpdated: (task: PlannerTask) => Promise<void> | void;
  onDeleted: (taskId: string) => Promise<void> | void;
}

function parseMinutes(duration: string) {
  const numeric = Number(duration.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 25;
}

function getTaskMode(task: PlannerTask | null) {
  if (!task) return "Pomodoro 25/5";
  if (task.type === "DEEP_WORK" || task.type === "STUDY") return "Deep Focus 50/10";
  if (task.type === "CREATIVE") return "Creative Sprint 45/10";
  return "Quick Focus 25/5";
}

function getQuickRescheduleSuggestions(chronotype: PlannerChronotype) {
  switch (chronotype) {
    case "LION":
      return [
        "07:30 - 09:00",
        "09:30 - 11:00",
        "13:30 - 14:15",
      ];
    case "WOLF":
      return [
        "10:00 - 10:45",
        "15:00 - 16:30",
        "19:00 - 20:00",
      ];
    case "DOLPHIN":
      return [
        "10:00 - 11:00",
        "11:15 - 12:00",
        "16:00 - 16:45",
      ];
    case "BEAR":
    default:
      return [
        "09:00 - 10:30",
        "10:45 - 12:00",
        "14:00 - 15:00",
      ];
  }
}

export default function TaskDetailDrawer({
  open,
  task,
  chronotype,
  onClose,
  onUpdated,
  onDeleted,
}: TaskDetailDrawerProps) {
  const [isSaving, setIsSaving] = useState(false);

  const quickReschedule = useMemo(
    () => getQuickRescheduleSuggestions(chronotype),
    [chronotype]
  );

  if (!open || !task) return null;

  async function handleToggleComplete() {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) throw new Error(data?.error || "Không thể cập nhật task.");

      await onUpdated({
        ...task,
        completed: !task.completed,
      });
    } catch {
      // giữ im để tránh spam UI
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Bạn có chắc muốn xoá task này không?");
    if (!confirmed) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xoá task.");
      }

      await onDeleted(task.id);
      onClose();
    } catch {
      // noop
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMoveToBacklog() {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledTime: "BACKLOG",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) throw new Error(data?.error || "Không thể chuyển task.");

      await onUpdated({
        ...task,
        scheduledTime: "BACKLOG",
      });
      onClose();
    } catch {
      // noop
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[130]">
      <button
        type="button"
        className="absolute inset-0 bg-[#160F31]/38 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Đóng drawer"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-[560px] overflow-y-auto border-l border-white/50 bg-[#FBFAFF]/96 shadow-[-20px_0_60px_rgba(26,21,40,0.12)] backdrop-blur-2xl">
        <div className="sticky top-0 z-10 border-b border-[rgba(124,115,150,0.10)] bg-[#FBFAFF]/95 px-5 py-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                Task detail
              </div>
              <h2 className="mt-3 text-[1.5rem] font-black tracking-tight text-[#241F3D]">
                {task.name}
              </h2>
              <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
                Xem nhanh trạng thái task, bật focus timer và reschedule nếu cần.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E9E5FF] bg-white text-[#5F5A77] transition hover:bg-[#fafafe]"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-[30px] border border-white/80 bg-white/92 p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                  Thời lượng
                </div>
                <div className="mt-2 text-[1.35rem] font-black tracking-tight text-[#241F3D]">
                  {task.duration}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                  Trạng thái
                </div>
                <div className="mt-2 text-[1.35rem] font-black tracking-tight text-[#241F3D]">
                  {task.completed ? "Đã hoàn thành" : "Đang chờ làm"}
                </div>
              </div>
            </div>

            {task.explanation ? (
              <div className="mt-4 rounded-[22px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 py-4 text-[14px] leading-7 text-[#5F5A77]">
                {task.explanation}
              </div>
            ) : null}
          </div>

          <FocusTimerCard
            title={task.name}
            subtitle={getTaskMode(task)}
            durationMinutes={parseMinutes(task.duration)}
          />

          <div className="rounded-[30px] border border-white/80 bg-white/92 p-5 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              Quick reschedule
            </div>
            <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
              Các khung gợi ý để dời lịch
            </h3>

            <div className="mt-4 grid gap-3">
              {quickReschedule.map((slot) => (
                <div
                  key={slot}
                  className="rounded-[20px] border border-[#ECE8FF] bg-[#FAF9FF] px-4 py-3 text-[14px] font-semibold text-[#4F4A68]"
                >
                  {slot}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleMoveToBacklog}
              disabled={isSaving}
              className="mt-4 inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-5 text-[14px] font-semibold text-[#4F4A68] transition hover:bg-[#FAF9FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
              Chuyển task về backlog
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleToggleComplete}
              disabled={isSaving}
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              {task.completed ? "Đánh dấu chưa xong" : "Đánh dấu hoàn thành"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#FFD8D8] bg-[#FFF7F7] px-6 text-[14px] font-semibold text-[#C55454] transition hover:bg-[#FFF0F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Xoá task
            </button>

            {task.deadline ? (
              <div className="inline-flex items-center gap-2 rounded-[20px] border border-[#ECE8FF] bg-white px-4 py-3 text-[13px] font-medium text-[#5F5A77]">
                <Clock3 className="h-4 w-4 text-[#7C5CFA]" />
                Deadline: {task.deadline}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}