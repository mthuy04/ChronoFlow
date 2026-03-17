"use client";

import Link from "next/link";
import {
  ArrowRight,
  Moon,
  SunMedium,
  Waves,
  Sparkles,
  Zap,
  Coffee,
  Bed,
} from "lucide-react";
import type { ReactNode } from "react";

interface ChipProps {
  icon: ReactNode;
  label: string;
}

interface LegendProps {
  color: string;
  label: string;
}

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  text: string;
}

const energyPaths = [
  {
    name: "Lion",
    color: "#B7772E",
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",
    pos: "left-[24%] top-[10%]",
  },
  {
    name: "Bear",
    color: "#6C58F2",
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png",
    pos: "left-[44%] top-[24%]",
  },
  {
    name: "Wolf",
    color: "#5B46FF",
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png",
    pos: "left-[66%] top-[14%]",
  },
  {
    name: "Dolphin",
    color: "#8A7AF0",
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    pos: "left-[78%] top-[36%]",
  },
];

export default function EnergyCurveSection() {
  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] py-16 md:py-24">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[18%] h-[300px] w-[300px] rounded-full bg-purple-100/20 blur-[100px]" />
        <div className="absolute right-[-5%] top-[10%] h-[250px] w-[250px] rounded-full bg-blue-100/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[28%] h-[220px] w-[220px] rounded-full bg-orange-100/20 blur-[90px]" />
      </div>

      <div className="section-container mx-auto max-w-5xl px-6">
        {/* ===== INTRO ===== */}
        <div className="mx-auto mb-12 max-w-[680px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
            <Sparkles className="h-3 w-3" />
            Energy Waves
          </div>

          <h2 className="text-3xl font-[900] leading-[1.1] tracking-tight text-[#1A152E] md:text-5xl">
            Your day is not flat. <br />
            It moves in{" "}
            <span className="font-serif italic text-[#8B5CF6]">waves.</span>
          </h2>

          <p className="mt-6 text-[15px] font-medium leading-relaxed text-slate-500">
            ChronoFlow maps your natural highs and lows, so your work can
            follow a rhythm that feels actually realistic.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/80 bg-white/78 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
              What this means
            </div>
            <p className="text-[14px] leading-7 text-[#615C7A]">
              Not every hour should hold the same kind of work. Deep focus,
              admin tasks, meetings, recovery, and sleep each fit better at
              different points in your energy curve.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Chip
              icon={<Zap className="h-3.5 w-3.5 text-amber-500" />}
              label="Peak windows"
            />
            <Chip
              icon={<Coffee className="h-3.5 w-3.5 text-purple-500" />}
              label="Recovery zones"
            />
            <Chip
              icon={<Waves className="h-3.5 w-3.5 text-blue-500" />}
              label="Rhythm-aware planning"
            />
          </div>
        </div>

        {/* ===== DASHBOARD ===== */}
        <div className="relative group">
          <div className="rounded-[40px] border border-white bg-white/40 p-2 shadow-xl backdrop-blur-xl">
            <div className="overflow-hidden rounded-[32px] border border-slate-50 bg-white p-6 md:p-10">
              <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Rhythm Map
                  </div>
                  <div className="mt-2 text-[1.75rem] font-[900] leading-[1.08] tracking-tight text-[#1A152E] md:text-[2.25rem]">
                    Different chronotypes peak at different times
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {energyPaths.map((p) => (
                    <Legend key={p.name} color={p.color} label={p.name} />
                  ))}
                </div>
              </div>

              {/* The Graph */}
              <div className="relative aspect-[21/9] w-full">
                <svg
                  viewBox="0 0 820 300"
                  className="h-full w-full overflow-visible opacity-90"
                  fill="none"
                >
                  {/* Lion */}
                  <path
                    d="M40 220 C150 200, 200 40, 300 40 C450 40, 500 220, 780 240"
                    stroke="#df8723"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />

                  {/* Bear */}
                  <path
                    d="M40 240 C150 220, 250 80, 400 80 C550 80, 650 240, 780 240"
                    stroke="#6C58F2"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />

                  {/* Wolf */}
                  <path
                    d="M40 260 C200 260, 400 240, 550 60 C650 30, 700 80, 780 220"
                    stroke="#4e3d2bd1"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />

                  {/* Dolphin */}
                  <path
                    d="M40 248 C100 180, 145 255, 220 150 C290 55, 345 250, 430 175 C510 105, 570 120, 640 185 C700 240, 740 210, 780 170"
                    stroke="#5c7ff4"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray="10 10"
                    className="drop-shadow-sm"
                  />
                </svg>

                {/* Animal Markers */}
                {energyPaths.map((p) => (
                  <div
                    key={p.name}
                    className={`absolute ${p.pos} z-20 h-14 w-14 transition-transform duration-500 hover:scale-125`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.emoji}
                      alt={p.name}
                      className="h-full w-full object-contain drop-shadow-xl"
                    />
                  </div>
                ))}

                {/* annotation pills */}
                <div className="absolute left-[10%] top-[18%] rounded-full border border-white/80 bg-white/92 px-4 py-2 text-xs font-bold text-[#df8723] shadow-sm">
                  Lion peaks earlier
                </div>

                <div className="absolute right-[10%] top-[22%] rounded-full border border-white/80 bg-white/92 px-4 py-2 text-xs font-bold text-[#4e3d2bd1] shadow-sm">
                  Wolf rises later
                </div>

                <div className="absolute right-[16%] bottom-[26%] rounded-full border border-white/80 bg-white/92 px-4 py-2 text-xs font-bold text-[#5c7ff4] shadow-sm">
                  Dolphin is less predictable
                </div>

                <div className="absolute bottom-[-15%] inset-x-0 flex justify-between text-[10px] font-bold uppercase text-slate-300">
                  <span>6 AM</span>
                  <span>12 PM</span>
                  <span>6 PM</span>
                  <span>12 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== INSIGHTS ===== */}
        <div className="mt-20 grid gap-4 md:grid-cols-3">
          <InsightCard
            icon={<Zap className="h-5 w-5 text-amber-500" />}
            title="Peak Focus"
            value="2–4 Hours"
            text="Your best cognitive window is limited. Timing matters more than sheer effort."
          />
          <InsightCard
            icon={<Coffee className="h-5 w-5 text-purple-500" />}
            title="Afternoon Dip"
            value="Natural Shift"
            text="A drop in alertness is not failure. It often means your task type should shift."
          />
          <InsightCard
            icon={<Bed className="h-5 w-5 text-blue-500" />}
            title="Night Reset"
            value="Protect Sleep"
            text="Evening recovery is part of performance. It is the fuel for tomorrow's better focus."
          />
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-12 text-center">
          <p className="mx-auto mb-5 max-w-2xl text-[14px] leading-7 text-[#615C7A]">
            The point is not to chase a perfect graph. It is to understand where
            your day naturally supports deep focus, lighter work, social energy,
            and recovery — then plan with that rhythm instead of against it.
          </p>

          <Link
            href="/assessment"
            className="group inline-flex items-center gap-2 rounded-full bg-[#1A152E] px-8 py-4 text-sm font-black text-white shadow-lg shadow-purple-200/50 transition-all hover:scale-105"
          >
            Map My Energy Wave
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- Sub-components ---

function Chip({ icon, label }: ChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-[12px] font-bold text-slate-600 shadow-sm">
      {icon}
      {label}
    </div>
  );
}

function Legend({ color, label }: LegendProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[9px] font-black uppercase text-slate-500">
        {label}
      </span>
    </div>
  );
}

function InsightCard({ icon, title, value, text }: InsightCardProps) {
  return (
    <div className="group rounded-[28px] border border-white bg-white/60 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-50 bg-white shadow-sm transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="mb-1 block text-[9px] font-black uppercase tracking-widest text-purple-400">
        {title}
      </span>
      <h4 className="mb-2 text-xl font-black text-[#1A152E]">{value}</h4>
      <p className="text-[12px] font-medium leading-relaxed text-slate-500">
        {text}
      </p>
    </div>
  );
}