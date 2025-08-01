// AppSidebar.tsx (server component)

import { auth } from "@/auth";
import { SidebarShell } from "@/components/SidebarShell";

export default async function AppSidebar() {
  const session = await auth();

  return <SidebarShell session={session || null} />;
}
