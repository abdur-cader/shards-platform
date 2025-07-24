import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {

    console.log("NEW")
    const token = req.headers.get("sb-access-token");

    const supabase = token ?
        createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        ) :
        createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

    const slug = params.slug;

    const { data: shard, error } = await supabase
        .from("shards")
        .select("*, users(name, username)")
        .eq("slug", slug.trim())
        .single();

    if (error || !shard) {
        return NextResponse.json({ error: error?.message || "Not Found" }, { status: 404 });

    }

    return NextResponse.json({ shard });
}