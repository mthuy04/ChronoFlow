"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Clock3,
  MoonStar,
  Sparkles,
  SunMedium,
  Waves,
  CheckCircle2,
} from "lucide-react";

type Question = {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  options: {
    value: string;
    label: string;
    hint?: string;
  }[];
};

const questions: Question[] = [
  {
    id: "wake_style",
    title: "When do you usually feel mentally awake?",
    description:
      "Think about your natural pattern, not the schedule you wish you had.",
    icon: <SunMedium className="h-5 w-5 text-[#C07C2D]" />,
    options: [
      {
        value: "early",
        label: "Early morning",
        hint: "I feel clear and ready quite early.",
      },
      {
        value: "midmorning",
        label: "Late morning",
        hint: "I warm up a little later but still before noon.",
      },
      {
        value: "afternoon",
        label: "Afternoon",
        hint: "My focus really starts to click later in the day.",
      },
      {
        value: "evening",
        label: "Evening",
        hint: "I often feel most alert much later than others.",
      },
    ],
  },
  {
    id: "deep_work",
    title: "When is deep work easiest for you?",
    description:
      "Deep work means concentrated thinking, studying, writing, or problem solving.",
    icon: <Brain className="h-5 w-5 text-[#8B5CF6]" />,
    options: [
      {
        value: "morning",
        label: "Morning",
        hint: "This is when I can think most clearly.",
      },
      {
        value: "midday",
        label: "Midday",
        hint: "My strongest focus is usually around late morning to noon.",
      },
      {
        value: "late_afternoon",
        label: "Late afternoon",
        hint: "I tend to lock in later than most people.",
      },
      {
        value: "night",
        label: "Night",
        hint: "Evening is often my strongest cognitive window.",
      },
    ],
  },
  {
    id: "energy_dip",
    title: "When do you usually feel your energy dip most noticeably?",
    description:
      "This does not mean zero energy — just the period where things feel heavier.",
    icon: <Waves className="h-5 w-5 text-[#5B46FF]" />,
    options: [
      {
        value: "late_morning",
        label: "Late morning",
        hint: "My energy drops earlier than I would like.",
      },
      {
        value: "afternoon",
        label: "Afternoon",
        hint: "The classic afternoon slowdown hits me.",
      },
      {
        value: "evening",
        label: "Evening",
        hint: "I stay steady for a while, then drop later.",
      },
      {
        value: "irregular",
        label: "It feels irregular",
        hint: "My energy is less predictable day to day.",
      },
    ],
  },
  {
    id: "sleep_preference",
    title: "If life placed no pressure on your schedule, when would you naturally sleep?",
    description:
      "Imagine a free day or holiday where you are not forcing yourself to match a timetable.",
    icon: <MoonStar className="h-5 w-5 text-[#7866F2]" />,
    options: [
      {
        value: "sleep_early",
        label: "Sleep early, wake early",
        hint: "An early schedule feels natural to me.",
      },
      {
        value: "sleep_normal",
        label: "A fairly standard rhythm",
        hint: "I fit a typical daytime schedule reasonably well.",
      },
      {
        value: "sleep_late",
        label: "Sleep later, wake later",
        hint: "I naturally shift later than the average person.",
      },
      {
        value: "sleep_irregular",
        label: "My rhythm feels inconsistent",
        hint: "My timing is often less stable or predictable.",
      },
    ],
  },
  {
    id: "planning_style",
    title: "What kind of planning problem sounds most like you?",
    description:
      "Choose the statement that feels most familiar in real life.",
    icon: <Clock3 className="h-5 w-5 text-[#C07C2D]" />,
    options: [
      {
        value: "burnout_early",
        label: "I start strong but fade too early",
        hint: "My early momentum does not always last.",
      },
      {
        value: "steady_but_dip",
        label: "I feel fairly steady, but afternoons get softer",
        hint: "I need more realistic pacing later in the day.",
      },
      {
        value: "late_focus",
        label: "I struggle with early expectations but focus later",
        hint: "My best hours arrive after others expect them to.",
      },
      {
        value: "inconsistent",
        label: "My rhythm feels uneven and hard to predict",
        hint: "I need flexibility more than strict timing.",
      },
    ],
  },
];

