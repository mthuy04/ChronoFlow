"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BatteryWarning,
  Brain,
  CalendarX2,
  CheckCircle2,
  Clock3,
  Coffee,
  Layers3,
  MoonStar,
  MousePointerClick,
  Sparkles,
  TimerReset,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

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
  impact: string;
  solution: string;
  insight: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  emoji: string;
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
    label: "Focus mismatch",
    problem:
      "Bạn đã mở laptop, đã có task trước mắt, nhưng não vẫn ì ạch và rất khó vào trạng thái làm việc sâu.",
    impact:
      "Bạn mất nhiều thời gian để bắt đầu, dễ mở mạng xã hội, đổi task liên tục và cuối cùng vẫn thấy mình chưa làm được gì đáng kể.",
    solution:
      "ChronoFlow giúp bạn nhận diện khung giờ tập trung tốt hơn, sau đó gợi ý đưa deep work vào đúng thời điểm năng lượng cao.",
    insight:
      "Không phải bạn lười. Có thể bạn đang bắt đầu việc khó vào sai nhịp năng lượng.",
    metric: "09:00",
    metricLabel: "Khung tập trung gợi ý",
    icon: Brain,
    emoji: "🧠",
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
    label: "Energy mismatch",
    problem:
      "Những việc cần nhiều năng lượng như học sâu, viết báo cáo hay phân tích thường bị để đến cuối ngày.",
    impact:
      "Khi năng lượng đã giảm, task khó trở nên nặng hơn bình thường. Bạn dễ trì hoãn, làm qua loa hoặc phải thức khuya để bù.",
    solution:
      "ChronoFlow phân loại task theo mức năng lượng và gợi ý thời điểm phù hợp: deep work lúc tỉnh táo, admin khi năng lượng vừa, recovery khi cần reset.",
    insight: "Một task đúng nhưng đặt sai giờ vẫn có thể khiến bạn kiệt sức.",
    metric: "2.5x",
    metricLabel: "Cảm giác tốn sức hơn",
    icon: BatteryWarning,
    emoji: "🔋",
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
    label: "Priority overload",
    problem:
      "Task nào cũng có vẻ quan trọng, deadline nào cũng gấp, nhưng bạn không biết nên xử lý việc nào trước.",
    impact:
      "Bạn có thể bận cả ngày nhưng vẫn chưa chạm vào việc tạo ra giá trị thật. Lịch càng đầy, cảm giác kiểm soát càng giảm.",
    solution:
      "ChronoFlow giúp bạn nhìn lịch theo từng khối năng lượng, từ đó chọn task phù hợp với từng thời điểm thay vì chỉ xếp task theo deadline.",
    insight:
      "Một lịch tốt không chỉ nhiều task, mà phải biết task nào nên nằm ở thời điểm nào.",
    metric: "4",
    metricLabel: "Khối năng lượng chính",
    icon: CalendarX2,
    emoji: "📅",
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
    label: "Burnout loop",
    problem:
      "Bạn cố duy trì năng suất bằng cách làm nhiều hơn, nhưng lại bỏ qua thời điểm cơ thể cần nghỉ và phục hồi.",
    impact:
      "Năng lượng giảm dần, giấc ngủ bị ảnh hưởng, khả năng tập trung thấp hơn và bạn dễ rơi vào vòng lặp làm bù — mệt — lại làm bù.",
    solution:
      "ChronoFlow đưa recovery thành một phần của lịch trình, giúp bạn nghỉ đúng lúc thay vì chỉ nghỉ khi đã quá tải.",
    insight:
      "Nghỉ không phải là mất năng suất. Nghỉ đúng lúc là điều kiện để làm việc bền hơn.",
    metric: "15:00",
    metricLabel: "Khung phục hồi gợi ý",
    icon: Coffee,
    emoji: "☕",
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
    label: "Habit drop-off",
    problem:
      "Viết kế hoạch thì dễ, nhưng duy trì mỗi ngày lại khó, nhất là khi planner giấy không có nhắc nhở hay phản hồi.",
    impact:
      "Bạn bắt đầu rất hào hứng, sau đó bỏ dở vì không thấy tiến bộ rõ ràng hoặc không biết lịch hiện tại có thật sự hợp với mình không.",
    solution:
      "ChronoFlow kết nối web app với Planner Kit bằng focus session, điểm thưởng, streak và reflection để việc lập kế hoạch dễ duy trì hơn.",
    insight:
      "Planner chỉ hiệu quả khi có vòng lặp phản hồi: lên kế hoạch, làm, nhìn lại, rồi điều chỉnh.",
    metric: "+XP",
    metricLabel: "Điểm focus tích lũy",
    icon: Trophy,
    emoji: "🏆",
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
    label: "Scattered workflow",
    problem:
      "Bạn có thể dùng Notion, lịch, to-do list, ghi chú giấy, nhưng mỗi thứ nằm một nơi và không kết nối với nhịp sinh học của bạn.",
    impact:
      "Thông tin bị phân tán, lịch dễ rối, task dễ trôi và bạn mất thêm năng lượng chỉ để quyết định hôm nay nên làm gì.",
    solution:
      "ChronoFlow gom chronotype test, energy map, smart scheduling, dashboard và planner kit vào cùng một flow dễ theo dõi.",
    insight:
      "Công cụ riêng lẻ không đủ. Bạn cần một hệ thống giúp ra quyết định mỗi ngày.",
    metric: "1 flow",
    metricLabel: "Từ insight đến hành động",
    icon: Layers3,
    emoji: "🧩",
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
    transition: { staggerChildren: 0.075 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: "easeOut" },
  },
};

