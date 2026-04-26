"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Timer,
  Coins,
  Flame,
  ShieldCheck,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock3,
  Gift,
  LockKeyhole,
  Zap,
  ArrowRight,
} from "lucide-react";

const items = [
  {
    title: "Focus Mode",
    desc: "Người dùng phải bắt đầu phiên tập trung theo task đã chọn, thay vì chỉ thêm task rồi bấm hoàn thành.",
    icon: Timer,
    gradient: "from-[#6F59FF] to-[#8B5CF6]",
    bg: "from-[#FBF9FF] via-[#F7F4FF] to-[#F3EEFF]",
    border: "border-[#E9E5FF]",
    text: "text-[#6F59FF]",
    tag: "Start → Focus → Finish",
  },
  {
    title: "Coin theo thời lượng",
    desc: "Coin được tính dựa trên thời gian focus thật, loại công việc và giới hạn hợp lý trong ngày.",
    icon: Coins,
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    bg: "from-[#FFFDF7] via-[#FFF8ED] to-[#FFF4E5]",
    border: "border-[#FFE6C7]",
    text: "text-[#F59E0B]",
    tag: "+5 đến +10 coin",
  },
  {
    title: "Streak & Badge",
    desc: "Duy trì nhịp làm việc đều đặn bằng streak theo tuần và badge nhỏ để tạo cảm giác tiến bộ.",
    icon: Flame,
    gradient: "from-[#EF4444] to-[#F97316]",
    bg: "from-[#FFF8F7] via-[#FFF4F0] to-[#FFF1ED]",
    border: "border-[#FED7AA]",
    text: "text-[#F97316]",
    tag: "5 ngày liên tiếp",
  },
  {
    title: "Anti-cheat logic",
    desc: "Giới hạn coin mỗi ngày, yêu cầu focus session thật và không thưởng cho task hoàn thành quá nhanh.",
    icon: ShieldCheck,
    gradient: "from-[#10B981] to-[#34D399]",
    bg: "from-[#F8FFFC] via-[#F3FFFB] to-[#ECFDF5]",
    border: "border-[#D1FAE5]",
    text: "text-[#10B981]",
    tag: "Chống spam task",
  },
];

const rewardMilestones = [
  {
    coin: "500",
    reward: "Chrono Cards",
    desc: "Bộ thẻ gợi ý lập kế hoạch theo nhịp năng lượng.",
    icon: "🃏",
  },
  {
    coin: "1000",
    reward: "Chrono Planner",
    desc: "Sổ planner giúp duy trì thói quen ngoài đời thực.",
    icon: "📘",
  },
  {
    coin: "2000",
    reward: "Full Planner Kit",
    desc: "Bộ kit đầy đủ cho người dùng duy trì focus lâu dài.",
    icon: "🎁",
  },
];

