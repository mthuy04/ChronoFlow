export type AssessmentAnswers = Record<string, string>;

export type ChronotypeScores = {
  lionScore: number;
  bearScore: number;
  wolfScore: number;
  dolphinScore: number;
};

export type ChronotypeResultType = {
  chronotype: "LION" | "BEAR" | "WOLF" | "DOLPHIN";
  scores: ChronotypeScores;
};

export function calculateChronotype(
  answers: AssessmentAnswers
): ChronotypeResultType {
  const scores: ChronotypeScores = {
    lionScore: 0,
    bearScore: 0,
    wolfScore: 0,
    dolphinScore: 0,
  };

  for (const value of Object.values(answers)) {
    if (["early", "morning", "sleep_early", "burnout_early"].includes(value)) {
      scores.lionScore += 2;
    }

    if (
      ["midmorning", "midday", "sleep_normal", "steady_but_dip"].includes(value)
    ) {
      scores.bearScore += 2;
    }

    if (
      ["afternoon", "evening", "night", "sleep_late", "late_focus"].includes(
        value
      )
    ) {
      scores.wolfScore += 2;
    }

    if (["irregular", "sleep_irregular", "inconsistent"].includes(value)) {
      scores.dolphinScore += 2;
    }

    if (value === "late_morning") scores.lionScore += 1;
    if (value === "afternoon") scores.bearScore += 1;
    if (value === "evening") scores.wolfScore += 1;
    if (value === "irregular") scores.dolphinScore += 1;
  }

  const ranking = [
    { key: "LION", score: scores.lionScore },
    { key: "BEAR", score: scores.bearScore },
    { key: "WOLF", score: scores.wolfScore },
    { key: "DOLPHIN", score: scores.dolphinScore },
  ].sort((a, b) => b.score - a.score);

  return {
    chronotype: ranking[0].key as ChronotypeResultType["chronotype"],
    scores,
  };
}