"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

interface FocusTimerCardProps {
  title: string;
  durationMinutes: number;
  accent?: string;
  subtitle?: string;
}

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FocusTimerCard({
  title,
  durationMinutes,
  accent = "#8B5CF6",
  subtitle,
}: FocusTimerCardProps) {
  const initialSeconds = useMemo(() => durationMinutes * 60, [durationMinutes]);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const progressPercent =
    initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;

  return (
    <div className="rounded-[28px] border border-white bg-white/72 p-3 shadow-sm backdrop-blur-xl">
      <div className="rounded-[22px] border border-white/80 bg-[linear-gradient(135deg,#F8F4FF_0%,#F5F8FF_55%,#FFF8F1_100%)] p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
              Focus timer
            </div>
            <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#1A152E]">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-[13px] leading-6 text-[#615C7A]">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm">
            <Timer className="h-5 w-5" style={{ color: accent }} />
          </div>
        </div>

        <div className="rounded-[20px] border border-white/80 bg-white/88 px-5 py-6 text-center shadow-sm">
          <div
            className="text-[2.3rem] font-[900] tracking-tight md:text-[2.8rem]"
            style={{ color: accent }}
          >
            {formatTime(secondsLeft)}
          </div>
          <div className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-slate-400">
            {isRunning ? "In focus session" : "Ready to begin"}
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#F1ECFF]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${accent} 0%, #D946EF 70%, #60A5FA 100%)`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            disabled={secondsLeft <= 0}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition-all ${
              secondsLeft <= 0
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-[#1A152E] text-white hover:scale-[1.02]"
            }`}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(initialSeconds);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#615C7A] transition-all hover:border-slate-300 hover:text-[#1A152E]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}