"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ListTodo,
  Target,
  Waves,
  Brain,
  Clock3,
  MoonStar,
} from "lucide-react";
import FocusTimerCard from "@/components/planner/FocusTimerCard";
import { Priority, TaskType } from "@prisma/client";

type PlannerBlock = {
  label: string;
  time: string;
  text: string;
};

type PlannerMeta = {
  name: string;
  accent: string;
  gradient: string;
  intro: string;
  blocks: PlannerBlock[];
};

type WeeklyInsightLite = {
  weekLabel: string;
  alignmentScore: number;
  completedCount: number;
  totalCount: number;
  deepWorkCount: number;
  recommendation: string;
  summary: string;
} | null;

type TaskLite = {
  id: string;
  name: string;
  type: TaskType;
  priority: Priority;
  duration: string;
  deadline: string | null;
  scheduledTime: string;
  explanation: string;
  completed: boolean;
};

interface PlannerClientProps {
  plannerMeta: PlannerMeta;
  latestInsight: WeeklyInsightLite;
  tasks: TaskLite[];
  pendingTasksCount: number;
  completedTasksCount: number;
}

function formatTaskType(type: TaskType) {
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function getPriorityTone(priority: Priority) {
  switch (priority) {
    case "HIGH":
      return "bg-[#FFF1F1] text-[#C85B5B]";
    case "MEDIUM":
      return "bg-[#F7F2FF] text-[#7C5CFA]";
    case "LOW":
      return "bg-[#EEF7F2] text-[#4E8B6A]";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getTaskTypeTone(type: TaskType) {
  switch (type) {
    case "DEEP_WORK":
      return "bg-[#F3F2FF] text-[#5B46FF]";
    case "STUDY":
      return "bg-[#EEF4FF] text-[#4C6FFF]";
    case "CREATIVE":
      return "bg-[#FFF4EC] text-[#C07C2D]";
    case "ADMIN":
      return "bg-[#F6F6F6] text-[#666]";
    case "ROUTINE":
      return "bg-[#EEF7F2] text-[#4E8B6A]";
    case "PERSONAL":
      return "bg-[#FFF2FA] text-[#B6578F]";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function parseDurationToMinutes(duration: string): number {
  const lower = duration.trim().toLowerCase();

  const hourMatch = lower.match(/(\d+)\s*h/);
  const minuteMatch = lower.match(/(\d+)\s*m/);

  let minutes = 0;

  if (hourMatch) minutes += Number(hourMatch[1]) * 60;
  if (minuteMatch) minutes += Number(minuteMatch[1]);

  if (!hourMatch && !minuteMatch) {
    const rawNumber = Number(lower);
    if (!Number.isNaN(rawNumber) && rawNumber > 0) {
      minutes = rawNumber;
    }
  }

  return minutes > 0 ? minutes : 25;
}

export default function PlannerClient({
  plannerMeta,
  latestInsight,
  tasks,
  pendingTasksCount,
  completedTasksCount,
}: PlannerClientProps) {
  const pendingTasks = tasks.filter((task) => !task.completed);
  const focusCandidate =
    pendingTasks.find((task) => task.type === "DEEP_WORK") ??
    pendingTasks.find((task) => task.type === "STUDY") ??
    pendingTasks[0] ??
    null;

  return (
    <>
      <div className="mx-auto max-w-[820px] text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
          <Waves className="h-3 w-3" />
          Rhythm-aware planner
        </div>

        <h1 className="text-[clamp(2.2rem,5vw,4.4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A152E]">
          Plan with your{" "}
          <span className="font-serif italic" style={{ color: plannerMeta.accent }}>
            {plannerMeta.name.toLowerCase()}
          </span>{" "}
          rhythm in mind.
        </h1>

        <p className="mx-auto mt-6 max-w-[700px] text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
          {plannerMeta.intro}
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <StatCard
          icon={<Waves className="h-5 w-5 text-[#8B5CF6]" />}
          label="Your chronotype"
          value={plannerMeta.name}
          text="Current rhythm pattern used for planning recommendations."
          accent={`bg-gradient-to-br ${plannerMeta.gradient}`}
        />
        <StatCard
          icon={<ListTodo className="h-5 w-5 text-[#5B46FF]" />}
          label="Pending tasks"
          value={`${pendingTasksCount}`}
          text="Tasks still waiting to be completed or scheduled."
          accent="bg-gradient-to-br from-[#F3F2FF] to-[#E9E6FF]"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-[#C07C2D]" />}
          label="Completed tasks"
          value={`${completedTasksCount}`}
          text="Tasks already marked as completed in your planner."
          accent="bg-gradient-to-br from-[#FFF8F0] to-[#FCEFE2]"
        />
      </div>

      <div className="mt-10 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[36px] border border-white bg-white/65 p-3 shadow-[0_18px_48px_rgba(36,31,61,0.08)] backdrop-blur-xl">
          <div
            className={`rounded-[30px] border border-white/70 bg-gradient-to-br ${plannerMeta.gradient} p-6 md:p-8`}
          >
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                  Suggested structure
                </div>
                <h2 className="mt-2 text-[1.8rem] font-[850] tracking-tight text-[#1A152E] md:text-[2.3rem]">
                  Recommended blocks for your day
                </h2>
              </div>

              <Link
                href="/result"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5B46FF] transition-all hover:gap-3"
              >
                Review result again
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {plannerMeta.blocks.map((block) => (
                <div
                  key={block.label}
                  className="rounded-[24px] border border-white/70 bg-white/72 p-5 shadow-sm"
                >
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
                    {block.label}
                  </div>
                  <div className="text-[1.2rem] font-black tracking-tight text-[#1A152E]">
                    {block.time}
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-[#615C7A]">
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {focusCandidate ? (
          <FocusTimerCard
            title={focusCandidate.name}
            subtitle={`Suggested focus session • ${focusCandidate.scheduledTime}`}
            durationMinutes={parseDurationToMinutes(focusCandidate.duration)}
            accent={plannerMeta.accent}
          />
        ) : (
          <FocusTimerCard
            title="Your next focus session"
            subtitle="Add a task to start a real countdown session"
            durationMinutes={25}
            accent={plannerMeta.accent}
          />
        )}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[30px] border border-white bg-white/72 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
            <CalendarDays className="h-4 w-4" />
            Weekly insight
          </div>

          {latestInsight ? (
            <>
              <h3 className="text-[1.4rem] font-black tracking-tight text-[#1A152E]">
                {latestInsight.weekLabel}
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniInfo label="Alignment score" value={`${latestInsight.alignmentScore}`} />
                <MiniInfo
                  label="Task completion"
                  value={`${latestInsight.completedCount}/${latestInsight.totalCount}`}
                />
                <MiniInfo
                  label="Deep work blocks"
                  value={`${latestInsight.deepWorkCount}`}
                />
                <MiniInfo
                  label="Recommendation"
                  value={latestInsight.recommendation}
                />
              </div>

              <p className="mt-5 text-[14px] leading-7 text-[#615C7A]">
                {latestInsight.summary}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-[1.4rem] font-black tracking-tight text-[#1A152E]">
                No weekly insight yet
              </h3>
              <p className="mt-4 text-[14px] leading-7 text-[#615C7A]">
                Weekly insight will become more useful once the system has task history and alignment data to summarize.
              </p>
            </>
          )}
        </div>

        <div className="rounded-[30px] border border-white bg-white/72 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
            <Target className="h-4 w-4" />
            Planning principles
          </div>

          <div className="space-y-3">
            <Principle
              title="Protect your best block"
              text="Put your most demanding work where your rhythm is strongest first."
            />
            <Principle
              title="Shift task intensity"
              text="A softer energy period does not mean failure. It often means the task should change."
            />
            <Principle
              title="Recovery is part of output"
              text="Sleep and decompression are not separate from performance. They support it."
            />
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-[36px] border border-white bg-white/65 p-3 shadow-[0_18px_48px_rgba(36,31,61,0.08)] backdrop-blur-xl">
        <div className="rounded-[30px] border border-white/70 bg-white/76 p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                Your tasks
              </div>
              <h2 className="mt-2 text-[1.8rem] font-[850] tracking-tight text-[#1A152E] md:text-[2.3rem]">
                Current planner items
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/assessment" className="cf-btn-secondary">
                Re-take assessment
              </Link>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#DDD6FE] bg-[#FAF8FF] px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ListTodo className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <h3 className="mt-4 text-[1.3rem] font-black tracking-tight text-[#1A152E]">
                No tasks yet
              </h3>
              <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-7 text-[#615C7A]">
                Your planner is connected to the database, but there are no saved tasks for this account yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-[24px] border border-white/80 bg-[linear-gradient(135deg,#F8F4FF_0%,#F5F8FF_55%,#FFF8F1_100%)] p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[1.15rem] font-black tracking-tight text-[#1A152E]">
                          {task.name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getTaskTypeTone(
                            task.type
                          )}`}
                        >
                          {formatTaskType(task.type)}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getPriorityTone(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>

                        {task.completed && (
                          <span className="rounded-full bg-[#EEF7F2] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#4E8B6A]">
                            Completed
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
                        {task.explanation}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-[12px] font-medium text-slate-500">
                        <span>Scheduled: {task.scheduledTime}</span>
                        <span>Duration: {task.duration}</span>
                        {task.deadline && <span>Deadline: {task.deadline}</span>}
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-white/80 bg-white/88 px-4 py-3 text-right shadow-sm">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
                        Recommended slot
                      </div>
                      <div className="mt-1 text-[14px] font-bold text-[#1A152E]">
                        {task.scheduledTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard" className="cf-btn-primary">
            Open dashboard
          </Link>

          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5B46FF] transition-all hover:gap-3"
          >
            Learn more about rhythm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  text,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="group rounded-[30px] border border-white bg-white/70 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40">
      <div className={`rounded-[24px] border border-white/70 ${accent} p-5`}>
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
          {icon}
        </div>

        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
          {label}
        </div>

        <h3 className="text-[1.4rem] font-black tracking-tight text-[#1A152E]">
          {value}
        </h3>

        <p className="mt-3 text-[13px] leading-relaxed text-slate-500 md:text-[14px]">
          {text}
        </p>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-[#FAF8FF] p-4">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-[14px] font-bold text-[#1A152E]">{value}</div>
    </div>
  );
}

function Principle({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/80 bg-[#FAF8FF] p-4">
      <div className="text-[13px] font-bold text-[#1A152E]">{title}</div>
      <p className="mt-2 text-[13px] leading-6 text-[#615C7A]">{text}</p>
    </div>
  );
}