"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Coffee,
  Compass,
  LineChart,
  Moon,
  MoonStar,
  Play,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunset,
  Target,
  Timer,
  Waves,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTASection from "@/components/home/FinalCTASection";

type ChronotypeKey = "lion" | "bear" | "wolf" | "dolphin";

type ChronotypeItem = {
  key: ChronotypeKey;
  name: string;
  viName: string;
  subtitle: string;
  emojiUrl: string;
  icon: ReactNode;
  accent: string;
  bg: string;
  border: string;
  soft: string;
  bestTime: string;
  energyPeak: string;
  recovery: string;
  description: string;
  strengths: string[];
  risks: string[];
  bestFor: string[];
  planningTips: string[];
  schedule: Array<{
    time: string;
    title: string;
    description: string;
    tone: "purple" | "blue" | "green" | "orange";
  }>;
};

const chronotypes: ChronotypeItem[] = [
  {
    key: "lion",
    name: "Lion",
    viName: "Sư tử",
    subtitle: "Mạnh vào buổi sáng, thích bắt đầu sớm",
    emojiUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",
    icon: <Sun className="h-6 w-6 text-[#C98C42]" />,
    accent: "text-[#B7772E]",
    bg: "from-[#FFF9F0] via-[#FDF2E9] to-[#FFF1E0]",
    border: "border-[#F4D6A7]",
    soft: "bg-[#FFF7ED]",
    bestTime: "07:00 – 11:00",
    energyPeak: "Đầu ngày",
    recovery: "Chiều muộn",
    description:
      "Sư tử thường tỉnh táo sớm, vào việc nhanh ở đầu ngày và phù hợp với các task cần tập trung sâu vào buổi sáng.",
    strengths: [
      "Dễ khởi động ngày mới",
      "Hợp với deep work buổi sáng",
      "Ra quyết định sớm khá tốt",
      "Dễ duy trì routine ổn định",
    ],
    risks: [
      "Dễ hụt năng lượng cuối ngày",
      "Không hợp làm việc nặng quá muộn",
      "Có thể lãng phí giờ vàng cho việc nhẹ",
    ],
    bestFor: ["Deep work", "Phân tích", "Ra quyết định", "Học tập"],
    planningTips: [
      "Đặt việc khó nhất trong ngày vào buổi sáng.",
      "Để email, admin hoặc họp ngắn vào cuối buổi sáng hoặc đầu chiều.",
      "Tránh lên lịch task nặng sau chiều muộn.",
    ],
    schedule: [
      {
        time: "07:00",
        title: "Deep work",
        description: "Việc khó, học sâu, phân tích hoặc ra quyết định quan trọng.",
        tone: "orange",
      },
      {
        time: "11:00",
        title: "Họp / xử lý nhanh",
        description: "Dùng phần còn tỉnh táo để hoàn tất trao đổi ngắn.",
        tone: "purple",
      },
      {
        time: "14:30",
        title: "Admin nhẹ",
        description: "Email, cập nhật tài liệu, checklist hoặc việc ít tải não.",
        tone: "blue",
      },
      {
        time: "17:00",
        title: "Recovery",
        description: "Giảm tốc, nghỉ ngắn, chuẩn bị kết thúc ngày.",
        tone: "green",
      },
    ],
  },
  {
    key: "bear",
    name: "Bear",
    viName: "Gấu",
    subtitle: "Nhịp cân bằng, hợp lịch ban ngày",
    emojiUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png",
    icon: <Sunset className="h-6 w-6 text-[#6C58F2]" />,
    accent: "text-[#6C58F2]",
    bg: "from-[#F8F7FF] via-[#E9E4FF] to-[#DFD9FF]",
    border: "border-[#D9CEFF]",
    soft: "bg-[#F3F0FF]",
    bestTime: "09:00 – 14:00",
    energyPeak: "Cuối sáng",
    recovery: "Sau chiều",
    description:
      "Gấu thường hợp với nhịp sinh hoạt ban ngày, năng lượng tương đối ổn định và dễ thích nghi với lịch học/làm tiêu chuẩn.",
    strengths: [
      "Dễ theo lịch ban ngày",
      "Ổn định trong học tập và công việc",
      "Phù hợp làm việc nhóm",
      "Dễ cân bằng routine",
    ],
    risks: [
      "Dễ để lịch bị chia nhỏ bởi họp và tin nhắn",
      "Có thể thiếu block tập trung sâu",
      "Dễ tưởng mình hợp mọi kiểu lịch",
    ],
    bestFor: ["Họp", "Deep work vừa", "Hợp tác", "Vận hành"],
    planningTips: [
      "Chặn trước block tập trung 09:00–12:00.",
      "Gom việc giao tiếp/họp vào đầu giờ chiều.",
      "Giữ giờ ngủ ổn định để bảo toàn nhịp đều.",
    ],
    schedule: [
      {
        time: "09:00",
        title: "Focus block",
        description: "Việc quan trọng, học tập hoặc xử lý task cần đầu óc rõ.",
        tone: "purple",
      },
      {
        time: "13:30",
        title: "Collaboration",
        description: "Họp, trao đổi nhóm, phản hồi và quyết định vừa phải.",
        tone: "blue",
      },
      {
        time: "15:30",
        title: "Admin / routine",
        description: "Dọn inbox, cập nhật planner, xử lý việc lặp lại.",
        tone: "green",
      },
      {
        time: "18:00",
        title: "Wind down",
        description: "Giảm tải để không kéo căng năng lượng sang tối.",
        tone: "orange",
      },
    ],
  },
  {
    key: "wolf",
    name: "Wolf",
    viName: "Sói",
    subtitle: "Khởi động chậm hơn, mạnh về chiều/tối",
    emojiUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png",
    icon: <Moon className="h-6 w-6 text-[#5B46FF]" />,
    accent: "text-[#5B46FF]",
    bg: "from-[#F5F5FF] via-[#E2E1FF] to-[#D6D4FF]",
    border: "border-[#CCC9FF]",
    soft: "bg-[#F4F4FF]",
    bestTime: "15:00 – 21:00",
    energyPeak: "Chiều/tối",
    recovery: "Sáng sớm",
    description:
      "Sói thường cần thời gian để vào guồng buổi sáng, nhưng có thể tập trung và sáng tạo tốt hơn vào cuối chiều hoặc tối.",
    strengths: [
      "Hợp với creative work cuối ngày",
      "Dễ vào flow khi không bị ép lịch sớm",
      "Tư duy linh hoạt và nhiều ý tưởng",
      "Có thể xử lý task khó vào chiều/tối",
    ],
    risks: [
      "Buổi sáng dễ ì hơn",
      "Khó hợp với lịch quá sớm",
      "Dễ ngủ muộn nếu không có ranh giới",
    ],
    bestFor: ["Sáng tạo", "Học sâu", "Lên ý tưởng", "Viết / thiết kế"],
    planningTips: [
      "Buổi sáng nên bắt đầu bằng việc nhẹ hoặc chuẩn bị.",
      "Đặt task sáng tạo/tập trung vào cuối chiều.",
      "Tạo ranh giới kết thúc ngày để không trượt quá muộn.",
    ],
    schedule: [
      {
        time: "09:30",
        title: "Warm-up",
        description: "Việc nhẹ, xem planner, email đơn giản hoặc chuẩn bị tài liệu.",
        tone: "blue",
      },
      {
        time: "14:30",
        title: "Build momentum",
        description: "Bắt đầu các task cần tư duy nhiều hơn.",
        tone: "purple",
      },
      {
        time: "17:00",
        title: "Creative flow",
        description: "Viết, thiết kế, giải quyết vấn đề, học sâu.",
        tone: "orange",
      },
      {
        time: "21:00",
        title: "Wind down",
        description: "Tắt dần kích thích để tránh ngủ quá muộn.",
        tone: "green",
      },
    ],
  },
  {
    key: "dolphin",
    name: "Dolphin",
    viName: "Cá heo",
    subtitle: "Nhạy giấc ngủ, hợp lịch mềm và block ngắn",
    emojiUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    icon: <Waves className="h-6 w-6 text-[#8A7AF0]" />,
    accent: "text-[#8A7AF0]",
    bg: "from-[#F9F8FF] via-[#EBE6FF] to-[#E2DAFF]",
    border: "border-[#DDD4FF]",
    soft: "bg-[#F8F6FF]",
    bestTime: "Linh hoạt theo block",
    energyPeak: "Theo từng đợt",
    recovery: "Cần xen kẽ",
    description:
      "Cá heo thường nhạy với giấc ngủ, môi trường và mức căng thẳng. Lịch mềm, rõ block và có khoảng nghỉ sẽ phù hợp hơn.",
    strengths: [
      "Nhạy với tín hiệu cơ thể",
      "Hợp với sprint ngắn, rõ mục tiêu",
      "Dễ nhận ra khi môi trường chưa ổn",
      "Có thể tối ưu tốt khi lịch linh hoạt",
    ],
    risks: [
      "Dễ mất nhịp nếu ngủ không tốt",
      "Khó theo lịch quá cứng",
      "Dễ quá tải nếu ngày quá dày",
    ],
    bestFor: ["Task ngắn", "Review", "Giải quyết vấn đề", "Lịch linh hoạt"],
    planningTips: [
      "Chia việc lớn thành block nhỏ hơn.",
      "Ưu tiên môi trường yên tĩnh và ít kích thích.",
      "Để buffer giữa các task quan trọng.",
    ],
    schedule: [
      {
        time: "10:00",
        title: "Short focus",
        description: "Một block rõ mục tiêu, không quá dài.",
        tone: "purple",
      },
      {
        time: "12:00",
        title: "Reset",
        description: "Nghỉ nhẹ, giảm kích thích, ăn uống và hồi phục.",
        tone: "green",
      },
      {
        time: "15:30",
        title: "Problem solving",
        description: "Task vừa sức, xử lý theo sprint ngắn.",
        tone: "blue",
      },
      {
        time: "18:30",
        title: "Soft closure",
        description: "Tổng kết nhẹ, không ép thêm việc quá tải.",
        tone: "orange",
      },
    ],
  },
];

