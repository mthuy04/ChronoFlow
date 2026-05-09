"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Clock3, MoonStar, Sparkles } from "lucide-react";

const resources = [
  {
    title: "Chronotype là gì?",
    desc: "Hiểu vì sao mỗi người tỉnh táo ở những thời điểm khác nhau.",
    href: "/learn/chronotype-basics",
    icon: MoonStar,
  },
  {
    title: "Vì sao năng lượng lên xuống?",
    desc: "Tìm hiểu energy curve và nhịp sinh học trong ngày.",
    href: "/learn/energy-rhythm",
    icon: Brain,
  },
  {
    title: "Lập kế hoạch theo nhịp",
    desc: "Đặt deep work, việc nhẹ và recovery vào đúng thời điểm hơn.",
    href: "/learn/rhythm-based-planning",
    icon: Clock3,
  },
];

export default function LearnSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] px-4 py-8 font-sans text-[#1A1528] lg:px-8">
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="rounded-[36px] border border-white/80 bg-white/72 px-5 py-12 shadow-[0_24px_80px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:px-10 md:py-16">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
                <BookOpen className="h-3.5 w-3.5" />
                Thư viện kiến thức
              </div>
              <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                Đọc nhanh để hiểu{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  nhịp của bạn.
                </span>
              </h2>
              <p className="mt-4 text-[15px] font-semibold leading-8 text-[#5B566E]">
                Một vài tài nguyên nền tảng trước khi bạn đi sâu vào Planner,
                Rhythm và các gợi ý cá nhân hóa.
              </p>
            </div>

            <Link
              href="/learn"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[13px] font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black"
            >
              Mở thư viện kiến thức
              <ArrowRight className="h-4 w-4 text-[#4DA8FF]" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="group rounded-[30px] border border-[#EAE8F7] bg-white/82 p-6 shadow-[0_18px_48px_rgba(26,21,40,0.045)] transition hover:-translate-y-0.5"
                >
                  <div className="mb-5 grid h-13 w-13 place-items-center rounded-[20px] bg-[#F3F0FF] text-[#6F59FF]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[20px] font-[900] tracking-tight text-[#1A1528]">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-[14px] font-semibold leading-7 text-[#5B566E]">
                    {resource.desc}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-[13px] font-black text-[#6F59FF]">
                    Đọc tiếp
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 rounded-[28px] border border-[#EAE8F7] bg-[#FBFAFF] p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-[13px] font-semibold leading-7 text-[#5B566E]">
                ChronoFlow là công cụ hỗ trợ lập kế hoạch theo chronotype và
                tự quan sát năng lượng, không phải tư vấn y tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
