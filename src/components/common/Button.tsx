import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 transition-colors font-light",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-[#3A3836] text-white hover:bg-[#2C2A28]",
        variant === "secondary" &&
          "border border-[#DCD6CC] text-[#6B655E] hover:border-[#3A3836] hover:text-[#3A3836]",
        variant === "ghost" &&
          "text-[#8C7A6B] hover:text-[#3A3836]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}