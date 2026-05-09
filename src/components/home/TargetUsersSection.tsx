"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Presentation,
  Route,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

type TargetUser = {
  title: string;
  subtitle: string;
  desc: string;
  bestFor: string;
  tags: string[];
  icon: LucideIcon;
  emoji: string;
  gradient: string;
  bg: string;
  accentText: string;
  border: string;
};

const users: TargetUser[] = [
  {
    title: "Học sinh, sinh viên",
    subtitle: "Quản lý hạn nộp và phiên học sâu",
    desc: "Phù hợp với người cần sắp xếp lịch học, ôn tập, bài tập nhóm và hạn nộp mà không dồn việc khó vào lúc đã mệt.",
    bestFor: "Khi bạn có nhiều môn, nhiều hạn nộp và cần biết lúc nào nên học sâu.",
    tags: ["Hạn nộp", "Ôn tập", "Học sâu"],
    icon: GraduationCap,
    emoji: "🎓",
    gradient: "from-[#6F59FF] to-[#8B5CF6]",
    bg: "from-[#FBF9FF] via-[#F7F4FF] to-[#F3EEFF]",
    accentText: "text-[#6F59FF]",
    border: "border-[#E9E5FF]",
  },
  {
    title: "Người đi làm",
    subtitle: "Cân bằng deep work, họp và việc nhẹ",
    desc: "Dành cho người có nhiều việc trong ngày, dễ bị gián đoạn bởi họp, email, tin nhắn và các đầu việc nhẹ.",
    bestFor: "Khi bạn muốn bảo vệ thời gian tập trung và không để việc quan trọng trôi về cuối ngày.",
    tags: ["Deep work", "Họp", "Email", "Việc nhẹ"],
    icon: Briefcase,
    emoji: "💼",
    gradient: "from-[#4DA8FF] to-[#38BDF8]",
    bg: "from-[#F8FCFF] via-[#F4F9FF] to-[#EEF6FF]",
    accentText: "text-[#4DA8FF]",
    border: "border-[#DDEEFF]",
  },
  {
    title: "Giáo dục, mentoring và team",
    subtitle: "Hiểu nhịp học/làm của từng người",
    desc: "Phù hợp với người hỗ trợ học tập, mentoring hoặc làm việc nhóm cần hiểu nhịp năng lượng để phân bổ việc và phản hồi tốt hơn.",
    bestFor: "Khi bạn muốn hỗ trợ từng người theo nhịp học/làm thực tế, thay vì chỉ nhìn deadline.",
    tags: ["Mentoring", "Hỗ trợ học tập", "Làm việc nhóm"],
    icon: Presentation,
    emoji: "👩‍🏫",
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    bg: "from-[#FFFDF7] via-[#FFF8ED] to-[#FFF4E5]",
    accentText: "text-[#F59E0B]",
    border: "border-[#FFE6C7]",
  },
  {
    title: "Người muốn tối ưu lịch trình cá nhân",
    subtitle: "Tự quản thời gian theo năng lượng",
    desc: "Dành cho freelancer, người sáng tạo, người tự học hoặc bất kỳ ai muốn xây dựng thói quen bền hơn theo nhịp cá nhân.",
    bestFor: "Khi bạn có nhiều vai trò trong ngày và muốn biến mục tiêu thành lịch thực tế hơn.",
    tags: ["Phát triển bản thân", "Sáng tạo", "Thói quen"],
    icon: Route,
    emoji: "🧭",
    gradient: "from-[#10B981] to-[#34D399]",
    bg: "from-[#F8FFFC] via-[#F4FFFB] to-[#ECFDF5]",
    accentText: "text-[#10B981]",
    border: "border-[#D1FAE5]",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

export default function TargetUsersSection() {
  return (
    <section
      id="target-users"
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
                <Target className="h-3.5 w-3.5" />
                Nhóm người dùng
              </div>

              <h2 className="mb-5 text-[clamp(2.25rem,4.6vw,3.65rem)] font-[900] leading-[1.04] tracking-[-0.04em] text-[#1A1528]">
                4 nhóm {" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  người dùng mục tiêu
                </span>
            
              </h2>

              <p className="mx-auto max-w-[720px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                ChronoFlow phù hợp với người có nhiều đầu việc trong ngày, cần tập
                trung đúng lúc và muốn biến lịch trình thành một hệ thống dễ duy trì hơn.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid gap-5 lg:grid-cols-2"
            >
              {users.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    className={`group relative overflow-hidden rounded-[34px] border ${item.border} bg-gradient-to-br ${item.bg} p-5 shadow-[0_20px_55px_rgba(26,21,40,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(26,21,40,0.1)] md:p-6`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute right-[-80px] top-[-80px] h-[220px] w-[220px] rounded-full bg-white/80 blur-[60px]" />
                      <div className="absolute bottom-[-90px] left-[-90px] h-[240px] w-[240px] rounded-full bg-white/70 blur-[70px]" />
                    </div>

                    <div className="relative z-10 grid gap-6 md:grid-cols-[170px_1fr] md:items-center">
                      <div className="relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-sm">
                        <div
                          className={`absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-gradient-to-br ${item.gradient} opacity-15 blur-[35px]`}
                        />

                        <div className="relative z-10">
                          <div
                            className={`mb-3 inline-flex rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-[900] uppercase tracking-[0.13em] ${item.accentText}`}
                          >
                            {item.subtitle}
                          </div>
                        </div>

                        <motion.div
                          animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="relative z-10 mx-auto flex h-[122px] w-[122px] items-center justify-center rounded-[38px] border border-white bg-white shadow-[0_18px_38px_rgba(26,21,40,0.08)]"
                        >
                          <span className="text-[62px] leading-none">
                            {item.emoji}
                          </span>
                        </motion.div>

                        <div className="relative z-10 mt-4 flex items-center gap-3 rounded-[22px] border border-white/70 bg-white/75 p-3.5">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-[16px] bg-gradient-to-br ${item.gradient} text-white shadow-md`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <div className={`text-[13px] font-[900] ${item.accentText}`}>
                              Lập lịch
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A84A3]">
                              theo năng lượng
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-[26px] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                          {item.title}
                        </h3>

                        <p className="mb-5 text-[14px] font-semibold leading-relaxed text-[#5B566E]">
                          {item.desc}
                        </p>

                        <div className="mb-5 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[11px] font-[800] text-[#6B647C]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="rounded-[24px] border border-white/80 bg-white/70 p-4 shadow-sm">
                          <div className="mb-2 flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white`}
                            >
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="text-[11px] font-[900] uppercase tracking-[0.14em] text-[#8A84A3]">
                              Phù hợp khi
                            </span>
                          </div>

                          <p className="text-[13px] font-semibold leading-relaxed text-[#5B566E]">
                            {item.bestFor}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-[32px] border border-[#E9E5FF] bg-white px-6 py-5 shadow-[0_18px_55px_rgba(26,21,40,0.05)] md:px-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="mb-1 text-[12px] font-[900] uppercase tracking-[0.16em] text-[#6F59FF]">
                      Phù hợp nhất với công việc cần tập trung và tự quản
                    </div>
                    <p className="max-w-[760px] text-[15px] font-semibold leading-relaxed text-[#5B566E]">
                      ChronoFlow không phải app tick task đơn thuần. Sản phẩm phù hợp
                      nhất khi người dùng cần học sâu, làm việc tri thức, sáng tạo,
                      giảng dạy hoặc tối ưu lịch trình cá nhân.
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-[#1A1528] px-5 py-3 text-[13px] font-bold text-white shadow-xl">
                  <Target className="h-4 w-4 text-[#4DA8FF]" />
                  Lập lịch theo năng lượng
                </div>
              </div>
            </motion.div>
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
      <div className="absolute right-[-10%] top-[18%] h-[420px] w-[420px] animate-[pulse_8s_infinite] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-white/70 blur-[100px]" />
    </div>
  );
}
