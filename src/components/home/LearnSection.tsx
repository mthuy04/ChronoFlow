"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MoonStar,
  Brain,
  Clock3,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

const articles = [
  {
    title: "What exactly is a chronotype?",
    description:
      "An introduction to chronotypes and why different people naturally feel alert or tired at different times of the day.",
    icon: <MoonStar className="w-5 h-5 text-[#5B46FF]" />,
    tag: "Foundations",
    accent: "from-[#F6F0FF] to-[#EEE7FF]",
    href: "/learn/chronotype-basics",
  },
  {
    title: "Why your energy rises and falls",
    description:
      "Explore the biology behind daily energy curves, circadian rhythm, and why productivity is never constant.",
    icon: <Brain className="w-5 h-5 text-[#7866F2]" />,
    tag: "Biology",
    accent: "from-[#F3F2FF] to-[#E9E6FF]",
    href: "/learn/energy-rhythm",
  },
  {
    title: "How to plan your day with rhythm",
    description:
      "Practical guidance for aligning deep work, meetings, rest, and sleep with your natural energy pattern.",
    icon: <Clock3 className="w-5 h-5 text-[#C07C2D]" />,
    tag: "Practical guide",
    accent: "from-[#FFF8F0] to-[#FCEFE2]",
    href: "/learn/rhythm-based-planning",
  },
];

interface ArticleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  tag: string;
  accent: string;
  href: string;
}

interface ChipProps {
  icon: ReactNode;
  label: string;
}

export default function LearnSection() {
  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] py-16 md:py-24">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-8%] top-[14%] h-[280px] w-[280px] rounded-full bg-purple-100/20 blur-[110px]" />
        <div className="absolute right-[-6%] top-[8%] h-[230px] w-[230px] rounded-full bg-blue-100/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] h-[220px] w-[220px] rounded-full bg-orange-100/18 blur-[95px]" />
      </div>

      <div className="section-container mx-auto max-w-5xl px-6">
        {/* Intro */}
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
            <Sparkles className="h-3 w-3" />
            Learning hub
          </div>

          <h2 className="text-3xl font-[900] leading-[1.1] tracking-tight text-[#1A152E] md:text-5xl">
            Learn the science behind your{" "}
            <span className="font-serif italic text-[#8B5CF6]">rhythm.</span>
          </h2>

          <p className="mt-6 text-[15px] font-medium leading-relaxed text-slate-500 md:text-[16px]">
            ChronoFlow combines practical planning tools with educational
            insight. Understanding chronotypes and circadian rhythm makes it
            easier to think about focus, recovery, and how your day actually
            works.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/80 bg-white/78 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
              Why learning matters
            </div>
            <p className="text-[14px] leading-7 text-[#615C7A]">
              Tools help you act, but understanding helps you adapt. The more
              you understand your rhythm, the easier it becomes to build habits
              that feel sustainable instead of forced.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Chip
              icon={<BookOpen className="w-4 h-4 text-[#5B46FF]" />}
              label="Science explainers"
            />
            <Chip
              icon={<Brain className="w-4 h-4 text-[#7866F2]" />}
              label="Research-backed ideas"
            />
            <Chip
              icon={<Clock3 className="w-4 h-4 text-[#C07C2D]" />}
              label="Practical routines"
            />
          </div>

          <div className="mt-8">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 font-medium text-[#5B46FF] transition-all hover:gap-3"
            >
              Visit the learning hub
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Article cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>

        {/* soft note */}
        <div className="mx-auto mt-10 max-w-[820px] rounded-[30px] border border-white bg-white/72 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl md:p-8">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
            What ChronoFlow is not
          </div>

          <p className="text-[14px] leading-7 text-[#615C7A] md:text-[15px]">
            It is not a medical diagnosis, and it does not claim to perfectly
            predict every day. It is a practical framework for understanding
            patterns in your attention, recovery, and timing — so you can plan
            with more self-awareness and less guilt.
          </p>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="mx-auto mb-5 max-w-3xl text-[14px] leading-7 text-[#615C7A]">
            ChronoFlow is not only about productivity. It is about understanding
            the biological patterns that shape how humans think, work, and
            recover across the day.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/learn" className="cf-btn-primary">
              Explore learning
            </Link>

            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 font-medium text-[#5B46FF] transition-all hover:gap-3"
            >
              Explore your rhythm in the assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ icon, label }: ChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-4 py-2 text-sm text-[#4F4A68] shadow-[0_8px_24px_rgba(36,31,61,0.04)]">
      {icon}
      {label}
    </div>
  );
}

function ArticleCard({
  title,
  description,
  icon,
  tag,
  accent,
  href,
}: ArticleCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[30px] border border-white bg-white/70 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40"
    >
      <div
        className={`flex h-full flex-col justify-between rounded-[24px] border border-white/70 bg-gradient-to-br ${accent} p-5`}
      >
        <div>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>

          <div className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
            {tag}
          </div>

          <h3 className="text-[1.2rem] font-black leading-[1.2] tracking-tight text-[#1A152E] md:text-[1.3rem]">
            {title}
          </h3>

          <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-500 md:text-[14px]">
            {description}
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold text-[#5B46FF] transition-all group-hover:gap-3">
          Read article
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}