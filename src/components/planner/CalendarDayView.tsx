"use client";

import { Plus, Zap } from "lucide-react";
import type { PlannerCalendarEvent, PlannerTask } from "./PlannerBoard";

interface CalendarDayViewProps {
  date: Date;
  events: PlannerCalendarEvent[];
  focusWindow: string;
  isOverloaded: boolean;
  onAddTask: () => void;
  onSelectTask: (task: PlannerTask) => void;
}

const HOURS = Array.from({ length: 16 }).map((_, i) => i + 6);
const PX_PER_HOUR = 84;

function getMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getTaskColors(type: PlannerCalendarEvent["type"]) {
  switch (type) {
    case "DEEP_WORK":
      return {
        bg: "bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)]",
        soft: "bg-[#F3F0FF]",
        text: "text-white",
        border: "border-transparent",
      };
    case "STUDY":
      return {
        bg: "bg-[linear-gradient(135deg,#5B8CFF_0%,#6AAEFF_100%)]",
        soft: "bg-[#EEF5FF]",
        text: "text-white",
        border: "border-transparent",
      };
    case "CREATIVE":
      return {
        bg: "bg-[linear-gradient(135deg,#F97316_0%,#FDBA74_100%)]",
        soft: "bg-[#FFF4E9]",
        text: "text-white",
        border: "border-transparent",
      };
    case "ADMIN":
      return {
        bg: "bg-[linear-gradient(135deg,#94A3B8_0%,#CBD5E1_100%)]",
        soft: "bg-[#F8FAFC]",
        text: "text-white",
        border: "border-transparent",
      };
    case "ROUTINE":
      return {
        bg: "bg-[linear-gradient(135deg,#14B8A6_0%,#5EEAD4_100%)]",
        soft: "bg-[#ECFEFF]",
        text: "text-white",
        border: "border-transparent",
      };
    case "PERSONAL":
    default:
      return {
        bg: "bg-[linear-gradient(135deg,#EC4899_0%,#F9A8D4_100%)]",
        soft: "bg-[#FDF2F8]",
        text: "text-white",
        border: "border-transparent",
      };
  }
}

export default function CalendarDayView({
  date,
  events,
  focusWindow,
  isOverloaded,
  onAddTask,
  onSelectTask,
}: CalendarDayViewProps) {
  const totalHeight = HOURS.length * PX_PER_HOUR;
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
            Focus window của bạn hôm nay: <span className="font-black text-[#241F3D]">{focusWindow}</span>
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

      <div className="overflow-x-auto">
        <div className="min-w-[820px] px-3 py-3 md:px-4 md:py-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div className="relative" style={{ height: totalHeight }}>
              {HOURS.map((hour, index) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 text-right text-[12px] font-bold text-[#8A84A3]"
                  style={{ top: index * PX_PER_HOUR - 8 }}
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            <div
              className="relative rounded-[26px] border border-[#ECE8FF] bg-white"
              style={{ height: totalHeight }}
            >
              {HOURS.map((hour, index) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-dashed border-[#EFEAFD]"
                  style={{ top: index * PX_PER_HOUR }}
                />
              ))}

              {events.length === 0 ? (
                <div className="absolute inset-0 grid place-items-center p-8">
                  <div className="max-w-md rounded-[28px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] p-6 text-center">
                    <div className="text-[1.1rem] font-black tracking-tight text-[#241F3D]">
                      Chưa có task nào trong ngày này
                    </div>
                    <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
                      Hãy thêm task mới hoặc kéo task từ backlog vào một khung giờ cụ thể
                      để planner trở nên trực quan hơn.
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
                const top = ((startMinutes - 6 * 60) / 60) * PX_PER_HOUR;
                const height = Math.max(
                  56,
                  ((endMinutes - startMinutes) / 60) * PX_PER_HOUR
                );
                const colors = getTaskColors(event.type);

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onSelectTask(event.task)}
                    className={`absolute left-3 right-3 overflow-hidden rounded-[20px] border ${colors.border} ${colors.bg} p-4 text-left shadow-[0_14px_28px_rgba(62,41,170,0.16)] transition hover:scale-[1.01]`}
                    style={{ top, height }}
                  >
                    <div className={`text-[11px] font-black uppercase tracking-[0.14em] ${colors.text} opacity-85`}>
                      {event.start} - {event.end}
                    </div>
                    <div className={`mt-2 line-clamp-2 text-[15px] font-black tracking-tight ${colors.text}`}>
                      {event.title}
                    </div>
                    <div className={`mt-1 text-[12px] ${colors.text} opacity-90`}>
                      {event.duration}
                    </div>
                    {event.explanation ? (
                      <div className={`mt-2 line-clamp-2 text-[12px] leading-6 ${colors.text} opacity-90`}>
                        {event.explanation}
                      </div>
                    ) : null}
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