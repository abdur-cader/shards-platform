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

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 w-full mx-auto z-50 font-hind font-[300] bg-black/10 backdrop-blur-md",
        className
      )}
    >
      <Menu setActive={setActive}>
        <Link href="/pricing">Pricing</Link>
        <MenuItem setActive={setActive} active={active} item="Shards">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/shards/explore">Explore Shards</HoveredLink>
            <HoveredLink href="/shards/create">Create</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Featured Sites">
          <div className="text-sm grid grid-cols-2 gap-10 font-prompt text-[200] p-4">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Production ready Tailwind CSS components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem>
        {status === "loading" ? null : session?.user ? (
          <MenuItem
            setActive={setActive}
            active={active}
            item={session?.user?.githubAccessToken ?? "User"}
          >
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href={`/user/${session?.user?.github_login}`}>
                My Profile
              </HoveredLink>
              <HoveredLink href="/account">Account</HoveredLink>
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
