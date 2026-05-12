"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Crown,
  History,
  Loader2,
  LockKeyhole,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { emitCoinRewardFromElement } from "@/lib/coin-reward-events";
import type {
  PlannerChronotype,
  PlannerPriority,
  PlannerTask,
  PlannerTaskType,
} from "./PlannerBoard";
import FocusTimerCard from "./FocusTimerCard";

interface TaskDetailDrawerProps {
  open: boolean;
  task: PlannerTask | null;
  chronotype: PlannerChronotype;
  onClose: () => void;
  onUpdated: (task: PlannerTask) => Promise<void> | void;
  onDeleted: (taskId: string) => Promise<void> | void;
}

type TaskPatchPayload = {
  name?: string;
  type?: PlannerTaskType;
  priority?: PlannerPriority;
  duration?: string;
  deadline?: string | null;
  scheduledDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  scheduledTime?: string;
  isBacklog?: boolean;
  explanation?: string;
  completed?: boolean;
};

type SchedulePatchPayload = {
  scheduledTime: string;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  isBacklog: boolean;
};

type StreakRewardResponse = {
  awarded: boolean;
  milestone: number;
  coinsEarned: number;
  currentStreak: number;
  nextCoinBalance: number;
};

type TaskPatchResponse = {
  success?: boolean;
  task?: PlannerTask;
  awardedCoins?: number;
  nextCoinBalance?: number;
  streakReward?: StreakRewardResponse | null;
  error?: string;
  detail?: string;
};

type FocusHistoryItem = {
  id: string;
  taskId: string | null;
  status?: string;
  durationMinutes: number;
  coinsEarned?: number;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
};

type FocusHistoryResponse = {
  success?: boolean;
  sessions?: FocusHistoryItem[];
  error?: string;
  code?: string;
  requiredPlan?: "PLUS" | "PRO";
  message?: string;
};

type FocusHistoryGate = {
  requiredPlan: "PLUS" | "PRO";
  message: string;
};

type TaskDraft = {
  name: string;
  type: PlannerTaskType;
  priority: PlannerPriority;
  duration: string;
  deadline: string;
  dateKey: string;
  start: string;
  end: string;
  explanation: string;
};

const TASK_TYPE_OPTIONS: Array<{ value: PlannerTaskType; label: string }> = [
  { value: "DEEP_WORK", label: "Deep work" },
  { value: "STUDY", label: "Học tập" },
  { value: "CREATIVE", label: "Sáng tạo" },
  { value: "ADMIN", label: "Admin" },
  { value: "ROUTINE", label: "Routine" },
  { value: "PERSONAL", label: "Cá nhân" },
];

