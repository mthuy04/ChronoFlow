"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useChronotype } from "@/hooks/useChronotype";
import { usePlanner } from "@/hooks/usePlanner";
import LoadingState from "@/components/common/LoadingState";
import GateView from "@/components/common/GateView";
import EmptyState from "@/components/common/EmptyState";
import { APP_ROUTES } from "@/lib/constants";

export default function HistoryPage() {
  const { user, isReady: authReady } = useAuth();
  const { chronotype, isReady: chronoReady } = useChronotype();
  const { tasks, isReady: plannerReady } = usePlanner(chronotype);

  const isReady = authReady && chronoReady && plannerReady;

  if (!isReady) {
    return <LoadingState label="Loading history..." />;
  }

  if (!user) {
    return (
      <GateView
        title="Please log in first"
        description="Your history is personal to your account, rhythm, and planning activity."
        href={APP_ROUTES.login}
        cta="Go to login"
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
        <Navbar variant="user" />
        <section className="pt-28 md:pt-36 pb-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif mb-10">History</h1>
            <EmptyState
              title="No history yet"
              description="Once you start planning and completing tasks, ChronoFlow will build a clearer reflection timeline for you."
            />
          </div>
        </section>
      </main>
    );
  }

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Navbar variant="user" />

      <section className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-serif mb-4">History</h1>
            <p className="text-[#8C7A6B] font-light text-lg">
              Review your past planning activity, completed tasks, and unfinished
              work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Total Tasks" value={String(tasks.length)} />
            <StatCard title="Completed" value={String(completedTasks.length)} />
            <StatCard title="Pending" value={String(pendingTasks.length)} />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10">
            <h2 className="text-3xl font-serif mb-6">Recent Activity</h2>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-[1.5rem] bg-[#F8F7F3] px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#D4B59E] font-bold mb-2">
                      {task.scheduledTime}
                    </div>
                    <div className="text-xl font-serif">{task.name}</div>
                    <div className="text-sm text-[#8C7A6B] font-light mt-1">
                      {task.type} · {task.priority}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold ${
                      task.completed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href={APP_ROUTES.planner}
                className="inline-flex bg-[#3A3836] text-white px-8 py-4 rounded-full text-lg font-light hover:bg-[#2C2A28] transition-colors"
              >
                Back to planner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-[2rem] border border-[#F0EBE1] shadow-sm p-6">
      <div className="text-sm text-[#8C7A6B] font-light mb-2">{title}</div>
      <div className="text-4xl font-serif">{value}</div>
    </div>
  );
}