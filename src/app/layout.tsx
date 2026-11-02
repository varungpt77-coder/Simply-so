import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Simply & So — Simply right. So essential.",
  description: "Simply right. So essential. Discover Simply & So premium insulated water bottles — beautifully designed, thoughtfully made, and ready for your everyday.",
  applicationName: "Simply & So",
  keywords: ["Simply & So", "premium water bottles", "insulated bottle", "stainless steel bottle", "sustainable hydration", "India"],
  openGraph: {
    title: "Simply & So — Simply right. So essential.",
    description: "Beautifully designed bottles for a more considered everyday. Discover Simply & So.",
    images: [{ url: "/images/simplyso-hero.jpg", width: 2048, height: 1152, alt: "Simply & So merlot and porcelain ivory premium insulated bottles" }],
    type: "website",
    locale: "en_IN",
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#5d1a2b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
