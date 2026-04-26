"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Plus,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  PlannerTask,
  PlannerView,
  TaskType,
  Priority,
  calcFocusScore,
  calcOverloadWarning,
  getSuggestion,
  toDateKey,
} from "@/lib/planner";
import AddTaskCard from "@/components/planner/AddTaskCard";
import PlannerCalendarDay from "@/components/planner/PlannerCalendarDay";
import PlannerCalendarWeek from "@/components/planner/PlannerCalendarWeek";
import PlannerTaskModal from "@/components/planner/PlannerTaskModal";
import BacklogPanel from "@/components/planner/BacklogPanel";
import FocusScoreCard from "@/components/planner/FocusScoreCard";
import WeeklyHeatmap from "@/components/planner/WeeklyHeatmap";

type ChronotypeMeta = {
  key: "LION" | "BEAR" | "WOLF" | "DOLPHIN";
  name: string;
  badge: string;
  intro: string;
};

type WeeklyInsight = {
  id: string;
  weekLabel: string;
  alignmentScore: number;
  completedCount: number;
  totalCount: number;
  deepWorkCount: number;
  recommendation: string;
  summary: string;
  createdAt: string | Date;
} | null;

export default function PlannerClient({
  userName,
  chronotype,
  tasks,
  latestInsight,
}: {
  userName: string;
  chronotype: ChronotypeMeta;
  tasks: PlannerTask[];
  latestInsight: WeeklyInsight;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [view, setView] = useState<PlannerView>("day");
  const [selectedDate, setSelectedDate] = useState<string>(toDateKey(new Date()));
  const [selectedTask, setSelectedTask] = useState<PlannerTask | null>(null);

  const scheduledTasks = useMemo(
    () => tasks.filter((task) => !task.isBacklog),
    [tasks]
  );

  const backlogTasks = useMemo(
    () => tasks.filter((task) => task.isBacklog),
    [tasks]
  );

  const tasksForDay = useMemo(
    () =>
      scheduledTasks.filter(
        (task) =>
          task.scheduledDate === selectedDate && !task.completed
      ),
    [scheduledTasks, selectedDate]
  );

  const overloadWarnings = useMemo(
    () => calcOverloadWarning(tasksForDay),
    [tasksForDay]
  );

  const focusScore = useMemo(
    () => calcFocusScore(tasksForDay),
    [tasksForDay]
  );

  const handleCreateTask = async (payload: {
    name: string;
    type: TaskType;
    priority: Priority;
    duration: string;
    deadline?: string | null;
    scheduledDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    scheduledTime: string;
    explanation: string;
    focusMode?: string | null;
    focusMinutes?: number | null;
    isBacklog?: boolean;
  }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Không thể tạo task.");
    }

    startTransition(() => {
      router.refresh();
    });
  };

  const handleQuickReschedule = async (taskId: string, type: TaskType) => {
    const suggestion = getSuggestion(chronotype.key, type);

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduledDate: selectedDate,
        startTime: suggestion.startTime,
        endTime: suggestion.endTime,
        scheduledTime: suggestion.scheduledTime,
        explanation: suggestion.explanation,
        focusMode: suggestion.focusMode,
        focusMinutes: suggestion.focusMinutes,
        isBacklog: false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) return;

    startTransition(() => {
      router.refresh();
    });
  };

  const handleTaskUpdate = async (
    taskId: string,
    payload: Record<string, unknown>
  ) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) return;

    startTransition(() => {
      router.refresh();
    });
  };

  const handleTaskDelete = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok || !data.success) return;

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-white bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] p-6 shadow-[0_20px_80px_rgba(26,21,40,0.06)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              ChronoFlow Planner
            </div>

            <h1 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
              Kế hoạch của {userName.split(" ")[0]},
              <br className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent" /> theo nhịp {chronotype.name}.
            </h1>
            
            <p className="mt-4 max-w-[60ch] text-[14px] leading-8 text-[#5F5A77]">
              {chronotype.intro}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatPill icon={<Flame className="h-3.5 w-3.5" />}>
                {chronotype.badge}
              </StatPill>
              <StatPill icon={<CalendarDays className="h-3.5 w-3.5" />}>
                {selectedDate}
              </StatPill>
              <StatPill icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                {tasks.filter((t) => t.completed).length} task đã xong
              </StatPill>
            </div>

            {latestInsight && (
              <div className="mt-6 rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#6F59FF]" />
                  <span className="text-[13px] font-[900] text-[#1A1528]">
                    Insight gần nhất
                  </span>
                </div>
                <div className="text-[12px] font-semibold text-[#8A84A3]">
                  {latestInsight.weekLabel}
                </div>
                <p className="mt-2 text-[13px] leading-6 text-[#615C7A]">
                  {latestInsight.summary}
                </p>
              </div>
            )}
          </div>

          <AddTaskCard
            chronotypeKey={chronotype.key}
            selectedDate={selectedDate}
            onCreateTask={handleCreateTask}
          />
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[30px] border border-white bg-white/90 p-5 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ViewTab
                  active={view === "day"}
                  onClick={() => setView("day")}
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Xem ngày"
                />
                <ViewTab
                  active={view === "week"}
                  onClick={() => setView("week")}
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Xem tuần"
                />
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-2.5 text-[14px] outline-none"
              />
            </div>

            {view === "day" ? (
              <PlannerCalendarDay
                date={selectedDate}
                tasks={scheduledTasks}
                onTaskClick={setSelectedTask}
              />
            ) : (
              <PlannerCalendarWeek
                baseDate={selectedDate}
                tasks={scheduledTasks}
                onTaskClick={setSelectedTask}
              />
            )}
          </div>

          {overloadWarnings.length > 0 && (
            <div className="rounded-[24px] border border-amber-100 bg-amber-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-[14px] font-[900] text-amber-800">
                  Cảnh báo lịch quá tải
                </span>
              </div>
              <div className="space-y-2">
                {overloadWarnings.map((warning) => (
                  <div
                    key={warning}
                    className="rounded-2xl bg-white/70 px-4 py-3 text-[13px] text-amber-900"
                  >
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          <WeeklyHeatmap selectedDate={selectedDate} tasks={scheduledTasks} />
        </div>

        <div className="space-y-6">
          <FocusScoreCard score={focusScore} />

          <BacklogPanel
            tasks={backlogTasks}
            selectedDate={selectedDate}
            onTaskClick={setSelectedTask}
            onQuickReschedule={handleQuickReschedule}
          />
        </div>
      </section>

      {selectedTask && (
        <PlannerTaskModal
          task={selectedTask}
          chronotypeKey={chronotype.key}
          onClose={() => setSelectedTask(null)}
          onDelete={handleTaskDelete}
          onUpdate={handleTaskUpdate}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold transition ${
        active
          ? "bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)]"
          : "border border-[#E9E5FF] bg-white text-[#4F4A68]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatPill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-3 py-2 text-[12px] font-semibold text-[#4F4A68] shadow-sm">
      <span className="text-[#6F59FF]">{icon}</span>
      {children}
    </div>
  );
}