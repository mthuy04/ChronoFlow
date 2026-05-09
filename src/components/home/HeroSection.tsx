"use client";

import Link from "next/link";
import React from "react";
import {
  Play,
  Sparkles,
  CheckCircle2,
  Clock3,
  Brain,
  MoonStar,
  Sunrise,
  Zap,
  BarChart3,
  CalendarClock,
  Activity,
  Users,
  ClipboardList,
  TrendingUp,
  MoreHorizontal,
  Plus,
} from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-[#F4F2FA] font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full">
        <div className="absolute left-[10%] top-[-10%] h-[400px] w-[400px] animate-[pulse_6s_infinite] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
        <div className="absolute right-[-5%] top-[10%] h-[300px] w-[300px] animate-[pulse_8s_infinite] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto mb-10 mt-2 max-w-[1280px] px-4 lg:px-8">
        <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
          {/* TOP HALF */}
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
            <div className="relative z-30 mx-auto max-w-4xl text-center">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                ChronoFlow Preview
              </div>

              <h1 className="mb-3 text-[clamp(2.2rem,4vw,3.8rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                Hiểu nhịp sinh học, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  sắp việc đúng lúc.
                </span>
              </h1>

              <p className="mx-auto mb-6 max-w-[640px] text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
                Không chỉ ghi việc cần làm, ChronoFlow gợi ý thời điểm phù hợp để
                làm việc đó dựa trên chronotype và nhịp năng lượng cá nhân.
              </p>

              <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/assessment"
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                >
                  <Activity className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                      MIỄN PHÍ
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Test ngay 3 phút
                    </span>
                  </div>
                </Link>

                <Link
                  href="/how-it-works"
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <Play className="ml-0.5 h-3 w-3 fill-[#6F59FF] text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Cách hoạt động
                  </span>
                </Link>
              </div>
            </div>

            {/* PHONES */}
            <div className="relative mx-auto mt-2 h-[340px] w-full max-w-[740px] perspective-[1200px]">
              <div className="absolute left-[3%] top-[6%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                <FloatPill
                  icon={<Zap className="h-3.5 w-3.5" />}
                  label="Đỉnh tập trung: 07:00"
                  tint="purple"
                />
              </div>

              <div className="absolute left-[-4%] top-[30%] z-40 hidden animate-[bounce_5s_infinite] md:block">
                <div className="rounded-[20px] border border-white bg-white/90 p-4 shadow-[0_20px_40px_rgba(111,89,255,0.15)] backdrop-blur-md">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A84A3]">
                    Chronotype phổ biến
                  </div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-[22px] font-[900] leading-none text-[#1A1528]">
                      Gấu
                    </span>
                    <span className="text-lg">🐻</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#F3F0FF] text-[10px]">
                      🦁
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#E9F5FF] text-[10px]">
                      🐺
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#FFF1E8] text-[10px]">
                      🐬
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-[3%] top-[4%] z-40 hidden animate-[bounce_4.5s_infinite] sm:block">
                <FloatPill
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  label="Năng lượng"
                  tint="orange"
                />
              </div>

              <div className="absolute right-[-4%] top-[26%] z-40 hidden animate-[bounce_5.5s_infinite] md:block">
                <div className="min-w-[140px] space-y-3 rounded-[20px] border border-white bg-white/90 p-4 shadow-[0_20px_40px_rgba(111,89,255,0.15)] backdrop-blur-md">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#8A84A3]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    Đánh giá 3p
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-[900] text-[#1A1528]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                      <BarChart3 className="h-3 w-3 text-[#6F59FF]" />
                    </div>
                    Phân tích nhịp
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#8A84A3]">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                      <CalendarClock className="h-3 w-3" />
                    </div>
                    Gợi ý lịch
                  </div>
                </div>
              </div>

              <div className="absolute left-[3%] top-12 z-20 w-[200px] -rotate-12 transform rounded-[32px] shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-[-5deg] sm:left-[5%] sm:w-[220px]">
                <PhoneFrame>
                  <QuizPhone />
                </PhoneFrame>
              </div>

              <div className="absolute right-[3%] top-12 z-20 w-[200px] rotate-12 transform rounded-[32px] shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-[5deg] sm:right-[5%] sm:w-[220px]">
                <PhoneFrame>
                  <SchedulePhone />
                </PhoneFrame>
              </div>

              <div className="absolute left-1/2 top-2 z-30 w-[230px] -translate-x-1/2 transform rounded-[36px] shadow-[0_40px_80px_rgba(26,21,40,0.25)] transition-all duration-700 hover:-translate-y-6 sm:w-[240px]">
                <PhoneFrame featured>
                  <ResultPhone />
                </PhoneFrame>
              </div>
            </div>
          </div>

          {/* BOTTOM HALF */}
          <div className="relative z-50 bg-white px-6 py-10 md:px-12 lg:px-16">
            <div className="mb-10 grid gap-8 border-b border-gray-100 pb-10 md:grid-cols-2 md:gap-14">
              <TopFeature
                icon={<ClipboardList className="h-6 w-6 text-[#6F59FF]" />}
                title="Lịch làm việc theo nhịp"
                description="Sắp xếp deep work, việc nhẹ, hồi phục và các hoạt động lặp lại theo từng giai đoạn năng lượng trong ngày."
                chip={
                  <div className="rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-3.5 py-1.5 text-[11px] font-bold text-[#6F59FF]">
                    Cá nhân hoá
                  </div>
                }
              />
              <TopFeature
                icon={<Users className="h-6 w-6 text-[#6F59FF]" />}
                title="4 chronotype cốt lõi"
                description="Sư tử, Gấu, Sói và Cá heo — mỗi nhóm có đường năng lượng và khung tập trung khác nhau để bạn hiểu mình rõ hơn."
                chip={
                  <div className="flex -space-x-2 rounded-full border border-gray-100 bg-[#F8F9FE] px-2.5 py-1.5">
                    <div className="h-5 w-5 rounded-full border-2 border-white bg-blue-400" />
                    <div className="h-5 w-5 rounded-full border-2 border-white bg-orange-400" />
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#1A1528] text-[8px] font-bold text-white">
                      4+
                    </div>
                  </div>
                }
              />
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
              <div className="space-y-5">
                <InsightBlock value="07:00" label="Cửa sổ tập trung của Sư tử" />
                <InsightBlock value="15:30" label="Khung hồi phục của Cá heo" />
              </div>

              <div className="relative mx-auto flex w-full justify-center sm:w-[330px]">
                <div className="relative z-10 w-full rounded-[28px] border border-[#E9E5FF] bg-white p-5 shadow-[0_25px_50px_rgba(111,89,255,0.08)] transition-transform duration-500 hover:-translate-y-2">
                  <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-[16px] font-[900] text-[#1A1528]">
                      Lịch hôm nay
                    </h5>
                    <button className="flex items-center gap-1.5 rounded-full border border-[#E9E5FF] bg-[#F8F9FE] px-3 py-1.5 text-[11px] font-bold text-[#6F59FF] transition-colors hover:bg-[#6F59FF] hover:text-white">
                      <Plus className="h-3 w-3" /> Thêm
                    </button>
                  </div>

                  <div className="relative space-y-3.5">
                    <div className="absolute left-[18px] top-4 -z-10 bottom-4 w-[2px] rounded-full bg-[#F3F0FF]" />
                    <ScheduleRow
                      done
                      title="Deep work"
                      meta="07:00 – 10:00 • Cao"
                      icon={<Zap className="h-3 w-3 text-gray-400" />}
                    />
                    <ScheduleRow
                      active
                      title="Ra quyết định"
                      meta="10:30 – 11:30 • Chững lại"
                      icon={<Brain className="h-3 w-3 text-[#6F59FF]" />}
                    />
                    <ScheduleRow
                      title="Recovery / nghỉ ngắn"
                      meta="13:00 – 14:00 • Phục hồi"
                      icon={<MoonStar className="h-3 w-3 text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="absolute -left-5 bottom-6 z-20 flex h-14 items-end gap-1.5 rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                  {[40, 80, 40, 100, 60, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 animate-pulse rounded-full bg-gradient-to-t from-[#6F59FF] to-[#4DA8FF]"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <SidePoint
                  icon={<BarChart3 className="h-4 w-4" />}
                  title="Đường năng lượng"
                  description="Theo dõi lúc tăng tập trung, lúc chững lại và thời điểm nên nghỉ để tránh làm việc quá sức."
                />
                <SidePoint
                  icon={<Clock3 className="h-4 w-4" />}
                  title="Khung giờ tối ưu"
                  description="Không chỉ biết mình thuộc nhóm nào, bạn còn nhận được khung giờ phù hợp để học và làm việc."
                />
                <SidePoint
                  icon={<CalendarClock className="h-4 w-4" />}
                  title="Ứng dụng thực tế"
                  description="Biến chronotype thành lịch hành động mỗi ngày thay vì chỉ là bài test tham khảo."
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FloatPill({
  icon,
  label,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  tint: "purple" | "orange";
}) {
  const bgClass =
    tint === "purple"
      ? "from-[#6F59FF] to-[#4DA8FF]"
      : "from-[#F59E0B] to-[#FBBF24]";

  return (
    <div className="flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-[11px] font-bold shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br text-white ${bgClass}`}
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
  children: React.ReactNode;
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

function TopFeature({
  icon,
  title,
  description,
  chip,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  chip: React.ReactNode;
}) {
  return (
    <div className="group flex cursor-default flex-col items-start rounded-3xl border border-transparent bg-[#F8F9FE]/50 p-5 transition-all hover:border-[#E9E5FF] hover:bg-white hover:shadow-lg">
      <div className="mb-4 flex w-full items-center justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F3F0FF] to-[#E9E5FF] transition-transform group-hover:scale-105">
          {icon}
        </div>
        {chip}
      </div>
      <h4 className="mb-2 text-[17px] font-[900] text-[#1A1528]">{title}</h4>
      <p className="text-[13.5px] leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

function InsightBlock({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="group rounded-[20px] border border-[#E9E5FF] bg-[#F8F9FE] p-5 transition-all hover:-translate-y-1 hover:shadow-md">
      <h5 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#8A84A3]">
        Insight
      </h5>
      <div className="mb-1 origin-left bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-[38px] font-[900] leading-none text-transparent transition-transform group-hover:scale-105">
        {value}
      </div>
      <div className="text-[13px] font-medium text-[#1A1528]">{label}</div>
    </div>
  );
}

function SidePoint({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex gap-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E9E5FF] bg-[#F8F9FE] text-[#6F59FF] transition-colors group-hover:bg-[#6F59FF] group-hover:text-white">
        {icon}
      </div>
      <div>
        <h4 className="mb-1 text-[15px] font-[900] text-[#1A1528]">{title}</h4>
        <p className="text-[13px] leading-relaxed text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function ScheduleRow({
  title,
  meta,
  icon,
  done = false,
  active = false,
}: {
  title: string;
  meta: string;
  icon: React.ReactNode;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`relative flex items-start gap-3 rounded-2xl p-3 transition-all ${
        active
          ? "z-10 scale-[1.02] border-2 border-[#6F59FF] bg-white shadow-[0_10px_20px_rgba(111,89,255,0.1)]"
          : "border border-transparent bg-white"
      }`}
    >
      <div
        className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${
          done
            ? "bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white"
            : active
            ? "border-2 border-[#6F59FF] bg-[#F3F0FF]"
            : "border-2 border-gray-200 bg-white"
        }`}
      >
        {done && <CheckCircle2 className="h-3 w-3" />}
      </div>
      <div className="flex-1">
        <div
          className={`mb-0.5 text-[13px] font-[900] ${
            done
              ? "line-through text-gray-400"
              : active
              ? "text-[#6F59FF]"
              : "text-[#1A1528]"
          }`}
        >
          {title}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
          {icon} {meta}
        </div>
      </div>
    </div>
  );
}

function QuizPhone() {
  return (
    <div className="relative flex h-full flex-col bg-[#F8F9FE] p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF] text-[10px]">
            ⏱️
          </div>
          <div>
            <div className="text-[9px] font-bold text-gray-500">Câu hỏi 1/5</div>
            <div className="text-[11px] font-[900] leading-none">
              Chronotype Test
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="absolute left-0 top-0 h-1 w-1/5 bg-[#6F59FF]" />
        <div className="mt-1 text-[13px] font-bold leading-tight text-[#1A1528]">
          Thời điểm bạn cảm thấy tỉnh táo nhất là khi nào?
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        {[
          { text: "Sáng sớm trước 9h", active: true },
          { text: "Cuối buổi sáng", active: false },
          { text: "Chiều muộn / tối", active: false },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 shadow-sm transition-all ${
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
              {item.active && <div className="h-1.5 w-1.5 rounded-full bg-[#6F59FF]" />}
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

function SchedulePhone() {
  return (
    <div className="flex h-full flex-col bg-white p-3">
      <div className="relative mb-3 border-b border-gray-100 pb-3 text-center">
        <div className="text-[13px] font-[900] text-[#1A1528]">Lịch Gợi Ý</div>
        <div className="mt-1 inline-block rounded bg-[#F3F0FF] px-1.5 py-0.5 text-[9px] font-bold text-[#6F59FF]">
          Sư Tử • Năng lượng đầu ngày
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-gray-100" />
        <div className="space-y-3">
          {[
            {
              label: "Deep work",
              time: "07:00",
              dot: "bg-orange-500",
              card: "bg-[#FFF6E8] border-orange-100",
              titleCol: "text-orange-600",
            },
            {
              label: "Ra quyết định",
              time: "10:30",
              dot: "bg-[#6F59FF]",
              card: "bg-[#F3F0FF] border-[#E9E5FF]",
              titleCol: "text-[#6F59FF]",
            },
            {
              label: "Việc nhẹ",
              time: "13:00",
              dot: "bg-blue-400",
              card: "bg-[#EEF5FF] border-blue-100",
              titleCol: "text-blue-500",
            },
            {
              label: "Hồi phục",
              time: "15:00",
              dot: "bg-gray-300",
              card: "bg-gray-50 border-gray-100",
              titleCol: "text-gray-500",
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

function ResultPhone() {
  return (
    <div className="flex h-full flex-col px-4 py-5">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-[17px] font-[900] leading-tight text-white">
          Chronotype <br />
          của bạn
        </h3>
        <div className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
          <Sunrise className="h-4 w-4 text-white" />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
          <div className="mb-0.5 text-[9px] font-bold uppercase text-white/70">
            Đại diện
          </div>
          <div className="text-[15px] font-[900] text-white">Sư Tử 🦁</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
          <div className="mb-0.5 text-[9px] font-bold uppercase text-white/70">
            Đỉnh cao
          </div>
          <div className="text-[15px] font-[900] text-white">07:00</div>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-[20px] bg-white p-3 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[12px] font-[900] text-[#1A1528]">
            Biểu đồ năng lượng
          </div>
          <MoreHorizontal className="h-3 w-3 text-gray-400" />
        </div>
        <p className="mb-2 text-[10px] leading-relaxed text-gray-500">
          Đạt đỉnh tập trung trước trưa, phù hợp xử lý việc khó. Nên giảm tải vào chiều.
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
              d="M8 68C42 62 58 24 96 22C134 20 150 54 186 62C208 67 227 69 252 70"
              stroke="url(#energyLineHeroFinal)"
              strokeWidth="5"
              strokeLinecap="round"
              className="drop-shadow-[0_4px_6px_rgba(111,89,255,0.4)]"
            />
            <defs>
              <linearGradient
                id="energyLineHeroFinal"
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
