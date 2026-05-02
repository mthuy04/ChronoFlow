import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coins,
  Filter,
  Flame,
  Gift,
  History,
  ImageIcon,
  Info,
  Lock,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Truck,
  Zap,
} from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/layout/Footer";
import RewardRedeemButton from "@/components/rewards/RewardRedeemButton";

type SearchParams = Record<string, string | string[] | undefined>;



type RewardItemRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  pointsCost: number;
  active: boolean;
  imageUrl: string | null;
  category: string | null;
  stock: number | null;
  perUserLimit: number | null;
  createdAt: Date;
};

type RewardRedemptionRow = {
  id: string;
  rewardItemId: string | null;
  rewardTitle: string;
  pointsCost: number;
  recipientName: string;
  phone: string;
  address: string;
  note: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type StreakRewardRow = {
  id: string;
  milestone: number;
  coinsEarned: number;
  awardedAt: Date;
};

type CoinTransactionRow = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  sourceType: string | null;
  sourceId: string | null;
  description: string;
  createdAt: Date;
};

type RewardFilter = "all" | "available" | "near" | "locked";
type RewardSort = "cost-asc" | "cost-desc" | "newest";

type RewardTier = "available" | "near" | "locked";

const FILTER_OPTIONS: Array<{ value: RewardFilter; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "available", label: "Đổi được" },
  { value: "near", label: "Sắp đủ" },
  { value: "locked", label: "Chưa đủ" },
];

const SORT_OPTIONS: Array<{ value: RewardSort; label: string }> = [
  { value: "cost-asc", label: "Giá thấp → cao" },
  { value: "cost-desc", label: "Giá cao → thấp" },
  { value: "newest", label: "Mới nhất" },
];

function getFirstParam(
  params: SearchParams,
  key: string,
): string | undefined {
  const value = params[key];

  if (Array.isArray(value)) return value[0];

  return value;
}

function normalizeFilter(value?: string): RewardFilter {
  if (
    value === "available" ||
    value === "near" ||
    value === "locked" ||
    value === "all"
  ) {
    return value;
  }

  return "all";
}

function normalizeSort(value?: string): RewardSort {
  if (value === "cost-desc" || value === "newest" || value === "cost-asc") {
    return value;
  }

  return "cost-asc";
}

function buildRewardsHref(params: {
  filter?: RewardFilter;
  sort?: RewardSort;
}) {
  const search = new URLSearchParams();

  if (params.filter && params.filter !== "all") {
    search.set("filter", params.filter);
  }

  if (params.sort && params.sort !== "cost-asc") {
    search.set("sort", params.sort);
  }

  const query = search.toString();

  return query ? `/rewards?${query}` : "/rewards";
}

function formatNumber(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function normalizeActive(value: number | boolean) {
  return value === true || value === 1;
}

function getRewardStatusLabel(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "PENDING") return "Đang xử lý";
  if (normalized === "APPROVED") return "Đã duyệt";
  if (normalized === "FULFILLED") return "Đã hoàn tất";
  if (normalized === "COMPLETED") return "Đã hoàn tất";
  if (normalized === "REJECTED") return "Bị từ chối";
  if (normalized === "CANCELLED") return "Đã huỷ";

  return status;
}

function getRewardStatusClass(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "FULFILLED" || normalized === "COMPLETED") {
    return "bg-[#F1FFF7] text-[#23965F]";
  }

  if (normalized === "APPROVED") {
    return "bg-[#EEF6FF] text-[#4D7DDA]";
  }

  if (normalized === "REJECTED" || normalized === "CANCELLED") {
    return "bg-[#FFF7F7] text-[#B42318]";
  }

  return "bg-[#F5F2FF] text-[#7C5CFA]";
}

function getProgressPercent(balance: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((balance / target) * 100));
}

function getRewardTier(balance: number, cost: number): RewardTier {
  if (balance >= cost) return "available";

  const progress = getProgressPercent(balance, cost);

  if (progress >= 70) return "near";

  return "locked";
}

function getRewardTierCopy(tier: RewardTier, missingCoins: number) {
  if (tier === "available") {
    return {
      label: "Đủ coin",
      description: "Có thể đổi ngay",
      className: "bg-[#F1FFF7] text-[#23965F]",
    };
  }

  if (tier === "near") {
    return {
      label: "Sắp đủ",
      description: `Cần thêm ${formatNumber(missingCoins)} coin`,
      className: "bg-[#FFF8DC] text-[#9A6B00]",
    };
  }

  return {
    label: "Chưa đủ",
    description: `Cần thêm ${formatNumber(missingCoins)} coin`,
    className: "bg-[#F5F2FF] text-[#7C5CFA]",
  };
}

