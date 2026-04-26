"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock3,
  MoonStar,
  Activity,
  Brain,
  Mail,
  Coffee,
  Palette,
  MoreHorizontal,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UseCaseKey = "deep" | "admin" | "recovery" | "creative";

type TimelineItem = {
  time: string;
  label: string;
  width: string;
  gradient: string;
  emphasized?: boolean;
};

type UseCaseView = {
  key: UseCaseKey;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  accentText: string;
  accentBg: string;
  cardBg: string;
  borderColor: string;
  sourceLabel: string;
  timeWindow: string;
  points: string[];
  hint: string;
  timeline: TimelineItem[];
};

const mockUseCases: UseCaseView[] = [
  {
    key: "deep",
    title: "Deep work",
    shortTitle: "Tập trung sâu",
    subtitle: "Đặt việc khó vào lúc tỉnh táo nhất",
    description:
      "Các việc như viết báo cáo, phân tích hoặc lập trình nên được đặt vào lúc năng lượng nhận thức đạt đỉnh trong ngày.",
    icon: <Brain className="h-4 w-4" />,
    accentText: "text-[#6F59FF]",
    accentBg: "bg-[#F3F0FF]",
    cardBg: "from-[#FBF9FF] via-[#F7F4FF] to-[#F3EEFF]",
    borderColor: "border-[#EEE6FF]",
    sourceLabel: "Ví dụ minh hoạ",
    timeWindow: "09:00 – 11:30",
    points: [
      "Viết báo cáo, nghiên cứu, lập trình",
      "Giảm chuyển đổi ngữ cảnh",
      "Ưu tiên chất lượng tư duy",
    ],
    hint: "Không phải làm nhiều hơn. Là làm việc khó vào đúng lúc hơn.",
    timeline: [
      {
        time: "08:00",
        label: "Khởi động",
        width: "35%",
        gradient: "linear-gradient(90deg,#CBD5E1,#E2E8F0)",
      },
      {
        time: "09:00",
        label: "Deep work",
        width: "65%",
        gradient: "linear-gradient(90deg,#6F59FF,#4DA8FF)",
        emphasized: true,
      },
      {
        time: "13:30",
        label: "Email",
        width: "40%",
        gradient: "linear-gradient(90deg,#A78BFA,#C4B5FD)",
      },
      {
        time: "15:00",
        label: "Nghỉ",
        width: "30%",
        gradient: "linear-gradient(90deg,#2DD4BF,#5EEAD4)",
      },
    ],
  },
  {
    key: "admin",
    title: "Admin tasks",
    shortTitle: "Việc hành chính",
    subtitle: "Dồn việc lặp lại vào khung năng lượng vừa",
    description:
      "Email, tin nhắn, cập nhật tài liệu hoặc các việc xử lý nhanh phù hợp hơn ở thời điểm không cần tập trung sâu.",
    icon: <Mail className="h-4 w-4" />,
    accentText: "text-[#4DA8FF]",
    accentBg: "bg-[#EEF6FF]",
    cardBg: "from-[#FBFDFF] via-[#F4F9FF] to-[#EEF6FF]",
    borderColor: "border-[#E6F1FF]",
    sourceLabel: "Ví dụ minh hoạ",
    timeWindow: "13:00 – 14:30",
    points: [
      "Email, tin nhắn, checklist",
      "Việc nhanh, ít tiêu hao",
      "Bảo toàn khung giờ vàng",
    ],
    hint: "Việc nhẹ cũng cần đúng chỗ để không lấn sang thời gian tập trung sâu.",
    timeline: [
      {
        time: "08:30",
        label: "Học sâu",
        width: "50%",
        gradient: "linear-gradient(90deg,#6F59FF,#8B5CF6)",
      },
      {
        time: "13:00",
        label: "Admin",
        width: "60%",
        gradient: "linear-gradient(90deg,#4DA8FF,#60A5FA)",
        emphasized: true,
      },
      {
        time: "15:00",
        label: "Follow-up",
        width: "35%",
        gradient: "linear-gradient(90deg,#93C5FD,#BFDBFE)",
      },
    ],
  },
  {
    key: "recovery",
    title: "Recovery",
    shortTitle: "Hồi phục",
    subtitle: "Nghỉ đúng lúc để giữ hiệu suất",
    description:
      "Nghỉ ngắn, đi bộ, giãn cơ không phải phần thừa. Đó là cách sạc lại pin để quay lại khung làm việc tiếp theo tốt hơn.",
    icon: <Coffee className="h-4 w-4" />,
    accentText: "text-[#10B981]",
    accentBg: "bg-[#ECFDF5]",
    cardBg: "from-[#FBFFFE] via-[#F3FFFB] to-[#ECFDF5]",
    borderColor: "border-[#D1FAE5]",
    sourceLabel: "Ví dụ minh hoạ",
    timeWindow: "15:00 – 15:30",
    points: [
      "Nghỉ ngắn giữa hai khối tập trung",
      "Giảm cảm giác cạn năng lượng",
      "Tách khỏi màn hình",
    ],
    hint: "Hồi phục không làm gián đoạn hiệu suất. Nó duy trì hiệu suất.",
    timeline: [
      {
        time: "10:30",
        label: "Deep work",
        width: "55%",
        gradient: "linear-gradient(90deg,#6F59FF,#8B5CF6)",
      },
      {
        time: "15:00",
        label: "Nghỉ reset",
        width: "40%",
        gradient: "linear-gradient(90deg,#10B981,#34D399)",
        emphasized: true,
      },
      {
        time: "16:00",
        label: "Việc nền",
        width: "45%",
        gradient: "linear-gradient(90deg,#4DA8FF,#93C5FD)",
      },
    ],
  },
  {
    key: "creative",
    title: "Creative work",
    shortTitle: "Sáng tạo",
    subtitle: "Đặt brainstorming vào đúng cửa sổ",
    description:
      "Những việc cần liên tưởng, thiết kế hoặc nghĩ ý tưởng sẽ hiệu quả hơn khi đặt vào khung sáng tạo riêng.",
    icon: <Palette className="h-4 w-4" />,
    accentText: "text-[#F59E0B]",
    accentBg: "bg-[#FFFBEB]",
    cardBg: "from-[#FFFDF9] via-[#FFFBEB] to-[#FEF3C7]",
    borderColor: "border-[#FDE68A]",
    sourceLabel: "Ví dụ minh hoạ",
    timeWindow: "16:00 – 18:00",
    points: [
      "Brainstorm, thiết kế, lên ý tưởng",
      "Tách khỏi task vụn vặt",
      "Mỗi người có thời điểm vàng khác nhau",
    ],
    hint: "Ý tưởng tốt đến từ cảm hứng và cả đúng thời điểm.",
    timeline: [
      {
        time: "13:30",
        label: "Việc nền",
        width: "40%",
        gradient: "linear-gradient(90deg,#CBD5E1,#E2E8F0)",
      },
      {
        time: "16:00",
        label: "Sáng tạo",
        width: "65%",
        gradient: "linear-gradient(90deg,#F59E0B,#FBBF24)",
        emphasized: true,
      },
      {
        time: "18:00",
        label: "Phác thảo",
        width: "35%",
        gradient: "linear-gradient(90deg,#FCD34D,#FDE68A)",
      },
    ],
  },
];

