"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

const faqs = [
  {
    q: "ChronoFlow có miễn phí không?",
    a: "Có. Bạn có thể bắt đầu bằng bài đánh giá chronotype và dùng các tính năng cơ bản miễn phí. Plus và Pro dành cho nhu cầu phân tích sâu hơn.",
  },
  {
    q: "Làm bài đánh giá mất bao lâu?",
    a: "Khoảng 2 phút. Bạn trả lời một số câu hỏi về giấc ngủ, năng lượng và thói quen tập trung để nhận gợi ý ban đầu.",
  },
  {
    q: "ChronoFlow có phải tư vấn y tế không?",
    a: "Không. ChronoFlow là công cụ hỗ trợ lập kế hoạch và tự quan sát năng lượng cá nhân, không thay thế tư vấn y tế hoặc chẩn đoán chuyên môn.",
  },
  {
    q: "Planner khác lịch thường ở điểm nào?",
    a: "Lịch thường cho biết việc nằm ở mấy giờ. Planner của ChronoFlow gợi ý khung giờ phù hợp hơn dựa trên chronotype, năng lượng và loại task.",
  },
  {
    q: "Có cần đăng nhập để dùng không?",
    a: "Bạn nên đăng nhập để lưu kết quả đánh giá, task, phiên tập trung và dữ liệu Rhythm theo thời gian.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#F4F2FA] px-4 py-8 font-sans text-[#1A1528] lg:px-8">
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="rounded-[36px] border border-white/80 bg-white/72 px-5 py-12 shadow-[0_24px_80px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:px-10 md:py-16">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              FAQ
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
              Câu hỏi{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                thường gặp
              </span>
            </h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-[24px] border border-[#EAE8F7] bg-white/86 shadow-[0_12px_32px_rgba(26,21,40,0.04)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="text-[15px] font-[900] leading-snug text-[#1A1528]">
                      {faq.q}
                    </span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
                      <ChevronDown
                        className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
                      />
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="border-t border-[#F1F0FA] px-5 pb-5 pt-4 text-[13.5px] font-semibold leading-7 text-[#5B566E]">
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
