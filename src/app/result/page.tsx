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
  emoji: string;
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

const CHRONOTYPE_CONFIG: Record<ChronotypeKey, ChronotypeDisplayConfig> = {
  lion: {
    key: "lion",
    viName: "Sư tử",
    emoji: "🦁",
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
    accent: "#F59E0B",
    softGradient: "from-[#FFF9EF] via-[#FFF3DA] to-[#FDF0E5]",
    icon: Zap,
  },
  bear: {
    key: "bear",
    viName: "Gấu",
    emoji: "🐻",
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
    softGradient: "from-[#FAF8FF] via-[#F2EEFF] to-[#E9E4FF]",
    icon: Activity,
  },
  wolf: {
    key: "wolf",
    viName: "Sói",
    emoji: "🐺",
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
    softGradient: "from-[#F6F6FF] via-[#ECEBFF] to-[#E3E8FF]",
    icon: Moon,
  },
  dolphin: {
    key: "dolphin",
    viName: "Cá heo",
    emoji: "🐬",
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
    accent: "#4DA8FF",
    softGradient: "from-[#F8FCFF] via-[#F1F7FF] to-[#EAF2FF]",
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
      <main className="min-h-screen overflow-x-hidden bg-[#F4F2FA] text-[#1A152E]">
        <Navbar variant="user" />
        <BackgroundGlow />

        <section className="relative z-10 mx-auto max-w-[1280px] px-4 pb-20 pt-24 md:px-8">
          <div className="overflow-hidden rounded-[40px] border border-white/80 bg-white shadow-[0_24px_90px_rgba(26,21,40,0.07)]">
            <div className="relative bg-[linear-gradient(180deg,#F2EDFF_0%,#E9E2FF_42%,#FFFFFF_100%)] px-6 py-12 text-center md:px-10 md:py-16">
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(#FFFFFF 1.2px, transparent 1.2px)",
                    backgroundSize: "30px 30px",
                  }}
                />
              </div>

              <div className="relative mx-auto max-w-3xl">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] border border-white/80 bg-white/85 text-[#6F59FF] shadow-[0_18px_40px_rgba(111,89,255,0.12)] backdrop-blur-xl">
                  <Brain className="h-7 w-7" />
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Chưa có kết quả
                </div>

                <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(2.15rem,4.5vw,4rem)] font-[900] leading-[1.05] tracking-tight text-[#1A152E]">
                  Bắt đầu bài đánh giá để{" "}
                  <span className="bg-gradient-to-r from-[#6F59FF] to-[#4DA8FF] bg-clip-text text-transparent">
                    ChronoFlow hiểu nhịp của bạn.
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-8 text-[#5B566E] md:text-[16px]">
                  Sau khoảng 2 phút, bạn sẽ nhận được chronotype chính, khuynh
                  hướng phụ và các khung giờ tham khảo để bắt đầu lập kế hoạch
                  theo năng lượng cá nhân.
                </p>

                <Link
                  href="/assessment"
                  className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-7 text-[14px] font-black text-white shadow-[0_18px_38px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Bắt đầu bài đánh giá
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
    <main className="min-h-screen overflow-x-hidden bg-[#F4F2FA] text-[#1A152E]">
      <Navbar variant="user" />
      <BackgroundGlow />

      <section className="relative z-10 mx-auto max-w-[1280px] px-4 pb-20 pt-24 md:px-8">
        <div
          className={`overflow-hidden rounded-[40px] border border-white/80 bg-gradient-to-br ${dominantConfig.softGradient} shadow-[0_30px_100px_rgba(26,21,40,0.08)]`}
        >
          <div className="relative overflow-hidden px-6 py-8 md:px-9 md:py-10 lg:px-11 lg:py-12">
            <div className="pointer-events-none absolute inset-0 opacity-35">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(#FFFFFF 1.2px, transparent 1.2px)",
                  backgroundSize: "30px 30px",
                }}
              />
            </div>
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/50 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-[#D9EAFF]/45 blur-[100px]" />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_390px] lg:items-center">
              <div className="py-4 lg:py-8">
                <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/82 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Kết quả chronotype
                </div>

                <h1 className="max-w-4xl text-[clamp(2.35rem,5.4vw,5rem)] font-[900] leading-[1.02] tracking-tight text-[#1A152E]">
                  Bạn nghiêng về{" "}
                  <span className="bg-[linear-gradient(135deg,#6F59FF_0%,#4DA8FF_100%)] bg-clip-text text-transparent">
                    {dominantConfig.viName}
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-[16px] font-medium leading-8 text-[#5B566E]">
                  {dominantConfig.summary} Đây là gợi ý lập kế hoạch theo
                  chronotype, không phải tư vấn y tế.
                </p>

                {isBalanced && secondaryConfig ? (
                  <div className="mt-6 max-w-2xl rounded-[26px] border border-white/80 bg-white/74 p-5 text-[14px] font-semibold leading-7 text-[#5B566E] shadow-[0_14px_36px_rgba(26,21,40,0.05)] backdrop-blur-xl">
                    Điểm của bạn khá cân bằng giữa{" "}
                    <span className="font-black text-[#1A152E]">
                      {dominantConfig.viName}
                    </span>{" "}
                    và{" "}
                    <span className="font-black text-[#1A152E]">
                      {secondaryConfig.viName}
                    </span>
                    . ChronoFlow chọn {dominantConfig.viName} làm hướng khởi đầu
                    để planner rõ ràng hơn, nhưng bạn vẫn có thể theo dõi Rhythm
                    để điều chỉnh sát với dữ liệu thật.
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-7 text-[14px] font-black text-white shadow-[0_18px_38px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
                  >
                    Vào Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/assessment"
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-white/80 bg-white/82 px-7 text-[14px] font-black text-[#5B46FF] shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Làm lại bài đánh giá
                  </Link>
                </div>
              </div>

              <div className="relative rounded-[36px] border border-white/80 bg-white/84 p-5 shadow-[0_22px_75px_rgba(97,76,197,0.11)] backdrop-blur-2xl md:p-6">
                <div className="absolute right-5 top-5 rounded-full border border-[#EAE8F7] bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#8A84A3] shadow-sm">
                  {formatDate(latestResult.createdAt)}
                </div>

                <div className="grid h-28 w-28 place-items-center rounded-[32px] border border-white/80 bg-white text-[64px] shadow-[0_16px_45px_rgba(26,21,40,0.08)]">
                  {dominantConfig.emoji}
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F4F0FF]"
                    style={{ color: dominantConfig.accent }}
                  >
                    <DominantIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8A84A3]">
                      Chronotype chính
                    </div>
                    <div className="text-[16px] font-black text-[#1A152E]">
                      {dominantConfig.headline}
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-[2.35rem] font-[900] leading-none tracking-tight text-[#1A152E]">
                  {dominantConfig.viName}
                </div>

                <div className="mt-6 grid gap-3">
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_410px]">
          <SectionCard>
            <SectionHeading
              eyebrow="Tóm tắt kết quả"
              title="ChronoFlow gợi ý bạn nên..."
              icon={<Target className="h-4 w-4" />}
            />
            <p className="mt-4 max-w-3xl text-[15px] font-medium leading-8 text-[#5B566E]">
              {dominantConfig.plannerAdvice}
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
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

          <SectionCard>
            <SectionHeading
              eyebrow="Điểm cần nhớ"
              title="Đây là bản đồ khởi đầu"
              icon={<Compass className="h-4 w-4" />}
            />
            <p className="mt-4 text-[14px] font-medium leading-7 text-[#5B566E]">
              Các khung giờ trên là reference window theo chronotype. Khi bạn
              check-in năng lượng và lưu focus session, ChronoFlow sẽ có thêm dữ
              liệu thật để điều chỉnh sát hơn.
            </p>
            <Link
              href="/rhythm"
              className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#EAE8F7] bg-white px-5 text-[13px] font-black text-[#5B46FF] shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(97,76,197,0.10)]"
            >
              Theo dõi Rhythm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionCard>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
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

        <section className="mt-8">
          <SectionCard>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Phân bổ điểm"
                title="Điểm cao nhất quyết định kết quả chính"
                icon={<BarChart3 className="h-4 w-4" />}
              />
              <div className="w-fit rounded-full border border-[#EAE8F7] bg-[#FBFAFF] px-4 py-2 text-[12px] font-black text-[#6F59FF] shadow-sm">
                Max score: {maxScore}
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {scoreItems.map((item) => {
                const config = CHRONOTYPE_CONFIG[item.key];
                const percent = getScorePercent(item.score, maxScore);
                const isPrimary = item.key === dominant.key;
                const isTopScore = item.score === maxScore && maxScore > 0;

                return (
                  <ScoreCard
                    key={item.key}
                    emoji={config.emoji}
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
        </section>

        <section className="mt-8">
          <SectionCard>
            <SectionHeading
              eyebrow="Làm gì tiếp theo?"
              title="Biến kết quả thành lịch làm việc thật"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />

            <div className="mt-7 grid gap-4 md:grid-cols-3">
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

            <div className="mt-7 overflow-hidden rounded-[30px] border border-[#EAE8F7] bg-[linear-gradient(135deg,#FBFAFF_0%,#F1F7FF_100%)] p-5 text-center shadow-sm md:p-6">
              <p className="mx-auto max-w-2xl text-[14px] font-medium leading-7 text-[#5B566E]">
                Nhịp sinh học của bạn có thể thay đổi theo lịch ngủ và thói
                quen. Bạn có thể làm lại bài đánh giá bất kỳ lúc nào để cập nhật
                planner phù hợp hơn.
              </p>
              <Link
                href="/assessment"
                className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[13px] font-black text-white shadow-[0_16px_34px_rgba(26,21,40,0.16)] transition hover:-translate-y-0.5 hover:bg-black"
              >
                <RefreshCw className="h-4 w-4" />
                Làm lại bài đánh giá
              </Link>
            </div>
          </SectionCard>
        </section>
      </section>

      <Footer />
    </main>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute left-[-10%] top-[8%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/60 blur-[120px]" />
      <div className="absolute right-[-8%] top-[14%] h-[360px] w-[360px] rounded-full bg-[#D9EAFF]/70 blur-[120px]" />
      <div className="absolute bottom-[-18%] left-[28%] h-[520px] w-[520px] rounded-full bg-white/70 blur-[120px]" />
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(248,249,255,0.72)_100%)] p-5 shadow-[0_22px_80px_rgba(26,21,40,0.065)] backdrop-blur-2xl md:p-7">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6%] top-[-10%] h-40 w-40 rounded-full bg-white/45 blur-[70px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-52 w-52 rounded-full bg-[#D8E8FF]/28 blur-[80px]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#EAE8F7] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#6F59FF] shadow-sm">
        {icon}
        {eyebrow}
      </div>
      <h2 className="mt-3 text-[clamp(1.65rem,3vw,2.45rem)] font-[900] leading-[1.08] tracking-tight text-[#1A152E]">
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
    <div className="rounded-[24px] border border-[#EAE8F7] bg-[#FBFAFF] p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        <span className="text-[#6F59FF]">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-[14px] font-black leading-6 text-[#1A152E]">
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
    <div className="group rounded-[28px] border border-[#EAE8F7] bg-[#FBFAFF] p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_42px_rgba(97,76,197,0.09)]">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#6F59FF] shadow-sm transition group-hover:scale-105">
        {icon}
      </div>
      <div className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[20px] font-[900] tracking-tight text-[#1A152E]">
        {value}
      </div>
      <p className="mt-2 text-[12px] font-semibold leading-6 text-[#615C7A]">
        {helper}
      </p>
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
    tone === "positive" ? "text-[#16A085] bg-[#ECFBF7]" : "text-[#6F59FF] bg-[#F3F0FF]";

  return (
    <SectionCard>
      <div className="inline-flex rounded-full border border-[#EAE8F7] bg-[#F7F4FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#6F59FF]">
        {eyebrow}
      </div>
      <h3 className="mt-3 text-[clamp(1.55rem,3vw,2.15rem)] font-[900] tracking-tight text-[#1A152E]">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-[24px] border border-[#EAE8F7] bg-[#FBFAFF] px-4 py-3 shadow-sm"
          >
            <span
              className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-xl ${iconClass}`}
            >
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-semibold leading-6 text-[#5B566E]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ScoreCard({
  emoji,
  label,
  score,
  percent,
  isPrimary,
  isTopScore,
}: {
  emoji: string;
  label: string;
  score: number;
  percent: number;
  isPrimary: boolean;
  isTopScore: boolean;
}) {
  return (
    <div
      className={`group rounded-[30px] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(97,76,197,0.10)] ${
        isPrimary
          ? "border-[#BFB7FF] bg-[linear-gradient(180deg,#F8F6FF_0%,#FFFFFF_100%)]"
          : "border-[#EAE8F7] bg-white/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[30px]">{emoji}</div>
          <div className="mt-2 text-[15px] font-black text-[#1A152E]">
            {label}
          </div>
        </div>

        {isTopScore ? (
          <span className="rounded-full bg-[#6F59FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-[0_10px_20px_rgba(111,89,255,0.20)]">
            Cao nhất
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="text-[34px] font-[900] leading-none tracking-tight text-[#1A152E]">
          {score}
        </div>
        <div className="rounded-full border border-[#EAE8F7] bg-[#FBFAFF] px-3 py-1 text-[12px] font-black text-[#8A84A3]">
          {percent}%
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#EEEAFB]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#6F59FF_0%,#4DA8FF_100%)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-[12px] font-medium leading-6 text-[#615C7A]">
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
      className="group rounded-[30px] border border-[#EAE8F7] bg-[#FBFAFF] p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(97,76,197,0.10)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#6F59FF] shadow-sm transition group-hover:scale-105">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-[#8A84A3] transition group-hover:translate-x-1 group-hover:text-[#6F59FF]" />
      </div>
      <h3 className="mt-4 text-[17px] font-black text-[#1A152E]">{title}</h3>
      <p className="mt-2 text-[13px] font-medium leading-6 text-[#615C7A]">
        {text}
      </p>
    </Link>
  );
}