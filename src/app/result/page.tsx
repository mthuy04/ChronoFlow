import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Script from "next/script"; // Thêm Script để tracking không cần tách file
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

// Định nghĩa Metadata cho các loại nhịp sinh học
const chronotypeMeta = {
  LION: {
    name: "Lion",
    label: "Early energy pattern",
    icon: <Sun className="h-5 w-5 text-[#C98C42]" />,
    accent: "#C98C42",
    gradient: "from-[#FFF9F0] via-[#FFF4DE] to-[#FDF2E9]",
    summary: "You tend to wake up more easily, feel mentally sharper earlier in the day...",
    strengths: ["Morning clarity can come more naturally", "Early structure may feel easier to sustain", "High-focus work often fits best earlier"],
    cautions: ["Energy may fade earlier than expected", "Late-day deep work can feel heavy", "Recovery and pacing matter more by evening"],
    suggestions: [
      { title: "Deep work window", value: "7:00 AM – 10:00 AM", text: "Use early hours for concentrated thinking.", icon: <Brain className="h-5 w-5 text-[#C98C42]" /> },
      { title: "Lighter work", value: "2:00 PM – 5:00 PM", text: "Move admin tasks into later periods.", icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" /> },
      { title: "Recovery reminder", value: "Slow down earlier", text: "Protect your evening focus.", icon: <MoonStar className="h-5 w-5 text-[#5B46FF]" /> },
    ],
  },
  BEAR: {
    name: "Bear",
    label: "Balanced daytime pattern",
    icon: <Sunset className="h-5 w-5 text-[#6C58F2]" />,
    accent: "#6C58F2",
    gradient: "from-[#F8F7FF] via-[#F1EBFF] to-[#E9E4FF]",
    summary: "You likely follow a more conventional daytime rhythm...",
    strengths: ["Steady daytime energy", "Typical daytime schedule feels workable", "Focus easier to distribute"],
    cautions: ["Afternoon dips need adjustment", "Generic planning can be too rigid", "Recovery should not be ignored"],
    suggestions: [
      { title: "Deep work window", value: "9:00 AM – 12:00 PM", text: "Strong zone for focused work.", icon: <Brain className="h-5 w-5 text-[#6C58F2]" /> },
      { title: "Lighter work", value: "2:00 PM – 4:00 PM", text: "Use afternoon for meetings.", icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" /> },
      { title: "Recovery reminder", value: "Respect the dip", text: "Afternoon dip is normal.", icon: <MoonStar className="h-5 w-5 text-[#C07C2D]" /> },
    ],
  },
  WOLF: {
    name: "Wolf",
    label: "Late energy pattern",
    icon: <Moon className="h-5 w-5 text-[#5B46FF]" />,
    accent: "#5B46FF",
    gradient: "from-[#F5F5FF] via-[#ECEBFF] to-[#E2E1FF]",
    summary: "You tend to warm up more slowly and feel alert later in the day...",
    strengths: ["Creative energy rises later", "Late-day deep work is natural", "Strong focus depends on timing"],
    cautions: ["Early expectations feel heavy", "Generic schedules create guilt", "Protect evening focus"],
    suggestions: [
      { title: "Deep work window", value: "7:00 PM – 10:00 PM", text: "Strong time for creation.", icon: <Brain className="h-5 w-5 text-[#5B46FF]" /> },
      { title: "Lighter work", value: "9:00 AM – 12:00 PM", text: "Use earlier hours for admin.", icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" /> },
      { title: "Recovery reminder", value: "Protect your reset", text: "Evening focus must be sustainable.", icon: <MoonStar className="h-5 w-5 text-[#C07C2D]" /> },
    ],
  },
  DOLPHIN: {
    name: "Dolphin",
    label: "Irregular energy pattern",
    icon: <Waves className="h-5 w-5 text-[#8A7AF0]" />,
    accent: "#8A7AF0",
    gradient: "from-[#F9F8FF] via-[#F3EFFF] to-[#EBE6FF]",
    summary: "Your rhythm may feel lighter, less predictable...",
    strengths: ["Aware of subtle energy shifts", "Flexible structure works better", "Smaller wins are powerful"],
    cautions: ["Inconsistency creates frustration", "Comparing to others is discouraging", "Sleep protection is vital"],
    suggestions: [
      { title: "Deep work window", value: "Clear moments", text: "Track clarity, don't force slots.", icon: <Brain className="h-5 w-5 text-[#8A7AF0]" /> },
      { title: "Lighter work", value: "Keep it flexible", text: "Use lower-energy for routine tasks.", icon: <Clock3 className="h-5 w-5 text-[#8B5CF6]" /> },
      { title: "Recovery reminder", value: "Be gentler", text: "Lighter rhythm needs compassion.", icon: <MoonStar className="h-5 w-5 text-[#C07C2D]" /> },
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
          <p className="mt-4 text-[#615C7A]">Please sign in first.</p>
          <div className="mt-8"><Link href="/auth/login" className="cf-btn-primary">Sign in</Link></div>
        </div>
        <Footer />
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { chronotypeResults: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const latest = user?.chronotypeResults?.[0];

  if (!user || !latest || !user.chronotype) {
    return (
      <main className="min-h-screen bg-[#FCFBFF]">
        <Navbar variant="user" />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-black text-[#1A152E]">No result yet</h1>
          <div className="mt-8"><Link href="/assessment" className="cf-btn-primary">Start assessment</Link></div>
        </div>
        <Footer />
      </main>
    );
  }

  const chronotypeKey = user.chronotype as keyof typeof chronotypeMeta;
  const meta = chronotypeMeta[chronotypeKey];

  return (
    <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E] overflow-x-hidden">
      <Navbar variant="user" />

      {/* --- PHẦN TRACKING GA4 KHÔNG TÁCH FILE --- */}
      <Script id="ga-result-tracking" strategy="afterInteractive">
        {`
          if (window.gtag) {
            window.gtag('event', 'view_chronotype_result', {
              chronotype: '${meta.name}',
              lion_score: ${latest.lionScore},
              bear_score: ${latest.bearScore},
              wolf_score: ${latest.wolfScore},
              dolphin_score: ${latest.dolphinScore},
              user_id: '${session.user.email}'
            });
          }
        `}
      </Script>

      <section className="relative overflow-hidden px-6 pt-14 pb-16 md:pt-18 md:pb-24">
        {/* Background Blurs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[8%] h-[280px] w-[280px] rounded-full bg-purple-100/30 blur-[110px]" />
          <div className="absolute right-[-6%] top-[10%] h-[230px] w-[230px] rounded-full bg-blue-100/25 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-50 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
              <Sparkles className="h-3 w-3" /> Your result
            </div>
            <h1 className="text-[clamp(2.2rem,5vw,4.4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A152E]">
              Your rhythm looks most like a <span className="font-serif italic" style={{ color: meta.accent }}>{meta.name}</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-[15px] leading-8 text-[#615C7A]">
              This result helps you think more clearly about timing and focus.
            </p>
          </div>

          {/* Result Card */}
          <div className="mt-12 rounded-[36px] border border-white bg-white/65 p-3 shadow-lg backdrop-blur-xl">
            <div className={`rounded-[30px] border border-white/70 bg-gradient-to-br ${meta.gradient} p-6 md:p-8`}>
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                {/* Info Box */}
                <div className="rounded-[26px] border border-white/70 bg-white/72 p-6 shadow-sm">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white shadow-sm">{meta.icon}</div>
                    <div className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: meta.accent }}>{meta.label}</div>
                  </div>
                  <h2 className="text-[2rem] font-[900] leading-[1.05] text-[#1A152E]">{meta.name}</h2>
                  <p className="mt-4 text-[14px] leading-7 text-[#615C7A]">{meta.summary}</p>
                </div>

                {/* Score Chart Preview */}
                <div className="rounded-[26px] border border-white/70 bg-white/72 p-6 shadow-sm">
                   <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">Energy rhythm preview</div>
                   <div className="relative aspect-[16/9] rounded-[22px] bg-white p-4">
                      {/* SVG Curves based on chronotypeKey */}
                      <svg viewBox="0 0 420 180" className="h-full w-full" fill="none">
                        <path d={chronotypeKey === "LION" ? "M10 120 C70 92, 180 34, 410 140" : chronotypeKey === "WOLF" ? "M10 132 C190 122, 338 72, 410 62" : "M10 126 C190 72, 350 110, 410 130"} stroke={meta.accent} strokeWidth="5" strokeLinecap="round" />
                      </svg>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              href="/planner" 
              className="cf-btn-primary"
              onClick={() => { if (window.gtag) window.gtag('event', 'click_continue_planner', { from: 'result_page' }); }}
            >
              Continue to planner
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5B46FF]"
              onClick={() => { if (window.gtag) window.gtag('event', 'click_read_more', { from: 'result_page' }); }}
            >
              Read more first <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}