"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  Moon,
  Sparkles,
  Waves,
  Clock3,
  Brain,
  CalendarDays,
  CheckCircle2,
  MoonStar,
} from "lucide-react";

const chronotype = {
  name: "Wolf",
  label: "Late energy pattern",
  icon: <Moon className="h-5 w-5 text-[#5B46FF]" />,
  accent: "#5B46FF",
  gradient: "from-[#F5F5FF] via-[#ECEBFF] to-[#E2E1FF]",
  summary:
    "You tend to warm up more slowly and often feel more mentally alert later in the day. Your strongest focus may arrive after the hours that conventional schedules usually expect.",
};

const strengths = [
  "Creative and analytical energy may rise later than average",
  "Late-day deep work can feel more natural than early-morning intensity",
  "Your best work may depend more on timing than on forcing discipline earlier",
];

const cautions = [
  "Early expectations can feel heavier than they do for others",
  "Generic schedules may make you feel behind even when your rhythm is valid",
  "Protecting your evening focus without sacrificing sleep becomes important",
];

const suggestions = [
  {
    title: "Deep work window",
    value: "7:00 PM – 10:00 PM",
    text: "This is a good time to place demanding work, concentrated study, writing, or high-focus creation.",
    icon: <Brain className="h-5 w-5 text-[#5B46FF]" />,
  },
  {
    title: "Lighter work",
    value: "9:00 AM – 12:00 PM",
    text: "Use earlier hours for lower-pressure admin, communication, planning, or setup tasks when possible.",
    icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" />,
  },
  {
    title: "Recovery reminder",
    value: "Protect your reset",
    text: "Even if your focus rises later, sleep still matters. A strong evening is useful only if it stays sustainable.",
    icon: <MoonStar className="h-5 w-5 text-[#C07C2D]" />,
  },
];

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E] overflow-x-hidden">
      <Navbar variant="guest" />

      <section className="relative overflow-hidden px-6 pt-14 pb-16 md:pt-18 md:pb-24">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[8%] h-[280px] w-[280px] rounded-full bg-purple-100/30 blur-[110px]" />
          <div className="absolute right-[-6%] top-[10%] h-[230px] w-[230px] rounded-full bg-blue-100/25 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[28%] h-[220px] w-[220px] rounded-full bg-orange-100/20 blur-[90px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Intro */}
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
              <Sparkles className="h-3 w-3" />
              Your result
            </div>

            <h1 className="text-[clamp(2.2rem,5vw,4.4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A152E]">
              Your rhythm looks most like a{" "}
              <span className="font-serif italic text-[#5B46FF]">
                {chronotype.name}
              </span>
              .
            </h1>

            <p className="mx-auto mt-6 max-w-[700px] text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
              This result does not define you forever. It is a practical
              starting point for understanding when your focus tends to rise,
              when your energy dips, and how to plan with more realism.
            </p>
          </div>

          {/* Main result card */}
          <div className="mt-12 rounded-[36px] border border-white bg-white/65 p-3 shadow-[0_18px_48px_rgba(36,31,61,0.08)] backdrop-blur-xl">
            <div
              className={`rounded-[30px] border border-white/70 bg-gradient-to-br ${chronotype.gradient} p-6 md:p-8`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                {/* left result summary */}
                <div className="rounded-[26px] border border-white/70 bg-white/72 p-6 shadow-sm">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm">
                      {chronotype.icon}
                    </div>

                    <div className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#5B46FF] shadow-sm">
                      {chronotype.label}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                    Likely chronotype
                  </div>

                  <h2 className="mt-2 text-[2rem] font-[900] leading-[1.05] tracking-tight text-[#1A152E] md:text-[2.5rem]">
                    {chronotype.name}
                  </h2>

                  <p className="mt-4 text-[14px] leading-7 text-[#615C7A] md:text-[15px]">
                    {chronotype.summary}
                  </p>

                  <div className="mt-6 rounded-[20px] border border-white/80 bg-[#F8F5FF] p-4">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                      What this means
                    </div>
                    <p className="text-[13px] leading-6 text-[#615C7A]">
                      Your best planning decisions may come from working with
                      later focus rather than fighting to force your strongest
                      work into earlier hours that do not fit you naturally.
                    </p>
                  </div>
                </div>

                {/* right rhythm visual */}
                <div className="rounded-[26px] border border-white/70 bg-white/72 p-6 shadow-sm">
                  <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                    Energy rhythm preview
                  </div>

                  <div className="relative rounded-[22px] border border-white/80 bg-[linear-gradient(135deg,#F7F2FF_0%,#F4F7FF_100%)] p-4">
                    <div className="relative aspect-[16/9]">
                      <div className="absolute left-0 top-0 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        High energy
                      </div>

                      <div className="absolute left-0 bottom-0 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        Low energy
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>12 AM</span>
                      </div>

                      <svg
                        viewBox="0 0 420 180"
                        className="absolute inset-0 h-full w-full"
                        fill="none"
                      >
                        {/* baseline */}
                        <path
                          d="M10 132 C72 132, 130 130, 190 122 C250 114, 298 98, 338 72 C372 50, 395 46, 410 62"
                          stroke="#5B46FF"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 145 C72 144, 130 140, 188 134 C250 126, 305 112, 360 96 C385 88, 398 86, 410 94"
                          stroke="#8B5CF6"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          opacity="0.65"
                        />
                      </svg>

                      <div className="absolute left-[56%] top-[28%] rounded-full border border-white/80 bg-white px-3 py-1.5 text-[11px] font-bold text-[#5B46FF] shadow-sm">
                        Focus rises later
                      </div>

                      <div className="absolute left-[66%] top-[18%] flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-md">
                        <Moon className="h-5 w-5 text-[#5B46FF]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <MiniStat
                      label="Best focus block"
                      value="Evening"
                      tone="text-[#5B46FF]"
                    />
                    <MiniStat
                      label="Most fragile period"
                      value="Early morning"
                      tone="text-[#8B5CF6]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* strengths + cautions */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <InfoListCard
              title="Likely strengths"
              items={strengths}
              kicker="What may feel natural"
              accent="from-[#F3F2FF] to-[#E9E6FF]"
            />
            <InfoListCard
              title="Things to watch"
              items={cautions}
              kicker="What may create friction"
              accent="from-[#FFF8F0] to-[#FCEFE2]"
            />
          </div>

          {/* suggestions */}
          <div className="mt-10">
            <div className="mx-auto max-w-[760px] text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
                <CalendarDays className="h-3 w-3" />
                Suggested planning
              </div>

              <h2 className="text-3xl font-[900] leading-[1.1] tracking-tight text-[#1A152E] md:text-4xl">
                What your day could look like.
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-[#615C7A]">
                These are not rigid rules. They are examples of how ChronoFlow
                might translate rhythm into real daily structure.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {suggestions.map((item) => (
                <SuggestionCard key={item.title} {...item} />
              ))}
            </div>
          </div>

          {/* next actions */}
          <div className="mx-auto mt-10 max-w-[900px] rounded-[30px] border border-white bg-white/72 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl md:p-8">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
              What to do next
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <NextAction
                title="Open planner"
                text="Start structuring your day with your rhythm in mind."
                href="/planner"
              />
              <NextAction
                title="Go to dashboard"
                text="See a more complete overview of your rhythm and insights."
                href="/dashboard"
              />
              <NextAction
                title="Learn more"
                text="Read more about chronotypes, energy, and practical planning."
                href="/learn"
              />
            </div>
          </div>

          {/* final CTA */}
          <div className="mt-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/planner" className="cf-btn-primary">
                Continue to planner
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
      </section>

      <Footer />
    </main>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/88 p-4 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className={`mt-2 text-[1rem] font-black ${tone}`}>{value}</div>
    </div>
  );
}

