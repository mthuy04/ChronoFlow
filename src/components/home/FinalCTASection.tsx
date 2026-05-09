"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  Sparkles,
  User,
  Send,
  Clock3,
  ShieldCheck,
  Headphones,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

type ContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function FinalCTASection() {
  const [form, setForm] = useState<ContactFormState>({
    fullName: "",
    email: "",
    phone: "",
    topic: "Tư vấn sử dụng ChronoFlow",
    message: "",
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Không thể gửi yêu cầu.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      topic: "Tư vấn sử dụng ChronoFlow",
      message: "",
    });
    setStatus("idle");
    setErrorMessage("");
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] pb-10 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[40px] border border-white/80 bg-white/70 shadow-[0_20px_80px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] opacity-60" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[8%] top-[-12%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/80 blur-[105px]" />
            <div className="absolute right-[-8%] top-[12%] h-[420px] w-[420px] rounded-full bg-[#D9EAFF]/80 blur-[105px]" />
            <div className="absolute bottom-[-14%] left-[35%] h-[320px] w-[320px] rounded-full bg-white/80 blur-[90px]" />
          </div>

          <div className="relative z-10 px-6 py-16 md:px-12 lg:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              {/* LEFT CONTENT */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  LIÊN HỆ CHRONOFLOW
                </div>

                <h2 className="mb-5 text-[clamp(2.35rem,4vw,4rem)] font-[900] leading-[1.02] tracking-tight text-[#1A1528]">
                  Bạn cần{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent drop-shadow-sm">
                    hỗ trợ ?
                  </span>
                </h2>

                <p className="mb-8 max-w-[540px] text-[16px] font-medium leading-relaxed text-[#5B566E] md:text-[17px]">
                  Gửi thông tin cho ChronoFlow nếu bạn cần tư vấn về chronotype,
                  cách lập kế hoạch theo nhịp năng lượng, tài khoản sử dụng hoặc
                  bộ Chrono Planner Kit.
                </p>

                

                <div className="mt-8 flex w-full max-w-[540px] flex-col gap-3 lg:max-w-none">
                  <a href="mailto:chronoflowvn@gmail.com">
                    <ContactLine
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value="chronoflowvn@gmail.com"
                      helper="Bấm để gửi email"
                    />
                  </a>

                  <a href="tel:0812467168">
                    <ContactLine
                      icon={<Phone className="h-4 w-4" />}
                      label="Hotline"
                      value="0812467168"
                      helper="Bấm để gọi trực tiếp"
                    />
                  </a>

                  <ContactLine
                    icon={<MessageCircle className="h-4 w-4" />}
                    label="Instagram / TikTok"
                    value="@chronoflow.app"
                    helper="Theo dõi cập nhật mới nhất"
                  />
                </div>
              </div>

              {/* RIGHT FORM */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-[#6F59FF]/18 via-white/40 to-[#4DA8FF]/16 blur-2xl" />

                <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/82 p-5 shadow-[0_24px_70px_rgba(26,21,40,0.10)] backdrop-blur-2xl md:p-6 lg:p-7">
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#F3F0FF]" />
                  <div className="absolute bottom-0 left-0 h-28 w-28 rounded-tr-full bg-[#EEF7FF]" />

                  <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                        <Send className="h-4 w-4" />
                        Form hỗ trợ
                      </div>
                      <h3 className="text-[24px] font-[900] leading-tight text-[#1A1528] md:text-[28px]">
                        Gửi yêu cầu của bạn
                      </h3>
                      <p className="mt-2 max-w-[460px] text-[13.5px] font-medium leading-relaxed text-[#6C6780]">
                        Điền vài thông tin cơ bản, ChronoFlow sẽ gửi email xác nhận
                        về hòm thư hỗ trợ.
                      </p>
                    </div>

                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1A1528] text-white shadow-[0_14px_28px_rgba(26,21,40,0.18)] sm:flex">
                      <User className="h-5 w-5" />
                    </div>
                  </div>

                  {isSuccess ? (
                    <div className="relative z-10 rounded-[26px] border border-[#DDFBEA] bg-[#ECFDF5] p-6 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                        <CheckCircle2 className="h-7 w-7 text-[#10B981]" />
                      </div>

                      <h4 className="text-[22px] font-[900] text-[#1A1528]">
                        Đã gửi email thành công!
                      </h4>

                      <p className="mx-auto mt-2 max-w-[420px] text-[14px] font-medium leading-relaxed text-[#5B566E]">
                        Cảm ơn bạn đã liên hệ với ChronoFlow. Yêu cầu đã được gửi
                        về hòm thư hỗ trợ của tụi mình.
                      </p>

                      <button
                        type="button"
                        onClick={resetForm}
                        className="mt-6 rounded-[18px] bg-[#1A1528] px-5 py-3 text-[14px] font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black"
                      >
                        Gửi yêu cầu khác
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                      {status === "error" && (
                        <div className="flex items-start gap-3 rounded-[18px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-left">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />
                          <p className="text-[13px] font-semibold leading-relaxed text-[#991B1B]">
                            {errorMessage}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FieldGroup label="Họ và tên">
                          <input
                            required
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Nhập tên của bạn"
                            className="h-13 w-full rounded-[18px] border border-[#E8E5F3] bg-white/80 px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition-all placeholder:text-[#A5A0B8] focus:border-[#6F59FF]/50 focus:ring-4 focus:ring-[#6F59FF]/10"
                          />
                        </FieldGroup>

                        <FieldGroup label="Email">
                          <input
                            required
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="h-13 w-full rounded-[18px] border border-[#E8E5F3] bg-white/80 px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition-all placeholder:text-[#A5A0B8] focus:border-[#6F59FF]/50 focus:ring-4 focus:ring-[#6F59FF]/10"
                          />
                        </FieldGroup>
                      </div>

                      <FieldGroup label="Số điện thoại">
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Ví dụ: 0812467168"
                          className="h-13 w-full rounded-[18px] border border-[#E8E5F3] bg-white/80 px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition-all placeholder:text-[#A5A0B8] focus:border-[#6F59FF]/50 focus:ring-4 focus:ring-[#6F59FF]/10"
                        />
                      </FieldGroup>

                      <FieldGroup label="Bạn cần hỗ trợ về vấn đề gì?">
                        <select
                          name="topic"
                          value={form.topic}
                          onChange={handleChange}
                          className="h-13 w-full rounded-[18px] border border-[#E8E5F3] bg-white/80 px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition-all focus:border-[#6F59FF]/50 focus:ring-4 focus:ring-[#6F59FF]/10"
                        >
                          <option>Tư vấn sử dụng ChronoFlow</option>
                          <option>Khám phá chronotype cá nhân</option>
                          <option>Hỗ trợ tài khoản / đăng nhập</option>
                          <option>Thông tin về Chrono Planner Kit</option>
                          <option>Hợp tác / truyền thông</option>
                          <option>Khác</option>
                        </select>
                      </FieldGroup>

                      <FieldGroup label="Nội dung cần hỗ trợ">
                        <textarea
                          required
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Mô tả ngắn gọn điều bạn cần ChronoFlow hỗ trợ..."
                          rows={5}
                          className="w-full resize-none rounded-[20px] border border-[#E8E5F3] bg-white/80 px-4 py-3 text-[14px] font-semibold leading-relaxed text-[#1A1528] outline-none transition-all placeholder:text-[#A5A0B8] focus:border-[#6F59FF]/50 focus:ring-4 focus:ring-[#6F59FF]/10"
                        />
                      </FieldGroup>

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-[330px] text-[11.5px] font-medium leading-relaxed text-[#7A748E]">
                          Bằng cách gửi form, bạn đồng ý để ChronoFlow liên hệ lại
                          qua email hoặc số điện thoại nhằm hỗ trợ yêu cầu của bạn.
                        </p>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="group relative flex min-h-[56px] items-center justify-center gap-3 overflow-hidden rounded-[20px] bg-[#1A1528] px-7 text-[15px] font-black text-white shadow-[0_16px_30px_rgba(26,21,40,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-[0_22px_44px_rgba(111,89,255,0.22)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                          {isLoading ? (
                            <>
                              <Loader2 className="relative z-10 h-4.5 w-4.5 animate-spin" />
                              <span className="relative z-10">Đang gửi...</span>
                            </>
                          ) : (
                            <>
                              <span className="relative z-10">Gửi yêu cầu</span>
                              <ArrowRight className="relative z-10 h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[12px] font-bold text-[#6C6780]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                    Không cần đăng nhập
                  </span>
                  <span className="hidden h-1 w-1 rounded-full bg-[#B8B2CC] sm:block" />
                  <Link
                    href="/assessment"
                    className="group flex items-center gap-1.5 text-[#6F59FF] transition-colors hover:text-[#4DA8FF]"
                  >
                    Hoặc làm bài test chronotype
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.12em] text-[#6C6780]">
        {label}
      </span>
      {children}
    </label>
  );
}

function SupportCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/75 bg-white/62 p-4 text-left shadow-[0_12px_28px_rgba(26,21,40,0.05)] backdrop-blur-xl">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
        {icon}
      </div>
      <div className="text-[13px] font-[900] text-[#1A1528]">{title}</div>
      <div className="mt-1 text-[11.5px] font-medium leading-relaxed text-[#7A748E]">
        {desc}
      </div>
    </div>
  );
}

function ContactLine({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-[18px] border border-white/70 bg-white/55 px-4 py-3 shadow-[0_10px_24px_rgba(26,21,40,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm transition-colors group-hover:bg-[#F3F0FF]">
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
          {label}
        </div>
        <div className="text-[13px] font-[900] text-[#1A1528]">{value}</div>
        <div className="mt-0.5 text-[10.5px] font-semibold text-[#8A84A3]">
          {helper}
        </div>
      </div>
    </div>
  );
}