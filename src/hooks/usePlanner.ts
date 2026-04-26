"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Chronotype } from "@/types/chronotype";
import type { Task, TaskType, Priority } from "@/types/task";

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

function getChronotypeKey(chronotype: Chronotype | null) {
  if (!chronotype) return "BEAR";

  const raw = String(chronotype).toUpperCase();

  if (raw.includes("LION") || raw.includes("SƯ")) return "LION";
  if (raw.includes("WOLF") || raw.includes("SÓI")) return "WOLF";
  if (raw.includes("DOLPHIN") || raw.includes("CÁ")) return "DOLPHIN";

  return "BEAR";
}

function getSuggestedWindow(chronotype: Chronotype | null, type: TaskType) {
  const key = getChronotypeKey(chronotype);

  const suggestions: Record<
    "LION" | "BEAR" | "WOLF" | "DOLPHIN",
    Record<
      TaskType,
      {
        scheduledTime: string;
        explanation: string;
      }
    >
  > = {
    LION: {
      "Deep Work": {
        scheduledTime: "07:00 - 09:00",
        explanation: "Buổi sáng là giờ vàng của bạn, hợp cho việc khó và cần chiều sâu.",
      },
      Study: {
        scheduledTime: "08:00 - 10:00",
        explanation: "Khung sáng rất hợp để học và xử lý nội dung nặng.",
      },
      Creative: {
        scheduledTime: "09:00 - 10:30",
        explanation: "Sáng muộn vẫn là lúc đầu óc rõ để làm việc sáng tạo.",
      },
      Admin: {
        scheduledTime: "13:00 - 14:00",
        explanation: "Buổi chiều hợp hơn cho email, admin và follow-up.",
      },
      Routine: {
        scheduledTime: "15:00 - 16:00",
        explanation: "Routine nên đặt vào khung năng lượng mềm hơn.",
      },
      Personal: {
        scheduledTime: "19:00 - 20:00",
        explanation: "Buổi tối nên dành cho việc cá nhân nhẹ và phục hồi.",
      },
    },
    BEAR: {
      "Deep Work": {
        scheduledTime: "09:00 - 11:00",
        explanation: "Đây là khung ổn định nhất để làm việc quan trọng.",
      },
      Study: {
        scheduledTime: "09:30 - 11:30",
        explanation: "Buổi sáng giữa ngày khá hợp để học tập tập trung.",
      },
      Creative: {
        scheduledTime: "10:00 - 11:30",
        explanation: "Sáng vẫn đủ ổn định để làm việc sáng tạo.",
      },
      Admin: {
        scheduledTime: "14:00 - 15:00",
        explanation: "Đầu chiều phù hợp hơn cho việc nhẹ, email và họp.",
      },
      Routine: {
        scheduledTime: "16:00 - 17:00",
        explanation: "Task lặp lại nên đi cuối chiều để giữ giờ đẹp cho việc khó.",
      },
      Personal: {
        scheduledTime: "19:00 - 20:00",
        explanation: "Buổi tối hợp cho sinh hoạt hoặc task cá nhân nhẹ.",
      },
    },
    WOLF: {
      "Deep Work": {
        scheduledTime: "19:00 - 21:00",
        explanation: "Chiều tối là khung bạn thường lên nhịp tốt hơn cho việc khó.",
      },
      Study: {
        scheduledTime: "18:30 - 20:30",
        explanation: "Khung muộn hơn sẽ hợp cho học tập hơn là sáng sớm.",
      },
      Creative: {
        scheduledTime: "20:00 - 21:30",
        explanation: "Sáng tạo thường bùng tốt hơn vào cuối ngày.",
      },
      Admin: {
        scheduledTime: "09:00 - 10:00",
        explanation: "Buổi sáng nên để cho việc nhẹ, setup và email.",
      },
      Routine: {
        scheduledTime: "11:00 - 12:00",
        explanation: "Routine nên đi trước khi vào khung mạnh cuối ngày.",
      },
      Personal: {
        scheduledTime: "22:00 - 23:00",
        explanation: "Giữ việc cá nhân nhẹ sau block chính, nhưng đừng quá khuya.",
      },
    },
    DOLPHIN: {
      "Deep Work": {
        scheduledTime: "10:00 - 11:30",
        explanation: "Dùng khung đầu óc rõ nhất cho deep work, ưu tiên block ngắn.",
      },
      Study: {
        scheduledTime: "10:30 - 12:00",
        explanation: "Học theo block ngắn sẽ bền hơn lịch quá cứng.",
      },
      Creative: {
        scheduledTime: "16:30 - 18:00",
        explanation: "Chiều muộn có thể phù hợp hơn nếu sáng chưa thật sự ổn định.",
      },
      Admin: {
        scheduledTime: "13:30 - 14:30",
        explanation: "Việc nhẹ nên gom vào khung mềm hơn để bảo vệ focus block.",
      },
      Routine: {
        scheduledTime: "15:00 - 16:00",
        explanation: "Routine hợp với block ngắn và rõ ràng hơn.",
      },
      Personal: {
        scheduledTime: "19:00 - 20:00",
        explanation: "Buổi tối nên ưu tiên môi trường dịu và nhịp nhẹ hơn.",
      },
    },
  };

  return suggestions[key][type];
}

function createTaskLocal(input: CreateTaskInput & { chronotype: Chronotype | null }): Task {
  const suggestion = getSuggestedWindow(input.chronotype, input.type);

  return {
    id: "",
    name: input.name.trim(),
    type: input.type,
    priority: input.priority,
    duration: input.duration,
    deadline: input.deadline?.trim() ? input.deadline : "No deadline",
    scheduledTime: suggestion.scheduledTime,
    explanation: suggestion.explanation,
    completed: false,
  };
}

function getStartMinutes(scheduledTime: string) {
  const match = scheduledTime.match(/^(\d{2}):(\d{2})/);
  if (!match) return Number.MAX_SAFE_INTEGER;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
}

function sortTasksByWindowLocal(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    return getStartMinutes(a.scheduledTime) - getStartMinutes(b.scheduledTime);
  });
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

      const taskDraft = createTaskLocal({
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
          deadline: taskDraft.deadline === "No deadline" ? null : taskDraft.deadline,
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

  const sortedTasks = useMemo(() => sortTasksByWindowLocal(tasks), [tasks]);
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