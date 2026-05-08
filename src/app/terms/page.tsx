import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gift,
  Mail,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | ChronoFlow",
  description:
    "Điều khoản sử dụng ChronoFlow: tài khoản, dịch vụ, planner, rewards, thanh toán, nội dung và trách nhiệm người dùng.",
};

const lastUpdated = "08/05/2026";

const highlights = [
  {
    icon: UserCheck,
    title: "Tài khoản cá nhân",
    text: "Bạn chịu trách nhiệm giữ an toàn thông tin đăng nhập và các hoạt động phát sinh từ tài khoản của mình.",
  },
  {
    icon: ClipboardCheck,
    title: "Công cụ hỗ trợ",
    text: "ChronoFlow là công cụ lập kế hoạch theo chronotype, không phải dịch vụ y tế, chẩn đoán hay điều trị.",
  },
  {
    icon: Gift,
    title: "Coin & rewards",
    text: "Coin, streak và reward là cơ chế gamification nội bộ, có thể thay đổi theo chính sách vận hành.",
  },
];

const sections = [
  {
    id: "acceptance",
    title: "1. Chấp nhận điều khoản",
    body: [
      "Khi truy cập hoặc sử dụng ChronoFlow, bạn đồng ý tuân thủ các điều khoản sử dụng này và chính sách bảo mật liên quan.",
      "Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, bạn nên ngừng sử dụng ChronoFlow.",
    ],
  },
  {
    id: "service",
    title: "2. Mô tả dịch vụ",
    body: [
      "ChronoFlow là nền tảng lập kế hoạch và quản lý năng lượng dựa trên chronotype. Sản phẩm có thể bao gồm assessment, dashboard, planner, rhythm tracking, focus session, coin, rewards, nội dung học tập và planner kit vật lý.",
      "Một số tính năng có thể đang ở giai đoạn MVP, thử nghiệm hoặc demo. ChronoFlow có thể thay đổi, thêm, tạm ngừng hoặc gỡ bỏ tính năng để cải thiện sản phẩm.",
    ],
  },
  {
    id: "account",
    title: "3. Tài khoản người dùng",
    body: [
      "Bạn cần cung cấp thông tin chính xác khi đăng ký và cập nhật tài khoản. Bạn chịu trách nhiệm bảo mật email, mật khẩu và thiết bị dùng để truy cập ChronoFlow.",
      "ChronoFlow có thể từ chối, tạm khoá hoặc xoá tài khoản nếu phát hiện hành vi gian lận, phá hoại hệ thống, lạm dụng rewards hoặc vi phạm điều khoản.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Quy tắc sử dụng",
    body: [
      "Bạn không được dùng ChronoFlow để tấn công, dò quét, spam, khai thác lỗ hổng, can thiệp dữ liệu người khác hoặc gây quá tải hệ thống.",
      "Bạn không được cố tình tạo dữ liệu giả, thao túng coin/reward, khai thác bug hoặc tự động hoá hành vi bất thường nhằm nhận lợi ích không hợp lệ.",
      "Bạn không được tải lên nội dung vi phạm pháp luật, xâm phạm quyền riêng tư, xúc phạm, độc hại hoặc chứa mã nguy hiểm.",
    ],
  },
  {
    id: "health-disclaimer",
    title: "5. Không phải tư vấn y tế",
    body: [
      "ChronoFlow cung cấp thông tin và gợi ý lập kế hoạch dựa trên chronotype ở mức tham khảo. Sản phẩm không chẩn đoán rối loạn giấc ngủ, bệnh lý, sức khoẻ tâm thần hoặc tình trạng y tế.",
      "Nếu bạn có vấn đề nghiêm trọng về giấc ngủ, sức khoẻ hoặc tinh thần, bạn nên tham khảo chuyên gia phù hợp.",
    ],
  },
  {
    id: "payments",
    title: "6. Thanh toán, đơn hàng và planner kit",
    body: [
      "Một số sản phẩm hoặc gói dịch vụ của ChronoFlow có thể yêu cầu thanh toán. Giá, ưu đãi, phương thức thanh toán và phạm vi quyền lợi có thể thay đổi theo từng thời điểm.",
      "Với hình thức chuyển khoản, đơn hàng có thể cần thời gian xác minh. ChronoFlow chỉ xử lý quyền lợi hoặc giao hàng sau khi thanh toán được xác nhận hợp lệ.",
      "Với planner kit vật lý, thời gian giao hàng, tồn kho, phạm vi ship và chính sách đổi trả có thể phụ thuộc vào từng chương trình bán hàng hoặc thử nghiệm.",
    ],
  },
  {
    id: "coins-rewards",
    title: "7. Coin, streak và rewards",
    body: [
      "Coin, streak, badge và reward là tính năng gamification nhằm khuyến khích người dùng duy trì thói quen tốt. Chúng không phải tiền thật, không có giá trị quy đổi bắt buộc và không thể chuyển nhượng nếu ChronoFlow không hỗ trợ.",
      "ChronoFlow có quyền điều chỉnh cách tính coin, giới hạn đổi quà, tồn kho, điều kiện nhận reward hoặc huỷ reward nếu phát hiện lỗi hệ thống, gian lận hoặc dữ liệu không hợp lệ.",
    ],
  },
  {
    id: "content",
    title: "8. Nội dung và quyền sở hữu",
    body: [
      "Giao diện, nội dung, thiết kế, logo, mã nguồn, tài liệu, bài viết và tài sản liên quan đến ChronoFlow thuộc quyền sở hữu của ChronoFlow hoặc bên cấp phép tương ứng.",
      "Bạn không được sao chép, phân phối, bán lại hoặc khai thác thương mại nội dung của ChronoFlow nếu chưa có sự đồng ý hợp lệ.",
      "Dữ liệu bạn nhập vào tài khoản vẫn là dữ liệu của bạn, nhưng bạn cho phép ChronoFlow xử lý dữ liệu đó để vận hành và cải thiện dịch vụ theo Chính sách bảo mật.",
    ],
  },
  {
    id: "availability",
    title: "9. Tính khả dụng của dịch vụ",
    body: [
      "ChronoFlow cố gắng duy trì dịch vụ ổn định, nhưng không đảm bảo hệ thống luôn hoạt động liên tục, không lỗi hoặc không gián đoạn.",
      "Dịch vụ có thể bị ảnh hưởng bởi bảo trì, lỗi kỹ thuật, thay đổi hạ tầng, sự cố bên thứ ba hoặc các yếu tố ngoài tầm kiểm soát.",
    ],
  },
  {
    id: "liability",
    title: "10. Giới hạn trách nhiệm",
    body: [
      "ChronoFlow không chịu trách nhiệm cho quyết định cá nhân, kết quả học tập, hiệu suất công việc, sức khoẻ, tài chính hoặc tổn thất gián tiếp phát sinh từ việc sử dụng sản phẩm.",
      "Bạn sử dụng các gợi ý planner, chronotype, rhythm và insight như thông tin tham khảo, không phải cam kết kết quả.",
    ],
  },
  {
    id: "changes",
    title: "11. Thay đổi điều khoản",
    body: [
      "ChronoFlow có thể cập nhật điều khoản này khi sản phẩm, chính sách hoặc yêu cầu vận hành thay đổi.",
      "Phiên bản mới sẽ có hiệu lực khi được đăng trên website. Việc tiếp tục sử dụng ChronoFlow sau khi điều khoản thay đổi đồng nghĩa với việc bạn chấp nhận phiên bản mới.",
    ],
  },
  {
    id: "contact",
    title: "12. Liên hệ",
    body: [
      "Nếu bạn có câu hỏi về điều khoản sử dụng, thanh toán, reward hoặc quyền lợi tài khoản, vui lòng liên hệ ChronoFlow qua trang Contact.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F4FB] text-[#1A1528]">
      <section className="relative border-b border-white/70 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(22,160,133,0.16),transparent_30%),radial-gradient(circle_at_88%_4%,rgba(111,89,255,0.18),transparent_32%),linear-gradient(180deg,#F7F4FB_0%,#FFFFFF_100%)]" />

        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E2FF] bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-sm">
            <Scale className="h-4 w-4" />
            Terms of Service
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
             
              <h1 className="mb-6 text-[clamp(2.35rem,4.6vw,3.65rem)] font-[900] leading-[1.04] tracking-[-0.04em]">
              Điều khoản sử dụng {" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  ChronoFlow
                  </span>
                </h1>
              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-[#5B566E] md:text-lg">
                Điều khoản này quy định cách bạn sử dụng ChronoFlow, bao gồm tài
                khoản, assessment, planner, rhythm, rewards, thanh toán, planner
                kit và các nội dung liên quan.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/privacy"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1A1528] px-6 text-sm font-bold text-white shadow-[0_14px_34px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5"
                >
                  Xem Privacy
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#E8E2FF] bg-white px-6 text-sm font-bold text-[#1A1528] transition hover:bg-[#F9F7FF]"
                >
                  Liên hệ
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white bg-white/85 p-5 shadow-[0_24px_80px_rgba(26,21,40,0.08)] backdrop-blur">
              <div className="rounded-[22px] bg-[#1A1528] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5 text-[#A7F3D0]" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">
                      Last updated
                    </p>
                    <p className="text-lg font-black">{lastUpdated}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                      >
                        <div className="flex gap-3">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#A7F3D0]" />
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
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1A1528]">
                    Tóm tắt nhanh
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-7 text-[#5B566E]">
                    Bạn có thể sử dụng ChronoFlow như một công cụ hỗ trợ lập kế
                    hoạch và theo dõi năng lượng. Bạn cần dùng sản phẩm đúng mục
                    đích, không gian lận hệ thống và hiểu rằng các gợi ý trong app
                    chỉ mang tính tham khảo.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#FFE4B5] bg-[#FFF9ED] p-6 md:p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-[#C47A00]" />
                <div>
                  <h2 className="text-lg font-black text-[#5A3900]">
                    Lưu ý quan trọng
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-7 text-[#805A16]">
                    ChronoFlow không thay thế bác sĩ, chuyên gia sức khoẻ, chuyên
                    gia tâm lý hoặc cố vấn pháp lý. Các kết quả chronotype và
                    insight chỉ nhằm hỗ trợ tự nhận thức và lập kế hoạch.
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

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-[#DDF5E7] bg-[#F1FFF7] p-6">
                <BadgeCheck className="h-6 w-6 text-[#16A085]" />
                <h2 className="mt-4 text-lg font-black text-[#12372C]">
                  Dùng đúng mục đích
                </h2>
                <p className="mt-2 text-sm font-semibold leading-7 text-[#42665B]">
                  Hãy dùng ChronoFlow để hiểu nhịp năng lượng, lên kế hoạch và
                  cải thiện thói quen cá nhân một cách lành mạnh.
                </p>
              </div>

              <div className="rounded-[28px] border border-[#E8E2FF] bg-white p-6">
                <ShieldCheck className="h-6 w-6 text-[#6F59FF]" />
                <h2 className="mt-4 text-lg font-black text-[#1A1528]">
                  Tôn trọng dữ liệu
                </h2>
                <p className="mt-2 text-sm font-semibold leading-7 text-[#5B566E]">
                  Không truy cập, khai thác hoặc can thiệp dữ liệu không thuộc về
                  bạn. Mọi hành vi gian lận có thể khiến tài khoản bị xử lý.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#E8E2FF] bg-[#1A1528] p-6 text-white shadow-[0_24px_80px_rgba(26,21,40,0.12)] md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white/60">
                    <Mail className="h-3.5 w-3.5" />
                    Terms support
                  </div>
                  <h2 className="mt-4 text-2xl font-black">
                    Có câu hỏi về điều khoản?
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/68">
                    Liên hệ ChronoFlow nếu bạn cần hỏi về tài khoản, thanh toán,
                    planner kit, reward hoặc dữ liệu cá nhân.
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
              Điều khoản này không phải tư vấn pháp lý. Nội dung nên được rà soát
              lại nếu ChronoFlow dùng cho môi trường thương mại chính thức hoặc
              có yêu cầu pháp lý cụ thể.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
