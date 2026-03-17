import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2D3155] text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12">
          <div>
            <div className="text-3xl font-semibold tracking-[-0.02em] mb-4">
              ChronoFlow
            </div>
            <p className="text-white/75 leading-relaxed max-w-md mb-6">
              A chronotype-inspired planning platform that helps students and
              young knowledge workers align focus, recovery, and scheduling with
              real biological rhythm.
            </p>

            <div className="rounded-[1.5rem] bg-white/10 border border-white/10 p-5 max-w-md">
              <div className="text-sm uppercase tracking-[0.2em] text-white/60 mb-3">
                Stay in rhythm
              </div>
              <p className="text-sm text-white/75 mb-4">
                Get occasional updates, learning content, and product news.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-full px-4 py-3 bg-white text-[#2F2B3A] outline-none"
                />
                <button className="rounded-full px-5 py-3 bg-[#8B7CF6] hover:bg-[#7867F0] transition-colors text-white">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60 mb-4">
              Explore
            </h3>
            <div className="space-y-3 text-white/80">
              <Link href="/" className="block hover:text-white">Home</Link>
              <Link href="/assessment" className="block hover:text-white">Quiz</Link>
              <Link href="/chronotypes" className="block hover:text-white">Chronotypes</Link>
              <Link href="/planner" className="block hover:text-white">Planner</Link>
              <Link href="/insights" className="block hover:text-white">Insights</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60 mb-4">
              Learn
            </h3>
            <div className="space-y-3 text-white/80">
              <Link href="/learn" className="block hover:text-white">Articles</Link>
              <Link href="/method" className="block hover:text-white">Method</Link>
              <Link href="/faq" className="block hover:text-white">FAQ</Link>
              <Link href="/rhythm" className="block hover:text-white">Bio-Rhythm</Link>
              <Link href="/kit" className="block hover:text-white">Chrono Kit</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/60 mb-4">
              Account
            </h3>
            <div className="space-y-3 text-white/80">
              <Link href="/auth/login" className="block hover:text-white">Log in</Link>
              <Link href="/auth/signup" className="block hover:text-white">Sign up</Link>
              <Link href="/profile" className="block hover:text-white">Profile</Link>
              <Link href="/dashboard" className="block hover:text-white">Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-white/55">
          <p>© 2026 ChronoFlow. Built for rhythm-aware planning.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}