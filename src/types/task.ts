export type TaskType =
  | "Deep Work"
  | "Study"
  | "Creative"
  | "Admin"
  | "Routine"
  | "Personal";

export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  deadline: string;
  scheduledTime: string;
  explanation: string;
  completed: boolean;
}