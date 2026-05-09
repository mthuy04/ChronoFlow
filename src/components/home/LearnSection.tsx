"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock3,
  FileText,
  FlaskConical,
  Lock,
  MoonStar,
  Play,
  PlayCircle,
  Search,
  Sparkles,
  Newspaper,
  Video,
} from "lucide-react";

const articles = [
  {
    title: "Chronotype là gì?",
    description:
      "Hiểu chronotype, vì sao mỗi người tỉnh táo ở những thời điểm khác nhau và điều đó ảnh hưởng đến cách học/làm việc.",
    icon: <MoonStar className="h-5 w-5 text-[#6F59FF]" />,
    tag: "Bài đọc",
    accent: "from-[#FBF9FF] via-[#F3F0FF] to-[#EDE7FF]",
    borderColor: "border-[#E4DCFF]",
    emoji: "🌤️",
    href: "/learn/chronotype-basics",
    time: "4 phút đọc",
  },
  {
    title: "Vì sao năng lượng lên xuống?",
    description:
      "Tìm hiểu đường năng lượng, nhịp sinh học và lý do hiệu suất không thể giữ nguyên ở mọi khung giờ trong ngày.",
    icon: <Brain className="h-5 w-5 text-[#4DA8FF]" />,
    tag: "Giải thích",
    accent: "from-[#FBFDFF] via-[#EEF6FF] to-[#E2F0FF]",
    borderColor: "border-[#D6EAFF]",
    emoji: "🔋",
    href: "/learn/energy-rhythm",
    time: "5 phút đọc",
  },
  {
    title: "Cách lập kế hoạch theo nhịp",
    description:
      "Hướng dẫn đặt deep work, việc nhẹ, sáng tạo và hồi phục vào đúng thời điểm để lịch thực tế hơn.",
    icon: <Clock3 className="h-5 w-5 text-[#F59E0B]" />,
    tag: "Hướng dẫn",
    accent: "from-[#FFFDF7] via-[#FFF7ED] to-[#FFEED8]",
    borderColor: "border-[#FFE2B8]",
    emoji: "🗓️",
    href: "/learn/rhythm-based-planning",
    time: "6 phút đọc",
  },
];

const knowledgeItems = [
  {
    title: "Bài viết dễ đọc",
    desc: "Đọc nhanh các khái niệm nền tảng về chronotype và năng lượng.",
    icon: Newspaper,
    color: "text-[#6F59FF]",
    bg: "bg-[#F3F0FF]",
  },
  {
    title: "Video giải thích",
    desc: "Xem video ngắn để hiểu cách áp dụng vào lịch học/làm việc.",
    icon: Video,
    color: "text-[#4DA8FF]",
    bg: "bg-[#EEF6FF]",
  },
  {
    title: "Tài liệu tham khảo",
    desc: "Tổng hợp tài liệu và nghiên cứu liên quan đến nhịp sinh học.",
    icon: FileText,
    color: "text-[#10B981]",
    bg: "bg-[#ECFDF5]",
  },
];

const feedItems = [
  {
    type: "Bài viết",
    title: "Chronotype là gì và vì sao bạn nên quan tâm?",
    time: "4 phút đọc",
    icon: Newspaper,
    active: true,
  },
  {
    type: "Video",
    title: "Cách nhận biết khung giờ tập trung tốt nhất",
    time: "3 phút xem",
    icon: PlayCircle,
    active: false,
  },
  {
    type: "Tài liệu",
    title: "Tổng quan về nhịp sinh học và năng lượng trong ngày",
    time: "Nguồn đọc thêm",
    icon: FileText,
    active: false,
  },
];

