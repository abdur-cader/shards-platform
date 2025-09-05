import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
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

    const slug = (await params).slug;

    const { data: shard, error } = await supabase
        .from("shards")
        .select("*, users(*)")
        .eq("slug", slug.trim())
        .single();

    if (error || !shard) {
        return NextResponse.json({ error: error?.message || "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ shard });
};

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> } // Changed to Promise
) {
    const token = req.headers.get("sb-access-token")

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
        );

    try {
        const body = await req.json();
        const { content } = body;
        
        // Await the params to get the slug
        const slug = (await params).slug;

        const { data, error } = await supabase
            .from("shards")
            .update({ content })
            .eq("slug", slug.trim()) // Use the awaited slug
            .single();

        if (error) throw error;

        return NextResponse.json({ ok:true, shard: data });
    } catch ( err: any ) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}