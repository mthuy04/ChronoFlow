"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Camera,
  CheckCircle2,
  Loader2,
  LogOut,
  MoonStar,
  Save,
  Upload,
  User2,
  X,
} from "lucide-react";

type Props = {
  initialName: string;
  initialStudentId: string | null;
  initialTargetSleepTime: string | null;
  initialTargetWakeTime: string | null;
  initialImage?: string | null;
};

export default function ProfileEditForm({
  initialName,
  initialStudentId,
  initialTargetSleepTime,
  initialTargetWakeTime,
  initialImage = null,
}: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialName || "");
  const [studentId, setStudentId] = useState(initialStudentId || "");
  const [targetSleepTime, setTargetSleepTime] = useState(initialTargetSleepTime || "");
  const [targetWakeTime, setTargetWakeTime] = useState(initialTargetWakeTime || "");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialImage || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const displayAvatar = previewUrl || avatarUrl || null;
  const fallbackLetter = (name.trim().charAt(0) || "C").toUpperCase();

  const resetAvatarMessages = () => {
    setAvatarError("");
    setAvatarSuccess("");
  };

  const handleChooseFile = () => {
    resetAvatarMessages();
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetAvatarMessages();

    const file = e.target.files?.[0];
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
  };

  const handleCancelPreview = () => {
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
  };

  const handleUploadAvatar = async () => {
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

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAvatarError(data.error || "Không thể upload avatar.");
        return;
      }

      const newImage = data.image as string;
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
    } catch (err) {
      setAvatarError("Có lỗi xảy ra khi upload avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Tên không được để trống.");
      return;
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trimmedName,
        studentId: studentId.trim(),
        targetSleepTime: targetSleepTime || null,
        targetWakeTime: targetWakeTime || null,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.error || "Không thể cập nhật hồ sơ.");
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
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <FieldCard
          icon={<Camera className="h-5 w-5" />}
          label="Ảnh đại diện"
          hint="Chọn ảnh JPG, PNG hoặc WEBP. Dung lượng tối đa 5MB."
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-[34px] font-black text-white shadow-[0_16px_34px_rgba(97,76,197,0.22)]">
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

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#E9E5FF] bg-white px-5 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
                >
                  <Upload className="h-4 w-4" />
                  Chọn ảnh
                </button>

                <button
                  type="button"
                  onClick={handleUploadAvatar}
                  disabled={!selectedFile || isUploadingAvatar}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-5 text-[14px] font-semibold text-white shadow-[0_16px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
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
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-5 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
                  >
                    <X className="h-4 w-4" />
                    Huỷ chọn
                  </button>
                ) : null}
              </div>

              <div className="mt-3 text-[13px] leading-6 text-[#615C7A]">
                {selectedFile
                  ? `Ảnh đã chọn: ${selectedFile.name}`
                  : "Bạn có thể đổi avatar bất cứ lúc nào."}
              </div>

              {avatarError ? (
                <div className="mt-3 rounded-[18px] border border-[#F8D7DA] bg-[#FFF5F6] px-4 py-3 text-[14px] font-medium text-[#B42318]">
                  {avatarError}
                </div>
              ) : null}

              {avatarSuccess ? (
                <div className="mt-3 flex items-center gap-2 rounded-[18px] border border-[#DDF5E7] bg-[#F3FFF8] px-4 py-3 text-[14px] font-medium text-[#2E7C59]">
                  <CheckCircle2 className="h-4 w-4" />
                  {avatarSuccess}
                </div>
              ) : null}
            </div>
          </div>
        </FieldCard>

        <FieldCard
          icon={<User2 className="h-5 w-5" />}
          label="Họ và tên"
          hint="Tên hiển thị trong dashboard, profile và các phần cá nhân hóa."
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ và tên"
            className="w-full rounded-2xl border border-[#E9E5FF] bg-white px-4 py-3 text-[15px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#7C5CFA]/10"
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
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập mã sinh viên"
            className="w-full rounded-2xl border border-[#E9E5FF] bg-white px-4 py-3 text-[15px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#7C5CFA]/10"
          />
        </FieldCard>

        <div className="grid gap-5 md:grid-cols-2">
          <FieldCard
            icon={<MoonStar className="h-5 w-5" />}
            label="Giờ ngủ mục tiêu"
            hint="Giúp ChronoFlow hiểu rõ hơn nhịp nghỉ ngơi mong muốn."
          >
            <input
              type="time"
              value={targetSleepTime}
              onChange={(e) => setTargetSleepTime(e.target.value)}
              className="w-full rounded-2xl border border-[#E9E5FF] bg-white px-4 py-3 text-[15px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#7C5CFA]/10"
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
              onChange={(e) => setTargetWakeTime(e.target.value)}
              className="w-full rounded-2xl border border-[#E9E5FF] bg-white px-4 py-3 text-[15px] font-medium text-[#241F3D] outline-none transition focus:border-[#7C5CFA] focus:ring-4 focus:ring-[#7C5CFA]/10"
            />
          </FieldCard>
        </div>

        {error ? (
          <div className="rounded-[22px] border border-[#F8D7DA] bg-[#FFF5F6] px-4 py-3 text-[14px] font-medium text-[#B42318]">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="flex items-center gap-2 rounded-[22px] border border-[#DDF5E7] bg-[#F3FFF8] px-4 py-3 text-[14px] font-medium text-[#2E7C59]">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        ) : null}
      </div>

      <div className="h-fit rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] p-5 shadow-[0_16px_34px_rgba(97,76,197,0.05)]">
        <div className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
          Lưu thay đổi
        </div>

        <div className="space-y-3 text-[13px] leading-7 text-[#615C7A]">
          <p>
            Sau khi lưu, dashboard, profile và Navbar sẽ dùng thông tin mới nhất của bạn.
          </p>
          <p>
            Avatar upload xong sẽ cập nhật ngay ở menu user trên Navbar.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_16px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
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
          className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-6 text-[14px] font-semibold text-[#241F3D] shadow-sm transition hover:bg-[#fafafe]"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
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
    <div className="rounded-[30px] border border-white/80 bg-white/84 p-5 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA] shadow-sm">{icon}</div>
        <div>
          <div className="text-[15px] font-black tracking-tight text-[#241F3D]">{label}</div>
          <div className="mt-1 text-[13px] leading-6 text-[#615C7A]">{hint}</div>
        </div>
      </div>
      {children}
    </div>
  );
}