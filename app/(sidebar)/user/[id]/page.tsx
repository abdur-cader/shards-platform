import ShardComponent from "@/components/Shard-component";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Edit, Heart, Save, Sparkles } from "lucide-react";

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
      <div className="flex items-center justify-center min-w-screen font-prompt text-2xl bg-gradient-to-br from-zinc-900 to-zinc-800">
        We couldn't find this user :(
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

  // Fetch recent activity (last 30 days)
  const activityRes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/activity?user_id=${user.id}`,
    {
      headers: {
        "sb-access-token": session?.supabaseAccessToken ?? "",
        "session-id": session?.user.id ?? "",
      },
      cache: "no-store",
    }
  );

  const activities = activityRes.ok ? await activityRes.json() : [];

  return (
    <div className="flex max-h-screen min-w-screen w-full mx-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-100 relative overflow-x-hidden">
      {/* Glowing accent elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-lime-500/10 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-lime-500/10 blur-3xl"></div>

      {/* LEFT: profile info */}
      <aside className="w-80 border-r border-zinc-700/50 p-6 flex flex-col items-center sticky top-0 h-screen bg-zinc-900/95 z-10">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-lime-500/30 blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <img
            src={user.image ?? "/default-avatar.png"}
            alt="avatar"
            className="relative w-32 h-32 rounded-full mb-4 object-cover border-2 border-lime-500 group-hover:border-lime-300 transition-all z-10"
          />
          {session?.user?.id === user.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <Link
                href="/users/edit"
                className="text-white text-sm font-medium flex items-center gap-1"
              >
                <Edit size={14} />
                Edit
              </Link>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-1 text-center text-zinc-100">
          {user.name}
        </h1>
        <span className="inline-block px-2 py-1 text-xs font-mono font-medium text-lime-400 bg-lime-400/10 rounded-md mb-3 border border-lime-400/20">
          @{user.username}
        </span>

        {user.bio && (
          <p className="text-zinc-300 text-center mb-6 max-w-xs">{user.bio}</p>
        )}

        <div className="w-full mb-6 p-4 rounded-lg bg-zinc-800 border border-zinc-700/50">
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>Joined</span>
            <span className="text-zinc-200">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Shards</span>
            <span className="text-zinc-200">{shards.length}</span>
          </div>
        </div>

        {session?.user?.id === user.id && (
          <Link
            href="/users/edit"
            className="mt-auto w-full px-4 py-2 bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-500 hover:to-lime-600 text-white rounded-md text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-500/10 hover:shadow-lime-500/20"
          >
            <Edit size={16} />
            Edit Profile
          </Link>
        )}
      </aside>

      {/* MIDDLE: shards list */}
      <section className="flex-1 overflow-y-auto p-6 bg-zinc-900/90">
        <div className="max-w-3xl mx-auto">
          {shards?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shards.map((shard: any) => (
                <ShardComponent
                  key={shard.slug}
                  slug={shard.slug}
                  title={shard.title}
                  description={shard.desc}
                  image={shard.image_url?.[0]}
                  lineClamp={true}
                  username={user.username}
                  className="hover:scale-[1.02] transition-transform duration-200 bg-zinc-800 border border-zinc-700/50 hover:border-lime-500/30"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-zinc-800/70 rounded-xl border border-dashed border-zinc-700/50">
              <Sparkles className="w-12 h-12 text-lime-400/50 mb-4" />
              <p className="text-zinc-400 text-center">
                {user.id === session?.user?.id
                  ? "You haven't created any shards yet"
                  : "This user hasn't created any shards yet"}
              </p>
              {user.id === session?.user?.id && (
                <Link
                  href="/shards/new"
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-500 hover:to-lime-600 text-white rounded-md text-sm transition-all shadow-lg shadow-lime-500/10 hover:shadow-lime-500/20"
                >
                  Create Your First Shard
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* RIGHT: recent activity */}
      <aside className="w-80 border-l mr-6 border-zinc-700/50 p-6 bg-zinc-900/95 sticky top-0 h-screen overflow-y-auto">
        <div className="top-0 bg-zinc-900/95 pb-6 z-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-lime-400">
            <Calendar size={20} className="text-lime-400" />
            Recent Activity
          </h2>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-4 -mt-2">
            {activities.map((activity: any) => (
              <div
                key={activity.id}
                className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-800/90 transition-colors border border-zinc-700/50 hover:border-lime-500/30"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {activity.type === "created" && (
                      <div className="p-2 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                        <Sparkles size={16} />
                      </div>
                    )}
                    {activity.type === "liked" && (
                      <div className="p-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <Heart size={16} />
                      </div>
                    )}
                    {activity.type === "saved" && (
                      <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Save size={16} />
                      </div>
                    )}
                    {activity.type === "updated" && (
                      <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <Edit size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-zinc-200">
                      {activity.type === "created" && (
                        <span>
                          Created shard{" "}
                          <strong className="text-lime-300">
                            {activity.shard_title}
                          </strong>
                        </span>
                      )}
                      {activity.type === "liked" && (
                        <span>
                          Liked shard{" "}
                          <strong className="text-lime-300">
                            {activity.shard_title}
                          </strong>
                        </span>
                      )}
                      {activity.type === "saved" && (
                        <span>
                          Saved shard{" "}
                          <strong className="text-lime-300">
                            {activity.shard_title}
                          </strong>
                        </span>
                      )}
                      {activity.type === "updated" && (
                        <span>
                          Updated shard{" "}
                          <strong className="text-lime-300">
                            {activity.shard_title}
                          </strong>
                        </span>
                      )}
                      {activity.type === "joined" && (
                        <span>Joined ShardLab</span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-zinc-500 py-8 bg-zinc-800/70 rounded-xl border border-dashed border-zinc-700/50">
            <p>No recent activity</p>
          </div>
        )}
      </aside>
    </div>
  );
}
