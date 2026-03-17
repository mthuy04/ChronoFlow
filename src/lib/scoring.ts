import type { Chronotype } from "@/types/chronotype";
import type { QuizQuestion } from "@/data/quizQuestions";

export interface QuizAnswer {
  questionIndex: number;
  selectedType: Chronotype;
}

export interface ScoringResult {
  chronotype: Chronotype;
  scores: Record<Chronotype, number>;
}

export function createEmptyScores(): Record<Chronotype, number> {
  return {
    Lion: 0,
    Bear: 0,
    Wolf: 0,
    Dolphin: 0,
  };
}

export function scoreQuizAnswers(answers: QuizAnswer[]): ScoringResult {
  const scores = createEmptyScores();

  answers.forEach((answer) => {
    scores[answer.selectedType] += 1;
  });

  const chronotype = getWinningChronotype(scores);

  return {
    chronotype,
    scores,
  };
}

export function getWinningChronotype(
  scores: Record<Chronotype, number>
): Chronotype {
  return (Object.keys(scores) as Chronotype[]).reduce((winner, current) => {
    return scores[current] > scores[winner] ? current : winner;
  });
}

export function calculateProgress(
  currentStep: number,
  totalQuestions: number
): number {
  if (totalQuestions <= 0) return 0;
  return Math.round(((currentStep + 1) / totalQuestions) * 100);
}

export function isLastQuestion(
  currentStep: number,
  questions: QuizQuestion[]
): boolean {
  return currentStep === questions.length - 1;
}