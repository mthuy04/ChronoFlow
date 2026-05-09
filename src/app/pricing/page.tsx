"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Coins,
  Crown,
  Download,
  FileText,
  Gift,
  HelpCircle,
  MoonStar,
  Package,
  Play,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
  type LucideIcon,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTASection from "@/components/home/FinalCTASection";

type Plan = {
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  icon: LucideIcon;
  href: string;
  cta: string;
  trial?: string;
  featured?: boolean;
  gradient: string;
  accentText: string;
  cardGradient: string;
  border: string;
  bestFor: string;
  features: string[];
};

type Note = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const gradientText =
  "bg-gradient-to-r from-[#6F59FF] via-[#6B7CFF] to-[#4DA8FF] bg-clip-text text-transparent";

const plans: Plan[] = [
  {
    name: "Free",
    badge: "Bắt đầu miễn phí",
    price: "0đ",
    period: "mãi mãi",
    description:
      "Phù hợp để làm bài test chronotype và thử lập lịch theo nhịp năng lượng cá nhân.",
    icon: BadgeCheck,
    href: "/assessment",
    cta: "Bắt đầu miễn phí",
    gradient: "from-[#6F59FF] to-[#8B5CF6]",
    accentText: "text-[#6F59FF]",
    cardGradient: "from-[#F8F7FF] via-[#FFFFFF] to-[#F4F7FF]",
    border: "border-[#E5DEFF]",
    bestFor: "Người mới muốn hiểu chronotype và thử planner cơ bản.",
    features: [
      "Làm bài test chronotype cơ bản",
      "Xem kết quả nhóm nhịp năng lượng",
      "Dashboard ngày đơn giản",
      "Tạo task và gắn loại năng lượng",
      "Tích coin giới hạn mỗi ngày",
    ],
  },
  {
    name: "Plus",
    badge: "Phổ biến nhất",
    price: "29.000đ",
    period: "/ tháng",
    description:
      "Dành cho học sinh, sinh viên và người mới đi làm muốn duy trì lịch học/làm đều hơn.",
    icon: Crown,
    href: "/checkout?plan=plus",
    cta: "Dùng thử Plus",
    trial: "7 ngày dùng thử",
    featured: true,
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    accentText: "text-[#F59E0B]",
    cardGradient: "from-[#FFF7ED] via-[#FFFFFF] to-[#FFF4DB]",
    border: "border-[#FFE6C7]",
    bestFor: "User muốn dùng ChronoFlow hằng ngày để giữ nhịp học/làm việc.",
    features: [
      "Tất cả tính năng của Free",
      "Phân tích tuần theo nhịp năng lượng",
      "Lịch sử phiên tập trung",
      "Gợi ý việc sâu, việc nhẹ và hồi phục",
      "Chuỗi duy trì và huy hiệu thói quen",
      "Chrono AI Coach hỏi đáp theo context",
    ],
  },
  {
    name: "Pro",
    badge: "Phân tích chuyên sâu",
    price: "59.000đ",
    period: "/ tháng",
    description:
      "Dành cho người muốn xem báo cáo đầy đủ, tải PDF và nhận gợi ý cá nhân hóa rõ ràng hơn.",
    icon: FileText,
    href: "/checkout?plan=pro",
    cta: "Dùng thử Pro",
    trial: "7 ngày dùng thử",
    gradient: "from-[#4DA8FF] to-[#38BDF8]",
    accentText: "text-[#4DA8FF]",
    cardGradient: "from-[#F0F8FF] via-[#FFFFFF] to-[#EAF5FF]",
    border: "border-[#C7E0FF]",
    bestFor: "User cần insight sâu, báo cáo đầy đủ và phân tích dài hạn.",
    features: [
      "Tất cả tính năng của Plus",
      "Báo cáo chronotype đầy đủ",
      "Báo cáo đầy đủ dạng PDF",
      "Gợi ý cá nhân hóa nâng cao",
      "Phân tích đường năng lượng theo tuần/tháng",
      "Gợi ý điều chỉnh lịch học/làm chi tiết",
    ],
  },
];

const kitFeatures = [
  "Chrono Planner theo tuần",
  "Thẻ năng lượng",
  "Phiếu nhìn lại",
  "Theo dõi thói quen & tập trung",
  "Sticker ghi chú năng lượng",
  "Hướng dẫn dùng cùng web app",
];

