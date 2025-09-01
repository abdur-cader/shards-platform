import ShardComponent from "@/components/Shard-component";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Edit,
  Heart,
  Save,
  Sparkles,
  User,
  CalendarDays,
} from "lucide-react";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: username } = await params;
  const session = await auth();

  // Fetch user data
  const userJson = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user?username=${username}`,
    {
      headers: {
        "sb-access-token": session?.supabaseAccessToken ?? "",
        "session-id": session?.user.id ?? "",
        purpose: "view",
        single: "true",
      },
      cache: "no-store",
    }
  );

  if (!userJson.ok) {
    const errorJson = await userJson.json();
    console.error("Failed to fetch user:", errorJson.error);
    return (
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100 font-prompt p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-700 flex items-center justify-center">
            <User size={32} className="text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-zinc-400 mb-6">
            We couldn't find the user you're looking for.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-lime-600 hover:bg-lime-500 text-white rounded-md transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }
  const user = await userJson.json();

  // Fetch user's shards
  const shardRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/shards?user_id=${user.id}`,
    {
      headers: {
        "sb-access-token": session?.supabaseAccessToken ?? "",
        "session-id": session?.user.id ?? "",
      },
      cache: "no-store",
    }
  );

  const shardsJson = await shardRes.json();
  const shards = shardRes.ok ? shardsJson.shards : [];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100">
      {/* Glowing accent elements */}
      <div className="fixed -top-20 -left-20 w-64 h-64 rounded-full bg-lime-500/10 blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-20 -right-20 w-64 h-64 rounded-full bg-lime-500/10 blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-lime-500/30 blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={user.image ?? "/default-avatar.png"}
                alt="avatar"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-zinc-800 group-hover:border-lime-500/50 transition-all z-10"
              />
              {session?.user?.id === user.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer">
                  <Edit size={18} className="text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <h1 className="text-3xl font-[500] font-prompt text-zinc-100">
                {user.name}
              </h1>
              <span className="inline-flex items-center px-3 py-1 text-sm font-mono font-medium text-lime-400 bg-lime-400/10 rounded-full border border-lime-400/20">
                @{user.username}
              </span>
              {session?.user?.id === user.id && (
                <Link
                  href="/user/edit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors ml-auto"
                >
                  <Edit size={16} />
                  Edit Profile
                </Link>
              )}
            </div>

            {user.bio && (
              <p className="text-zinc-300 mb-6 max-w-2xl">{user.bio}</p>
            )}

            <div className="flex items-center gap-6 text-zinc-400">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                <span>
                  Joined{" "}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <span>{shards.length} Shards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shards Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-[400] font-prompt text-zinc-100 flex items-center gap-2">
              <Sparkles className="text-lime-400" size={24} />
              Shards
            </h2>
          </div>

          {shards?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shards.map((shard: any) => (
                <ShardComponent
                  key={shard.slug}
                  slug={shard.slug}
                  title={shard.title}
                  description={shard.desc}
                  image={shard.image_url?.[0]}
                  lineClamp={true}
                  username={user.username}
                  className="hover:scale-[1.02] transition-transform duration-200 bg-zinc-800 border border-zinc-700/50 hover:border-lime-500/30 rounded-xl overflow-hidden"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-zinc-800/50 rounded-xl border border-dashed border-zinc-700/50">
              <Sparkles className="w-16 h-16 text-lime-400/50 mb-4" />
              <h3 className="text-xl font-medium text-zinc-200 mb-2">
                No shards yet
              </h3>
              <p className="text-zinc-400 text-center mb-6 max-w-md">
                {user.id === session?.user?.id
                  ? "You haven't created any shards yet. Start sharing your ideas and creations!"
                  : "This user hasn't created any shards yet."}
              </p>
              {user.id === session?.user?.id && (
                <Link
                  href="/shards/new"
                  className="px-5 py-2.5 bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-500 hover:to-lime-600 text-white rounded-md transition-all shadow-lg shadow-lime-500/10 hover:shadow-lime-500/20 flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Create Your First Shard
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
