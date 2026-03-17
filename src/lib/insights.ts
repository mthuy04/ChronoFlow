import type { Task } from "@/types/task";
import type { Chronotype } from "@/types/chronotype";
import { getChronotypeWindows } from "./planner";

export interface WeeklyInsight {
  alignmentScore: number;
  completedCount: number;
  totalCount: number;
  deepWorkCount: number;
  recommendation: string;
  summary: string;
}

export function calculateAlignmentScore(tasks: Task[]): number {
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter((task) => task.completed).length;
  const baseScore = 60;
  const bonus = completedTasks * 8;

  return Math.min(95, baseScore + bonus);
}

export function countDeepWorkTasks(tasks: Task[]): number {
  return tasks.filter(
    (task) => task.type === "Deep Work" || task.type === "Study"
  ).length;
}

export function generateWeeklyInsight(
  tasks: Task[],
  chronotype: Chronotype
): WeeklyInsight {
  const alignmentScore = calculateAlignmentScore(tasks);
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const deepWorkCount = countDeepWorkTasks(tasks);

  return {
    alignmentScore,
    completedCount,
    totalCount,
    deepWorkCount,
    recommendation: getRecommendation(tasks, chronotype),
    summary: getSummary(tasks, chronotype),
  };
}

export function getRecommendation(
  tasks: Task[],
  chronotype: Chronotype
): string {
  const windows = getChronotypeWindows(chronotype);
  const incompleteHighPriority = tasks.filter(
    (task) => task.priority === "High" && !task.completed
  );

  if (tasks.length === 0) {
    return "Start by adding one meaningful task to your planner so ChronoFlow can begin learning your rhythm.";
  }

  if (incompleteHighPriority.length > 0) {
    return `Move your most important unfinished work into your strongest window (${windows.peak}) next week.`;
  }

  if (alignmentLooksGood(tasks, chronotype)) {
    return "You’re protecting your stronger windows well. Keep reserving them for study and deeper work.";
  }

  return `Try shifting lighter admin or routine tasks into ${windows.medium} so your peak hours stay protected.`;
}

export function getSummary(tasks: Task[], chronotype: Chronotype): string {
  const windows = getChronotypeWindows(chronotype);

  if (tasks.length === 0) {
    return "No activity yet. Your reflection will become richer once tasks are added and completed.";
  }

  const completed = tasks.filter((task) => task.completed).length;

  return `You completed ${completed} out of ${tasks.length} tasks this week. Your best planning opportunity remains your peak window: ${windows.peak}.`;
}

export function alignmentLooksGood(
  tasks: Task[],
  chronotype: Chronotype
): boolean {
  const windows = getChronotypeWindows(chronotype);

  const deepTasks = tasks.filter(
    (task) => task.type === "Deep Work" || task.type === "Study"
  );

  if (deepTasks.length === 0) return false;

  const alignedDeepTasks = deepTasks.filter(
    (task) => task.scheduledTime === windows.peak
  );

  return alignedDeepTasks.length / deepTasks.length >= 0.6;
}