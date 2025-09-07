import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get the last 30 days of data for received engagement
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString();

    // Get all user's shards first
    const { data: userShards, error: shardsError } = await supabase
      .from("shards")
      .select("id")
      .eq("user_id", userId);

    if (shardsError) {
      console.error("Error fetching user shards:", shardsError);
      return NextResponse.json({ error: "Failed to fetch user shards" }, { status: 500 });
    }

    if (!userShards || userShards.length === 0) {
      // Return empty data for users with no shards
      return NextResponse.json(generateEmptyChartData());
    }

    const shardIds = userShards.map(shard => shard.id);

    // Get received likes in the last 30 days
    const { data: likesData, error: likesError } = await supabase
      .from("likes")
      .select("created_at")
      .in("shard_id", shardIds)
      .gt("created_at", dateString);

    if (likesError) {
      console.error("Error fetching likes:", likesError);
      return NextResponse.json({ error: "Failed to fetch likes data" }, { status: 500 });
    }

    // Get received saves in the last 30 days
    const { data: savesData, error: savesError } = await supabase
      .from("saves")
      .select("created_at")
      .in("shard_id", shardIds)
      .gt("created_at", dateString);

    if (savesError) {
      console.error("Error fetching saves:", savesError);
      return NextResponse.json({ error: "Failed to fetch saves data" }, { status: 500 });
    }

    // Get received views in the last 30 days
    const { data: viewsData, error: viewsError } = await supabase
      .from("views")
      .select("created_at")
      .in("shard_id", shardIds)
      .gt("created_at", dateString);

    if (viewsError) {
      console.error("Error fetching views:", viewsError);
      return NextResponse.json({ error: "Failed to fetch views data" }, { status: 500 });
    }

    // Process the data into daily totals
    const dailyData: { [key: string]: { likes: number; saves: number; views: number } } = {};

    // Process likes
    likesData?.forEach((like: any) => {
      const date = like.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { likes: 0, saves: 0, views: 0 };
      }
      dailyData[date].likes += 1;
    });

    // Process saves
    savesData?.forEach((save: any) => {
      const date = save.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { likes: 0, saves: 0, views: 0 };
      }
      dailyData[date].saves += 1;
    });

    // Process views
    viewsData?.forEach((view: any) => {
      const date = view.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { likes: 0, saves: 0, views: 0 };
      }
      dailyData[date].views += 1;
    });

    // Convert to array format and fill missing dates
    const result = [];
    const currentDate = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      result.push({
        date: dateStr,
        likes: dailyData[dateStr]?.likes || 0,
        saves: dailyData[dateStr]?.saves || 0,
        views: dailyData[dateStr]?.views || 0
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in analytics API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateEmptyChartData() {
  const result = [];
  const currentDate = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    result.push({
      date: dateStr,
      likes: 0,
      saves: 0,
      views: 0
    });
  }
  
  return result;
}