function getCategoryLabel(category: string | null) {
  const normalized = String(category || "").toUpperCase();

  if (normalized === "PHYSICAL") return "Quà vật lý";
  if (normalized === "DIGITAL") return "Quà digital";
  if (normalized === "SERVICE") return "Dịch vụ";
  if (normalized === "BADGE") return "Badge";

  return "Reward";
}

function getStockLabel(stock: number | null) {
  if (stock === null) return "Không giới hạn";
  if (stock <= 0) return "Hết hàng";
  return `Còn ${formatNumber(stock)}`;
}

function isOutOfStock(stock: number | null) {
  return typeof stock === "number" && stock <= 0;
}

function sortRewards(rewards: RewardItemRow[], sort: RewardSort) {
  const sorted = [...rewards];

  if (sort === "cost-desc") {
    sorted.sort((a, b) => b.pointsCost - a.pointsCost);
    return sorted;
  }

  if (sort === "newest") {
    sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return sorted;
  }

  sorted.sort((a, b) => a.pointsCost - b.pointsCost);
  return sorted;
}

function filterRewards(
  rewards: RewardItemRow[],
  filter: RewardFilter,
  coinBalance: number,
) {
  if (filter === "all") return rewards;

  return rewards.filter((reward) => {
    const tier = getRewardTier(coinBalance, reward.pointsCost);

    return tier === filter;
  });
}

function getStatusSteps(status: string) {
  const normalized = status.toUpperCase();

  const baseSteps = [
    {
      key: "PENDING",
      label: "Đang xử lý",
      description: "Yêu cầu đổi quà đã được ghi nhận.",
    },
    {
      key: "APPROVED",
      label: "Đã duyệt",
      description: "ChronoFlow đã xác nhận yêu cầu.",
    },
    {
      key: "FULFILLED",
      label: "Hoàn tất",
      description: "Phần thưởng đã được xử lý hoặc gửi đi.",
    },
  ];

  if (normalized === "REJECTED") {
    return [
      baseSteps[0],
      {
        key: "REJECTED",
        label: "Bị từ chối",
        description: "Yêu cầu không được duyệt. Coin sẽ được hoàn nếu đủ điều kiện.",
      },
    ];
  }

  if (normalized === "CANCELLED") {
    return [
      baseSteps[0],
      {
        key: "CANCELLED",
        label: "Đã huỷ",
        description: "Yêu cầu đổi quà đã được huỷ.",
      },
    ];
  }

  return baseSteps;
}

function isStepActive(status: string, stepKey: string) {
  const normalized = status.toUpperCase();

  const order: Record<string, number> = {
    PENDING: 1,
    APPROVED: 2,
    FULFILLED: 3,
    COMPLETED: 3,
    REJECTED: 2,
    CANCELLED: 2,
  };

  return (order[normalized] ?? 1) >= (order[stepKey] ?? 1);
}

function getCoinTransactionTone(amount: number) {
  return amount >= 0
    ? "bg-[#F1FFF7] text-[#23965F] border-[#DDF5E7]"
    : "bg-[#FFF8DC] text-[#9A6B00] border-[#FFE7A8]";
}

function getCoinTransactionIcon(type: string, amount: number) {
  const normalized = type.toUpperCase();

  if (normalized.includes("TASK")) return <CheckCircle2 className="h-4 w-4" />;
  if (normalized.includes("FOCUS")) return <Timer className="h-4 w-4" />;
  if (normalized.includes("STREAK")) return <Flame className="h-4 w-4" />;
  if (normalized.includes("REWARD") && amount < 0) {
    return <Gift className="h-4 w-4" />;
  }

  if (normalized.includes("REFUND")) return <RotateCcw className="h-4 w-4" />;

  return <Coins className="h-4 w-4" />;
}

