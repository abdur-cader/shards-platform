import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  const token = req.headers.get("sb-access-token");

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
    // Get activities from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Get user creation date if within 30 days
    const { data: userData } = await supabase
      .from('users')
      .select('created_at')
      .eq('id', userId)
      .single();


    // 2. Get created shards
    const { data: createdShards } = await supabase
      .from('shards')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    const createdActivities = createdShards?.map(shard => ({
      id: `created-${shard.id}`,
      type: 'created',
      shard_title: shard.title,
      created_at: shard.created_at
    })) || [];

    // 3. Get updated shards
    const { data: updatedShards } = await supabase
      .from('shards')
      .select('id, title, updated_at')
      .eq('user_id', userId)
      .gte('updated_at', thirtyDaysAgo.toISOString())
      .not('updated_at', 'is', null)
      .order('updated_at', { ascending: false });

    const updatedActivities = updatedShards?.map(shard => ({
      id: `updated-${shard.id}`,
      type: 'updated',
      shard_title: shard.title,
      created_at: shard.updated_at
    })) || [];

    // 4. Get liked shards
    const { data: likedShards } = await supabase
        .from('likes')
        .select('id, shards(title), created_at')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

    const likedActivities = likedShards?.map(like => ({
        id: `liked-${like.id}`,
        type: 'liked',
        shard_title: like.shards[0]?.title!,
        created_at: like.created_at
        })) || [];

        // 5. Get saved shards
    const { data: savedShards } = await supabase
        .from('saves')
        .select('id, shards(title), created_at')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

    const savedActivities = savedShards?.map(save => ({
        id: `saved-${save.id}`,
        type: 'saved',
        shard_title: save.shards[0]?.title!,
        created_at: save.created_at
        })) || [];

    const allActivities = [
      ...createdActivities,
      ...updatedActivities,
      ...likedActivities,
      ...savedActivities
    ].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(allActivities);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}