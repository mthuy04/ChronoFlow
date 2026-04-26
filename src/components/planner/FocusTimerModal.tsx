"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { PlannerTask, focusModePresets } from "@/lib/planner";

export default function FocusTimerModal({
  task,
  onClose,
}: {
  task: PlannerTask;
  onClose: () => void;
}) {
  const modes = useMemo(() => focusModePresets[task.type], [task.type]);
  const defaultMinutes =
    task.focusMinutes || modes[0]?.minutes || 25;

  const [minutes, setMinutes] = useState(defaultMinutes);
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const applyMode = (m: number) => {
    setMinutes(m);
    setSecondsLeft(m * 60);
    setRunning(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[120] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white bg-white p-6 shadow-[0_30px_80px_rgba(26,21,40,0.24)]">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-wide text-[#8A84A3]">
              Focus mode
            </div>
            <h3 className="mt-1 text-[1.35rem] font-[900] text-[#1A1528]">
              {task.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E9E5FF] bg-white text-[#4F4A68]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-[28px] border border-[#E9E5FF] bg-[linear-gradient(180deg,#F8F9FE_0%,#F3F0FF_100%)] px-6 py-8 text-center">
          <div className="text-[56px] font-[950] leading-none text-[#1A1528]">
            {mm}:{ss}
          </div>
          <div className="mt-2 text-[13px] text-[#6B6287]">
            {minutes} phút tập trung
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          {modes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => applyMode(mode.minutes)}
              className="rounded-2xl border border-[#E9E5FF] bg-white px-4 py-3 text-left text-[13px] font-semibold text-[#4F4A68]"
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setRunning((v) => !v)}
            className="flex-1 rounded-2xl bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-5 py-3 text-[14px] font-semibold text-white"
          >
            {running ? (
              <span className="inline-flex items-center gap-2"><Pause className="h-4 w-4" /> Tạm dừng</span>
            ) : (
              <span className="inline-flex items-center gap-2"><Play className="h-4 w-4" /> Bắt đầu</span>
            )}
          </button>

          <button
            onClick={() => {
              setRunning(false);
              setSecondsLeft(minutes * 60);
            }}
            className="rounded-2xl border border-[#E9E5FF] bg-white px-5 py-3 text-[14px] font-semibold text-[#4F4A68]"
          >
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </span>
          </button>
        </div>
      </div>
    </>
  );
}