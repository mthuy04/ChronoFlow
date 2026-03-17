import Link from "next/link";
import {
  ArrowRight,
  MoonStar,
  Sparkles,
  SunMedium,
  Play,
  Zap,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F7F4FF_0%,#F2F6FF_52%,#FFF8F1_100%)] px-6 pt-20 pb-28 md:pt-24 md:pb-32">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-10%] top-[-12%] h-[360px] w-[360px] rounded-full bg-[#C7B8FF]/35 blur-[120px]" />
        <div className="absolute right-[-8%] top-[8%] h-[320px] w-[320px] rounded-full bg-[#B8D4FF]/35 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[18%] h-[260px] w-[260px] rounded-full bg-[#E8D5FF]/30 blur-[110px]" />
        <div className="absolute bottom-[0%] right-[12%] h-[220px] w-[220px] rounded-full bg-[#FFD9BF]/25 blur-[100px]" />
      </div>

      <div className="section-container relative z-10">
        {/* Top content */}
        <div className="mx-auto max-w-[940px] text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C5CFA] backdrop-blur-md shadow-[0_8px_30px_rgba(124,92,250,0.08)]">
            <Sparkles className="h-3.5 w-3.5" />
            Chronotype-informed planning
          </div>

          <h1 className="mx-auto max-w-[820px] text-[clamp(2.6rem,6.5vw,4.8rem)] font-[800] leading-[1.02] tracking-[-0.055em] text-[#241F3D]">
            Work with your{" "}
            <span className="bg-gradient-to-r from-[#A855F7] via-[#D946EF] to-[#60A5FA] tracking-[-0.03em] bg-clip-text text-transparent italic font-serif">
              biology
            </span>
            , not against it.
          </h1>

          <p className="mx-auto mt-7 max-w-[680px] text-[1.02rem] leading-8 text-[#615C7A] md:text-[1.08rem]">
            ChronoFlow helps you understand how your energy changes across the
            day, then turns that rhythm into planning guidance that feels more
            natural, sustainable, and realistic.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/assessment"
              className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#241F3D] px-7 text-[15px] font-semibold text-white shadow-[0_16px_40px_rgba(36,31,61,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              Discover your chronotype
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/learn"
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full border border-[rgba(124,115,150,0.14)] bg-white/72 px-6 text-[15px] font-medium text-[#241F3D] backdrop-blur-md transition-all duration-200 hover:bg-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(124,115,150,0.14)] bg-white">
                <Play className="h-3.5 w-3.5 fill-[#7C5CFA] text-[#7C5CFA]" />
              </span>
              Learn the science
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,115,150,0.14)] bg-white/72 px-4 py-2 text-sm text-[#4F4A68] shadow-[0_8px_24px_rgba(36,31,61,0.04)]">
              <MoonStar className="h-4 w-4 text-[#8B5CF6]" />
              Chronotype insight
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,115,150,0.14)] bg-white/72 px-4 py-2 text-sm text-[#4F4A68] shadow-[0_8px_24px_rgba(36,31,61,0.04)]">
              <SunMedium className="h-4 w-4 text-[#60A5FA]" />
              Energy mapping
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,115,150,0.14)] bg-white/72 px-4 py-2 text-sm text-[#4F4A68] shadow-[0_8px_24px_rgba(36,31,61,0.04)]">
              <Zap className="h-4 w-4 text-[#F59E0B]" />
              Smarter planning
            </div>
          </div>
        </div>

        {/* Visual stage */}
        <div className="relative mx-auto mt-14 max-w-[1120px] md:mt-16">
          {/* floating accents */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#FFD5B8]/45 blur-[55px]" />

          <div className="absolute -bottom-8 left-[8%] hidden rounded-2xl border border-white/70 bg-white/75 px-5 py-3 shadow-[0_20px_50px_rgba(124,92,250,0.10)] backdrop-blur-xl md:block animate-float">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-sm font-semibold text-[#241F3D]">
                Rhythm-aware planning live
              </span>
            </div>
          </div>

          <div className="relative rounded-[34px] border border-white/60 bg-white/55 p-2 shadow-[0_30px_120px_rgba(90,72,140,0.12)] backdrop-blur-2xl md:rounded-[42px]">
            <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,242,255,0.78)_100%)] p-5 md:rounded-[34px] md:p-8 lg:p-10">
              <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6">
                {/* Main visual */}
                <div className="rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,#F8F5FF_0%,#EEF4FF_52%,#FFF8F1_100%)] p-5 shadow-[0_16px_40px_rgba(124,115,150,0.06)] md:p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                        Example rhythm dashboard
                      </div>
                      <h2 className="max-w-[460px] text-[1.75rem] font-bold leading-[1.02] tracking-[-0.04em] text-[#241F3D] md:text-[2.15rem]">
                        A calmer way to plan around your real energy
                      </h2>
                    </div>

                    <div className="hidden shrink-0 rounded-full border border-[#CFC7F4] bg-white/80 px-4 py-2 text-xs font-semibold text-[#7C5CFA] md:block">
                      Bear profile
                    </div>
                  </div>

                  <p className="max-w-[600px] text-[0.98rem] leading-7 text-[#615C7A]">
                    Instead of treating every hour the same, ChronoFlow helps
                    you place demanding work, lighter tasks, and recovery into
                    the parts of the day that fit you best.
                  </p>

                  <div className="mt-6 rounded-[24px] border border-white/70 bg-white/72 p-4 shadow-[0_14px_36px_rgba(36,31,61,0.05)] md:p-5">
                    <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#8A857B]">
                      <span>6 AM</span>
                      <span>12 PM</span>
                      <span>6 PM</span>
                      <span>12 AM</span>
                    </div>

                    <div className="relative aspect-[16/8] overflow-hidden">
                      <svg
                        viewBox="0 0 700 240"
                        className="absolute inset-0 h-full w-full overflow-visible"
                        fill="none"
                      >
                        <defs>
                          <filter id="heroGlowLight">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>

                          <linearGradient
                            id="heroPrimaryLight"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
                            <stop offset="45%" stopColor="#C084FC" />
                            <stop offset="100%" stopColor="#60A5FA" />
                          </linearGradient>
                        </defs>

                        <path
                          d="M20 160 C100 150, 150 88, 235 86 C320 84, 355 168, 420 176 C505 186, 565 100, 680 104"
                          stroke="url(#heroPrimaryLight)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          filter="url(#heroGlowLight)"
                          className="animate-draw"
                        />
                        <path
                          d="M20 175 C105 168, 160 158, 245 162 C350 167, 415 132, 510 126 C585 121, 635 140, 680 170"
                          stroke="#9DBAF7"
                          strokeOpacity="0.95"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className="energy-path delay-1"
                        />
                        <path
                          d="M20 190 C110 186, 185 191, 285 184 C405 176, 515 184, 680 188"
                          stroke="#E4B9A0"
                          strokeOpacity="0.9"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="energy-path delay-2"
                        />
                      </svg>

                      <div className="absolute left-[8%] top-[10%] rounded-full border border-white/80 bg-white px-4 py-2 text-sm font-semibold text-[#6F47E8] shadow-lg">
                        Focus peak
                      </div>

                      <div className="absolute right-[4%] bottom-[9%] rounded-full border border-white/80 bg-white px-4 py-2 text-sm font-medium text-[#6F6985] shadow-lg">
                        Recovery window
                      </div>

                      <div className="absolute left-[35%] top-[14%] rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-[0_16px_40px_rgba(124,92,250,0.14)] animate-bounce-subtle">
                        <div className="flex items-center gap-2 text-[13px] font-black tracking-tight text-[#241F3D]">
                          <Zap className="h-4 w-4 fill-amber-400 stroke-none" />
                          FOCUS PEAK
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                          9:30 AM — 12:30 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-[24px] border border-white/70 bg-white/76 px-5 py-5 shadow-[0_14px_34px_rgba(36,31,61,0.05)] backdrop-blur-xl transition-colors hover:bg-white">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                      Chronotype
                    </div>
                    <div className="text-[1.65rem] font-bold tracking-[-0.03em] text-[#241F3D]">
                      Bear
                    </div>
                    <p className="mt-2 text-[0.95rem] leading-7 text-[#615C7A]">
                      Steady energy through the morning, with a softer decline
                      later in the day.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/70 bg-white/76 px-5 py-5 shadow-[0_14px_34px_rgba(36,31,61,0.05)] backdrop-blur-xl transition-colors hover:bg-white">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                      Best focus block
                    </div>
                    <div className="text-[1.65rem] font-bold tracking-[-0.03em] text-[#241F3D]">
                      9:30 – 12:30
                    </div>
                    <p className="mt-2 text-[0.95rem] leading-7 text-[#615C7A]">
                      Best used for deep work, writing, study, and analysis.
                    </p>
                  </div>

                  <div className="rounded-[26px] bg-gradient-to-br from-[#9B7BFF] to-[#78A8FF] px-5 py-6 shadow-[0_20px_50px_rgba(124,92,250,0.20)] sm:col-span-2 lg:col-span-1">
                    <MoonStar className="mb-4 h-8 w-8 text-white" />
                    <div className="max-w-[280px] text-[1.05rem] font-semibold leading-7 tracking-[-0.02em] text-white">
                      “Your schedule stops being generic and starts matching how
                      you actually function.”
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end visual */}
      </div>
    </section>
  );
}