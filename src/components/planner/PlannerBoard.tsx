"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  Coins,
  Layers3,
  ListFilter,
  Loader2,
  Moon,
  Plus,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import AddTaskDrawer from "./AddTaskDrawer";
import BacklogCard from "./BacklogCard";
import CalendarDayView from "./CalendarDayView";
import CalendarWeekView from "./CalendarWeekView";
import PlannerHero from "./PlannerHero";
import PlannerToast, { type PlannerToastTone } from "./PlannerToast";
import PlannerUndoBar from "./PlannerUndoBar";
import TaskDetailDrawer from "./TaskDetailDrawer";

export type PlannerChronotype = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

export type PlannerTaskType =
  | "DEEP_WORK"
  | "STUDY"
  | "CREATIVE"
  | "ADMIN"
  | "ROUTINE"
  | "PERSONAL";

export type PlannerPriority = "HIGH" | "MEDIUM" | "LOW";

export type PlannerConflictType =
  | "OVERLAP"
  | "MISALIGNED_FOCUS"
  | "OVERLOADED_DAY";

export interface PlannerTask {
  id: string;
  name: string;
  type: PlannerTaskType;
  priority: PlannerPriority;
  duration: string;
  deadline: string | null;
  scheduledTime: string;
  explanation: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlannerInsight {
  id: string;
  weekLabel: string;
  alignmentScore: number;
  completedCount: number;
  totalCount: number;
  deepWorkCount: number;
  recommendation: string;
  summary: string;
  createdAt: string;
}

export interface PlannerCalendarEvent {
  id: string;
  title: string;
  dateKey: string;
  start: string;
  end: string;
  type: PlannerTaskType;
  priority: PlannerPriority;
  completed: boolean;
  explanation: string;
  duration: string;
  deadline: string | null;
  task: PlannerTask;
}

export interface PlannerConflict {
  type: PlannerConflictType;
  label: string;
  description: string;
}

type ViewMode = "day" | "week";
type TaskFilter = "ALL" | "TODAY" | "UNSCHEDULED" | "DEEP" | "COMPLETED";

type AutoScheduleResponse = {
  success?: boolean;
  updatedTasks?: PlannerTask[];
  skippedTasks?: Array<{
    id: string;
    name: string;
    reason: string;
  }>;
  warnings?: Array<{
    taskId: string;
    taskName: string;
    warning: string;
  }>;
  error?: string;
};

type SmartSuggestion = {
  id: string;
  title: string;
  description: string;
  task: PlannerTask;
  suggestedStart: string;
  dateKey: string;
  tone: "purple" | "blue" | "orange" | "green";
};

type DropTarget = {
  taskId: string;
  dateKey: string;
  start: string;
};

type UndoAction = {
  message: string;
  taskId: string;
  previousScheduledTime: string;
};

const CHRONOTYPE_META: Record<
  PlannerChronotype,
  {
    label: string;
    subtitle: string;
    emoji: string;
    primaryWindow: string;
    supportWindow: string;
    energyLine: string;
    note: string;
  }
> = {
  LION: {
    label: "Sư tử",
    subtitle: "Mạnh vào buổi sáng",
    emoji: "🦁",
    primaryWindow: "07:00 - 10:00",
    supportWindow: "13:00 - 16:00",
    energyLine: "Đầu ngày sáng nhất, nên bảo vệ giờ vàng cho việc khó.",
    note: "Tập trung mạnh đầu ngày, chiều nên giảm tải dần.",
  },
  BEAR: {
    label: "Gấu",
    subtitle: "Nhịp cân bằng ban ngày",
    emoji: "🐻",
    primaryWindow: "09:00 - 12:00",
    supportWindow: "14:00 - 16:00",
    energyLine: "Ổn định hơn trong khung giờ hành chính, dễ vào nhịp đều.",
    note: "Hợp với lịch ban ngày nhưng vẫn cần chặn block tập trung.",
  },
  WOLF: {
    label: "Sói",
    subtitle: "Lên nhịp tốt hơn về chiều tối",
    emoji: "🐺",
    primaryWindow: "14:30 - 18:00",
    supportWindow: "19:00 - 21:00",
    energyLine: "Khởi động chậm hơn buổi sáng, mạnh hơn về cuối ngày.",
    note: "Đừng lãng phí cuối chiều cho việc nhẹ nếu đó là giờ mạnh nhất.",
  },
  DOLPHIN: {
    label: "Cá heo",
    subtitle: "Nhạy giấc ngủ, hợp block gọn",
    emoji: "🐬",
    primaryWindow: "10:00 - 11:30",
    supportWindow: "16:00 - 18:00",
    energyLine: "Năng lượng cần được bảo vệ bằng block ngắn, rõ và ít nhiễu.",
    note: "Ưu tiên lịch mềm hơn, có đệm và khoảng nghỉ hợp lý.",
  },
};

const TASK_FILTERS: Array<{
  key: TaskFilter;
  label: string;
}> = [
  { key: "ALL", label: "Tất cả" },
  { key: "TODAY", label: "Hôm nay" },
  { key: "UNSCHEDULED", label: "Chưa gắn lịch" },
  { key: "DEEP", label: "Deep work" },
  { key: "COMPLETED", label: "Đã xong" },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function parseMinutesFromDuration(duration: string) {
  const numeric = Number(duration.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 60;
}

function timeToMinutes(time: string) {
  const [hourRaw = "0", minuteRaw = "0"] = time.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;

  return hour * 60 + minute;
}

function minutesToTime(totalMinutes: number) {
  const safeTotal = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hour = Math.floor(safeTotal / 60);
  const minute = safeTotal % 60;

  return `${pad(hour)}:${pad(minute)}`;
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

function parseScheduledTime(task: PlannerTask): PlannerCalendarEvent | null {
  const raw = String(task.scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");

  if (pipeParts.length === 3) {
    const [dateKey, start, end] = pipeParts;

    if (!dateKey || !start || !end) return null;

    return {
      id: task.id,
      title: task.name,
      dateKey,
      start,
      end,
      type: task.type,
      priority: task.priority,
      completed: task.completed,
      explanation: task.explanation,
      duration: task.duration,
      deadline: task.deadline,
      task,
    };
  }

  const match = raw.match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/,
  );

  if (match) {
    return {
      id: task.id,
      title: task.name,
      dateKey: match[1],
      start: match[2],
      end: match[3],
      type: task.type,
      priority: task.priority,
      completed: task.completed,
      explanation: task.explanation,
      duration: task.duration,
      deadline: task.deadline,
      task,
    };
  }

  const maybeDate = new Date(raw);

  if (!Number.isNaN(maybeDate.getTime())) {
    const dateKey = formatDateKey(maybeDate);
    const start = `${pad(maybeDate.getHours())}:${pad(maybeDate.getMinutes())}`;
    const end = addMinutesToTime(start, parseMinutesFromDuration(task.duration));

    return {
      id: task.id,
      title: task.name,
      dateKey,
      start,
      end,
      type: task.type,
      priority: task.priority,
      completed: task.completed,
      explanation: task.explanation,
      duration: task.duration,
      deadline: task.deadline,
      task,
    };
  }

  return null;
}

function getChronotypeWindows(chronotype: PlannerChronotype) {
  switch (chronotype) {
    case "LION":
      return {
        peakStart: "07:00",
        peakEnd: "10:00",
        supportStart: "13:00",
        supportEnd: "16:00",
      };
    case "WOLF":
      return {
        peakStart: "14:30",
        peakEnd: "18:00",
        supportStart: "19:00",
        supportEnd: "21:00",
      };
    case "DOLPHIN":
      return {
        peakStart: "10:00",
        peakEnd: "11:30",
        supportStart: "16:00",
        supportEnd: "18:00",
      };
    case "BEAR":
    default:
      return {
        peakStart: "09:00",
        peakEnd: "12:00",
        supportStart: "14:00",
        supportEnd: "16:00",
      };
  }
}

function buildWeekDates(selectedDate: Date) {
  const current = new Date(selectedDate);
  const day = current.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(current);
  monday.setDate(current.getDate() + mondayOffset);

  return Array.from({ length: 7 }).map((_, index) => {
    const next = new Date(monday);
    next.setDate(monday.getDate() + index);
    return next;
  });
}

function getDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function getWeekLabel(date: Date) {
  const weekDates = buildWeekDates(date);
  const first = weekDates[0];
  const last = weekDates[6];

  return `${pad(first.getDate())}/${pad(first.getMonth() + 1)} - ${pad(
    last.getDate(),
  )}/${pad(last.getMonth() + 1)}`;
}

function getTaskTypeLabel(type: PlannerTaskType) {
  switch (type) {
    case "DEEP_WORK":
      return "Deep work";
    case "STUDY":
      return "Học tập";
    case "CREATIVE":
      return "Sáng tạo";
    case "ADMIN":
      return "Admin";
    case "ROUTINE":
      return "Routine";
    case "PERSONAL":
      return "Cá nhân";
    default:
      return type;
  }
}

function isFocusType(type: PlannerTaskType) {
  return type === "DEEP_WORK" || type === "STUDY";
}

function isHeavyTask(type: PlannerTaskType) {
  return type === "DEEP_WORK" || type === "STUDY" || type === "CREATIVE";
}

function isTimeInsideWindow(time: string, start: string, end: string) {
  const valueMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  return valueMinutes >= startMinutes && valueMinutes < endMinutes;
}

function doEventsOverlap(first: PlannerCalendarEvent, second: PlannerCalendarEvent) {
  if (first.dateKey !== second.dateKey || first.id === second.id) return false;

  const firstStart = timeToMinutes(first.start);
  const firstEnd = timeToMinutes(first.end);
  const secondStart = timeToMinutes(second.start);
  const secondEnd = timeToMinutes(second.end);

  return firstStart < secondEnd && firstEnd > secondStart;
}

function buildScheduledTime(dateKey: string, start: string, duration: string) {
  const durationMinutes = parseMinutesFromDuration(duration);
  const end = addMinutesToTime(start, durationMinutes);

  return `${dateKey}|${start}|${end}`;
}

function getPrimaryStart(chronotype: PlannerChronotype) {
  switch (chronotype) {
    case "LION":
      return "07:30";
    case "WOLF":
      return "15:00";
    case "DOLPHIN":
      return "10:00";
    case "BEAR":
    default:
      return "09:00";
  }
}

function getSupportStart(chronotype: PlannerChronotype) {
  switch (chronotype) {
    case "LION":
      return "13:30";
    case "WOLF":
      return "19:00";
    case "DOLPHIN":
      return "16:00";
    case "BEAR":
    default:
      return "14:00";
  }
}

function getLoadMeta(minutes: number, taskCount: number) {
  if (minutes >= 420 || taskCount >= 6) {
    return {
      label: "Hơi dày",
      tone: "red" as const,
    };
  }

  if (minutes >= 240 || taskCount >= 4) {
    return {
      label: "Ổn định",
      tone: "orange" as const,
    };
  }

  return {
    label: "Thoáng",
    tone: "green" as const,
  };
}

function getDeadlineWarning(task: PlannerTask) {
  if (!task.deadline || task.completed) return null;

  const today = new Date();
  const deadline = new Date(task.deadline);

  if (Number.isNaN(deadline.getTime())) return null;

  const diffDays = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "Đã tới hoặc quá deadline";
  if (diffDays === 1) return "Còn 1 ngày tới deadline";
  if (diffDays <= 3) return `Còn ${diffDays} ngày tới deadline`;

  return null;
}

function getBufferSuggestion(event: PlannerCalendarEvent) {
  if (event.completed || !isHeavyTask(event.type)) return null;
  return "Nên nghỉ 10–15 phút sau block này.";
}

function buildConflictMap(
  events: PlannerCalendarEvent[],
  windows: ReturnType<typeof getChronotypeWindows>,
) {
  const map: Record<string, PlannerConflict[]> = {};

  const eventsByDate = events.reduce<Record<string, PlannerCalendarEvent[]>>(
    (acc, event) => {
      acc[event.dateKey] = [...(acc[event.dateKey] ?? []), event];
      return acc;
    },
    {},
  );

  events.forEach((event) => {
    const conflicts: PlannerConflict[] = [];
    const sameDayEvents = eventsByDate[event.dateKey] ?? [];
    const dayMinutes = sameDayEvents.reduce(
      (sum, item) => sum + parseMinutesFromDuration(item.duration),
      0,
    );
    const activeTaskCount = sameDayEvents.filter((item) => !item.completed).length;
    const hasOverlap = sameDayEvents.some((item) => doEventsOverlap(event, item));
    const bufferSuggestion = getBufferSuggestion(event);

    if (hasOverlap) {
      conflicts.push({
        type: "OVERLAP",
        label: "Trùng lịch",
        description: "Task này đang chồng thời gian với task khác.",
      });
    }

    if (
      !event.completed &&
      isFocusType(event.type) &&
      !isTimeInsideWindow(event.start, windows.peakStart, windows.peakEnd)
    ) {
      conflicts.push({
        type: "MISALIGNED_FOCUS",
        label: "Lệch peak",
        description: "Task tập trung đang nằm ngoài khung năng lượng mạnh.",
      });
    }

    if (bufferSuggestion) {
      conflicts.push({
        type: "OVERLOADED_DAY",
        label: "Cần buffer",
        description: bufferSuggestion,
      });
    }

    if (!event.completed && (dayMinutes >= 420 || activeTaskCount >= 6)) {
      conflicts.push({
        type: "OVERLOADED_DAY",
        label: "Ngày dày",
        description: "Tổng tải ngày này khá cao, nên cân nhắc dời bớt task.",
      });
    }

    map[event.id] = conflicts;
  });

  return map;
}

interface PlannerBoardProps {
  userName: string;
  chronotype: PlannerChronotype;
  initialTasks: PlannerTask[];
  latestInsight: PlannerInsight | null;
}

export default function PlannerBoard({
  userName,
  chronotype,
  initialTasks,
  latestInsight,
}: PlannerBoardProps) {
  const [tasks, setTasks] = useState<PlannerTask[]>(initialTasks);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PlannerTask | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("ALL");
  const [energyScore, setEnergyScore] = useState(70);
  const [energyNote, setEnergyNote] = useState("");
  const [isSavingEnergy, setIsSavingEnergy] = useState(false);
  const [energyMessage, setEnergyMessage] = useState("");
  const [reviewEnergy, setReviewEnergy] = useState(70);
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [updatingSuggestionId, setUpdatingSuggestionId] = useState<string | null>(
    null,
  );
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    tone: PlannerToastTone;
  }>({
    message: "",
    tone: "info",
  });
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);
  const [isUndoing, setIsUndoing] = useState(false);

  const meta = CHRONOTYPE_META[chronotype];
  const windows = getChronotypeWindows(chronotype);

  const scheduledEvents = useMemo(
    () =>
      tasks
        .map((task) => parseScheduledTime(task))
        .filter((event): event is PlannerCalendarEvent => event !== null),
    [tasks],
  );

  const conflictMap = useMemo(
    () => buildConflictMap(scheduledEvents, windows),
    [scheduledEvents, windows],
  );

  const backlogTasks = useMemo(
    () => tasks.filter((task) => !parseScheduledTime(task)),
    [tasks],
  );

  const selectedDateKey = formatDateKey(selectedDate);

  const dayEvents = useMemo(
    () =>
      scheduledEvents
        .filter((event) => event.dateKey === selectedDateKey)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [scheduledEvents, selectedDateKey],
  );

  const weekDates = useMemo(() => buildWeekDates(selectedDate), [selectedDate]);

  const weekEvents = useMemo(() => {
    const allowed = new Set(weekDates.map((date) => formatDateKey(date)));
    return scheduledEvents.filter((event) => allowed.has(event.dateKey));
  }, [scheduledEvents, weekDates]);

  const todayKey = formatDateKey(new Date());
  const todayEvents = scheduledEvents.filter((event) => event.dateKey === todayKey);
  const pendingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  const totalMinutesForSelectedDate = dayEvents.reduce(
    (sum, item) => sum + parseMinutesFromDuration(item.duration),
    0,
  );

  const selectedDateIsOverloaded =
    totalMinutesForSelectedDate >= 420 ||
    dayEvents.filter((item) => !item.completed).length >= 6;

  const deepWorkTasks = scheduledEvents.filter((event) => isFocusType(event.type));

  const alignedFocusTasks = deepWorkTasks.filter((event) =>
    isTimeInsideWindow(event.start, windows.peakStart, windows.peakEnd),
  );

  const focusScore =
    deepWorkTasks.length === 0
      ? 0
      : Math.round((alignedFocusTasks.length / deepWorkTasks.length) * 100);

  const completedToday = todayEvents.filter((event) => event.completed).length;

  const todayPlannedMinutes = todayEvents.reduce(
    (sum, item) => sum + parseMinutesFromDuration(item.duration),
    0,
  );

  const estimatedCoinsToday = todayEvents
    .filter((event) => event.completed)
    .reduce((sum, event) => {
      const minutes = parseMinutesFromDuration(event.duration);
      const base = Math.max(5, Math.floor(minutes / 10) * 2);
      const bonus =
        isFocusType(event.type) &&
        isTimeInsideWindow(event.start, windows.peakStart, windows.peakEnd)
          ? 5
          : 0;

      return sum + base + bonus;
    }, 0);

  const criticalConflictCount = scheduledEvents.reduce((sum, event) => {
    return sum + (conflictMap[event.id]?.length ? 1 : 0);
  }, 0);

  const smartSuggestions = useMemo<SmartSuggestion[]>(() => {
    const suggestions: SmartSuggestion[] = [];

    const misalignedFocus = scheduledEvents.filter(
      (event) =>
        !event.completed &&
        isFocusType(event.type) &&
        !isTimeInsideWindow(event.start, windows.peakStart, windows.peakEnd),
    );

    misalignedFocus.slice(0, 2).forEach((event) => {
      suggestions.push({
        id: `move-focus-${event.id}`,
        title: `Dời “${event.title}” vào peak window`,
        description:
          "Task tập trung đang nằm ngoài khung mạnh. Đưa task về giờ tốt hơn để giảm hao năng lượng.",
        task: event.task,
        suggestedStart: getPrimaryStart(chronotype),
        dateKey: event.dateKey,
        tone: "purple",
      });
    });

    backlogTasks
      .filter((task) => !task.completed && isFocusType(task.type))
      .slice(0, 2)
      .forEach((task) => {
        suggestions.push({
          id: `schedule-backlog-${task.id}`,
          title: `Gắn lịch cho “${task.name}”`,
          description:
            "Task quan trọng vẫn ở backlog. Hãy đưa vào calendar để tránh bị trôi việc.",
          task,
          suggestedStart: getPrimaryStart(chronotype),
          dateKey: selectedDateKey,
          tone: "blue",
        });
      });

    scheduledEvents
      .filter(
        (event) =>
          !event.completed &&
          (event.type === "ADMIN" || event.type === "ROUTINE") &&
          isTimeInsideWindow(event.start, windows.peakStart, windows.peakEnd),
      )
      .slice(0, 1)
      .forEach((event) => {
        suggestions.push({
          id: `move-light-${event.id}`,
          title: `Chuyển “${event.title}” sang khung phụ`,
          description:
            "Việc nhẹ đang chiếm peak window. Nên chuyển sang khung phụ để giữ giờ mạnh cho việc khó.",
          task: event.task,
          suggestedStart: getSupportStart(chronotype),
          dateKey: event.dateKey,
          tone: "orange",
        });
      });

    return suggestions.slice(0, 4);
  }, [
    backlogTasks,
    chronotype,
    scheduledEvents,
    selectedDateKey,
    windows.peakEnd,
    windows.peakStart,
  ]);

  const filteredTasks = useMemo(() => {
    if (taskFilter === "TODAY") return todayEvents.map((event) => event.task);
    if (taskFilter === "UNSCHEDULED") return backlogTasks;
    if (taskFilter === "DEEP") return tasks.filter((task) => isFocusType(task.type));
    if (taskFilter === "COMPLETED") return tasks.filter((task) => task.completed);
    return tasks;
  }, [backlogTasks, taskFilter, tasks, todayEvents]);

  function showToast(message: string, tone: PlannerToastTone = "info") {
    setToast({ message, tone });

    window.setTimeout(() => {
      setToast((current) =>
        current.message === message ? { message: "", tone: "info" } : current,
      );
    }, 3800);
  }

  async function handleCreateTask(nextTask: PlannerTask) {
    setTasks((prev) => [nextTask, ...prev]);
  }

  async function handleUpdateTask(updatedTask: PlannerTask) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );

    setSelectedTask((current) =>
      current?.id === updatedTask.id ? updatedTask : current,
    );
  }

