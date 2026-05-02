import type {
    PlannerChronotypeKey,
    PlannerPriority,
    PlannerTask,
    PlannerTaskType,
    SmartSuggestion,
    WeekDayItem,
  } from "./types";
  
  export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
  }
  
  export function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  export function getTodayKey() {
    return formatDateKey(new Date());
  }
  
  export function parseDateKey(dateKey: string) {
    const [year, month, day] = dateKey.split("-").map((value) => Number(value));
    return new Date(year, month - 1, day);
  }
  
  export function addDays(dateKey: string, days: number) {
    const date = parseDateKey(dateKey);
    date.setDate(date.getDate() + days);
    return formatDateKey(date);
  }
  
  export function getWeekStart(dateKey: string) {
    const date = parseDateKey(dateKey);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return formatDateKey(date);
  }
  
  export function getWeekDays(dateKey: string): WeekDayItem[] {
    const weekStart = getWeekStart(dateKey);
  
    return Array.from({ length: 7 }, (_, index) => {
      const key = addDays(weekStart, index);
      const date = parseDateKey(key);
      const weekday = new Intl.DateTimeFormat("vi-VN", { weekday: "short" })
        .format(date)
        .replace(".", "")
        .toUpperCase();
  
      return {
        dateKey: key,
        weekday,
        dateLabel: new Intl.DateTimeFormat("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }).format(date),
      };
    });
  }
  
  export function getWeekRangeLabel(dateKey: string) {
    const days = getWeekDays(dateKey);
    const firstDay = days[0]?.dateLabel ?? "";
    const lastDay = days[6]?.dateLabel ?? "";
  
    return `${firstDay} - ${lastDay}`;
  }
  
  export function getLongDateLabel(dateKey: string) {
    const date = parseDateKey(dateKey);
  
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }
  
  export function getDayName(dateKey: string) {
    const date = parseDateKey(dateKey);
  
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
    }).format(date);
  }
  
  export function formatTaskType(type: PlannerTaskType) {
    if (type === "DEEP_WORK") return "Deep work";
    if (type === "ADMIN") return "Admin";
    if (type === "STUDY") return "Học tập";
    if (type === "MEETING") return "Meeting";
    if (type === "CREATIVE") return "Sáng tạo";
    return "Cá nhân";
  }
  
  export function formatPriority(priority: PlannerPriority) {
    if (priority === "HIGH") return "High";
    if (priority === "MEDIUM") return "Medium";
    return "Low";
  }
  
  export function getChronotypeTitle(
    key: PlannerChronotypeKey,
    label: string | null,
  ) {
    if (label) return label;
    if (key === "LION") return "Sư tử";
    if (key === "BEAR") return "Gấu";
    if (key === "WOLF") return "Sói";
    if (key === "DOLPHIN") return "Cá heo";
    return "Chưa có chronotype";
  }
  
  export function getChronotypeIcon(key: PlannerChronotypeKey) {
    if (key === "LION") return "🦁";
    if (key === "BEAR") return "🐻";
    if (key === "WOLF") return "🐺";
    if (key === "DOLPHIN") return "🐬";
    return "✨";
  }
  
  export function buildScheduledTime(
    dateKey: string,
    startTime: string,
    durationMinutes: number,
  ) {
    const [hourRaw, minuteRaw] = startTime
      .split(":")
      .map((value) => Number(value));
    const hour = Number.isFinite(hourRaw) ? hourRaw : 9;
    const minute = Number.isFinite(minuteRaw) ? minuteRaw : 0;
    const totalMinutes = hour * 60 + minute + durationMinutes;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(
      endMinute,
    ).padStart(2, "0")}`;
  
    return `${dateKey}|${startTime}|${endTime}`;
  }
  
  export function parseClockToMinutes(value: string | null) {
    if (!value) return null;
  
    const [hourRaw, minuteRaw] = value.split(":").map((item) => Number(item));
  
    if (!Number.isFinite(hourRaw) || !Number.isFinite(minuteRaw)) {
      return null;
    }
  
    return hourRaw * 60 + minuteRaw;
  }
  
  export function formatMinutes(minutes: number) {
    if (minutes <= 0) return "0 phút";
    return `${minutes} phút`;
  }
  
  export function getPriorityClasses(priority: PlannerPriority) {
    if (priority === "HIGH") {
      return "border-rose-200 bg-rose-50 text-rose-600";
    }
  
    if (priority === "MEDIUM") {
      return "border-violet-200 bg-violet-50 text-violet-600";
    }
  
    return "border-slate-200 bg-slate-50 text-slate-600";
  }
  
  export function getTaskAccent(type: PlannerTaskType) {
    if (type === "DEEP_WORK") return "from-violet-600 to-blue-500";
    if (type === "STUDY") return "from-sky-500 to-blue-400";
    if (type === "ADMIN") return "from-slate-500 to-slate-400";
    if (type === "MEETING") return "from-amber-500 to-orange-400";
    if (type === "CREATIVE") return "from-fuchsia-500 to-pink-400";
    return "from-emerald-500 to-teal-400";
  }
  
  export function getTasksForDate(tasks: PlannerTask[], dateKey: string) {
    return tasks.filter((task) => task.scheduledDate === dateKey);
  }
  
  export function getTasksForWeek(tasks: PlannerTask[], weekKey: string) {
    const weekDays = getWeekDays(weekKey).map((item) => item.dateKey);
    return tasks.filter(
      (task) => task.scheduledDate !== null && weekDays.includes(task.scheduledDate),
    );
  }
  
  export function getPlannedMinutes(tasks: PlannerTask[]) {
    return tasks.reduce((total, task) => total + task.durationMinutes, 0);
  }
  
  export function getDaySummary(tasks: PlannerTask[], dateKey: string) {
    const dayTasks = getTasksForDate(tasks, dateKey);
  
    return {
      dateKey,
      totalTasks: dayTasks.length,
      completedTasks: dayTasks.filter((task) => task.completed).length,
      pendingTasks: dayTasks.filter((task) => !task.completed).length,
      minutes: getPlannedMinutes(dayTasks),
    };
  }
  
  export function extractFocusWindowRange(focusWindow: string | null) {
    if (!focusWindow) return null;
  
    const parts = focusWindow.split("-").map((item) => item.trim());
  
    if (parts.length !== 2) return null;
  
    return {
      start: parts[0],
      end: parts[1],
    };
  }
  
  export function isTaskAligned(task: PlannerTask, focusWindow: string | null) {
    const range = extractFocusWindowRange(focusWindow);
    const taskStart = parseClockToMinutes(task.startTime);
    const taskEnd = parseClockToMinutes(task.endTime);
  
    if (!range || taskStart === null || taskEnd === null) return false;
  
    const focusStart = parseClockToMinutes(range.start);
    const focusEnd = parseClockToMinutes(range.end);
  
    if (focusStart === null || focusEnd === null) return false;
  
    return taskStart >= focusStart && taskEnd <= focusEnd;
  }
  
  export function estimateCoinReward(
    task: PlannerTask,
    focusWindow: string | null,
  ) {
    const base = Math.max(2, Math.floor(task.durationMinutes / 15) * 2);
  
    if (!task.completed) return 0;
  
    if (task.type === "DEEP_WORK" || task.type === "STUDY") {
      return base + (isTaskAligned(task, focusWindow) ? 4 : 2);
    }
  
    return base + 1;
  }
  
  export function getDailyReward(
    tasks: PlannerTask[],
    dateKey: string,
    focusWindow: string | null,
  ) {
    return getTasksForDate(tasks, dateKey)
      .filter((task) => task.completed)
      .reduce((total, task) => total + estimateCoinReward(task, focusWindow), 0);
  }
  
  export function computeSmartSuggestions(
    tasks: PlannerTask[],
    focusWindow: string | null,
    secondaryWindow: string | null,
    selectedDateKey: string,
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
  
    const backlogTasks = tasks
      .filter((task) => !task.completed && task.isBacklog)
      .slice(0, 2);
  
    backlogTasks.forEach((task, index) => {
      const targetWindow = index === 0 ? focusWindow : secondaryWindow;
  
      if (!targetWindow) return;
  
      suggestions.push({
        id: `backlog-${task.id}`,
        taskId: task.id,
        title: `Đưa "${task.name}" vào lịch`,
        description:
          "Task này còn ở backlog. Bạn nên đưa vào một block cụ thể để tránh trôi việc.",
        suggestedWindow: targetWindow,
        targetDate: selectedDateKey,
      });
    });
  
    const misalignedTasks = tasks
      .filter(
        (task) =>
          !task.completed &&
          !task.isBacklog &&
          task.scheduledDate === selectedDateKey &&
          (task.type === "DEEP_WORK" || task.type === "STUDY") &&
          !isTaskAligned(task, focusWindow),
      )
      .slice(0, 2);
  
    misalignedTasks.forEach((task) => {
      if (!focusWindow) return;
  
      suggestions.push({
        id: `move-${task.id}`,
        taskId: task.id,
        title: `Dời "${task.name}" vào peak window`,
        description:
          "Task tập trung đang nằm ngoài khung mạnh, nên dời lại để giữ chất lượng làm việc.",
        suggestedWindow: focusWindow,
        targetDate: selectedDateKey,
      });
    });
  
    return suggestions.slice(0, 4);
  }
  
  export function getTaskStatusLabel(task: PlannerTask) {
    if (task.completed) return "Đã xong";
    if (task.isBacklog) return "Backlog";
    return "Đang lên lịch";
  }
  
  export function getCompactDate(dateKey: string | null) {
    if (!dateKey) return "Chưa gán lịch";
  
    const date = parseDateKey(dateKey);
  
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  }
  
  export function getLoadTone(minutes: number) {
    if (minutes >= 240) return "border-rose-200 bg-rose-50";
    if (minutes >= 150) return "border-amber-200 bg-amber-50";
    return "border-emerald-200 bg-emerald-50";
  }
  
  export function getHourRows() {
    return Array.from({ length: 17 }, (_, index) => index + 6);
  }
  
  export function getDefaultStartTime(focusWindow: string | null) {
    const range = extractFocusWindowRange(focusWindow);
    return range?.start ?? "09:00";
  }
  
  export function getTaskBoardTasks(
    tasks: PlannerTask[],
    filter: "ALL" | "TODAY" | "BACKLOG" | "DEEP_WORK" | "DONE",
    selectedDateKey: string,
  ) {
    if (filter === "TODAY") {
      return tasks.filter((task) => task.scheduledDate === selectedDateKey);
    }
  
    if (filter === "BACKLOG") {
      return tasks.filter((task) => task.isBacklog && !task.completed);
    }
  
    if (filter === "DEEP_WORK") {
      return tasks.filter(
        (task) => task.type === "DEEP_WORK" || task.type === "STUDY",
      );
    }
  
    if (filter === "DONE") {
      return tasks.filter((task) => task.completed);
    }
  
    return tasks;
  }