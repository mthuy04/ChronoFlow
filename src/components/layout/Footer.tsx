import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

const LOGO_SRC = "/images/logo-dark.png";
const CONTACT_EMAIL = "chronoflowvn@gmail.com";
const CONTACT_PHONE = "0812467168";

const FACEBOOK_URL =
  "https://www.facebook.com/share/1AeE7xnNaM/?mibextid=wwXIfr";

const INSTAGRAM_URL =
  "https://www.instagram.com/chronoflow.app?igsh=MTh2NXRlMjUwenYweg==";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,#232846_0%,#1E223D_100%)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[10%] h-[220px] w-[220px] rounded-full bg-[#6F59FF]/12 blur-[110px]" />
        <div className="absolute right-[-6%] top-[8%] h-[220px] w-[220px] rounded-full bg-[#4DA8FF]/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.9fr_0.7fr_0.7fr_0.7fr]">
          <div>
          <div className="flex items-center">
          <Link href="/" className="block w-fit" aria-label="ChronoFlow home">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src="/images/logo-dark.png"
    alt="ChronoFlow"
    className="h-auto w-[300px] object-contain md:w-[330px]"
  />
</Link>
</div>
<p className="mt-4 max-w-md text-[15px] leading-8 text-white/68">
              ChronoFlow giúp sinh viên và người làm việc tri thức hiểu nhịp năng
              lượng của mình, từ đó sắp xếp tập trung, hồi phục và lịch trình hằng
              ngày theo cách thực tế hơn.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-[#8B7CF6]" />
                Nhịp riêng, kế hoạch đúng
              </div>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/72 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
              >
                <Mail className="h-4 w-4 text-[#4DA8FF]" />
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="mt-8 max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_16px_36px_rgba(0,0,0,0.14)] backdrop-blur-md">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
                Theo dõi ChronoFlow
              </div>

              <p className="mb-4 text-[14px] leading-7 text-white/68">
                Nhận cập nhật sản phẩm, bài viết mới và nội dung hữu ích về nhịp
                sinh học và lập kế hoạch bền vững.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full rounded-full border border-white/10 bg-white px-4 py-3 text-[#2F2B3A] outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="rounded-full bg-[linear-gradient(135deg,#6F59FF_0%,#8B7CF6_45%,#4DA8FF_100%)] px-5 py-3 font-medium text-white shadow-[0_12px_24px_rgba(111,89,255,0.28)] transition-all hover:scale-[1.02]"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
              Sản phẩm
            </h3>

            <div className="space-y-3 text-[15px] text-white/72">
              <Link href="/" className="block transition-colors hover:text-white">
                Trang chủ
              </Link>
              <Link
                href="/assessment"
                className="block transition-colors hover:text-white"
              >
                Bài đánh giá
              </Link>
              <Link
                href="/chronotypes"
                className="block transition-colors hover:text-white"
              >
                Chronotypes
              </Link>
              <Link
                href="/planner"
                className="block transition-colors hover:text-white"
              >
                Planner
              </Link>
              <Link
                href="/dashboard"
                className="block transition-colors hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
              Kiến thức
            </h3>

            <div className="space-y-3 text-[15px] text-white/72">
              <Link href="/learn" className="block transition-colors hover:text-white">
                Bài viết
              </Link>
              <Link
                href="/how-it-works"
                className="block transition-colors hover:text-white"
              >
                Cách hoạt động
              </Link>
              <Link href="/faq" className="block transition-colors hover:text-white">
                FAQ
              </Link>
              <Link
                href="/rhythm"
                className="block transition-colors hover:text-white"
              >
                Nhịp sinh học
              </Link>
              <Link
                href="/chrono-kit"
                className="block transition-colors hover:text-white"
              >
                Chrono Kit
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
              Tài khoản
            </h3>

            <div className="space-y-3 text-[15px] text-white/72">
              <Link
                href="/auth/login"
                className="block transition-colors hover:text-white"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/signup"
                className="block transition-colors hover:text-white"
              >
                Đăng ký
              </Link>
              <Link
                href="/profile"
                className="block transition-colors hover:text-white"
              >
                Hồ sơ
              </Link>
              <Link
                href="/contact"
                className="block transition-colors hover:text-white"
              >
                Liên hệ
              </Link>
            </div>

            <div className="mt-8">
              <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                Kết nối
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>

                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                  aria-label="Phone"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/45">
            © 2026 ChronoFlow. Thiết kế để lập kế hoạch thuận theo nhịp sinh học.
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/50">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Chính sách riêng tư
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Điều khoản
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}