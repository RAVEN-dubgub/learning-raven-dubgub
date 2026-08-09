import type { Metadata } from "next";
import { Geist, Geist_Mono, Share_Tech_Mono } from "next/font/google";
import { DedSecBackground } from "@/components/dedsec-background";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const shareTech = Share_Tech_Mono({ weight: "400", variable: "--font-share-tech", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Hult Week 4`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${shareTech.variable} h-full`}>
      <body className="min-h-full antialiased">
        <DedSecBackground />
        <div className="app-shell">
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