const comparisonRows = [
  {
    label: "Thời điểm mạnh nhất",
    lion: "Sáng sớm",
    bear: "Cuối sáng",
    wolf: "Chiều/tối",
    dolphin: "Theo block",
  },
  {
    label: "Dễ hụt năng lượng",
    lion: "Chiều muộn",
    bear: "Sau trưa",
    wolf: "Sáng sớm",
    dolphin: "Khi thiếu ngủ",
  },
  {
    label: "Lịch phù hợp",
    lion: "Bắt đầu sớm",
    bear: "Lịch ban ngày",
    wolf: "Linh hoạt muộn hơn",
    dolphin: "Mềm, có buffer",
  },
  {
    label: "Task hợp nhất",
    lion: "Deep work",
    bear: "Họp + vận hành",
    wolf: "Creative work",
    dolphin: "Sprint ngắn",
  },
];

const corePrinciples = [
  {
    icon: <Clock3 className="h-5 w-5 text-[#6F59FF]" />,
    title: "Không phải ai cũng mạnh cùng một giờ",
    text: "Chronotype giúp bạn hiểu vì sao một lịch hiệu quả với người khác chưa chắc phù hợp với bạn.",
    tone: "from-[#F5F1FF] to-[#ECE5FF]",
    border: "border-[#D8CCFF]",
  },
  {
    icon: <Brain className="h-5 w-5 text-[#4DA8FF]" />,
    title: "Đặt đúng loại việc vào đúng nhịp",
    text: "Deep work, việc nhẹ, sáng tạo và recovery nên nằm ở các thời điểm khác nhau trong ngày.",
    tone: "from-[#EFF7FF] to-[#E0EEFF]",
    border: "border-[#C7E0FF]",
  },
  {
    icon: <Coffee className="h-5 w-5 text-[#16A085]" />,
    title: "Hồi phục cũng là một phần của năng suất",
    text: "Một ngày bền vững không chỉ có làm việc, mà còn cần khoảng thở đúng lúc.",
    tone: "from-[#ECFCF7] to-[#D7F7EC]",
    border: "border-[#B7EFD9]",
  },
];

