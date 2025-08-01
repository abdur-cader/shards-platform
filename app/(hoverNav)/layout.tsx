// app/(hoverNav)/layout.tsx
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { Hind_Siliguri, Prompt } from "next/font/google";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className={`${PromptFont.className} ${HindFont.className}`}>
      <Navbar />
      {/* padding 18 */}
      {children}
      <Toaster position="bottom-center" richColors />
    </main>
  );
}
