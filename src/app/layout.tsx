import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import CoinFlightLayer from "@/components/rewards/CoinFlightLayer";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ChronoFlow",
  description: "Chronotype-inspired planning platform",
};

const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "G-H4FJW15XEV";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#F7F4FB] text-[#241F3D] antialiased">
        <AuthProvider>
          <Navbar />
          <CoinFlightLayer />
          <main className="pt-[104px]">{children}</main>
        </AuthProvider>

        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}