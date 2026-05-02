"use client";

import { RotateCcw, X } from "lucide-react";

interface PlannerUndoBarProps {
  message: string;
  isUndoing: boolean;
  onUndo: () => void;
  onDismiss: () => void;
}

export default function PlannerUndoBar({
  message,
  isUndoing,
  onUndo,
  onDismiss,
}: PlannerUndoBarProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[155] w-[min(560px,calc(100vw-32px))] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-white/70 bg-[#17122B]/94 px-4 py-3 text-white shadow-[0_24px_80px_rgba(23,18,43,0.28)] backdrop-blur-xl">
        <div className="min-w-0 flex-1 truncate text-[13px] font-semibold">
          {message}
        </div>

        <button
          type="button"
          onClick={onUndo}
          disabled={isUndoing}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#17122B] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Hoàn tác
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Ẩn hoàn tác"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}