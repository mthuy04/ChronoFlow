"use client";

import type { DragEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Info,
  Loader2,
  MousePointer2,
  Sparkles,
} from "lucide-react";

import type {
  PlannerCalendarEvent,
  PlannerConflict,
  PlannerTask,
  PlannerTaskType,
} from "./PlannerBoard";

interface CalendarWeekViewProps {
  weekDates: Date[];
  events: PlannerCalendarEvent[];
  conflicts: Record<string, PlannerConflict[]>;
  selectedDate: Date;
  updatingTaskId: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTask: (task: PlannerTask) => void;
  onDropTask: (taskId: string, dateKey: string, start: string) => void;
}

const HOURS = Array.from({ length: 16 }).map((_, index) => index + 6);
const PX_PER_HOUR = 78;

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

function getTaskColors(type: PlannerTaskType) {
  switch (type) {
    case "DEEP_WORK":
      return "bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_52%,#5B8CFF_100%)]";
    case "STUDY":
      return "bg-[linear-gradient(135deg,#4F8CFF_0%,#69A7FF_100%)]";
    case "CREATIVE":
      return "bg-[linear-gradient(135deg,#F59E0B_0%,#FDBA74_100%)]";
    case "ADMIN":
      return "bg-[linear-gradient(135deg,#94A3B8_0%,#CBD5E1_100%)]";
    case "ROUTINE":
      return "bg-[linear-gradient(135deg,#14B8A6_0%,#5EEAD4_100%)]";
    case "PERSONAL":
    default:
      return "bg-[linear-gradient(135deg,#EC4899_0%,#F9A8D4_100%)]";
  }
}

function getConflictBadgeClass(type: PlannerConflict["type"]) {
  if (type === "OVERLAP") return "bg-[#FFF0F0] text-[#D85B5B]";
  if (type === "OVERLOADED_DAY") return "bg-[#FFF8EF] text-[#C67713]";
  return "bg-white/20 text-white";
}

function extractTaskId(event: DragEvent<HTMLElement>) {
  return event.dataTransfer.getData("text/plain");
}

function handleDragStart(event: DragEvent<HTMLElement>, taskId: string) {
  event.dataTransfer.setData("text/plain", taskId);
  event.dataTransfer.effectAllowed = "move";
}

function getDaySuggestion(dayEvents: PlannerCalendarEvent[]) {
  if (dayEvents.length === 0) {
    return "Thả deep work vào khung năng lượng mạnh hoặc kéo task nhẹ vào buổi chiều.";
  }

  if (dayEvents.length >= 5) {
    return "Ngày này khá dày. Cân nhắc kéo bớt task về backlog hoặc sang ngày khác.";
  }

  return "Bạn có thể kéo task khác vào khoảng trống giữa các block hiện có.";
}

