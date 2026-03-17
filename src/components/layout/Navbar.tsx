"use client";

import Link from "next/link";
import { Moon, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavbarVariant = "guest" | "user" | "admin";

interface NavbarProps {
  variant?: NavbarVariant;
}

export default function Navbar({ variant = "guest" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const guestLinks = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/learn", label: "Learn" },
  ];

  const userLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/rhythm", label: "My Rhythm" },
    { href: "/planner", label: "Planner" },
    { href: "/insights", label: "Insights" },
    { href: "/learn", label: "Learn" },
    { href: "/profile", label: "Profile" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/assessments", label: "Assessments" },
    { href: "/admin/content", label: "Content" },
    { href: "/admin/product", label: "Product" },
    { href: "/admin/reports", label: "Reports" },
  ];

  const links =
    variant === "guest"
      ? guestLinks
      : variant === "user"
      ? userLinks
      : adminLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#F7F4FB]/88 backdrop-blur-xl">
      <div className="section-container px-6 h-20 flex items-center justify-between">
        <Link
          href={variant === "admin" ? "/admin" : "/"}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#EEE7FF] flex items-center justify-center">
            <Moon className="w-4 h-4 text-[#8B5CF6]" />
          </div>

          <div className="leading-tight">
            <div className="text-[1rem] font-semibold text-[#241F3D]">
              {variant === "admin" ? "ChronoFlow Admin" : "ChronoFlow"}
            </div>
            {variant !== "admin" && (
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#8B5CF6]">
                Bio-rhythm planning
              </div>
            )}
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {variant === "guest" && (
            <>
              <Link
                href="/auth/login"
                className="cf-btn-secondary !min-h-[40px] !px-5 !text-[14px]"
              >
                Sign in
              </Link>

              <Link
                href="/assessment"
                className="cf-btn-primary !min-h-[40px] !px-5 !text-[14px]"
              >
                Start assessment
              </Link>
            </>
          )}

          {variant === "user" && (
            <Link
              href="/planner"
              className="cf-btn-primary !min-h-[40px] !px-5 !text-[14px]"
            >
              Open planner
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden text-[#241F3D]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--line)] bg-[#F7F4FB] px-6 py-5 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[#5F5876]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {variant === "guest" && (
            <div className="pt-3 flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="cf-btn-secondary"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>

              <Link
                href="/assessment"
                className="cf-btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                Start assessment
              </Link>
            </div>
          )}

          {variant === "user" && (
            <div className="pt-3">
              <Link
                href="/planner"
                className="cf-btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                Open planner
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}