"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ListTodo,
  MoonStar,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Flame,
  RefreshCcw,
  Grid2X2,
} from "lucide-react";

const CHRONOTYPE_META = {
  LION: {
    label: "Sư tử",
    emoji: "🦁",
    subtitle: "Mạnh vào buổi sáng",
    summary:
      "Bạn thường rõ đầu óc và vào guồng nhanh hơn ở đầu ngày. Nên ưu tiên việc khó vào giờ vàng buổi sáng, rồi giảm tải dần về chiều.",
    focusWindow: "07:00 - 10:00",
    supportWindow: "13:00 - 15:00",
    recoveryWindow: "Tối sớm",
    note: "Bảo vệ buổi sáng cho deep work, đừng lấp bằng admin.",
    gradient: "from-[#F59E0B] to-[#FCD34D]",
  },
  BEAR: {
    label: "Gấu",
    emoji: "🐻",
    subtitle: "Nhịp cân bằng ban ngày",
    summary:
      "Bạn có xu hướng hợp với nhịp sinh hoạt ban ngày và duy trì mức ổn định tốt. Điều quan trọng là chặn trước block tập trung để tránh bị lịch vụn.",
    focusWindow: "09:00 - 12:00",
    supportWindow: "14:00 - 16:00",
    recoveryWindow: "Cuối chiều",
    note: "Lịch ban ngày hợp với bạn, nhưng vẫn cần giữ block tập trung rõ ràng.",
    gradient: "from-[#6F59FF] to-[#9B8CFF]",
  },
  WOLF: {
    label: "Sói",
    emoji: "🐺",
    subtitle: "Mạnh hơn về chiều và tối",
    summary:
      "Bạn thường khởi động chậm hơn vào buổi sáng nhưng bùng năng lượng tốt hơn về chiều hoặc tối. Việc khó nên đặt muộn hơn thay vì ép vào quá sớm.",
    focusWindow: "14:30 - 18:00",
    supportWindow: "19:00 - 21:00",
    recoveryWindow: "Sáng nhẹ nhàng",
    note: "Đừng dùng hết giờ mạnh cuối ngày cho việc phản hồi hoặc việc nhẹ.",
    gradient: "from-[#5B46FF] to-[#8D7CFF]",
  },
  DOLPHIN: {
    label: "Cá heo",
    emoji: "🐬",
    subtitle: "Nhạy giấc ngủ, hợp block gọn",
    summary:
      "Bạn dễ nhạy với giấc ngủ và môi trường hơn người khác. Planner nên ngắn, có khoảng đệm và ưu tiên block tập trung rõ, ít nhiễu.",
    focusWindow: "10:00 - 11:30",
    supportWindow: "16:00 - 18:00",
    recoveryWindow: "Xen kẽ trong ngày",
    note: "Đừng ép lịch quá cứng. Block ngắn và rõ sẽ hợp với bạn hơn.",
    gradient: "from-[#4DA8FF] to-[#7DD3FC]",
  },
} as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 15 },
  },
};

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function parseTaskTimeLabel(scheduledTime: string | null | undefined) {
  const raw = String(scheduledTime || "").trim();
  if (!raw || raw.toUpperCase() === "BACKLOG") return "Backlog";
  const pipeParts = raw.split("|");
  if (pipeParts.length === 3) return `${pipeParts[1]} - ${pipeParts[2]}`;
  const match = raw.match(/^\d{4}-\d{2}-\d{2}\s+(\d{2}:\d{2}\s*-\s*\d{2}:\d{2})$/);
  if (match) return match[1];
  return raw;
}

function getTaskTypeLabel(type: string) {
  const types: Record<string, string> = {
    DEEP_WORK: "Deep work",
    STUDY: "Học tập",
    CREATIVE: "Sáng tạo",
    ADMIN: "Admin",
    ROUTINE: "Routine",
    PERSONAL: "Cá nhân",
  };
  return types[type] || type;
}

