import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const token = req.headers.get("sb-access-token");
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
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
    // Get the shard to check ownership
    const { data: shard, error } = await supabase
      .from("shards")
      .select("user_id")
      .eq("slug", params.slug.trim())
      .single();

    if (error || !shard) {
      return NextResponse.json(
        { error: error?.message || "Shard not found" },
        { status: 404 }
      );
    }

    // Verify ownership
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