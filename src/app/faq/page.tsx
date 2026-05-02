"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coins,
  HelpCircle,
  Mail,
  MessageCircle,
  MoonStar,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type FaqCategory =
  | "all"
  | "getting-started"
  | "chronotype"
  | "planner"
  | "rhythm"
  | "rewards"
  | "account"
  | "privacy";

type FaqItem = {
  id: string;
  category: Exclude<FaqCategory, "all">;
  question: string;
  answer: ReactNode;
  keywords: string[];
};

const categories: Array<{
  id: FaqCategory;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "all",
    label: "Tất cả",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "getting-started",
    label: "Bắt đầu",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "chronotype",
    label: "Chronotype",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: "planner",
    label: "Planner",
    icon: <CalendarClock className="h-4 w-4" />,
  },
  {
    id: "rhythm",
    label: "Rhythm",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "rewards",
    label: "Rewards",
    icon: <Coins className="h-4 w-4" />,
  },
  {
    id: "account",
    label: "Tài khoản",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    id: "privacy",
    label: "Dữ liệu",
    icon: <Target className="h-4 w-4" />,
  },
];

const faqItems: FaqItem[] = [
  {
    id: "what-is-chronoflow",
    category: "getting-started",
    question: "ChronoFlow là gì?",
    keywords: ["chronoflow", "app", "productivity", "năng suất", "planner"],
    answer: (
      <>
        ChronoFlow là nền tảng giúp bạn hiểu chronotype, nhịp năng lượng trong
        ngày và sắp xếp công việc theo thời điểm bạn dễ tập trung hơn. Mục tiêu
        không phải là ép bạn làm việc nhiều hơn, mà là giúp bạn làm việc đúng lúc
        hơn.
      </>
    ),
  },
  {
    id: "who-is-it-for",
    category: "getting-started",
    question: "ChronoFlow phù hợp với ai?",
    keywords: ["sinh viên", "người đi làm", "freelancer", "founder", "team"],
    answer: (
      <>
        ChronoFlow phù hợp với sinh viên, người đi làm, freelancer, founder hoặc
        bất kỳ ai muốn quản lý task tốt hơn nhưng thường cảm thấy lịch hiện tại
        bị lệch năng lượng. Nếu bạn hay thấy mình làm việc khó vào sai thời điểm,
        ChronoFlow sẽ rất hữu ích.
      </>
    ),
  },
  {
    id: "how-to-start",
    category: "getting-started",
    question: "Mình nên bắt đầu từ đâu?",
    keywords: ["bắt đầu", "assessment", "đăng ký", "dashboard"],
    answer: (
      <>
        Bạn nên bắt đầu bằng bài assessment để tìm chronotype. Sau đó, vào
        Dashboard hoặc Planner để thêm task, sắp lịch, lưu focus session và theo
        dõi insight theo tuần.
      </>
    ),
  },
  {
    id: "chronotype-meaning",
    category: "chronotype",
    question: "Chronotype là gì?",
    keywords: ["chronotype", "nhịp sinh học", "lion", "bear", "wolf", "dolphin"],
    answer: (
      <>
        Chronotype là xu hướng tự nhiên về thời điểm bạn tỉnh táo, tập trung
        hoặc dễ xuống năng lượng trong ngày. ChronoFlow đang dùng 4 nhóm dễ hiểu:
        Sư tử, Gấu, Sói và Cá heo để giúp bạn biến hiểu biết đó thành lịch làm
        việc thực tế.
      </>
    ),
  },
  {
    id: "chronotype-fixed",
    category: "chronotype",
    question: "Chronotype có cố định mãi không?",
    keywords: ["thay đổi", "cố định", "chronotype"],
    answer: (
      <>
        Không nhất thiết. Chronotype là điểm khởi đầu để hiểu xu hướng của bạn,
        nhưng giấc ngủ, lịch học/làm, môi trường và thói quen có thể ảnh hưởng
        đến nhịp năng lượng. Vì vậy ChronoFlow khuyến khích bạn check-in và theo
        dõi dữ liệu thật theo thời gian.
      </>
    ),
  },
  {
    id: "assessment-medical",
    category: "chronotype",
    question: "Bài assessment có phải chẩn đoán y khoa không?",
    keywords: ["y khoa", "chẩn đoán", "assessment", "sức khỏe"],
    answer: (
      <>
        Không. Bài assessment của ChronoFlow chỉ mang tính định hướng để hỗ trợ
        tự hiểu bản thân và lập kế hoạch. Nếu bạn có vấn đề nghiêm trọng về giấc
        ngủ hoặc sức khỏe, bạn nên trao đổi với chuyên gia phù hợp.
      </>
    ),
  },
  {
    id: "planner-how",
    category: "planner",
    question: "Planner của ChronoFlow khác todo list thường ở điểm nào?",
    keywords: ["planner", "todo", "task", "lịch"],
    answer: (
      <>
        Todo list thường chỉ trả lời “cần làm gì”. ChronoFlow Planner cố gắng
        trả lời thêm “nên làm lúc nào”. Khi có chronotype, task type, priority và
        thời lượng, planner giúp bạn nhìn task nào nên đặt vào peak window, task
        nào hợp hơn với khung nhẹ hoặc recovery.
      </>
    ),
  },
  {
    id: "planner-fake-data",
    category: "planner",
    question: "Planner có dùng dữ liệu giả để hiển thị không?",
    keywords: ["fake data", "mock", "dữ liệu thật", "database"],
    answer: (
      <>
        Không. Các trang sản phẩm chính của ChronoFlow nên ưu tiên dữ liệu thật
        từ tài khoản của bạn. Nếu chưa đủ dữ liệu, giao diện sẽ hiển thị trạng
        thái trống hoặc lời nhắc thêm task/check-in thay vì giả vờ có phân tích.
      </>
    ),
  },
  {
    id: "focus-session",
    category: "planner",
    question: "Focus session có tự hoàn thành task không?",
    keywords: ["focus session", "task", "hoàn thành", "completion"],
    answer: (
      <>
        Không nên tự động hoàn thành task chỉ vì bạn đã focus. Focus session ghi
        nhận thời gian tập trung, còn trạng thái task nên được bạn xác nhận bằng
        hành động hoàn thành riêng để dữ liệu chính xác hơn.
      </>
    ),
  },
  {
    id: "rhythm-page",
    category: "rhythm",
    question: "Trang Rhythm dùng để làm gì?",
    keywords: ["rhythm", "energy curve", "nhịp", "năng lượng"],
    answer: (
      <>
        Rhythm giúp bạn nhìn rõ chronotype hiện tại, peak window, recovery
        window, đường năng lượng, timeline trong ngày, task alignment và các gợi
        ý điều chỉnh lịch. Đây là nơi biến dữ liệu task, focus và check-in thành
        insight dễ hiểu hơn.
      </>
    ),
  },
  {
    id: "energy-checkin",
    category: "rhythm",
    question: "Energy check-in là gì?",
    keywords: ["energy checkin", "check-in", "năng lượng", "score"],
    answer: (
      <>
        Energy check-in là thao tác ghi lại mức năng lượng thật của bạn tại một
        thời điểm trong ngày. Khi có đủ check-in, ChronoFlow có thể hiểu nhịp
        thực tế của bạn tốt hơn thay vì chỉ dựa trên chronotype ban đầu.
      </>
    ),
  },
  {
    id: "why-empty-chart",
    category: "rhythm",
    question: "Vì sao một số biểu đồ Rhythm bị trống?",
    keywords: ["trống", "empty", "chart", "không có dữ liệu"],
    answer: (
      <>
        Vì ChronoFlow chỉ hiển thị khi có dữ liệu thật. Nếu bạn chưa có task,
        focus session hoặc energy check-in đủ nhiều, một số phần sẽ để trống và
        hướng dẫn bạn thêm dữ liệu để phân tích chính xác hơn.
      </>
    ),
  },
  {
    id: "coins-how",
    category: "rewards",
    question: "Coin trong ChronoFlow dùng để làm gì?",
    keywords: ["coin", "reward", "đổi quà", "planner kit"],
    answer: (
      <>
        Coin là điểm thưởng trong app, dùng để tạo động lực duy trì task, focus
        session và streak. Tùy cấu hình reward, bạn có thể dùng coin để đổi các
        phần thưởng như Planner Kit hoặc ưu đãi trong hệ sinh thái ChronoFlow.
      </>
    ),
  },
  {
    id: "chrono-kit",
    category: "rewards",
    question: "Chrono Kit là gì?",
    keywords: ["chrono kit", "planner kit", "physical", "reward"],
    answer: (
      <>
        Chrono Kit là bộ planner vật lý giúp bạn mang logic chronotype ra ngoài
        màn hình: lập kế hoạch theo khung năng lượng, theo dõi thói quen và củng
        cố routine bằng trải nghiệm cầm nắm thật.
      </>
    ),
  },
  {
    id: "reward-status",
    category: "rewards",
    question: "Sau khi đổi reward thì theo dõi trạng thái ở đâu?",
    keywords: ["reward", "redemption", "status", "đổi quà"],
    answer: (
      <>
        Bạn có thể theo dõi trạng thái đổi quà trong Reward Center hoặc Profile.
        Các trạng thái thường gặp gồm đang xử lý, đã duyệt, đã hoàn tất hoặc bị
        từ chối/hủy nếu yêu cầu không hợp lệ.
      </>
    ),
  },
  {
    id: "need-account",
    category: "account",
    question: "Có cần tài khoản để dùng ChronoFlow không?",
    keywords: ["tài khoản", "đăng nhập", "signup", "login"],
    answer: (
      <>
        Có. Tài khoản giúp ChronoFlow lưu kết quả assessment, task, focus
        session, check-in, coin và insight cá nhân của bạn. Nếu không đăng nhập,
        hệ thống không thể cá nhân hóa trải nghiệm đầy đủ.
      </>
    ),
  },
  {
    id: "forgot-password",
    category: "account",
    question: "Quên mật khẩu thì làm sao?",
    keywords: ["quên mật khẩu", "password", "forgot"],
    answer: (
      <>
        Bạn có thể vào trang quên mật khẩu nếu hệ thống đã bật chức năng này.
        Nếu chưa dùng được, hãy liên hệ ChronoFlow qua email hoặc trang Contact
        để được hỗ trợ kiểm tra tài khoản.
      </>
    ),
  },
  {
    id: "profile-data",
    category: "account",
    question: "Profile lưu những thông tin gì?",
    keywords: ["profile", "hồ sơ", "student id", "customer type"],
    answer: (
      <>
        Profile có thể lưu tên hiển thị, email, mã sinh viên, avatar, mục tiêu
        giờ ngủ/thức, chronotype, thông tin nhóm khách hàng, nguồn biết đến sản
        phẩm và các chỉ số sử dụng như task, focus, streak, coin.
      </>
    ),
  },
  {
    id: "data-privacy",
    category: "privacy",
    question: "ChronoFlow dùng dữ liệu của mình để làm gì?",
    keywords: ["dữ liệu", "privacy", "cá nhân hóa", "bảo mật"],
    answer: (
      <>
        Dữ liệu được dùng để cá nhân hóa planner, rhythm, insight, reward và cải
        thiện sản phẩm. Ví dụ: task giúp tính completion, focus session giúp đo
        thời gian tập trung, energy check-in giúp đọc nhịp năng lượng thật hơn.
      </>
    ),
  },
  {
    id: "marketing-data",
    category: "privacy",
    question: "Nguồn khách hàng trong đăng ký dùng để làm gì?",
    keywords: ["source channel", "marketing", "utm", "khách hàng", "pitching"],
    answer: (
      <>
        Nguồn khách hàng giúp ChronoFlow hiểu người dùng biết đến sản phẩm từ
        đâu như Facebook, TikTok, Instagram, bạn bè, gặp trực tiếp hoặc doanh
        nghiệp. Phần này có thể dùng cho phân tích marketing và báo cáo hiệu quả
        dự án.
      </>
    ),
  },
  {
    id: "delete-data",
    category: "privacy",
    question: "Mình có thể yêu cầu chỉnh sửa hoặc xóa dữ liệu không?",
    keywords: ["xóa dữ liệu", "delete", "privacy", "contact"],
    answer: (
      <>
        Có. Bạn có thể liên hệ ChronoFlow qua trang Contact hoặc email để yêu cầu
        kiểm tra, chỉnh sửa hoặc xóa thông tin liên quan đến tài khoản của mình
        nếu cần.
      </>
    ),
  },
];

