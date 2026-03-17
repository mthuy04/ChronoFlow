import Link from "next/link";
import { Sparkles } from "lucide-react";

const faqs = [
  {
    question: "Is ChronoFlow a medical tool?",
    answer:
      "No. ChronoFlow is chronotype-inspired and guidance-oriented. It is not a clinical or medical diagnostic system.",
  },
  {
    question: "How long does the assessment take?",
    answer:
      "The MVP assessment is intentionally short and can be completed in just a few minutes.",
  },
  {
    question: "Do I need an account?",
    answer:
      "You can explore public pages as a guest, but you need an account to save your result, access your dashboard, planner, and insights.",
  },
  {
    question: "How is this different from a normal to-do list?",
    answer:
      "A normal to-do list tells you what to do. ChronoFlow also helps you think about when to do it based on your natural rhythm.",
  },
  {
    question: "Can I retake the assessment?",
    answer:
      "Yes. You can retake the assessment later if you want to revisit your rhythm profile.",
  },
  {
    question: "What is the Planner Kit for?",
    answer:
      "The Planner Kit extends the digital experience into your physical environment, helping you execute your daily rhythm away from the screen.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 text-center">
            <h1 className="text-5xl md:text-6xl font-serif mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-[#8C7A6B] font-light text-lg max-w-2xl mx-auto">
              Everything you need to understand how ChronoFlow works, what it
              is, and what it is not.
            </p>
          </div>

          <div className="space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white rounded-[2rem] border border-[#F0EBE1] shadow-sm p-7 md:p-8"
              >
                <h2 className="text-2xl font-serif mb-3">{faq.question}</h2>
                <p className="text-[#6B655E] font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-10 text-center">
            <h3 className="text-3xl font-serif mb-4">
              Ready to explore your own rhythm?
            </h3>
            <p className="text-[#6B655E] font-light text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              The best way to understand ChronoFlow is to see your own result,
              your own curve, and your own planning windows.
            </p>
            <Link
              href="/assessment"
              className="inline-flex bg-[#3A3836] text-white px-8 py-4 rounded-full text-lg font-light hover:bg-[#2C2A28] transition-colors"
            >
              Take the assessment
            </Link>
          </div>
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
          <Link href="/chronotypes" className="hover:text-[#3A3836]">
            Chronotypes
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