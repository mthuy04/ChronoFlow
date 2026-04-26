import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MoonStar,
  Sparkles,
  Sunrise,
  Sunset,
  Target,
  Waves,
  Zap,
  TrendingUp,
  ShieldCheck,
  Activity,
  BarChart3,
} from "lucide-react";

type ChronotypeKey = "LION" | "BEAR" | "WOLF" | "DOLPHIN";

function normalizeChronotype(value: string | null | undefined): ChronotypeKey | null {
  if (!value) return null;
  const key = String(value).toUpperCase();
  if (key.includes("LION")) return "LION";
  if (key.includes("WOLF")) return "WOLF";
  if (key.includes("DOLPHIN")) return "DOLPHIN";
  if (key.includes("BEAR")) return "BEAR";
  return null;
}

const CHRONOTYPE_META: Record<
  ChronotypeKey,
  {
    label: string;
    emoji: string;
    subtitle: string;
    icon: React.ReactNode;
    summary: string;
    focusWindow: string;
    supportWindow: string;
    recoveryWindow: string;
    gradient: string;
    glow: string;
    surface: string;
    border: string;
    patternTitle: string;
    patternText: string;
    strengths: string[];
    risks: string[];
    dailyFlow: Array<{
      title: string;
      time: string;
      text: string;
    }>;
    actionTips: string[];
    energySeries: Array<{ label: string; value: number }>;
  }
