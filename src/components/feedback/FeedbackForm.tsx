"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MessageCircleHeart,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Users,
  WandSparkles,
} from "lucide-react";

type UserType =
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

type FeedbackPayload = {
  name: string;
  email: string;
  rating: number;
  userType: UserType | "";
  sourceChannel: SourceChannel | "";
  whatWorked: string;
  whatConfused: string;
  featureRequest: string;
  wouldRecommend: boolean;
  testimonialConsent: boolean;
  contactConsent: boolean;
};

type FeedbackApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

const USER_TYPE_OPTIONS: Array<{ value: UserType; label: string }> = [
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

const RATING_LABELS: Record<number, string> = {
  1: "Chưa tốt",
  2: "Cần cải thiện",
  3: "Ổn",
  4: "Tốt",
  5: "Rất hữu ích",
};

const initialPayload: FeedbackPayload = {
  name: "",
  email: "",
  rating: 5,
  userType: "",
  sourceChannel: "",
  whatWorked: "",
  whatConfused: "",
  featureRequest: "",
  wouldRecommend: true,
  testimonialConsent: false,
  contactConsent: true,
};

export default function FeedbackForm() {
  const [form, setForm] = useState<FeedbackPayload>(initialPayload);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ratingLabel = useMemo(() => {
    return RATING_LABELS[form.rating] ?? "Rất hữu ích";
  }, [form.rating]);

  const canSubmit = useMemo(() => {
    return (
      form.rating >= 1 &&
      form.rating <= 5 &&
      form.whatWorked.trim().length >= 8 &&
      !isSubmitting
    );
  }, [form.rating, form.whatWorked, isSubmitting]);

  function updateForm<K extends keyof FeedbackPayload>(
    key: K,
    value: FeedbackPayload[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(initialPayload);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (form.whatWorked.trim().length < 8) {
      setErrorMessage("Bạn chia sẻ thêm một chút về trải nghiệm hữu ích nhất nhé.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizeOptionalString(form.name),
          email: normalizeOptionalString(form.email),
          rating: form.rating,
          userType: form.userType || null,
          sourceChannel: form.sourceChannel || null,
          whatWorked: form.whatWorked.trim(),
          whatConfused: normalizeOptionalString(form.whatConfused),
          featureRequest: normalizeOptionalString(form.featureRequest),
          wouldRecommend: form.wouldRecommend,
          testimonialConsent: form.testimonialConsent,
          contactConsent: form.contactConsent,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | FeedbackApiResponse
        | null;

      if (!response.ok || !data?.success) {
        setErrorMessage(
          data?.error ||
            data?.message ||
            "Không thể gửi feedback lúc này. Bạn thử lại sau nhé.",
        );
        return;
      }

      setSuccessMessage(
        data.message ||
          "Cảm ơn bạn rất nhiều. Feedback đã được gửi tới ChronoFlow rồi.",
      );

      window.dispatchEvent(
        new CustomEvent("chronoflow:analytics", {
          detail: {
            event: "feedback_submitted",
            rating: form.rating,
            userType: form.userType,
            sourceChannel: form.sourceChannel,
            wouldRecommend: form.wouldRecommend,
          },
        }),
      );

      resetForm();
    } catch (error) {
      console.error("[FEEDBACK_FORM]", error);
      setErrorMessage("Có lỗi kết nối khi gửi feedback. Bạn thử lại giúp mình nhé.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[38px] border border-white/80 bg-white/86 p-5 shadow-[0_24px_70px_rgba(26,21,40,0.07)] backdrop-blur-2xl md:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D9EAFF]/60 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#DCCEFF]/55 blur-[90px]" />

      <div className="relative z-10">
        <div className="mb-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
            <MessageCircleHeart className="h-3.5 w-3.5" />
            Feedback form
          </div>

          <h2 className="text-[clamp(1.7rem,3vw,2.45rem)] font-black leading-tight tracking-[-0.035em] text-[#1A1528]">
            Chia sẻ trải nghiệm của bạn với ChronoFlow
          </h2>

          <p className="mt-3 max-w-[680px] text-[14px] font-medium leading-7 text-[#5B566E] md:text-[15px]">
            Mất khoảng 1–2 phút thôi. Feedback của bạn sẽ được gửi về email
            admin và giúp ChronoFlow cải thiện sản phẩm thật hơn.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              icon={<User className="h-4 w-4" />}
              label="Tên của bạn"
              placeholder="Ví dụ: Minh Thư"
              value={form.name}
              onChange={(value) => updateForm("name", value)}
            />

            <InputField
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              type="email"
              placeholder="Email để ChronoFlow liên hệ lại nếu cần"
              value={form.email}
              onChange={(value) => updateForm("email", value)}
            />
          </div>

          <div className="rounded-[28px] border border-[#E9E5FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F6FF_100%)] p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[13px] font-black text-[#1A1528]">
                  <Star className="h-4 w-4 text-[#F59E0B]" />
                  Bạn đánh giá trải nghiệm thế nào?
                </div>
                <p className="mt-1 text-[12px] font-medium text-[#7A728F]">
                  Chọn mức điểm phản ánh cảm nhận tổng quan của bạn.
                </p>
              </div>

              <div className="rounded-full bg-[#FFF7ED] px-4 py-2 text-[12px] font-black text-[#B77900]">
                {form.rating}/5 · {ratingLabel}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((rating) => {
                const active = form.rating >= rating;

                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => updateForm("rating", rating)}
                    className={`group flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl border text-[12px] font-black transition ${
                      active
                        ? "border-[#FFE7A8] bg-[#FFF4CC] text-[#9A6B00] shadow-[0_10px_24px_rgba(245,158,11,0.12)]"
                        : "border-[#EEF0F6] bg-white text-[#9A94B5] hover:border-[#E9E5FF] hover:bg-[#F8F6FF]"
                    }`}
                    aria-label={`Đánh giá ${rating} sao`}
                  >
                    <Star
                      className={`h-5 w-5 transition ${
                        active
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "text-[#C9C4D9] group-hover:text-[#6F59FF]"
                      }`}
                    />
                    {rating}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              icon={<Users className="h-4 w-4" />}
              label="Bạn thuộc nhóm nào?"
              value={form.userType}
              placeholder="Chọn nhóm người dùng"
              options={USER_TYPE_OPTIONS}
              onChange={(value) => updateForm("userType", value as UserType | "")}
            />

            <SelectField
              icon={<Sparkles className="h-4 w-4" />}
              label="Bạn biết ChronoFlow qua đâu?"
              value={form.sourceChannel}
              placeholder="Chọn nguồn"
              options={SOURCE_CHANNEL_OPTIONS}
              onChange={(value) =>
                updateForm("sourceChannel", value as SourceChannel | "")
              }
            />
          </div>

          <TextareaField
            icon={<MessageSquareText className="h-4 w-4" />}
            label="Điều gì hữu ích nhất với bạn?"
            required
            placeholder="Ví dụ: Mình thấy phần planner theo nhịp năng lượng giúp mình biết nên làm task khó vào lúc nào..."
            value={form.whatWorked}
            onChange={(value) => updateForm("whatWorked", value)}
            helper="Tối thiểu 8 ký tự. Đây là phần quan trọng nhất."
          />

          <TextareaField
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Điều gì còn khó hiểu hoặc chưa thuận tiện?"
            placeholder="Ví dụ: Mình chưa rõ cách đọc energy curve / phần focus session hơi khó thấy..."
            value={form.whatConfused}
            onChange={(value) => updateForm("whatConfused", value)}
          />

          <TextareaField
            icon={<WandSparkles className="h-4 w-4" />}
            label="Bạn muốn ChronoFlow thêm hoặc cải thiện tính năng gì?"
            placeholder="Ví dụ: Thêm nhắc lịch, báo cáo tuần rõ hơn, widget năng lượng..."
            value={form.featureRequest}
            onChange={(value) => updateForm("featureRequest", value)}
          />

          <div className="grid gap-3">
            <CheckboxCard
              checked={form.wouldRecommend}
              onChange={(value) => updateForm("wouldRecommend", value)}
              title="Mình có thể giới thiệu ChronoFlow cho người khác"
              description="Thông tin này giúp ChronoFlow đo mức độ hài lòng và khả năng lan truyền tự nhiên."
            />

            <CheckboxCard
              checked={form.testimonialConsent}
              onChange={(value) => updateForm("testimonialConsent", value)}
              title="Cho phép ChronoFlow dùng feedback của mình làm testimonial"
              description="Chỉ sử dụng nội dung phù hợp, không công khai thông tin nhạy cảm."
            />

            <CheckboxCard
              checked={form.contactConsent}
              onChange={(value) => updateForm("contactConsent", value)}
              title="Cho phép ChronoFlow liên hệ lại nếu cần hỏi thêm"
              description="Chỉ dùng email bạn cung cấp để follow-up về feedback hoặc trải nghiệm sản phẩm."
            />
          </div>

          {errorMessage ? (
            <div className="rounded-[22px] border border-[#FFD8D8] bg-[#FFF7F7] px-4 py-3 text-[13px] font-semibold leading-6 text-[#B42318]">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-[22px] border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3 text-[13px] font-semibold leading-6 text-[#047857]">
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="group flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-black text-white shadow-[0_18px_36px_rgba(23,19,41,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang gửi feedback...
              </>
            ) : (
              <>
                Gửi feedback
                <Send className="h-4 w-4 text-[#4DA8FF] transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <div className="flex items-start gap-3 rounded-[24px] border border-[#E9E5FF] bg-[#F8F6FF] p-4 text-[12.5px] font-medium leading-6 text-[#5B566E]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6F59FF]" />
            <p>
              Form này gửi dữ liệu tới ChronoFlow qua API nội bộ. Nếu email gửi
              thất bại, hệ thống sẽ trả lỗi để bạn có thể thử lại.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function InputField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
        {icon}
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-[56px] w-full rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 text-[14px] font-semibold text-[#1A1528] shadow-[0_8px_20px_rgba(26,21,40,0.04)] outline-none transition placeholder:text-[#A3A0B8] focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
      />
    </label>
  );
}

function SelectField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
        {icon}
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[56px] w-full rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 text-[14px] font-semibold text-[#1A1528] shadow-[0_8px_20px_rgba(26,21,40,0.04)] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
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

function TextareaField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  helper,
  required = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helper?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
        {icon}
        {label}
        {required ? <span className="text-[#F59E0B]">*</span> : null}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-2xl border border-[#E8E2FF] bg-[#FAFAFF] px-4 py-4 text-[14px] font-medium leading-7 text-[#1A1528] shadow-[0_8px_20px_rgba(26,21,40,0.04)] outline-none transition placeholder:text-[#A3A0B8] focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
      />

      {helper ? (
        <span className="mt-1.5 block text-[12px] font-medium text-[#8A84A3]">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function CheckboxCard({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-[22px] border px-4 py-3 transition ${
        checked
          ? "border-[#DCD3FF] bg-[#F8F6FF]"
          : "border-[#EEF0F6] bg-white hover:border-[#E9E5FF] hover:bg-[#FAFAFF]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-[#DCD3FF] text-[#6F59FF]"
      />

      <span>
        <span className="block text-[13px] font-black text-[#1A1528]">
          {title}
        </span>
        <span className="mt-1 block text-[12px] font-medium leading-6 text-[#6B647C]">
          {description}
        </span>
      </span>
    </label>
  );
}

function normalizeOptionalString(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}