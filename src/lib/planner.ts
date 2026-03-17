import type { Chronotype } from "@/types/chronotype";
import type { Task, TaskType, Priority } from "@/types/task";

export interface PlannerWindows {
  peak: string;
  medium: string;
  rest: string;
}

const CHRONOTYPE_WINDOWS: Record<Chronotype, PlannerWindows> = {
  Lion: {
    peak: "8:00 AM - 12:00 PM",
    medium: "1:00 PM - 4:00 PM",
    rest: "4:00 PM onwards",
  },
  Bear: {
    peak: "10:00 AM - 2:00 PM",
    medium: "3:00 PM - 6:00 PM",
    rest: "7:00 PM onwards",
  },
  Wolf: {
    peak: "3:00 PM - 7:00 PM",
    medium: "11:00 AM - 3:00 PM",
    rest: "8:00 AM - 11:00 AM",
  },
  Dolphin: {
    peak: "2:00 PM - 6:00 PM",
    medium: "10:00 AM - 2:00 PM",
    rest: "7:00 PM onwards",
  },
};

export function getChronotypeWindows(chronotype: Chronotype): PlannerWindows {
  return CHRONOTYPE_WINDOWS[chronotype];
}

export function getSuggestedWindow(
  chronotype: Chronotype,
  taskType: TaskType
): string {
  const windows = getChronotypeWindows(chronotype);

  if (taskType === "Deep Work" || taskType === "Study") {
    return windows.peak;
  }

  if (taskType === "Creative") {
    return windows.medium;
  }

  return windows.medium;
}

export function getTaskExplanation(
  taskType: TaskType,
  chronotype: Chronotype
): string {
  const windows = getChronotypeWindows(chronotype);

  if (taskType === "Deep Work" || taskType === "Study") {
    return `Placed inside your strongest focus window (${windows.peak}) for deeper concentration.`;
  }

  if (taskType === "Creative") {
    return `Placed in a medium-energy zone (${windows.medium}) where flexible thinking often feels easier.`;
  }

  return `Placed in a lighter window (${windows.medium}) to protect your best hours for higher-cognitive tasks.`;
}

export function createTask(params: {
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  deadline: string;
  chronotype: Chronotype;
}): Task {
  const { name, type, priority, duration, deadline, chronotype } = params;

  return {
    id: generateTaskId(),
    name,
    type,
    priority,
    duration,
    deadline: deadline || "No deadline",
    scheduledTime: getSuggestedWindow(chronotype, type),
    explanation: getTaskExplanation(type, chronotype),
    completed: false,
  };
}

export function sortTasksByWindow(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
}

function generateTaskId(): string {
  return Math.random().toString(36).slice(2, 10);
}