const valueCards = [
  {
    icon: <Brain className="h-6 w-6 text-[#6F59FF]" />,
    title: "Phân loại việc khó",
    description:
      "Task tiêu tốn nhiều tư duy nên được đặt vào lúc nhận thức mạnh nhất.",
    accentBg: "bg-[#F3F0FF] border-[#E9E5FF]",
  },
  {
    icon: <Clock3 className="h-6 w-6 text-[#4DA8FF]" />,
    title: "Đồng bộ năng lượng",
    description:
      "Việc sâu, việc nhẹ, sáng tạo và hồi phục đều có thời điểm phù hợp.",
    accentBg: "bg-[#EEF6FF] border-[#E6F1FF]",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6 text-[#10B981]" />,
    title: "Lịch thực tế",
    description:
      "Mục tiêu là làm đúng việc vào đúng nhịp để không bị kiệt sức.",
    accentBg: "bg-[#ECFDF5] border-[#D1FAE5]",
  },
];

export default function UseCasesMacbookSection() {
  const [activeKey, setActiveKey] = useState<UseCaseKey>("deep");

  const active = useMemo(
    () => mockUseCases.find((item) => item.key === activeKey) ?? mockUseCases[0],
    [activeKey]
  );

  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] pb-10 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] border border-white bg-white/70 px-5 py-14 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-20">
          <BackgroundGlow />

          <div className="relative z-10">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Tối ưu hóa theo chronotype
              </div>

              <h2 className="mb-5 text-[clamp(2.35rem,4.5vw,3.45rem)] font-[900] leading-[1.05] tracking-tight">
                Đặt đúng việc vào{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  đúng lúc.
                </span>
              </h2>

              <p className="mx-auto max-w-[660px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                ChronoFlow biến nhịp năng lượng thành quyết định thực tế: lúc nào
                nên học sâu, xử lý việc nhẹ, nghỉ hồi phục hoặc làm việc sáng tạo.
              </p>
            </div>

            <div className="mb-14 grid gap-5 md:grid-cols-3">
              {valueCards.map((item) => (
                <MiniValueCard key={item.title} {...item} />
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-[940px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[360px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#6F59FF]/16 via-[#4DA8FF]/12 to-[#10B981]/10 blur-[95px]" />

              <div className="relative z-20 rounded-[34px] border border-white/70 bg-gradient-to-br from-white via-[#F7F9FF] to-[#EEF3FF] p-3 shadow-[0_36px_90px_rgba(26,21,40,0.14)]">
                <div className="relative overflow-hidden rounded-[28px] border border-[#272238]/90 bg-[#181524] p-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  {/* Top browser bar */}
                  <div className="mb-2.5 flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
                    </div>

                    <div className="hidden rounded-full border border-white/10 bg-black/20 px-5 py-1.5 text-[11px] font-bold text-white/60 md:block">
                      app.chronoflow.vn / energy-schedule
                    </div>

                    <div className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                    <Image
  src="/logo-light.png"
  alt="ChronoFlow"
  width={150}
  height={44}
  className="h-5 w-auto object-contain"
  priority
/>
                    </div>
                  </div>

                  {/* Main app */}
                  <div className="relative flex h-[492px] overflow-hidden rounded-[22px] border border-white/70 bg-white md:h-[510px]">
                    {/* Sidebar */}
                    <aside className="hidden w-[220px] shrink-0 border-r border-[#EEF0F6] bg-[#F8FAFF] p-4 md:block">
                      <div className="mb-5 rounded-[20px] border border-[#EEF0F6] bg-white p-3.5 shadow-sm">
                        <Image
                     
                          src="/logo-light.png"
                          alt="ChronoFlow official logo"
                          width={220}
                          height={70}
                          className="h-10 w-auto object-contain"
                          priority
        
                        />
                      </div>

                      <div className="mb-3 flex items-center gap-2 text-[9.5px] font-black uppercase tracking-[0.18em] text-[#A1A7B8]">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Use case
                      </div>

                      <div className="space-y-2.5">
                        {mockUseCases.map((item) => {
                          const isActive = item.key === activeKey;

                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => setActiveKey(item.key)}
                              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-[18px] p-2.5 text-left transition-all duration-300 ${
                                isActive
                                  ? "bg-white shadow-[0_12px_30px_rgba(26,21,40,0.07)] ring-1 ring-[#EEF0F6]"
                                  : "hover:bg-white/70"
                              }`}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeUsecaseCard"
                                  className={`absolute inset-0 rounded-[18px] bg-gradient-to-br ${item.cardBg}`}
                                  transition={{
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 32,
                                  }}
                                />
                              )}

                              <div
                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] border ${
                                  isActive
                                    ? `${item.accentBg} ${item.borderColor}`
                                    : "border-white bg-[#EEF2F8]"
                                }`}
                              >
                                <span
                                  className={
                                    isActive
                                      ? item.accentText
                                      : "text-[#8A91A3]"
                                  }
                                >
                                  {item.icon}
                                </span>
                              </div>

                              <div className="relative z-10 min-w-0">
                                <div
                                  className={`truncate text-[12.5px] font-black ${
                                    isActive
                                      ? "text-[#1A1528]"
                                      : "text-[#7A8194]"
                                  }`}
                                >
                                  {item.shortTitle}
                                </div>
                                <div className="mt-0.5 text-[10.5px] font-semibold text-[#A1A7B8]">
                                  {item.timeWindow}
                                </div>
                              </div>

                              {isActive && (
                                <ArrowRight
                                  className={`relative z-10 ml-auto h-3.5 w-3.5 ${item.accentText}`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-5 rounded-[20px] border border-[#E9E5FF] bg-white p-3.5">
                        <div className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                          <Sparkles className="h-3.5 w-3.5" />
                          Gợi ý
                        </div>
                        <p className="text-[12px] font-semibold leading-relaxed text-[#6B647C]">
                          Ưu tiên deep work trước khi xử lý email.
                        </p>
                      </div>
                    </aside>

                    {/* Mobile tabs */}
                    <div className="absolute left-0 right-0 top-0 z-30 flex gap-2 overflow-x-auto border-b border-[#EEF0F6] bg-[#F8FAFF]/95 p-3 md:hidden">
                      {mockUseCases.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setActiveKey(item.key)}
                          className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black ${
                            item.key === activeKey
                              ? "bg-[#6F59FF] text-white"
                              : "bg-white text-[#64748B]"
                          }`}
                        >
                          {item.shortTitle}
                        </button>
                      ))}
                    </div>

                    {/* Main content */}
                    <main className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_right,#EEF6FF_0%,transparent_34%),radial-gradient(circle_at_bottom_left,#F3F0FF_0%,transparent_36%),#FBFCFF] pt-[58px] md:pt-0">
                      <div className="relative h-full overflow-y-auto p-4 md:p-5">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={active.key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="flex min-h-full flex-col"
                          >
                            <div className="mb-4 flex flex-col gap-3 rounded-[24px] border border-white bg-white/80 p-3.5 shadow-[0_14px_34px_rgba(26,21,40,0.045)] lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border ${active.accentBg} ${active.borderColor}`}
                                >
                                  <span className={active.accentText}>
                                    {active.icon}
                                  </span>
                                </div>

                                <div>
                                  <div
                                    className={`mb-1 inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-[9.5px] font-black uppercase tracking-[0.15em] shadow-sm ${active.accentText} ${active.borderColor}`}
                                  >
                                    <Sparkles className="h-3 w-3" />
                                    {active.sourceLabel}
                                  </div>

                                  <h3 className="text-[22px] font-black leading-tight tracking-tight text-[#1A1528] md:text-[26px]">
                                    {active.title}
                                  </h3>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 sm:flex">
                                <MetricPill
                                  label="Ưu tiên"
                                  value={active.timeWindow}
                                  className={active.accentText}
                                />
                                <MetricPill
                                  label="Fit"
                                  value="High"
                                  className="text-[#10B981]"
                                />
                              </div>
                            </div>

                            <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_230px]">
                              <div className="rounded-[24px] border border-white bg-white/80 p-4 shadow-[0_16px_42px_rgba(26,21,40,0.05)]">
                                <div className="mb-3 border-b border-[#EEF0F6] pb-3">
                                  <div className="mb-1 text-[9.5px] font-black uppercase tracking-[0.18em] text-[#A1A7B8]">
                                    Recommendation
                                  </div>
                                  <h4 className="text-[17px] font-black text-[#1A1528]">
                                    {active.subtitle}
                                  </h4>
                                </div>

                                <p className="text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
                                  {active.description}
                                </p>

                                <div className="mt-4 grid gap-2 md:grid-cols-3">
                                  {active.points.map((point) => (
                                    <div
                                      key={point}
                                      className="rounded-[18px] border border-[#EEF0F6] bg-[#F8FAFF] p-3"
                                    >
                                      <CheckCircle2
                                        className={`mb-2 h-4 w-4 ${active.accentText}`}
                                      />
                                      <p className="text-[11.5px] font-bold leading-relaxed text-[#5B566E]">
                                        {point}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div
                                className={`relative overflow-hidden rounded-[24px] border p-4 shadow-[0_16px_42px_rgba(26,21,40,0.045)] ${active.accentBg} ${active.borderColor}`}
                              >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[16px] bg-white shadow-sm">
                                  <Zap className={`h-5 w-5 ${active.accentText}`} />
                                </div>

                                <div
                                  className={`mb-2 text-[14px] font-black ${active.accentText}`}
                                >
                                  Smart hint
                                </div>

                                <p className="text-[13px] font-semibold leading-relaxed text-[#5B566E]">
                                  {active.hint}
                                </p>
                              </div>
                            </div>

                            <div className="grid flex-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                              <div className="rounded-[24px] border border-white bg-white/80 p-4 shadow-[0_16px_42px_rgba(26,21,40,0.05)]">
                                <div className="mb-4 flex items-center justify-between border-b border-[#EEF0F6] pb-3">
                                  <div>
                                    <div className="text-[9.5px] font-black uppercase tracking-[0.18em] text-[#A1A7B8]">
                                      Time-blocking
                                    </div>
                                    <div className="mt-0.5 text-[15px] font-black text-[#1A1528]">
                                      Bản đồ thời gian
                                    </div>
                                  </div>

                                  <MoreHorizontal className="h-5 w-5 text-[#B8BECC]" />
                                </div>

                                <div className="space-y-3">
                                  {active.timeline.map((item, idx) => (
                                    <TimelineRow
                                      key={idx}
                                      {...item}
                                      delay={idx * 0.04}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-[24px] border border-white bg-[#161322] p-4 text-white shadow-[0_20px_55px_rgba(26,21,40,0.16)]">
                                <div className="mb-4 flex items-center justify-between">
                                  <div>
                                    <div className="text-[9.5px] font-black uppercase tracking-[0.18em] text-white/40">
                                      Energy curve
                                    </div>
                                    <div className="mt-1 text-[16px] font-black">
                                      Chronotype view
                                    </div>
                                  </div>

                                  <MoonStar className="h-5 w-5 text-[#FBBF24]" />
                                </div>

                                <div className="flex h-[135px] items-end gap-2 rounded-[22px] border border-white/10 bg-white/[0.06] p-3.5">
                                  {[38, 56, 78, 94, 72, 48, 40].map(
                                    (height, index) => (
                                      <div
                                        key={index}
                                        className="flex h-full flex-1 items-end rounded-full bg-white/10"
                                      >
                                        <motion.div
                                          initial={{ height: 0 }}
                                          animate={{ height: `${height}%` }}
                                          transition={{
                                            duration: 0.5,
                                            delay: index * 0.03,
                                            ease: "easeOut",
                                          }}
                                          className={`w-full rounded-full bg-gradient-to-t ${
                                            index === 3
                                              ? "from-[#6F59FF] to-[#4DA8FF]"
                                              : "from-white/30 to-white/70"
                                          }`}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  <DarkMiniStat label="Peak" value="09:00" />
                                  <DarkMiniStat
                                    label="Mode"
                                    value={active.shortTitle}
                                  />
                                  <DarkMiniStat label="Fit" value="92%" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </main>
                  </div>
                </div>
              </div>
              {/* Không còn đế frame ở đây */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -top-[10%] left-[10%] h-[360px] w-[360px] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
      <div className="absolute right-[-5%] top-[20%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
      <div className="absolute bottom-[0%] left-[30%] h-[420px] w-[420px] rounded-full bg-white/60 blur-[80px]" />
    </div>
  );
}

function MiniValueCard({
  icon,
  title,
  description,
  accentBg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentBg: string;
}) {
  return (
    <div className="cursor-pointer rounded-[28px] border border-white bg-white/80 p-5 shadow-[0_12px_32px_rgba(26,21,40,0.035)] ring-1 ring-gray-100/50 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(111,89,255,0.08)]">
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] border shadow-sm ${accentBg}`}
      >
        {icon}
      </div>
      <h4 className="mb-2 text-[18px] font-[900] leading-tight text-[#1A1528]">
        {title}
      </h4>
      <p className="text-[14px] font-medium leading-relaxed text-[#64748B]">
        {description}
      </p>
    </div>
  );
}

function TimelineRow({
  time,
  label,
  width,
  gradient,
  emphasized = false,
  delay = 0,
}: TimelineItem & { delay?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[42px] shrink-0 text-right text-[12px] font-[900] text-gray-400">
        {time}
      </div>

      <div className="h-[36px] flex-1 overflow-hidden rounded-full bg-gray-100/80 p-1 shadow-inner">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width, opacity: 1 }}
          transition={{ duration: 0.55, delay, ease: "easeOut" }}
          className={`relative flex h-full min-w-[92px] items-center overflow-hidden rounded-full px-3 text-[11.5px] font-[900] text-white shadow-sm ${
            emphasized ? "ring-2 ring-white drop-shadow-md" : ""
          }`}
          style={{ backgroundImage: gradient }}
        >
          <span className="relative z-10 truncate drop-shadow-sm">{label}</span>
        </motion.div>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#EEF0F6] bg-[#F8FAFF] px-3.5 py-2.5 shadow-sm">
      <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#A1A7B8]">
        {label}
      </div>
      <div className={`mt-1 text-[14px] font-black ${className ?? "text-[#1A1528]"}`}>
        {value}
      </div>
    </div>
  );
}

function DarkMiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5">
      <div className="text-[8.5px] font-black uppercase tracking-[0.14em] text-white/35">
        {label}
      </div>
      <div className="mt-1 truncate text-[12px] font-black text-white">
        {value}
      </div>
    </div>
  );
}