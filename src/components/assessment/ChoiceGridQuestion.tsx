"use client";

type Option = {
  label: string;
  description?: string;
  value: string;
};

export default function ChoiceGridQuestion({
  options,
  selected,
  onSelect,
}: {
  options: Option[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid gap-4">
      {options.map((option) => {
        const active = selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`text-left rounded-[28px] border px-6 py-5 transition-all duration-200 ${
              active
                ? "border-[#4F3DFF] bg-[#F3F0FF] shadow-[0_10px_30px_rgba(79,61,255,0.08)]"
                : "border-[var(--line)] bg-white hover:border-[#CFC5FF] hover:shadow-[var(--shadow-sm)]"
            }`}
          >
            <div className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[#201C2B]">
              {option.label}
            </div>
            {option.description && (
              <div className="mt-2 text-[0.96rem] leading-[1.7] text-[#6A6474]">
                {option.description}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}