export default function PainPointsSection() {
  const [activeKey, setActiveKey] = useState<PainKey>("focus");

  const activePain = useMemo(
    () => painPoints.find((item) => item.key === activeKey) ?? painPoints[0],
    [activeKey]
  );

  const ActiveIcon = activePain.icon;

  const renderPainCard = (item: PainPoint) => {
    const isActive = activeKey === item.key;
    const Icon = item.icon;

    return (
      <button
        type="button"
        onClick={() => setActiveKey(item.key)}
        className={`group relative h-full min-h-[250px] overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-500 ${
          isActive
            ? `${item.borderColor} bg-white shadow-[0_18px_45px_rgba(26,21,40,0.085)]`
            : "border-white/70 bg-white/60 shadow-[0_10px_30px_rgba(26,21,40,0.035)] hover:-translate-y-1 hover:border-[#E9E5FF] hover:bg-white"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.softBg} opacity-0 transition-opacity duration-500 ${
            isActive ? "opacity-100" : "group-hover:opacity-70"
          }`}
        />

        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-white bg-white shadow-[0_10px_25px_rgba(26,21,40,0.06)] transition-transform duration-500 ${
                isActive ? "scale-105" : "group-hover:scale-105"
              }`}
            >
              <Icon className={`h-6 w-6 ${item.accentText}`} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-[900] uppercase tracking-[0.12em] ${item.accentText}`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="activePainDot"
                    className={`h-2 w-2 rounded-full ${item.glow}`}
                  />
                )}
              </div>

              <h3 className="text-[18px] font-[900] leading-tight text-[#1A1528]">
                {item.title}
              </h3>

              <p className="mt-2 line-clamp-4 text-[14px] font-semibold leading-relaxed text-[#6B647C]">
                {item.problem}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[20px] border border-white/70 bg-white/70 px-4 py-3">
            <div>
              <div className={`text-[26px] font-[900] leading-none ${item.accentText}`}>
                {item.metric}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.11em] text-[#8A84A3]">
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
  };

  return (
    <section
      id="pain-points"
      className="relative overflow-hidden bg-[#F4F2FA] py-10 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[38px] border border-white bg-white/75 px-5 py-14 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-20 lg:px-12">
          <BackgroundGlow />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="mx-auto mb-12 max-w-4xl text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <AlertTriangle className="h-3.5 w-3.5" />
                Pain Points
              </div>

              <h2 className="mb-5 text-[clamp(2.25rem,4.6vw,3.75rem)] font-[900] leading-[1.04] tracking-[-0.04em] text-[#1A1528]">
                Cách chúng ta làm việc hôm nay{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  chưa hợp với nhịp năng lượng.
                </span>
              </h2>

              <p className="mx-auto max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                Nhiều người không thiếu cố gắng. Vấn đề là lịch học, lịch làm và
                cách ưu tiên task thường bỏ qua thời điểm cơ thể thật sự tỉnh táo,
                cần nghỉ hoặc chỉ nên xử lý việc nhẹ.
              </p>
            </motion.div>

            <div className="mt-14 space-y-7">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {painPoints.map((item) => (
                  <motion.div key={item.key} variants={itemVariants}>
                    {renderPainCard(item)}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65 }}
                className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"
              >
                <div className="relative overflow-hidden rounded-[36px] border border-white bg-white/85 p-5 shadow-[0_24px_70px_rgba(26,21,40,0.08)] backdrop-blur-md md:p-6">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                      className={`absolute left-[-90px] top-[-90px] h-[240px] w-[240px] rounded-full ${activePain.glow} opacity-15 blur-[70px]`}
                    />
                    <div className="absolute bottom-[-110px] right-[-90px] h-[280px] w-[280px] rounded-full bg-[#4DA8FF]/15 blur-[80px]" />
                  </div>

                  <div className="relative z-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePain.key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6F59FF]">
                          <Sparkles className="h-3.5 w-3.5" />
                          Insight chính
                        </div>

                        <div className="mb-6 flex items-start gap-4">
                          <div
                            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br ${activePain.accentBg} text-white shadow-[0_15px_30px_rgba(111,89,255,0.2)]`}
                          >
                            <ActiveIcon className="h-7 w-7" />
                          </div>

                          <div>
                            <h3 className="text-[30px] font-[900] leading-[1.08] tracking-tight text-[#1A1528]">
                              {activePain.shortTitle}
                            </h3>
                            <p className="mt-2 max-w-[520px] text-[13px] font-bold uppercase tracking-[0.12em] text-[#8A84A3]">
                              {activePain.insight}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <InfoBlock
                            icon={<AlertTriangle className="h-4 w-4" />}
                            label="Vấn đề"
                            content={activePain.problem}
                            tone="warning"
                          />
                          <InfoBlock
                            icon={<BatteryWarning className="h-4 w-4" />}
                            label="Hệ quả"
                            content={activePain.impact}
                            tone="neutral"
                          />
                          <InfoBlock
                            icon={<CheckCircle2 className="h-4 w-4" />}
                            label="ChronoFlow giải quyết"
                            content={activePain.solution}
                            tone="success"
                          />
                        </div>

                        <div className="mt-6 rounded-[24px] border border-[#E9E5FF] bg-[#F8F9FE] p-4">
                          <div className="mb-2 flex items-center gap-2 text-[12px] font-[900] uppercase tracking-[0.14em] text-[#6F59FF]">
                            <MousePointerClick className="h-3.5 w-3.5" />
                            Logic sản phẩm
                          </div>
                          <p className="text-[13px] font-semibold leading-relaxed text-[#5B566E]">
                            ChronoFlow không chỉ hỏi “hôm nay bạn cần làm gì?”,
                            mà còn giúp trả lời câu quan trọng hơn: “nên làm việc
                            này vào lúc nào để ít tốn sức và dễ duy trì hơn?”
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[36px] border border-white bg-[linear-gradient(180deg,#F2EDFF_0%,#E9F5FF_100%)] p-5 shadow-[0_24px_70px_rgba(26,21,40,0.08)] md:p-6">
                  <FloatingBadge
                    className="left-5 top-5"
                    icon={<Clock3 className="h-4 w-4 text-[#6F59FF]" />}
                    text="Sai lúc = tốn sức"
                  />

                  <FloatingBadge
                    className="bottom-5 right-5"
                    icon={<TimerReset className="h-4 w-4 text-[#10B981]" />}
                    text="Reset đúng lúc"
                    delay
                  />

                  <div className="flex min-h-[620px] items-center justify-center">
                    <PainMockup activePain={activePain} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-[#E9E5FF] bg-white px-6 py-5 shadow-[0_18px_55px_rgba(26,21,40,0.05)] md:px-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-1 text-[12px] font-[900] uppercase tracking-[0.16em] text-[#6F59FF]">
                      Chuyển vấn đề thành hành động
                    </div>
                    <p className="max-w-[720px] text-[15px] font-semibold leading-relaxed text-[#5B566E]">
                      Sau khi hiểu pain point, ChronoFlow dẫn người dùng sang hệ
                      thống cốt lõi: test chronotype, dashboard năng lượng, smart
                      scheduling, focus points và Planner Kit.
                    </p>
                  </div>

                  <button className="group flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(26,21,40,0.22)]">
                    Xem tính năng chính
                    <ArrowRight className="h-4 w-4 text-[#4DA8FF] transition group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
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

function InfoBlock({
  icon,
  label,
  content,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  tone: "warning" | "neutral" | "success";
}) {
  const toneClass =
    tone === "warning"
      ? "bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]"
      : tone === "success"
        ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
        : "bg-[#F8F9FE] text-[#6F59FF] border-[#E9E5FF]";

  return (
    <div className="rounded-[22px] border border-[#EEF0F6] bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl border ${toneClass}`}
        >
          {icon}
        </div>
        <span className="text-[12px] font-[900] uppercase tracking-[0.13em] text-[#8A84A3]">
          {label}
        </span>
      </div>

      <p className="text-[13.5px] font-semibold leading-relaxed text-[#5B566E]">
        {content}
      </p>
    </div>
  );
}

