import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("sb-access-token");
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const supabase = token
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      )
    : createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

  try {
    // extract slug from URL
    const url = new URL(req.url);
    const slug = url.pathname.split("/")[4]; // /api/shards/[slug]/verify-owner
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const { data: shard, error } = await supabase
      .from("shards")
      .select("user_id")
      .eq("slug", slug.trim())
      .single();

    if (error || !shard) {
      return NextResponse.json(
        { error: error?.message || "Shard not found" },
        { status: 404 }
      );
    }

    const isOwner = shard.user_id === userId;

    return NextResponse.json({ isOwner });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