  async function handleDeleteTask(taskId: string) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTask((current) => (current?.id === taskId ? null : current));
  }

  async function updateTaskSchedule(task: PlannerTask, dateKey: string, start: string) {
    const nextScheduledTime = buildScheduledTime(dateKey, start, task.duration);

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheduledTime: nextScheduledTime,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { task?: PlannerTask; error?: string }
      | null;

    if (!response.ok) {
      throw new Error(payload?.error || "Không thể cập nhật lịch task.");
    }

    const updatedTask: PlannerTask = {
      ...task,
      ...(payload?.task ?? {}),
      scheduledTime: payload?.task?.scheduledTime ?? nextScheduledTime,
    };

    await handleUpdateTask(updatedTask);
  }

  async function handleDropTask({ taskId, dateKey, start }: DropTarget) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      showToast("Không tìm thấy task để cập nhật lịch.", "error");
      return;
    }

    const previousScheduledTime = task.scheduledTime;

    try {
      setUpdatingTaskId(taskId);
      await updateTaskSchedule(task, dateKey, start);

      setUndoAction({
        taskId,
        previousScheduledTime,
        message: `Đã chuyển “${task.name}” sang ${dateKey} lúc ${start}.`,
      });

      showToast(`Đã chuyển “${task.name}” sang ${start}.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Không thể cập nhật lịch task.",
        "error",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function applySmartSuggestion(suggestion: SmartSuggestion) {
    const previousScheduledTime = suggestion.task.scheduledTime;

    try {
      setUpdatingSuggestionId(suggestion.id);

      await updateTaskSchedule(
        suggestion.task,
        suggestion.dateKey,
        suggestion.suggestedStart,
      );

      setUndoAction({
        taskId: suggestion.task.id,
        previousScheduledTime,
        message: `Đã áp dụng gợi ý cho “${suggestion.task.name}”.`,
      });

      showToast(`Đã áp dụng gợi ý cho “${suggestion.task.name}”.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Không thể áp dụng gợi ý.",
        "error",
      );
    } finally {
      setUpdatingSuggestionId(null);
    }
  }

  async function handleAutoScheduleBacklog() {
    try {
      setIsAutoScheduling(true);

      const response = await fetch("/api/tasks/auto-schedule", {
        method: "POST",
      });

      const payload = (await response.json().catch(() => null)) as
        | AutoScheduleResponse
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Không thể tự sắp lịch backlog.");
      }

      const updatedTasks = payload?.updatedTasks ?? [];

      if (updatedTasks.length === 0) {
        showToast("Không có task backlog nào cần tự sắp lịch.", "info");
        return;
      }

      setTasks((prev) =>
        prev.map((task) => {
          const updated = updatedTasks.find((item) => item.id === task.id);
          return updated ?? task;
        }),
      );

      const warningCount = payload?.warnings?.length ?? 0;
      const skippedCount = payload?.skippedTasks?.length ?? 0;

      showToast(
        `Đã tự sắp lịch ${updatedTasks.length} task.${
          warningCount > 0 ? ` Có ${warningCount} deadline warning.` : ""
        }${skippedCount > 0 ? ` ${skippedCount} task chưa có slot phù hợp.` : ""}`,
        "success",
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Không thể tự sắp lịch backlog.",
        "error",
      );
    } finally {
      setIsAutoScheduling(false);
    }
  }
  async function handleUndoSchedule() {
    if (!undoAction) return;

    const task = tasks.find((item) => item.id === undoAction.taskId);

    if (!task) {
      setUndoAction(null);
      showToast("Không tìm thấy task để hoàn tác.", "error");
      return;
    }

    try {
      setIsUndoing(true);

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledTime: undoAction.previousScheduledTime,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { task?: PlannerTask; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Không thể hoàn tác lịch task.");
      }

      const restoredTask: PlannerTask = {
        ...task,
        ...(payload?.task ?? {}),
        scheduledTime:
          payload?.task?.scheduledTime ?? undoAction.previousScheduledTime,
      };

      await handleUpdateTask(restoredTask);

      setUndoAction(null);
      showToast(`Đã hoàn tác lịch của “${task.name}”.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Không thể hoàn tác.",
        "error",
      );
    } finally {
      setIsUndoing(false);
    }
  }

  async function handleMoveTaskToBacklog(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      showToast("Không tìm thấy task để đưa về backlog.", "error");
      return;
    }

    const previousScheduledTime = task.scheduledTime;

    try {
      setUpdatingTaskId(taskId);

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scheduledTime: "BACKLOG" }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { task?: PlannerTask; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Không thể đưa task về backlog.");
      }

      const updatedTask: PlannerTask = {
        ...task,
        ...(payload?.task ?? {}),
        scheduledTime: payload?.task?.scheduledTime ?? "BACKLOG",
      };

      await handleUpdateTask(updatedTask);

      setUndoAction({
        taskId,
        previousScheduledTime,
        message: `Đã đưa “${task.name}” về backlog.`,
      });

      showToast(`Đã đưa “${task.name}” về backlog.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Không thể đưa task về backlog.",
        "error",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function submitEnergyCheckin(source: "planner_quick" | "planner_review") {
    const score = source === "planner_review" ? reviewEnergy : energyScore;
    const note =
      source === "planner_review"
        ? reviewText || "Review cuối ngày từ Planner."
        : energyNote || "Check-in nhanh từ Planner.";

    try {
      if (source === "planner_quick") {
        setIsSavingEnergy(true);
        setEnergyMessage("");
      } else {
        setReviewMessage("");
      }

      const response = await fetch("/api/dashboard/energy/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          note,
          source,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload?.message || payload?.error || "Không thể lưu check-in.",
        );
      }

      if (source === "planner_quick") {
        setEnergyMessage("Đã lưu check-in năng lượng cho hôm nay.");
        setEnergyNote("");
      } else {
        setReviewMessage("Đã lưu review cuối ngày thành check-in năng lượng.");
        setReviewText("");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu check-in.";

      if (source === "planner_quick") {
        setEnergyMessage(message);
      } else {
        setReviewMessage(message);
      }
    } finally {
      setIsSavingEnergy(false);
    }
  }

  function moveDate(days: number) {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  }

  function jumpToday() {
    setSelectedDate(new Date());
  }

  return (
    <>
      <div className="space-y-7">
        <PlannerHero
          userName={userName}
          chronotypeLabel={`${meta.label} ${meta.emoji}`}
          chronotypeSubtitle={meta.subtitle}
          headlineNote={meta.note}
          energyLine={meta.energyLine}
          selectedDateLabel={getDisplayDate(selectedDate)}
          pendingCount={pendingCount}
          completedCount={completedCount}
          focusWindow={meta.primaryWindow}
          supportWindow={meta.supportWindow}
          latestInsight={latestInsight}
          isOverloaded={selectedDateIsOverloaded}
          onOpenAdd={() => setIsAddOpen(true)}
          onJumpToday={jumpToday}
        />

        <NextBestActionCard
          pendingCount={pendingCount}
          backlogCount={backlogTasks.length}
          suggestionCount={smartSuggestions.length}
          conflictCount={criticalConflictCount}
          onOpenAdd={() => setIsAddOpen(true)}
        />

        <PlannerCommandCenter
          focusScore={focusScore}
          pendingCount={pendingCount}
          backlogCount={backlogTasks.length}
          conflictCount={criticalConflictCount}
          todayCoins={estimatedCoinsToday}
          completedToday={completedToday}
          plannedMinutes={todayPlannedMinutes}
          energyScore={energyScore}
          energyNote={energyNote}
          energyMessage={energyMessage}
          isSavingEnergy={isSavingEnergy}
          isAutoScheduling={isAutoScheduling}
          onEnergyScoreChange={setEnergyScore}
          onEnergyNoteChange={setEnergyNote}
          onEnergySubmit={() => void submitEnergyCheckin("planner_quick")}
          onOpenAdd={() => setIsAddOpen(true)}
          onAutoSchedule={() => void handleAutoScheduleBacklog()}
        />

        <section className="overflow-hidden rounded-[38px] border border-white/80 bg-white/92 shadow-[0_24px_80px_rgba(97,76,197,0.09)] backdrop-blur-xl">
          <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-5 py-5 md:px-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE5FF] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Planner workspace
                </div>

                <h2 className="mt-3 text-[1.55rem] font-black tracking-tight text-[#241F3D] md:text-[1.9rem]">
                  Sắp lịch bằng cách{" "}
                  <span className="bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] bg-clip-text text-transparent">
                    kéo thả task
                  </span>
                </h2>

                <p className="mt-2 max-w-3xl text-[14px] leading-7 text-[#615C7A]">
                  Kéo task từ backlog vào khung giờ phù hợp, hoặc kéo task đã có
                  lịch sang slot mới. ChronoFlow sẽ cập nhật task thật qua API.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-[#E9E5FF] bg-[#F8F6FF] p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("day")}
                    className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
                      viewMode === "day"
                        ? "bg-white text-[#241F3D] shadow-sm"
                        : "text-[#6B6287]"
                    }`}
                  >
                    Xem ngày
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("week")}
                    className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
                      viewMode === "week"
                        ? "bg-white text-[#241F3D] shadow-sm"
                        : "text-[#6B6287]"
                    }`}
                  >
                    Xem tuần
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => moveDate(-1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E9E5FF] bg-white text-[#5F5A77] transition hover:bg-[#FAF9FF]"
                  aria-label="Lùi"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="min-w-[160px] rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-3 text-center text-[13px] font-bold text-[#241F3D]">
                  {viewMode === "day"
                    ? getDisplayDate(selectedDate)
                    : getWeekLabel(selectedDate)}
                </div>

                <button
                  type="button"
                  onClick={() => moveDate(1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E9E5FF] bg-white text-[#5F5A77] transition hover:bg-[#FAF9FF]"
                  aria-label="Tiến"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-5 text-[13px] font-bold text-white transition hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  Thêm task
                </button>
              </div>
            </div>

            {selectedDateIsOverloaded ? (
              <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-[#FFD8D8] bg-[linear-gradient(135deg,#FFF7F7_0%,#FFF1F1_100%)] px-4 py-3 text-[#8F4A4A]">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <div className="font-black">Lịch ngày này đang khá dày</div>
                  <div className="mt-1 text-[13px] leading-6">
                    Hãy cân nhắc chuyển bớt task nhẹ hoặc dời sang ngày khác để
                    giữ chất lượng deep work.
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="p-3 md:p-5">
            {viewMode === "day" ? (
              <CalendarDayView
                date={selectedDate}
                events={dayEvents}
                conflicts={conflictMap}
                focusWindow={meta.primaryWindow}
                isOverloaded={selectedDateIsOverloaded}
                updatingTaskId={updatingTaskId}
                onAddTask={() => setIsAddOpen(true)}
                onDropTask={(taskId, dateKey, start) =>
                  void handleDropTask({ taskId, dateKey, start })
                }
                onSelectTask={(task) => setSelectedTask(task)}
              />
            ) : (
              <CalendarWeekView
                weekDates={weekDates}
                events={weekEvents}
                conflicts={conflictMap}
                selectedDate={selectedDate}
                updatingTaskId={updatingTaskId}
                onDropTask={(taskId, dateKey, start) =>
                  void handleDropTask({ taskId, dateKey, start })
                }
                onSelectDate={setSelectedDate}
                onSelectTask={(task) => setSelectedTask(task)}
              />
            )}
          </div>
        </section>

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
          <SmartSchedulingPanel
            suggestions={smartSuggestions}
            updatingId={updatingSuggestionId}
            onApply={(suggestion) => void applySmartSuggestion(suggestion)}
            onOpenAdd={() => setIsAddOpen(true)}
          />

          <BacklogCard
            tasks={backlogTasks}
            onSelectTask={(task) => setSelectedTask(task)}
            onAddTask={() => setIsAddOpen(true)}
            onDropToBacklog={(taskId) => void handleMoveTaskToBacklog(taskId)}
          />
        </div>

        <DailyLoadPanel
          weekDates={weekDates}
          events={weekEvents}
          selectedDateKey={selectedDateKey}
          onSelectDate={setSelectedDate}
        />

        <TaskFiltersPanel
          activeFilter={taskFilter}
          tasks={filteredTasks}
          totalTasks={tasks.length}
          onChangeFilter={setTaskFilter}
          onSelectTask={setSelectedTask}
        />

        <DailyReviewPanel
          score={reviewEnergy}
          text={reviewText}
          message={reviewMessage}
          onScoreChange={setReviewEnergy}
          onTextChange={setReviewText}
          onSubmit={() => void submitEnergyCheckin("planner_review")}
        />
      </div>

      <AddTaskDrawer
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        chronotype={chronotype}
        defaultDate={selectedDateKey}
        onCreated={handleCreateTask}
      />

      <TaskDetailDrawer
        open={Boolean(selectedTask)}
        task={selectedTask}
        chronotype={chronotype}
        onClose={() => setSelectedTask(null)}
        onUpdated={handleUpdateTask}
        onDeleted={handleDeleteTask}
      />

      <PlannerToast
        message={toast.message}
        tone={toast.tone}
        onClose={() => setToast({ message: "", tone: "info" })}
      />

      <PlannerUndoBar
        message={undoAction?.message ?? ""}
        isUndoing={isUndoing}
        onUndo={() => void handleUndoSchedule()}
        onDismiss={() => setUndoAction(null)}
      />
    </>
  );
}

function NextBestActionCard({
  pendingCount,
  backlogCount,
  suggestionCount,
  conflictCount,
  onOpenAdd,
}: {
  pendingCount: number;
  backlogCount: number;
  suggestionCount: number;
  conflictCount: number;
  onOpenAdd: () => void;
}) {
  const action =
    conflictCount > 0
      ? {
          eyebrow: "Cần xử lý trước",
          title: "Có lịch đang lệch nhịp",
          description:
            "Một vài task đang trùng giờ, lệch peak window hoặc nằm trong ngày quá tải. Hãy xử lý chúng trước khi thêm task mới.",
          cta: "Thêm task mới",
        }
      : backlogCount > 0
        ? {
            eyebrow: "Next best action",
            title: "Gắn lịch cho task còn trong backlog",
            description:
              "Backlog đang có task chưa được đưa vào calendar. Kéo task vào khung giờ phù hợp hoặc dùng gợi ý sắp lịch.",
            cta: "Thêm task mới",
          }
        : suggestionCount > 0
          ? {
              eyebrow: "Next best action",
              title: "Áp dụng gợi ý sắp lịch",
              description:
                "ChronoFlow đã tìm thấy một vài điều chỉnh giúp lịch khớp nhịp năng lượng hơn.",
              cta: "Thêm task mới",
            }
          : pendingCount > 0
            ? {
                eyebrow: "Next best action",
                title: "Bắt đầu xử lý task quan trọng nhất",
                description:
                  "Lịch đang khá ổn. Hãy chọn task ưu tiên cao và bắt đầu focus session khi bạn sẵn sàng.",
                cta: "Thêm task mới",
              }
            : {
                eyebrow: "Next best action",
                title: "Planner hôm nay đang rất gọn",
                description:
                  "Không có cảnh báo lớn. Bạn có thể thêm task mới hoặc giữ lịch thoáng để phục hồi năng lượng.",
                cta: "Thêm task mới",
              };

  return (
    <section className="rounded-[34px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_70px_rgba(97,76,197,0.08)] backdrop-blur-xl md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-[#F4F0FF] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#765BFF]">
            {action.eyebrow}
          </div>

          <h2 className="mt-3 text-[1.55rem] font-black tracking-[-0.035em] text-[#221C3C] md:text-[1.9rem]">
            {action.title}
          </h2>

          <p className="mt-2 max-w-3xl text-[0.98rem] leading-8 text-[#625C7B]">
            {action.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#17122B] px-6 text-[0.95rem] font-bold text-white shadow-[0_16px_36px_rgba(23,18,43,0.18)] transition hover:-translate-y-0.5"
        >
          {action.cta}
        </button>
      </div>
    </section>
  );
}

function PlannerSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[36px] border border-white/80 bg-white/92 shadow-[0_20px_70px_rgba(97,76,197,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-5 py-5 md:px-7">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE5FF] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
        {icon}
        {eyebrow}
      </div>

      <h2 className="mt-3 text-[1.45rem] font-black tracking-tight text-[#241F3D] md:text-[1.75rem]">
        {title}
      </h2>

      <p className="mt-2 max-w-3xl text-[14px] leading-7 text-[#615C7A]">
        {description}
      </p>
    </div>
  );
}

function PlannerCommandCenter({
  focusScore,
  pendingCount,
  backlogCount,
  conflictCount,
  todayCoins,
  completedToday,
  plannedMinutes,
  energyScore,
  energyNote,
  energyMessage,
  isSavingEnergy,
  isAutoScheduling,
  onEnergyScoreChange,
  onEnergyNoteChange,
  onEnergySubmit,
  onOpenAdd,
  onAutoSchedule,
}: {
  focusScore: number;
  pendingCount: number;
  backlogCount: number;
  conflictCount: number;
  todayCoins: number;
  completedToday: number;
  plannedMinutes: number;
  energyScore: number;
  energyNote: string;
  energyMessage: string;
  isSavingEnergy: boolean;
  isAutoScheduling: boolean;
  onEnergyScoreChange: (value: number) => void;
  onEnergyNoteChange: (value: string) => void;
  onEnergySubmit: () => void;
  onOpenAdd: () => void;
  onAutoSchedule: () => void;
}) {
  return (
    <PlannerSection>
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="border-b border-[#ECE8FF] p-5 md:p-7 xl:border-b-0 xl:border-r">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE5FF] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                <Layers3 className="h-3.5 w-3.5" />
                Command center
              </div>

              <h2 className="mt-3 text-[1.45rem] font-black tracking-tight text-[#241F3D] md:text-[1.75rem]">
                Tổng quan planner hôm nay
              </h2>

              <p className="mt-2 max-w-2xl text-[14px] leading-7 text-[#615C7A]">
                Tập trung vào các chỉ số cần hành động: task đang chờ, backlog,
                cảnh báo lịch và điểm thưởng từ task thật.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onAutoSchedule}
                disabled={isAutoScheduling || backlogCount === 0}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-5 text-[13px] font-bold text-[#4F4A68] transition hover:-translate-y-0.5 hover:bg-[#FAF9FF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAutoScheduling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <WandSparkles className="h-4 w-4 text-[#7C5CFA]" />
                )}
                Tự sắp lịch backlog
              </button>

              <button
                type="button"
                onClick={onOpenAdd}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-5 text-[13px] font-bold text-white transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                Thêm task mới
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CommandStatCard
              label="Focus score"
              value={`${focusScore}%`}
              description="Task tập trung nằm đúng peak window"
              tone="purple"
            />
            <CommandStatCard
              label="Task chờ xử lý"
              value={String(pendingCount)}
              description="Task chưa hoàn thành"
              tone="blue"
            />
            <CommandStatCard
              label="Backlog"
              value={String(backlogCount)}
              description="Task chưa được gắn lịch"
              tone="orange"
            />
            <CommandStatCard
              label="Cảnh báo"
              value={String(conflictCount)}
              description="Task trùng lịch, lệch peak hoặc ngày quá tải"
              tone={conflictCount > 0 ? "red" : "green"}
            />
          </div>

          <div className="mt-5 rounded-[28px] border border-[#EEE9FF] bg-[#1A1528] p-5 text-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3 text-[#A998FF]">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
                      Rewards preview
                    </div>
                    <div className="mt-1 text-[1rem] font-black">
                      Điểm thưởng hôm nay
                    </div>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-[13px] leading-7 text-white/68">
                  Dựa trên task đã hoàn thành, thời lượng task và bonus khi task
                  tập trung nằm đúng focus window.
                </p>
              </div>

              <div className="shrink-0 rounded-[24px] border border-white/10 bg-white/8 px-6 py-5 text-right">
                <div className="text-[2.25rem] font-black tracking-tight">
                  +{todayCoins}
                </div>
                <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/45">
                  coins
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <DarkMiniStat label="Task xong" value={String(completedToday)} />
              <DarkMiniStat label="Planned minutes" value={`${plannedMinutes} phút`} />
              <DarkMiniStat label="Focus score" value={`${focusScore}%`} />
            </div>
          </div>
        </div>

        <EnergyCheckinPanel
          score={energyScore}
          note={energyNote}
          message={energyMessage}
          isSaving={isSavingEnergy}
          onScoreChange={onEnergyScoreChange}
          onNoteChange={onEnergyNoteChange}
          onSubmit={onEnergySubmit}
        />
      </div>
    </PlannerSection>
  );
}

function CommandStatCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: "purple" | "blue" | "orange" | "green" | "red";
}) {
  const toneClass =
    tone === "red"
      ? "border-[#FFD8D8] bg-[#FFF7F7] text-[#D85B5B]"
      : tone === "green"
        ? "border-[#DAF2E5] bg-[#F7FFFA] text-[#2E9D67]"
        : tone === "orange"
          ? "border-[#FFE2BE] bg-[#FFF8EF] text-[#C67713]"
          : tone === "blue"
            ? "border-[#DDEBFF] bg-[#F3F8FF] text-[#4D7DDA]"
            : "border-[#E9E5FF] bg-[#F8F6FF] text-[#7C5CFA]";

  return (
    <div className={`rounded-[26px] border p-4 ${toneClass}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.15em]">
        {label}
      </div>

      <div className="mt-2 text-[2rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>

      <p className="mt-1 text-[12px] leading-6 text-[#615C7A]">{description}</p>
    </div>
  );
}

function DarkMiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
        {label}
      </div>
      <div className="mt-1 text-[1rem] font-black text-white">{value}</div>
    </div>
  );
}

function EnergyCheckinPanel({
  score,
  note,
  message,
  isSaving,
  onScoreChange,
  onNoteChange,
  onSubmit,
}: {
  score: number;
  note: string;
  message: string;
  isSaving: boolean;
  onScoreChange: (value: number) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="p-5 md:p-7">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA]">
          <Activity className="h-5 w-5" />
        </div>

        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
            Energy check-in
          </div>
          <div className="mt-1 text-[1rem] font-black text-[#241F3D]">
            Bạn đang thấy thế nào?
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-[#ECE8FF] bg-[#FAF9FF] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#615C7A]">
            Mức năng lượng
          </span>
          <span className="text-[1.25rem] font-black text-[#7C5CFA]">
            {score}/100
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(event) => onScoreChange(Number(event.target.value))}
          className="mt-4 w-full accent-[#7C5CFA]"
        />
      </div>

      <textarea
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="Ví dụ: ngủ hơi ít, đang tỉnh, cần việc nhẹ trước..."
        className="mt-4 min-h-[106px] w-full resize-none rounded-[22px] border border-[#ECE8FF] bg-[#FCFBFF] px-4 py-3 text-[13px] leading-6 text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
      />

      {message ? (
        <div className="mt-3 rounded-[18px] border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-3 text-[12px] font-semibold text-[#615C7A]">
          {message}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSaving}
        className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        Lưu check-in
      </button>
    </div>
  );
}

function SmartSchedulingPanel({
  suggestions,
  updatingId,
  onApply,
  onOpenAdd,
}: {
  suggestions: SmartSuggestion[];
  updatingId: string | null;
  onApply: (suggestion: SmartSuggestion) => void;
  onOpenAdd: () => void;
}) {
  return (
    <PlannerSection>
      <SectionHeader
        icon={<Sparkles className="h-3.5 w-3.5" />}
        eyebrow="Smart scheduling"
        title="Gợi ý sắp lịch theo nhịp"
        description="ChronoFlow đọc task thật trong planner để phát hiện việc quan trọng bị lệch peak window hoặc task còn nằm ở backlog."
      />

      <div className="grid gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <SmartSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isUpdating={updatingId === suggestion.id}
              onApply={() => onApply(suggestion)}
            />
          ))
        ) : (
          <div className="col-span-full rounded-[26px] border border-[#DAF2E5] bg-[linear-gradient(135deg,#F7FFFA_0%,#F1FFF7_100%)] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="rounded-2xl bg-white p-3 text-[#2E9D67] shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-[1.1rem] font-black tracking-tight text-[#241F3D]">
                  Chưa phát hiện task lệch nhịp lớn
                </h3>

                <p className="mt-2 max-w-2xl text-[13px] leading-7 text-[#615C7A]">
                  Khi bạn thêm task hoặc có task chưa gắn lịch, phần này sẽ đưa ra
                  gợi ý cụ thể để sắp vào khung phù hợp.
                </p>

                <button
                  type="button"
                  onClick={onOpenAdd}
                  className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#1A1528] px-5 text-[13px] font-bold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Thêm task để ChronoFlow gợi ý
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlannerSection>
  );
}

function SmartSuggestionCard({
  suggestion,
  isUpdating,
  onApply,
}: {
  suggestion: SmartSuggestion;
  isUpdating: boolean;
  onApply: () => void;
}) {
  const toneClass =
    suggestion.tone === "orange"
      ? "border-[#FFD8A8] bg-[#FFF8ED] text-[#C67713]"
      : suggestion.tone === "green"
        ? "border-[#DAF2E5] bg-[#F1FFF7] text-[#2E7C59]"
        : suggestion.tone === "blue"
          ? "border-[#DDEBFF] bg-[#F3F8FF] text-[#4D7DDA]"
          : "border-[#E9E5FF] bg-[#F8F6FF] text-[#7C5CFA]";

  const estimatedEnd = addMinutesToTime(
    suggestion.suggestedStart,
    parseMinutesFromDuration(suggestion.task.duration),
  );

  return (
    <div className={`rounded-[28px] border p-5 ${toneClass}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.16em]">
        {getTaskTypeLabel(suggestion.task.type)}
      </div>

      <h3 className="mt-3 text-[1.05rem] font-black tracking-tight text-[#241F3D]">
        {suggestion.title}
      </h3>

      <p className="mt-2 text-[13px] leading-6 text-[#615C7A]">
        {suggestion.description}
      </p>

      <div className="mt-4 rounded-[18px] bg-white/80 px-4 py-3 text-[13px] font-black text-[#241F3D]">
        Gợi ý: {suggestion.suggestedStart} - {estimatedEnd}
      </div>

      {isHeavyTask(suggestion.task.type) ? (
        <div className="mt-3 flex items-start gap-2 rounded-[18px] border border-[#E9E5FF] bg-white/70 px-4 py-3 text-[12px] font-semibold leading-6 text-[#615C7A]">
          <Coffee className="mt-0.5 h-4 w-4 shrink-0 text-[#7C5CFA]" />
          Sau block này nên chừa 10–15 phút để nghỉ hoặc chuyển nhịp.
        </div>
      ) : null}

      <button
        type="button"
        onClick={onApply}
        disabled={isUpdating}
        className="mt-4 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-[#1A1528] px-5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CalendarCheck className="h-4 w-4" />
        )}
        Áp dụng gợi ý
      </button>
    </div>
  );
}