> = {
  LION: {
    label: "Sư tử",
    emoji: "🦁",
    subtitle: "Mạnh vào buổi sáng",
    icon: <Sunrise className="h-5 w-5 text-[#C98C42]" />,
    summary:
      "Bạn thường tỉnh táo sớm, vào việc nhanh ở đầu ngày và có xu hướng hạ dần năng lượng về chiều hoặc tối. Nếu bảo vệ đúng giờ vàng buổi sáng, hiệu suất của bạn thường rất cao.",
    focusWindow: "07:00 - 10:00",
    supportWindow: "13:00 - 15:00",
    recoveryWindow: "Tối sớm",
    gradient: "from-[#F59E0B] via-[#F6B54A] to-[#FCD34D]",
    glow: "bg-[#F59E0B]/18",
    surface: "from-[#FFF9F0] via-[#FFF6EA] to-[#FFF1DD]",
    border: "border-[#F4D6A7]",
    patternTitle: "Đường nhịp tăng sớm, đạt đỉnh nhanh rồi hạ dần",
    patternText:
      "Bạn hợp với deep work, học tập, ra quyết định hoặc xử lý việc khó ở đầu ngày. Buổi chiều nên giảm độ khó của task để tránh ép nhịp tự nhiên.",
    strengths: [
      "Vào guồng sớm và xử lý việc khó tốt đầu ngày.",
      "Dễ duy trì routine khi lịch rõ ràng.",
      "Nếu bảo vệ focus block buổi sáng, hiệu suất rất mạnh.",
    ],
    risks: [
      "Dễ phí giờ vàng cho email, admin hoặc việc vụn.",
      "Chiều dễ tụt năng lượng nếu sáng quá tải.",
      "Tối thường không phải lúc đẹp cho việc trí óc nặng.",
    ],
    dailyFlow: [
      {
        title: "Khởi động và lên nhịp",
        time: "06:30 - 07:30",
        text: "Bạn thường tỉnh khá sớm. Đây là lúc khởi động nhẹ rồi chuyển nhanh vào block có chiều sâu.",
      },
      {
        title: "Deep work / việc khó",
        time: "07:30 - 10:00",
        text: "Khung mạnh nhất cho học tập, viết, phân tích, ra quyết định hoặc giải quyết việc nặng đầu óc.",
      },
      {
        title: "Việc nhẹ / phối hợp",
        time: "13:00 - 15:00",
        text: "Phù hợp hơn cho admin, follow-up, họp ngắn, việc phản hồi hoặc xử lý đầu việc nhẹ.",
      },
    ],
    actionTips: [
      "Chặn trước focus block buổi sáng và bảo vệ nó như lịch cố định.",
      "Dời email, admin hoặc việc nhẹ sang đầu giờ chiều.",
      "Tối ưu chất lượng ngày bằng cách không ép việc nặng quá muộn.",
    ],
    energySeries: [
      { label: "6h", value: 58 },
      { label: "8h", value: 96 },
      { label: "10h", value: 88 },
      { label: "12h", value: 64 },
      { label: "15h", value: 42 },
      { label: "18h", value: 24 },
      { label: "21h", value: 10 },
    ],
  },
  BEAR: {
    label: "Gấu",
    emoji: "🐻",
    subtitle: "Nhịp cân bằng ban ngày",
    icon: <Sunset className="h-5 w-5 text-[#6C58F2]" />,
    summary:
      "Bạn hợp với nhịp sống ban ngày hơn đa số, có thể giữ mức năng lượng ổn định và làm việc tốt theo lịch tiêu chuẩn. Điểm quan trọng là phải giữ giờ mạnh cho task thật sự quan trọng.",
    focusWindow: "09:00 - 12:00",
    supportWindow: "14:00 - 16:00",
    recoveryWindow: "Cuối chiều",
    gradient: "from-[#6F59FF] via-[#8571FF] to-[#9B8CFF]",
    glow: "bg-[#6F59FF]/18",
    surface: "from-[#F8F7FF] via-[#F3F0FF] to-[#ECE8FF]",
    border: "border-[#D9CEFF]",
    patternTitle: "Đường nhịp tương đối đều, mạnh nhất vào cuối buổi sáng",
    patternText:
      "Bạn không cần lịch quá cực đoan, nhưng nếu không chủ động chặn block tập trung thì cả ngày rất dễ bị phân mảnh bởi họp, phản hồi và task vụn.",
    strengths: [
      "Phù hợp với lịch ban ngày và các hệ thống planning ổn định.",
      "Giữ hiệu suất đều qua nhiều khung giờ tốt hơn đa số.",
      "Phối hợp nhóm, học tập, làm việc theo lịch khá thuận.",
    ],
    risks: [
      "Dễ tưởng mình hợp với mọi task ở mọi thời điểm.",
      "Giờ mạnh dễ bị lấp bởi việc phản ứng nếu không chặn lịch.",
      "Chiều có thể hơi chững nếu sáng dùng năng lượng thiếu chiến lược.",
    ],
    dailyFlow: [
      {
        title: "Khởi động vừa phải",
        time: "07:30 - 09:00",
        text: "Bạn cần chút thời gian để ấm máy, nhưng sau đó thường giữ phong độ ổn định khá tốt.",
      },
      {
        title: "Deep work / học tập",
        time: "09:00 - 12:00",
        text: "Khung đẹp nhất cho việc khó, học nội dung nặng, xử lý logic, viết hoặc tập trung sâu.",
      },
      {
        title: "Cộng tác / việc nhẹ",
        time: "14:00 - 16:00",
        text: "Phù hợp cho họp, admin, follow-up hoặc các đầu việc ít tốn chiều sâu hơn.",
      },
    ],
    actionTips: [
      "Đặt block tập trung trước rồi mới cho việc phản hồi vào sau.",
      "Duy trì giờ ngủ và giờ dậy tương đối ổn để giữ nhịp đẹp.",
      "Khi chiều chững, giảm độ khó task thay vì cố ép thêm deep work.",
    ],
    energySeries: [
      { label: "6h", value: 26 },
      { label: "8h", value: 58 },
      { label: "10h", value: 90 },
      { label: "12h", value: 84 },
      { label: "15h", value: 62 },
      { label: "18h", value: 34 },
      { label: "21h", value: 18 },
    ],
  },
  WOLF: {
    label: "Sói",
    emoji: "🐺",
    subtitle: "Mạnh hơn về chiều và tối",
    icon: <MoonStar className="h-5 w-5 text-[#5B46FF]" />,
    summary:
      "Bạn thường lên nhịp chậm hơn vào buổi sáng nhưng bùng năng lượng tốt hơn ở cuối chiều hoặc tối sớm. Việc khó đặt quá sớm thường khiến bạn cảm thấy mình “không đúng trạng thái”.",
    focusWindow: "14:30 - 18:00",
    supportWindow: "19:00 - 21:00",
    recoveryWindow: "Sáng nhẹ nhàng",
    gradient: "from-[#5B46FF] via-[#7564FF] to-[#8D7CFF]",
    glow: "bg-[#5B46FF]/18",
    surface: "from-[#F5F5FF] via-[#EFEDFF] to-[#E8E5FF]",
    border: "border-[#D5D1FF]",
    patternTitle: "Đường nhịp lên chậm hơn nhưng đạt đỉnh muộn hơn",
    patternText:
      "Bạn hợp hơn với việc sáng tạo, xử lý logic sâu hoặc deep work vào cuối chiều và tối sớm. Buổi sáng nên được dùng mềm hơn để không chống lại nhịp tự nhiên.",
    strengths: [
      "Dễ vào flow tốt hơn ở cuối ngày.",
      "Hợp với việc sáng tạo, viết, thiết kế hoặc tư duy sâu vào chiều/tối.",
      "Nếu sắp lịch đúng, hiệu suất muộn trong ngày có thể rất mạnh.",
    ],
    risks: [
      "Buổi sáng dễ ì hoặc khó bắt nhịp.",
      "Lịch quá sớm dễ làm bạn tự đánh giá thấp bản thân.",
      "Nếu không giữ ranh giới, dễ kéo dài năng lượng sang quá khuya.",
    ],
    dailyFlow: [
      {
        title: "Sáng khởi động mềm",
        time: "08:00 - 10:30",
        text: "Phù hợp hơn cho setup, email, admin hoặc việc ít áp lực. Đừng ép deep work quá sớm nếu không bắt buộc.",
      },
      {
        title: "Tăng nhịp dần",
        time: "12:00 - 14:30",
        text: "Năng lượng bắt đầu lên rõ hơn, có thể chuyển sang các task cần tập trung mức vừa.",
      },
      {
        title: "Khung mạnh nhất",
        time: "14:30 - 18:00",
        text: "Đây là lúc phù hợp nhất cho việc khó, sáng tạo, học nội dung nặng hoặc block cần chiều sâu.",
      },
    ],
    actionTips: [
      "Buổi sáng nên giao cho bản thân task nhẹ hoặc khởi động mềm.",
      "Đặt task khó nhất vào cuối chiều, khi bạn thật sự vào guồng.",
      "Giữ ranh giới cho buổi tối để không kéo nhịp sang quá khuya.",
    ],
    energySeries: [
      { label: "6h", value: 12 },
      { label: "8h", value: 22 },
      { label: "10h", value: 38 },
      { label: "12h", value: 56 },
      { label: "15h", value: 82 },
      { label: "18h", value: 96 },
      { label: "21h", value: 80 },
    ],
  },
  DOLPHIN: {
    label: "Cá heo",
    emoji: "🐬",
    subtitle: "Nhạy giấc ngủ, hợp block gọn",
    icon: <Waves className="h-5 w-5 text-[#7C6BEB]" />,
    summary:
      "Bạn nhạy hơn với giấc ngủ, môi trường hoặc áp lực tinh thần. Điều đó không có nghĩa bạn kém năng suất; nó chỉ có nghĩa là bạn hợp với planner mềm, block ngắn và môi trường tập trung sạch hơn.",
    focusWindow: "10:00 - 11:30",
    supportWindow: "16:00 - 18:00",
    recoveryWindow: "Xen kẽ trong ngày",
    gradient: "from-[#4DA8FF] via-[#62BCFF] to-[#7DD3FC]",
    glow: "bg-[#4DA8FF]/18",
    surface: "from-[#F9F8FF] via-[#F4F1FF] to-[#EEEAFE]",
    border: "border-[#DDD4FF]",
    patternTitle: "Đường nhịp linh hoạt và nhạy hơn, không đều như các nhóm khác",
    patternText:
      "Bạn thường làm tốt hơn khi lịch có khoảng đệm, focus block ngắn, mục tiêu rõ và ít xao nhãng. Planner quá cứng hoặc quá dày có thể phản tác dụng.",
    strengths: [
      "Nhạy với tín hiệu cơ thể và trạng thái tập trung thật sự.",
      "Hợp với block ngắn, rõ mục tiêu và môi trường được kiểm soát tốt.",
      "Nếu tối ưu không gian làm việc, chất lượng tập trung có thể rất tốt.",
    ],
    risks: [
      "Dễ mất nhịp nếu ngủ không ngon hoặc lịch quá dày.",
      "Môi trường ồn hoặc task phân mảnh dễ làm tụt chất lượng.",
      "Lịch quá cứng dễ gây mệt tinh thần nhanh hơn.",
    ],
    dailyFlow: [
      {
        title: "Khởi động cẩn thận",
        time: "08:00 - 10:00",
        text: "Cần môi trường ổn và nhịp nhẹ để vào guồng. Không nên ném ngay task quá nặng nếu đầu óc chưa rõ.",
      },
      {
        title: "Focus block gọn",
        time: "10:00 - 11:30",
        text: "Khung phù hợp cho block tập trung ngắn, rõ mục tiêu và ít xao nhãng.",
      },
      {
        title: "Khung phụ linh hoạt",
        time: "16:00 - 18:00",
        text: "Có thể xử lý thêm việc vừa phải hoặc nhẹ hơn nếu trạng thái cơ thể và môi trường ổn.",
      },
    ],
    actionTips: [
      "Chia việc lớn thành block ngắn thay vì nhồi một khối quá dài.",
      "Tối ưu môi trường làm việc trước khi tối ưu số lượng task.",
      "Để chỗ trống trong lịch để không nghẹt năng lượng.",
    ],
    energySeries: [
      { label: "6h", value: 28 },
      { label: "8h", value: 42 },
      { label: "10h", value: 78 },
      { label: "12h", value: 54 },
      { label: "15h", value: 45 },
      { label: "18h", value: 68 },
      { label: "21h", value: 34 },
    ],
  },
};

