"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Plus,
  Sparkles,
} from "lucide-react";
import PlannerHero from "./PlannerHero";
import CalendarDayView from "./CalendarDayView";
import CalendarWeekView from "./CalendarWeekView";
import AddTaskDrawer from "./AddTaskDrawer";
import TaskDetailDrawer from "./TaskDetailDrawer";
import BacklogCard from "./BacklogCard";

export type PlannerChronotype = "LION" | "BEAR" | "WOLF" | "DOLPHIN";
export type PlannerTaskType =
  | "DEEP_WORK"
  | "STUDY"
  | "CREATIVE"
  | "ADMIN"
  | "ROUTINE"
  | "PERSONAL";
export type PlannerPriority = "HIGH" | "MEDIUM" | "LOW";

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

type ViewMode = "day" | "week";

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

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseMinutesFromDuration(duration: string) {
  const numeric = Number(duration.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 60;
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutesToAdd;
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${pad(hour)}:${pad(minute)}`;
}

function parseScheduledTime(task: PlannerTask): PlannerCalendarEvent | null {
  const raw = String(task.scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");
  if (pipeParts.length === 3) {
    const [dateKey, start, end] = pipeParts;
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
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/
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

function sameDay(a: Date, b: Date) {
  return formatDateKey(a) === formatDateKey(b);
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
  return `${pad(first.getDate())}/${pad(first.getMonth() + 1)} - ${pad(last.getDate())}/${pad(last.getMonth() + 1)}`;
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

function isTimeInsideWindow(time: string, start: string, end: string) {
  return time >= start && time <= end;
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

  const meta = CHRONOTYPE_META[chronotype];
  const windows = getChronotypeWindows(chronotype);

  const scheduledEvents = useMemo(
    () =>
      tasks
        .map((task) => parseScheduledTime(task))
        .filter((event): event is PlannerCalendarEvent => event !== null),
    [tasks]
  );

  const backlogTasks = useMemo(
    () => tasks.filter((task) => !parseScheduledTime(task)),
    [tasks]
  );

  const selectedDateKey = formatDateKey(selectedDate);

  const dayEvents = useMemo(
    () =>
      scheduledEvents
        .filter((event) => event.dateKey === selectedDateKey)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [scheduledEvents, selectedDateKey]
  );

  const weekDates = useMemo(() => buildWeekDates(selectedDate), [selectedDate]);

  const weekEvents = useMemo(() => {
    const allowed = new Set(weekDates.map((d) => formatDateKey(d)));
    return scheduledEvents.filter((event) => allowed.has(event.dateKey));
  }, [scheduledEvents, weekDates]);

  const pendingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  const totalMinutesForSelectedDate = dayEvents.reduce(
    (sum, item) => sum + parseMinutesFromDuration(item.duration),
    0
  );

  const selectedDateIsOverloaded =
    totalMinutesForSelectedDate >= 420 ||
    dayEvents.filter((item) => !item.completed).length >= 6;

  const deepWorkTasks = scheduledEvents.filter(
    (event) => event.type === "DEEP_WORK" || event.type === "STUDY"
  );

  const alignedFocusTasks = deepWorkTasks.filter((event) =>
    isTimeInsideWindow(event.start, windows.peakStart, windows.peakEnd)
  );

  const focusScore =
    deepWorkTasks.length === 0
      ? 0
      : Math.round((alignedFocusTasks.length / deepWorkTasks.length) * 100);

  const quickStats = [
    {
      label: "Focus score",
      value: `${focusScore}%`,
      hint: "mức dùng đúng giờ mạnh",
    },
    {
      label: "Task chờ xử lý",
      value: String(pendingCount),
      hint: "cần chốt trong planner",
    },
    {
      label: "Backlog",
      value: String(backlogTasks.length),
      hint: "task chưa gán lịch",
    },
  ];

  async function handleCreateTask(nextTask: PlannerTask) {
    setTasks((prev) => [nextTask, ...prev]);
  }

  async function handleUpdateTask(updatedTask: PlannerTask) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  async function handleDeleteTask(taskId: string) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTask((current) => (current?.id === taskId ? null : current));
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
      <div className="space-y-6">
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-[36px] border border-white/80 bg-white/92 shadow-[0_20px_70px_rgba(97,76,197,0.08)] backdrop-blur-xl">
            <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-5 py-5 md:px-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE5FF] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Planner trực quan
                  </div>
                  <h2 className="mt-3 text-[1.55rem] font-black tracking-tight text-[#241F3D] md:text-[1.8rem]">
                    Xem lịch của bạn theo{" "}
                    <span className="bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] bg-clip-text text-transparent">
                      ngày hoặc tuần
                    </span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-[14px] leading-7 text-[#615C7A]">
                    Planner đặt trọng tâm vào block thời gian thật, giúp bạn nhìn rõ
                    task đang nằm ở đâu, ngày nào quá tải và lúc nào nên dời lịch.
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
                    {viewMode === "day" ? getDisplayDate(selectedDate) : getWeekLabel(selectedDate)}
                  </div>

                  <button
                    type="button"
                    onClick={() => moveDate(1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E9E5FF] bg-white text-[#5F5A77] transition hover:bg-[#FAF9FF]"
                    aria-label="Tiến"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {selectedDateIsOverloaded ? (
                <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-[#FFD8D8] bg-[linear-gradient(135deg,#FFF7F7_0%,#FFF1F1_100%)] px-4 py-3 text-[#8F4A4A]">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <div className="font-black">Lịch ngày này đang khá dày</div>
                    <div className="mt-1 text-[13px] leading-6">
                      Hãy cân nhắc chuyển bớt task sang backlog hoặc reschedule để
                      giữ block tập trung chất lượng hơn.
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="px-3 pb-3 pt-3 md:px-4 md:pb-4 md:pt-4">
              {viewMode === "day" ? (
                <CalendarDayView
                  date={selectedDate}
                  events={dayEvents}
                  focusWindow={meta.primaryWindow}
                  isOverloaded={selectedDateIsOverloaded}
                  onAddTask={() => setIsAddOpen(true)}
                  onSelectTask={(task) => setSelectedTask(task)}
                />
              ) : (
                <CalendarWeekView
                  weekDates={weekDates}
                  events={weekEvents}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onSelectTask={(task) => setSelectedTask(task)}
                />
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/92 shadow-[0_20px_70px_rgba(97,76,197,0.08)] backdrop-blur-xl">
              <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                      Tác vụ nhanh
                    </div>
                    <h3 className="mt-2 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
                      Điều khiển planner
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA]">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)] transition hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  Thêm task mới
                </button>
              </div>

              <div className="grid gap-3 p-5">
                {quickStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFBFF_100%)] p-4"
                  >
                    <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                      {item.label}
                    </div>
                    <div className="mt-2 text-[1.75rem] font-black tracking-tight text-[#241F3D]">
                      {item.value}
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">
                      {item.hint}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <BacklogCard
              tasks={backlogTasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onAddTask={() => setIsAddOpen(true)}
            />

            <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/92 p-5 shadow-[0_20px_70px_rgba(97,76,197,0.08)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA]">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                    Khung mạnh của bạn
                  </div>
                  <div className="mt-1 text-[1rem] font-black text-[#241F3D]">
                    {meta.primaryWindow}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-7 text-[#615C7A]">
                Với chronotype {meta.label.toLowerCase()}, bạn nên ưu tiên deep work
                hoặc học tập trong khung chính. Việc nhẹ nên đẩy sang khung phụ để
                bảo vệ giờ mạnh.
              </p>
            </div>
          </aside>
        </div>
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
    </>
  );
}