function DailyLoadPanel({
  weekDates,
  events,
  selectedDateKey,
  onSelectDate,
}: {
  weekDates: Date[];
  events: PlannerCalendarEvent[];
  selectedDateKey: string;
  onSelectDate: (date: Date) => void;
}) {
  return (
    <PlannerSection>
      <SectionHeader
        icon={<BarChart3 className="h-3.5 w-3.5" />}
        eyebrow="Daily load"
        title="Ngày nào đang quá tải?"
        description="Theo dõi tổng thời lượng task trong tuần để tránh dồn quá nhiều việc nặng vào cùng một ngày."
      />

      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {weekDates.map((date) => {
          const dateKey = formatDateKey(date);
          const dayEvents = events.filter((event) => event.dateKey === dateKey);
          const minutes = dayEvents.reduce(
            (sum, event) => sum + parseMinutesFromDuration(event.duration),
            0,
          );
          const meta = getLoadMeta(minutes, dayEvents.length);
          const isSelected = selectedDateKey === dateKey;

          const cardClass =
            meta.tone === "red"
              ? "border-[#FFD8D8] bg-[#FFF7F7]"
              : meta.tone === "orange"
                ? "border-[#FFE2BE] bg-[#FFF8EF]"
                : "border-[#DAF2E5] bg-[#F7FFFA]";

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`rounded-[26px] border p-4 text-left transition hover:-translate-y-0.5 ${cardClass} ${
                isSelected ? "ring-4 ring-[#E9E2FF]" : ""
              }`}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                {new Intl.DateTimeFormat("vi-VN", {
                  weekday: "short",
                }).format(date)}
              </div>

              <div className="mt-1 text-[1.35rem] font-black tracking-tight text-[#241F3D]">
                {pad(date.getDate())}/{pad(date.getMonth() + 1)}
              </div>

              <div className="mt-4 text-[13px] font-black text-[#241F3D]">
                {meta.label}
              </div>

              <div className="mt-1 text-[12px] leading-6 text-[#615C7A]">
                {minutes} phút • {dayEvents.length} task
              </div>
            </button>
          );
        })}
      </div>
    </PlannerSection>
  );
}

