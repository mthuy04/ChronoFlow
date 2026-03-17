import Link from "next/link";
import { Sparkles, ArrowLeft, Feather } from "lucide-react";
import { ARTICLE_MAP } from "@/data/articles";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLE_MAP[slug] ?? ARTICLE_MAP["sleep-cycle-basics"];

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm text-[#8C7A6B] hover:text-[#3A3836] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>

          <div className="mb-10">
            <div className="text-xs uppercase tracking-widest text-[#D4B59E] font-bold mb-3">
              {article.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-serif leading-[1.1] mb-5">
              {article.title}
            </h1>
            <div className="text-sm text-[#A39C93] font-light flex items-center gap-2">
              <Feather className="w-4 h-4" />
              {article.read}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10 mb-10">
            <p className="text-xl text-[#6B655E] font-light leading-relaxed mb-8">
              {article.intro}
            </p>

            <div className="space-y-6 text-[#4B4742] leading-relaxed font-light">
              {article.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10 mb-10">
            <h2 className="text-3xl font-serif mb-4">Why this matters in ChronoFlow</h2>
            <p className="text-[#6B655E] font-light leading-relaxed">
              Articles like this strengthen the educational layer of the product.
              They help users understand that ChronoFlow is not just a quiz or a
              planner, but a rhythm-aware system for making better choices about
              when to think deeply, when to do lighter work, and when to recover.
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10">
            <h2 className="text-3xl font-serif mb-6">Related reads</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {article.related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/learn/${item.slug}`}
                  className="rounded-[1.5rem] bg-[#F8F7F3] p-5 hover:bg-[#F3EFE8] transition-colors"
                >
                  <div className="text-lg font-serif">{item.title}</div>
                </Link>
              ))}
            </div>

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
          <Link href="/learn" className="hover:text-[#3A3836]">
            Library
          </Link>
          <Link href="/assessment" className="hover:text-[#3A3836]">
            Quiz
          </Link>
          <Link href="/kit" className="hover:text-[#3A3836]">
            The Kit
          </Link>
        </div>
      </div>
    </nav>
  );
}