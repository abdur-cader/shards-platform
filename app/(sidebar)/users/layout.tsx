import AppSidebar from "@/components/app-sidebar";
import { Toaster } from "sonner";
import { Hind_Siliguri } from "next/font/google";
import { Prompt } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const PromptFont = Prompt({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-prompt',
});

const HindFont = Hind_Siliguri({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-hind',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`${PromptFont.className} ${HindFont.className} h-screen overflow-hidden`}
    >
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col h-full">
          {/* Header with SidebarTrigger */}
          <div className="flex items-center h-16 px-4 border-b border-border bg-background shrink-0">
            <SidebarTrigger />
            {/* You can add a title or nav items here */}
          </div>

          {/* Page content area */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>

        <Toaster position="bottom-center" richColors />
      </SidebarProvider>
    </main>
  );
}

