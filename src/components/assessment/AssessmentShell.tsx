"use client";

import Link from "next/link";
import { ArrowLeft, Moon } from "lucide-react";

export default function AssessmentShell({
  step,
  total,
  title,
  subtitle,
  children,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const progress = Math.round((step / total) * 100);

  return (
    <main className="min-h-screen bg-[#F7F3EC] text-[#201C2B] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#645E70] hover:text-[#201C2B]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ECE8FF] flex items-center justify-center">
              <Moon className="w-5 h-5 text-[#4F3DFF]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#201C2B]">ChronoFlow</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#7D70F8]">
                assessment
              </div>
            </div>
          </div>

          <div className="text-sm text-[#6A6474]">
            {step} / {total}
          </div>
        </div>

        <div className="h-2 rounded-full bg-white border border-[var(--line)] overflow-hidden mb-10">
          <div
            className="h-full bg-[linear-gradient(90deg,#4F3DFF_0%,#8C7CFF_100%)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow mb-5">Assessment</div>
          <h1 className="font-serif text-[2.6rem] md:text-[3.6rem] leading-[1.05] tracking-[-0.04em] text-[#201C2B]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-[1.05rem] md:text-[1.12rem] leading-[1.8] text-[#6A6474]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto mt-10">
          {children}
        </div>
      </div>
    </main>
  );
}