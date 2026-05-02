"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookText,
  ArrowRight,
  Users,
  BarChart3,
  CalendarClock,
  ShieldCheck,
  Star,
  Building2,
  Megaphone,
  CheckCircle2,
} from "lucide-react";

type CustomerType =
  | "STUDENT"
  | "WORKER"
  | "FREELANCER"
  | "FOUNDER"
  | "BUSINESS_OWNER"
  | "COMPANY_EMPLOYEE"
  | "OTHER";

type SourceChannel =
  | "FACEBOOK"
  | "TIKTOK"
  | "INSTAGRAM"
  | "FRIEND"
  | "DIRECT_MEETING"
  | "COMPANY"
  | "CLASS_GROUP"
  | "OTHER";

const CUSTOMER_TYPE_OPTIONS: Array<{ value: CustomerType; label: string }> = [
  { value: "STUDENT", label: "Sinh viên" },
  { value: "WORKER", label: "Người đi làm" },
  { value: "FREELANCER", label: "Freelancer" },
  { value: "FOUNDER", label: "Founder / startup" },
  { value: "BUSINESS_OWNER", label: "Chủ kinh doanh" },
  { value: "COMPANY_EMPLOYEE", label: "Nhân sự doanh nghiệp" },
  { value: "OTHER", label: "Khác" },
];

const SOURCE_CHANNEL_OPTIONS: Array<{ value: SourceChannel; label: string }> = [
  { value: "FACEBOOK", label: "Facebook" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FRIEND", label: "Bạn bè giới thiệu" },
  { value: "DIRECT_MEETING", label: "Gặp trực tiếp / demo" },
  { value: "COMPANY", label: "Doanh nghiệp / công ty" },
  { value: "CLASS_GROUP", label: "Nhóm lớp / cộng đồng học tập" },
  { value: "OTHER", label: "Khác" },
];

function normalizeUtmSource(value: string | null): SourceChannel | "" {
  const normalized = String(value || "").toLowerCase();

  if (normalized.includes("facebook") || normalized === "fb") return "FACEBOOK";
  if (normalized.includes("tiktok")) return "TIKTOK";
  if (normalized.includes("instagram") || normalized === "ig") return "INSTAGRAM";
  if (normalized.includes("friend")) return "FRIEND";
  if (normalized.includes("company") || normalized.includes("business")) return "COMPANY";
  if (normalized.includes("class")) return "CLASS_GROUP";

  return "";
}
export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageFallback />}>
      <SignupPageContent />
    </Suspense>
  );
}

