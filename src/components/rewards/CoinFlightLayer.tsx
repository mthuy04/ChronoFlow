"use client";

import { Coins } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  COIN_LANDED_EVENT,
  COIN_REWARD_EVENT,
  emitCoinLanded,
  type CoinLandedPayload,
  type CoinRewardPayload,
} from "@/lib/coin-reward-events";

type FlyingCoin = {
  id: string;
  rewardId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delayMs: number;
  durationMs: number;
  rotateDeg: number;
};

type RewardTracker = {
  remaining: number;
  amount: number;
  nextBalance?: number;
};

const COIN_SIZE = 28;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildRewardId() {
  return `reward-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildCoinId(rewardId: string, index: number) {
  return `${rewardId}-coin-${index}`;
}

export default function CoinFlightLayer() {
  const [coins, setCoins] = useState<FlyingCoin[]>([]);
  const rewardTrackerRef = useRef<Record<string, RewardTracker>>({});

  useEffect(() => {
    const handleReward = (event: Event) => {
      const customEvent = event as CustomEvent<CoinRewardPayload>;
      const { sourceRect, amount, nextBalance } = customEvent.detail;

      const targetElement = document.querySelector<HTMLElement>(
        "[data-coin-target='true']",
      );

      if (!targetElement) {
        emitCoinLanded({ amount, nextBalance });
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();

      const startX = sourceRect.left + sourceRect.width / 2;
      const startY = sourceRect.top + sourceRect.height / 2;

      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;

      const rewardId = buildRewardId();
      const particleCount = Math.min(8, Math.max(5, Math.ceil(amount / 5)));

      rewardTrackerRef.current[rewardId] = {
        remaining: particleCount,
        amount,
        nextBalance,
      };

      const nextCoins: FlyingCoin[] = Array.from(
        { length: particleCount },
        (_, index) => ({
          id: buildCoinId(rewardId, index),
          rewardId,
          startX: startX + randomBetween(-18, 18),
          startY: startY + randomBetween(-12, 12),
          endX: endX + randomBetween(-8, 8),
          endY: endY + randomBetween(-8, 8),
          delayMs: index * 55,
          durationMs: 820 + index * 35,
          rotateDeg: randomBetween(-120, 120),
        }),
      );

      setCoins((current) => [...current, ...nextCoins]);
    };

    window.addEventListener(COIN_REWARD_EVENT, handleReward as EventListener);

    return () => {
      window.removeEventListener(
        COIN_REWARD_EVENT,
        handleReward as EventListener,
      );
    };
  }, []);

  const handleCoinAnimationEnd = (coin: FlyingCoin) => {
    setCoins((current) => current.filter((item) => item.id !== coin.id));

    const tracker = rewardTrackerRef.current[coin.rewardId];
    if (!tracker) return;

    tracker.remaining -= 1;

    if (tracker.remaining <= 0) {
      const payload: CoinLandedPayload = {
        amount: tracker.amount,
        nextBalance: tracker.nextBalance,
      };

      delete rewardTrackerRef.current[coin.rewardId];
      emitCoinLanded(payload);
    }
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[1200] overflow-hidden">
        {coins.map((coin) => {
          const style: CSSProperties = {
            left: `${coin.startX - COIN_SIZE / 2}px`,
            top: `${coin.startY - COIN_SIZE / 2}px`,
            animationDelay: `${coin.delayMs}ms`,
            animationDuration: `${coin.durationMs}ms`,
            ["--cf-x" as string]: `${coin.endX - coin.startX}px`,
            ["--cf-y" as string]: `${coin.endY - coin.startY}px`,
            ["--cf-rotate" as string]: `${coin.rotateDeg}deg`,
          };

          return (
            <div
              key={coin.id}
              onAnimationEnd={() => handleCoinAnimationEnd(coin)}
              style={style}
              className="cf-flying-coin absolute grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,#FFD166_0%,#FFB703_100%)] text-white shadow-[0_10px_24px_rgba(255,183,3,0.32)]"
            >
              <Coins className="h-4 w-4" />
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .cf-flying-coin {
          animation-name: chronoflow-coin-fly;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }

        @keyframes chronoflow-coin-fly {
          0% {
            transform: translate(0px, 0px) scale(0.65) rotate(0deg);
            opacity: 0;
          }

          12% {
            opacity: 1;
          }

          28% {
            transform: translate(calc(var(--cf-x) / 6), -42px) scale(1.08)
              rotate(calc(var(--cf-rotate) / 2));
            opacity: 1;
          }

          100% {
            transform: translate(var(--cf-x), var(--cf-y)) scale(0.45)
              rotate(var(--cf-rotate));
            opacity: 0.92;
          }
        }

        @keyframes chronoflow-coin-pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 10px 24px rgba(255, 193, 7, 0.1);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 14px 32px rgba(255, 193, 7, 0.26);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 10px 24px rgba(255, 193, 7, 0.1);
          }
        }

        .cf-coin-badge-pulse {
          animation: chronoflow-coin-pulse 0.55s ease;
        }
      `}</style>
    </>
  );
}