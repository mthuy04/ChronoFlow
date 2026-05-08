"use client";

import type { DragEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Info,
  Loader2,
  MousePointer2,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";

import type {
  PlannerCalendarEvent,
  PlannerConflict,
  PlannerTask,
  PlannerTaskType,
} from "./PlannerBoard";

interface CalendarDayViewProps {
  date: Date;
  events: PlannerCalendarEvent[];
  conflicts: Record<string, PlannerConflict[]>;
  focusWindow: string;
  isOverloaded: boolean;
  updatingTaskId: string | null;
  onAddTask: () => void;
  onSelectTask: (task: PlannerTask) => void;
  onDropTask: (taskId: string, dateKey: string, start: string) => void;
}

const HOUR_LABELS = Array.from({ length: 25 }).map((_, index) => index);
const DROP_HOURS = Array.from({ length: 24 }).map((_, index) => index);
const PX_PER_HOUR = 76;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function getMinutes(time: string) {
  const [hourRaw = "0", minuteRaw = "0"] = time.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
  return hour * 60 + minute;
}

function getTaskCardClass(type: PlannerTaskType) {
  switch (type) {
    case "DEEP_WORK":
      return "border-[#BFE6F8] bg-[#EAF8FF] text-[#172033] shadow-[0_14px_34px_rgba(79,172,216,0.12)]";
    case "STUDY":
      return "border-[#C9E7F3] bg-[#EFFAFF] text-[#172033] shadow-[0_14px_34px_rgba(61,160,210,0.10)]";
    case "CREATIVE":
      return "border-[#F8DCA5] bg-[#FFF8E8] text-[#231A10] shadow-[0_14px_34px_rgba(232,162,46,0.12)]";
    case "ADMIN":
      return "border-[#D8DEE8] bg-[#F6F8FC] text-[#1F2937] shadow-[0_14px_34px_rgba(100,116,139,0.10)]";
    case "ROUTINE":
      return "border-[#BEEBD8] bg-[#F0FFF8] text-[#102A22] shadow-[0_14px_34px_rgba(46,157,103,0.10)]";
    case "PERSONAL":
    default:
      return "border-[#F4C7DE] bg-[#FFF0F8] text-[#2A1321] shadow-[0_14px_34px_rgba(236,72,153,0.10)]";
  }
}

function getTaskAccentClass(type: PlannerTaskType) {
  switch (type) {
    case "DEEP_WORK":
      return "bg-[#45B7E8]";
    case "STUDY":
      return "bg-[#5A9DFF]";
    case "CREATIVE":
      return "bg-[#F2A72B]";
    case "ADMIN":
      return "bg-[#94A3B8]";
    case "ROUTINE":
      return "bg-[#45C08B]";
    case "PERSONAL":
    default:
      return "bg-[#EC6AA7]";
  }
}

function getConflictBadgeClass(type: PlannerConflict["type"]) {
  if (type === "OVERLAP") return "border-[#FFD8D8] bg-[#FFF0F0] text-[#D85B5B]";
  if (type === "OVERLOADED_DAY") return "border-[#FFE4B5] bg-[#FFF8EF] text-[#C67713]";
  return "border-[#DAD3FF] bg-[#F3F0FF] text-[#6F59FF]";
}

function extractTaskId(event: DragEvent<HTMLElement>) {
  return event.dataTransfer.getData("text/plain");
}

function handleDragStart(event: DragEvent<HTMLElement>, taskId: string) {
  event.dataTransfer.setData("text/plain", taskId);
  event.dataTransfer.effectAllowed = "move";
}

function getDayGuidance(events: PlannerCalendarEvent[], isOverloaded: boolean) {
  if (events.length === 0) {
    return "Hãy bắt đầu bằng một task quan trọng nhất, đặt vào focus window trước.";
  }

  if (isOverloaded) {
    return "Ngày này đang hơi dày. Kéo task nhẹ về backlog hoặc dời sang ngày khác.";
  }

  return "Giữ khoảng nghỉ giữa các block. Nếu thêm task mới, ưu tiên slot còn trống thay vì chèn sát task hiện có.";
}

export default function CalendarDayView({
  date,
  events,
  conflicts,
  focusWindow,
  isOverloaded,
  updatingTaskId,
  onAddTask,
  onSelectTask,
  onDropTask,
}: CalendarDayViewProps) {
  const totalHeight = 24 * PX_PER_HOUR;
  const dateKey = formatDateKey(date);

  const dayLabel = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)]">
      <div className="flex flex-col gap-4 border-b border-[#ECE8FF] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
            View ngày
          </div>

          <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-[#241F3D]">
            {dayLabel}
          </h3>

          <p className="mt-1 text-[13px] leading-6 text-[#615C7A]">
            Focus window:{" "}
            <span className="font-black text-[#241F3D]">{focusWindow}</span>.
            Kéo task sang slot mới để đổi lịch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold ${
              isOverloaded
                ? "bg-[#FFF0F0] text-[#D85B5B]"
                : "bg-[#F3F0FF] text-[#7C5CFA]"
            }`}
          >
            <Zap className="h-4 w-4" />
            {isOverloaded ? "Ngày này đang dày" : "Ngày này còn khá thoáng"}
          </div>

          <button
            type="button"
            onClick={onAddTask}
            className="inline-flex items-center gap-2 rounded-full bg-[#1A1528] px-4 py-2.5 text-[13px] font-bold text-white transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Thêm task
          </button>
        </div>
      </div>

      <div className="border-b border-[#ECE8FF] bg-[#FAF9FF] px-5 py-4">
        <div className="flex items-start gap-3 rounded-[22px] border border-[#E9E5FF] bg-white px-4 py-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F3F0FF] text-[#7C5CFA]">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <div className="text-[13px] font-black text-[#241F3D]">
              Gợi ý cho ngày này
            </div>
            <p className="mt-1 text-[12px] leading-6 text-[#6B6287]">
              {getDayGuidance(events, isOverloaded)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[760px] overflow-auto overscroll-contain">
        <div className="min-w-[820px] px-3 py-3 md:px-4 md:py-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div className="relative" style={{ height: totalHeight }}>
              {HOUR_LABELS.map((hour, index) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 text-right text-[12px] font-bold text-[#8A84A3]"
                  style={{ top: index * PX_PER_HOUR - 8 }}
                >
                  {pad(hour)}:00
                </div>
              ))}
            </div>

            <div
              className="relative overflow-visible rounded-[26px] border border-[#ECE8FF] bg-white"
              style={{ height: totalHeight }}
            >
              {DROP_HOURS.map((hour, index) => {
                const start = `${pad(hour)}:00`;

                return (
                  <div
                    key={hour}
                    role="button"
                    tabIndex={0}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const taskId = extractTaskId(event);
                      if (taskId) onDropTask(taskId, dateKey, start);
                    }}
                    className="absolute left-0 right-0 border-t border-dashed border-[#EFEAFD] transition hover:bg-[#F8F6FF]"
                    style={{
                      top: index * PX_PER_HOUR,
                      height: PX_PER_HOUR,
                    }}
                  >
                    <div className="pointer-events-none ml-4 mt-2 inline-flex items-center gap-2 rounded-full bg-[#FAF9FF] px-3 py-1 text-[10px] font-bold text-[#B0A8CB]">
                      <Clock3 className="h-3 w-3" />
                      {start}
                    </div>
                  </div>
                );
              })}

              {events.length === 0 ? (
                <div className="absolute inset-0 grid place-items-center p-8">
                  <div className="max-w-md rounded-[28px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] p-6 text-center shadow-[0_18px_45px_rgba(97,76,197,0.08)]">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#F3F0FF] text-[#7C5CFA]">
                      <MousePointer2 className="h-5 w-5" />
                    </div>

                    <div className="mt-4 text-[1.1rem] font-black tracking-tight text-[#241F3D]">
                      Chưa có task nào trong ngày này
                    </div>

                    <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
                      Kéo task từ Backlog hoặc Task board vào một khung giờ cụ thể.
                      ChronoFlow sẽ cập nhật lịch thật qua API.
                    </p>

                    <button
                      type="button"
                      onClick={onAddTask}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1A1528] px-5 py-3 text-[13px] font-bold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Thêm task đầu tiên
                    </button>
                  </div>
                </div>
              ) : null}

              {events.map((event) => {
                const startMinutes = getMinutes(event.start);
                const endMinutes = getMinutes(event.end);
                const top = (startMinutes / 60) * PX_PER_HOUR;
                const height = Math.max(
                  62,
                  ((endMinutes - startMinutes) / 60) * PX_PER_HOUR,
                );
                const eventConflicts = conflicts[event.id] ?? [];
                const isUpdating = updatingTaskId === event.id;

                return (
                  <button
                    key={event.id}
                    type="button"
                    draggable
                    onDragStart={(dragEvent) =>
                      handleDragStart(dragEvent, event.task.id)
                    }
                    onClick={() => onSelectTask(event.task)}
                    className={`absolute left-3 right-3 z-10 overflow-visible rounded-[20px] border ${getTaskCardClass(
                      event.type,
                    )} p-4 pl-5 text-left transition hover:z-30 hover:scale-[1.01] ${
                      event.completed ? "opacity-70" : ""
                    }`}
                    style={{ top, minHeight: height }}
                  >
                    <span
                      className={`absolute bottom-0 left-0 top-0 w-1.5 rounded-l-[20px] ${getTaskAccentClass(
                        event.type,
                      )}`}
                    />

                    <div className="flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#6B7280]">
                      <span>
                        {event.start} - {event.end}
                      </span>

                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : event.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : null}
                    </div>

                    <div className="mt-2 line-clamp-2 text-[15px] font-black tracking-tight">
                      {event.title}
                    </div>

                    <div className="mt-1 text-[12px] font-semibold text-[#6B7280]">
                      {event.duration}
                    </div>

                    {event.explanation ? (
                      <div className="mt-2 line-clamp-2 text-[12px] leading-6 text-[#5B6475]">
                        {event.explanation}
                      </div>
                    ) : null}

                    {eventConflicts.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {eventConflicts.map((conflict) => (
                          <span
                            key={conflict.type}
                            title={conflict.description}
                            className={`group/conflict relative inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${getConflictBadgeClass(
                              conflict.type,
                            )}`}
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {conflict.label}

                            <span className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 hidden w-64 rounded-2xl border border-white/80 bg-[#17122B] p-3 text-left text-[11px] font-semibold normal-case leading-5 text-white shadow-[0_18px_48px_rgba(23,18,43,0.24)] group-hover/conflict:block">
                              {conflict.description}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#DAD3FF] bg-white/80 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#6F59FF]">
                        <Info className="h-3 w-3" />
                        Không có cảnh báo
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
