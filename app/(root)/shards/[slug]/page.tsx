import Dock from "@/components/Dock";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";


interface Props {
    params: Promise<{ slug: string}>;
}

export default async function ShardDetailPage({ params }: Props) {
    const { slug } = await params;
    const session = await auth();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }

    if (session?.supabaseAccessToken) {
        headers["sb-access-token"] = session?.supabaseAccessToken;
    } 

    const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/shards/${slug}`,
        { 
            method: "GET",
            headers,
         },
    )
    const json = await res.json();

    if (!res.ok || !json.shard) {
        notFound();
    }

    const shard = json.shard;
    const userId = json.userId;
    console.log("userId:", userId)
    console.log("shard.user_id:", shard.user_id)
    const isOwner = session?.user?.id === shard.user_id;


    return (
        <main className="max-w-3xl mx-auto p-6 pb-24">
            <h1 className="text-3xl font-bold mb-4">{shard.title}</h1>
            <p className="text-gray-700 mb-4">{shard.desc}</p>

            {shard.image_url && shard.image_url.length > 0 && (
                <img
                    src={shard.image_url[0]}
                    alt="Shard preview"
                    className="w-full rounded-lg mb-6"
                />
            )}

            <a
                href={shard.github_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                View GitHub Repository →
            </a>
            <Link href={`/users/${shard.users.username}`} className="hover:underline cursor:pointer hover:text-blue-500">
                by {shard.users.name}
            </Link>
            {isOwner && (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <Dock slug={slug}/>
                </div>
            )}
        </main>
    );
}
