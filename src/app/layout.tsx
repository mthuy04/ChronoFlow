import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
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
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID ?? "wlvx0isghh";

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

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      </body>
    </html>
  );
}