export default function CalendarWeekView({
  weekDates,
  events,
  conflicts,
  selectedDate,
  updatingTaskId,
  onSelectDate,
  onSelectTask,
  onDropTask,
}: CalendarWeekViewProps) {
  const totalHeight = HOURS.length * PX_PER_HOUR;
  const selectedDateKey = formatDateKey(selectedDate);

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)]">
      <div className="flex flex-col gap-3 border-b border-[#ECE8FF] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
            View tuần
          </div>

          <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-[#241F3D]">
            Kéo thả lịch tuần
          </h3>

          <p className="mt-1 text-[13px] leading-6 text-[#615C7A]">
            Kéo task trong calendar để đổi giờ. Muốn bỏ lịch, kéo task sang vùng
            “Đưa về backlog”.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#F3F0FF] px-4 py-2 text-[12px] font-bold text-[#7C5CFA]">
          <Clock3 className="h-4 w-4" />
          06:00 - 21:00
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[980px] px-3 py-3 md:px-4 md:py-4">
          <div className="grid grid-cols-[78px_repeat(7,minmax(118px,1fr))] gap-2">
            <div />

            {weekDates.map((date) => {
              const dateKey = formatDateKey(date);
              const isSelected = selectedDateKey === dateKey;
              const dayEvents = events.filter((event) => event.dateKey === dateKey);

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`rounded-[22px] border px-3 py-3 text-left transition ${
                    isSelected
                      ? "border-transparent bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_52%,#5B8CFF_100%)] text-white shadow-[0_14px_28px_rgba(108,92,255,0.20)]"
                      : "border-[#ECE8FF] bg-white text-[#241F3D] hover:bg-[#FAF9FF]"
                  }`}
                >
                  <div
                    className={`text-[11px] font-black uppercase tracking-[0.12em] ${
                      isSelected ? "text-white/75" : "text-[#8A84A3]"
                    }`}
                  >
                    {new Intl.DateTimeFormat("vi-VN", {
                      weekday: "short",
                    }).format(date)}
                  </div>

                  <div className="mt-1 text-[1.25rem] font-black tracking-tight">
                    {pad(date.getDate())}/{pad(date.getMonth() + 1)}
                  </div>

                  <div
                    className={`mt-1 text-[11px] font-bold ${
                      isSelected ? "text-white/70" : "text-[#9B94B4]"
                    }`}
                  >
                    {dayEvents.length} task
                  </div>
                </button>
              );
            })}

            <div className="relative" style={{ height: totalHeight }}>
              {HOURS.map((hour, index) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 pr-2 text-right text-[12px] font-bold text-[#8A84A3]"
                  style={{ top: index * PX_PER_HOUR - 8 }}
                >
                  {pad(hour)}:00
                </div>
              ))}
            </div>

            {weekDates.map((date) => {
              const dateKey = formatDateKey(date);
              const dayEvents = events
                .filter((event) => event.dateKey === dateKey)
                .sort((a, b) => a.start.localeCompare(b.start));

              return (
                <div
                  key={dateKey}
                  className="relative overflow-hidden rounded-[26px] border border-[#ECE8FF] bg-white"
                  style={{ height: totalHeight }}
                >
                  {HOURS.map((hour, index) => {
                    const start = `${pad(hour)}:00`;

                    return (
                      <div
                        key={`${dateKey}-${hour}`}
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
                      />
                    );
                  })}

                  {dayEvents.length === 0 ? (
                    <div className="pointer-events-none absolute inset-x-3 top-[210px] rounded-[20px] border border-dashed border-[#DDD6FE] bg-[#FBFAFF] p-4 text-center">
                      <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-white text-[#7C5CFA] shadow-sm">
                        <MousePointer2 className="h-4 w-4" />
                      </div>
                      <div className="mt-3 text-[12px] font-black text-[#241F3D]">
                        Ngày này còn trống
                      </div>
                      <p className="mt-1 text-[11px] leading-5 text-[#8A84A3]">
                        {getDaySuggestion(dayEvents)}
                      </p>
                    </div>
                  ) : null}

                  {dayEvents.map((event) => {
                    const startMinutes = getMinutes(event.start);
                    const endMinutes = getMinutes(event.end);
                    const top = ((startMinutes - 6 * 60) / 60) * PX_PER_HOUR;
                    const height = Math.max(
                      58,
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
                        className={`absolute left-2 right-2 z-10 overflow-hidden rounded-[20px] border border-transparent ${getTaskColors(
                          event.type,
                        )} p-3 text-left text-white shadow-[0_14px_28px_rgba(62,41,170,0.16)] transition hover:scale-[1.01] ${
                          event.completed ? "opacity-70" : ""
                        }`}
                        style={{ top, height }}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/85">
                          <span>{event.start}</span>
                          {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : event.completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : null}
                        </div>

                        <div className="mt-1 line-clamp-2 text-[13px] font-black tracking-tight">
                          {event.title}
                        </div>

                        {eventConflicts.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {eventConflicts.slice(0, 2).map((conflict) => (
                              <span
                                key={conflict.type}
                                className={`group/conflict relative inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${getConflictBadgeClass(
                                  conflict.type,
                                )}`}
                              >
                                <AlertTriangle className="h-3 w-3" />
                                {conflict.label}

                                <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-56 rounded-2xl border border-white/80 bg-[#17122B] p-3 text-left text-[11px] font-semibold normal-case leading-5 text-white shadow-[0_18px_48px_rgba(23,18,43,0.24)] group-hover/conflict:block">
                                  {conflict.description}
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/16 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white">
                            <Info className="h-3 w-3" />
                            Kéo để đổi giờ
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {dayEvents.length > 0 ? (
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-[18px] border border-[#ECE8FF] bg-white/88 p-3 text-[11px] leading-5 text-[#8A84A3] shadow-sm">
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 text-[#7C5CFA]" />
                        <span>{getDaySuggestion(dayEvents)}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}