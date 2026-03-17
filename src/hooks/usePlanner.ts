"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Chronotype } from "@/types/chronotype";
import type { Task, TaskType, Priority } from "@/types/task";
import { createTask, sortTasksByWindow } from "@/lib/planner";

interface CreateTaskInput {
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  deadline: string;
}

interface TasksResponse {
  success: boolean;
  tasks?: Array<{
    id: string;
    name: string;
    type: string;
    priority: string;
    duration: string;
    deadline: string | null;
    scheduledTime: string;
    explanation: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  message?: string;
}

function mapApiTaskType(type: string): TaskType {
  switch (type) {
    case "DEEP_WORK":
      return "Deep Work";
    case "STUDY":
      return "Study";
    case "CREATIVE":
      return "Creative";
    case "ADMIN":
      return "Admin";
    case "ROUTINE":
      return "Routine";
    case "PERSONAL":
      return "Personal";
    default:
      return "Personal";
  }
}

function mapApiPriority(priority: string): Priority {
  switch (priority) {
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    case "LOW":
      return "Low";
    default:
      return "Medium";
  }
}

function mapUiTaskType(type: TaskType) {
  switch (type) {
    case "Deep Work":
      return "DEEP_WORK";
    case "Study":
      return "STUDY";
    case "Creative":
      return "CREATIVE";
    case "Admin":
      return "ADMIN";
    case "Routine":
      return "ROUTINE";
    case "Personal":
      return "PERSONAL";
  }
}

function mapUiPriority(priority: Priority) {
  switch (priority) {
    case "High":
      return "HIGH";
    case "Medium":
      return "MEDIUM";
    case "Low":
      return "LOW";
  }
}

function normalizeTask(task: NonNullable<TasksResponse["tasks"]>[number]): Task {
  return {
    id: task.id,
    name: task.name,
    type: mapApiTaskType(task.type),
    priority: mapApiPriority(task.priority),
    duration: task.duration,
    deadline: task.deadline ?? "No deadline",
    scheduledTime: task.scheduledTime,
    explanation: task.explanation,
    completed: task.completed,
  };
}

export function usePlanner(chronotype: Chronotype | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    const response = await fetch("/api/tasks", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      setIsUnauthorized(true);
      setTasks([]);
      setError(null);
      setIsReady(true);
      return;
    }

    const data: TasksResponse = await response.json();

    if (!response.ok || !data.success || !data.tasks) {
      setError(data.message || "Failed to load tasks.");
      setIsReady(true);
      return;
    }

    setTasks(data.tasks.map(normalizeTask));
    setIsUnauthorized(false);
    setError(null);
    setIsReady(true);
  }, []);

  const addTask = useCallback(
    async (input: CreateTaskInput) => {
      if (!chronotype) return;

      const taskDraft = createTask({
        ...input,
        chronotype,
      });

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: taskDraft.name,
          type: mapUiTaskType(taskDraft.type),
          priority: mapUiPriority(taskDraft.priority),
          duration: taskDraft.duration,
          deadline:
            taskDraft.deadline === "No deadline" ? null : taskDraft.deadline,
          scheduledTime: taskDraft.scheduledTime,
          explanation: taskDraft.explanation,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create task.");
      }

      await fetchTasks();
    },
    [chronotype, fetchTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete task.");
      }

      await fetchTasks();
    },
    [fetchTasks]
  );

  const toggleTaskComplete = useCallback(
    async (taskId: string) => {
      const task = tasks.find((item) => item.id === taskId);
      if (!task) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update task.");
      }

      await fetchTasks();
    },
    [tasks, fetchTasks]
  );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (!isMounted) return;
        await fetchTasks();
      } catch {
        if (!isMounted) return;
        setError("Something went wrong while loading tasks.");
        setIsReady(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchTasks]);

  const sortedTasks = useMemo(() => sortTasksByWindow(tasks), [tasks]);
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );
  const incompleteTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  return {
    tasks,
    sortedTasks,
    completedTasks,
    incompleteTasks,
    isReady,
    isUnauthorized,
    error,
    fetchTasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
  };
}