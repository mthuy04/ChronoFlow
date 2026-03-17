import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ArrowRight,
  Moon,
  Sun,
  Sunset,
  Waves,
  Sparkles,
  Brain,
  Clock3,
  CalendarDays,
  CheckCircle2,
  MoonStar,
} from "lucide-react";

const chronotypeMeta = {
  LION: {
    name: "Lion",
    label: "Early energy pattern",
    icon: <Sun className="h-5 w-5 text-[#C98C42]" />,
    accent: "#C98C42",
    gradient: "from-[#FFF9F0] via-[#FFF4DE] to-[#FDF2E9]",
    summary:
      "You tend to wake up more easily, feel mentally sharper earlier in the day, and often lose momentum sooner than later chronotypes.",
    strengths: [
      "Morning clarity can come more naturally",
      "Early structure may feel easier to sustain",
      "High-focus work often fits best earlier",
    ],
    cautions: [
      "Energy may fade earlier than expected",
      "Late-day deep work can feel heavy",
      "Recovery and pacing matter more by evening",
    ],
    suggestions: [
      {
        title: "Deep work window",
        value: "7:00 AM – 10:00 AM",
        text: "Use early hours for concentrated thinking, writing, or study.",
        icon: <Brain className="h-5 w-5 text-[#C98C42]" />,
      },
      {
        title: "Lighter work",
        value: "2:00 PM – 5:00 PM",
        text: "Move admin and lower-pressure tasks into later periods.",
        icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" />,
      },
      {
        title: "Recovery reminder",
        value: "Slow down earlier",
        text: "Protect your evening so tomorrow’s energy can stay strong.",
        icon: <MoonStar className="h-5 w-5 text-[#5B46FF]" />,
      },
    ],
  },
  BEAR: {
    name: "Bear",
    label: "Balanced daytime pattern",
    icon: <Sunset className="h-5 w-5 text-[#6C58F2]" />,
    accent: "#6C58F2",
    gradient: "from-[#F8F7FF] via-[#F1EBFF] to-[#E9E4FF]",
    summary:
      "You likely follow a more conventional daytime rhythm, with relatively steady energy through the morning and a softer slowdown later on.",
    strengths: [
      "Steady daytime energy can support consistency",
      "A typical daytime schedule may feel workable",
      "Focus may be easier to distribute across the day",
    ],
    cautions: [
      "Afternoon dips may still need task adjustment",
      "Generic planning can still become too rigid",
      "Recovery should not be ignored just because rhythm feels stable",
    ],
    suggestions: [
      {
        title: "Deep work window",
        value: "9:00 AM – 12:00 PM",
        text: "This is often a strong zone for focused work and study.",
        icon: <Brain className="h-5 w-5 text-[#6C58F2]" />,
      },
      {
        title: "Lighter work",
        value: "2:00 PM – 4:00 PM",
        text: "Use softer afternoon hours for meetings or maintenance tasks.",
        icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" />,
      },
      {
        title: "Recovery reminder",
        value: "Respect the dip",
        text: "A softer afternoon is normal, not a sign that discipline failed.",
        icon: <MoonStar className="h-5 w-5 text-[#C07C2D]" />,
      },
    ],
  },
  WOLF: {
    name: "Wolf",
    label: "Late energy pattern",
    icon: <Moon className="h-5 w-5 text-[#5B46FF]" />,
    accent: "#5B46FF",
    gradient: "from-[#F5F5FF] via-[#ECEBFF] to-[#E2E1FF]",
    summary:
      "You tend to warm up more slowly and often feel more mentally alert later in the day. Your strongest focus may arrive after conventional schedules expect.",
    strengths: [
      "Creative and analytical energy may rise later than average",
      "Late-day deep work can feel more natural",
      "Strong focus may depend more on timing than force",
    ],
    cautions: [
      "Early expectations can feel heavier than they do for others",
      "Generic schedules may create unnecessary guilt",
      "Protecting evening focus without damaging sleep matters",
    ],
    suggestions: [
      {
        title: "Deep work window",
        value: "7:00 PM – 10:00 PM",
        text: "A strong time for concentrated work, study, and creation.",
        icon: <Brain className="h-5 w-5 text-[#5B46FF]" />,
      },
      {
        title: "Lighter work",
        value: "9:00 AM – 12:00 PM",
        text: "Use earlier hours for lower-pressure admin or communication.",
        icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" />,
      },
      {
        title: "Recovery reminder",
        value: "Protect your reset",
        text: "Evening focus is useful only if it stays sustainable.",
        icon: <MoonStar className="h-5 w-5 text-[#C07C2D]" />,
      },
    ],
  },
  DOLPHIN: {
    name: "Dolphin",
    label: "Irregular energy pattern",
    icon: <Waves className="h-5 w-5 text-[#8A7AF0]" />,
    accent: "#8A7AF0",
    gradient: "from-[#F9F8FF] via-[#F3EFFF] to-[#EBE6FF]",
    summary:
      "Your rhythm may feel lighter, less predictable, or more fragile than the other patterns. Flexibility and gentler pacing often matter more here than rigid timing.",
    strengths: [
      "You may become highly aware of subtle energy shifts",
      "Flexible structure can work better than forced intensity",
      "Smaller wins and pacing strategies may be powerful",
    ],
    cautions: [
      "Inconsistency can create frustration if plans are too rigid",
      "Comparing yourself to steadier rhythms may feel discouraging",
      "Recovery and sleep protection become especially important",
    ],
    suggestions: [
      {
        title: "Deep work window",
        value: "Use your clearest moments",
        text: "Track when clarity appears and protect it instead of forcing a fixed slot.",
        icon: <Brain className="h-5 w-5 text-[#8A7AF0]" />,
      },
      {
        title: "Lighter work",
        value: "Keep it flexible",
        text: "Use lower-energy periods for easier admin or routine tasks.",
        icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" />,
      },
      {
        title: "Recovery reminder",
        value: "Be gentler with pacing",
        text: "A lighter rhythm needs compassion, not punishment.",
        icon: <MoonStar className="h-5 w-5 text-[#C07C2D]" />,
      },
    ],
  },
} as const;

