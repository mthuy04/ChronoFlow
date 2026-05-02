"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareHeart,
  Send,
  Sparkles,
  Star,
  User2,
  Users,
  Megaphone,
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

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [userType, setUserType] = useState<CustomerType | "">("");
  const [sourceChannel, setSourceChannel] = useState<SourceChannel | "">("");
  const [whatWorked, setWhatWorked] = useState("");
  const [whatConfused, setWhatConfused] = useState("");
  const [featureRequest, setFeatureRequest] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [testimonialConsent, setTestimonialConsent] = useState(true);
  const [contactConsent, setContactConsent] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!whatWorked.trim() || whatWorked.trim().length < 5) {
      setError("Bạn giúp mình ghi ít nhất một điều bạn thấy hữu ích nha.");
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
          name,
          email,
          rating,
          userType: userType || null,
          sourceChannel: sourceChannel || null,
          whatWorked,
          whatConfused,
          featureRequest,
          wouldRecommend,
          testimonialConsent,
          contactConsent,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setError(data?.error || "Không thể gửi feedback.");
        return;
      }

      setSuccess(
        data.message ||
          "Cảm ơn bạn đã gửi feedback. Phản hồi này giúp ChronoFlow cải thiện sản phẩm và có minh chứng tốt hơn cho pitching.",
      );

      setWhatWorked("");
      setWhatConfused("");
      setFeatureRequest("");
    } catch {
      setError("Có lỗi xảy ra khi gửi feedback.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] text-[#1A1528] selection:bg-[#6F59FF]/20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -left-[12%] top-[8%] h-[460px] w-[460px] rounded-full bg-[#DCCEFF]/55 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[12%] top-[16%] h-[460px] w-[460px] rounded-full bg-[#D9EAFF]/60 blur-[130px]" />

      <section className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-8">
        <div className="overflow-hidden rounded-[42px] border border-white bg-white/72 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[52px]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_45%,#DCD1FF_100%)] p-6 md:p-8 lg:p-10">
              <div className="pointer-events-none absolute left-[10%] top-[8%] h-36 w-36 rounded-full bg-white/20 blur-3xl" />
              <div className="pointer-events-none absolute right-[8%] top-[20%] h-32 w-32 rounded-full bg-[#D9EAFF]/70 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  ChronoFlow Feedback
                </div>

                <h1 className="mt-5 max-w-[620px] text-[clamp(2.4rem,5vw,4.4rem)] font-black leading-[0.98] tracking-[-0.055em] text-[#1A1528]">
                  Gửi feedback giúp tụi mình cải thiện sản phẩm.
                </h1>

                <p className="mt-5 max-w-[560px] text-[15px] font-medium leading-8 text-[#5B566E]">
                  Phản hồi của bạn sẽ giúp ChronoFlow điều chỉnh tính năng theo
                  nhu cầu thật và tạo minh chứng người dùng cho buổi pitching.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<MessageSquareHeart className="h-5 w-5" />}
                    title="Feedback thật"
                    text="Dùng để cải thiện sản phẩm sau mỗi lần gặp người dùng."
                  />
                  <InfoCard
                    icon={<Users className="h-5 w-5" />}
                    title="Customer record"
                    text="Ghi nhận nhóm khách hàng, nguồn biết đến sản phẩm và nhu cầu."
                  />
                </div>

                <div className="mt-8 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(111,89,255,0.10)] backdrop-blur-md">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                    Dùng cho pitching
                  </div>
                  <p className="mt-2 text-[13px] leading-7 text-[#5B566E]">
                    Nếu bạn đồng ý, ChronoFlow có thể dùng feedback ẩn danh hoặc
                    trích dẫn ngắn trong báo cáo/pitching. Bạn vẫn có thể gửi
                    feedback mà không đồng ý trích dẫn.
                  </p>
                </div>
              </div>
            </aside>

            <section className="p-6 md:p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                    Feedback form
                  </div>
                  <h2 className="mt-2 text-[1.8rem] font-black tracking-tight text-[#1A1528]">
                    Trải nghiệm của bạn với ChronoFlow
                  </h2>
                  <p className="mt-2 text-[13px] leading-7 text-[#6B647C]">
                    Form này mất khoảng 1–2 phút. Càng cụ thể càng giúp tụi mình
                    cải thiện đúng nhu cầu hơn.
                  </p>
                </div>

                <section className="rounded-[30px] border border-[#EEE9FF] bg-[#FCFBFF] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F2EEFF] text-[#6F59FF]">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[14px] font-black text-[#1A1528]">
                        Bạn đánh giá ChronoFlow mấy điểm?
                      </div>
                      <div className="text-[12px] leading-6 text-[#6B647C]">
                        1 là chưa phù hợp, 5 là rất hữu ích.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-[15px] font-black transition ${
                          rating === value
                            ? "bg-[#1A1528] text-white shadow-[0_14px_30px_rgba(26,21,40,0.14)]"
                            : "border border-[#EEE9FF] bg-white text-[#6B647C] hover:bg-[#F8F6FF]"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <InputCard
                    icon={<User2 className="h-5 w-5" />}
                    label="Tên của bạn"
                    hint="Không bắt buộc nếu bạn đã đăng nhập."
                  >
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nhập tên"
                      className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
                    />
                  </InputCard>

                  <InputCard
                    icon={<User2 className="h-5 w-5" />}
                    label="Email"
                    hint="Không bắt buộc, dùng nếu bạn muốn tụi mình follow-up."
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="email@example.com"
                      className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
                    />
                  </InputCard>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <InputCard
                    icon={<Users className="h-5 w-5" />}
                    label="Bạn thuộc nhóm khách hàng nào?"
                    hint="Giúp ChronoFlow hiểu feedback đến từ nhóm nào."
                  >
                    <select
                      value={userType}
                      onChange={(event) =>
                        setUserType(event.target.value as CustomerType | "")
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
                  </InputCard>

                  <InputCard
                    icon={<Megaphone className="h-5 w-5" />}
                    label="Bạn biết ChronoFlow qua đâu?"
                    hint="Giúp tụi mình đo hiệu quả marketing."
                  >
                    <select
                      value={sourceChannel}
                      onChange={(event) =>
                        setSourceChannel(event.target.value as SourceChannel | "")
                      }
                      className="h-12 w-full rounded-2xl border border-[#EEE9FF] bg-white px-4 text-[14px] font-semibold text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
                    >
                      <option value="">Chọn nguồn</option>
                      {SOURCE_CHANNEL_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </InputCard>
                </section>

                <TextAreaCard
                  label="Điều bạn thấy hữu ích nhất là gì?"
                  required
                  value={whatWorked}
                  onChange={setWhatWorked}
                  placeholder="Ví dụ: mình thích phần planner theo nhịp năng lượng vì..."
                />

                <TextAreaCard
                  label="Có phần nào gây khó hiểu hoặc chưa mượt không?"
                  value={whatConfused}
                  onChange={setWhatConfused}
                  placeholder="Ví dụ: phần assessment hơi dài, hoặc dashboard cần giải thích rõ hơn..."
                />

                <TextAreaCard
                  label="Bạn muốn ChronoFlow cải thiện/thêm tính năng gì?"
                  value={featureRequest}
                  onChange={setFeatureRequest}
                  placeholder="Ví dụ: nhắc lịch, export weekly report, mode dành cho team..."
                />

                <section className="space-y-3 rounded-[30px] border border-[#EEE9FF] bg-[#FCFBFF] p-5">
                  <CheckboxRow
                    checked={wouldRecommend}
                    onChange={setWouldRecommend}
                    label="Tôi có thể giới thiệu ChronoFlow cho bạn bè/đồng nghiệp nếu sản phẩm tiếp tục hoàn thiện."
                  />

                  <CheckboxRow
                    checked={testimonialConsent}
                    onChange={setTestimonialConsent}
                    label="Tôi đồng ý cho ChronoFlow sử dụng feedback này trong báo cáo/pitching dưới dạng ẩn danh hoặc trích dẫn ngắn."
                  />

                  <CheckboxRow
                    checked={contactConsent}
                    onChange={setContactConsent}
                    label="Tôi đồng ý để ChronoFlow liên hệ lại nếu cần hỏi thêm về feedback."
                  />
                </section>

                {error ? (
                  <div className="rounded-2xl border border-[#FFD8D8] bg-[#FFF7F7] px-4 py-3 text-[13px] font-semibold text-[#B42318]">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-2xl border border-[#DDF5E7] bg-[#F1FFF7] px-4 py-3 text-[13px] font-semibold text-[#23965F]">
                    {success}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(26,21,40,0.14)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Đang gửi..." : "Gửi feedback"}
                  </button>

                  <Link
                    href="/dashboard"
                    className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-[#EEE9FF] bg-white px-6 text-[14px] font-black text-[#1A1528] transition hover:bg-[#F8F6FF]"
                  >
                    Về dashboard
                    <ArrowRight className="h-4 w-4 text-[#6F59FF]" />
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/80 bg-white/75 p-5 shadow-[0_14px_34px_rgba(26,21,40,0.05)] backdrop-blur-md">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#F2EEFF] text-[#6F59FF]">
        {icon}
      </div>
      <div className="text-[15px] font-black text-[#1A1528]">{title}</div>
      <p className="mt-2 text-[13px] leading-7 text-[#5B566E]">{text}</p>
    </div>
  );
}

function InputCard({
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

function TextAreaCard({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block rounded-[26px] border border-[#EEE9FF] bg-[#FCFBFF] p-5">
      <div className="text-[14px] font-black tracking-tight text-[#1A1528]">
        {label} {required ? <span className="text-[#6F59FF]">*</span> : null}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 min-h-[110px] w-full resize-none rounded-2xl border border-[#EEE9FF] bg-white px-4 py-3 text-[14px] font-semibold leading-7 text-[#1A1528] outline-none transition focus:border-[#6F59FF] focus:ring-4 focus:ring-[#6F59FF]/10"
      />
    </label>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex gap-3 rounded-[22px] border border-[#EEE9FF] bg-white px-4 py-3 text-[13px] leading-6 text-[#5B566E]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-[#DCD3FF] text-[#6F59FF]"
      />
      <span>{label}</span>
    </label>
  );
}