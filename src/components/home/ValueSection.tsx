"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import {
  ArrowRight,
  CalendarDays,
  Sparkles,
  Activity,
  Zap,
  Bed,
  BarChart3,
  DatabaseIcon,
  FileCheck2,
  Users,
  CheckCircle2,
  ListChecks,
  CalendarClock,
  Repeat2,
} from "lucide-react";

type ChronotypeKey = "Bear" | "Lion" | "Wolf" | "Dolphin";

type UserData = {
  name?: string;
  chronotype?: ChronotypeKey;
  focusWindow?: string;
  recoveryWindow?: string;
};

type ValueSectionProps = {
  isLoggedIn?: boolean;
  userData?: UserData;
};

type TimelineItem = {
  time: string;
  task: string;
  tag: string;
  tagClass: string;
  left: string;
  width: string;
  gradient: string;
};

type ChronotypeMeta = {
  label: string;
  stickerUrl: string;
  subtitle: string;
  description: string;
  accentText: string;
  accentBg: string;
  softBg: string;
  insight: string;
  dashboardSummary: string;
  bestFor: string[];
  timeline: TimelineItem[];
};

const CHRONOTYPE_META: Record<ChronotypeKey, ChronotypeMeta> = {
  Bear: {
    label: "Gấu",
    stickerUrl: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f43b/512.gif",
    subtitle: "Ổn định sáng, giảm nhẹ chiều",
    description:
      "Phù hợp với nhịp học và làm việc phổ biến. Buổi sáng là giai đoạn ổn định nhất để xử lý việc cần chiều sâu, sau đó chuyển dần sang việc nhẹ hơn.",
    accentText: "text-[#6F59FF]",
    accentBg: "from-[#7C5CFA] to-[#4DA8FF]",
    softBg: "bg-gradient-to-br from-[#F8F5FF] to-[#FFFFFF] border-[#E9E5FF]",
    insight:
      "Buổi sáng là giai đoạn ổn định nhất để xử lý việc cần chiều sâu. Sau 14:00 nên chuyển dần sang việc nhẹ.",
    dashboardSummary:
      "Nhịp Gấu thường hợp với lịch truyền thống: học sâu buổi sáng, họp hoặc xử lý việc phối hợp vào cuối buổi sáng, và dành đầu giờ chiều cho việc nhẹ hoặc review.",
    bestFor: ["Học sâu buổi sáng", "Viết báo cáo", "Lịch ổn định"],
    timeline: [
      {
        time: "08:00",
        task: "Viết báo cáo",
        tag: "Tập trung cao",
        tagClass:
          "bg-[#F1EAFE] text-[#6F59FF] ring-1 ring-[#6F59FF]/20",
        left: "2%",
        width: "21%",
        gradient: "linear-gradient(135deg,#4F8DF7,#3B82F6)",
      },
      {
        time: "09:30",
        task: "Học sâu",
        tag: "Deep work",
        tagClass:
          "bg-[#E9F5FF] text-[#2893DB] ring-1 ring-[#2893DB]/20",
        left: "25%",
        width: "11%",
        gradient: "linear-gradient(135deg,#18A6D5,#4DA8FF)",
      },
      {
        time: "11:00",
        task: "Họp nhóm",
        tag: "Giao tiếp",
        tagClass:
          "bg-[#FFF1E8] text-[#F28C52] ring-1 ring-[#F28C52]/20",
        left: "38%",
        width: "19%",
        gradient: "linear-gradient(135deg,#16A3D8,#22C1EE)",
      },
      {
        time: "13:00",
        task: "Email / việc nhẹ",
        tag: "Nhẹ",
        tagClass:
          "bg-[#EEF5FF] text-[#5F78B8] ring-1 ring-[#5F78B8]/20",
        left: "59%",
        width: "14%",
        gradient: "linear-gradient(135deg,#9D7AE0,#B08AEF)",
      },
      {
        time: "14:00",
        task: "Nghỉ ngắn",
        tag: "Hồi phục",
        tagClass:
          "bg-[#EAFBF7] text-[#2CA58D] ring-1 ring-[#2CA58D]/20",
        left: "75%",
        width: "10%",
        gradient: "linear-gradient(135deg,#7AD8B4,#44C89A)",
      },
    ],
  },
  Lion: {
    label: "Sư tử",
    stickerUrl: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f981/512.gif",
    subtitle: "Mạnh đầu ngày, giảm sau trưa",
    description:
      "Dậy sớm, tỉnh táo nhanh và đạt đỉnh hiệu suất trước buổi trưa. Việc quan trọng nên dồn lên đầu ngày để tận dụng cửa sổ tập trung mạnh nhất.",
    accentText: "text-[#F59E0B]",
    accentBg: "from-[#F59E0B] to-[#FBBF24]",
    softBg: "bg-gradient-to-br from-[#FFF9F0] to-[#FFFFFF] border-[#FFECD4]",
    insight:
      "Việc quan trọng nên được dồn lên trước trưa. Khi năng lượng giảm, hãy chuyển sang review nhẹ hoặc việc ít áp lực hơn.",
    dashboardSummary:
      "Nhịp Sư tử phù hợp với chiến lược xử lý việc khó sớm, ra quyết định trước trưa và dành đầu giờ chiều để hồi phục hoặc làm việc nhẹ.",
    bestFor: ["Deep work sáng sớm", "Ra quyết định", "Lập kế hoạch đầu ngày"],
    timeline: [
      {
        time: "06:30",
        task: "Deep work",
        tag: "Đỉnh sáng",
        tagClass:
          "bg-[#FFF6E8] text-[#D97706] ring-1 ring-[#D97706]/20",
        left: "2%",
        width: "24%",
        gradient: "linear-gradient(135deg,#F59E0B,#FBBF24)",
      },
      {
        time: "08:30",
        task: "Phân tích",
        tag: "Quan trọng",
        tagClass:
          "bg-[#F1EAFE] text-[#6F59FF] ring-1 ring-[#6F59FF]/20",
        left: "28%",
        width: "16%",
        gradient: "linear-gradient(135deg,#4F8DF7,#3B82F6)",
      },
      {
        time: "10:30",
        task: "Review",
        tag: "Ra quyết định",
        tagClass:
          "bg-[#E9F5FF] text-[#2893DB] ring-1 ring-[#2893DB]/20",
        left: "46%",
        width: "16%",
        gradient: "linear-gradient(135deg,#16A3D8,#22C1EE)",
      },
      {
        time: "13:00",
        task: "Nghỉ ngắn",
        tag: "Hồi phục",
        tagClass:
          "bg-[#EAFBF7] text-[#2CA58D] ring-1 ring-[#2CA58D]/20",
        left: "66%",
        width: "10%",
        gradient: "linear-gradient(135deg,#7AD8B4,#44C89A)",
      },
    ],
  },
  Wolf: {
    label: "Sói",
    stickerUrl: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f43a/512.gif",
    subtitle: "Khởi động chậm, tăng về tối",
    description:
      "Buổi sáng vào guồng chậm hơn nhưng càng về chiều càng tỉnh táo. Khung tốt nhất cho sáng tạo và phân tích sâu nằm ở nửa sau của ngày.",
    accentText: "text-[#5B8CFF]",
    accentBg: "from-[#6F59FF] to-[#45B7FF]",
    softBg: "bg-gradient-to-br from-[#F4F9FF] to-[#FFFFFF] border-[#DDEBFF]",
    insight:
      "Buổi sáng chỉ nên khởi động nhẹ. Khung tốt nhất cho sáng tạo và phân tích sâu nằm ở nửa sau ngày.",
    dashboardSummary:
      "Nhịp Sói không nên ép deep work quá sớm. Lịch phù hợp hơn là khởi động nhẹ buổi sáng, giữ việc sáng tạo và phân tích sâu cho cuối chiều hoặc đầu tối.",
    bestFor: ["Sáng tạo cuối chiều", "Phân tích sâu buổi tối", "Khởi động nhẹ buổi sáng"],
    timeline: [
      {
        time: "10:00",
        task: "Email / việc nhẹ",
        tag: "Nhẹ",
        tagClass:
          "bg-[#EEF5FF] text-[#5F78B8] ring-1 ring-[#5F78B8]/20",
        left: "10%",
        width: "14%",
        gradient: "linear-gradient(135deg,#9D7AE0,#B08AEF)",
      },
      {
        time: "13:30",
        task: "Họp nhóm",
        tag: "Ổn định",
        tagClass:
          "bg-[#E9F5FF] text-[#2893DB] ring-1 ring-[#2893DB]/20",
        left: "28%",
        width: "14%",
        gradient: "linear-gradient(135deg,#16A3D8,#22C1EE)",
      },
      {
        time: "15:30",
        task: "Sáng tạo",
        tag: "Đỉnh chiều",
        tagClass:
          "bg-[#F1EAFE] text-[#6F59FF] ring-1 ring-[#6F59FF]/20",
        left: "46%",
        width: "22%",
        gradient: "linear-gradient(135deg,#4F8DF7,#3B82F6)",
      },
      {
        time: "18:00",
        task: "Phân tích sâu",
        tag: "Tập trung cao",
        tagClass:
          "bg-[#EAFBF7] text-[#2CA58D] ring-1 ring-[#2CA58D]/20",
        left: "72%",
        width: "16%",
        gradient: "linear-gradient(135deg,#7AD8B4,#44C89A)",
      },
    ],
  },
  Dolphin: {
    label: "Cá heo",
    stickerUrl: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f42c/512.gif",
    subtitle: "Dao động, hợp khung linh hoạt",
    description:
      "Năng lượng biến động hơn và phù hợp với các khối tập trung ngắn 60–90 phút. Reset giữa ngày đúng lúc sẽ giúp giữ chất lượng làm việc tốt hơn.",
    accentText: "text-[#0EA5B7]",
    accentBg: "from-[#4DA8FF] to-[#9B5CF6]",
    softBg: "bg-gradient-to-br from-[#F2FAF8] to-[#FFFFFF] border-[#D8F2EC]",
    insight:
      "Bạn phù hợp với các khối ngắn 60–90 phút. Reset giữa ngày đúng lúc sẽ giúp giữ chất lượng tập trung tốt hơn.",
    dashboardSummary:
      "Nhịp Cá heo cần lịch linh hoạt hơn: chia nhỏ khối tập trung, xen kẽ recovery và tránh dồn quá nhiều việc nặng liên tiếp.",
    bestFor: ["Khối tập trung ngắn", "Lịch linh hoạt", "Reset đúng lúc"],
    timeline: [
      {
        time: "10:30",
        task: "Khối tập trung 1",
        tag: "Tập trung",
        tagClass:
          "bg-[#F1EAFE] text-[#6F59FF] ring-1 ring-[#6F59FF]/20",
        left: "16%",
        width: "16%",
        gradient: "linear-gradient(135deg,#4F8DF7,#3B82F6)",
      },
      {
        time: "12:00",
        task: "Viết báo cáo",
        tag: "Ổn định",
        tagClass:
          "bg-[#E9F5FF] text-[#2893DB] ring-1 ring-[#2893DB]/20",
        left: "35%",
        width: "15%",
        gradient: "linear-gradient(135deg,#16A3D8,#22C1EE)",
      },
      {
        time: "14:00",
        task: "Email / việc nhẹ",
        tag: "Nhẹ",
        tagClass:
          "bg-[#FFF1E8] text-[#F28C52] ring-1 ring-[#F28C52]/20",
        left: "54%",
        width: "13%",
        gradient: "linear-gradient(135deg,#9D7AE0,#B08AEF)",
      },
      {
        time: "16:00",
        task: "Khối tập trung 2",
        tag: "Tập trung",
        tagClass:
          "bg-[#EAFBF7] text-[#2CA58D] ring-1 ring-[#2CA58D]/20",
        left: "70%",
        width: "15%",
        gradient: "linear-gradient(135deg,#7AD8B4,#44C89A)",
      },
    ],
  },
};

