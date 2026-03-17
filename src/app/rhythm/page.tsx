"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Brain,
  Clock3,
  Moon,
  Coffee,
  Zap,
} from "lucide-react";
import { useChronotype } from "@/hooks/useChronotype";
import { APP_ROUTES } from "@/lib/constants";
import LoadingState from "@/components/common/LoadingState";
import GateView from "@/components/common/GateView";
import EnergyCurveChart from "@/components/rhythm/EnergyCurveChart";

export default function RhythmPage() {
  const router = useRouter();
  const { chronotype, chronotypeInfo, hasChronotype, isReady } = useChronotype();

  if (!isReady) {
    return <LoadingState label="Loading your rhythm..." />;
  }

  if (!hasChronotype || !chronotypeInfo || !chronotype) {
    return (
      <GateView
        title="No rhythm found yet"
        description="Take the assessment first so ChronoFlow can reveal your chronotype, energy curve, and planning windows."
        href={APP_ROUTES.assessment}
        cta="Start assessment"
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-36 pb-24 px-6 max-w-5xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#A39C93] font-medium mb-4">
          Your biology
        </p>

        <h1 className={`text-5xl md:text-6xl font-serif mb-6 ${chronotypeInfo.theme.text}`}>
          {chronotypeInfo.name}
        </h1>

        <div className="relative w-full h-[320px] md:h-[430px] mb-10 flex justify-center items-center overflow-visible">
          <div className={`absolute inset-0 ${chronotypeInfo.theme.bg} rounded-full blur-[90px] opacity-60 scale-75`} />
          <div
            className="relative w-full h-full z-10 flex justify-center items-center overflow-hidden"
            style={{
              maskImage: "radial-gradient(circle, black 54%, transparent 92%)",
              WebkitMaskImage: "radial-gradient(circle, black 54%, transparent 92%)",
            }}
          >
            <iframe
              title="Chronotype 3D Model"
              src={`${chronotypeInfo.splineUrl}?autostart=1&transparent=1&scrollwheel=0&ui_theme=light`}
              frameBorder="0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              className="absolute w-[120%] h-[120%] md:w-[115%] md:h-[115%]"
            />
          </div>
        </div>

        <p className="text-2xl font-serif italic mb-4">{chronotypeInfo.greeting}</p>
        <p className="max-w-2xl mx-auto text-lg text-[#6B655E] font-light leading-relaxed mb-16">
          {chronotypeInfo.description}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
          {chronotypeInfo.tips.map((tip, index) => {
            const icons = [Brain, Coffee, Zap];
            const Icon = icons[index] ?? Brain;

            return (
              <div
                key={tip.label}
                className="bg-white rounded-[2rem] p-8 border border-[#F0EBE1] shadow-sm"
              >
                <div className={`w-10 h-10 rounded-2xl ${chronotypeInfo.theme.bg} ${chronotypeInfo.theme.text} flex items-center justify-center mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs uppercase tracking-widest text-[#A39C93] font-medium mb-1">
                  {tip.label}
                </div>
                <div className="text-xl font-serif">{tip.value}</div>
              </div>
            );
          })}
        </div>

        <div className="mb-12">
          <EnergyCurveChart
            curve={chronotypeInfo.curve}
            stroke={chronotypeInfo.theme.stroke}
            gradientId="chronoGradient"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left mb-14">
          <WindowCard
            icon={<Brain className="w-5 h-5" />}
            title="Peak Window"
            value={chronotypeInfo.windows.peak}
          />
          <WindowCard
            icon={<Clock3 className="w-5 h-5" />}
            title="Medium Window"
            value={chronotypeInfo.windows.medium}
          />
          <WindowCard
            icon={<Moon className="w-5 h-5" />}
            title="Gentle Window"
            value={chronotypeInfo.windows.rest}
          />
        </div>

        <button
          onClick={() => router.push(APP_ROUTES.dashboard)}
          className="inline-flex bg-[#3A3836] text-white px-8 py-4 rounded-full text-lg font-light hover:bg-[#2C2A28] transition-colors"
        >
          Go to dashboard
        </button>
      </section>
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#F0EBE1] px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D4B59E]" />
          <span className="text-xl font-serif">ChronoFlow</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#8C7A6B] font-light">
          <Link href="/dashboard" className="hover:text-[#3A3836]">
            Dashboard
          </Link>
          <Link href="/planner" className="hover:text-[#3A3836]">
            Planner
          </Link>
          <Link href="/insights" className="hover:text-[#3A3836]">
            Insights
          </Link>
        </div>
      </div>
    </nav>
  );
}

function WindowCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-[#F0EBE1] shadow-sm">
      <div className="w-10 h-10 rounded-2xl bg-[#F8F7F3] text-[#D4B59E] flex items-center justify-center mb-5">
        {icon}
      </div>
      <div className="text-xs uppercase tracking-widest text-[#A39C93] font-medium mb-1">
        {title}
      </div>
      <div className="text-xl font-serif">{value}</div>
    </div>
  );
}