
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export default function InputField({
  label,
  icon,
  trailing,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] uppercase tracking-widest text-[#A39C93] font-bold ml-1">
          {label}
        </label>
      )}

      <div className="rounded-2xl border border-[#F0EBE1] bg-[#FDFCF8] px-4 py-4 flex items-center gap-3">
        {icon && <div className="text-[#A39C93]">{icon}</div>}
        <input
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-[#B8ADA1] font-light",
            className
          )}
          {...props}
        />
        {trailing}
      </div>
    </div>
  );
}