import HeroSection from "@/components/home/HeroSection";
import PainPointsSection from "@/components/home/PainPointsSection";
import KeyFunctionsSection from "@/components/home/KeyFunctionsSection";
import TargetUsersSection from "@/components/home/TargetUsersSection";
import ValueSection from "@/components/home/ValueSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ChronotypePreviewSection from "@/components/home/ChronotypePreviewSection";
import UseCasesSection from "@/components/home/UseCasesSection";
import GamificationSection from "@/components/home/GamificationSection";
import RewardKitSection from "@/components/home/RewardKitSection";
import LearnSection from "@/components/home/LearnSection";
import BusinessModelSection from "@/components/home/BusinessModelSection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";




export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      <Navbar />

      <div className="relative">
      <HeroSection />
      <PainPointsSection />
      <KeyFunctionsSection />
      <TargetUsersSection />
      <ValueSection />
      <HowItWorksSection />
      <ChronotypePreviewSection />
      <UseCasesSection />
      <GamificationSection />
      <RewardKitSection />
      <LearnSection />
      <BusinessModelSection />
      <FAQSection />
      <FinalCTASection />
      </div>
      <Footer />
    </main>
  );
}
