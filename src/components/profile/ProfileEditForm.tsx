"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Building2,
  Camera,
  CheckCircle2,
  Loader2,
  LogOut,
  Megaphone,
  MoonStar,
  Save,
  Upload,
  User2,
  Users,
  X,
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

type Props = {
  initialName: string;
  initialStudentId: string | null;
  initialTargetSleepTime: string | null;
  initialTargetWakeTime: string | null;
  initialImage?: string | null;

  initialCustomerType?: string | null;
  initialSourceChannel?: string | null;
  initialCompanyName?: string | null;
  initialRoleInCompany?: string | null;
  initialTeamSize?: number | null;
  initialConsentForResearch?: boolean | null;
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

function isCustomerType(value: string | null | undefined): value is CustomerType {
  return CUSTOMER_TYPE_OPTIONS.some((item) => item.value === value);
}

function isSourceChannel(value: string | null | undefined): value is SourceChannel {
  return SOURCE_CHANNEL_OPTIONS.some((item) => item.value === value);
}

export default function ProfileEditForm({
  initialName,
  initialStudentId,
  initialTargetSleepTime,
  initialTargetWakeTime,
  initialImage = null,

  initialCustomerType = null,
  initialSourceChannel = null,
  initialCompanyName = null,
  initialRoleInCompany = null,
  initialTeamSize = null,
  initialConsentForResearch = false,
}: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialName || "");
  const [studentId, setStudentId] = useState(initialStudentId || "");
  const [targetSleepTime, setTargetSleepTime] = useState(
    initialTargetSleepTime || "",
  );
  const [targetWakeTime, setTargetWakeTime] = useState(
    initialTargetWakeTime || "",
  );

  const [customerType, setCustomerType] = useState<CustomerType | "">(
    isCustomerType(initialCustomerType) ? initialCustomerType : "",
  );
  const [sourceChannel, setSourceChannel] = useState<SourceChannel | "">(
    isSourceChannel(initialSourceChannel) ? initialSourceChannel : "",
  );
  const [companyName, setCompanyName] = useState(initialCompanyName || "");
  const [roleInCompany, setRoleInCompany] = useState(
    initialRoleInCompany || "",
  );
  const [teamSize, setTeamSize] = useState(
    typeof initialTeamSize === "number" ? String(initialTeamSize) : "",
  );
  const [consentForResearch, setConsentForResearch] = useState(
    Boolean(initialConsentForResearch),
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initialImage || null,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const displayAvatar = previewUrl || avatarUrl || null;
  const fallbackLetter = (name.trim().charAt(0) || "C").toUpperCase();

  const shouldShowCompanyFields =
    customerType === "COMPANY_EMPLOYEE" ||
    customerType === "BUSINESS_OWNER" ||
    customerType === "FOUNDER" ||
    sourceChannel === "COMPANY";

  function resetAvatarMessages() {
    setAvatarError("");
    setAvatarSuccess("");
  }

  function handleChooseFile() {
    resetAvatarMessages();
    fileInputRef.current?.click();
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    resetAvatarMessages();

    const file = event.target.files?.[0];

    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      setAvatarError("Chỉ hỗ trợ JPG, PNG hoặc WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleCancelPreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setSelectedFile(null);
    setAvatarError("");
    setAvatarSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUploadAvatar() {
    if (!selectedFile) {
      setAvatarError("Bạn chưa chọn ảnh để upload.");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setAvatarError("");
      setAvatarSuccess("");

      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        image?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.success || !data.image) {
        setAvatarError(data?.error || "Không thể upload avatar.");
        return;
      }

      const newImage = data.image;
      setAvatarUrl(newImage);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(null);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await update({
        user: {
          image: newImage,
          name: name.trim() || initialName,
        },
      });

      setAvatarSuccess("Đã cập nhật avatar thành công.");

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setAvatarError("Có lỗi xảy ra khi upload avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Tên không được để trống.");
      return;
    }

    const parsedTeamSize = Number(teamSize);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trimmedName,
        studentId: studentId.trim(),
        targetSleepTime: targetSleepTime || null,
        targetWakeTime: targetWakeTime || null,

        customerType: customerType || null,
        sourceChannel: sourceChannel || null,
        companyName: companyName.trim() || null,
        roleInCompany: roleInCompany.trim() || null,
        teamSize:
          Number.isFinite(parsedTeamSize) && teamSize.trim()
            ? parsedTeamSize
            : null,
        consentForResearch,
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      error?: string;
    } | null;

    if (!response.ok || !data?.success) {
      setError(data?.error || "Không thể cập nhật hồ sơ.");
      return;
    }

    await update({
      user: {
        name: trimmedName,
        image: avatarUrl,
      },
    });

    setSuccess("Đã cập nhật hồ sơ thành công.");

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <section className="rounded-[30px] border border-[#EEE9FF] bg-[#FCFBFF] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#6F59FF_0%,#4DA8FF_100%)] text-[34px] font-black text-white shadow-[0_16px_34px_rgba(97,76,197,0.18)]">
            {displayAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayAvatar}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              fallbackLetter
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F2EEFF] text-[#6F59FF]">
                <Camera className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-[1rem] font-black tracking-tight text-[#1A1528]">
                  Ảnh đại diện
                </h3>
                <p className="mt-1 text-[13px] leading-6 text-[#6B647C]">
                  Chọn ảnh JPG, PNG hoặc WEBP. Dung lượng tối đa 5MB.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleChooseFile}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#EEE9FF] bg-white px-5 text-[13px] font-black text-[#1A1528] transition hover:bg-[#F8F6FF]"
              >
                <Upload className="h-4 w-4 text-[#6F59FF]" />
                Chọn ảnh
              </button>

              <button
                type="button"
                onClick={() => void handleUploadAvatar()}
                disabled={!selectedFile || isUploadingAvatar}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-black text-white shadow-[0_14px_30px_rgba(26,21,40,0.14)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Lưu avatar
                  </>
                )}
              </button>

              {selectedFile ? (
                <button
                  type="button"
                  onClick={handleCancelPreview}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#EEE9FF] bg-white px-5 text-[13px] font-black text-[#1A1528] transition hover:bg-[#F8F6FF]"
                >
                  <X className="h-4 w-4 text-[#6F59FF]" />
                  Huỷ chọn
                </button>
              ) : null}
            </div>

            <p className="mt-3 text-[12px] leading-6 text-[#6B647C]">
              {selectedFile
                ? `Ảnh đã chọn: ${selectedFile.name}`
                : "Bạn có thể đổi avatar bất cứ lúc nào."}
            </p>

            {avatarError ? <Alert tone="error">{avatarError}</Alert> : null}

            {avatarSuccess ? (
              <Alert tone="success">
                <CheckCircle2 className="h-4 w-4" />
                {avatarSuccess}
              </Alert>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <FieldCard
          icon={<User2 className="h-5 w-5" />}
          label="Họ và tên"
          hint="Tên hiển thị trong dashboard, profile và các phần cá nhân hóa."
        >
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nhập họ và tên"
            className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
          />
        </FieldCard>

        <FieldCard
          icon={<User2 className="h-5 w-5" />}
          label="Student ID"
          hint="Có thể để trống nếu bạn không dùng mã sinh viên."
        >
          <input
            type="text"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="Nhập mã sinh viên"
            className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
          />
        </FieldCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <FieldCard
          icon={<MoonStar className="h-5 w-5" />}
          label="Giờ ngủ mục tiêu"
          hint="Giúp ChronoFlow hiểu rõ hơn nhịp nghỉ ngơi mong muốn."
        >
          <input
            type="time"
            value={targetSleepTime}
            onChange={(event) => setTargetSleepTime(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
          />
        </FieldCard>

        <FieldCard
          icon={<MoonStar className="h-5 w-5" />}
          label="Giờ thức mục tiêu"
          hint="Giúp planner gợi ý lịch sát hơn với routine mong muốn."
        >
          <input
            type="time"
            value={targetWakeTime}
            onChange={(event) => setTargetWakeTime(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
          />
        </FieldCard>
      </section>

      <section className="rounded-[30px] border border-[#EEE9FF] bg-[#FCFBFF] p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F2EEFF] text-[#6F59FF]">
            <Megaphone className="h-5 w-5" />
          </div>

          <div>
            <div className="text-[1rem] font-black tracking-tight text-[#1A1528]">
              Thông tin tracking khách hàng
            </div>
            <p className="mt-1 text-[13px] leading-6 text-[#6B647C]">
              Phần này giúp ChronoFlow tổng hợp nguồn người dùng, nhóm khách
              hàng và minh chứng performance cho báo cáo/pitching.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FieldCard
            icon={<Users className="h-5 w-5" />}
            label="Nhóm khách hàng"
            hint="Dùng để phân loại khách hàng khi tổng hợp báo cáo."
          >
            <select
              value={customerType}
              onChange={(event) =>
                setCustomerType(event.target.value as CustomerType | "")
              }
              className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
            >
              <option value="">Chọn nhóm khách hàng</option>
              {CUSTOMER_TYPE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </FieldCard>

          <FieldCard
            icon={<Megaphone className="h-5 w-5" />}
            label="Bạn biết ChronoFlow qua đâu?"
            hint="Dùng để đo hiệu quả Facebook, TikTok, Instagram, demo trực tiếp."
          >
            <select
              value={sourceChannel}
              onChange={(event) =>
                setSourceChannel(event.target.value as SourceChannel | "")
              }
              className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
            >
              <option value="">Chọn nguồn biết đến ChronoFlow</option>
              {SOURCE_CHANNEL_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </FieldCard>
        </div>

        {shouldShowCompanyFields ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <FieldCard
              icon={<Building2 className="h-5 w-5" />}
              label="Tên công ty / tổ chức"
              hint="Dùng khi bạn demo hoặc tiếp cận nhóm doanh nghiệp."
            >
              <input
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Tên công ty / tổ chức"
                className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
              />
            </FieldCard>

            <FieldCard
              icon={<User2 className="h-5 w-5" />}
              label="Vai trò"
              hint="Ví dụ: Founder, HR, Marketing, Sinh viên..."
            >
              <input
                type="text"
                value={roleInCompany}
                onChange={(event) => setRoleInCompany(event.target.value)}
                placeholder="Vai trò của bạn"
                className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
              />
            </FieldCard>

            <FieldCard
              icon={<Users className="h-5 w-5" />}
              label="Số người trong team"
              hint="Dùng để thống kê business/customer size."
            >
              <input
                type="number"
                min={0}
                value={teamSize}
                onChange={(event) => setTeamSize(event.target.value)}
                placeholder="VD: 10"
                className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
              />
            </FieldCard>
          </div>
        ) : null}

        <label className="mt-4 flex gap-3 rounded-[22px] border border-[#EEE9FF] bg-white px-4 py-3 text-[13px] leading-6 text-[#5B566E]">
          <input
            type="checkbox"
            checked={consentForResearch}
            onChange={(event) => setConsentForResearch(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#DCD3FF] text-[#6F59FF]"
          />
          <span>
            Tôi đồng ý cho ChronoFlow sử dụng dữ liệu đăng ký, nguồn biết đến
            sản phẩm và phản hồi ẩn danh cho báo cáo học phần/pitching.
          </span>
        </label>
      </section>

      {error ? <Alert tone="error">{error}</Alert> : null}

      {success ? (
        <Alert tone="success">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </Alert>
      ) : null}

      <section className="rounded-[30px] border border-[#EEE9FF] bg-[#FCFBFF] p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
              Lưu thay đổi
            </div>
            <p className="mt-2 max-w-[620px] text-[13px] leading-7 text-[#6B647C]">
              Sau khi lưu, ChronoFlow sẽ cập nhật hồ sơ và dùng dữ liệu này để
              tổng hợp customer records, source records và feedback evidence.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(26,21,40,0.14)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Lưu thông tin
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-[#EEE9FF] bg-white px-6 text-[14px] font-black text-[#1A1528] shadow-sm transition hover:bg-[#F8F6FF]"
            >
              <LogOut className="h-4 w-4 text-[#6F59FF]" />
              Đăng xuất
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}

function FieldCard({
  icon,
  label,
  hint,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-[#EEE9FF] bg-[#FCFBFF] p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F2EEFF] text-[#6F59FF]">
          {icon}
        </div>
        <div>
          <div className="text-[14px] font-black tracking-tight text-[#1A1528]">
            {label}
          </div>
          <div className="mt-1 text-[12px] leading-6 text-[#6B647C]">
            {hint}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Alert({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mt-3 flex items-center gap-2 rounded-2xl border px-4 py-3 text-[13px] font-semibold ${
        tone === "success"
          ? "border-[#DDF5E7] bg-[#F1FFF7] text-[#23965F]"
          : "border-[#FFD8D8] bg-[#FFF7F7] text-[#B42318]"
      }`}
    >
      {children}
    </div>
  );
}