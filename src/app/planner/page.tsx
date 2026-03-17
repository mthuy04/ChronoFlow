"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useChronotype } from "@/hooks/useChronotype";
import { usePlanner } from "@/hooks/usePlanner";
import type { TaskType, Priority } from "@/types/task";
import LoadingState from "@/components/common/LoadingState";
import GateView from "@/components/common/GateView";
import EmptyState from "@/components/common/EmptyState";
import TaskCard from "@/components/planner/TaskCard";

export default function PlannerPage() {
  const {
    chronotype,
    chronotypeInfo,
    isReady: chronoReady,
    isUnauthorized: chronoUnauthorized,
  } = useChronotype();

  const {
    sortedTasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
    isReady: plannerReady,
    isUnauthorized: plannerUnauthorized,
  } = usePlanner(chronotype);

  const [newTask, setNewTask] = useState<{
    name: string;
    type: TaskType;
    priority: Priority;
    duration: string;
    deadline: string;
  }>({
    name: "",
    type: "Deep Work",
    priority: "Medium",
    duration: "1 hour",
    deadline: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isReady = chronoReady && plannerReady;
  const isUnauthorized = chronoUnauthorized || plannerUnauthorized;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name.trim() || !chronotype) return;

    setIsSaving(true);
    setError("");

    try {
      await addTask(newTask);
      setNewTask({
        name: "",
        type: "Deep Work",
        priority: "Medium",
        duration: "1 hour",
        deadline: "",
      });
    } catch {
      setError("Failed to create task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isReady) {
    return <LoadingState label="Loading planner..." />;
  }

  if (isUnauthorized) {
    return (
      <GateView
        title="Please log in first"
        description="Your planner needs your account so tasks can be saved, completed, and reflected back into weekly insights."
        href="/auth/login"
        cta="Go to login"
      />
    );
  }

  if (!chronotype || !chronotypeInfo) {
    return (
      <GateView
        title="Take your assessment first"
        description="Your planner becomes meaningful once ChronoFlow knows your chronotype and strongest energy windows."
        href="/assessment"
        cta="Start assessment"
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Design your day.
            </h1>
            <p className="text-[#8C7A6B] font-light text-lg leading-relaxed mb-10 max-w-md">
              Tell ChronoFlow what needs to be done. We’ll suggest the most
              natural place for it based on your rhythm.
            </p>

            <form
              onSubmit={handleAddTask}
              className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10 space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#A39C93] font-bold ml-1">
                  Task description
                </label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) =>
                    setNewTask({ ...newTask, name: e.target.value })
                  }
                  placeholder="What needs to be done?"
                  className="w-full bg-transparent border-b border-[#DCD6CC] py-3 text-xl font-serif placeholder:text-[#DCD6CC] focus:outline-none focus:border-[#3A3836]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  value={newTask.type}
                  onChange={(value) =>
                    setNewTask({ ...newTask, type: value as TaskType })
                  }
                  options={[
                    "Deep Work",
                    "Study",
                    "Creative",
                    "Admin",
                    "Routine",
                    "Personal",
                  ]}
                />

                <FormSelect
                  label="Priority"
                  value={newTask.priority}
                  onChange={(value) =>
                    setNewTask({ ...newTask, priority: value as Priority })
                  }
                  options={["High", "Medium", "Low"]}
                />

                <FormSelect
                  label="Duration"
                  value={newTask.duration}
                  onChange={(value) =>
                    setNewTask({ ...newTask, duration: value })
                  }
                  options={["30 mins", "1 hour", "2 hours", "3 hours"]}
                />

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#A39C93] font-bold ml-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="w-full bg-[#FDFCF8] border border-[#F0EBE1] rounded-2xl px-4 py-4 text-[#6B655E] text-sm font-light"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-rose-50 text-rose-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#3A3836] text-white rounded-full py-4 font-light hover:bg-[#2C2A28] transition-colors disabled:opacity-60"
              >
                {isSaving ? "Aligning..." : "Schedule task"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-end justify-between mb-8 border-b border-[#F0EBE1] pb-5">
              <div>
                <h2 className="text-3xl font-serif">Today’s flow</h2>
                <p className="text-[#8C7A6B] font-light mt-2">
                  Best deep work window: {chronotypeInfo.windows.peak}
                </p>
              </div>
              <div className="text-xs uppercase tracking-widest text-[#A39C93] font-bold">
                {sortedTasks.length} active tasks
              </div>
            </div>

            {sortedTasks.length === 0 ? (
              <EmptyState
                title="Your rhythm is ready"
                description="Add a task to see your day align."
              />
            ) : (
              <div className="space-y-5">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#F0EBE1] px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D4B59E]" />
          <span className="text-xl font-serif">ChronoFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-[#8C7A6B] font-light">
          <Link href="/dashboard" className="hover:text-[#3A3836]">
            Dashboard
          </Link>
          <Link href="/rhythm" className="hover:text-[#3A3836]">
            My Rhythm
          </Link>
          <Link href="/insights" className="hover:text-[#3A3836]">
            Insights
          </Link>
          <Link href="/profile" className="hover:text-[#3A3836]">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest text-[#A39C93] font-bold ml-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#FDFCF8] border border-[#F0EBE1] rounded-2xl px-4 py-4 text-[#6B655E] text-sm font-light"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}