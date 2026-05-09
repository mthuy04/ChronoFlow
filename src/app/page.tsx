import BusinessModelSection from "@/components/home/BusinessModelSection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import KeyFunctionsSection from "@/components/home/KeyFunctionsSection";
import LearnSection from "@/components/home/LearnSection";
import PainPointsSection from "@/components/home/PainPointsSection";
import TargetUsersSection from "@/components/home/TargetUsersSection";
import ValueSection from "@/components/home/ValueSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4F2FA] text-[#1A1528]">
      <Navbar />

      <div className="relative">
        <HeroSection />
        <PainPointsSection />
        <ValueSection />
        <HowItWorksSection />
        <KeyFunctionsSection />
        <TargetUsersSection />
        <BusinessModelSection />
        <LearnSection />
        <FAQSection />
        <FinalCTASection />
      </div>

      <Footer />
    </main>
  );
}
