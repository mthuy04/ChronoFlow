"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTASection from "@/components/home/FinalCTASection";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Flag,
  Layers3,
  Lightbulb,
  ListChecks,
  Lock,
  MoonStar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Play,
  Plus,
  Sunrise,
  MoreHorizontal,
ClipboardList,
  Users,
  Wand2,
  Zap,
} from "lucide-react";

const roadmapPhases = [
  {
    phase: "Giai đoạn 1",
    title: "Nền tảng cốt lõi",
    period: "Hiện tại",
    status: "Đang tập trung",
    accent: "from-[#F5F1FF] via-[#EEE8FF] to-[#E5DCFF]",
    border: "border-[#D8CCFF]",
    icon: <Compass className="h-5 w-5 text-[#6F59FF]" />,
    goals: [
      "Bài đánh giá chronotype và kết quả cá nhân hóa",
      "Biểu đồ năng lượng cơ bản theo từng nhóm người dùng",
      "Gợi ý kế hoạch trong ngày theo khung năng lượng",
      "Lớp nội dung học tập để tăng hiểu biết và độ tin cậy",
    ],
    deliverables: [
      "Landing page thể hiện rõ giá trị sản phẩm",
      "Luồng assessment mượt và dễ hoàn thành",
      "Dashboard đầu tiên với insight đơn giản, dễ hiểu",
    ],
  },
  {
    phase: "Giai đoạn 2",
    title: "Lập kế hoạch thích ứng",
    period: "Tiếp theo",
    status: "Đã lên kế hoạch",
    accent: "from-[#EFF6FF] via-[#E8F1FF] to-[#DDEBFF]",
    border: "border-[#C9DEFF]",
    icon: <CalendarClock className="h-5 w-5 text-[#4DA8FF]" />,
    goals: [
      "Sắp xếp công việc theo mức năng lượng thực tế",
      "Gợi ý block cho deep work, admin và hồi phục",
      "Giảm ma sát trong flow lên kế hoạch hằng ngày",
      "Nhắc nhở thông minh theo cửa sổ tập trung",
    ],
    deliverables: [
      "Planner có thể tương tác",
      "Điểm phù hợp giữa task và mức năng lượng",
      "Gợi ý focus block theo từng ngày",
    ],
  },
  {
    phase: "Giai đoạn 3",
    title: "Lớp thông minh",
    period: "Sau đó",
    status: "Định hướng tương lai",
    accent: "from-[#FFF8ED] via-[#FFF2DC] to-[#FFE8BE]",
    border: "border-[#FFD598]",
    icon: <Brain className="h-5 w-5 text-[#E39B27]" />,
    goals: [
      "Gợi ý bằng AI",
      "Học từ hành vi sử dụng của người dùng",
      "Tinh chỉnh nhịp cá nhân theo thời gian",
      "Insight sâu hơn về năng suất và hồi phục",
    ],
    deliverables: [
      "Gợi ý sắp lịch bằng AI",
      "Báo cáo nhịp làm việc theo tuần",
      "Coaching cá nhân hóa về năng lượng và tập trung",
    ],
  },
  {
    phase: "Giai đoạn 4",
    title: "Hệ sinh thái",
    period: "Tầm nhìn",
    status: "Dài hạn",
    accent: "from-[#ECFCF7] via-[#E1F9EF] to-[#CDF4E7]",
    border: "border-[#B8EEDC]",
    icon: <Rocket className="h-5 w-5 text-[#16A085]" />,
    goals: [
      "Kết nối lịch cá nhân",
      "Kết nối dữ liệu wearable hoặc giấc ngủ",
      "Lập kế hoạch theo nhịp cho nhóm",
      "Trải nghiệm đồng nhất trên nhiều nền tảng",
    ],
    deliverables: [
      "Đồng bộ Google Calendar",
      "Chế độ planning chia sẻ",
      "Insight dài hạn về thói quen và nhịp làm việc",
    ],
  },
];

