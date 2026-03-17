"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <SimpleNav />

      <section className="min-h-[85vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white border border-[#F0EBE1] rounded-[2.5rem] shadow-sm p-8 md:p-10">
          <h1 className="text-4xl font-serif mb-3">Welcome back</h1>
          <p className="text-[#8C7A6B] font-light mb-8 leading-relaxed">
            Log in to access your dashboard, rhythm, planner, and weekly insights.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputRow
              icon={<Mail className="w-4 h-4" />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
            />

            <InputRow
              icon={<Lock className="w-4 h-4" />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[#A39C93] hover:text-[#3A3836]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            {error && (
              <div className="rounded-2xl bg-rose-50 text-rose-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3A3836] text-white rounded-full py-4 font-light hover:bg-[#2C2A28] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>

            <Link
              href="/auth/forgot-password"
              className="block text-center text-sm text-[#8C7A6B] hover:text-[#3A3836] transition-colors"
            >
              Forgot password?
            </Link>

            <p className="text-center text-sm text-[#8C7A6B] pt-2">
              Don’t have an account?{" "}
              <Link href="/auth/signup" className="text-[#3A3836] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function InputRow({
  icon,
  type,
  placeholder,
  value,
  onChange,
  trailing,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#F0EBE1] bg-[#FDFCF8] px-4 py-4 flex items-center gap-3">
      <div className="text-[#A39C93]">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none placeholder:text-[#B8ADA1] font-light"
      />
      {trailing}
    </div>
  );
}

function SimpleNav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#F0EBE1] px-6 py-5">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Sparkles className="w-5 h-5 text-[#D4B59E]" />
          <span className="text-xl font-serif">ChronoFlow</span>
        </Link>
      </div>
    </nav>
  );
}