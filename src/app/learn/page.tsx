"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  MoonStar,
  Sun,
  Sunset,
  Moon,
  Waves,
  Brain,
  Clock3,
  Target,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import type { ReactNode } from "react";

const chronotypes = [
  {
    name: "Lion",
    icon: <Sun className="h-5 w-5 text-[#C98C42]" />,
    accent: "text-[#B7772E]",
    bg: "from-[#FFF9F0] to-[#FDF2E9]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",
    description: "Lions wake up easily, feel sharper earlier, and often lose momentum by evening.",
  },
  {
    name: "Bear",
    icon: <Sunset className="h-5 w-5 text-[#6C58F2]" />,
    accent: "text-[#6C58F2]",
    bg: "from-[#F8F7FF] to-[#E9E4FF]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png",
    description: "Bears follow the sun naturally, with steady morning energy and a softer dip later on.",
  },
  {
    name: "Wolf",
    icon: <Moon className="h-5 w-5 text-[#5B46FF]" />,
    accent: "text-[#5B46FF]",
    bg: "from-[#F5F5FF] to-[#E2E1FF]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png",
    description: "Wolves warm up slowly; focus, creativity, and motivation often arrive much later.",
  },
  {
    name: "Dolphin",
    icon: <Waves className="h-5 w-5 text-[#8A7AF0]" />,
    accent: "text-[#8A7AF0]",
    bg: "from-[#F9F8FF] to-[#EBE6FF]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    description: "Dolphins have less predictable patterns and benefit from flexible, gentle routines.",
  },
];

const benefits = [
  {
    icon: <Brain className="w-6 h-6 text-purple-600" />,
    title: "Better self-awareness",
    text: "Stop treating low-energy moments like failure and start seeing your biological patterns.",
    bg: "bg-purple-50",
  },
  {
    icon: <Clock3 className="w-6 h-6 text-blue-600" />,
    title: "Better timing",
    text: "Place deep work, meetings, and recovery where they actually make sense for your body.",
    bg: "bg-blue-50",
  },
  {
    icon: <Target className="w-6 h-6 text-amber-600" />,
    title: "Sustainable planning",
    text: "Build a schedule that is easier to maintain because it respects your natural capacity.",
    bg: "bg-amber-50",
  },
];

