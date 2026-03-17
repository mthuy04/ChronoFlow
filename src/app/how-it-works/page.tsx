"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  Sparkles,
  Brain,
  LineChart,
  CalendarDays,
  MoonStar,
  CheckCircle2,
  Clock3,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Take a short rhythm assessment",
    description:
      "Start with a guided quiz about your sleep habits, alertness patterns, focus timing, and how your energy changes through the day.",
    bullets: [
      "Answer a few simple questions",
      "Reflect on when you feel naturally focused",
      "Capture your current rhythm without overthinking",
    ],
    icon: <Brain className="h-5 w-5 text-[#8B5CF6]" />,
  },
  {
    step: "02",
    title: "Get your chronotype and energy profile",
    description:
      "ChronoFlow interprets your answers into a likely chronotype and a clearer view of when your energy tends to rise, dip, and recover.",
    bullets: [
      "See your chronotype result",
      "Understand your strongest focus window",
      "Notice your natural recovery zones",
    ],
    icon: <LineChart className="h-5 w-5 text-[#5B46FF]" />,
  },
  {
    step: "03",
    title: "Turn insight into a realistic daily plan",
    description:
      "Use those rhythm insights to decide when deep work, meetings, light admin, recovery, and evening reset fit best.",
    bullets: [
      "Protect your best focus hours",
      "Move lighter tasks into lower-energy periods",
      "Build a day that feels more sustainable",
    ],
    icon: <CalendarDays className="h-5 w-5 text-[#C07C2D]" />,
  },
];

const principles = [
  {
    title: "Not every hour is equal",
    text: "ChronoFlow treats your day as a moving rhythm, not a flat block of identical time.",
    icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" />,
  },
  {
    title: "Productivity needs recovery",
    text: "Focus is only one part of performance. Recovery, pacing, and sleep matter too.",
    icon: <MoonStar className="h-5 w-5 text-[#5B46FF]" />,
  },
  {
    title: "Planning should fit biology",
    text: "The goal is not control for its own sake. The goal is a schedule that works with you.",
    icon: <Target className="h-5 w-5 text-[#C07C2D]" />,
  },
];