function TaskFiltersPanel({
  activeFilter,
  tasks,
  totalTasks,
  onChangeFilter,
  onSelectTask,
}: {
  activeFilter: TaskFilter;
  tasks: PlannerTask[];
  totalTasks: number;
  onChangeFilter: (filter: TaskFilter) => void;
  onSelectTask: (task: PlannerTask) => void;
}) {
  return (
    <PlannerSection>
      <SectionHeader
        icon={<ListFilter className="h-3.5 w-3.5" />}
        eyebrow="Task board"
        title="Lọc nhanh task trong planner"
        description="Giúp bạn xử lý nhanh task chưa có lịch, task quan trọng và các việc đã hoàn thành."
      />

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {TASK_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onChangeFilter(filter.key)}
              className={`rounded-full border px-4 py-2.5 text-[13px] font-bold transition ${
                activeFilter === filter.key
                  ? "border-[#1A1528] bg-[#1A1528] text-white"
                  : "border-[#E9E5FF] bg-white text-[#6B6287] hover:bg-[#FAF9FF]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {tasks.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => {
              const deadlineWarning = getDeadlineWarning(task);

              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onSelectTask(task)}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", task.id);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  className="group rounded-[26px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(97,76,197,0.09)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[1rem] font-black tracking-tight text-[#241F3D]">
                        {task.name}
                      </h3>

                      <p className="mt-2 text-[12px] leading-6 text-[#6B6287]">
                        {getTaskTypeLabel(task.type)} • {task.duration}
                      </p>

                      {deadlineWarning ? (
                        <div className="mt-3 rounded-[16px] border border-[#FFD8D8] bg-[#FFF7F7] px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#C55454]">
                          {deadlineWarning}
                        </div>
                      ) : null}
                    </div>

                    <span className="rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#7C5CFA]">
                      {task.priority}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-[12px] font-bold text-[#8A84A3]">
                    <span>{task.completed ? "Đã hoàn thành" : "Đang xử lý"}</span>
                    <span className="opacity-0 transition group-hover:opacity-100">
                      Kéo vào lịch
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-[26px] border border-[#ECE8FF] bg-[#FAF9FF] p-6 text-center">
            <div className="text-[1.05rem] font-black text-[#241F3D]">
              Không có task phù hợp bộ lọc này
            </div>
            <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
              Tổng planner hiện có {totalTasks} task. Hãy đổi bộ lọc hoặc thêm task
              mới nếu cần.
            </p>
          </div>
        )}
      </div>
    </PlannerSection>
  );
}

function DailyReviewPanel({
  score,
  text,
  message,
  onScoreChange,
  onTextChange,
  onSubmit,
}: {
  score: number;
  text: string;
  message: string;
  onScoreChange: (value: number) => void;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <PlannerSection>
      <SectionHeader
        icon={<Moon className="h-3.5 w-3.5" />}
        eyebrow="Daily review"
        title="Nhìn lại cuối ngày"
        description="Review ngắn giúp ChronoFlow có thêm dữ liệu thật cho Rhythm page và Weekly Insight."
      />

      <div className="grid gap-5 p-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-[26px] border border-[#ECE8FF] bg-[#FAF9FF] p-5">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
            Năng lượng cuối ngày
          </div>

          <div className="mt-4 text-[2.15rem] font-black tracking-tight text-[#241F3D]">
            {score}/100
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(event) => onScoreChange(Number(event.target.value))}
            className="mt-5 w-full accent-[#7C5CFA]"
          />
        </div>

        <div>
          <textarea
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="Hôm nay task nào đúng nhịp? Lúc nào bạn bị tụt năng lượng? Có gì cần chỉnh cho ngày mai?"
            className="min-h-[160px] w-full resize-none rounded-[26px] border border-[#ECE8FF] bg-[#FCFBFF] px-5 py-4 text-[14px] leading-7 text-[#241F3D] outline-none focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#ECE8FF]"
          />

          {message ? (
            <div className="mt-3 rounded-[18px] border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-3 text-[12px] font-semibold text-[#615C7A]">
              {message}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onSubmit}
            className="mt-4 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[13px] font-bold text-white"
          >
            <Activity className="h-4 w-4" />
            Lưu review thành check-in
          </button>
        </div>
      </div>
    </PlannerSection>
  );
}