const resources = [
    {
      title: "Chronotype basics",
      description: "A general introduction to chronotypes and how people differ in their natural timing.",
      href: "/learn/chronotype-basics",
      tag: "Internal guide",
    },
    {
      title: "Circadian rhythm explainer",
      description: "A deeper look at daily biological rhythms and why alertness isn't constant.",
      href: "/learn/circadian-rhythm",
      tag: "Internal guide",
    },
    {
      title: "Planning with your rhythm",
      description: "Practical suggestions for matching demanding work to energy patterns.",
      href: "/learn/rhythm-based-planning",
      tag: "Internal guide",
    },
    {
      title: "Sleep and circadian rhythm",
      description: "A reliable external starting point for reading more about sleep timing.",
      href: "https://www.nhlbi.nih.gov/health/sleep",
      tag: "External reading",
    },
    {
      title: "Sleep foundation",
      description: "Accessible educational material for readers who want a broader overview.",
      href: "https://www.sleepfoundation.org/",
      tag: "External reading",
    },
    {
      title: "General circadian background",
      description: "Science context behind timing, sleep, and daily regulation.",
      href: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx",
      tag: "External reading",
    },
  ];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E]">
      <Navbar variant="guest" />

      {/* HERO SECTION - Holographic Mesh */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[-5%] top-[10%] h-[500px] w-[500px] rounded-full bg-purple-100/40 blur-[120px] animate-pulse" />
          <div className="absolute right-[-5%] bottom-[10%] h-[450px] w-[450px] rounded-full bg-blue-100/30 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm border border-purple-50">
              <Sparkles className="h-4 w-4" />
              Learning Hub
            </div>

            <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-[950] leading-[0.95] tracking-[-0.05em] text-[#1A152E]">
              Master the art of <br />
              <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500">
                your rhythm.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-[700px] text-lg md:text-xl leading-relaxed text-[#524C67] font-medium">
              ChronoFlow isn&apos;t just about productivity. It&apos;s a practical
              way to sync timing, energy, and recovery into a day that feels right.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link href="/assessment" className="group px-10 py-5 bg-[#1A152E] text-white rounded-full font-black text-lg transition-all hover:scale-105 shadow-xl shadow-purple-200">
                Start assessment
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/how-it-works" className="text-lg font-bold text-[#5B46FF] hover:gap-3 transition-all flex items-center gap-2">
                See how it works <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* WHAT IS CHRONOFLOW CARD */}
          <div className="mt-24 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-[44px] blur-xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative rounded-[40px] border border-white bg-white/40 p-8 md:p-14 backdrop-blur-2xl shadow-sm overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -z-10" />
                <span className="text-[11px] font-black uppercase tracking-widest text-purple-400 mb-6 block">What is ChronoFlow?</span>
                <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
                    <div className="space-y-6 text-lg md:text-xl leading-relaxed text-[#524C67] font-medium">
                        <p>ChronoFlow is a <span className="text-slate-900 font-bold">rhythm-aware planning</span> concept. People have natural patterns in focus, social energy, and rest.</p>
                        <p>Instead of forcing a rigid template, we help you identify your chronotype to plan with self-awareness and respect for your biological clock.</p>
                    </div>
                    <div className="hidden lg:block w-48 h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl rotate-12 shadow-2xl flex items-center justify-center">
                        <Waves className="w-24 h-24 text-white opacity-40" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHRONOTYPES SECTION */}
      <section className="px-6 py-24 bg-white/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA]">
              <MoonStar className="h-4 w-4" />
              The Four Chronotypes
            </div>
            <h2 className="text-4xl md:text-6xl font-[900] tracking-tight text-[#1A152E] mb-8">
               Patterns, not rigid boxes.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {chronotypes.map((item) => (
              <div key={item.name} className="group relative bg-white rounded-[40px] border border-slate-100 p-4 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className={`rounded-[32px] bg-gradient-to-br ${item.bg} aspect-square relative overflow-hidden flex items-center justify-center p-8`}>
                   <img src={item.emoji} alt={item.name} className="w-32 h-32 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6" />
                   <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-white">
                      {item.icon}
                   </div>
                   <div className="absolute bottom-4 right-6 text-5xl font-black italic tracking-tighter opacity-[0.05] uppercase select-none">
                      {item.name}
                   </div>
                </div>
                <div className="p-6">
                   <h3 className={`text-2xl font-black tracking-tight mb-3 ${item.accent}`}>{item.name}</h3>
                   <p className="text-sm font-medium leading-relaxed text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION - Bento Grid */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-4 block">Why it helps</span>
                    <h2 className="text-4xl md:text-5xl font-[900] tracking-tight">Rhythm-based planning <br /> just feels better.</h2>
                </div>
                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Note</p>
                    <p className="text-xs text-slate-500 font-medium">ChronoFlow is a practical framework, not a medical diagnosis.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {benefits.map((item) => (
                    <div key={item.title} className={`p-8 rounded-[40px] border border-white shadow-sm transition-all hover:shadow-xl ${item.bg}`}>
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* READING HUB - Modern List */}
      <section className="px-6 py-24 bg-[#1A152E] rounded-[60px] mx-4 my-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] -z-0" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <span className="text-purple-400 font-black uppercase tracking-widest text-[10px] mb-4 block">Reading Hub</span>
            <h2 className="text-white text-4xl md:text-6xl font-[900] tracking-tight">Knowledge for your day.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item) => {
               const isExternal = item.href.startsWith("http");
               return (
                <Link key={item.title} href={item.href} target={isExternal ? "_blank" : undefined} className="group p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                   <span className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 block">{item.tag}</span>
                   <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                   <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">{item.description}</p>
                   <div className="flex items-center gap-2 text-white font-bold text-xs group-hover:gap-4 transition-all">
                      {isExternal ? "Open source" : "Read article"} <ArrowRight className="w-4 h-4" />
                   </div>
                </Link>
               )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Holographic Card */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-4xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 rounded-[50px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-[48px] bg-[#1A152E] p-12 md:p-20 text-center border border-white/10 overflow-hidden">
             {/* Animated stickers floating */}
             <div className="absolute -top-10 -left-10 w-32 h-32 opacity-20 animate-pulse"><img src={chronotypes[0].emoji} alt="lion" /></div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 opacity-20 animate-pulse delay-700"><img src={chronotypes[1].emoji} alt="bear" /></div>
             
             <span className="text-purple-400 font-black uppercase tracking-widest text-[10px] mb-8 block">Ready to explore?</span>
             <h2 className="text-white text-4xl md:text-6xl font-[950] tracking-tighter mb-8 leading-[1.1]">Start with assessment, <br /> plan with insight.</h2>
             <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/assessment" className="px-10 py-5 bg-white text-black rounded-full font-black text-lg transition-transform hover:scale-105 shadow-2xl">
                  Start assessment
                </Link>
                <Link href="/how-it-works" className="px-10 py-5 bg-white/10 text-white rounded-full font-black text-lg backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                  How it works
                </Link>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}