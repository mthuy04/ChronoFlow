import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InsightsClient from "@/components/insights/InsightsClient";

export default function InsightsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F4FB] text-[#241F3D]">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-4 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[8%] h-[280px] w-[280px] rounded-full bg-purple-100/35 blur-[110px]" />
          <div className="absolute right-[-6%] top-[10%] h-[230px] w-[230px] rounded-full bg-blue-100/30 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[30%] h-[240px] w-[240px] rounded-full bg-fuchsia-100/20 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(#CFC7E8 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
        </div>

        <InsightsClient />
      </section>

      <Footer />
    </main>
  );
}