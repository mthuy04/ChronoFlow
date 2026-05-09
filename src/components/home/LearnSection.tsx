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
  MoonStar,
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
        <div className="relative overflow-hidden rounded-[40px] border border-white bg-white/75 px-5 py-12 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-16">
          <BackgroundGlow />

          <div className="relative z-10">
            <div className="mx-auto mb-10 max-w-[860px] text-center">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Thư viện kiến thức
              </div>

              <h2 className="mx-auto mb-5 max-w-[820px] text-[clamp(2.05rem,4vw,4rem)] font-[900] leading-[1.08] tracking-tight">
                Nền tảng khoa học của {" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  ChronoFlow
                </span>
              </h2>

              <p className="mx-auto max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                Thư viện kiến thức tổng hợp bài viết, video ngắn và tài liệu tham
                khảo giúp bạn hiểu chronotype, đường năng lượng và cách áp dụng vào
                lịch trình hằng ngày.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/learn"
                  className="group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#1A1528] px-7 text-[14px] font-[900] text-white shadow-[0_15px_30px_rgba(26,21,40,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_20px_40px_rgba(111,89,255,0.18)]"
                >
                  Mở thư viện kiến thức
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/assessment"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white bg-white/85 px-7 text-[14px] font-[900] text-[#1A1528] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Làm bài đánh giá
                </Link>
              </div>
            </div>

            <div className="mb-9 grid gap-5 md:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.title} {...article} />
              ))}
            </div>

            <div className="mx-auto max-w-[940px] rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_18px_55px_rgba(26,21,40,0.045)] backdrop-blur-xl md:p-7">
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
                    nhận ra mô thức tập trung, hồi phục và lên kế hoạch với nhiều
                    tự nhận thức hơn.
                  </p>
                </div>

                <Link
                  href="/learn"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5"
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
        className={`relative flex h-full min-h-[285px] flex-col justify-between overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 ${accent} ${borderColor}`}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/60 blur-3xl transition-transform duration-500 group-hover:scale-125" />

        <div className="absolute right-5 top-6 text-[44px] opacity-80 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {emoji}
        </div>

        <div className="relative z-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-[0_10px_20px_rgba(0,0,0,0.05)] backdrop-blur-md transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            {icon}
          </div>

          <div className="mb-3 inline-flex rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#1A1528] opacity-70 shadow-sm backdrop-blur-sm">
            {tag}
          </div>

          <h3 className="mb-3 max-w-[230px] text-[20px] font-[900] leading-tight text-[#1A1528]">
            {title}
          </h3>

          <p className="text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
            {description}
          </p>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[#1A1528]/10 pt-4">
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