export default async function ResultPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen bg-[#FCFBFF]">
        <Navbar variant="guest" />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-black text-[#1A152E]">Unauthorized</h1>
          <p className="mt-4 text-[#615C7A]">
            Please sign in and complete the assessment first.
          </p>
          <div className="mt-8">
            <Link href="/auth/login" className="cf-btn-primary">
              Sign in
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      chronotypeResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const latest = user?.chronotypeResults?.[0];

  if (!user || !latest || !user.chronotype) {
    return (
      <main className="min-h-screen bg-[#FCFBFF]">
        <Navbar variant="user" />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-black text-[#1A152E]">
            No result yet
          </h1>
          <p className="mt-4 text-[#615C7A]">
            You need to complete the assessment before viewing your rhythm
            result.
          </p>
          <div className="mt-8">
            <Link href="/assessment" className="cf-btn-primary">
              Start assessment
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const chronotypeKey =
    user.chronotype as keyof typeof chronotypeMeta;

  const meta = chronotypeMeta[chronotypeKey];

  return (
    <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E] overflow-x-hidden">
      <Navbar variant="user" />

      <section className="relative overflow-hidden px-6 pt-14 pb-16 md:pt-18 md:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[8%] h-[280px] w-[280px] rounded-full bg-purple-100/30 blur-[110px]" />
          <div className="absolute right-[-6%] top-[10%] h-[230px] w-[230px] rounded-full bg-blue-100/25 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[28%] h-[220px] w-[220px] rounded-full bg-orange-100/20 blur-[90px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
              <Sparkles className="h-3 w-3" />
              Your result
            </div>

            <h1 className="text-[clamp(2.2rem,5vw,4.4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A152E]">
              Your rhythm looks most like a{" "}
              <span className="font-serif italic" style={{ color: meta.accent }}>
                {meta.name}
              </span>
              .
            </h1>

            <p className="mx-auto mt-6 max-w-[700px] text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
              This result is a practical starting point, not a cage. It helps
              you think more clearly about timing, focus, recovery, and how to
              plan your day in a way that fits better.
            </p>
          </div>

          <div className="mt-12 rounded-[36px] border border-white bg-white/65 p-3 shadow-[0_18px_48px_rgba(36,31,61,0.08)] backdrop-blur-xl">
            <div
              className={`rounded-[30px] border border-white/70 bg-gradient-to-br ${meta.gradient} p-6 md:p-8`}
            >
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[26px] border border-white/70 bg-white/72 p-6 shadow-sm">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm">
                      {meta.icon}
                    </div>

                    <div
                      className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm"
                      style={{ color: meta.accent }}
                    >
                      {meta.label}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                    Likely chronotype
                  </div>

                  <h2 className="mt-2 text-[2rem] font-[900] leading-[1.05] tracking-tight text-[#1A152E] md:text-[2.5rem]">
                    {meta.name}
                  </h2>

                  <p className="mt-4 text-[14px] leading-7 text-[#615C7A] md:text-[15px]">
                    {meta.summary}
                  </p>

                  <div className="mt-6 rounded-[20px] border border-white/80 bg-[#F8F5FF] p-4">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                      Your scores
                    </div>
                    <div className="grid gap-2 text-[13px] text-[#615C7A]">
                      <div>Lion: {latest.lionScore}</div>
                      <div>Bear: {latest.bearScore}</div>
                      <div>Wolf: {latest.wolfScore}</div>
                      <div>Dolphin: {latest.dolphinScore}</div>
                    </div>
                  </div>
                </div>

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
                        {chronotypeKey === "LION" && (
                          <path
                            d="M10 120 C70 92, 120 40, 180 34 C240 30, 285 72, 340 110 C380 134, 400 138, 410 140"
                            stroke={meta.accent}
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                        )}
                        {chronotypeKey === "BEAR" && (
                          <path
                            d="M10 126 C72 118, 130 84, 190 72 C245 62, 298 78, 350 110 C385 130, 402 132, 410 130"
                            stroke={meta.accent}
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                        )}
                        {chronotypeKey === "WOLF" && (
                          <path
                            d="M10 132 C72 132, 130 130, 190 122 C250 114, 298 98, 338 72 C372 50, 395 46, 410 62"
                            stroke={meta.accent}
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                        )}
                        {chronotypeKey === "DOLPHIN" && (
                          <path
                            d="M10 128 C48 94, 86 136, 130 88 C170 46, 215 126, 260 98 C298 74, 332 128, 372 96 C392 80, 402 74, 410 82"
                            stroke={meta.accent}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="8 8"
                          />
                        )}
                      </svg>

                      <div
                        className="absolute left-[56%] top-[28%] rounded-full border border-white/80 bg-white px-3 py-1.5 text-[11px] font-bold shadow-sm"
                        style={{ color: meta.accent }}
                      >
                        {chronotypeKey === "LION" && "Focus comes earlier"}
                        {chronotypeKey === "BEAR" && "More balanced daytime rhythm"}
                        {chronotypeKey === "WOLF" && "Focus rises later"}
                        {chronotypeKey === "DOLPHIN" && "More irregular pattern"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <InfoListCard
              title="Likely strengths"
              items={meta.strengths}
              kicker="What may feel natural"
              accent="from-[#F3F2FF] to-[#E9E6FF]"
            />
            <InfoListCard
              title="Things to watch"
              items={meta.cautions}
              kicker="What may create friction"
              accent="from-[#FFF8F0] to-[#FCEFE2]"
            />
          </div>

          <div className="mt-10">
            <div className="mx-auto max-w-[760px] text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
                <CalendarDays className="h-3 w-3" />
                Suggested planning
              </div>

              <h2 className="text-3xl font-[900] leading-[1.1] tracking-tight text-[#1A152E] md:text-4xl">
                What your day could look like.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {meta.suggestions.map((item) => (
                <SuggestionCard key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      </section>

      <Footer />
    </main>
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