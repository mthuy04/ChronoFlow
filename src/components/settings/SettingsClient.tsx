"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Megaphone,
  MoonStar,
  Save,
  ShieldCheck,
  Sparkles,
  User2,
  Users,
  XCircle,
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

type SettingsForm = {
  name: string;
  studentId: string;
  targetSleepTime: string;
  targetWakeTime: string;
  customerType: CustomerType | "";
  sourceChannel: SourceChannel | "";
  companyName: string;
  roleInCompany: string;
  teamSize: string;
  consentForResearch: boolean;
  focusReminderEnabled: boolean;
  weeklyInsightEmailEnabled: boolean;
};

type SettingsApiResponse = {
  success?: boolean;
  message?: string;
  user?: Partial<SettingsUser>;
};

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

function normalizeCustomerType(value: string | null): CustomerType | "" {
  const valid = CUSTOMER_TYPE_OPTIONS.some((item) => item.value === value);
  return valid ? (value as CustomerType) : "";
}

function normalizeSourceChannel(value: string | null): SourceChannel | "" {
  const valid = SOURCE_CHANNEL_OPTIONS.some((item) => item.value === value);
  return valid ? (value as SourceChannel) : "";
}

export default function SettingsClient({
  initialUser,
}: {
  initialUser: SettingsUser;
}) {
  const [form, setForm] = useState<SettingsForm>({
    name: initialUser.name ?? "",
    studentId: initialUser.studentId ?? "",
    targetSleepTime: initialUser.targetSleepTime ?? "",
    targetWakeTime: initialUser.targetWakeTime ?? "",
    customerType: normalizeCustomerType(initialUser.customerType),
    sourceChannel: normalizeSourceChannel(initialUser.sourceChannel),
    companyName: initialUser.companyName ?? "",
    roleInCompany: initialUser.roleInCompany ?? "",
    teamSize: initialUser.teamSize === null ? "" : String(initialUser.teamSize),
    consentForResearch: Boolean(initialUser.consentForResearch),
    focusReminderEnabled: true,
    weeklyInsightEmailEnabled: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  const shouldShowCompanyFields = useMemo(() => {
    return (
      form.customerType === "COMPANY_EMPLOYEE" ||
      form.customerType === "BUSINESS_OWNER" ||
      form.customerType === "FOUNDER" ||
      form.sourceChannel === "COMPANY"
    );
  }, [form.customerType, form.sourceChannel]);

  function updateField<K extends keyof SettingsForm>(
    key: K,
    value: SettingsForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage(null);

      const parsedTeamSize = Number(form.teamSize);

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          studentId: form.studentId.trim() || null,
          targetSleepTime: form.targetSleepTime || null,
          targetWakeTime: form.targetWakeTime || null,
          customerType: form.customerType || null,
          sourceChannel: form.sourceChannel || null,
          companyName: form.companyName.trim() || null,
          roleInCompany: form.roleInCompany.trim() || null,
          teamSize:
            form.teamSize.trim() && Number.isFinite(parsedTeamSize)
              ? parsedTeamSize
              : null,
          consentForResearch: form.consentForResearch,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | SettingsApiResponse
        | null;

      if (!response.ok || !data?.success) {
        setMessage({
          type: "error",
          text: data?.message || "Không thể lưu cài đặt. Vui lòng thử lại.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: data.message || "Đã lưu cài đặt thành công.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_370px]">
      <div className="space-y-8">
        <SettingsPanel
          eyebrow="Account"
          title="Thông tin tài khoản"
          description="Cập nhật thông tin cơ bản để ChronoFlow hiển thị đúng trong dashboard, planner và các báo cáo cá nhân."
          icon={<User2 className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Tên hiển thị"
              value={form.name}
              onChange={(value) => updateField("name", value)}
              placeholder="Tên của bạn"
              icon={<User2 className="h-4 w-4" />}
            />

            <ReadOnlyField
              label="Email đăng nhập"
              value={initialUser.email}
              icon={<Mail className="h-4 w-4" />}
            />

            <TextField
              label="Mã sinh viên"
              value={form.studentId}
              onChange={(value) => updateField("studentId", value)}
              placeholder="Không bắt buộc"
              icon={<Database className="h-4 w-4" />}
            />

            <SelectField
              label="Nhóm người dùng"
              value={form.customerType}
              onChange={(value) =>
                updateField("customerType", value as CustomerType | "")
              }
              placeholder="Chọn nhóm phù hợp"
              options={CUSTOMER_TYPE_OPTIONS}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
        </SettingsPanel>

        <SettingsPanel
          eyebrow="Rhythm"
          title="Mục tiêu giấc ngủ"
          description="ChronoFlow dùng giờ ngủ và giờ thức để gợi ý khung làm việc, hồi phục và lịch trong ngày hợp lý hơn."
          icon={<MoonStar className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TimeField
              label="Giờ ngủ mục tiêu"
              value={form.targetSleepTime}
              onChange={(value) => updateField("targetSleepTime", value)}
              icon={<MoonStar className="h-4 w-4" />}
            />

            <TimeField
              label="Giờ thức mục tiêu"
              value={form.targetWakeTime}
              onChange={(value) => updateField("targetWakeTime", value)}
              icon={<Clock3 className="h-4 w-4" />}
            />
          </div>

          <div className="mt-5 rounded-[24px] border border-[#E9E5FF] bg-[#FBF9FF] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6F59FF] shadow-sm">
                <Activity className="h-4 w-4" />
              </div>

              <div>
                <h4 className="text-[15px] font-black text-[#1A1528]">
                  Gợi ý nhỏ
                </h4>
                <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
                  Nếu bạn chưa chắc giờ ngủ/thức, hãy nhập khung gần đúng trong
                  đa số ngày. Bạn có thể quay lại chỉnh sau khi dùng planner vài
                  hôm.
                </p>
              </div>
            </div>
          </div>
        </SettingsPanel>

        <SettingsPanel
          eyebrow="Research"
          title="Nguồn khách hàng & bối cảnh sử dụng"
          description="Phần này giúp ChronoFlow hiểu người dùng đến từ đâu và thuộc nhóm nào để phục vụ báo cáo performance/pitching."
          icon={<Megaphone className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Bạn biết ChronoFlow qua đâu?"
              value={form.sourceChannel}
              onChange={(value) =>
                updateField("sourceChannel", value as SourceChannel | "")
              }
              placeholder="Chọn nguồn"
              options={SOURCE_CHANNEL_OPTIONS}
              icon={<Megaphone className="h-4 w-4" />}
            />

            <TextField
              label="Tên công ty / tổ chức"
              value={form.companyName}
              onChange={(value) => updateField("companyName", value)}
              placeholder="Không bắt buộc"
              icon={<Building2 className="h-4 w-4" />}
            />
          </div>

          {shouldShowCompanyFields ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TextField
                label="Vai trò trong công ty / team"
                value={form.roleInCompany}
                onChange={(value) => updateField("roleInCompany", value)}
                placeholder="VD: Founder, Marketing, Student..."
                icon={<User2 className="h-4 w-4" />}
              />

              <TextField
                label="Quy mô team"
                value={form.teamSize}
                onChange={(value) => updateField("teamSize", value)}
                placeholder="VD: 5"
                type="number"
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          ) : null}

          <div className="mt-5 rounded-[24px] border border-[#E9E5FF] bg-[#FCFBFF] p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.consentForResearch}
                onChange={(event) =>
                  updateField("consentForResearch", event.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-[#DCD3FF] text-[#6F59FF]"
              />
              <span>
                <span className="block text-[14px] font-black text-[#1A1528]">
                  Cho phép dùng dữ liệu ẩn danh cho báo cáo học phần/pitching
                </span>
                <span className="mt-1 block text-[13px] font-medium leading-relaxed text-[#5B566E]">
                  ChronoFlow chỉ dùng dữ liệu tổng hợp như nhóm người dùng, nguồn
                  biết đến sản phẩm và phản hồi để tạo insight phục vụ báo cáo.
                </span>
              </span>
            </label>
          </div>
        </SettingsPanel>

        <SettingsPanel
          eyebrow="Preferences"
          title="Tuỳ chọn trải nghiệm"
          description="Các tuỳ chọn này hiện lưu ở giao diện. Khi bạn muốn lưu database thật, mình sẽ nối thêm model/API riêng cho preferences."
          icon={<Bell className="h-5 w-5" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ToggleCard
              icon={<Clock3 className="h-5 w-5" />}
              title="Nhắc focus"
              description="Gợi ý bạn bắt đầu focus khi đến khung năng lượng mạnh."
              checked={form.focusReminderEnabled}
              onChange={(checked) =>
                updateField("focusReminderEnabled", checked)
              }
            />

            <ToggleCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Weekly insight"
              description="Nhận nhắc xem lại insight tuần khi có đủ dữ liệu."
              checked={form.weeklyInsightEmailEnabled}
              onChange={(checked) =>
                updateField("weeklyInsightEmailEnabled", checked)
              }
            />
          </div>
        </SettingsPanel>
      </div>

      <aside className="space-y-6">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-[34px] border border-white/80 bg-white/78 p-5 shadow-[0_24px_70px_rgba(26,21,40,0.08)] backdrop-blur-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F3F0FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
              <Save className="h-3.5 w-3.5" />
              Save changes
            </div>

            <h3 className="mt-4 text-[1.45rem] font-[950] leading-tight tracking-tight text-[#1A1528]">
              Lưu thay đổi cài đặt
            </h3>

            <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
              Sau khi lưu, ChronoFlow sẽ dùng dữ liệu mới cho planner, rhythm và
              profile của bạn.
            </p>

            {message ? (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-[13px] font-bold leading-relaxed ${
                  message.type === "success"
                    ? "border-[#BBF7D0] bg-[#ECFDF5] text-[#10B981]"
                    : "border-rose-100 bg-rose-50 text-rose-700"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4 text-[#4DA8FF]" />
              )}
              {isSaving ? "Đang lưu..." : "Lưu cài đặt"}
            </button>

            <Link
              href="/profile"
              className="mt-3 inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl border border-[#E9E5FF] bg-white text-[14px] font-black text-[#6F59FF] shadow-sm transition hover:-translate-y-0.5"
            >
              Quay lại hồ sơ
            </Link>
          </div>

          <div className="rounded-[34px] border border-white/80 bg-white/70 p-5 shadow-[0_20px_60px_rgba(26,21,40,0.06)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setShowPrivacyDetails((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3F0FF] text-[#6F59FF]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[15px] font-black text-[#1A1528]">
                    Dữ liệu đang dùng
                  </div>
                  <div className="text-[12px] font-medium text-[#7A728F]">
                    Xem chi tiết
                  </div>
                </div>
              </div>

              {showPrivacyDetails ? (
                <EyeOff className="h-4 w-4 text-[#6F59FF]" />
              ) : (
                <Eye className="h-4 w-4 text-[#6F59FF]" />
              )}
            </button>

            {showPrivacyDetails ? (
              <div className="mt-5 space-y-3">
                <PrivacyItem
                  title="Thông tin tài khoản"
                  text="Tên, email, mã sinh viên để nhận diện tài khoản."
                />
                <PrivacyItem
                  title="Nhịp ngủ"
                  text="Giờ ngủ/thức để hỗ trợ gợi ý rhythm và planner."
                />
                <PrivacyItem
                  title="Nguồn khách hàng"
                  text="Dùng cho báo cáo tổng hợp, không thay thế dữ liệu cá nhân."
                />
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </form>
  );
}

function SettingsPanel({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[36px] border border-white/80 bg-white/74 shadow-[0_22px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl">
      <div className="border-b border-[#EEF0F6] bg-white/68 px-5 py-5 md:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F3F0FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
          {icon}
          {eyebrow}
        </div>

        <h2 className="mt-4 text-[clamp(1.55rem,2.6vw,2.1rem)] font-[950] leading-tight tracking-tight text-[#1A1528]">
          {title}
        </h2>

        <p className="mt-2 max-w-[760px] text-[14px] font-medium leading-relaxed text-[#5B566E]">
          {description}
        </p>
      </div>

      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </span>

      <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 shadow-[0_8px_20px_rgba(26,21,40,0.04)] transition focus-within:border-[#6F59FF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
        <span className="text-[#9A94B5]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#1A1528] outline-none placeholder:text-[#A3A0B8]"
        />
      </div>
    </label>
  );
}

function TimeField({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </span>

      <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 shadow-[0_8px_20px_rgba(26,21,40,0.04)] transition focus-within:border-[#6F59FF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
        <span className="text-[#9A94B5]">{icon}</span>
        <input
          type="time"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-[#1A1528] outline-none"
        />
      </div>
    </label>
  );
}

function ReadOnlyField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </span>

      <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#EEF0F6] bg-[#F8F9FE] px-4 text-[#6B647C] shadow-sm">
        <span className="text-[#9A94B5]">{icon}</span>
        <span className="min-w-0 flex-1 break-words text-[14px] font-semibold">
          {value}
        </span>
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  icon: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </span>

      <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 shadow-[0_8px_20px_rgba(26,21,40,0.04)] transition focus-within:border-[#6F59FF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
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
      </div>
    </label>
  );
}

function ToggleCard({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-[26px] border p-5 text-left shadow-sm transition ${
        checked
          ? "border-[#D9CEFF] bg-[#F3F0FF]"
          : "border-[#EEF0F6] bg-[#F8F9FE] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
            checked
              ? "bg-white text-[#6F59FF]"
              : "bg-white text-[#8A84A3]"
          }`}
        >
          {icon}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[11px] font-black ${
            checked
              ? "bg-white text-[#6F59FF]"
              : "bg-[#EEF0F6] text-[#8A84A3]"
          }`}
        >
          {checked ? "Bật" : "Tắt"}
        </span>
      </div>

      <h3 className="mt-4 text-[16px] font-black text-[#1A1528]">{title}</h3>
      <p className="mt-2 text-[13.5px] font-medium leading-relaxed text-[#5B566E]">
        {description}
      </p>
    </button>
  );
}

function PrivacyItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4">
      <div className="text-[13px] font-black text-[#1A1528]">{title}</div>
      <p className="mt-1 text-[12.5px] font-medium leading-relaxed text-[#5B566E]">
        {text}
      </p>
    </div>
  );
}