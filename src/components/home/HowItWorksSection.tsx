"use client";

import Link from "next/link";
import { ArrowRight, Brain, LineChart, CalendarDays, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface StepCardProps {
  step: string;
  icon: ReactNode;
  title: string;
  text: string;
  accent: string;
}

export default function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] py-16 md:py-24">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[12%] h-[280px] w-[280px] rounded-full bg-purple-100/20 blur-[100px]" />
        <div className="absolute right-[-6%] top-[8%] h-[240px] w-[240px] rounded-full bg-blue-100/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[32%] h-[220px] w-[220px] rounded-full bg-orange-100/20 blur-[90px]" />
      </div>

      <div className="section-container mx-auto max-w-5xl px-6">
        {/* Intro */}
        <div className="mx-auto max-w-[720px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
            <Sparkles className="h-3 w-3" />
            How it works
          </div>

          <h2 className="text-3xl font-[900] leading-[1.1] tracking-tight text-[#1A152E] md:text-5xl">
            From quiz to plan, in{" "}
            <span className="font-serif italic text-[#8B5CF6]">three simple steps.</span>
          </h2>

          <p className="mt-6 text-[15px] font-medium leading-relaxed text-slate-500 md:text-[16px]">
            ChronoFlow turns self-awareness into structure. You answer a few
            questions, get your rhythm profile, and use it to plan your day
            with more clarity and less friction.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14">
          {/* connection line desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[56px] hidden h-px md:block">
            <div className="mx-auto h-px max-w-4xl bg-[linear-gradient(90deg,rgba(124,92,250,0)_0%,rgba(124,92,250,0.18)_18%,rgba(124,92,250,0.18)_82%,rgba(124,92,250,0)_100%)]" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <StepCard
              step="01"
              icon={<Brain className="h-5 w-5 text-[#8B5CF6]" />}
              title="Take the quiz"
              text="Answer a short assessment about your sleep habits, energy timing, and natural working rhythm."
              accent="from-[#F6F0FF] to-[#EEE7FF]"
            />

            <StepCard
              step="02"
              icon={<LineChart className="h-5 w-5 text-[#5B46FF]" />}
              title="Get your rhythm"
              text="See your likely chronotype and energy pattern, including where focus tends to rise, dip, and recover."
              accent="from-[#F3F2FF] to-[#E9E6FF]"
            />

            <StepCard
              step="03"
              icon={<CalendarDays className="h-5 w-5 text-[#B7772E]" />}
              title="Plan your day"
              text="Use those insights to place deep work, lighter tasks, and recovery in the parts of the day that fit best."
              accent="from-[#FFF8F0] to-[#FCEFE2]"
            />
          </div>
        </div>

        {/* mini summary card */}
        <div className="mx-auto mt-10 max-w-[760px] rounded-[28px] border border-white/80 bg-white/78 p-6 text-center shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
            Why this flow matters
          </div>
          <p className="text-[14px] leading-7 text-[#615C7A]">
            The point is not to optimize every second. It is to make planning
            more realistic by matching your schedule to the way your energy
            actually behaves.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/assessment"
            className="group inline-flex items-center gap-2 rounded-full bg-[#1A152E] px-8 py-4 text-sm font-black text-white shadow-lg shadow-purple-200/50 transition-all hover:scale-105"
          >
            Start the assessment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, icon, title, text, accent }: StepCardProps) {
  return (
    <div className="group relative rounded-[30px] border border-white bg-white/70 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40">
      <div
        className={`rounded-[24px] border border-white/60 bg-gradient-to-br ${accent} p-5`}
      >
        <div className="mb-8 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/90 shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>

          <div className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Step {step}
          </div>
        </div>

        <h3 className="text-[1.2rem] font-black tracking-tight text-[#1A152E] md:text-[1.3rem]">
          {title}
        </h3>

        <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-500 md:text-[14px]">
          {text}
        </p>

        <div className="mt-6 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          ChronoFlow
        </div>
      </div>
    </div>
  );
}