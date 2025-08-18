"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ShardSelector from "@/components/ShardSelector";
import { useSession } from "next-auth/react";

export default function ReadmeBuilderForm() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const accessToken = session?.supabaseAccessToken
  console.log("user id", userId)

  return (
    <div className="space-y-4">
      {userId && (
        <div className="space-y-2">
          <ShardSelector userId={userId} accessToken={accessToken}/>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-gray-300">Description</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="Brief description of your project"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Key Features</Label>
        <Textarea
          className="bg-gray-700 border-gray-600 focus:border-indigo-400/50 focus:ring-indigo-400/30 hover:border-gray-500 transition-all"
          placeholder="List the main features of your project you'd like to have listed in this Readme."
          rows={3}
        />
      </div>
    </div>
  );
}
