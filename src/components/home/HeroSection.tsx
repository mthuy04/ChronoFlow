"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  Clock3,
  Sparkles,
  Zap,
} from "lucide-react";

const rhythmCards = [
  {
    time: "09:00",
    label: "Deep work",
    detail: "Việc cần tập trung cao",
    tone: "from-[#6F59FF] to-[#4DA8FF]",
  },
  {
    time: "13:30",
    label: "Task nhẹ",
    detail: "Email, admin, kiểm tra nhanh",
    tone: "from-[#9B8CFF] to-[#7CCBFF]",
  },
  {
    time: "20:30",
    label: "Recovery",
    detail: "Nghỉ, nhìn lại, chuẩn bị ngày mai",
    tone: "from-[#F6B85F] to-[#F9D793]",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] px-4 pb-8 pt-4 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/70 blur-[120px]" />
        <div className="absolute right-[-8%] top-[8%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/75 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="overflow-hidden rounded-[36px] border border-white/80 bg-white/78 shadow-[0_30px_100px_rgba(26,21,40,0.07)] backdrop-blur-2xl md:rounded-[44px]">
          <div className="grid items-center gap-8 px-5 py-12 md:px-10 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-20">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_10px_26px_rgba(111,89,255,0.10)]">
                <Sparkles className="h-3.5 w-3.5" />
                Lập kế hoạch theo nhịp sinh học
              </div>

              <h1 className="mx-auto max-w-[860px] text-[clamp(2.55rem,5.5vw,5.4rem)] font-[900] leading-[0.98] tracking-tight text-[#1A1528] lg:mx-0">
                Không chỉ là to-do list.{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  ChronoFlow giúp bạn lập kế hoạch theo nhịp năng lượng của chính mình.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-[690px] text-[15px] font-semibold leading-8 text-[#5B566E] md:text-[17px] lg:mx-0">
                Làm bài đánh giá 2 phút để biết khung giờ bạn dễ tập trung
                nhất, khi nào nên xử lý việc nhẹ và lúc nào nên nghỉ để giữ
                năng lượng bền hơn.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/assessment"
                  className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-[#1A1528] px-7 text-[14px] font-black text-white shadow-[0_18px_38px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <Activity className="h-4 w-4 text-[#4DA8FF]" />
                  Test ChronoFlow miễn phí 2 phút
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/auth/login?callbackUrl=/dashboard"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-[#EAE8F7] bg-white/85 px-7 text-[14px] font-black text-[#1A1528] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Đăng nhập vào Dashboard
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[540px]">
              <div className="absolute -inset-6 rounded-[42px] bg-gradient-to-br from-[#6F59FF]/18 via-white/40 to-[#4DA8FF]/16 blur-2xl" />

              <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/88 p-5 shadow-[0_30px_80px_rgba(26,21,40,0.10)] backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                      Rhythm snapshot
                    </div>
                    <h2 className="mt-2 text-[24px] font-[900] tracking-tight text-[#1A1528]">
                      Hôm nay nên làm gì trước?
                    </h2>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
                    <CalendarClock className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-3">
                  {rhythmCards.map((card) => (
                    <div
                      key={card.time}
                      className="grid grid-cols-[72px_1fr] items-center gap-4 rounded-[24px] border border-[#EAE8F7] bg-[#FBFAFF] p-4"
                    >
                      <div
                        className={`rounded-2xl bg-gradient-to-br ${card.tone} px-3 py-3 text-center text-white shadow-md`}
                      >
                        <Clock3 className="mx-auto mb-1 h-4 w-4" />
                        <div className="text-[13px] font-black">{card.time}</div>
                      </div>
                      <div>
                        <div className="text-[16px] font-black text-[#1A1528]">
                          {card.label}
                        </div>
                        <p className="mt-1 text-[13px] font-semibold leading-6 text-[#615C7A]">
                          {card.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[24px] border border-[#EAE8F7] bg-[linear-gradient(135deg,#F4F1FF_0%,#EEF7FF_100%)] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
                      <Zap className="h-5 w-5" />
                    </div>
                    <p className="text-[13px] font-bold leading-6 text-[#5B566E]">
                      ChronoFlow không chỉ hỏi bạn cần làm gì. Sản phẩm giúp
                      bạn chọn thời điểm phù hợp hơn để bắt đầu việc đó.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
