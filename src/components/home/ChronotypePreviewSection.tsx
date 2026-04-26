"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Coffee,
  Bed,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type AnimalKey = "Lion" | "Bear" | "Wolf" | "Dolphin";

// Dữ liệu cho Radar Chart (6 đỉnh tương ứng 6 mốc thời gian)
const RADAR_DATA = {
  Lion: [100, 60, 20, 0, 10, 80],
  Bear: [90, 70, 40, 0, 10, 50],
  Wolf: [40, 70, 100, 80, 10, 20],
  Dolphin: [80, 40, 70, 20, 10, 50],
};

const profiles: Record<
  AnimalKey,
  {
    key: AnimalKey;
    labelVi: string;
    color: string;
    softColor: string;
    stickerUrl: string;
    summary: string;
    energyPercent: number;
    peakTime: string;
    recoveryTime: string;
    timeline: Array<{
      time: string;
      task: string;
      dotColor: string;
    }>;
  }
> = {
  Lion: {
    key: "Lion",
    labelVi: "Sư tử",
    color: "#F59E0B",
    softColor: "bg-[#FFF9F0]",
    stickerUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Lion.png",
    summary:
      "Sư tử thường tỉnh táo rất sớm và đạt đỉnh năng lượng vào đầu ngày. Đây là nhóm phù hợp nhất để xử lý deep work, ra quyết định và giải quyết việc khó trước buổi trưa.",
    energyPercent: 85,
    peakTime: "07:00 - 11:00",
    recoveryTime: "13:00 - 14:30",
    timeline: [
      {
        time: "07:30",
        task: "Deep work / việc quan trọng",
        dotColor: "bg-[#F59E0B]",
      },
      {
        time: "09:30",
        task: "Phân tích / ra quyết định",
        dotColor: "bg-[#F59E0B]",
      },
      {
        time: "13:00",
        task: "Email / admin / review nhẹ",
        dotColor: "bg-gray-300",
      },
      {
        time: "15:00",
        task: "Nghỉ ngắn / hồi phục năng lượng",
        dotColor: "bg-green-400",
      },
    ],
  },
  Bear: {
    key: "Bear",
    labelVi: "Gấu",
    color: "#6F59FF",
    softColor: "bg-[#F8F5FF]",
    stickerUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png",
    summary:
      "Gấu có nhịp sinh học ổn định và khá gần với lịch học, lịch làm việc phổ biến. Bạn thường vào guồng tốt sau khi khởi động nhẹ và đạt hiệu suất cao nhất từ buổi sáng đến gần trưa.",
    energyPercent: 70,
    peakTime: "09:00 - 12:30",
    recoveryTime: "14:30 - 16:00",
    timeline: [
      {
        time: "09:00",
        task: "Khởi động ngày mới / lên kế hoạch",
        dotColor: "bg-[#6F59FF]",
      },
      {
        time: "10:30",
        task: "Học sâu / việc cần tập trung",
        dotColor: "bg-[#6F59FF]",
      },
      {
        time: "14:00",
        task: "Họp nhóm / làm việc cộng tác",
        dotColor: "bg-[#38BDF8]",
      },
      {
        time: "16:00",
        task: "Việc nhẹ / xử lý hành chính",
        dotColor: "bg-gray-300",
      },
    ],
  },
  Wolf: {
    key: "Wolf",
    labelVi: "Sói",
    color: "#94A3B8",
    softColor: "bg-[#F8FAFC]",
    stickerUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Wolf.png",
    summary:
      "Sói thường khởi động chậm vào buổi sáng nhưng tăng dần về chiều và tối. Đây là nhóm phù hợp với các hoạt động sáng tạo, phân tích sâu hoặc làm việc độc lập ở nửa sau ngày.",
    energyPercent: 60,
    peakTime: "16:00 - 20:00",
    recoveryTime: "09:30 - 11:00",
    timeline: [
      {
        time: "10:00",
        task: "Khởi động nhẹ / kiểm tra tin nhắn",
        dotColor: "bg-gray-300",
      },
      {
        time: "13:30",
        task: "Việc nền / task quen thuộc",
        dotColor: "bg-[#38BDF8]",
      },
      {
        time: "16:30",
        task: "Sáng tạo / lên ý tưởng",
        dotColor: "bg-[#94A3B8]",
      },
      {
        time: "19:00",
        task: "Phân tích sâu / tập trung cao",
        dotColor: "bg-[#94A3B8]",
      },
    ],
  },
  Dolphin: {
    key: "Dolphin",
    labelVi: "Cá heo",
    color: "#10B981",
    softColor: "bg-[#F0FDF4]",
    stickerUrl:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dolphin.png",
    summary:
      "Cá heo có nhịp năng lượng dao động hơn, vì vậy bạn thường làm tốt nhất trong các khối tập trung ngắn. Lịch phù hợp là làm theo sprint, xen kẽ nghỉ đúng lúc để tránh quá tải.",
    energyPercent: 55,
    peakTime: "10:00 - 12:00 & 16:00 - 18:00",
    recoveryTime: "14:00 - 15:00",
    timeline: [
      {
        time: "10:30",
        task: "Sprint tập trung 1",
        dotColor: "bg-[#10B981]",
      },
      {
        time: "12:00",
        task: "Viết lách / nghiên cứu",
        dotColor: "bg-[#10B981]",
      },
      {
        time: "15:00",
        task: "Nghỉ hoàn toàn / reset",
        dotColor: "bg-green-400",
      },
      {
        time: "16:30",
        task: "Sprint tập trung 2",
        dotColor: "bg-[#10B981]",
      },
    ],
  },
};