export default async function RewardsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const activeFilter = normalizeFilter(getFirstParam(resolvedSearchParams, "filter"));
  const activeSort = normalizeSort(getFirstParam(resolvedSearchParams, "sort"));

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const users = await prisma.$queryRaw<UserCoinRow[]>`
    SELECT
      id,
      name,
      email,
      COALESCE(coinBalance, 0) AS coinBalance
    FROM \`User\`
    WHERE email = ${session.user.email}
    LIMIT 1
  `;

  const user = users[0];

  if (!user) {
    redirect("/auth/login");
  }

  const coinBalance = user.coinBalance ?? 0;
  const displayName = user.name?.trim() || "bạn";

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      coinBalance: true,
    },
  });
  
  if (!user) {
    redirect("/auth/login");
  }
  
  const coinBalance = user.coinBalance ?? 0;
  const displayName = user.name?.trim() || "bạn";
  
  const rewardItemsRaw = await prisma.rewardItem.findMany({
    where: {
      active: true,
    },
    orderBy: [
      {
        pointsCost: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      pointsCost: true,
      active: true,
      imageUrl: true,
      category: true,
      stock: true,
      perUserLimit: true,
      createdAt: true,
    },
  });
  
  const rewardItems: RewardItemRow[] = rewardItemsRaw.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    pointsCost: item.pointsCost,
    active: item.active,
    imageUrl: item.imageUrl,
    category: item.category,
    stock: item.stock,
    perUserLimit: item.perUserLimit,
    createdAt: item.createdAt,
  }));
  
  const redemptionsRaw = await prisma.rewardRedemption.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
    select: {
      id: true,
      rewardItemId: true,
      rewardTitle: true,
      pointsCost: true,
      recipientName: true,
      phone: true,
      address: true,
      note: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  const redemptions: RewardRedemptionRow[] = redemptionsRaw.map((item) => ({
    id: item.id,
    rewardItemId: item.rewardItemId,
    rewardTitle: item.rewardTitle,
    pointsCost: item.pointsCost,
    recipientName: item.recipientName,
    phone: item.phone,
    address: item.address,
    note: item.note,
    status: String(item.status),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
  
  const streakRewardsRaw = await prisma.streakReward.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      awardedAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      milestone: true,
      coinsEarned: true,
      awardedAt: true,
    },
  });
  
  const streakRewards: StreakRewardRow[] = streakRewardsRaw.map((item) => ({
    id: item.id,
    milestone: item.milestone,
    coinsEarned: item.coinsEarned,
    awardedAt: item.awardedAt,
  }));
  
  const coinTransactionsRaw = await prisma.coinTransaction.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
    select: {
      id: true,
      type: true,
      amount: true,
      balanceAfter: true,
      sourceType: true,
      sourceId: true,
      description: true,
      createdAt: true,
    },
  });
  
  const coinTransactions: CoinTransactionRow[] = coinTransactionsRaw.map(
    (item) => ({
      id: item.id,
      type: item.type,
      amount: item.amount,
      balanceAfter: item.balanceAfter,
      sourceType: item.sourceType,
      sourceId: item.sourceId,
      description: item.description,
      createdAt: item.createdAt,
    }),
  );

  const activeRewards = rewardItems.filter((item) =>
    normalizeActive(item.active),
  );

  const filteredRewards = filterRewards(
    sortRewards(activeRewards, activeSort),
    activeFilter,
    coinBalance,
  );

  const affordableRewards = activeRewards.filter(
    (item) => item.pointsCost <= coinBalance && !isOutOfStock(item.stock),
  );

  const lockedRewards = activeRewards.filter(
    (item) => item.pointsCost > coinBalance,
  );

  const nextReward = lockedRewards[0] ?? null;
  const cheapestReward = activeRewards[0] ?? null;
  const nextTargetCoins =
    nextReward?.pointsCost ??
    cheapestReward?.pointsCost ??
    Math.max(coinBalance, 100);
  const progressPercent = getProgressPercent(coinBalance, nextTargetCoins);
  const totalSpent = redemptions.reduce((sum, item) => sum + item.pointsCost, 0);
  const latestStreakReward = streakRewards[0] ?? null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F4F2FA] font-sans text-[#1A1528] selection:bg-[#6F59FF]/20">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-8">
       

        <section className="relative overflow-hidden rounded-[42px] border border-white bg-white/72 shadow-[0_30px_100px_rgba(26,21,40,0.06)] backdrop-blur-2xl md:rounded-[52px]">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -left-[8%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#DCCEFF]/70 blur-[110px]" />
            <div className="absolute right-[-10%] top-[12%] h-[420px] w-[420px] rounded-full bg-[#D9EAFF]/75 blur-[120px]" />
            <div className="absolute bottom-[-18%] left-[30%] h-[500px] w-[500px] rounded-full bg-white/80 blur-[100px]" />
          </div>

          <div className="relative z-10 px-5 py-8 md:px-8 md:py-10 lg:px-10">
            <section className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#6F59FF] shadow-[0_8px_20px_rgba(111,89,255,0.08)] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Reward Center
                </div>

                <h1 className="max-w-[880px] text-[clamp(2.25rem,4vw,4rem)] font-black leading-[1.08] tracking-[-0.035em] text-[#1A1528]">
  Đổi nỗ lực tập trung thành{" "}
  <span className="bg-gradient-to-r from-[#6F59FF] via-[#6B6DFF] to-[#4DA8FF] bg-clip-text font-black text-transparent drop-shadow-[0_0_0.01px_rgba(26,21,40,0.35)]">
    phần thưởng 
  </span>
</h1>

                <p className="mt-5 max-w-[680px] text-[15px] font-medium leading-8 text-[#6B647C] md:text-[16px]">
                  Chào {displayName}, coin được cộng khi bạn hoàn thành task,
                  lưu phiên focus hoặc duy trì streak 7 ngày. Trang này dùng dữ
                  liệu thật từ ví coin, catalog phần thưởng, lịch sử đổi quà và
                  coin transaction của bạn.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/planner"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1A1528] px-6 text-[14px] font-black text-white shadow-[0_18px_36px_rgba(23,19,41,0.18)] transition hover:-translate-y-0.5"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Làm task để kiếm coin
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/80 bg-white/80 px-6 text-[14px] font-black text-[#241F3D] shadow-sm transition hover:-translate-y-0.5"
                  >
                    <Timer className="h-4 w-4 text-[#7C5CFA]" />
                    Bắt đầu focus
                  </Link>
                </div>
              </div>

              <div className="rounded-[36px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_56px_rgba(97,76,197,0.12)] backdrop-blur-xl">
                <div
                  data-coin-target="true"
                  className="rounded-[30px] bg-[linear-gradient(180deg,#FFFDF5_0%,#FFF5CC_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9A6B00]">
                        Coin hiện có
                      </div>

                      <div className="mt-3 flex items-end gap-3">
                        <span className="text-[3.2rem] font-black leading-none tracking-tight text-[#241F3D]">
                          {formatNumber(coinBalance)}
                        </span>

                        <span className="pb-2 text-[15px] font-black text-[#9A6B00]">
                          coin
                        </span>
                      </div>
                    </div>

                    <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-[linear-gradient(135deg,#FFD166_0%,#FFB703_100%)] text-white shadow-[0_18px_38px_rgba(255,183,3,0.28)]">
                      <Coins className="h-9 w-9" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-[24px] border border-[#FFE7A8] bg-white/75 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-black text-[#241F3D]">
                          {nextReward
                            ? `Mục tiêu tiếp theo: ${nextReward.title}`
                            : activeRewards.length > 0
                              ? "Bạn đã đủ coin cho các quà hiện có"
                              : "Chưa có phần thưởng active"}
                        </div>

                        <div className="mt-1 text-[12px] font-medium text-[#7A6A42]">
                          {nextReward
                            ? `Cần ${formatNumber(
                                Math.max(
                                  0,
                                  nextReward.pointsCost - coinBalance,
                                ),
                              )} coin nữa`
                            : activeRewards.length > 0
                              ? "Hãy tiếp tục tích coin cho các phần thưởng mới."
                              : "Thêm RewardItem trong database để bật catalog."}
                        </div>
                      </div>

                      <div className="text-[13px] font-black text-[#9A6B00]">
                        {progressPercent}%
                      </div>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#FFF0B8]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#FFB703_0%,#FFD166_50%,#7C5CFA_100%)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <WalletStatCard
                    icon={<Gift className="h-4 w-4" />}
                    label="Đổi được"
                    value={formatNumber(affordableRewards.length)}
                  />
                  <WalletStatCard
                    icon={<Lock className="h-4 w-4" />}
                    label="Đang khoá"
                    value={formatNumber(lockedRewards.length)}
                  />
                  <WalletStatCard
                    icon={<History className="h-4 w-4" />}
                    label="Đã đổi"
                    value={formatNumber(redemptions.length)}
                  />
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_370px]">
              <div className="space-y-6">
                <section className="rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl md:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F0FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                        <Gift className="h-3.5 w-3.5" />
                        Reward Catalog
                      </div>

                      <h2 className="mt-3 text-[1.7rem] font-black tracking-tight text-[#241F3D]">
                        Phần thưởng có thể đổi
                      </h2>

                      <p className="mt-2 max-w-[660px] text-[13px] leading-7 text-[#615C7A]">
                        Catalog lấy dữ liệu thật từ bảng RewardItem. Bạn có thể
                        lọc theo trạng thái đổi được, sắp đủ hoặc chưa đủ coin.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="rounded-[22px] border border-[#EEE9FF] bg-[#FCFBFF] p-2">
                        <div className="mb-2 flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                          <Filter className="h-3.5 w-3.5" />
                          Lọc
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {FILTER_OPTIONS.map((option) => (
                            <Link
                              key={option.value}
                              href={buildRewardsHref({
                                filter: option.value,
                                sort: activeSort,
                              })}
                              className={`rounded-full px-3 py-2 text-[12px] font-black transition ${
                                activeFilter === option.value
                                  ? "bg-[#7C5CFA] text-white shadow-[0_10px_20px_rgba(124,92,250,0.18)]"
                                  : "bg-white text-[#6B647C] hover:bg-[#F4F0FF]"
                              }`}
                            >
                              {option.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[22px] border border-[#EEE9FF] bg-[#FCFBFF] p-2">
                        <div className="mb-2 flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A84A3]">
                          <ChevronDown className="h-3.5 w-3.5" />
                          Sắp xếp
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {SORT_OPTIONS.map((option) => (
                            <Link
                              key={option.value}
                              href={buildRewardsHref({
                                filter: activeFilter,
                                sort: option.value,
                              })}
                              className={`rounded-full px-3 py-2 text-[12px] font-black transition ${
                                activeSort === option.value
                                  ? "bg-[#1A1528] text-white shadow-[0_10px_20px_rgba(26,21,40,0.16)]"
                                  : "bg-white text-[#6B647C] hover:bg-[#F4F0FF]"
                              }`}
                            >
                              {option.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {filteredRewards.length > 0 ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {filteredRewards.map((reward) => {
                        const canRedeem = coinBalance >= reward.pointsCost;
                        const missingCoins = Math.max(
                          0,
                          reward.pointsCost - coinBalance,
                        );
                        const tier = getRewardTier(
                          coinBalance,
                          reward.pointsCost,
                        );
                        const tierCopy = getRewardTierCopy(tier, missingCoins);
                        const itemProgress = getProgressPercent(
                          coinBalance,
                          reward.pointsCost,
                        );
                        const rewardOutOfStock = isOutOfStock(reward.stock);

                        return (
                          <article
                            key={reward.id}
                            className="group relative overflow-hidden rounded-[30px] border border-[#EEE9FF] bg-[#FCFBFF] p-4 transition hover:-translate-y-1 hover:border-[#DCD3FF] hover:bg-white hover:shadow-[0_18px_38px_rgba(97,76,197,0.10)]"
                          >
                            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FFD166]/16 blur-2xl transition group-hover:bg-[#FFD166]/24" />

                            <div className="relative flex gap-4">
                              <RewardImage
                                title={reward.title}
                                imageUrl={reward.imageUrl}
                              />

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="text-[1rem] font-black leading-snug text-[#241F3D]">
                                    {reward.title}
                                  </h3>

                                  <span
                                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
                                      rewardOutOfStock
                                        ? "bg-[#FFF7F7] text-[#B42318]"
                                        : tierCopy.className
                                    }`}
                                  >
                                    {canRedeem && !rewardOutOfStock ? (
                                      <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                      <Lock className="h-3 w-3" />
                                    )}
                                    {rewardOutOfStock
                                      ? "Hết hàng"
                                      : tierCopy.label}
                                  </span>
                                </div>

                                <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-[#6B6680]">
                                  {reward.description ||
                                    "Phần thưởng trong hệ thống ChronoFlow."}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  <div className="inline-flex items-center gap-2 rounded-full border border-[#FFE7A8] bg-[#FFF8DC] px-3 py-1.5 text-[12px] font-black text-[#7A5600]">
                                    <Coins className="h-3.5 w-3.5" />
                                    {formatNumber(reward.pointsCost)}
                                  </div>

                                  <div className="inline-flex items-center gap-2 rounded-full border border-[#EEE9FF] bg-white px-3 py-1.5 text-[11px] font-black text-[#7C5CFA]">
                                    <PackageCheck className="h-3.5 w-3.5" />
                                    {getCategoryLabel(reward.category)}
                                  </div>

                                  <div
                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black ${
                                      rewardOutOfStock
                                        ? "border-[#FFD8D8] bg-[#FFF7F7] text-[#B42318]"
                                        : "border-[#DDF5E7] bg-[#F1FFF7] text-[#23965F]"
                                    }`}
                                  >
                                    <Truck className="h-3.5 w-3.5" />
                                    {getStockLabel(reward.stock)}
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-bold text-[#8A84A3]">
                                    <span>{tierCopy.description}</span>
                                    <span>{itemProgress}%</span>
                                  </div>

                                  <div className="h-2 overflow-hidden rounded-full bg-[#EEE9FF]">
                                    <div
                                      className={`h-full rounded-full ${
                                        canRedeem && !rewardOutOfStock
                                          ? "bg-[linear-gradient(90deg,#2ECC71_0%,#7C5CFA_100%)]"
                                          : "bg-[linear-gradient(90deg,#FFB703_0%,#FFD166_60%,#EEE9FF_100%)]"
                                      }`}
                                      style={{ width: `${itemProgress}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 text-[11px] font-bold text-[#8A84A3]">
                                  Giới hạn:{" "}
                                  <span className="font-black text-[#241F3D]">
                                    {reward.perUserLimit && reward.perUserLimit > 0
                                      ? `${reward.perUserLimit} lần / tài khoản`
                                      : "Không giới hạn"}
                                  </span>
                                </div>

                                <RewardRedeemButton
                                  rewardItemId={reward.id}
                                  rewardTitle={reward.title}
                                  pointsCost={reward.pointsCost}
                                  currentBalance={coinBalance}
                                  canRedeem={canRedeem}
                                  isOutOfStock={rewardOutOfStock}
                                  disabledReason="Chưa đủ coin"
                                  defaultRecipientName={displayName === "bạn" ? "" : displayName}
                                />
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : activeRewards.length > 0 ? (
                    <EmptyFilteredRewards />
                  ) : (
                    <EmptyRewards />
                  )}
                </section>

                <section className="rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl md:p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#4D7DDA]">
                    <Info className="h-3.5 w-3.5" />
                    Reward rules
                  </div>

                  <h2 className="mt-3 text-[1.45rem] font-black tracking-tight text-[#241F3D]">
                    Coin hoạt động như thế nào?
                  </h2>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <RuleCard
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      title="Task coins"
                      description="Được cộng khi bạn đánh dấu task hoàn thành lần đầu."
                    />
                    <RuleCard
                      icon={<Timer className="h-5 w-5" />}
                      title="Focus coins"
                      description="Được cộng khi bạn lưu phiên focus hợp lệ."
                    />
                    <RuleCard
                      icon={<Flame className="h-5 w-5" />}
                      title="Streak bonus"
                      description="Duy trì 7 ngày productivity streak để nhận +70 coins."
                    />
                  </div>
                </section>

                <section className="rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl md:p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF4CC] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#9A6B00]">
                    <Coins className="h-3.5 w-3.5" />
                    Coin History
                  </div>

                  <h2 className="mt-3 text-[1.45rem] font-black tracking-tight text-[#241F3D]">
                    Lịch sử coin
                  </h2>

                  <p className="mt-2 max-w-[660px] text-[13px] leading-7 text-[#615C7A]">
                    Đây là ledger ghi lại biến động coin gần đây, gồm coin kiếm
                    được, coin đổi quà và coin hoàn lại nếu có.
                  </p>

                  {coinTransactions.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {coinTransactions.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-[24px] border border-[#EEE9FF] bg-[#FCFBFF] p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex min-w-0 gap-3">
                            <div
                              className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${getCoinTransactionTone(
                                item.amount,
                              )}`}
                            >
                              {getCoinTransactionIcon(item.type, item.amount)}
                            </div>

                            <div className="min-w-0">
                              <div className="text-[13px] font-black text-[#241F3D]">
                                {item.description}
                              </div>
                              <div className="mt-1 text-[11px] font-bold text-[#8A84A3]">
                                {formatDateTime(item.createdAt)} · Balance after:{" "}
                                {formatNumber(item.balanceAfter)}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-black ${
                              item.amount >= 0
                                ? "bg-[#F1FFF7] text-[#23965F]"
                                : "bg-[#FFF8DC] text-[#9A6B00]"
                            }`}
                          >
                            {item.amount >= 0 ? "+" : ""}
                            {formatNumber(item.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[26px] border border-dashed border-[#DCD3FF] bg-[#FCFBFF] p-6 text-center">
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-[22px] bg-[#F4F0FF] text-[#7C5CFA]">
                        <Search className="h-7 w-7" />
                      </div>
                      <h3 className="mt-4 text-[1rem] font-black text-[#241F3D]">
                        Chưa có coin transaction
                      </h3>
                      <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-7 text-[#615C7A]">
                        Khi bạn hoàn thành task, focus, nhận streak bonus hoặc
                        đổi quà, lịch sử coin sẽ xuất hiện ở đây.
                      </p>
                    </div>
                  )}
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF4CC] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#9A6B00]">
                    <Trophy className="h-3.5 w-3.5" />
                    Cách kiếm coin
                  </div>

                  <div className="mt-4 space-y-3">
                    <HowToEarnItem
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      title="Hoàn thành task"
                      description="Task càng quan trọng, mức thưởng càng cao."
                      coins="+8 đến +40"
                    />
                    <HowToEarnItem
                      icon={<Timer className="h-4 w-4" />}
                      title="Lưu phiên focus"
                      description="Focus đủ thời gian để nhận thưởng theo block."
                      coins="+5 đến +80"
                    />
                    <HowToEarnItem
                      icon={<Flame className="h-4 w-4" />}
                      title="Duy trì streak 7 ngày"
                      description="Mỗi ngày có task hoàn thành hoặc focus session hợp lệ."
                      coins="+70"
                    />
                  </div>
                </section>

                <section className="rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F0FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                    <Zap className="h-3.5 w-3.5" />
                    Streak Bonus
                  </div>

                  {latestStreakReward ? (
                    <div className="mt-4 rounded-[26px] border border-[#FFE7A8] bg-[linear-gradient(180deg,#FFFDF5_0%,#FFF8DC_100%)] p-4">
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#FFB703_0%,#FFD166_100%)] text-white shadow-[0_12px_24px_rgba(255,183,3,0.18)]">
                          <Flame className="h-6 w-6" />
                        </div>

                        <div>
                          <div className="text-[14px] font-black text-[#241F3D]">
                            Đã mở khóa streak {latestStreakReward.milestone} ngày
                          </div>

                          <p className="mt-1 text-[12px] leading-6 text-[#7A6A42]">
                            Bạn đã nhận +
                            {formatNumber(latestStreakReward.coinsEarned)} coins
                            vào ngày {formatDate(latestStreakReward.awardedAt)}.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[26px] border border-[#EEE9FF] bg-[#FCFBFF] p-4">
                      <div className="text-[14px] font-black text-[#241F3D]">
                        Chưa mở khóa streak 7 ngày
                      </div>

                      <p className="mt-2 text-[12px] leading-6 text-[#615C7A]">
                        Hoàn thành task hoặc lưu focus session mỗi ngày để tạo
                        chuỗi 7 ngày liên tiếp và nhận +70 coins.
                      </p>

                      <Link
                        href="/dashboard"
                        className="mt-4 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-4 text-[12px] font-black text-white transition hover:-translate-y-0.5"
                      >
                        <Target className="h-4 w-4" />
                        Tiếp tục streak
                      </Link>
                    </div>
                  )}
                </section>

                <section className="rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF6FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#4D7DDA]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Redemption Flow
                  </div>

                  <div className="mt-4 space-y-3">
                    <FlowStep
                      index="1"
                      title="Gửi yêu cầu"
                      description="Bạn nhập thông tin nhận quà và dùng coin để gửi request."
                    />
                    <FlowStep
                      index="2"
                      title="ChronoFlow kiểm tra"
                      description="Admin xác nhận tồn kho và thông tin nhận quà."
                    />
                    <FlowStep
                      index="3"
                      title="Hoàn tất hoặc hoàn coin"
                      description="Nếu request bị từ chối, hệ thống có thể hoàn coin qua refund ledger."
                    />
                  </div>
                </section>

                <section className="rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-[0_20px_60px_rgba(97,76,197,0.08)] backdrop-blur-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F0FF] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                    <History className="h-3.5 w-3.5" />
                    Lịch sử đổi quà
                  </div>

                  <div className="mt-4 grid gap-3 rounded-[24px] border border-[#EEE9FF] bg-[#FCFBFF] p-4">
                    <div className="flex items-center justify-between gap-3 text-[12px] font-bold text-[#615C7A]">
                      <span>Tổng yêu cầu</span>
                      <span className="font-black text-[#241F3D]">
                        {formatNumber(redemptions.length)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[12px] font-bold text-[#615C7A]">
                      <span>Coin đã dùng</span>
                      <span className="font-black text-[#B77900]">
                        -{formatNumber(totalSpent)}
                      </span>
                    </div>
                  </div>

                  {redemptions.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {redemptions.map((item) => (
                        <RedemptionHistoryCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[22px] border border-[#EEE9FF] bg-[#FCFBFF] p-4 text-[13px] leading-7 text-[#615C7A]">
                      Bạn chưa đổi phần thưởng nào. Khi đổi quà, lịch sử sẽ hiện
                      ở đây.
                    </div>
                  )}
                </section>
              </aside>
            </section>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

function RewardImage({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string | null;
}) {
  if (imageUrl) {
    return (
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_14px_28px_rgba(97,76,197,0.10)]">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,#F4F0FF_0%,#FFF4CC_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <ImageIcon className="h-8 w-8 text-[#7C5CFA]" />
    </div>
  );
}

function WalletStatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/75 p-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#7C5CFA]">
        {icon}
        {label}
      </div>

      <div className="mt-2 text-[1.35rem] font-black tracking-tight text-[#241F3D]">
        {value}
      </div>
    </div>
  );
}

function HowToEarnItem({
  icon,
  title,
  description,
  coins,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  coins: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#EEE9FF] bg-[#FCFBFF] p-4 transition hover:-translate-y-0.5 hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#F4F0FF] text-[#7C5CFA]">
            {icon}
          </div>

          <div>
            <div className="text-[13px] font-black text-[#241F3D]">
              {title}
            </div>
            <p className="mt-1 text-[12px] leading-6 text-[#615C7A]">
              {description}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-[#FFF4CC] px-2.5 py-1 text-[11px] font-black text-[#7A5600]">
          {coins}
        </span>
      </div>
    </div>
  );
}

function RuleCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[26px] border border-[#EEE9FF] bg-[#FCFBFF] p-4">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F4F0FF] text-[#7C5CFA]">
        {icon}
      </div>

      <div className="mt-4 text-[14px] font-black text-[#241F3D]">{title}</div>

      <p className="mt-2 text-[12px] leading-6 text-[#615C7A]">
        {description}
      </p>
    </div>
  );
}

function FlowStep({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-[22px] border border-[#EEE9FF] bg-[#FCFBFF] p-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#1A1528] text-[12px] font-black text-white">
        {index}
      </div>

      <div>
        <div className="text-[13px] font-black text-[#241F3D]">{title}</div>
        <p className="mt-1 text-[12px] leading-6 text-[#615C7A]">
          {description}
        </p>
      </div>
    </div>
  );
}

function RedemptionHistoryCard({ item }: { item: RewardRedemptionRow }) {
  const steps = getStatusSteps(item.status);

  return (
    <div className="rounded-[24px] border border-[#EEE9FF] bg-[#FCFBFF] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-black text-[#241F3D]">
            {item.rewardTitle}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-[#8A84A3]">
            {formatDate(item.createdAt)} · {item.recipientName}
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${getRewardStatusClass(
            item.status,
          )}`}
        >
          {getRewardStatusLabel(item.status)}
        </span>
      </div>

      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFF4CC] px-2.5 py-1 text-[11px] font-black text-[#7A5600]">
        <Coins className="h-3.5 w-3.5" />
        -{formatNumber(item.pointsCost)}
      </div>

      <div className="mt-4 space-y-3">
        {steps.map((step) => {
          const active = isStepActive(item.status, step.key);

          return (
            <div key={step.key} className="flex gap-3">
              <div
                className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                  active
                    ? "bg-[#7C5CFA] text-white"
                    : "bg-[#EEE9FF] text-[#8A84A3]"
                }`}
              >
                {active ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Clock3 className="h-4 w-4" />
                )}
              </div>

              <div>
                <div
                  className={`text-[12px] font-black ${
                    active ? "text-[#241F3D]" : "text-[#8A84A3]"
                  }`}
                >
                  {step.label}
                </div>
                <p className="mt-0.5 text-[11px] leading-5 text-[#615C7A]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyRewards() {
  return (
    <div className="mt-6 rounded-[30px] border border-dashed border-[#DCD3FF] bg-[#FCFBFF] p-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-[#F4F0FF] text-[#7C5CFA]">
        <PackageCheck className="h-8 w-8" />
      </div>

      <h3 className="mt-5 text-[1.25rem] font-black tracking-tight text-[#241F3D]">
        Chưa có phần thưởng nào
      </h3>

      <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-7 text-[#615C7A]">
        Database hiện chưa có reward item đang active. Hãy chạy seed rewards
        hoặc thêm phần thưởng trong admin.
      </p>
    </div>
  );
}

function EmptyFilteredRewards() {
  return (
    <div className="mt-6 rounded-[30px] border border-dashed border-[#DCD3FF] bg-[#FCFBFF] p-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-[#F4F0FF] text-[#7C5CFA]">
        <Filter className="h-8 w-8" />
      </div>

      <h3 className="mt-5 text-[1.25rem] font-black tracking-tight text-[#241F3D]">
        Không có phần thưởng khớp bộ lọc
      </h3>

      <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-7 text-[#615C7A]">
        Thử đổi bộ lọc sang “Tất cả” hoặc thay đổi cách sắp xếp để xem thêm
        phần thưởng.
      </p>

      <Link
        href="/rewards"
        className="mt-5 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-2xl bg-[#1A1528] px-5 text-[13px] font-black text-white transition hover:-translate-y-0.5"
      >
        Xem tất cả
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}