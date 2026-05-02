"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Box,
  Brain,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Coffee,
  Gift,
  HeartHandshake,
  LineChart,
  MoonStar,
  PackageCheck,
  Palette,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Sticker,
  Sun,
  Target,
  Timer,
  Truck,
  WalletCards,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTASection from "@/components/home/FinalCTASection";

type KitItem = {
  title: string;
  description: string;
  icon: ReactNode;
  tone: "purple" | "blue" | "green" | "orange";
};

type UseCase = {
  title: string;
  description: string;
  icon: ReactNode;
  tags: string[];
  gradient: string;
  border: string;
};

type StepItem = {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
};

type CompareRow = {
  label: string;
  app: string;
  kit: string;
  together: string;
};

const kitItems: KitItem[] = [
  {
    title: "Chrono Planner",
    description:
      "Planner giấy giúp bạn chia ngày theo peak focus, việc nhẹ, hồi phục và thói quen quan trọng.",
    icon: <CalendarClock className="h-5 w-5" />,
    tone: "purple",
  },
  {
    title: "Energy Map Cards",
    description:
      "Bộ thẻ gợi ý cách đọc năng lượng theo buổi sáng, trưa, chiều, tối và các block tập trung.",
    icon: <LineChart className="h-5 w-5" />,
    tone: "blue",
  },
  {
    title: "Focus Stickers",
    description:
      "Sticker đánh dấu deep work, admin, recovery, creative work và các mốc hoàn thành trong ngày.",
    icon: <Sticker className="h-5 w-5" />,
    tone: "orange",
  },
  {
    title: "Weekly Reset Sheet",
    description:
      "Trang tổng kết tuần giúp bạn nhìn lại việc đã làm, thời điểm bị lệch nhịp và kế hoạch tuần sau.",
    icon: <RefreshCw className="h-5 w-5" />,
    tone: "green",
  },
];

const useCases: UseCase[] = [
  {
    title: "Cho người dễ lệch lịch",
    description:
      "Nếu bạn thường biết mình cần làm gì nhưng vẫn đặt sai thời điểm, Chrono Kit giúp biến lịch thành thứ dễ nhìn, dễ chạm và dễ giữ nhịp hơn.",
    icon: <CalendarCheck2 className="h-5 w-5 text-[#6F59FF]" />,
    tags: ["Planner", "Routine", "Weekly reset"],
    gradient: "from-[#F5F1FF] to-[#ECE5FF]",
    border: "border-[#D8CCFF]",
  },
  {
    title: "Cho người cần deep work",
    description:
      "Đánh dấu rõ khung tập trung, hạn chế lấp giờ vàng bằng việc nhẹ và giúp bạn chuẩn bị trước cho các block quan trọng.",
    icon: <Brain className="h-5 w-5 text-[#4DA8FF]" />,
    tags: ["Deep work", "Focus", "Peak window"],
    gradient: "from-[#EFF7FF] to-[#E0EEFF]",
    border: "border-[#C7E0FF]",
  },
  {
    title: "Cho người muốn tạo thói quen",
    description:
      "Bộ kit tạo cảm giác tiến bộ bằng các dấu mốc nhỏ, sticker và weekly reflection thay vì chỉ nhìn task list trên màn hình.",
    icon: <Target className="h-5 w-5 text-[#10B981]" />,
    tags: ["Habit", "Streak", "Reflection"],
    gradient: "from-[#ECFCF7] to-[#D7F7EC]",
    border: "border-[#B7EFD9]",
  },
];

const steps: StepItem[] = [
  {
    number: "01",
    title: "Làm bài test chronotype",
    description:
      "Bắt đầu bằng assessment để biết bạn thuộc nhóm nhịp nào và peak focus thường rơi vào đâu.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    number: "02",
    title: "Dùng app để lên lịch",
    description:
      "ChronoFlow gợi ý task, focus session và rhythm dựa trên dữ liệu thật từ planner của bạn.",
    icon: <CalendarClock className="h-5 w-5" />,
  },
  {
    number: "03",
    title: "Dùng Kit để giữ nhịp ngoài đời",
    description:
      "Planner giấy, sticker và weekly reset giúp bạn nhìn lại ngày của mình mà không bị cuốn vào màn hình.",
    icon: <PackageCheck className="h-5 w-5" />,
  },
  {
    number: "04",
    title: "Tích điểm và mở khóa phần thưởng",
    description:
      "Khi hoàn thành task/focus đều đặn, bạn có thể tích coin trong app để đổi các phần quà liên quan đến Chrono Kit.",
    icon: <Gift className="h-5 w-5" />,
  },
];