const DIFFERENCE_ITEMS = [
  {
    title: "To-do app",
    text: "Cho bạn biết hôm nay cần làm gì.",
    icon: ListChecks,
    tone: "bg-white text-[#6B647C] ring-black/5",
  },
  {
    title: "Calendar",
    text: "Cho bạn biết việc đó nằm lúc mấy giờ.",
    icon: CalendarClock,
    tone: "bg-white text-[#6B647C] ring-black/5",
  },
  {
    title: "Habit tracker",
    text: "Nhắc bạn duy trì thói quen.",
    icon: Repeat2,
    tone: "bg-white text-[#6B647C] ring-black/5",
  },
  {
    title: "ChronoFlow",
    text: "Gợi ý khi nào năng lượng của bạn phù hợp nhất để học sâu, làm việc nhẹ hoặc hồi phục.",
    icon: Sparkles,
    tone: "bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white ring-white/40",
  },
];

export default function ValueSection({
  isLoggedIn = false,
  userData,
}: ValueSectionProps) {
  const activeChronotype: ChronotypeKey = userData?.chronotype ?? "Bear";
  const meta = useMemo(
    () => CHRONOTYPE_META[activeChronotype],
    [activeChronotype],
  );

  const focusWindow = userData?.focusWindow ?? "08:00 – 11:30";
  const recoveryWindow = userData?.recoveryWindow ?? "14:00 – 15:00";

  return (
    <section
      id="value"
      className="relative overflow-hidden bg-[#F4F2FA] pb-10 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20"
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-white bg-white px-6 py-20 shadow-[0_20px_80px_rgba(26,21,40,0.06)] md:px-12 md:py-28">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -left-[10%] top-[10%] h-[600px] w-[600px] animate-[pulse_6s_infinite] rounded-full bg-gradient-to-tr from-[#E9F5FF] to-[#F3F0FF] opacity-90 blur-[120px]" />
            <div className="absolute -right-[10%] bottom-[10%] h-[700px] w-[700px] animate-[pulse_8s_infinite] rounded-full bg-gradient-to-bl from-[#FFF1E8] to-[#F3F0FF] opacity-80 blur-[140px]" />
          </div>

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <div className="mb-5 inline-flex animate-[fadeUp_0.5s_ease-out] items-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                {isLoggedIn ? "Bảng điều khiển của bạn" : "Xem trước Dashboard"}
              </div>

              <h2 className="mx-auto max-w-[800px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                Tổng quan {" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  ChronoFlow
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-[720px] animate-[fadeUp_0.7s_ease-out] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                {isLoggedIn
                  ? `ChronoFlow tổng hợp hồ sơ nhịp sinh học của ${
                      userData?.name ?? "bạn"
                    }, chronotype ${meta.label}, cửa sổ tập trung, khung hồi phục và các gợi ý hành động rõ ràng để bạn làm việc hiệu quả hơn.`
                  : "Xem nhanh cách ChronoFlow biến nhịp năng lượng thành lịch làm việc. Không chỉ ghi việc cần làm, ChronoFlow gợi ý thời điểm phù hợp để học sâu, xử lý việc nhẹ hoặc hồi phục."}
              </p>
            </div>

            {!isLoggedIn && <DifferenceStrip />}

            {!isLoggedIn && (
              <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(CHRONOTYPE_META) as ChronotypeKey[]).map((key) => {
                  const data = CHRONOTYPE_META[key];

                  return (
                    <div
                      key={key}
                      className={`group relative rounded-[36px] border-2 border-white p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(111,89,255,0.15)] ${data.softBg}`}
                    >
                      <div className="mb-6 flex items-start justify-between">
                        <div>
                          <div className="mb-1 text-[11px] font-[900] uppercase tracking-widest text-[#94A3B8]">
                            Nhóm nhịp
                          </div>
                          <div className="text-[26px] font-[900] leading-none text-[#0F172A]">
                            {data.label}
                          </div>
                        </div>

                        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={data.stickerUrl}
                            alt={data.label}
                            className="h-12 w-12 drop-shadow-md"
                          />
                        </div>
                      </div>

                      <div className="mb-5 inline-block rounded-xl bg-white/90 px-3.5 py-1.5 text-[11px] font-[900] text-[#1A1528] shadow-sm ring-1 ring-black/5">
                        <span className="mr-1">🎯</span>
                        {data.bestFor[0]}
                      </div>

                      <p className="mb-6 border-b border-black/5 pb-6 text-[14px] font-medium leading-relaxed text-[#475569]">
                        {data.description}
                      </p>

                      <div className="space-y-4">
                        {data.timeline.slice(0, 2).map((item) => (
                          <div
                            key={`${item.time}-${item.task}`}
                            className="group/item flex items-center gap-4"
                          >
                            <div className="w-11 text-[13px] font-[900] text-[#94A3B8] transition-colors group-hover/item:text-[#6F59FF]">
                              {item.time}
                            </div>
                            <div
                              className="h-5 w-1.5 rounded-full shadow-inner"
                              style={{ background: item.gradient }}
                            />
                            <div className="text-[13px] font-bold text-[#1E293B]">
                              {item.task}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="relative animate-[fadeUp_0.9s_ease-out] overflow-visible rounded-[48px] border-2 border-white bg-white/70 p-6 shadow-[0_40px_100px_rgba(17,12,34,0.08)] backdrop-blur-3xl md:p-10">
              <div className="mb-10 flex flex-col gap-6 border-b border-gray-200/60 pb-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-[760px]">
                  <div className="mb-3 flex w-fit items-center gap-2 rounded-full bg-[#F3F0FF] px-4 py-1.5 text-[12px] font-[900] uppercase tracking-widest text-[#6F59FF] shadow-inner ring-1 ring-[#6F59FF]/20">
                    <Activity className="h-4 w-4" />
                    Không gian làm việc
                  </div>
                  <h2 className="text-[36px] font-[900] leading-tight text-[#0F172A]">
                    Dashboard{" "}
                    <span className="bg-gradient-to-r from-[#6F59FF] to-[#0EA5E9] bg-clip-text text-transparent drop-shadow-sm">
                      cá nhân hoá
                    </span>
                  </h2>
                  <p className="mt-3 max-w-[680px] text-[15px] font-medium leading-relaxed text-[#64748B]">
                    {meta.dashboardSummary}
                  </p>
                </div>

                {!isLoggedIn && (
                  <Link
                    href="/assessment"
                    className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#1E293B] px-8 text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] ring-2 ring-transparent transition-all hover:scale-105 hover:bg-black hover:ring-white/50"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    Tạo Dashboard của tôi
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-8">
                  <div className="rounded-[36px] border border-white bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="flex items-center gap-2 text-[20px] font-[900] text-[#0F172A]">
                          <CalendarDays className="h-5 w-5 text-[#6F59FF]" />
                          Lịch làm việc hôm nay
                        </h3>
                        <p className="mt-1.5 text-[14px] font-medium text-[#64748B]">
                          Được thiết kế khớp với nhịp của{" "}
                          <span className="font-bold text-[#6F59FF]">
                            {meta.label}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-[#F8FAFC] px-4 py-2 text-[12px] font-[900] text-[#1E293B] shadow-sm ring-1 ring-black/5">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        Hôm nay
                      </div>
                    </div>

                    <div className="mb-8 rounded-[28px] bg-[#F8FAFC] p-6 shadow-inner ring-1 ring-inset ring-black/5">
                      <div className="relative h-[120px] overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-black/5">
                        <div className="absolute inset-x-4 top-1/3 h-[1px] border-b border-dashed border-gray-200" />
                        <div className="absolute inset-x-4 top-2/3 h-[1px] border-b border-dashed border-gray-200" />

                        {meta.timeline.map((item, index) => (
                          <div
                            key={`${item.time}-${item.task}-bar`}
                            className="absolute top-1/2 flex h-12 -translate-y-1/2 cursor-pointer items-center rounded-[14px] px-4 text-white shadow-[0_8px_16px_rgba(0,0,0,0.12)] ring-1 ring-white/30 transition-all duration-300 hover:scale-[1.03] animate-[slideIn_0.7s_ease-out]"
                            style={{
                              left: item.left,
                              width: item.width,
                              background: item.gradient,
                              animationDelay: `${index * 100}ms`,
                              animationFillMode: "both",
                            }}
                          >
                            <span className="truncate whitespace-nowrap text-[13px] font-[900] tracking-wide">
                              {item.task}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex justify-between px-3 text-[12px] font-[900] text-[#94A3B8]">
                        <span>08:00</span>
                        <span>12:00</span>
                        <span>16:00</span>
                        <span>20:00</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {meta.timeline.slice(0, 4).map((item) => (
                        <div
                          key={`${item.time}-${item.task}-row`}
                          className="group/task flex items-center justify-between rounded-[24px] bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 transition-all hover:bg-[#F8FAFC] hover:shadow-md"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 text-[15px] font-[900] text-[#94A3B8] transition-colors group-hover/task:text-[#6F59FF]">
                              {item.time}
                            </div>
                            <div className="h-6 w-[3px] rounded-full bg-gray-200 transition-colors group-hover/task:bg-[#6F59FF]" />
                            <div className="text-[16px] font-[900] text-[#0F172A]">
                              {item.task}
                            </div>
                          </div>
                          <div
                            className={`rounded-xl px-4 py-2 text-[12px] font-bold shadow-sm ${item.tagClass}`}
                          >
                            {item.tag}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-8">
                  <div className="rounded-[36px] border border-white bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-[20px] font-[900] text-[#0F172A]">
                          Đường năng lượng
                        </h3>
                        <p className="mt-1.5 text-[14px] font-medium text-[#64748B]">
                          Góc nhìn nhịp sinh học tuần
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFC] shadow-sm ring-1 ring-black/5">
                        <BarChart3 className="h-6 w-6 text-[#6F59FF]" />
                      </div>
                    </div>

                    <div className="relative rounded-[28px] border border-gray-50 bg-white p-6 shadow-inner ring-1 ring-black/5">
                      <div className="absolute bottom-8 top-8 inset-x-6 flex flex-col justify-between">
                        <div className="w-full border-b border-dashed border-gray-200" />
                        <div className="w-full border-b border-dashed border-gray-200" />
                      </div>
                      <svg
                        viewBox="0 0 640 220"
                        className="relative z-10 h-[170px] w-full"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="valueLineLight"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#6F59FF" />
                            <stop offset="50%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#38BDF8" />
                          </linearGradient>
                          <linearGradient
                            id="valueAreaLight"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#6F59FF" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M24 168 C88 164, 136 74, 228 66 C310 60, 354 136, 432 142 C514 148, 574 94, 616 108 L616 188 L24 188 Z"
                          fill="url(#valueAreaLight)"
                        />
                        <path
                          d="M24 168 C88 164, 136 74, 228 66 C310 60, 354 136, 432 142 C514 148, 574 94, 616 108"
                          stroke="url(#valueLineLight)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="animate-[drawLine_2s_ease-out_forwards] drop-shadow-[0_12px_16px_rgba(111,89,255,0.4)]"
                          strokeDasharray="1200"
                          strokeDashoffset="1200"
                        />
                        <circle
                          cx="228"
                          cy="66"
                          r="8"
                          fill="#fff"
                          stroke="#6F59FF"
                          strokeWidth="4"
                          className="animate-[pulseDot_2s_ease-in-out_infinite] drop-shadow-md"
                        />
                        <circle
                          cx="432"
                          cy="142"
                          r="8"
                          fill="#fff"
                          stroke="#38BDF8"
                          strokeWidth="4"
                          className="animate-[pulseDot_2s_ease-in-out_infinite] drop-shadow-md"
                          style={{ animationDelay: "0.5s" }}
                        />
                      </svg>
                      <div className="mt-4 flex justify-between px-2 text-[12px] font-[900] text-[#94A3B8]">
                        <span>T2</span>
                        <span>T3</span>
                        <span>T4</span>
                        <span>T5</span>
                        <span>T6</span>
                        <span>T7</span>
                        <span>CN</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="group rounded-[32px] border border-white bg-white p-6 shadow-md ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:shadow-xl">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#6F59FF] shadow-sm transition-transform group-hover:scale-110">
                        <Zap className="h-6 w-6" />
                      </div>
                      <div className="mb-1 text-[12px] font-[900] uppercase tracking-wider text-[#94A3B8]">
                        Giờ tập trung
                      </div>
                      <div className="text-[18px] font-[900] text-[#0F172A]">
                        {focusWindow}
                      </div>
                    </div>
                    <div className="group rounded-[32px] border border-white bg-white p-6 shadow-md ring-1 ring-black/5 transition-transform hover:-translate-y-1 hover:shadow-xl">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF6FF] text-[#0EA5E9] shadow-sm transition-transform group-hover:scale-110">
                        <Bed className="h-6 w-6" />
                      </div>
                      <div className="mb-1 text-[12px] font-[900] uppercase tracking-wider text-[#94A3B8]">
                        Giờ hồi phục
                      </div>
                      <div className="text-[18px] font-[900] text-[#0F172A]">
                        {recoveryWindow}
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-5 overflow-visible rounded-[32px] bg-gradient-to-r from-[#FFFBF4] to-white p-7 shadow-md ring-1 ring-[#FDE68A] transition-transform hover:-translate-y-1">
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#FDE68A]/30 blur-3xl" />
                    <div className="relative z-10 flex h-14 w-14 shrink-0 animate-[bounce_3s_infinite] items-center justify-center rounded-2xl bg-white text-[28px] shadow-[0_8px_20px_rgba(245,158,11,0.15)] ring-1 ring-orange-100">
                      💡
                    </div>
                    <div className="relative z-10">
                      <h4 className="mb-2 flex items-center gap-2 text-[16px] font-[900] text-[#1E293B]">
                        Gợi ý từ AI
                        <Sparkles className="h-4 w-4 text-orange-400" />
                      </h4>
                      <p className="text-[14.5px] font-medium leading-relaxed text-[#475569]">
                        {meta.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <BentoCard
                delay="0ms"
                icon={<DatabaseIcon className="h-7 w-7 text-[#6F59FF]" />}
                iconBg="bg-[#F3F0FF] ring-1 ring-[#6F59FF]/20"
                title="Đồng bộ mọi thiết bị"
                desc="Hồ sơ và lịch làm việc của bạn được lưu trữ an toàn, truy cập mượt mà từ bất kỳ đâu."
              />
              <BentoCard
                delay="100ms"
                icon={<FileCheck2 className="h-7 w-7 text-[#0EA5E9]" />}
                iconBg="bg-[#F0F9FF] ring-1 ring-[#0EA5E9]/20"
                title="Biến insight thành hành động"
                desc="Không dừng ở bài test, ChronoFlow chuyển kết quả thành lịch và khung giờ có thể áp dụng ngay."
              />
              <BentoCard
                delay="200ms"
                icon={<Users className="h-7 w-7 text-[#F59E0B]" />}
                iconBg="bg-[#FFFBEB] ring-1 ring-[#F59E0B]/20"
                title="Làm việc nhóm hợp lý"
                desc="Hiểu nhịp bản thân giúp bạn sắp xếp lịch họp, chia việc và phối hợp với người khác trơn tru hơn."
              />
            </div>

            <div className="mt-16 flex animate-[fadeUp_1s_ease-out] justify-center">
              <Link
                href="/assessment"
                className="group inline-flex h-[64px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6F59FF] via-[#9333EA] to-[#3B82F6] px-10 text-[16px] font-[900] text-white shadow-[0_20px_50px_rgba(111,89,255,0.4)] transition-all hover:-translate-y-1 hover:scale-105"
              >
                <Sparkles className="h-5 w-5 text-yellow-300" />
                Tạo dashboard của tôi
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
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

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulseDot {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(111, 89, 255, 0.5);
          }
          50% {
            transform: scale(1.2);
            box-shadow: 0 0 0 12px rgba(111, 89, 255, 0);
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

function DifferenceStrip() {
  return (
    <div className="mx-auto mb-14 max-w-5xl animate-[fadeUp_0.8s_ease-out] rounded-[30px] border border-[#E9E5FF] bg-white/78 p-4 shadow-[0_18px_50px_rgba(26,21,40,0.055)] backdrop-blur-2xl md:p-5">
      <div className="mb-4 flex flex-col gap-2 px-1 text-center md:text-left">
        <div className="inline-flex w-fit items-center gap-2 self-center rounded-full bg-[#F3F0FF] px-3 py-1.5 text-[10px] font-[900] uppercase tracking-[0.16em] text-[#6F59FF] md:self-start">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Điểm khác biệt
        </div>
        <p className="text-[14px] font-semibold leading-7 text-[#5B566E]">
          Hầu hết công cụ năng suất bắt đầu từ task và deadline. ChronoFlow bắt đầu
          từ nhịp năng lượng của bạn, rồi mới gợi ý cách sắp việc.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {DIFFERENCE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isChronoFlow = item.title === "ChronoFlow";

          return (
            <div
              key={item.title}
              className={`rounded-[22px] p-4 shadow-sm ring-1 ${item.tone}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                    isChronoFlow
                      ? "bg-white/18 text-white ring-1 ring-white/30"
                      : "bg-[#F7F4FF] text-[#6F59FF]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h3
                  className={`text-[14px] font-[900] ${
                    isChronoFlow ? "text-white" : "text-[#1A1528]"
                  }`}
                >
                  {item.title}
                </h3>
              </div>
              <p
                className={`text-[12.5px] font-semibold leading-6 ${
                  isChronoFlow ? "text-white/88" : "text-[#6B647C]"
                }`}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BentoCard({
  icon,
  iconBg,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div
      className="flex animate-[fadeUp_0.7s_ease-out] flex-col justify-between rounded-[36px] border-2 border-white bg-white/80 p-8 shadow-[0_15px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(111,89,255,0.08)]"
      style={{ animationDelay: delay, animationFillMode: "both" }}
    >
      <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className="mb-3 text-[20px] font-[900] leading-tight text-[#0F172A]">
          {title}
        </h3>
        <p className="text-[14.5px] font-medium leading-relaxed text-[#64748B]">
          {desc}
        </p>
      </div>
    </div>
  );
}