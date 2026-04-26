"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarClock,
  Clock3,
  Coffee,
  ExternalLink,
  LineChart,
  Mail,
  Moon,
  MoonStar,
  Palette,
  Play,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunset,
  Waves,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTASection from "@/components/home/FinalCTASection";

type ChronotypeKey = "lion" | "bear" | "wolf" | "dolphin";

const sleepDoctorVideos = [
  {
    title: "How to sleep better by knowing your chronotype",
    embedUrl: "https://www.youtube.com/embed/XDfNLw1W6FA",
    youtubeUrl: "https://www.youtube.com/watch?v=XDfNLw1W6FA",
    tag: "Chronotype basics",
  },
  {
    title: "Sleep Chronotypes with the Sleep Doctor",
    embedUrl: "https://www.youtube.com/embed/bCZ3fOqXAMY",
    youtubeUrl: "https://www.youtube.com/watch?v=bCZ3fOqXAMY",
    tag: "Overview",
  },
  {
    title: "A sleep doctor answers your questions about chronotypes",
    embedUrl: "https://www.youtube.com/embed/IiuxBI6eRcM",
    youtubeUrl: "https://www.youtube.com/watch?v=IiuxBI6eRcM",
    tag: "Q&A",
  },
  {
    title: "The truth about the Lion chronotype",
    embedUrl: "https://www.youtube.com/embed/X9iKSR9phNY",
    youtubeUrl: "https://www.youtube.com/watch?v=X9iKSR9phNY",
    tag: "Lion",
  },
  {
    title: "Wolf chronotypes NEED to stop making this same mistake",
    embedUrl: "https://www.youtube.com/embed/OdmZaL1-MV8",
    youtubeUrl: "https://www.youtube.com/watch?v=OdmZaL1-MV8",
    tag: "Wolf",
  },
  {
    title: "My Favorite Tips For Better Sleep [Dolphin Chronotype]",
    embedUrl: "https://www.youtube.com/embed/9317HrSl40k",
    youtubeUrl: "https://www.youtube.com/watch?v=9317HrSl40k",
    tag: "Dolphin",
  },
];

const chronotypes = [
  {
    name: "Lion",
    viName: "Sư tử",
    icon: <Sun className="h-6 w-6 text-[#C98C42]" />,
    accent: "text-[#B7772E]",
    bg: "from-[#FFF9F0] via-[#FDF2E9] to-[#FFF1E0]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",
    description: "Dễ tỉnh táo vào buổi sáng, rõ đầu sớm và thường hụt năng lượng hơn về cuối ngày.",
    bestTime: "07:00 – 11:00",
    bestFor: ["Deep Work", "Ra quyết định", "Phân tích"],
    glow: "shadow-[#C98C42]/20"
  },
  {
    name: "Bear",
    viName: "Gấu",
    icon: <Sunset className="h-6 w-6 text-[#6C58F2]" />,
    accent: "text-[#6C58F2]",
    bg: "from-[#F8F7FF] via-[#E9E4FF] to-[#DFD9FF]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png",
    description: "Đi theo nhịp mặt trời tự nhiên hơn, ổn định vào buổi sáng và giảm nhẹ sau đó.",
    bestTime: "09:00 – 14:00",
    bestFor: ["Việc vận hành", "Họp hành", "Hợp tác"],
    glow: "shadow-[#6C58F2]/20"
  },
  {
    name: "Wolf",
    viName: "Sói",
    icon: <Moon className="h-6 w-6 text-[#5B46FF]" />,
    accent: "text-[#5B46FF]",
    bg: "from-[#F5F5FF] via-[#E2E1FF] to-[#D6D4FF]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png",
    description: "Khởi động chậm hơn, nhưng tập trung, sáng tạo và động lực thường đến muộn hơn trong ngày.",
    bestTime: "15:00 – 21:00",
    bestFor: ["Sáng tạo", "Lên ý tưởng", "Học sâu"],
    glow: "shadow-[#5B46FF]/20"
  },
  {
    name: "Dolphin",
    viName: "Cá heo",
    icon: <Waves className="h-6 w-6 text-[#8A7AF0]" />,
    accent: "text-[#8A7AF0]",
    bg: "from-[#F9F8FF] via-[#EBE6FF] to-[#E2DAFF]",
    emoji: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    description: "Nhịp kém ổn định hơn và thường phù hợp với cách tổ chức linh hoạt, nhẹ nhàng hơn.",
    bestTime: "Linh hoạt (Sprint)",
    bestFor: ["Task ngắn", "Đa nhiệm", "Xử lý vấn đề"],
    glow: "shadow-[#8A7AF0]/20"
  },
];

