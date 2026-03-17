"use client";

export default function ScaleQuestion({
  value,
  onChange,
  leftLabel = "Low",
  rightLabel = "High",
}: {
  value: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="cf-card p-8">
      <div className="flex items-center justify-between text-sm text-[#6A6474] mb-5">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#4F3DFF]"
      />

      <div className="mt-6 flex justify-center">
        <div className="w-16 h-16 rounded-full bg-[#F3F0FF] border border-[#D8D0FF] flex items-center justify-center text-[1.4rem] font-semibold text-[#4F3DFF]">
          {value}
        </div>
      </div>
    </div>
  );
}