export default function LearnSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] pb-10 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] border border-white bg-white/75 px-5 py-14 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-20">
          <BackgroundGlow />

          <div className="relative z-10">
            <div className="mb-14 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              <div className="text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Thư viện kiến thức
                </div>

                <h2 className="mb-6 text-[clamp(2.35rem,4.6vw,3.65rem)] font-[900] leading-[1.04] tracking-[-0.04em]">
                  Đọc nhanh, xem ngắn,{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    hiểu đúng nhịp của bạn.
                  </span>
                </h2>

                <p className="mx-auto mb-8 max-w-[620px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px] lg:mx-0">
                  Thư viện kiến thức là nơi tổng hợp bài viết, video ngắn và tài liệu
                  tham khảo giúp người dùng hiểu chronotype, đường năng lượng và cách áp dụng vào
                  lịch trình hằng ngày.
                </p>

                <div className="mb-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Chip
                    icon={<BookOpen className="h-4 w-4 text-[#6F59FF]" />}
                    label="Bài viết dễ đọc"
                  />
                  <Chip
                    icon={<Video className="h-4 w-4 text-[#4DA8FF]" />}
                    label="Video ngắn"
                  />
                  <Chip
                    icon={<FlaskConical className="h-4 w-4 text-[#F59E0B]" />}
                    label="Tài liệu tham khảo"
                  />
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/learn"
                    className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#1A1528] px-7 text-[14px] font-[900] text-white shadow-[0_15px_30px_rgba(26,21,40,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_20px_40px_rgba(111,89,255,0.18)]"
                  >
                    Mở thư viện kiến thức
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/assessment"
                    className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white bg-white/85 px-7 text-[14px] font-[900] text-[#1A1528] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    Làm bài test nhịp độ
                  </Link>
                </div>
              </div>

              <LearningMockup />
            </div>

            <div className="mb-12 grid gap-5 md:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.title} {...article} />
              ))}
            </div>

            <div className="mx-auto max-w-[940px] rounded-[32px] border border-white/80 bg-white/75 p-6 shadow-[0_18px_55px_rgba(26,21,40,0.045)] backdrop-blur-xl md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-[#E9E5FF] bg-[#F3F0FF] text-[24px]">
                  💡
                </div>

                <div className="flex-1">
                  <div className="mb-2 text-[12px] font-[900] uppercase tracking-[0.16em] text-[#6F59FF]">
                    ChronoFlow không phải là gì?
                  </div>

                  <p className="text-[14px] font-semibold leading-relaxed text-[#5B566E] md:text-[14.5px]">
                    Đây không phải là chẩn đoán y khoa và không nhằm dự đoán chính
                    xác mọi ngày của bạn. ChronoFlow là một framework thực tế để
                    nhận ra mô thức tập trung, hồi phục và lên kế hoạch với nhiều tự
                    nhận thức hơn.
                  </p>
                </div>

                <Link
                  href="/learn"
                  className="flex shrink-0 items-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                >
                  <FileText className="h-4 w-4 text-[#4DA8FF]" />
                  Đọc thêm
                </Link>
              </div>
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
      <div className="absolute -left-[5%] -top-[10%] h-[380px] w-[380px] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
      <div className="absolute -right-[5%] top-[30%] h-[380px] w-[380px] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
      <div className="absolute bottom-[-12%] left-[30%] h-[420px] w-[420px] rounded-full bg-purple-100/45 blur-[90px]" />
    </div>
  );
}

function LearningMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#6F59FF]/16 to-[#4DA8FF]/16 blur-[80px]" />

      <div className="relative overflow-hidden rounded-[34px] border border-white bg-white/85 p-3 shadow-[0_28px_80px_rgba(26,21,40,0.09)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[28px] border border-[#E9E5FF] bg-[#F8FAFC]">
          <div className="flex h-11 items-center justify-between border-b border-[#EEF0F6] bg-white/90 px-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>

            <div className="hidden h-6 items-center justify-center rounded-md bg-[#F4F6FB] px-4 text-[9.5px] font-bold text-[#8A91A3] sm:flex">
              <Lock className="mr-1 h-2.5 w-2.5" />
              chronoflow.app/learn
            </div>

            <Search className="h-4 w-4 text-[#A1A7B8]" />
          </div>

          <div className="grid min-h-[390px] grid-cols-1 p-4 sm:grid-cols-[160px_1fr]">
            <aside className="hidden border-r border-[#EEF0F6] pr-4 sm:block">
              <div className="mb-3 text-[10px] font-[900] uppercase tracking-[0.16em] text-[#A1A7B8]">
                Nội dung
              </div>

              <div className="space-y-2.5">
                {feedItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={`rounded-[16px] border px-3 py-3 ${
                        item.active
                          ? "border-[#E9E5FF] bg-[#F3F0FF]"
                          : "border-[#EEF0F6] bg-white"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Icon
                          className={`h-3.5 w-3.5 ${
                            item.active ? "text-[#6F59FF]" : "text-[#8A91A3]"
                          }`}
                        />
                        <span
                          className={`text-[9.5px] font-black uppercase tracking-[0.12em] ${
                            item.active ? "text-[#6F59FF]" : "text-[#8A91A3]"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <div className="line-clamp-2 text-[11.5px] font-[900] leading-snug text-[#1A1528]">
                        {item.title}
                      </div>

                      <div className="mt-1 text-[9.5px] font-bold text-[#A1A7B8]">
                        {item.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            <main className="min-w-0 sm:pl-4">
              <div className="overflow-hidden rounded-[24px] border border-[#EEF0F6] bg-white shadow-sm">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[#1A1528]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6F59FF66_0%,transparent_38%),radial-gradient(circle_at_bottom_right,#4DA8FF55_0%,transparent_42%)]" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-lg backdrop-blur-md transition hover:scale-105">
                    <Play className="ml-1 h-6 w-6 fill-white text-white" />
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                    <div className="h-full w-[45%] bg-[#4DA8FF]" />
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[9.5px] font-[900] uppercase tracking-[0.12em] text-[#6F59FF]">
                    <PlayCircle className="h-3 w-3" />
                    Video ngắn
                  </div>

                  <h3 className="mb-2 text-[17px] font-[900] leading-tight text-[#1A1528]">
                    Cách nhận biết khung giờ tập trung tốt nhất
                  </h3>

                  <p className="text-[12.5px] font-semibold leading-relaxed text-[#6B647C]">
                    Xem nhanh cách chronotype và đường năng lượng ảnh hưởng đến lịch học,
                    lịch làm và thời điểm nên nghỉ.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {knowledgeItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[18px] border border-[#EEF0F6] bg-white p-3 shadow-sm"
                    >
                      <div
                        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="text-[12px] font-[900] text-[#1A1528]">
                        {item.title}
                      </div>

                      <div className="mt-1 line-clamp-2 text-[10.5px] font-semibold leading-relaxed text-[#8A84A3]">
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex cursor-default items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2.5 text-[13px] font-[800] text-[#4F4A68] shadow-sm backdrop-blur-md transition-colors hover:bg-white">
      {icon}
      {label}
    </div>
  );
}

function ArticleCard({
  title,
  description,
  icon,
  tag,
  accent,
  borderColor,
  emoji,
  href,
  time,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  tag: string;
  accent: string;
  borderColor: string;
  emoji: string;
  href: string;
  time: string;
}) {
  return (
    <Link
      href={href}
      className="group block h-full rounded-[34px] border border-white/80 bg-white/70 p-2.5 shadow-[0_18px_48px_rgba(26,21,40,0.045)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(111,89,255,0.11)]"
    >
      <div
        className={`relative flex h-full min-h-[315px] flex-col justify-between overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 ${accent} ${borderColor}`}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/60 blur-3xl transition-transform duration-500 group-hover:scale-125" />

        <div className="absolute right-5 top-6 text-[48px] opacity-80 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {emoji}
        </div>

        <div className="relative z-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-[0_10px_20px_rgba(0,0,0,0.05)] backdrop-blur-md transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            {icon}
          </div>

          <div className="mb-3 inline-flex rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#1A1528] opacity-70 shadow-sm backdrop-blur-sm">
            {tag}
          </div>

          <h3 className="mb-3 max-w-[230px] text-[22px] font-[900] leading-tight text-[#1A1528]">
            {title}
          </h3>

          <p className="text-[14px] font-medium leading-relaxed text-[#5B566E]">
            {description}
          </p>
        </div>

        <div className="relative z-10 mt-7 flex items-center justify-between border-t border-[#1A1528]/10 pt-4">
          <div className="flex items-center gap-2 text-[13px] font-[900] text-[#1A1528] transition-all duration-300 group-hover:gap-3">
            Đọc thêm
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="rounded-full border border-white/60 bg-white/55 px-3 py-1 text-[11px] font-bold text-[#5B566E] shadow-sm backdrop-blur-sm">
            {time}
          </div>
        </div>
      </div>
    </Link>
  );
}
