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

    return (
        <div>
            <h1>{user.username}</h1>
            <img src={user.avatar_url} alt="avatar" />
            <div className="grid">
                {shards?.map((shard: any) => (
                    <ShardComponent
                        key={shard.slug}
                        slug={shard.slug}
                        title={shard.title}
                        description={shard.desc}
                        image={shard.image_url?.[0]}
                        lineClamp={true}
                        username={user.username}
                    />
                ))}                
            </div>

            {(session?.user?.id == user.id) && (
                <Link href="/users/edit">Edit profile</Link>
            )}
        </div>
    );
}