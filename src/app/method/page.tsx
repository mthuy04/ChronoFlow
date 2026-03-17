import Link from "next/link";
import { Sparkles, Brain, CalendarDays, ShieldCheck } from "lucide-react";

export default function MethodPage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <h1 className="text-5xl md:text-6xl font-serif mb-5">
              About the Method
            </h1>
            <p className="text-[#8C7A6B] font-light text-lg max-w-3xl mx-auto leading-relaxed">
              ChronoFlow is a chronotype-inspired planning system designed to help
              students and young knowledge workers align tasks with real energy,
              not idealized schedules.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <MethodCard
              icon={<Brain className="w-6 h-6" />}
              title="Chronotype-inspired"
              description="ChronoFlow uses chronotype logic as a practical input for planning and reflection."
            />
            <MethodCard
              icon={<CalendarDays className="w-6 h-6" />}
              title="Planning-focused"
              description="The goal is not only self-awareness, but scheduling tasks in more realistic energy windows."
            />
            <MethodCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Not medical"
              description="ChronoFlow is not a medical or clinical diagnostic tool. It is a guidance-oriented product."
            />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10 space-y-8">
            <div>
              <h2 className="text-3xl font-serif mb-3">What ChronoFlow is based on</h2>
              <p className="text-[#6B655E] font-light leading-relaxed">
                People do not experience the day in the same way. Some users feel
                strongest in the morning, some later in the afternoon, and some in
                shorter waves. ChronoFlow uses this observation to help users make
                better choices about when to study, do deep work, handle routine
                tasks, and recover.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-serif mb-3">What makes it different</h2>
              <p className="text-[#6B655E] font-light leading-relaxed">
                Many chronotype tools stop at telling users which type they are.
                ChronoFlow goes one layer further: it translates that result into
                a dashboard, planning logic, weekly reflection, and an optional
                physical planner kit for real-world execution.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-serif mb-3">What it does not claim</h2>
              <p className="text-[#6B655E] font-light leading-relaxed">
                ChronoFlow does not diagnose sleep disorders, medical conditions,
                or mental health issues. It offers planning guidance and a
                structured way to experiment with alignment between energy and
                tasks.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/assessment"
                className="inline-flex bg-[#3A3836] text-white px-8 py-4 rounded-full text-lg font-light hover:bg-[#2C2A28] transition-colors"
              >
                Take the assessment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MethodCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-[2rem] border border-[#F0EBE1] shadow-sm p-8">
      <div className="w-12 h-12 rounded-2xl bg-[#F8F7F3] text-[#D4B59E] flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-2xl font-serif mb-3">{title}</h3>
      <p className="text-[#6B655E] font-light leading-relaxed">{description}</p>
    </div>
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
          <Link href="/chronotypes" className="hover:text-[#3A3836]">
            Chronotypes
          </Link>
          <Link href="/learn" className="hover:text-[#3A3836]">
            Learn
          </Link>
          <Link href="/faq" className="hover:text-[#3A3836]">
            FAQ
          </Link>
        </div>
      </div>
    </nav>
  );
}