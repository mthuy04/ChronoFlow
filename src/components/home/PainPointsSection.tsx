"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BatteryWarning,
  Brain,
  CalendarX2,
  CheckCircle2,
  Coffee,
  Layers3,
  MousePointerClick,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

type PainKey =
  | "focus"
  | "wrongTime"
  | "priority"
  | "burnout"
  | "planner"
  | "system";

type PainPoint = {
  key: PainKey;
  title: string;
  shortTitle: string;
  label: string;
  problem: string;
  compactProblem: string;
  solution: string;
  insight: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  accentText: string;
  accentBg: string;
  softBg: string;
  borderColor: string;
  glow: string;
};

const painPoints: PainPoint[] = [
  {
    key: "focus",
    title: "Khó tập trung dù đã ngồi vào bàn",
    shortTitle: "Khó tập trung",
    label: "Sai nhịp tập trung",
    problem:
      "Bạn đã mở laptop và có việc trước mắt, nhưng vẫn khó vào trạng thái học hoặc làm sâu.",
    compactProblem:
      "Ngồi vào bàn rồi nhưng não vẫn chưa vào guồng, dễ đổi việc liên tục.",
    solution:
      "ChronoFlow gợi ý đưa việc sâu vào khung năng lượng phù hợp hơn.",
    insight:
      "Không phải bạn lười. Có thể bạn đang bắt đầu việc khó vào sai nhịp năng lượng.",
    metric: "Sáng",
    metricLabel: "Khung tập trung gợi ý",
    icon: Brain,
    accentText: "text-[#6F59FF]",
    accentBg: "from-[#6F59FF] to-[#8B5CF6]",
    softBg: "from-[#FBF9FF] via-[#F7F4FF] to-[#F2EEFF]",
    borderColor: "border-[#E9E5FF]",
    glow: "bg-[#6F59FF]",
  },
  {
    key: "wrongTime",
    title: "Việc quan trọng bị đẩy vào lúc đã mệt",
    shortTitle: "Sai thời điểm",
    label: "Lệch nhịp năng lượng",
    problem:
      "Những việc cần nhiều năng lượng như học sâu, viết báo cáo hay phân tích thường bị để đến cuối ngày.",
    compactProblem:
      "Việc khó bị dồn vào lúc năng lượng đã thấp, nên dễ trì hoãn hoặc làm qua loa.",
    solution:
      "ChronoFlow giúp phân loại việc theo mức năng lượng và đặt đúng khung hơn.",
    insight: "Một task đúng nhưng đặt sai giờ vẫn có thể khiến bạn kiệt sức.",
    metric: "Đúng lúc",
    metricLabel: "Giảm cảm giác gắng sức",
    icon: BatteryWarning,
    accentText: "text-[#F59E0B]",
    accentBg: "from-[#F59E0B] to-[#FBBF24]",
    softBg: "from-[#FFFDF8] via-[#FFF8ED] to-[#FFF1E2]",
    borderColor: "border-[#FFE6C7]",
    glow: "bg-[#F59E0B]",
  },
  {
    key: "priority",
    title: "Lịch học/làm dày nhưng thiếu ưu tiên",
    shortTitle: "Thiếu ưu tiên",
    label: "Quá tải ưu tiên",
    problem:
      "Task nào cũng có vẻ quan trọng, deadline nào cũng gấp, nhưng bạn không biết nên xử lý việc nào trước.",
    compactProblem:
      "Lịch đầy task nhưng không rõ việc nào nên làm trước, việc nào nên để sau.",
    solution:
      "ChronoFlow giúp chọn task phù hợp với từng khối năng lượng, không chỉ theo deadline.",
    insight:
      "Một lịch tốt không chỉ nhiều task, mà phải biết task nào nên nằm ở thời điểm nào.",
    metric: "Theo nhịp",
    metricLabel: "Khối năng lượng chính",
    icon: CalendarX2,
    accentText: "text-[#4DA8FF]",
    accentBg: "from-[#4DA8FF] to-[#38BDF8]",
    softBg: "from-[#FBFDFF] via-[#F4F9FF] to-[#EEF6FF]",
    borderColor: "border-[#DDEEFF]",
    glow: "bg-[#4DA8FF]",
  },
  {
    key: "burnout",
    title: "Cố làm liên tục nhưng càng ngày càng đuối",
    shortTitle: "Dễ kiệt sức",
    label: "Vòng lặp kiệt sức",
    problem:
      "Bạn cố duy trì năng suất bằng cách làm nhiều hơn, nhưng lại bỏ qua thời điểm cơ thể cần nghỉ và phục hồi.",
    compactProblem:
      "Càng cố làm nhiều, năng lượng càng tụt, rồi lại phải làm bù trong trạng thái mệt.",
    solution:
      "ChronoFlow đưa recovery thành một phần của lịch, giúp bạn nghỉ đúng lúc hơn.",
    insight:
      "Nghỉ không phải là mất năng suất. Nghỉ đúng lúc là điều kiện để làm việc bền hơn.",
    metric: "Nghỉ đúng",
    metricLabel: "Khung phục hồi gợi ý",
    icon: Coffee,
    accentText: "text-[#EC4899]",
    accentBg: "from-[#EC4899] to-[#FB7185]",
    softBg: "from-[#FFF9FC] via-[#FFF1F7] to-[#FFEAF3]",
    borderColor: "border-[#FCE7F3]",
    glow: "bg-[#EC4899]",
  },
  {
    key: "planner",
    title: "Planner dễ bị bỏ quên sau vài ngày",
    shortTitle: "Khó duy trì",
    label: "Đứt nhịp thói quen",
    problem:
      "Viết kế hoạch thì dễ, nhưng duy trì mỗi ngày lại khó, nhất là khi planner giấy không có nhắc nhở hay phản hồi.",
    compactProblem:
      "Bạn bắt đầu rất hăng, nhưng vài ngày sau lại mất nhịp vì không thấy phản hồi rõ.",
    solution:
      "ChronoFlow tạo vòng lặp: lên kế hoạch, focus, nhận điểm, nhìn lại và điều chỉnh.",
    insight:
      "Planner chỉ hiệu quả khi có vòng lặp phản hồi: lên kế hoạch, làm, nhìn lại, rồi điều chỉnh.",
    metric: "Duy trì",
    metricLabel: "Điểm tập trung tích lũy",
    icon: Trophy,
    accentText: "text-[#10B981]",
    accentBg: "from-[#10B981] to-[#34D399]",
    softBg: "from-[#FBFFFE] via-[#F4FFFB] to-[#ECFDF5]",
    borderColor: "border-[#D1FAE5]",
    glow: "bg-[#10B981]",
  },
  {
    key: "system",
    title: "Có nhiều công cụ nhưng thiếu một hệ thống rõ ràng",
    shortTitle: "Thiếu hệ thống",
    label: "Quy trình rời rạc",
    problem:
      "Bạn có thể dùng Notion, lịch, to-do list, ghi chú giấy, nhưng mỗi thứ nằm một nơi và không kết nối với nhịp sinh học của bạn.",
    compactProblem:
      "Notion, lịch, ghi chú và to-do list nằm rời rạc, khiến bạn mất thêm năng lượng để quyết định.",
    solution:
      "ChronoFlow gom bài đánh giá, bản đồ năng lượng, gợi ý lịch và dashboard vào cùng một flow.",
    insight:
      "Công cụ riêng lẻ không đủ. Bạn cần một hệ thống giúp ra quyết định mỗi ngày.",
    metric: "Một flow",
    metricLabel: "Từ insight đến hành động",
    icon: Layers3,
    accentText: "text-[#7C3AED]",
    accentBg: "from-[#7C3AED] to-[#4DA8FF]",
    softBg: "from-[#FCFAFF] via-[#F5F2FF] to-[#EEF6FF]",
    borderColor: "border-[#EDE9FE]",
    glow: "bg-[#7C3AED]",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: "easeOut" },
  },
};

