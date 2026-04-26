"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Coins,
  Crown,
  Download,
  FileText,
  Gift,
  Package,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    badge: "Bắt đầu miễn phí",
    price: "0đ",
    period: "mãi mãi",
    desc: "Phù hợp để làm bài test chronotype và thử lập lịch theo nhịp năng lượng cá nhân.",
    icon: BadgeCheck,
    gradient: "from-[#6F59FF] to-[#8B5CF6]",
    cta: "Bắt đầu miễn phí",
    href: "/assessment",
    featured: false,
    features: [
      "Làm bài test chronotype cơ bản",
      "Xem kết quả nhóm nhịp năng lượng",
      "Dashboard ngày đơn giản",
      "Tạo task và gắn loại năng lượng",
      "Tích coin giới hạn mỗi ngày",
    ],
    mutedFeatures: [
      "Chưa có weekly insights",
      "Chưa có full report PDF",
      "Chưa có recommendation nâng cao",
    ],
  },
  {
    name: "Plus",
    badge: "Phổ biến nhất",
    price: "29.000đ",
    period: "/ tháng",
    desc: "Dành cho học sinh, sinh viên và người mới đi làm muốn duy trì lịch học/làm đều hơn.",
    icon: Crown,
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    cta: "Dùng thử Plus",
    href: "/checkout?plan=plus",
    featured: true,
    trial: "7 ngày dùng thử",
    features: [
      "Tất cả tính năng của Free",
      "Weekly insights theo nhịp năng lượng",
      "Lịch sử focus session",
      "Gợi ý deep work, admin, recovery",
      "Coin cap cao hơn mỗi ngày",
      "Streak và badge duy trì thói quen",
    ],
    mutedFeatures: ["Chưa có full report PDF", "Recommendation chưa chuyên sâu"],
  },
  {
    name: "Pro",
    badge: "Phân tích chuyên sâu",
    price: "59.000đ",
    period: "/ tháng",
    desc: "Dành cho người muốn xem báo cáo đầy đủ, tải report và nhận recommendation rõ ràng hơn.",
    icon: FileText,
    gradient: "from-[#4DA8FF] to-[#38BDF8]",
    cta: "Dùng thử Pro",
    href: "/checkout?plan=pro",
    featured: false,
    trial: "7 ngày dùng thử",
    features: [
      "Tất cả tính năng của Plus",
      "Full Chronotype Report",
      "Tải báo cáo PDF",
      "Recommendation cá nhân hóa nâng cao",
      "Phân tích energy curve theo tuần/tháng",
      "Gợi ý điều chỉnh lịch học/làm chi tiết",
    ],
    mutedFeatures: [],
  },
];

