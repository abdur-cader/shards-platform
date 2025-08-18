"use client";
import { PiCoinVerticalLight } from "react-icons/pi";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef } from "react";
import {
  Sparkles,
  Home,
  BringToFront,
  Gauge,
  Settings,
  PlusIcon,
  LeafyGreen,
  ChevronUp,
  LogOut,
  CreditCard,
  Bell,
  User,
} from "lucide-react";

export function SidebarShell({ session }: { session: any }) {
  const { open, setOpen, dropdownOpen, setDropdownOpen } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const mainItems = [
    { title: "Home", url: "/", icon: Home },
    {
      title: "Dashboard",
      url: `/user/dashboard`,
      icon: Gauge,
    },
    {
      title: "Profile",
      url: `/user/${session?.user?.username}`,
      icon: User,
    },
  ];

  const shardItems = [
    { title: "Explore Shards", url: "/shards/explore", icon: BringToFront },
    { title: "Create Shard", url: "/shards/create", icon: PlusIcon },
    { title: "AI Toolkit", url: "/user/ai-toolkit", icon: Sparkles },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If dropdown is open and click is outside both dropdown and sidebar
      if (
        dropdownOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, setDropdownOpen, setOpen]);

  return (
    <Sidebar
      className="fixed h-screen left-0 top-0 z-50"
      collapsible="icon"  
      ref={sidebarRef}
    >
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="/"
                className="flex items-center gap-3 px-5 py-4 text-4xl font-prompt"
              >
                <LeafyGreen className="w-7 h-7" />
                Sharded
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main */}
        <SidebarGroup>
          <div className="my-1 h-px" />
          <SidebarGroupLabel className="font-prompt">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-5 py-3 text-lg"
                    >
                      <item.icon className="w-6 h-6" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Shards */}
        <SidebarGroup>
          <div className="my-1 h-px bg-border" />
          <SidebarGroupLabel className="font-prompt">Shards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {shardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-5 py-3 text-lg"
                    >
                      <item.icon className="w-6 h-6" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="my-2 h-px bg-border" />
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-5 py-3 text-lg"
                  >
                    <Settings className="w-6 h-6" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu
              open={dropdownOpen}
              onOpenChange={(isOpen) => {
                setDropdownOpen(isOpen);
                if (isOpen) {
                  setOpen(true);
                } else if (
                  !sidebarRef.current?.contains(document.activeElement)
                ) {
                  // Only close sidebar if focus isn't moving to another element in sidebar
                  setOpen(false);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-3 px-5 py-3 font-prompt whitespace-nowrap">
                  <img
                    src={session?.user?.image || ""}
                    alt="avatar"
                    className={`${
                      open ? "w-6 h-6" : "w-6 h-4"
                    } rounded-full object-cover flex-shrink-0 transition-all`}
                  />
                  <span className="truncate">{session?.user?.name}</span>
                  <ChevronUp className="ml-auto w-5 h-5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                className="w-64 text-sm"
                onInteractOutside={(event) => {
                  // Prevent closing when clicking on sidebar
                  if (sidebarRef.current?.contains(event.target as Node)) {
                    event.preventDefault();
                  }
                }}
              >
                {/* profile section */}
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={session?.user?.image || ""}
                      alt="avatar"
                      className="w-8 h-8 rounded-md object-cover"
                    />
                    <div className="space-y-0.5">
                      <p className="font-medium leading-none">
                        {session?.user?.name || "Username"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session?.user?.email || "email@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* separator line */}
                <div className="my-1 h-px bg-border" />

                {/* menu items */}
                <DropdownMenuItem>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>

                <div className="my-1 h-px bg-border" />

                <DropdownMenuItem>
                  <PiCoinVerticalLight className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Credit management</span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.ai_credits.toLocaleString()} credits
                      remaining
                    </span>
                  </div>
                </DropdownMenuItem>
                <div className="my-1 h-px bg-border" />

                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
