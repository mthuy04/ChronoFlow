"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

interface ArticleSection {
  title: string;
  content: string[];
}

interface ResourceLink {
  label: string;
  href: string;
  external?: boolean;
}

interface ArticlePageShellProps {
  eyebrow: string;
  title: string;
  intro: string;
  icon: ReactNode;
  accent?: string;
  sections: ArticleSection[];
  takeaway?: string;
  nextHref?: string;
  nextLabel?: string;
  resources?: ResourceLink[];
}

export default function ArticlePageShell({
  eyebrow,
  title,
  intro,
  icon,
  accent = "#8B5CF6",
  sections,
  takeaway,
  nextHref,
  nextLabel,
  resources = [],
}: ArticlePageShellProps) {
  return (
    <main className="min-h-screen bg-[#FCFBFF] text-[#1A152E] overflow-x-hidden">
      <Navbar variant="guest" />

      <section className="relative overflow-hidden px-6 pt-16 pb-14 md:pt-24 md:pb-18">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[10%] h-[280px] w-[280px] rounded-full bg-purple-100/30 blur-[110px]" />
          <div className="absolute right-[-6%] top-[8%] h-[240px] w-[240px] rounded-full bg-blue-100/25 blur-[100px]" />
          <div className="absolute bottom-[-8%] left-[30%] h-[220px] w-[220px] rounded-full bg-orange-100/20 blur-[90px]" />
        </div>

        <div className="mx-auto max-w-4xl">
          <Link
            href="/learn"
            className="mb-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#5B46FF] transition-all hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to learning hub
          </Link>

          <div className="rounded-[36px] border border-white bg-white/72 p-4 shadow-[0_18px_48px_rgba(36,31,61,0.06)] backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#F8F4FF_0%,#F4F7FF_52%,#FFF8F1_100%)] p-6 md:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
                {icon}
                {eyebrow}
              </div>

              <h1
                className="text-[clamp(2.1rem,4.8vw,4rem)] font-[900] leading-[1.06] tracking-tight"
                style={{ color: "#1A152E" }}
              >
                {title}
              </h1>

              <p className="mt-6 max-w-3xl text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
                {intro}
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[30px] border border-white bg-white/76 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl md:p-8"
              >
                <h2
                  className="text-[1.45rem] font-[850] tracking-tight md:text-[1.7rem]"
                  style={{ color: "#1A152E" }}
                >
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4">
                  {section.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-[14px] leading-7 text-[#615C7A] md:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {takeaway && (
            <div className="mt-8 rounded-[30px] border border-white bg-[linear-gradient(135deg,#F8F4FF_0%,#F4F7FF_52%,#FFF8F1_100%)] p-3 shadow-[0_18px_48px_rgba(36,31,61,0.08)]">
              <div className="rounded-[24px] border border-white/70 bg-white/60 p-6 backdrop-blur-xl md:p-8">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/88 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFA] shadow-sm">
                  <BookOpen className="h-3 w-3" />
                  Key takeaway
                </div>

                <p className="text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
                  {takeaway}
                </p>
              </div>
            </div>
          )}

          {resources.length > 0 && (
            <div className="mt-8 rounded-[30px] border border-white bg-white/76 p-6 shadow-[0_14px_32px_rgba(36,31,61,0.05)] backdrop-blur-xl md:p-8">
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B5CF6]">
                Suggested reading
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {resources.map((resource) => (
                  <Link
                    key={resource.href}
                    href={resource.href}
                    target={resource.external ? "_blank" : undefined}
                    rel={resource.external ? "noreferrer noopener" : undefined}
                    className="group rounded-[18px] border border-slate-100 bg-white/85 px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[13px] font-semibold leading-6 text-[#1A152E]">
                        {resource.label}
                      </span>
                      {resource.external ? (
                        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-[#8B5CF6]" />
                      ) : (
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#8B5CF6]" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/assessment"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1A152E] px-8 py-4 text-sm font-black text-white shadow-lg shadow-purple-200/50 transition-all hover:scale-105"
            >
              Start the assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {nextHref && nextLabel && (
              <Link
                href={nextHref}
                className="inline-flex items-center gap-2 text-[14px] font-bold text-[#5B46FF] transition-all hover:gap-3"
              >
                {nextLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}