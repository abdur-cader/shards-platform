"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

export default function EditProfileForm({
  user,
  token,
}: {
  user: any;
  token: string;
}) {
  const iconBtnBase = `
    rounded-md
    bg-gradient-to-r from-zinc-800 to-zinc-700
    border border-gray-600
    text-zinc-100
    shadow-md
    relative overflow-hidden
    transition-all duration-300 ease-in-out
    hover:scale-110
    hover:from-lime-800 hover:to-lime-700
    hover:border-lime-500
    group
  `;
  const router = useRouter();
  const { data: session } = useSession();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(
      "============================================ TOKEN FROM FORM`  ",
      token
    );

    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the token
      },
      body: JSON.stringify({
        name: formData.get("name"),
        username: formData.get("username"),
        bio: formData.get("bio"),
        userId: user.id, // Pass the user ID directly
      }),
    });

    if (!res.ok) {
      console.error("Update failed", await res.json());
      return;
    }

    // refresh the page data
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-300"
        >
          Display Name
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={user.name || ""}
          className="bg-zinc-800 border-zinc-700 focus:border-lime-400 focus:ring-lime-400/50"
          placeholder="Your name"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-zinc-300"
        >
          Username
        </label>
        <Input
          id="username"
          name="username"
          defaultValue={user.username || ""}
          className="bg-zinc-800 border-zinc-700 focus:border-lime-400 focus:ring-lime-400/50"
          placeholder="Unique username"
          required
          minLength={3}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-zinc-300"
        >
          Bio
        </label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio || ""}
          rows={4}
          className="bg-zinc-800 border-zinc-700 focus:border-lime-400 focus:ring-lime-400/50"
          placeholder="Tell us about yourself..."
          maxLength={200}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className={`${iconBtnBase} cursor-pointer`}>
          <span className="relative z-10">Save Changes</span>
          <span
            className="absolute inset-0 w-[200%]
                      bg-gradient-to-r from-transparent
                      via-[rgba(190,242,100,0.2)] to-transparent
                      -translate-x-full group-hover:translate-x-0
                      transition-transform duration-500 ease-in-out"
          />
        </Button>
      </div>
    </form>
  );
}