export default function GamificationSection() {
  return (
    <section
      id="gamification"
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
        <div className="relative overflow-hidden rounded-[40px] border border-white bg-white/75 px-5 py-14 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[48px] md:px-10 md:py-20">
          <BackgroundGlow />

          <div className="relative z-10">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)]">
                <Sparkles className="h-3.5 w-3.5" />
                Gamification
              </div>

              <h2 className="mb-4 text-[clamp(2.2rem,4.4vw,3.55rem)] font-[900] leading-[1.04] tracking-[-0.04em] text-[#1A1528]">
                Tập trung thật,{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  nhận coin thật.
                </span>
              </h2>

              <p className="mx-auto max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                ChronoFlow không thưởng cho việc bấm “done” đơn thuần. Coin chỉ
                được tạo ra từ focus session có thời lượng hợp lý, giúp người dùng
                duy trì nhịp làm việc thật và có thể đổi lấy Planner Kit.
              </p>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.45, delay: index * 0.04 }}
                        className={`group relative overflow-hidden rounded-[28px] border ${item.border} bg-gradient-to-br ${item.bg} p-5 shadow-[0_16px_42px_rgba(26,21,40,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(111,89,255,0.09)]`}
                      >
                        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/70 blur-2xl" />

                        <div className="relative z-10">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div
                              className={`flex h-13 w-13 items-center justify-center rounded-[20px] bg-gradient-to-br ${item.gradient} text-white shadow-[0_14px_28px_rgba(26,21,40,0.12)]`}
                            >
                              <Icon className="h-5.5 w-5.5" />
                            </div>

                            <span
                              className={`rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[10px] font-[900] uppercase tracking-[0.12em] ${item.text}`}
                            >
                              {item.tag}
                            </span>
                          </div>

                          <h3 className="mb-2 text-[17px] font-[900] leading-tight text-[#1A1528]">
                            {item.title}
                          </h3>

                          <p className="text-[13.5px] font-semibold leading-relaxed text-[#5B566E]">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="rounded-[30px] border border-[#E9E5FF] bg-white/80 p-5 shadow-[0_18px_55px_rgba(26,21,40,0.045)] backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#F3F0FF] text-[#6F59FF]">
                      <LockKeyhole className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-[16px] font-[900] text-[#1A1528]">
                        Logic chống spam task
                      </h3>
                      <p className="text-[13px] font-semibold text-[#6B647C]">
                        Coin chỉ có giá trị khi được gắn với hành vi tập trung thật.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <AntiCheatCard title="Không thưởng task quá ngắn" desc="Task hoàn thành quá nhanh sẽ không sinh coin." />
                    <AntiCheatCard title="Có giới hạn coin/ngày" desc="Tránh việc tạo task hàng loạt để farm coin." />
                    <AntiCheatCard title="Dựa trên focus session" desc="Cần có start/end rõ ràng để ghi nhận tiến độ." />
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className="relative overflow-hidden rounded-[36px] border border-white bg-[linear-gradient(180deg,#F4EEFF_0%,#EEF6FF_100%)] p-4 shadow-[0_26px_75px_rgba(26,21,40,0.08)] md:p-6"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FFE3B3]/60 blur-[90px]" />
                <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#DCCEFF]/70 blur-[100px]" />

                <div className="relative z-10 rounded-[30px] border border-[#E9E5FF] bg-white p-5 shadow-[0_18px_55px_rgba(26,21,40,0.055)]">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-[900] uppercase tracking-[0.15em] text-[#8A84A3]">
                        Focus wallet
                      </p>
                      <h3 className="mt-1 text-[24px] font-[900] tracking-tight text-[#1A1528]">
                        Weekly streak: 5 ngày
                      </h3>
                      <p className="mt-1 text-[13px] font-semibold text-[#6B647C]">
                        Hoàn thành focus session đều đặn để tích coin.
                      </p>
                    </div>

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#FFF7ED] text-[#F59E0B] shadow-sm">
                      <Trophy className="h-7 w-7" />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-[11px] font-black text-white shadow-md">
                        5
                      </span>
                    </div>
                  </div>

                  <div className="mb-5 grid grid-cols-3 gap-3">
                    <StatCard label="Coin tuần" value="+145" icon={<CoinIcon size="sm" />} />
                    <StatCard label="Focus" value="8.2h" icon={<Timer className="h-4 w-4" />} />
                    <StatCard label="Badge" value="03" icon={<Trophy className="h-4 w-4" />} />
                  </div>

                  <div className="mb-5 rounded-[26px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                          Coin progress
                        </p>
                        <h4 className="mt-1 text-[17px] font-[900] text-[#1A1528]">
                          145 / 500 coin
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[12px] font-black text-[#F59E0B] shadow-sm">
                        <CoinIcon size="sm" />
                        355 coin nữa
                      </div>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#E9E5FF]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "29%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] via-[#4DA8FF] to-[#F59E0B]"

                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#8A84A3]">
                      <span>0</span>
                      <span>Đổi Chrono Cards ở 500 coin</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <MiniProgress
                      label="Deep work"
                      value="68%"
                      color="bg-[#6F59FF]"
                      width="w-[68%]"
                    />
                    <MiniProgress
                      label="Admin work"
                      value="21%"
                      color="bg-[#4DA8FF]"
                      width="w-[21%]"
                    />
                    <MiniProgress
                      label="Recovery"
                      value="11%"
                      color="bg-[#10B981]"
                      width="w-[11%]"
                    />
                  </div>
                </div>

                <div className="relative z-10 mt-4 grid gap-3">
                  {rewardMilestones.map((item, index) => (
                    <RewardRow
                      key={item.coin}
                      index={index}
                      coin={item.coin}
                      reward={item.reward}
                      desc={item.desc}
                      icon={item.icon}
                    />
                  ))}
                </div>

                <div className="relative z-10 mt-4 rounded-[28px] border border-[#E9E5FF] bg-white/90 p-5 shadow-[0_18px_55px_rgba(26,21,40,0.045)]">
                  <div className="mb-3 flex items-center gap-2 text-[12px] font-[900] uppercase tracking-[0.14em] text-[#6F59FF]">
                    <Gift className="h-4 w-4" />
                    Vì sao section này quan trọng?
                  </div>

                  <p className="text-[13.5px] font-semibold leading-relaxed text-[#5B566E]">
                    Gamification giúp ChronoFlow khác với todo app thông thường:
                    người dùng không chỉ lập kế hoạch, mà còn có động lực duy trì
                    focus session và tích coin để đổi phần thưởng vật lý.
                  </p>

                  <button className="group mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#1A1528] px-4 py-3 text-[12.5px] font-bold text-white shadow-xl transition hover:-translate-y-0.5">
                    Xem Planner Kit
                    <ArrowRight className="h-4 w-4 text-[#FBBF24] transition group-hover:translate-x-1" />
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
      <div className="absolute left-[6%] top-[8%] h-[320px] w-[320px] rounded-full bg-[#DCCEFF]/70 blur-[100px]" />
      <div className="absolute right-[4%] bottom-[8%] h-[300px] w-[300px] rounded-full bg-[#FFE3B3]/55 blur-[90px]" />
      <div className="absolute bottom-[-18%] left-[35%] h-[460px] w-[460px] rounded-full bg-white/65 blur-[100px]" />
    </div>
  );
}

