import Link from "next/link";
import { ArrowRight, Crown, LockKeyhole, Sparkles } from "lucide-react";
import type { AppPlanTier } from "@/lib/plan-access";

type PlanRequiredCardProps = {
  requiredPlan: Exclude<AppPlanTier, "FREE">;
  title?: string;
  description?: string;
};

export default function PlanRequiredCard({
  requiredPlan,
  title,
  description,
}: PlanRequiredCardProps) {
  const isPro = requiredPlan === "PRO";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(246,247,255,0.78)_100%)] p-6 text-center shadow-[0_24px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-44 w-44 rounded-full bg-[#DCCEFF]/70 blur-[70px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-52 w-52 rounded-full bg-[#D9EAFF]/70 blur-[80px]" />

      <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white shadow-[0_16px_34px_rgba(111,89,255,0.2)]">
        {isPro ? <Crown className="h-6 w-6" /> : <LockKeyhole className="h-6 w-6" />}
      </div>

      <div className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
        Cần gói {requiredPlan}
      </div>

      <h3 className="relative mx-auto mt-4 max-w-xl text-[clamp(1.4rem,2.8vw,2.2rem)] font-[950] leading-[1.08] tracking-[-0.04em] text-[#1A1528]">
        {title ??
          (isPro
            ? "Mở khóa phân tích chuyên sâu với Pro."
            : "Mở khóa nhịp làm việc đầy đủ với Plus.")}
      </h3>

      <p className="relative mx-auto mt-3 max-w-xl text-[14px] font-medium leading-7 text-[#615C7A]">
        {description ??
          (isPro
            ? "Tính năng này thuộc nhóm phân tích nâng cao, phù hợp khi bạn muốn xem planner score, deadline risk, correlation và báo cáo chi tiết."
            : "Tính năng này giúp bạn duy trì thói quen tốt hơn với weekly insight, focus history và gợi ý điều chỉnh lịch.")}
      </p>

      <Link
        href={`/pricing?highlight=${requiredPlan.toLowerCase()}`}
        className="relative mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
      >
        Nâng cấp lên {requiredPlan}
        <ArrowRight className="h-4 w-4 text-[#4DA8FF]" />
      </Link>
    </div>
  );
}