const kitFeatures = [
  "Chrono Planner theo tuần",
  "Energy Cards",
  "Reflection Sheets",
  "Habit & Focus Tracker",
  "Sticker ghi chú năng lượng",
  "Hướng dẫn dùng cùng web app",
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#F4F2FA] py-8 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[40px] border border-white bg-white/75 px-5 py-14 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-20">
          <BackgroundGlow />

          <div className="relative z-10">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)]">
                <Sparkles className="h-3.5 w-3.5" />
                Pricing
              </div>

              <h2 className="mb-4 text-[clamp(2.2rem,4.4vw,3.55rem)] font-[900] leading-[1.04] tracking-[-0.04em] text-[#1A1528]">
                Chọn gói phù hợp với{" "}
                <br/>
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  nhịp học và làm việc của bạn.
                </span>
              </h2>

              <p className="mx-auto max-w-[740px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                Bắt đầu miễn phí, dùng thử Plus/Pro trong 7 ngày và chỉ nâng cấp khi
                bạn thật sự cần insight sâu hơn, báo cáo đầy đủ hoặc recommendation cá nhân hóa.
              </p>
            </div>

            <div className="mb-7 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => {
                const Icon = plan.icon;

                return (
                  <div
                    key={plan.name}
                    className={`relative overflow-hidden rounded-[34px] border p-5 shadow-[0_20px_55px_rgba(26,21,40,0.055)] ${
                      plan.featured
                        ? "border-[#FFE6C7] bg-[linear-gradient(180deg,#FFF7ED_0%,#FFFFFF_100%)] ring-2 ring-[#F59E0B]/15"
                        : "border-white bg-white"
                    }`}
                  >
                    {plan.featured && (
                      <div className="absolute right-5 top-5 rounded-full bg-[#F59E0B] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-md">
                        Best value
                      </div>
                    )}

                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${plan.gradient} text-white shadow-[0_16px_30px_rgba(26,21,40,0.14)]`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="mb-3 inline-flex rounded-full bg-[#F8F9FE] px-3 py-1.5 text-[10px] font-[900] uppercase tracking-[0.13em] text-[#6F59FF]">
                      {plan.badge}
                    </div>

                    <h3 className="text-[24px] font-[900] leading-tight text-[#1A1528]">
                      {plan.name}
                    </h3>

                    <p className="mt-2 min-h-[58px] text-[13.5px] font-semibold leading-relaxed text-[#5B566E]">
                      {plan.desc}
                    </p>

                    <div className="my-6">
                      <div className="flex items-end gap-1">
                        <span className="text-[36px] font-[900] leading-none text-[#1A1528]">
                          {plan.price}
                        </span>
                        <span className="pb-1 text-[13px] font-bold text-[#8A84A3]">
                          {plan.period}
                        </span>
                      </div>

                      {plan.trial && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[11px] font-black text-[#10B981]">
                          <Zap className="h-3.5 w-3.5" />
                          {plan.trial}
                        </div>
                      )}
                    </div>

                    <Link
                      href={plan.href}
                      className={`group mb-6 flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 text-[13px] font-bold shadow-lg transition hover:-translate-y-0.5 ${
                        plan.featured
                          ? "bg-[#F59E0B] text-white hover:bg-[#EA8D05]"
                          : "bg-[#1A1528] text-white hover:bg-black"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>

                    <div className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <FeatureRow key={feature} active>
                          {feature}
                        </FeatureRow>
                      ))}

                      {plan.mutedFeatures.map((feature) => (
                        <FeatureRow key={feature} active={false}>
                          {feature}
                        </FeatureRow>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[34px] border border-[#E9E5FF] bg-white p-6 shadow-[0_20px_55px_rgba(26,21,40,0.055)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[11px] font-[900] uppercase tracking-[0.13em] text-[#6F59FF]">
                    <Package className="h-3.5 w-3.5" />
                    Planner Kit Add-on
                  </div>

                  <h3 className="text-[26px] font-[900] leading-tight tracking-[-0.03em] text-[#1A1528]">
                    Mang kế hoạch ra khỏi màn hình.
                  </h3>

                  <p className="mt-2 max-w-[720px] text-[14px] font-semibold leading-relaxed text-[#5B566E]">
                    Chrono Planner Kit gồm planner, energy cards và reflection sheets
                    để bạn duy trì thói quen lập kế hoạch ngoài đời thực.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:shrink-0">
                  <div className="rounded-[22px] border border-[#FFE6C7] bg-[#FFF7ED] px-5 py-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#F59E0B]">
                      Giá launch
                    </div>
                    <div className="mt-1 text-[24px] font-[900] text-[#F59E0B]">
                      199.000đ
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-[#E9E5FF] bg-[#F8F9FE] px-5 py-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                      Hoặc đổi bằng
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[24px] font-[900] text-[#6F59FF]">
                      <CoinIcon />
                      2.000 coin
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {kitFeatures.slice(0, 3).map((item) => (
                  <FeatureRow key={item} active>
                    {item}
                  </FeatureRow>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/checkout?product=planner-kit"
                  className="group flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Mua Planner Kit
                  <ArrowRight className="h-4 w-4 text-[#FBBF24] transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/rewards"
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-[#FFE6C7] bg-[#FFF7ED] px-5 text-[13px] font-bold text-[#F59E0B] transition hover:-translate-y-0.5"
                >
                  <CoinIcon />
                  Đổi bằng coin
                </Link>
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <MiniNote
                icon={<Gift className="h-4 w-4" />}
                title="Dùng thử trước khi trả phí"
                desc="Plus và Pro đều có 7 ngày dùng thử để người dùng kiểm tra có hợp với workflow của mình không."
              />
              <MiniNote
                icon={<Download className="h-4 w-4" />}
                title="Pro có full report"
                desc="Gói Pro phù hợp khi người dùng cần tải báo cáo PDF và nhận recommendation chi tiết hơn."
              />
              <MiniNote
                icon={<Coins className="h-4 w-4" />}
                title="Coin có giá trị thật"
                desc="Coin tích từ focus session có thể dùng để đổi ưu đãi hoặc Planner Kit."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute left-[6%] top-[8%] h-[320px] w-[320px] rounded-full bg-[#DCCEFF]/70 blur-[100px]" />
      <div className="absolute right-[4%] top-[20%] h-[300px] w-[300px] rounded-full bg-[#FFE3B3]/55 blur-[90px]" />
      <div className="absolute bottom-[-18%] left-[35%] h-[460px] w-[460px] rounded-full bg-white/65 blur-[100px]" />
    </div>
  );
}

function FeatureRow({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-2 rounded-2xl px-3 py-2.5 text-[12.5px] font-semibold ${
        active ? "bg-[#F8F9FE] text-[#5B566E]" : "bg-[#F8F9FE]/60 text-[#A1A7B8]"
      }`}
    >
      <CheckCircle2
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          active ? "text-[#10B981]" : "text-[#CBD5E1]"
        }`}
      />
      <span>{children}</span>
    </div>
  );
}

function CoinIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-[10px] font-black text-white shadow-[0_6px_14px_rgba(245,158,11,0.28)]">
      ₵
    </span>
  );
}

function MiniNote({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[24px] border border-white bg-white/80 p-5 shadow-[0_14px_36px_rgba(26,21,40,0.04)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
        {icon}
      </div>
      <h4 className="text-[14px] font-[900] text-[#1A1528]">{title}</h4>
      <p className="mt-1.5 text-[12.5px] font-semibold leading-relaxed text-[#6B647C]">
        {desc}
      </p>
    </div>
  );
}