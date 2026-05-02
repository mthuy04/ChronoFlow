export type PlannerChronotypeKey =
  | "LION"
  | "BEAR"
  | "WOLF"
  | "DOLPHIN"
  | "UNKNOWN";

export type PlannerTaskType =
  | "DEEP_WORK"
  | "ADMIN"
  | "STUDY"
  | "MEETING"
  | "CREATIVE"
  | "PERSONAL";

export type PlannerPriority = "LOW" | "MEDIUM" | "HIGH";

export type PlannerTask = {
  id: string;
  name: string;
  type: PlannerTaskType;
  priority: PlannerPriority;
  duration: string;
  durationMinutes: number;
  deadline: string | null;
  scheduledTime: string;
  scheduledDate: string | null;
  startTime: string | null;
  endTime: string | null;
  explanation: string;
  completed: boolean;
  isBacklog: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlannerChronotype = {
  key: PlannerChronotypeKey;
  label: string | null;
  focusWindow: string | null;
  secondaryWindow: string | null;
  guidance: string;
};

export type PlannerApiResponse = {
  success: true;
  user: {
    id: string;
    name: string;
    email: string;
  };
  chronotype: PlannerChronotype;
  tasks: PlannerTask[];
};

export type ViewMode = "week" | "day";

export type TaskFilter = "ALL" | "TODAY" | "BACKLOG" | "DEEP_WORK" | "DONE";

export type SmartSuggestion = {
  id: string;
  taskId: string;
  title: string;
  description: string;
  suggestedWindow: string;
  targetDate: string;
};

export type TaskPatchPayload = {
  name?: string;
  type?: PlannerTaskType;
  priority?: PlannerPriority;
  duration?: string;
  deadline?: string | null;
  scheduledTime?: string;
  explanation?: string;
  completed?: boolean;
};

export type TaskFormState = {
  name: string;
  type: PlannerTaskType;
  priority: PlannerPriority;
  date: string;
  startTime: string;
  durationMinutes: string;
  deadline: string;
  explanation: string;
  backlog: boolean;
};

export type WeekDayItem = {
  dateKey: string;
  weekday: string;
  dateLabel: string;
};