const featuredQuestions = [
  "ChronoFlow là gì?",
  "Planner khác todo list thường ở điểm nào?",
  "Energy check-in là gì?",
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("all");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(["what-is-chronoflow"]),
  );

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return faqItems.filter((item) => {
      const categoryMatched =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!categoryMatched) return false;

      if (!normalizedQuery) return true;

      const searchable = normalizeText(
        [
          item.question,
          item.category,
          ...item.keywords,
          typeof item.answer === "string" ? item.answer : "",
        ].join(" "),
      );

      return searchable.includes(normalizedQuery);
    });
  }, [query, selectedCategory]);

  function toggleFaq(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function openQuestionByTitle(question: string) {
    const target = faqItems.find((item) => item.question === question);

    if (!target) return;

    setSelectedCategory(target.category);
    setQuery("");
    setOpenIds((prev) => new Set(prev).add(target.id));

    const element = document.getElementById(target.id);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="min-h-screen bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <main className="relative flex flex-col gap-12 overflow-hidden bg-slate-50 pb-28 pt-0 font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
        <BackgroundDecor />

        <HeroSection onOpenQuestion={openQuestionByTitle} />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] space-y-12 px-4 lg:px-8">
          <SectionWrapper id="faq-list">
            <SectionHeading
              eyebrow="FAQ Center"
              title={
                <>
                  Tìm nhanh câu trả lời về{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    ChronoFlow
                  </span>
                </>
              }
              description="Chọn nhóm câu hỏi hoặc tìm kiếm trực tiếp theo từ khóa như planner, chronotype, reward, check-in, tài khoản hoặc dữ liệu."
            />

            <div className="mx-auto mt-10 max-w-[900px]">
              <div className="flex min-h-[60px] items-center gap-3 rounded-[24px] border border-white/80 bg-white/90 px-5 shadow-[0_18px_40px_rgba(26,21,40,0.05)] backdrop-blur-xl transition focus-within:border-[#C9BEFF] focus-within:ring-4 focus-within:ring-[#6F59FF]/10">
                <Search className="h-5 w-5 shrink-0 text-[#8A84A3]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm câu hỏi, ví dụ: Energy check-in, coin, planner..."
                  className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-[#1A1528] outline-none placeholder:text-[#A3A0B8]"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const active = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-black transition ${
                      active
                        ? "border-[#6F59FF] bg-[#6F59FF] text-white shadow-[0_14px_30px_rgba(111,89,255,0.22)]"
                        : "border-white/80 bg-white/85 text-[#5B566E] shadow-sm hover:-translate-y-0.5 hover:text-[#6F59FF]"
                    }`}
                  >
                    {category.icon}
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-[32px] border border-white/80 bg-white/76 p-5 shadow-[0_20px_50px_rgba(26,21,40,0.05)] backdrop-blur-xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Popular
                  </div>

                  <div className="space-y-3">
                    {featuredQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => openQuestionByTitle(question)}
                        className="group flex w-full items-start justify-between gap-3 rounded-[22px] border border-[#EEF0F6] bg-[#F8F9FE] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        <span className="text-[13px] font-black leading-6 text-[#1A1528]">
                          {question}
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#6F59FF] transition group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 rounded-[24px] border border-[#DDEEFF] bg-[#F8FCFF] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#4DA8FF] shadow-sm">
                      <Mail className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3 text-[15px] font-[900] text-[#1A1528]">
                      Chưa tìm thấy câu trả lời?
                    </h3>
                    <p className="mt-2 text-[13px] leading-7 text-[#615C7A]">
                      Gửi tin nhắn cho ChronoFlow để được hỗ trợ trực tiếp.
                    </p>

                    <Link
                      href="/contact"
                      className="mt-4 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-4 text-[13px] font-bold text-white shadow-xl transition hover:-translate-y-0.5"
                    >
                      Liên hệ
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </aside>

              <div>
                <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div className="text-[13px] font-bold text-[#6B647C]">
                    Tìm thấy{" "}
                    <span className="font-black text-[#6F59FF]">
                      {filteredFaqs.length}
                    </span>{" "}
                    câu hỏi
                  </div>

                  {(query || selectedCategory !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedCategory("all");
                      }}
                      className="w-fit rounded-full border border-[#E9E5FF] bg-white px-4 py-2 text-[12px] font-black text-[#6F59FF] shadow-sm transition hover:-translate-y-0.5"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                {filteredFaqs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFaqs.map((item, index) => (
                      <FaqAccordion
                        key={item.id}
                        item={item}
                        index={index}
                        open={openIds.has(item.id)}
                        onToggle={() => toggleFaq(item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState query={query} />
                )}
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="faq-support">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Support flow
                </div>

                <h2 className="max-w-[760px] text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                  Vẫn còn câu hỏi?{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    Gửi cho ChronoFlow nhé.
                  </span>
                </h2>

                <p className="mt-5 max-w-[58ch] text-[1rem] leading-8 text-[#615C7A]">
                  Nếu bạn gặp lỗi hoặc cần giải thích sâu hơn về planner,
                  rhythm, reward, tài khoản hay dữ liệu, hãy gửi mô tả rõ ràng
                  để ChronoFlow hỗ trợ nhanh hơn.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                  >
                    <Mail className="h-4 w-4 text-[#4DA8FF]" />
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                        SUPPORT
                      </span>
                      <span className="text-[14px] font-bold leading-tight">
                        Gửi liên hệ
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/learn"
                    className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                      <BookOpen className="h-3.5 w-3.5 text-[#6F59FF]" />
                    </div>
                    <span className="text-[14px] font-bold leading-tight">
                      Xem Learn Hub
                    </span>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                <SupportStep
                  icon={<Search className="h-5 w-5 text-[#6F59FF]" />}
                  title="1. Tìm nhanh trong FAQ"
                  text="Dùng thanh search hoặc filter theo nhóm để tìm câu trả lời gần nhất."
                  tone="purple"
                />
                <SupportStep
                  icon={<MessageCircle className="h-5 w-5 text-[#4DA8FF]" />}
                  title="2. Gửi mô tả nếu chưa rõ"
                  text="Nêu rõ trang bạn đang dùng, thao tác đã làm và lỗi hoặc câu hỏi cụ thể."
                  tone="blue"
                />
                <SupportStep
                  icon={<CheckCircle2 className="h-5 w-5 text-[#10B981]" />}
                  title="3. ChronoFlow phản hồi"
                  text="ChronoFlow sẽ đọc nội dung và phản hồi qua kênh liên hệ bạn cung cấp."
                  tone="green"
                />
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="next-step">
            <div className="mx-auto max-w-[920px] text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
                <Sparkles className="h-3.5 w-3.5" />
                Continue your flow
              </div>

              <h2 className="text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.08] tracking-tight text-[#241F3D]">
                Sẵn sàng quay lại{" "}
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  nhịp làm việc của bạn?
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
                Làm assessment, mở planner hoặc xem rhythm để biến hiểu biết
                thành lịch làm việc thực tế hơn.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/assessment"
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                >
                  <Brain className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                      BẮT ĐẦU
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Làm bài assessment
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/planner"
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <CalendarClock className="h-3.5 w-3.5 text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Mở planner
                  </span>
                </Link>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeroSection({
  onOpenQuestion,
}: {
  onOpenQuestion: (question: string) => void;
}) {
  return (
    <section className="relative z-10 px-4 pb-14 pt-0 lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#DCD1FF_100%)] px-4 pt-8 md:px-8">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              {[...Array(7)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute h-2 w-2 rounded-full bg-white"
                  style={{
                    top: `${16 + index * 10}%`,
                    left: `${10 + (index % 4) * 24}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2.4 + index * 0.15,
                    repeat: Infinity,
                    delay: index * 0.24,
                  }}
                />
              ))}
            </div>

            <div className="relative z-30 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5" />
                ChronoFlow FAQ
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mb-4 text-[clamp(2.2rem,4vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]"
              >
                Câu hỏi thường gặp, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                  trả lời thật dễ hiểu.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mx-auto mb-8 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]"
              >
                Tìm hiểu cách ChronoFlow hoạt động, chronotype là gì, planner
                dùng dữ liệu nào, reward vận hành ra sao và cách liên hệ khi bạn
                cần hỗ trợ thêm.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22 }}
                className="mb-8 flex flex-wrap items-center justify-center gap-3"
              >
                <a
                  href="#faq-list"
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-black"
                >
                  <Search className="h-4 w-4 text-[#4DA8FF]" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                      TÌM NHANH
                    </span>
                    <span className="text-[14px] font-bold leading-tight">
                      Xem câu hỏi
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>

                <Link
                  href="/contact"
                  className="group flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 py-3.5 text-[#1A1528] shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                    <Mail className="h-3.5 w-3.5 text-[#6F59FF]" />
                  </div>
                  <span className="text-[14px] font-bold leading-tight">
                    Gửi hỗ trợ
                  </span>
                </Link>
              </motion.div>
            </div>

            <div className="relative mx-auto mt-2 h-[350px] w-full max-w-[820px] perspective-[1400px] sm:h-[390px]">
              <div className="absolute left-[4%] top-[10%] z-40 hidden animate-[bounce_4s_infinite] sm:block">
                <FloatPill
                  icon={<HelpCircle className="h-3.5 w-3.5" />}
                  label="FAQ Center"
                  tint="purple"
                />
              </div>

              <div className="absolute right-[4%] top-[8%] z-40 hidden animate-[bounce_4.6s_infinite] sm:block">
                <FloatPill
                  icon={<MessageCircle className="h-3.5 w-3.5" />}
                  label="Support ready"
                  tint="orange"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -40, y: 30, rotate: -10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, rotate: -6, scale: 1.02 }}
                className="absolute left-[4%] top-16 z-20 w-[190px] rounded-[32px] shadow-2xl sm:left-[7%] sm:w-[215px]"
              >
                <FaqMiniCard
                  title="Planner"
                  description="Task, focus, lịch làm việc"
                  icon={<CalendarClock className="h-4 w-4 text-[#6F59FF]" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 70, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="absolute left-1/2 top-2 z-30 w-[255px] -translate-x-1/2 rounded-[38px] shadow-[0_45px_90px_rgba(26,21,40,0.28)] sm:w-[290px]"
              >
                <FaqMainCard onOpenQuestion={onOpenQuestion} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40, y: 30, rotate: 10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
                transition={{
                  duration: 0.7,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, rotate: 6, scale: 1.02 }}
                className="absolute right-[4%] top-16 z-20 w-[190px] rounded-[32px] shadow-2xl sm:right-[7%] sm:w-[215px]"
              >
                <FaqMiniCard
                  title="Rewards"
                  description="Coin, đổi quà, Chrono Kit"
                  icon={<Coins className="h-4 w-4 text-[#F59E0B]" />}
                  warm
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqMainCard({
  onOpenQuestion,
}: {
  onOpenQuestion: (question: string) => void;
}) {
  return (
    <div className="rounded-[36px] border border-white bg-white p-4 shadow-[0_35px_80px_rgba(26,21,40,0.2)]">
      <div className="rounded-[28px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FE_100%)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
              FAQ Assistant
            </div>
            <div className="mt-1 text-[17px] font-[900] text-[#1A1528]">
              Bạn muốn hỏi gì?
            </div>
          </div>

          <div className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[10px] font-black text-[#6F59FF]">
            Ready
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-[18px] border border-[#E9E5FF] bg-white px-3 py-2 shadow-sm">
          <Search className="h-3.5 w-3.5 text-[#8A84A3]" />
          <span className="text-[11px] font-bold text-[#8A84A3]">
            Search ChronoFlow...
          </span>
        </div>

        <div className="space-y-2.5">
          {featuredQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onOpenQuestion(question)}
              className="group flex w-full items-center justify-between rounded-[18px] border border-[#EEF0F6] bg-white px-3 py-3 text-left shadow-sm transition hover:border-[#D9CEFF]"
            >
              <span className="text-[11px] font-black leading-snug text-[#1A1528]">
                {question}
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#6F59FF] transition group-hover:translate-x-1" />
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[20px] border border-[#E9E5FF] bg-[#F8F6FF] p-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            <div className="text-[11px] font-bold text-[#5B566E]">
              Có thể hỏi về planner, rhythm, account, reward.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqMiniCard({
  title,
  description,
  icon,
  warm = false,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  warm?: boolean;
}) {
  return (
    <div className="rounded-[32px] border border-white bg-white/92 p-4 shadow-[0_25px_60px_rgba(26,21,40,0.16)] backdrop-blur-xl">
      <div
        className={`rounded-[24px] p-4 ${
          warm
            ? "bg-[linear-gradient(180deg,#FFF9F2_0%,#FFF4E8_100%)]"
            : "bg-[linear-gradient(180deg,#F8F6FF_0%,#EFEAFF_100%)]"
        }`}
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
          {icon}
        </div>

        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
          Topic
        </div>

        <h3 className="mt-1 text-[17px] font-[900] text-[#1A1528]">{title}</h3>
        <p className="mt-2 text-[11px] font-semibold leading-relaxed text-[#5B566E]">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-[16px] bg-white/85 px-3 py-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
          <span className="text-[10px] font-black text-[#1A1528]">
            Có hướng dẫn
          </span>
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({
  item,
  index,
  open,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      id={item.id}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.18) }}
      className={`overflow-hidden rounded-[28px] border shadow-[0_16px_38px_rgba(26,21,40,0.04)] transition ${
        open
          ? "border-[#D9CEFF] bg-white"
          : "border-white/80 bg-white/78 hover:bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left md:px-6"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              open
                ? "bg-[#6F59FF] text-white"
                : "bg-[#F3F0FF] text-[#6F59FF]"
            }`}
          >
            {getCategoryIcon(item.category)}
          </div>

          <div>
            <div className="mb-2 inline-flex rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-[#6F59FF]">
              {getCategoryLabel(item.category)}
            </div>
            <h3 className="text-[1.05rem] font-[900] leading-snug tracking-tight text-[#1A1528] md:text-[1.18rem]">
              {item.question}
            </h3>
          </div>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#E9E5FF] bg-white text-[#6F59FF] transition ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="border-t border-[#EEF0F6] px-5 py-5 md:px-6">
              <div className="max-w-[860px] text-[14px] font-medium leading-8 text-[#5B566E] md:text-[15px]">
                {item.answer}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function SupportStep({
  icon,
  title,
  text,
  tone,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  tone: "purple" | "blue" | "green";
}) {
  const style = {
    purple: "from-[#F5F1FF] to-[#ECE5FF] border-[#D8CCFF]",
    blue: "from-[#EFF7FF] to-[#E0EEFF] border-[#C7E0FF]",
    green: "from-[#ECFCF7] to-[#D7F7EC] border-[#B7EFD9]",
  }[tone];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-[28px] border bg-gradient-to-br ${style} p-5 shadow-[0_18px_40px_rgba(26,21,40,0.04)]`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-sm">
        {icon}
      </div>
      <h3 className="text-[1.05rem] font-[900] tracking-tight text-[#1A1528]">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">{text}</p>
    </motion.div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-[32px] border border-dashed border-[#DCD3FF] bg-[#F8F6FF] p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-[#6F59FF] shadow-sm">
        <Search className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-[1.4rem] font-[900] tracking-tight text-[#1A1528]">
        Chưa tìm thấy câu hỏi phù hợp
      </h3>

      <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-7 text-[#615C7A]">
        {query
          ? `Không có kết quả cho “${query}”. Bạn thử từ khóa ngắn hơn hoặc gửi câu hỏi qua trang Contact nhé.`
          : "Không có câu hỏi trong nhóm này. Bạn có thể đổi bộ lọc hoặc gửi câu hỏi trực tiếp cho ChronoFlow."}
      </p>

      <Link
        href="/contact"
        className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[14px] font-bold text-white shadow-xl transition hover:-translate-y-0.5"
      >
        Gửi câu hỏi
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function SectionWrapper({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(246,247,255,0.64)_100%)] px-6 py-10 shadow-[0_24px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:px-10 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-0 h-[180px] w-[180px] rounded-full bg-white/35 blur-[70px]" />
        <div className="absolute right-[-4%] bottom-0 h-[220px] w-[220px] rounded-full bg-[#D8E8FF]/30 blur-[80px]" />
      </div>

      <div className="relative">{children}</div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-[1.08] tracking-tight text-[#241F3D]">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
        {description}
      </p>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full">
        <div className="absolute left-[10%] top-[-5%] h-[400px] w-[400px] animate-[pulse_6s_infinite] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
        <div className="absolute right-[-5%] top-[10%] h-[300px] w-[300px] animate-[pulse_8s_infinite] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
      </div>
    </>
  );
}

function FloatPill({
  icon,
  label,
  tint = "purple",
}: {
  icon: ReactNode;
  label: string;
  tint?: "purple" | "orange";
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-[12px] font-semibold text-[#1A1528] shadow-[0_16px_35px_rgba(26,21,40,0.12)]">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          tint === "purple"
            ? "bg-[#F3F0FF] text-[#6F59FF]"
            : "bg-[#FFF3E8] text-[#F59E0B]"
        }`}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}

function getCategoryIcon(category: FaqItem["category"]) {
  const iconClassName = "h-5 w-5";

  switch (category) {
    case "getting-started":
      return <BookOpen className={iconClassName} />;
    case "chronotype":
      return <Brain className={iconClassName} />;
    case "planner":
      return <CalendarClock className={iconClassName} />;
    case "rhythm":
      return <BarChart3 className={iconClassName} />;
    case "rewards":
      return <Coins className={iconClassName} />;
    case "account":
      return <ShieldCheck className={iconClassName} />;
    case "privacy":
      return <Target className={iconClassName} />;
    default:
      return <HelpCircle className={iconClassName} />;
  }
}

function getCategoryLabel(category: FaqItem["category"]) {
  const match = categories.find((item) => item.id === category);
  return match?.label || category;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}