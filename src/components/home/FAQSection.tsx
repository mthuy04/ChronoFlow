
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

const faqs = [
  {
    q: "ChronoFlow khác gì Google Calendar, Todoist hay Notion?",
    a: "Các công cụ đó thường giúp bạn ghi việc và đặt lịch. ChronoFlow tập trung vào câu hỏi: việc này nên làm vào lúc nào để hợp với nhịp năng lượng của bạn hơn.",
  },
  {
    q: "Làm bài đánh giá mất bao lâu?",
    a: "Khoảng 2–3 phút. Sau đó bạn sẽ có kết quả chronotype và khung giờ tham khảo để bắt đầu lập kế hoạch.",
  },
  {
    q: "ChronoFlow có miễn phí không?",
    a: "Có. Bạn có thể bắt đầu miễn phí với bài đánh giá, kết quả cơ bản và một số tính năng lập kế hoạch ban đầu.",
  },
  {
    q: "ChronoFlow có phải công cụ chẩn đoán sức khỏe không?",
    a: "Không. ChronoFlow là công cụ hỗ trợ tự quan sát năng lượng và lập kế hoạch cá nhân, không thay thế tư vấn y tế hay chẩn đoán chuyên môn.",
  },
  {
    q: "Có cần đăng nhập để dùng không?",
    a: "Bạn có thể xem thông tin cơ bản trên website, nhưng cần đăng nhập để lưu kết quả, task, lịch làm việc, coin và dữ liệu cá nhân hóa.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-[#F4F2FA] py-8 font-sans">
      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="overflow-hidden rounded-[40px] border border-white bg-white/75 px-6 py-16 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:px-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="mx-auto mb-12 max-w-4xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)]">
              <Sparkles className="h-3.5 w-3.5" />
              FAQ
            </div>

            <h2 className="mb-4 text-[clamp(2rem,4vw,3rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
              Câu hỏi{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                thường gặp
              </span>
            </h2>

            <p className="mx-auto max-w-[680px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
              Những điều người dùng thường thắc mắc khi lần đầu tiếp cận ChronoFlow.
            </p>
          </motion.div>

          <div className="mx-auto max-w-4xl space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="overflow-hidden rounded-[24px] border border-white bg-white shadow-[0_14px_35px_rgba(26,21,40,0.05)]"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="text-[15px] font-[900] leading-snug text-[#1A1528]">
                      {faq.q}
                    </span>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      >
                        <div className="border-t border-[#F1F3F8] px-5 pb-5 pt-4 text-[13.5px] font-semibold leading-relaxed text-[#5B566E]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
