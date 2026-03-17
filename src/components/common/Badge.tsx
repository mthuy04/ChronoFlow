import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold",
        variant === "default" && "bg-slate-50 text-slate-500",
        variant === "success" && "bg-emerald-50 text-emerald-700",
        variant === "warning" && "bg-amber-50 text-amber-700",
        variant === "danger" && "bg-rose-50 text-rose-600"
      )}
    >
      {children}
    </span>
  );
}