export default function HowItWorksPage() {
    
  return (
    <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E]">
        <Navbar variant="guest" />
      <section className="relative overflow-hidden px-6 pt-16 pb-14 md:pt-24 md:pb-18">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[10%] h-[280px] w-[280px] rounded-full bg-purple-100/30 blur-[110px]" />
          <div className="absolute right-[-6%] top-[8%] h-[240px] w-[240px] rounded-full bg-blue-100/25 blur-[100px]" />
          <div className="absolute bottom-[-8%] left-[30%] h-[220px] w-[220px] rounded-full bg-orange-100/20 blur-[90px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          {/* HERO */}
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
              <Sparkles className="h-3 w-3" />
              How it works
            </div>

            <h1 className="text-[clamp(2.4rem,5vw,4.8rem)] font-[900] leading-[1.04] tracking-tight text-[#1A152E]">
              From self-awareness to a{" "}
              <span className="font-serif italic text-[#8B5CF6]">
                rhythm-aware plan
              </span>
              .
            </h1>

            <p className="mx-auto mt-6 max-w-[700px] text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
              ChronoFlow helps you understand when your energy naturally rises,
              dips, and resets — then turns that insight into a more realistic
              way to plan your day.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/assessment"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1A152E] px-8 py-4 text-sm font-black text-white shadow-lg shadow-purple-200/50 transition-all hover:scale-105"
              >
                Start the assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/learn"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5B46FF] transition-all hover:gap-3"
              >
                Explore the science
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* OVERVIEW VISUAL */}
          <div className="mt-14 rounded-[36px] border border-white bg-white/55 p-3 shadow-[0_18px_48px_rgba(36,31,61,0.08)] backdrop-blur-xl">
            <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,#F8F4FF_0%,#F4F7FF_52%,#FFF8F1_100%)] p-6 md:p-8">
              <div className="mb-6 text-center">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                  Product flow overview
                </div>
                <h2 className="mt-2 text-[1.8rem] font-[850] tracking-tight text-[#1A152E] md:text-[2.4rem]">
                  Three simple steps on the web
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <FlowPreviewCard
                  icon={<Brain className="h-5 w-5 text-[#8B5CF6]" />}
                  title="Assessment"
                  subtitle="A short guided quiz"
                  accent="from-[#F6F0FF] to-[#EEE7FF]"
                />
                <FlowPreviewCard
                  icon={<LineChart className="h-5 w-5 text-[#5B46FF]" />}
                  title="Insights"
                  subtitle="Chronotype + rhythm"
                  accent="from-[#F3F2FF] to-[#E9E6FF]"
                />
                <FlowPreviewCard
                  icon={<CalendarDays className="h-5 w-5 text-[#C07C2D]" />}
                  title="Planning"
                  subtitle="Practical daily structure"
                  accent="from-[#FFF8F0] to-[#FCEFE2]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP-BY-STEP */}
      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
              <BookOpen className="h-3 w-3" />
              Step by step
            </div>

            <h2 className="text-3xl font-[900] leading-[1.1] tracking-tight text-[#1A152E] md:text-5xl">
              What you do on the site, and what you get back.
            </h2>

            <p className="mt-6 text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
              Each step is designed to stay simple for the user while still
              producing insights that feel personal, practical, and usable.
            </p>
          </div>

          <div className="mt-14 space-y-10">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="rounded-[34px] border border-white bg-white/70 p-4 shadow-[0_14px_36px_rgba(36,31,61,0.05)] backdrop-blur-xl md:p-5"
              >
                <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                  {/* text block */}
                  <div className="rounded-[28px] border border-white/70 bg-white/76 p-6 md:p-7">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm">
                        {item.icon}
                      </div>

                      <div className="rounded-full border border-white/80 bg-[#F7F2FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8B5CF6]">
                        Step {item.step}
                      </div>
                    </div>

                    <h3 className="text-[1.55rem] font-[850] leading-[1.15] tracking-tight text-[#1A152E] md:text-[1.9rem]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-[14px] leading-7 text-[#615C7A] md:text-[15px]">
                      {item.description}
                    </p>

                    <div className="mt-6 space-y-3">
                      {item.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8B5CF6]" />
                          <p className="text-[14px] leading-6 text-[#615C7A]">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* visual mockup */}
                  <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#F8F4FF_0%,#F4F7FF_52%,#FFF8F1_100%)] p-5">
                    {index === 0 && <AssessmentMockup />}
                    {index === 1 && <InsightMockup />}
                    {index === 2 && <PlannerMockup />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
              <Zap className="h-3 w-3" />
              Why it matters
            </div>

            <h2 className="text-3xl font-[900] leading-[1.1] tracking-tight text-[#1A152E] md:text-5xl">
              The system is simple, but the impact can be meaningful.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map((item) => (
              <div
                key={item.title}
                className="group rounded-[30px] border border-white bg-white/70 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40"
              >
                <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,#F8F4FF_0%,#F5F8FF_55%,#FFF8F1_100%)] p-5">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
                    {item.icon}
                  </div>

                  <h3 className="text-[1.2rem] font-black tracking-tight text-[#1A152E] md:text-[1.3rem]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[13px] leading-relaxed text-slate-500 md:text-[14px]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-[860px] rounded-[30px] border border-white bg-white/72 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl md:p-8">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
              Suggested additions for the product
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Suggestion text="Save assessment history so users can compare their rhythm over time." />
              <Suggestion text="Show a daily recommendation card: focus task, light task, and recovery suggestion." />
              <Suggestion text="Add a weekly rhythm summary to make the experience feel more alive." />
              <Suggestion text="Offer practical examples for students, creators, and young professionals." />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pt-8 pb-20 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[36px] border border-white bg-[linear-gradient(135deg,#F8F4FF_0%,#F4F7FF_52%,#FFF8F1_100%)] p-3 shadow-[0_18px_48px_rgba(36,31,61,0.08)]">
            <div className="rounded-[30px] border border-white/70 bg-white/58 px-6 py-10 text-center backdrop-blur-xl md:px-10 md:py-14">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/88 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
                <Sparkles className="h-3 w-3" />
                Ready to try it?
              </div>

              <h2 className="mx-auto max-w-[760px] text-[clamp(2rem,4.5vw,4rem)] font-[900] leading-[1.06] tracking-tight text-[#1A152E]">
                Start with your assessment, then let the platform guide the rest.
              </h2>

              <p className="mx-auto mt-6 max-w-[640px] text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
                The first step only takes a few minutes, but it gives you a much
                clearer foundation for planning with more intention.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/assessment"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#1A152E] px-8 py-4 text-sm font-black text-white shadow-lg shadow-purple-200/50 transition-all hover:scale-105"
                >
                  Start the assessment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5B46FF] transition-all hover:gap-3"
                >
                  Read more first
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
        <Footer />
    </main>
  );
}

function FlowPreviewCard({
  icon,
  title,
  subtitle,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="group rounded-[30px] border border-white bg-white/70 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40">
      <div
        className={`rounded-[24px] border border-white/70 bg-gradient-to-br ${accent} p-5`}
      >
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
          {icon}
        </div>

        <h3 className="text-[1.15rem] font-black tracking-tight text-[#1A152E]">
          {title}
        </h3>

        <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function AssessmentMockup() {
  return (
    <div className="h-full rounded-[22px] border border-white/60 bg-white/70 p-5 shadow-sm">
      <div className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
        On the web: assessment
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white p-4">
        <div className="mb-3 text-[13px] font-bold text-[#1A152E]">
          When do you usually feel mentally sharpest?
        </div>

        <div className="space-y-2">
          <Option label="Early morning" active />
          <Option label="Late morning or midday" />
          <Option label="Afternoon" />
          <Option label="Evening" />
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Question 4 of 10</span>
          <span>~ 2 min left</span>
        </div>
      </div>
    </div>
  );
}

function InsightMockup() {
  return (
    <div className="h-full rounded-[22px] border border-white/60 bg-white/70 p-5 shadow-sm">
      <div className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
        On the web: result
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
              Your chronotype
            </div>
            <div className="text-[1.2rem] font-black text-[#1A152E]">
              Wolf
            </div>
          </div>

          <div className="rounded-full bg-[#F4EEFF] px-3 py-1 text-[11px] font-bold text-[#5B46FF]">
            Late energy
          </div>
        </div>

        <div className="relative mt-4 aspect-[16/8] rounded-[16px] bg-[linear-gradient(135deg,#F7F2FF_0%,#F4F7FF_100%)] p-3">
          <svg
            viewBox="0 0 420 140"
            className="absolute inset-0 h-full w-full p-3"
            fill="none"
          >
            <path
              d="M10 112 C80 112, 150 102, 230 86 C290 74, 338 38, 380 28 C398 24, 406 30, 410 42"
              stroke="#5B46FF"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#5B46FF] shadow-sm">
            Focus rises later
          </div>
        </div>
      </div>
    </div>
  );
}

function PlannerMockup() {
  return (
    <div className="h-full rounded-[22px] border border-white/60 bg-white/70 p-5 shadow-sm">
      <div className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
        On the web: planner
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white p-4">
        <div className="mb-4 text-[13px] font-bold text-[#1A152E]">
          Suggested structure for today
        </div>

        <div className="space-y-3">
          <TaskBlock
            time="9:00 AM"
            label="Light admin"
            tone="bg-[#F7F3FF] text-[#8B5CF6]"
          />
          <TaskBlock
            time="2:00 PM"
            label="Meetings & collaborative work"
            tone="bg-[#F3F5FF] text-[#5B46FF]"
          />
          <TaskBlock
            time="7:30 PM"
            label="Deep work / focused creation"
            tone="bg-[#FFF6EE] text-[#C07C2D]"
          />
        </div>
      </div>
    </div>
  );
}

function Option({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border px-3 py-2.5 text-[13px] font-medium transition-all ${
        active
          ? "border-[#D9CCFF] bg-[#F7F2FF] text-[#5B46FF]"
          : "border-slate-100 bg-white text-slate-500"
      }`}
    >
      {label}
    </div>
  );
}

function TaskBlock({
  time,
  label,
  tone,
}: {
  time: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] border border-slate-100 bg-white px-3 py-2.5">
      <span className="text-[12px] font-bold text-slate-400">{time}</span>
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${tone}`}
      >
        {label}
      </span>
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-slate-100 bg-white/80 px-4 py-4">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8B5CF6]" />
      <p className="text-[13px] leading-6 text-[#615C7A]">{text}</p>
    </div>
    
);
}

