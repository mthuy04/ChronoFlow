"use client";

import { ArrowRight } from "lucide-react";
import type { QuizOption } from "@/data/quizQuestions";
import type { Chronotype } from "@/types/chronotype";

interface QuestionCardProps {
  question: string;
  options: QuizOption[];
  onSelect: (type: Chronotype) => void;
}

export default function QuestionCard({
  question,
  options,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10">
      <h2 className="text-2xl md:text-3xl font-serif mb-8 leading-relaxed">
        {question}
      </h2>

      <div className="grid gap-4">
        {options.map((option) => (
          <button
            key={option.text}
            onClick={() => onSelect(option.type)}
            className="w-full text-left p-6 rounded-[1.75rem] border border-[#F0EBE1] hover:border-[#D4B59E] hover:bg-[#FDFCF8] transition-all flex items-center justify-between group"
          >
            <span className="text-[#6B655E] text-lg font-light">
              {option.text}
            </span>
            <ArrowRight className="w-5 h-5 text-[#D4B59E] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  );
}