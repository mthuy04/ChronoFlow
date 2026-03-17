"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Chronotype } from "@/types/chronotype";
import { CHRONOTYPES } from "@/data/chronotypes";

interface ProfileResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    studentId?: string | null;
    role: string;
    chronotype?: string | null;
    targetSleepTime?: string | null;
    targetWakeTime?: string | null;
    image?: string | null;
    createdAt?: string;
  };
  message?: string;
}

interface AssessmentPayload {
  lionScore: number;
  bearScore: number;
  wolfScore: number;
  dolphinScore: number;
}

interface AssessmentResponse {
  success: boolean;
  message?: string;
  chronotype?: Chronotype;
  resultId?: string;
}

export function useChronotype() {
  const [chronotype, setChronotypeState] = useState<Chronotype | null>(null);
  const [profile, setProfile] = useState<ProfileResponse["user"] | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const response = await fetch("/api/profile", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      setIsUnauthorized(true);
      setChronotypeState(null);
      setProfile(null);
      setError(null);
      setIsReady(true);
      return;
    }

    const data: ProfileResponse = await response.json();

    if (!response.ok || !data.success) {
      setError(data.message || "Failed to fetch profile.");
      setIsReady(true);
      return;
    }

    const resolvedChronotype =
      (data.user?.chronotype as Chronotype | null | undefined) ?? null;

    setProfile(data.user ?? null);
    setChronotypeState(resolvedChronotype);
    setIsUnauthorized(false);
    setError(null);
    setIsReady(true);
  }, []);

  const submitAssessment = useCallback(
    async (payload: AssessmentPayload) => {
      const response = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data: AssessmentResponse = await response.json();

      if (!response.ok || !data.success || !data.chronotype) {
        throw new Error(data.message || "Failed to submit assessment.");
      }

      setChronotypeState(data.chronotype);
      await fetchProfile();

      return data.chronotype;
    },
    [fetchProfile]
  );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (!isMounted) return;
        await fetchProfile();
      } catch {
        if (!isMounted) return;
        setError("Something went wrong while loading profile.");
        setIsReady(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  const chronotypeInfo = useMemo(() => {
    if (!chronotype) return null;
    return CHRONOTYPES[chronotype];
  }, [chronotype]);

  return {
    chronotype,
    chronotypeInfo,
    hasChronotype: !!chronotype,
    profile,
    isReady,
    isUnauthorized,
    error,
    fetchProfile,
    submitAssessment,
  };
}