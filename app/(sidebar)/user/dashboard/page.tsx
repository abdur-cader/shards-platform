import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

async function fetchUserData(
  userId: string,
  supabaseAccessToken: string
): Promise<UserData> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
    headers: {
      "session-id": userId,
      "sb-access-token": supabaseAccessToken,
      purpose: "edit",
      single: "true",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch user data");
  return response.json();
}

async function fetchUserStats(
  userId: string,
  supabaseAccessToken: string
): Promise<StatsData> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/stats?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch user stats");
  return response.json();
}

async function fetchUserShards(
  userId: string,
  supabaseAccessToken: string
): Promise<ShardData[]> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/shards?user_id=${userId}`,
    {
      headers: {
        "session-id": userId,
        "sb-access-token": supabaseAccessToken,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user shards");
  }

  const result = await response.json();
  return result.shards || [];
}

async function fetchChartData(
  userId: string,
  supabaseAccessToken: string
): Promise<ChartData[]> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/analytics?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch chart data");
  return response.json();
}

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  bio: string | null;
  ai_credits: number;
  created_at: string;
}

interface StatsData {
  total_shards: number;
  total_likes: number;
  total_saves: number;
}

interface ShardData {
  id: string;
  user_id: string;
  title: string;
  desc: string | null;
  slug: string;
  created_at: string;
  github_repo: string | null;
  image_url: string | null;
  is_visible: boolean;
  user_github_id: string | null;
  content: string | null;
  updated_at: string;
  likes_count: number;
  saves_count: number;
}

interface ChartData {
  date: string;
  likes: number;
  saves: number;
}

async function fetchUserActivities(
  userId: string,
  supabaseAccessToken: string
): Promise<ActivityData[]> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/user/activity?user_id=${userId}`,
    {
      headers: {
        "session-id": userId,
        "sb-access-token": supabaseAccessToken,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user activities");
  }

  return response.json();
}

interface ActivityData {
  id: string;
  type: "created" | "liked" | "saved" | "updated" | "joined";
  created_at: string;
  shard_title?: string;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const [userData, userStats, userShards, chartData, activities] =
    await Promise.all([
      fetchUserData(session.user.id, session.supabaseAccessToken || ""),
      fetchUserStats(session.user.id, session.supabaseAccessToken || ""),
      fetchUserShards(session.user.id, session.supabaseAccessToken || ""),
      fetchChartData(session.user.id, session.supabaseAccessToken || ""),
      fetchUserActivities(session.user.id, session.supabaseAccessToken || ""),
    ]);

  return (
    <DashboardClient
      userData={userData}
      userStats={userStats}
      userShards={userShards}
      chartData={chartData}
      activities={activities}
    />
  );
}
