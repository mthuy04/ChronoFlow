import Link from "next/link";
import { Sparkles, ArrowRight, Sun, Moon, Brain, Waves } from "lucide-react";

const chronotypes = [
  {
    name: "Lion",
    title: "The early powerhouse",
    description:
      "Clear, proactive, and strongest in the morning. Lions thrive when important work happens before noon.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    name: "Bear",
    title: "The balanced rhythm",
    description:
      "Steady and consistent. Bears often align well with daytime schedules and perform best from late morning to early afternoon.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Wolf",
    title: "The evening thinker",
    description:
      "Slower to start, sharper later. Wolves often find their best energy and clarity in the late afternoon or evening.",
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    name: "Dolphin",
    title: "The sensitive sprinter",
    description:
      "Alert in waves, sensitive to overstimulation, and often at their best in focused bursts rather than long steady stretches.",
    color: "bg-teal-50 text-teal-700",
  },
];

export default function ChronotypesPage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0EBE1] text-[#8C7A6B] text-xs uppercase tracking-widest font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Chronotype overview
          </div>

          <h1 className="text-5xl md:text-6xl font-serif mb-8 leading-[1.1]">
            Your chronotype shapes
            <br className="hidden md:block" />
            how your day feels.
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-[#6B655E] font-light leading-relaxed">
            A chronotype is your natural tendency toward certain sleep, energy,
            and alertness patterns. ChronoFlow uses that rhythm as the foundation
            for planning—not just awareness.
          </p>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <InfoCard
            icon={<Sun className="w-5 h-5" />}
            title="Why it matters"
            description="Knowing your rhythm helps you stop treating all hours as equal. Some parts of the day are naturally better for deep work, some for routine work, and some for rest."
          />
          <InfoCard
            icon={<Brain className="w-5 h-5" />}
            title="What ChronoFlow does differently"
            description="Instead of stopping at ‘you are a Wolf’ or ‘you are a Lion’, ChronoFlow turns that result into planning logic, reflection, and real daily action."
          />
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-10 text-center">
            The four chronotypes
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {chronotypes.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-[2rem] p-8 border border-[#F0EBE1] shadow-sm"
              >
                <div
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-medium mb-5 ${item.color}`}
                >
                  {item.name}
                </div>
                <h3 className="text-2xl font-serif mb-3">{item.title}</h3>
                <p className="text-[#6B655E] font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-[#F0EBE1] p-10 md:p-12 shadow-sm text-center">
          <Waves className="w-10 h-10 text-[#D4B59E] mx-auto mb-6" />
          <h3 className="text-3xl font-serif mb-4">
            Ready to find your rhythm?
          </h3>
          <p className="text-[#6B655E] font-light text-lg leading-relaxed mb-8">
            Take the assessment and translate your chronotype into focus windows,
            planning guidance, and a more realistic weekly flow.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#3A3836] text-white px-8 py-4 rounded-full text-lg font-light hover:bg-[#2C2A28] transition-colors"
          >
            Take the assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
          <Link href="/assessment" className="hover:text-[#3A3836]">
            Quiz
          </Link>
          <Link href="/learn" className="hover:text-[#3A3836]">
            Learn
          </Link>
          <Link href="/kit" className="hover:text-[#3A3836]">
            The Kit
          </Link>
        </div>
      </div>
    </nav>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-[#F0EBE1] shadow-sm">
      <div className="w-10 h-10 rounded-2xl bg-[#F8F7F3] text-[#D4B59E] flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-2xl font-serif mb-3">{title}</h3>
      <p className="text-[#6B655E] font-light leading-relaxed">{description}</p>
    </div>
  );
}