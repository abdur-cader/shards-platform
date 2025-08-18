import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, User, Sparkles, Copy } from "lucide-react";
import EditProfileForm from "@/components/EditProfileForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CopyButton } from "@/components/copyButton";

const iconBtnBase = `
    rounded-full
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

export default async function EditProfilePage() {
  const session = await auth();
  console.log("TOKEN FROM PAGE.TSX: ", session);
  if (!session?.user) redirect("/login");

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error(error);
    return <div>Error loading profile</div>;
  }

  if (!user) {
    return redirect("/login");
  }

  // Fetch total number of shards
  const { count: shardCount } = await supabase
    .from("shards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id);

  const profileUrl = `${process.env.NEXTAUTH_URL}/users/${user.username}`;

  return (
    <div className="min-h-screen min-w-screen bg-zinc-950/90 text-zinc-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Pencil className="w-6 h-6 text-lime-400" />
            Edit Profile
          </h1>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>{user.ai_credits} AI credits remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Profile Picture</CardTitle>
              <CardDescription>Update your avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32 border-2 border-lime-400/30">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-zinc-800 text-lime-400">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-zinc-500 text-center">
                  To change your profile picture, please update it through your
                  GitHub account. [TO IMPLEMENT DROPDOWN LATER]
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Editable Fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>
                  Update your public profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditProfileForm
                  user={user}
                  token={session?.supabaseAccessToken!}
                />
              </CardContent>
            </Card>

            {/* Account Details Section */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
                <CardDescription>
                  Your account information (GitHub)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Email</span>
                    <span className="text-sm text-zinc-300">
                      {user.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Access Level</span>
                    <span className="text-sm text-zinc-300 capitalize">
                      {user.access_level || "standard"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Joined</span>
                    <span className="text-sm text-zinc-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Total Shards</span>
                    <span className="text-sm text-zinc-300">
                      {shardCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-zinc-400">Profile URL</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-lime-400 truncate max-w-[160px]">
                        {profileUrl}
                      </span>
                      <CopyButton text={profileUrl} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
