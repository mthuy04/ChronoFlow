"use client";

import { CalendarDays, CheckSquare, Sparkles, Zap } from "lucide-react";

const comparison = [
  {
    title: "To-do app",
    desc: "Cho bạn biết hôm nay cần làm gì.",
    icon: CheckSquare,
    tone: "bg-[#F8F6FF] text-[#6F59FF]",
  },
  {
    title: "Calendar",
    desc: "Cho bạn biết việc đó nằm lúc mấy giờ.",
    icon: CalendarDays,
    tone: "bg-[#EEF7FF] text-[#4DA8FF]",
  },
  {
    title: "ChronoFlow",
    desc: "Gợi ý khi nào năng lượng của bạn phù hợp nhất để làm việc đó.",
    icon: Zap,
    tone: "bg-[#FFF7ED] text-[#F59E0B]",
    featured: true,
  },
];

export default function ValueSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] px-4 py-8 font-sans text-[#1A1528] lg:px-8">
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/76 px-5 py-12 shadow-[0_24px_80px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:px-10 md:py-16">
          <div className="pointer-events-none absolute right-[-10%] top-[-25%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/65 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-[-28%] left-[10%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/55 blur-[120px]" />

          <div className="relative z-10 mx-auto mb-10 max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Điểm khác biệt
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
              ChronoFlow khác gì so với{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                lịch và to-do app?
              </span>
            </h2>
          </div>

          <div className="relative z-10 grid gap-5 md:grid-cols-3">
            {comparison.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className={`rounded-[30px] border p-6 shadow-[0_18px_48px_rgba(26,21,40,0.055)] ${
                    item.featured
                      ? "border-[#DCD5FF] bg-[linear-gradient(135deg,#F5F2FF_0%,#EEF7FF_100%)]"
                      : "border-white/85 bg-white/78"
                  }`}
                >
                  <div className={`mb-5 grid h-13 w-13 place-items-center rounded-[20px] ${item.tone}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[22px] font-[900] tracking-tight text-[#1A1528]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] font-semibold leading-7 text-[#5B566E]">
                    {item.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