export default function InteractiveRhythmMap() {
  const [active, setActive] = useState<AnimalKey>("Bear");
  const current = useMemo(() => profiles[active], [active]);

  return (
    <section className="relative overflow-hidden bg-[#F4F2FA] pb-10 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[48px] border border-white bg-white px-6 py-16 shadow-[0_20px_80px_rgba(26,21,40,0.06)] md:px-12 md:py-20">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -left-[5%] top-[5%] h-[500px] w-[500px] animate-[pulse_6s_infinite] rounded-full bg-gradient-to-tr from-[#E9F5FF] to-[#F3F0FF] opacity-90 blur-[120px]" />
            <div className="absolute -right-[5%] bottom-[5%] h-[600px] w-[600px] animate-[pulse_8s_infinite] rounded-full bg-gradient-to-bl from-[#FFF1E8] to-[#F3F0FF] opacity-80 blur-[140px]" />
          </div>

          <div className="relative z-10">
            <div className="mb-14 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-white/90 px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-[#6F59FF] shadow-sm backdrop-blur-md"
              >
                <Sparkles className="h-4 w-4" /> BẢN ĐỒ NHỊP NĂNG LƯỢNG
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#0F172A]"
              >
                Mỗi chronotype đạt đỉnh ở <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  một thời điểm khác nhau.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-auto mt-5 max-w-[720px] text-[15px] font-medium leading-relaxed text-[#64748B]"
              >
                Không phải ai cũng nên làm việc khó vào cùng một thời điểm.
                Chọn chronotype để xem cách nhịp năng lượng thay đổi trong ngày
                và hình dung lịch làm việc nào phù hợp nhất với bạn.
              </motion.p>
            </div>

            <div className="relative z-20 mb-14 flex flex-wrap items-center justify-center gap-4">
              {(Object.keys(profiles) as AnimalKey[]).map((key) => {
                const item = profiles[key];
                const isActive = active === key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActive(key)}
                    className={`group relative flex items-center gap-3 rounded-full p-2 pr-6 transition-all duration-300 ${
                      isActive
                        ? "scale-105 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.06)] ring-1 ring-gray-100"
                        : "border border-transparent bg-white/60 hover:border-gray-200 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        isActive ? item.softColor : "bg-gray-100"
                      }`}
                    >
                      <img
                        src={item.stickerUrl}
                        alt={item.labelVi}
                        className="h-8 w-8 object-contain drop-shadow-sm"
                      />
                    </div>
                    <span
                      className={`text-[15px] font-[900] ${
                        isActive ? "text-[#0F172A]" : "text-[#64748B]"
                      }`}
                    >
                      {item.labelVi}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute right-0 top-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative overflow-hidden rounded-[40px] border border-gray-100 bg-white/70 p-6 shadow-[0_15px_50px_rgba(17,12,34,0.03)] backdrop-blur-xl lg:p-8">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
                <div className="relative flex h-[480px] flex-col items-center justify-center overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-gray-100 md:h-[520px]">
                  <div className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-[10px] font-[900] uppercase tracking-widest text-[#64748B]">
                    <Activity className="h-3.5 w-3.5" /> Bản đồ năng lượng
                  </div>

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="h-[75%] w-[75%] rounded-full border border-dashed border-gray-300" />
                    <div className="absolute h-[45%] w-[45%] rounded-full border border-dashed border-gray-300" />
                  </div>

                  <div className="relative z-10 flex h-[340px] w-[340px] items-center justify-center md:h-[400px] md:w-[400px]">
                    <svg
                      viewBox="0 0 100 100"
                      className="h-full w-full overflow-visible drop-shadow-lg"
                    >
                      <polygon
                        points={generatePolygonPoints([100, 100, 100, 100, 100, 100])}
                        fill="#F8FAFC"
                        stroke="#E2E8F0"
                        strokeWidth="0.5"
                      />

                      <motion.polygon
                        points={generatePolygonPoints(RADAR_DATA[active])}
                        fill={current.color}
                        fillOpacity="0.15"
                        stroke={current.color}
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          points: generatePolygonPoints(RADAR_DATA[active]),
                        }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                      />

                      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <line
                          key={i}
                          x1="50"
                          y1="50"
                          x2={50 + 50 * Math.sin((angle * Math.PI) / 180)}
                          y2={50 - 50 * Math.cos((angle * Math.PI) / 180)}
                          stroke="#CBD5E1"
                          strokeWidth="0.5"
                          opacity="0.8"
                        />
                      ))}
                    </svg>

                    <div className="absolute inset-0">
                      {["12h", "16h", "20h", "00h", "04h", "08h"].map(
                        (time, index) => {
                          const angle = index * 60;
                          const radius = 54;
                          const x = 50 + radius * Math.sin((angle * Math.PI) / 180);
                          const y = 50 - radius * Math.cos((angle * Math.PI) / 180);
                          return (
                            <div
                              key={time}
                              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-[900] uppercase tracking-wider text-gray-400 shadow-sm"
                              style={{ left: `${x}%`, top: `${y}%` }}
                            >
                              {time}
                            </div>
                          );
                        }
                      )}
                    </div>

                    <motion.div
                      key={`glow-${current.key}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute z-0 h-[90px] w-[90px] rounded-full blur-[15px]"
                      style={{ backgroundColor: current.color }}
                    />

                    <motion.div
                      key={current.key}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="absolute z-20 flex h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-full border-2 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.08)] ring-4 ring-white"
                      style={{ borderColor: current.color }}
                    >
                      <img
                        src={current.stickerUrl}
                        alt={current.labelVi}
                        className="h-14 w-14 animate-[floatEmoji_3s_ease-in-out_infinite] object-contain"
                      />
                    </motion.div>
                  </div>
                </div>

                <div className="flex h-full flex-col gap-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.key}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-full flex-col gap-5"
                    >
                      <div
                        className={`rounded-[32px] border border-gray-50 p-6 shadow-sm ${current.softColor}`}
                      >
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-[900] uppercase tracking-widest text-[#64748B] shadow-sm">
                          <TrendingUp
                            className="h-3 w-3"
                            style={{ color: current.color }}
                          />
                          Hồ sơ: {current.labelVi}
                        </div>
                        <p className="mb-5 text-[14px] font-medium leading-relaxed text-[#475569]">
                          {current.summary}
                        </p>

                        <div className="rounded-2xl border border-gray-50 bg-white p-4 shadow-sm">
                          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                            Mức năng lượng tổng quan
                          </div>
                          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${current.energyPercent}%` }}
                              transition={{ duration: 0.8, type: "spring" }}
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ backgroundColor: current.color }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-[11px] font-bold text-gray-400">
                            <span>Thấp</span>
                            <span className="text-[13px] text-[#0F172A]">
                              {current.energyPercent}%
                            </span>
                            <span>Cao</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
                          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-[900] uppercase text-[#94A3B8]">
                            <Zap className="h-4 w-4" style={{ color: current.color }} />
                            Khung tập trung
                          </div>
                          <div className="text-[15px] font-[900] text-[#0F172A] xl:text-[16px]">
                            {current.peakTime}
                          </div>
                        </div>
                        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
                          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-[900] uppercase text-[#94A3B8]">
                            <Bed className="h-4 w-4 text-blue-400" />
                            Khung hồi phục
                          </div>
                          <div className="text-[15px] font-[900] text-[#0F172A] xl:text-[16px]">
                            {current.recoveryTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-center rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between border-b border-gray-50 pb-3">
                          <h3 className="flex items-center gap-2 text-[16px] font-[900] text-[#0F172A]">
                            <Clock className="h-4 w-4 text-[#6F59FF]" />
                            Lịch gợi ý trong ngày
                          </h3>
                          <div className="text-[11px] font-bold text-gray-400">
                            Hôm nay
                          </div>
                        </div>

                        <div className="relative space-y-3">
                          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gray-100" />
                          {current.timeline.map((item) => (
                            <div
                              key={item.time + item.task}
                              className="group relative z-10 flex items-center gap-4"
                            >
                              <div className="w-12 text-right text-[12px] font-[900] text-[#94A3B8] transition-colors group-hover:text-[#0F172A]">
                                {item.time}
                              </div>
                              <div
                                className={`h-3 w-3 rounded-full ring-4 ring-white shadow-sm transition-transform group-hover:scale-125 ${item.dotColor}`}
                              />
                              <div className="flex-1 rounded-2xl border border-gray-50 bg-[#F8FAFC] px-4 py-2.5 transition-all group-hover:bg-white group-hover:shadow-sm">
                                <span className="text-[13px] font-bold text-[#1E293B]">
                                  {item.task}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <SimpleCard
                icon={<Zap className="h-6 w-6 text-[#F59E0B]" />}
                iconBg="bg-[#FFFBEB]"
                title="Khung tập trung cao"
                value="Deep Work"
                text="Đây là giai đoạn nên ưu tiên việc khó, học sâu hoặc những nhiệm vụ cần suy nghĩ rõ ràng và liên tục."
              />
              <SimpleCard
                icon={<Coffee className="h-6 w-6 text-[#6F59FF]" />}
                iconBg="bg-[#F3F0FF]"
                title="Khung việc nhẹ"
                value="Admin / Review"
                text="Khi năng lượng giảm nhẹ, bạn không nhất thiết phải dừng hoàn toàn. Đây là lúc phù hợp cho email, review hoặc cập nhật tài liệu."
              />
              <SimpleCard
                icon={<Bed className="h-6 w-6 text-[#0EA5E9]" />}
                iconBg="bg-[#F0F9FF]"
                title="Khung hồi phục"
                value="Recovery"
                text="Hồi phục không tách rời hiệu suất. Nghỉ đúng lúc giúp bạn duy trì chất lượng tập trung tốt hơn trong phần còn lại của ngày."
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="mx-auto mb-8 max-w-2xl text-[14px] leading-7 text-[#615C7A]">
                Hiểu chronotype không phải để ép bản thân theo một khuôn mẫu hoàn hảo,
                mà để biết khi nào bạn phù hợp cho tập trung sâu, việc nhẹ, giao tiếp
                hay hồi phục — và lên kế hoạch sát với nhịp thật của mình.
              </p>

              <Link
                href="/assessment"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#1A152E] px-8 py-4 text-[15px] font-[900] text-white shadow-[0_15px_30px_rgba(26,21,40,0.15)] transition-all hover:-translate-y-1 hover:scale-105 hover:bg-black hover:shadow-[0_20px_50px_rgba(111,89,255,0.2)]"
              >
                Khám phá nhịp năng lượng của tôi
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }
      `}</style>
    </section>
  );
}

function generatePolygonPoints(data: number[]) {
  const centerX = 50;
  const centerY = 50;
  const maxRadius = 40;
  const points = data.map((val, index) => {
    const angle = index * 60;
    const radius = (val / 100) * maxRadius;
    const x = centerX + radius * Math.sin((angle * Math.PI) / 180);
    const y = centerY - radius * Math.cos((angle * Math.PI) / 180);
    return `${x},${y}`;
  });
  return points.join(" ");
}

function SimpleCard({
  icon,
  iconBg,
  title,
  value,
  text,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group flex flex-col rounded-[36px] border border-gray-100 bg-[#F8FAFC] p-8 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md"
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] shadow-sm ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-110 ${iconBg}`}
      >
        {icon}
      </div>
      <span className="mb-2 block text-[11px] font-[900] uppercase tracking-widest text-[#94A3B8]">
        {title}
      </span>
      <h4 className="mb-2 text-[20px] font-[900] leading-tight text-[#0F172A]">
        {value}
      </h4>
      <p className="text-[14px] font-medium leading-relaxed text-[#64748B]">
        {text}
      </p>
    </motion.div>
  );
}