function CoinIcon({ size = "md" }: { size?: "sm" | "md" }) {
  const dimension = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className={`inline-flex ${dimension} items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-[10px] font-black text-white shadow-[0_6px_14px_rgba(245,158,11,0.28)]`}
    >
      ₵
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-[#EEF0F6] bg-[#F8F9FE] p-3 text-center">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#6F59FF] shadow-sm">
        {icon}
      </div>

      <div className="text-[17px] font-[900] text-[#1A1528]">{value}</div>

      <div className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#8A84A3]">
        {label}
      </div>
    </div>
  );
}

function MiniProgress({
  label,
  value,
  color,
  width,
}: {
  label: string;
  value: string;
  color: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold text-[#5B566E]">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[#EEF0F6]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: width.replace("w-[", "").replace("]", "") }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className={`h-2.5 rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function AntiCheatCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[20px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#10B981] shadow-sm">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <h4 className="mb-1 text-[13px] font-[900] leading-tight text-[#1A1528]">
        {title}
      </h4>

      <p className="text-[12px] font-semibold leading-relaxed text-[#6B647C]">
        {desc}
      </p>
    </div>
  );
}

function RewardRow({
  index,
  coin,
  reward,
  desc,
  icon,
}: {
  index: number;
  coin: string;
  reward: string;
  desc: string;
  icon: string;
}) {
  const locked = index > 0;

  return (
    <div
      className={`flex items-center gap-4 rounded-[24px] border bg-white/85 p-4 shadow-[0_14px_36px_rgba(26,21,40,0.04)] ${
        locked ? "border-[#EEF0F6] opacity-80" : "border-[#FFE6C7]"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#FFF7ED] text-[24px]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[11px] font-black text-[#F59E0B]">
            <CoinIcon size="sm" />
            {coin} coin
          </div>

          {locked && (
            <div className="rounded-full bg-[#F8F9FE] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8A84A3]">
              Locked
            </div>
          )}
        </div>

        <h4 className="truncate text-[14px] font-[900] text-[#1A1528]">
          {reward}
        </h4>

        <p className="mt-0.5 line-clamp-2 text-[12px] font-semibold leading-relaxed text-[#6B647C]">
          {desc}
        </p>
      </div>
    </div>
  );
}