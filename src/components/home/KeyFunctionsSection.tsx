"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarClock,
  Gift,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  label: string;
  desc: string;
  bullets: string[];
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  gradient: string;
  bg: string;
  accentText: string;
  border: string;
};

const features: Feature[] = [
  {
    title: "Chronotype Test",
    label: "Hiểu điểm bắt đầu",
    desc: "Xác định nhóm nhịp năng lượng của bạn qua bài đánh giá ngắn để bắt đầu lập lịch phù hợp hơn.",
    bullets: ["Bài test ngắn", "Gợi ý chronotype", "Cơ sở để cá nhân hóa"],
    metric: "3 phút",
    metricLabel: "bài test",
    icon: Brain,
    gradient: "from-[#6F59FF] to-[#8B5CF6]",
    bg: "from-[#FBF9FF] via-[#F7F4FF] to-[#F3EEFF]",
    accentText: "text-[#6F59FF]",
    border: "border-[#E9E5FF]",
  },
  {
    title: "Energy Dashboard",
    label: "Nhìn rõ nhịp ngày",
    desc: "Hiển thị khung tập trung, việc nhẹ và thời điểm nên hồi phục để bạn nhìn rõ trạng thái năng lượng của mình.",
    bullets: ["Đường năng lượng", "Khung tập trung", "Insight theo ngày"],
    metric: "1 nơi",
    metricLabel: "dashboard",
    icon: Activity,
    gradient: "from-[#4DA8FF] to-[#38BDF8]",
    bg: "from-[#F8FCFF] via-[#F4F9FF] to-[#EEF6FF]",
    accentText: "text-[#4DA8FF]",
    border: "border-[#DDEEFF]",
  },
  {
    title: "Smart Scheduling",
    label: "Đặt đúng việc",
    desc: "Gợi ý đặt deep work, admin work và recovery đúng lúc thay vì nhồi task vào lịch một cách ngẫu nhiên.",
    bullets: ["Deep work", "Admin / Review", "Recovery"],
    metric: "4 loại",
    metricLabel: "task chính",
    icon: CalendarClock,
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    bg: "from-[#FFFDF7] via-[#FFF8ED] to-[#FFF4E5]",
    accentText: "text-[#F59E0B]",
    border: "border-[#FFE6C7]",
  },
  {
    title: "Focus Points",
    label: "Duy trì động lực",
    desc: "Hoàn thành focus session thật để tích điểm, giữ streak và mở khóa ưu đãi từ Chrono Planner Kit.",
    bullets: ["Focus session", "Streak & badge", "Reward / Kit"],
    metric: "+XP",
    metricLabel: "focus points",
    icon: Gift,
    gradient: "from-[#10B981] to-[#34D399]",
    bg: "from-[#F8FFFC] via-[#F4FFFB] to-[#ECFDF5]",
    accentText: "text-[#10B981]",
    border: "border-[#D1FAE5]",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: "easeOut" },
  },
};

export default function KeyFunctionsSection() {
  return (
    <section
      id="key-functions"
      className="relative overflow-hidden bg-[#F4F2FA] py-10 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[38px] border border-white bg-white/75 px-5 py-14 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-20 lg:px-12">
          <BackgroundGlow />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto mb-12 max-w-4xl text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Tính năng cốt lõi
              </div>

              <h2 className="mb-5 text-[clamp(2.25rem,4.6vw,3.65rem)] font-[900] leading-[1.04] tracking-[-0.04em] text-[#1A1528]">
                4 tính năng cốt lõi của {" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  ChronoFlow
                </span>
              </h2>

              <p className="mx-auto max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                ChronoFlow tập trung vào bốn năng lực chính: hiểu chronotype, nhìn
                rõ đường năng lượng, sắp lịch theo trạng thái thật và duy trì bằng
                focus points.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
            >
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    className={`group relative min-h-[360px] overflow-hidden rounded-[30px] border ${item.border} bg-gradient-to-br ${item.bg} p-5 shadow-[0_18px_48px_rgba(26,21,40,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(26,21,40,0.1)]`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute right-[-70px] top-[-70px] h-[200px] w-[200px] rounded-full bg-white/80 blur-[60px]" />
                      <div className="absolute bottom-[-80px] left-[-80px] h-[220px] w-[220px] rounded-full bg-white/70 blur-[70px]" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                      <div>
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div className="flex h-15 w-15 items-center justify-center rounded-[22px] border border-white bg-white shadow-[0_14px_35px_rgba(26,21,40,0.07)]">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-[18px] bg-gradient-to-br ${item.gradient} text-white shadow-md`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                          </div>

                          <div
                            className={`rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-[900] uppercase tracking-[0.13em] ${item.accentText}`}
                          >
                            {item.label}
                          </div>
                        </div>

                        <h3 className="mb-3 text-[21px] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                          {item.title}
                        </h3>

                        <p className="text-[13.5px] font-semibold leading-relaxed text-[#5B566E]">
                          {item.desc}
                        </p>

                        <div className="mt-5 space-y-2.5">
                          {item.bullets.map((bullet) => (
                            <div
                              key={bullet}
                              className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/65 px-3.5 py-2.5"
                            >
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-r ${item.gradient}`}
                              />
                              <span className="text-[12.5px] font-bold text-[#5B566E]">
                                {bullet}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-[22px] border border-white/80 bg-white/75 px-4 py-4 shadow-sm">
                        <div>
                          <div
                            className={`text-[25px] font-[900] leading-none ${item.accentText}`}
                          >
                            {item.metric}
                          </div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A84A3]">
                            {item.metricLabel}
                          </div>
                        </div>

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md transition duration-300 group-hover:translate-x-1`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-[32px] border border-[#E9E5FF] bg-white px-6 py-5 shadow-[0_18px_55px_rgba(26,21,40,0.05)] md:px-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-1 text-[12px] font-[900] uppercase tracking-[0.16em] text-[#6F59FF]">
                    Gọn nhưng đủ lõi sản phẩm
                  </div>
                  <p className="max-w-[720px] text-[15px] font-semibold leading-relaxed text-[#5B566E]">
                    Chi tiết từng tính năng có thể nằm ở trang Feature riêng. Trên
                    homepage, section này chỉ cần giúp người xem hiểu nhanh
                    ChronoFlow hoạt động theo flow: test → dashboard → schedule →
                    focus points.
                  </p>
                </div>

                <button className="group flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(26,21,40,0.22)]">
                  Xem trang tính năng
                  <ArrowRight className="h-4 w-4 text-[#4DA8FF] transition group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -left-[8%] top-[5%] h-[420px] w-[420px] animate-[pulse_6s_infinite] rounded-full bg-[#DCCEFF]/70 blur-[110px]" />
      <div className="absolute right-[-10%] top-[18%] h-[420px] w-[420px] animate-[pulse_8s_infinite] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-white/70 blur-[100px]" />
    </div>
  );
}