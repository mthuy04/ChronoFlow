"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Headphones,
  HelpCircle,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type ContactTopic =
  | "SUPPORT"
  | "PARTNERSHIP"
  | "FEEDBACK"
  | "REWARD"
  | "BUSINESS"
  | "OTHER";

type ContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  topic: ContactTopic | "";
  message: string;
};

type ContactApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

const CONTACT_EMAIL = "chronoflowvn@gmail.com";
const CONTACT_PHONE = "0812467168";

const topicOptions: Array<{ value: ContactTopic; label: string }> = [
  { value: "SUPPORT", label: "Hỗ trợ tài khoản / sử dụng app" },
  { value: "PARTNERSHIP", label: "Hợp tác / đối tác" },
  { value: "FEEDBACK", label: "Góp ý sản phẩm" },
  { value: "REWARD", label: "Reward / Planner Kit" },
  { value: "BUSINESS", label: "Doanh nghiệp / dự án" },
  { value: "OTHER", label: "Khác" },
];

const contactCards = [
  {
    title: "Hỗ trợ sử dụng",
    description:
      "Gặp lỗi khi đăng nhập, assessment, planner, rhythm, reward hoặc tài khoản ChronoFlow.",
    icon: <Headphones className="h-5 w-5 text-[#6F59FF]" />,
    tone: "purple" as const,
  },
  {
    title: "Góp ý sản phẩm",
    description:
      "Chia sẻ trải nghiệm thật, điều bạn thích, điểm gây khó hiểu hoặc tính năng muốn có.",
    icon: <MessageCircle className="h-5 w-5 text-[#4DA8FF]" />,
    tone: "blue" as const,
  },
  {
    title: "Hợp tác & pitching",
    description:
      "Liên hệ về demo, đối tác, feedback research hoặc thông tin phục vụ báo cáo dự án.",
    icon: <Target className="h-5 w-5 text-[#10B981]" />,
    tone: "green" as const,
  },
];

const quickQuestions = [
  "Mình cần hỗ trợ đăng nhập / tài khoản",
  "Mình muốn góp ý về Planner hoặc Rhythm",
  "Mình muốn hỏi về Reward / Chrono Kit",
  "Mình muốn liên hệ hợp tác hoặc demo",
];

