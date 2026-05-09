import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Compass,
  Moon,
  RefreshCw,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ChronotypeKey = "lion" | "bear" | "wolf" | "dolphin";

type ResultRecord = {
  id: string;
  chronotype: string;
  lionScore: number | null;
  bearScore: number | null;
  wolfScore: number | null;
  dolphinScore: number | null;
  createdAt: Date;
};

type ChronotypeDisplayConfig = {
  key: ChronotypeKey;
  viName: string;
  enName: string;
  stickerUrl: string;
  headline: string;
  summary: string;
  energyStyle: string;
  plannerAdvice: string;
  peakWindow: string;
  lightWindow: string;
  recoveryWindow: string;
  strengths: string[];
  watchOuts: string[];
  accent: string;
  softGradient: string;
  icon: LucideIcon;
};

type ScoreItem = {
  key: ChronotypeKey;
  label: string;
  score: number;
};

const TIE_BREAK_ORDER: ChronotypeKey[] = ["wolf", "bear", "dolphin", "lion"];

const STICKER_BASE =
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals";

const CHRONOTYPE_CONFIG: Record<ChronotypeKey, ChronotypeDisplayConfig> = {
  lion: {
    key: "lion",
    viName: "Sư tử",
    enName: "Lion",
    stickerUrl: `${STICKER_BASE}/Lion.png`,
    headline: "mạnh buổi sáng",
    summary:
      "Bạn thường vào nhịp tốt khi ngày mới bắt đầu, hợp với các block sâu và quyết định quan trọng vào buổi sáng.",
    energyStyle: "Lên năng lượng sớm, cần giảm tải dần về cuối ngày.",
    plannerAdvice:
      "ChronoFlow gợi ý bạn đặt việc khó vào buổi sáng, giữ chiều cho admin nhẹ và bảo vệ buổi tối để hồi phục.",
    peakWindow: "07:00 – 11:00",
    lightWindow: "13:00 – 15:00",
    recoveryWindow: "20:30 – 22:00",
    strengths: [
      "Dễ bắt đầu ngày với đầu óc rõ ràng.",
      "Hợp với deep work, học tập hoặc viết lách buổi sáng.",
      "Có xu hướng duy trì routine ổn định.",
    ],
    watchOuts: [
      "Dễ hụt năng lượng nếu dồn việc nặng về tối.",
      "Buổi chiều có thể phù hợp hơn cho việc nhẹ.",
      "Cần nghỉ đúng lúc để không kiệt sức sớm.",
    ],
    accent: "#C98C42",
    softGradient: "from-[#FFF9F0] via-[#FDF2E9] to-[#FFF1E0]",
    icon: Zap,
  },
  bear: {
    key: "bear",
    viName: "Gấu",
    enName: "Bear",
    stickerUrl: `${STICKER_BASE}/Bear.png`,
    headline: "cân bằng theo nhịp ban ngày",
    summary:
      "Bạn có nhịp tương đối ổn định, dễ phù hợp với lịch học/làm ban ngày và duy trì hiệu suất đều nếu lịch không bị chia nhỏ.",
    energyStyle: "Ổn định trong ngày, thường có nhịp tốt từ sáng đến đầu chiều.",
    plannerAdvice:
      "ChronoFlow gợi ý bạn chặn trước block tập trung ban ngày và gom họp, tin nhắn hoặc việc phản ứng vào khung nhẹ hơn.",
    peakWindow: "09:00 – 12:30",
    lightWindow: "13:30 – 16:00",
    recoveryWindow: "21:00 – 22:30",
    strengths: [
      "Dễ phối hợp với lịch học/làm phổ biến.",
      "Có nền năng lượng khá đều nếu ngủ ổn định.",
      "Phù hợp với nhịp planner cân bằng giữa focus và admin.",
    ],
    watchOuts: [
      "Dễ để lịch bị lấp đầy bởi việc phản ứng.",
      "Có thể bỏ lỡ giờ sâu nếu không chặn lịch trước.",
      "Afternoon dip vẫn cần được tôn trọng.",
    ],
    accent: "#6F59FF",
    softGradient: "from-[#F8F7FF] via-[#E9E4FF] to-[#DFD9FF]",
    icon: Activity,
  },
  wolf: {
    key: "wolf",
    viName: "Sói",
    enName: "Wolf",
    stickerUrl: `${STICKER_BASE}/Wolf.png`,
    headline: "tăng nhịp về chiều và tối",
    summary:
      "Bạn có xu hướng khởi động chậm hơn vào buổi sáng nhưng tăng độ sắc bén về chiều, đặc biệt với việc sáng tạo hoặc cần tập trung sâu.",
    energyStyle: "Năng lượng lên muộn, hợp với block quan trọng sau nửa đầu ngày.",
    plannerAdvice:
      "ChronoFlow gợi ý bạn để sáng cho setup/admin nhẹ, rồi đưa việc khó vào chiều muộn hoặc tối sớm khi đầu óc sáng hơn.",
    peakWindow: "14:30 – 18:00",
    lightWindow: "10:30 – 12:00",
    recoveryWindow: "22:30 – 23:30",
    strengths: [
      "Dễ vào flow khi ngày đã ấm lên.",
      "Hợp với creative work, phân tích hoặc học sâu cuối ngày.",
      "Có thể xử lý việc khó tốt hơn khi không bị ép quá sớm.",
    ],
    watchOuts: [
      "Buổi sáng dễ nặng nếu lịch bắt đầu bằng việc khó.",
      "Dễ kéo focus quá muộn nếu không đặt ranh giới ngủ.",
      "Cần tránh tự trách khi chưa lên nhịp sớm.",
    ],
    accent: "#5B46FF",
    softGradient: "from-[#F5F5FF] via-[#E2E1FF] to-[#D6D4FF]",
    icon: Moon,
  },
  dolphin: {
    key: "dolphin",
    viName: "Cá heo",
    enName: "Dolphin",
    stickerUrl: `${STICKER_BASE}/Dolphin.png`,
    headline: "nhạy với giấc ngủ và môi trường",
    summary:
      "Bạn có thể có nhịp linh hoạt hơn, dễ bị ảnh hưởng bởi giấc ngủ, môi trường và tải tinh thần trong ngày.",
    energyStyle: "Năng lượng biến thiên, hợp với block ngắn và kiểm tra trạng thái thường xuyên.",
    plannerAdvice:
      "ChronoFlow gợi ý bạn chia việc thành block rõ, giữ khoảng nghỉ mềm và dùng check-in để điều chỉnh lịch theo dữ liệu thật.",
    peakWindow: "10:00 – 12:00",
    lightWindow: "15:00 – 17:00",
    recoveryWindow: "20:30 – 22:00",
    strengths: [
      "Nhạy với tín hiệu cơ thể và trạng thái tinh thần.",
      "Làm tốt khi mục tiêu nhỏ, rõ và có nhịp nghỉ.",
      "Có thể tối ưu mạnh khi môi trường làm việc phù hợp.",
    ],
    watchOuts: [
      "Lịch quá cứng dễ tạo áp lực không cần thiết.",
      "Giấc ngủ xấu có thể kéo tụt cả ngày.",
      "Cần theo dõi năng lượng thật thay vì ép theo một mẫu cố định.",
    ],
    accent: "#8A7AF0",
    softGradient: "from-[#F9F8FF] via-[#EBE6FF] to-[#E2DAFF]",
    icon: Waves,
  },
};

