"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, LogOut, User2, LayoutDashboard, CalendarClock, Brain, BarChart3, Shield, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

type NavbarVariant = "guest" | "user" | "admin" | string;

type SessionUserLike = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

// ĐÃ SỬA: Thêm interface NavbarProps
interface NavbarProps {
  variant?: NavbarVariant;
}

// ĐÃ SỬA: Khai báo component nhận props
export default function Navbar({ variant: propVariant }: NavbarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const sessionUser = (session?.user ?? null) as SessionUserLike | null;

  const variant: NavbarVariant = useMemo(() => {
    if (propVariant) return propVariant; // Ưu tiên variant truyền vào từ prop
    if (status === "loading") return "guest";
    if (!sessionUser) return "guest";
    return sessionUser.role === "ADMIN" ? "admin" : "user";
  }, [sessionUser, status, propVariant]);

  const guestLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/how-it-works", label: "Cách hoạt động" },
    { href: "/features", label: "Tính năng" },
    { href: "/learn", label: "Kiến thức" },
    { href: "/roadmap", label: "Lộ trình" },
  ];

  const userLinks = [
    { href: "/dashboard", label: "Tổng quan" },
    { href: "/rhythm", label: "Nhịp của tôi" },
    { href: "/planner", label: "Kế hoạch" },
    { href: "/insights", label: "Phân tích" },
    { href: "/learn", label: "Kiến thức" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Tổng quan" },
    { href: "/admin/users", label: "Người dùng" },
    { href: "/admin/content", label: "Nội dung" },
    { href: "/admin/reports", label: "Báo cáo" },
  ];

  const links =
    variant === "guest"
      ? guestLinks
      : variant === "admin"
      ? adminLinks
      : userLinks;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const displayName = sessionUser?.name?.trim() || "Tài khoản";
  const firstName = displayName.split(" ").slice(-1)[0] || displayName;
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "C";

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(124,115,150,0.08)] bg-[#F8F8FE]/78 backdrop-blur-xl">
      <div className="section-container px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between rounded-full border border-white/75 bg-white/88 px-5 py-3 shadow-[0_10px_30px_rgba(97,76,197,0.06)] backdrop-blur-xl md:px-6">
          <Link
            href={variant === "admin" ? "/admin" : variant === "user" ? "/dashboard" : "/"}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(124,92,250,0.14)] ring-1 ring-slate-200/70">
              <div className="grid grid-cols-2 gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              </div>
            </div>

            <div className="min-w-0 leading-tight">
              <div className="truncate text-[1.1rem] font-extrabold tracking-tight text-[#241F3D] md:text-[1.2rem]">
                {variant === "admin" ? "ChronoFlow Admin" : "ChronoFlow"}
              </div>

              {variant !== "admin" && (
                <div className="hidden text-[9px] uppercase tracking-[0.18em] text-[#7C5CFA] md:block">
                  Lập kế hoạch theo nhịp sinh học
                </div>
              )}
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-7 xl:gap-9">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap text-[14px] font-semibold transition ${
                    active
                      ? "text-[#241F3D]"
                      : "text-[#5F5A77] hover:text-[#241F3D]"
                  }`}
                >
                  {link.label}

                  {active && (
                    <span className="absolute left-1/2 top-[calc(100%+12px)] h-[3px] w-7 -translate-x-1/2 rounded-full bg-[#7C5CFA]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {variant === "guest" ? (
              <>
                <Link
                  href="/auth/login"
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-5 text-[14px] font-semibold text-[#241F3D] transition hover:bg-[#fafafe]"
                >
                  Đăng nhập
                </Link>

                <Link
                  href="/assessment"
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)] transition hover:-translate-y-0.5"
                >
                  Bắt đầu đánh giá
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/92 px-3 py-2 shadow-[0_10px_24px_rgba(97,76,197,0.08)] transition hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-sm font-black text-white shadow-sm">
                    {sessionUser?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sessionUser.image}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      avatarLetter
                    )}
                  </div>

                  <div className="max-w-[150px] text-left">
                    <div className="truncate text-[13px] font-bold text-[#241F3D]">
                      {firstName}
                    </div>
                    <div className="truncate text-[11px] font-medium text-[#7B7692]">
                      {variant === "admin" ? "Quản trị viên" : "Tài khoản của tôi"}
                    </div>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-[#7B7692] transition ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Đóng menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[280px] overflow-hidden rounded-[28px] border border-white/80 bg-white/96 p-3 shadow-[0_25px_60px_rgba(97,76,197,0.14)] backdrop-blur-2xl">
                      <div className="rounded-[22px] bg-[linear-gradient(180deg,#FAF8FF_0%,#F3EEFF_100%)] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-base font-black text-white shadow-sm">
                            {sessionUser?.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={sessionUser.image}
                                alt={displayName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              avatarLetter
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-black text-[#241F3D]">
                              {displayName}
                            </div>
                            <div className="truncate text-[12px] text-[#6B6287]">
                              {sessionUser?.email || "Không có email"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        <DropdownLink
                          href="/profile"
                          icon={<User2 className="h-4 w-4" />}
                          label="Hồ sơ"
                          onClick={() => setProfileOpen(false)}
                        />
                        <DropdownLink
                          href="/dashboard"
                          icon={<LayoutDashboard className="h-4 w-4" />}
                          label="Dashboard"
                          onClick={() => setProfileOpen(false)}
                        />
                        <DropdownLink
                          href="/planner"
                          icon={<CalendarClock className="h-4 w-4" />}
                          label="Planner"
                          onClick={() => setProfileOpen(false)}
                        />
                        <DropdownLink
                          href="/rhythm"
                          icon={<Brain className="h-4 w-4" />}
                          label="Rhythm"
                          onClick={() => setProfileOpen(false)}
                        />
                        <DropdownLink
                          href="/insights"
                          icon={<BarChart3 className="h-4 w-4" />}
                          label="Insights"
                          onClick={() => setProfileOpen(false)}
                        />

                        {variant === "admin" && (
                          <DropdownLink
                            href="/admin"
                            icon={<Shield className="h-4 w-4" />}
                            label="Trang quản trị"
                            onClick={() => setProfileOpen(false)}
                          />
                        )}
                      </div>

                      <div className="mt-3 border-t border-[rgba(124,115,150,0.10)] pt-3">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[14px] font-semibold text-[#B42318] transition hover:bg-[#FFF5F6]"
                        >
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white text-[#241F3D] transition hover:bg-[#fafafe] lg:hidden"
            aria-label="Mở menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mx-auto mt-4 max-w-[1180px] rounded-[24px] border border-white/70 bg-white/95 p-5 shadow-[0_20px_50px_rgba(97,76,197,0.08)] backdrop-blur-xl lg:hidden">
            {variant !== "guest" && (
              <div className="mb-4 rounded-[22px] bg-[linear-gradient(180deg,#FAF8FF_0%,#F3EEFF_100%)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] text-base font-black text-white shadow-sm">
                    {sessionUser?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sessionUser.image}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      avatarLetter
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-black text-[#241F3D]">
                      {displayName}
                    </div>
                    <div className="truncate text-[12px] text-[#6B6287]">
                      {sessionUser?.email || "Không có email"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {links.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${
                      active
                        ? "bg-[#F3F0FF] text-[#6B5BFF]"
                        : "text-[#5F5A77] hover:bg-[#fafafe] hover:text-[#241F3D]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {variant !== "guest" && (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-[#5F5A77] transition hover:bg-[#fafafe] hover:text-[#241F3D]"
                  >
                    Hồ sơ
                  </Link>

                  {variant === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-[#5F5A77] transition hover:bg-[#fafafe] hover:text-[#241F3D]"
                    >
                      Trang quản trị
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-[rgba(124,115,150,0.10)] pt-5">
              {variant === "guest" ? (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(124,115,150,0.12)] bg-white px-6 text-[14px] font-semibold text-[#241F3D]"
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    href="/assessment"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)]"
                  >
                    Bắt đầu đánh giá
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={variant === "admin" ? "/admin" : "/planner"}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6B5BFF_0%,#7C5CFA_45%,#5B8CFF_100%)] px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(108,92,255,0.22)]"
                  >
                    {variant === "admin" ? "Vào quản trị" : "Mở kế hoạch"}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(180,35,24,0.12)] bg-white px-6 text-[14px] font-semibold text-[#B42318]"
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
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