const applicationCards = [
  {
    icon: <Brain className="h-5 w-5 text-[#6F59FF]" />,
    title: "Deep work",
    description:
      "Đặt việc khó vào khung đầu mạnh nhất để giảm ma sát khởi động và tăng chất lượng tập trung.",
    badge: "Nhận thức cao",
    accent: "from-[#F5F2FF] via-[#EEE8FF] to-[#E5DCFF]",
    border: "border-[#D9CEFF]",
  },
  {
    icon: <Mail className="h-5 w-5 text-[#4DA8FF]" />,
    title: "Email / admin",
    description:
      "Task lặp lại hoặc phản hồi nhanh hợp hơn ở giai đoạn năng lượng vừa phải.",
    badge: "Ổn định vừa",
    accent: "from-[#EFF6FF] via-[#E5F1FF] to-[#D8EBFF]",
    border: "border-[#C7E0FF]",
  },
  {
    icon: <Palette className="h-5 w-5 text-[#E39B27]" />,
    title: "Creative work",
    description:
      "Không phải ai cũng sáng tạo nhất vào buổi sáng. Có người bật ý tưởng mạnh hơn về chiều hoặc tối.",
    badge: "Sáng tạo",
    accent: "from-[#FFF8ED] via-[#FFF0D8] to-[#FFE5B5]",
    border: "border-[#FFD38C]",
  },
  {
    icon: <Coffee className="h-5 w-5 text-[#1FAE8A]" />,
    title: "Recovery",
    description:
      "Nghỉ, đi bộ ngắn, reset đầu óc đúng lúc giúp lịch làm việc bền hơn thay vì chỉ cố kéo dài.",
    badge: "Hồi phục",
    accent: "from-[#ECFCF7] via-[#DDF8EF] to-[#C8F2E4]",
    border: "border-[#B6EED8]",
  },
];

const quickWins = [
  {
    icon: <Brain className="h-5 w-5 text-[#6F59FF]" />,
    title: "Đặt việc khó vào giờ đầu mạnh nhất",
    text: "Đừng tiêu khung tỉnh táo nhất cho email hay chat lặt vặt.",
    tone: "from-[#F5F1FF] to-[#ECE5FF]",
    border: "border-[#D8CCFF]",
  },
  {
    icon: <Mail className="h-5 w-5 text-[#4DA8FF]" />,
    title: "Gom việc admin vào một cụm",
    text: "Email, checklist, cập nhật tài liệu nên vào giai đoạn năng lượng trung bình.",
    tone: "from-[#EFF7FF] to-[#E0EEFF]",
    border: "border-[#C7E0FF]",
  },
  {
    icon: <Coffee className="h-5 w-5 text-[#16A085]" />,
    title: "Nghỉ đúng lúc thay vì cố lì",
    text: "Một khoảng nghỉ ngắn đúng thời điểm thường hiệu quả hơn ép thêm 45 phút.",
    tone: "from-[#ECFCF7] to-[#D7F7EC]",
    border: "border-[#B7EFD9]",
  },
];