const PRIORITY_OPTIONS: Array<{ value: PlannerPriority; label: string }> = [
  { value: "HIGH", label: "Cao" },
  { value: "MEDIUM", label: "Vừa" },
  { value: "LOW", label: "Thấp" },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getTodayDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function parseMinutes(duration: string) {
  const numeric = Number(duration.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 25;
}

function timeToMinutes(time: string) {
  const [hourRaw = "0", minuteRaw = "0"] = time.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return hour * 60 + minute;
}

function minutesToTime(totalMinutes: number) {
  const safeTotal = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hour = Math.floor(safeTotal / 60);
  const minute = safeTotal % 60;
  return `${pad(hour)}:${pad(minute)}`;
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

function getTaskMode(task: PlannerTask) {
  if (task.type === "DEEP_WORK" || task.type === "STUDY") {
    return "Deep Focus theo task";
  }

  if (task.type === "CREATIVE") {
    return "Creative Sprint";
  }

  return "Quick Focus";
}

function getQuickRescheduleSuggestions(chronotype: PlannerChronotype) {
  switch (chronotype) {
    case "LION":
      return ["07:30 - 09:00", "09:30 - 11:00", "13:30 - 14:15"];
    case "WOLF":
      return ["10:00 - 10:45", "15:00 - 16:30", "19:00 - 20:00"];
    case "DOLPHIN":
      return ["10:00 - 11:00", "11:15 - 12:00", "16:00 - 16:45"];
    case "BEAR":
    default:
      return ["09:00 - 10:30", "10:45 - 12:00", "14:00 - 15:00"];
  }
}

function parseScheduledTime(task: PlannerTask) {
  const raw = String(task.scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") {
    const start = "09:00";
    return {
      dateKey: getTodayDateKey(),
      start,
      end: addMinutesToTime(start, parseMinutes(task.duration)),
      isBacklog: true,
    };
  }

  const pipeParts = raw.split("|");

  if (pipeParts.length === 3) {
    const dateKey = pipeParts[0] || getTodayDateKey();
    const start = pipeParts[1] || "09:00";
    const end =
      pipeParts[2] || addMinutesToTime(start, parseMinutes(task.duration));

    return { dateKey, start, end, isBacklog: false };
  }

  const textMatch = raw.match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/,
  );

  if (textMatch) {
    return {
      dateKey: textMatch[1],
      start: textMatch[2],
      end: textMatch[3],
      isBacklog: false,
    };
  }

  const maybeDate = new Date(raw);

  if (!Number.isNaN(maybeDate.getTime())) {
    const dateKey = `${maybeDate.getFullYear()}-${pad(
      maybeDate.getMonth() + 1,
    )}-${pad(maybeDate.getDate())}`;
    const start = `${pad(maybeDate.getHours())}:${pad(maybeDate.getMinutes())}`;

    return {
      dateKey,
      start,
      end: addMinutesToTime(start, parseMinutes(task.duration)),
      isBacklog: false,
    };
  }

  const start = "09:00";
  return {
    dateKey: getTodayDateKey(),
    start,
    end: addMinutesToTime(start, parseMinutes(task.duration)),
    isBacklog: true,
  };
}

function buildDraftFromTask(task: PlannerTask): TaskDraft {
  const parsed = parseScheduledTime(task);

  return {
    name: task.name,
    type: task.type,
    priority: task.priority,
    duration: task.duration,
    deadline: task.deadline ?? "",
    dateKey: parsed.dateKey,
    start: parsed.start,
    end: parsed.end,
    explanation: task.explanation,
  };
}

function buildScheduledTime(dateKey: string, start: string, end: string) {
  return `${dateKey}|${start}|${end}`;
}

function buildSchedulePatchPayload(scheduledTime: string): SchedulePatchPayload {
  const value = scheduledTime.trim();

  if (!value || value.toUpperCase() === "BACKLOG") {
    return {
      scheduledTime: "BACKLOG",
      scheduledDate: null,
      startTime: null,
      endTime: null,
      isBacklog: true,
    };
  }

  const pipeParts = value.split("|");

  if (pipeParts.length === 3) {
    const [scheduledDate, startTime, endTime] = pipeParts;

    return {
      scheduledTime: value,
      scheduledDate: scheduledDate || null,
      startTime: startTime || null,
      endTime: endTime || null,
      isBacklog: false,
    };
  }

  const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
  const timeMatches = value.match(/\b\d{2}:\d{2}\b/g);

  return {
    scheduledTime: value,
    scheduledDate: dateMatch?.[1] ?? null,
    startTime: timeMatches?.[0] ?? null,
    endTime: timeMatches?.[1] ?? null,
    isBacklog: false,
  };
}

function buildScheduledTimeFromSlot(task: PlannerTask, slot: string) {
  const parsed = parseScheduledTime(task);
  const [startRaw, endRaw] = slot.split("-").map((item) => item.trim());
  const start = startRaw || "09:00";
  const end = endRaw || addMinutesToTime(start, parseMinutes(task.duration));

  return `${parsed.dateKey}|${start}|${end}`;
}

function getStartTime(task: PlannerTask) {
  return parseScheduledTime(task).start;
}

function isPeakAligned(task: PlannerTask, chronotype: PlannerChronotype) {
  const start = getStartTime(task);

  if (chronotype === "LION") return start >= "07:00" && start <= "10:00";
  if (chronotype === "WOLF") return start >= "14:30" && start <= "18:00";
  if (chronotype === "DOLPHIN") return start >= "10:00" && start <= "11:30";

  return start >= "09:00" && start <= "12:00";
}

function estimateCoins(task: PlannerTask, chronotype: PlannerChronotype) {
  const minutes = parseMinutes(task.duration);
  const base = Math.max(5, Math.floor(minutes / 10) * 2);
  const bonus =
    (task.type === "DEEP_WORK" || task.type === "STUDY") &&
    isPeakAligned(task, chronotype)
      ? 5
      : 0;

  return base + bonus;
}

function getChronotypePeakLabel(chronotype: PlannerChronotype) {
  if (chronotype === "LION") return "07:00 - 10:00";
  if (chronotype === "WOLF") return "14:30 - 18:00";
  if (chronotype === "DOLPHIN") return "10:00 - 11:30";
  return "09:00 - 12:00";
}

function isTaskBacklog(task: PlannerTask) {
  const raw = String(task.scheduledTime || "").trim();
  return !raw || raw.toUpperCase() === "BACKLOG";
}

function getTaskTypeLabel(type: PlannerTaskType) {
  const matched = TASK_TYPE_OPTIONS.find((item) => item.value === type);
  return matched?.label ?? type;
}

function isPlanRequiredResponse(data: FocusHistoryResponse | null) {
  return data?.error === "PLAN_REQUIRED" || data?.code === "PLAN_REQUIRED";
}

function formatFocusDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không rõ thời gian";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState<TaskDraft | null>(null);
  const [focusHistory, setFocusHistory] = useState<FocusHistoryItem[]>([]);
  const [focusHistoryGate, setFocusHistoryGate] =
    useState<FocusHistoryGate | null>(null);
  const [isLoadingFocusHistory, setIsLoadingFocusHistory] = useState(false);

  const quickReschedule = useMemo(
    () => getQuickRescheduleSuggestions(chronotype),
    [chronotype],
  );

  const loadFocusHistory = useCallback(async (taskId: string) => {
    try {
      setIsLoadingFocusHistory(true);
      setFocusHistoryGate(null);

      const response = await fetch(
        `/api/focus-sessions/history?taskId=${encodeURIComponent(taskId)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = (await response
        .json()
        .catch(() => null)) as FocusHistoryResponse | null;

      if (response.status === 403 && isPlanRequiredResponse(data)) {
        setFocusHistory([]);
        setFocusHistoryGate({
          requiredPlan: data?.requiredPlan === "PRO" ? "PRO" : "PLUS",
          message:
            data?.message ||
            "Lịch sử focus session là tính năng dành cho gói Plus hoặc Pro.",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Không thể tải lịch sử focus.");
      }

      setFocusHistory(data?.sessions ?? []);
    } catch {
      setFocusHistory([]);
      setFocusHistoryGate(null);
    } finally {
      setIsLoadingFocusHistory(false);
    }
  }, []);

  useEffect(() => {
    if (!task) {
      setDraft(null);
      setFocusHistory([]);
      setFocusHistoryGate(null);
      return;
    }

    setDraft(buildDraftFromTask(task));
    setMessage("");
    setActiveSlot(null);
    void loadFocusHistory(task.id);
  }, [loadFocusHistory, task]);

  if (!open || !task || !draft) return null;

  const activeTask = task;
  const currentDraft = draft;
  const coins = estimateCoins(activeTask, chronotype);
  const parsedSchedule = parseScheduledTime(activeTask);
  const taskIsBacklog = isTaskBacklog(activeTask);
  const peakAligned = isPeakAligned(activeTask, chronotype);
  const peakLabel = getChronotypePeakLabel(chronotype);

  async function patchTask(
    payload: TaskPatchPayload,
  ): Promise<TaskPatchResponse> {
    const response = await fetch(`/api/tasks/${activeTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response
      .json()
      .catch(() => null)) as TaskPatchResponse | null;

    if (!response.ok) {
      throw new Error(data?.error || "Không thể cập nhật task.");
    }

    const updatedTask: PlannerTask = data?.task
      ? data.task
      : {
          ...activeTask,
          ...payload,
        };

    await onUpdated(updatedTask);

    return {
      success: data?.success ?? true,
      task: updatedTask,
      awardedCoins: data?.awardedCoins,
      nextCoinBalance: data?.nextCoinBalance,
      streakReward: data?.streakReward ?? null,
      error: data?.error,
      detail: data?.detail,
    };
  }

  function updateDraft<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((current) => {
      if (!current) return current;

      if (key === "duration") {
        const nextDuration = String(value);
        const nextEnd = addMinutesToTime(
          current.start,
          parseMinutes(nextDuration),
        );

        return {
          ...current,
          duration: nextDuration,
          end: nextEnd,
        };
      }

      if (key === "start") {
        const nextStart = String(value);
        const nextEnd = addMinutesToTime(
          nextStart,
          parseMinutes(current.duration),
        );

        return {
          ...current,
          start: nextStart,
          end: nextEnd,
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  }

  async function handleSaveDraft() {
    const safeDraft = currentDraft;
    const name = safeDraft.name.trim();
    const duration = safeDraft.duration.trim();

    if (!name) {
      setMessage("Tên task không được để trống.");
      return;
    }

    if (!duration) {
      setMessage("Thời lượng task không được để trống.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      const scheduledTime = buildScheduledTime(
        safeDraft.dateKey,
        safeDraft.start,
        safeDraft.end,
      );
      const schedulePayload = buildSchedulePatchPayload(scheduledTime);

      await patchTask({
        name,
        type: safeDraft.type,
        priority: safeDraft.priority,
        duration,
        deadline: safeDraft.deadline.trim() ? safeDraft.deadline.trim() : null,
        ...schedulePayload,
        explanation: safeDraft.explanation.trim(),
      });

      setMessage("Đã lưu thay đổi task.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể lưu task.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleComplete(
    event: ReactMouseEvent<HTMLButtonElement>,
  ) {
    try {
      setIsSaving(true);
      setMessage("");

      const nextCompleted = !activeTask.completed;
      const result = await patchTask({ completed: nextCompleted });

      const totalAwardedCoins =
        (result.awardedCoins ?? 0) +
        (result.streakReward?.awarded ? result.streakReward.coinsEarned : 0);

      if (nextCompleted && totalAwardedCoins > 0) {
        emitCoinRewardFromElement(
          event.currentTarget,
          totalAwardedCoins,
          result.streakReward?.nextCoinBalance ?? result.nextCoinBalance,
        );
      }

      const streakRewardText =
        nextCompleted && result.streakReward?.awarded
          ? ` Bạn cũng mở khóa streak ${result.streakReward.milestone} ngày và nhận thêm +${result.streakReward.coinsEarned} coins 🔥`
          : "";

      setMessage(
        nextCompleted
          ? `Đã đánh dấu hoàn thành task.${streakRewardText}`
          : "Đã chuyển task về trạng thái chưa hoàn thành.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể cập nhật task.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Bạn có chắc muốn xoá task này không?");
    if (!confirmed) return;

    try {
      setIsSaving(true);
      setMessage("");

      const response = await fetch(`/api/tasks/${activeTask.id}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error || "Không thể xoá task.");
      }

      await onDeleted(activeTask.id);
      onClose();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể xoá task.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMoveToBacklog() {
    try {
      setIsSaving(true);
      setMessage("");

      await patchTask(buildSchedulePatchPayload("BACKLOG"));
      onClose();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể chuyển task.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReschedule(slot: string) {
    try {
      setActiveSlot(slot);
      setMessage("");

      const scheduledTime = buildScheduledTimeFromSlot(activeTask, slot);
      await patchTask(buildSchedulePatchPayload(scheduledTime));

      const updatedParsed = parseScheduledTime({
        ...activeTask,
        scheduledTime,
      });

      setDraft((current) =>
        current
          ? {
              ...current,
              dateKey: updatedParsed.dateKey,
              start: updatedParsed.start,
              end: updatedParsed.end,
            }
          : current,
      );

      setMessage(`Đã chuyển task sang ${slot}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể dời lịch task.",
      );
    } finally {
      setActiveSlot(null);
    }
  }

  async function handleFocusSessionSaved() {
    setMessage("Đã lưu phiên focus. Task chưa bị tự đánh dấu hoàn thành.");
    await loadFocusHistory(activeTask.id);
  }

  return (
    <div className="fixed inset-0 z-[130]">
      <button
        type="button"
        className="absolute inset-0 bg-[#160F31]/[0.38] backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Đóng drawer"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-[620px] overflow-y-auto border-l border-white/50 bg-[#FBFAFF]/[0.96] shadow-[-20px_0_60px_rgba(26,21,40,0.12)] backdrop-blur-2xl">
        <div className="sticky top-0 z-10 border-b border-[rgba(124,115,150,0.10)] bg-[#FBFAFF]/[0.95] px-5 py-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                Task detail
              </div>

              <h2 className="mt-3 text-[1.5rem] font-black tracking-tight text-[#241F3D]">
                {activeTask.name}
              </h2>

              <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
                Chỉnh task, dời lịch, bật focus timer và lưu phiên focus thật
                vào backend. Task hoàn thành sẽ được đánh dấu riêng.
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
          {message ? (
            <div className="rounded-[20px] border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-3 text-[13px] font-semibold text-[#615C7A]">
              {message}
            </div>
          ) : null}

          <div className="rounded-[30px] border border-white/80 bg-white/[0.92] p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                  Task overview
                </div>

                <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
                  Trạng thái hiện tại
                </h3>
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] ${
                  activeTask.completed
                    ? "bg-[#F1FFF7] text-[#2E9D67]"
                    : "bg-[#F3F0FF] text-[#7C5CFA]"
                }`}
              >
                {activeTask.completed ? "Completed" : "Pending"}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoCard
                label="Loại task"
                value={getTaskTypeLabel(activeTask.type)}
              />
              <InfoCard label="Thời lượng" value={activeTask.duration} />
              <InfoCard
                label="Lịch"
                value={
                  taskIsBacklog
                    ? "Backlog"
                    : `${parsedSchedule.dateKey} • ${parsedSchedule.start} - ${parsedSchedule.end}`
                }
              />
              <InfoCard label="Focus window" value={peakLabel} />
            </div>

            {!taskIsBacklog &&
            (activeTask.type === "DEEP_WORK" || activeTask.type === "STUDY") &&
            !peakAligned ? (
              <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-[#FFE2BE] bg-[#FFF8EF] p-4 text-[#9A5B12]">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <div className="text-[13px] font-black">
                    Task tập trung đang lệch peak window
                  </div>
                  <p className="mt-1 text-[12px] leading-6">
                    Khung mạnh của bạn là {peakLabel}. Có thể dời task bằng phần
                    Quick reschedule bên dưới.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/[0.92] p-5 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              Edit task
            </div>

            <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
              Chỉnh thông tin task
            </h3>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                  Tên task
                </span>
                <input
                  value={currentDraft.name}
                  onChange={(event) => updateDraft("name", event.target.value)}
                  className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Loại task
                  </span>
                  <select
                    value={currentDraft.type}
                    onChange={(event) =>
                      updateDraft("type", event.target.value as PlannerTaskType)
                    }
                    className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  >
                    {TASK_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Ưu tiên
                  </span>
                  <select
                    value={currentDraft.priority}
                    onChange={(event) =>
                      updateDraft(
                        "priority",
                        event.target.value as PlannerPriority,
                      )
                    }
                    className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Thời lượng
                  </span>
                  <input
                    value={currentDraft.duration}
                    onChange={(event) =>
                      updateDraft("duration", event.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  />
                </label>

                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Deadline
                  </span>
                  <input
                    value={currentDraft.deadline}
                    onChange={(event) =>
                      updateDraft("deadline", event.target.value)
                    }
                    placeholder="VD: 2026-05-10"
                    className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Ngày
                  </span>
                  <input
                    type="date"
                    value={currentDraft.dateKey}
                    onChange={(event) =>
                      updateDraft("dateKey", event.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  />
                </label>

                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Bắt đầu
                  </span>
                  <input
                    type="time"
                    value={currentDraft.start}
                    onChange={(event) =>
                      updateDraft("start", event.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  />
                </label>

                <label className="block">
                  <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                    Kết thúc
                  </span>
                  <input
                    type="time"
                    value={currentDraft.end}
                    onChange={(event) => updateDraft("end", event.target.value)}
                    className="mt-2 h-12 w-full rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 text-[14px] font-semibold text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                  Ghi chú / lý do sắp lịch
                </span>
                <textarea
                  value={currentDraft.explanation}
                  onChange={(event) =>
                    updateDraft("explanation", event.target.value)
                  }
                  className="mt-2 min-h-[112px] w-full resize-none rounded-[18px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 py-3 text-[14px] leading-7 text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
                />
              </label>

              <button
                type="button"
                onClick={() => void handleSaveDraft()}
                disabled={isSaving}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Lưu thay đổi task
              </button>
            </div>
          </div>

          <FocusTimerCard
            taskId={activeTask.id}
            title={activeTask.name}
            subtitle={getTaskMode(activeTask)}
            durationMinutes={parseMinutes(activeTask.duration)}
            estimatedCoins={coins}
            onSessionSaved={handleFocusSessionSaved}
          />

          <FocusHistoryMini
            sessions={focusHistory}
            gate={focusHistoryGate}
            isLoading={isLoadingFocusHistory}
          />

          <div className="rounded-[30px] border border-white/80 bg-white/[0.92] p-5 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              Quick reschedule
            </div>

            <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
              Các khung gợi ý để dời lịch
            </h3>

            <div className="mt-4 grid gap-3">
              {quickReschedule.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => void handleReschedule(slot)}
                  disabled={Boolean(activeSlot)}
                  className="flex items-center justify-between rounded-[20px] border border-[#ECE8FF] bg-[#FAF9FF] px-4 py-3 text-left text-[14px] font-semibold text-[#4F4A68] transition hover:border-[#7C5CFA] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{slot}</span>
                  {activeSlot === slot ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#7C5CFA]" />
                  ) : (
                    <CalendarCheck className="h-4 w-4 text-[#7C5CFA]" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void handleMoveToBacklog()}
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
              onClick={(event) => void handleToggleComplete(event)}
              disabled={isSaving}
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {activeTask.completed
                ? "Đánh dấu chưa xong"
                : "Đánh dấu hoàn thành"}
            </button>

            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isSaving}
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#FFD8D8] bg-[#FFF7F7] px-6 text-[14px] font-semibold text-[#C55454] transition hover:bg-[#FFF0F0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Xoá task
            </button>

            {activeTask.deadline ? (
              <div className="inline-flex items-center gap-2 rounded-[20px] border border-[#ECE8FF] bg-white px-4 py-3 text-[13px] font-medium text-[#5F5A77]">
                <Clock3 className="h-4 w-4 text-[#7C5CFA]" />
                Deadline: {activeTask.deadline}
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] p-4">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>

      <div className="mt-2 text-[1rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
    </div>
  );
}

function FocusHistoryMini({
  sessions,
  gate,
  isLoading,
}: {
  sessions: FocusHistoryItem[];
  gate: FocusHistoryGate | null;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-[30px] border border-white/80 bg-white/[0.92] p-5 shadow-sm">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F0FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
          <History className="h-3.5 w-3.5" />
          Focus history
        </div>

        <h3 className="mt-3 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
          Các phiên focus gần đây
        </h3>
      </div>

      {isLoading ? (
        <div className="mt-4 rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] p-4 text-[13px] font-semibold text-[#615C7A]">
          Đang tải lịch sử focus...
        </div>
      ) : gate ? (
        <FocusHistoryUpgradeCard gate={gate} />
      ) : sessions.length > 0 ? (
        <div className="mt-4 space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-black text-[#241F3D]">
                    {session.durationMinutes} phút focus
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-[#8A84A3]">
                    {session.status === "COMPLETED"
                      ? "Đã hoàn thành"
                      : session.status ?? "Focus session"}
                    {typeof session.coinsEarned === "number" &&
                    session.coinsEarned > 0
                      ? ` • +${session.coinsEarned} coins`
                      : ""}
                  </div>
                </div>

                <div className="text-right text-[11px] font-bold text-[#8A84A3]">
                  {formatFocusDate(session.startedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] p-4 text-[13px] leading-6 text-[#615C7A]">
          Chưa có phiên focus nào cho task này. Khi bạn lưu một phiên focus, nó
          sẽ xuất hiện ở đây.
        </div>
      )}
    </div>
  );
}

function FocusHistoryUpgradeCard({ gate }: { gate: FocusHistoryGate }) {
  return (
    <div className="mt-4 overflow-hidden rounded-[24px] border border-[#FFE6C7] bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_38%),linear-gradient(135deg,#FFF7ED_0%,#FFFFFF_48%,#F5F2FF_100%)] p-4 shadow-[0_14px_34px_rgba(26,21,40,0.06)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-white shadow-[0_12px_24px_rgba(245,158,11,0.2)]">
          <LockKeyhole className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#F59E0B]">
            <Crown className="h-3.5 w-3.5" />
            Cần gói {gate.requiredPlan === "PRO" ? "Pro" : "Plus"}
          </div>

          <h4 className="mt-3 text-[1rem] font-black tracking-tight text-[#241F3D]">
            Mở khóa lịch sử focus session
          </h4>

          <p className="mt-2 text-[12.5px] font-medium leading-6 text-[#615C7A]">
            {gate.message}
          </p>

          <Link
            href={`/pricing?highlight=${gate.requiredPlan.toLowerCase()}`}
            className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-2xl bg-[#1A1528] px-4 text-[12px] font-black text-white shadow-[0_12px_26px_rgba(26,21,40,0.15)] transition hover:-translate-y-0.5 hover:bg-black"
          >
            Xem gói {gate.requiredPlan === "PRO" ? "Pro" : "Plus"}
            <ArrowRight className="h-3.5 w-3.5 text-[#FBBF24]" />
          </Link>
        </div>
      </div>
    </div>
  );
}