function getPriorityLabel(priority: string) {
  const priorities: Record<string, string> = {
    HIGH: "Cao",
    MEDIUM: "Trung bình",
    LOW: "Thấp",
  };
  return priorities[priority] || priority;
}

function getTaskTone(type: string) {
  switch (type) {
    case "DEEP_WORK":
      return "from-[#6B5BFF] to-[#5B8CFF] text-white";
    case "STUDY":
      return "from-[#5B8CFF] to-[#60A5FA] text-white";
    case "CREATIVE":
      return "from-[#F59E0B] to-[#FBBF24] text-white";
    case "ADMIN":
      return "from-[#94A3B8] to-[#CBD5E1] text-white";
    case "ROUTINE":
      return "from-[#10B981] to-[#34D399] text-white";
    default:
      return "from-[#EC4899] to-[#F9A8D4] text-white";
  }
}

export default function DashboardClientUI({
  data,
  isGuest,
  isError,
}: {
  data: any;
  isGuest: boolean;
  isError: boolean;
}) {
  if (isGuest) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-slate-50 text-[#241F3D]">
        <Navbar />
        <section className="relative px-6 py-32">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] animate-[pulse_6s_infinite] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
            <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] animate-[pulse_8s_infinite] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 mx-auto max-w-3xl rounded-[40px] border border-white/90 bg-white/70 p-12 text-center shadow-[0_30px_80px_rgba(97,76,197,0.08)] backdrop-blur-2xl ring-1 ring-gray-100"
          >
            <div className="mb-6 inline-flex rounded-full border border-[#E9E5FF] bg-white px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.16em] text-[#7C5CFA] shadow-sm">
              <Sparkles className="mr-2 h-4 w-4" /> ChronoFlow Dashboard
            </div>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-black tracking-tight text-[#241F3D]">
              Bạn cần đăng nhập để mở dashboard
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-8 text-[#615C7A]">
              Đăng nhập để xem chronotype, insight tuần, task hôm nay và tình trạng planner theo nhịp sinh học của bạn.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/login?callbackUrl=/dashboard"
                className="group inline-flex min-h-[54px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-8 text-[15px] font-bold text-white shadow-[0_15px_30px_rgba(108,92,255,0.25)] transition-all hover:scale-105"
              >
                Đăng nhập ngay
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-slate-50 text-[#241F3D]">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center text-xl font-bold">
          Lỗi không tìm thấy tài khoản.
        </div>
      </main>
    );
  }

  const meta = CHRONOTYPE_META[data.chronotype as keyof typeof CHRONOTYPE_META];

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-[#241F3D]">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-5%] top-[5%] h-[500px] w-[500px] animate-[pulse_8s_infinite] rounded-full bg-purple-200/30 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] animate-[pulse_10s_infinite] rounded-full bg-blue-200/30 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: "radial-gradient(#CFC7E8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <section className="relative z-10 px-4 pb-20 pt-0 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1320px] space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="overflow-hidden rounded-[48px] border-[1.5px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(243,238,255,0.6)_100%)] shadow-[0_30px_90px_rgba(97,76,197,0.1)] backdrop-blur-2xl">
              <div className="relative px-6 py-10 md:px-12 md:py-14 lg:px-14">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-[5%] top-[-20%] h-[300px] w-[300px] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
                  <div className="absolute right-[5%] bottom-[-20%] h-[300px] w-[300px] rounded-full bg-[#D9EAFF]/50 blur-[100px]" />
                </div>

                <div className="relative z-10 grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_460px] xl:items-center">
                  <div>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm backdrop-blur-md">
                      <Sparkles className="h-4 w-4" /> Tổng quan hôm nay
                    </div>

                    <h1 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                      Xin chào {data.firstName}, <br className="hidden sm:block" />
                      đây là{" "}
                      <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent drop-shadow-sm">
                        nhịp làm việc
                      </span>{" "}
                      của bạn.
                    </h1>
    
                    <p className="mt-6 max-w-2xl text-[16px] font-medium leading-8 text-[#5B566E]">
                      Bạn đang nghiêng về chronotype <span className="font-black text-[#241F3D]">{meta.label}</span>.{" "}
                      {meta.summary}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Chip icon={<Zap className="h-4 w-4 text-[#7C5CFA]" />}>{meta.subtitle}</Chip>
                      <Chip icon={<CalendarClock className="h-4 w-4 text-[#7C5CFA]" />}>{formatDateLabel(new Date())}</Chip>
                      <Chip icon={<CheckCircle2 className="h-4 w-4 text-[#7C5CFA]" />}>{data.completedTasksCount} task đã xong</Chip>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                      <Link
                        href="/planner"
                        className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-[#1A1528] px-8 text-[15px] font-[900] text-white shadow-[0_15px_30px_rgba(26,21,40,0.15)] transition-all hover:scale-105"
                      >
                        Mở planner của tôi
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/learn"
                        className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-white/80 bg-white/80 px-8 text-[15px] font-[900] text-[#1A1528] shadow-sm backdrop-blur-md transition-all hover:bg-white hover:scale-105"
                      >
                        Đọc thêm về chronotype
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="rounded-[36px] border-[4px] border-white/80 bg-white/60 p-7 shadow-[0_20px_50px_rgba(97,76,197,0.06)] backdrop-blur-xl"
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                            Chronotype của bạn
                          </div>
                          <div className="mt-2 text-[28px] font-black tracking-tight text-[#241F3D]">
                            {meta.label} <span className="drop-shadow-md">{meta.emoji}</span>
                          </div>
                        </div>
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${meta.gradient}`}>
                          <MoonStar className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <MetricCard label="Giờ mạnh chính" value={meta.focusWindow} hint="Nên giữ cho deep work" />
                        <MetricCard label="Khung phụ" value={meta.supportWindow} hint="Hợp cho việc nhẹ hơn" />
                      </div>

                      <div className="mt-4 rounded-[20px] border border-[#ECE8FF] bg-[#FAF9FF] px-5 py-4 text-[13.5px] font-medium leading-relaxed text-[#615C7A] shadow-inner">
                        <span className="font-bold text-[#6F59FF]">Lưu ý: </span>
                        {meta.note}
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="rounded-[36px] border-[4px] border-white/80 bg-white/60 p-7 shadow-[0_20px_50px_rgba(97,76,197,0.06)] backdrop-blur-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                          Điểm năng suất
                        </div>
                        <p className="mt-2 max-w-[200px] text-[13px] font-medium leading-relaxed text-[#615C7A]">
                          Mức độ bạn xếp lịch hợp nhịp sinh học
                        </p>
                      </div>
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-[#F3EEFF]">
                        <svg className="absolute inset-0 h-full w-full rotate-[-90deg]">
                          <circle cx="48" cy="48" r="40" fill="none" stroke="#F3EEFF" strokeWidth="8" />
                          <motion.circle
                            cx="48"
                            cy="48"
                            r="40"
                            fill="none"
                            stroke="#6F59FF"
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * data.focusScore) / 100}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * data.focusScore) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="text-[26px] font-[950] tracking-tight text-[#1A1528]">
                          {data.focusScore}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
            <section className="space-y-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-6 md:grid-cols-3"
              >
                <SummaryCard icon={<Target />} title="Chờ xử lý" value={data.pendingTasksCount} hint="Task đang mở" />
                <SummaryCard icon={<CheckCircle2 />} title="Hoàn thành" value={data.completedTasksCount} hint="Đã xong hôm nay" />
                <SummaryCard icon={<ListTodo />} title="Backlog" value={data.backlogTasksCount} hint="Chưa gán lịch" />
              </motion.div>

              <GlassSection
                eyebrow="Năng lượng trong ngày"
                title="Chart nhịp năng lượng mini"
                actionHref="/rhythm"
                actionLabel="Xem chi tiết"
              >
                <EnergyMiniChart points={data.energySeries} gradientClass={meta.gradient} />
              </GlassSection>

              <GlassSection
                eyebrow="Task hôm nay"
                title="Các task trong ngày"
                actionHref="/planner"
                actionLabel="Chỉnh sửa planner"
              >
                {data.todayTasks.length === 0 ? (
                  <EmptyState
                    title="Hôm nay chưa có task nào"
                    text="Thêm task mới để bắt đầu sắp việc theo nhịp sinh học."
                    href="/planner"
                    cta="Mở planner ngay"
                  />
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {data.todayTasks.slice(0, 6).map((task: any) => (
                      <motion.div
                        key={task.id}
                        variants={itemVariants}
                        whileHover={{ y: -3, scale: 1.01 }}
                        className="group rounded-[28px] border border-white/80 bg-white p-5 shadow-sm transition-shadow hover:border-[#E9E5FF] hover:shadow-[0_15px_30px_rgba(26,21,40,0.06)]"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] ${getTaskTone(task.type)} shadow-sm`}>
                                {getTaskTypeLabel(task.type)}
                              </span>
                              <span className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-500">
                                Ưu tiên {getPriorityLabel(task.priority)}
                              </span>
                              {task.completed && (
                                <span className="rounded-full border border-[#DDF5E7] bg-[#F3FFF8] px-3 py-1.5 text-[11px] font-bold text-[#2E7C59]">
                                  Đã xong
                                </span>
                              )}
                            </div>
                            <div className={`mt-3 text-[18px] font-[900] tracking-tight ${task.completed ? "text-gray-400 line-through" : "text-[#241F3D]"}`}>
                              {task.name}
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-[13.5px] font-medium text-[#615C7A]">
                              <span className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1">
                                <Clock3 className="h-4 w-4 text-[#7C5CFA]" />
                                {parseTaskTimeLabel(task.scheduledTime)}
                              </span>
                              <span className="rounded-md bg-slate-50 px-2 py-1">{task.duration}</span>
                            </div>
                            {task.explanation ? (
                              <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#615C7A]">
                                {task.explanation}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </GlassSection>

              <GlassSection eyebrow="Focus alignment" title="Task theo đúng / sai focus window">
                <div className="grid gap-6 lg:grid-cols-2">
                  <FocusWindowPanel
                    icon={<Flame className="h-5 w-5" />}
                    title="Đúng focus window"
                    tone="good"
                    items={data.alignedTasks}
                    emptyText="Chưa có task deep work nào nằm đúng giờ mạnh."
                  />
                  <FocusWindowPanel
                    icon={<RefreshCcw className="h-5 w-5" />}
                    title="Lệch focus window"
                    tone="warn"
                    items={data.misalignedTasks}
                    emptyText="Rất tốt, hiện chưa có task deep work nào bị lệch giờ mạnh."
                  />
                </div>
              </GlassSection>

              <GlassSection eyebrow="Insight tuần" title="Nhìn lại cách bạn dùng nhịp sinh học">
                <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[32px] border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#F3EEFF] p-3 text-[#6F59FF]">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                          Weekly Insight
                        </div>
                        <div className="mt-0.5 text-[18px] font-black tracking-tight text-[#241F3D]">
                          {data.latestInsight?.weekLabel || "Chưa có dữ liệu"}
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-[14.5px] font-medium leading-relaxed text-[#5B566E]">
                      {data.latestInsight?.summary || "Hoàn thành thêm task để xem phân tích tuần này nhé."}
                    </p>

                    {data.latestInsight?.recommendation && (
                      <div className="mt-5 rounded-[20px] border border-[#E9E5FF] bg-[#FAF8FF] px-5 py-4 text-[13.5px] font-medium leading-relaxed text-[#615C7A] shadow-inner">
                        <span className="font-bold text-[#6F59FF]">Gợi ý: </span>
                        {data.latestInsight.recommendation}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <MiniStat label="Task hoàn thành tuần" value={String(data.latestInsight?.completedCount ?? data.completedTasksCount)} />
                    <MiniStat label="Deep work / Study" value={String(data.latestInsight?.deepWorkCount ?? 0)} />
                    <MiniStat label="Điểm alignment" value={String(data.latestInsight?.alignmentScore ?? data.focusScore)} />
                  </div>
                </div>
              </GlassSection>
            </section>

            <aside className="space-y-8">
              <SidebarSection eyebrow="Nhịp của bạn" title="3 khung quan trọng" icon={<Brain className="h-5 w-5" />}>
                <div className="space-y-4">
                  <RhythmCard title="Focus window" value={meta.focusWindow} text="Dành cho việc khó, cần chiều sâu." accent={meta.gradient} />
                  <RhythmCard title="Khung phụ" value={meta.supportWindow} text="Hợp cho việc nhẹ, email." accent="from-[#EDE9FE] to-[#DBEAFE]" />
                  <RhythmCard title="Khung hồi phục" value={meta.recoveryWindow} text="Giảm cường độ tránh vỡ nhịp." accent="from-[#FCE7F3] to-[#F3E8FF]" />
                </div>
              </SidebarSection>

              <SidebarSection eyebrow="Quick reschedule" title="Khung giờ gợi ý để dời task" icon={<CalendarClock className="h-5 w-5" />}>
                <div className="space-y-3">
                  {data.quickRescheduleCards.map((card: any) => (
                    <div
                      key={`${card.title}-${card.slot}`}
                      className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-sm"
                    >
                      <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        {card.title}
                      </div>
                      <div className="mt-1.5 text-[20px] font-[950] tracking-tight text-[#241F3D]">
                        {card.slot}
                      </div>
                      <div className="mt-2 text-[13px] font-medium leading-relaxed text-[#615C7A]">
                        {card.note}
                      </div>
                    </div>
                  ))}
                </div>
              </SidebarSection>

              <SidebarSection eyebrow="Heatmap tuần" title="Weekly heatmap mini" icon={<Grid2X2 className="h-5 w-5" />}>
                <WeeklyHeatmapMini items={data.weekHeatmap} />
              </SidebarSection>

              <SidebarSection eyebrow="Quick actions" title="Đi tiếp từ đây" icon={<TrendingUp className="h-5 w-5" />}>
                <div className="space-y-3">
                  <ActionLink href="/planner" title="Mở planner" text="Sắp task theo ngày, tuần." />
                  <ActionLink href="/rhythm" title="Xem nhịp của tôi" text="Đọc lại khung giờ mạnh." />
                  <ActionLink href="/insights" title="Xem phân tích" text="Mở pattern làm việc." />
                </div>
              </SidebarSection>

              {data.latestResult && (
                <SidebarSection eyebrow="Kết quả gần nhất" title="Điểm chronotype" icon={<MoonStar className="h-5 w-5" />}>
                  <div className="space-y-3">
                    <ScoreBar label="Sư tử" value={data.latestResult.lionScore} max={Math.max(data.latestResult.lionScore, data.latestResult.bearScore, data.latestResult.wolfScore, data.latestResult.dolphinScore, 1)} />
                    <ScoreBar label="Gấu" value={data.latestResult.bearScore} max={Math.max(data.latestResult.lionScore, data.latestResult.bearScore, data.latestResult.wolfScore, data.latestResult.dolphinScore, 1)} />
                    <ScoreBar label="Sói" value={data.latestResult.wolfScore} max={Math.max(data.latestResult.lionScore, data.latestResult.bearScore, data.latestResult.wolfScore, data.latestResult.dolphinScore, 1)} />
                    <ScoreBar label="Cá heo" value={data.latestResult.dolphinScore} max={Math.max(data.latestResult.lionScore, data.latestResult.bearScore, data.latestResult.wolfScore, data.latestResult.dolphinScore, 1)} />
                  </div>
                </SidebarSection>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function GlassSection({
  eyebrow,
  title,
  actionHref,
  actionLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-[40px] border border-white/80 bg-white/70 shadow-[0_20px_70px_rgba(97,76,197,0.06)] backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-white/50 px-8 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
            {eyebrow}
          </div>
          <h2 className="mt-1.5 text-[22px] font-[950] tracking-tight text-[#241F3D]">
            {title}
          </h2>
        </div>

        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="group inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#E9E5FF] bg-white px-5 text-[14px] font-bold text-[#241F3D] shadow-sm transition hover:bg-[#F3EEFF] hover:text-[#6F59FF]"
          >
            {actionLabel}
            <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>

      <div className="p-6 md:p-8">{children}</div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-[40px] border border-white/80 bg-white/70 shadow-[0_20px_70px_rgba(97,76,197,0.06)] backdrop-blur-2xl"
    >
      <div className="border-b border-gray-100 bg-white/50 px-7 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#F3EEFF] p-3 text-[#6F59FF]">{icon}</div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              {eyebrow}
            </div>
            <div className="mt-0.5 text-[18px] font-black tracking-tight text-[#241F3D]">
              {title}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function EnergyMiniChart({
  points,
  gradientClass,
}: {
  points: Array<{ label: string; value: number }>;
  gradientClass: string;
}) {
  const width = 620;
  const height = 210;
  const paddingX = 18;
  const paddingY = 18;

  const max = Math.max(...points.map((p) => p.value), 100);
  const stepX = (width - paddingX * 2) / (points.length - 1);

  const coordinates = points.map((point, index) => {
    const x = paddingX + index * stepX;
    const y = height - paddingY - (point.value / max) * (height - paddingY * 2);
    return { ...point, x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${height - paddingY} L ${coordinates[0].x} ${height - paddingY} Z`;

  return (
    <div className="rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Mini energy curve
          </div>
          <div className="mt-1 text-[18px] font-[950] tracking-tight text-[#241F3D]">
            Đường nhịp năng lượng dự kiến
          </div>
        </div>
        <div className={`rounded-full bg-gradient-to-r px-3 py-1.5 text-[11px] font-black text-white ${gradientClass}`}>
          chronotype
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FAF8FF_0%,#FFFFFF_100%)] p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
          <defs>
            <linearGradient id="energyLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6F59FF" />
              <stop offset="100%" stopColor="#4DA8FF" />
            </linearGradient>
            <linearGradient id="energyAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(111,89,255,0.25)" />
              <stop offset="100%" stopColor="rgba(77,168,255,0.04)" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={paddingX}
              y1={height - paddingY - ratio * (height - paddingY * 2)}
              x2={width - paddingX}
              y2={height - paddingY - ratio * (height - paddingY * 2)}
              stroke="#E9E5FF"
              strokeDasharray="6 8"
            />
          ))}

          <path d={areaPath} fill="url(#energyAreaGradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="url(#energyLineGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coordinates.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5.5" fill="#6F59FF" />
              <circle cx={point.x} cy={point.y} r="10" fill="rgba(111,89,255,0.12)" />
            </g>
          ))}

          {coordinates.map((point) => (
            <text
              key={`label-${point.label}`}
              x={point.x}
              y={height - 4}
              textAnchor="middle"
              className="fill-[#8A84A3] text-[11px] font-bold"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function FocusWindowPanel({
  icon,
  title,
  tone,
  items,
  emptyText,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "good" | "warn";
  items: Array<{ id: string; name: string; scheduledTime: string; duration: string }>;
  emptyText: string;
}) {
  const toneClasses =
    tone === "good"
      ? "bg-[#F3FFF8] border-[#DDF5E7] text-[#2E7C59]"
      : "bg-[#FFF8F1] border-[#FCE7D3] text-[#B86B00]";

  return (
    <div className="rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-sm">
      <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-black uppercase tracking-[0.14em] ${toneClasses}`}>
        {icon}
        {title}
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#D9CEFF] bg-[#FAF8FF] px-4 py-5 text-[13px] font-medium leading-relaxed text-[#615C7A]">
            {emptyText}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-[#ECE8FF] bg-[#FAF8FF] px-4 py-4"
            >
              <div className="text-[15px] font-[900] tracking-tight text-[#241F3D]">
                {item.name}
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-[#615C7A]">
                {parseTaskTimeLabel(item.scheduledTime)} • {item.duration}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WeeklyHeatmapMini({
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
    <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-sm">
      <div className="mb-4 text-[13px] font-bold text-[#615C7A]">
        Mật độ hoàn thành trong tuần
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

function Chip({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2.5 text-[13px] font-bold text-[#5F5A77] shadow-sm backdrop-blur-md">
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
    <div className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-sm">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1.5 text-[22px] font-[900] tracking-tight text-[#241F3D]">
        {value}
      </div>
      <div className="mt-1 text-[12.5px] font-medium text-[#615C7A]">{hint}</div>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  hint: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group rounded-[36px] border border-white/80 bg-white/70 p-7 shadow-[0_15px_40px_rgba(97,76,197,0.06)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-white p-3 text-[#6F59FF] shadow-sm ring-1 ring-black/5 transition-colors group-hover:bg-[#6F59FF] group-hover:text-white">
          {icon}
        </div>
        <div className="text-[2.5rem] font-[950] tracking-tighter text-[#241F3D]">{value}</div>
      </div>
      <div className="mt-5 text-[17px] font-[900] text-[#1A1528]">{title}</div>
      <div className="mt-1.5 text-[13.5px] font-medium text-[#615C7A]">{hint}</div>
    </motion.div>
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
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-sm">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1.5 text-[26px] font-[950] tracking-tight text-[#241F3D]">{value}</div>
    </motion.div>
  );
}

function RhythmCard({
  title,
  value,
  text,
  accent,
}: {
  title: string;
  value: string;
  text: string;
  accent: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-sm">
      <div className={`inline-flex rounded-full bg-gradient-to-r px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-sm ${accent}`}>
        {title}
      </div>
      <div className="mt-4 text-[20px] font-[950] tracking-tight text-[#241F3D]">{value}</div>
      <div className="mt-1.5 text-[13.5px] font-medium leading-relaxed text-[#615C7A]">{text}</div>
    </motion.div>
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
      className="group block rounded-[28px] border border-white/80 bg-white/80 p-5 transition-all hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(97,76,197,0.1)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[16px] font-[900] tracking-tight text-[#1A1528] transition-colors group-hover:text-[#6F59FF]">
            {title}
          </div>
          <div className="mt-1.5 text-[13px] font-medium leading-relaxed text-[#615C7A]">
            {text}
          </div>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EEFF] text-[#6F59FF] transition-transform group-hover:translate-x-1">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
    </Link>
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
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[14.5px] font-[900] text-[#1A1528]">{label}</div>
        <div className="text-[12.5px] font-bold text-[#6B6287]">{value} điểm</div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#EFEAFD] shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] shadow-sm"
        />
      </div>
    </motion.div>
  );
}

function EmptyState({
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
    <div className="rounded-[32px] border border-dashed border-[#D9CEFF] bg-white/40 p-10 text-center">
      <div className="text-[18px] font-[950] tracking-tight text-[#1A1528]">{title}</div>
      <p className="mx-auto mt-3 max-w-sm text-[14px] font-medium leading-relaxed text-[#615C7A]">
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