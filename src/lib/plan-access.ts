import { NextResponse } from "next/server";
import type { PlanTier } from "@prisma/client";

export type AppPlanTier = "FREE" | "PLUS" | "PRO";

export type PlanFeature =
  | "FOCUS_HISTORY"
  | "SMART_RESCHEDULE"
  | "WEEKLY_INSIGHTS"
  | "ADVANCED_INSIGHTS"
  | "PDF_REPORT"
  | "ADVANCED_AI_COACH";

type UserPlanLike = {
  planTier?: PlanTier | AppPlanTier | string | null;
  planExpiresAt?: Date | string | null;
};

export type PlanRequiredResponse = {
  ok: false;
  error: "PLAN_REQUIRED";
  code: "PLAN_REQUIRED";
  requiredPlan: Exclude<AppPlanTier, "FREE">;
  feature: PlanFeature;
  message: string;
  upgradeUrl: string;
};

const PLAN_RANK: Record<AppPlanTier, number> = {
  FREE: 0,
  PLUS: 1,
  PRO: 2,
};

const FEATURE_MIN_PLAN: Record<PlanFeature, Exclude<AppPlanTier, "FREE">> = {
  FOCUS_HISTORY: "PLUS",
  SMART_RESCHEDULE: "PLUS",
  WEEKLY_INSIGHTS: "PLUS",

  ADVANCED_INSIGHTS: "PRO",
  PDF_REPORT: "PRO",
  ADVANCED_AI_COACH: "PRO",
};

const FEATURE_LABEL: Record<PlanFeature, string> = {
  FOCUS_HISTORY: "lịch sử focus session",
  SMART_RESCHEDULE: "gợi ý dời lịch thông minh",
  WEEKLY_INSIGHTS: "weekly insights",

  ADVANCED_INSIGHTS: "phân tích nâng cao",
  PDF_REPORT: "xuất báo cáo PDF",
  ADVANCED_AI_COACH: "AI Coach nâng cao",
};

export function normalizePlanTier(plan?: string | null): AppPlanTier {
  if (plan === "PRO") return "PRO";
  if (plan === "PLUS") return "PLUS";

  return "FREE";
}

export function isPlanActive(user: UserPlanLike | null | undefined): boolean {
  if (!user) return false;

  const tier = normalizePlanTier(user.planTier ?? null);

  if (tier === "FREE") {
    return true;
  }

  if (!user.planExpiresAt) {
    return true;
  }

  const expiresAt =
    user.planExpiresAt instanceof Date
      ? user.planExpiresAt
      : new Date(user.planExpiresAt);

  if (Number.isNaN(expiresAt.getTime())) {
    return false;
  }

  return expiresAt.getTime() > Date.now();
}

export function getEffectivePlan(
  user: UserPlanLike | null | undefined,
): AppPlanTier {
  if (!user) return "FREE";

  const tier = normalizePlanTier(user.planTier ?? null);

  if (tier === "FREE") return "FREE";

  if (!isPlanActive(user)) {
    return "FREE";
  }

  return tier;
}

export function hasPlanAccess(
  user: UserPlanLike | null | undefined,
  requiredPlan: AppPlanTier,
): boolean {
  const currentPlan = getEffectivePlan(user);

  return PLAN_RANK[currentPlan] >= PLAN_RANK[requiredPlan];
}

export function getRequiredPlanForFeature(
  feature: PlanFeature,
): Exclude<AppPlanTier, "FREE"> {
  return FEATURE_MIN_PLAN[feature];
}

export function hasFeatureAccess(
  user: UserPlanLike | null | undefined,
  feature: PlanFeature,
): boolean {
  const requiredPlan = getRequiredPlanForFeature(feature);

  return hasPlanAccess(user, requiredPlan);
}

export function forbiddenPlanResponse(feature: PlanFeature) {
  const requiredPlan = getRequiredPlanForFeature(feature);
  const featureLabel = FEATURE_LABEL[feature];

  const payload: PlanRequiredResponse = {
    ok: false,
    error: "PLAN_REQUIRED",
    code: "PLAN_REQUIRED",
    requiredPlan,
    feature,
    message:
      requiredPlan === "PRO"
        ? `Tính năng ${featureLabel} cần gói Pro.`
        : `Tính năng ${featureLabel} cần gói Plus hoặc Pro.`,
    upgradeUrl: `/pricing?highlight=${requiredPlan.toLowerCase()}`,
  };

  return NextResponse.json(payload, { status: 403 });
}