const responseNotes = [
  {
    icon: <Clock3 className="h-4 w-4" />,
    title: "Phản hồi sớm nhất có thể",
    text: "ChronoFlow sẽ đọc nội dung và phản hồi qua email hoặc số điện thoại bạn cung cấp.",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: "Thông tin được dùng đúng mục đích",
    text: "Nội dung liên hệ chỉ dùng để hỗ trợ, cải thiện sản phẩm hoặc phục vụ trao đổi đã nêu.",
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: "Nên mô tả càng rõ càng tốt",
    text: "Nếu là lỗi, hãy ghi trang gặp lỗi, thao tác trước đó và ảnh chụp màn hình nếu có.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>({
    fullName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  function updateField<K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function fillQuickMessage(text: string) {
    setForm((prev) => ({
      ...prev,
      topic: prev.topic || "SUPPORT",
      message: prev.message ? `${prev.message}\n${text}` : text,
    }));
  }

  function validateForm() {
    if (!form.fullName.trim()) {
      return "Bạn vui lòng nhập họ tên.";
    }

    if (!form.email.trim()) {
      return "Bạn vui lòng nhập email.";
    }

    if (!isValidEmail(form.email)) {
      return "Email chưa đúng định dạng.";
    }

    if (!form.topic) {
      return "Bạn vui lòng chọn chủ đề liên hệ.";
    }

    if (!form.message.trim()) {
      return "Bạn vui lòng nhập nội dung cần hỗ trợ.";
    }

    if (form.message.trim().length < 12) {
      return "Nội dung hơi ngắn. Bạn mô tả thêm một chút để ChronoFlow hỗ trợ tốt hơn nhé.";
    }

    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setStatus("error");
      setStatusMessage(validationError);
      return;
    }

    try {
      setStatus("loading");
      setStatusMessage("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          topic: form.topic,
          message: form.message.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | ContactApiResponse
        | null;

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Không thể gửi liên hệ lúc này. Vui lòng thử lại sau.",
        );
      }

      setStatus("success");
      setStatusMessage(
        data.message ||
          "ChronoFlow đã nhận được liên hệ của bạn. Chúng mình sẽ phản hồi sớm nhất có thể.",
      );

      setForm({
        fullName: "",
        email: "",
        phone: "",
        topic: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <main className="relative flex flex-col gap-12 overflow-hidden bg-slate-50 pb-28 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <BackgroundDecor />

        <HeroSection />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] space-y-12 px-4 lg:px-8">
          <SectionWrapper id="contact-form">
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                  <Send className="h-3.5 w-3.5" />
                  Gửi lời nhắn
                </div>

                <h2 className="max-w-[760px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Cho ChronoFlow biết bạn{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    cần hỗ trợ gì.
                  </span>
                </h2>

                <p className="mt-5 max-w-[58ch] text-[1rem] leading-8 text-[#615C7A]">
                  Bạn có thể gửi lỗi gặp phải, góp ý trải nghiệm, câu hỏi về
                  reward, Chrono Kit hoặc đề xuất hợp tác. Nội dung càng rõ thì
                  ChronoFlow phản hồi càng nhanh và đúng trọng tâm hơn.
                </p>

                <div className="mt-6 grid gap-3">
                  {responseNotes.map((item) => (
                    <InfoRow
                      key={item.title}
                      icon={item.icon}
                      title={item.title}
                      text={item.text}
                    />
                  ))}
                </div>

                <div className="mt-6 rounded-[28px] border border-[#E9E5FF] bg-[#F8F6FF] p-5 shadow-sm">
                  <div className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                    Gợi ý nội dung nhanh
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => fillQuickMessage(question)}
                        className="rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[12px] font-bold text-[#5B566E] shadow-sm transition hover:-translate-y-0.5 hover:text-[#6F59FF]"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/76 p-5 shadow-[0_24px_70px_rgba(26,21,40,0.07)] backdrop-blur-2xl md:p-6"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D9EAFF]/80 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#DCCEFF]/70 blur-3xl" />

                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 rounded-[30px] border border-[#E9E5FF] bg-[#FCFBFF]/92 p-5 shadow-sm md:p-6"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                        Contact form
                      </div>
                      <h3 className="mt-2 text-[1.65rem] font-[900] leading-tight tracking-tight text-[#1A1528]">
                        Thông tin liên hệ
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF] shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <InputField label="Họ và tên" required>
                      <InputShell icon={<User className="h-4 w-4" />}>
                        <input
                          value={form.fullName}
                          onChange={(event) =>
                            updateField("fullName", event.target.value)
                          }
                          placeholder="Ví dụ: Nguyễn Minh Anh"
                          className="input-reset"
                        />
                      </InputShell>
                    </InputField>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label="Email" required>
                        <InputShell icon={<Mail className="h-4 w-4" />}>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                              updateField("email", event.target.value)
                            }
                            placeholder="you@email.com"
                            className="input-reset"
                          />
                        </InputShell>
                      </InputField>

                      <InputField label="Số điện thoại">
                        <InputShell icon={<Phone className="h-4 w-4" />}>
                          <input
                            value={form.phone}
                            onChange={(event) =>
                              updateField("phone", event.target.value)
                            }
                            placeholder="0812..."
                            className="input-reset"
                          />
                        </InputShell>
                      </InputField>
                    </div>

                    <InputField label="Chủ đề" required>
                      <InputShell icon={<HelpCircle className="h-4 w-4" />}>
                        <select
                          value={form.topic}
                          onChange={(event) =>
                            updateField(
                              "topic",
                              event.target.value as ContactTopic | "",
                            )
                          }
                          className="input-reset"
                        >
                          <option value="">Chọn chủ đề liên hệ</option>
                          {topicOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </InputShell>
                    </InputField>

                    <InputField label="Nội dung" required>
                      <div className="rounded-[22px] border border-[#E8E2FF] bg-[#FAFAFF] px-4 py-3 shadow-[0_8px_20px_rgba(26,21,40,0.04)] transition focus-within:border-[#6F59FF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
                        <textarea
                          value={form.message}
                          onChange={(event) =>
                            updateField("message", event.target.value)
                          }
                          rows={6}
                          placeholder="Bạn mô tả vấn đề, góp ý hoặc nội dung muốn trao đổi tại đây..."
                          className="min-h-[140px] w-full resize-none bg-transparent text-[14px] font-semibold leading-7 text-[#1A1528] outline-none placeholder:text-[#A3A0B8]"
                        />
                      </div>
                    </InputField>

                    {status !== "idle" && statusMessage ? (
                      <div
                        className={`rounded-2xl border px-4 py-3 text-[13px] font-bold leading-6 ${
                          status === "success"
                            ? "border-[#BBF7D0] bg-[#ECFDF5] text-[#10B981]"
                            : status === "error"
                              ? "border-rose-100 bg-rose-50 text-rose-700"
                              : "border-[#E9E5FF] bg-[#F8F6FF] text-[#6F59FF]"
                        }`}
                      >
                        {statusMessage}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group mt-1 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 text-[#4DA8FF]" />
                      )}

                      <span className="text-[14px] font-bold">
                        {status === "loading" ? "Đang gửi..." : "Gửi liên hệ"}
                      </span>

                      {status !== "loading" ? (
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      ) : null}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="channels">
            <SectionHeading
              eyebrow="Contact channels"
              title={
                <>
                  Hoặc liên hệ nhanh qua{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    email và điện thoại
                  </span>
                </>
              }
              description="Nếu cần trao đổi nhanh hơn, bạn có thể dùng trực tiếp email hoặc số điện thoại của ChronoFlow."
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <ContactChannelCard
                href={`mailto:${CONTACT_EMAIL}`}
                icon={<Mail className="h-6 w-6 text-[#6F59FF]" />}
                label="Email"
                value={CONTACT_EMAIL}
                description="Phù hợp cho hỗ trợ chi tiết, góp ý sản phẩm, file ảnh lỗi hoặc trao đổi hợp tác."
                cta="Gửi email"
                tone="purple"
              />

              <ContactChannelCard
                href={`tel:${CONTACT_PHONE}`}
                icon={<Phone className="h-6 w-6 text-[#4DA8FF]" />}
                label="Phone"
                value={CONTACT_PHONE}
                description="Phù hợp khi bạn muốn trao đổi nhanh hoặc cần xác nhận thông tin trực tiếp."
                cta="Gọi ngay"
                tone="blue"
              />
            </div>
          </SectionWrapper>

          <SectionWrapper id="support-topics">
            <SectionHeading
              eyebrow="Support topics"
              title={
                <>
                  ChronoFlow có thể hỗ trợ{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    những gì?
                  </span>
                </>
              }
              description="Trang liên hệ không chỉ dành cho lỗi kỹ thuật. Bạn có thể gửi feedback, câu hỏi, đề xuất hoặc thông tin hợp tác."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {contactCards.map((item, index) => (
                <SupportCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  tone={item.tone}
                  index={index}
                />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="next-step">
            <div className="mx-auto max-w-[920px] text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
                <Sparkles className="h-3.5 w-3.5" />
                Continue your flow
              </div>

              <h2 className="text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.08] tracking-tight text-[#241F3D]">
                Trong lúc chờ phản hồi,{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  bạn có thể tiếp tục khám phá.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
                Làm assessment để tìm chronotype, mở planner để sắp task, hoặc
                đọc thêm kiến thức nền trong Learn Hub.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/assessment"
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                >
                  <Sparkles className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                      BẮT ĐẦU
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Làm bài assessment
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/learn"
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <BarChart3 className="h-3.5 w-3.5 text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Xem Learn Hub
                  </span>
                </Link>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative z-10 px-4 pb-14 pt-0 lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              {[...Array(7)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute h-2 w-2 rounded-full bg-white"
                  style={{
                    top: `${16 + index * 10}%`,
                    left: `${10 + (index % 4) * 24}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2.4 + index * 0.15,
                    repeat: Infinity,
                    delay: index * 0.24,
                  }}
                />
              ))}
            </div>

            <div className="relative z-30 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5" />
                ChronoFlow Contact
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mb-4 text-[clamp(2.2rem,4vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]"
              >
                Cần hỗ trợ hoặc muốn góp ý? <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  ChronoFlow luôn sẵn sàng nghe.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mx-auto mb-8 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]"
              >
                Gửi câu hỏi, lỗi gặp phải, đề xuất tính năng, phản hồi trải
                nghiệm hoặc lời mời hợp tác. Mỗi góp ý đều giúp ChronoFlow trở
                nên rõ ràng, hữu ích và đúng nhịp hơn.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22 }}
                className="mb-8 flex flex-wrap items-center justify-center gap-3"
              >
                <a
                  href="#contact-form"
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                >
                  <Send className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                      LIÊN HỆ
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Gửi lời nhắn
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <Mail className="h-3.5 w-3.5 text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Email trực tiếp
                  </span>
                </a>
              </motion.div>
            </div>

            <div className="relative mx-auto mt-2 h-[350px] w-full max-w-[820px] perspective-[1400px] sm:h-[390px]">
              <div className="absolute left-[4%] top-[10%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                <FloatPill
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Email support"
                  tint="purple"
                />
              </div>

              <div className="absolute right-[4%] top-[8%] z-40 hidden animate-[bounce_4.6s_infinite] sm:block">
                <FloatPill
                  icon={<MessageCircle className="h-3.5 w-3.5" />}
                  label="Product feedback"
                  tint="orange"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -40, y: 30, rotate: -10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, rotate: -6, scale: 1.02 }}
                className="absolute left-[4%] top-16 z-20 w-[190px] rounded-[32px] shadow-2xl sm:left-[7%] sm:w-[215px]"
              >
                <ContactMiniCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 70, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="absolute left-1/2 top-2 z-30 w-[245px] -translate-x-1/2 rounded-[38px] shadow-[0_45px_90px_rgba(26,21,40,0.28)] sm:w-[275px]"
              >
                <ContactPhoneMockup />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40, y: 30, rotate: 10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, rotate: 6, scale: 1.02 }}
                className="absolute right-[4%] top-16 z-20 w-[190px] rounded-[32px] shadow-2xl sm:right-[7%] sm:w-[215px]"
              >
                <SupportStatusCard />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactMiniCard() {
  return (
    <div className="rounded-[32px] border border-white bg-white/92 p-4 shadow-[0_25px_60px_rgba(26,21,40,0.16)] backdrop-blur-xl">
      <div className="rounded-[24px] bg-[linear-gradient(180deg,#F8F6FF_0%,#EFEAFF_100%)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Quick contact
          </div>
          <Mail className="h-4 w-4 text-[#6F59FF]" />
        </div>

        <div className="space-y-2.5">
          <MockLine title="Support" value="Open" tone="purple" />
          <MockLine title="Feedback" value="Read" tone="blue" />
          <MockLine title="Demo" value="Reply" tone="green" />
        </div>

        <div className="mt-4 rounded-[18px] bg-[#1A1528] p-3 text-white">
          <div className="text-[10px] uppercase tracking-[0.12em] text-white/45">
            Tip
          </div>
          <div className="mt-1 text-[11px] font-bold leading-snug">
            Mô tả rõ trang gặp lỗi để được hỗ trợ nhanh hơn.
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPhoneMockup() {
  return (
    <div className="rounded-[36px] border border-white bg-white p-4 shadow-[0_35px_80px_rgba(26,21,40,0.2)]">
      <div className="rounded-[28px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FE_100%)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              Contact inbox
            </div>
            <div className="mt-1 text-[17px] font-[900] text-[#1A1528]">
              ChronoFlow
            </div>
          </div>
          <div className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[10px] font-black text-[#6F59FF]">
            Online
          </div>
        </div>

        <div className="space-y-2.5">
          <ChatBubble sender="Bạn" text="Mình cần hỗ trợ planner..." align="right" />
          <ChatBubble
            sender="ChronoFlow"
            text="Bạn gửi thêm ảnh lỗi hoặc mô tả thao tác nhé."
            align="left"
          />
          <ChatBubble sender="Bạn" text="Mình gửi ngay ạ." align="right" />
        </div>

        <div className="mt-4 rounded-[20px] border border-[#E9E5FF] bg-[#F8F6FF] p-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            <div className="text-[11px] font-bold text-[#5B566E]">
              Đang chờ phản hồi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportStatusCard() {
  return (
    <div className="rounded-[32px] border border-white bg-white/92 p-4 shadow-[0_25px_60px_rgba(26,21,40,0.16)] backdrop-blur-xl">
      <div className="rounded-[24px] bg-[linear-gradient(180deg,#FFF9F2_0%,#FFF4E8_100%)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9A7B56]">
            Support flow
          </div>
          <Headphones className="h-4 w-4 text-[#F59E0B]" />
        </div>

        <div className="space-y-2">
          <StatusStep title="Nhận liên hệ" active />
          <StatusStep title="Đọc nội dung" active />
          <StatusStep title="Phản hồi" />
        </div>

        <div className="mt-4 rounded-[18px] bg-white/85 p-3">
          <div className="text-[10px] uppercase tracking-[0.12em] text-[#9A7B56]">
            Best for
          </div>
          <div className="mt-1 text-[11px] font-bold leading-snug text-[#1A1528]">
            Support, feedback, partnership và pitching.
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionWrapper({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(246,247,255,0.64)_100%)] px-6 py-10 shadow-[0_24px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:px-10 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-0 h-[180px] w-[180px] rounded-full bg-white/35 blur-[70px]" />
        <div className="absolute right-[-4%] bottom-0 h-[220px] w-[220px] rounded-full bg-[#D8E8FF]/30 blur-[80px]" />
      </div>

      <div className="relative">{children}</div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-[1.08] tracking-tight text-[#241F3D]">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
        {description}
      </p>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full">
        <div className="absolute left-[10%] top-[-5%] h-[400px] w-[400px] animate-[pulse_6s_infinite] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
        <div className="absolute right-[-5%] top-[10%] h-[300px] w-[300px] animate-[pulse_8s_infinite] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
      </div>
    </>
  );
}

function InputField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
        {required ? <span className="text-[#6F59FF]"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function InputShell({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 shadow-[0_8px_20px_rgba(26,21,40,0.04)] transition focus-within:border-[#6F59FF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
      <span className="text-[#9A94B5]">{icon}</span>
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6F59FF]">
          {icon}
        </div>
        <div>
          <h4 className="text-[15px] font-[900] text-[#1A1528]">{title}</h4>
          <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ContactChannelCard({
  href,
  icon,
  label,
  value,
  description,
  cta,
  tone,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  cta: string;
  tone: "purple" | "blue";
}) {
  const style =
    tone === "purple"
      ? "from-[#F5F1FF] to-[#ECE5FF] border-[#D8CCFF]"
      : "from-[#EFF7FF] to-[#E0EEFF] border-[#C7E0FF]";

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6 }}
      className={`group rounded-[32px] border bg-gradient-to-br ${style} p-6 shadow-[0_18px_40px_rgba(26,21,40,0.04)]`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
          {icon}
        </div>

        <ArrowRight className="h-5 w-5 text-[#6F59FF] transition group-hover:translate-x-1" />
      </div>

      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>

      <h3 className="mt-2 break-words text-[1.35rem] font-[900] tracking-tight text-[#1A1528]">
        {value}
      </h3>

      <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">{description}</p>

      <div className="mt-5 inline-flex rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[13px] font-black text-[#6F59FF] shadow-sm">
        {cta}
      </div>
    </motion.a>
  );
}

function SupportCard({
  title,
  description,
  icon,
  tone,
  index,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  tone: "purple" | "blue" | "green";
  index: number;
}) {
  const style = {
    purple: "from-[#F5F1FF] to-[#ECE5FF] border-[#D8CCFF]",
    blue: "from-[#EFF7FF] to-[#E0EEFF] border-[#C7E0FF]",
    green: "from-[#ECFCF7] to-[#D7F7EC] border-[#B7EFD9]",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className={`rounded-[30px] border bg-gradient-to-br ${style} p-5 shadow-[0_18px_40px_rgba(26,21,40,0.04)]`}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
        {icon}
      </div>

      <h3 className="text-[1.15rem] font-[900] tracking-tight text-[#1A1528]">
        {title}
      </h3>

      <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
        {description}
      </p>
    </motion.div>
  );
}

function FloatPill({
  icon,
  label,
  tint = "purple",
}: {
  icon: ReactNode;
  label: string;
  tint?: "purple" | "orange";
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-[12px] font-semibold text-[#1A1528] shadow-[0_16px_35px_rgba(26,21,40,0.12)]">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          tint === "purple"
            ? "bg-[#F3F0FF] text-[#6F59FF]"
            : "bg-[#FFF3E8] text-[#F59E0B]"
        }`}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}

function MockLine({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "purple" | "blue" | "green";
}) {
  const className = {
    purple: "bg-white text-[#6F59FF]",
    blue: "bg-white text-[#4DA8FF]",
    green: "bg-white text-[#10B981]",
  }[tone];

  return (
    <div className="flex items-center justify-between rounded-[16px] bg-white/80 px-3 py-2 shadow-sm">
      <span className="text-[10px] font-bold text-[#5B566E]">{title}</span>
      <span className={`rounded-full px-2 py-1 text-[10px] font-black ${className}`}>
        {value}
      </span>
    </div>
  );
}

function ChatBubble({
  sender,
  text,
  align,
}: {
  sender: string;
  text: string;
  align: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-[18px] px-3 py-2 shadow-sm ${
          isRight
            ? "bg-[#6F59FF] text-white"
            : "border border-[#E9E5FF] bg-white text-[#1A1528]"
        }`}
      >
        <div
          className={`mb-0.5 text-[9px] font-black uppercase tracking-[0.12em] ${
            isRight ? "text-white/60" : "text-[#8A84A3]"
          }`}
        >
          {sender}
        </div>
        <div className="text-[11px] font-bold leading-snug">{text}</div>
      </div>
    </div>
  );
}

function StatusStep({ title, active = false }: { title: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-[16px] bg-white/80 px-3 py-2 shadow-sm">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          active ? "bg-[#F59E0B] text-white" : "border border-[#FED7AA] bg-white"
        }`}
      >
        {active ? <CheckCircle2 className="h-3 w-3" /> : null}
      </span>
      <span className="text-[11px] font-black text-[#1A1528]">{title}</span>
    </div>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}