function FloatingBadge({
  icon,
  text,
  className,
  delay = false,
}: {
  icon: React.ReactNode;
  text: string;
  className: string;
  delay?: boolean;
}) {
  return (
    <div
      className={`absolute z-20 hidden rounded-2xl border border-white bg-white/85 px-4 py-3 shadow-[0_16px_35px_rgba(26,21,40,0.08)] backdrop-blur-md sm:block ${className} ${
        delay ? "animate-[bounce_5s_infinite]" : "animate-[bounce_4s_infinite]"
      }`}
    >
      <div className="flex items-center gap-2 text-[12px] font-[900] text-[#1A1528]">
        {icon}
        {text}
      </div>
    </div>
  );
}

function PainMockup({ activePain }: { activePain: PainPoint }) {
  const ActiveIcon = activePain.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePain.key}
        initial={{ opacity: 0, rotate: -4, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, rotate: 0, y: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 4, y: -20, scale: 0.96 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[330px]"
      >
        <div className="rounded-[38px] border-[8px] border-[#1A1528] bg-[#1A1528] shadow-[0_35px_80px_rgba(26,21,40,0.28)]">
          <div className="overflow-hidden rounded-[28px] bg-white">
            <div
              className={`bg-gradient-to-br ${activePain.accentBg} px-5 pb-5 pt-6 text-white`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                    ChronoFlow
                  </p>
                  <h4 className="mt-1 text-[19px] font-[900] leading-tight">
                    Làm việc đúng nhịp
                  </h4>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <MoonStar className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-[24px] bg-white/18 p-4 backdrop-blur-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-white/80">
                    Đường năng lượng
                  </span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-[900]">
                    Cá nhân hóa
                  </span>
                </div>

                <div className="flex h-[78px] items-end gap-2">
                  {[38, 52, 44, 78, 88, 70, 46].map((height, index) => (
                    <div
                      key={index}
                      className="flex h-full flex-1 items-end rounded-full bg-white/25"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{
                          duration: 0.7,
                          delay: index * 0.06,
                          ease: "easeOut",
                        }}
                        className="w-full rounded-full bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-[#F8F9FE] p-5">
              <div className="rounded-[24px] border border-[#EEF0F6] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${activePain.accentBg} text-white`}
                    >
                      <ActiveIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-[900] text-[#1A1528]">
                        {activePain.shortTitle}
                      </p>
                      <p className="text-[11px] font-semibold text-[#8A84A3]">
                        Pain point được phát hiện
                      </p>
                    </div>
                  </div>

                  <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                </div>

                <p className="text-[12.5px] font-semibold leading-relaxed text-[#5B566E]">
                  {activePain.solution}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#EEF0F6] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-[900] uppercase tracking-[0.13em] text-[#8A84A3]">
                    Gợi ý hôm nay
                  </span>
                  <span className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[10px] font-[900] text-[#6F59FF]">
                    Smart plan
                  </span>
                </div>

                <div className="space-y-2.5">
                  <MiniScheduleRow
                    time="09:00"
                    title="Deep work"
                    desc="Đặt vào khung năng lượng cao"
                    tone="purple"
                  />
                  <MiniScheduleRow
                    time="13:30"
                    title="Admin / review"
                    desc="Xử lý task nhẹ hơn"
                    tone="blue"
                  />
                  <MiniScheduleRow
                    time="15:00"
                    title="Recovery"
                    desc="Reset để giữ nhịp"
                    tone="green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MetricCard value="3p" label="Bài test" />
                <MetricCard value="4" label="Nhịp độ" />
                <MetricCard value="+XP" label="Focus" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function MiniScheduleRow({
  time,
  title,
  desc,
  tone,
}: {
  time: string;
  title: string;
  desc: string;
  tone: "purple" | "blue" | "green";
}) {
  const dotClass =
    tone === "purple"
      ? "bg-[#6F59FF]"
      : tone === "blue"
        ? "bg-[#4DA8FF]"
        : "bg-[#10B981]";

  const bgClass =
    tone === "purple"
      ? "bg-[#F3F0FF]"
      : tone === "blue"
        ? "bg-[#EEF6FF]"
        : "bg-[#ECFDF5]";

  return (
    <div className={`flex items-center gap-3 rounded-2xl ${bgClass} p-3`}>
      <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[12px] font-[900] text-[#1A1528]">
            {title}
          </p>
          <span className="text-[10px] font-[900] text-[#8A84A3]">{time}</span>
        </div>
        <p className="truncate text-[10.5px] font-semibold text-[#8A84A3]">
          {desc}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#EEF0F6] bg-white p-3 text-center">
      <div className="text-[15px] font-[900] text-[#1A1528]">{value}</div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8A84A3]">
        {label}
      </div>
    </div>
  );
}