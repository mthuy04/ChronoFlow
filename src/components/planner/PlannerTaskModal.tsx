"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { PlannerTask, focusModePresets, getSuggestion, taskTypeLabel } from "@/lib/planner";
import FocusTimerModal from "@/components/planner/FocusTimerModal";

export default function PlannerTaskModal({
  task,
  chronotypeKey,
  onClose,
  onDelete,
  onUpdate,
  isPending,
}: {
  task: PlannerTask;
  chronotypeKey: "LION" | "BEAR" | "WOLF" | "DOLPHIN";
  onClose: () => void;
  onDelete: (taskId: string) => Promise<void>;
  onUpdate: (taskId: string, payload: Record<string, unknown>) => Promise<void>;
  isPending: boolean;
}) {
  const [showTimer, setShowTimer] = useState(false);

  const timerModes = useMemo(() => focusModePresets[task.type], [task.type]);

  const handleQuickReschedule = async () => {
    const suggestion = getSuggestion(chronotypeKey, task.type);
    await onUpdate(task.id, {
      isBacklog: false,
      startTime: suggestion.startTime,
      endTime: suggestion.endTime,
      scheduledTime: suggestion.scheduledTime,
      explanation: suggestion.explanation,
      focusMode: suggestion.focusMode,
      focusMinutes: suggestion.focusMinutes,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[100] w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white bg-white p-6 shadow-[0_30px_80px_rgba(26,21,40,0.24)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#8A84A3]">
              {taskTypeLabel[task.type]}
            </div>
            <h3 className="mt-1 text-[1.5rem] font-[900] text-[#1A1528]">{task.name}</h3>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E9E5FF] bg-white text-[#4F4A68]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <Info label="Khung giờ" value={task.scheduledTime} />
            <Info label="Ngày" value={task.scheduledDate || "Chưa xếp lịch"} />
            <Info label="Ghi chú" value={task.explanation} />

            <div className="rounded-[22px] border border-[#ECE8FF] bg-[#FCFBFF] p-4">
              <div className="mb-3 text-[13px] font-[900] text-[#1A1528]">
                Focus mode cho task này
              </div>
              <div className="grid gap-2">
                {timerModes.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setShowTimer(true)}
                    className="rounded-2xl border border-[#E9E5FF] bg-white px-4 py-3 text-left text-[13px] font-semibold text-[#4F4A68] transition hover:bg-[#F8F6FF]"
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              disabled={isPending}
              onClick={() => onUpdate(task.id, { completed: !task.completed })}
              className="w-full rounded-2xl bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-5 py-3 text-[14px] font-semibold text-white"
            >
              {task.completed ? "Đánh dấu chưa xong" : "Đánh dấu hoàn thành"}
            </button>

            <button
              disabled={isPending}
              onClick={handleQuickReschedule}
              className="w-full rounded-2xl border border-[#E9E5FF] bg-white px-5 py-3 text-[14px] font-semibold text-[#4F4A68]"
            >
              Quick reschedule theo chronotype
            </button>

            <button
              disabled={isPending}
              onClick={() => onUpdate(task.id, { isBacklog: !task.isBacklog })}
              className="w-full rounded-2xl border border-[#E9E5FF] bg-white px-5 py-3 text-[14px] font-semibold text-[#4F4A68]"
            >
              {task.isBacklog ? "Đưa lại vào lịch" : "Đưa vào backlog"}
            </button>

            <button
              disabled={isPending}
              onClick={async () => {
                await onDelete(task.id);
                onClose();
              }}
              className="w-full rounded-2xl border border-rose-100 bg-rose-50 px-5 py-3 text-[14px] font-semibold text-rose-600"
            >
              Xóa task
            </button>
          </div>
        </div>
      </div>

      {showTimer && (
        <FocusTimerModal
          task={task}
          onClose={() => setShowTimer(false)}
        />
      )}
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#ECE8FF] bg-[#FCFBFF] p-4">
      <div className="text-[11px] font-bold uppercase tracking-wide text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[13px] leading-6 text-[#4F4A68]">{value}</div>
    </div>
  );
}