import HeroSection from "@/components/home/HeroSection";
import KeyFunctionsSection from "@/components/home/KeyFunctionsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";




export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <Navbar />

      <div className="relative">
        <HeroSection />
        <HowItWorksSection />
        <KeyFunctionsSection />
        <FinalCTASection />
      </div>
      <Footer />
    </main>
  );
}
