import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Mail,
  MessageCircleHeart,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const CONTACT_EMAIL = "mthuy04.ai@gmail.com";

const feedbackBenefits = [
  {
    icon: <MessageSquareHeart className="h-5 w-5" />,
    title: "Ghi nhận trải nghiệm thật",
    description:
      "Bạn có thể chia sẻ phần hữu ích, phần chưa rõ và điều ChronoFlow nên cải thiện tiếp.",
    tone: "purple",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Hỗ trợ báo cáo performance",
    description:
      "Feedback giúp ChronoFlow có bằng chứng thực tế cho pitching, cải tiến sản phẩm và phân tích khách hàng.",
    tone: "blue",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Có quyền đồng ý rõ ràng",
    description:
      "Bạn có thể chọn cho phép dùng testimonial hoặc cho phép ChronoFlow liên hệ lại hay không.",
    tone: "green",
  },
];

const processSteps = [
  {
    icon: <Star className="h-4 w-4" />,
    title: "Bạn gửi đánh giá",
    description: "Chấm điểm trải nghiệm và chia sẻ cảm nhận thật.",
  },
  {
    icon: <Mail className="h-4 w-4" />,
    title: "ChronoFlow nhận email",
    description: "Feedback được gửi về email admin qua SMTP.",
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    title: "Đội ngũ tổng hợp",
    description: "Phản hồi được dùng để cải thiện sản phẩm và báo cáo.",
  },
];

export default function FeedbackPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <Navbar />

      <AmbientBackground />

      <section className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-20 pt-28 lg:px-8">
        <div className="overflow-hidden rounded-[42px] border border-white bg-white/72 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[52px]">
          <div className="grid min-h-[720px] lg:grid-cols-[0.95fr_1.05fr]">
            <aside className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-6 py-10 md:px-10 lg:py-14">
              <HeroGlow />

              <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    ChronoFlow Feedback
                  </div>

                  <h1 className="max-w-[760px] text-[clamp(2.25rem,4.4vw,4.5rem)] font-black leading-[1.02] tracking-[-0.055em] text-[#1A1528]">
                    Góp ý để ChronoFlow{" "}
                    <span className="bg-gradient-to-r from-[#6F59FF] via-[#6B6DFF] to-[#4DA8FF] bg-clip-text text-transparent">
                      tốt hơn mỗi ngày.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-[660px] text-[15px] font-medium leading-8 text-[#5B566E] md:text-[16px]">
                    Phản hồi của bạn giúp tụi mình hiểu trải nghiệm thật: điều
                    gì đang hữu ích, điều gì còn gây khó hiểu, và sản phẩm nên
                    ưu tiên cải thiện phần nào tiếp theo.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/dashboard"
                      className="group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[14px] font-black text-white shadow-[0_18px_36px_rgba(23,19,41,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
                    >
                      Mở Dashboard
                      <ArrowRight className="h-4 w-4 text-[#4DA8FF] transition group-hover:translate-x-1" />
                    </Link>

                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/80 bg-white/82 px-6 text-[14px] font-black text-[#241F3D] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <Mail className="h-4 w-4 text-[#6F59FF]" />
                      Email trực tiếp
                    </a>
                  </div>
                </div>

                <div className="grid gap-4">
                  {feedbackBenefits.map((item) => (
                    <BenefitCard
                      key={item.title}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      tone={item.tone}
                    />
                  ))}
                </div>
              </div>
            </aside>

            <section className="relative px-5 py-8 md:px-8 lg:px-10 lg:py-12">
              <div className="pointer-events-none absolute right-8 top-8 hidden rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] lg:block">
                SMTP email enabled
              </div>

              <div className="mx-auto max-w-[720px]">
                <FeedbackForm />

                <div className="mt-8 rounded-[30px] border border-[#E9E5FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FE_100%)] p-5 shadow-[0_18px_45px_rgba(26,21,40,0.05)]">
                  <div className="mb-4 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                    <HeartHandshake className="h-4 w-4" />
                    Sau khi bạn gửi feedback
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {processSteps.map((step, index) => (
                      <ProcessStep
                        key={step.title}
                        index={index + 1}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-[26px] border border-[#DDEEFF] bg-[#EEF6FF]/72 p-5 text-[13px] font-medium leading-7 text-[#4B5F7A]">
                  <div className="mb-2 flex items-center gap-2 font-black text-[#1A1528]">
                    <ShieldCheck className="h-4 w-4 text-[#4DA8FF]" />
                    Ghi chú minh bạch
                  </div>
                  Feedback được dùng để cải thiện ChronoFlow và tổng hợp insight
                  cho báo cáo học phần/pitching. Những phản hồi dùng làm
                  testimonial sẽ chỉ được sử dụng theo lựa chọn đồng ý của bạn.
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute left-[8%] top-[-5%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/60 blur-[110px]" />
      <div className="absolute right-[-8%] top-[12%] h-[380px] w-[380px] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[-16%] left-[32%] h-[520px] w-[520px] rounded-full bg-white/75 blur-[120px]" />
    </div>
  );
}

function HeroGlow() {
  return (
    <>
      <div className="pointer-events-none absolute left-[8%] top-[-16%] h-[360px] w-[360px] rounded-full bg-white/45 blur-[90px]" />
      <div className="pointer-events-none absolute right-[-14%] top-[16%] h-[320px] w-[320px] rounded-full bg-[#D9EAFF]/75 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[24%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/45 blur-[110px]" />
    </>
  );
}

function BenefitCard({
  icon,
  title,
  description,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: string;
}) {
  const style = getToneStyle(tone);

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-[0_16px_40px_rgba(97,76,197,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/82">
      <div className="flex gap-4">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border shadow-sm ${style.icon}`}
        >
          {icon}
        </div>

        <div>
          <div className="text-[15px] font-black text-[#1A1528]">{title}</div>
          <p className="mt-1.5 text-[13px] font-medium leading-7 text-[#5B566E]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({
  index,
  icon,
  title,
  description,
}: {
  index: number;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#EEF0F6] bg-white/82 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
          {icon}
        </div>

        <div className="rounded-full bg-[#1A1528] px-2.5 py-1 text-[10px] font-black text-white">
          0{index}
        </div>
      </div>

      <div className="text-[13px] font-black text-[#1A1528]">{title}</div>
      <p className="mt-1.5 text-[12px] font-medium leading-6 text-[#5B566E]">
        {description}
      </p>
    </div>
  );
}

function getToneStyle(tone: string) {
  const styles: Record<string, { icon: string }> = {
    purple: {
      icon: "border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]",
    },
    blue: {
      icon: "border-[#DDEEFF] bg-[#EEF6FF] text-[#4DA8FF]",
    },
    green: {
      icon: "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]",
    },
  };

  return styles[tone] ?? styles.purple;
}