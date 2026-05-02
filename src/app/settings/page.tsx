import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Lock,
  MoonStar,
  Settings2,
  ShieldCheck,
  Sparkles,
  User2,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/settings/SettingsClient";

type SettingsUser = {
  id: string;
  name: string | null;
  email: string;
  studentId: string | null;
  targetSleepTime: string | null;
  targetWakeTime: string | null;
  customerType: string | null;
  sourceChannel: string | null;
  companyName: string | null;
  roleInCompany: string | null;
  teamSize: number | null;
  consentForResearch: boolean | null;
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login?callbackUrl=/settings");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      targetSleepTime: true,
      targetWakeTime: true,
      customerType: true,
      sourceChannel: true,
      companyName: true,
      roleInCompany: true,
      teamSize: true,
      consentForResearch: true,
    },
  });

  if (!user) {
    redirect("/auth/login?callbackUrl=/settings");
  }

  const settingsUser: SettingsUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    studentId: user.studentId,
    targetSleepTime: user.targetSleepTime,
    targetWakeTime: user.targetWakeTime,
    customerType: user.customerType,
    sourceChannel: user.sourceChannel,
    companyName: user.companyName,
    roleInCompany: user.roleInCompany,
    teamSize: user.teamSize,
    consentForResearch: user.consentForResearch,
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <Navbar />
      <AmbientBg />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[40px] border border-white bg-white shadow-[0_22px_80px_rgba(26,21,40,0.06)] md:rounded-[48px]">
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#DCD1FF_100%)] px-5 py-12 md:px-10 md:py-16">
            <HeroGlow />

            <div className="relative z-10 mx-auto max-w-[1080px] text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                <Settings2 className="h-3.5 w-3.5" />
                ChronoFlow Settings
              </div>

              <h1 className="mx-auto mt-5 max-w-[900px] text-[clamp(2.2rem,4.4vw,4.2rem)] font-[950] leading-[1.02] tracking-tight text-[#1A1528]">
                Cài đặt tài khoản,
                <br className="hidden sm:block" />{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  giữ nhịp làm việc đúng hơn.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16.5px]">
                Quản lý thông tin cá nhân, mục tiêu giấc ngủ, dữ liệu nghiên cứu
                và các tuỳ chọn giúp ChronoFlow cá nhân hoá planner, rhythm và
                insight cho bạn.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <SoftChip icon={<User2 className="h-4 w-4" />}>
                  Hồ sơ cá nhân
                </SoftChip>
                <SoftChip icon={<MoonStar className="h-4 w-4" />}>
                  Nhịp ngủ
                </SoftChip>
                <SoftChip icon={<ShieldCheck className="h-4 w-4" />}>
                  Quyền riêng tư
                </SoftChip>
                <SoftChip icon={<Bell className="h-4 w-4" />}>
                  Preferences
                </SoftChip>
              </div>

              <div className="mx-auto mt-10 grid max-w-[960px] gap-4 md:grid-cols-3">
                <HeroInfoCard
                  icon={<CalendarClock className="h-5 w-5" />}
                  title="Planning"
                  text="Dùng giờ ngủ/thức để gợi ý lịch làm việc hợp nhịp hơn."
                />
                <HeroInfoCard
                  icon={<Zap className="h-5 w-5" />}
                  title="Rhythm"
                  text="Cá nhân hoá khung deep work, recovery và việc nhẹ."
                />
                <HeroInfoCard
                  icon={<Lock className="h-5 w-5" />}
                  title="Privacy"
                  text="Kiểm soát dữ liệu dùng cho nghiên cứu và báo cáo."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <SettingsClient initialUser={settingsUser} />
        </section>

        <section className="mt-10 rounded-[36px] border border-white/80 bg-white/70 p-6 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F3F0FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                <Sparkles className="h-3.5 w-3.5" />
                Sau khi cập nhật
              </div>

              <h2 className="mt-4 text-[clamp(1.7rem,3vw,2.6rem)] font-[950] leading-tight tracking-tight text-[#1A1528]">
                Quay lại planner để ChronoFlow áp dụng nhịp mới.
              </h2>

              <p className="mt-3 max-w-[720px] text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
                Các thay đổi như giờ ngủ, giờ thức hoặc loại người dùng sẽ giúp
                ChronoFlow hiểu bối cảnh của bạn tốt hơn trong planner, rhythm và
                insight.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/planner"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
              >
                Mở planner
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/rhythm"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#E9E5FF] bg-white px-6 text-[14px] font-black text-[#6F59FF] shadow-sm transition hover:-translate-y-0.5"
              >
                Xem Rhythm
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

function AmbientBg() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute left-[8%] top-[-6%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/60 blur-[110px]" />
      <div className="absolute right-[-8%] top-[7%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[18%] left-[30%] h-[520px] w-[520px] rounded-full bg-white/70 blur-[120px]" />
    </div>
  );
}

function HeroGlow() {
  return (
    <>
      <div className="pointer-events-none absolute left-[8%] top-[-18%] h-[360px] w-[360px] rounded-full bg-white/45 blur-[90px]" />
      <div className="pointer-events-none absolute right-[-8%] top-[12%] h-[340px] w-[340px] rounded-full bg-[#D9EAFF]/70 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-22%] left-[30%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/45 blur-[110px]" />
    </>
  );
}

function SoftChip({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/84 px-5 py-3 text-[13.5px] font-bold text-[#5B566E] shadow-[0_10px_24px_rgba(95,90,119,0.05)] backdrop-blur-md">
      <span className="text-[#6F59FF]">{icon}</span>
      {children}
    </div>
  );
}

function HeroInfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/68 p-5 text-left shadow-[0_18px_40px_rgba(26,21,40,0.05)] backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF] shadow-sm">
        {icon}
      </div>
      <h3 className="text-[16px] font-black text-[#1A1528]">{title}</h3>
      <p className="mt-2 text-[13.5px] font-medium leading-7 text-[#5B566E]">
        {text}
      </p>
    </div>
  );
}