export default function AssessmentPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const currentAnswer = answers[currentQuestion.id];
  const canGoNext = Boolean(currentAnswer);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  function handleSelect(value: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleNext() {
    if (!canGoNext || isSubmitting) return;

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      let data: unknown = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        console.error("FULL ERROR:", {
          status: res.status,
          data,
        });
      
        if (typeof data === "object" && data !== null && "error" in data) {
          alert((data as any).error);
        } else {
          alert("Failed to submit assessment");
        }
      
        return;
      }

      window.location.href = "/result";
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      alert("Something went wrong while submitting your assessment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E] overflow-x-hidden">
      <Navbar variant="guest" />

      <section className="relative overflow-hidden px-6 pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[8%] h-[280px] w-[280px] rounded-full bg-purple-100/30 blur-[110px]" />
          <div className="absolute right-[-6%] top-[10%] h-[230px] w-[230px] rounded-full bg-blue-100/25 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[28%] h-[220px] w-[220px] rounded-full bg-orange-100/20 blur-[90px]" />
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
              <Sparkles className="h-3 w-3" />
              Assessment
            </div>

            <h1 className="text-[clamp(2.1rem,4.8vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A152E]">
              Find the rhythm that fits you.
            </h1>

            <p className="mx-auto mt-5 max-w-[680px] text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
              This short assessment helps ChronoFlow understand your timing
              patterns, likely chronotype, and the parts of the day where your
              focus or recovery may fit best.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-[28px] border border-white bg-white/72 p-5 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                  Progress
                </div>
                <div className="mt-1 text-[14px] font-medium text-[#615C7A]">
                  Question {currentIndex + 1} of {total}
                </div>
              </div>

              <div className="rounded-full border border-white/80 bg-[#F7F2FF] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6]">
                {answeredCount}/{total} answered
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#F1ECFF]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#8B5CF6_0%,#D946EF_55%,#60A5FA_100%)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-[34px] border border-white bg-white/76 p-4 shadow-[0_18px_48px_rgba(36,31,61,0.06)] backdrop-blur-xl md:p-5">
            <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#F8F4FF_0%,#F4F7FF_52%,#FFF8F1_100%)] p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
                  {currentQuestion.icon}
                </div>

                <div className="rounded-full border border-white/80 bg-white/88 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#8B5CF6] shadow-sm">
                  Step {currentIndex + 1}
                </div>
              </div>

              <h2 className="text-[1.6rem] font-[850] leading-[1.15] tracking-tight text-[#1A152E] md:text-[2rem]">
                {currentQuestion.title}
              </h2>

              {currentQuestion.description && (
                <p className="mt-4 text-[14px] leading-7 text-[#615C7A] md:text-[15px]">
                  {currentQuestion.description}
                </p>
              )}

              <div className="mt-8 grid gap-3">
                {currentQuestion.options.map((option) => {
                  const active = currentAnswer === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`group rounded-[22px] border p-4 text-left transition-all duration-200 ${
                        active
                          ? "border-[#D9CCFF] bg-[#F7F2FF] shadow-[0_10px_24px_rgba(139,92,246,0.10)]"
                          : "border-white/80 bg-white/90 hover:border-[#E7DBFF] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div
                            className={`text-[15px] font-bold ${
                              active ? "text-[#5B46FF]" : "text-[#1A152E]"
                            }`}
                          >
                            {option.label}
                          </div>

                          {option.hint && (
                            <p className="mt-1 text-[13px] leading-6 text-[#615C7A]">
                              {option.hint}
                            </p>
                          )}
                        </div>

                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            active
                              ? "border-[#8B5CF6] bg-[#8B5CF6] text-white"
                              : "border-slate-200 bg-white text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentIndex === 0 || isSubmitting}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all ${
                    currentIndex === 0 || isSubmitting
                      ? "cursor-not-allowed text-slate-300"
                      : "text-[#615C7A] hover:text-[#1A152E]"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext || isSubmitting}
                  className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black transition-all ${
                    !canGoNext || isSubmitting
                      ? "cursor-not-allowed bg-slate-200 text-slate-400"
                      : "bg-[#1A152E] text-white shadow-lg shadow-purple-200/50 hover:scale-[1.02]"
                  }`}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : currentIndex === total - 1
                    ? "Finish assessment"
                    : "Continue"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-[28px] border border-white bg-white/70 p-5 shadow-sm">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
              Good next upgrades
            </div>
            <ul className="space-y-2 text-[14px] leading-7 text-[#615C7A]">
              <li>• add route protection if only logged-in users may submit</li>
              <li>• save unfinished progress for later resume</li>
              <li>• animate transitions between questions</li>
              <li>• map scoring with weighted answers in more detail</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}