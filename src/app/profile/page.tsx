import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  MoonStar,
  Sparkles,
  Target,
  User2,
  Activity,
  ClipboardList,
  ShieldCheck,
  Zap,
} from "lucide-react";

type ChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

function normalizeChronotype(value: string | null | undefined): ChronotypeKey | null {
  if (!value) return null;
  const key = String(value).toUpperCase();
  if (key.includes("LION")) return "LION";
  if (key.includes("WOLF")) return "WOLF";
  if (key.includes("DOLPHIN")) return "DOLPHIN";
  if (key.includes("BEAR")) return "BEAR";
  return null;
}

const CHRONOTYPE_META: Record<
  ChronotypeKey,
  {
    label: string;
    emoji: string;
    subtitle: string;
    gradient: string;
    soft: string;
    border: string;
    focusWindow: string;
    summary: string;
  }
> = {
  LION: {
    label: "Sư tử",
    emoji: "🦁",
    subtitle: "Mạnh vào buổi sáng",
    gradient: "from-[#F59E0B] via-[#F6B54A] to-[#FCD34D]",
    soft: "from-[#FFF9F0] via-[#FFF6EA] to-[#FFF1DD]",
    border: "border-[#F4D6A7]",
    focusWindow: "07:00 - 10:00",
    summary:
      "Bạn thường tỉnh táo sớm, vào việc nhanh ở đầu ngày và hợp với việc khó vào buổi sáng.",
  },
  BEAR: {
    label: "Gấu",
    emoji: "🐻",
    subtitle: "Nhịp cân bằng ban ngày",
    gradient: "from-[#6F59FF] via-[#8571FF] to-[#9B8CFF]",
    soft: "from-[#F8F7FF] via-[#F3F0FF] to-[#ECE8FF]",
    border: "border-[#D9CEFF]",
    focusWindow: "09:00 - 12:00",
    summary:
      "Bạn hợp với nhịp sống ban ngày, giữ mức năng lượng khá ổn định và phù hợp với lịch tiêu chuẩn.",
  },
  WOLF: {
    label: "Sói",
    emoji: "🐺",
    subtitle: "Mạnh hơn về chiều và tối",
    gradient: "from-[#5B46FF] via-[#7564FF] to-[#8D7CFF]",
    soft: "from-[#F5F5FF] via-[#EFEDFF] to-[#E8E5FF]",
    border: "border-[#D5D1FF]",
    focusWindow: "14:30 - 18:00",
    summary:
      "Bạn thường lên nhịp chậm hơn vào buổi sáng nhưng mạnh hơn về cuối chiều hoặc tối sớm.",
  },
  DOLPHIN: {
    label: "Cá heo",
    emoji: "🐬",
    subtitle: "Nhạy giấc ngủ, hợp block gọn",
    gradient: "from-[#4DA8FF] via-[#62BCFF] to-[#7DD3FC]",
    soft: "from-[#F9F8FF] via-[#F4F1FF] to-[#EEEAFE]",
    border: "border-[#DDD4FF]",
    focusWindow: "10:00 - 11:30",
    summary:
      "Bạn nhạy hơn với giấc ngủ và môi trường, phù hợp với planner mềm và các block tập trung ngắn, rõ.",
  },
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatRole(role: string) {
  return role === "ADMIN" ? "Quản trị viên" : "Người dùng";
}

function getCompletionRate(total: number, completed: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
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

function parseTaskStartTime(scheduledTime: string | null | undefined): string | null {
  const raw = String(scheduledTime || "").trim();
  if (!raw || raw.toUpperCase() === "BACKLOG") return null;

  const pipeParts = raw.split("|");
  if (pipeParts.length === 3) return pipeParts[1];

  const match = raw.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
  if (match) return match[1];

  return null;
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

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
        <Navbar />
        <section className="relative px-6 py-24">
          <AmbientBg />
          <div className="relative z-10 mx-auto max-w-3xl rounded-[40px] border border-white/80 bg-white/85 p-10 text-center shadow-[0_30px_90px_rgba(97,76,197,0.10)] backdrop-blur-2xl">
            <div className="mb-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#F7F4FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              ChronoFlow Profile
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D] md:text-5xl">
              Bạn cần đăng nhập để xem hồ sơ
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[#615C7A]">
              Đăng nhập để xem thông tin tài khoản, chronotype, thói quen ngủ mục tiêu và các chỉ số sử dụng ChronoFlow của bạn.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/login?callbackUrl=/profile"
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
      tasks: {
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          name: true,
          type: true,
          priority: true,
          duration: true,
          deadline: true,
          scheduledTime: true,
          explanation: true,
          completed: true,
          createdAt: true,
        },
      },
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

  const chronotype = normalizeChronotype(user.chronotype);
  const chronotypeMeta = chronotype ? CHRONOTYPE_META[chronotype] : null;

  const totalTasks = user.tasks.length;
  const completedTasks = user.tasks.filter((task) => task.completed).length;
  const pendingTasks = user.tasks.filter((task) => !task.completed).length;
  const completionRate = getCompletionRate(totalTasks, completedTasks);

  const latestInsight = user.weeklyInsights[0] ?? null;
  const latestResult = user.chronotypeResults[0] ?? null;
  const displayName = user.name?.trim() || "Người dùng";
  const firstName = displayName.split(" ").slice(-1)[0] || displayName;

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

              <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.06fr)_430px] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_22px_rgba(111,89,255,0.08)] backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    ChronoFlow Profile
                  </div>

                  <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.2rem)] font-black leading-[0.96] tracking-tight text-[#1A1528]">
                    Hồ sơ{" "}
                    <span className="bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] bg-clip-text text-transparent">
                      cá nhân
                    </span>{" "}
                    của {firstName}.
                  </h1>

                  <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
                    Đây là nơi bạn quản lý thông tin tài khoản, chronotype, mục tiêu giấc ngủ và các tín hiệu cá nhân hóa từ ChronoFlow.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Chip icon={<User2 className="h-4 w-4 text-[#7C5CFA]" />}>
                      {formatRole(user.role)}
                    </Chip>
                    {chronotypeMeta ? (
                      <Chip icon={<MoonStar className="h-4 w-4 text-[#7C5CFA]" />}>
                        {chronotypeMeta.label} {chronotypeMeta.emoji}
                      </Chip>
                    ) : (
                      <Chip icon={<Target className="h-4 w-4 text-[#7C5CFA]" />}>
                        Chưa có chronotype
                      </Chip>
                    )}
                    <Chip icon={<CheckCircle2 className="h-4 w-4 text-[#7C5CFA]" />}>
                      Completion rate: {completionRate}%
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
                      href="/assessment"
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white/90 px-6 text-[14px] font-semibold text-[#241F3D] shadow-sm transition hover:bg-white"
                    >
                      Cập nhật đánh giá
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[430px]">
                  <div className="absolute -left-4 top-8 h-[88%] w-[92%] rounded-[34px] bg-white/35 blur-md" />
                  <div className="absolute -right-3 bottom-3 h-[86%] w-[88%] rounded-[34px] bg-[#DCCEFF]/30 blur-md" />

                  <div className="relative rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F5FF_100%)] p-6 shadow-[0_24px_80px_rgba(97,76,197,0.14)]">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-[28px] font-black text-white shadow-[0_16px_34px_rgba(97,76,197,0.22)]">
                          {displayName.trim().charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                            Tài khoản
                          </div>
                          <div className="mt-2 text-[1.45rem] font-black tracking-tight text-[#241F3D]">
                            {displayName}
                          </div>
                          <div className="mt-1 text-[13px] font-medium text-[#615C7A]">
                            Thành viên từ {formatDateTime(user.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF] shadow-sm">
                        <Mail className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <MetricCard
                        label="Email"
                        value={user.email}
                        hint="email đăng nhập hiện tại"
                        compact
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <MetricCard
                          label="Student ID"
                          value={user.studentId || "Chưa cập nhật"}
                          hint="mã sinh viên"
                          compact
                        />
                        <MetricCard
                          label="Vai trò"
                          value={formatRole(user.role)}
                          hint="quyền tài khoản"
                          compact
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<ClipboardList className="h-5 w-5" />}
              title="Tổng task"
              value={String(totalTasks)}
              hint="task gần đây trong planner"
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Hoàn thành"
              value={String(completedTasks)}
              hint="task đã xong"
            />
            <StatCard
              icon={<Clock3 className="h-5 w-5" />}
              title="Đang mở"
              value={String(pendingTasks)}
              hint="task chưa xong"
            />
            <StatCard
              icon={<Activity className="h-5 w-5" />}
              title="Completion"
              value={`${completionRate}%`}
              hint="tỷ lệ hoàn thành"
            />
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
            <section className="space-y-8">
              <GlassSection eyebrow="Chỉnh sửa hồ sơ" title="Cập nhật thông tin cá nhân thật">
              <ProfileEditForm
  initialName={user.name}
  initialStudentId={user.studentId}
  initialTargetSleepTime={user.targetSleepTime}
  initialTargetWakeTime={user.targetWakeTime}
  initialImage={user.image}
/>
              </GlassSection>

              <GlassSection eyebrow="Thông tin cá nhân hoá" title="Chronotype và nhịp sinh học của bạn">
                {chronotypeMeta ? (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className={`rounded-[32px] border ${chronotypeMeta.border} bg-gradient-to-br ${chronotypeMeta.soft} p-6 shadow-[0_16px_36px_rgba(97,76,197,0.06)]`}>
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                            Chronotype hiện tại
                          </div>
                          <div className="mt-2 text-[1.8rem] font-black tracking-tight text-[#241F3D]">
                            {chronotypeMeta.label} {chronotypeMeta.emoji}
                          </div>
                          <div className="mt-1 text-[14px] font-medium text-[#615C7A]">
                            {chronotypeMeta.subtitle}
                          </div>
                        </div>

                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_16px_34px_rgba(97,76,197,0.22)] ${chronotypeMeta.gradient}`}>
                          <MoonStar className="h-6 w-6" />
                        </div>
                      </div>

                      <p className="text-[14px] leading-7 text-[#615C7A]">
                        {chronotypeMeta.summary}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <MiniMetric
                          label="Focus window"
                          value={chronotypeMeta.focusWindow}
                        />
                        <MiniMetric
                          label="Trạng thái"
                          value="Đã cá nhân hoá"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <QuickInfoCard
                        icon={<MoonStar className="h-5 w-5" />}
                        title="Giờ ngủ mục tiêu"
                        value={user.targetSleepTime || "Chưa cập nhật"}
                        text="Dùng để tinh chỉnh trải nghiệm theo nhịp ngủ."
                      />
                      <QuickInfoCard
                        icon={<Zap className="h-5 w-5" />}
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
              </GlassSection>

              <GlassSection eyebrow="Recent activity" title="Task gần đây của bạn">
                {user.tasks.length === 0 ? (
                  <EmptyPanel
                    title="Bạn chưa có task nào"
                    text="Khi bắt đầu dùng planner, phần hồ sơ sẽ hiển thị rõ hơn pattern làm việc và hoạt động gần đây."
                    href="/planner"
                    cta="Mở planner"
                  />
                ) : (
                  <div className="grid gap-4">
                    {user.tasks.map((task) => (
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
                              <span className="rounded-md bg-slate-50 px-2 py-1">
                                {task.duration}
                              </span>
                            </div>
                          </div>

                          <div className="w-full max-w-[280px] rounded-[20px] border border-[#ECE8FF] bg-[#FAF8FF] px-4 py-3 text-[13px] leading-6 text-[#615C7A]">
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
              <SidebarSection eyebrow="Profile info" title="Thông tin nhanh" icon={<User2 className="h-5 w-5" />}>
                <div className="space-y-4">
                  <InfoRow label="Họ tên" value={displayName} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Vai trò" value={formatRole(user.role)} />
                  <InfoRow label="Student ID" value={user.studentId || "Chưa cập nhật"} />
                  <InfoRow label="Ngày tạo tài khoản" value={formatDateTime(user.createdAt)} />
                  <InfoRow label="Cập nhật gần nhất" value={formatDateTime(user.updatedAt)} />
                </div>
              </SidebarSection>

              <SidebarSection eyebrow="Latest insight" title="Insight gần nhất" icon={<BarChart3 className="h-5 w-5" />}>
                {latestInsight ? (
                  <>
                    <div className="rounded-[24px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] p-4 text-[13px] leading-7 text-[#615C7A] shadow-sm">
                      <div className="mb-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        {latestInsight.weekLabel}
                      </div>
                      {latestInsight.summary}
                    </div>

                    <div className="mt-4 grid gap-3">
                      <MiniMetric label="Alignment score" value={String(latestInsight.alignmentScore)} />
                      <MiniMetric label="Task hoàn thành" value={String(latestInsight.completedCount)} />
                      <MiniMetric label="Deep work / study" value={String(latestInsight.deepWorkCount)} />
                    </div>
                  </>
                ) : (
                  <EmptyMini text="Khi bạn dùng planner thường xuyên hơn, phần insight gần nhất sẽ hiện rõ hơn tại đây." />
                )}
              </SidebarSection>

              <SidebarSection eyebrow="Assessment" title="Kết quả gần nhất" icon={<Target className="h-5 w-5" />}>
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

              <SidebarSection eyebrow="Quick actions" title="Đi tiếp từ đây" icon={<CalendarClock className="h-5 w-5" />}>
                <div className="space-y-3">
                  <ActionLink
                    href="/planner"
                    title="Mở planner"
                    text="Xây lịch làm việc đúng theo nhịp cá nhân."
                  />
                  <ActionLink
                    href="/rhythm"
                    title="Xem rhythm"
                    text="Đọc lại focus window và nhịp sinh học của bạn."
                  />
                  <ActionLink
                    href="/dashboard"
                    title="Về dashboard"
                    text="Quay lại trang tổng quan chính của tài khoản."
                  />
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
  compact = false,
}: {
  label: string;
  value: string;
  hint: string;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-[24px] border border-white/80 bg-white/82 shadow-[0_12px_28px_rgba(97,76,197,0.05)] ${compact ? "p-4" : "p-5"}`}>
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className={`mt-2 font-black tracking-tight text-[#241F3D] ${compact ? "text-[1rem]" : "text-[1.35rem]"}`}>
        {value}
      </div>
      <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">{hint}</div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/84 p-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[1.1rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
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

function QuickInfoCard({
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
    <div className="rounded-[28px] border border-white/80 bg-white/84 p-5 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA] shadow-sm">{icon}</div>
        <div className="text-[1rem] font-black tracking-tight text-[#241F3D]">{title}</div>
      </div>
      <div className="text-[1.15rem] font-black tracking-tight text-[#241F3D]">{value}</div>
      <div className="mt-2 text-[13px] leading-6 text-[#615C7A]">{text}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/80 bg-white/84 px-4 py-3 shadow-[0_12px_24px_rgba(97,76,197,0.04)]">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 break-words text-[14px] font-semibold text-[#241F3D]">
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
    <div className="rounded-[32px] border border-dashed border-[#D9CEFF] bg-white/60 p-10 text-center">
      <div className="text-[20px] font-black tracking-tight text-[#241F3D]">{title}</div>
      <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-7 text-[#615C7A]">
        {text}
      </p>
      <Link
        href={href}
        className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#1A1528] px-6 text-[13.5px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
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