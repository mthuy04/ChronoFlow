
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ChronotypePreviewSection from "@/components/home/ChronotypePreviewSection";
import EnergyCurveSection from "@/components/home/EnergyCurveSection";
import LearnSection from "@/components/home/LearnSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FinalCTASection from "@/components/home/FinalCTASection";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <Navbar variant="guest" />

      <div className="relative">
        <HeroSection />
        <ChronotypePreviewSection />
        <EnergyCurveSection />
        <HowItWorksSection />
        <LearnSection />
        <FinalCTASection />
      </div>

      <Footer />
    </main>
  );
}