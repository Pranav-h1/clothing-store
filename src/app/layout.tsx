import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { business } from "@/config/business";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.seo.siteUrl),
  title: { default: business.seo.defaultTitle, template: business.seo.titleTemplate },
  description: business.brand.description,
  openGraph: { siteName: business.brand.name, type: "website" },
  // Keep the demo out of search results until real content is in place.
  robots: business.isDemo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f6f3ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${instrument.variable}`}>
      <body className="min-h-dvh">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
