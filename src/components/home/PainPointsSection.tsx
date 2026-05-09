"use client";

import { BatteryWarning, CalendarX2, Coffee, Sparkles } from "lucide-react";

const painPoints = [
  {
    title: "Việc khó bị đặt sai thời điểm",
    desc: "Bạn vẫn làm đúng task, nhưng đặt vào lúc não đã mệt nên mọi thứ nặng hơn bình thường.",
    icon: BatteryWarning,
    bg: "from-[#FBF9FF] to-[#F3EEFF]",
  },
  {
    title: "Lịch học/làm bị chia nhỏ bởi việc lặt vặt",
    desc: "Email, tin nhắn, họp ngắn và admin chen vào khung đáng ra nên dành cho deep work.",
    icon: CalendarX2,
    bg: "from-[#F8FCFF] to-[#EEF6FF]",
  },
  {
    title: "Nghỉ ngơi không có kế hoạch nên dễ hụt năng lượng",
    desc: "Bạn chỉ nghỉ khi đã đuối, thay vì đặt recovery như một phần thật sự của lịch.",
    icon: Coffee,
    bg: "from-[#FFFDF7] to-[#FFF2E2]",
  },
];

export default function PainPointsSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] px-4 py-8 font-sans text-[#1A1528] lg:px-8">
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="rounded-[36px] border border-white/80 bg-white/72 px-5 py-12 shadow-[0_24px_80px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:px-10 md:py-16">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Vấn đề thường gặp
            </div>

            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
              Bạn không chỉ cần thêm thời gian{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                bạn cần đúng thời điểm.
              </span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {painPoints.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className={`rounded-[30px] border border-white/85 bg-gradient-to-br ${item.bg} p-6 shadow-[0_18px_48px_rgba(26,21,40,0.055)]`}
                >
                  <div className="mb-5 grid h-13 w-13 place-items-center rounded-[20px] bg-white text-[#6F59FF] shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[20px] font-[900] tracking-tight text-[#1A1528]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] font-semibold leading-7 text-[#5B566E]">
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
