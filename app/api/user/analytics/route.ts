import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { format, subDays } from "date-fns";

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

  // Get data for the last 30 days
  const date30DaysAgo = subDays(new Date(), 30).toISOString();

  // Get likes per day
  const { data: likesData } = await supabase
    .from("likes")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", date30DaysAgo);

  // Get saves per day
  const { data: savesData } = await supabase
    .from("saves")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", date30DaysAgo);

  // Group data by day
  const groupedData: Record<string, { likes: number; saves: number }> = {};

  // Initialize all days with 0 values
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    groupedData[date] = { likes: 0, saves: 0 };
  }

  // Count likes per day
  likesData?.forEach((like) => {
    const date = format(new Date(like.created_at), "yyyy-MM-dd");
    if (groupedData[date]) {
      groupedData[date].likes += 1;
    }
  });

  // Count saves per day
  savesData?.forEach((save) => {
    const date = format(new Date(save.created_at), "yyyy-MM-dd");
    if (groupedData[date]) {
      groupedData[date].saves += 1;
    }
  });

  // Convert to array format for Recharts
  const chartData = Object.entries(groupedData).map(([date, counts]) => ({
    date,
    likes: counts.likes,
    saves: counts.saves,
  }));

  return NextResponse.json(chartData);
}