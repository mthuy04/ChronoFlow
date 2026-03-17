"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Sparkles, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChronotype } from "@/hooks/useChronotype";
import { usePlanner } from "@/hooks/usePlanner";
import { useInsights } from "@/hooks/useInsights";
import LoadingState from "@/components/common/LoadingState";
import GateView from "@/components/common/GateView";
import EnergyCurveChart from "@/components/rhythm/EnergyCurveChart";
import EmptyState from "@/components/common/EmptyState";

export default function DashboardPage() {
  const { user, displayName, isReady: authReady, isUnauthorized } = useAuth();
  const {
    chronotype,
    chronotypeInfo,
    hasChronotype,
    isReady: chronoReady,
  } = useChronotype();
  const { sortedTasks, isReady: plannerReady } = usePlanner(chronotype);
  const {
    insight,
    metrics,
    isReady: insightsReady,
  } = useInsights();

  const isReady = authReady && chronoReady && plannerReady && insightsReady;
  const topTasks = useMemo(() => sortedTasks.slice(0, 3), [sortedTasks]);

  if (!isReady) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (isUnauthorized || !user) {
    return (
      <GateView
        title="Please log in first"
        description="Your dashboard is personal to your rhythm, tasks, and weekly progress."
        href="/auth/login"
        cta="Go to login"
      />
    );
  }

  if (!hasChronotype || !chronotypeInfo) {
    return (
      <GateView
        title="Start with your assessment"
        description="Your dashboard becomes meaningful once ChronoFlow knows your chronotype and strongest windows."
        href="/assessment"
        cta="Take the assessment"
      />
    );
  }

  const alignmentScore = metrics?.alignmentScore ?? 0;

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-36 pb-24 px-6 max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#A39C93] font-medium mb-3">
              Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-serif mb-3">
              Good to see you, {displayName}.
            </h1>
            <p className="text-[#8C7A6B] font-light text-lg max-w-2xl">
              {chronotypeInfo.greeting} Your strongest focus window today is{" "}
              <span className="text-[#3A3836] font-medium">
                {chronotypeInfo.windows.peak}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/planner"
              className="bg-[#3A3836] text-white px-5 py-3 rounded-full hover:bg-[#2C2A28] transition-colors"
            >
              Plan today
            </Link>
            <Link
              href="/rhythm"
              className="border border-[#DCD6CC] text-[#6B655E] px-5 py-3 rounded-full hover:border-[#3A3836] hover:text-[#3A3836] transition-colors"
            >
              View my rhythm
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6 mb-10">
          <div className="md:col-span-4 bg-white rounded-[2rem] p-8 border border-[#F0EBE1] shadow-sm">
            <p className="text-xs uppercase tracking-widest text-[#A39C93] font-bold mb-4">
              Current rhythm
            </p>
            <h2 className={`text-3xl font-serif mb-2 ${chronotypeInfo.theme.text}`}>
              {chronotypeInfo.name}
            </h2>
            <p className="text-[#6B655E] font-light leading-relaxed mb-5">
              {chronotypeInfo.description}
            </p>
            <div className="space-y-2 text-sm text-[#8C7A6B] font-light">
              <div>
                Peak:{" "}
                <span className="text-[#3A3836] font-medium">
                  {chronotypeInfo.windows.peak}
                </span>
              </div>
              <div>
                Medium:{" "}
                <span className="text-[#3A3836] font-medium">
                  {chronotypeInfo.windows.medium}
                </span>
              </div>
              <div>
                Gentle:{" "}
                <span className="text-[#3A3836] font-medium">
                  {chronotypeInfo.windows.rest}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <EnergyCurveChart
              curve={chronotypeInfo.curve}
              stroke={chronotypeInfo.theme.stroke}
              gradientId="dashboardGradient"
              title="Today’s energy"
              description="Your rhythm snapshot helps guide task timing across the day."
            />
          </div>

          <div className="md:col-span-3 bg-[#3A3836] text-white rounded-[2rem] p-8 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-[#B9B0A4] font-bold mb-4">
              Weekly snapshot
            </p>
            <div className="text-6xl font-serif mb-2">{alignmentScore}%</div>
            <p className="text-[#D7D0C7] font-light mb-4">alignment score</p>
            <p className="text-sm text-[#B9B0A4] font-light leading-relaxed">
              {insight?.summary ||
                "Add tasks and complete them to generate a meaningful weekly reflection."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-white rounded-[2rem] p-8 border border-[#F0EBE1] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-widest text-[#A39C93] font-bold">
                Today’s tasks
              </p>
              <Link
                href="/planner"
                className="text-sm text-[#8C7A6B] hover:text-[#3A3836]"
              >
                Open planner
              </Link>
            </div>

            {topTasks.length > 0 ? (
              <div className="space-y-4">
                {topTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-[1.5rem] border border-[#F0EBE1] p-5 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#D4B59E] font-bold mb-2">
                        {task.scheduledTime}
                      </div>
                      <div className="text-xl font-serif">{task.name}</div>
                      <div className="text-sm text-[#8C7A6B] font-light mt-1">
                        {task.type} · {task.priority} priority
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        task.completed ? "bg-emerald-500" : "bg-[#EAE6DF]"
                      }`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No tasks yet"
                description="Build your first aligned day in the planner."
              />
            )}
          </div>

          <div className="md:col-span-5 bg-white rounded-[2rem] p-8 border border-[#F0EBE1] shadow-sm">
            <p className="text-xs uppercase tracking-widest text-[#A39C93] font-bold mb-5">
              Recommended next step
            </p>

            <div className="rounded-[1.5rem] bg-[#F8F7F3] p-6 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-[#D4B59E]" />
                <span className="text-xl font-serif">Build your daily flow</span>
              </div>
              <p className="text-[#6B655E] font-light leading-relaxed text-sm">
                {insight?.recommendation ||
                  "Translate your rhythm into real scheduling decisions by adding one more task to the planner."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/planner"
                className="w-full text-center bg-[#3A3836] text-white rounded-full py-4 font-light hover:bg-[#2C2A28] transition-colors"
              >
                Go to planner
              </Link>
              <Link
                href="/learn"
                className="w-full text-center border border-[#DCD6CC] text-[#6B655E] rounded-full py-4 font-light hover:border-[#3A3836] hover:text-[#3A3836] transition-colors"
              >
                Read recommended content
              </Link>
            </div>
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
          <Link href="/rhythm" className="hover:text-[#3A3836]">
            My Rhythm
          </Link>
          <Link href="/planner" className="hover:text-[#3A3836]">
            Planner
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