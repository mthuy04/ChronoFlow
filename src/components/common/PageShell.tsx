import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface PageShellProps {
  children: ReactNode;
  navbarVariant?: "guest" | "user" | "admin";
  withFooter?: boolean;
}

export default function PageShell({
  children,
  navbarVariant = "guest",
  withFooter = false,
}: PageShellProps) {
  return (
    <main className="min-h-screen bg-[#FDFCF8] text-[#3A3836]">
      <Navbar variant={navbarVariant} />
      {children}
      {withFooter && <Footer />}
    </main>
  );
}