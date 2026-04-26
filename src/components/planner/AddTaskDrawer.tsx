"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Sparkles, X } from "lucide-react";
import type {
  PlannerChronotype,
  PlannerPriority,
  PlannerTask,
  PlannerTaskType,
} from "./PlannerBoard";

interface AddTaskDrawerProps {
  open: boolean;
  onClose: () => void;
  chronotype: PlannerChronotype;
  defaultDate: string;
  onCreated: (task: PlannerTask) => Promise<void> | void;
}

type Suggestion = {
  startTime: string;
  durationMinutes: number;
  explanation: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutesToAdd;
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${pad(hour)}:${pad(minute)}`;
}

function getSuggestion(
  chronotype: PlannerChronotype,
  type: PlannerTaskType
): Suggestion {
  if (chronotype === "LION") {
    if (type === "DEEP_WORK" || type === "STUDY") {
      return {
        startTime: "07:30",
        durationMinutes: 90,
        explanation: "Dùng khung đầu ngày cho việc khó, cần tập trung sâu.",
      };
    }

    return {
      startTime: "13:30",
      durationMinutes: 45,
      explanation: "Việc nhẹ nên đặt sau giờ mạnh chính để không lãng phí peak window.",
    };
  }

  if (chronotype === "WOLF") {
    if (type === "DEEP_WORK" || type === "STUDY" || type === "CREATIVE") {
      return {
        startTime: "15:00",
        durationMinutes: 90,
        explanation: "Buổi chiều muộn là lúc bạn dễ vào flow tốt hơn.",
      };
    }

    return {
      startTime: "10:00",
      durationMinutes: 45,
      explanation: "Buổi sáng nên bắt đầu bằng việc nhẹ, setup hoặc admin.",
    };
  }

  if (chronotype === "DOLPHIN") {
    if (type === "DEEP_WORK" || type === "STUDY") {
      return {
        startTime: "10:00",
        durationMinutes: 60,
        explanation: "Ưu tiên block gọn, rõ mục tiêu và ít nhiễu để giữ chất lượng tập trung.",
      };
    }

    return {
      startTime: "16:00",
      durationMinutes: 45,
      explanation: "Khung phụ phù hợp hơn cho việc nhẹ hoặc việc cá nhân.",
    };
  }

  if (type === "DEEP_WORK" || type === "STUDY") {
    return {
      startTime: "09:00",
      durationMinutes: 90,
      explanation: "Khung này thường hợp để chặn focus block chính của ngày.",
    };
  }

  return {
    startTime: "14:00",
    durationMinutes: 45,
    explanation: "Đầu giờ chiều hợp cho admin, routine hoặc việc phản hồi.",
  };
}

export default function AddTaskDrawer({
  open,
  onClose,
  chronotype,
  defaultDate,
  onCreated,
}: AddTaskDrawerProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<PlannerTaskType>("DEEP_WORK");
  const [priority, setPriority] = useState<PlannerPriority>("HIGH");
  const [date, setDate] = useState(defaultDate);
  const [deadline, setDeadline] = useState("");
  const [putInBacklog, setPutInBacklog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const suggestion = useMemo(() => getSuggestion(chronotype, type), [chronotype, type]);

  const [startTime, setStartTime] = useState(suggestion.startTime);
  const [durationMinutes, setDurationMinutes] = useState(suggestion.durationMinutes);
  const [explanation, setExplanation] = useState(suggestion.explanation);

  const endTime = useMemo(
    () => addMinutesToTime(startTime, durationMinutes),
    [startTime, durationMinutes]
  );

  if (!open) return null;

  function applySuggestion() {
    setStartTime(suggestion.startTime);
    setDurationMinutes(suggestion.durationMinutes);
    setExplanation(suggestion.explanation);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vui lòng nhập tên task.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: name.trim(),
        type,
        priority,
        duration: `${durationMinutes} phút`,
        deadline: deadline || null,
        scheduledTime: putInBacklog ? "BACKLOG" : `${date}|${startTime}|${endTime}`,
        explanation: explanation.trim(),
        completed: false,
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Không thể tạo task.");
      }

      const task: PlannerTask = {
        id: data?.task?.id || `temp-${Date.now()}`,
        name: data?.task?.name || payload.name,
        type: data?.task?.type || payload.type,
        priority: data?.task?.priority || payload.priority,
        duration: data?.task?.duration || payload.duration,
        deadline: data?.task?.deadline ?? payload.deadline,
        scheduledTime: data?.task?.scheduledTime || payload.scheduledTime,
        explanation: data?.task?.explanation || payload.explanation,
        completed: data?.task?.completed ?? false,
        createdAt: data?.task?.createdAt || new Date().toISOString(),
        updatedAt: data?.task?.updatedAt || new Date().toISOString(),
      };

      await onCreated(task);

      setName("");
      setDeadline("");
      setPutInBacklog(false);
      applySuggestion();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo task.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120]">
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
              <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE5FF] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                <Sparkles className="h-3.5 w-3.5" />
                Add task
              </div>
              <h2 className="mt-3 text-[1.5rem] font-black tracking-tight text-[#241F3D]">
                Thêm task vào planner
              </h2>
              <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
                ChronoFlow sẽ gợi ý khung phù hợp trước, bạn vẫn có thể chỉnh tay.
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

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
          <div className="rounded-[30px] border border-white/80 bg-white/92 p-5 shadow-sm">
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                  Tên task
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Viết báo cáo BA"
                  className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[16px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                    Loại task
                  </label>
                  <select
                    value={type}
                    onChange={(e) => {
                      const nextType = e.target.value as PlannerTaskType;
                      setType(nextType);
                      const nextSuggestion = getSuggestion(chronotype, nextType);
                      setStartTime(nextSuggestion.startTime);
                      setDurationMinutes(nextSuggestion.durationMinutes);
                      setExplanation(nextSuggestion.explanation);
                    }}
                    className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[16px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  >
                    <option value="DEEP_WORK">Deep work</option>
                    <option value="STUDY">Học tập</option>
                    <option value="CREATIVE">Sáng tạo</option>
                    <option value="ADMIN">Admin</option>
                    <option value="ROUTINE">Routine</option>
                    <option value="PERSONAL">Cá nhân</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                    Ưu tiên
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PlannerPriority)}
                    className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[16px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  >
                    <option value="HIGH">Cao</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="LOW">Thấp</option>
                  </select>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#EAE5FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                      Gợi ý theo chronotype
                    </div>
                    <div className="mt-2 text-[15px] font-black text-[#241F3D]">
                      {suggestion.startTime} - {addMinutesToTime(suggestion.startTime, suggestion.durationMinutes)}
                    </div>
                    <div className="mt-1 text-[13px] leading-6 text-[#615C7A]">
                      {suggestion.explanation}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={applySuggestion}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-4 py-2.5 text-[13px] font-bold text-[#5F5A77] transition hover:bg-[#FAF9FF]"
                  >
                    <CalendarClock className="h-4 w-4 text-[#7C5CFA]" />
                    Dùng khung gợi ý
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                    Ngày
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={putInBacklog}
                    className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[16px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                    Deadline (không bắt buộc)
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[16px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                    Bắt đầu
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={putInBacklog}
                    className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[16px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                    Thời lượng
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    disabled={putInBacklog}
                    className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[16px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                    Kết thúc
                  </label>
                  <input
                    readOnly
                    value={endTime}
                    className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#F8F6FF] px-5 py-4 text-[16px] font-bold text-[#241F3D] outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] px-4 py-4">
                <input
                  type="checkbox"
                  checked={putInBacklog}
                  onChange={(e) => setPutInBacklog(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D4C9F5] text-[#7C5CFA] focus:ring-[#7C5CFA]"
                />
                <span className="text-[14px] font-semibold text-[#4F4A68]">
                  Chưa gán lịch ngay, đưa task vào backlog
                </span>
              </label>

              <div>
                <label className="mb-2 block text-[13px] font-black text-[#5F5A77]">
                  Giải thích / ghi chú
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={4}
                  className="w-full rounded-[22px] border border-[#E9E5FF] bg-[#FCFBFF] px-5 py-4 text-[15px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                />
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-[22px] border border-[#FFD8D8] bg-[#FFF7F7] px-4 py-3 text-[13px] font-semibold text-[#C55454]">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-2xl bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Đang lưu task..." : "Lưu task vào planner"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-[#E9E5FF] bg-white px-6 text-[14px] font-semibold text-[#4F4A68] transition hover:bg-[#FAF9FF]"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}