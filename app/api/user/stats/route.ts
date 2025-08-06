import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const supabaseAccessToken = request.headers.get("Authorization")?.split(" ")[1];

  if (!userId || !supabaseAccessToken) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );

  // Get total shards count
  const { count: totalShards } = await supabase
    .from("shards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get total likes count
  const { count: totalLikes } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get total saves count
  const { count: totalSaves } = await supabase
    .from("saves")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return NextResponse.json({
    total_shards: totalShards || 0,
    total_likes: totalLikes || 0,
    total_saves: totalSaves || 0,
  });
}