"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  Gift,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

const productImages = [
  {
    src: "/planner-kit/kit-01.jpg",
    alt: "Chrono Planner Kit full set",
    label: "Full Kit",
  },
  {
    src: "/planner-kit/kit-02.jpg",
    alt: "Chrono Planner notebook preview",
    label: "Planner",
  },
  {
    src: "/planner-kit/kit-03.jpg",
    alt: "Energy cards preview",
    label: "Cards",
  },
  {
    src: "/planner-kit/kit-04.jpg",
    alt: "Reflection sheets preview",
    label: "Sheets",
  },
];

const kitIncludes = [
  "01 Chrono Planner theo tuần",
  "01 bộ Energy Cards",
  "Reflection sheets",
  "Habit & focus tracker",
  "Sticker ghi chú năng lượng",
  "Hướng dẫn sử dụng cùng web app",
];

const exchangeOptions = [
  {
    title: "Energy Card Pack",
    coins: "500 coin",
    price: "59.000đ",
    desc: "Bộ thẻ gợi ý chọn việc theo trạng thái năng lượng.",
  },
  {
    title: "Chrono Planner",
    coins: "1.000 coin",
    price: "129.000đ",
    desc: "Sổ planner vật lý để lập kế hoạch theo nhịp cá nhân.",
  },
  {
    title: "Full Planner Kit",
    coins: "2.000 coin",
    price: "199.000đ",
    desc: "Combo đầy đủ: planner, cards, sheets và sticker.",
    active: true,
  },
];

