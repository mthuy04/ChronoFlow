import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Crown,
  LockKeyhole,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { AppPlanTier } from "@/lib/plan-access";

type PlanRequiredCardProps = {
  requiredPlan: Exclude<AppPlanTier, "FREE">;
  title?: string;
  description?: string;
  featureLabel?: string;
  compact?: boolean;
};

const planCopy = {
  PLUS: {
    label: "Plus",
    eyebrow: "Mở khóa thói quen nâng cao",
    price: "29.000đ",
    period: "/ tháng",
    gradient: "from-[#F59E0B] via-[#FFB84D] to-[#FFD166]",
    softBg: "from-[#FFF7ED] via-[#FFFDF7] to-[#FFFFFF]",
    textColor: "text-[#F59E0B]",
    border: "border-[#FFE3B3]",
    icon: Crown,
    bullets: [
      "Weekly insight theo nhịp năng lượng",
      "Lịch sử focus session",
      "Smart reschedule cho task lệch nhịp",
      "Reward loop & coin nâng cao",
    ],
    cta: "Nâng cấp Plus",
  },
  PRO: {
    label: "Pro",
    eyebrow: "Mở khóa phân tích chuyên sâu",
    price: "59.000đ",
    period: "/ tháng",
    gradient: "from-[#6F59FF] via-[#6B7CFF] to-[#4DA8FF]",
    softBg: "from-[#F5F2FF] via-[#F8FBFF] to-[#FFFFFF]",
    textColor: "text-[#6F59FF]",
    border: "border-[#DCD5FF]",
    icon: Star,
    bullets: [
      "Planner Score & phân tích hiệu suất",
      "Energy ↔ Focus correlation",
      "Deadline risk engine",
      "Peak vs off-peak comparison",
      "Báo cáo và insight nâng cao",
    ],
    cta: "Nâng cấp Pro",
  },
} satisfies Record<
  Exclude<AppPlanTier, "FREE">,
  {
    label: string;
    eyebrow: string;
    price: string;
    period: string;
    gradient: string;
    softBg: string;
    textColor: string;
    border: string;
    icon: LucideIcon;
    bullets: string[];
    cta: string;
  }
>;

export default function PlanRequiredCard({
  requiredPlan,
  title,
  description,
  featureLabel,
  compact = false,
}: PlanRequiredCardProps) {
  const config = planCopy[requiredPlan];
  const PlanIcon = config.icon;

  return (
    <section
      className={`relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(246,247,255,0.72)_100%)] shadow-[0_28px_90px_rgba(26,21,40,0.08)] backdrop-blur-2xl ${
        compact ? "p-5 md:p-6" : "p-6 md:p-10"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-18%] h-[280px] w-[280px] rounded-full bg-[#DCCEFF]/70 blur-[95px]" />
        <div className="absolute right-[-8%] top-[8%] h-[260px] w-[260px] rounded-full bg-[#D9EAFF]/70 blur-[95px]" />
        <div className="absolute bottom-[-22%] left-[35%] h-[340px] w-[340px] rounded-full bg-white/80 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/[0.88] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_24px_rgba(111,89,255,0.08)] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            {featureLabel ?? config.eyebrow}
          </div>

          <div
            className={`mt-5 inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br ${config.gradient} text-white shadow-[0_18px_38px_rgba(111,89,255,0.22)]`}
          >
            <LockKeyhole className="h-6 w-6" />
          </div>

          <h2 className="mt-5 max-w-[760px] text-[clamp(2rem,4vw,3.4rem)] font-[950] leading-[1.06] tracking-[-0.045em] text-[#1A1528]">
            {title ?? "Tính năng này cần "}
            {!title && (
              <span
                className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
              >
                gói {config.label}.
              </span>
            )}
            {title && (
              <>
                {" "}
                <span
                  className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                >
                  {config.label}.
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 max-w-[720px] text-[15px] font-medium leading-[1.9] text-[#615C7A] md:text-[16px]">
            {description ??
              (requiredPlan === "PRO"
                ? "Nâng cấp Pro để xem phân tích sâu hơn về planner score, deadline risk, energy-focus correlation và cách lịch của bạn đang khớp với peak window."
                : "Nâng cấp Plus để mở khóa lịch sử focus, weekly insight và các gợi ý điều chỉnh lịch giúp bạn duy trì thói quen đều hơn.")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/pricing?highlight=${requiredPlan.toLowerCase()}`}
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-black text-white shadow-[0_18px_38px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
            >
              {config.cta}
              <ArrowRight className="h-4 w-4 text-[#4DA8FF] transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/pricing"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-6 text-[14px] font-black text-[#241F3D] shadow-[0_12px_28px_rgba(26,21,40,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <BarChart3 className="h-4 w-4 text-[#6F59FF]" />
              So sánh gói
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <MiniTrust
              icon={<Zap className="h-3.5 w-3.5" />}
              text="Kích hoạt sau thanh toán"
            />
            <MiniTrust
              icon={<CalendarClock className="h-3.5 w-3.5" />}
              text="Theo tháng, dễ nâng cấp"
            />
            <MiniTrust
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              text="Bank QR tự động xác nhận"
            />
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-[34px] border ${config.border} bg-gradient-to-br ${config.softBg} p-5 shadow-[0_22px_58px_rgba(26,21,40,0.07)]`}
        >
          <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full bg-white/70 blur-[55px]" />

          <div className="relative flex items-start justify-between gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${config.gradient} text-white shadow-[0_16px_32px_rgba(26,21,40,0.16)]`}
            >
              <PlanIcon className="h-6 w-6" />
            </div>

            <div className="rounded-full border border-white/80 bg-white/[0.86] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3] shadow-sm">
              Gói {config.label}
            </div>
          </div>

          <div className="relative mt-5">
            <div
              className={`text-[11px] font-black uppercase tracking-[0.18em] ${config.textColor}`}
            >
              {config.eyebrow}
            </div>

            <div className="mt-2 flex items-end gap-1">
              <span className="text-[42px] font-[950] leading-none tracking-[-0.06em] text-[#1A1528]">
                {config.price}
              </span>
              <span className="pb-1.5 text-[13px] font-black text-[#8A84A3]">
                {config.period}
              </span>
            </div>
          </div>

          <div className="relative mt-5 space-y-2.5">
            {config.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-2 rounded-2xl border border-white/80 bg-white/[0.76] px-3 py-3 text-[13px] font-bold leading-6 text-[#5B566E] shadow-sm backdrop-blur-xl"
              >
                <CheckCircle2
                  className={`mt-0.5 h-4 w-4 shrink-0 ${config.textColor}`}
                />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniTrust({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/[0.82] px-3.5 py-2 text-[12px] font-bold text-[#5B566E] shadow-[0_8px_20px_rgba(26,21,40,0.04)] backdrop-blur-xl">
      <span className="text-[#6F59FF]">{icon}</span>
      {text}
    </div>
  );
}