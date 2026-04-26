"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Navbar";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookText,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  CalendarClock,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          studentId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Đăng ký thất bại.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Tạo tài khoản thành công. Đang chuyển sang trang đăng nhập...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#F4F2FA] text-[#1A1528] selection:bg-[#6F59FF]/20">
      <AuthBackground />
      <Header />

      <section className="relative z-10 px-4 pb-12 pt-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative px-6 py-8 md:px-8 lg:px-10 lg:py-10">
                <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-[#F8F6FF] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tạo tài khoản
                </div>

                <h1 className="mb-3 text-[clamp(2.1rem,4vw,3.5rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                Đăng kí để 
                <br/> bắt đầu{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  đúng nhịp.
                  </span>
                </h1>

                <p className="mb-6 max-w-[560px] text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
                  Tạo tài khoản để mở khóa nhịp năng lượng cá nhân, planner,
                  pattern theo tuần và một cách làm việc hợp với thời điểm của bạn hơn.
                </p>

                <div className="mb-6 flex flex-wrap gap-3">
                  <MiniPill icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                    Thiết lập cá nhân
                  </MiniPill>
                  <MiniPill icon={<Star className="h-3.5 w-3.5" />}>
                    Bắt đầu miễn phí
                  </MiniPill>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <InputRow
                    icon={<User className="h-4 w-4" />}
                    type="text"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={setName}
                  />

                  <InputRow
                    icon={<Mail className="h-4 w-4" />}
                    type="email"
                    placeholder="Địa chỉ email"
                    value={email}
                    onChange={setEmail}
                  />

                  <InputRow
                    icon={<BookText className="h-4 w-4" />}
                    type="text"
                    placeholder="Mã sinh viên (không bắt buộc)"
                    value={studentId}
                    onChange={setStudentId}
                  />

                  <InputRow
                    icon={<Lock className="h-4 w-4" />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={setPassword}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-[#8A84A3] transition-colors hover:text-[#1A1528]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  {error && (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 py-4 text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-black disabled:opacity-60"
                  >
                    <span className="text-[14px] font-bold">
                      {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
                    </span>
                    {!isSubmitting && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </button>

                  <p className="pt-1 text-center text-sm text-[#7A728F]">
                    Đã có tài khoản?{" "}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-[#1A1528] hover:underline"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </form>
              </div>

              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 py-8 md:px-8">
                <div className="absolute left-[10%] top-[8%] h-36 w-36 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute right-[8%] top-[20%] h-32 w-32 rounded-full bg-[#D9EAFF]/70 blur-3xl" />

                <div className="relative mx-auto flex h-full max-w-[560px] flex-col justify-center">
                  <div className="mb-6 flex flex-wrap gap-3">
                    <FloatPill
                      icon={<Users className="h-3.5 w-3.5" />}
                      label="Tài khoản cá nhân"
                      tint="purple"
                    />
                    <FloatPill
                      icon={<BarChart3 className="h-3.5 w-3.5" />}
                      label="Insight theo tuần"
                      tint="blue"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureCard
                      title="Nhịp năng lượng cá nhân"
                      description="Hiểu pattern của bạn và làm việc theo thời điểm hợp hơn."
                      icon={<CalendarClock className="h-5 w-5 text-[#6F59FF]" />}
                    />
                    <FeatureCard
                      title="Planner thông minh hơn"
                      description="Biến insight thành block công việc, routine và lịch trong ngày."
                      icon={<BarChart3 className="h-5 w-5 text-[#4DA8FF]" />}
                    />
                  </div>

                  <div className="mt-5 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(111,89,255,0.10)] backdrop-blur-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
                          Bắt đầu với
                        </div>
                        <div className="text-[16px] font-[900] text-[#1A1528]">
                          Những gì bạn mở khóa đầu tiên
                        </div>
                      </div>
                      <div className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[10px] font-bold text-[#6F59FF]">
                        Mới
                      </div>
                    </div>

                    <div className="space-y-3">
                      <MockRow title="Bài đánh giá chronotype" meta="Bắt đầu từ nhịp của bạn" done />
                      <MockRow title="Kết quả cá nhân" meta="Xem khung giờ mạnh nhất" active />
                      <MockRow title="Flow lập kế hoạch" meta="Áp dụng vào một ngày thực tế" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <SmallStat value="1 tài khoản" label="để lưu toàn bộ tiến trình" />
                    <SmallStat value="3 phút" label="để bắt đầu hiểu nhịp của bạn" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InputRow({
  icon,
  type,
  placeholder,
  value,
  onChange,
  trailing,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E9E5FF] bg-[#F8F9FE] px-4 py-4 shadow-sm">
      <div className="text-[#8A84A3]">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#AAA1BC]"
      />
      {trailing}
    </div>
  );
}

function SimpleNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/80 bg-[#F4F2FA]/80 px-6 py-5 backdrop-blur-md">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="flex w-fit items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#6F59FF]" />
          <span className="text-xl font-[900] tracking-tight text-[#1A1528]">
            ChronoFlow
          </span>
        </Link>
      </div>
    </nav>
  );
}

function AuthBackground() {
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
        <div className="absolute left-[10%] top-[-8%] h-[360px] w-[360px] rounded-full bg-[#DCCEFF]/55 blur-[110px]" />
        <div className="absolute right-[-4%] top-[10%] h-[300px] w-[300px] rounded-full bg-[#D9EAFF]/55 blur-[110px]" />
      </div>
    </>
  );
}

function MiniPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-3 py-2 text-[12px] font-semibold text-[#4F4A68] shadow-sm">
      <span className="text-[#6F59FF]">{icon}</span>
      {children}
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-md">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF]">
        {icon}
      </div>
      <h3 className="text-[15px] font-[900] text-[#1A1528]">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-[#615C7A]">{description}</p>
    </div>
  );
}

function MockRow({
  title,
  meta,
  done = false,
  active = false,
}: {
  title: string;
  meta: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3 transition-all ${
        active
          ? "border-2 border-[#6F59FF] bg-white shadow-[0_10px_20px_rgba(111,89,255,0.1)]"
          : "border border-transparent bg-white/80"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${
            done
              ? "bg-gradient-to-br from-[#6F59FF] to-[#4DA8FF] text-white"
              : active
              ? "border-2 border-[#6F59FF] bg-[#F3F0FF]"
              : "border-2 border-gray-200 bg-white"
          }`}
        >
          {done && <CheckCircle2 className="h-3 w-3" />}
        </div>
        <div>
          <div
            className={`text-[13px] font-[900] ${
              active ? "text-[#6F59FF]" : "text-[#1A1528]"
            }`}
          >
            {title}
          </div>
          <div className="text-[11px] font-medium text-gray-500">{meta}</div>
        </div>
      </div>
    </div>
  );
}

function SmallStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-md">
      <div className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-[28px] font-[900] leading-none text-transparent">
        {value}
      </div>
      <div className="mt-1 text-[12px] font-medium text-[#6B6287]">{label}</div>
    </div>
  );
}