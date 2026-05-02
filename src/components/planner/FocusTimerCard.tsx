"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  CheckCircle2,
  Coins,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Save,
  Timer,
} from "lucide-react";

import { emitCoinRewardFromElement } from "@/lib/coin-reward-events";

interface FocusTimerCardProps {
  taskId: string;
  title: string;
  durationMinutes: number;
  accent?: string;
  subtitle?: string;
  estimatedCoins?: number;
  onSessionSaved?: () => Promise<void> | void;
}

type TimerState = {
  secondsLeft: number;
  isRunning: boolean;
  initialSeconds: number;
};

type FocusSessionResponse = {
  success?: boolean;
  session?: {
    id: string;
    taskId: string | null;
    durationMinutes: number;
    startedAt: string;
    endedAt: string | null;
    coinsEarned?: number;
  };
  awardedCoins?: number;
  nextCoinBalance?: number;
  error?: string;
};

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

function getElapsedSeconds(state: TimerState) {
  return Math.max(0, state.initialSeconds - state.secondsLeft);
}

export default function FocusTimerCard({
  taskId,
  title,
  durationMinutes,
  accent = "#8B5CF6",
  subtitle,
  estimatedCoins = 0,
  onSessionSaved,
}: FocusTimerCardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const autoSaveLockRef = useRef(false);

  const initialSeconds = useMemo(
    () => Math.max(1, durationMinutes) * 60,
    [durationMinutes],
  );

  const [timerState, setTimerState] = useState<TimerState>({
    secondsLeft: initialSeconds,
    isRunning: false,
    initialSeconds,
  });

  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimerState({
      secondsLeft: initialSeconds,
      isRunning: false,
      initialSeconds,
    });
    setStartedAt(null);
    setSessionSaved(false);
    setMessage("");
    autoSaveLockRef.current = false;
  }, [initialSeconds, taskId]);

  useEffect(() => {
    if (!timerState.isRunning || timerState.secondsLeft <= 0) return;

    const interval = window.setInterval(() => {
      setTimerState((prev) => {
        if (!prev.isRunning) return prev;

        if (prev.secondsLeft <= 1) {
          return {
            ...prev,
            secondsLeft: 0,
            isRunning: false,
          };
        }

        return {
          ...prev,
          secondsLeft: prev.secondsLeft - 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerState.isRunning, timerState.secondsLeft]);

  const progressPercent =
    timerState.initialSeconds > 0
      ? ((timerState.initialSeconds - timerState.secondsLeft) /
          timerState.initialSeconds) *
        100
      : 0;

  const finished = timerState.secondsLeft <= 0;
  const elapsedSeconds = getElapsedSeconds(timerState);
  const elapsedMinutes = Math.max(0, Math.round(elapsedSeconds / 60));
  const canSave = elapsedSeconds >= 60 && !sessionSaved && !isSavingSession;

  function toggleTimer() {
    setMessage("");

    setTimerState((prev) => {
      const nextRunning = !prev.isRunning;

      if (nextRunning && !startedAt) {
        setStartedAt(new Date());
      }

      return {
        ...prev,
        isRunning: nextRunning,
      };
    });
  }

  function resetTimer() {
    setTimerState((prev) => ({
      ...prev,
      secondsLeft: prev.initialSeconds,
      isRunning: false,
    }));
    setStartedAt(null);
    setSessionSaved(false);
    setMessage("");
    autoSaveLockRef.current = false;
  }

  const saveFocusSession = useCallback(
    async (mode: "manual" | "auto", sourceElement?: HTMLElement | null) => {
      const currentElapsedSeconds = getElapsedSeconds(timerState);
      const durationMinutesToSave = Math.max(
        1,
        Math.round(currentElapsedSeconds / 60),
      );

      if (currentElapsedSeconds < 60) {
        setMessage("Hãy focus ít nhất 1 phút trước khi lưu phiên.");
        return;
      }

      if (sessionSaved) {
        setMessage("Phiên focus này đã được lưu rồi.");
        return;
      }

      const safeStartedAt =
        startedAt ?? new Date(Date.now() - currentElapsedSeconds * 1000);
      const endedAt = new Date();

      try {
        setIsSavingSession(true);
        setMessage("");

        const response = await fetch("/api/focus-sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId,
            durationMinutes: durationMinutesToSave,
            startedAt: safeStartedAt.toISOString(),
            endedAt: endedAt.toISOString(),
          }),
        });

        const data = (await response.json().catch(() => null)) as
          | FocusSessionResponse
          | null;

        if (!response.ok) {
          throw new Error(data?.error || "Không thể lưu phiên focus.");
        }

        setSessionSaved(true);
        setTimerState((prev) => ({
          ...prev,
          isRunning: false,
        }));

        if (data?.awardedCoins && data.awardedCoins > 0) {
          emitCoinRewardFromElement(
            sourceElement ?? null,
            data.awardedCoins,
            data.nextCoinBalance,
          );
        }

        if (onSessionSaved) {
          await onSessionSaved();
        }

        setMessage(
          mode === "auto"
            ? "Timer đã hoàn tất và phiên focus đã được lưu. Task chưa bị tự đánh dấu hoàn thành."
            : "Đã lưu phiên focus. Bạn có thể đánh dấu task hoàn thành riêng nếu task đã xong.",
        );
      } catch (error) {
        autoSaveLockRef.current = false;
        setMessage(
          error instanceof Error
            ? error.message
            : "Không thể lưu phiên focus.",
        );
      } finally {
        setIsSavingSession(false);
      }
    },
    [onSessionSaved, sessionSaved, startedAt, taskId, timerState],
  );

  useEffect(() => {
    if (timerState.secondsLeft !== 0) return;
    if (sessionSaved) return;
    if (autoSaveLockRef.current) return;

    const currentElapsedSeconds = getElapsedSeconds(timerState);
    if (currentElapsedSeconds < 60) return;

    autoSaveLockRef.current = true;
    void saveFocusSession("auto", rootRef.current);
  }, [saveFocusSession, sessionSaved, timerState]);

  return (
    <div
      ref={rootRef}
      className="rounded-[30px] border border-white/80 bg-white/92 p-4 shadow-sm backdrop-blur-xl"
    >
      <div className="rounded-[26px] border border-white/80 bg-[linear-gradient(135deg,#F8F4FF_0%,#F5F8FF_55%,#FFF8F1_100%)] p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
              Focus session
            </div>

            <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#1A152E]">
              {title}
            </h3>

            {subtitle ? (
              <p className="mt-1 text-[13px] leading-6 text-[#615C7A]">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm">
            <Timer className="h-5 w-5" style={{ color: accent }} />
          </div>
        </div>

        <div className="rounded-[22px] border border-white/80 bg-white/88 px-5 py-6 text-center shadow-sm">
          <div
            className="text-[2.3rem] font-black tracking-tight md:text-[2.8rem]"
            style={{ color: accent }}
          >
            {formatTime(timerState.secondsLeft)}
          </div>

          <div className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-slate-400">
            {sessionSaved
              ? "Đã lưu phiên focus"
              : finished
                ? "Đã hoàn thành timer"
                : timerState.isRunning
                  ? "Đang focus"
                  : "Sẵn sàng bắt đầu"}
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

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] border border-[#ECE8FF] bg-white/75 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#8B5CF6]">
              <Coins className="h-4 w-4" />
              Preview
            </div>

            <div className="mt-2 text-[1.05rem] font-black text-[#1A152E]">
              +{estimatedCoins} coins
            </div>

            <p className="mt-1 text-[12px] leading-6 text-[#615C7A]">
              Ước tính khi phiên focus được lưu.
            </p>
          </div>

          <div className="rounded-[20px] border border-[#ECE8FF] bg-white/75 px-4 py-3">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8B5CF6]">
              Đã focus
            </div>

            <div className="mt-2 text-[1.05rem] font-black text-[#1A152E]">
              {elapsedMinutes} phút
            </div>

            <p className="mt-1 text-[12px] leading-6 text-[#615C7A]">
              Tối thiểu 1 phút để lưu.
            </p>
          </div>

          <div className="rounded-[20px] border border-[#ECE8FF] bg-white/75 px-4 py-3">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8B5CF6]">
              Complete
            </div>

            <div className="mt-2 text-[1.05rem] font-black text-[#1A152E]">
              Không tự ép
            </div>

            <p className="mt-1 text-[12px] leading-6 text-[#615C7A]">
              Task hoàn thành bằng nút riêng.
            </p>
          </div>
        </div>

        {message ? (
          <div className="mt-4 rounded-[18px] border border-[#E9E5FF] bg-white/80 px-4 py-3 text-[12px] font-semibold text-[#615C7A]">
            {message}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={toggleTimer}
            disabled={timerState.secondsLeft <= 0 || sessionSaved}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-black transition-all ${
              timerState.secondsLeft <= 0 || sessionSaved
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-[#1A152E] text-white hover:scale-[1.02]"
            }`}
          >
            {timerState.isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {timerState.isRunning ? "Tạm dừng" : "Bắt đầu"}
          </button>

          <button
            type="button"
            onClick={(event: ReactMouseEvent<HTMLButtonElement>) =>
              void saveFocusSession("manual", event.currentTarget)
            }
            disabled={!canSave}
            className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFA] px-4 py-2.5 text-sm font-black text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {isSavingSession ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : sessionSaved ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {sessionSaved ? "Đã lưu" : "Lưu phiên focus"}
          </button>

          <button
            type="button"
            onClick={resetTimer}
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