const milestoneCards = [
  {
    icon: <CheckCircle2 className="h-5 w-5 text-[#6F59FF]" />,
    title: "MVP rõ ràng",
    text: "Một phiên bản đủ nhỏ để ra mắt nhưng vẫn thể hiện rõ giá trị cốt lõi của ChronoFlow.",
  },
  {
    icon: <Users className="h-5 w-5 text-[#4DA8FF]" />,
    title: "Kiểm chứng với người dùng",
    text: "Ưu tiên feedback thực tế từ người dùng thay vì đoán quá nhiều ở giai đoạn đầu.",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-[#E39B27]" />,
    title: "Hiểu cách sản phẩm được dùng",
    text: "Theo dõi xem người dùng có thực sự thay đổi cách lên lịch và duy trì thói quen hay không.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-[#16A085]" />,
    title: "Độ tin cậy",
    text: "Nội dung rõ ràng, logic sản phẩm hợp lý và trải nghiệm nhất quán để xây dựng niềm tin.",
  },
];

const featureTracks = [
  {
    title: "Trải nghiệm cốt lõi",
    icon: <Layers3 className="h-5 w-5 text-[#6F59FF]" />,
    items: ["Assessment", "Kết quả", "Dashboard", "Kế hoạch trong ngày"],
    tone: "from-[#F5F1FF] to-[#ECE5FF]",
    border: "border-[#D8CCFF]",
  },
  {
    title: "Hệ thống lập kế hoạch",
    icon: <ListChecks className="h-5 w-5 text-[#4DA8FF]" />,
    items: ["Độ hợp giữa task", "Focus block", "Routine builder", "Lập kế hoạch theo tuần"],
    tone: "from-[#EFF7FF] to-[#E0EEFF]",
    border: "border-[#C7E0FF]",
  },
  {
    title: "Lớp thông minh",
    icon: <Lightbulb className="h-5 w-5 text-[#E39B27]" />,
    items: ["Gợi ý AI", "Nhịp thích ứng", "Insight hành vi", "Báo cáo"],
    tone: "from-[#FFF8ED] to-[#FFF0D8]",
    border: "border-[#FFD38C]",
  },
  {
    title: "Nền tảng",
    icon: <Lock className="h-5 w-5 text-[#16A085]" />,
    items: ["Tích hợp", "Thông báo", "Đồng bộ", "Hệ thống tài khoản"],
    tone: "from-[#ECFCF7] to-[#D7F7EC]",
    border: "border-[#B7EFD9]",
  },
];

const roadmapPrinciples = [
  {
    title: "Bắt đầu từ phần đơn giản",
    text: "Không nhồi quá nhiều tính năng ngay từ đầu. Mỗi bước phải làm rõ hơn giá trị cốt lõi.",
  },
  {
    title: "Xây quanh hành vi người dùng",
    text: "Roadmap không chỉ là thêm feature, mà là giúp người dùng thay đổi cách lên lịch và làm việc.",
  },
  {
    title: "Sản phẩm phải dễ hiểu",
    text: "ChronoFlow càng mới thì phần giáo dục người dùng càng quan trọng. Sản phẩm phải tự giải thích được chính nó.",
  },
  {
    title: "Phát triển dựa trên bằng chứng",
    text: "Ưu tiên những gì được xác nhận bởi dữ liệu sử dụng và phản hồi thực từ người dùng.",
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#241F3D]">
      <Navbar variant="guest" />

      <main className="relative overflow-hidden pb-24">
        <BackgroundDecor />

        <section className="relative z-10 px-4 pb-12 pt-0 lg:px-8">
  <div className="mx-auto max-w-[1280px]">
    <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
      {/* TOP HALF */}
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
        <div className="relative z-30 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Lộ trình phát triển
          </div>

          <h1 className="mb-3 text-[clamp(2.2rem,4vw,3.8rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
            Từ ý tưởng về chronotype, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
              thành hệ thống lập kế hoạch thực tế.
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-[640px] text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
            Roadmap này cho thấy ChronoFlow sẽ phát triển như thế nào: từ nền tảng
            cốt lõi, đến planning thích ứng, rồi mở rộng thành một hệ thống ngày
            càng thông minh và hữu ích hơn cho người dùng.
          </p>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/learn"
              className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
            >
              <BookOpen className="h-4 w-4 text-[#4DA8FF]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                  NỀN TẢNG
                </span>
                <span className="text-[14px] font-bold leading-tight">
                  Xem hiểu biết cốt lõi
                </span>
              </div>
            </Link>

            <Link
              href="/assessment"
              className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                <Play className="ml-0.5 h-3 w-3 fill-[#6F59FF] text-[#6F59FF]" />
              </div>
              <span className="text-[14px] font-bold leading-tight">
                Trải nghiệm bản hiện tại
              </span>
            </Link>
          </div>
        </div>

        {/* PHONES */}
        <div className="relative mx-auto mt-2 h-[340px] w-full max-w-[740px] perspective-[1200px]">
          <div className="absolute left-[3%] top-[6%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
            <FloatPill
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Giai đoạn hiện tại"
              tint="purple"
            />
          </div>

          <div className="absolute left-[-4%] top-[30%] z-40 hidden animate-[bounce_5s_infinite] md:block">
            <div className="rounded-[20px] border border-white bg-white/90 p-4 shadow-[0_20px_40px_rgba(111,89,255,0.15)] backdrop-blur-md">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A84A3]">
                Trọng tâm hiện tại
              </div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[22px] font-[900] leading-none text-[#1A1528]">
                  MVP
                </span>
                <span className="text-lg">🚀</span>
              </div>
              <div className="flex -space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#F3F0FF] text-[10px]">
                  1
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#E9F5FF] text-[10px]">
                  2
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#FFF1E8] text-[10px]">
                  3
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-[3%] top-[4%] z-40 hidden animate-[bounce_4.5s_infinite] sm:block">
            <FloatPill
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label="Tăng dần độ thông minh"
              tint="orange"
            />
          </div>

          <div className="absolute right-[-4%] top-[26%] z-40 hidden animate-[bounce_5.5s_infinite] md:block">
            <div className="min-w-[140px] space-y-3 rounded-[20px] border border-white bg-white/90 p-4 shadow-[0_20px_40px_rgba(111,89,255,0.15)] backdrop-blur-md">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#8A84A3]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                Nền tảng trước
              </div>
              <div className="flex items-center gap-2 text-[13px] font-[900] text-[#1A1528]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                  <BarChart3 className="h-3 w-3 text-[#6F59FF]" />
                </div>
                Planning sau
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#8A84A3]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                  <CalendarClock className="h-3 w-3" />
                </div>
                AI & tích hợp
              </div>
            </div>
          </div>

          <div className="absolute left-[3%] top-12 z-20 w-[200px] -rotate-12 transform rounded-[32px] shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-[-5deg] sm:left-[5%] sm:w-[220px]">
            <PhoneFrame>
              <QuizPhone />
            </PhoneFrame>
          </div>

          <div className="absolute right-[3%] top-12 z-20 w-[200px] rotate-12 transform rounded-[32px] shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-[5deg] sm:right-[5%] sm:w-[220px]">
            <PhoneFrame>
              <SchedulePhone />
            </PhoneFrame>
          </div>

          <div className="absolute left-1/2 top-2 z-30 w-[230px] -translate-x-1/2 transform rounded-[36px] shadow-[0_40px_80px_rgba(26,21,40,0.25)] transition-all duration-700 hover:-translate-y-6 sm:w-[240px]">
            <PhoneFrame featured>
              <ResultPhone />
            </PhoneFrame>
          </div>
        </div>
      </div>

      {/* BOTTOM HALF */}
      <div className="relative z-50 bg-white px-6 py-10 md:px-12 lg:px-16">
        <div className="mb-10 grid gap-8 border-b border-gray-100 pb-10 md:grid-cols-2 md:gap-14">
          <TopFeature
            icon={<ClipboardList className="h-6 w-6 text-[#6F59FF]" />}
            title="Roadmap theo từng giai đoạn"
            description="ChronoFlow không phát triển bằng cách thêm tính năng ngẫu nhiên. Mỗi giai đoạn có mục tiêu, logic và giá trị riêng."
            chip={
              <div className="rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-3.5 py-1.5 text-[11px] font-bold text-[#6F59FF]">
                Có định hướng
              </div>
            }
          />
          <TopFeature
            icon={<Users className="h-6 w-6 text-[#6F59FF]" />}
            title="Tăng độ hữu ích theo thời gian"
            description="Từ phần lõi dễ hiểu và dễ dùng, ChronoFlow sẽ dần phát triển thành một lớp lập kế hoạch thông minh hơn và thích ứng hơn."
            chip={
              <div className="flex -space-x-2 rounded-full border border-gray-100 bg-[#F8F9FE] px-2.5 py-1.5">
                <div className="h-5 w-5 rounded-full border-2 border-white bg-blue-400" />
                <div className="h-5 w-5 rounded-full border-2 border-white bg-orange-400" />
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#1A1528] text-[8px] font-bold text-white">
                  4+
                </div>
              </div>
            }
          />
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <div className="space-y-5">
            <InsightBlock value="GĐ 1" label="Làm rõ giá trị cốt lõi" />
            <InsightBlock value="GĐ 3" label="Bắt đầu lớp AI & insight" />
          </div>

          <div className="relative mx-auto flex w-full justify-center sm:w-[330px]">
            <div className="relative z-10 w-full rounded-[28px] border border-[#E9E5FF] bg-white p-5 shadow-[0_25px_50px_rgba(111,89,255,0.08)] transition-transform duration-500 hover:-translate-y-2">
              <div className="mb-5 flex items-center justify-between">
                <h5 className="text-[16px] font-[900] text-[#1A1528]">
                  Lộ trình hiện tại
                </h5>
                <button className="flex items-center gap-1.5 rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-3 py-1.5 text-[11px] font-bold text-[#6F59FF] transition-colors hover:bg-[#6F59FF] hover:text-white">
                  <Plus className="h-3 w-3" /> Xem thêm
                </button>
              </div>

              <div className="relative space-y-3.5">
                <div className="absolute left-[18px] top-4 -z-10 bottom-4 w-[2px] rounded-full bg-[#F3F0FF]" />
                <ScheduleRow
                  done
                  title="Nền tảng cốt lõi"
                  meta="Assessment • Kết quả • Dashboard"
                  icon={<CheckCircle2 className="h-3 w-3 text-gray-400" />}
                />
                <ScheduleRow
                  active
                  title="Planning thích ứng"
                  meta="Block công việc • Routine • Flow hằng ngày"
                  icon={<Brain className="h-3 w-3 text-[#6F59FF]" />}
                />
                <ScheduleRow
                  title="AI & tích hợp"
                  meta="Insight thông minh • Đồng bộ • Mở rộng"
                  icon={<MoonStar className="h-3 w-3 text-gray-400" />}
                />
              </div>
            </div>

            <div className="absolute -left-5 bottom-6 z-20 flex h-14 items-end gap-1.5 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
              {[40, 62, 54, 100, 72, 38].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 animate-pulse rounded-full bg-gradient-to-t from-[#6F59FF] to-[#4DA8FF]"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <SidePoint
              icon={<BarChart3 className="h-4 w-4" />}
              title="Phát triển theo từng lớp"
              description="Mỗi giai đoạn thêm một lớp giá trị mới thay vì dàn trải tính năng quá sớm."
            />
            <SidePoint
              icon={<Clock3 className="h-4 w-4" />}
              title="Ưu tiên phần lõi trước"
              description="ChronoFlow phải chứng minh được giá trị cơ bản trước khi tiến sang AI và tích hợp."
            />
            <SidePoint
              icon={<CalendarClock className="h-4 w-4" />}
              title="Tăng độ trưởng thành của sản phẩm"
              description="Từ hiểu biết nền tảng, đến planning thích ứng, rồi mới mở rộng thành hệ sinh thái."
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] space-y-12 px-4 lg:px-8">
          <SectionWrapper id="phases">
            <SectionHeading
              eyebrow="Các giai đoạn phát triển"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  4 giai đoạn đưa ChronoFlow
                  <br className="hidden sm:block" /> đi từ{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    concept đến platform
                  </span>
                </h2>
              }
              description="Mỗi giai đoạn tập trung vào một lớp giá trị khác nhau: hiểu người dùng, hỗ trợ planning, tăng khả năng thích ứng và cuối cùng là mở rộng hệ sinh thái."
            />

            <div className="mt-16 grid gap-8 xl:grid-cols-2">
              {roadmapPhases.map((phase, index) => (
                <motion.div
                  key={phase.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className={`rounded-[32px] border ${phase.border} bg-gradient-to-br ${phase.accent} p-[1px] shadow-[0_18px_40px_rgba(26,21,40,0.05)]`}
                >
                  <div className="h-full rounded-[31px] bg-white/88 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-sm">
                          {phase.icon}
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                            {phase.phase}
                          </div>
                          <div className="text-[1.15rem] font-[900] text-[#1A1528]">
                            {phase.title}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#7A70A0]">
                          {phase.status}
                        </div>
                        <div className="mt-2 text-[12px] font-semibold text-[#6B7280]">
                          {phase.period}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="rounded-[22px] border border-white/80 bg-white/80 p-4">
                        <div className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                          Mục tiêu
                        </div>
                        <div className="space-y-2.5">
                          {phase.goals.map((goal) => (
                            <div key={goal} className="flex items-start gap-2.5">
                              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#6F59FF]" />
                              <span className="text-[13px] leading-6 text-[#4B5563]">
                                {goal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[22px] border border-white/80 bg-white/80 p-4">
                        <div className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                          Kết quả cần có
                        </div>
                        <div className="space-y-2.5">
                          {phase.deliverables.map((item) => (
                            <div key={item} className="flex items-start gap-2.5">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A085]" />
                              <span className="text-[13px] leading-6 text-[#4B5563]">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="milestones">
            <SectionHeading
              eyebrow="Các cột mốc quan trọng"
              title={
                
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                Những cột mốc để roadmap không chỉ{" "}
            
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  đẹp trên giấy
                  </span>
                  </h2>
              }
              description="Roadmap tốt không chỉ nói sẽ làm gì, mà còn xác định rõ điều gì cần được chứng minh ở mỗi chặng."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {milestoneCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="rounded-[30px] border border-[#EAE8F7] bg-white/88 p-5 shadow-[0_15px_40px_rgba(26,21,40,0.04)]"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-[#F8F6FF] shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-[1.08rem] font-[900] tracking-tight text-[#1A1528]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="tracks">
            <SectionHeading
              eyebrow="Những hướng phát triển chính"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                Roadmap được chia theo{" "}
            <br/>
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  các track rõ ràng
                  </span>
                  </h2>
              }
              description="Thay vì nghĩ theo danh sách feature rời rạc, ChronoFlow nên phát triển theo các hướng giá trị để giữ product logic rõ ràng."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {featureTracks.map((track, index) => (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className={`rounded-[30px] border ${track.border} bg-gradient-to-br ${track.tone} p-5 shadow-[0_18px_40px_rgba(26,21,40,0.04)]`}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
                    {track.icon}
                  </div>

                  <h3 className="text-[1.08rem] font-[900] tracking-tight text-[#1A1528]">
                    {track.title}
                  </h3>

                  <div className="mt-4 space-y-2">
                    {track.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-full border border-white/80 bg-white/85 px-3 py-2 text-[12px] font-semibold text-[#4F4A68]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="principles">
            <SectionHeading
              eyebrow="Nguyên tắc giữ roadmap đi đúng hướng"
              title={
                <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Nguyên tắc để roadmap
                  <br className="hidden sm:block" /> không bị{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    lệch khỏi product
                  </span>
                </h2>
              }
              description="ChronoFlow rất dễ bị cuốn sang hướng thêm nhiều tính năng hấp dẫn. Những nguyên tắc này giúp sản phẩm đi đúng đường."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {roadmapPrinciples.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-[28px] border border-[#EAE8F7] bg-white/88 p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]"
                >
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                    Nguyên tắc {index + 1}
                  </div>
                  <h3 className="text-[1.08rem] font-[900] text-[#1A1528]">{item.title}</h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">{item.text}</p>
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

function BackgroundDecor() {
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
        <div className="absolute left-[8%] top-[4%] h-[320px] w-[320px] rounded-full bg-[#DCCEFF]/45 blur-[110px]" />
        <div className="absolute right-[-3%] top-[8%] h-[280px] w-[280px] rounded-full bg-[#D9EAFF]/45 blur-[110px]" />
        <div className="absolute left-[36%] top-[30%] h-[220px] w-[220px] rounded-full bg-[#FFF4CC]/20 blur-[100px]" />
      </div>
    </>
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
  title: ReactNode;
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

function HeroTagDark({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3.5 py-2 text-[13px] font-medium text-white/88 backdrop-blur-md">
      {icon}
      {children}
    </div>
  );
}

function PreviewRowDark({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/8 p-3 backdrop-blur-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>
      <div>
        <div className="text-[13px] font-black text-white">{title}</div>
        <p className="mt-1 text-[13px] leading-6 text-white/72">{text}</p>
      </div>
    </div>
  );
}

function PillDark({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/82 backdrop-blur-md">
      {children}
    </div>
  );
}


function RoadmapPhoneFrame({
  children,
  large = false,
  screenClassName = "",
}: {
  children: ReactNode;
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

function RoadmapMilestonePhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#F8F5FF_0%,#F2EDFF_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
            Cột mốc
          </div>
          <div className="text-[15px] font-[900] leading-tight">
            MVP rõ ràng
          </div>
        </div>
        <div className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#6F59FF] shadow-sm">
          GĐ 1
        </div>
      </div>

      <div className="space-y-2">
        {[
          "Assessment",
          "Màn kết quả",
          "Dashboard đầu tiên",
          "Lớp nội dung học tập",
        ].map((item, idx) => (
          <div
            key={item}
            className={`rounded-xl border px-3 py-2 text-[11px] font-semibold ${
              idx === 1
                ? "border-[#CDBDFF] bg-[#F3F0FF] text-[#6F59FF]"
                : "border-[#EEEAFB] bg-white text-[#5B566E]"
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-[18px] bg-[#1A1528] p-3 text-white shadow-lg">
        <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-gray-400">
          Mục tiêu
        </div>
        <div className="text-[12px] font-bold leading-snug">
          Chứng minh giá trị cốt lõi thật rõ trước khi mở rộng.
        </div>
      </div>
    </div>
  );
}

function RoadmapOverviewPhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#F7FAFF_0%,#EFF5FF_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7B87A7]">
            Tổng quan
          </div>
          <div className="text-[17px] font-[900] leading-tight">
            Lộ trình sản phẩm
          </div>
        </div>
        <div className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#4DA8FF] shadow-sm">
          4 giai đoạn
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: "Nền tảng", width: "88%", color: "#6F59FF" },
          { label: "Planning thích ứng", width: "72%", color: "#4DA8FF" },
          { label: "Lớp AI", width: "54%", color: "#F59E0B" },
          { label: "Tích hợp", width: "40%", color: "#10B981" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[16px] border border-white/80 bg-white/90 p-3 shadow-sm"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-[900] tracking-[0.1em] text-[#8A84A3]">
                {item.label}
              </span>
            </div>
            <div className="overflow-hidden rounded-full bg-[#EEF2FF]">
              <div
                className="h-3 rounded-full"
                style={{ width: item.width, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-[18px] border border-white/80 bg-white/90 p-3 shadow-sm">
        <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-[#8A84A3]">
          Insight
        </div>
        <div className="text-[11px] font-semibold leading-relaxed text-[#4B5563]">
          Không nên nhảy ngay vào AI và đồng bộ. Nền tảng phải đủ chắc trước.
        </div>
      </div>
    </div>
  );
}

function RoadmapFuturePhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#FFF9F2_0%,#FFF4E8_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A7B56]">
            Tầm nhìn tương lai
          </div>
          <div className="text-[15px] font-[900] leading-tight">
            Hệ sinh thái thông minh
          </div>
        </div>
        <div className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[#F59E0B] shadow-sm">
          Dài hạn
        </div>
      </div>

      <div className="space-y-2">
        <RoadmapMiniItem time="Sync" title="Google Calendar" meta="Lập kế hoạch hai chiều" color="purple" />
        <RoadmapMiniItem time="AI" title="Gợi ý thích ứng" meta="Dựa trên hành vi sử dụng" color="blue" />
        <RoadmapMiniItem time="Data" title="Tín hiệu wearable" meta="Giấc ngủ / hồi phục" color="green" />
      </div>

      <div className="mt-auto rounded-[18px] border border-white/80 bg-white/90 p-3 shadow-sm">
        <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-[#9A7B56]">
          Vì sao để sau
        </div>
        <div className="text-[11px] font-semibold leading-relaxed text-[#5B566E]">
          Chỉ nên mở rộng hệ sinh thái khi phần lõi đã tạo được thói quen sử dụng thật.
        </div>
      </div>
    </div>
  );
}

function RoadmapMiniItem({
  time,
  title,
  meta,
  color = "purple",
}: {
  time: string;
  title: string;
  meta: string;
  color?: "purple" | "blue" | "green";
}) {
  const colorMap = {
    purple: "bg-[#F3F0FF] text-[#6F59FF]",
    blue: "bg-[#EEF6FF] text-[#4DA8FF]",
    green: "bg-[#ECFDF5] text-[#10B981]",
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
function FloatPill({
    icon,
    label,
    tint,
  }: {
    icon: React.ReactNode;
    label: string;
    tint: "purple" | "orange";
  }) {
    const bgClass =
      tint === "purple"
        ? "from-[#6F59FF] to-[#4DA8FF]"
        : "from-[#F59E0B] to-[#FBBF24]";
  
    return (
      <div className="flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-[11px] font-bold shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br text-white ${bgClass}`}
        >
          {icon}
        </div>
        {label}
      </div>
    );
  }
  
  function PhoneFrame({
    children,
    featured = false,
  }: {
    children: React.ReactNode;
    featured?: boolean;
  }) {
    return (
      <div
        className={`relative aspect-[430/900] w-full rounded-[34px] bg-[#1A1528] p-2 ring-1 ring-inset ring-white/20 ${
          featured ? "shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]" : ""
        }`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-gradient-to-br from-white/20 to-transparent" />
        <div
          className={`relative h-full overflow-hidden rounded-[26px] ${
            featured
              ? "bg-[linear-gradient(135deg,#6F59FF_0%,#4DA8FF_100%)]"
              : "bg-white"
          }`}
        >
          <div className="absolute inset-x-0 top-0 z-50 flex h-6 justify-center">
            <div className="relative h-[20px] w-[80px] rounded-b-[12px] bg-[#1A1528]">
              <div className="absolute right-3 top-1.5 h-1 w-1 rounded-full border border-gray-800 bg-[#0a0812]" />
            </div>
          </div>
          <div className="h-full pt-8">{children}</div>
          <div className="absolute bottom-2 left-1/2 z-50 h-1 w-24 -translate-x-1/2 rounded-full bg-black/20" />
        </div>
      </div>
    );
  }
  
  function TopFeature({
    icon,
    title,
    description,
    chip,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    chip: React.ReactNode;
  }) {
    return (
      <div className="group flex cursor-default flex-col items-start rounded-3xl border border-transparent bg-[#F8F9FE]/50 p-5 transition-all hover:border-[#E9E5FF] hover:bg-white hover:shadow-lg">
        <div className="mb-4 flex w-full items-center justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F3F0FF] to-[#E9E5FF] transition-transform group-hover:scale-105">
            {icon}
          </div>
          {chip}
        </div>
        <h4 className="mb-2 text-[17px] font-[900] text-[#1A1528]">{title}</h4>
        <p className="text-[13.5px] leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
    );
  }
  
  function InsightBlock({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) {
    return (
      <div className="group rounded-[20px] border border-[#E9E5FF] bg-[#F8F9FE] p-5 transition-all hover:-translate-y-1 hover:shadow-md">
        <h5 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#8A84A3]">
          Insight
        </h5>
        <div className="mb-1 origin-left bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-[38px] font-[900] leading-none text-transparent transition-transform group-hover:scale-105">
          {value}
        </div>
        <div className="text-[13px] font-medium text-[#1A1528]">{label}</div>
      </div>
    );
  }
  
  function SidePoint({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <div className="group flex gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E9E5FF] bg-[#F8F9FE] text-[#6F59FF] transition-colors group-hover:bg-[#6F59FF] group-hover:text-white">
          {icon}
        </div>
        <div>
          <h4 className="mb-1 text-[15px] font-[900] text-[#1A1528]">{title}</h4>
          <p className="text-[13px] leading-relaxed text-gray-500">{description}</p>
        </div>
      </div>
    );
  }
  
  function ScheduleRow({
    title,
    meta,
    icon,
    done = false,
    active = false,
  }: {
    title: string;
    meta: string;
    icon: React.ReactNode;
    done?: boolean;
    active?: boolean;
  }) {
    return (
      <div
        className={`relative flex items-start gap-3 rounded-2xl p-3 transition-all ${
          active
            ? "z-10 scale-[1.02] border-2 border-[#6F59FF] bg-white shadow-[0_10px_20px_rgba(111,89,255,0.1)]"
            : "border border-transparent bg-white"
        }`}
      >
        <div
          className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${
            done
              ? "bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white"
              : active
              ? "border-2 border-[#6F59FF] bg-[#F3F0FF]"
              : "border-2 border-gray-200 bg-white"
          }`}
        >
          {done && <CheckCircle2 className="h-3 w-3" />}
        </div>
        <div className="flex-1">
          <div
            className={`mb-0.5 text-[13px] font-[900] ${
              done
                ? "line-through text-gray-400"
                : active
                ? "text-[#6F59FF]"
                : "text-[#1A1528]"
            }`}
          >
            {title}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
            {icon} {meta}
          </div>
        </div>
      </div>
    );
  }
  
  function QuizPhone() {
    return (
      <div className="relative flex h-full flex-col bg-[#F8F9FE] p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF] text-[10px]">
              🧭
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-500">Giai đoạn 1</div>
              <div className="text-[11px] font-[900] leading-none">
                Nền tảng cốt lõi
              </div>
            </div>
          </div>
        </div>
  
        <div className="relative mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="absolute left-0 top-0 h-1 w-1/4 bg-[#6F59FF]" />
          <div className="mt-1 text-[13px] font-bold leading-tight text-[#1A1528]">
            Những gì cần hoàn thiện đầu tiên?
          </div>
        </div>
  
        <div className="flex-1 space-y-2.5">
          {[
            { text: "Assessment & kết quả", active: true },
            { text: "Dashboard cơ bản", active: false },
            { text: "Learn / education layer", active: false },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 shadow-sm transition-all ${
                item.active
                  ? "border-[#6F59FF] bg-[#F3F0FF]"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  item.active ? "border-[#6F59FF]" : "border-gray-300"
                }`}
              >
                {item.active && <div className="h-1.5 w-1.5 rounded-full bg-[#6F59FF]" />}
              </div>
              <div
                className={`text-[11px] font-bold ${
                  item.active ? "text-[#6F59FF]" : "text-[#1A1528]"
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  function SchedulePhone() {
    return (
      <div className="flex h-full flex-col bg-white p-3">
        <div className="relative mb-3 border-b border-gray-100 pb-3 text-center">
          <div className="text-[13px] font-[900] text-[#1A1528]">Lộ trình tiếp theo</div>
          <div className="mt-1 inline-block rounded bg-[#F3F0FF] px-1.5 py-0.5 text-[9px] font-bold text-[#6F59FF]">
            Planning thích ứng → AI → Tích hợp
          </div>
        </div>
  
        <div className="relative flex-1">
          <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-gray-100" />
          <div className="space-y-3">
            {[
              {
                label: "Planning thích ứng",
                time: "GĐ 2",
                dot: "bg-orange-500",
                card: "bg-[#FFF6E8] border-orange-100",
                titleCol: "text-orange-600",
              },
              {
                label: "Lớp AI",
                time: "GĐ 3",
                dot: "bg-[#6F59FF]",
                card: "bg-[#F3F0FF] border-[#E9E5FF]",
                titleCol: "text-[#6F59FF]",
              },
              {
                label: "Tích hợp hệ sinh thái",
                time: "GĐ 4",
                dot: "bg-blue-400",
                card: "bg-[#EEF5FF] border-blue-100",
                titleCol: "text-blue-500",
              },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex gap-2">
                <div className="flex w-6 shrink-0 flex-col items-center pt-1">
                  <div
                    className={`h-2.5 w-2.5 rounded-full border border-white shadow-sm ring-1 ring-gray-100 ${item.dot}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 text-[9px] font-bold text-gray-400">
                    {item.time}
                  </div>
                  <div className={`rounded-lg border p-2.5 ${item.card}`}>
                    <div className={`text-[11px] font-[900] ${item.titleCol}`}>
                      {item.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  function ResultPhone() {
    return (
      <div className="flex h-full flex-col px-4 py-5">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-[17px] font-[900] leading-tight text-white">
            Product <br />
            roadmap
          </h3>
          <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
            <Sunrise className="h-4 w-4 text-white" />
          </div>
        </div>
  
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
            <div className="mb-0.5 text-[9px] font-bold uppercase text-white/70">
              Hiện tại
            </div>
            <div className="text-[15px] font-[900] text-white">GĐ 1</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
            <div className="mb-0.5 text-[9px] font-bold uppercase text-white/70">
              Tầm nhìn
            </div>
            <div className="text-[15px] font-[900] text-white">GĐ 4</div>
          </div>
        </div>
  
        <div className="flex flex-1 flex-col rounded-[20px] bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[12px] font-[900] text-[#1A1528]">
              Tiến trình phát triển
            </div>
            <MoreHorizontal className="h-3 w-3 text-gray-400" />
          </div>
          <p className="mb-2 text-[10px] leading-relaxed text-gray-500">
            Bắt đầu từ phần lõi, sau đó tăng dần khả năng planning, intelligence và tích hợp.
          </p>
          <div className="relative mt-auto rounded-xl border border-[#E9E5FF] bg-[linear-gradient(180deg,#F8F9FE_0%,#F3F0FF_100%)] p-2">
            <div className="absolute inset-x-2 top-2 bottom-4 flex flex-col justify-between">
              <div className="w-full border-b border-gray-200/50" />
              <div className="w-full border-b border-gray-200/50" />
              <div className="w-full border-b border-gray-200/50" />
            </div>
            <svg
              viewBox="0 0 260 90"
              className="relative z-10 h-[50px] w-full"
              fill="none"
            >
              <path
                d="M8 70C40 68 58 58 92 48C124 38 148 30 178 22C205 16 226 12 252 10"
                stroke="url(#roadmapLineHero)"
                strokeWidth="5"
                strokeLinecap="round"
                className="drop-shadow-[0_4px_6px_rgba(111,89,255,0.4)]"
              />
              <defs>
                <linearGradient id="roadmapLineHero" x1="0" y1="0" x2="260" y2="0">
                  <stop stopColor="#6F59FF" />
                  <stop offset="1" stopColor="#4DA8FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-0.5 flex justify-between px-1 text-[8px] font-bold text-gray-400">
              <span>GĐ1</span>
              <span>GĐ2</span>
              <span>GĐ3</span>
              <span>GĐ4</span>
            </div>
          </div>
        </div>
      </div>
    );
  }