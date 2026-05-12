"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Sparkles, Zap } from "lucide-react";

type PlanTier = "FREE" | "PLUS" | "PRO";

type PlanResponse = {
  ok: boolean;
  plan?: {
    tier: PlanTier;
    rawTier: PlanTier;
    activatedAt: string | null;
    expiresAt: string | null;
    source: string | null;
    isActive: boolean;
  };
};

const PLAN_STYLE: Record<
  PlanTier,
  {
    label: string;
    icon: React.ReactNode;
    className: string;
  }
> = {
  FREE: {
    label: "Free",
    icon: <Sparkles className="h-3.5 w-3.5" />,
    className:
      "border-[#E9E5FF] bg-white/85 text-[#6F59FF] shadow-[0_8px_22px_rgba(111,89,255,0.08)]",
  },
  PLUS: {
    label: "Plus",
    icon: <Crown className="h-3.5 w-3.5" />,
    className:
      "border-[#FFE3B3] bg-[#FFF7ED]/90 text-[#F59E0B] shadow-[0_8px_22px_rgba(245,158,11,0.1)]",
  },
  PRO: {
    label: "Pro",
    icon: <Zap className="h-3.5 w-3.5" />,
    className:
      "border-[#DCD5FF] bg-[#F5F2FF]/90 text-[#6F59FF] shadow-[0_8px_22px_rgba(111,89,255,0.12)]",
  },
};

export default function CurrentPlanBadge() {
  const [tier, setTier] = useState<PlanTier>("FREE");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadPlan() {
      try {
        const response = await fetch("/api/account/plan", {
          method: "GET",
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as
          | PlanResponse
          | null;

        if (!ignore && response.ok && payload?.ok && payload.plan?.tier) {
          setTier(payload.plan.tier);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadPlan();

    return () => {
      ignore = true;
    };
  }, []);

  const style = PLAN_STYLE[tier];

  if (isLoading) {
    return (
      <div className="h-9 w-[92px] animate-pulse rounded-full bg-white/70" />
    );
  }

  return (
    <Link
      href="/pricing"
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-black transition hover:-translate-y-0.5 ${style.className}`}
      title="Xem gói sử dụng"
    >
      {style.icon}
      {style.label}
    </Link>
  );
}