"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Github, Link as LinkIcon } from "lucide-react";

import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

const Navbar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const products = [
    {
      title: "Citera",
      href: "https://citely-ai-169c.vercel.app/",
      src: "/citera_home.png",
      description: "Put 99% of your time into writing, and 1% into citations.",
    },
    // {
    //   title: "Algochurn",
    //   href: "https://algochurn.com",
    //   src: "https://assets.aceternity.com/demos/algochurn.webp",
    //   description: "Prepare for tech interviews like never before.",
    // },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 w-full mx-auto z-50 font-hind font-[300] bg-black/10 backdrop-blur-md",
        className
      )}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Shards">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/shards/explore">Explore Shards</HoveredLink>
            <HoveredLink href="/shards/create">Create New</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Featured Sites">
          <div
            className={`text-sm grid gap-10 font-prompt text-[200] p-4 ${
              products.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {products.map((product) => (
              <ProductItem key={product.title} {...product} />
            ))}
          </div>
        </MenuItem>
        {status === "loading" ? null : session?.user ? (
          <MenuItem
            setActive={setActive}
            active={active}
            item={
              session.user?.name
                ? session.user.name.charAt(0).toLocaleUpperCase() +
                  session.user.name.slice(1)
                : "User"
            }
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href={`/user/${session?.user?.github_login}`}>
                My Profile
              </HoveredLink>
              <HoveredLink href="/user/dashboard">Dashboard</HoveredLink>
              <HoveredLink href="/user/ai-toolkit">AI-Toolkit</HoveredLink>
              <button
                onClick={() => {
                  const delayedSignOut = () =>
                    new Promise((resolve, reject) => {
                      signOut({ redirect: false })
                        .then(() => setTimeout(resolve, 1000))
                        .catch(reject);
                    });
                  toast.promise(delayedSignOut(), {
                    loading: "Signing out...",
                    success: "Successfully signed out",
                    error: "Error signing out",
                  });
                }}
                className="text-left cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </MenuItem>
        ) : (
          <MenuItem setActive={setActive} active={active} item="Profile">
            <div className="flex flex-col space-y-4 text-sm">
              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="flex items-center gap-2 text-left cursor-pointer"
              >
                <Github className="w-6 h-6" />
                Sign in with GitHub
              </button>
            </div>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default Navbar;