function InfoListCard({
  title,
  items,
  kicker,
  accent,
}: {
  title: string;
  items: string[];
  kicker: string;
  accent: string;
}) {
  return (
    <div className="group rounded-[30px] border border-white bg-white/70 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40">
      <div
        className={`rounded-[24px] border border-white/70 bg-gradient-to-br ${accent} p-5`}
      >
        <div className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
          {kicker}
        </div>

        <h3 className="text-[1.25rem] font-black tracking-tight text-[#1A152E]">
          {title}
        </h3>

        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8B5CF6]" />
              <p className="text-[13px] leading-6 text-slate-500 md:text-[14px]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({
  icon,
  title,
  value,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <div className="group rounded-[30px] border border-white bg-white/70 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40">
      <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,#F8F4FF_0%,#F4F7FF_52%,#FFF8F1_100%)] p-5">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
          {icon}
        </div>

        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
          {title}
        </div>

        <h3 className="text-[1.2rem] font-black tracking-tight text-[#1A152E]">
          {value}
        </h3>

        <p className="mt-3 text-[13px] leading-relaxed text-slate-500 md:text-[14px]">
          {text}
        </p>
      </div>
    </div>
  );
}

function NextAction({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[20px] border border-slate-100 bg-white/85 px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-bold text-[#1A152E]">{title}</div>
          <p className="mt-1 text-[12px] leading-6 text-[#615C7A]">{text}</p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#8B5CF6] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}