"use client";

import Link from "next/link";
import { ArrowRight, Moon, Sun, Sunset, Waves, Sparkles, Info } from "lucide-react";

const chronotypes = [
  {
    name: "Lion",
    time: "Peak early",
    icon: <Sun className="h-3 w-3" />,
    accent: "#B7772E",
    bg: "from-[#FFF9F0] to-[#FDF2E9]",
    description: "Lions rise quickly, think clearly in the morning, and often lose momentum by evening.",
    curve: "M10 160 C60 100, 100 60, 150 60 C200 60, 250 120, 390 140",
    image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",
    imgPos: "top-2 right-2"
  },
  {
    name: "Bear",
    time: "Peak before midday",
    icon: <Sunset className="h-4 w-4" />,
    accent: "#6C58F2",
    bg: "from-[#F8F7FF] to-[#E9E4FF]",
    description: "Bears follow the sun most naturally, with steady morning energy and a softer afternoon dip.",
    curve: "M10 150 C80 140, 120 80, 180 80 C240 80, 300 140, 390 130",
    image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png",
    imgPos: "bottom-8 right-2"
  },
  {
    name: "Wolf",
    time: "Peak late",
    icon: <Moon className="h-3 w-3" />,
    accent: "#5B46FF",
    bg: "from-[#F5F5FF] to-[#E2E1FF]",
    description: "Wolves warm up slowly and often become more alert and creative later in the day.",
    curve: "M10 170 C100 170, 200 150, 300 80 C350 50, 370 60, 390 80",
    image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png",
    imgPos: "top-6 right-6"
  },
  {
    name: "Dolphin",
    time: "Irregular",
    icon: <Waves className="h-3 w-3" />,
    accent: "#8A7AF0",
    bg: "from-[#F9F8FF] to-[#EBE6FF]",
    description: "Dolphins tend to have lighter, less predictable energy and benefit from gentler routines.",
    curve: "M10 150 C50 120, 100 160, 150 100 C200 60, 250 160, 390 110",
    image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    imgPos: "bottom-4 right-8"
  },
];

export default function ChronotypePreviewSection() {
  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] py-20 md:py-28">
      <div className="section-container max-w-7xl mx-auto px-6">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="mx-auto max-w-[700px] text-center mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] border border-purple-100">
            <Sparkles className="w-3 h-3" />
            Meet the chronotypes
          </div>
          
          <h2 className="text-4xl md:text-5xl font-[900] tracking-tight text-[#1A152E] leading-[1.1]">
            Sync with your <span className="text-[#8B5CF6] italic font-serif">rhythm</span>
          </h2>

          <div className="mx-auto mt-8 max-w-[680px] rounded-[24px] border border-white/80 bg-white/78 p-5 text-center shadow-[0_14px_32px_rgba(36,31,61,0.05)]">
  <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
    Why this matters
  </div>
  <p className="text-[14px] leading-7 text-[#615C7A]">
    Chronotypes are not rigid labels. They are useful patterns that help explain when your focus, recovery, and motivation tend to work best.
  </p>
</div>
        </div>
      

        {/* ===== GRID CARDS ===== */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {chronotypes.map((item) => (
            <div
              key={item.name}
              className="group relative rounded-[28px] border border-white bg-white/70 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/40"
            >
              <div className={`relative aspect-[5/4] overflow-hidden rounded-[22px] bg-gradient-to-br ${item.bg} border border-white/40`}>
                <div className={`absolute ${item.imgPos} w-16 h-16 z-20 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 drop-shadow-xl`}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>

                <div className="absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-slate-600 border border-white">
                  <span style={{ color: item.accent }}>{item.icon}</span>
                  {item.time}
                </div>

                <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full p-4 opacity-80">
                  <path d={item.curve} stroke={item.accent} strokeWidth="4" strokeLinecap="round" fill="none" className="drop-shadow-sm transition-all group-hover:stroke-width-5" />
                </svg>

                <div className="absolute bottom-3 right-4 text-3xl font-black italic tracking-tighter opacity-[0.05] select-none uppercase">
                  {item.name}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-[#1A152E]">{item.name}</h3>
                  <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-purple-500" />
                  </div>
                </div>
                <p className="text-slate-500 text-[12px] font-medium leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SỬA LẠI: Closing Note - Chuyên nghiệp hơn */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-[24px] bg-white border border-slate-100 shadow-sm max-w-2xl">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <Info className="w-4 h-4 text-purple-500" />
             </div>
             <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
               Remember: these are <span className="text-slate-900 font-bold">planning patterns</span>, not rigid boxes. They help turn your biological rhythm into a more workable daily structure.
             </p>
          </div>
        </div>

        {/* ===== BOTTOM CTA ===== */}
        <div className="mt-12 text-center">
          <Link href="/assessment" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A152E] text-white rounded-full font-black text-[14px] hover:scale-105 transition-all shadow-lg shadow-purple-200/50">
            Take the full assessment to find yours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}