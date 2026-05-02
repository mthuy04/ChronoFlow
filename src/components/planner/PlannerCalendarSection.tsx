"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ViewMode } from "./types";
import { cn, getLongDateLabel } from "./utils";

type PlannerCalendarSectionProps = {
  viewMode: ViewMode;
  selectedDateKey: string;
  weekRangeLabel: string;
  children: ReactNode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function PlannerCalendarSection({
  viewMode,
  selectedDateKey,
  weekRangeLabel,
  children,
  onViewModeChange,
  onPrev,
  onNext,
}: PlannerCalendarSectionProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-[40px] border border-white/90 bg-white/86 shadow-[0_18px_56px_rgba(133,108,255,0.07)] backdrop-blur-xl">
      <div className="border-b border-[#F1ECFF] px-6 py-7 md:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-[820px]">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">
              Planner trực quan
            </div>
            <h2 className="mt-3 text-[clamp(2rem,3.2vw,3.4rem)] font-black leading-tight tracking-tight text-[#241F3D]">
              Xem lịch của bạn theo{" "}
              <span className="bg-[linear-gradient(135deg,#7B5CFA_0%,#55A8FF_100%)] bg-clip-text text-transparent">
                ngày hoặc tuần
              </span>
            </h2>
            <p className="mt-3 text-[1rem] leading-8 text-[#635C7C]">
              Calendar là phần chính nên để full-width, không ép sidebar chen chúc.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-violet-200 bg-[#F8F5FF] p-1">
              <button
                type="button"
                onClick={() => onViewModeChange("day")}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-bold transition",
                  viewMode === "day"
                    ? "bg-white text-[#201A39] shadow-sm"
                    : "text-[#7B7395]",
                )}
              >
                Xem ngày
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("week")}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-bold transition",
                  viewMode === "week"
                    ? "bg-white text-[#201A39] shadow-sm"
                    : "text-[#7B7395]",
                )}
              >
                Xem tuần
              </button>
            </div>

            <button
              type="button"
              onClick={onPrev}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-white text-[#5C5676] transition hover:bg-[#FBFAFF]"
              aria-label="Lùi lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="inline-flex min-h-11 items-center rounded-full border border-violet-200 bg-white px-5 text-sm font-bold text-[#241F3D]">
              {viewMode === "week" ? weekRangeLabel : getLongDateLabel(selectedDateKey)}
            </div>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-white text-[#5C5676] transition hover:bg-[#FBFAFF]"
              aria-label="Tiến tới"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 md:px-6 md:py-6">{children}</div>
    </section>
  );
}