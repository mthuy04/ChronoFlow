"use client";

export type RewardRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type CoinRewardPayload = {
  sourceRect: RewardRect;
  amount: number;
  nextBalance?: number;
};

export type CoinLandedPayload = {
  amount: number;
  nextBalance?: number;
};

export const COIN_REWARD_EVENT = "chronoflow:coin-reward";
export const COIN_LANDED_EVENT = "chronoflow:coin-landed";

export function getElementRewardRect(element: HTMLElement): RewardRect {
  const rect = element.getBoundingClientRect();

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export function emitCoinReward(payload: CoinRewardPayload) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<CoinRewardPayload>(COIN_REWARD_EVENT, {
      detail: payload,
    }),
  );
}

export function emitCoinRewardFromElement(
  element: HTMLElement | null,
  amount: number,
  nextBalance?: number,
) {
  if (!element) return;

  emitCoinReward({
    sourceRect: getElementRewardRect(element),
    amount,
    nextBalance,
  });
}

export function emitCoinLanded(payload: CoinLandedPayload) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<CoinLandedPayload>(COIN_LANDED_EVENT, {
      detail: payload,
    }),
  );
}