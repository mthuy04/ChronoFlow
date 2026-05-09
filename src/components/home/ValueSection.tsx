"use client";

import React from "react";
import {
  CalendarDays,
  CheckSquare2,
  Repeat2,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

type ComparisonCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  softBg: string;
  border: string;
  featured?: boolean;
};

const comparisonCards: ComparisonCard[] = [
  {
    title: "To-do app",
    description: "Cho bạn biết hôm nay cần làm gì.",
    icon: CheckSquare2,
    accent: "text-[#6F59FF]",
    softBg: "from-[#FBF9FF] via-[#F7F4FF] to-[#F3F0FF]",
    border: "border-[#E9E5FF]",
  },
  {
    title: "Calendar",
    description: "Cho bạn biết việc đó nằm lúc mấy giờ.",
    icon: CalendarDays,
    accent: "text-[#4DA8FF]",
    softBg: "from-[#FBFDFF] via-[#F4F9FF] to-[#EEF6FF]",
    border: "border-[#DDEEFF]",
  },
  {
    title: "Habit tracker",
    description: "Nhắc bạn duy trì thói quen.",
    icon: Repeat2,
    accent: "text-[#10B981]",
    softBg: "from-[#FBFFFE] via-[#F4FFFB] to-[#ECFDF5]",
    border: "border-[#D1FAE5]",
  },
  {
    title: "ChronoFlow",
    description:
      "Gợi ý khi nào năng lượng của bạn phù hợp nhất để học sâu, làm việc nhẹ hoặc nghỉ hồi phục.",
    icon: Zap,
    accent: "text-white",
    softBg: "from-[#6F59FF] to-[#4DA8FF]",
    border: "border-white",
    featured: true,
  },
];

export default function ValueSection() {
  return (
    <section
      id="value"
      className="relative overflow-hidden bg-[#F4F2FA] pb-10 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20"
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-white bg-white/75 px-5 py-14 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-20 lg:px-12">
          <BackgroundGlow />

          <div className="relative z-10">
            <div className="mx-auto mb-11 max-w-4xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Điểm khác biệt
              </div>

              <h2 className="mx-auto max-w-[820px] text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-[1.08] tracking-tight text-[#1A1528]">
                ChronoFlow khác gì so với{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  lịch và to-do app?
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[740px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                Hầu hết công cụ năng suất bắt đầu từ task và deadline. ChronoFlow
                bắt đầu từ nhịp năng lượng của bạn, rồi mới gợi ý cách sắp việc.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {comparisonCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`group relative min-h-[220px] overflow-hidden rounded-[32px] border p-5 shadow-[0_18px_48px_rgba(26,21,40,0.055)] transition duration-500 hover:-translate-y-1 ${
                      card.featured
                        ? "border-white bg-gradient-to-br text-white shadow-[0_28px_70px_rgba(111,89,255,0.2)]"
                        : `${card.border} bg-gradient-to-br ${card.softBg}`
                    }`}
                  >
                    {card.featured && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF]" />
                    )}

                    <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-[180px] w-[180px] rounded-full bg-white/50 blur-[50px] transition-transform duration-500 group-hover:scale-125" />

                    <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-[20px] border shadow-sm ${
                          card.featured
                            ? "border-white/30 bg-white/18 text-white backdrop-blur-md"
                            : "border-white/80 bg-white/85"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${card.accent}`} />
                      </div>

                      <div>
                        <h3
                          className={`mb-2 text-[22px] font-[900] leading-tight ${
                            card.featured ? "text-white" : "text-[#1A1528]"
                          }`}
                        >
                          {card.title}
                        </h3>

                        <p
                          className={`text-[14px] font-semibold leading-relaxed ${
                            card.featured ? "text-white/88" : "text-[#5B566E]"
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
      <div className="absolute -left-[8%] top-[2%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/70 blur-[110px]" />
      <div className="absolute right-[-10%] top-[18%] h-[420px] w-[420px] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[-22%] left-[34%] h-[460px] w-[460px] rounded-full bg-white/70 blur-[100px]" />
    </div>
  );
}
