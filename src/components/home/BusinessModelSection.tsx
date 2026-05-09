"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Crown, FileText, Package, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    badge: "Bắt đầu miễn phí",
    price: "0đ",
    period: "mãi mãi",
    desc: "Làm bài đánh giá chronotype, xem kết quả và thử planner cơ bản.",
    href: "/assessment",
    cta: "Bắt đầu miễn phí",
    icon: BadgeCheck,
    featured: false,
    features: [
      "Bài đánh giá chronotype",
      "Kết quả nhịp năng lượng",
      "Planner cơ bản",
    ],
  },
  {
    name: "Plus",
    badge: "Phổ biến",
    price: "29.000đ",
    period: "/ tháng",
    desc: "Phù hợp khi bạn muốn duy trì lịch học/làm đều hơn mỗi tuần.",
    href: "/checkout?plan=plus",
    cta: "Dùng thử Plus",
    icon: Crown,
    featured: true,
    features: [
      "Tất cả tính năng Free",
      "Phân tích tuần",
      "Lịch sử phiên tập trung",
      "Gợi ý cá nhân hóa",
    ],
  },
  {
    name: "Pro",
    badge: "Phân tích sâu",
    price: "59.000đ",
    period: "/ tháng",
    desc: "Dành cho người cần báo cáo đầy đủ và phân tích pattern chi tiết hơn.",
    href: "/checkout?plan=pro",
    cta: "Dùng thử Pro",
    icon: FileText,
    featured: false,
    features: [
      "Tất cả tính năng Plus",
      "Báo cáo đầy đủ dạng PDF",
      "Phân tích energy curve theo tuần/tháng",
      "Gợi ý điều chỉnh lịch chi tiết",
    ],
  },
];

export default function BusinessModelSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#F4F2FA] px-4 py-8 font-sans text-[#1A1528] lg:px-8">
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/76 px-5 py-12 shadow-[0_24px_80px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:px-10 md:py-16">
          <div className="pointer-events-none absolute left-[-8%] top-[-20%] h-[360px] w-[360px] rounded-full bg-[#DCCEFF]/65 blur-[115px]" />
          <div className="pointer-events-none absolute right-[-8%] top-[20%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/65 blur-[115px]" />

          <div className="relative z-10 mx-auto mb-10 max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Gói sử dụng
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
              Chọn gói phù hợp với{" "}
              <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                nhịp học và làm việc của bạn.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-[680px] text-[15px] font-semibold leading-8 text-[#5B566E]">
              Bắt đầu miễn phí, nâng cấp khi bạn cần phân tích sâu hơn.
            </p>
          </div>

          <div className="relative z-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;

              return (
                <article
                  key={plan.name}
                  className={`rounded-[30px] border p-6 shadow-[0_18px_48px_rgba(26,21,40,0.055)] ${
                    plan.featured
                      ? "border-[#DCD5FF] bg-[linear-gradient(180deg,#F5F2FF_0%,#FFFFFF_100%)] ring-2 ring-[#6F59FF]/10"
                      : "border-white/85 bg-white/86"
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="grid h-13 w-13 place-items-center rounded-[20px] bg-[#F3F0FF] text-[#6F59FF]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-[#6F59FF]">
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-[24px] font-[900] text-[#1A1528]">
                    {plan.name}
                  </h3>
                  <p className="mt-2 min-h-[58px] text-[14px] font-semibold leading-7 text-[#5B566E]">
                    {plan.desc}
                  </p>

                  <div className="my-6 flex items-end gap-1">
                    <span className="text-[38px] font-[900] leading-none text-[#1A1528]">
                      {plan.price}
                    </span>
                    <span className="pb-1 text-[13px] font-bold text-[#8A84A3]">
                      {plan.period}
                    </span>
                  </div>

                  <Link
                    href={plan.href}
                    className={`group mb-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-[13px] font-black shadow-lg transition hover:-translate-y-0.5 ${
                      plan.featured
                        ? "bg-[#6F59FF] text-white hover:bg-[#5B46F0]"
                        : "bg-[#1A1528] text-white hover:bg-black"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>

                  <div className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <FeatureRow key={feature}>{feature}</FeatureRow>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="relative z-10 mt-6 rounded-[30px] border border-[#EAE8F7] bg-white/86 p-6 shadow-[0_18px_48px_rgba(26,21,40,0.045)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.13em] text-[#6F59FF]">
                  <Package className="h-3.5 w-3.5" />
                  Planner Kit tùy chọn
                </div>
                <h3 className="text-[24px] font-[900] tracking-tight text-[#1A1528]">
                  Mang kế hoạch ra khỏi màn hình.
                </h3>
                <p className="mt-2 max-w-[720px] text-[14px] font-semibold leading-7 text-[#5B566E]">
                  Planner, energy cards và reflection sheets giúp bạn nhìn lại
                  nhịp học/làm mỗi tuần mà không cần mở app liên tục.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/checkout?product=planner-kit"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Mua Planner Kit
                  <ArrowRight className="h-4 w-4 text-[#4DA8FF]" />
                </Link>
                <Link
                  href="/kit"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-[#EAE8F7] bg-white px-5 text-[13px] font-black text-[#1A1528] transition hover:-translate-y-0.5"
                >
                  Xem chi tiết Kit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-[#EAE8F7] bg-white/74 px-3.5 py-3 text-[13px] font-bold leading-6 text-[#5B566E]">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6F59FF]" />
      <span>{children}</span>
    </div>
  );
}
