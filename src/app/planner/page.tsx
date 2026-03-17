import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PlannerClient from "@/components/planner/PlannerClient";

const chronotypePlannerMeta = {
  LION: {
    name: "Lion",
    accent: "#C98C42",
    gradient: "from-[#FFF9F0] via-[#FFF4DE] to-[#FDF2E9]",
    intro:
      "Your rhythm tends to favor earlier focus. Protect your strongest hours first, then let the day soften naturally.",
    blocks: [
      {
        label: "Deep work",
        time: "7:00 AM – 10:00 AM",
        text: "Best for concentrated study, writing, analysis, and demanding thinking.",
      },
      {
        label: "Lighter work",
        time: "1:00 PM – 4:00 PM",
        text: "Good for admin, communication, follow-up, and routine maintenance.",
      },
      {
        label: "Recovery",
        time: "Evening",
        text: "Slow down earlier so tomorrow’s clarity stays strong.",
      },
    ],
  },
  BEAR: {
    name: "Bear",
    accent: "#6C58F2",
    gradient: "from-[#F8F7FF] via-[#F1EBFF] to-[#E9E4FF]",
    intro:
      "Your rhythm is more balanced across the day. The key is pacing well and respecting softer afternoon energy.",
    blocks: [
      {
        label: "Deep work",
        time: "9:00 AM – 12:00 PM",
        text: "A reliable zone for focused tasks, study blocks, and higher-priority work.",
      },
      {
        label: "Lighter work",
        time: "2:00 PM – 4:00 PM",
        text: "Use this period for meetings, admin, planning, or collaborative work.",
      },
      {
        label: "Recovery",
        time: "Late afternoon / evening",
        text: "Do not treat the afternoon dip as failure. Adjust task intensity instead.",
      },
    ],
  },
  WOLF: {
    name: "Wolf",
    accent: "#5B46FF",
    gradient: "from-[#F5F5FF] via-[#ECEBFF] to-[#E2E1FF]",
    intro:
      "Your rhythm often rises later than conventional schedules expect. Plan around that instead of fighting it.",
    blocks: [
      {
        label: "Deep work",
        time: "7:00 PM – 10:00 PM",
        text: "Strong for late-day focus, writing, creative work, and difficult thinking.",
      },
      {
        label: "Lighter work",
        time: "9:00 AM – 12:00 PM",
        text: "Use earlier hours for lower-pressure tasks, setup, and communication.",
      },
      {
        label: "Recovery",
        time: "Late night boundary",
        text: "Protect sleep while still using your evening momentum intelligently.",
      },
    ],
  },
  DOLPHIN: {
    name: "Dolphin",
    accent: "#8A7AF0",
    gradient: "from-[#F9F8FF] via-[#F3EFFF] to-[#EBE6FF]",
    intro:
      "Your rhythm may feel less predictable. Flexible pacing and smaller protected focus windows matter more than rigid templates.",
    blocks: [
      {
        label: "Deep work",
        time: "Use your clearest windows",
        text: "Protect the moments where focus appears instead of forcing the same slot every day.",
      },
      {
        label: "Lighter work",
        time: "Default low-pressure periods",
        text: "Keep routine tasks ready for moments when your energy feels softer.",
      },
      {
        label: "Recovery",
        time: "Throughout the day",
        text: "Gentler pacing and stronger sleep hygiene may matter more than strict schedules.",
      },
    ],
  },
} as const;

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E] overflow-x-hidden">
        <Navbar variant="guest" />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-black text-[#1A152E]">
            Sign in required
          </h1>
          <p className="mt-4 text-[#615C7A]">
            You need to sign in before opening your planner.
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
      tasks: {
        orderBy: { createdAt: "desc" },
      },
      weeklyInsights: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E] overflow-x-hidden">
        <Navbar variant="user" />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-black text-[#1A152E]">
            User not found
          </h1>
          <p className="mt-4 text-[#615C7A]">
            Your account could not be loaded from the database.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const chronotypeKey =
    (user.chronotype as keyof typeof chronotypePlannerMeta) || "BEAR";

  const plannerMeta = chronotypePlannerMeta[chronotypeKey];
  const latestInsight = user.weeklyInsights[0] ?? null;
  const pendingTasks = user.tasks.filter((task) => !task.completed);
  const completedTasks = user.tasks.filter((task) => task.completed);

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
          <PlannerClient
            plannerMeta={plannerMeta}
            latestInsight={latestInsight}
            tasks={user.tasks}
            pendingTasksCount={pendingTasks.length}
            completedTasksCount={completedTasks.length}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}