function safeScore(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

function buildScoreItems(result: ResultRecord): ScoreItem[] {
  return [
    {
      key: "lion",
      label: CHRONOTYPE_CONFIG.lion.viName,
      score: safeScore(result.lionScore),
    },
    {
      key: "bear",
      label: CHRONOTYPE_CONFIG.bear.viName,
      score: safeScore(result.bearScore),
    },
    {
      key: "wolf",
      label: CHRONOTYPE_CONFIG.wolf.viName,
      score: safeScore(result.wolfScore),
    },
    {
      key: "dolphin",
      label: CHRONOTYPE_CONFIG.dolphin.viName,
      score: safeScore(result.dolphinScore),
    },
  ];
}

function sortScores(scoreItems: ScoreItem[]) {
  return [...scoreItems].sort((a, b) => {
    const scoreDiff = b.score - a.score;

    if (scoreDiff !== 0) return scoreDiff;

    return TIE_BREAK_ORDER.indexOf(a.key) - TIE_BREAK_ORDER.indexOf(b.key);
  });
}

function getDominantChronotype(scoreItems: ScoreItem[]) {
  return sortScores(scoreItems)[0];
}

function getSecondaryChronotype(scoreItems: ScoreItem[]) {
  return sortScores(scoreItems)[1] ?? null;
}

function getScorePercent(score: number, maxScore: number) {
  if (maxScore <= 0) return 0;
  return Math.round((score / maxScore) * 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function ResultPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login?callbackUrl=/result");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      chronotypeResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          chronotype: true,
          lionScore: true,
          bearScore: true,
          wolfScore: true,
          dolphinScore: true,
          createdAt: true,
        },
      },
    },
  });

  const latestResult = user?.chronotypeResults[0] ?? null;

  if (!latestResult) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F4F2FA] text-[#1A1528]">
        <Navbar variant="user" />
        <BackgroundGlow />

        <section className="relative z-10 px-4 pb-20 pt-24 lg:px-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_40%,#FFFFFF_100%)] px-6 py-16 text-center md:px-10">
                <SoftDots />

                <div className="relative mx-auto max-w-3xl">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] border border-white/80 bg-white/85 text-[#6F59FF] shadow-[0_18px_40px_rgba(111,89,255,0.12)] backdrop-blur-xl">
                    <Brain className="h-7 w-7" />
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    Chưa có kết quả
                  </div>

                  <h1 className="mx-auto mt-5 max-w-[880px] text-[clamp(2.2rem,4vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                    Bắt đầu bài đánh giá để{" "}
                    <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                      ChronoFlow hiểu nhịp của bạn.
                    </span>
                  </h1>

                  <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                    Sau khoảng 2 phút, bạn sẽ nhận được chronotype chính, khuynh
                    hướng phụ và các khung giờ tham khảo để bắt đầu lập kế hoạch
                    theo năng lượng cá nhân.
                  </p>

                  <Link
                    href="/assessment"
                    className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-7 text-[14px] font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
                  >
                    Bắt đầu bài đánh giá
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  const scoreItems = buildScoreItems(latestResult);
  const dominant = getDominantChronotype(scoreItems);
  const secondary = getSecondaryChronotype(scoreItems);
  const maxScore = Math.max(...scoreItems.map((item) => item.score), 0);
  const dominantConfig = CHRONOTYPE_CONFIG[dominant.key];
  const secondaryConfig = secondary ? CHRONOTYPE_CONFIG[secondary.key] : null;
  const DominantIcon = dominantConfig.icon;
  const isBalanced =
    Boolean(secondary) &&
    (secondary?.score === dominant.score || dominant.score - secondary.score <= 5);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4F2FA] text-[#1A1528]">
      <Navbar variant="user" />
      <BackgroundGlow />

      <section className="relative z-10 px-4 pb-20 pt-24 lg:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_20px_80px_rgba(26,21,40,0.06)]">
            <div
              className={`relative overflow-hidden bg-gradient-to-br ${dominantConfig.softGradient} px-5 pb-8 pt-10 md:px-8 md:pb-10 lg:px-11 lg:pt-12`}
            >
              <SoftDots />
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/55 blur-[90px]" />
              <div className="pointer-events-none absolute bottom-[-160px] left-[26%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/45 blur-[110px]" />

              <div className="relative mx-auto max-w-5xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Kết quả chronotype
                </div>

                <h1 className="mx-auto mt-5 max-w-[980px] text-[clamp(2.2rem,4vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A1528]">
                  Bạn nghiêng về{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    {dominantConfig.viName}
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-[760px] text-[15px] font-medium leading-relaxed text-[#5B566E] md:text-[16px]">
                  {dominantConfig.summary} Đây là gợi ý lập kế hoạch theo
                  chronotype, không phải tư vấn y tế.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="group flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-[#1A1528] px-6 text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-black"
                  >
                    <ArrowRight className="h-4 w-4 text-[#4DA8FF]" />
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase leading-none tracking-wider text-gray-400">
                        TIẾP THEO
                      </span>
                      <span className="text-[14px] font-bold leading-tight">
                        Vào Dashboard
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/assessment"
                    className="group flex min-h-[52px] items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-6 text-[#1A1528] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F0FF]">
                      <RefreshCw className="h-3.5 w-3.5 text-[#6F59FF]" />
                    </div>
                    <span className="text-[14px] font-bold leading-tight">
                      Làm lại bài đánh giá
                    </span>
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
                <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/75 p-6 text-center shadow-[0_25px_70px_rgba(26,21,40,0.08)] backdrop-blur-xl">
                  <div className="absolute right-5 top-5 rounded-full border border-[#EAE8F7] bg-white/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3] shadow-sm">
                    {formatDate(latestResult.createdAt)}
                  </div>

                  <div className="mx-auto mt-8 flex h-[150px] w-[150px] items-center justify-center rounded-[40px] border border-white/80 bg-white shadow-[0_22px_55px_rgba(26,21,40,0.10)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dominantConfig.stickerUrl}
                      alt={dominantConfig.viName}
                      className="h-[108px] w-[108px] object-contain drop-shadow-xl"
                    />
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#EAE8F7] bg-[#F8F6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F59FF]">
                    <DominantIcon className="h-3.5 w-3.5" />
                    {dominantConfig.enName}
                  </div>

                  <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-[900] leading-[1.08] tracking-tight text-[#1A1528]">
                    {dominantConfig.viName}
                  </h2>

                  <p className="mx-auto mt-3 max-w-[320px] text-[14px] font-semibold leading-7 text-[#5B566E]">
                    {dominantConfig.headline}
                  </p>
                </div>

                <div className="grid gap-4">
                  {isBalanced && secondaryConfig ? (
                    <div className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_15px_40px_rgba(26,21,40,0.05)] backdrop-blur-xl">
                      <div className="inline-flex rounded-full border border-[#EAE8F7] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#6F59FF]">
                        Khuynh hướng cân bằng
                      </div>
                      <p className="mt-3 text-[14px] font-semibold leading-7 text-[#5B566E]">
                        Điểm của bạn khá cân bằng giữa{" "}
                        <span className="font-black text-[#1A1528]">
                          {dominantConfig.viName}
                        </span>{" "}
                        và{" "}
                        <span className="font-black text-[#1A1528]">
                          {secondaryConfig.viName}
                        </span>
                        . ChronoFlow chọn {dominantConfig.viName} làm hướng khởi
                        đầu để planner rõ ràng hơn.
                      </p>
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                    <SummaryMetric
                      icon={<TrendingUp className="h-4 w-4" />}
                      label="Khuynh hướng phụ"
                      value={secondaryConfig?.viName ?? "Chưa rõ"}
                    />
                    <SummaryMetric
                      icon={<Zap className="h-4 w-4" />}
                      label="Peak window"
                      value={dominantConfig.peakWindow}
                    />
                    <SummaryMetric
                      icon={<Activity className="h-4 w-4" />}
                      label="Energy style"
                      value={dominantConfig.energyStyle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-12">
            <SectionCard>
              <SectionHeading
                eyebrow="Tóm tắt kết quả"
                title={
                  <>
                    ChronoFlow gợi ý bạn{" "}
                    <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                      sắp lịch thế nào?
                    </span>
                  </>
                }
                icon={<Target className="h-4 w-4" />}
              />

              <p className="mx-auto mt-5 max-w-[760px] text-center text-[15px] font-medium leading-[1.9] text-[#615C7A] md:text-[16px]">
                {dominantConfig.plannerAdvice}
              </p>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                <WindowCard
                  icon={<Brain className="h-5 w-5" />}
                  label="Deep work"
                  value={dominantConfig.peakWindow}
                  helper="Khung tham khảo ban đầu"
                />
                <WindowCard
                  icon={<Clock3 className="h-5 w-5" />}
                  label="Task nhẹ / admin"
                  value={dominantConfig.lightWindow}
                  helper="Hợp cho việc ít áp lực hơn"
                />
                <WindowCard
                  icon={<Timer className="h-5 w-5" />}
                  label="Recovery"
                  value={dominantConfig.recoveryWindow}
                  helper="Giữ nhịp ngủ và hồi phục"
                />
              </div>
            </SectionCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <InsightListCard
                eyebrow="Điểm mạnh thường thấy"
                title="Bạn có thể tận dụng"
                items={dominantConfig.strengths}
                tone="positive"
              />
              <InsightListCard
                eyebrow="Điểm dễ hụt năng lượng"
                title="Bạn nên để ý"
                items={dominantConfig.watchOuts}
                tone="watch"
              />
            </div>

            <SectionCard>
              <div className="mx-auto max-w-[900px] text-center">
                <SectionHeading
                  eyebrow="Phân bổ điểm"
                  title={
                    <>
                      Điểm cao nhất quyết định{" "}
                      <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                        kết quả chính
                      </span>
                    </>
                  }
                  icon={<BarChart3 className="h-4 w-4" />}
                />
                <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#615C7A] md:text-[16px]">
                  Bảng điểm giúp bạn thấy rõ nhóm chronotype nào nổi bật nhất,
                  đồng thời nhận ra khuynh hướng phụ nếu các điểm khá sát nhau.
                </p>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {scoreItems.map((item) => {
                  const config = CHRONOTYPE_CONFIG[item.key];
                  const percent = getScorePercent(item.score, maxScore);
                  const isPrimary = item.key === dominant.key;
                  const isTopScore = item.score === maxScore && maxScore > 0;

                  return (
                    <ScoreCard
                      key={item.key}
                      stickerUrl={config.stickerUrl}
                      label={item.label}
                      score={item.score}
                      percent={percent}
                      isPrimary={isPrimary}
                      isTopScore={isTopScore}
                    />
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeading
                eyebrow="Làm gì tiếp theo?"
                title={
                  <>
                    Biến kết quả thành{" "}
                    <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                      lịch làm việc thật
                    </span>
                  </>
                }
                icon={<CheckCircle2 className="h-4 w-4" />}
              />

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                <NextStepCard
                  href="/dashboard"
                  icon={<Activity className="h-5 w-5" />}
                  title="Vào Dashboard"
                  text="Xem trạng thái hôm nay, coin và gợi ý việc nên làm tiếp."
                />
                <NextStepCard
                  href="/planner"
                  icon={<CalendarClock className="h-5 w-5" />}
                  title="Tạo task đầu tiên"
                  text="Đưa task vào Planner để ChronoFlow gợi ý khung phù hợp hơn."
                />
                <NextStepCard
                  href="/rhythm"
                  icon={<Waves className="h-5 w-5" />}
                  title="Theo dõi Rhythm"
                  text="Check-in năng lượng để biến reference window thành insight cá nhân."
                />
              </div>

              <div className="mt-8 overflow-hidden rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(135deg,#FBFAFF_0%,#F1F7FF_100%)] p-6 text-center shadow-sm">
                <p className="mx-auto max-w-2xl text-[14px] font-medium leading-7 text-[#5B566E]">
                  Nhịp sinh học của bạn có thể thay đổi theo lịch ngủ và thói
                  quen. Bạn có thể làm lại bài đánh giá bất kỳ lúc nào để cập
                  nhật planner phù hợp hơn.
                </p>
                <Link
                  href="/assessment"
                  className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-6 text-[13px] font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <RefreshCw className="h-4 w-4" />
                  Làm lại bài đánh giá
                </Link>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] shadow-sm">
                    <Compass className="h-3.5 w-3.5" />
                    Bản đồ khởi đầu
                  </div>
                  <h2 className="mt-4 text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
                    Kết quả này sẽ chính xác hơn khi{" "}
                    <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                      có dữ liệu thật.
                    </span>
                  </h2>
                </div>

                <p className="text-[15px] font-medium leading-[1.9] text-[#615C7A] md:text-[16px]">
                  Các khung giờ trên là reference window theo chronotype. Khi bạn
                  check-in năng lượng, lưu focus session và hoàn thành task,
                  ChronoFlow sẽ có thêm dữ liệu để điều chỉnh Rhythm sát với thói
                  quen thật của bạn hơn.
                </p>
              </div>
            </SectionCard>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute left-[10%] top-[-5%] h-[400px] w-[400px] rounded-full bg-[#DCCEFF]/60 blur-[100px]" />
      <div className="absolute right-[-5%] top-[10%] h-[300px] w-[300px] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
      <div className="absolute bottom-[-18%] left-[28%] h-[520px] w-[520px] rounded-full bg-white/70 blur-[120px]" />
    </div>
  );
}

function SoftDots() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-30">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 1.2px, transparent 1.2px)",
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(246,247,255,0.64)_100%)] px-6 py-10 shadow-[0_24px_70px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:px-10 md:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-0 h-[180px] w-[180px] rounded-full bg-white/35 blur-[70px]" />
        <div className="absolute bottom-0 right-[-4%] h-[220px] w-[220px] rounded-full bg-[#D8E8FF]/30 blur-[80px]" />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-[0_10px_25px_rgba(111,89,255,0.08)]">
        {icon}
        {eyebrow}
      </div>

      <h2 className="text-[clamp(2.2rem,4vw,3.6rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
        {title}
      </h2>
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        <span className="text-[#6F59FF]">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-[14px] font-[900] leading-6 text-[#1A1528]">
        {value}
      </div>
    </div>
  );
}

function WindowCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="group rounded-[32px] border border-[#EAE8F7] bg-white/88 p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_25px_50px_rgba(111,89,255,0.08)]">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/70 bg-white text-[#6F59FF] shadow-[0_10px_24px_rgba(26,21,40,0.06)] transition group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <div className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[20px] font-[900] tracking-tight text-[#1A1528]">
        {value}
      </div>
      <p className="mt-3 text-[14px] font-medium leading-7 text-[#615C7A]">
        {helper}
      </p>
      <div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] transition-all duration-300 group-hover:w-24" />
    </div>
  );
}

function InsightListCard({
  eyebrow,
  title,
  items,
  tone,
}: {
  eyebrow: string;
  title: string;
  items: string[];
  tone: "positive" | "watch";
}) {
  const iconClass =
    tone === "positive"
      ? "bg-[#ECFCF7] text-[#16A085]"
      : "bg-[#F3F0FF] text-[#6F59FF]";

  return (
    <SectionCard>
      <div className="text-left">
        <div className="inline-flex rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm">
          {eyebrow}
        </div>

        <h3 className="mt-5 text-[clamp(2rem,3.4vw,3rem)] font-[900] leading-[1.1] tracking-tight text-[#1A1528]">
          {title}
        </h3>

        <div className="mt-7 grid gap-3">
          {items.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-[24px] border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl"
            >
              <span
                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${iconClass}`}
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <span className="text-[14px] font-medium leading-7 text-[#5B566E]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function ScoreCard({
  stickerUrl,
  label,
  score,
  percent,
  isPrimary,
  isTopScore,
}: {
  stickerUrl: string;
  label: string;
  score: number;
  percent: number;
  isPrimary: boolean;
  isTopScore: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[32px] border p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(111,89,255,0.08)] ${
        isPrimary
          ? "border-[#CFC7FF] bg-[linear-gradient(180deg,#F8F6FF_0%,#FFFFFF_100%)]"
          : "border-[#EAE8F7] bg-white/82"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-20 w-20 place-items-center rounded-[24px] border border-white/80 bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stickerUrl}
            alt={label}
            className="h-14 w-14 object-contain drop-shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:scale-110"
          />
        </div>

        {isTopScore ? (
          <span className="rounded-full bg-[#6F59FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-[0_10px_20px_rgba(111,89,255,0.20)]">
            Cao nhất
          </span>
        ) : null}
      </div>

      <div className="mt-5 text-[18px] font-[900] text-[#1A1528]">{label}</div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="text-[36px] font-[900] leading-none tracking-tight text-[#1A1528]">
          {score}
        </div>
        <div className="rounded-full border border-[#EAE8F7] bg-[#FBFAFF] px-3 py-1 text-[12px] font-black text-[#8A84A3]">
          {percent}%
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#EEEAFB]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-4 text-[13px] font-medium leading-6 text-[#615C7A]">
        {percent > 0
          ? `${percent}% so với nhóm cao nhất của bạn.`
          : "Chưa có điểm để so sánh."}
      </p>
    </div>
  );
}

function NextStepCard({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[32px] border border-[#EAE8F7] bg-white/88 p-6 shadow-[0_15px_40px_rgba(26,21,40,0.04)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_25px_50px_rgba(111,89,255,0.08)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/70 bg-white text-[#6F59FF] shadow-[0_10px_24px_rgba(26,21,40,0.06)] transition group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-[#8A84A3] transition group-hover:translate-x-1 group-hover:text-[#6F59FF]" />
      </div>

      <h3 className="mt-5 text-[20px] font-[900] leading-tight text-[#1A1528]">
        {title}
      </h3>

      <p className="mt-3 text-[14px] font-medium leading-7 text-[#615C7A]">
        {text}
      </p>

      <div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] transition-all duration-300 group-hover:w-24" />
    </Link>
  );
}