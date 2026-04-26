"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Moon,
  MoonStar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunset,
  Target,
  Waves,
} from "lucide-react";

type ChronotypeKey = "lion" | "bear" | "wolf" | "dolphin";

type Option = {
  label: string;
  value: string;
  scores: Record<ChronotypeKey, number>;
};

type Question = {
  id: number;
  category: string;
  question: string;
  helper?: string;
  options: Option[];
};

const CHRONOTYPE_META: Record<
  ChronotypeKey,
  {
    label: string;
    subtitle: string;
    icon: ReactNode;
    emoji: string;
    gradient: string;
    softBg: string;
    border: string;
    summary: string;
    strengths: string[];
    risks: string[];
    bestWindows: string[];
    quickAdvice: string[];
  }
> = {
  lion: {
    label: "Sư tử",
    subtitle: "Người mạnh vào buổi sáng",
    icon: <Sun className="h-5 w-5 text-[#C98C42]" />,
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",
    gradient: "from-[#F59E0B] to-[#FCD34D]",
    softBg: "from-[#FFF8EF] to-[#FFF1DD]",
    border: "border-[#F4D6A7]",
    summary:
      "Bạn có xu hướng tỉnh táo sớm, vào guồng nhanh hơn vào đầu ngày và thường chậm lại rõ hơn về chiều hoặc tối.",
    strengths: [
      "Hợp với deep work buổi sáng",
      "Ra quyết định sớm khá tốt",
      "Dễ tạo routine ổn định",
    ],
    risks: [
      "Dễ hụt năng lượng cuối ngày",
      "Khó giữ hiệu suất vào tối muộn",
      "Có thể lãng phí giờ vàng cho việc nhẹ",
    ],
    bestWindows: ["07:00 - 10:30", "10:30 - 12:00"],
    quickAdvice: [
      "Đặt việc khó vào buổi sáng.",
      "Gom admin hoặc họp ngắn vào cuối buổi sáng hoặc đầu chiều.",
      "Đừng ép bản thân làm việc nặng quá muộn.",
    ],
  },
  bear: {
    label: "Gấu",
    subtitle: "Nhịp cân bằng, ổn định",
    icon: <Sunset className="h-5 w-5 text-[#6C58F2]" />,
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png",
    gradient: "from-[#6F59FF] to-[#9B8CFF]",
    softBg: "from-[#F8F7FF] to-[#ECE8FF]",
    border: "border-[#D9CEFF]",
    summary:
      "Bạn có nhịp tương đối cân bằng, dễ hợp với lịch làm việc ban ngày và thường duy trì được mức ổn định tốt hơn đa số.",
    strengths: [
      "Dễ theo lịch tiêu chuẩn",
      "Ổn định cả làm việc và sinh hoạt",
      "Phối hợp nhóm khá thuận",
    ],
    risks: [
      "Dễ để lịch đầy bởi việc phản ứng",
      "Có thể thiếu giờ tập trung sâu nếu không chủ động chặn lịch",
      "Dễ tưởng mình hợp mọi kiểu lịch",
    ],
    bestWindows: ["09:00 - 12:30", "13:30 - 16:00"],
    quickAdvice: [
      "Chặn trước các block tập trung.",
      "Đừng để cả ngày bị chia nhỏ bởi họp và tin nhắn.",
      "Duy trì giờ ngủ ổn định để giữ nhịp tốt nhất.",
    ],
  },
  wolf: {
    label: "Sói",
    subtitle: "Mạnh hơn về chiều và tối",
    icon: <Moon className="h-5 w-5 text-[#5B46FF]" />,
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png",
    gradient: "from-[#5B46FF] to-[#8D7CFF]",
    softBg: "from-[#F4F4FF] to-[#E7E5FF]",
    border: "border-[#CCC9FF]",
    summary:
      "Bạn có xu hướng khởi động chậm hơn vào buổi sáng nhưng tăng nhịp tốt hơn về chiều hoặc tối, nhất là với việc cần sáng tạo hoặc tập trung sâu.",
    strengths: [
      "Hợp với creative work cuối ngày",
      "Có thể vào flow tốt về chiều/tối",
      "Dễ bùng năng lượng muộn hơn",
    ],
    risks: [
      "Buổi sáng dễ ì hơn",
      "Khó hợp với lịch quá sớm",
      "Dễ ngủ muộn nếu không có ranh giới rõ",
    ],
    bestWindows: ["14:30 - 17:30", "18:30 - 21:00"],
    quickAdvice: [
      "Buổi sáng nên bắt đầu nhẹ hơn.",
      "Dành việc đòi hỏi đầu óc tốt cho cuối chiều hoặc tối sớm.",
      "Giữ một giờ đi ngủ đủ ổn định để không trượt quá đà.",
    ],
  },
  dolphin: {
    label: "Cá heo",
    subtitle: "Nhạy giấc ngủ, nhịp linh hoạt hơn",
    icon: <Waves className="h-5 w-5 text-[#7C6BEB]" />,
    emoji:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    gradient: "from-[#4DA8FF] to-[#7DD3FC]",
    softBg: "from-[#F9F8FF] to-[#EEEAFE]",
    border: "border-[#DDD4FF]",
    summary:
      "Bạn có thể nhạy với giấc ngủ hoặc khó duy trì nhịp thật đều. Hiệu suất của bạn thường tốt hơn khi làm việc theo block ngắn, linh hoạt và có khoảng nghỉ hợp lý.",
    strengths: [
      "Nhạy với tín hiệu cơ thể",
      "Hợp với block ngắn và rõ mục tiêu",
      "Có thể làm tốt khi tối ưu môi trường",
    ],
    risks: [
      "Dễ mất nhịp nếu ngủ không tốt",
      "Khó theo lịch quá cứng",
      "Dễ mệt tinh thần nếu lịch quá dày",
    ],
    bestWindows: ["10:00 - 12:00", "16:30 - 18:30"],
    quickAdvice: [
      "Chia việc thành block ngắn hơn.",
      "Tối ưu môi trường làm việc và giờ ngủ.",
      "Đừng ép bản thân theo một lịch quá cứng hoặc quá đầy.",
    ],
  },
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Giấc ngủ",
    question: "Nếu không phải đặt báo thức, bạn thường thức dậy vào khoảng nào?",
    options: [
      {
        label: "Rất sớm, trước khoảng 6:00",
        value: "early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Khoảng 6:00 - 7:30",
        value: "morning",
        scores: { lion: 3, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Khoảng 7:30 - 9:00",
        value: "late_morning",
        scores: { lion: 1, bear: 3, wolf: 4, dolphin: 2 },
      },
      {
        label: "Khá thất thường hoặc phụ thuộc hôm trước",
        value: "irregular",
        scores: { lion: 0, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 2,
    category: "Giấc ngủ",
    question: "Bạn thường bắt đầu buồn ngủ vào lúc nào nhất?",
    options: [
      {
        label: "Khá sớm, khoảng 21:00 - 22:00",
        value: "sleep_early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Khoảng 22:00 - 23:00",
        value: "sleep_normal",
        scores: { lion: 3, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Khoảng 23:00 trở đi",
        value: "sleep_late",
        scores: { lion: 1, bear: 2, wolf: 4, dolphin: 2 },
      },
      {
        label: "Không ổn định, hôm rất sớm hôm rất muộn",
        value: "sleep_irregular",
        scores: { lion: 0, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 3,
    category: "Năng lượng",
    question: "Khung giờ nào trong ngày bạn thấy đầu óc sáng và vào việc nhanh nhất?",
    options: [
      {
        label: "Sáng sớm",
        value: "morning",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Cuối buổi sáng",
        value: "midmorning",
        scores: { lion: 3, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Cuối chiều hoặc tối sớm",
        value: "evening",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Tùy hôm, không thật sự ổn định",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 4,
    category: "Khởi động ngày",
    question: "Cảm giác của bạn trong 1 giờ đầu sau khi thức dậy thường là gì?",
    options: [
      {
        label: "Rất tỉnh, có thể vào việc gần như ngay",
        value: "early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Cần một chút thời gian rồi ổn",
        value: "midmorning",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Khá chậm, buổi sáng thường không phải thời điểm tốt nhất",
        value: "afternoon",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Phụ thuộc việc tối qua ngủ có ngon không",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 5,
    category: "Làm việc",
    question: "Nếu phải làm một việc khó, bạn thích đặt nó vào lúc nào nhất?",
    options: [
      {
        label: "Đầu ngày",
        value: "morning",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Cuối buổi sáng hoặc đầu giờ chiều",
        value: "midday",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Cuối chiều hoặc tối",
        value: "late_focus",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Chia nhỏ thành nhiều block ngắn trong ngày",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 6,
    category: "Làm việc",
    question: "Bạn thấy mình phù hợp với kiểu lịch làm việc nào nhất?",
    options: [
      {
        label: "Dậy sớm, làm việc mạnh vào buổi sáng",
        value: "morning",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Lịch ban ngày cân bằng, đều đặn",
        value: "steady_but_dip",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Bắt đầu chậm nhưng mạnh hơn về sau",
        value: "night",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Linh hoạt, cần chừa khoảng thở và block ngắn",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 7,
    category: "Giấc ngủ",
    question: "Bạn có dễ bị ảnh hưởng bởi tiếng ồn, ánh sáng hoặc căng thẳng khi ngủ không?",
    options: [
      {
        label: "Ít bị ảnh hưởng",
        value: "sleep_normal",
        scores: { lion: 3, bear: 3, wolf: 2, dolphin: 0 },
      },
      {
        label: "Có nhưng không quá nhiều",
        value: "steady_but_dip",
        scores: { lion: 2, bear: 3, wolf: 2, dolphin: 2 },
      },
      {
        label: "Khá nhạy, ngủ dễ chập chờn",
        value: "sleep_irregular",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
      {
        label: "Rất nhạy, chỉ cần lệch nhẹ là ảnh hưởng",
        value: "irregular",
        scores: { lion: 0, bear: 0, wolf: 1, dolphin: 5 },
      },
    ],
  },
  {
    id: 8,
    category: "Năng lượng",
    question: "Sau bữa trưa, năng lượng của bạn thường như thế nào?",
    options: [
      {
        label: "Giảm rõ, khó giữ phong độ như sáng",
        value: "burnout_early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 2 },
      },
      {
        label: "Giảm nhẹ nhưng vẫn làm việc được",
        value: "steady_but_dip",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Lúc đó mới bắt đầu vào guồng tốt hơn",
        value: "afternoon",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Thất thường, tùy chất lượng ngủ và mức căng thẳng",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 9,
    category: "Sinh hoạt",
    question: "Bạn thường cảm thấy hợp với các cuộc hẹn xã hội vào lúc nào hơn?",
    options: [
      {
        label: "Sáng hoặc trưa",
        value: "morning",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Chiều đầu hoặc chiều muộn",
        value: "midday",
        scores: { lion: 2, bear: 4, wolf: 2, dolphin: 2 },
      },
      {
        label: "Tối",
        value: "evening",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Tùy hôm, tôi dễ mệt bởi môi trường xã hội",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 1, dolphin: 4 },
      },
    ],
  },
  {
    id: 10,
    category: "Kỷ luật nhịp sống",
    question: "Bạn có dễ giữ giờ ngủ và giờ dậy ổn định qua nhiều ngày không?",
    options: [
      {
        label: "Khá dễ",
        value: "sleep_early",
        scores: { lion: 4, bear: 3, wolf: 1, dolphin: 1 },
      },
      {
        label: "Tương đối dễ nếu có lịch rõ",
        value: "sleep_normal",
        scores: { lion: 2, bear: 4, wolf: 2, dolphin: 2 },
      },
      {
        label: "Khó hơn vì tối tôi hay tỉnh",
        value: "sleep_late",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Khá khó, nhịp của tôi thường dao động",
        value: "sleep_irregular",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 11,
    category: "Tập trung",
    question: "Khi cần sáng tạo hoặc nghĩ ý tưởng mới, bạn thường thấy mình tốt nhất vào lúc nào?",
    options: [
      {
        label: "Sáng sớm",
        value: "morning",
        scores: { lion: 4, bear: 2, wolf: 1, dolphin: 1 },
      },
      {
        label: "Cuối buổi sáng",
        value: "midmorning",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Chiều hoặc tối",
        value: "late_focus",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Theo các đợt ngắn, không cố định",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 12,
    category: "Làm việc",
    question: "Bạn thường xử lý email, việc nhẹ hoặc admin hiệu quả nhất khi nào?",
    options: [
      {
        label: "Chiều hoặc cuối ngày",
        value: "burnout_early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 2 },
      },
      {
        label: "Đầu giờ chiều",
        value: "midday",
        scores: { lion: 2, bear: 4, wolf: 2, dolphin: 2 },
      },
      {
        label: "Buổi sáng, để dọn đầu óc trước",
        value: "morning",
        scores: { lion: 1, bear: 2, wolf: 3, dolphin: 2 },
      },
      {
        label: "Xen kẽ thành các block ngắn",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 13,
    category: "Cảm giác cơ thể",
    question: "Nếu phải làm việc rất sớm liên tục, phản ứng thường thấy của bạn là gì?",
    options: [
      {
        label: "Tôi thích nghi khá tốt",
        value: "early",
        scores: { lion: 4, bear: 3, wolf: 0, dolphin: 1 },
      },
      {
        label: "Tôi vẫn làm được, dù không hẳn lý tưởng",
        value: "midmorning",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Tôi khá đuối và chậm bắt nhịp",
        value: "late_morning",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Tôi dễ rối nhịp, mệt và ngủ không ngon",
        value: "sleep_irregular",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 14,
    category: "Tối muộn",
    question: "Nếu có không gian yên tĩnh vào buổi tối, bạn thường cảm thấy thế nào?",
    options: [
      {
        label: "Tôi đã xuống năng lượng, không muốn làm gì khó",
        value: "burnout_early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 2 },
      },
      {
        label: "Tôi vẫn ổn nhưng không phải lúc mạnh nhất",
        value: "sleep_normal",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Lúc đó tôi mới thật sự vào flow",
        value: "night",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Tôi có thể tỉnh nhưng đầu óc lại khá nhạy, khó thả lỏng",
        value: "sleep_irregular",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 15,
    category: "Nhịp sống",
    question: "Bạn thấy mình giống kiểu nào hơn?",
    options: [
      {
        label: "Người của buổi sáng",
        value: "morning",
        scores: { lion: 5, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Khá cân bằng",
        value: "midday",
        scores: { lion: 2, bear: 5, wolf: 1, dolphin: 2 },
      },
      {
        label: "Người của buổi tối",
        value: "evening",
        scores: { lion: 0, bear: 1, wolf: 5, dolphin: 2 },
      },
      {
        label: "Không hẳn thuộc nhóm nào rõ rệt",
        value: "irregular",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 5 },
      },
    ],
  },
  {
    id: 16,
    category: "Môi trường",
    question: "Bạn có cần môi trường làm việc thật yên, ít kích thích mới tập trung tốt không?",
    options: [
      {
        label: "Không quá cần",
        value: "steady_but_dip",
        scores: { lion: 3, bear: 3, wolf: 2, dolphin: 1 },
      },
      {
        label: "Cần ở mức vừa phải",
        value: "midday",
        scores: { lion: 2, bear: 3, wolf: 2, dolphin: 2 },
      },
      {
        label: "Khá cần, nếu ồn tôi rất khó tập trung",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
      {
        label: "Rất cần, tôi nhạy với tiếng ồn và xao nhãng",
        value: "irregular",
        scores: { lion: 0, bear: 0, wolf: 1, dolphin: 5 },
      },
    ],
  },
  {
    id: 17,
    category: "Hồi phục",
    question: "Khi mệt hoặc quá tải, cách làm việc nào giúp bạn hồi phục tốt hơn?",
    options: [
      {
        label: "Ngủ sớm và bắt đầu lại từ sáng hôm sau",
        value: "sleep_early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 2 },
      },
      {
        label: "Giữ lịch ổn định và giảm bớt cường độ",
        value: "steady_but_dip",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Cho bản thân thêm thời gian cuối ngày để vào lại nhịp",
        value: "late_focus",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Chia nhỏ công việc, nghỉ xen kẽ và giảm kích thích",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 18,
    category: "Lịch nhóm",
    question: "Khi làm việc nhóm, điều gì khiến bạn mệt nhất?",
    options: [
      {
        label: "Họp quá muộn trong ngày",
        value: "burnout_early",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 2 },
      },
      {
        label: "Lịch bị cắt nhỏ, không còn block tập trung",
        value: "steady_but_dip",
        scores: { lion: 2, bear: 4, wolf: 2, dolphin: 2 },
      },
      {
        label: "Các việc quan trọng bị ép vào sáng sớm",
        value: "early",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Môi trường nhiều áp lực, quá ồn hoặc quá dày",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 1, dolphin: 4 },
      },
    ],
  },
  {
    id: 19,
    category: "Thói quen",
    question: "Nếu được tự sắp lịch một ngày lý tưởng, bạn sẽ chọn kiểu nào?",
    options: [
      {
        label: "Làm việc mạnh từ sáng, chiều giảm dần",
        value: "morning",
        scores: { lion: 4, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Phân bổ khá đều trong ngày",
        value: "midday",
        scores: { lion: 2, bear: 4, wolf: 1, dolphin: 2 },
      },
      {
        label: "Sáng nhẹ, chiều/tối mới vào guồng chính",
        value: "afternoon",
        scores: { lion: 0, bear: 1, wolf: 4, dolphin: 2 },
      },
      {
        label: "Làm theo block ngắn, có khoảng nghỉ linh hoạt",
        value: "inconsistent",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 4 },
      },
    ],
  },
  {
    id: 20,
    category: "Tự đánh giá",
    question: "Bạn thấy mô tả nào gần với mình nhất?",
    options: [
      {
        label: "Tôi mạnh đầu ngày và thích kết thúc sớm",
        value: "morning",
        scores: { lion: 5, bear: 2, wolf: 0, dolphin: 1 },
      },
      {
        label: "Tôi khá cân bằng, hợp nhịp sinh hoạt ban ngày",
        value: "midday",
        scores: { lion: 2, bear: 5, wolf: 1, dolphin: 2 },
      },
      {
        label: "Tôi bùng năng lượng muộn hơn người khác",
        value: "night",
        scores: { lion: 0, bear: 1, wolf: 5, dolphin: 2 },
      },
      {
        label: "Tôi nhạy giấc ngủ, cần lịch mềm và môi trường phù hợp",
        value: "sleep_irregular",
        scores: { lion: 1, bear: 1, wolf: 2, dolphin: 5 },
      },
    ],
  },
];

function calculateScores(answers: number[]) {
  const totals: Record<ChronotypeKey, number> = {
    lion: 0,
    bear: 0,
    wolf: 0,
    dolphin: 0,
  };

  answers.forEach((optionIndex, questionIndex) => {
    const option = QUESTIONS[questionIndex]?.options?.[optionIndex];
    if (!option) return;
    (Object.keys(option.scores) as ChronotypeKey[]).forEach((key) => {
      totals[key] += option.scores[key];
    });
  });

  const sorted = (Object.keys(totals) as ChronotypeKey[]).sort(
    (a, b) => totals[b] - totals[a]
  );

  return {
    totals,
    primary: sorted[0],
    secondary: sorted[1],
  };
}

function normalizeChronotype(value?: string): ChronotypeKey {
  switch (value?.toUpperCase()) {
    case "LION":
      return "lion";
    case "BEAR":
      return "bear";
    case "WOLF":
      return "wolf";
    case "DOLPHIN":
      return "dolphin";
    default:
      return "bear";
  }
}

export default function AssessmentPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(QUESTIONS.length).fill(-1)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedResult, setSavedResult] = useState<{
    chronotype: string;
    scores: {
      lionScore?: number;
      bearScore?: number;
      wolfScore?: number;
      dolphinScore?: number;
      lion?: number;
      bear?: number;
      wolf?: number;
      dolphin?: number;
    };
  } | null>(null);

  const currentQuestion = QUESTIONS[current];
  const answeredCount = answers.filter((v) => v !== -1).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  const localResult = useMemo(() => {
    if (answers.some((v) => v === -1)) return null;
    return calculateScores(answers);
  }, [answers]);

  const selectedAnswer = answers[current];

  const handleSelect = (optionIndex: number) => {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
  };

  const handleSubmitAssessment = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payloadAnswers = answers.reduce<Record<string, string>>(
        (acc, answerIndex, questionIndex) => {
          const question = QUESTIONS[questionIndex];
          const selected = question?.options?.[answerIndex];
          if (!question || !selected) return acc;

          acc[`q${question.id}`] = selected.value;
          return acc;
        },
        {}
      );

      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Không thể lưu kết quả assessment.");
        return;
      }

      setSavedResult({
        chronotype: data.chronotype,
        scores: data.scores,
      });

      setStep("result");
    } catch {
      setSubmitError("Có lỗi xảy ra khi gửi kết quả. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent((prev) => prev + 1);
      return;
    }

    if (answers.every((v) => v !== -1)) {
      await handleSubmitAssessment();
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  const handleStart = () => {
    setStep("quiz");
  };

  const handleReset = () => {
    setAnswers(Array(QUESTIONS.length).fill(-1));
    setCurrent(0);
    setSubmitError("");
    setSavedResult(null);
    setStep("intro");
  };

  const resultForDisplay = useMemo(() => {
    if (!localResult) return null;

    if (savedResult?.chronotype) {
      return {
        totals: localResult.totals,
        primary: normalizeChronotype(savedResult.chronotype),
        secondary:
          localResult.secondary === normalizeChronotype(savedResult.chronotype)
            ? localResult.primary
            : localResult.secondary,
      };
    }

    return localResult;
  }, [localResult, savedResult]);

  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <main className="relative overflow-hidden pb-24">
        <BackgroundDecor />

        <section className="relative z-10 px-4 pb-12 pt-4 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
                <div className="relative z-30 mx-auto max-w-4xl text-center">
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    ChronoFlow Assessment
                  </div>

                  <h1 className="mb-3 text-[clamp(2.2rem,4vw,3.8rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                    Tìm chronotype của bạn, <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                      rồi sắp việc đúng lúc hơn.
                    </span>
                  </h1>

                  <p className="mx-auto mb-6 max-w-[680px] text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
                    Bài đánh giá này gồm 20 câu hỏi, giúp bạn nhìn rõ hơn xu hướng
                    năng lượng, khung tỉnh táo và kiểu nhịp sinh học phù hợp nhất với mình.
                  </p>

                  <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl">
                      <Clock3 className="h-4 w-4 text-[#4DA8FF]" />
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                          THỜI GIAN
                        </span>
                        <span className="text-[14px] font-bold leading-tight">
                          Khoảng 3 - 5 phút
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3 text-[#1A1528] shadow-lg">
                      <Brain className="h-4 w-4 text-[#6F59FF]" />
                      <span className="text-[14px] font-bold leading-tight">
                        20 câu hỏi định hướng
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto mt-2 h-[330px] w-full max-w-[760px] perspective-[1200px]">
                  <div className="absolute left-[3%] top-[6%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                    <FloatPill
                      icon={<Target className="h-3.5 w-3.5" />}
                      label="20 câu hỏi"
                      tint="purple"
                    />
                  </div>

                  <div className="absolute right-[3%] top-[4%] z-40 hidden animate-[bounce_4.5s_infinite] sm:block">
                    <FloatPill
                      icon={<CalendarClock className="h-3.5 w-3.5" />}
                      label="Kết quả cá nhân hóa"
                      tint="blue"
                    />
                  </div>

                  <div className="absolute left-[4%] top-12 z-20 w-[200px] -rotate-12 transform rounded-[32px] shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-[-5deg] sm:left-[7%] sm:w-[220px]">
                    <PhoneFrame>
                      <AssessmentPreviewPhone />
                    </PhoneFrame>
                  </div>

                  <div className="absolute right-[4%] top-12 z-20 w-[200px] rotate-12 transform rounded-[32px] shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-[5deg] sm:right-[7%] sm:w-[220px]">
                    <PhoneFrame>
                      <PlanPreviewPhone />
                    </PhoneFrame>
                  </div>

                  <div className="absolute left-1/2 top-2 z-30 w-[230px] -translate-x-1/2 transform rounded-[36px] shadow-[0_40px_80px_rgba(26,21,40,0.25)] transition-all duration-700 hover:-translate-y-6 sm:w-[240px]">
                    <PhoneFrame featured>
                      <ResultPreviewPhone />
                    </PhoneFrame>
                  </div>
                </div>
              </div>

              <div className="relative z-50 bg-white px-6 py-8 md:px-10 lg:px-12">
                <AnimatePresence mode="wait">
                  {step === "intro" && (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="grid gap-8 lg:grid-cols-[1fr_0.92fr]"
                    >
                      <div>
                        <h2 className="text-[1.7rem] font-[900] tracking-tight text-[#1A1528]">
                          Trước khi bắt đầu
                        </h2>
                        <p className="mt-3 max-w-[62ch] text-[14px] leading-8 text-[#615C7A]">
                          Hãy trả lời theo cảm nhận gần với bạn nhất trong đa số ngày,
                          không cần cố chọn phương án “đẹp” hay “kỷ luật”. Kết quả này
                          giúp bạn hiểu xu hướng của mình để lên lịch hợp hơn, không phải
                          để dán nhãn cứng.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          <InfoCard
                            icon={<ShieldCheck className="h-5 w-5 text-[#6F59FF]" />}
                            title="Mang tính định hướng"
                            text="Đây là công cụ hỗ trợ tự hiểu bản thân, không phải chẩn đoán y khoa."
                          />
                          <InfoCard
                            icon={<Brain className="h-5 w-5 text-[#4DA8FF]" />}
                            title="Hợp để ứng dụng ngay"
                            text="Bạn sẽ nhận được chronotype chính, chronotype phụ và gợi ý sắp việc."
                          />
                          <InfoCard
                            icon={<Clock3 className="h-5 w-5 text-[#16A085]" />}
                            title="Làm trong vài phút"
                            text="Bài test ngắn, dễ làm và không yêu cầu kiến thức trước."
                          />
                          <InfoCard
                            icon={<MoonStar className="h-5 w-5 text-[#7C6BEB]" />}
                            title="Tập trung vào nhịp thật"
                            text="Hãy chọn theo nhịp tự nhiên của bạn, không phải theo lịch đang bị ép."
                          />
                        </div>
                      </div>

                      <div className="rounded-[28px] border border-[#EAE8F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Bạn sẽ nhận được
                        </div>

                        <div className="space-y-3">
                          <ChecklistRow text="Chronotype chính và phụ" />
                          <ChecklistRow text="Tổng quan điểm mạnh / điểm dễ hụt năng lượng" />
                          <ChecklistRow text="Khung giờ phù hợp hơn để làm việc khó" />
                          <ChecklistRow text="Gợi ý áp dụng ngay vào lịch trong ngày" />
                        </div>

                        <button
                          onClick={handleStart}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 py-4 text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-black"
                        >
                          <span className="text-[14px] font-bold">Bắt đầu bài đánh giá</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        <p className="mt-4 text-center text-[12px] leading-6 text-[#7A728F]">
                          Mẹo nhỏ: trả lời theo thói quen gần nhất của bạn trong đa số tuần.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {step === "quiz" && (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
                            Câu hỏi {current + 1} / {QUESTIONS.length}
                          </div>
                          <div className="mt-1 text-[1.25rem] font-[900] tracking-tight text-[#1A1528]">
                            {currentQuestion.category}
                          </div>
                        </div>

                        <div className="w-full max-w-[320px]">
                          <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-[#6B6287]">
                            <span>Tiến độ</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-[#EFEAFD]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
                        <div className="mb-3 inline-flex rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                          {currentQuestion.category}
                        </div>

                        <h3 className="text-[1.35rem] font-[900] leading-snug text-[#1A1528]">
                          {currentQuestion.question}
                        </h3>

                        {currentQuestion.helper ? (
                          <p className="mt-2 text-[13px] leading-7 text-[#6B6287]">
                            {currentQuestion.helper}
                          </p>
                        ) : null}

                        <div className="mt-6 space-y-3">
                          {currentQuestion.options.map((option, idx) => {
                            const active = selectedAnswer === idx;
                            return (
                              <button
                                key={option.label}
                                type="button"
                                onClick={() => handleSelect(idx)}
                                className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all ${
                                  active
                                    ? "border-[#6F59FF] bg-[#F3F0FF] shadow-[0_10px_20px_rgba(111,89,255,0.08)]"
                                    : "border-[#ECE8FF] bg-white hover:border-[#D9CEFF] hover:bg-[#FAF9FF]"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                      active
                                        ? "border-[#6F59FF] bg-white"
                                        : "border-[#CFC7E8] bg-white"
                                    }`}
                                  >
                                    {active ? (
                                      <div className="h-2 w-2 rounded-full bg-[#6F59FF]" />
                                    ) : null}
                                  </div>
                                  <span
                                    className={`text-[14px] leading-7 ${
                                      active
                                        ? "font-[800] text-[#352B64]"
                                        : "font-medium text-[#4F4A68]"
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {submitError && (
                          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {submitError}
                          </div>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                          <button
                            type="button"
                            onClick={handleBack}
                            disabled={current === 0 || isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E9E5FF] bg-white px-5 py-3 text-[14px] font-semibold text-[#4F4A68] transition-colors hover:bg-[#F8F6FF] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                          </button>

                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={selectedAnswer === -1 || isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[14px] font-bold text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {current === QUESTIONS.length - 1
                              ? isSubmitting
                                ? "Đang lưu kết quả..."
                                : "Xem kết quả"
                              : "Câu tiếp theo"}
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === "result" && resultForDisplay && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AssessmentResult
                        primary={resultForDisplay.primary}
                        secondary={resultForDisplay.secondary}
                        totals={resultForDisplay.totals}
                        onReset={handleReset}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function AssessmentResult({
  primary,
  secondary,
  totals,
  onReset,
}: {
  primary: ChronotypeKey;
  secondary: ChronotypeKey;
  totals: Record<ChronotypeKey, number>;
  onReset: () => void;
}) {
  const primaryMeta = CHRONOTYPE_META[primary];
  const secondaryMeta = CHRONOTYPE_META[secondary];
  const totalMax = Math.max(...Object.values(totals));

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
        <div
          className={`rounded-[30px] border ${primaryMeta.border} bg-gradient-to-br ${primaryMeta.softBg} p-6 shadow-[0_18px_40px_rgba(26,21,40,0.04)]`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
            <Sparkles className="h-3.5 w-3.5" />
            Kết quả chính
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-[104px] w-[104px] items-center justify-center rounded-[30px] bg-white/78 shadow-[0_12px_28px_rgba(36,31,61,0.08)] ring-1 ring-white/80">
              <img
                src={primaryMeta.emoji}
                alt={primaryMeta.label}
                className="h-[78px] w-[78px] object-contain"
              />
            </div>

            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7A70A0]">
                Chronotype của bạn
              </div>
              <h2 className="mt-1 text-[2rem] font-[950] tracking-tight text-[#1A1528]">
                {primaryMeta.label}
              </h2>
              <p className="mt-1 text-[13px] font-semibold text-[#6B6287]">
                {primaryMeta.subtitle}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-[62ch] text-[14px] leading-8 text-[#4F4A68]">
            {primaryMeta.summary}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ResultBox
              title="Điểm mạnh thường thấy"
              items={primaryMeta.strengths}
              icon={<Brain className="h-4 w-4 text-[#6F59FF]" />}
            />
            <ResultBox
              title="Điểm dễ hụt năng lượng"
              items={primaryMeta.risks}
              icon={<MoonStar className="h-4 w-4 text-[#4DA8FF]" />}
            />
          </div>
        </div>

        <div className="rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
            <CalendarClock className="h-3.5 w-3.5" />
            Gợi ý áp dụng
          </div>

          <h3 className="text-[1.2rem] font-[900] text-[#1A1528]">
            Khung phù hợp hơn cho bạn
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {primaryMeta.bestWindows.map((window) => (
              <div
                key={window}
                className="rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-2 text-[12px] font-bold text-[#5E587A]"
              >
                {window}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] border border-[#ECE8FF] bg-white p-4">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              Chronotype phụ
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF]">
                {secondaryMeta.icon}
              </div>
              <div>
                <div className="text-[15px] font-[900] text-[#1A1528]">
                  {secondaryMeta.label}
                </div>
                <div className="text-[12px] text-[#6B6287]">
                  {secondaryMeta.subtitle}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {primaryMeta.quickAdvice.map((tip) => (
              <div
                key={tip}
                className="rounded-[18px] border border-[#ECE8FF] bg-white px-4 py-3 text-[13px] leading-7 text-[#4F4A68]"
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ECE8FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
          <Target className="h-3.5 w-3.5" />
          Phân bổ điểm
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(Object.keys(totals) as ChronotypeKey[]).map((key) => {
            const meta = CHRONOTYPE_META[key];
            const percentage = Math.round((totals[key] / totalMax) * 100);

            return (
              <div
                key={key}
                className="rounded-[22px] border border-[#ECE8FF] bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[14px] font-[900] text-[#1A1528]">
                    {meta.label}
                  </div>
                  <div className="text-[12px] font-bold text-[#6B6287]">
                    {totals[key]} điểm
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#EFEAFD]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="mt-2 text-[12px] text-[#6B6287]">
                  {percentage}% so với nhóm cao nhất của bạn
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[14px] font-bold text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-black"
          >
            Xem dashboard của tôi
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/learn"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E9E5FF] bg-white px-5 py-3 text-[14px] font-semibold text-[#4F4A68] transition-colors hover:bg-[#F8F6FF]"
          >
            Đọc thêm về chronotype
          </Link>

          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E9E5FF] bg-white px-5 py-3 text-[14px] font-semibold text-[#4F4A68] transition-colors hover:bg-[#F8F6FF]"
          >
            <RotateCcw className="h-4 w-4" />
            Làm lại bài đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultBox({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/78 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8F6FF]">
          {icon}
        </div>
        <div className="text-[13px] font-[900] text-[#1A1528]">{title}</div>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6F59FF]" />
            <span className="text-[13px] leading-6 text-[#4F4A68]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-[#ECE8FF] bg-white px-4 py-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6F59FF]" />
      <span className="text-[13px] leading-6 text-[#4F4A68]">{text}</span>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#EAE8F7] bg-white/88 p-5 shadow-[0_15px_40px_rgba(26,21,40,0.04)]">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF]">
        {icon}
      </div>
      <h3 className="text-[15px] font-[900] text-[#1A1528]">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-[#615C7A]">{text}</p>
    </div>
  );
}

function FloatPill({
  icon,
  label,
  tint,
}: {
  icon: ReactNode;
  label: string;
  tint: "purple" | "blue";
}) {
  const bg =
    tint === "purple"
      ? "from-[#6F59FF] to-[#8E7BFF]"
      : "from-[#4DA8FF] to-[#7DC7FF]";

  return (
    <div className="flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-[11px] font-bold text-[#1A1528] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br text-white ${bg}`}
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
  children: ReactNode;
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

function AssessmentPreviewPhone() {
  return (
    <div className="relative flex h-full flex-col bg-[#F8F9FE] p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF] text-[10px]">
            ⏱️
          </div>
          <div>
            <div className="text-[9px] font-bold text-gray-500">Câu hỏi 1/20</div>
            <div className="text-[11px] font-[900] leading-none">Chronotype Test</div>
          </div>
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="absolute left-0 top-0 h-1 w-1/5 bg-[#6F59FF]" />
        <div className="mt-1 text-[13px] font-bold leading-tight text-[#1A1528]">
          Bạn thấy mình tỉnh táo nhất vào lúc nào?
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        {[
          { text: "Sáng sớm", active: false },
          { text: "Cuối buổi sáng", active: true },
          { text: "Chiều / tối", active: false },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 rounded-lg border p-2.5 shadow-sm transition-all ${
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
              {item.active && (
                <div className="h-1.5 w-1.5 rounded-full bg-[#6F59FF]" />
              )}
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

function PlanPreviewPhone() {
  return (
    <div className="flex h-full flex-col bg-white p-3">
      <div className="relative mb-3 border-b border-gray-100 pb-3 text-center">
        <div className="text-[13px] font-[900] text-[#1A1528]">Gợi ý trong ngày</div>
        <div className="mt-1 inline-block rounded bg-[#F3F0FF] px-1.5 py-0.5 text-[9px] font-bold text-[#6F59FF]">
          Khung giờ phù hợp hơn
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-gray-100" />
        <div className="space-y-3">
          {[
            {
              label: "Deep work",
              time: "09:00",
              dot: "bg-orange-500",
              card: "bg-[#FFF6E8] border-orange-100",
              titleCol: "text-orange-600",
            },
            {
              label: "Email / admin",
              time: "13:30",
              dot: "bg-[#6F59FF]",
              card: "bg-[#F3F0FF] border-[#E9E5FF]",
              titleCol: "text-[#6F59FF]",
            },
            {
              label: "Recovery",
              time: "16:30",
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

function ResultPreviewPhone() {
  return (
    <div className="flex h-full flex-col px-4 py-5">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-[17px] font-[900] leading-tight text-white">
          Kết quả
          <br />
          chronotype
        </h3>
        <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
          <Sun className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
          <div className="mb-0.5 text-[9px] font-bold uppercase text-white/70">
            Kết quả chính
          </div>
          <div className="text-[15px] font-[900] text-white">Gấu 🐻</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
          <div className="mb-0.5 text-[9px] font-bold uppercase text-white/70">
            Khung mạnh
          </div>
          <div className="text-[15px] font-[900] text-white">09:00</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-[20px] bg-white p-3 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[12px] font-[900] text-[#1A1528]">Biểu đồ nhịp</div>
          <div className="text-[10px] font-bold text-gray-400">Ổn định</div>
        </div>
        <p className="mb-2 text-[10px] leading-relaxed text-gray-500">
          Hợp với lịch ban ngày cân bằng và nên chặn trước block tập trung.
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
              d="M8 68C42 62 58 34 96 30C134 26 150 38 186 54C208 63 227 68 252 70"
              stroke="url(#energyLineAssessment)"
              strokeWidth="5"
              strokeLinecap="round"
              className="drop-shadow-[0_4px_6px_rgba(111,89,255,0.4)]"
            />
            <defs>
              <linearGradient
                id="energyLineAssessment"
                x1="0"
                y1="0"
                x2="260"
                y2="0"
              >
                <stop stopColor="#6F59FF" />
                <stop offset="1" stopColor="#4DA8FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-0.5 flex justify-between px-1 text-[8px] font-bold text-gray-400">
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>
      </div>
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
        <div className="absolute left-[10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
        <div className="absolute right-[-5%] top-[10%] h-[300px] w-[300px] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
      </div>
    </>
  );
}