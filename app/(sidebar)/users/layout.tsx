import AppSidebar from "@/components/app-sidebar";
import { Toaster } from "sonner";
import { Hind_Siliguri } from "next/font/google";
import { Prompt } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
    <main
      className={`${PromptFont.className} ${HindFont.className} h-screen overflow-hidden`}
    >
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-hidden">{children}</div>
        </div>

        <Toaster position="bottom-center" richColors />
      </SidebarProvider>
    </main>
  );
}
