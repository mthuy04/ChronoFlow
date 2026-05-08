import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | ChronoFlow",
  description:
    "Chính sách bảo mật của ChronoFlow: cách thu thập, sử dụng, bảo vệ và quản lý dữ liệu người dùng.",
};

const lastUpdated = "08/05/2026";

const summaryItems = [
  {
    icon: UserRound,
    title: "Dữ liệu tài khoản",
    text: "ChronoFlow lưu thông tin cơ bản như tên, email, hồ sơ chronotype và tuỳ chọn cá nhân để vận hành sản phẩm.",
  },
  {
    icon: Database,
    title: "Dữ liệu sử dụng",
    text: "Task, focus session, energy check-in, coin và reward được dùng để cá nhân hoá trải nghiệm và tạo insight.",
  },
  {
    icon: Lock,
    title: "Bảo vệ dữ liệu",
    text: "Dữ liệu được kiểm soát bằng cơ chế xác thực, phân quyền và chỉ dùng cho mục đích vận hành ChronoFlow.",
  },
];

const sections = [
  {
    id: "data-we-collect",
    title: "1. Dữ liệu ChronoFlow thu thập",
    body: [
      "Khi bạn tạo tài khoản hoặc sử dụng ChronoFlow, hệ thống có thể thu thập các thông tin như họ tên, email, mã sinh viên nếu bạn tự cung cấp, ảnh đại diện, nhóm người dùng, nguồn biết đến sản phẩm và các tuỳ chọn cá nhân.",
      "Khi bạn làm assessment, ChronoFlow lưu kết quả chronotype, điểm số theo từng nhóm và thời điểm hoàn thành bài đánh giá.",
      "Khi bạn sử dụng planner, dashboard, rhythm hoặc rewards, hệ thống có thể lưu task, lịch làm việc, trạng thái hoàn thành, focus session, energy check-in, coin balance, giao dịch coin và yêu cầu đổi quà.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "2. Cách ChronoFlow sử dụng dữ liệu",
    body: [
      "ChronoFlow dùng dữ liệu để hiển thị hồ sơ cá nhân, cá nhân hoá planner theo chronotype, tính toán insight, ghi nhận tiến độ, vận hành coin/reward và cải thiện trải nghiệm sản phẩm.",
      "Thông tin marketing như nguồn biết đến ChronoFlow hoặc nhóm người dùng được dùng để hiểu hiệu quả tiếp cận, phục vụ báo cáo dự án và cải thiện định vị sản phẩm.",
      "Dữ liệu liên hệ hoặc feedback được dùng để phản hồi yêu cầu hỗ trợ, tổng hợp góp ý và ưu tiên phát triển tính năng.",
    ],
  },
  {
    id: "cookies-analytics",
    title: "3. Cookies, analytics và tracking",
    body: [
      "ChronoFlow có thể sử dụng công cụ analytics như Google Analytics, Microsoft Clarity hoặc Meta Pixel để hiểu hành vi sử dụng ở mức tổng quan.",
      "Các công cụ này có thể ghi nhận thông tin kỹ thuật như thiết bị, trình duyệt, trang đã xem, thời gian tương tác hoặc sự kiện chuyển đổi. ChronoFlow dùng dữ liệu này để cải thiện giao diện, nội dung và luồng sản phẩm.",
      "Bạn có thể kiểm soát cookies hoặc tracking thông qua cài đặt trình duyệt và các công cụ chặn tracking hợp lệ.",
    ],
  },
  {
    id: "sharing",
    title: "4. Chia sẻ dữ liệu",
    body: [
      "ChronoFlow không bán dữ liệu cá nhân của bạn.",
      "Dữ liệu chỉ có thể được chia sẻ với nhà cung cấp hạ tầng, email, analytics, lưu trữ hoặc thanh toán nếu việc đó cần thiết để vận hành sản phẩm.",
      "Trong trường hợp pháp luật yêu cầu, ChronoFlow có thể phải cung cấp thông tin cần thiết cho cơ quan có thẩm quyền.",
    ],
  },
  {
    id: "retention",
    title: "5. Thời gian lưu trữ",
    body: [
      "ChronoFlow lưu dữ liệu trong thời gian tài khoản còn hoạt động hoặc trong khoảng thời gian cần thiết để vận hành dịch vụ, xử lý hỗ trợ, đảm bảo an toàn hệ thống và đáp ứng nghĩa vụ pháp lý nếu có.",
      "Một số dữ liệu tổng hợp hoặc đã ẩn danh có thể được giữ lại để phân tích sản phẩm mà không định danh trực tiếp người dùng.",
    ],
  },
  {
    id: "rights",
    title: "6. Quyền của bạn",
    body: [
      "Bạn có thể yêu cầu xem, cập nhật hoặc xoá một số dữ liệu cá nhân bằng cách liên hệ ChronoFlow.",
      "Bạn có thể chỉnh sửa thông tin hồ sơ và cài đặt cá nhân trong trang Profile hoặc Settings nếu tính năng đó đã được bật.",
      "Nếu bạn muốn xoá tài khoản hoặc dữ liệu liên quan, ChronoFlow sẽ xử lý trong phạm vi kỹ thuật và pháp lý cho phép.",
    ],
  },
  {
    id: "security",
    title: "7. Bảo mật",
    body: [
      "ChronoFlow áp dụng các biện pháp hợp lý để bảo vệ dữ liệu, bao gồm xác thực người dùng, kiểm soát truy cập và giới hạn dữ liệu trả về qua API.",
      "Tuy vậy, không có hệ thống nào an toàn tuyệt đối. Bạn nên giữ bảo mật email, mật khẩu và thiết bị cá nhân của mình.",
    ],
  },
  {
    id: "contact",
    title: "8. Liên hệ về quyền riêng tư",
    body: [
      "Nếu bạn có câu hỏi về chính sách bảo mật, dữ liệu cá nhân hoặc yêu cầu xoá/cập nhật dữ liệu, vui lòng liên hệ ChronoFlow qua trang Contact.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F4FB] text-[#1A1528]">
      <section className="relative border-b border-white/70 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(111,89,255,0.18),transparent_32%),radial-gradient(circle_at_85%_5%,rgba(77,168,255,0.16),transparent_30%),linear-gradient(180deg,#F7F4FB_0%,#FFFFFF_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E2FF] bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Privacy Policy
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-[clamp(2.5rem,7vw,5.8rem)] font-black leading-[0.95] tracking-tight text-[#1A1528]">
                Chính sách bảo mật ChronoFlow
              </h1>
              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-[#5B566E] md:text-lg">
                Tài liệu này giải thích cách ChronoFlow thu thập, sử dụng, lưu
                trữ và bảo vệ dữ liệu của bạn khi bạn sử dụng website, tài khoản,
                planner, assessment, rhythm, rewards và các tính năng liên quan.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1A1528] px-6 text-sm font-bold text-white shadow-[0_14px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5"
                >
                  Liên hệ hỗ trợ
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#E8E2FF] bg-white px-6 text-sm font-bold text-[#1A1528] transition hover:bg-[#F9F7FF]"
                >
                  Xem điều khoản
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white bg-white/85 p-5 shadow-[0_24px_80px_rgba(26,21,40,0.08)] backdrop-blur">
              <div className="rounded-[22px] bg-[#1A1528] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5 text-[#86D7FF]" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">
                      Last updated
                    </p>
                    <p className="text-lg font-black">{lastUpdated}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {summaryItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                      >
                        <div className="flex gap-3">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#86D7FF]" />
                          <div>
                            <h2 className="text-sm font-black">{item.title}</h2>
                            <p className="mt-1 text-sm leading-6 text-white/68">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-32 rounded-[24px] border border-[#E8E2FF] bg-white p-4 shadow-[0_18px_50px_rgba(26,21,40,0.05)]">
              <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#8A84A3]">
                Nội dung
              </p>
              <nav className="mt-2 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-2xl px-3 py-2 text-sm font-bold text-[#5B566E] transition hover:bg-[#F7F4FF] hover:text-[#6F59FF]"
                  >
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-[#E8E2FF] bg-white p-6 shadow-[0_18px_50px_rgba(26,21,40,0.05)] md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EEFF] text-[#6F59FF]">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1A1528]">
                    Tóm tắt nhanh
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-7 text-[#5B566E]">
                    ChronoFlow chỉ nên thu thập dữ liệu cần thiết để vận hành sản
                    phẩm, cá nhân hoá planner và hỗ trợ người dùng. Dữ liệu không
                    được bán cho bên thứ ba.
                  </p>
                </div>
              </div>
            </div>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32 rounded-[28px] border border-[#E8E2FF] bg-white p-6 shadow-[0_18px_50px_rgba(26,21,40,0.05)] md:p-8"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#16A085]" />
                  <div>
                    <h2 className="text-xl font-black text-[#1A1528] md:text-2xl">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.body.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-sm font-medium leading-7 text-[#5B566E] md:text-[15px]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            <div className="rounded-[28px] border border-[#E8E2FF] bg-[#1A1528] p-6 text-white shadow-[0_24px_80px_rgba(26,21,40,0.12)] md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white/60">
                    <Mail className="h-3.5 w-3.5" />
                    Privacy request
                  </div>
                  <h2 className="mt-4 text-2xl font-black">
                    Cần hỏi thêm về dữ liệu?
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/68">
                    Gửi yêu cầu qua trang Contact để ChronoFlow hỗ trợ kiểm tra,
                    cập nhật hoặc xoá dữ liệu theo phạm vi có thể xử lý.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#1A1528] transition hover:bg-[#F3F0FF]"
                >
                  Mở Contact
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <p className="px-2 text-xs font-medium leading-6 text-[#8A84A3]">
              Chính sách này không phải tư vấn pháp lý. Nội dung có thể được cập
              nhật khi ChronoFlow thay đổi tính năng, hạ tầng hoặc yêu cầu vận
              hành.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
