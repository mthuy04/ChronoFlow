"use client";

import Link from "next/link";
import React, { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTASection from "@/components/home/FinalCTASection";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarCheck2,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Coins,
  FileText,
  Gift,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  Mail,
  MoonStar,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";

type FeatureKey =
  | "chronotype"
  | "energy"
  | "schedule"
  | "dashboard"
  | "focus"
  | "kit"
  | "learn"
  | "report";

type Tone = "purple" | "blue" | "orange" | "green" | "pink" | "dark";

type Feature = {
  key: FeatureKey;
  title: string;
  shortTitle: string;
  description: string;
  value: string;
  icon: ReactNode;
  tone: Tone;
  bullets: string[];
};

const coreFeatures: Feature[] = [
  {
    key: "chronotype",
    title: "Chronotype Test",
    shortTitle: "Đánh giá nhịp sinh học",
    description:
      "Bài đánh giá ngắn giúp xác định kiểu nhịp năng lượng dựa trên thói quen ngủ, thời điểm tỉnh táo và cách bạn duy trì tập trung trong ngày.",
    value: "~3 phút",
    icon: <Brain className="h-5 w-5" />,
    tone: "purple",
    bullets: ["Câu hỏi ngắn", "Kết quả cá nhân hóa", "Dễ làm lại"],
  },
  {
    key: "energy",
    title: "Energy Map",
    shortTitle: "Biểu đồ năng lượng",
    description:
      "Hiển thị đường năng lượng trong ngày để bạn biết lúc nào nên học sâu, lúc nào nên xử lý việc nhẹ và lúc nào nên giảm tải.",
    value: "24h view",
    icon: <BarChart3 className="h-5 w-5" />,
    tone: "blue",
    bullets: ["Peak focus", "Low energy", "Recovery"],
  },
  {
    key: "schedule",
    title: "Smart Scheduling",
    shortTitle: "Lịch gợi ý thông minh",
    description:
      "Chuyển insight về năng lượng thành timeline thực tế, giúp bạn đặt deep work, admin task, creative work và recovery đúng thời điểm hơn.",
    value: "4 khối",
    icon: <CalendarClock className="h-5 w-5" />,
    tone: "orange",
    bullets: ["Deep work", "Admin task", "Recovery"],
  },
  {
    key: "dashboard",
    title: "Daily Dashboard",
    shortTitle: "Dashboard theo dõi",
    description:
      "Một màn hình tổng quan để xem chronotype, energy map, lịch hôm nay, focus session và các gợi ý quan trọng trong ngày.",
    value: "1 nơi",
    icon: <LayoutDashboard className="h-5 w-5" />,
    tone: "green",
    bullets: ["Tổng quan ngày", "Task blocks", "Gợi ý"],
  },
  {
    key: "focus",
    title: "Focus Mode & Coin",
    shortTitle: "Tập trung thật, nhận coin",
    description:
      "Người dùng bắt đầu phiên tập trung theo task thật. Coin được tính dựa trên thời lượng focus, loại task và giới hạn chống spam.",
    value: "+coin",
    icon: <Coins className="h-5 w-5" />,
    tone: "pink",
    bullets: ["Focus timer", "Daily cap", "Streak"],
  },
  {
    key: "kit",
    title: "Planner Kit Reward",
    shortTitle: "Đổi ưu đãi Planner Kit",
    description:
      "Coin trong app kết nối với sản phẩm vật lý: card, planner, reflection sheet hoặc ưu đãi mua Chrono Planner Kit.",
    value: "2000 coin",
    icon: <Gift className="h-5 w-5" />,
    tone: "green",
    bullets: ["Energy cards", "Planner", "Full kit"],
  },
  {
    key: "learn",
    title: "Learning Hub",
    shortTitle: "Blog, video và tài nguyên",
    description:
      "Không phải lớp học phức tạp. Learning Hub là nơi đọc blog, xem video ngắn và hiểu thêm về chronotype, energy curve, deep work và recovery.",
    value: "Blog / Video",
    icon: <LibraryBig className="h-5 w-5" />,
    tone: "blue",
    bullets: ["Bài đọc ngắn", "Video", "Tips"],
  },
  {
    key: "report",
    title: "Full Report & Recommendation",
    shortTitle: "Báo cáo cá nhân hóa",
    description:
      "Gói nâng cấp có thể mở khóa báo cáo chi tiết hơn: phân tích chronotype, khung giờ đề xuất và recommendation cá nhân hóa để tải về.",
    value: "PDF",
    icon: <FileText className="h-5 w-5" />,
    tone: "dark",
    bullets: ["Full report", "Recommendation", "Tải PDF"],
  },
];

const flowSteps = [
  {
    no: "01",
    title: "Làm bài test",
    text: "Người dùng trả lời vài câu hỏi về giấc ngủ, nhịp sinh hoạt và thời điểm tỉnh táo nhất.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    no: "02",
    title: "Nhận energy map",
    text: "ChronoFlow trả về chronotype, đường năng lượng và các khung giờ nên ưu tiên.",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    no: "03",
    title: "Xếp lịch thông minh",
    text: "Task được gợi ý vào đúng khung: deep work, admin, creative hoặc recovery.",
    icon: <CalendarCheck2 className="h-5 w-5" />,
  },
  {
    no: "04",
    title: "Focus và nhận coin",
    text: "Người dùng chạy focus session thật để tích coin, giữ streak và mở ưu đãi Planner Kit.",
    icon: <Coins className="h-5 w-5" />,
  },
];

const outputCards = [
  {
    title: "Hiểu rõ nhịp cá nhân",
    description:
      "Biết mình thường mạnh vào khung giờ nào thay vì ép bản thân theo một lịch chung.",
    icon: <MoonStar className="h-5 w-5 text-[#6F59FF]" />,
    tone: "purple" as Tone,
  },
  {
    title: "Lịch làm việc bớt quá tải",
    description:
      "Việc khó, việc nhẹ và nghỉ ngắn được đặt vào khung hợp lý hơn với năng lượng thật.",
    icon: <CalendarClock className="h-5 w-5 text-[#4DA8FF]" />,
    tone: "blue" as Tone,
  },
  {
    title: "Duy trì thói quen tốt hơn",
    description:
      "Focus session, streak và coin giúp việc lập kế hoạch có phản hồi thay vì chỉ tick task.",
    icon: <Timer className="h-5 w-5 text-[#F59E0B]" />,
    tone: "orange" as Tone,
  },
  {
    title: "Kết nối app với Planner Kit",
    description:
      "Coin và reward làm cho bộ kit vật lý có vai trò trong hành trình sử dụng hằng ngày.",
    icon: <Gift className="h-5 w-5 text-[#10B981]" />,
    tone: "green" as Tone,
  },
];

const useCases = [
  {
    title: "Học sinh, sinh viên",
    description:
      "Sắp xếp deadline, ôn thi, học sâu và bài tập nhóm theo khung năng lượng phù hợp.",
    icon: <GraduationCap className="h-5 w-5 text-[#6F59FF]" />,
    label: "Study rhythm",
    tone: "purple" as Tone,
  },
  {
    title: "Người đi làm",
    description:
      "Bảo vệ khung deep work, dồn email/admin vào thời điểm nhẹ hơn và giảm cảm giác bị vỡ lịch.",
    icon: <Mail className="h-5 w-5 text-[#4DA8FF]" />,
    label: "Workday flow",
    tone: "blue" as Tone,
  },
  {
    title: "Người làm giáo dục",
    description:
      "Cân bằng lịch dạy, soạn bài, chấm bài, nghiên cứu và thời gian phục hồi cá nhân.",
    icon: <LibraryBig className="h-5 w-5 text-[#F59E0B]" />,
    label: "Teaching balance",
    tone: "orange" as Tone,
  },
  {
    title: "Người tối ưu lịch cá nhân",
    description:
      "Freelancer, creator hoặc người tự học có thể tự thiết kế ngày làm việc theo năng lượng.",
    icon: <Target className="h-5 w-5 text-[#10B981]" />,
    label: "Personal flow",
    tone: "green" as Tone,
  },
];

const compareColumns = [
  {
    title: "To-do list / Calendar",
    badge: "Ghi việc",
    points: [
      "Lưu task, deadline và lịch hẹn",
      "Tập trung vào việc cần làm",
      "Ít quan tâm người dùng đang có năng lượng thế nào",
      "Dễ khiến việc khó bị đẩy vào lúc đã mệt",
    ],
    highlight: false,
  },
  {
    title: "ChronoFlow",
    badge: "Đúng việc, đúng lúc",
    points: [
      "Hiểu chronotype và energy curve cá nhân",
      "Gợi ý thời điểm phù hợp cho từng loại task",
      "Kết hợp focus session, coin và reward loop",
      "Hướng tới hiệu suất bền vững, không chỉ bận hơn",
    ],
    highlight: true,
  },
];

const faqs = [
  {
    q: "ChronoFlow có những tính năng chính nào?",
    a: "Các tính năng chính gồm Chronotype Test, Energy Map, Smart Scheduling, Daily Dashboard, Focus Mode & Coin, Planner Kit Reward, Learning Hub và Full Report.",
  },
  {
    q: "Tính năng nào là cốt lõi nhất?",
    a: "Cốt lõi là Chronotype Test, Energy Map và Smart Scheduling. Đây là ba phần giúp người dùng hiểu nhịp năng lượng và chuyển insight thành lịch làm việc thực tế.",
  },
  {
    q: "ChronoFlow có thay thế hoàn toàn lịch hoặc to-do list không?",
    a: "Không nhất thiết. ChronoFlow bổ sung một lớp thông minh: giúp người dùng biết nên đặt loại việc nào vào khung giờ nào dựa trên năng lượng cá nhân.",
  },
  {
    q: "Coin và Planner Kit có vai trò gì?",
    a: "Coin tạo động lực cho focus session thật, còn Planner Kit biến reward trong app thành trải nghiệm vật lý, giúp người dùng duy trì thói quen ngoài đời.",
  },
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] =
    useState<FeatureKey>("chronotype");

  const active = useMemo(
    () =>
      coreFeatures.find((item) => item.key === activeFeature) ??
      coreFeatures[0],
    [activeFeature]
  );

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-[#F4F2FA] pb-24 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <BackgroundPattern />

        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 lg:px-8">
          <HeroSection />

          <SectionWrapper id="core-features">
            <SectionHeading
              eyebrow="Tính năng chính"
              title={
                <>
                  Tất cả trong một hệ thống
                  <br className="hidden sm:block" />
                  <GradientText>gọn hơn, rõ hơn, dễ hiểu hơn</GradientText>
                </>
              }
              description="Các tính năng được gom thành một khu vực rõ ràng: chọn feature bên trái và xem preview trong frame macbook bên phải, tránh bị chen chúc và phải lướt quá nhiều."
            />

            <div className="mt-12 grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {coreFeatures.map((item) => (
                  <FeatureSelectCard
                    key={item.key}
                    item={item}
                    active={item.key === activeFeature}
                    onSelect={() => setActiveFeature(item.key)}
                  />
                ))}
              </div>

              <div className="xl:sticky xl:top-28">
                <FeaturePreviewMac active={active} />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="feature-flow">
            <SectionHeading
              eyebrow="Feature flow"
              title={
                <>
                  Các tính năng nối với nhau thành
                  <br className="hidden sm:block" />
                  <GradientText>một hành trình sử dụng rõ ràng</GradientText>
                </>
              }
              description="Người dùng đi từ hiểu bản thân, xem năng lượng, xếp lịch, chạy focus session và nhận coin để duy trì thói quen lâu hơn."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {flowSteps.map((item, index) => (
                <FlowCard key={item.no} item={item} index={index} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="outputs">
            <SectionHeading
              eyebrow="Đầu ra người dùng nhận được"
              title={
                <>
                  Không chỉ hiển thị thông tin,
                  <br className="hidden sm:block" />
                  mà tạo ra <GradientText>hành động cụ thể</GradientText>
                </>
              }
              description="Sau khi dùng ChronoFlow, người dùng biết mình nên làm gì, vào lúc nào, theo dõi ra sao và duy trì bằng cơ chế nào."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {outputCards.map((item) => (
                <ValueCard key={item.title} {...item} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="use-cases">
            <SectionHeading
              eyebrow="Phù hợp với ai"
              title={
                <>
                  Các tính năng được thiết kế cho
                  <br className="hidden sm:block" />
                  <GradientText>những lịch trình thật ngoài đời</GradientText>
                </>
              }
              description="ChronoFlow phù hợp nhất với những người có nhiều đầu việc, cần tập trung sâu và muốn tối ưu ngày làm việc mà không bị kiệt sức."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {useCases.map((item) => (
                <UseCaseCard key={item.title} {...item} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="compare">
            <SectionHeading
              eyebrow="Điểm khác biệt"
              title={
                <>
                  Không chỉ ghi việc, mà còn giúp
                  <br className="hidden sm:block" />
                  <GradientText>chọn đúng thời điểm để làm</GradientText>
                </>
              }
              description="ChronoFlow không cạnh tranh bằng việc có nhiều ô nhập task hơn. Điểm mạnh nằm ở lớp phân tích năng lượng và gợi ý hành động."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {compareColumns.map((col) => (
                <CompareCard key={col.title} {...col} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="feature-groups">
            <SectionHeading
              eyebrow="Nhóm tính năng mở rộng"
              title={
                <>
                  Từ web app đến reward loop
                  <br className="hidden sm:block" />
                  <GradientText>và Planner Kit</GradientText>
                </>
              }
              description="Các tính năng mở rộng giúp ChronoFlow không chỉ là một trang test, mà là một hệ thống có thể dùng hằng ngày và có mô hình doanh thu rõ hơn."
            />

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              <FeatureGroupCard
                title="App Intelligence"
                description="Chronotype Test, Energy Map, Smart Scheduling và Daily Dashboard là phần lõi giúp sản phẩm có giá trị sử dụng ngay."
                items={[
                  "Chronotype Test",
                  "Energy Map",
                  "Smart Timeline",
                  "Daily Dashboard",
                ]}
                icon={<Brain className="h-5 w-5 text-[#6F59FF]" />}
                tone="purple"
              />
              <FeatureGroupCard
                title="Habit & Reward"
                description="Focus Mode, Coin, Streak và Planner Kit giúp người dùng có động lực duy trì, đồng thời hợp thức hóa sản phẩm vật lý."
                items={["Focus Mode", "Coin", "Streak", "Planner Kit Reward"]}
                icon={<Coins className="h-5 w-5 text-[#F59E0B]" />}
                tone="orange"
              />
              <FeatureGroupCard
                title="Knowledge & Upgrade"
                description="Learning Hub và Full Report giúp người dùng hiểu sâu hơn, đồng thời tạo lý do nâng cấp lên gói trả phí."
                items={[
                  "Learning Hub",
                  "Full Report",
                  "Recommendation",
                  "Download PDF",
                ]}
                icon={<FileText className="h-5 w-5 text-[#4DA8FF]" />}
                tone="blue"
              />
            </div>
          </SectionWrapper>

          <SectionWrapper id="faq">
            <SectionHeading
              eyebrow="Câu hỏi nhanh"
              title={
                <>
                  Câu hỏi thường gặp về
                  <br className="hidden sm:block" />
                  <GradientText>các tính năng của ChronoFlow</GradientText>
                </>
              }
              description="Giúp người xem hiểu rõ giá trị trước khi chuyển sang làm bài đánh giá hoặc xem pricing."
            />

            <div className="mx-auto mt-12 max-w-[980px] space-y-3">
              {faqs.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </SectionWrapper>
        </div>

        <FinalCTASection />
      </main>

      <Footer />
    </>
  );
}

function BackgroundPattern() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[8%] top-[2%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/50 blur-[110px]" />
        <div className="absolute right-[-6%] top-[6%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/55 blur-[110px]" />
        <div className="absolute left-[35%] top-[32%] h-[320px] w-[320px] rounded-full bg-[#FFF4CC]/25 blur-[100px]" />
      </div>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative z-10 px-0 pb-0 pt-0">
      <div className="mx-auto w-full">
        <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-4 pt-10 md:px-8 md:pt-14">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[8%] top-[8%] h-[360px] w-[360px] rounded-full bg-[#DCCEFF]/70 blur-[100px]" />
              <div className="absolute right-[8%] top-[18%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/75 blur-[100px]" />
              <div className="absolute bottom-[-18%] left-[32%] h-[360px] w-[360px] rounded-full bg-white/80 blur-[90px]" />
            </div>

            <div className="relative z-30 mx-auto max-w-4xl text-center">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Tính năng nổi bật
              </div>

              <h1 className="mx-auto max-w-[860px] text-[clamp(2rem,4vw,4rem)] font-[900] leading-[1.03] tracking-tight text-[#1A1528]">
                Những tính năng giúp bạn{" "}
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  làm việc theo nhịp mỗi ngày
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                ChronoFlow kết hợp chronotype test, energy map, smart scheduling,
                dashboard, focus mode và Planner Kit reward để giúp bạn hiểu rõ
                thời điểm tập trung tốt nhất và duy trì hiệu suất bền vững.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/assessment"
                  className="group flex min-h-[58px] items-center gap-3 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-black"
                >
                  <Zap className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase leading-none tracking-wider text-gray-400">
                      BẮT ĐẦU
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Làm bài test 3 phút
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="#core-features"
                  className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/85 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <span className="text-[14px] font-bold leading-tight">
                    Xem tính năng
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#6F59FF] transition group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <HeroChip>Không cần thẻ tín dụng</HeroChip>
                <HeroChip>Cá nhân hóa theo nhịp sinh học</HeroChip>
                <HeroChip>Có focus mode & coin</HeroChip>
              </div>
            </div>

            <div className="relative mx-auto mt-8 h-[365px] w-full max-w-[820px] sm:h-[390px]">
              <div className="absolute left-[3%] top-16 z-10 hidden w-[190px] -rotate-8 opacity-95 sm:block md:left-[7%] md:w-[220px]">
                <HeroPhone>
                  <EnergyPhone />
                </HeroPhone>
              </div>

              <div className="absolute right-[3%] top-16 z-10 hidden w-[190px] rotate-8 opacity-95 sm:block md:right-[7%] md:w-[220px]">
                <HeroPhone>
                  <RewardPhone />
                </HeroPhone>
              </div>

              <div className="absolute left-1/2 top-2 z-20 w-[230px] -translate-x-1/2 md:w-[260px]">
                <HeroPhone featured>
                  <CorePhone />
                </HeroPhone>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroChip({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-[12px] font-bold text-[#6A6380] shadow-sm backdrop-blur-md">
      {children}
    </div>
  );
}

function HeroPhone({
  children,
  featured = false,
}: {
  children: ReactNode;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[38px] border-[12px] border-[#1A1528] bg-[#FCFBFF] ${
        featured
          ? "ring-2 ring-white/60 shadow-[0_50px_100px_rgba(26,21,40,0.3)]"
          : "shadow-xl"
      }`}
    >
      <div className="absolute left-1/2 top-0 z-20 flex h-6 w-28 -translate-x-1/2 items-center justify-center rounded-b-[12px] bg-[#1A1528]">
        <div className="h-1.5 w-10 rounded-full bg-[#2C2640]" />
      </div>
      <div className="min-h-[300px] p-5 pt-11 shadow-inner">{children}</div>
    </div>
  );
}

function EnergyPhone() {
  return (
    <div className="flex h-full flex-col pt-1">
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A84A3]">
          Energy Map
        </div>
        <div className="mt-1 text-[17px] font-[900] leading-tight text-[#1A1528]">
          Peak focus <br /> 09:00 – 11:30
        </div>
      </div>

      <div className="rounded-[18px] border border-[#EEE9FF] bg-[#FAF8FF] p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#A29DB4]">
            Energy curve
          </span>
          <span className="text-[10px] font-bold text-[#6F59FF]">
            Mạnh nhất
          </span>
        </div>

        <div className="flex h-[78px] items-end gap-2">
          {[22, 38, 58, 70, 42, 26].map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-full bg-gradient-to-t from-[#6F59FF] to-[#4DA8FF]"
              style={{ height }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border border-[#EFEAF8] bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-[800] text-[#1A1528]">
            Khuyến nghị
          </span>
          <span className="rounded-full bg-[#EEF6FF] px-2 py-1 text-[10px] font-bold text-[#4DA8FF]">
            Focus
          </span>
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-[#615C7A]">
          Ưu tiên việc khó vào sáng, dời email sang đầu giờ chiều.
        </p>
      </div>
    </div>
  );
}

function CorePhone() {
  return (
    <div className="flex h-full flex-col pt-1">
      <div className="mb-4 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A84A3]">
          Feature Hub
        </div>
        <div className="mt-1 text-[17px] font-[900] text-[#1A1528]">
          Tất cả trong một flow
        </div>
      </div>

      <div className="space-y-3">
        <FeatureMiniRow
          icon={<Brain className="h-4 w-4 text-[#6F59FF]" />}
          title="Chronotype Test"
          subtitle="Hiểu nhịp cá nhân"
          tone="bg-[#F6F2FF]"
        />
        <FeatureMiniRow
          icon={<BarChart3 className="h-4 w-4 text-[#4DA8FF]" />}
          title="Energy Map"
          subtitle="Biết khi nào mạnh nhất"
          tone="bg-[#EEF6FF]"
        />
        <FeatureMiniRow
          icon={<CalendarClock className="h-4 w-4 text-[#F59E0B]" />}
          title="Smart Scheduling"
          subtitle="Đặt task đúng lúc"
          tone="bg-[#FFF7E8]"
        />
        <FeatureMiniRow
          icon={<Coins className="h-4 w-4 text-[#10B981]" />}
          title="Focus Coin"
          subtitle="Tập trung thật, nhận coin"
          tone="bg-[#ECFDF5]"
        />
      </div>
    </div>
  );
}

function RewardPhone() {
  return (
    <div className="flex h-full flex-col pt-1">
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A84A3]">
          Reward Loop
        </div>
        <div className="mt-1 text-[17px] font-[900] leading-tight text-[#1A1528]">
          Focus Coin
        </div>
      </div>

      <div className="rounded-[20px] border border-[#D1FAE5] bg-[#ECFDF5] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.13em] text-[#10B981]">
              Coin tuần này
            </div>
            <div className="mt-1 text-[30px] font-[900] text-[#1A1528]">
              +145
            </div>
          </div>
          <Coins className="h-8 w-8 text-[#10B981]" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <TimelineMiniItem time="500" title="Energy Card Pack" accent="bg-[#F8F9FE]" />
        <TimelineMiniItem time="1000" title="Chrono Planner" accent="bg-[#EEF6FF]" />
        <TimelineMiniItem time="2000" title="Full Planner Kit" accent="bg-[#ECFDF5]" />
      </div>
    </div>
  );
}

function FeatureMiniRow({
  icon,
  title,
  subtitle,
  tone,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  tone: string;
}) {
  return (
    <div className={`rounded-[18px] border border-white/70 p-3 ${tone}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          {icon}
        </div>
        <div>
          <div className="text-[12.5px] font-[800] leading-tight text-[#1A1528]">
            {title}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[#615C7A]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineMiniItem({
  time,
  title,
  accent,
}: {
  time: string;
  title: string;
  accent: string;
}) {
  return (
    <div className={`rounded-[18px] border border-[#EEE9FF] p-3 ${accent}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A29DB4]">
        {time}
      </div>
      <div className="mt-1 text-[13px] font-[900] text-[#1A1528]">
        {title}
      </div>
    </div>
  );
}
function SectionWrapper({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/65 px-5 py-12 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl md:px-10 md:py-16"
    >
      {children}
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
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>

      <div className="text-[clamp(2.05rem,4vw,3.55rem)] font-[900] leading-[1.07] tracking-tight text-[#1A1528]">
        {title}
      </div>

      <p className="mx-auto mt-4 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
        {description}
      </p>
    </div>
  );
}

function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function FeatureSelectCard({
  item,
  active,
  onSelect,
}: {
  item: Feature;
  active: boolean;
  onSelect: () => void;
}) {
  const tone = getToneStyle(item.tone);

  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-[26px] border p-4 text-left transition-all duration-300 ${
        active
          ? `${tone.border} bg-white shadow-[0_18px_45px_rgba(26,21,40,0.08)]`
          : "border-white/70 bg-white/55 hover:-translate-y-1 hover:bg-white/85"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white ${tone.border} ${tone.text}`}
        >
          {item.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={`mb-1 text-[10px] font-black uppercase tracking-[0.15em] ${tone.text}`}
          >
            {item.shortTitle}
          </div>

          <h3 className="text-[16px] font-[900] leading-tight text-[#1A1528]">
            {item.title}
          </h3>

          <p className="mt-2 max-h-[46px] overflow-hidden text-[13px] font-medium leading-relaxed text-[#5B566E]">
            {item.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {item.bullets.slice(0, 2).map((bullet) => (
              <span
                key={bullet}
                className="rounded-full bg-[#F8F9FE] px-3 py-1.5 text-[11px] font-bold text-[#7A748F]"
              >
                {bullet}
              </span>
            ))}
          </div>
        </div>
      </div>

      {active && (
        <motion.div
          layoutId="active-feature-line"
          className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${tone.gradient}`}
        />
      )}
    </button>
  );
}


function FeaturePreviewMac({ active }: { active: Feature }) {
  const tone = getToneStyle(active.tone);

  return (
    <div className="rounded-[34px] border border-white/80 bg-white/82 p-4 shadow-[0_24px_70px_rgba(26,21,40,0.08)] backdrop-blur-xl md:p-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-[540px]">
              <div
                className={`mb-2 inline-flex rounded-full bg-[#F8F9FE] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${tone.text}`}
              >
                {active.shortTitle}
              </div>

              <h3 className="text-[28px] font-[900] leading-tight text-[#1A1528]">
                {active.title}
              </h3>

              <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#5B566E]">
                {active.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border bg-white px-3 py-1.5 text-[11px] font-black shadow-sm ${tone.text} ${tone.border}`}
              >
                {active.value}
              </span>

              {active.bullets.slice(0, 2).map((bullet) => (
                <span
                  key={bullet}
                  className="rounded-full bg-[#F8F9FE] px-3 py-1.5 text-[11px] font-bold text-[#7A748F]"
                >
                  {bullet}
                </span>
              ))}
            </div>
          </div>

          <PremiumMacbookFrame>
            <FeatureMacScreen active={active} />
          </PremiumMacbookFrame>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PremiumMacbookFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[760px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#6F59FF]/12 via-[#4DA8FF]/10 to-[#10B981]/8 blur-[90px]" />

      <div className="relative rounded-[30px] border border-[#27233A] bg-[#171424] p-[8px] shadow-[0_34px_90px_rgba(26,21,40,0.20)] ring-1 ring-white/15">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-[30px] bg-gradient-to-b from-white/12 to-transparent" />

        {/* wide screen, không bị vuông nữa */}
        <div className="relative aspect-[16/9.6] w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#F8FAFC]">
          {children}
        </div>
      </div>

      <div className="mx-auto h-[12px] w-[82%] rounded-b-[22px] bg-gradient-to-b from-[#E4E8F0] to-[#B8C1CF] shadow-[0_18px_36px_rgba(26,21,40,0.12)]">
        <div className="mx-auto h-[4px] w-[118px] rounded-b-full bg-[#9DA8B8]" />
      </div>
    </div>
  );
}

function FeatureMacScreen({ active }: { active: Feature }) {
  const tone = getToneStyle(active.tone);

  return (
    <div className="h-full w-full overflow-hidden bg-[#F8FAFC]">
      <div className="flex h-[44px] items-center justify-between border-b border-[#EEF0F6] bg-white px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
        </div>

        <div className="rounded-full bg-[#F3F4F8] px-4 py-1.5 text-[9.5px] font-black text-[#8A84A3] shadow-inner">
          app.chronoflow.vn/features
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F8F9FE]">
          <Activity className="h-3.5 w-3.5 text-[#6F59FF]" />
        </div>
      </div>

      <div className="grid h-[calc(100%-44px)] grid-cols-[132px_1fr]">
        <aside className="border-r border-[#EEF0F6] bg-white px-3 py-4">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white shadow-sm">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[11px] font-[900] text-[#1A1528]">
                ChronoFlow
              </div>
              <div className="text-[9px] font-bold text-[#8A84A3]">
                Feature Hub
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {coreFeatures.slice(0, 6).map((item) => {
              const isActive = item.key === active.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={`w-full rounded-xl px-2.5 py-2 text-left text-[9.5px] font-black leading-tight transition ${
                    isActive
                      ? `${tone.text} bg-[#F8F5FF] ring-1 ring-[#E9E5FF]`
                      : "text-[#9AA2B5]"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="overflow-hidden bg-[#F8FAFC] p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div
                className={`text-[9.5px] font-black uppercase tracking-[0.16em] ${tone.text}`}
              >
                Preview
              </div>
              <div className="mt-0.5 text-[23px] font-[900] leading-tight text-[#1A1528]">
                {active.title}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-1.5">
              <span
                className={`rounded-full border bg-white px-2.5 py-1 text-[9.5px] font-black shadow-sm ${tone.text} ${tone.border}`}
              >
                {active.value}
              </span>
              <span className="rounded-full border border-[#EEF0F6] bg-white px-2.5 py-1 text-[9.5px] font-black text-[#8A84A3] shadow-sm">
                Live preview
              </span>
            </div>
          </div>

          {/* scale nhỏ UI bên trong, không làm frame bị to/vuông */}
          <div className="origin-top-left scale-[0.82] w-[122%]">
            <PreviewContentFull active={active} />
          </div>
        </main>
      </div>
    </div>
  );
}

function PreviewContentFull({ active }: { active: Feature }) {
  switch (active.key) {
    case "chronotype":
      return <ChronotypePreviewFull />;
    case "energy":
      return <EnergyPreviewFull />;
    case "schedule":
      return <SchedulePreviewFull />;
    case "dashboard":
      return <DashboardPreviewFull />;
    case "focus":
      return <FocusPreviewFull />;
    case "kit":
      return <KitPreviewFull />;
    case "learn":
      return <LearnPreviewFull />;
    case "report":
      return <ReportPreviewFull />;
    default:
      return null;
  }
}

function ChronotypePreviewFull() {
  return (
    <div className="grid h-[380px] gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-[26px] border border-[#E9E5FF] bg-white p-5 shadow-[0_16px_38px_rgba(26,21,40,0.055)]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-13 w-13 items-center justify-center rounded-[18px] bg-[#F3F0FF] text-[#6F59FF]">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[17px] font-[900] text-[#1A1528]">
                Hồ sơ nhịp sinh học
              </div>
              <div className="text-[12px] font-bold text-[#8A84A3]">
                Cá nhân hóa theo thói quen
              </div>
            </div>
          </div>

          <div className="rounded-full bg-[#F8F5FF] px-3 py-1.5 text-[11px] font-black text-[#6F59FF]">
            ~3 phút
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-[#FDE68A] bg-[#FFFBEB] p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#B45309]">
              Kết quả mẫu
            </div>
            <div className="mt-3 text-[48px]">🐻</div>
            <div className="mt-1 text-[24px] font-[900] text-[#1A1528]">
              The Bear
            </div>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#5B566E]">
              Năng lượng mạnh từ sáng đến đầu giờ chiều.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <ProgressRow label="Buổi sáng" value="88%" width="w-[88%]" />
            <ProgressRow label="Buổi chiều" value="62%" width="w-[62%]" />
            <ProgressRow label="Buổi tối" value="41%" width="w-[41%]" />

            <div className="grid grid-cols-3 gap-3">
              <MiniStat value="09:00" label="Peak" />
              <MiniStat value="15:00" label="Low" />
              <MiniStat value="88%" label="Energy" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[26px] border border-[#D1FAE5] bg-[#ECFDF5] p-5 shadow-[0_16px_38px_rgba(16,185,129,0.08)]">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#10B981] shadow-sm">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#10B981]">
          Gợi ý hôm nay
        </div>

        <div className="mt-2 text-[28px] font-[900] leading-tight text-[#1A1528]">
          Deep work
          <br />
          trước 11:00
        </div>

        <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          Ưu tiên việc khó vào khung năng lượng cao. Chuyển email, admin task và
          việc nhẹ sang đầu giờ chiều.
        </p>

        <div className="mt-5 grid gap-2">
          {["Viết báo cáo", "Phân tích dữ liệu", "Học sâu"].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-white/75 px-3 py-2 text-[12px] font-bold text-[#5B566E]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnergyPreviewFull() {
  return (
    <div className="grid h-[380px] gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-[26px] border border-[#DDEEFF] bg-white p-5 shadow-[0_16px_38px_rgba(26,21,40,0.055)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#4DA8FF]">
              Energy curve
            </div>
            <div className="mt-1 text-[28px] font-[900] text-[#1A1528]">
              Hôm nay
            </div>
          </div>

          <div className="rounded-full bg-[#EEF6FF] px-3 py-1.5 text-[11px] font-black text-[#4DA8FF]">
            24h view
          </div>
        </div>

        <div className="relative h-[250px] overflow-hidden rounded-[24px] border border-[#E6F0FF] bg-[#F8FBFF] p-5">
          <div className="absolute inset-x-5 bottom-12 top-8 flex items-end gap-3">
            {[28, 36, 48, 64, 82, 94, 76, 58, 40].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-full bg-gradient-to-t from-[#6F59FF] to-[#4DA8FF] shadow-[0_8px_16px_rgba(77,168,255,0.18)]"
                  style={{ height: `${height}%` }}
                />
                <div className="text-[10px] font-bold text-[#94A3B8]">
                  {index + 7}h
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <MiniStat value="09:00" label="Peak focus" />
        <MiniStat value="13:30" label="Admin" />
        <MiniStat value="15:00" label="Recovery" />
      </div>
    </div>
  );
}

function SchedulePreviewFull() {
  return (
    <div className="grid h-[380px] gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-[26px] border border-[#FFE6C7] bg-white p-5 shadow-[0_16px_38px_rgba(26,21,40,0.055)]">
        <div className="mb-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#F59E0B]">
          Timeline hôm nay
        </div>

        <div className="space-y-3">
          <TimelineBar time="09:00" title="Deep Work" width="w-[82%]" tone="purple" />
          <TimelineBar time="11:30" title="Review / phân tích" width="w-[64%]" tone="orange" />
          <TimelineBar time="14:00" title="Email / Admin" width="w-[56%]" tone="blue" />
          <TimelineBar time="16:00" title="Recovery break" width="w-[42%]" tone="green" />
        </div>
      </div>

      <div className="rounded-[26px] border border-[#E9E5FF] bg-[#F8F5FF] p-5">
        <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
          Logic đề xuất
        </div>
        <div className="mt-2 text-[24px] font-[900] leading-tight text-[#1A1528]">
          Đặt đúng loại việc
          <br />
          vào đúng khung năng lượng
        </div>

        <div className="mt-5 space-y-3">
          <BenefitRow text="Deep work ở khung năng lượng cao." />
          <BenefitRow text="Admin task ở khung vừa hoặc thấp." />
          <BenefitRow text="Recovery trước khi quá tải." />
        </div>
      </div>
    </div>
  );
}

function DashboardPreviewFull() {
  return (
    <div className="h-[380px] space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <MiniStat value="88%" label="Energy" />
        <MiniStat value="4" label="Blocks" />
        <MiniStat value="+145" label="Coin" />
        <MiniStat value="5 ngày" label="Streak" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[26px] border border-[#E9E5FF] bg-white p-5 shadow-sm">
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Hiệu suất tuần
          </div>

          <div className="flex h-[185px] items-end gap-4">
            {[52, 70, 44, 82, 76, 66, 74].map((value, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-4 rounded-full bg-gradient-to-t from-[#4DA8FF] to-[#6F59FF]"
                  style={{ height: `${value}%` }}
                />
                <div className="text-[10px] font-bold text-[#94A3B8]">
                  T{i + 2}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-[#D1FAE5] bg-[#ECFDF5] p-5">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#10B981] shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#10B981]">
            Gợi ý hôm nay
          </div>
          <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
            Làm việc khó trước 11:00, chuyển email sang sau 14:00 và thêm một phiên
            recovery ngắn cuối chiều.
          </p>
        </div>
      </div>
    </div>
  );
}

function FocusPreviewFull() {
  return (
    <div className="grid h-[380px] gap-4 lg:grid-cols-[1fr_0.95fr]">
      <div className="rounded-[26px] border border-[#FCE7F3] bg-[#FFF7FB] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#EC4899]">
              Focus session
            </div>
            <div className="mt-2 text-[48px] font-[900] leading-none text-[#1A1528]">
              42:16
            </div>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#EC4899] shadow-sm">
            <Timer className="h-6 w-6" />
          </div>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#EC4899] to-[#F59E0B]" />
        </div>

        <p className="mt-5 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          Coin được tính theo thời lượng focus thật, loại task và giới hạn mỗi ngày
          để tránh spam task.
        </p>
      </div>

      <div className="grid gap-3">
        <MiniStat value="+18" label="Coin phiên này" />
        <MiniStat value="5 ngày" label="Streak" />
        <MiniStat value="3" label="Task xong" />
      </div>
    </div>
  );
}

function KitPreviewFull() {
  return (
    <div className="grid h-[380px] gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[26px] border border-[#D1FAE5] bg-[#ECFDF5] p-5">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#10B981] shadow-sm">
          <Gift className="h-6 w-6" />
        </div>

        <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#10B981]">
          Planner Kit Reward
        </div>

        <div className="mt-2 text-[28px] font-[900] leading-tight text-[#1A1528]">
          Đổi ưu đãi
          <br />
          bằng coin
        </div>

        <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          Coin có thể đổi ưu đãi cho Energy Card, Chrono Planner hoặc Full Planner Kit.
        </p>
      </div>

      <div className="grid gap-3">
        <RewardMini value="500" label="Energy Card Pack" />
        <RewardMini value="1000" label="Chrono Planner" />
        <RewardMini value="2000" label="Full Planner Kit" />
      </div>
    </div>
  );
}

function LearnPreviewFull() {
  return (
    <div className="grid h-[380px] gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[26px] border border-[#DDEEFF] bg-white p-5 shadow-sm">
        <div className="mb-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#4DA8FF]">
          Blog & video
        </div>

        <div className="space-y-3">
          <SimpleResourceRow title="Chronotype là gì?" type="Blog" />
          <SimpleResourceRow title="Energy curve hoạt động ra sao?" type="Video" />
          <SimpleResourceRow title="Cách đặt deep work đúng lúc" type="Guide" />
        </div>
      </div>

      <div className="rounded-[26px] border border-[#E9E5FF] bg-[#F8F5FF] p-5">
        <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
          Learning Hub
        </div>
        <div className="mt-2 text-[26px] font-[900] leading-tight text-[#1A1528]">
          Đọc nhanh,
          <br />
          hiểu nhanh,
          <br />
          áp dụng được ngay
        </div>
        <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          Không phải lớp học phức tạp. Chỉ là blog, video ngắn và tips giúp người dùng
          hiểu nhịp sinh học dễ hơn.
        </p>
      </div>
    </div>
  );
}

function ReportPreviewFull() {
  return (
    <div className="grid h-[380px] gap-4 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[26px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1528] text-white shadow-sm">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[19px] font-[900] text-[#1A1528]">
              Full Chronotype Report
            </div>
            <div className="text-[12px] font-bold text-[#6F59FF]">
              PDF + recommendation
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          {[
            "Phân tích chronotype",
            "Khung giờ nên ưu tiên",
            "Task recommendation",
            "Tải PDF",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-2xl bg-[#F8F9FE] px-3 py-3 text-[13px] font-semibold text-[#5B566E]"
            >
              <CheckCircle2 className="h-4 w-4 text-[#6F59FF]" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[26px] border border-[#E9E5FF] bg-[#F8F5FF] p-5">
        <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          Export
        </div>
        <div className="mt-2 text-[46px] font-[900] leading-none text-[#1A1528]">
          PDF
        </div>
        <p className="mt-4 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          Người dùng Plus hoặc Pro có thể tải báo cáo và xem recommendation cá nhân hóa sâu hơn.
        </p>
      </div>
    </div>
  );
}
function ProgressRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[#6A6380]">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#EEF0F6]">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] ${width}`}
        />
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[20px] border border-[#EEF0F6] bg-white p-4 text-center shadow-sm">
      <div className="text-[24px] font-[900] text-[#1A1528]">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.13em] text-[#8A84A3]">
        {label}
      </div>
    </div>
  );
}

function TimelineCard({
  time,
  title,
  tone,
}: {
  time: string;
  title: string;
  tone: Tone;
}) {
  const style = getToneStyle(tone);

  return (
    <div
      className={`rounded-[20px] border p-4 shadow-sm ${style.border} ${style.bgLight} ${style.text}`}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.14em] opacity-75">
        {time}
      </div>
      <div className="mt-1 text-[15px] font-[900] text-[#1A1528]">
        {title}
      </div>
    </div>
  );
}
function TimelineBar({
  time,
  title,
  width,
  tone,
}: {
  time: string;
  title: string;
  width: string;
  tone: Tone;
}) {
  const style = getToneStyle(tone);

  return (
    <div className="rounded-[20px] border border-[#EEF0F6] bg-[#F8F9FE] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          {time}
        </span>
        <span className={`text-[11px] font-black ${style.text}`}>{title}</span>
      </div>
      <div className="h-9 rounded-full bg-white p-1 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${style.gradient} ${width}`}
        />
      </div>
    </div>
  );
}

function RewardMini({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[22px] border border-[#D1FAE5] bg-white p-4 shadow-sm">
      <div className="text-[26px] font-[900] text-[#10B981]">{value}</div>
      <div className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        coin
      </div>
      <div className="mt-2 text-[14px] font-[900] text-[#1A1528]">
        {label}
      </div>
    </div>
  );
}

function BenefitRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-[16px] bg-[#F8F9FE] px-3 py-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6F59FF]" />
      <span className="text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {text}
      </span>
    </div>
  );
}

function SimpleResourceRow({ title, type }: { title: string; type: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[#EEF0F6] bg-white p-4 shadow-sm">
      <div>
        <div className="text-[14px] font-[900] text-[#1A1528]">{title}</div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.13em] text-[#8A84A3]">
          {type}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-[#6F59FF]" />
    </div>
  );
}

function FlowCard({
  item,
  index,
}: {
  item: (typeof flowSteps)[number];
  index: number;
}) {
  const tones: Tone[] = ["purple", "blue", "orange", "green"];
  const style = getToneStyle(tones[index]);

  return (
    <div className="relative rounded-[28px] border border-white/80 bg-white/75 p-6 shadow-[0_16px_38px_rgba(26,21,40,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(26,21,40,0.08)]">
      <div className="mb-5 flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.bgLight} ${style.text}`}
        >
          {item.icon}
        </div>
        <div className={`text-[13px] font-black uppercase tracking-[0.18em] ${style.text}`}>
          Bước {item.no}
        </div>
      </div>

      <h3 className="text-[20px] font-[900] leading-tight text-[#1A1528]">
        {item.title}
      </h3>

      <p className="mt-4 text-[14px] font-medium leading-relaxed text-[#5B566E]">
        {item.text}
      </p>
    </div>
  );
}

function ValueCard({
  title,
  description,
  icon,
  tone,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  tone: Tone;
}) {
  const style = getToneStyle(tone);

  return (
    <div
      className={`rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${style.card}`}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        {icon}
      </div>
      <h3 className="text-[18px] font-[900] leading-tight text-[#1A1528]">
        {title}
      </h3>
      <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
  icon,
  label,
  tone,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  label: string;
  tone: Tone;
}) {
  const style = getToneStyle(tone);

  return (
    <div
      className={`rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${style.card}`}
    >
      <div className="mb-4 inline-flex rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3] shadow-sm">
        {label}
      </div>
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        {icon}
      </div>
      <h3 className="text-[18px] font-[900] leading-tight text-[#1A1528]">
        {title}
      </h3>
      <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
    </div>
  );
}

function CompareCard({
  title,
  badge,
  points,
  highlight,
}: {
  title: string;
  badge: string;
  points: string[];
  highlight: boolean;
}) {
  return (
    <div
      className={`rounded-[34px] border p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] md:p-8 ${
        highlight
          ? "border-[#D6CBFF] bg-gradient-to-br from-[#F8F4FF] via-[#F4F4FF] to-[#EDF5FF] shadow-[0_22px_55px_rgba(111,89,255,0.13)]"
          : "border-[#E7E9F2] bg-gradient-to-br from-[#FBFBFE] to-[#F4F5FA]"
      }`}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[23px] font-[900] leading-tight text-[#1A1528]">
          {title}
        </h3>
        <div
          className={`w-fit rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] ${
            highlight ? "bg-white text-[#6F59FF] shadow-sm" : "bg-white/70 text-[#7A748F]"
          }`}
        >
          {badge}
        </div>
      </div>

      <div className="space-y-3">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-start gap-3 rounded-[20px] border border-white/70 bg-white/75 px-4 py-4 shadow-sm"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6F59FF]" />
            <span className="text-[14px] font-medium leading-relaxed text-[#4E4963]">
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureGroupCard({
  title,
  description,
  items,
  icon,
  tone,
}: {
  title: string;
  description: string;
  items: string[];
  icon: ReactNode;
  tone: Tone;
}) {
  const style = getToneStyle(tone);

  return (
    <div
      className={`rounded-[30px] border bg-gradient-to-br p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] ${style.card}`}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        {icon}
      </div>

      <h3 className="text-[21px] font-[900] leading-tight text-[#1A1528]">
        {title}
      </h3>

      <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>

      <div className="mt-5 grid gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-2xl bg-white/75 px-3 py-2 text-[12.5px] font-bold text-[#5B566E] shadow-sm"
          >
            <CheckCircle2 className={`h-4 w-4 ${style.text}`} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/80 shadow-sm backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
            <CircleHelp className="h-4 w-4" />
          </div>
          <div className="text-[15px] font-[800] leading-relaxed text-[#1A1528]">
            {q}
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#8A84A3] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-[68px] text-[14px] font-medium leading-relaxed text-[#5B566E]">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getToneStyle(tone: Tone) {
  const styles = {
    purple: {
      text: "text-[#6F59FF]",
      border: "border-[#D6CBFF]",
      bgLight: "bg-[#F3F0FF]",
      gradient: "from-[#6F59FF] to-[#8B5CF6]",
      card: "from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF] border-[#D6CBFF]",
    },
    blue: {
      text: "text-[#4DA8FF]",
      border: "border-[#BFDDFF]",
      bgLight: "bg-[#EEF6FF]",
      gradient: "from-[#4DA8FF] to-[#38BDF8]",
      card: "from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF] border-[#BFDDFF]",
    },
    orange: {
      text: "text-[#F59E0B]",
      border: "border-[#FCD34D]",
      bgLight: "bg-[#FFF7ED]",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
      card: "from-[#FFF8F0] via-[#FFEDD6] to-[#FFE0B2] border-[#FCD34D]",
    },
    green: {
      text: "text-[#10B981]",
      border: "border-[#6EE7B7]",
      bgLight: "bg-[#ECFDF5]",
      gradient: "from-[#10B981] to-[#34D399]",
      card: "from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] border-[#6EE7B7]",
    },
    pink: {
      text: "text-[#EC4899]",
      border: "border-[#FCE7F3]",
      bgLight: "bg-[#FFF7FB]",
      gradient: "from-[#EC4899] to-[#F59E0B]",
      card: "from-[#FFF9FC] via-[#FFF1F7] to-[#FFEAF3] border-[#FCE7F3]",
    },
    dark: {
      text: "text-[#1A1528]",
      border: "border-[#E5E7EB]",
      bgLight: "bg-[#F8F9FE]",
      gradient: "from-[#1A1528] to-[#6F59FF]",
      card: "from-[#FFFFFF] via-[#F8F9FE] to-[#F3F0FF] border-[#E5E7EB]",
    },
  } satisfies Record<
    Tone,
    {
      text: string;
      border: string;
      bgLight: string;
      gradient: string;
      card: string;
    }
  >;

  return styles[tone];
}