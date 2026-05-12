import { PlanTier } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ActivatePlanInput = {
  userId: string;
  itemKey: string;
  sourceOrderId: string;
};

function getPlanFromItemKey(itemKey: string): PlanTier | null {
  const normalized = itemKey.toLowerCase();

  if (normalized === "plus") return "PLUS";
  if (normalized === "pro") return "PRO";

  return null;
}

function getPlanDurationDays(itemKey: string) {
  const normalized = itemKey.toLowerCase();

  if (normalized === "plus") return 30;
  if (normalized === "pro") return 30;

  return 0;
}

export async function activateUserPlanFromPayment(input: ActivatePlanInput) {
  const planTier = getPlanFromItemKey(input.itemKey);

  if (!planTier) {
    console.log("[PLAN_ACTIVATION_SKIP]", {
      reason: "Item is not a subscription plan.",
      itemKey: input.itemKey,
      sourceOrderId: input.sourceOrderId,
    });

    return null;
  }

  const durationDays = getPlanDurationDays(input.itemKey);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const updatedUser = await prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      planTier,
      planActivatedAt: now,
      planExpiresAt: expiresAt,
      planSource: `payment_order:${input.sourceOrderId}`,
    },
    select: {
      id: true,
      email: true,
      planTier: true,
      planActivatedAt: true,
      planExpiresAt: true,
      planSource: true,
    },
  });

  console.log("[PLAN_ACTIVATED]", {
    userId: updatedUser.id,
    email: updatedUser.email,
    planTier: updatedUser.planTier,
    planExpiresAt: updatedUser.planExpiresAt,
    sourceOrderId: input.sourceOrderId,
  });

  return updatedUser;
}