export default function PainPointsSection() {
  const [activeKey, setActiveKey] = useState<PainKey>("focus");

  const activePain = useMemo(
    () => painPoints.find((item) => item.key === activeKey) ?? painPoints[0],
    [activeKey],
  );

  const ActiveIcon = activePain.icon;

  return (
    <section
      id="pain-points"
      className="relative overflow-hidden bg-[#F4F2FA] py-8 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[38px] border border-white bg-white/75 px-5 py-12 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-16 lg:px-12">
          <BackgroundGlow />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="mx-auto mb-10 max-w-4xl text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <AlertTriangle className="h-3.5 w-3.5" />
                Vấn đề thường gặp
              </div>

              <h2 className="mx-auto max-w-[860px] text-[clamp(2rem,4vw,3.25rem)] font-[900] leading-[1.08] tracking-tight text-[#1A1528]">
                Bạn không chỉ cần thêm thời gian {" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  bạn cần đúng thời điểm.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                Lịch học, lịch làm và cách ưu tiên task thường bỏ qua lúc cơ thể
                thật sự tỉnh táo, cần nghỉ hoặc chỉ nên xử lý việc nhẹ.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {painPoints.map((item) => (
                <motion.div key={item.key} variants={itemVariants}>
                  <PainCard
                    item={item}
                    isActive={activeKey === item.key}
                    onClick={() => setActiveKey(item.key)}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-6 overflow-hidden rounded-[32px] border border-white bg-white/82 p-5 shadow-[0_18px_55px_rgba(26,21,40,0.055)] backdrop-blur-xl md:p-6"
            >
              <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br ${activePain.accentBg} text-white shadow-[0_15px_30px_rgba(111,89,255,0.18)]`}
                  >
                    <ActiveIcon className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Góc nhìn chính
                    </div>

                    <h3 className="text-[24px] font-[900] leading-tight tracking-tight text-[#1A1528]">
                      {activePain.shortTitle}
                    </h3>

                    <p className="mt-2 text-[13.5px] font-semibold leading-7 text-[#5B566E]">
                      {activePain.insight}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <InfoPill
                    label="ChronoFlow gợi ý"
                    content={activePain.solution}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    tone="success"
                  />

                  <InfoPill
                    label="Logic sản phẩm"
                    content="Không chỉ hỏi hôm nay làm gì, mà giúp chọn thời điểm phù hợp để làm việc đó ít tốn sức hơn."
                    icon={<MousePointerClick className="h-4 w-4" />}
                    tone="neutral"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PainCard({
  item,
  isActive,
  onClick,
}: {
  item: PainPoint;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-full min-h-[190px] overflow-hidden rounded-[26px] border p-5 text-left transition-all duration-500 ${
        isActive
          ? `${item.borderColor} bg-white shadow-[0_18px_45px_rgba(26,21,40,0.085)]`
          : "border-white/70 bg-white/62 shadow-[0_10px_30px_rgba(26,21,40,0.035)] hover:-translate-y-1 hover:border-[#E9E5FF] hover:bg-white"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.softBg} opacity-0 transition-opacity duration-500 ${
          isActive ? "opacity-100" : "group-hover:opacity-70"
        }`}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white bg-white shadow-[0_10px_25px_rgba(26,21,40,0.06)] transition-transform duration-500 ${
                  isActive ? "scale-105" : "group-hover:scale-105"
                }`}
              >
                <Icon className={`h-5 w-5 ${item.accentText}`} />
              </div>

              <div>
                <span
                  className={`inline-flex items-center rounded-full bg-white/75 px-2.5 py-1 text-[9px] font-[900] uppercase tracking-[0.12em] ${item.accentText}`}
                >
                  {item.label}
                </span>

                <h3 className="mt-2 text-[17px] font-[900] leading-tight text-[#1A1528]">
                  {item.title}
                </h3>
              </div>
            </div>

            {isActive && (
              <motion.span
                layoutId="activePainDot"
                className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${item.glow}`}
              />
            )}
          </div>

          <p className="line-clamp-2 text-[13.5px] font-semibold leading-6 text-[#6B647C]">
            {item.compactProblem}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-[18px] border border-white/70 bg-white/72 px-4 py-3">
          <div>
            <div className={`text-[20px] font-[900] leading-none ${item.accentText}`}>
              {item.metric}
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.11em] text-[#8A84A3]">
              {item.metricLabel}
            </div>
          </div>

          <ArrowRight
            className={`h-4 w-4 transition-transform duration-300 ${
              isActive
                ? `${item.accentText} translate-x-1`
                : "text-[#B5AEC8] group-hover:translate-x-1"
            }`}
          />
        </div>
      </div>

      {isActive && (
        <motion.div
          layoutId="activePainBorder"
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accentBg}`}
        />
      )}
    </button>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -left-[8%] top-[5%] h-[420px] w-[420px] animate-[pulse_6s_infinite] rounded-full bg-[#DCCEFF]/70 blur-[110px]" />
      <div className="absolute right-[-10%] top-[20%] h-[420px] w-[420px] animate-[pulse_8s_infinite] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-white/70 blur-[100px]" />
    </div>
  );
}

function InfoPill({
  icon,
  label,
  content,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  tone: "success" | "neutral";
}) {
  const toneClass =
    tone === "success"
      ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
      : "bg-[#F8F9FE] text-[#6F59FF] border-[#E9E5FF]";

  return (
    <div className="rounded-[22px] border border-[#EEF0F6] bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl border ${toneClass}`}
        >
          {icon}
        </div>
        <span className="text-[11px] font-[900] uppercase tracking-[0.13em] text-[#8A84A3]">
          {label}
        </span>
      </div>

      <p className="text-[13px] font-semibold leading-6 text-[#5B566E]">
        {content}
      </p>
    </div>
  );
}