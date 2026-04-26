"use client";

import type { PlannerCalendarEvent, PlannerTask } from "./PlannerBoard";

interface CalendarWeekViewProps {
  weekDates: Date[];
  events: PlannerCalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectTask: (task: PlannerTask) => void;
}

const HOURS = Array.from({ length: 15 }).map((_, i) => i + 7);
const PX_PER_HOUR = 72;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isSameDate(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

function getWeekdayLabel(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
  }).format(date);
}

function getTaskColors(type: PlannerCalendarEvent["type"]) {
  switch (type) {
    case "DEEP_WORK":
      return "bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-white";
    case "STUDY":
      return "bg-[linear-gradient(135deg,#5B8CFF_0%,#6AAEFF_100%)] text-white";
    case "CREATIVE":
      return "bg-[linear-gradient(135deg,#F97316_0%,#FDBA74_100%)] text-white";
    case "ADMIN":
      return "bg-[linear-gradient(135deg,#94A3B8_0%,#CBD5E1_100%)] text-white";
    case "ROUTINE":
      return "bg-[linear-gradient(135deg,#14B8A6_0%,#5EEAD4_100%)] text-white";
    case "PERSONAL":
    default:
      return "bg-[linear-gradient(135deg,#EC4899_0%,#F9A8D4_100%)] text-white";
  }
}

export default function CalendarWeekView({
  weekDates,
  events,
  selectedDate,
  onSelectDate,
  onSelectTask,
}: CalendarWeekViewProps) {
  const totalHeight = HOURS.length * PX_PER_HOUR;

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)]">
      <div className="border-b border-[#ECE8FF] px-4 py-4 md:px-5">
        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
          View tuần
        </div>
        <h3 className="mt-2 text-[1.2rem] font-black tracking-tight text-[#241F3D]">
          Lịch tuần trực quan như calendar
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1080px] px-3 py-3 md:px-4 md:py-4">
          <div className="grid grid-cols-[78px_repeat(7,minmax(120px,1fr))] gap-2">
            <div />
            {weekDates.map((date) => {
              const active = isSameDate(date, selectedDate);
              return (
                <button
                  key={dateKey(date)}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`rounded-[20px] border px-3 py-3 text-left transition ${
                    active
                      ? "border-transparent bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-white shadow-[0_14px_28px_rgba(97,76,197,0.22)]"
                      : "border-[#ECE8FF] bg-white text-[#241F3D] hover:bg-[#FAF9FF]"
                  }`}
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.14em] opacity-80">
                    {getWeekdayLabel(date)}
                  </div>
                  <div className="mt-1 text-[1rem] font-black">
                    {pad(date.getDate())}/{pad(date.getMonth() + 1)}
                  </div>
                </button>
              );
            })}

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

            {weekDates.map((date) => {
              const currentDateKey = dateKey(date);
              const dayEvents = events.filter((event) => event.dateKey === currentDateKey);

              return (
                <div
                  key={currentDateKey}
                  className="relative rounded-[24px] border border-[#ECE8FF] bg-white"
                  style={{ height: totalHeight }}
                >
                  {HOURS.map((hour, index) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-dashed border-[#EFEAFD]"
                      style={{ top: index * PX_PER_HOUR }}
                    />
                  ))}

                  {dayEvents.map((event) => {
                    const top = ((getMinutes(event.start) - 7 * 60) / 60) * PX_PER_HOUR;
                    const height = Math.max(
                      52,
                      ((getMinutes(event.end) - getMinutes(event.start)) / 60) *
                        PX_PER_HOUR
                    );

                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onSelectTask(event.task)}
                        className={`absolute left-2 right-2 rounded-[18px] p-3 text-left shadow-[0_12px_24px_rgba(62,41,170,0.15)] transition hover:scale-[1.01] ${getTaskColors(
                          event.type
                        )}`}
                        style={{ top, height }}
                      >
                        <div className="text-[10px] font-black uppercase tracking-[0.14em] opacity-85">
                          {event.start}
                        </div>
                        <div className="mt-1 line-clamp-2 text-[13px] font-black leading-5">
                          {event.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}