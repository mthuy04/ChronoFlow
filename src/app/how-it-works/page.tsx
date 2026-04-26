"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState, type ReactNode } from "react";
import FinalCTASection from "@/components/home/FinalCTASection";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock3,
  Coffee,
  Dna,
  Mail,
  Monitor,
  MoonStar,
  Palette,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Waves,
  Zap,
} from "lucide-react";

type StepId = "quiz" | "profile" | "timeline" | "tracking";

type StepItem = {
  id: StepId;
  stepNo: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  bg: string;
  border: string;
};

type FAQ = {
  q: string;
  a: string;
};

const steps: StepItem[] = [
  {
    id: "quiz",
    stepNo: "01",
    title: "Làm bài đánh giá ngắn",
    description:
      "Trả lời một số câu hỏi về giờ ngủ, thời điểm tỉnh táo, mức tập trung và nhịp sinh hoạt thường ngày.",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "text-[#6F59FF]",
    bg: "bg-[#F3F0FF]",
    border: "border-[#E9E5FF]",
  },
  {
    id: "profile",
    stepNo: "02",
    title: "Nhận hồ sơ chronotype",
    description:
      "ChronoFlow xác định kiểu nhịp năng lượng, hiển thị energy curve và chỉ ra khung giờ mạnh nhất trong ngày.",
    icon: <Dna className="h-5 w-5" />,
    color: "text-[#4DA8FF]",
    bg: "bg-[#EEF6FF]",
    border: "border-[#DDEEFF]",
  },
  {
    id: "timeline",
    stepNo: "03",
    title: "Biến insight thành lịch hành động",
    description:
      "Hệ thống gợi ý khi nào nên deep work, xử lý việc nhẹ, sáng tạo hoặc nghỉ phục hồi để lịch bớt quá tải.",
    icon: <CalendarCheck2 className="h-5 w-5" />,
    color: "text-[#10B981]",
    bg: "bg-[#ECFDF5]",
    border: "border-[#D1FAE5]",
  },
  {
    id: "tracking",
    stepNo: "04",
    title: "Theo dõi và điều chỉnh dần",
    description:
      "Sau mỗi ngày/tuần, ChronoFlow giúp bạn nhìn lại focus session, coin, streak và điều chỉnh lịch theo thực tế.",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-[#F59E0B]",
    bg: "bg-[#FFF7ED]",
    border: "border-[#FED7AA]",
  },
];

const outcomes = [
  {
    title: "Chronotype cá nhân",
    description:
      "Biết mình thường mạnh vào khung giờ nào và vì sao có lúc làm việc rất mượt, có lúc lại khó vào guồng.",
    icon: <Dna className="h-6 w-6 text-[#6F59FF]" />,
    accent: "from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF]",
    border: "border-[#D6CBFF]",
  },
  {
    title: "Biểu đồ năng lượng",
    description:
      "Nhìn rõ nhịp năng lượng trong ngày: đỉnh tập trung, giai đoạn ổn định và khoảng nên giảm tải.",
    icon: <BarChart3 className="h-6 w-6 text-[#4DA8FF]" />,
    accent: "from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF]",
    border: "border-[#BFDDFF]",
  },
  {
    title: "Timeline gợi ý",
    description:
      "Gợi ý phân bổ deep work, admin task, creative work và recovery vào khung giờ hợp lý hơn.",
    icon: <CalendarClock className="h-6 w-6 text-[#10B981]" />,
    accent: "from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]",
    border: "border-[#6EE7B7]",
  },
  {
    title: "Cơ sở cải thiện dần",
    description:
      "Theo dõi lại nhịp làm việc để điều chỉnh lịch, giữ streak và xây dựng thói quen bền hơn theo thời gian.",
    icon: <TrendingUp className="h-6 w-6 text-[#F59E0B]" />,
    accent: "from-[#FFF8F0] via-[#FFEDD6] to-[#FFE0B2]",
    border: "border-[#FCD34D]",
  },
];

const principles = [
  {
    title: "Cá nhân hóa theo nhịp sinh học",
    text: "ChronoFlow không giả định mọi người làm việc hiệu quả theo cùng một lịch. Mỗi người có một chronotype và đường năng lượng riêng.",
    icon: <Brain className="h-5 w-5 text-[#6F59FF]" />,
  },
  {
    title: "Hiểu đúng thời điểm",
    text: "Không chỉ biết mình thuộc nhóm nào, người dùng còn biết khi nào nên tập trung, khi nào nên xử lý việc nhẹ và khi nào nên nghỉ.",
    icon: <Waves className="h-5 w-5 text-[#4DA8FF]" />,
  },
  {
    title: "Từ insight đến hành động",
    text: "Kết quả không dừng ở phần giải thích. ChronoFlow chuyển insight thành timeline, lịch gợi ý và thói quen có thể áp dụng mỗi ngày.",
    icon: <Clock3 className="h-5 w-5 text-[#F59E0B]" />,
  },
];

const useCases = [
  {
    title: "Deep work",
    description:
      "Viết báo cáo, học chuyên sâu, lập trình hoặc phân tích dữ liệu nên đặt vào khung năng lượng mạnh nhất.",
    icon: <Zap className="h-5 w-5 text-[#6F59FF]" />,
  },
  {
    title: "Việc nhẹ / hành chính",
    description:
      "Email, checklist, cập nhật tài liệu hoặc việc lặp lại phù hợp hơn ở giai đoạn năng lượng vừa phải.",
    icon: <Mail className="h-5 w-5 text-[#4DA8FF]" />,
  },
  {
    title: "Hồi phục",
    description:
      "Nghỉ ngắn, đi bộ hoặc đổi nhịp đúng lúc giúp duy trì hiệu suất thay vì cố gắng đến kiệt sức.",
    icon: <Coffee className="h-5 w-5 text-[#10B981]" />,
  },
  {
    title: "Sáng tạo",
    description:
      "Brainstorming, thiết kế, viết nội dung hoặc lên chiến lược sẽ hiệu quả hơn khi có cửa sổ sáng tạo phù hợp.",
    icon: <Palette className="h-5 w-5 text-[#F59E0B]" />,
  },
];

const timelineRows = [
  {
    label: "Tập trung cao",
    icon: <Zap className="h-4 w-4" />,
    color: "text-[#6F59FF]",
    dot: "bg-[#6F59FF]",
    bar: "from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF]",
    blocks: [
      { time: "07:00", width: "28%", title: "Khởi động nhẹ" },
      { time: "09:00", width: "48%", title: "Deep work" },
      { time: "11:00", width: "34%", title: "Phân tích / viết" },
    ],
  },
  {
    label: "Năng lượng ổn định",
    icon: <Mail className="h-4 w-4" />,
    color: "text-[#4DA8FF]",
    dot: "bg-[#4DA8FF]",
    bar: "from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF]",
    blocks: [
      { time: "13:00", width: "32%", title: "Email" },
      { time: "14:00", width: "40%", title: "Checklist / admin" },
      { time: "16:00", width: "26%", title: "Họp ngắn" },
    ],
  },
  {
    label: "Hồi phục",
    icon: <Coffee className="h-4 w-4" />,
    color: "text-[#10B981]",
    dot: "bg-[#10B981]",
    bar: "from-[#FBFFFE] via-[#F3FFFB] to-[#ECFDF5]",
    blocks: [
      { time: "12:00", width: "24%", title: "Nghỉ trưa" },
      { time: "15:30", width: "22%", title: "Đi bộ ngắn" },
      { time: "20:30", width: "30%", title: "Giảm tải" },
    ],
  },
];

const faqs: FAQ[] = [
  {
    q: "ChronoFlow có phải công cụ chẩn đoán y khoa không?",
    a: "Không. ChronoFlow không phải công cụ chẩn đoán, điều trị hay thay thế tư vấn y khoa. Ứng dụng này chỉ hỗ trợ người dùng hiểu nhịp năng lượng cá nhân để sắp xếp học tập, làm việc và nghỉ ngơi hợp lý hơn.",
  },
  {
    q: "ChronoFlow hoạt động như thế nào từ đầu đến cuối?",
    a: "Quy trình gồm bốn bước: làm bài đánh giá ngắn, nhận hồ sơ chronotype, biến insight thành timeline hành động, sau đó theo dõi và điều chỉnh dần dựa trên trải nghiệm thực tế.",
  },
  {
    q: "Tôi nhận được gì sau khi hoàn thành bài đánh giá?",
    a: "Bạn nhận được kết quả chronotype cá nhân, biểu đồ năng lượng trong ngày, các khung giờ nổi bật và gợi ý cơ bản để phân bổ deep work, việc nhẹ, sáng tạo hoặc nghỉ ngắn.",
  },
  {
    q: "Tôi có cần làm đúng hoàn toàn theo gợi ý của ChronoFlow không?",
    a: "Không cần. Gợi ý của ChronoFlow là khung tham chiếu thông minh. Bạn vẫn có thể điều chỉnh theo deadline, lịch học, công việc, gia đình hoặc các yếu tố phát sinh.",
  },
  {
    q: "ChronoFlow khác gì với to-do list hoặc calendar thông thường?",
    a: "To-do list và calendar thường trả lời câu hỏi ‘làm gì’ và ‘khi nào có deadline’. ChronoFlow đi thêm một bước: hỗ trợ bạn quyết định ‘nên làm việc đó vào thời điểm nào để ít tốn sức hơn’. ",
  },
  {
    q: "Nếu lịch sinh hoạt chưa ổn định thì dùng ChronoFlow có hữu ích không?",
    a: "Có. ChronoFlow đặc biệt hữu ích khi bạn cảm thấy lịch đang rối, dễ mệt hoặc khó phân bổ công việc. Ứng dụng giúp bạn nhận diện xu hướng năng lượng để điều chỉnh dần.",
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState<StepId>("quiz");

  const activeIndex = useMemo(
    () => steps.findIndex((step) => step.id === activeStep),
    [activeStep]
  );

  return (
    <>
      <Header />

      <main className="relative overflow-hidden bg-[#F4F2FA] pb-24 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <BackgroundPattern />

        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 lg:px-8">
          <HeroSection />

          <SectionWrapper>
            <div className="grid gap-5 md:grid-cols-3">
              <StatCard
                icon={<ClipboardList className="h-6 w-6 text-[#6F59FF]" />}
                label="Bắt đầu"
                value="~3 phút test"
                text="Câu hỏi ngắn, rõ và dễ hiểu."
                accent="bg-[#F3F0FF] border-[#E9E5FF]"
              />
              <StatCard
                icon={<Brain className="h-6 w-6 text-[#4DA8FF]" />}
                label="Kết quả"
                value="Hồ sơ chronotype"
                text="Hiểu energy curve của riêng bạn."
                accent="bg-[#EEF6FF] border-[#DDEEFF]"
              />
              <StatCard
                icon={<ShieldCheck className="h-6 w-6 text-[#10B981]" />}
                label="Mục tiêu"
                value="Lịch bền vững"
                text="Làm đúng lúc, ít ép bản thân hơn."
                accent="bg-[#ECFDF5] border-[#D1FAE5]"
              />
            </div>
          </SectionWrapper>

          <SectionWrapper id="flow">
            <SectionHeading
              eyebrow="Tương tác"
              title={
                <>
                  Hoạt động theo <br />
                  <GradientText>bốn bước rõ ràng</GradientText>
                </>
              }
              description="Trải nghiệm ChronoFlow đi từ bài đánh giá ban đầu đến timeline gợi ý và vòng lặp theo dõi mỗi ngày."
            />

            <div className="mt-14 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4">
                {steps.map((item, index) => {
                  const isActive = item.id === activeStep;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveStep(item.id)}
                      onClick={() => setActiveStep(item.id)}
                      className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-300 md:p-6 ${
                        isActive
                          ? `${item.border} bg-white shadow-[0_20px_45px_rgba(26,21,40,0.08)]`
                          : "border-white/70 bg-white/50 hover:-translate-y-1 hover:bg-white/80"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border ${
                            isActive
                              ? `${item.bg} ${item.border} ${item.color}`
                              : "border-white bg-white text-[#8A84A3]"
                          }`}
                        >
                          {item.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                            Bước {item.stepNo}
                          </div>
                          <h3 className="text-[18px] font-[900] leading-tight text-[#1A1528] md:text-[20px]">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <motion.div
                          layoutId="active-step-line"
                          className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="relative flex min-h-[560px] items-center justify-center rounded-[36px] border border-white/80 bg-[linear-gradient(180deg,#F8F9FE_0%,#EEF6FF_100%)] p-6 shadow-[0_24px_70px_rgba(26,21,40,0.08)]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]">
                  <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6F59FF]/12 blur-[80px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-5">
                  <PhoneFrame>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="h-full"
                      >
                        {activeStep === "quiz" && <QuizScreen />}
                        {activeStep === "profile" && <ResultScreen />}
                        {activeStep === "timeline" && <TimelineScreen />}
                        {activeStep === "tracking" && <TrackingScreen />}
                      </motion.div>
                    </AnimatePresence>
                  </PhoneFrame>

                  <div className="flex items-center gap-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setActiveStep(step.id)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeIndex
                            ? "w-8 bg-[#6F59FF]"
                            : "w-2.5 bg-[#CBD5E1] hover:bg-[#A5B4FC]"
                        }`}
                        aria-label={`Chọn bước ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="outcomes">
            <SectionHeading
              eyebrow="Kết quả đầu ra"
              title={
                <>
                  Sau vài phút, bạn sẽ <br />
                  <GradientText>nhận được gì?</GradientText>
                </>
              }
              description="Không chỉ là một kết quả test. ChronoFlow tạo ra các đầu ra đủ rõ để bạn bắt đầu điều chỉnh lịch học, lịch làm và thời gian hồi phục."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {outcomes.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="timeline-example">
            <SectionHeading
              eyebrow="Giao diện hiển thị"
              title={
                <>
                  Timeline gợi ý <br />
                  <GradientText>của riêng bạn</GradientText>
                </>
              }
              description="Ví dụ cách ChronoFlow biến insight về năng lượng thành một timeline thực tế cho một ngày học/làm việc."
            />

            <div className="mx-auto mt-14 max-w-[1080px] rounded-[36px] border border-white bg-white/80 p-5 shadow-[0_22px_65px_rgba(26,21,40,0.08)] backdrop-blur-xl md:p-8 lg:p-10">
              <div className="mb-8 flex flex-col gap-5 border-b border-[#EEF0F6] pb-7 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                    <Clock3 className="h-4 w-4" />
                    Giao diện Timeline
                  </div>
                  <h3 className="text-[28px] font-[900] leading-tight text-[#1A1528] md:text-[34px]">
                    Một ngày làm việc điển hình
                  </h3>
                  <p className="mt-3 max-w-[580px] text-[15px] font-medium leading-relaxed text-[#5B566E]">
                    Thay vì chen việc khó, việc nhẹ và hồi phục vào mọi khoảng trống, ChronoFlow giúp gom đúng loại việc vào đúng khung giờ.
                  </p>
                </div>

                <div className="rounded-[26px] border border-[#E9E5FF] bg-[#F8F9FE] p-5 md:text-right">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                    Chronotype Profile
                  </div>
                  <div className="mt-1 text-[24px] font-[900] text-[#6F59FF]">
                    Gấu 🐻
                  </div>
                  <div className="mt-2 rounded-full bg-white px-3 py-1 text-[12px] font-bold text-[#64748B] shadow-sm">
                    Đồng bộ theo mặt trời
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {timelineRows.map((row) => (
                  <TimelineRow key={row.label} {...row} />
                ))}
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="video-guide">
            <SectionHeading
              eyebrow="Video hướng dẫn"
              title={
                <>
                  Cách dùng ChronoFlow trên <br />
                  <GradientText>máy tính và điện thoại</GradientText>
                </>
              }
              description="Gắn video demo để người xem hiểu hành trình: làm bài test, xem chronotype, đọc biểu đồ năng lượng và theo dõi timeline."
            />

            <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <VideoCard
                type="desktop"
                title="Máy tính"
                description="Video desktop phù hợp để giới thiệu toàn bộ flow: assessment, dashboard, energy map và smart scheduling."
                src="https://www.youtube.com/embed/XDfNLw1W6FA"
              />
              <VideoCard
                type="mobile"
                title="Điện thoại"
                description="Video mobile giúp người xem thấy cách kiểm tra nhanh timeline, khung giờ phù hợp và điều chỉnh lịch trong ngày."
                src="https://www.youtube.com/embed/bCZ3fOqXAMY"
              />
            </div>
          </SectionWrapper>

          <SectionWrapper id="principles-and-usecases">
            <SectionHeading
              eyebrow="Nền tảng phương pháp"
              title={
                <>
                  Không chỉ là sắp lịch. Đây là <br />
                  <GradientText>sắp lịch theo năng lượng</GradientText>
                </>
              }
              description="ChronoFlow được xây trên ý tưởng: hiệu suất tốt không chỉ đến từ kỷ luật, mà còn đến từ việc đặt đúng loại việc vào đúng thời điểm."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {principles.map((item, index) => (
                <SimpleMethodCard key={item.title} index={index} {...item} />
              ))}
            </div>

            <div className="mt-14 border-t border-[#EEF0F6] pt-12">
              <SectionHeading
                eyebrow="Ứng dụng thực tế"
                title={
                  <>
                    Các tác vụ <GradientText>điển hình</GradientText>
                  </>
                }
                description="Từ việc khó đến việc nhẹ, từ sáng tạo đến nghỉ ngắn — mỗi loại việc đều phù hợp ở một kiểu năng lượng khác nhau."
              />

              <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {useCases.map((item, index) => (
                  <UseCaseCard key={item.title} index={index} {...item} />
                ))}
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="faq">
            <SectionHeading
              eyebrow="Câu hỏi thường gặp"
              title={
                <>
                  Giải đáp nhanh trước khi <br />
                  <GradientText>bạn bắt đầu</GradientText>
                </>
              }
              description="Một vài câu hỏi phổ biến để người dùng hiểu rõ ChronoFlow hoạt động như thế nào và nên kỳ vọng điều gì."
            />

            <div className="mx-auto mt-12 max-w-[920px] space-y-3">
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
        <div className="absolute left-[10%] top-[-5%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/60 blur-[110px]" />
        <div className="absolute right-[-7%] top-[8%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/60 blur-[110px]" />
      </div>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white bg-white shadow-[0_22px_80px_rgba(26,21,40,0.06)] md:rounded-[48px]">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-5 pt-12 md:px-10 md:pt-16">
        <div className="relative z-20 mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Cơ chế hoạt động
          </div>

          <h1 className="mb-5 text-[clamp(2rem,4vw,4rem)] font-[900] leading-[1.02] tracking-tight text-[#1A1528]">
            Từ vài phút đánh giá, <br className="hidden sm:block" />
            <GradientText>đến lịch làm việc phù hợp</GradientText>
          </h1>

          <p className="mx-auto mb-8 max-w-[680px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16.5px]">
            ChronoFlow giúp bạn hiểu chronotype, nhìn thấy đường năng lượng trong ngày và chuyển insight đó thành gợi ý sắp xếp công việc, học tập và nghỉ ngơi hợp lý hơn.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/assessment"
              className="group flex min-h-[58px] items-center gap-3 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-black"
            >
              <Activity className="h-4 w-4 text-[#4DA8FF]" />
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
              href="/learn"
              className="group flex min-h-[58px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/85 px-6 py-3 text-[#1A1528] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F0FF]">
                <Play className="ml-0.5 h-3 w-3 fill-[#6F59FF] text-[#6F59FF]" />
              </div>
              <span className="text-[14px] font-bold leading-tight">
                Vào Learning Hub
              </span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-2 h-[350px] w-full max-w-[760px] md:h-[390px]">
          <div className="absolute left-[4%] top-14 z-10 hidden w-[210px] -rotate-8 opacity-90 sm:block">
            <MiniPhoneFrame>
              <QuizScreen compact />
            </MiniPhoneFrame>
          </div>

          <div className="absolute right-[4%] top-14 z-10 hidden w-[210px] rotate-8 opacity-90 sm:block">
            <MiniPhoneFrame>
              <TimelineScreen compact />
            </MiniPhoneFrame>
          </div>

          <div className="absolute left-1/2 top-2 z-20 w-[245px] -translate-x-1/2 md:w-[265px]">
            <MiniPhoneFrame featured>
              <ResultScreen compact />
            </MiniPhoneFrame>
          </div>
        </div>
      </div>

      <div className="grid gap-6 bg-white px-6 py-10 md:grid-cols-3 md:px-10 lg:px-14">
        <TopFeature
          icon={<ClipboardList className="h-5 w-5 text-[#6F59FF]" />}
          title="Thu thập dữ liệu đầu vào"
          description="Bài đánh giá ngắn ghi nhận thói quen ngủ nghỉ, thời điểm tỉnh táo và cảm nhận năng lượng."
        />
        <TopFeature
          icon={<Dna className="h-5 w-5 text-[#4DA8FF]" />}
          title="Phân tích hồ sơ cá nhân"
          description="ChronoFlow tạo chronotype profile và biểu đồ năng lượng dễ hiểu cho từng người dùng."
        />
        <TopFeature
          icon={<CalendarCheck2 className="h-5 w-5 text-[#10B981]" />}
          title="Gợi ý lịch trình thực tế"
          description="Insight được chuyển thành khung giờ cụ thể cho deep work, admin task, sáng tạo và recovery."
        />
      </div>
    </section>
  );
}

function SectionWrapper({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/62 px-5 py-12 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl md:px-10 md:py-16"
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
    <div className="mx-auto max-w-[880px] text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <div className="text-[clamp(2.05rem,4vw,3.55rem)] font-[900] leading-[1.07] tracking-tight text-[#1A1528]">
        {title}
      </div>
      <p className="mx-auto mt-4 max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
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

function StatCard({
  icon,
  label,
  value,
  text,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(26,21,40,0.07)]">
      <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${accent}`}>
        {icon}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[26px] font-[900] leading-none text-[#1A1528]">
        {value}
      </div>
      <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#5B566E]">
        {text}
      </p>
    </div>
  );
}

function TopFeature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="text-[17px] font-[900] leading-tight text-[#1A1528]">
          {title}
        </h4>
        <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          {description}
        </p>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[520px] w-[255px] overflow-hidden rounded-[44px] border-[12px] border-[#1A1528] bg-[#FCFBFF] shadow-[0_30px_80px_rgba(26,21,40,0.22)]">
      <div className="absolute left-1/2 top-0 z-30 flex h-7 w-30 -translate-x-1/2 items-center justify-center rounded-b-[12px] bg-[#1A1528]">
        <div className="h-1.5 w-9 rounded-full bg-[#2C2640]" />
      </div>
      <div className="h-full px-5 pb-6 pt-13">{children}</div>
    </div>
  );
}

function MiniPhoneFrame({ children, featured = false }: { children: ReactNode; featured?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[34px] border-[10px] border-[#1A1528] bg-[#FCFBFF] shadow-[0_28px_60px_rgba(26,21,40,0.18)] ${
        featured ? "ring-2 ring-white/70" : ""
      }`}
    >
      <div className="absolute left-1/2 top-0 z-20 flex h-6 w-24 -translate-x-1/2 items-center justify-center rounded-b-[12px] bg-[#1A1528]">
        <div className="h-1.5 w-8 rounded-full bg-[#2C2640]" />
      </div>
      <div className="min-h-[300px] p-4 pt-10">{children}</div>
    </div>
  );
}

function QuizScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <ArrowRight className="h-4 w-4 rotate-180 text-[#9CA3AF]" />
        <div className="text-[10px] font-bold text-[#9CA3AF]">1/5</div>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-[#EEF0F6]">
        <div className="h-full w-1/5 rounded-full bg-[#6F59FF]" />
      </div>

      <h3 className={`${compact ? "text-[15px]" : "text-[17px]"} font-[900] leading-tight text-[#1A1528]`}>
        Thời điểm bạn tỉnh táo nhất là khi nào?
      </h3>
      <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#5B566E]">
        Theo thói quen tự nhiên của bạn.
      </p>

      <div className="mt-5 space-y-3">
        <Option active text="Sáng sớm trước 9h" />
        <Option text="Cuối buổi sáng" />
        <Option text="Chiều muộn / tối" />
      </div>
    </div>
  );
}

function Option({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-3 text-[12px] font-bold ${
        active
          ? "border-[#6F59FF] bg-[#F3F0FF] text-[#6F59FF]"
          : "border-[#EEF0F6] bg-white text-[#5B566E]"
      }`}
    >
      {text}
    </div>
  );
}

function ResultScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center text-center">
      <div className="mb-5 text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        Kết quả chronotype
      </div>

      <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-[28px] border border-[#FDE68A] bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] shadow-inner">
        <span className="text-[46px]">🐻</span>
      </div>

      <div className={`${compact ? "text-[20px]" : "text-[24px]"} font-[900] text-[#1A1528]`}>
        Bạn là Gấu
      </div>
      <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#615C7A]">
        Năng lượng mạnh từ sáng đến trưa và giảm dần về chiều.
      </p>

      <div className="mt-6 w-full rounded-2xl border border-[#DDEEFF] bg-[#EEF6FF] p-4 text-center shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#4DA8FF]">
          Peak focus
        </div>
        <div className="mt-1 text-[18px] font-black text-[#3B82F6]">
          09:00 - 12:00
        </div>
      </div>

      {!compact && (
        <div className="mt-4 w-full rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] p-4 text-left">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
            Gợi ý chính
          </div>
          <p className="text-[12px] font-medium leading-relaxed text-[#5B566E]">
            Đặt việc khó vào buổi sáng, việc nhẹ sau trưa và recovery vào cuối chiều.
          </p>
        </div>
      )}
    </div>
  );
}

function TimelineScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
            Lịch hôm nay
          </div>
          <div className={`${compact ? "text-[17px]" : "text-[19px]"} mt-1 font-[900] text-[#1A1528]`}>
            Timeline gợi ý
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#F3F0FF] text-[#6F59FF] shadow-sm">
          <Clock3 className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3">
        <PhoneScheduleItem time="09:00" title="Deep Work" tone="purple" />
        <PhoneScheduleItem time="13:00" title="Admin / Email" tone="blue" />
        <PhoneScheduleItem time="15:30" title="Recovery" tone="green" />
        {!compact && <PhoneScheduleItem time="16:30" title="Creative" tone="orange" />}
      </div>
    </div>
  );
}

function TrackingScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-5">
        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
          Weekly review
        </div>
        <div className="mt-1 text-[20px] font-[900] text-[#1A1528]">
          Theo dõi tiến bộ
        </div>
      </div>

      <div className="rounded-[24px] bg-[#1A1528] p-4 text-white shadow-[0_18px_38px_rgba(26,21,40,0.18)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.13em] text-white/45">
              Focus tuần này
            </div>
            <div className="mt-2 text-[30px] font-[900] leading-none">8.2h</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <TrendingUp className="h-5 w-5 text-[#AFA4FF]" />
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniMetric value="5" label="Streak" />
        <MiniMetric value="+145" label="Coin" />
      </div>

      <div className="mt-4 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] p-4">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#F59E0B]">
          Gợi ý tuần sau
        </div>
        <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#5B566E]">
          Giữ deep work buổi sáng và thêm recovery sau 15:00 để giảm tụt năng lượng.
        </p>
      </div>
    </div>
  );
}

function PhoneScheduleItem({
  time,
  title,
  tone,
}: {
  time: string;
  title: string;
  tone: "purple" | "blue" | "green" | "orange";
}) {
  const toneClass = {
    purple: "border-[#E9E5FF] bg-[#F3F0FF] text-[#6F59FF]",
    blue: "border-[#DDEEFF] bg-[#EEF6FF] text-[#4DA8FF]",
    green: "border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]",
    orange: "border-[#FED7AA] bg-[#FFF7ED] text-[#F59E0B]",
  }[tone];

  return (
    <div className={`rounded-2xl border p-3 shadow-sm ${toneClass}`}>
      <div className="text-[10px] font-black uppercase tracking-[0.14em] opacity-70">
        {time}
      </div>
      <div className="mt-1 text-[13px] font-[900] text-[#1A1528]">{title}</div>
    </div>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#EEF0F6] bg-white p-3 text-center shadow-sm">
      <div className="text-[18px] font-[900] text-[#1A1528]">{value}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
        {label}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
  icon,
  accent,
  border,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
  border: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${accent} ${border}`}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/55 blur-3xl" />
      <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        {icon}
      </div>
      <h3 className="relative z-10 text-[19px] font-[900] leading-tight text-[#1A1528]">
        {title}
      </h3>
      <p className="relative z-10 mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
    </div>
  );
}

function TimelineRow({
  label,
  icon,
  color,
  dot,
  bar,
  blocks,
}: {
  label: string;
  icon: ReactNode;
  color: string;
  dot: string;
  bar: string;
  blocks: { time: string; width: string; title: string }[];
}) {
  return (
    <div className="grid gap-5 rounded-[26px] border border-[#EEF0F6] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(26,21,40,0.07)] md:grid-cols-[220px_1fr] md:items-center">
      <div className="flex items-center gap-4">
        <div className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#F8F9FE] ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-[16px] font-[900] text-[#1A1528]">{label}</div>
          <div className="mt-0.5 text-[13px] font-medium text-[#8A84A3]">
            Phân bổ theo khung giờ
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {blocks.map((block) => (
          <div key={`${label}-${block.time}-${block.title}`} className="flex items-center gap-3">
            <div className="w-[56px] text-right text-[12px] font-bold text-[#8A84A3]">
              {block.time}
            </div>
            <div className="flex-1 rounded-full bg-[#F1F5F9] p-1.5 shadow-inner">
              <div
                className={`flex h-10 min-w-[120px] items-center rounded-full bg-gradient-to-r px-4 shadow-sm ${bar}`}
                style={{ width: block.width }}
              >
                <span className={`mr-2.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                <span className="truncate text-[12.5px] font-[900] text-[#1A1528]">
                  {block.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoCard({
  type,
  title,
  description,
  src,
}: {
  type: "desktop" | "mobile";
  title: string;
  description: string;
  src: string;
}) {
  const Icon = type === "desktop" ? Monitor : Smartphone;

  if (type === "mobile") {
    return (
      <div className="mx-auto flex max-w-[330px] flex-col items-center gap-5">
        <DeviceLabel icon={<Icon className="h-4 w-4 text-[#4DA8FF]" />} title={title} />
        <div className="relative h-[560px] w-[280px] overflow-hidden rounded-[42px] border-[12px] border-[#1A1528] bg-[#FCFBFF] shadow-[0_30px_80px_rgba(26,21,40,0.22)]">
          <div className="absolute left-1/2 top-0 z-20 flex h-7 w-28 -translate-x-1/2 items-center justify-center rounded-b-[12px] bg-[#1A1528]">
            <div className="h-1.5 w-10 rounded-full bg-[#2C2640]" />
          </div>
          <iframe
            className="h-full w-full pt-7"
            src={src}
            title="ChronoFlow mobile guide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-center text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[34px] border border-white bg-white/72 p-5 shadow-[0_20px_55px_rgba(26,21,40,0.08)] backdrop-blur-xl">
      <DeviceLabel icon={<Icon className="h-4 w-4 text-[#6F59FF]" />} title={title} />
      <div className="mt-5 overflow-hidden rounded-[24px] border border-[#E9E5FF] bg-[#FCFBFF] shadow-sm">
        <iframe
          className="aspect-video w-full"
          src={src}
          title="ChronoFlow desktop guide"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="mt-5 text-[14px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
    </div>
  );
}

function DeviceLabel({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#EEF0F6] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#64748B] shadow-sm">
      {icon}
      {title}
    </div>
  );
}

function SimpleMethodCard({
  title,
  text,
  icon,
  index,
}: {
  title: string;
  text: string;
  icon: ReactNode;
  index: number;
}) {
  const styles = [
    "from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF] border-[#D6CBFF]",
    "from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF] border-[#BFDDFF]",
    "from-[#FFF8F0] via-[#FFEDD6] to-[#FFE0B2] border-[#FCD34D]",
  ];

  return (
    <div className={`rounded-[28px] border bg-gradient-to-br p-6 shadow-[0_18px_45px_rgba(26,21,40,0.05)] ${styles[index]}`}>
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        {icon}
      </div>
      <h3 className="text-[19px] font-[900] leading-tight text-[#1A1528]">{title}</h3>
      <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {text}
      </p>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  index: number;
}) {
  const styles = [
    "from-[#F5F3FF] via-[#EBE4FF] to-[#DED6FF] border-[#D6CBFF]",
    "from-[#F0F7FF] via-[#E0EFFF] to-[#CBE4FF] border-[#BFDDFF]",
    "from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] border-[#6EE7B7]",
    "from-[#FFF8F0] via-[#FFEDD6] to-[#FFE0B2] border-[#FCD34D]",
  ];

  return (
    <div className={`rounded-[26px] border bg-gradient-to-br p-5 shadow-[0_16px_38px_rgba(26,21,40,0.05)] transition-all duration-300 hover:-translate-y-1 ${styles[index]}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
        {icon}
      </div>
      <h3 className="text-[17px] font-[900] leading-tight text-[#1A1528]">{title}</h3>
      <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
    </div>
  );
}

function FAQItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/82 shadow-sm backdrop-blur-xl">
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