function getScoreMax(result: {
  lionScore: number;
  bearScore: number;
  wolfScore: number;
  dolphinScore: number;
}) {
  return Math.max(
    result.lionScore,
    result.bearScore,
    result.wolfScore,
    result.dolphinScore,
    1
  );
}

export default async function RhythmPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
        <Navbar />
        <section className="relative px-6 py-24">
          <AmbientBg />
          <div className="relative z-10 mx-auto max-w-3xl rounded-[40px] border border-white/80 bg-white/80 p-10 text-center shadow-[0_30px_90px_rgba(97,76,197,0.10)] backdrop-blur-2xl">
            <div className="mb-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#F7F4FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              ChronoFlow Rhythm
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D] md:text-5xl">
              Bạn cần đăng nhập để xem nhịp của mình
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[#615C7A]">
              Đăng nhập để xem chronotype, đường năng lượng trong ngày và các khung giờ phù hợp nhất với nhịp sinh học của bạn.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/login?callbackUrl=/rhythm"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(108,92,255,0.24)] transition hover:-translate-y-0.5"
              >
                Đăng nhập
              </Link>
              <Link
                href="/assessment"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-6 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
              >
                Làm bài đánh giá
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      chronotypeResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      weeklyInsights: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      tasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
        <Navbar />
        <section className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-[36px] border border-white/80 bg-white/90 p-10 text-center shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D]">
              Không tìm thấy tài khoản
            </h1>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const chronotype = normalizeChronotype(user.chronotype);
  const latestResult = user.chronotypeResults[0] ?? null;
  const latestInsight = user.weeklyInsights[0] ?? null;

  if (!chronotype) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
        <Navbar />
        <section className="relative px-6 py-24">
          <AmbientBg />
          <div className="relative z-10 mx-auto max-w-3xl rounded-[40px] border border-white/80 bg-white/85 p-10 text-center shadow-[0_30px_90px_rgba(97,76,197,0.10)] backdrop-blur-2xl">
            <div className="mb-4 inline-flex rounded-full border border-[#E9E5FF] bg-[#F7F4FF] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              Rhythm chưa sẵn sàng
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#241F3D] md:text-5xl">
              Bạn chưa có kết quả chronotype
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[#615C7A]">
              Hãy làm bài đánh giá trước để ChronoFlow hiểu nhịp sinh học của bạn và hiển thị trang Rhythm cá nhân hoá hơn.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/assessment"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(26,21,40,0.16)] transition hover:-translate-y-0.5"
              >
                Làm bài đánh giá ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#E9E5FF] bg-white px-6 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
              >
                Về dashboard
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const meta = CHRONOTYPE_META[chronotype];
  const displayName = user.name?.trim() || "bạn";
  const firstName = displayName.split(" ").slice(-1)[0] || displayName;
  const totalTasks = user.tasks.length;
  const completedTasks = user.tasks.filter((task) => task.completed).length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F4FB] text-[#241F3D]">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-20 pt-4 md:px-6 lg:px-8">
        <AmbientBg />

        <div className="relative z-10 mx-auto max-w-[1320px] space-y-8">
          <section className="overflow-hidden rounded-[44px] border border-white/80 bg-white/88 shadow-[0_35px_120px_rgba(97,76,197,0.12)] backdrop-blur-2xl">
            <div className={`relative overflow-hidden bg-[linear-gradient(180deg,#F3EEFF_0%,#ECE5FF_45%,#E7DEFF_100%)] px-5 py-8 md:px-8 md:py-10 xl:px-10`}>
              <div className="pointer-events-none absolute inset-0">
                <div className={`absolute left-[6%] top-[-12%] h-[240px] w-[240px] rounded-full ${meta.glow} blur-[100px]`} />
                <div className="absolute right-[8%] top-[8%] h-[180px] w-[180px] rounded-full bg-[#D9EAFF]/60 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[35%] h-[160px] w-[160px] rounded-full bg-white/40 blur-[70px]" />
              </div>

              <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_420px] xl:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_22px_rgba(111,89,255,0.08)] backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    ChronoFlow Rhythm
                  </div>

                  <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,5vw,5.3rem)] font-black leading-[0.96] tracking-tight text-[#1A1528]">
                    Khám phá{" "}
                    <span className="bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] bg-clip-text text-transparent">
                      nhịp sinh học
                    </span>{" "}
                    của {firstName}.
                  </h1>

                  <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#615C7A] md:text-[16px]">
                    Bạn đang nghiêng về chronotype{" "}
                    <span className="font-black text-[#241F3D]">
                      {meta.label} {meta.emoji}
                    </span>
                    . {meta.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Chip icon={meta.icon}>{meta.subtitle}</Chip>
                    <Chip icon={<Zap className="h-4 w-4 text-[#7C5CFA]" />}>
                      Focus window: {meta.focusWindow}
                    </Chip>
                    <Chip icon={<Activity className="h-4 w-4 text-[#7C5CFA]" />}>
                      {completedTasks}/{totalTasks} task đã hoàn thành
                    </Chip>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href="/planner"
                      className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[14px] font-semibold text-white shadow-[0_18px_40px_rgba(26,21,40,0.18)] transition hover:-translate-y-0.5"
                    >
                      Mở planner của tôi
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white/90 px-6 text-[14px] font-semibold text-[#241F3D] shadow-sm transition hover:bg-white"
                    >
                      Về dashboard
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[420px]">
                  <div className="absolute -left-4 top-8 h-[88%] w-[92%] rounded-[34px] bg-white/35 blur-md" />
                  <div className="absolute -right-3 bottom-3 h-[86%] w-[88%] rounded-[34px] bg-[#DCCEFF]/30 blur-md" />

                  <div className={`relative rounded-[34px] border ${meta.border} bg-gradient-to-br ${meta.surface} p-6 shadow-[0_24px_80px_rgba(97,76,197,0.14)]`}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                          Chronotype của bạn
                        </div>
                        <div className="mt-2 text-[1.7rem] font-black tracking-tight text-[#241F3D]">
                          {meta.label} {meta.emoji}
                        </div>
                        <div className="mt-1 text-[13px] font-medium text-[#615C7A]">
                          {meta.patternTitle}
                        </div>
                      </div>

                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_16px_34px_rgba(97,76,197,0.22)] ${meta.gradient}`}>
                        <MoonStar className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <MetricCard label="Giờ mạnh chính" value={meta.focusWindow} hint="Khung đẹp nhất cho việc khó" />
                      <MetricCard label="Khung phụ" value={meta.supportWindow} hint="Hợp cho task nhẹ hơn" />
                    </div>

                    <div className="mt-3">
                      <MetricCard label="Khung hồi phục" value={meta.recoveryWindow} hint="Nên giảm cường độ ở giai đoạn này" />
                    </div>

                    <div className="mt-4 rounded-[24px] border border-white/80 bg-white/70 px-4 py-4 shadow-inner">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                        <TrendingUp className="h-4 w-4 text-[#7C5CFA]" />
                        Recap nhanh
                      </div>
                      <p className="text-[13px] leading-7 text-[#615C7A]">{meta.patternText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
            <section className="space-y-8">
              <GlassSection eyebrow="Đường nhịp" title="Biểu đồ năng lượng trong ngày">
                <EnergyCurveChart points={meta.energySeries} gradientClass={meta.gradient} />
              </GlassSection>

              <GlassSection eyebrow="Tín hiệu thường gặp" title="Điểm mạnh và điểm dễ lệch nhịp">
                <div className="grid gap-6 md:grid-cols-2">
                  <FeaturePanel
                    icon={<Target className="h-5 w-5 text-[#7C5CFA]" />}
                    title="Điểm mạnh"
                    items={meta.strengths}
                  />
                  <FeaturePanel
                    icon={<ShieldCheck className="h-5 w-5 text-[#7C5CFA]" />}
                    title="Điểm dễ hụt nhịp"
                    items={meta.risks}
                  />
                </div>
              </GlassSection>

              <GlassSection eyebrow="Một ngày phù hợp" title="Lịch hoạt động nên đi theo nhịp nào">
                <div className="grid gap-4">
                  {meta.dailyFlow.map((item, index) => (
                    <div
                      key={`${item.title}-${item.time}`}
                      className="group relative overflow-hidden rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_16px_34px_rgba(97,76,197,0.05)] transition hover:-translate-y-0.5"
                    >
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,#6B5BFF_0%,#5B8CFF_100%)]" />
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="pr-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F3EEFF] text-[14px] font-black text-[#6F59FF]">
                              {index + 1}
                            </div>
                            <div className="text-[1.05rem] font-black tracking-tight text-[#241F3D]">
                              {item.title}
                            </div>
                          </div>
                          <p className="mt-3 text-[14px] leading-7 text-[#615C7A]">{item.text}</p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E5FF] bg-[#F8F6FF] px-4 py-2 text-[12px] font-bold text-[#5F5A77]">
                          <Clock3 className="h-4 w-4 text-[#7C5CFA]" />
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassSection>

              <GlassSection eyebrow="Áp dụng thực tế" title="3 cách dùng trang Rhythm hiệu quả hơn">
                <div className="grid gap-4 md:grid-cols-3">
                  {meta.actionTips.map((tip, index) => (
                    <div
                      key={tip}
                      className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/82 p-5 shadow-[0_16px_34px_rgba(97,76,197,0.05)]"
                    >
                      <div className="absolute right-[-18px] top-[-18px] h-20 w-20 rounded-full bg-[#F3EEFF]" />
                      <div className="relative z-10 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3EEFF] text-[15px] font-black text-[#6F59FF]">
                        {index + 1}
                      </div>
                      <p className="relative z-10 text-[14px] leading-7 text-[#615C7A]">{tip}</p>
                    </div>
                  ))}
                </div>
              </GlassSection>
            </section>

            <aside className="space-y-8">
              <SidebarSection eyebrow="3 khung quan trọng" title="Recap nhanh" icon={<CalendarClock className="h-5 w-5" />}>
                <div className="space-y-4">
                  <RhythmCard title="Focus window" value={meta.focusWindow} text="Khung phù hợp nhất cho việc khó, cần chiều sâu hoặc học tập." accent={meta.gradient} />
                  <RhythmCard title="Khung phụ" value={meta.supportWindow} text="Phù hợp hơn cho admin, phối hợp, follow-up hoặc task nhẹ." accent="from-[#EDE9FE] to-[#DBEAFE]" />
                  <RhythmCard title="Khung hồi phục" value={meta.recoveryWindow} text="Nên giảm cường độ để tránh tụt nhịp và giữ chất lượng ngày sau." accent="from-[#FCE7F3] to-[#F3E8FF]" />
                </div>
              </SidebarSection>

              {latestInsight ? (
                <SidebarSection eyebrow="Insight gần nhất" title={latestInsight.weekLabel} icon={<BarChart3 className="h-5 w-5" />}>
                  <div className="rounded-[24px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] p-4 text-[13px] leading-7 text-[#615C7A] shadow-sm">
                    {latestInsight.summary}
                  </div>
                  <div className="mt-4 grid gap-3">
                    <MiniStat label="Điểm alignment" value={String(latestInsight.alignmentScore)} />
                    <MiniStat label="Deep work / study" value={String(latestInsight.deepWorkCount)} />
                  </div>
                </SidebarSection>
              ) : null}

              {latestResult ? (
                <SidebarSection eyebrow="Assessment gần nhất" title="Phân bổ điểm chronotype" icon={<MoonStar className="h-5 w-5" />}>
                  <div className="space-y-3">
                    <ScoreBar label="Sư tử" value={latestResult.lionScore} max={getScoreMax(latestResult)} />
                    <ScoreBar label="Gấu" value={latestResult.bearScore} max={getScoreMax(latestResult)} />
                    <ScoreBar label="Sói" value={latestResult.wolfScore} max={getScoreMax(latestResult)} />
                    <ScoreBar label="Cá heo" value={latestResult.dolphinScore} max={getScoreMax(latestResult)} />
                  </div>
                </SidebarSection>
              ) : null}

              <SidebarSection eyebrow="Đi tiếp từ đây" title="Quick actions" icon={<Zap className="h-5 w-5" />}>
                <div className="space-y-3">
                  <ActionLink href="/planner" title="Mở planner" text="Biến nhịp sinh học thành lịch hành động thực tế." />
                  <ActionLink href="/assessment" title="Làm lại bài đánh giá" text="Cập nhật lại kết quả chronotype nếu nhịp của bạn đã thay đổi." />
                  <ActionLink href="/learn" title="Đọc thêm kiến thức" text="Hiểu sâu hơn về chronotype và cách áp dụng." />
                </div>
              </SidebarSection>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function AmbientBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-[-8%] top-[6%] h-[320px] w-[320px] rounded-full bg-purple-100/40 blur-[120px]" />
      <div className="absolute right-[-6%] top-[14%] h-[260px] w-[260px] rounded-full bg-blue-100/35 blur-[110px]" />
      <div className="absolute bottom-[-8%] left-[28%] h-[240px] w-[240px] rounded-full bg-fuchsia-100/20 blur-[90px]" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#CFC7E8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

function GlassSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[40px] border border-white/80 bg-white/88 shadow-[0_28px_80px_rgba(97,76,197,0.08)] backdrop-blur-2xl">
      <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-6 py-6 md:px-8">
        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
          {eyebrow}
        </div>
        <h2 className="mt-2 text-[1.45rem] font-black tracking-tight text-[#241F3D] md:text-[1.8rem]">
          {title}
        </h2>
      </div>
      <div className="p-6 md:p-8">{children}</div>
    </section>
  );
}

function SidebarSection({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[36px] border border-white/80 bg-white/88 shadow-[0_24px_70px_rgba(97,76,197,0.08)] backdrop-blur-2xl">
      <div className="border-b border-[rgba(124,115,150,0.10)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF8FF_100%)] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA] shadow-sm">{icon}</div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
              {eyebrow}
            </div>
            <div className="mt-1 text-[1.15rem] font-black tracking-tight text-[#241F3D]">
              {title}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function Chip({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/90 px-4 py-3 text-[13px] font-bold text-[#5F5A77] shadow-[0_12px_26px_rgba(0,0,0,0.05)] backdrop-blur-md">
      {icon}
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/82 p-4 shadow-[0_12px_28px_rgba(97,76,197,0.05)]">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[1.35rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
      <div className="mt-1 text-[12px] leading-6 text-[#6B6287]">{hint}</div>
    </div>
  );
}

function FeaturePanel({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/84 p-6 shadow-[0_16px_36px_rgba(97,76,197,0.06)]">
      <div className="absolute right-[-24px] top-[-24px] h-24 w-24 rounded-full bg-[#F3EEFF]" />
      <div className="relative z-10 mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-[#F3F0FF] p-3 text-[#7C5CFA] shadow-sm">{icon}</div>
        <div className="text-[1.05rem] font-black tracking-tight text-[#241F3D]">{title}</div>
      </div>

      <div className="relative z-10 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7C5CFA]" />
            <span className="text-[14px] leading-7 text-[#615C7A]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RhythmCard({
  title,
  value,
  text,
  accent,
}: {
  title: string;
  value: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/84 p-5 shadow-[0_16px_34px_rgba(97,76,197,0.06)]">
      <div
        className={`inline-flex rounded-full bg-gradient-to-r px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-sm ${accent}`}
      >
        {title}
      </div>
      <div className="mt-4 text-[1.18rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
      <div className="mt-2 text-[13px] leading-7 text-[#615C7A]">{text}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/84 p-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
        {label}
      </div>
      <div className="mt-2 text-[1.55rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
    </div>
  );
}

function ActionLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[24px] border border-white/80 bg-white/84 px-4 py-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(97,76,197,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-black tracking-tight text-[#241F3D]">
            {title}
          </div>
          <div className="mt-1 text-[13px] leading-6 text-[#615C7A]">{text}</div>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#7C5CFA] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="rounded-[22px] border border-white/80 bg-white/84 p-4 shadow-[0_14px_28px_rgba(97,76,197,0.05)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[14px] font-black text-[#241F3D]">{label}</div>
        <div className="text-[12px] font-bold text-[#6B6287]">{value} điểm</div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#EFEAFD] shadow-inner">
        <div
          className="h-full rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function EnergyCurveChart({
  points,
  gradientClass,
}: {
  points: Array<{ label: string; value: number }>;
  gradientClass: string;
}) {
  const width = 760;
  const height = 270;
  const paddingX = 24;
  const paddingY = 24;

  const max = Math.max(...points.map((p) => p.value), 100);
  const stepX = (width - paddingX * 2) / (points.length - 1);

  const coordinates = points.map((point, index) => {
    const x = paddingX + index * stepX;
    const y = height - paddingY - (point.value / max) * (height - paddingY * 2);
    return { ...point, x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${height - paddingY} L ${coordinates[0].x} ${height - paddingY} Z`;

  return (
    <div className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,#FCFBFF_0%,#FFFFFF_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:p-5">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[12px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
            Energy curve
          </div>
          <div className="mt-1 text-[1.12rem] font-black tracking-tight text-[#241F3D]">
            Đường năng lượng dự kiến theo chronotype
          </div>
        </div>

        <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1.5 text-[11px] font-black text-white shadow-sm ${gradientClass}`}>
          nhịp tham chiếu
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#ECE8FF] bg-[linear-gradient(180deg,#FAF8FF_0%,#FFFFFF_100%)] p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[270px] w-full">
          <defs>
            <linearGradient id="rhythmLineGradient3d" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6F59FF" />
              <stop offset="55%" stopColor="#8A73FF" />
              <stop offset="100%" stopColor="#4DA8FF" />
            </linearGradient>
            <linearGradient id="rhythmAreaGradient3d" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(111,89,255,0.28)" />
              <stop offset="100%" stopColor="rgba(77,168,255,0.05)" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={paddingX}
              y1={height - paddingY - ratio * (height - paddingY * 2)}
              x2={width - paddingX}
              y2={height - paddingY - ratio * (height - paddingY * 2)}
              stroke="#E9E5FF"
              strokeDasharray="6 8"
            />
          ))}

          <path d={areaPath} fill="url(#rhythmAreaGradient3d)" />
          <path
            d={linePath}
            fill="none"
            stroke="url(#rhythmLineGradient3d)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coordinates.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="10" fill="rgba(111,89,255,0.12)" />
              <circle cx={point.x} cy={point.y} r="5.5" fill="#6F59FF" />
              <circle cx={point.x} cy={point.y} r="2.2" fill="#ffffff" />
            </g>
          ))}

          {coordinates.map((point) => (
            <text
              key={`label-${point.label}`}
              x={point.x}
              y={height - 4}
              textAnchor="middle"
              className="fill-[#8A84A3] text-[11px] font-bold"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}