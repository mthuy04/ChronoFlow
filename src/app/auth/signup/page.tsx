"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookText,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          studentId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Signup failed.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <SimpleNav />

      <section className="min-h-[85vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white border border-[#F0EBE1] rounded-[2.5rem] shadow-sm p-8 md:p-10">
          <h1 className="text-4xl font-serif mb-3">Create account</h1>
          <p className="text-[#8C7A6B] font-light mb-8 leading-relaxed">
            Unlock your personal rhythm, dashboard, planner, and weekly insights.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputRow
              icon={<User className="w-4 h-4" />}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={setName}
            />

            <InputRow
              icon={<Mail className="w-4 h-4" />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
            />

            <InputRow
              icon={<BookText className="w-4 h-4" />}
              type="text"
              placeholder="Student ID (optional)"
              value={studentId}
              onChange={setStudentId}
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

            {success && (
              <div className="rounded-2xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3A3836] text-white rounded-full py-4 font-light hover:bg-[#2C2A28] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center text-sm text-[#8C7A6B] pt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#3A3836] hover:underline">
                Log in
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