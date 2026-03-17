"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Clock3 } from "lucide-react";

interface InfoPillProps {
  icon: React.ReactNode;
  text: string;
}

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28 px-6">
      
      {/* ===== SIÊU HOLOGRAPHIC MESH BACKGROUND ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Các quầng sáng màu Hologram đặc trưng: Cyan, Magenta, Purple */}
        <div className="absolute left-[10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-200/40 blur-[120px] animate-pulse" />
        <div className="absolute right-[5%] top-[20%] h-[350px] w-[350px] rounded-full bg-fuchsia-200/30 blur-[100px]" />
        <div className="absolute left-[30%] bottom-[-10%] h-[450px] w-[450px] rounded-full bg-purple-200/40 blur-[110px]" />
        
        {/* Lớp nhiễu hạt (Noise) giúp hiệu ứng hologram trông thật hơn */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="relative group">
          
          {/* Viền Hologram siêu mảnh phát sáng */}
          <div className="absolute -inset-[1.5px] bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-300 to-blue-400 rounded-[34px] opacity-25 group-hover:opacity-50 blur-[3px] transition duration-1000"></div>

          <div className="relative rounded-[32px] bg-white/40 backdrop-blur-3xl p-1.5 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)]">
            <div className="relative rounded-[28px] bg-gradient-to-br from-white/95 via-white/40 to-white/90 px-6 py-14 md:px-12 md:py-20 text-center border border-white/60 overflow-visible">
              
              {/* Linh vật - Đẩy xa ra chút để không che chữ */}
              <div className="absolute -top-12 -left-8 w-20 h-20 hidden lg:block animate-float">
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png" alt="lion" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 hidden lg:block animate-float-delayed">
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png" alt="bear" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>

              {/* Badge */}
              <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#7C5CFA] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Step into your flow
              </div>

              {/* Title: Fix lỗi mất góc chữ rhythm bằng leading-[1.2] và py-1 */}
              <h2 className="mx-auto max-w-[550px] text-4xl md:text-6xl font-[900] leading-[1.2] tracking-tight text-[#1A152E]">
                Work with your <br />
                <span className="relative inline-block py-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 via-fuchsia-500 to-blue-600 italic font-serif px-1">
                    rhythm
                  </span>
                </span>
                , not against it.
              </h2>

              <p className="mx-auto mt-8 max-w-[500px] text-base md:text-lg font-medium leading-relaxed text-[#524C67]">
                A few minutes of reflection to build a day that feels <span className="text-slate-900 font-bold">sustainable</span> and <span className="text-slate-900 font-bold">natural</span>.
              </p>

              {/* Info Pills */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <InfoPill icon={<Clock3 className="h-4 w-4 text-cyan-500" />} text="3-min quiz" />
                <InfoPill icon={<ShieldCheck className="h-4 w-4 text-purple-500" />} text="Bio-rhythm science" />
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
                <Link
                  href="/assessment"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[#1A152E] px-10 py-5 text-base font-black text-white shadow-2xl shadow-purple-200 transition-all hover:scale-105 active:scale-95"
                >
                  Start Assessment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/learn"
                  className="text-sm font-bold text-[#524C67] hover:text-[#7C5CFA] transition-colors"
                >
                  Explore Science
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite -2s; }
      `}</style>
    </section>
  );
}

function InfoPill({ icon, text }: InfoPillProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/40 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-[#4F4A68] shadow-sm">
      <div className="p-1.5 bg-white rounded-xl shadow-sm">{icon}</div>
      {text}
    </div>
  );
}