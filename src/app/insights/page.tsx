"use client";

import Link from "next/link";
import { Sparkles, Heart, Moon, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useChronotype } from "@/hooks/useChronotype";
import { useInsights } from "@/hooks/useInsights";
import LoadingState from "@/components/common/LoadingState";
import GateView from "@/components/common/GateView";

export default function InsightsPage() {
  const { isReady: authReady, isUnauthorized } = useAuth();
  const { chronotype, chronotypeInfo, isReady: chronoReady } = useChronotype();
  const { insight, metrics, isReady: insightsReady } = useInsights();

  const isReady = authReady && chronoReady && insightsReady;

  const weeklyData = [
    { day: "Mon", focus: 3, light: 5 },
    { day: "Tue", focus: 4, light: 4 },
    { day: "Wed", focus: 2, light: 6 },
    { day: "Thu", focus: 5, light: 3 },
    { day: "Fri", focus: 4, light: 4 },
    { day: "Sat", focus: 1, light: 6 },
    { day: "Sun", focus: 0, light: 5 },
  ];

  if (!isReady) {
    return <LoadingState label="Loading insights..." />;
  }

  if (isUnauthorized) {
    return (
      <GateView
        title="Please log in first"
        description="Insights are generated from your personal planner history and chronotype data."
        href="/auth/login"
        cta="Go to login"
      />
    );
  }

  if (!chronotype || !chronotypeInfo) {
    return (
      <GateView
        title="No insight without rhythm"
        description="Take the assessment first so ChronoFlow can understand your energy windows and begin generating reflections."
        href="/assessment"
        cta="Take the assessment"
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-40 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-serif mb-4">Weekly Reflection</h1>
            <p className="text-[#8C7A6B] font-light text-xl">
              Learning to work with yourself, not against yourself.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4 bg-white p-10 rounded-[3rem] shadow-sm border border-[#F0EBE1] text-center flex flex-col justify-center">
              <Heart className="w-10 h-10 text-[#D4B59E] mx-auto mb-6" />
              <div className="text-6xl font-serif text-[#3A3836] mb-3">
                {metrics?.alignmentScore ?? 0}%
              </div>
              <p className="text-xs font-bold text-[#A39C93] uppercase tracking-[0.2em] mb-5">
                Alignment Score
              </p>
              <p className="text-[#6B655E] text-sm font-light leading-relaxed">
                {insight?.summary ||
                  "Your weekly insight becomes richer as you plan and complete more tasks."}
              </p>
            </div>

            <div className="md:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-[#F0EBE1]">
              <h3 className="font-serif text-xl text-[#3A3836] mb-8">
                Task Distribution
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F0EBE1"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#A39C93", fontSize: 12 }}
                      dy={10}
                    />
                    <Tooltip
                      cursor={{ fill: "#F8F7F3" }}
                      contentStyle={{
                        borderRadius: "1rem",
                        border: "none",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Bar
                      dataKey="focus"
                      name="Deep Work"
                      stackId="a"
                      fill="#3A3836"
                      radius={[0, 0, 4, 4]}
                      barSize={32}
                    />
                    <Bar
                      dataKey="light"
                      name="Light Tasks"
                      stackId="a"
                      fill="#D4B59E"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ReflectionCard
              title="Honoring focus"
              body={
                metrics
                  ? `You completed ${metrics.completedCount} out of ${metrics.totalCount} planned tasks. That is already enough to start learning from your timing patterns.`
                  : "You have not completed any tasks yet. Start by planning one meaningful task inside your strongest window."
              }
              icon={<CheckCircle2 className="w-7 h-7 text-[#D4B59E]" />}
            />

            <ReflectionCard
              title="Gentle adjustment"
              body={
                insight?.recommendation ||
                "Your next best move is to protect your peak window for study or deep work."
              }
              icon={<Moon className="w-7 h-7 text-[#D4B59E]" />}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ReflectionCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#F0EBE1]">
      <div className="mb-5">{icon}</div>
      <h3 className="text-2xl font-serif mb-3">{title}</h3>
      <p className="text-[#6B655E] font-light leading-relaxed">{body}</p>
    </div>
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
          <Link href="/planner" className="hover:text-[#3A3836]">
            Planner
          </Link>
          <Link href="/profile" className="hover:text-[#3A3836]">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}