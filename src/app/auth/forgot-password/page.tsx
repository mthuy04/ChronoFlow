"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <SimpleNav />

      <section className="min-h-[85vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white border border-[#F0EBE1] rounded-[2.5rem] shadow-sm p-8 md:p-10">
          <h1 className="text-4xl font-serif mb-3">Reset password</h1>
          <p className="text-[#8C7A6B] font-light mb-8 leading-relaxed">
            Enter your email and we’ll send a reset link.
          </p>

          {!sent ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="rounded-2xl border border-[#F0EBE1] bg-[#FDFCF8] px-4 py-4 flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#A39C93]" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent outline-none placeholder:text-[#B8ADA1] font-light"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#3A3836] text-white rounded-full py-4 font-light hover:bg-[#2C2A28] transition-colors"
              >
                Send reset link
              </button>
            </form>
          ) : (
            <div className="rounded-[2rem] bg-[#F8F7F3] p-6 text-[#6B655E] font-light leading-relaxed">
              A reset link has been sent to your email. Please check your inbox.
            </div>
          )}

          <p className="text-center text-sm text-[#8C7A6B] pt-6">
            Back to{" "}
            <Link
              href="/auth/login"
              className="text-[#3A3836] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
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