const resources = [
  {
    title: "Chronotype là gì?",
    description:
      "Giải thích khái niệm chronotype và vì sao mỗi người không đạt đỉnh năng lượng vào cùng một thời điểm.",
    href: "/learn/chronotype-basics",
    tag: "Nội bộ",
  },
  {
    title: "Circadian rhythm dễ hiểu",
    description:
      "Hiểu nhịp sinh học trong ngày và mối liên hệ giữa tỉnh táo, tập trung, phục hồi.",
    href: "/learn/circadian-rhythm",
    tag: "Nội bộ",
  },
  {
    title: "Lập kế hoạch theo nhịp",
    description:
      "Cách đặt việc khó, việc nhẹ, sáng tạo và nghỉ ngắn theo đúng cửa sổ năng lượng hơn.",
    href: "/learn/rhythm-based-planning",
    tag: "Nội bộ",
  },
  {
    title: "Sleep Foundation",
    description:
      "Nguồn đọc ngoài dễ tiếp cận nếu bạn muốn tìm hiểu rộng hơn về giấc ngủ và nhịp sinh học.",
    href: "https://www.sleepfoundation.org/",
    tag: "Nguồn ngoài",
  },
  {
    title: "NHLBI - Sleep health",
    description:
      "Tài liệu nền đáng tin cậy về sức khỏe giấc ngủ và các khái niệm quan trọng liên quan.",
    href: "https://www.nhlbi.nih.gov/health/sleep",
    tag: "Nguồn ngoài",
  },
  {
    title: "Circadian rhythms background",
    description:
      "Thông tin tổng quan để hiểu vì sao nhịp sinh học ảnh hưởng đến hiệu suất hàng ngày.",
    href: "https://www.nigms.nih.gov/education/fact-sheets/Pages/circadian-rhythms.aspx",
    tag: "Nguồn ngoài",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <main className="relative flex flex-col gap-12 overflow-hidden bg-slate-50 pt-0 pb-28 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
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

         {/* HERO */}
         <section className="relative z-10 px-4 pb-14 pt-0 lg:px-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
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

                <div className="relative z-30 mx-auto max-w-4xl text-center">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Thư viện kiến thức
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="mb-4 text-[clamp(2.4rem,4.8vw,4.6rem)] font-[950] leading-[1.02] tracking-tight text-[#1A1528]"
                  >
                    <h1 className="mb-4 text-[clamp(2.2rem,4vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                    Hiểu nhịp của bạn, <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  lập kế hoạch tốt hơn.
                  </span>
                </h1>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    className="mx-auto mb-8 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]"
                  >
                    ChronoFlow không chỉ là công cụ sắp lịch. Đây còn là nơi giúp
                    bạn hiểu chronotype, nhịp sinh học và lý do vì sao cùng một lịch
                    nhưng hiệu quả ở mỗi người lại khác nhau.
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
                          Bắt đầu bài đánh giá
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/how-it-works"
                      className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                        <Play className="ml-0.5 h-3 w-3 fill-[#6F59FF] text-[#6F59FF]" />
                      </div>
                      <span className="text-[14px] font-bold leading-tight">
                        Xem cách hoạt động
                      </span>
                    </Link>
                  </motion.div>
                </div>

                <div className="relative mx-auto mt-2 h-[360px] w-full max-w-[760px] perspective-[1400px] sm:h-[390px]">
                  <div className="absolute left-[4%] top-[10%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                    <FloatPill
                      icon={<MoonStar className="h-3.5 w-3.5" />}
                      label="Chronotype basics"
                      tint="purple"
                    />
                  </div>

                  <div className="absolute right-[4%] top-[8%] z-40 hidden animate-[bounce_4.6s_infinite] sm:block">
                    <FloatPill
                      icon={<LineChart className="h-3.5 w-3.5" />}
                      label="Energy curve"
                      tint="orange"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -40, y: 30, rotate: -10 }}
                    animate={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -10, rotate: -6, scale: 1.02 }}
                    className="absolute left-[3%] top-14 z-20 w-[190px] rounded-[32px] shadow-2xl sm:left-[6%] sm:w-[220px]"
                  >
                    <PhoneFrame>
                      <LearnConceptPhone />
                    </PhoneFrame>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 70, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="absolute left-1/2 top-3 z-30 w-[220px] -translate-x-1/2 rounded-[38px] shadow-[0_45px_90px_rgba(26,21,40,0.28)] sm:w-[245px]"
                  >
                    <PhoneFrame >
                      <LearnCorePhone />
                    </PhoneFrame>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 40, y: 30, rotate: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -10, rotate: 6, scale: 1.02 }}
                    className="absolute right-[3%] top-14 z-20 w-[190px] rounded-[32px] shadow-2xl sm:right-[6%] sm:w-[220px]"
                  >
                    <PhoneFrame>
                      <LearnApplicationPhone />
                    </PhoneFrame>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] space-y-12 px-4 lg:px-8">
          <SectionWrapper id="intro">
            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                  <BookOpen className="h-3.5 w-3.5" />
                  Chronotype là gì?
                </div>

                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                Chronotype là cách cơ thể{" "}
            
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  phân bổ năng lượng trong ngày
                  </span>
                  </h2>

                <p className="mt-5 max-w-[58ch] text-[1rem] leading-8 text-[#615C7A]">
                  Khi hiểu chronotype và nhịp sinh học, bạn sẽ dễ nhìn lại lịch của
                  mình với ít cảm giác tự trách hơn. Mục tiêu không phải là tối ưu
                  từng phút, mà là xây dựng một cách làm việc hợp cơ thể hơn.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge icon={<Brain className="h-4 w-4 text-[#6F59FF]" />}>
                    Hiểu mình rõ hơn
                  </Badge>
                  <Badge icon={<Clock3 className="h-4 w-4 text-[#4DA8FF]" />}>
                    Đặt việc đúng lúc
                  </Badge>
                  <Badge icon={<ShieldCheck className="h-4 w-4 text-[#16A085]" />}>
                    Kế hoạch bền hơn
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <InsightBox
                  title="ChronoFlow là gì?"
                  text="Một framework giúp bạn nhìn timing, năng lượng và hồi phục dưới góc độ thực tế hơn."
                  icon={<Waves className="h-4 w-4 text-[#6F59FF]" />}
                  bg="bg-[#F3F0FF]"
                />
                <InsightBox
                  title="Điểm khác biệt"
                  text="Không ép bạn theo lịch mẫu, mà giúp bạn hiểu nhịp thật của mình trước."
                  icon={<ShieldCheck className="h-4 w-4 text-[#4DA8FF]" />}
                  bg="bg-[#EEF6FF]"
                />
                <InsightBox
                  title="Ý nghĩa thực tế"
                  text="Cùng một lịch làm việc không phù hợp với tất cả mọi người. Timing mới là phần quan trọng."
                  icon={<CalendarClock className="h-4 w-4 text-[#16A085]" />}
                  bg="bg-[#ECFBF7]"
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="videos">
            <SectionHeading
              eyebrow="Video hub"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Học nhanh bằng video{" "}
                  <br/>
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    rồi áp dụng vào Chronoflow
                  </span>
                  </h2>
              }
              description="Video từ Sleep Doctor để bạn có thêm phần nền tảng trước khi áp vào flow sử dụng sản phẩm."
            />

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sleepDoctorVideos.map((video, index) => (
                <motion.div
                  key={video.youtubeUrl}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="overflow-hidden rounded-[28px] border border-[#ECE8FF] bg-[#FCFBFF] shadow-[0_15px_40px_rgba(26,21,40,0.04)]"
                >
                  <div className="aspect-video w-full overflow-hidden bg-[#EEE9FF]">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-3 inline-flex rounded-full border border-[#E9E5FF] bg-[#F6F3FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                      {video.tag}
                    </div>

                    <h3 className="text-[16px] font-[900] leading-snug text-[#1A1528]">
                      {video.title}
                    </h3>

                    <Link
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#4F46E5]"
                    >
                      Xem trên YouTube
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

         {/* ========================================== */}
          {/* ENERGY CURVE */}
          {/* ========================================== */}
          <SectionWrapper id="energy-curve">
            <SectionHeading
              eyebrow="Energy curve"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                Năng lượng không giữ nguyên. Nó{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  lên xuống theo nhịp.
                  </span>
                  </h2>
              }
              description="Đây là ý tưởng cốt lõi của ChronoFlow: không phải khung giờ nào cũng hợp cho mọi loại việc. Hãy xem 4 nhóm có đỉnh năng lượng khác nhau thế nào."
            />

            <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              {/* Biểu đồ 4 đường */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="overflow-hidden rounded-[32px] border border-white/80 bg-white/50 p-6 shadow-[0_20px_50px_rgba(26,21,40,0.05)] backdrop-blur-xl ring-1 ring-gray-100"
              >
                <div className="mb-6 flex flex-wrap items-center gap-4 text-[12px] font-bold">
                  <div className="flex items-center gap-1.5"><div className="h-2 w-4 rounded-full bg-[#F59E0B]" /> Lion</div>
                  <div className="flex items-center gap-1.5"><div className="h-2 w-4 rounded-full bg-[#6F59FF]" /> Bear</div>
                  <div className="flex items-center gap-1.5"><div className="h-2 w-4 rounded-full bg-[#4DA8FF]" /> Wolf</div>
                  <div className="flex items-center gap-1.5"><div className="h-2 w-4 rounded-full bg-[#10B981]" /> Dolphin</div>
                </div>
                
                <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-[320px]">
                  <EnergyGraph />
                </div>
              </motion.div>

              {/* Text Insights */}
              <div className="space-y-5">
                <InsightBox
                  title="Cùng một lịch, hiệu quả có thể khác"
                  text="Người buổi sáng và người buổi tối không nên bị ép vào cùng một mô hình năng suất."
                  icon={<LineChart className="h-5 w-5 text-[#6F59FF]" />}
                  bg="bg-[#F3F0FF]"
                />
                <InsightBox
                  title="Đừng đốt giờ mạnh nhất cho việc nhẹ"
                  text="Nếu khung tập trung tốt nhất của bạn bị tiêu vào email hay chat, cả ngày sẽ có cảm giác bị hụt."
                  icon={<Brain className="h-5 w-5 text-[#4DA8FF]" />}
                  bg="bg-[#EEF6FF]"
                />
                <InsightBox
                  title="Nghỉ đúng lúc cũng là chiến lược"
                  text="Hiệu suất bền hơn không đến từ ép thêm, mà đến từ sắp đúng và hồi phục đúng."
                  icon={<Coffee className="h-5 w-5 text-[#16A085]" />}
                  bg="bg-[#ECFBF7]"
                />
              </div>
            </div>
          </SectionWrapper>

          {/* ========================================== */}
          {/* CHRONOTYPES */}
          {/* ========================================== */}
          <SectionWrapper id="chronotypes">
            <SectionHeading
              eyebrow="4 chronotype phổ biến"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                4 kiểu {" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  chronotype thường gặp
                  </span>
                  </h2>
              }
              description="Chronotype không dùng để dán nhãn cố định, mà giúp giải thích vì sao thời điểm tỉnh táo, tập trung và hồi phục của mỗi người lại khác nhau."
            />

            <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {chronotypes.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative flex flex-col rounded-[32px] border border-white/80 bg-white/70 p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-white hover:shadow-[0_25px_50px_rgba(111,89,255,0.08)]"
                >
                  {/* Nền gradient nhẹ nhẹ cho từng thẻ */}
                  <div className={`absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br ${item.bg} opacity-40 transition-opacity duration-300 group-hover:opacity-80`} />

                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <div className="rounded-full border border-white bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md">
                      {item.name}
                    </div>
                  </div>

                  <div className="mb-6 flex justify-center">
                    <motion.img
                      src={item.emoji}
                      alt={item.viName}
                      className="h-[84px] w-[84px] object-contain drop-shadow-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110"
                    />
                  </div>

                  <div className="text-center flex-1">
                    <h3 className={`text-[24px] font-[900] tracking-tight ${item.accent}`}>
                      {item.viName}
                    </h3>
                    <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#5B566E]">
                      {item.description}
                    </p>
                  </div>

                  {/* Thông tin Focus & Best For */}
                  {(item as any).bestTime && (
                    <div className="mt-6 rounded-[20px] border border-white/60 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:bg-white/90">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        Khung tập trung
                      </div>
                      <div className="mt-1 text-[14px] font-bold text-[#1A1528]">
                        {(item as any).bestTime}
                      </div>

                      <div className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        Hợp với
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {((item as any).bestFor || []).map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-md border border-[#EAE8F7] bg-white px-2 py-1 text-[11px] font-bold text-[#5E587A]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="apply">
            <SectionHeading
              eyebrow="Áp dụng vào công việc"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                Biến kiến thức trở thành{" "}
                <br/>
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  lịch làm việc thực tế
                  </span>
                  </h2>
              }
              description="Điểm khác biệt của ChronoFlow không nằm ở việc giải thích hay, mà ở chỗ giúp bạn dùng nó để sắp ngày của mình."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {applicationCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -8, scale: 1.015 }}
                  className={`group relative rounded-[32px] border ${item.border} bg-gradient-to-br ${item.accent} p-[1px] transition-all duration-300 hover:shadow-[0_25px_50px_rgba(26,21,40,0.08)]`}
                >
                  <div className="h-full rounded-[31px] bg-white/88 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-[0_10px_24px_rgba(26,21,40,0.06)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {item.icon}
                      </div>
                      <div className="rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#7A70A0]">
                        {item.badge}
                      </div>
                    </div>

                    <h3 className="text-[20px] font-[900] leading-tight text-[#1A1528]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-[15px] leading-8 text-[#615C7A]">
                      {item.description}
                    </p>

                    <div className="mt-6 h-1 w-14 rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] transition-all duration-300 group-hover:w-24" />
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="quick-wins">
            <SectionHeading
              eyebrow="Quick wins"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                3 cách{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  áp dụng ngay
                  </span>
                  </h2>
              }
              description="ChronoFlow không yêu cầu bạn sống hoàn hảo. Chỉ cần chỉnh vài quyết định nhỏ theo nhịp của mình đã đủ tạo khác biệt."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {quickWins.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className={`rounded-[30px] border ${item.border} bg-gradient-to-br ${item.tone} p-5 shadow-[0_18px_40px_rgba(26,21,40,0.04)]`}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-[1.1rem] font-[900] tracking-tight text-[#1A1528]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="resources">
            <SectionHeading
              eyebrow="Reading hub"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Nền tảng khoa học
                 <br/>
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    đáng tin cậy
                  </span>
                  </h2>
              }
              description="Bạn có thể bắt đầu từ bài viết nội bộ trong ChronoFlow rồi mở rộng sang nguồn ngoài đáng tin cậy."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((item, index) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                      className="group block rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)] transition-all duration-200 hover:shadow-[0_22px_48px_rgba(26,21,40,0.08)]"
                    >
                      <div className="mb-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                        {item.tag}
                      </div>

                      <h3 className="text-[1.08rem] font-black tracking-tight text-[#241F3D] group-hover:text-[#6F59FF]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
                        {item.description}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#4F46E5]">
                        Xem thêm
                        {isExternal ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
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

function SectionWrapper({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(246,247,255,0.64)_100%)] px-6 py-10 shadow-[0_24px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:px-10 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-0 h-[180px] w-[180px] rounded-full bg-white/35 blur-[70px]" />
        <div className="absolute right-[-4%] bottom-0 h-[220px] w-[220px] rounded-full bg-[#D8E8FF]/30 blur-[80px]" />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-[1.08] tracking-tight text-[#241F3D]">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
        {description}
      </p>
    </div>
  );
}

function Badge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/82 px-4 py-2 text-sm text-[#4F4A68] shadow-[0_8px_24px_rgba(36,31,61,0.04)]">
      {icon}
      {children}
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
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
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



function LegendDot({
  x,
  y,
  color,
  label,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
}) {
  return (
    <>
      <circle cx={x} cy={y} r="6" fill={color} />
      <text x={x + 14} y={y + 4} fontSize="13" fill="#5C627A">
        {label}
      </text>
    </>
  );
}
function FloatPill({
  icon,
  label,
  tint = "purple",
}: {
  icon: React.ReactNode;
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

function PhoneFrame({
  children,
  large = false,
  screenClassName = "",
}: {
  children: React.ReactNode;
  large?: boolean;
  screenClassName?: string;
}) {
  return (
    <div
      className={`relative rounded-[2.8rem] border border-[#1A1528]/10 bg-[#151122] p-2.5 shadow-[0_25px_60px_rgba(26,21,40,0.24)] ${
        large ? "w-[235px] md:w-[255px]" : "w-[185px] md:w-[205px]"
      }`}
    >
      <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black/80" />
      <div
        className={`overflow-hidden rounded-[2.2rem] border border-white/10 ${screenClassName}`}
      >
        <div className={`${large ? "h-[470px]" : "h-[380px]"}`}>{children}</div>
      </div>
    </div>
  );
}

function LearnConceptPhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#F8F5FF_0%,#F2EDFF_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
            Learn basics
          </div>
          <div className="text-[15px] font-[900] leading-tight">
            Chronotype là gì?
          </div>
        </div>
        <div className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#6F59FF] shadow-sm">
          Starter
        </div>
      </div>

      <div className="rounded-[18px] border border-white/70 bg-white/85 p-3 shadow-sm">
        <div className="mb-2 text-[11px] font-[900] text-[#1A1528]">
          Mỗi người có nhịp năng lượng khác nhau
        </div>
        <p className="text-[11px] leading-relaxed text-[#5B566E]">
          Có người tỉnh táo sớm, có người mạnh hơn vào chiều hoặc tối. Chronotype
          giúp giải thích vì sao cùng một lịch không hợp với tất cả mọi người.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MiniChip label="Timing" value="Quan trọng" />
        <MiniChip label="Energy" value="Lên/xuống" />
      </div>

      <div className="mt-auto rounded-[18px] bg-[#1A1528] p-3 text-white shadow-lg">
        <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-gray-400">
          Key idea
        </div>
        <div className="text-[12px] font-bold leading-snug">
          Bạn không cần ép bản thân theo một lịch chung.
        </div>
      </div>
    </div>
  );
}

function LearnCorePhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#F7FAFF_0%,#EFF5FF_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7B87A7]">
            Core concept
          </div>
          <div className="text-[17px] font-[900] leading-tight">
            Energy curve
          </div>
        </div>
        <div className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#4DA8FF] shadow-sm">
          Daily
        </div>
      </div>

      <div className="mb-3 rounded-[20px] border border-white/80 bg-white/90 p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-[900] text-[#1A1528]">
            Năng lượng trong ngày
          </span>
          <span className="rounded-full bg-[#EEF6FF] px-2 py-1 text-[9px] font-bold text-[#4DA8FF]">
            Curve
          </span>
        </div>

        <div className="h-[92px] overflow-hidden rounded-[14px] bg-[#F8FAFF] px-2 py-2">
          <svg viewBox="0 0 210 80" className="h-full w-full">
            <line x1="10" y1="64" x2="200" y2="64" stroke="#D7DEEF" strokeWidth="2" />
            <path
              d="M10 58 C35 50, 55 34, 78 28 C100 22, 118 24, 140 34 C160 42, 178 51, 200 60"
              fill="none"
              stroke="#6F59FF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="78" cy="28" r="4" fill="#6F59FF" />
          </svg>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[#8A84A3]">
          <span>6h</span>
          <span>9h</span>
          <span>12h</span>
          <span>15h</span>
          <span>18h</span>
        </div>
      </div>

      <div className="rounded-[18px] border border-white/80 bg-white/90 p-3 shadow-sm">
        <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#8A84A3]">
          Insight
        </div>
        <div className="text-[11px] font-semibold leading-relaxed text-[#4B5563]">
          Khung mạnh nhất không giống nhau giữa các chronotype.
        </div>
      </div>
    </div>
  );
}

function LearnApplicationPhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#FFF9F2_0%,#FFF4E8_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A7B56]">
            Application
          </div>
          <div className="text-[15px] font-[900] leading-tight">
            Đặt việc đúng lúc
          </div>
        </div>
        <div className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#F59E0B] shadow-sm">
          Practical
        </div>
      </div>

      <div className="space-y-2">
        <ScheduleItem
          time="09:00"
          title="Deep work"
          meta="Việc khó / cần tập trung"
          color="purple"
        />
        <ScheduleItem
          time="13:30"
          title="Email & admin"
          meta="Task đều tay / phản hồi"
          color="blue"
        />
        <ScheduleItem
          time="16:30"
          title="Recovery break"
          meta="Đi bộ ngắn / reset đầu óc"
          color="green"
        />
      </div>

      <div className="mt-auto rounded-[18px] border border-white/80 bg-white/90 p-3 shadow-sm">
        <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-[#9A7B56]">
          Why this works
        </div>
        <div className="text-[11px] font-semibold leading-relaxed text-[#5B566E]">
          Khi timing đúng hơn, bạn đỡ phải cố quá nhiều ở sai thời điểm.
        </div>
      </div>
    </div>
  );
}

function MiniChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] border border-white/80 bg-white/90 p-3 shadow-sm">
      <div className="text-[9px] uppercase tracking-[0.12em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 text-[11px] font-[900] text-[#1A1528]">{value}</div>
    </div>
  );
}

function ScheduleItem({
  time,
  title,
  meta,
  color = "purple",
}: {
  time: string;
  title: string;
  meta: string;
  color?: "purple" | "blue" | "green" | "gray";
}) {
  const colorMap = {
    purple: "bg-[#F3F0FF] text-[#6F59FF]",
    blue: "bg-[#EEF6FF] text-[#4DA8FF]",
    green: "bg-[#ECFDF5] text-[#10B981]",
    gray: "bg-[#F3F4F6] text-[#6B7280]",
  };

  return (
    <div className="rounded-[16px] border border-white/80 bg-white/90 p-3 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-[900] tracking-[0.1em] text-[#8A84A3]">
          {time}
        </span>
        <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${colorMap[color]}`}>
          {title}
        </span>
      </div>
      <div className="text-[11px] font-[900] text-[#1A1528]">{title}</div>
      <div className="mt-0.5 text-[10px] leading-relaxed text-[#6B7280]">{meta}</div>
    </div>
  );
}
// =====================================================
// UI HELPERS & COMPONENTS
// =====================================================

function EnergyGraph() {
  // Dữ liệu giả lập 5 mốc thời gian: 06h, 10h, 14h, 18h, 22h (Thang điểm 0 - 100)
  const curves = [
    { name: "Lion", color: "#F59E0B", points: [60, 95, 50, 30, 15] },
    { name: "Bear", color: "#6F59FF", points: [30, 70, 85, 45, 20] },
    { name: "Wolf", color: "#4DA8FF", points: [15, 30, 60, 90, 65] },
    { name: "Dolphin", color: "#10B981", points: [40, 75, 45, 70, 40] },
  ];

  // Hàm toán học vẽ đường cong trơn (Cubic Bezier Curve)
  const generatePath = (points: number[]) => {
    const dx = 500 / (points.length - 1);
    let d = `M 0 ${200 - points[0] * 1.6}`; // Scale Y một chút để không bị chạm đỉnh
    for (let i = 1; i < points.length; i++) {
      const xPrev = (i - 1) * dx;
      const yPrev = 200 - points[i - 1] * 1.6;
      const x = i * dx;
      const y = 200 - points[i] * 1.6;
      const cx1 = xPrev + dx / 2.5;
      const cx2 = x - dx / 2.5;
      d += ` C ${cx1} ${yPrev}, ${cx2} ${y}, ${x} ${y}`;
    }
    return d;
  };

  return (
    <div className="relative h-full w-full">
      {/* Khung toạ độ */}
      <div className="absolute inset-0 flex flex-col justify-between border-b border-l border-slate-200/60 pb-6 pl-2">
        <div className="w-full border-t border-dashed border-slate-200/60 flex-1" />
        <div className="w-full border-t border-dashed border-slate-200/60 flex-1" />
        <div className="w-full border-t border-dashed border-slate-200/60 flex-1" />
        <div className="w-full border-t border-dashed border-slate-200/60 flex-1" />
      </div>

      {/* Trục X */}
      <div className="absolute bottom-0 left-0 flex w-full justify-between pl-4 text-[10px] font-bold text-slate-400">
        <span>06:00</span>
        <span>10:00</span>
        <span>14:00</span>
        <span>18:00</span>
        <span>22:00</span>
      </div>

      {/* Canvas vẽ các đường thẳng */}
      <svg viewBox="0 0 500 200" className="absolute inset-0 h-[calc(100%-24px)] w-full overflow-visible p-2">
        {curves.map((curve, idx) => (
          <g key={curve.name}>
            {/* Đường chính được vẽ bằng framer-motion */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: idx * 0.2, ease: "easeInOut" }}
              d={generatePath(curve.points)}
              fill="none"
              stroke={curve.color}
              strokeWidth={idx === 1 ? "4" : "2.5"} // Làm nổi đường Bear (Màu tím) hơn một chút
              strokeLinecap="round"
              className="drop-shadow-md"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

// Nếu bạn chưa cập nhật Data, hãy bổ sung thêm `bestTime` và `bestFor` vào mảng `chronotypes` nhé.