const compareRows: CompareRow[] = [
  {
    label: "Lên lịch hằng ngày",
    app: "Tự động hóa, dữ liệu thật, gợi ý nhanh",
    kit: "Viết tay, trực quan, giảm nhiễu màn hình",
    together: "App gợi ý, Kit giúp bạn cam kết rõ hơn",
  },
  {
    label: "Theo dõi năng lượng",
    app: "Check-in, biểu đồ, insight",
    kit: "Energy map và ghi chú cảm nhận",
    together: "Dữ liệu số + tự quan sát sâu hơn",
  },
  {
    label: "Tạo động lực",
    app: "Coin, streak, reward",
    kit: "Sticker, milestone, cảm giác hoàn thành",
    together: "Motivation digital + physical",
  },
  {
    label: "Tổng kết tuần",
    app: "Weekly insight, alignment score",
    kit: "Weekly reset sheet",
    together: "Tổng kết định lượng + phản tư cá nhân",
  },
];

const rewardIdeas = [
  {
    icon: <WalletCards className="h-5 w-5 text-[#6F59FF]" />,
    title: "Đổi bằng coin",
    description:
      "Người dùng tích coin từ task, focus session và streak để đổi ưu đãi hoặc vật phẩm trong Reward Center.",
  },
  {
    icon: <Gift className="h-5 w-5 text-[#F59E0B]" />,
    title: "Planner Kit milestone",
    description:
      "Các mốc như 7 ngày, 14 ngày, 30 ngày có thể mở khóa voucher hoặc quà liên quan đến Chrono Kit.",
  },
  {
    icon: <HeartHandshake className="h-5 w-5 text-[#10B981]" />,
    title: "Khuyến khích hành vi tốt",
    description:
      "Reward loop tập trung vào việc duy trì nhịp làm việc lành mạnh, không chỉ hoàn thành task cho có.",
  },
];