const comparisonRows = [
  { feature: "Bài test chronotype", free: true, plus: true, pro: true },
  { feature: "Dashboard ngày", free: true, plus: true, pro: true },
  { feature: "Task planner cơ bản", free: true, plus: true, pro: true },
  {
    feature: "Phân tích tuần theo năng lượng",
    free: false,
    plus: true,
    pro: true,
  },
  {
    feature: "Lịch sử focus session",
    free: false,
    plus: true,
    pro: true,
  },
  { feature: "Chrono AI Coach", free: false, plus: true, pro: true },
  {
    feature: "Báo cáo đầy đủ dạng PDF",
    free: false,
    plus: false,
    pro: true,
  },
  {
    feature: "Phân tích tuần/tháng nâng cao",
    free: false,
    plus: false,
    pro: true,
  },
];

const notes: Note[] = [
  {
    icon: Gift,
    title: "Dùng thử trước khi trả phí",
    description:
      "Plus và Pro đều có 7 ngày dùng thử để user kiểm tra có hợp với workflow của mình không.",
  },
  {
    icon: Download,
    title: "Pro dành cho báo cáo đầy đủ",
    description:
      "Phù hợp khi user cần PDF, phân tích dài hạn và gợi ý cá nhân hóa chi tiết hơn.",
  },
  {
    icon: Coins,
    title: "Coin dùng để đổi ưu đãi",
    description:
      "Coin tích từ phiên tập trung có thể dùng để đổi ưu đãi hoặc Planner Kit.",
  },
];

