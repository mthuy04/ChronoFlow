"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  Gift,
  Sparkles,
  Coins,
  Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isLoggedIn?: boolean;
};

type Step = {
  number: string;
  title: string;
  desc: string;
  color: string;
  glow: string;
  emoji: string;
};

export default function HowItWorksSection({ isLoggedIn = false }: Props) {
  const steps: Step[] = useMemo(
    () => [
      {
        number: "01",
        title: isLoggedIn
          ? "Cập nhật hồ sơ nhịp năng lượng"
          : "Làm bài test nhịp độ",
        desc: isLoggedIn
          ? "Bạn có thể cập nhật lại thói quen ngủ, giờ thức dậy, mức tỉnh táo trong ngày hoặc cảm nhận năng lượng gần đây để ChronoFlow điều chỉnh hồ sơ sát hơn với thực tế."
          : "Trả lời một vài câu hỏi ngắn về giấc ngủ, thời điểm bạn tỉnh táo nhất, cách bạn duy trì năng lượng và nhịp sinh hoạt thường ngày.",
        color: "from-[#6F59FF] to-[#8A5CF6]",
        glow: "bg-[#6F59FF]",
        emoji: "📝",
      },
      {
        number: "02",
        title: "Nhận hồ sơ chronotype",
        desc: "ChronoFlow xác định chronotype phù hợp với bạn, đồng thời hiển thị cửa sổ tập trung, khung hồi phục và những thời điểm nên ưu tiên việc quan trọng hoặc việc nhẹ.",
        color: "from-[#F59E0B] to-[#FBBF24]",
        glow: "bg-[#F59E0B]",
        emoji: "🧠",
      },
      {
        number: "03",
        title: isLoggedIn
          ? "Tối ưu lịch làm việc mỗi ngày"
          : "Biến insight thành kế hoạch thực tế",
        desc: "Từ hồ sơ đó, ChronoFlow gợi ý lịch trình rõ ràng hơn để bạn đặt đúng việc vào đúng thời điểm — ví dụ deep work lúc năng lượng cao, recovery khi cần hồi phục, và admin vào khung nhẹ hơn.",
        color: "from-[#0EA5E9] to-[#38BDF8]",
        glow: "bg-[#0EA5E9]",
        emoji: "📅",
      },
      {
        number: "04",
        title: "Tập trung thật và nhận xu",
        desc: "Bắt đầu focus session theo task đã chọn, ghi nhận thời gian làm việc thật, giữ streak và nhận xu để mở ưu đãi hoặc đổi Chrono Planner Kit.",
        color: "from-[#10B981] to-[#34D399]",
        glow: "bg-[#10B981]",
        emoji: "🪙",
      },
    ],
    [isLoggedIn]
  );

  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#F4F2FA] pb-10 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20"
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8"> 
        <div className="relative overflow-hidden rounded-[36px] border border-white bg-white px-6 py-12 shadow-[0_20px_80px_rgba(26,21,40,0.06)] md:px-10 md:py-16">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] animate-[pulse_6s_infinite] rounded-full bg-gradient-to-tr from-[#E9F5FF] to-[#F3F0FF] opacity-90 blur-[120px]" />
            <div className="absolute -right-[10%] bottom-[10%] h-[600px] w-[600px] animate-[pulse_8s_infinite] rounded-full bg-gradient-to-bl from-[#FFF1E8] to-[#F3F0FF] opacity-80 blur-[140px]" />
          </div>

          <div className="relative z-10">
            <div className="mb-14 text-center">
              <div className="mb-4 inline-flex animate-[fadeUp_0.5s_ease-out] items-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                CÁCH HOẠT ĐỘNG
              </div>

              <h2 className="mx-auto max-w-[820px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
  
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  4 bước 
                </span>
                đơn giản
              </h2>

              <p className="mx-auto mt-5 max-w-[720px] animate-[fadeUp_0.7s_ease-out] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                ChronoFlow không cố ép bạn theo một lịch trình chung. Sản phẩm bắt đầu 
                từ nhịp năng lượng của bạn, sau đó biến insight thành lịch
                trình, focus session và hệ thống xu thưởng dễ duy trì hơn mỗi ngày.
              </p>
            </div>

            <div className="mx-auto grid max-w-[1040px] items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = activeStep === index;

                  return (
                    <div
                      key={step.number}
                      onClick={() => setActiveStep(index)}
                      className={`group relative cursor-pointer overflow-hidden rounded-[28px] border transition-all duration-500 ${
                        isActive
                          ? "z-10 scale-[1.02] border-[#E9E5FF] bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                          : "border-transparent bg-transparent p-5 hover:bg-white/40"
                      }`}
                    >
                      <div className="flex items-start gap-5">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] shadow-sm transition-all duration-500 ${
                            isActive
                              ? "scale-110 bg-white shadow-[0_8px_16px_rgba(111,89,255,0.12)] ring-1 ring-gray-100"
                              : "bg-white/60 group-hover:bg-white"
                          }`}
                        >
                          <motion.div
                            animate={
                              isActive
                                ? {
                                    rotate: [0, -12, 12, -12, 0],
                                    scale: [1, 1.1, 1],
                                  }
                                : { rotate: 0, scale: 1 }
                            }
                            transition={{
                              duration: 1.5,
                              repeat: isActive ? Infinity : 0,
                              repeatDelay: 1,
                            }}
                            className={`text-2xl drop-shadow-sm transition-all ${
                              !isActive &&
                              "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                            }`}
                          >
                            {step.emoji}
                          </motion.div>
                        </div>

                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-3">
                            <span
                              className={`text-[12px] font-[900] tracking-widest ${
                                isActive ? "text-[#6F59FF]" : "text-gray-400"
                              }`}
                            >
                              BƯỚC {step.number}
                            </span>
                          </div>

                          <h3
                            className={`text-[18px] font-[900] leading-tight transition-colors ${
                              isActive
                                ? "text-[#0F172A]"
                                : "text-[#475569] group-hover:text-[#0F172A]"
                            }`}
                          >
                            {step.title}
                          </h3>

                          <AnimatePresence>
                            {isActive && (
                              <motion.p
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{
                                  opacity: 1,
                                  height: "auto",
                                  marginTop: 8,
                                }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-[14px] font-medium leading-relaxed text-[#64748B]"
                              >
                                {step.desc}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {isActive && (
                        <motion.div
                          layoutId="activeStepLine"
                          className={`absolute bottom-0 left-0 top-0 w-1.5 bg-gradient-to-b ${step.color}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="relative flex h-[560px] items-center justify-center perspective-[2000px]">
                <div
                  className={`absolute left-1/2 top-1/2 h-[380px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[80px] transition-colors duration-1000 ${steps[activeStep].glow}`}
                />

                <motion.div
                  className="transform-style-3d relative z-10 h-[540px] w-[260px] rounded-[48px] bg-[#1A1528] p-2.5 shadow-[0_30px_70px_rgba(17,12,34,0.15),inset_0_0_0_1px_rgba(255,255,255,0.2),inset_0_0_20px_rgba(255,255,255,0.5)]"
                  initial={{ rotateY: 10, rotateX: 2 }}
                  animate={{ rotateY: 0, rotateX: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  whileHover={{ rotateY: -5, rotateX: 2, scale: 1.02 }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-[#F8F9FE] shadow-inner ring-1 ring-black/5">
                    <PhoneNotch />

                    <div className="relative h-full w-full pt-10">
                      <AnimatePresence mode="wait">
                        {activeStep === 0 && <StepOneScreen />}
                        {activeStep === 1 && <StepTwoScreen />}
                        {activeStep === 2 && <StepThreeScreen />}
                        {activeStep === 3 && <StepFourScreen />}
                      </AnimatePresence>
                    </div>

                    <div className="absolute bottom-1.5 left-1/2 z-50 h-1 w-20 -translate-x-1/2 rounded-full bg-black/20" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

function PhoneNotch() {
  return (
    <div className="absolute inset-x-0 top-2 z-50 flex justify-center">
      <div className="flex h-[22px] w-[85px] items-center justify-between rounded-full bg-black px-2.5 shadow-sm">
        <div className="h-1.5 w-1.5 rounded-full border border-gray-700 bg-gray-800" />
        <div className="relative h-1.5 w-1.5 rounded-full bg-green-900">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-50" />
        </div>
      </div>
    </div>
  );
}

function StepOneScreen() {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col px-4"
    >
      <div className="mb-5 mt-2 flex items-center justify-between">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
          <ArrowRight className="h-3.5 w-3.5 rotate-180 text-gray-400" />
        </div>
        <div className="text-[11px] font-[900] text-gray-400">1 / 5</div>
      </div>

      <div className="mb-5">
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-[20%] rounded-full bg-[#6F59FF]" />
        </div>
        <h3 className="text-[17px] font-[900] leading-tight text-[#0F172A]">
          Thời điểm bạn cảm thấy tỉnh táo nhất là khi nào?
        </h3>
      </div>

      <div className="space-y-2.5">
        {[
          { text: "Sáng sớm trước 9h", active: true },
          { text: "Cuối buổi sáng", active: false },
          { text: "Chiều muộn / tối", active: false },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 shadow-sm transition-all ${
              item.active
                ? "scale-[1.02] border-[#6F59FF] bg-white ring-1 ring-[#6F59FF]/20"
                : "border-gray-100 bg-white/60"
            }`}
          >
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                item.active ? "border-[#6F59FF]" : "border-gray-300"
              }`}
            >
              {item.active && <div className="h-2 w-2 rounded-full bg-[#6F59FF]" />}
            </div>
            <div
              className={`text-[12px] font-bold ${
                item.active ? "text-[#6F59FF]" : "text-[#1A1528]"
              }`}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pb-5">
        <div className="w-full rounded-full bg-[#1A1528] py-3 text-center text-[13px] font-bold text-white shadow-lg">
          Tiếp tục
        </div>
      </div>
    </motion.div>
  );
}

function StepTwoScreen() {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col px-4"
    >
      <div className="mb-5 mt-2 text-center">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Kết quả của bạn
        </div>
        <h3 className="flex items-center justify-center gap-2 text-[20px] font-[900] text-[#0F172A]">
          Sư Tử <span className="text-[20px]">🦁</span>
        </h3>
      </div>

      <div className="mb-3 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#F59E0B]" />
          <span className="text-[12px] font-[900]">Năng lượng trong ngày</span>
        </div>
        <div className="flex h-[90px] items-end overflow-hidden rounded-xl border border-orange-50 bg-gradient-to-b from-[#FFF9F0] to-white px-2 pb-1.5">
          {[40, 80, 100, 60, 30].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                type: "spring",
              }}
              className="mx-1 flex-1 rounded-t-md bg-gradient-to-t from-[#F59E0B] to-[#FCD34D] opacity-90 shadow-sm"
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between px-2 text-[9px] font-bold text-gray-400">
          <span>6h</span>
          <span>12h</span>
          <span>18h</span>
          <span>24h</span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="mb-0.5 text-[9px] font-bold uppercase text-gray-400">
            Peak Focus
          </div>
          <div className="text-[14px] font-[900] text-[#1A1528]">07:00</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="mb-0.5 text-[9px] font-bold uppercase text-gray-400">
            Recovery
          </div>
          <div className="text-[14px] font-[900] text-[#1A1528]">13:00</div>
        </div>
      </div>

      <div className="mb-6 mt-auto flex items-center justify-center rounded-full bg-[#1A1528] p-3.5 text-[12px] font-bold text-white shadow-lg">
        Xem chi tiết hồ sơ
      </div>
    </motion.div>
  );
}

function StepThreeScreen() {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col px-3"
    >
      <div className="mb-4 mt-2 flex items-center justify-between px-1">
        <h3 className="text-[18px] font-[900] text-[#0F172A]">Hôm nay</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
          <CalendarCheck2 className="h-4 w-4 text-[#0EA5E9]" />
        </div>
      </div>

      <div className="relative space-y-2.5">
        <div className="absolute bottom-4 left-[16px] top-4 w-0.5 bg-gray-200/60" />

        {[
          {
            time: "07:00",
            title: "Deep Work",
            desc: "Việc quan trọng nhất",
            dot: "bg-orange-500",
            glow: "shadow-[0_0_10px_rgba(245,158,11,0.4)]",
          },
          {
            time: "10:30",
            title: "Ra quyết định",
            desc: "Họp / Phân tích",
            dot: "bg-[#0EA5E9]",
            glow: "shadow-[0_0_10px_rgba(14,165,233,0.4)]",
          },
          {
            time: "13:00",
            title: "Recovery",
            desc: "Nghỉ ngơi / Ăn trưa",
            dot: "bg-green-400",
            glow: "",
          },
          {
            time: "15:00",
            title: "Việc nhẹ",
            desc: "Email / Admin",
            dot: "bg-gray-300",
            glow: "",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative z-10 flex gap-3"
          >
            <div className="flex w-9 flex-col items-center pt-3.5">
              <div
                className={`h-2.5 w-2.5 rounded-full border-2 border-white ring-1 ring-gray-100 ${item.dot} ${item.glow}`}
              />
            </div>
            <div className="flex-1 rounded-2xl border border-gray-50 bg-white p-3 shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
              <div className="mb-0.5 text-[10px] font-[900] text-gray-400">
                {item.time}
              </div>
              <div className="text-[13px] font-[900] text-[#1A1528]">
                {item.title}
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-gray-500">
                {item.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function StepFourScreen() {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col px-4"
    >
      <div className="mb-4 mt-2 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Focus session
          </div>
          <h3 className="text-[18px] font-[900] text-[#0F172A]">
            Deep Work
          </h3>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981] shadow-sm">
          <Timer className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mb-4 rounded-[24px] border border-emerald-100 bg-white p-5 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[10px] border-[#D1FAE5] bg-[#ECFDF5]">
          <div>
            <div className="text-[28px] font-[900] text-[#10B981]">25:00</div>
            <div className="mt-1 text-[10px] font-[900] uppercase tracking-[0.14em] text-[#6B7280]">
              focus mode
            </div>
          </div>
        </div>

        <div className="w-full rounded-full bg-[#1A1528] py-3 text-center text-[12px] font-bold text-white shadow-lg">
          Bắt đầu phiên tập trung
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-amber-100 bg-white p-3 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span className="text-[9px] font-bold uppercase text-gray-400">
              Coins
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-white shadow-sm">
              <Coins className="h-3.5 w-3.5" />
            </div>
            <div className="text-[18px] font-[900] text-[#F59E0B]">+10</div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-[#10B981]" />
            <span className="text-[9px] font-bold uppercase text-gray-400">
              Reward
            </span>
          </div>
          <div className="text-[18px] font-[900] text-[#10B981]">Kit</div>
        </div>
      </div>

      <div className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-[900] uppercase tracking-[0.14em] text-gray-400">
            Planner Kit progress
          </div>

          <div className="flex items-center gap-1 rounded-full bg-[#FFF7ED] px-2 py-1 text-[10px] font-[900] text-[#F59E0B]">
            <Coins className="h-3 w-3" />
            Coin
          </div>
        </div>

        <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "58%" }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"
          />
        </div>

        <div className="flex justify-between text-[10px] font-bold text-gray-400">
          <span>580 coins</span>
          <span>1000 coins</span>
        </div>
      </div>
    </motion.div>
  );
}