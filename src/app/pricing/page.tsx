import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Check,
  Clock3,
  Crown,
  Gift,
  HelpCircle,
  LockKeyhole,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  WalletCards,
  Waves,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type BillingPlan = {
  key: string;
  name: string;
  eyebrow: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  href: string;
  badge?: string;
  highlighted?: boolean;
  icon: React.ReactNode;
  features: string[];
  bestFor: string;
};

type ProductItem = {
  key: string;
  name: string;
  price: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  features: string[];
};

const plans: BillingPlan[] = [
  {
    key: "free",
    name: "Free",
    eyebrow: "Bắt đầu",
    price: "0đ",
    period: "dùng cơ bản",
    description:
      "Phù hợp để khám phá chronotype, hiểu nhịp năng lượng và thử cách lập kế hoạch theo ChronoFlow.",
    href: "/assessment",
    icon: <Sparkles className="h-5 w-5" />,
    bestFor: "Học sinh/sinh viên mới thử ChronoFlow",
    features: [
      "Làm bài đánh giá chronotype",
      "Xem kết quả Lion, Bear, Wolf hoặc Dolphin",
      "Truy cập dashboard cơ bản",
      "Tạo task và planner cá nhân",
      "Xem gợi ý nhịp năng lượng tham khảo",
    ],
  },
  {
    key: "plus",
    name: "Plus",
    eyebrow: "Phổ biến nhất",
    price: "49.000đ",
    originalPrice: "79.000đ",
    period: "tháng",
    description:
      "Dành cho người muốn dùng ChronoFlow hằng ngày để sắp task, giữ focus và cải thiện nhịp học/làm việc.",
    href: "/checkout?plan=plus",
    badge: "Khuyên dùng",
    highlighted: true,
    icon: <Crown className="h-5 w-5" />,
    bestFor: "Người học/làm việc cần planner thông minh",
    features: [
      "Tất cả tính năng Free",
      "Smart Planner theo peak focus window",
      "Gợi ý task nên dời lịch",
      "Cảnh báo quá tải trong ngày",
      "Theo dõi focus session và năng lượng",
      "Chrono AI Coach hỏi đáp theo context",
      "Weekly insight cá nhân hóa",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    eyebrow: "Nâng cao",
    price: "99.000đ",
    originalPrice: "149.000đ",
    period: "tháng",
    description:
      "Phù hợp với user muốn theo dõi sâu hơn: insight, rhythm, productivity pattern và báo cáo tiến độ.",
    href: "/checkout?plan=pro",
    icon: <BarChart3 className="h-5 w-5" />,
    bestFor: "Sinh viên, creator, knowledge worker cần insight sâu",
    features: [
      "Tất cả tính năng Plus",
      "Advanced Insights theo tuần",
      "Phân tích peak vs off-peak",
      "Energy-focus correlation",
      "Deadline risk detection",
      "Lịch sử focus và check-in chi tiết",
      "Ưu tiên các tính năng beta mới",
    ],
  },
];

const products: ProductItem[] = [
  {
    key: "planner-kit",
    name: "ChronoFlow Planner Kit",
    price: "129.000đ",
    description:
      "Bộ planner vật lý/digital giúp user áp dụng chronotype vào kế hoạch học tập và làm việc ngoài app.",
    href: "/checkout?product=planner-kit",
    icon: <Package className="h-5 w-5" />,
    features: [
      "Template lập kế hoạch theo peak focus",
      "Weekly rhythm review",
      "Task prioritization worksheet",
      "Recovery checklist",
    ],
  },
];

const comparisonRows = [
  {
    label: "Chronotype assessment",
    free: true,
    plus: true,
    pro: true,
  },
  {
    label: "Planner theo task cá nhân",
    free: true,
    plus: true,
    pro: true,
  },
  {
    label: "Smart scheduling theo peak window",
    free: false,
    plus: true,
    pro: true,
  },
  {
    label: "Chrono AI Coach",
    free: false,
    plus: true,
    pro: true,
  },
  {
    label: "Advanced rhythm analytics",
    free: false,
    plus: false,
    pro: true,
  },
  {
    label: "Weekly insight nâng cao",
    free: false,
    plus: true,
    pro: true,
  },
  {
    label: "Deadline risk & overload warning",
    free: false,
    plus: true,
    pro: true,
  },
];

const faqs = [
  {
    question: "ChronoFlow khác gì to-do app bình thường?",
    answer:
      "To-do app thường chỉ hỏi bạn cần làm gì. ChronoFlow giúp bạn hiểu nên làm việc đó vào thời điểm nào dựa trên chronotype, nhịp năng lượng, deadline và loại task.",
  },
  {
    question: "Thanh toán xong có được kích hoạt tự động không?",
    answer:
      "ChronoFlow đang nâng cấp flow xác nhận tự động qua Bank QR. Trong giai đoạn đầu, một số giao dịch có thể cần vài phút để hệ thống ghi nhận.",
  },
  {
    question: "Có thể dùng Free trước không?",
    answer:
      "Có. Bạn có thể bắt đầu bằng bài đánh giá chronotype miễn phí, sau đó nâng cấp khi muốn dùng các tính năng planner và insight sâu hơn.",
  },
  {
    question: "Chrono AI Coach có thay thế tư vấn y tế không?",
    answer:
      "Không. Chrono AI Coach chỉ hỗ trợ lập kế hoạch, quản lý task và gợi ý nhịp học/làm việc. Nó không chẩn đoán hoặc thay thế tư vấn y tế.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F2FA] text-[#1A1528]">
      <Navbar variant="guest" />
      <BackgroundGlow />

      <section className="relative z-10 px-4 pb-10 pt-24 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="relative overflow-hidden rounded-[44px] border border-white bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#FFFFFF_100%)] px-5 py-12 shadow-[0_30px_100px_rgba(26,21,40,0.08)] md:px-10 md:py-16">
            <SoftDots />
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/55 blur-[90px]" />
            <div className="pointer-events-none absolute bottom-[-150px] left-[20%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/55 blur-[110px]" />

            <div className="relative mx-auto max-w-[880px] text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_12px_28px_rgba(111,89,255,0.1)] backdrop-blur-xl">
                <WalletCards className="h-3.5 w-3.5" />
                ChronoFlow Pricing
              </div>

              <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-[900] leading-[0.98] tracking-tight text-[#1A1528]">
                Chọn gói phù hợp với{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  nhịp năng lượng
                </span>{" "}
                của bạn.
              </h1>

              <p className="mx-auto mt-6 max-w-[740px] text-[15px] font-medium leading-[1.85] text-[#5B566E] md:text-[17px]">
                Bắt đầu miễn phí với chronotype assessment, sau đó nâng cấp khi
                bạn muốn planner thông minh hơn, insight sâu hơn và Chrono AI
                Coach đồng hành trong lịch học/làm việc mỗi ngày.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <TrustPill icon={<ShieldCheck className="h-4 w-4" />}>
                  Thanh toán bảo mật
                </TrustPill>
                <TrustPill icon={<Clock3 className="h-4 w-4" />}>
                  Bank QR tự động xác nhận
                </TrustPill>
                <TrustPill icon={<Sparkles className="h-4 w-4" />}>
                  Có thể bắt đầu miễn phí
                </TrustPill>
              </div>
            </div>
          </div>

          <section className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.key} plan={plan} />
            ))}
          </section>

          <section className="mt-8 overflow-hidden rounded-[36px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8E2FF] bg-[#F7F4FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF]">
                  <Gift className="h-3.5 w-3.5" />
                  Planner Kit
                </div>

                <h2 className="text-[clamp(1.8rem,3vw,3rem)] font-[900] leading-tight tracking-tight">
                  Muốn học/làm việc theo nhịp cả khi rời khỏi app?
                </h2>

                <p className="mt-4 max-w-xl text-[14px] font-medium leading-[1.85] text-[#615C7A] md:text-[15px]">
                  ChronoFlow Planner Kit giúp bạn biến peak focus, recovery và
                  weekly rhythm thành template dễ dùng cho việc học, làm đồ án,
                  ôn thi hoặc quản lý dự án cá nhân.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-1">
                {products.map((product) => (
                  <ProductCard key={product.key} product={product} />
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[36px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(247,248,255,0.72)_100%)] p-5 shadow-[0_24px_70px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:p-8">
            <SectionHeading
              eyebrow="So sánh nhanh"
              title="Gói nào hợp với bạn?"
              description="Nếu bạn chỉ muốn khám phá chronotype, Free là đủ. Nếu bạn muốn dùng ChronoFlow mỗi ngày, Plus là lựa chọn cân bằng nhất. Nếu cần analytics sâu, chọn Pro."
            />

            <div className="mt-8 overflow-hidden rounded-[28px] border border-[#EAE8F7] bg-white">
              <div className="grid grid-cols-[1.25fr_0.7fr_0.7fr_0.7fr] border-b border-[#EAE8F7] bg-[#F8F6FF] text-[12px] font-black uppercase tracking-[0.12em] text-[#6F59FF]">
                <div className="p-4">Tính năng</div>
                <div className="p-4 text-center">Free</div>
                <div className="p-4 text-center">Plus</div>
                <div className="p-4 text-center">Pro</div>
              </div>

              {comparisonRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1.25fr_0.7fr_0.7fr_0.7fr] border-b border-[#F0EDF8] last:border-b-0"
                >
                  <div className="p-4 text-sm font-bold text-[#312B45]">
                    {row.label}
                  </div>
                  <CompareCell enabled={row.free} />
                  <CompareCell enabled={row.plus} />
                  <CompareCell enabled={row.pro} />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[36px] border border-white/80 bg-[#1A1528] p-6 text-white shadow-[0_24px_70px_rgba(26,21,40,0.12)] md:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#A9D8FF]">
                <Brain className="h-6 w-6" />
              </div>

              <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-[900] leading-tight">
                Pricing không chỉ là gói tính năng.
              </h2>

              <p className="mt-4 text-[14px] font-medium leading-[1.85] text-white/72 md:text-[15px]">
                Mục tiêu của ChronoFlow là giúp user đi từ “mình có quá nhiều
                việc” sang “mình biết việc nào nên làm vào đúng thời điểm năng
                lượng nhất”.
              </p>

              <div className="mt-6 grid gap-3">
                <DarkPoint icon={<Timer className="h-4 w-4" />}>
                  Plus giúp bạn duy trì planner hằng ngày.
                </DarkPoint>
                <DarkPoint icon={<BarChart3 className="h-4 w-4" />}>
                  Pro giúp bạn hiểu pattern dài hạn.
                </DarkPoint>
                <DarkPoint icon={<Waves className="h-4 w-4" />}>
                  Planner Kit giúp bạn áp dụng nhịp này ngoài app.
                </DarkPoint>
              </div>
            </div>

            <div className="rounded-[36px] border border-white/80 bg-white/84 p-6 shadow-[0_24px_70px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:p-8">
              <SectionHeading
                eyebrow="FAQ"
                title="Câu hỏi thường gặp"
                description="Một vài câu hỏi nhanh trước khi bạn chọn gói."
                align="left"
              />

              <div className="mt-6 space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-[24px] border border-[#EAE8F7] bg-[#FBFAFF] p-4"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F59FF] shadow-sm">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-[900] text-[#1A1528]">
                          {faq.question}
                        </h3>
                        <p className="mt-2 text-[13px] font-medium leading-6 text-[#615C7A]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-[40px] border border-white bg-[linear-gradient(135deg,#F2EDFF_0%,#EAF4FF_48%,#FFFFFF_100%)] p-6 text-center shadow-[0_30px_100px_rgba(26,21,40,0.07)] md:p-10">
            <div className="mx-auto max-w-[760px]">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[22px] bg-white text-[#6F59FF] shadow-[0_14px_34px_rgba(111,89,255,0.12)]">
                <Star className="h-6 w-6" />
              </div>

              <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-[900] leading-tight tracking-tight">
                Bắt đầu từ nhịp của bạn.
              </h2>

              <p className="mx-auto mt-4 max-w-[620px] text-[15px] font-medium leading-[1.8] text-[#5B566E]">
                Làm bài đánh giá miễn phí trước, sau đó ChronoFlow sẽ giúp bạn
                chọn cách lập kế hoạch phù hợp hơn với năng lượng cá nhân.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/assessment"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Test ChronoFlow miễn phí
                  <ArrowRight className="h-4 w-4 text-[#4DA8FF]" />
                </Link>

                <Link
                  href="/checkout?plan=plus"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#DCD7FF] bg-white px-6 text-sm font-black text-[#1A1528] shadow-sm transition hover:-translate-y-0.5 hover:border-[#B8AAFF]"
                >
                  Chọn Plus
                  <Crown className="h-4 w-4 text-[#6F59FF]" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PricingCard({ plan }: { plan: BillingPlan }) {
  return (
    <article
      className={`relative overflow-hidden rounded-[34px] border p-6 shadow-[0_22px_60px_rgba(26,21,40,0.055)] backdrop-blur-2xl transition hover:-translate-y-1 md:p-7 ${
        plan.highlighted
          ? "border-[#BEB4FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#F5F1FF_100%)] shadow-[0_28px_80px_rgba(111,89,255,0.16)]"
          : "border-white/80 bg-white/82"
      }`}
    >
      {plan.highlighted ? (
        <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_28px_rgba(111,89,255,0.22)]">
          {plan.badge}
        </div>
      ) : null}

      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
          plan.highlighted
            ? "bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white"
            : "bg-[#F3F0FF] text-[#6F59FF]"
        }`}
      >
        {plan.icon}
      </div>

      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF]">
        {plan.eyebrow}
      </div>

      <h2 className="mt-2 text-3xl font-[900] tracking-tight">{plan.name}</h2>

      <p className="mt-3 min-h-[72px] text-[14px] font-medium leading-7 text-[#615C7A]">
        {plan.description}
      </p>

      <div className="mt-6 flex items-end gap-2">
        <div className="text-[2.4rem] font-[900] leading-none tracking-tight">
          {plan.price}
        </div>
        <div className="pb-1 text-sm font-bold text-[#8A84A3]">
          / {plan.period}
        </div>
      </div>

      {plan.originalPrice ? (
        <div className="mt-2 text-sm font-bold text-[#A29BB6]">
          Giá gốc{" "}
          <span className="line-through">{plan.originalPrice}</span>
        </div>
      ) : (
        <div className="mt-2 text-sm font-bold text-[#A29BB6]">
          Không cần thẻ thanh toán
        </div>
      )}

      <Link
        href={plan.href}
        className={`mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black shadow-xl transition hover:-translate-y-0.5 ${
          plan.highlighted
            ? "bg-[#1A1528] text-white hover:bg-black"
            : "border border-[#E5DEFF] bg-white text-[#1A1528] hover:border-[#B8AAFF]"
        }`}
      >
        {plan.key === "free" ? "Bắt đầu miễn phí" : "Chọn gói này"}
        <ArrowRight
          className={`h-4 w-4 ${
            plan.highlighted ? "text-[#4DA8FF]" : "text-[#6F59FF]"
          }`}
        />
      </Link>

      <div className="mt-6 rounded-[24px] border border-[#EAE8F7] bg-[#FBFAFF]/80 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          <BadgeCheck className="h-4 w-4 text-[#6F59FF]" />
          Phù hợp với
        </div>
        <p className="text-sm font-bold leading-6 text-[#312B45]">
          {plan.bestFor}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <FeatureLine key={feature}>{feature}</FeatureLine>
        ))}
      </div>
    </article>
  );
}

function ProductCard({ product }: { product: ProductItem }) {
  return (
    <article className="rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(135deg,#FFFFFF_0%,#F8F6FF_100%)] p-5 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white">
            {product.icon}
          </div>

          <div>
            <h3 className="text-xl font-[900] text-[#1A1528]">
              {product.name}
            </h3>
            <p className="mt-2 max-w-xl text-sm font-medium leading-7 text-[#615C7A]">
              {product.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-left md:text-right">
          <div className="text-3xl font-[900]">{product.price}</div>
          <Link
            href={product.href}
            className="mt-3 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
          >
            Mua Planner Kit
            <ArrowRight className="h-4 w-4 text-[#4DA8FF]" />
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {product.features.map((feature) => (
          <FeatureLine key={feature}>{feature}</FeatureLine>
        ))}
      </div>
    </article>
  );
}

function FeatureLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm font-semibold leading-6 text-[#4F4A68]">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
        <Check className="h-3.5 w-3.5" />
      </span>
      <span>{children}</span>
    </div>
  );
}

function CompareCell({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex items-center justify-center p-4">
      {enabled ? (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
          <Check className="h-4 w-4" />
        </span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[#C8C2D8]" />
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-[760px] text-center"
          : "max-w-[720px] text-left"
      }
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8E2FF] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>

      <h2 className="text-[clamp(1.7rem,3vw,2.6rem)] font-[900] leading-tight tracking-tight">
        {title}
      </h2>

      <p className="mt-4 text-[14px] font-medium leading-[1.8] text-[#615C7A] md:text-[15px]">
        {description}
      </p>
    </div>
  );
}

function TrustPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-bold text-[#4F4A68] shadow-sm backdrop-blur-xl">
      <span className="text-[#6F59FF]">{icon}</span>
      {children}
    </div>
  );
}

function DarkPoint({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-[22px] border border-white/10 bg-white/[0.06] p-4 text-sm font-semibold leading-6 text-white/78">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#A9D8FF]">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute left-[8%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/60 blur-[110px]" />
      <div className="absolute right-[-6%] top-[12%] h-[320px] w-[320px] rounded-full bg-[#D9EAFF]/60 blur-[110px]" />
      <div className="absolute bottom-[-18%] left-[28%] h-[520px] w-[520px] rounded-full bg-white/70 blur-[120px]" />
    </div>
  );
}

function SoftDots() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-30">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 1.2px, transparent 1.2px)",
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  );
}