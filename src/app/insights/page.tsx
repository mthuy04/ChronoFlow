import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ListChecks,
  MoonStar,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Activity,
  ShieldCheck,
  PieChart,
  Layers3,
  Flame,
  ListTodo,
} from "lucide-react";

type ChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

type TaskLite = {
  id: string;
  name: string;
  type: string;
  priority: string;
  duration: string;
  deadline: string | null;
  scheduledTime: string;
  explanation: string;
  completed: boolean;
  createdAt: Date;
};

function normalizeChronotype(value: string | null | undefined): ChronotypeKey | null {
  if (!value) return null;
  const key = String(value).toUpperCase();
  if (key.includes("LION")) return "LION";
  if (key.includes("WOLF")) return "WOLF";
  if (key.includes("DOLPHIN")) return "DOLPHIN";
  if (key.includes("BEAR")) return "BEAR";
  return null;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseTaskStartTime(scheduledTime: string | null | undefined): string | null {
  const raw = String(scheduledTime || "").trim();
  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");
  if (pipeParts.length === 3) return pipeParts[1];

  const match = raw.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
  if (match) return match[1];

  return null;
}

function parseTaskDateKey(scheduledTime: string | null | undefined): string | null {
  const raw = String(scheduledTime || "").trim();
  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");
  if (pipeParts.length === 3) return pipeParts[0];

  const match = raw.match(/^(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/);
  if (match) return match[1];

  return null;
}

function getScoreMax(result: {
  lionScore: number;
  bearScore: number;
  wolfScore: number;
  dolphinScore: number;
}) {
  return Math.max(
    result.lionScore,
    result.bearScore,
    result.wolfScore,
    result.dolphinScore,
    1
  );
}

function getPeakWindow(chronotype: ChronotypeKey | null) {
  switch (chronotype) {
    case "LION":
      return { start: "07:00", end: "10:00", label: "07:00 - 10:00" };
    case "WOLF":
      return { start: "14:30", end: "18:00", label: "14:30 - 18:00" };
    case "DOLPHIN":
      return { start: "10:00", end: "11:30", label: "10:00 - 11:30" };
    case "BEAR":
    default:
      return { start: "09:00", end: "12:00", label: "09:00 - 12:00" };
  }
}

function isInsideWindow(time: string | null, start: string, end: string) {
  if (!time) return false;
  return time >= start && time <= end;
}

function getTaskTypeLabel(type: string) {
  const labels: Record<string, string> = {
    DEEP_WORK: "Deep work",
    STUDY: "Học tập",
    CREATIVE: "Sáng tạo",
    ADMIN: "Admin",
    ROUTINE: "Routine",
    PERSONAL: "Cá nhân",
  };
  return labels[type] || type;
}

function getTaskTypeColor(type: string) {
  switch (type) {
    case "DEEP_WORK":
      return "from-[#6B5BFF] to-[#5B8CFF]";
    case "STUDY":
      return "from-[#4DA8FF] to-[#60A5FA]";
    case "CREATIVE":
      return "from-[#F59E0B] to-[#FBBF24]";
    case "ADMIN":
      return "from-[#94A3B8] to-[#CBD5E1]";
    case "ROUTINE":
      return "from-[#10B981] to-[#34D399]";
    default:
      return "from-[#EC4899] to-[#F9A8D4]";
  }
}

function getPriorityLabel(priority: string) {
  const labels: Record<string, string> = {
    HIGH: "Cao",
    MEDIUM: "Trung bình",
    LOW: "Thấp",
  };
  return labels[priority] || priority;
}

function countDeepTasks(tasks: TaskLite[]) {
  return tasks.filter((task) => task.type === "DEEP_WORK" || task.type === "STUDY");
}

function buildWeeklyCompletionSeries(tasks: TaskLite[]) {
  const now = new Date();
  const weeks: Array<{
    label: string;
    total: number;
    completed: number;
  }> = [];

  for (let i = 5; i >= 0; i -= 1) {
    const ref = new Date(now);
    ref.setDate(now.getDate() - i * 7);

    const day = ref.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    const start = new Date(ref);
    start.setDate(ref.getDate() + mondayOffset);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const tasksInWeek = tasks.filter(
      (task) => task.createdAt >= start && task.createdAt <= end
    );

    weeks.push({
      label: `${start.getDate()}/${start.getMonth() + 1}`,
      total: tasksInWeek.length,
      completed: tasksInWeek.filter((task) => task.completed).length,
    });
  }

  return weeks;
}

function buildTaskTypeDistribution(tasks: TaskLite[]) {
  const map = new Map<string, number>();

  tasks.forEach((task) => {
    map.set(task.type, (map.get(task.type) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([type, count]) => ({
      type,
      label: getTaskTypeLabel(type),
      count,
      color: getTaskTypeColor(type),
    }))
    .sort((a, b) => b.count - a.count);
}

function buildHeatmap(tasks: TaskLite[]) {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return days.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = formatDateKey(date);

    const total = tasks.filter((task) => formatDateKey(task.createdAt) === key).length;
    const completed = tasks.filter(
      (task) => formatDateKey(task.createdAt) === key && task.completed
    ).length;

    return {
      label,
      total,
      completed,
      intensity: Math.min(
        4,
        total === 0 ? 0 : completed >= 3 ? 4 : completed === 2 ? 3 : completed === 1 ? 2 : 1
      ),
    };
  });
}

function buildAlignmentData(tasks: TaskLite[], chronotype: ChronotypeKey | null) {
  const peakWindow = getPeakWindow(chronotype);
  const deepTasks = countDeepTasks(tasks);

  const aligned = deepTasks.filter((task) =>
    isInsideWindow(parseTaskStartTime(task.scheduledTime), peakWindow.start, peakWindow.end)
  );

  const misaligned = deepTasks.filter((task) =>
    !isInsideWindow(parseTaskStartTime(task.scheduledTime), peakWindow.start, peakWindow.end)
  );

  const scheduledTasks = tasks.filter(
    (task) => String(task.scheduledTime || "").trim().toUpperCase() !== "BACKLOG"
  );

  const backlogTasks = tasks.length - scheduledTasks.length;

  const alignmentScore =
    deepTasks.length === 0 ? 0 : Math.round((aligned.length / deepTasks.length) * 100);

  return {
    peakWindow,
    deepTasksCount: deepTasks.length,
    alignedCount: aligned.length,
    misalignedCount: misaligned.length,
    scheduledCount: scheduledTasks.length,
    backlogCount: backlogTasks,
    alignmentScore,
    alignedTasks: aligned.slice(0, 4),
    misalignedTasks: misaligned.slice(0, 4),
  };
}

function getRecommendationCards(
  chronotype: ChronotypeKey | null,
  alignmentScore: number,
  backlogCount: number,
  misalignedCount: number,
  pendingCount: number
) {
  const peakWindow = getPeakWindow(chronotype);
  const cards = [];

  if (alignmentScore < 50) {
    cards.push({
      title: "Bảo vệ giờ mạnh tốt hơn",
      text: `Hãy chuyển thêm deep work hoặc học tập vào khung ${peakWindow.label} để tăng độ khớp với nhịp sinh học.`,
      icon: <Flame className="h-5 w-5" />,
    });
  }

  if (misalignedCount > 0) {
    cards.push({
      title: "Giảm task lệch nhịp",
      text: "Một số task cần chiều sâu đang nằm ngoài focus window. Ưu tiên dời chúng trước khi thêm task mới.",
      icon: <Target className="h-5 w-5" />,
    });
  }

  if (backlogCount > 0) {
    cards.push({
      title: "Dọn backlog có chiến lược",
      text: `Bạn đang có ${backlogCount} task chưa gán lịch. Hãy lịch hoá các task quan trọng trước để planner hữu ích hơn.`,
      icon: <ListTodo className="h-5 w-5" />,
    });
  }

  if (pendingCount > 6) {
    cards.push({
      title: "Giảm áp lực task mở",
      text: "Số task đang mở khá nhiều. Tập trung đóng bớt task cũ trước khi thêm nhiều đầu việc mới.",
      icon: <ShieldCheck className="h-5 w-5" />,
    });
  }

  if (cards.length === 0) {
    cards.push({
      title: "Nhịp hiện tại khá ổn",
      text: "Bạn đang có độ khớp lịch tương đối tốt. Bước tiếp theo là giữ consistency qua nhiều tuần liên tiếp.",
      icon: <CheckCircle2 className="h-5 w-5" />,
    });
  }

  return cards.slice(0, 4);
}

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
        <Navbar />
        <section className="relative px-6 py-24">
          <AmbientBg />
          <div className="relative z-10 mx-auto max-w-3xl rounded-[40px] border border-white/80 bg-white/85 p-10 text-center shadow-[0_30px_90px_rgba(97,76,197,0.10)] backdrop-blur-2xl">
            <div className="mb-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#F7F4FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              ChronoFlow Insights
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D] md:text-5xl">
              Bạn cần đăng nhập để xem insights
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[#615C7A]">
              Đăng nhập để xem biểu đồ tiến độ, độ khớp với nhịp sinh học, phân bổ loại task và phân tích tuần.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/login?callbackUrl=/insights"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(108,92,255,0.24)] transition hover:-translate-y-0.5"
              >
                Đăng nhập
              </Link>
              <Link
                href="/assessment"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-6 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
              >
                Làm bài đánh giá
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
        orderBy: { createdAt: "desc" },
      },
      weeklyInsights: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
      chronotypeResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
        <Navbar />
        <section className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-[36px] border border-white/80 bg-white/90 p-10 text-center shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D]">
              Không tìm thấy tài khoản
            </h1>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const tasks = user.tasks as TaskLite[];
  const chronotype = normalizeChronotype(user.chronotype);
  const firstName = (user.name?.trim() || "bạn").split(" ").slice(-1)[0];
  const latestInsight = user.weeklyInsights[0] ?? null;
  const latestResult = user.chronotypeResults[0] ?? null;

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const weeklySeries = buildWeeklyCompletionSeries(tasks);
  const taskTypeDistribution = buildTaskTypeDistribution(tasks);
  const heatmap = buildHeatmap(tasks);
  const alignment = buildAlignmentData(tasks, chronotype);
  const recommendationCards = getRecommendationCards(
    chronotype,
    alignment.alignmentScore,
    alignment.backlogCount,
    alignment.misalignedCount,
    pendingTasks
  );

  const recentTasks = tasks.slice(0, 6);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-20 pt-4 md:px-6 lg:px-8">
        <AmbientBg />

        <div className="relative z-10 mx-auto max-w-[1320px] space-y-8">
          <section className="overflow-hidden rounded-[44px] border border-white/80 bg-white/88 shadow-[0_35px_120px_rgba(97,76,197,0.12)] backdrop-blur-2xl">
            <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F3EEFF_0%,#ECE5FF_45%,#E7DEFF_100%)] px-5 py-8 md:px-8 md:py-10 xl:px-10">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[6%] top-[-12%] h-[240px] w-[240px] rounded-full bg-[#6F59FF]/15 blur-[100px]" />
                <div className="absolute right-[8%] top-[8%] h-[180px] w-[180px] rounded-full bg-[#4DA8FF]/15 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[35%] h-[160px] w-[160px] rounded-full bg-white/40 blur-[70px]" />
              </div>

              <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_440px] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_22px_rgba(111,89,255,0.08)] backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    ChronoFlow Insights
                  </div>

                  <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.2rem)] font-black leading-[0.96] tracking-tight text-[#1A1528]">
                    Phân tích{" "}
                    <span className="bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] bg-clip-text text-transparent">
                      hiệu suất thật
                    </span>{" "}
                    của {firstName}.
                  </h1>

                  <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
                    Đây là nơi ChronoFlow tổng hợp tiến độ, độ khớp với chronotype, phân bổ loại task và tín hiệu hành vi trực tiếp từ planner của bạn.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Chip icon={<CheckCircle2 className="h-4 w-4 text-[#7C5CFA]" />}>
                      {completedTasks}/{totalTasks} task hoàn thành
                    </Chip>
                    <Chip icon={<Brain className="h-4 w-4 text-[#7C5CFA]" />}>
                      Alignment score: {alignment.alignmentScore}%
                    </Chip>
                    <Chip icon={<Clock3 className="h-4 w-4 text-[#7C5CFA]" />}>
                      Peak window: {alignment.peakWindow.label}
                    </Chip>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href="/planner"
                      className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_18px_40px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5"
                    >
                      Mở planner
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white/90 px-6 text-[14px] font-semibold text-[#241F3D] shadow-sm transition hover:bg-white"
                    >
                      Về dashboard
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[440px]">
                  <div className="absolute -left-4 top-8 h-[88%] w-[92%] rounded-[34px] bg-white/35 blur-md" />
                  <div className="absolute -right-3 bottom-3 h-[86%] w-[88%] rounded-[34px] bg-[#DCCEFF]/30 blur-md" />

                  <div className="relative rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F5FF_100%)] p-6 shadow-[0_24px_80px_rgba(97,76,197,0.14)]">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                          Snapshot nhanh
                        </div>
                        <div className="mt-2 text-[1.7rem] font-black tracking-tight text-[#241F3D]">
                          Insights thực
                        </div>
                        <div className="mt-1 text-[13px] font-medium text-[#615C7A]">
                          dữ liệu đi từ backend
                        </div>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-white shadow-[0_16px_34px_rgba(97,76,197,0.22)]">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <MetricCard label="Completion rate" value={`${completionRate}%`} hint="tổng task đã xong" />
                      <MetricCard label="Task đang mở" value={String(pendingTasks)} hint="task chưa hoàn thành" />
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <MetricCard label="Backlog" value={String(alignment.backlogCount)} hint="task chưa gán lịch" />
                      <MetricCard label="Deep work đúng nhịp" value={`${alignment.alignedCount}/${alignment.deepTasksCount}`} hint="so với focus window" />
                    </div>

                    <div className="mt-4 rounded-[24px] border border-white/80 bg-white/70 px-4 py-4 shadow-inner">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        <TrendingUp className="h-4 w-4 text-[#7C5CFA]" />
                        Tín hiệu chính
                      </div>
                      <p className="text-[13px] leading-7 text-[#615C7A]">
                        {alignment.deepTasksCount === 0
                          ? "Bạn chưa có đủ task deep work / study để đo độ khớp nhịp một cách rõ ràng."
                          : `Hiện có ${alignment.alignedCount} task deep work / study nằm đúng peak window và ${alignment.misalignedCount} task đang lệch nhịp.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Hoàn thành"
              value={String(completedTasks)}
              hint="task đã xong"
            />
            <StatCard
              icon={<ListChecks className="h-5 w-5" />}
              title="Đang mở"
              value={String(pendingTasks)}
              hint="task chưa xong"
            />
            <StatCard
              icon={<Flame className="h-5 w-5" />}
              title="Alignment"
              value={`${alignment.alignmentScore}%`}
              hint="độ khớp nhịp sinh học"
            />
            <StatCard
              icon={<Layers3 className="h-5 w-5" />}
              title="Backlog"
              value={String(alignment.backlogCount)}
              hint="task chưa gán lịch"
            />
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
            <section className="space-y-8">
              <GlassSection eyebrow="Tiến độ 6 tuần" title="Biểu đồ completion theo tuần">
                <WeeklyCompletionChart data={weeklySeries} />
              </GlassSection>

              <GlassSection eyebrow="Phân bổ loại task" title="Bạn đang dành thời gian cho việc gì nhiều nhất">
                <TaskDistributionChart items={taskTypeDistribution} total={totalTasks} />
              </GlassSection>

              <GlassSection eyebrow="Độ khớp với nhịp sinh học" title="Task theo đúng / sai focus window">
                <div className="grid gap-6 lg:grid-cols-3">
                  <MiniInsightCard
                    icon={<Brain className="h-5 w-5" />}
                    title="Peak window"
                    value={alignment.peakWindow.label}
                    hint="khung giờ mạnh hiện tại"
                    accent="from-[#6B5BFF] to-[#5B8CFF]"
                  />
                  <MiniInsightCard
                    icon={<Target className="h-5 w-5" />}
                    title="Đúng nhịp"
                    value={String(alignment.alignedCount)}
                    hint="deep work / study đúng peak"
                    accent="from-[#10B981] to-[#34D399]"
                  />
                  <MiniInsightCard
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="Lệch nhịp"
                    value={String(alignment.misalignedCount)}
                    hint="deep work / study ngoài peak"
                    accent="from-[#F59E0B] to-[#FBBF24]"
                  />
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <AlignmentPanel
                    title="Đúng focus window"
                    tone="good"
                    items={alignment.alignedTasks}
                    emptyText="Chưa có task deep work / study nào nằm đúng peak window."
                  />
                  <AlignmentPanel
                    title="Lệch focus window"
                    tone="warn"
                    items={alignment.misalignedTasks}
                    emptyText="Hiện chưa có task deep work / study nào lệch peak window."
                  />
                </div>
              </GlassSection>

              <GlassSection eyebrow="Gợi ý ưu tiên" title="Bạn nên làm gì tiếp theo">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {recommendationCards.map((card) => (
                    <div
                      key={card.title}
                      className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/82 p-5 shadow-[0_16px_34px_rgba(97,76,197,0.05)]"
                    >
                      <div className="absolute right-[-18px] top-[-18px] h-20 w-20 rounded-full bg-[#F3EEFF]" />
                      <div className="relative z-10 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3EEFF] text-[#6F59FF]">
                        {card.icon}
                      </div>
                      <div className="relative z-10 text-[1rem] font-black tracking-tight text-[#241F3D]">
                        {card.title}
                      </div>
                      <p className="relative z-10 mt-3 text-[14px] leading-7 text-[#615C7A]">
                        {card.text}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassSection>

              <GlassSection eyebrow="Recent tasks" title="Các task gần đây đang tạo ra pattern gì">
                {recentTasks.length === 0 ? (
                  <EmptyMini text="Chưa có task gần đây để phân tích." />
                ) : (
                  <div className="grid gap-4">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-[28px] border border-white/80 bg-white/84 p-5 shadow-[0_14px_28px_rgba(97,76,197,0.05)]"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white ${getTaskTypeColor(task.type)}`}
                              >
                                {getTaskTypeLabel(task.type)}
                              </span>
                              <span className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-500">
                                Ưu tiên {getPriorityLabel(task.priority)}
                              </span>
                              {task.completed ? (
                                <span className="rounded-full border border-[#DDF5E7] bg-[#F3FFF8] px-3 py-1.5 text-[11px] font-bold text-[#2E7C59]">
                                  Đã xong
                                </span>
                              ) : (
                                <span className="rounded-full border border-[#FCE7D3] bg-[#FFF8F1] px-3 py-1.5 text-[11px] font-bold text-[#B86B00]">
                                  Đang mở
                                </span>
                              )}
                            </div>

                            <div className="mt-3 text-[17px] font-black tracking-tight text-[#241F3D]">
                              {task.name}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] font-medium text-[#615C7A]">
                              <span className="rounded-md bg-slate-50 px-2 py-1">
                                {parseTaskDateKey(task.scheduledTime) || "Chưa có ngày"}
                              </span>
                              <span className="rounded-md bg-slate-50 px-2 py-1">
                                {parseTaskStartTime(task.scheduledTime) || "Chưa có giờ"}
                              </span>
                              <span className="rounded-md bg-slate-50 px-2 py-1">{task.duration}</span>
                            </div>
                          </div>

                          <div className="w-full max-w-[260px] rounded-[20px] border border-[#ECE8FF] bg-[#FAF8FF] px-4 py-3 text-[13px] leading-6 text-[#615C7A]">
                            {task.explanation || "Task này chưa có ghi chú giải thích."}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassSection>
            </section>

            <aside className="space-y-8">
              <SidebarSection eyebrow="Recent insight" title="Tổng kết gần nhất" icon={<Sparkles className="h-5 w-5" />}>
                {latestInsight ? (
                  <>
                    <div className="rounded-[24px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] p-4 text-[13px] leading-7 text-[#615C7A] shadow-sm">
                      <div className="mb-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        {latestInsight.weekLabel}
                      </div>
                      {latestInsight.summary}
                    </div>

                    {latestInsight.recommendation ? (
                      <div className="mt-4 rounded-[22px] border border-[#ECE8FF] bg-[#FAF8FF] p-4 text-[13px] leading-7 text-[#615C7A]">
                        <span className="font-black text-[#241F3D]">Gợi ý:</span> {latestInsight.recommendation}
                      </div>
                    ) : null}

                    <div className="mt-4 grid gap-3">
                      <MiniStat label="Điểm alignment" value={String(latestInsight.alignmentScore)} />
                      <MiniStat label="Task hoàn thành" value={String(latestInsight.completedCount)} />
                      <MiniStat label="Deep work / study" value={String(latestInsight.deepWorkCount)} />
                    </div>
                  </>
                ) : (
                  <EmptyMini text="Khi bạn dùng planner thường xuyên hơn, phần insight tuần sẽ rõ ràng hơn nhiều." />
                )}
              </SidebarSection>

              <SidebarSection eyebrow="Weekly heatmap" title="Mật độ hoạt động tuần này" icon={<Activity className="h-5 w-5" />}>
                <HeatmapMini items={heatmap} />
              </SidebarSection>

              <SidebarSection eyebrow="Assessment gần nhất" title="Phân bổ điểm chronotype" icon={<MoonStar className="h-5 w-5" />}>
                {latestResult ? (
                  <div className="space-y-3">
                    <ScoreBar label="Sư tử" value={latestResult.lionScore} max={getScoreMax(latestResult)} />
                    <ScoreBar label="Gấu" value={latestResult.bearScore} max={getScoreMax(latestResult)} />
                    <ScoreBar label="Sói" value={latestResult.wolfScore} max={getScoreMax(latestResult)} />
                    <ScoreBar label="Cá heo" value={latestResult.dolphinScore} max={getScoreMax(latestResult)} />
                  </div>
                ) : (
                  <EmptyMini text="Chưa có kết quả assessment gần đây để hiển thị." />
                )}
              </SidebarSection>

              <SidebarSection eyebrow="Đi tiếp từ đây" title="Quick actions" icon={<CalendarClock className="h-5 w-5" />}>
                <div className="space-y-3">
                  <ActionLink href="/planner" title="Mở planner" text="Điều chỉnh lại lịch để tăng độ khớp với nhịp sinh học." />
                  <ActionLink href="/rhythm" title="Xem rhythm" text="Đọc lại peak window và hiểu rõ khung giờ mạnh của bạn." />
                  <ActionLink href="/dashboard" title="Về dashboard" text="Quay lại tổng quan chính của ChronoFlow." />
                </div>
              </SidebarSection>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function AmbientBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-[-8%] top-[6%] h-[320px] w-[320px] rounded-full bg-purple-100/40 blur-[120px]" />
      <div className="absolute right-[-6%] top-[14%] h-[260px] w-[260px] rounded-full bg-blue-100/35 blur-[110px]" />
      <div className="absolute bottom-[-8%] left-[28%] h-[240px] w-[240px] rounded-full bg-fuchsia-100/20 blur-[90px]" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#CFC7E8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

function GlassSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[40px] border border-white/80 bg-white/88 shadow-[0_28px_80px_rgba(97,76,197,0.08)] backdrop-blur-2xl">
      <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-6 py-6 md:px-8">
        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
          {eyebrow}
        </div>
        <h2 className="mt-2 text-[1.45rem] font-black tracking-tight text-[#241F3D] md:text-[1.8rem]">
          {title}
        </h2>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}

function SidebarSection({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[36px] border border-white/80 bg-white/88 shadow-[0_24px_70px_rgba(97,76,197,0.08)] backdrop-blur-2xl">
      <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA] shadow-sm">{icon}</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              {eyebrow}
            </div>
            <div className="mt-1 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
              {title}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Chip({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/90 px-4 py-3 text-[13px] font-bold text-[#5F5A77] shadow-[0_12px_26px_rgba(0,0,0,0.05)] backdrop-blur-md">
      {icon}
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/82 p-4 shadow-[0_12px_28px_rgba(97,76,197,0.05)]">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[1.35rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
      <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">{hint}</div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="group rounded-[34px] border border-white/80 bg-white/86 p-6 shadow-[0_16px_40px_rgba(97,76,197,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA] shadow-sm transition group-hover:bg-[#6F59FF] group-hover:text-white">
          {icon}
        </div>
        <div className="text-[2.2rem] font-black tracking-tight text-[#241F3D]">{value}</div>
      </div>
      <div className="mt-5 text-[16px] font-black tracking-tight text-[#241F3D]">{title}</div>
      <div className="mt-1 text-[13px] leading-6 text-[#615C7A]">{hint}</div>
    </div>
  );
}

function MiniInsightCard({
  icon,
  title,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint: string;
  accent: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/84 p-5 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div className={`inline-flex rounded-2xl bg-gradient-to-r p-3 text-white shadow-sm ${accent}`}>
          {icon}
        </div>
        <div className="text-[1.4rem] font-black tracking-tight text-[#241F3D]">{value}</div>
      </div>
      <div className="mt-4 text-[15px] font-black tracking-tight text-[#241F3D]">{title}</div>
      <div className="mt-1 text-[12.5px] leading-6 text-[#615C7A]">{hint}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/84 p-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[1.55rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
    </div>
  );
}

function ActionLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[24px] border border-white/80 bg-white/84 px-4 py-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(97,76,197,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-black tracking-tight text-[#241F3D]">
            {title}
          </div>
          <div className="mt-1 text-[13px] leading-6 text-[#615C7A]">{text}</div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#7C5CFA] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function EmptyMini({ text }: { text: string }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#D9CEFF] bg-[#FAF8FF] px-4 py-5 text-[13px] leading-7 text-[#615C7A]">
      {text}
    </div>
  );
}

function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="rounded-[22px] border border-white/80 bg-white/84 p-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[14px] font-black text-[#241F3D]">{label}</div>
        <div className="text-[12px] font-bold text-[#6B6287]">{value} điểm</div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#EFEAFD] shadow-inner">
        <div
          className="h-full rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function WeeklyCompletionChart({
  data,
}: {
  data: Array<{ label: string; total: number; completed: number }>;
}) {
  const max = Math.max(...data.map((item) => item.total), 1);

  return (
    <div className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,#FCFBFF_0%,#FFFFFF_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Weekly completion
          </div>
          <div className="mt-1 text-[1.12rem] font-black tracking-tight text-[#241F3D]">
            Số task tạo mới và hoàn thành theo tuần
          </div>
        </div>
      </div>

      <div className="grid h-[280px] grid-cols-6 items-end gap-4">
        {data.map((item) => {
          const totalHeight = Math.max(10, (item.total / max) * 100);
          const completedHeight =
            item.total === 0 ? 0 : Math.max(8, (item.completed / max) * 100);

          return (
            <div key={item.label} className="flex h-full flex-col items-center justify-end gap-3">
              <div className="flex h-full w-full items-end justify-center gap-2">
                <div className="relative flex h-[88%] w-12 items-end rounded-full bg-[#EFEAFD] p-1 shadow-inner">
                  <div
                    className="w-full rounded-full bg-[linear-gradient(180deg,#CFC4FF_0%,#A995FF_100%)]"
                    style={{ height: `${totalHeight}%` }}
                    title={`Tổng task: ${item.total}`}
                  />
                  <div
                    className="absolute bottom-1 left-1 right-1 rounded-full bg-[linear-gradient(180deg,#6B5BFF_0%,#5B8CFF_100%)]"
                    style={{ height: `${completedHeight}%` }}
                    title={`Hoàn thành: ${item.completed}`}
                  />
                </div>
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-[12px] font-semibold text-[#615C7A]">
        <div className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#A995FF]" />
          Tổng task
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#6B5BFF]" />
          Đã hoàn thành
        </div>
      </div>
    </div>
  );
}

function TaskDistributionChart({
  items,
  total,
}: {
  items: Array<{ type: string; label: string; count: number; color: string }>;
  total: number;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="relative mx-auto flex h-[280px] w-[280px] items-center justify-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#6B5BFF_0deg,#5B8CFF_120deg,#F59E0B_220deg,#10B981_300deg,#EC4899_360deg)] p-5 shadow-[0_24px_60px_rgba(97,76,197,0.14)]">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-inner">
          <div className="text-center">
            <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              Tổng task
            </div>
            <div className="mt-1 text-[2.1rem] font-black tracking-tight text-[#241F3D]">
              {total}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <EmptyMini text="Chưa có task để phân tích phân bổ loại công việc." />
        ) : (
          items.map((item) => {
            const percentage = total === 0 ? 0 : Math.round((item.count / total) * 100);

            return (
              <div
                key={item.type}
                className="rounded-[24px] border border-white/80 bg-white/84 p-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)]"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${item.color}`} />
                    <div className="text-[14px] font-black text-[#241F3D]">{item.label}</div>
                  </div>
                  <div className="text-[12px] font-bold text-[#6B6287]">
                    {item.count} task • {percentage}%
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#EFEAFD] shadow-inner">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function AlignmentPanel({
  title,
  tone,
  items,
  emptyText,
}: {
  title: string;
  tone: "good" | "warn";
  items: TaskLite[];
  emptyText: string;
}) {
  const toneClasses =
    tone === "good"
      ? "bg-[#F3FFF8] border-[#DDF5E7] text-[#2E7C59]"
      : "bg-[#FFF8F1] border-[#FCE7D3] text-[#B86B00]";

  return (
    <div className="rounded-[32px] border border-white/80 bg-white/84 p-5 shadow-[0_16px_34px_rgba(97,76,197,0.05)]">
      <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-black uppercase tracking-[0.14em] ${toneClasses}`}>
        {tone === "good" ? <CheckCircle2 className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
        {title}
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <EmptyMini text={emptyText} />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-[#ECE8FF] bg-[#FAF8FF] px-4 py-4"
            >
              <div className="text-[15px] font-black tracking-tight text-[#241F3D]">
                {item.name}
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-[#615C7A]">
                {(parseTaskDateKey(item.scheduledTime) || "Không rõ ngày")} • {parseTaskStartTime(item.scheduledTime) || "Không rõ giờ"} • {item.duration}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function HeatmapMini({
  items,
}: {
  items: Array<{ label: string; total: number; completed: number; intensity: number }>;
}) {
  const colors = [
    "bg-[#F3EEFF]",
    "bg-[#DED4FF]",
    "bg-[#BDAAFF]",
    "bg-[#8B6DFF]",
    "bg-[#6F59FF]",
  ];

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/84 p-5 shadow-[0_16px_34px_rgba(97,76,197,0.05)]">
      <div className="mb-4 text-[13px] font-bold text-[#615C7A]">
        Mật độ hoạt động trong tuần
      </div>

      <div className="grid grid-cols-7 gap-2">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div
              className={`mx-auto h-12 w-12 rounded-2xl border border-white shadow-sm ${colors[item.intensity]}`}
              title={`${item.label}: ${item.completed}/${item.total}`}
            />
            <div className="mt-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}