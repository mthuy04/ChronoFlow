import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Coins,
  Database,
  Flame,
  Gift,
  History,
  Lock,
  Mail,
  MoonStar,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  User2,
  ClipboardList,
  Settings2,
  Zap,
} from "lucide-react";

type ChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

type ProfileTaskRow = {
  id: string;
  name: string;
  type: string;
  priority: string;
  duration: string;
  deadline: string | null;
  scheduledDate: string | null;
  scheduledTime: string;
  explanation: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ProfileFocusSessionRow = {
  id: string;
  status: string;
  startedAt: Date;
  durationMinutes: number;
};

type ProfileRewardRedemptionRow = {
  id: string;
  rewardTitle: string;
  pointsCost: number;
  status: string;
  createdAt: Date;
};

type ProfileStreakRewardRow = {
  id: string;
  milestone: number;
  coinsEarned: number;
  awardedAt: Date;
};

type ProfileCoinTransactionRow = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: Date;
};

type ChronotypeMeta = {
  label: string;
  emoji: string;
  subtitle: string;
  focusWindow: string;
  summary: string;
};

const CHRONOTYPE_META: Record<ChronotypeKey, ChronotypeMeta> = {
  LION: {
    label: "Sư tử",
    emoji: "🦁",
    subtitle: "Mạnh vào buổi sáng",
    focusWindow: "07:00 - 10:00",
    summary:
      "Bạn thường tỉnh táo sớm, vào việc nhanh ở đầu ngày và hợp với việc khó vào buổi sáng.",
  },
  BEAR: {
    label: "Gấu",
    emoji: "🐻",
    subtitle: "Nhịp cân bằng ban ngày",
    focusWindow: "09:00 - 12:00",
    summary:
      "Bạn hợp với nhịp sống ban ngày, giữ mức năng lượng khá ổn định và phù hợp với lịch tiêu chuẩn.",
  },
  WOLF: {
    label: "Sói",
    emoji: "🐺",
    subtitle: "Mạnh hơn về chiều và tối",
    focusWindow: "14:30 - 18:00",
    summary:
      "Bạn thường lên nhịp chậm hơn vào buổi sáng nhưng mạnh hơn về cuối chiều hoặc tối sớm.",
  },
  DOLPHIN: {
    label: "Cá heo",
    emoji: "🐬",
    subtitle: "Nhạy giấc ngủ, hợp block gọn",
    focusWindow: "10:00 - 11:30",
    summary:
      "Bạn nhạy hơn với giấc ngủ và môi trường, phù hợp với planner mềm và các block tập trung ngắn, rõ.",
  },
};

async function safeQuery<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(`[PROFILE_SAFE_QUERY:${label}]`, error);
    return fallback;
  }
}