const faqs = [
  {
    question: "Nên chọn Plus hay Pro?",
    answer:
      "Plus hợp với đa số user muốn dùng planner hằng ngày. Pro phù hợp hơn nếu bạn cần báo cáo đầy đủ, phân tích tuần/tháng và gợi ý cá nhân hóa sâu.",
  },
  {
    question: "Free có đủ để bắt đầu không?",
    answer:
      "Có. Free đủ để làm bài test chronotype, xem kết quả và thử cách lập kế hoạch theo năng lượng trước khi nâng cấp.",
  },
  {
    question: "Planner Kit có bắt buộc không?",
    answer:
      "Không. Planner Kit là tùy chọn cho người muốn mang kế hoạch ra khỏi màn hình bằng planner, thẻ năng lượng và phiếu nhìn lại.",
  },
  {
    question: "Thanh toán ngân hàng có tự xác nhận không?",
    answer:
      "ChronoFlow đang nâng cấp Bank QR tự động xác nhận qua SePay webhook. Khi hệ thống nhận đúng chuyển khoản, đơn sẽ được ghi nhận tự động.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <main className="relative flex flex-col gap-12 overflow-hidden bg-slate-50 pb-28 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <PageBackground />

        <section className="relative z-10 px-4 pb-2 pt-0 lg:px-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
              <div className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0)_30%),radial-gradient(circle_at_82%_16%,rgba(77,168,255,0.28)_0%,rgba(77,168,255,0)_34%),linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
                <FloatingDots />

                <div className="relative z-30 mx-auto max-w-4xl text-center">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Gói sử dụng
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="mb-4 text-[clamp(2.35rem,4vw,4rem)] font-[950] leading-[1.02] tracking-[-0.045em] text-[#1A1528]"
                  >
                    Gói sử dụng rõ ràng,{" "}
                    <br className="hidden sm:block" />
                    <span className={gradientText}>
                      bắt đầu theo nhịp của bạn.
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    className="mx-auto mb-8 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]"
                  >
                    Bắt đầu miễn phí với bài test chronotype, dùng thử Plus/Pro
                    trong 7 ngày và chỉ nâng cấp khi bạn thật sự cần planner
                    thông minh hơn, insight sâu hơn hoặc báo cáo đầy đủ hơn.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.22 }}
                    className="mb-8 flex flex-wrap items-center justify-center gap-3"
                  >
                    <Link
                      href="/assessment"
                      className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                    >
                      <BookOpen className="h-4 w-4 text-[#4DA8FF]" />
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                          BẮT ĐẦU
                        </span>
                        <span className="text-[14px] font-bold leading-tight">
                          Test miễn phí
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="#plans"
                      className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                        <Play className="ml-0.5 h-3 w-3 fill-[#6F59FF] text-[#6F59FF]" />
                      </div>
                      <span className="text-[14px] font-bold leading-tight">
                        Xem các gói
                      </span>
                    </Link>
                  </motion.div>
                </div>

                <div className="relative mx-auto mt-4 h-[340px] w-full max-w-[780px] perspective-[1400px] sm:h-[380px]">
                  <div className="absolute left-[4%] top-[10%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                    <FloatPill
                      icon={<MoonStar className="h-3.5 w-3.5" />}
                      label="Free assessment"
                      tint="purple"
                    />
                  </div>

                  <div className="absolute right-[4%] top-[8%] z-40 hidden animate-[bounce_4.6s_infinite] sm:block">
                    <FloatPill
                      icon={<WalletCards className="h-3.5 w-3.5" />}
                      label="Bank QR"
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
                    className="absolute left-[3%] top-10 z-20 w-[190px] rounded-[32px] shadow-2xl sm:left-[6%] sm:w-[220px]"
                  >
                    <PricingMiniCard plan={plans[0]} />
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
                    className="absolute left-1/2 top-0 z-30 w-[230px] -translate-x-1/2 rounded-[38px] shadow-[0_45px_90px_rgba(26,21,40,0.24)] sm:w-[260px]"
                  >
                    <PricingMiniCard plan={plans[1]} featured />
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
                    className="absolute right-[3%] top-10 z-20 w-[190px] rounded-[32px] shadow-2xl sm:right-[6%] sm:w-[220px]"
                  >
                    <PricingMiniCard plan={plans[2]} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] space-y-12 px-4 lg:px-8">
          <SectionWrapper id="plans">
            <SectionHeading
              eyebrow="Subscription"
              titleStart="Bắt đầu miễn phí,"
              titleHighlight="nâng cấp khi cần."
              description="Free giúp bạn khám phá chronotype. Plus phù hợp để duy trì planner hằng ngày. Pro dành cho người cần báo cáo, dữ liệu và gợi ý cá nhân hóa sâu hơn."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <PlanCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="planner-kit">
            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                  <Package className="h-3.5 w-3.5" />
                  Planner Kit tùy chọn
                </div>

                <h2 className="max-w-[780px] text-[clamp(2.2rem,4vw,3.6rem)] font-[950] leading-[1.06] tracking-[-0.04em] text-[#1A1528]">
                  Mang kế hoạch{" "}
                  <span className={gradientText}>ra khỏi màn hình.</span>
                </h2>

                <p className="mt-5 max-w-[58ch] text-[1rem] leading-8 text-[#615C7A]">
                  Chrono Planner Kit gồm planner, thẻ năng lượng và phiếu nhìn
                  lại để bạn duy trì thói quen lập kế hoạch ngoài đời thực.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <PriceBox eyebrow="Giá launch" value="199.000đ" tone="gold" />
                  <PriceBox
                    eyebrow="Hoặc đổi bằng"
                    value="2.000 coin"
                    tone="purple"
                    coin
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/checkout?product=planner-kit"
                    className="group flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
                  >
                    Mua Planner Kit
                    <ArrowRight className="h-4 w-4 text-[#FBBF24] transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/rewards"
                    className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#FFE6C7] bg-[#FFF7ED] px-5 text-[13px] font-bold text-[#F59E0B] transition hover:-translate-y-0.5"
                  >
                    <CoinIcon />
                    Đổi bằng coin
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {kitFeatures.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                  >
                    <InsightBox
                      title={item}
                      text="Giúp bạn duy trì thói quen lập kế hoạch theo năng lượng ngay cả khi không mở web app."
                      icon={<CheckCircle2 className="h-4 w-4 text-[#10B981]" />}
                      bg="bg-[#ECFDF5]"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="compare">
            <SectionHeading
              eyebrow="So sánh nhanh"
              titleStart="Chọn gói theo"
              titleHighlight="nhu cầu của bạn"
              description="Nếu chỉ muốn khám phá chronotype, Free là đủ. Nếu dùng hằng ngày, Plus cân bằng nhất. Nếu cần báo cáo sâu, chọn Pro."
            />

            <div className="mt-14 overflow-hidden rounded-[28px] border border-[#ECE8FF] bg-[#FCFBFF] shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
              <div className="grid grid-cols-[1.18fr_0.58fr_0.58fr_0.58fr] border-b border-[#EAE8F7] bg-[#F8F6FF] text-[11px] font-black uppercase tracking-[0.12em] text-[#6F59FF]">
                <div className="p-4">Tính năng</div>
                <div className="p-4 text-center">Free</div>
                <div className="p-4 text-center">Plus</div>
                <div className="p-4 text-center">Pro</div>
              </div>

              {comparisonRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[1.18fr_0.58fr_0.58fr_0.58fr] border-b border-[#F0EDF8] last:border-b-0"
                >
                  <div className="p-4 text-[13px] font-bold leading-6 text-[#312B45]">
                    {row.feature}
                  </div>
                  <CompareCell enabled={row.free} />
                  <CompareCell enabled={row.plus} />
                  <CompareCell enabled={row.pro} />
                </div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="notes">
            <SectionHeading
              eyebrow="Điểm cần biết"
              titleStart="Dùng thử dễ dàng,"
              titleHighlight="quyết định sau."
              description="Các gói trả phí có thể thử trước, hiểu rõ giá trị trước khi quyết định nâng cấp."
            />

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {notes.map((note, index) => {
                const Icon = note.icon;

                return (
                  <motion.div
                    key={note.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    className="rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
                      <Icon className="h-5 w-5 text-[#6F59FF]" />
                    </div>
                    <h3 className="text-[1.08rem] font-black tracking-tight text-[#241F3D]">
                      {note.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
                      {note.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </SectionWrapper>

          <SectionWrapper id="faq">
            <SectionHeading
              eyebrow="FAQ"
              titleStart="Một vài câu hỏi"
              titleHighlight="trước khi chọn gói."
              description="Pricing của ChronoFlow được giữ đơn giản để user dễ hiểu: bắt đầu miễn phí, nâng cấp khi cần duy trì hoặc phân tích sâu hơn."
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-[1.05rem] font-black tracking-tight text-[#241F3D]">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        </div>

        <div className="relative z-10">
          <FinalCTASection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const Icon = plan.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`group relative flex flex-col rounded-[32px] border ${plan.border} bg-gradient-to-br ${plan.cardGradient} p-[1px] transition-all duration-300 hover:shadow-[0_25px_50px_rgba(26,21,40,0.08)] ${
        plan.featured ? "shadow-[0_25px_60px_rgba(245,158,11,0.14)]" : ""
      }`}
    >
      <div className="h-full rounded-[31px] bg-white/88 p-6 backdrop-blur-xl">
        {plan.featured ? (
          <div className="absolute right-5 top-5 rounded-full bg-[#F59E0B] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-md">
            Phổ biến nhất
          </div>
        ) : null}

        <div className="mb-5 flex items-center justify-between">
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-gradient-to-br ${plan.gradient} text-white shadow-[0_10px_24px_rgba(26,21,40,0.08)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#7A70A0]">
            {plan.badge}
          </div>
        </div>

        <h3
          className={`text-[28px] font-[900] leading-tight tracking-tight ${plan.accentText}`}
        >
          {plan.name}
        </h3>

        <p className="mt-3 min-h-[76px] text-[14px] font-medium leading-relaxed text-[#5B566E]">
          {plan.description}
        </p>

        <div className="my-6 rounded-[24px] border border-white/80 bg-white/76 p-4 shadow-sm">
          <div className="flex items-end gap-1">
            <span className="text-[38px] font-[900] leading-none tracking-tight text-[#1A1528]">
              {plan.price}
            </span>
            <span className="pb-1 text-[13px] font-bold text-[#8A84A3]">
              {plan.period}
            </span>
          </div>

          {plan.trial ? (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-[11px] font-black text-[#10B981]">
              <Zap className="h-3.5 w-3.5" />
              {plan.trial}
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[11px] font-black text-[#6F59FF]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Bắt đầu ngay
            </div>
          )}
        </div>

        <Link
          href={plan.href}
          className={`group mb-5 flex min-h-[50px] items-center justify-center gap-2 rounded-2xl px-5 text-[13px] font-bold shadow-lg transition hover:-translate-y-0.5 ${
            plan.featured
              ? "bg-[#F59E0B] text-white hover:bg-[#EA8D05]"
              : "bg-[#1A1528] text-white hover:bg-black"
          }`}
        >
          {plan.cta}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>

        <div className="mb-5 rounded-[22px] border border-white/80 bg-white/70 px-4 py-3">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Phù hợp với
          </div>
          <p className="mt-1 text-[13px] font-bold leading-6 text-[#312B45]">
            {plan.bestFor}
          </p>
        </div>

        <div className="space-y-2.5">
          {plan.features.map((feature) => (
            <FeatureRow key={feature}>{feature}</FeatureRow>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function PricingMiniCard({
  plan,
  featured = false,
}: {
  plan: Plan;
  featured?: boolean;
}) {
  const Icon = plan.icon;

  return (
    <div
      className={`rounded-[32px] border border-white/80 bg-white/88 p-4 backdrop-blur-xl ${
        featured ? "scale-105 shadow-[0_25px_60px_rgba(26,21,40,0.18)]" : ""
      }`}
    >
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#7A70A0]">
        {plan.badge}
      </div>

      <h3
        className={`mt-3 text-[22px] font-[900] leading-tight ${plan.accentText}`}
      >
        {plan.name}
      </h3>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-[28px] font-[900] leading-none text-[#1A1528]">
          {plan.price}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-[12px] font-semibold leading-relaxed text-[#5B566E]">
        {plan.description}
      </p>
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
      className="relative overflow-hidden rounded-[40px] border border-white/80 bg-[radial-gradient(circle_at_12%_0%,rgba(220,206,255,0.52)_0%,rgba(220,206,255,0)_34%),radial-gradient(circle_at_92%_12%,rgba(217,234,255,0.52)_0%,rgba(217,234,255,0)_34%),linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(246,247,255,0.66)_100%)] px-6 py-10 shadow-[0_24px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:px-10 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-0 h-[180px] w-[180px] rounded-full bg-white/35 blur-[70px]" />
        <div className="absolute bottom-0 right-[-4%] h-[220px] w-[220px] rounded-full bg-[#D8E8FF]/30 blur-[80px]" />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  titleStart,
  titleHighlight,
  titleEnd,
  description,
}: {
  eyebrow: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd?: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>

      <h2 className="text-[clamp(2.05rem,4vw,3.35rem)] font-[950] leading-[1.06] tracking-[-0.04em] text-[#241F3D]">
        {titleStart}{" "}
        <span className={gradientText}>{titleHighlight}</span>
        {titleEnd ? ` ${titleEnd}` : null}
      </h2>

      <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
        {description}
      </p>
    </div>
  );
}

function InsightBox({
  title,
  text,
  icon,
  bg,
}: {
  title: string;
  text: string;
  icon: ReactNode;
  bg: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
        >
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

function FeatureRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-[#F8F9FE] px-3 py-2.5 text-[12.5px] font-semibold text-[#5B566E]">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
      <span>{children}</span>
    </div>
  );
}

function PriceBox({
  eyebrow,
  value,
  tone,
  coin = false,
}: {
  eyebrow: string;
  value: string;
  tone: "gold" | "purple";
  coin?: boolean;
}) {
  const classes =
    tone === "gold"
      ? "border-[#FFE6C7] bg-[#FFF7ED] text-[#F59E0B]"
      : "border-[#E9E5FF] bg-[#F8F9FE] text-[#6F59FF]";

  return (
    <div className={`rounded-[22px] border px-5 py-4 ${classes}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.14em]">
        {eyebrow}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[24px] font-[900]">
        {coin ? <CoinIcon /> : null}
        {value}
      </div>
    </div>
  );
}

function CompareCell({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex items-center justify-center p-4">
      {enabled ? (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
          <CheckCircle2 className="h-4 w-4" />
        </span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[#C8C2D8]" />
      )}
    </div>
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

function CoinIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-[10px] font-black text-white shadow-[0_6px_14px_rgba(245,158,11,0.28)]">
      ₵
    </span>
  );
}

function PageBackground() {
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

function FloatingDots() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-30">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-white"
          style={{
            top: `${18 + i * 11}%`,
            left: `${12 + (i % 3) * 28}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.4 + i * 0.15,
            repeat: Infinity,
            delay: i * 0.25,
          }}
        />
      ))}
    </div>
  );
}