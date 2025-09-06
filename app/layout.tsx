import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Hind_Siliguri, Prompt } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sharded AI",
  description: "Power up your creations with AI.",
};

const PromptFont = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-prompt",
});

const HindFont = Hind_Siliguri({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hind",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${PromptFont.className} ${HindFont.className}`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