export default function ChronoKitPage() {
  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <main className="relative flex flex-col gap-12 overflow-hidden bg-slate-50 pb-28 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <BackgroundDecor />

        <HeroSection />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] space-y-12 px-4 lg:px-8">
          <SectionWrapper id="intro">
            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                  <Box className="h-3.5 w-3.5" />
                  Physical productivity kit
                </div>

                <h2 className="max-w-[820px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Chrono Kit giúp bạn biến nhịp sinh học thành{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    hành động mỗi ngày.
                  </span>
                </h2>

                <p className="mt-5 max-w-[60ch] text-[1rem] leading-8 text-[#615C7A]">
                  App giúp bạn phân tích và gợi ý. Chrono Kit giúp bạn chạm vào
                  kế hoạch thật hơn: viết xuống, dán sticker, nhìn lại tuần và
                  giữ cam kết với nhịp làm việc phù hợp cơ thể.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge icon={<CalendarClock className="h-4 w-4 text-[#6F59FF]" />}>
                    Planner theo nhịp
                  </Badge>
                  <Badge icon={<Sticker className="h-4 w-4 text-[#F59E0B]" />}>
                    Sticker tạo động lực
                  </Badge>
                  <Badge icon={<ShieldCheck className="h-4 w-4 text-[#16A085]" />}>
                    Giữ thói quen bền hơn
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <InsightBox
                  title="Không thay thế app"
                  text="Chrono Kit là lớp hỗ trợ vật lý, giúp bạn đưa insight từ app ra đời sống hằng ngày."
                  icon={<ShieldCheck className="h-4 w-4 text-[#6F59FF]" />}
                  bg="bg-[#F3F0FF]"
                />
                <InsightBox
                  title="Giảm phụ thuộc màn hình"
                  text="Viết tay và sticker giúp bạn có một khoảnh khắc chậm lại để tự nhìn lịch rõ hơn."
                  icon={<Palette className="h-4 w-4 text-[#4DA8FF]" />}
                  bg="bg-[#EEF6FF]"
                />
                <InsightBox
                  title="Gắn với reward loop"
                  text="ChronoFlow có thể dùng coin, streak và reward để khuyến khích người dùng duy trì nhịp tốt."
                  icon={<Gift className="h-4 w-4 text-[#16A085]" />}
                  bg="bg-[#ECFBF7]"
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="inside-kit">
            <SectionHeading
              eyebrow="Inside the kit"
              title={
                <>
                  Trong Chrono Kit{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    có gì?
                  </span>
                </>
              }
              description="Một bộ công cụ vật lý gọn, đẹp và có mục đích rõ ràng: giúp bạn lập kế hoạch theo năng lượng, không chỉ theo deadline."
            />

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {kitItems.map((item, index) => (
                <KitItemCard key={item.title} item={item} index={index} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="kit-preview">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                  <BookOpen className="h-3.5 w-3.5" />
                  Planner preview
                </div>

                <h2 className="max-w-[760px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Một trang planner được chia theo{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    nhịp năng lượng.
                  </span>
                </h2>

                <p className="mt-5 max-w-[58ch] text-[1rem] leading-8 text-[#615C7A]">
                  Thay vì chỉ liệt kê task, Chrono Planner tách ngày thành các
                  vùng: peak focus, light work, creative window và recovery.
                  Điều này giúp bạn không dùng giờ mạnh nhất cho việc nhẹ.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <MiniMetric label="Focus block" value="Deep work" />
                  <MiniMetric label="Light block" value="Admin / email" />
                  <MiniMetric label="Recovery" value="Nghỉ đúng lúc" />
                  <MiniMetric label="Reset" value="Tổng kết tuần" />
                </div>
              </div>

              <PlannerPreview />
            </div>
          </SectionWrapper>

          <SectionWrapper id="use-cases">
            <SectionHeading
              eyebrow="Who it helps"
              title={
                <>
                  Chrono Kit phù hợp với{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    ai?
                  </span>
                </>
              }
              description="Không phải ai cũng cần thêm một cuốn planner. Nhưng nếu bạn đang muốn giữ nhịp làm việc bền hơn, bộ kit này sẽ rất hữu ích."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {useCases.map((item, index) => (
                <UseCaseCard key={item.title} item={item} index={index} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="how-it-works">
            <SectionHeading
              eyebrow="How it works"
              title={
                <>
                  App và Kit hoạt động{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    cùng nhau
                  </span>
                </>
              }
              description="ChronoFlow giữ dữ liệu và gợi ý thông minh. Chrono Kit giúp bạn biến gợi ý đó thành hành động dễ duy trì hơn trong ngày."
            />

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step, index) => (
                <StepCard key={step.number} step={step} index={index} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="app-vs-kit">
            <SectionHeading
              eyebrow="Digital + Physical"
              title={
                <>
                  Vì sao cần cả{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    app và kit?
                  </span>
                </>
              }
              description="ChronoFlow không biến Kit thành tính năng chính thay thế app. Kit là lớp củng cố thói quen, giúp trải nghiệm productivity có cảm giác thật hơn."
            />

            <div className="mt-14 overflow-hidden rounded-[32px] border border-[#ECE8FF] bg-white/80 shadow-[0_18px_45px_rgba(26,21,40,0.04)] backdrop-blur-xl">
              <div className="grid grid-cols-[1fr_repeat(3,1.05fr)] border-b border-[#ECE8FF] bg-[#F8F6FF] text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF] max-lg:hidden">
                <div className="p-4">Hoạt động</div>
                <div className="p-4">App</div>
                <div className="p-4">Kit</div>
                <div className="p-4">Khi kết hợp</div>
              </div>

              <div className="divide-y divide-[#ECE8FF]">
                {compareRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-3 p-4 text-[14px] leading-7 text-[#5B566E] lg:grid-cols-[1fr_repeat(3,1.05fr)] lg:gap-0 lg:p-0"
                  >
                    <div className="font-black text-[#1A1528] lg:p-4">
                      {row.label}
                    </div>
                    <CompareCell label="App" value={row.app} />
                    <CompareCell label="Kit" value={row.kit} />
                    <CompareCell label="Khi kết hợp" value={row.together} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="reward-loop">
            <SectionHeading
              eyebrow="Reward loop"
              title={
                <>
                  Chrono Kit có thể trở thành{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    phần thưởng tạo động lực
                  </span>
                </>
              }
              description="Người dùng không chỉ hoàn thành task trong app. Họ có thể tích coin, giữ streak và mở khóa phần thưởng liên quan đến Planner Kit."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {rewardIdeas.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="rounded-[30px] border border-white/80 bg-white/78 p-6 shadow-[0_18px_40px_rgba(26,21,40,0.04)] backdrop-blur-xl"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="text-[1.1rem] font-[900] tracking-tight text-[#1A1528]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 rounded-[32px] border border-[#E9E5FF] bg-[linear-gradient(135deg,#F8F6FF_0%,#EEF6FF_100%)] p-6 shadow-[0_18px_45px_rgba(26,21,40,0.04)] md:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    MVP positioning
                  </div>

                  <h3 className="text-[clamp(1.8rem,3vw,2.6rem)] font-[900] leading-tight tracking-tight text-[#1A1528]">
                    Kit là phần thưởng và thói quen, không phải tính năng lõi
                    thay thế productivity app.
                  </h3>
                </div>

                <p className="text-[15px] leading-8 text-[#615C7A]">
                  Cách triển khai tốt nhất là để ChronoFlow app vẫn là trung tâm:
                  planner, rhythm, focus, insights. Chrono Kit xuất hiện như một
                  phần thưởng hoặc sản phẩm bổ trợ giúp người dùng cảm nhận tiến
                  bộ rõ hơn ngoài đời.
                </p>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="cta">
            <div className="mx-auto max-w-[920px] text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
                <Sparkles className="h-3.5 w-3.5" />
                Ready to plan better
              </div>

              <h2 className="text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.08] tracking-tight text-[#241F3D]">
                Bắt đầu với app trước,{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  mở khóa Kit sau.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
                Tìm chronotype của bạn, dùng planner để tích dữ liệu thật, rồi
                để Chrono Kit trở thành phần thưởng giúp bạn giữ nhịp lâu dài.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/assessment"
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                >
                  <Sparkles className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                      BẮT ĐẦU
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Làm bài assessment
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/rewards"
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <Gift className="h-3.5 w-3.5 text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Xem Reward Center
                  </span>
                </Link>
              </div>
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

function HeroSection() {
  return (
    <section className="relative z-10 px-4 pb-14 pt-0 lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              {[...Array(7)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute h-2 w-2 rounded-full bg-white"
                  style={{
                    top: `${16 + index * 10}%`,
                    left: `${10 + (index % 4) * 24}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2.4 + index * 0.15,
                    repeat: Infinity,
                    delay: index * 0.24,
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
                Chrono Planner Kit
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mb-4 text-[clamp(2.2rem,4vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]"
              >
                Mang nhịp làm việc của bạn, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  ra khỏi màn hình.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mx-auto mb-8 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]"
              >
                Chrono Kit là bộ planner vật lý đi cùng ChronoFlow app — giúp
                bạn viết xuống kế hoạch, đánh dấu focus block, theo dõi năng
                lượng và giữ nhịp làm việc bền hơn mỗi tuần.
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
                  <Target className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                      BẮT ĐẦU
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Tìm chronotype trước
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/rewards"
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <Play className="ml-0.5 h-3 w-3 fill-[#6F59FF] text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Xem cách nhận Kit
                  </span>
                </Link>
              </motion.div>
            </div>

            <div className="relative mx-auto mt-2 h-[365px] w-full max-w-[820px] perspective-[1400px] sm:h-[400px]">
              <div className="absolute left-[4%] top-[10%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                <FloatPill
                  icon={<CalendarClock className="h-3.5 w-3.5" />}
                  label="Peak planner"
                  tint="purple"
                />
              </div>

              <div className="absolute right-[4%] top-[8%] z-40 hidden animate-[bounce_4.6s_infinite] sm:block">
                <FloatPill
                  icon={<Sticker className="h-3.5 w-3.5" />}
                  label="Focus stickers"
                  tint="orange"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -40, y: 30, rotate: -10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, rotate: -6, scale: 1.02 }}
                className="absolute left-[4%] top-16 z-20 w-[190px] rounded-[32px] shadow-2xl sm:left-[7%] sm:w-[215px]"
              >
                <KitCardMockup />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 70, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="absolute left-1/2 top-2 z-30 w-[245px] -translate-x-1/2 rounded-[38px] shadow-[0_45px_90px_rgba(26,21,40,0.28)] sm:w-[275px]"
              >
                <PlannerBookMockup />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40, y: 30, rotate: 10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, rotate: 6, scale: 1.02 }}
                className="absolute right-[4%] top-16 z-20 w-[190px] rounded-[32px] shadow-2xl sm:right-[7%] sm:w-[215px]"
              >
                <StickerMockup />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KitItemCard({
  item,
  index,
}: {
  item: KitItem;
  index: number;
}) {
  const tone = getTone(item.tone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`group relative flex min-h-[280px] flex-col rounded-[32px] border ${tone.border} bg-gradient-to-br ${tone.gradient} p-[1px] transition-all duration-300 hover:shadow-[0_25px_50px_rgba(111,89,255,0.08)]`}
    >
      <div className="flex h-full flex-col rounded-[31px] bg-white/88 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-[0_10px_24px_rgba(26,21,40,0.06)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${tone.text}`}
          >
            {item.icon}
          </div>

          <div className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${tone.pill}`}>
            Kit item
          </div>
        </div>

        <h3 className="text-[20px] font-[900] leading-tight text-[#1A1528]">
          {item.title}
        </h3>

        <p className="mt-4 flex-1 text-[15px] leading-8 text-[#615C7A]">
          {item.description}
        </p>

        <div className="mt-6 h-1 w-14 rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] transition-all duration-300 group-hover:w-24" />
      </div>
    </motion.div>
  );
}

function PlannerPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      className="relative rounded-[36px] border border-white/80 bg-white/68 p-5 shadow-[0_28px_70px_rgba(65,48,145,0.12)] backdrop-blur-2xl md:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D9EAFF]/80 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#DCCEFF]/70 blur-3xl" />

      <div className="relative z-10 rounded-[30px] border border-[#E9E5FF] bg-[#FCFBFF]/90 p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
              Today rhythm plan
            </div>
            <h3 className="mt-2 text-[1.7rem] font-[900] leading-tight tracking-tight text-[#1A1528]">
              Kế hoạch thứ Hai
            </h3>
          </div>

          <div className="rounded-2xl bg-[#F3F0FF] px-3 py-2 text-[12px] font-black text-[#6F59FF]">
            Bear 🐻
          </div>
        </div>

        <div className="grid gap-3">
          <PlannerRow
            time="09:00"
            title="Deep work"
            desc="Viết proposal / học sâu"
            tone="purple"
          />
          <PlannerRow
            time="13:30"
            title="Admin"
            desc="Email, cập nhật tài liệu"
            tone="blue"
          />
          <PlannerRow
            time="15:30"
            title="Review"
            desc="Kiểm tra tiến độ task"
            tone="orange"
          />
          <PlannerRow
            time="18:00"
            title="Recovery"
            desc="Đi bộ ngắn / reset"
            tone="green"
          />
        </div>

        <div className="mt-5 rounded-[24px] border border-[#E9E5FF] bg-[#F8F6FF] p-4">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Weekly reset prompt
          </div>
          <p className="text-[13px] leading-6 text-[#615C7A]">
            Khung giờ nào giúp bạn tập trung tốt nhất tuần này? Task nào nên dời
            khỏi peak window?
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PlannerRow({
  time,
  title,
  desc,
  tone,
}: {
  time: string;
  title: string;
  desc: string;
  tone: "purple" | "blue" | "green" | "orange";
}) {
  const style = getTone(tone);

  return (
    <div className="rounded-[20px] border border-[#ECE8FF] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.soft} ${style.text}`}
        >
          {style.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[13px] font-black ${style.text}`}>
              {time}
            </span>
            <span className="rounded-full bg-[#F8F6FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
              {title}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-6 text-[#615C7A]">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function UseCaseCard({ item, index }: { item: UseCase; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className={`rounded-[30px] border ${item.border} bg-gradient-to-br ${item.gradient} p-5 shadow-[0_18px_40px_rgba(26,21,40,0.04)]`}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
        {item.icon}
      </div>

      <h3 className="text-[1.15rem] font-[900] tracking-tight text-[#1A1528]">
        {item.title}
      </h3>

      <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
        {item.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#5B566E] shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function StepCard({ step, index }: { step: StepItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/78 p-6 shadow-[0_18px_40px_rgba(26,21,40,0.04)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#DCCEFF]/45 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between">
          <div className="text-[2.2rem] font-[900] leading-none tracking-tight text-[#6F59FF]/25">
            {step.number}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF] shadow-sm">
            {step.icon}
          </div>
        </div>

        <h3 className="text-[1.08rem] font-[900] tracking-tight text-[#1A1528]">
          {step.title}
        </h3>

        <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
          {step.description}
        </p>
      </div>
    </motion.div>
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

function BackgroundDecor() {
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

function Badge({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
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

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/82 p-4 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-1 text-[14px] font-[900] text-[#1A1528]">{value}</div>
    </div>
  );
}

function CompareCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#F8F9FE] px-4 py-3 lg:rounded-none lg:bg-transparent lg:p-4">
      <div className="mb-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8A84A3] lg:hidden">
        {label}
      </div>
      <div className="font-semibold text-[#5B566E]">{value}</div>
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

function KitCardMockup() {
  return (
    <div className="rounded-[32px] border border-white bg-white/92 p-4 shadow-[0_25px_60px_rgba(26,21,40,0.16)] backdrop-blur-xl">
      <div className="rounded-[24px] bg-[linear-gradient(180deg,#F8F6FF_0%,#EFEAFF_100%)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Energy cards
          </div>
          <LineChart className="h-4 w-4 text-[#6F59FF]" />
        </div>

        <div className="space-y-2.5">
          <MockCardLine title="Peak focus" value="09:00" tone="purple" />
          <MockCardLine title="Light work" value="13:30" tone="blue" />
          <MockCardLine title="Recovery" value="18:00" tone="green" />
        </div>

        <div className="mt-4 rounded-[18px] bg-[#1A1528] p-3 text-white">
          <div className="text-[10px] uppercase tracking-[0.12em] text-white/45">
            Reminder
          </div>
          <div className="mt-1 text-[11px] font-bold leading-snug">
            Đừng dùng giờ mạnh nhất cho việc nhẹ.
          </div>
        </div>
      </div>
    </div>
  );
}

function PlannerBookMockup() {
  return (
    <div className="rounded-[36px] border border-white bg-white p-4 shadow-[0_35px_80px_rgba(26,21,40,0.2)]">
      <div className="rounded-[28px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FE_100%)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              Chrono Planner
            </div>
            <div className="mt-1 text-[17px] font-[900] text-[#1A1528]">
              Today rhythm
            </div>
          </div>
          <div className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[10px] font-black text-[#6F59FF]">
            Bear
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E9E5FF] bg-[#F8F6FF] p-3">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#6F59FF]">
            Focus block
          </div>
          <div className="h-2 rounded-full bg-white">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]" />
          </div>
          <div className="mt-2 text-[11px] font-bold text-[#5B566E]">
            09:00 – 12:00
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          <PlannerMiniRow time="09:00" title="Deep work" />
          <PlannerMiniRow time="13:30" title="Admin" />
          <PlannerMiniRow time="16:30" title="Review" />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {["⚡", "🧠", "☕", "✅"].map((item) => (
            <div
              key={item}
              className="flex h-9 items-center justify-center rounded-xl bg-[#F8F6FF] text-[15px]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StickerMockup() {
  return (
    <div className="rounded-[32px] border border-white bg-white/92 p-4 shadow-[0_25px_60px_rgba(26,21,40,0.16)] backdrop-blur-xl">
      <div className="rounded-[24px] bg-[linear-gradient(180deg,#FFF9F2_0%,#FFF4E8_100%)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9A7B56]">
            Sticker sheet
          </div>
          <Sticker className="h-4 w-4 text-[#F59E0B]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            "Deep",
            "Admin",
            "Reset",
            "Done",
            "Focus",
            "Break",
            "Plan",
            "Win",
          ].map((label, index) => (
            <div
              key={label}
              className={`rounded-full px-3 py-2 text-center text-[10px] font-black shadow-sm ${
                index % 4 === 0
                  ? "bg-[#F3F0FF] text-[#6F59FF]"
                  : index % 4 === 1
                    ? "bg-[#EEF6FF] text-[#4DA8FF]"
                    : index % 4 === 2
                      ? "bg-[#ECFDF5] text-[#10B981]"
                      : "bg-white text-[#F59E0B]"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[18px] bg-white/85 p-3">
          <div className="text-[10px] uppercase tracking-[0.12em] text-[#9A7B56]">
            Tiny reward
          </div>
          <div className="mt-1 text-[11px] font-bold leading-snug text-[#1A1528]">
            Mỗi sticker là một dấu mốc tiến bộ nhỏ.
          </div>
        </div>
      </div>
    </div>
  );
}

function MockCardLine({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "purple" | "blue" | "green";
}) {
  const className = {
    purple: "bg-white text-[#6F59FF]",
    blue: "bg-white text-[#4DA8FF]",
    green: "bg-white text-[#10B981]",
  }[tone];

  return (
    <div className="flex items-center justify-between rounded-[16px] bg-white/80 px-3 py-2 shadow-sm">
      <span className="text-[10px] font-bold text-[#5B566E]">{title}</span>
      <span className={`rounded-full px-2 py-1 text-[10px] font-black ${className}`}>
        {value}
      </span>
    </div>
  );
}

function PlannerMiniRow({ time, title }: { time: string; title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[16px] border border-[#E9E5FF] bg-white px-3 py-2">
      <div className="h-2.5 w-2.5 rounded-full bg-[#6F59FF]" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-black text-[#1A1528]">{title}</div>
        <div className="text-[9px] font-bold text-[#8A84A3]">{time}</div>
      </div>
    </div>
  );
}

function getTone(tone: "purple" | "blue" | "green" | "orange") {
  const tones = {
    purple: {
      text: "text-[#6F59FF]",
      soft: "bg-[#F3F0FF]",
      pill: "bg-[#F3F0FF] text-[#6F59FF]",
      border: "border-[#D8CCFF]",
      gradient: "from-[#F5F1FF] to-[#ECE5FF]",
      icon: <Zap className="h-4 w-4" />,
    },
    blue: {
      text: "text-[#4DA8FF]",
      soft: "bg-[#EEF6FF]",
      pill: "bg-[#EEF6FF] text-[#4DA8FF]",
      border: "border-[#C7E0FF]",
      gradient: "from-[#EFF7FF] to-[#E0EEFF]",
      icon: <Clock3 className="h-4 w-4" />,
    },
    green: {
      text: "text-[#10B981]",
      soft: "bg-[#ECFDF5]",
      pill: "bg-[#ECFDF5] text-[#10B981]",
      border: "border-[#B7EFD9]",
      gradient: "from-[#ECFCF7] to-[#D7F7EC]",
      icon: <Coffee className="h-4 w-4" />,
    },
    orange: {
      text: "text-[#F59E0B]",
      soft: "bg-[#FFF7ED]",
      pill: "bg-[#FFF7ED] text-[#F59E0B]",
      border: "border-[#FFD38C]",
      gradient: "from-[#FFF8ED] to-[#FFE5B5]",
      icon: <Sun className="h-4 w-4" />,
    },
  };

  return tones[tone];
}