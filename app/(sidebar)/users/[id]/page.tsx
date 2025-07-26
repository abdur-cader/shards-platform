import ShardComponent from "@/components/Shard-component";
import { supabase } from "@/lib/supabase"; 
import { auth } from "@/auth";
import Link from "next/link";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: username } = await params;
    const session = await auth();

    
    console.log("username:",username)
    const userJson = await fetch(
        `${process.env.NEXTAUTH_URL}/api/user?username=${username}`,
        {
            headers: {
                "sb-access-token": session?.supabaseAccessToken ?? "",
                "session-id": session?.user.id ?? "",
                "purpose": "view",
                "single": "true",
            },
            cache: "no-store",
        }
    )

    
    if (!userJson.ok) {
        const errorJson = await userJson.json();
        console.error("Failed to fetch user:", errorJson.error);
        return <div className="min-h-screen flex items-center justify-center min-w-screen font-prompt text-2xl">We couldn't find this user :(</div>;
    }
    const user = await userJson.json();

    

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
    
    if (!shardRes.ok) {
        console.error("Failed to fetch shards:", shardsJson.error)
    }

    const shards = shardsJson.shards;
    console.log("session?.user.id:", session?.user.id);
    console.log("user.id:", user.userid);

    console.log("ID: ", user.id)

    return(
        <div className="flex h-screen min-w-screen max-w-screen-xl mx-auto ">
        {/* LEFT: profile info */}
        <aside className="w-72  border-r border-gray-300 p-6 flex flex-col items-center sticky top-0 h-screen">
            <img
            src={user.image ?? "/default-avatar.png"}
            alt="avatar"
            className="w-32 h-32 rounded-full mb-4 object-cover"
            />
            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
            <span className="inline-block px-2 py-1 text-xs font-mono font-medium text-emerald-400 bg-emerald-400/10 rounded-md">
                @{user.username}
            </span>
            <p className="text-gray-600 text-center mb-4">{user.bio}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
            {/* example tags */}
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">#nextjs</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">#supabase</span>
            </div>

            {session?.user?.id === user.id && (
            <Link
                href="/users/edit"
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Edit Profile
            </Link>
            )}
        </aside>

        {/* MIDDLE: shards list */}
        
        <section className="flex-1 overflow-y-auto p-6 space-y-6 ">
            <div className="max-w-6xl mx-auto">
                {shards?.length ? (
                <div className="columns-1 sm:columns-3  gap-6 p-6">
                    {shards.map((shard: any) => (
                    <ShardComponent
                        key={shard.slug}
                        slug={shard.slug}
                        title={shard.title}
                        description={shard.desc}
                        image={shard.image_url?.[0]}
                        lineClamp={true}
                        username={user.username}
                        className="mb-6"
                    />
                    ))}
                </div>
                ) : (
                <p className="text-center text-gray-500">No shards to display</p>
                )}
            </div>
        </section>


        {/* RIGHT: recent activity */}
        <aside className="w-72 border-l border-gray-300 p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {/* TODO: replace this with real recent activity */}
            {[...Array(15)].map((_, i) => (
            <div key={i} className="mb-3 p-2 border rounded hover:bg-emerald-900 transition cursor-pointer">
                <p className="text-sm">
                <strong>{user.username}</strong> posted shard #{i + 1}
                </p>
                <p className="text-xs text-gray-500">just now</p>
            </div>
            ))}
        </aside>
        </div>
  );
}