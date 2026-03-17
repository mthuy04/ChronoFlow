"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Sparkles, User, Moon, Sun, RotateCcw, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChronotype } from "@/hooks/useChronotype";
import { getInitials } from "@/lib/utils";
import { APP_ROUTES } from "@/lib/constants";

export default function ProfilePage() {
  const { user, logout, isReady: authReady } = useAuth();
  const { chronotype, isReady: chronoReady } = useChronotype();

  const isReady = authReady && chronoReady;

  const initials = useMemo(() => {
    return getInitials(user?.name || "Guest");
  }, [user?.name]);

  if (!isReady) {
    return (
      <main className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="text-[#8C7A6B] font-light">Loading profile...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836] flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center bg-white border border-[#F0EBE1] rounded-[2.5rem] shadow-sm p-10">
          <h1 className="text-4xl font-serif mb-4">No profile available</h1>
          <p className="text-[#6B655E] font-light leading-relaxed mb-8">
            Please log in to access your settings and saved rhythm.
          </p>
          <Link
            href={APP_ROUTES.login}
            className="bg-[#3A3836] text-white px-8 py-4 rounded-full hover:bg-[#2C2A28] transition-colors inline-flex"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Nav />

      <section className="pt-28 md:pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif mb-10">Settings</h1>

          <div className="bg-white rounded-[2.5rem] border border-[#F0EBE1] shadow-sm p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6 pb-8 border-b border-[#F0EBE1] mb-8">
              <div className="w-20 h-20 rounded-full bg-[#F8F7F3] flex items-center justify-center text-[#D4B59E] text-2xl font-serif">
                {initials}
              </div>

              <div>
                <h2 className="text-3xl font-serif mb-2">{user.name}</h2>
                <p className="text-[#8C7A6B] font-light">{user.email}</p>
                <p className="text-sm text-[#A39C93] mt-2">
                  Current Rhythm: {chronotype ?? "Not assessed yet"}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <ProfileRow
                icon={<Moon className="w-5 h-5" />}
                label="Target Sleep Time"
                value={user.targetSleepTime || "11:00 PM"}
              />
              <ProfileRow
                icon={<Sun className="w-5 h-5" />}
                label="Target Wake Time"
                value={user.targetWakeTime || "07:00 AM"}
              />
              <ProfileRow
                icon={<User className="w-5 h-5" />}
                label="Role"
                value={user.role || "user"}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={APP_ROUTES.assessment}
                className="inline-flex items-center gap-2 border border-[#DCD6CC] text-[#6B655E] px-5 py-3 rounded-full hover:border-[#3A3836] hover:text-[#3A3836] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 bg-[#3A3836] text-white px-5 py-3 rounded-full hover:bg-[#2C2A28] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[1.5rem] bg-[#F8F7F3] px-5 py-4">
      <div className="flex items-center gap-3 text-[#6B655E]">
        <div className="text-[#D4B59E]">{icon}</div>
        <span className="font-light">{label}</span>
      </div>
      <span className="text-[#3A3836] font-medium">{value}</span>
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#F0EBE1] px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D4B59E]" />
          <span className="text-xl font-serif">ChronoFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-[#8C7A6B] font-light">
          <Link href="/dashboard" className="hover:text-[#3A3836]">
            Dashboard
          </Link>
          <Link href="/rhythm" className="hover:text-[#3A3836]">
            My Rhythm
          </Link>
          <Link href="/planner" className="hover:text-[#3A3836]">
            Planner
          </Link>
          <Link href="/insights" className="hover:text-[#3A3836]">
            Insights
          </Link>
        </div>
      </div>
    </nav>
  );
}