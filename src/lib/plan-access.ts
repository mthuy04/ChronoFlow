import { NextResponse } from "next/server";
import type { PlanTier } from "@prisma/client";

export type AppPlanTier = "FREE" | "PLUS" | "PRO";

export type PlanFeature =
  | "BASIC_DASHBOARD"
  | "BASIC_PLANNER"
  | "BASIC_FOCUS"
  | "BASIC_RHYTHM"
  | "ENERGY_CHECKIN"
  | "WEEKLY_INSIGHTS"
  | "FOCUS_HISTORY"
  | "SMART_RESCHEDULE"
  | "REWARDS_ADVANCED"
  | "ADVANCED_INSIGHTS"
  | "PLANNER_SCORE"
  | "CORRELATION_ANALYTICS"
  | "DEADLINE_RISK"
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
  requiredPlan: AppPlanTier;
  feature: PlanFeature;
  message: string;
  upgradeUrl: string;
};

const PLAN_RANK: Record<AppPlanTier, number> = {
  FREE: 0,
  PLUS: 1,
  PRO: 2,
};

const FEATURE_MIN_PLAN: Record<PlanFeature, AppPlanTier> = {
  BASIC_DASHBOARD: "FREE",
  BASIC_PLANNER: "FREE",
  BASIC_FOCUS: "FREE",
  BASIC_RHYTHM: "FREE",
  ENERGY_CHECKIN: "FREE",

  WEEKLY_INSIGHTS: "PLUS",
  FOCUS_HISTORY: "PLUS",
  SMART_RESCHEDULE: "PLUS",
  REWARDS_ADVANCED: "PLUS",

  ADVANCED_INSIGHTS: "PRO",
  PLANNER_SCORE: "PRO",
  CORRELATION_ANALYTICS: "PRO",
  DEADLINE_RISK: "PRO",
  PDF_REPORT: "PRO",
  ADVANCED_AI_COACH: "PRO",
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

export function getRequiredPlanForFeature(feature: PlanFeature): AppPlanTier {
  return FEATURE_MIN_PLAN[feature];
}

export function hasFeatureAccess(
  user: UserPlanLike | null | undefined,
  feature: PlanFeature,
): boolean {
  return hasPlanAccess(user, getRequiredPlanForFeature(feature));
}

export function forbiddenPlanResponse(feature: PlanFeature) {
  const requiredPlan = getRequiredPlanForFeature(feature);

  const payload: PlanRequiredResponse = {
    ok: false,
    error: "PLAN_REQUIRED",
    code: "PLAN_REQUIRED",
    requiredPlan,
    feature,
    message:
      requiredPlan === "PRO"
        ? "Tính năng này cần gói Pro."
        : "Tính năng này cần gói Plus hoặc Pro.",
    upgradeUrl: `/pricing?highlight=${requiredPlan.toLowerCase()}`,
  };

  return NextResponse.json(payload, { status: 403 });
}