function SignupPageFallback() {
  return (
    <main className="min-h-screen bg-[#F4F2FA] font-sans text-[#1A1528]">
      <AuthBackground />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="rounded-[28px] border border-white bg-white/90 px-6 py-5 text-sm font-semibold text-[#6B647C] shadow-[0_20px_70px_rgba(26,21,40,0.08)] backdrop-blur-xl">
          Đang tải trang đăng ký...
        </div>
      </section>
    </main>
  );
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inferredSource = useMemo(
    () => normalizeUtmSource(searchParams.get("utm_source")),
    [searchParams],
  );

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const [customerType, setCustomerType] = useState<CustomerType | "">("");
  const [sourceChannel, setSourceChannel] = useState<SourceChannel | "">(
    inferredSource,
  );
  const [companyName, setCompanyName] = useState("");
  const [roleInCompany, setRoleInCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [consentForResearch, setConsentForResearch] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shouldShowCompanyFields =
    customerType === "COMPANY_EMPLOYEE" ||
    customerType === "BUSINESS_OWNER" ||
    customerType === "FOUNDER" ||
    sourceChannel === "COMPANY";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const parsedTeamSize = Number(teamSize);

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

          customerType: customerType || undefined,
          sourceChannel: sourceChannel || undefined,
          sourceCampaign: searchParams.get("utm_campaign") || undefined,
          sourceMedium: searchParams.get("utm_medium") || undefined,
          sourceContent: searchParams.get("utm_content") || undefined,
          sourceTerm: searchParams.get("utm_term") || undefined,

          companyName,
          roleInCompany,
          teamSize:
            Number.isFinite(parsedTeamSize) && teamSize.trim()
              ? parsedTeamSize
              : undefined,
          consentForResearch,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setError(data?.message || "Đăng ký thất bại.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Tạo tài khoản thành công. Đang chuyển sang trang đăng nhập...");

      window.dispatchEvent(
        new CustomEvent("chronoflow:analytics", {
          detail: {
            event: "signup_completed",
            customerType,
            sourceChannel,
            sourceCampaign: searchParams.get("utm_campaign") || "",
          },
        }),
      );

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#F4F2FA] font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <AuthBackground />

      <section className="relative z-10 px-4 pb-12 pt-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="overflow-hidden rounded-[42px] border border-white bg-white/72 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[52px]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative px-6 py-8 md:px-8 lg:px-10 lg:py-10">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tạo tài khoản
                </div>

                <h1 className="mb-3 text-[clamp(2.2rem,4vw,3.8rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
  Đăng ký để <br className="hidden sm:block" />
  bắt đầu{" "}
  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
    đúng nhịp.
  </span>
</h1>

                <p className="mb-6 max-w-[560px] text-[14px] font-medium leading-relaxed text-[#5B566E] md:text-[15px]">
                  Tạo tài khoản để mở khóa nhịp năng lượng cá nhân, planner,
                  pattern theo tuần và giúp ChronoFlow ghi nhận nguồn khách hàng
                  phục vụ báo cáo performance.
                </p>

                <div className="mb-6 flex flex-wrap gap-3">
                  <MiniPill icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                    Tracking nguồn khách hàng
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

                  <div className="grid gap-4 md:grid-cols-2">
                    <SelectRow
                      icon={<Users className="h-4 w-4" />}
                      value={customerType}
                      onChange={(value) => setCustomerType(value as CustomerType | "")}
                      placeholder="Bạn thuộc nhóm khách hàng nào?"
                      options={CUSTOMER_TYPE_OPTIONS}
                    />

                    <SelectRow
                      icon={<Megaphone className="h-4 w-4" />}
                      value={sourceChannel}
                      onChange={(value) => setSourceChannel(value as SourceChannel | "")}
                      placeholder="Bạn biết ChronoFlow qua đâu?"
                      options={SOURCE_CHANNEL_OPTIONS}
                    />
                  </div>

                  {shouldShowCompanyFields ? (
                    <div className="rounded-[24px] border border-[#EEE9FF] bg-[#FCFBFF] p-4">
                      <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                        <Building2 className="h-4 w-4" />
                        Thông tin doanh nghiệp / team
                      </div>

                      <div className="grid gap-3">
                        <InputRow
                          icon={<Building2 className="h-4 w-4" />}
                          type="text"
                          placeholder="Tên công ty / tổ chức"
                          value={companyName}
                          onChange={setCompanyName}
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                          <InputRow
                            icon={<User className="h-4 w-4" />}
                            type="text"
                            placeholder="Vai trò của bạn"
                            value={roleInCompany}
                            onChange={setRoleInCompany}
                          />

                          <InputRow
                            icon={<Users className="h-4 w-4" />}
                            type="number"
                            placeholder="Số người trong team"
                            value={teamSize}
                            onChange={setTeamSize}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <label className="flex gap-3 rounded-[22px] border border-[#EEE9FF] bg-[#FCFBFF] px-4 py-3 text-[13px] leading-6 text-[#5B566E]">
                    <input
                      type="checkbox"
                      checked={consentForResearch}
                      onChange={(event) => setConsentForResearch(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[#DCD3FF] text-[#6F59FF]"
                    />
                    <span>
                      Tôi đồng ý cho ChronoFlow sử dụng dữ liệu đăng ký, nguồn
                      biết đến sản phẩm và phản hồi ẩn danh cho báo cáo học
                      phần/pitching.
                    </span>
                  </label>

                  {error ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  {success ? (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {success}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 py-4 text-white shadow-xl transition-all hover:scale-[1.01] hover:bg-black disabled:opacity-60"
                  >
                    <span className="text-[14px] font-bold">
                      {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
                    </span>
                    {!isSubmitting ? (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    ) : null}
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
                      label="Customer record"
                      tint="purple"
                    />
                    <FloatPill
                      icon={<BarChart3 className="h-3.5 w-3.5" />}
                      label="Marketing source"
                      tint="blue"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureCard
                      title="Nguồn khách hàng"
                      description="Ghi nhận user đến từ Facebook, TikTok, Instagram, gặp trực tiếp hoặc doanh nghiệp."
                      icon={<Megaphone className="h-5 w-5 text-[#6F59FF]" />}
                    />
                    <FeatureCard
                      title="Nhóm người dùng"
                      description="Phân loại sinh viên, người đi làm, freelancer hoặc company để làm báo cáo đa dạng khách hàng."
                      icon={<Users className="h-5 w-5 text-[#4DA8FF]" />}
                    />
                  </div>

                  <div className="mt-5 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(111,89,255,0.10)] backdrop-blur-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A84A3]">
                          Evidence-ready
                        </div>
                        <div className="text-[16px] font-[900] text-[#1A1528]">
                          Dữ liệu phục vụ pitching
                        </div>
                      </div>
                      <div className="rounded-full bg-[#F2EEFF] px-3 py-1 text-[11px] font-black text-[#6F59FF]">
                        Mới
                      </div>
                    </div>

                    <div className="space-y-3">
                      <TimelineItem
                        title="Signup source"
                        description="Biết user đến từ kênh nào."
                        active
                      />
                      <TimelineItem
                        title="Customer type"
                        description="Biết user thuộc nhóm khách hàng nào."
                        active
                      />
                      <TimelineItem
                        title="Feedback sau trải nghiệm"
                        description="Dùng cho slide performance và pitching."
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <MetricCard value="100" label="records mục tiêu" />
                    <MetricCard value="27/4–13/5" label="mốc tracking MKT" />
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

function AuthBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#F4F2FA]">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute left-[-12%] top-[8%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/55 blur-[120px]" />
      <div className="absolute right-[-10%] top-[18%] h-[380px] w-[380px] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[-18%] left-[32%] h-[500px] w-[500px] rounded-full bg-white/70 blur-[110px]" />
    </div>
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
    <div className="inline-flex items-center gap-2 rounded-full border border-[#EEE9FF] bg-white px-4 py-2 text-[12px] font-bold text-[#5B566E] shadow-sm">
      <span className="text-[#6F59FF]">{icon}</span>
      {children}
    </div>
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
    <label className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 shadow-[0_8px_20px_rgba(26,21,40,0.04)] transition focus-within:border-[#6F59FF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
      <span className="text-[#9A94B5]">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#1A1528] outline-none placeholder:text-[#A3A0B8]"
      />
      {trailing}
    </label>
  );
}

function SelectRow({
  icon,
  value,
  onChange,
  placeholder,
  options,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 shadow-[0_8px_20px_rgba(26,21,40,0.04)] transition focus-within:border-[#6F59FF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
      <span className="text-[#9A94B5]">{icon}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#1A1528] outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
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
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[12px] font-black text-[#1A1528] shadow-sm">
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-white ${
          tint === "purple" ? "bg-[#6F59FF]" : "bg-[#4DA8FF]"
        }`}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/80 bg-white/75 p-5 shadow-[0_14px_34px_rgba(26,21,40,0.05)] backdrop-blur-md">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#F2EEFF]">
        {icon}
      </div>
      <div className="text-[15px] font-black text-[#1A1528]">{title}</div>
      <p className="mt-2 text-[13px] leading-7 text-[#5B566E]">{description}</p>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  active = false,
}: {
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
        active ? "border border-[#6F59FF] bg-white" : "bg-white/65"
      }`}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border ${
          active
            ? "border-[#6F59FF] bg-[#6F59FF] text-white"
            : "border-[#E8E2FF] bg-white text-[#C3BEDA]"
        }`}
      >
        {active ? <CheckCircle2 className="h-4 w-4" /> : null}
      </span>
      <div>
        <div className="text-[13px] font-black text-[#1A1528]">{title}</div>
        <div className="text-[12px] text-[#6B647C]">{description}</div>
      </div>
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/75 p-5 shadow-sm">
      <div className="text-[1.8rem] font-black leading-none tracking-tight text-[#6F59FF]">
        {value}
      </div>
      <div className="mt-2 text-[13px] font-bold text-[#5B566E]">{label}</div>
    </div>
  );
}