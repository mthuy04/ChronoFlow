"use client";

import { useCallback, useEffect, useState } from "react";

interface WeeklyInsightResponse {
  success: boolean;
  insight?: {
    id: string;
    userId: string;
    weekLabel: string;
    alignmentScore: number;
    completedCount: number;
    totalCount: number;
    deepWorkCount: number;
    recommendation: string;
    summary: string;
    createdAt: string;
  };
  metrics?: {
    alignmentScore: number;
    deepWorkCount: number;
    totalCount: number;
    completedCount: number;
  };
  message?: string;
}

export function useInsights() {
  const [insight, setInsight] = useState<WeeklyInsightResponse["insight"]>();
  const [metrics, setMetrics] = useState<WeeklyInsightResponse["metrics"]>();
  const [isReady, setIsReady] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    const response = await fetch("/api/insights", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      setIsUnauthorized(true);
      setError(null);
      setIsReady(true);
      return;
    }

    const data: WeeklyInsightResponse = await response.json();

    if (!response.ok || !data.success) {
      setError(data.message || "Failed to load insights.");
      setIsReady(true);
      return;
    }

    setInsight(data.insight);
    setMetrics(data.metrics);
    setIsUnauthorized(false);
    setError(null);
    setIsReady(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (!isMounted) return;
        await fetchInsights();
      } catch {
        if (!isMounted) return;
        setError("Something went wrong while loading insights.");
        setIsReady(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchInsights]);

  return {
    insight,
    metrics,
    isReady,
    isUnauthorized,
    error,
    fetchInsights,
  };
}