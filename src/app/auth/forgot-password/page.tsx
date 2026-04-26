"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/layout/Navbar";
import {
  Sparkles,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-[#F4F2FA] text-[#1A1528] selection:bg-[#6F59FF]/20">
      <AuthBackground />
      <Header />

      <section className="relative z-10 px-4 pb-12 pt-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative px-6 py-8 md:px-8 lg:px-10 lg:py-10">
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-[#F8F6FF] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Khôi phục truy cập
                </div>

                <h1 className="mb-3 text-[clamp(2.1rem,4vw,3.3rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                Quên mật khẩu? 

                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  Lấy lại truy cập
                  </span>
                </h1>

                <p className="mb-6 max-w-[540px] text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
                  Nhập email của bạn và chúng tôi sẽ gửi một liên kết đặt lại mật khẩu
                  để bạn lấy lại quyền truy cập vào planner, dashboard và các insight cá nhân.
                </p>

                <div className="mb-6 flex flex-wrap gap-3">
                  <MiniPill icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                    Khôi phục an toàn
                  </MiniPill>
                  <MiniPill icon={<Clock3 className="h-3.5 w-3.5" />}>
                    Lấy lại quyền truy cập nhanh
                  </MiniPill>
                </div>

                {!sent ? (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                  >
                    <InputRow />

                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 py-4 text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-black"
                    >
                      <span className="text-[14px] font-bold">
                        Gửi liên kết đặt lại
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </form>
                ) : (
                  <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-5 text-[14px] leading-7 text-emerald-700">
                    Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Hãy kiểm tra
                    hộp thư đến và làm theo hướng dẫn để tiếp tục.
                  </div>
                )}

                <p className="pt-6 text-center text-sm text-[#7A728F]">
                  Quay lại{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-[#1A1528] hover:underline"
                  >
                    đăng nhập
                  </Link>
                </p>
              </div>

              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 py-8 md:px-8">
                <div className="absolute left-[10%] top-[8%] h-36 w-36 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute right-[8%] top-[20%] h-32 w-32 rounded-full bg-[#D9EAFF]/70 blur-3xl" />

                <div className="relative mx-auto flex h-full max-w-[520px] flex-col justify-center">
                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <FeatureCard
                      title="Khôi phục an toàn"
                      description="Quy trình đặt lại mật khẩu được thiết kế để bảo vệ tài khoản của bạn."
                      icon={<KeyRound className="h-5 w-5 text-[#6F59FF]" />}
                    />
                    <FeatureCard
                      title="Quay lại planner"
                      description="Lấy lại quyền truy cập vào dashboard, planner và insight theo tuần."
                      icon={<Mail className="h-5 w-5 text-[#4DA8FF]" />}
                    />
                  </div>

                  <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(111,89,255,0.10)] backdrop-blur-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
                          Các bước khôi phục
                        </div>
                        <div className="text-[16px] font-[900] text-[#1A1528]">
                          Đơn giản và rõ ràng
                        </div>
                      </div>
                      <div className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[10px] font-bold text-[#6F59FF]">
                        3 bước
                      </div>
                    </div>

                    <div className="space-y-3">
                      <MockRow title="Nhập email của bạn" meta="Dùng email đã đăng ký" done />
                      <MockRow title="Nhận liên kết đặt lại" meta="Kiểm tra inbox hoặc spam" active />
                      <MockRow title="Tạo mật khẩu mới" meta="Quay lại tài khoản của bạn" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <SmallStat value="1 email" label="để lấy lại quyền truy cập" />
                    <SmallStat value="3 bước" label="để quay lại tài khoản của bạn" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InputRow() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-4 shadow-sm">
      <Mail className="h-4 w-4 text-[#8A84A3]" />
      <input
        type="email"
        placeholder="Địa chỉ email"
        className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#AAA1BC]"
      />
    </div>
  );
}

function SimpleNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/80 bg-[#F4F2FA]/80 px-6 py-5 backdrop-blur-md">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="flex w-fit items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#6F59FF]" />
          <span className="text-xl font-[900] tracking-tight text-[#1A1528]">
            ChronoFlow
          </span>
        </Link>
      </div>
    </nav>
  );
}

function AuthBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full">
        <div className="absolute left-[10%] top-[-8%] h-[360px] w-[360px] rounded-full bg-[#DCCEFF]/55 blur-[110px]" />
        <div className="absolute right-[-4%] top-[10%] h-[300px] w-[300px] rounded-full bg-[#D9EAFF]/55 blur-[110px]" />
      </div>
    </>
  );
}

function MiniPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-3 py-2 text-[12px] font-semibold text-[#4F4A68] shadow-sm">
      <span className="text-[#6F59FF]">{icon}</span>
      {children}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF]">
        {icon}
      </div>
      <h3 className="text-[15px] font-[900] text-[#1A1528]">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-[#615C7A]">{description}</p>
    </div>
  );
}

function MockRow({
  title,
  meta,
  done = false,
  active = false,
}: {
  title: string;
  meta: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 transition-all ${
        active
          ? "border-2 border-[#6F59FF] bg-white shadow-[0_10px_20px_rgba(111,89,255,0.1)]"
          : "border border-transparent bg-white/80"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${
            done
              ? "bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white"
              : active
              ? "border-2 border-[#6F59FF] bg-[#F3F0FF]"
              : "border-2 border-gray-200 bg-white"
          }`}
        >
          {done && <CheckCircle2 className="h-3 w-3" />}
        </div>
        <div>
          <div
            className={`text-[13px] font-[900] ${
              active ? "text-[#6F59FF]" : "text-[#1A1528]"
            }`}
          >
            {title}
          </div>
          <div className="text-[11px] font-medium text-gray-500">{meta}</div>
        </div>
      </div>
    </div>
  );
}

function SmallStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-md">
      <div className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-[28px] font-[900] leading-none text-transparent">
        {value}
      </div>
      <div className="mt-1 text-[12px] font-medium text-[#6B6287]">{label}</div>
    </div>
  );
}