export default function RewardKitSection() {
  const [activeImage, setActiveImage] = useState(0);

  const currentImage = useMemo(
    () => productImages[activeImage] ?? productImages[0],
    [activeImage]
  );

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  return (
    <section
      id="reward-kit"
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
                Planner Kit Preview
              </div>

              <h2 className="mb-4 text-[clamp(2.2rem,4.4vw,3.55rem)] font-[900] leading-[1.04] tracking-[-0.04em]">
                Coin trong app có thể đổi thành{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  phần thưởng ngoài đời.
                </span>
              </h2>

              <p className="mx-auto max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                Chrono Planner Kit giúp nối trải nghiệm web app với thói quen vật lý:
                lập kế hoạch, theo dõi năng lượng, reflection và duy trì focus mỗi ngày.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              {/* Product gallery */}
              <div className="relative overflow-hidden rounded-[36px] border border-white bg-white p-4 shadow-[0_24px_70px_rgba(26,21,40,0.08)] md:p-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-[#EEF0F6] bg-[linear-gradient(135deg,#F8F9FE_0%,#EEF6FF_100%)]">
                  <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#DCCEFF]/70 blur-[70px]" />
                    <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#FFE3B3]/60 blur-[80px]" />
                  </div>

                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="relative z-10 h-full w-full object-cover"
                  />

                  <div className="absolute left-4 top-4 z-20 rounded-full border border-white bg-white/90 px-3 py-1.5 text-[11px] font-[900] uppercase tracking-[0.12em] text-[#6F59FF] shadow-sm backdrop-blur-md">
                    {currentImage.label}
                  </div>

                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/90 text-[#1A1528] shadow-lg transition hover:-translate-x-0.5"
                    aria-label="Previous product image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/90 text-[#1A1528] shadow-lg transition hover:translate-x-0.5"
                    aria-label="Next product image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-[18px] border p-1 transition ${
                        activeImage === index
                          ? "border-[#6F59FF] bg-[#F3F0FF] shadow-[0_12px_28px_rgba(111,89,255,0.16)]"
                          : "border-[#EEF0F6] bg-white hover:border-[#DCD7FF]"
                      }`}
                    >
                      <div className="aspect-square overflow-hidden rounded-[14px] bg-[#F8F9FE]">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <TrustBadge icon={<Truck className="h-4 w-4" />} text="Nhận tại trường / ship" />
                  <TrustBadge icon={<ShieldCheck className="h-4 w-4" />} text="Có thể đổi bằng coin" />
                  <TrustBadge icon={<Gift className="h-4 w-4" />} text="Hợp MVP demo" />
                </div>
              </div>

              {/* Product info */}
              <div className="space-y-4">
                <div className="rounded-[36px] border border-white bg-white p-6 shadow-[0_24px_70px_rgba(26,21,40,0.08)]">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7ED] px-3 py-1.5 text-[11px] font-[900] uppercase tracking-[0.12em] text-[#F59E0B]">
                      <BadgePercent className="h-3.5 w-3.5" />
                      Launch offer
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[11px] font-[900] uppercase tracking-[0.12em] text-[#6F59FF]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Physical reward
                    </span>
                  </div>

                  <h3 className="text-[28px] font-[900] leading-tight tracking-[-0.03em] text-[#1A1528] md:text-[34px]">
                    Chrono Planner Kit
                  </h3>

                  <p className="mt-3 max-w-[620px] text-[14.5px] font-semibold leading-relaxed text-[#5B566E]">
                    Bộ kit vật lý giúp người dùng áp dụng ChronoFlow ngoài đời:
                    lên kế hoạch theo energy map, chọn đúng loại việc và reflection sau mỗi tuần.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[13px] font-bold text-[#8A84A3]">
                      4.9/5 · Demo product · Dành cho MVP
                    </span>
                  </div>

                  <div className="mt-6 rounded-[28px] border border-[#FFE6C7] bg-[linear-gradient(135deg,#FFF7ED_0%,#FFFFFF_100%)] p-5">
                    <div className="mb-2 text-[11px] font-[900] uppercase tracking-[0.14em] text-[#F59E0B]">
                      Giá dự kiến
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                      <div className="text-[34px] font-[900] leading-none text-[#F59E0B]">
                        199.000đ
                      </div>
                      <div className="pb-1 text-[15px] font-bold text-[#A1A7B8] line-through">
                        249.000đ
                      </div>
                      <div className="mb-1 rounded-full bg-[#EF4444] px-2.5 py-1 text-[11px] font-black text-white">
                        -20%
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-[22px] border border-white bg-white p-4 shadow-sm">
                        <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                          Mua trực tiếp
                        </div>
                        <div className="text-[20px] font-[900] text-[#1A1528]">
                          199.000đ
                        </div>
                      </div>

                      <div className="rounded-[22px] border border-[#FFE6C7] bg-white p-4 shadow-sm">
                        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                          <Coins className="h-3.5 w-3.5 text-[#F59E0B]" />
                          Đổi bằng coin
                        </div>
                        <div className="flex items-center gap-2 text-[20px] font-[900] text-[#F59E0B]">
                          <CoinIcon />
                          2.000 coin
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {kitIncludes.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 rounded-[18px] border border-[#EEF0F6] bg-[#F8F9FE] px-3 py-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                        <span className="text-[13px] font-bold leading-relaxed text-[#5B566E]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3.5 text-[13.5px] font-bold text-white shadow-xl transition hover:-translate-y-0.5">
                      Mua Planner Kit
                      <ArrowRight className="h-4 w-4 text-[#FBBF24] transition group-hover:translate-x-1" />
                    </button>

                    <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FFE6C7] bg-[#FFF7ED] px-5 py-3.5 text-[13.5px] font-bold text-[#F59E0B] transition hover:-translate-y-0.5">
                      <CoinIcon />
                      Đổi 2.000 coin
                    </button>
                  </div>
                </div>

                <div className="grid gap-3">
                  {exchangeOptions.map((item) => (
                    <ExchangeCard key={item.title} {...item} />
                  ))}
                </div>
              </div>
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

function CoinIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-[10px] font-black text-white shadow-[0_6px_14px_rgba(245,158,11,0.28)]">
      ₵
    </span>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[18px] border border-[#EEF0F6] bg-[#F8F9FE] px-3 py-3 text-[12px] font-bold text-[#5B566E]">
      <span className="text-[#6F59FF]">{icon}</span>
      {text}
    </div>
  );
}

function ExchangeCard({
  title,
  coins,
  price,
  desc,
  active,
}: {
  title: string;
  coins: string;
  price: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border bg-white p-4 shadow-[0_14px_36px_rgba(26,21,40,0.04)] ${
        active ? "border-[#FFE6C7]" : "border-[#EEF0F6]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-[15px] font-[900] text-[#1A1528]">{title}</h4>
          <p className="mt-1 text-[12.5px] font-semibold leading-relaxed text-[#6B647C]">
            {desc}
          </p>
        </div>

        {active && (
          <span className="shrink-0 rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#F59E0B]">
            Best value
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-[#FFF7ED] px-3 py-1.5 text-[12px] font-black text-[#F59E0B]">
          <CoinIcon />
          {coins}
        </div>

        <div className="rounded-full bg-[#F8F9FE] px-3 py-1.5 text-[12px] font-black text-[#6B647C]">
          hoặc {price}
        </div>
      </div>
    </div>
  );
}