function normalizeChronotype(
  value: string | null | undefined,
): ChronotypeKey | null {
  if (!value) return null;

  const key = String(value).toUpperCase();

  if (key.includes("LION")) return "LION";
  if (key.includes("WOLF")) return "WOLF";
  if (key.includes("DOLPHIN")) return "DOLPHIN";
  if (key.includes("BEAR")) return "BEAR";

  return null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatRole(role: string) {
  return role === "ADMIN" ? "Quản trị viên" : "Người dùng";
}

function getCompletionRate(total: number, completed: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

function toVietnamDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseTaskDateKey(
  scheduledDate: string | null | undefined,
  scheduledTime: string | null | undefined,
  updatedAt?: Date,
): string | null {
  if (scheduledDate) return scheduledDate.slice(0, 10);

  const raw = String(scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") {
    return updatedAt ? toVietnamDateKey(updatedAt) : null;
  }

  const pipeParts = raw.split("|");

  if (pipeParts.length === 3) return pipeParts[0];

  const match = raw.match(
    /^(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/,
  );

  if (match) return match[1];

  return updatedAt ? toVietnamDateKey(updatedAt) : null;
}

function parseTaskStartTime(scheduledTime: string | null | undefined) {
  const raw = String(scheduledTime || "").trim();

  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");

  if (pipeParts.length === 3) return pipeParts[1];

  const match = raw.match(
    /^\d{4}-\d{2}-\d{2}\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/,
  );

  if (match) return match[1];

  return null;
}

function computeCurrentStreak(params: {
  tasks: ProfileTaskRow[];
  focusSessions: ProfileFocusSessionRow[];
}) {
  const activeDateKeys = new Set<string>();

  params.tasks.forEach((task) => {
    if (!task.completed) return;

    const dateKey = parseTaskDateKey(
      task.scheduledDate,
      task.scheduledTime,
      task.updatedAt,
    );

    if (dateKey) activeDateKeys.add(dateKey);
  });

  params.focusSessions.forEach((session) => {
    if (session.status !== "COMPLETED") return;
    activeDateKeys.add(toVietnamDateKey(session.startedAt));
  });

  let streak = 0;
  const today = new Date();

  for (let offset = 0; offset < 365; offset += 1) {
    const key = toVietnamDateKey(addDays(today, -offset));

    if (!activeDateKeys.has(key)) break;

    streak += 1;
  }

  return streak;
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

function getPriorityLabel(priority: string) {
  const labels: Record<string, string> = {
    HIGH: "Cao",
    MEDIUM: "Trung bình",
    LOW: "Thấp",
  };

  return labels[priority] || priority;
}

function getTaskTypeClass(type: string) {
  switch (type) {
    case "DEEP_WORK":
      return "border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]";
    case "STUDY":
      return "border-[#DDEEFF] bg-[#EEF6FF] text-[#4DA8FF]";
    case "CREATIVE":
      return "border-[#FED7AA] bg-[#FFF7ED] text-[#F59E0B]";
    case "ADMIN":
      return "border-[#EEF0F6] bg-[#F8F9FE] text-[#64748B]";
    case "ROUTINE":
      return "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]";
    default:
      return "border-[#FBCFE8] bg-[#FFF0F7] text-[#C04778]";
  }
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
    1,
  );
}

function getRewardStatusLabel(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "PENDING") return "Đang xử lý";
  if (normalized === "APPROVED") return "Đã duyệt";
  if (normalized === "FULFILLED") return "Đã hoàn tất";
  if (normalized === "COMPLETED") return "Đã hoàn tất";
  if (normalized === "REJECTED") return "Bị từ chối";
  if (normalized === "CANCELLED") return "Đã huỷ";

  return status;
}

function getRewardStatusClass(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "FULFILLED" || normalized === "COMPLETED") {
    return "bg-[#ECFDF5] text-[#10B981]";
  }

  if (normalized === "APPROVED") {
    return "bg-[#EEF6FF] text-[#4DA8FF]";
  }

  if (normalized === "REJECTED" || normalized === "CANCELLED") {
    return "bg-[#FFF7F7] text-[#B42318]";
  }

  return "bg-[#F3F0FF] text-[#6F59FF]";
}

function getCoinTone(amount: number) {
  return amount >= 0
    ? "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]"
    : "border-[#FED7AA] bg-[#FFF7ED] text-[#F59E0B]";
}

function getCoinIcon(type: string, amount: number) {
  const normalized = type.toUpperCase();

  if (normalized.includes("TASK")) return <CheckCircle2 className="h-4 w-4" />;
  if (normalized.includes("FOCUS")) return <Timer className="h-4 w-4" />;
  if (normalized.includes("STREAK")) return <Flame className="h-4 w-4" />;
  if (normalized.includes("REWARD") && amount < 0) {
    return <Gift className="h-4 w-4" />;
  }

  return <Coins className="h-4 w-4" />;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] pb-24 pt-0 text-[#1A1528] selection:bg-[#6F59FF]/20">
        <Navbar />
        <AmbientBg />

        <section className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-[1280px] items-center px-4 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[40px] border border-white bg-white shadow-[0_22px_80px_rgba(26,21,40,0.06)] md:rounded-[48px]">
            <div className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-6 py-12 text-center md:rounded-[48px] md:px-10 md:py-16">
              <HeroGlow />

              <div className="relative z-10">
                <Badge>
                  <Sparkles className="h-3.5 w-3.5" />
                  ChronoFlow Profile
                </Badge>

                <h1 className="mx-auto mt-5 max-w-[900px] text-[clamp(2rem,4vw,4rem)] font-[900] leading-[1.02] tracking-[-0.055em] text-[#1A1528]">
                  Bạn cần đăng nhập để xem{" "}
                  <GradientText>hồ sơ cá nhân</GradientText>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                  Đăng nhập để xem thông tin tài khoản, chronotype, mục tiêu
                  giấc ngủ và các chỉ số sử dụng ChronoFlow của bạn.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/auth/login?callbackUrl=/profile"
                    className="group flex min-h-[58px] items-center gap-3 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-black"
                  >
                    <User2 className="h-4 w-4 text-[#4DA8FF]" />
                    <span className="text-[14px] font-bold leading-tight">
                      Đăng nhập
                    </span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/assessment"
                    className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/85 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F0FF]">
                      <RefreshCw className="h-3.5 w-3.5 text-[#6F59FF]" />
                    </div>
                    <span className="text-[14px] font-bold leading-tight">
                      Làm bài đánh giá
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  const userEmail = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      role: true,
      chronotype: true,
      targetSleepTime: true,
      targetWakeTime: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      weeklyInsights: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          weekLabel: true,
          alignmentScore: true,
          completedCount: true,
          deepWorkCount: true,
          recommendation: true,
          summary: true,
        },
      },
      chronotypeResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          lionScore: true,
          bearScore: true,
          wolfScore: true,
          dolphinScore: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] text-[#1A1528] selection:bg-[#6F59FF]/20">
        <Navbar />
        <AmbientBg />
        <section className="relative z-10 flex min-h-[70vh] items-center px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-[40px] border border-white/80 bg-white/82 p-10 text-center shadow-[0_24px_80px_rgba(26,21,40,0.08)] backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]">
              <User2 className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-[28px] font-[900] tracking-tight text-[#1A1528]">
              Không tìm thấy tài khoản
            </h1>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const [
    allTasksRaw,
    focusSessionsRaw,
    userWallet,
    rewardRedemptionsRaw,
    latestStreakRows,
    coinTransactionsRaw,
  ] = await Promise.all([
    safeQuery(
      "tasks",
      () =>
        prisma.task.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            type: true,
            priority: true,
            duration: true,
            deadline: true,
            scheduledDate: true,
            scheduledTime: true,
            explanation: true,
            completed: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      [],
    ),

    safeQuery(
      "focusSessions",
      () =>
        prisma.focusSession.findMany({
          where: { userId: user.id },
          orderBy: { startedAt: "desc" },
          select: {
            id: true,
            status: true,
            startedAt: true,
            durationMinutes: true,
          },
        }),
      [],
    ),

    safeQuery(
      "wallet",
      () =>
        prisma.user.findUnique({
          where: { id: user.id },
          select: {
            coinBalance: true,
          },
        }),
      null,
    ),

    safeQuery(
      "rewardRedemptions",
      () =>
        prisma.rewardRedemption.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            rewardTitle: true,
            pointsCost: true,
            status: true,
            createdAt: true,
          },
        }),
      [],
    ),

    safeQuery(
      "streakRewards",
      () =>
        prisma.streakReward.findMany({
          where: { userId: user.id },
          orderBy: { awardedAt: "desc" },
          take: 1,
          select: {
            id: true,
            milestone: true,
            coinsEarned: true,
            awardedAt: true,
          },
        }),
      [],
    ),

    safeQuery(
      "coinTransactions",
      () =>
        prisma.coinTransaction.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            type: true,
            amount: true,
            balanceAfter: true,
            description: true,
            createdAt: true,
          },
        }),
      [],
    ),
  ]);

  const allTasks: ProfileTaskRow[] = allTasksRaw.map((task) => ({
    id: task.id,
    name: task.name,
    type: String(task.type),
    priority: String(task.priority),
    duration: task.duration,
    deadline: task.deadline,
    scheduledDate: task.scheduledDate,
    scheduledTime: task.scheduledTime,
    explanation: task.explanation,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));

  const focusSessions: ProfileFocusSessionRow[] = focusSessionsRaw.map(
    (sessionItem) => ({
      id: sessionItem.id,
      status: String(sessionItem.status),
      startedAt: sessionItem.startedAt,
      durationMinutes: sessionItem.durationMinutes,
    }),
  );

  const rewardRedemptions: ProfileRewardRedemptionRow[] =
    rewardRedemptionsRaw.map((item) => ({
      id: item.id,
      rewardTitle: item.rewardTitle,
      pointsCost: item.pointsCost,
      status: String(item.status),
      createdAt: item.createdAt,
    }));

  const latestStreakReward: ProfileStreakRewardRow | null =
    latestStreakRows[0] ?? null;

  const coinTransactions: ProfileCoinTransactionRow[] = coinTransactionsRaw.map(
    (item) => ({
      id: item.id,
      type: item.type,
      amount: item.amount,
      balanceAfter: item.balanceAfter,
      description: item.description,
      createdAt: item.createdAt,
    }),
  );

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((task) => task.completed).length;
  const pendingTasks = allTasks.filter((task) => !task.completed).length;
  const completionRate = getCompletionRate(totalTasks, completedTasks);

  const completedFocusSessions = focusSessions.filter(
    (item) => item.status === "COMPLETED",
  );

  const sevenDaysAgo = addDays(new Date(), -7);

  const totalFocusSessions = completedFocusSessions.length;
  const totalFocusMinutes = completedFocusSessions.reduce(
    (sum, item) => sum + item.durationMinutes,
    0,
  );
  const weekFocusMinutes = completedFocusSessions
    .filter((item) => item.startedAt >= sevenDaysAgo)
    .reduce((sum, item) => sum + item.durationMinutes, 0);
  const averageFocusMinutes =
    totalFocusSessions > 0
      ? Math.round(totalFocusMinutes / totalFocusSessions)
      : 0;

  const coinBalance = userWallet?.coinBalance ?? 0;
  const totalRedemptions = rewardRedemptions.length;
  const pendingRedemptions = rewardRedemptions.filter(
    (item) => item.status === "PENDING",
  ).length;
  const fulfilledRedemptions = rewardRedemptions.filter((item) =>
    ["FULFILLED", "COMPLETED"].includes(item.status),
  ).length;
  const latestRedemption = rewardRedemptions[0] ?? null;

  const currentStreak = computeCurrentStreak({
    tasks: allTasks,
    focusSessions,
  });

  const recentTasks = allTasks.slice(0, 6);
  const chronotype = normalizeChronotype(user.chronotype);
  const chronotypeMeta = chronotype ? CHRONOTYPE_META[chronotype] : null;
  const latestInsight = user.weeklyInsights[0] ?? null;
  const latestResult = user.chronotypeResults[0] ?? null;
  const displayName = user.name?.trim() || "Người dùng";
  const firstName = displayName.split(" ").slice(-1)[0] || displayName;
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "C";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] pb-24 pt-0 text-[#1A1528] selection:bg-[#6F59FF]/20">
      <Navbar />
      <AmbientBg />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-6 lg:px-8">
        <ProfileHero
          firstName={firstName}
          displayName={displayName}
          email={user.email}
          role={formatRole(String(user.role))}
          studentId={user.studentId}
          createdAt={user.createdAt}
          image={user.image}
          avatarLetter={avatarLetter}
          coinBalance={coinBalance}
          currentStreak={currentStreak}
          chronotypeMeta={chronotypeMeta}
          completionRate={completionRate}
        />

        <SectionWrapper>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Coins className="h-5 w-5" />}
              title="Coin"
              value={formatNumber(coinBalance)}
              hint={`${formatNumber(totalRedemptions)} yêu cầu đổi quà`}
              tone="orange"
            />

            <StatCard
              icon={<Flame className="h-5 w-5" />}
              title="Streak"
              value={`${currentStreak} ngày`}
              hint="chuỗi productivity hiện tại"
              tone="green"
            />

            <StatCard
              icon={<Timer className="h-5 w-5" />}
              title="Focus tuần này"
              value={`${formatNumber(weekFocusMinutes)}p`}
              hint={`${formatNumber(totalFocusSessions)} phiên đã ghi nhận`}
              tone="blue"
            />

            <StatCard
              icon={<Activity className="h-5 w-5" />}
              title="Completion"
              value={`${completionRate}%`}
              hint={`${formatNumber(completedTasks)} / ${formatNumber(
                totalTasks,
              )} task`}
              tone="purple"
            />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
            <div className="space-y-6">
              <Panel
                eyebrow="Chỉnh sửa hồ sơ"
                title="Thông tin cá nhân"
                description="Cập nhật tên hiển thị, avatar, mã sinh viên và mục tiêu giấc ngủ."
              >
                <ProfileEditForm
                  initialName={user.name ?? ""}
                  initialStudentId={user.studentId}
                  initialTargetSleepTime={user.targetSleepTime}
                  initialTargetWakeTime={user.targetWakeTime}
                  initialImage={user.image}
                  initialCustomerType={null}
                  initialSourceChannel={null}
                  initialCompanyName={null}
                  initialRoleInCompany={null}
                  initialTeamSize={null}
                  initialConsentForResearch={false}
                />
              </Panel>

              <Panel
                eyebrow="Rhythm profile"
                title="Chronotype & nhịp cá nhân"
                description="ChronoFlow dùng phần này để cá nhân hóa planner, rhythm và insights."
              >
                {chronotypeMeta ? (
                  <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                    <div className="rounded-[30px] border border-[#E9E5FF] bg-[#FBF9FF] p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                            Chronotype hiện tại
                          </div>

                          <div className="mt-2 text-[1.75rem] font-[900] tracking-tight text-[#1A1528]">
                            {chronotypeMeta.label} {chronotypeMeta.emoji}
                          </div>

                          <div className="mt-1 text-[13px] font-bold text-[#5B566E]">
                            {chronotypeMeta.subtitle}
                          </div>
                        </div>

                        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-white text-[#6F59FF] shadow-sm">
                          <MoonStar className="h-5 w-5" />
                        </div>
                      </div>

                      <p className="mt-4 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
                        {chronotypeMeta.summary}
                      </p>

                      <Link
                        href="/assessment"
                        className="mt-5 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-4 text-[12px] font-black text-[#6F59FF] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FAF8FF]"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Cập nhật chronotype
                      </Link>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <MiniMetric
                          label="Focus window"
                          value={chronotypeMeta.focusWindow}
                        />
                        <MiniMetric label="Trạng thái" value="Đã cá nhân hóa" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <InfoCard
                        icon={<MoonStar className="h-4 w-4" />}
                        title="Giờ ngủ mục tiêu"
                        value={user.targetSleepTime || "Chưa cập nhật"}
                        text="Dùng để tinh chỉnh trải nghiệm theo nhịp ngủ."
                      />

                      <InfoCard
                        icon={<Zap className="h-4 w-4" />}
                        title="Giờ thức mục tiêu"
                        value={user.targetWakeTime || "Chưa cập nhật"}
                        text="Giúp planner gợi ý khung hoạt động hợp lý hơn."
                      />
                    </div>
                  </div>
                ) : (
                  <EmptyPanel
                    title="Bạn chưa có chronotype"
                    text="Hãy làm bài đánh giá để ChronoFlow hiểu rõ hơn nhịp sinh học của bạn."
                    href="/assessment"
                    cta="Làm bài đánh giá"
                  />
                )}
              </Panel>

              <Panel
                eyebrow="Productivity"
                title="Tổng quan hiệu suất"
                description="Các chỉ số này lấy từ task và focus session thật trong tài khoản của bạn."
              >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Tổng task"
                    value={formatNumber(totalTasks)}
                    hint="toàn bộ planner"
                  />
                  <MetricCard
                    label="Task đang mở"
                    value={formatNumber(pendingTasks)}
                    hint="cần xử lý tiếp"
                  />
                  <MetricCard
                    label="Tổng focus"
                    value={`${formatNumber(totalFocusMinutes)}p`}
                    hint={`${formatNumber(totalFocusSessions)} phiên`}
                  />
                  <MetricCard
                    label="Trung bình"
                    value={`${formatNumber(averageFocusMinutes)}p`}
                    hint="mỗi phiên focus"
                  />
                </div>
              </Panel>

              <Panel
                eyebrow="Recent activity"
                title="Task gần đây"
                description="Một lát cắt nhanh về những task mới nhất trong planner."
              >
                {recentTasks.length === 0 ? (
                  <EmptyPanel
                    title="Bạn chưa có task nào"
                    text="Khi bắt đầu dùng planner, activity gần đây sẽ hiển thị tại đây."
                    href="/planner"
                    cta="Mở planner"
                  />
                ) : (
                  <div className="grid gap-3">
                    {recentTasks.map((task) => (
                      <TaskRow key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            <aside className="space-y-6">
              <SidePanel
                eyebrow="Reward summary"
                title="Ví thưởng"
                icon={<Gift className="h-5 w-5" />}
              >
                <div className="rounded-[28px] border border-[#FED7AA] bg-[#FFF7ED] p-5 shadow-sm">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                    Coin hiện có
                  </div>

                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-[2.8rem] font-[900] leading-none tracking-tight text-[#1A1528]">
                      {formatNumber(coinBalance)}
                    </span>
                    <span className="pb-1 text-[13px] font-black text-[#F59E0B]">
                      coin
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <SmallStat
                      label="Đã đổi"
                      value={formatNumber(totalRedemptions)}
                    />
                    <SmallStat
                      label="Đang xử lý"
                      value={formatNumber(pendingRedemptions)}
                    />
                    <SmallStat
                      label="Hoàn tất"
                      value={formatNumber(fulfilledRedemptions)}
                    />
                  </div>

                  <Link
                    href="/rewards"
                    className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-4 text-[13px] font-black text-white shadow-xl transition hover:-translate-y-0.5"
                  >
                    Mở Rewards
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  <InfoCard
                    icon={<Gift className="h-4 w-4" />}
                    title="Đổi quà gần nhất"
                    value={latestRedemption?.rewardTitle || "Chưa có"}
                    text={
                      latestRedemption
                        ? `${getRewardStatusLabel(
                            latestRedemption.status,
                          )} · -${formatNumber(
                            latestRedemption.pointsCost,
                          )} coin`
                        : "Khi bạn đổi quà, trạng thái gần nhất sẽ hiện ở đây."
                    }
                    badge={
                      latestRedemption
                        ? getRewardStatusLabel(latestRedemption.status)
                        : undefined
                    }
                    badgeClass={
                      latestRedemption
                        ? getRewardStatusClass(latestRedemption.status)
                        : undefined
                    }
                  />

                  <InfoCard
                    icon={<Flame className="h-4 w-4" />}
                    title="Streak reward"
                    value={
                      latestStreakReward
                        ? `Đã nhận +${latestStreakReward.coinsEarned}`
                        : "Chưa mở khóa"
                    }
                    text={
                      latestStreakReward
                        ? `Mốc ${latestStreakReward.milestone} ngày · ${formatDate(
                            latestStreakReward.awardedAt,
                          )}`
                        : "Duy trì 7 ngày liên tiếp để mở khóa +70 coins."
                    }
                  />
                </div>
              </SidePanel>

              <SidePanel
                eyebrow="Coin history"
                title="Giao dịch gần đây"
                icon={<History className="h-5 w-5" />}
              >
                {coinTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {coinTransactions.map((item) => (
                      <CoinRow key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyMini text="Chưa có lịch sử coin. Khi bạn hoàn thành task, focus hoặc đổi quà, giao dịch sẽ hiện ở đây." />
                )}
              </SidePanel>

              <SidePanel
                eyebrow="Latest insight"
                title="Insight gần nhất"
                icon={<BarChart3 className="h-5 w-5" />}
              >
                {latestInsight ? (
                  <>
                    <div className="rounded-[24px] border border-[#E9E5FF] bg-[#FBF9FF] p-4 text-[13px] font-medium leading-relaxed text-[#5B566E]">
                      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        {latestInsight.weekLabel}
                      </div>
                      {latestInsight.summary}
                    </div>

                    <div className="mt-4 grid gap-3">
                      <MiniMetric
                        label="Alignment"
                        value={String(latestInsight.alignmentScore)}
                      />
                      <MiniMetric
                        label="Task hoàn thành"
                        value={String(latestInsight.completedCount)}
                      />
                      <MiniMetric
                        label="Deep work / study"
                        value={String(latestInsight.deepWorkCount)}
                      />
                    </div>
                  </>
                ) : (
                  <EmptyMini text="Khi bạn dùng planner thường xuyên hơn, insight gần nhất sẽ hiện tại đây." />
                )}
              </SidePanel>

              <SidePanel
                eyebrow="Assessment"
                title="Kết quả gần nhất"
                icon={<Target className="h-5 w-5" />}
              >
                {latestResult ? (
                  <div className="space-y-3">
                    <ScoreBar
                      label="Sư tử"
                      value={latestResult.lionScore}
                      max={getScoreMax(latestResult)}
                    />
                    <ScoreBar
                      label="Gấu"
                      value={latestResult.bearScore}
                      max={getScoreMax(latestResult)}
                    />
                    <ScoreBar
                      label="Sói"
                      value={latestResult.wolfScore}
                      max={getScoreMax(latestResult)}
                    />
                    <ScoreBar
                      label="Cá heo"
                      value={latestResult.dolphinScore}
                      max={getScoreMax(latestResult)}
                    />
                  </div>
                ) : (
                  <EmptyMini text="Chưa có kết quả assessment gần đây để hiển thị." />
                )}
              </SidePanel>

              <SidePanel
                eyebrow="Data & privacy"
                title="Dữ liệu đang dùng"
                icon={<ShieldCheck className="h-5 w-5" />}
              >
                <div className="space-y-3">
                  <PrivacyItem
                    icon={<ClipboardList className="h-4 w-4" />}
                    title="Task & Planner"
                    text="Dùng để tính completion, streak và gợi ý kế hoạch."
                  />
                  <PrivacyItem
                    icon={<Timer className="h-4 w-4" />}
                    title="Focus sessions"
                    text="Dùng để tính focus minutes, coin và insight."
                  />
                  <PrivacyItem
                    icon={<MoonStar className="h-4 w-4" />}
                    title="Chronotype"
                    text="Dùng để cá nhân hóa rhythm và planning window."
                  />
                  <PrivacyItem
                    icon={<Database className="h-4 w-4" />}
                    title="Reward activity"
                    text="Dùng để theo dõi coin, đổi quà và lịch sử giao dịch."
                  />
                </div>
              </SidePanel>

              {String(user.role) === "ADMIN" ? (
                <SidePanel
                  eyebrow="Admin"
                  title="Admin quick access"
                  icon={<Settings2 className="h-5 w-5" />}
                >
                  <div className="space-y-3">
                    <ActionLink
                      href="/rewards"
                      title="Reward Center"
                      text="Kiểm tra catalog và flow đổi quà hiện tại."
                    />
                    <ActionLink
                      href="/dashboard"
                      title="Dashboard"
                      text="Quay lại không gian tổng quan."
                    />
                  </div>
                </SidePanel>
              ) : null}

              <SidePanel
                eyebrow="Account"
                title="Tài khoản"
                icon={<Lock className="h-5 w-5" />}
              >
                <div className="rounded-[24px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 text-[13px] font-medium leading-relaxed text-[#5B566E]">
                  Email đăng nhập hiện tại là{" "}
                  <span className="font-black text-[#1A1528]">
                    {user.email}
                  </span>
                  . Tính năng đổi mật khẩu/xuất dữ liệu có thể bổ sung ở phiên
                  bản sau.
                </div>
              </SidePanel>
            </aside>
          </div>
        </SectionWrapper>
      </div>

      <Footer />
    </main>
  );
}

function ProfileHero({
  firstName,
  displayName,
  email,
  role,
  studentId,
  createdAt,
  image,
  avatarLetter,
  coinBalance,
  currentStreak,
  chronotypeMeta,
  completionRate,
}: {
  firstName: string;
  displayName: string;
  email: string;
  role: string;
  studentId: string | null;
  createdAt: Date;
  image: string | null;
  avatarLetter: string;
  coinBalance: number;
  currentStreak: number;
  chronotypeMeta: ChronotypeMeta | null;
  completionRate: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white bg-white font-sans shadow-[0_22px_80px_rgba(26,21,40,0.06)] md:rounded-[48px]">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-5 py-12 md:px-10 md:py-16">
        <HeroGlow />

        <div className="relative z-10 mx-auto max-w-[1080px] text-center">
          <Badge>
            <Sparkles className="h-3.5 w-3.5" />
            ChronoFlow Profile
          </Badge>

          <h1 className="mx-auto mt-5 max-w-[900px] text-[clamp(2rem,4vw,4rem)] font-black leading-[0.98] tracking-[-0.06em] text-[#1A1528]">
            Hồ sơ cá nhân của <GradientText>{firstName}</GradientText>
          </h1>

          <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16.5px]">
            Quản lý thông tin tài khoản, chronotype, mục tiêu giấc ngủ, ví coin
            và các tín hiệu cá nhân hóa đang được ChronoFlow dùng để tối ưu
            planner của bạn.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <SoftChip icon={<User2 className="h-4 w-4" />}>{role}</SoftChip>

            <SoftChip icon={<MoonStar className="h-4 w-4" />}>
              {chronotypeMeta
                ? `${chronotypeMeta.label} ${chronotypeMeta.emoji}`
                : "Chưa có chronotype"}
            </SoftChip>

            <SoftChip icon={<CheckCircle2 className="h-4 w-4" />}>
              Completion {completionRate}%
            </SoftChip>

            <SoftChip icon={<Flame className="h-4 w-4" />}>
              Streak {currentStreak} ngày
            </SoftChip>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1040px] gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="flex flex-col justify-between rounded-[34px] border border-white/80 bg-white/62 p-5 text-left shadow-[0_20px_54px_rgba(31,22,74,0.07)] backdrop-blur-xl md:p-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F3F0FF] px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
                  <Target className="h-3.5 w-3.5" />
                  Không gian cá nhân
                </div>

                <h2 className="mt-4 text-[1rem] font-black leading-tight tracking-[-0.04em] text-[#1A1528] md:text-[1.7rem]">
                  Theo dõi danh tính, nhịp sinh học và tiến độ thật.
                </h2>

                <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
                  Đây là nơi ChronoFlow gom các dữ liệu nền để cá nhân hóa
                  planner, rhythm, insights và reward loop cho bạn.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="group flex min-h-[58px] items-center gap-3 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-black"
                >
                  <Target className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase leading-none tracking-wider text-gray-400">
                      Planner
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Mở planner
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/rewards"
                  className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/85 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF7ED]">
                    <Coins className="h-3.5 w-3.5 text-[#F59E0B]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Reward Center
                  </span>
                </Link>

                <Link
                  href="/assessment"
                  className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/85 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <RefreshCw className="h-3.5 w-3.5 text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Làm lại assessment
                  </span>
                </Link>
              </div>
            </div>

            <ProfileIdentityCard
              displayName={displayName}
              email={email}
              role={role}
              studentId={studentId}
              createdAt={createdAt}
              image={image}
              avatarLetter={avatarLetter}
              coinBalance={coinBalance}
              currentStreak={currentStreak}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AmbientBg() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute left-[10%] top-[-5%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/60 blur-[110px]" />
      <div className="absolute right-[-7%] top-[8%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/60 blur-[110px]" />
      <div className="absolute bottom-[18%] left-[32%] h-[500px] w-[500px] rounded-full bg-white/70 blur-[120px]" />
    </div>
  );
}

function HeroGlow() {
  return (
    <>
      <div className="pointer-events-none absolute left-[8%] top-[-20%] h-[360px] w-[360px] rounded-full bg-white/45 blur-[90px]" />
      <div className="pointer-events-none absolute right-[-8%] top-[12%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/70 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[30%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/45 blur-[110px]" />
    </>
  );
}

function SectionWrapper({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/62 px-5 py-8 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl md:px-8 md:py-10"
    >
      {children}
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
      {children}
    </div>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#6F59FF] via-[#6B6DFF] to-[#4DA8FF] bg-clip-text font-black text-transparent">
      {children}
    </span>
  );
}

function SoftChip({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/84 px-5 py-3 text-[13.5px] font-bold text-[#5B566E] shadow-[0_10px_24px_rgba(95,90,119,0.05)] backdrop-blur-md">
      <span className="text-[#6F59FF]">{icon}</span>
      {children}
    </div>
  );
}

function ProfileIdentityCard({
  displayName,
  email,
  role,
  studentId,
  createdAt,
  image,
  avatarLetter,
  coinBalance,
  currentStreak,
}: {
  displayName: string;
  email: string;
  role: string;
  studentId: string | null;
  createdAt: Date;
  image: string | null;
  avatarLetter: string;
  coinBalance: number;
  currentStreak: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/78 p-5 text-left shadow-[0_28px_70px_rgba(65,48,145,0.12)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D9EAFF]/80 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#DCCEFF]/70 blur-3xl" />

      <div className="relative z-10 rounded-[30px] border border-[#E9E5FF] bg-[#FCFBFF]/90 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-22 w-22 shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-[32px] font-black text-white shadow-[0_18px_38px_rgba(97,76,197,0.22)]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              avatarLetter
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6F59FF]">
              Tài khoản
            </div>

            <div className="mt-2 break-words text-[1.55rem] font-black leading-tight tracking-[-0.035em] text-[#1A1528]">
              {displayName}
            </div>

            <div className="mt-1 break-words text-[13px] font-semibold text-[#5B566E]">
              {email}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[11px] font-black text-[#6F59FF]">
                {role}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#5B566E] shadow-sm">
                Từ {formatDate(createdAt)}
              </span>
            </div>
          </div>

          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]">
            <Mail className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <IdentityMetric
            label="Coin"
            value={formatNumber(coinBalance)}
            tone="orange"
          />
          <IdentityMetric
            label="Streak"
            value={`${currentStreak} ngày`}
            tone="green"
          />
          <IdentityMetric
            label="Student ID"
            value={studentId || "Chưa cập nhật"}
            tone="blue"
          />
          <IdentityMetric label="Vai trò" value={role} tone="purple" />
        </div>
      </div>
    </div>
  );
}

function IdentityMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "purple" | "blue" | "orange" | "green";
}) {
  const style = {
    purple: "border-[#E9E5FF] bg-[#F3F0FF]",
    blue: "border-[#DDEEFF] bg-[#EEF6FF]",
    orange: "border-[#FED7AA] bg-[#FFF7ED]",
    green: "border-[#D1FAE5] bg-[#ECFDF5]",
  }[tone];

  return (
    <div className={`rounded-[22px] border p-4 shadow-sm ${style}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 break-words text-[1.05rem] font-black leading-tight text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-white/80 bg-white/82 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl">
      <div className="border-b border-[#EEF0F6] bg-white/70 px-5 py-5 md:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F3F0FF] px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2 className="mt-4 text-[clamp(1.45rem,2.4vw,1.9rem)] font-[900] leading-tight tracking-tight text-[#1A1528]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-[700px] text-[14px] font-medium leading-relaxed text-[#5B566E]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function SidePanel({
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
    <section className="overflow-hidden rounded-[32px] border border-white/80 bg-white/82 shadow-[0_18px_50px_rgba(26,21,40,0.06)] backdrop-blur-xl">
      <div className="border-b border-[#EEF0F6] bg-white/70 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]">
            {icon}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
              {eyebrow}
            </div>
            <h3 className="mt-1 text-[1.05rem] font-black tracking-tight text-[#1A1528]">
              {title}
            </h3>
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatCard({
  icon,
  title,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint: string;
  tone: "purple" | "blue" | "orange" | "green";
}) {
  const style = getTone(tone);

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${style.card}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/55 blur-3xl" />

      <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        <div className={style.text}>{icon}</div>
      </div>

      <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.18em] text-[#8A84A3]">
        {title}
      </div>
      <div className="relative z-10 mt-2 text-[30px] font-[900] leading-none text-[#1A1528]">
        {value}
      </div>
      <p className="relative z-10 mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {hint}
      </p>
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
    <div className="rounded-[24px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 break-words text-[1.25rem] font-black tracking-tight text-[#1A1528]">
        {value}
      </div>
      <div className="mt-1 text-[12px] font-medium leading-relaxed text-[#5B566E]">
        {hint}
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[#EEF0F6] bg-white/82 p-3 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 break-words text-[0.98rem] font-black text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/82 p-3 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 text-[1rem] font-black text-[#1A1528]">{value}</div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  text,
  badge,
  badgeClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
  badge?: string;
  badgeClass?: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
            {icon}
          </div>
          <div className="min-w-0 text-[13px] font-black text-[#1A1528]">
            {title}
          </div>
        </div>

        {badge ? (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${
              badgeClass || "bg-[#F3F0FF] text-[#6F59FF]"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <div className="break-words text-[1.05rem] font-black text-[#1A1528]">
        {value}
      </div>
      <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#5B566E]">
        {text}
      </p>
    </div>
  );
}

function TaskRow({ task }: { task: ProfileTaskRow }) {
  return (
    <div className="rounded-[26px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-black ${getTaskTypeClass(
                task.type,
              )}`}
            >
              {getTaskTypeLabel(task.type)}
            </span>

            <span className="rounded-full border border-[#EEF0F6] bg-white px-3 py-1.5 text-[11px] font-bold text-[#5B566E]">
              Ưu tiên {getPriorityLabel(task.priority)}
            </span>

            {task.completed ? (
              <span className="rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[11px] font-bold text-[#10B981]">
                Đã xong
              </span>
            ) : (
              <span className="rounded-full bg-[#FFF7ED] px-3 py-1.5 text-[11px] font-bold text-[#F59E0B]">
                Đang mở
              </span>
            )}
          </div>

          <div className="mt-3 text-[16px] font-black tracking-tight text-[#1A1528]">
            {task.name}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#5B566E]">
            <span className="rounded-xl bg-white px-2.5 py-1 shadow-sm">
              {parseTaskDateKey(
                task.scheduledDate,
                task.scheduledTime,
                task.updatedAt,
              ) || "Chưa có ngày"}
            </span>
            <span className="rounded-xl bg-white px-2.5 py-1 shadow-sm">
              {parseTaskStartTime(task.scheduledTime) || "Chưa có giờ"}
            </span>
            <span className="rounded-xl bg-white px-2.5 py-1 shadow-sm">
              {task.duration}
            </span>
          </div>
        </div>

        <div className="w-full max-w-[280px] rounded-[20px] border border-[#EEF0F6] bg-white/82 px-4 py-3 text-[12px] font-medium leading-relaxed text-[#5B566E] shadow-sm">
          {task.explanation || "Task này chưa có ghi chú giải thích."}
        </div>
      </div>
    </div>
  );
}

function CoinRow({ item }: { item: ProfileCoinTransactionRow }) {
  return (
    <div className="flex gap-3 rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-sm">
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border ${getCoinTone(
          item.amount,
        )}`}
      >
        {getCoinIcon(item.type, item.amount)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-black text-[#1A1528]">
          {item.description}
        </div>
        <div className="mt-1 text-[11px] font-bold text-[#8A84A3]">
          {formatDateTime(item.createdAt)}
        </div>
      </div>

      <div
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${
          item.amount >= 0
            ? "bg-[#ECFDF5] text-[#10B981]"
            : "bg-[#FFF7ED] text-[#F59E0B]"
        }`}
      >
        {item.amount >= 0 ? "+" : ""}
        {formatNumber(item.amount)}
      </div>
    </div>
  );
}

function PrivacyItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-sm">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-[13px] font-black text-[#1A1528]">{title}</div>
        <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#5B566E]">
          {text}
        </p>
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
      className="group block rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 transition hover:-translate-y-0.5 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[14px] font-black tracking-tight text-[#1A1528]">
            {title}
          </div>
          <div className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#5B566E]">
            {text}
          </div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#6F59FF] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function EmptyMini({ text }: { text: string }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#DCD3FF] bg-[#F8F9FE] p-4 text-[13px] font-medium leading-relaxed text-[#5B566E]">
      {text}
    </div>
  );
}

function EmptyPanel({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#DCD3FF] bg-[#F8F9FE] p-8 text-center">
      <div className="text-[1.15rem] font-black tracking-tight text-[#1A1528]">
        {title}
      </div>
      <p className="mx-auto mt-2 max-w-2xl text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {text}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[#1A1528] px-5 text-[13px] font-black text-white shadow-xl transition hover:-translate-y-0.5"
      >
        {cta}
      </Link>
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
    <div className="rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[13px] font-black text-[#1A1528]">{label}</div>
        <div className="text-[11px] font-bold text-[#5B566E]">
          {value} điểm
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#EEE9FF] shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function getTone(tone: "purple" | "blue" | "orange" | "green") {
  const styles = {
    purple: {
      text: "text-[#6F59FF]",
      card: "from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF] border-[#D6CBFF]",
    },
    blue: {
      text: "text-[#4DA8FF]",
      card: "from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF] border-[#BFDDFF]",
    },
    orange: {
      text: "text-[#F59E0B]",
      card: "from-[#FFF8F0] via-[#FFEDD6] to-[#FFE0B2] border-[#FCD34D]",
    },
    green: {
      text: "text-[#10B981]",
      card: "from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] border-[#6EE7B7]",
    },
  };

  return styles[tone];
}