export default function ChronotypesPage() {
  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <main className="relative flex flex-col gap-12 overflow-hidden bg-slate-50 pb-28 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <BackgroundDecor />

        <HeroSection />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] space-y-12 px-4 lg:px-8">
          <SectionWrapper id="overview">
            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                  <MoonStar className="h-3.5 w-3.5" />
                  Chronotype là gì?
                </div>

                <h2 className="max-w-[820px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Chronotype là cách cơ thể{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    phân bổ năng lượng
                  </span>{" "}
                  trong ngày.
                </h2>

                <p className="mt-5 max-w-[60ch] text-[1rem] leading-8 text-[#615C7A]">
                  Có người tỉnh táo sớm, có người mạnh hơn vào chiều hoặc tối,
                  có người lại cần lịch mềm hơn vì nhạy với giấc ngủ và môi
                  trường. Hiểu chronotype giúp bạn bớt tự trách và bắt đầu sắp
                  việc theo thời điểm hợp cơ thể hơn.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge icon={<Brain className="h-4 w-4 text-[#6F59FF]" />}>
                    Hiểu mình rõ hơn
                  </Badge>
                  <Badge icon={<CalendarClock className="h-4 w-4 text-[#4DA8FF]" />}>
                    Lên lịch hợp nhịp
                  </Badge>
                  <Badge icon={<ShieldCheck className="h-4 w-4 text-[#16A085]" />}>
                    Giảm quá tải
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <InsightBox
                  title="Chronotype không phải nhãn cố định"
                  text="Nó là điểm khởi đầu để bạn quan sát năng lượng, không phải lý do để giới hạn bản thân."
                  icon={<Compass className="h-4 w-4 text-[#6F59FF]" />}
                  bg="bg-[#F3F0FF]"
                />
                <InsightBox
                  title="Timing ảnh hưởng hiệu suất"
                  text="Cùng một task nhưng đặt sai thời điểm có thể khiến bạn thấy nặng hơn rất nhiều."
                  icon={<Timer className="h-4 w-4 text-[#4DA8FF]" />}
                  bg="bg-[#EEF6FF]"
                />
                <InsightBox
                  title="ChronoFlow biến hiểu biết thành lịch"
                  text="Sau khi biết chronotype, ChronoFlow giúp bạn đưa insight đó vào planner, rhythm và focus session."
                  icon={<Target className="h-4 w-4 text-[#16A085]" />}
                  bg="bg-[#ECFBF7]"
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="four-types">
            <SectionHeading
              eyebrow="4 chronotype phổ biến"
              title={
                <>
                  4 kiểu nhịp sinh học{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    thường gặp
                  </span>
                </>
              }
              description="Mỗi nhóm có xu hướng năng lượng, thời điểm tập trung và cách hồi phục khác nhau. Hãy xem nhóm nào gần với bạn nhất."
            />

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {chronotypes.map((item, index) => (
                <ChronotypeCard key={item.key} item={item} index={index} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="energy">
            <SectionHeading
              eyebrow="Energy curve"
              title={
                <>
                  Mỗi chronotype có{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    đường năng lượng riêng
                  </span>
                </>
              }
              description="Biểu đồ dưới đây minh hoạ cách năng lượng có thể lên xuống trong ngày. ChronoFlow dùng ý tưởng này để gợi ý thời điểm phù hợp cho từng loại task."
            />

            <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="overflow-hidden rounded-[32px] border border-white/80 bg-white/60 p-6 shadow-[0_20px_50px_rgba(26,21,40,0.05)] ring-1 ring-gray-100 backdrop-blur-xl"
              >
                <div className="mb-6 flex flex-wrap items-center gap-4 text-[12px] font-bold text-[#4F4A68]">
                  <Legend color="#F59E0B" label="Lion" />
                  <Legend color="#6F59FF" label="Bear" />
                  <Legend color="#4DA8FF" label="Wolf" />
                  <Legend color="#10B981" label="Dolphin" />
                </div>

                <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-[340px]">
                  <EnergyGraph />
                </div>
              </motion.div>

              <div className="space-y-5">
                <InsightBox
                  title="Đừng dùng giờ mạnh nhất cho việc nhẹ"
                  text="Nếu peak focus bị tiêu vào email hoặc chat, các task quan trọng sẽ có cảm giác nặng hơn."
                  icon={<Brain className="h-5 w-5 text-[#6F59FF]" />}
                  bg="bg-[#F3F0FF]"
                />
                <InsightBox
                  title="Không cần tối ưu từng phút"
                  text="Chỉ cần đặt đúng vài block quan trọng mỗi ngày đã đủ tạo khác biệt rõ rệt."
                  icon={<LineChart className="h-5 w-5 text-[#4DA8FF]" />}
                  bg="bg-[#EEF6FF]"
                />
                <InsightBox
                  title="Recovery giúp giữ nhịp bền"
                  text="Nghỉ đúng lúc giúp bạn tránh kéo dài tình trạng quá tải sang ngày hôm sau."
                  icon={<Coffee className="h-5 w-5 text-[#16A085]" />}
                  bg="bg-[#ECFBF7]"
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="detail">
            <SectionHeading
              eyebrow="Chi tiết từng nhóm"
              title={
                <>
                  Xem cách từng chronotype{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    nên sắp ngày
                  </span>
                </>
              }
              description="Không chỉ biết mình thuộc nhóm nào, bạn cần biến nó thành quyết định cụ thể trong planner."
            />

            <div className="mt-16 space-y-8">
              {chronotypes.map((item, index) => (
                <ChronotypeDetail key={item.key} item={item} index={index} />
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper id="compare">
            <SectionHeading
              eyebrow="So sánh nhanh"
              title={
                <>
                  Nhìn nhanh sự khác nhau giữa{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    4 nhóm
                  </span>
                </>
              }
              description="Bảng này giúp bạn so sánh thời điểm mạnh, điểm dễ hụt và cách lên lịch phù hợp hơn."
            />

            <div className="mt-14 overflow-hidden rounded-[32px] border border-[#ECE8FF] bg-white/80 shadow-[0_18px_45px_rgba(26,21,40,0.04)] backdrop-blur-xl">
              <div className="grid grid-cols-[1.15fr_repeat(4,0.95fr)] border-b border-[#ECE8FF] bg-[#F8F6FF] text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF] max-lg:hidden">
                <div className="p-4">Tiêu chí</div>
                <div className="p-4">Sư tử</div>
                <div className="p-4">Gấu</div>
                <div className="p-4">Sói</div>
                <div className="p-4">Cá heo</div>
              </div>

              <div className="divide-y divide-[#ECE8FF]">
                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-3 p-4 text-[14px] leading-7 text-[#5B566E] lg:grid-cols-[1.15fr_repeat(4,0.95fr)] lg:gap-0 lg:p-0"
                  >
                    <div className="font-black text-[#1A1528] lg:p-4">
                      {row.label}
                    </div>
                    <CompareCell label="Sư tử" value={row.lion} />
                    <CompareCell label="Gấu" value={row.bear} />
                    <CompareCell label="Sói" value={row.wolf} />
                    <CompareCell label="Cá heo" value={row.dolphin} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="apply">
            <SectionHeading
              eyebrow="Áp dụng vào ChronoFlow"
              title={
                <>
                  Từ chronotype đến{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    planner thực tế
                  </span>
                </>
              }
              description="ChronoFlow không dừng ở việc phân loại. Mục tiêu là giúp bạn dùng insight này để sắp việc, focus và hồi phục tốt hơn."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {corePrinciples.map((item, index) => (
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

                  <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
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
                    Làm bài đánh giá
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/planner"
                className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                  <CalendarClock className="h-3.5 w-3.5 text-[#6F59FF]" />
                </div>
                <span className="text-[14px] font-bold leading-tight">
                  Mở planner
                </span>
              </Link>
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
                Chronotype Library
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mb-4 text-[clamp(2.2rem,4vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]"
              >
                Hiểu 4 chronotype, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  chọn đúng nhịp làm việc.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mx-auto mb-8 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]"
              >
                Sư tử, Gấu, Sói và Cá heo không chỉ là tên gọi vui. Mỗi nhóm
                gợi ý cách năng lượng của bạn lên xuống trong ngày, từ đó giúp
                bạn đặt deep work, việc nhẹ và recovery đúng thời điểm hơn.
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
                      3 PHÚT
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Tìm chronotype của bạn
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/learn"
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <Play className="ml-0.5 h-3 w-3 fill-[#6F59FF] text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Đọc thêm nền tảng
                  </span>
                </Link>
              </motion.div>
            </div>

            <div className="relative mx-auto mt-2 h-[360px] w-full max-w-[760px] perspective-[1400px] sm:h-[390px]">
              <div className="absolute left-[4%] top-[10%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                <FloatPill
                  icon={<Sun className="h-3.5 w-3.5" />}
                  label="Lion • Morning"
                  tint="orange"
                />
              </div>

              <div className="absolute right-[4%] top-[8%] z-40 hidden animate-[bounce_4.6s_infinite] sm:block">
                <FloatPill
                  icon={<Moon className="h-3.5 w-3.5" />}
                  label="Wolf • Evening"
                  tint="purple"
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
                  <ChronotypeListPhone />
                </PhoneFrame>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 70, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="absolute left-1/2 top-3 z-30 w-[220px] -translate-x-1/2 rounded-[38px] shadow-[0_45px_90px_rgba(26,21,40,0.28)] sm:w-[245px]"
              >
                <PhoneFrame large>
                  <ChronotypeResultPhone />
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
                  <ChronotypeSchedulePhone />
                </PhoneFrame>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChronotypeCard({
  item,
  index,
}: {
  item: ChronotypeItem;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative flex flex-col rounded-[32px] border border-white/80 bg-white/70 p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-white hover:shadow-[0_25px_50px_rgba(111,89,255,0.08)]"
    >
      <div
        className={`absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br ${item.bg} opacity-45 transition-opacity duration-300 group-hover:opacity-85`}
      />

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
          src={item.emojiUrl}
          alt={item.viName}
          className="h-[84px] w-[84px] object-contain drop-shadow-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110"
        />
      </div>

      <div className="flex-1 text-center">
        <h3 className={`text-[24px] font-[900] tracking-tight ${item.accent}`}>
          {item.viName}
        </h3>
        <p className="mt-2 text-[12px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
          {item.subtitle}
        </p>
        <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#5B566E]">
          {item.description}
        </p>
      </div>

      <div className="mt-6 rounded-[20px] border border-white/60 bg-white/65 p-4 shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:bg-white/90">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          Khung tập trung
        </div>
        <div className="mt-1 text-[14px] font-bold text-[#1A1528]">
          {item.bestTime}
        </div>

        <div className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          Hợp với
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {item.bestFor.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-[#EAE8F7] bg-white px-2 py-1 text-[11px] font-bold text-[#5E587A]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ChronotypeDetail({
  item,
  index,
}: {
  item: ChronotypeItem;
  index: number;
}) {
  const isReverse = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`grid gap-6 rounded-[34px] border ${item.border} bg-gradient-to-br ${item.bg} p-5 shadow-[0_18px_50px_rgba(26,21,40,0.05)] md:p-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch ${
        isReverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="rounded-[30px] border border-white/80 bg-white/78 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
              {item.icon}
              {item.name}
            </div>

            <h3 className="text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-[1.02] tracking-tight text-[#1A1528]">
              {item.viName}
            </h3>

            <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[#5B566E]">
              {item.subtitle}
            </p>
          </div>

          <img
            src={item.emojiUrl}
            alt={item.viName}
            className="h-[86px] w-[86px] object-contain drop-shadow-xl"
          />
        </div>

        <p className="mt-5 text-[15px] leading-8 text-[#615C7A]">
          {item.description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MiniMetric label="Peak" value={item.energyPeak} />
          <MiniMetric label="Focus" value={item.bestTime} />
          <MiniMetric label="Recovery" value={item.recovery} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ListBox
            title="Điểm mạnh"
            icon={<CheckCircle2 className="h-4 w-4 text-[#10B981]" />}
            items={item.strengths}
          />
          <ListBox
            title="Cần lưu ý"
            icon={<ShieldCheck className="h-4 w-4 text-[#F59E0B]" />}
            items={item.risks}
          />
        </div>
      </div>

      <div className="rounded-[30px] border border-white/80 bg-white/78 p-6 shadow-sm backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
          <CalendarClock className="h-3.5 w-3.5" />
          Lịch gợi ý
        </div>

        <h4 className="text-[1.45rem] font-[900] tracking-tight text-[#1A1528]">
          Một ngày hợp với {item.viName}
        </h4>

        <div className="mt-5 space-y-3">
          {item.schedule.map((slot) => (
            <ScheduleRow key={`${item.key}-${slot.time}`} item={slot} />
          ))}
        </div>

        <div className="mt-6 rounded-[24px] border border-[#E9E5FF] bg-[#FBF9FF] p-5">
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Cách áp dụng trong ChronoFlow
          </div>

          <div className="space-y-2.5">
            {item.planningTips.map((tip) => (
              <div key={tip} className="flex items-start gap-2.5">
                <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-[#6F59FF]" />
                <span className="text-[13px] leading-6 text-[#5B566E]">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScheduleRow({
  item,
}: {
  item: {
    time: string;
    title: string;
    description: string;
    tone: "purple" | "blue" | "green" | "orange";
  };
}) {
  const tone = getTone(item.tone);

  return (
    <div className="rounded-[22px] border border-[#ECE8FF] bg-white/85 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tone.bg}`}
        >
          {tone.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[13px] font-black ${tone.text}`}>
              {item.time}
            </span>
            <span className="rounded-full bg-[#F8F6FF] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
              {item.title}
            </span>
          </div>

          <p className="mt-2 text-[13px] leading-6 text-[#615C7A]">
            {item.description}
          </p>
        </div>
      </div>
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

function ListBox({
  title,
  icon,
  items,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-[#ECE8FF] bg-[#FCFBFF] p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
          {icon}
        </div>
        <h4 className="text-[13px] font-[900] text-[#1A1528]">{title}</h4>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6F59FF]" />
            <span className="text-[13px] leading-6 text-[#615C7A]">
              {item}
            </span>
          </div>
        ))}
      </div>
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

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="h-2 w-4 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
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

function PhoneFrame({
  children,
  large = false,
}: {
  children: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[2.8rem] border border-[#1A1528]/10 bg-[#151122] p-2.5 shadow-[0_25px_60px_rgba(26,21,40,0.24)] ${
        large ? "w-[235px] md:w-[255px]" : "w-[185px] md:w-[205px]"
      }`}
    >
      <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black/80" />
      <div className="overflow-hidden rounded-[2.2rem] border border-white/10">
        <div className={large ? "h-[470px]" : "h-[380px]"}>{children}</div>
      </div>
    </div>
  );
}

function ChronotypeListPhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#F8F5FF_0%,#F2EDFF_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
          Library
        </div>
        <div className="text-[15px] font-[900] leading-tight">
          4 chronotype
        </div>
      </div>

      <div className="space-y-2.5">
        {[
          { name: "Sư tử", time: "07:00", emoji: "🦁", active: false },
          { name: "Gấu", time: "09:00", emoji: "🐻", active: true },
          { name: "Sói", time: "15:00", emoji: "🐺", active: false },
          { name: "Cá heo", time: "Sprint", emoji: "🐬", active: false },
        ].map((item) => (
          <div
            key={item.name}
            className={`rounded-[18px] border p-3 shadow-sm ${
              item.active
                ? "border-[#6F59FF] bg-white"
                : "border-white/80 bg-white/78"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[18px]">
                {item.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-[900]">{item.name}</div>
                <div className="text-[10px] font-bold text-[#8A84A3]">
                  Peak: {item.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-[18px] bg-[#1A1528] p-3 text-white shadow-lg">
        <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-gray-400">
          Key idea
        </div>
        <div className="text-[12px] font-bold leading-snug">
          Không phải ai cũng tập trung tốt nhất vào cùng một giờ.
        </div>
      </div>
    </div>
  );
}

function ChronotypeResultPhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#6F59FF_0%,#4DA8FF_100%)] p-4 text-white">
      <div className="mb-4 mt-4 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
            Result
          </div>
          <div className="text-[18px] font-[900] leading-tight">
            Chronotype của bạn
          </div>
        </div>
        <div className="rounded-full bg-white/20 p-2">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-[18px] border border-white/15 bg-white/12 p-3 backdrop-blur-md">
          <div className="text-[9px] font-bold uppercase text-white/70">
            Nhóm chính
          </div>
          <div className="mt-1 text-[15px] font-[900]">Gấu 🐻</div>
        </div>
        <div className="rounded-[18px] border border-white/15 bg-white/12 p-3 backdrop-blur-md">
          <div className="text-[9px] font-bold uppercase text-white/70">
            Peak focus
          </div>
          <div className="mt-1 text-[15px] font-[900]">09:00</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-[24px] bg-white p-4 text-[#1A1528] shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-[900]">Energy curve</div>
          <div className="rounded-full bg-[#F3F0FF] px-2 py-1 text-[9px] font-bold text-[#6F59FF]">
            Balanced
          </div>
        </div>

        <div className="relative rounded-[18px] border border-[#E9E5FF] bg-[linear-gradient(180deg,#F8F9FE_0%,#F3F0FF_100%)] p-2">
          <svg viewBox="0 0 260 100" className="h-[95px] w-full">
            <path
              d="M8 76C42 66 60 40 96 34C132 28 156 44 188 56C214 66 232 72 252 74"
              fill="none"
              stroke="url(#phoneCurve)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="phoneCurve" x1="0" x2="260" y1="0" y2="0">
                <stop stopColor="#6F59FF" />
                <stop offset="1" stopColor="#4DA8FF" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex justify-between px-1 text-[8px] font-bold text-[#8A84A3]">
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <PhoneInsight label="Deep work" value="09:00 – 12:00" />
          <PhoneInsight label="Admin" value="14:00 – 16:00" />
          <PhoneInsight label="Recovery" value="18:00+" />
        </div>
      </div>
    </div>
  );
}

function ChronotypeSchedulePhone() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#FFF9F2_0%,#FFF4E8_100%)] p-4 text-[#1A1528]">
      <div className="mb-3 mt-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A7B56]">
          Planner
        </div>
        <div className="text-[15px] font-[900] leading-tight">
          Sắp việc theo nhịp
        </div>
      </div>

      <div className="space-y-2">
        <PhoneScheduleItem
          time="09:00"
          title="Deep work"
          meta="Peak focus"
          color="purple"
        />
        <PhoneScheduleItem
          time="13:30"
          title="Email / admin"
          meta="Việc nhẹ"
          color="blue"
        />
        <PhoneScheduleItem
          time="16:30"
          title="Review"
          meta="Tổng kết"
          color="orange"
        />
        <PhoneScheduleItem
          time="18:00"
          title="Recovery"
          meta="Nghỉ và reset"
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

function PhoneInsight({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[14px] bg-[#F8F9FE] px-3 py-2">
      <span className="text-[10px] font-bold text-[#8A84A3]">{label}</span>
      <span className="text-[10px] font-[900] text-[#1A1528]">{value}</span>
    </div>
  );
}

function PhoneScheduleItem({
  time,
  title,
  meta,
  color = "purple",
}: {
  time: string;
  title: string;
  meta: string;
  color?: "purple" | "blue" | "green" | "orange";
}) {
  const colorMap = {
    purple: "bg-[#F3F0FF] text-[#6F59FF]",
    blue: "bg-[#EEF6FF] text-[#4DA8FF]",
    green: "bg-[#ECFDF5] text-[#10B981]",
    orange: "bg-[#FFF7ED] text-[#F59E0B]",
  };

  return (
    <div className="rounded-[16px] border border-white/80 bg-white/90 p-3 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-[900] tracking-[0.1em] text-[#8A84A3]">
          {time}
        </span>
        <span
          className={`rounded-full px-2 py-1 text-[9px] font-bold ${colorMap[color]}`}
        >
          {title}
        </span>
      </div>
      <div className="text-[11px] font-[900] text-[#1A1528]">{title}</div>
      <div className="mt-0.5 text-[10px] leading-relaxed text-[#6B7280]">
        {meta}
      </div>
    </div>
  );
}

function EnergyGraph() {
  const curves: Array<{
    name: string;
    color: string;
    points: number[];
    width: number;
  }> = [
    { name: "Lion", color: "#F59E0B", points: [70, 96, 58, 36, 20], width: 3 },
    { name: "Bear", color: "#6F59FF", points: [35, 72, 86, 54, 28], width: 4.5 },
    { name: "Wolf", color: "#4DA8FF", points: [18, 34, 58, 90, 68], width: 3 },
    { name: "Dolphin", color: "#10B981", points: [46, 72, 48, 70, 42], width: 3 },
  ];

  const generatePath = (points: number[]) => {
    const dx = 500 / (points.length - 1);
    let d = `M 0 ${200 - points[0] * 1.6}`;

    for (let index = 1; index < points.length; index += 1) {
      const xPrevious = (index - 1) * dx;
      const yPrevious = 200 - points[index - 1] * 1.6;
      const x = index * dx;
      const y = 200 - points[index] * 1.6;
      const cx1 = xPrevious + dx / 2.5;
      const cx2 = x - dx / 2.5;

      d += ` C ${cx1} ${yPrevious}, ${cx2} ${y}, ${x} ${y}`;
    }

    return d;
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex flex-col justify-between border-b border-l border-slate-200/60 pb-6 pl-2">
        <div className="w-full flex-1 border-t border-dashed border-slate-200/60" />
        <div className="w-full flex-1 border-t border-dashed border-slate-200/60" />
        <div className="w-full flex-1 border-t border-dashed border-slate-200/60" />
        <div className="w-full flex-1 border-t border-dashed border-slate-200/60" />
      </div>

      <div className="absolute bottom-0 left-0 flex w-full justify-between pl-4 text-[10px] font-bold text-slate-400">
        <span>06:00</span>
        <span>10:00</span>
        <span>14:00</span>
        <span>18:00</span>
        <span>22:00</span>
      </div>

      <svg
        viewBox="0 0 500 200"
        className="absolute inset-0 h-[calc(100%-24px)] w-full overflow-visible p-2"
      >
        {curves.map((curve, index) => (
          <motion.path
            key={curve.name}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.5,
              delay: index * 0.18,
              ease: "easeInOut",
            }}
            d={generatePath(curve.points)}
            fill="none"
            stroke={curve.color}
            strokeWidth={curve.width}
            strokeLinecap="round"
            className="drop-shadow-md"
          />
        ))}
      </svg>
    </div>
  );
}

function getTone(tone: "purple" | "blue" | "green" | "orange") {
  const tones = {
    purple: {
      bg: "bg-[#F3F0FF]",
      text: "text-[#6F59FF]",
      icon: <Zap className="h-4 w-4 text-[#6F59FF]" />,
    },
    blue: {
      bg: "bg-[#EEF6FF]",
      text: "text-[#4DA8FF]",
      icon: <Clock3 className="h-4 w-4 text-[#4DA8FF]" />,
    },
    green: {
      bg: "bg-[#ECFDF5]",
      text: "text-[#10B981]",
      icon: <Coffee className="h-4 w-4 text-[#10B981]" />,
    },
    orange: {
      bg: "bg-[#FFF7ED]",
      text: "text-[#F59E0B]",
      icon: <Sun className="h-4 w-4 text-[#F59E0B]" />,
    },
  };

  return tones[tone];
}