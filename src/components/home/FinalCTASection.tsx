"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] px-4 pb-12 pt-8 font-sans text-[#1A1528] lg:px-8">
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/72 px-5 py-14 text-center shadow-[0_24px_80px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:px-10 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_48%,#DDEEFF_100%)] opacity-70" />
          <div className="pointer-events-none absolute left-[8%] top-[-20%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/75 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-8%] top-[18%] h-[380px] w-[380px] rounded-full bg-[#D9EAFF]/80 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Bắt đầu với ChronoFlow
            </div>

            <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-[900] leading-[1.02] tracking-tight text-[#1A1528]">
              Bắt đầu bằng{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                bài đánh giá 2 phút.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[680px] text-[16px] font-semibold leading-8 text-[#5B566E]">
              ChronoFlow sẽ giúp bạn hiểu nhịp năng lượng đầu tiên trước khi
              lập kế hoạch.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/assessment"
                className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-[#1A1528] px-7 text-[14px] font-black text-white shadow-[0_18px_38px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
              >
                Bắt đầu bài đánh giá
                <ArrowRight className="h-4 w-4 text-[#4DA8FF] transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-white/80 bg-white/85 px-7 text-[14px] font-black text-[#1A1528] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
              >
                Xem cách hoạt động
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
