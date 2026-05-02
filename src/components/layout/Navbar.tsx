"use client";
import {
  COIN_LANDED_EVENT,
  type CoinLandedPayload,
} from "@/lib/coin-reward-events";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarClock,
  ChevronDown,
  Coins,
  FileText,
  Gift,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Sparkles,
  User2,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, } from "react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type NavbarVariant = "loading" | "guest" | "user" | "admin";

type SessionUserLike = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  points?: number | null;
  coinBalance?: number | null;
};

type NavChildItem = {
  href: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  children?: NavChildItem[];
};

const guestNavItems: NavItem[] = [
  {
    href: "/",
    label: "Trang chủ",
    icon: <Home className="h-4 w-4" />,
  },
  {
    href: "/features",
    label: "Sản phẩm",
    icon: <Sparkles className="h-4 w-4" />,
    children: [
      {
        href: "/features",
        label: "Tính năng",
        description: "Khám phá planner, rhythm, insight và reward loop.",
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        href: "/how-it-works",
        label: "Cách hoạt động",
        description: "Hiểu cách ChronoFlow biến nhịp sinh học thành kế hoạch.",
        icon: <CalendarClock className="h-4 w-4" />,
      },
      {
        href: "/assessment",
        label: "Bài đánh giá chronotype",
        description: "Bắt đầu phân tích nhịp năng lượng cá nhân.",
        icon: <Brain className="h-4 w-4" />,
      },
    ],
  },
  {
    href: "/learn",
    label: "Kiến thức",
    icon: <BookOpen className="h-4 w-4" />,
    children: [
      {
        href: "/learn",
        label: "Thư viện kiến thức",
        description: "Bài viết về chronotype, năng lượng và productivity.",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        href: "/learn#chronotype",
        label: "Chronotype basics",
        description: "Hiểu các nhóm nhịp sinh học phổ biến.",
        icon: <Brain className="h-4 w-4" />,
      },
      {
        href: "/learn#energy-curve",
        label: "Energy curve",
        description: "Hiểu đường cong năng lượng trong ngày.",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
];

const userNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Tổng quan",
    icon: <LayoutDashboard className="h-4 w-4" />,
    children: [
      {
        href: "/dashboard",
        label: "Dashboard",
        description: "Xem trạng thái hôm nay, tiến độ và gợi ý nhanh.",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        href: "/rhythm",
        label: "Nhịp của tôi",
        description: "Theo dõi chronotype và khung năng lượng cá nhân.",
        icon: <Brain className="h-4 w-4" />,
      },
      {
        href: "/dashboard#chronotype",
        label: "Kết quả chronotype",
        description: "Xem lại hồ sơ nhịp sinh học và khung giờ phù hợp.",
        icon: <Sparkles className="h-4 w-4" />,
      },
    ],
  },
  {
    href: "/planner",
    label: "Kế hoạch",
    icon: <CalendarClock className="h-4 w-4" />,
    children: [
      {
        href: "/planner",
        label: "Planner hôm nay",
        description: "Sắp xếp công việc theo nhịp năng lượng.",
        icon: <CalendarClock className="h-4 w-4" />,
      },
      {
        href: "/planner#backlog",
        label: "Công việc tồn đọng",
        description: "Quản lý các việc chưa được đưa vào lịch.",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        href: "/planner#focus",
        label: "Phiên tập trung",
        description: "Theo dõi focus session và thời gian làm việc thực tế.",
        icon: <Brain className="h-4 w-4" />,
      },
    ],
  },
  {
    href: "/insights",
    label: "Phân tích",
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      {
        href: "/insights",
        label: "Insights",
        description: "Xem xu hướng làm việc và hiệu suất cá nhân.",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        href: "/insights#planner-score",
        label: "Planner Score",
        description: "Đánh giá chất lượng kế hoạch và mức độ phù hợp.",
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        href: "/insights#deadline-risk",
        label: "Deadline risk",
        description: "Phát hiện công việc có nguy cơ trễ hạn.",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    href: "/learn",
    label: "Thư viện",
    icon: <BookOpen className="h-4 w-4" />,
    children: [
      {
        href: "/learn",
        label: "Kiến thức",
        description: "Học cách lập kế hoạch theo chronotype.",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        href: "/learn#chronotype",
        label: "Chronotype basics",
        description: "Hiểu kiểu nhịp sinh học của bạn.",
        icon: <Brain className="h-4 w-4" />,
      },
      {
        href: "/learn#energy-curve",
        label: "Energy curve",
        description: "Ứng dụng đường cong năng lượng vào lịch làm việc.",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  },
];

const adminNavItems: NavItem[] = [
  {
    href: "/admin",
    label: "Tổng quan",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/admin/users",
    label: "Quản lý",
    icon: <Users className="h-4 w-4" />,
    children: [
      {
        href: "/admin/users",
        label: "Người dùng",
        description: "Quản lý tài khoản và trạng thái người dùng.",
        icon: <Users className="h-4 w-4" />,
      },
      {
        href: "/admin/rewards",
        label: "Điểm thưởng",
        description: "Quản lý coin, reward và lịch sử đổi quà.",
        icon: <Gift className="h-4 w-4" />,
      },
    ],
  },
  {
    href: "/admin/content",
    label: "Nội dung",
    icon: <BookOpen className="h-4 w-4" />,
    children: [
      {
        href: "/admin/content",
        label: "Learning Hub",
        description: "Quản lý bài viết, nội dung học tập và hướng dẫn.",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        href: "/admin/content#articles",
        label: "Bài viết",
        description: "Tạo, sửa và kiểm duyệt nội dung.",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    href: "/admin/reports",
    label: "Báo cáo",
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      {
        href: "/admin/reports",
        label: "Báo cáo tổng quan",
        description: "Theo dõi hành vi, hoạt động và hiệu suất hệ thống.",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        href: "/admin/reports#analytics",
        label: "Analytics",
        description: "Xem dữ liệu funnel và hành vi người dùng.",
        icon: <Sparkles className="h-4 w-4" />,
      },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const sessionUser = (session?.user ?? null) as SessionUserLike | null;

  const variant: NavbarVariant = useMemo(() => {
    if (status === "loading") return "loading";
    if (!sessionUser) return "guest";
    return sessionUser.role === "ADMIN" ? "admin" : "user";
  }, [sessionUser, status]);

  const navItems = useMemo<NavItem[]>(() => {
    if (variant === "admin") return adminNavItems;
    if (variant === "user") return userNavItems;
    return guestNavItems;
  }, [variant]);

  const homeHref =
    variant === "admin" ? "/admin" : variant === "user" ? "/dashboard" : "/";

  const displayName = sessionUser?.name?.trim() || "Tài khoản";
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "C";

  const coinBalance =
    typeof sessionUser?.coinBalance === "number"
      ? sessionUser.coinBalance
      : typeof sessionUser?.points === "number"
      ? sessionUser.points
      : 0;

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut({ callbackUrl: "/auth/login" });
  };


  return (
    <nav className="fixed left-0 right-0 top-0 z-[999] border-b border-[rgba(124,115,150,0.08)] bg-[#F8F8FE]/78 backdrop-blur-xl">
      <div className="section-container px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 rounded-full border border-white/75 bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(97,76,197,0.06)] backdrop-blur-xl md:px-5">
          <Link
            href={homeHref}
            className="flex min-w-0 shrink-0 items-center gap-3"
            aria-label="ChronoFlow"
          >
            <div className="relative h-9 w-[132px] shrink-0 overflow-hidden md:h-10 md:w-[148px]">
              <Image
                src="/images/logo-light.png"
                alt="ChronoFlow"
                fill
                priority
                sizes="148px"
                className="object-contain object-left"
              />
            </div>

            {variant === "admin" && (
              <span className="hidden rounded-full border border-[#E6E1FF] bg-[#F5F2FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#6B5BFF] xl:inline-flex">
                Admin
              </span>
            )}
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex">
            {navItems.map((item) => (
              <DesktopNavItem key={item.label} item={item} pathname={pathname} />
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
  {variant === "loading" ? (
    <NavbarLoadingState />
  ) : variant === "guest" ? (
              <>
                <Link
                  href="/auth/login"
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-5 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
                >
                  Đăng nhập
                </Link>

                <Link
                  href="/assessment"
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)] transition hover:-translate-y-0.5"
                >
                  <Sparkles className="h-4 w-4" />
                  Bắt đầu đánh giá
                </Link>
              </>
            ) : (
              <>
              {variant === "user" && <CoinBadge initialBalance={coinBalance} />}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((value) => !value)}
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                    className="inline-flex h-[42px] items-center gap-2 rounded-full border border-white/80 bg-white/92 px-2.5 shadow-[0_10px_24px_rgba(97,76,197,0.08)] transition hover:-translate-y-0.5"
                  >
                    <Avatar
                      displayName={displayName}
                      avatarLetter={avatarLetter}
                      image={sessionUser?.image ?? null}
                      size="md"
                    />

                    <ChevronDown
                      className={`h-4 w-4 text-[#7B7692] transition ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <>
                      <button
                        type="button"
                        aria-label="Đóng menu tài khoản"
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setProfileOpen(false)}
                      />

                      <ProfileDropdown
                        variant={variant}
                        displayName={displayName}
                        email={sessionUser?.email ?? null}
                        image={sessionUser?.image ?? null}
                        avatarLetter={avatarLetter}
                        coinBalance={coinBalance}
                        onClose={() => setProfileOpen(false)}
                        onLogout={handleLogout}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white text-[#241F3D] transition hover:bg-[#fafafe] lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <MobileNavigation
          variant={variant}
          navItems={navItems}
          pathname={pathname}
          displayName={displayName}
          email={sessionUser?.email ?? null}
          image={sessionUser?.image ?? null}
          avatarLetter={avatarLetter}
          coinBalance={coinBalance}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
        )}
      </div>
    </nav>
  );
}

function DesktopNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const active = isNavItemActive(item, pathname);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <Link
        href={item.href}
        className={`relative inline-flex h-[42px] items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[14px] font-semibold transition ${
          active
            ? "bg-[#F5F2FF] text-[#241F3D]"
            : "text-[#5F5A77] hover:bg-[#FAFAFF] hover:text-[#241F3D]"
        }`}
      >
        <span className={active ? "text-[#7C5CFA]" : "text-[#9A94B5]"}>
          {item.icon}
        </span>

        {item.label}

        {item.children && (
          <ChevronDown
            className={`h-4 w-4 text-[#9A94B5] transition ${
              open ? "rotate-180" : ""
            }`}
          />
        )}

        {active && (
          <span className="absolute left-1/2 top-[calc(100%+10px)] h-[3px] w-7 -translate-x-1/2 rounded-full bg-[#7C5CFA]" />
        )}
      </Link>

      {item.children && open && (
        <div className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/95 p-3 shadow-[0_24px_70px_rgba(97,76,197,0.16)] backdrop-blur-2xl">
            <div className="rounded-[22px] bg-[linear-gradient(180deg,#FAF8FF_0%,#F5F2FF_100%)] px-4 py-3">
              <div className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#7C5CFA]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#7C5CFA] shadow-sm">
                  {item.icon}
                </span>
                {item.label}
              </div>
            </div>

            <div className="mt-2 space-y-1">
  {item.children.map((child) => {
    const childActive = isHrefActive(child.href, pathname);

    return (
      <Link
        key={child.href}
        href={child.href}
        className={`flex gap-3 rounded-[22px] px-4 py-3 transition ${
          childActive ? "bg-[#F3F0FF]" : "hover:bg-[#F8F6FF]"
        }`}
      >
        <span
          className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl ${
            childActive
              ? "bg-[#7C5CFA] text-white"
              : "bg-[#F2EEFF] text-[#7C5CFA]"
          }`}
        >
          {child.icon}
        </span>

        <span className="min-w-0">
          <span className="block text-[14px] font-black text-[#241F3D]">
            {child.label}
          </span>

          {child.description && (
            <span className="mt-1 block text-[12px] leading-relaxed text-[#7B7692]">
              {child.description}
            </span>
          )}
        </span>
      </Link>
    );
  })}
</div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavigation({
  variant,
  navItems,
  pathname,
  displayName,
  email,
  image,
  avatarLetter,
  coinBalance,
  onClose,
  onLogout,
}: {
  variant: NavbarVariant;
  navItems: NavItem[];
  pathname: string;
  displayName: string;
  email: string | null;
  image: string | null;
  avatarLetter: string;
  coinBalance: number;
  onClose: () => void;
  onLogout: () => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setOpenGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  return (
    <div
      id="mobile-navigation"
      className="mx-auto mt-4 max-w-[1280px] rounded-[28px] border border-white/70 bg-white/96 p-5 shadow-[0_20px_50px_rgba(97,76,197,0.10)] backdrop-blur-xl lg:hidden"
    >
      {variant !== "guest" && variant !== "loading" && (
        <div className="mb-4 rounded-[24px] bg-[linear-gradient(180deg,#FAF8FF_0%,#F3EEFF_100%)] p-4">
          <div className="flex items-center gap-3">
            <Avatar
              displayName={displayName}
              avatarLetter={avatarLetter}
              image={image}
              size="lg"
            />

            <div className="min-w-0">
              <div className="truncate text-[14px] font-black text-[#241F3D]">
                {displayName}
              </div>
              <div className="truncate text-[12px] text-[#6B6287]">
                {email || "Không có email"}
              </div>
            </div>
          </div>

          {variant === "user" && (
            <Link
              href="/rewards"
              className="mt-4 flex items-center justify-between rounded-2xl border border-[#FFE7A8] bg-white/80 px-3 py-3 transition hover:bg-white"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#FFD166_0%,#FFB703_100%)] text-white shadow-[0_8px_18px_rgba(255,183,3,0.24)]">
                  <Coins className="h-4 w-4" />
                </span>

                <div>
                  <div className="text-[12px] font-bold text-[#7A5600]">
                    Coin hiện có
                  </div>
                  <div className="text-[15px] font-black text-[#241F3D]">
                    {coinBalance.toLocaleString("vi-VN")} coin
                  </div>
                </div>
              </div>

              <Gift className="h-4 w-4 text-[#B7791F]" />
            </Link>
          )}
        </div>
      )}

      <div className="space-y-2">
        {navItems.map((item) => {
          const active = isNavItemActive(item, pathname);
          const open = openGroups[item.label] || active;

          if (!item.children || item.children.length === 0) {
            return (
              <Link
  key={item.label}
  href={item.href}
  onClick={onClose}
  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${
                  active
                    ? "bg-[#F3F0FF] text-[#6B5BFF]"
                    : "text-[#5F5A77] hover:bg-[#fafafe] hover:text-[#241F3D]"
                }`}
              >
                <span className={active ? "text-[#7C5CFA]" : "text-[#9A94B5]"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.label} className="rounded-2xl">
              <button
                type="button"
                onClick={() => toggleGroup(item.label)}
                aria-expanded={open}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition ${
                  active
                    ? "bg-[#F3F0FF] text-[#6B5BFF]"
                    : "text-[#5F5A77] hover:bg-[#fafafe] hover:text-[#241F3D]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={active ? "text-[#7C5CFA]" : "text-[#9A94B5]"}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>

                <ChevronDown
                  className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="mt-2 space-y-1 rounded-[22px] bg-[#FAFAFF] p-2">
                  {item.children.map((child) => {
                    const childActive = isHrefActive(child.href, pathname);

                    return (
                      <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={`flex gap-3 rounded-[18px] px-3 py-3 transition ${
                          childActive ? "bg-white shadow-sm" : "hover:bg-white"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-2xl ${
                            childActive
                              ? "bg-[#7C5CFA] text-white"
                              : "bg-[#F2EEFF] text-[#7C5CFA]"
                          }`}
                        >
                          {child.icon}
                        </span>

                        <span className="min-w-0">
                          <span className="block text-[14px] font-black text-[#241F3D]">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="mt-0.5 block text-[12px] leading-relaxed text-[#7B7692]">
                              {child.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {variant === "user" && (
          <Link
          href="/rewards"
          onClick={onClose}
          className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-semibold text-[#5F5A77] transition hover:bg-[#fafafe] hover:text-[#241F3D]"
        >
            <span className="flex items-center gap-3">
              <Gift className="h-4 w-4 text-[#9A94B5]" />
              Điểm thưởng
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4CC] px-2.5 py-1 text-[12px] font-black text-[#7A5600]">
              <Coins className="h-3.5 w-3.5" />
              {coinBalance.toLocaleString("vi-VN")}
            </span>
          </Link>
        )}

        {variant !== "guest" && variant !== "loading" && (
          <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold text-[#5F5A77] transition hover:bg-[#fafafe] hover:text-[#241F3D]"
        >
            <User2 className="h-4 w-4 text-[#9A94B5]" />
            Hồ sơ
          </Link>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[rgba(124,115,150,0.10)] pt-5">
        {variant === "loading" ? (
          <div className="h-[46px] animate-pulse rounded-full bg-[#F2F0FA]" />
        ) : variant === "guest" ? (
          <>
            <Link
              href="/auth/login"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-6 text-[14px] font-semibold text-[#241F3D]"
            >
              Đăng nhập
            </Link>

            <Link
              href="/assessment"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)]"
            >
              <Sparkles className="h-4 w-4" />
              Bắt đầu đánh giá
            </Link>
          </>
        ) : (
          <>
            <Link
              href={variant === "admin" ? "/admin" : "/planner"}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)]"
            >
              {variant === "admin" ? (
                <>
                  <Shield className="h-4 w-4" />
                  Vào quản trị
                </>
              ) : (
                <>
                  <CalendarClock className="h-4 w-4" />
                  Mở kế hoạch
                </>
              )}
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(180,35,24,0.12)] bg-white px-6 text-[14px] font-semibold text-[#B42318]"
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileDropdown({
  variant,
  displayName,
  email,
  image,
  avatarLetter,
  coinBalance,
  onClose,
  onLogout,
}: {
  variant: NavbarVariant;
  displayName: string;
  email: string | null;
  image: string | null;
  avatarLetter: string;
  coinBalance: number;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-[calc(100%+12px)] z-50 w-[300px] overflow-hidden rounded-[28px] border border-white/80 bg-white/96 p-3 shadow-[0_25px_60px_rgba(97,76,197,0.14)] backdrop-blur-2xl"
    >
      <div className="rounded-[22px] bg-[linear-gradient(180deg,#FAF8FF_0%,#F3EEFF_100%)] p-4">
        <div className="flex items-center gap-3">
          <Avatar
            displayName={displayName}
            avatarLetter={avatarLetter}
            image={image}
            size="lg"
          />

          <div className="min-w-0">
            <div className="truncate text-[14px] font-black text-[#241F3D]">
              {displayName}
            </div>
            <div className="truncate text-[12px] text-[#6B6287]">
              {email || "Không có email"}
            </div>
          </div>
        </div>

        {variant === "user" && (
          <Link
          href="/rewards"
          onClick={onClose}
          className="mt-4 flex items-center justify-between rounded-2xl border border-[#FFE7A8] bg-white/80 px-3 py-3 transition hover:bg-white"
        >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#FFD166_0%,#FFB703_100%)] text-white shadow-[0_8px_18px_rgba(255,183,3,0.24)]">
                <Coins className="h-4 w-4" />
              </span>

              <div>
                <div className="text-[12px] font-bold text-[#7A5600]">
                  Coin hiện có
                </div>
                <div className="text-[15px] font-black text-[#241F3D]">
                  {coinBalance.toLocaleString("vi-VN")} coin
                </div>
              </div>
            </div>

            <Gift className="h-4 w-4 text-[#B7791F]" />
          </Link>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <DropdownSectionLabel label="Tài khoản" />

        <DropdownLink
          href="/profile"
          icon={<User2 className="h-4 w-4" />}
          label="Hồ sơ cá nhân"
          onClick={onClose}
        />

        <DropdownLink
          href="/settings"
          icon={<Settings className="h-4 w-4" />}
          label="Cài đặt"
          onClick={onClose}
        />

        {variant === "user" && (
          <>
            <DropdownSectionLabel label="Lối tắt" />

            <DropdownLink
              href="/planner"
              icon={<CalendarClock className="h-4 w-4" />}
              label="Mở kế hoạch"
              onClick={onClose}
            />

            <DropdownLink
              href="/insights"
              icon={<BarChart3 className="h-4 w-4" />}
              label="Xem phân tích"
              onClick={onClose}
            />

            <DropdownLink
              href="/rewards"
              icon={<Gift className="h-4 w-4" />}
              label="Điểm thưởng & đổi quà"
              onClick={onClose}
            />
          </>
        )}

        {variant === "admin" && (
          <>
            <DropdownSectionLabel label="Quản trị" />

            <DropdownLink
              href="/admin"
              icon={<Shield className="h-4 w-4" />}
              label="Trang quản trị"
              onClick={onClose}
            />
          </>
        )}
      </div>

      <div className="mt-3 border-t border-[rgba(124,115,150,0.10)] pt-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[14px] font-semibold text-[#B42318] transition hover:bg-[#FFF5F6]"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

function CoinBadge({ initialBalance }: { initialBalance: number }) {
  const [displayBalance, setDisplayBalance] = useState(initialBalance);
  const [isPulsing, setIsPulsing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleCoinLanded = (event: Event) => {
      const customEvent = event as CustomEvent<CoinLandedPayload>;
      const { amount, nextBalance } = customEvent.detail;

      setDisplayBalance((current) =>
        typeof nextBalance === "number" ? nextBalance : current + amount,
      );

      setIsPulsing(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsPulsing(false);
      }, 550);
    };

    window.addEventListener(
      COIN_LANDED_EVENT,
      handleCoinLanded as EventListener,
    );

    return () => {
      window.removeEventListener(
        COIN_LANDED_EVENT,
        handleCoinLanded as EventListener,
      );

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Link
      href="/rewards"
      data-coin-target="true"
      aria-label={`Bạn đang có ${displayBalance.toLocaleString("vi-VN")} coin`}
      className={`group inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#FFE7A8] bg-[linear-gradient(180deg,#FFFDF5_0%,#FFF7D6_100%)] px-3 text-[13px] font-black text-[#7A5600] shadow-[0_10px_24px_rgba(255,193,7,0.10)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(255,193,7,0.16)] ${
        isPulsing ? "cf-coin-badge-pulse" : ""
      }`}
    >
      <span className="relative grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,#FFD166_0%,#FFB703_100%)] text-white shadow-[0_8px_18px_rgba(255,183,3,0.26)]">
        <Coins className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#34D399]" />
      </span>

      <span className="tabular-nums">
        {displayBalance.toLocaleString("vi-VN")}
      </span>
    </Link>
  );
}

function Avatar({
  displayName,
  avatarLetter,
  image,
  size,
}: {
  displayName: string;
  avatarLetter: string;
  image: string | null;
  size: "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] font-black text-white shadow-sm`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={displayName}
          className="h-full w-full object-cover"
        />
      ) : (
        avatarLetter
      )}
    </div>
  );
}

function NavbarLoadingState() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[42px] w-[86px] animate-pulse rounded-full bg-[#F2F0FA]" />
      <div className="h-[42px] w-[42px] animate-pulse rounded-full bg-[#F2F0FA]" />
    </div>
  );
}

function DropdownSectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 pb-1 pt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#9A94B5] first:pt-1">
      {label}
    </div>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#F8F6FF]"
    >
      <span className="text-[#7C5CFA]">{icon}</span>
      {label}
    </Link>
  );
}

function isNavItemActive(item: NavItem, pathname: string) {
  if (isHrefActive(item.href, pathname)) return true;

  return Boolean(
    item.children?.some((child) => isHrefActive(child.href, pathname)),
  );
}

function isHrefActive(href: string, pathname: string) {
  const cleanHref = href.split("#")[0];

  if (cleanHref === "/") {
    return pathname === "/";
  }

  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}