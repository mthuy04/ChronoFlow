import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PlannerBoard from "@/components/planner/PlannerBoard";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Chronotype = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

function normalizeChronotype(value: string | null | undefined): Chronotype {
  const key = String(value || "BEAR").toUpperCase();
  if (key.includes("LION")) return "LION";
  if (key.includes("WOLF")) return "WOLF";
  if (key.includes("DOLPHIN")) return "DOLPHIN";
  return "BEAR";
}

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F7F4FB] text-[#241F3D]">
        <Navbar />
        <section className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-white/80 bg-white/90 p-10 text-center shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
            <div className="mb-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#F7F4FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              ChronoFlow Planner
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D] md:text-5xl">
              Bạn cần đăng nhập để mở planner
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[#615C7A]">
              Đăng nhập để xem lịch theo chronotype, thêm task, theo dõi focus
              block và sắp xếp planner theo nhịp sinh học của bạn.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/login?callbackUrl=/planner"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)] transition hover:-translate-y-0.5"
              >
                Đăng nhập
              </Link>

              <Link
                href="/assessment"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-6 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
              >
                Làm bài đánh giá trước
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tasks: {
        orderBy: {
          createdAt: "desc",
        },
      },
      weeklyInsights: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F7F4FB] text-[#241F3D]">
        <Navbar />
        <section className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-white/80 bg-white/90 p-10 text-center shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D]">
              Không tìm thấy tài khoản
            </h1>
            <p className="mt-4 text-[15px] leading-8 text-[#615C7A]">
              Tài khoản của bạn chưa load được từ database. Hãy thử đăng nhập lại.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const latestInsight =
    user.weeklyInsights[0] == null
      ? null
      : {
          id: user.weeklyInsights[0].id,
          weekLabel: user.weeklyInsights[0].weekLabel,
          alignmentScore: user.weeklyInsights[0].alignmentScore,
          completedCount: user.weeklyInsights[0].completedCount,
          totalCount: user.weeklyInsights[0].totalCount,
          deepWorkCount: user.weeklyInsights[0].deepWorkCount,
          recommendation: user.weeklyInsights[0].recommendation,
          summary: user.weeklyInsights[0].summary,
          createdAt: user.weeklyInsights[0].createdAt.toISOString(),
        };

  const chronotype = normalizeChronotype(user.chronotype);

  const tasks = user.tasks.map((task) => ({
    id: task.id,
    name: task.name,
    type: task.type,
    priority: task.priority,
    duration: task.duration,
    deadline: task.deadline,
    scheduledTime: task.scheduledTime,
    explanation: task.explanation,
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F4FB] text-[#241F3D]">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-4 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[8%] h-[280px] w-[280px] rounded-full bg-purple-100/35 blur-[110px]" />
          <div className="absolute right-[-6%] top-[10%] h-[230px] w-[230px] rounded-full bg-blue-100/30 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[30%] h-[240px] w-[240px] rounded-full bg-fuchsia-100/20 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(#CFC7E8 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
        </div>

        <div className="mx-auto max-w-[1280px]">
          <PlannerBoard
            userName={user.name}
            chronotype={chronotype}
            initialTasks={tasks}
            latestInsight={latestInsight}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}