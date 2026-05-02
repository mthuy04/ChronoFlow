"use client";

import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";

export type PlannerToastTone = "success" | "error" | "info";

interface PlannerToastProps {
  message: string;
  tone: PlannerToastTone;
  onClose: () => void;
}

export default function PlannerToast({
  message,
  tone,
  onClose,
}: PlannerToastProps) {
  if (!message) return null;

  const icon =
    tone === "success" ? (
      <CheckCircle2 className="h-5 w-5" />
    ) : tone === "error" ? (
      <AlertTriangle className="h-5 w-5" />
    ) : (
      <Info className="h-5 w-5" />
    );

  const toneClass =
    tone === "success"
      ? "border-[#D8F0E1] bg-[#F2FBF4] text-[#2D8C57]"
      : tone === "error"
        ? "border-[#FFD8D8] bg-[#FFF7F7] text-[#C55454]"
        : "border-[#E9E5FF] bg-[#F8F6FF] text-[#765BFF]";

  return (
    <div className="fixed right-5 top-24 z-[160] w-[min(420px,calc(100vw-40px))]">
      <div
        className={`flex items-start gap-3 rounded-[24px] border px-4 py-4 shadow-[0_22px_70px_rgba(31,22,74,0.16)] backdrop-blur-xl ${toneClass}`}
      >
        <div className="mt-0.5 shrink-0">{icon}</div>

        <p className="min-w-0 flex-1 text-[13px] font-bold leading-6">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full p-1 opacity-70 transition hover:bg-white/70 hover:opacity-100"
          aria-label="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}