"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Bolt,
  Calendar,
  Code,
  Edit,
  Heart,
  Plus,
  Save,
  Sparkles,
  TrendingUp,
  Bookmark,
  ExternalLink,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SavedShardsDrawer from "@/components/SavedShardsDrawer";

interface DashboardClientProps {
  userData: {
    id: string;
    name: string;
    email: string;
    image: string;
    username: string;
    bio: string | null;
    ai_credits: number;
    created_at: string;
  };
  userStats: {
    total_shards: number;
    total_likes: number;
    total_saves: number;
  };
  userShards: {
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
  }[];
  chartData: {
    date: string;
    likes: number;
    saves: number;
    views: number;
  }[];
  activities: {
    id: string;
    type: "created" | "liked" | "saved" | "updated" | "joined";
    created_at: string;
    shard_title?: string;
  }[];
  savedShards: {
    id: string;
    saved_at: string;
    shard: {
      id: string;
      title: string;
      desc: string | null;
      slug: string;
      github_repo: string | null;
      created_at: string;
      image_url: string | null;
      is_visible: boolean;
      user_id: string;
      content: string | null;
      updated_at: string;
      user: {
        username: string;
        name: string;
        image: string;
      };
    };
  }[];
}

export function DashboardClient({
  userData,
  userStats,
  userShards,
  chartData,
  activities,
  savedShards,
}: DashboardClientProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-zinc-950 to-zinc-900 overflow-hidden">
      {/* Scrollable content */}
      <div
        className="container min-h-screen mx-auto px-4 py-16 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 64px)" }}
      >
        <div className="flex justify-between items-center pb-8">
          <h1 className="text-3xl md-text-4xl font-[500] font-prompt bg-clip-text text-zinc-200">
            Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-lime-400/50">
                <AvatarImage src={userData.image} alt={userData.name} />
                <AvatarFallback className="bg-lime-400/10 text-lime-400">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-white">{userData.name}</CardTitle>
                <CardDescription className="text-zinc-400">
                  @{userData.username}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4 text-sm">
                {userData.bio || "No bio yet"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge
                variant="outline"
                className="text-zinc-400 border-zinc-700"
              >
                Joined {format(new Date(userData.created_at), "MMM d, yyyy")}
              </Badge>
              <Badge className="bg-lime-400/10 text-lime-400 hover:bg-lime-400/20 transition-all">
                <Bolt className="h-3 w-3 mr-1" />
                {userData.ai_credits} AI Credits
              </Badge>
            </CardFooter>
          </Card>

          {/* Quick Overview Cards - Replacing the repetitive cards */}
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">
                Shards
              </CardDescription>
              <CardTitle className="text-3xl text-white">
                {userStats.total_shards}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-zinc-500 flex items-center"></div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400">
                Engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between pt-0">
              <div>
                <p className="text-sm text-zinc-400">Likes</p>
                <p className="text-2xl font-bold text-white">
                  {userStats.total_likes}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Saves</p>
                <p className="text-2xl font-bold text-white">
                  {userStats.total_saves}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Shards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity Card */}
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar size={20} className="text-lime-400" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Your last 5 activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-800/90 transition-colors border border-zinc-700/50 hover:border-lime-500/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {activity.type === "created" && (
                            <div className="p-2 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                              <Sparkles size={16} />
                            </div>
                          )}
                          {activity.type === "liked" && (
                            <div className="p-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <Heart size={16} />
                            </div>
                          )}
                          {activity.type === "saved" && (
                            <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Save size={16} />
                            </div>
                          )}
                          {activity.type === "updated" && (
                            <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                              <Edit size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-200">
                            {activity.type === "created" && (
                              <span>
                                Created{" "}
                                <strong className="text-lime-300">
                                  {activity.shard_title}
                                </strong>
                              </span>
                            )}
                            {activity.type === "liked" && (
                              <span>
                                Liked{" "}
                                <strong className="text-lime-300">
                                  {activity.shard_title}
                                </strong>
                              </span>
                            )}
                            {activity.type === "saved" && (
                              <span>
                                Saved{" "}
                                <strong className="text-lime-300">
                                  {activity.shard_title}
                                </strong>
                              </span>
                            )}
                            {activity.type === "updated" && (
                              <span>
                                Updated{" "}
                                <strong className="text-lime-300">
                                  {activity.shard_title}
                                </strong>
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {formatDistanceToNow(
                              new Date(activity.created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-8 bg-zinc-800/70 rounded-xl border border-dashed border-zinc-700/50">
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Shards Card */}
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bookmark size={20} className="text-lime-400" />
                    Saved Shards
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your recently saved Shards
                  </CardDescription>
                </div>
                {savedShards.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-lime-400 hover:text-lime-300 hover:bg-lime-400/10"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    View All →
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {savedShards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                  {savedShards.slice(0, 3).map((savedShard) => (
                    <div
                      key={savedShard.id}
                      className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 hover:border-lime-500/30 transition-colors group h-full flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-white group-hover:text-lime-400 transition-colors line-clamp-1">
                          {savedShard.shard.title}
                        </h3>
                        <span className="text-xs text-zinc-500">
                          {format(new Date(savedShard.saved_at), "MMM d")}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={savedShard.shard.user.image}
                            alt={savedShard.shard.user.name}
                          />
                          <AvatarFallback className="text-xs">
                            {savedShard.shard.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-zinc-400">
                          @{savedShard.shard.user.username}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-400 mb-4 line-clamp-2 flex-grow">
                        {savedShard.shard.desc || "No description provided"}
                      </p>

                      <Link
                        href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/shards/${savedShard.shard.slug}`}
                        target="_blank"
                        className="inline-flex items-center text-xs text-lime-400 hover:text-lime-300 transition-colors mt-auto"
                      >
                        View Shard <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-zinc-800/70 rounded-xl border border-dashed border-zinc-700/50">
                  <Bookmark className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500">No shards saved yet</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Save interesting shards to find them here later
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Stats Cards */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm lg:col-span-2 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Quick Overview</CardTitle>
            <CardDescription className="text-zinc-400">
              Your shards at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shards Card */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/80 p-5 rounded-xl border border-zinc-700/50 hover:border-lime-500/30 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-lime-500/10 group-hover:bg-lime-500/20 transition-colors">
                    <Code className="h-5 w-5 text-lime-400" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-lime-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {userStats.total_shards}
                </h3>
                <p className="text-sm text-zinc-400">Total Shards</p>
              </div>

              {/* Likes Card */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/80 p-5 rounded-xl border border-zinc-700/50 hover:border-rose-500/30 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                    <Heart className="h-5 w-5 text-rose-400" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-rose-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {userStats.total_likes}
                </h3>
                <p className="text-sm text-zinc-400">Total Likes</p>
              </div>

              {/* Saves Card */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/80 p-5 rounded-xl border border-zinc-700/50 hover:border-blue-500/30 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Save className="h-5 w-5 text-blue-400" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {userStats.total_saves}
                </h3>
                <p className="text-sm text-zinc-400">Total Saves</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="shards" className="w-full">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm sticky top-0 z-10">
            <TabsTrigger
              value="shards"
              className="data-[state=active]:bg-lime-400/10 data-[state=active]:text-lime-400 data-[state=active]:border-lime-400/30 data-[state=active]:border"
            >
              My Shards
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-lime-400/10 data-[state=active]:text-lime-400 data-[state=active]:border-lime-400/30 data-[state=active]:border"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shards" className="mt-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Recent Shards</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Your latest code snippets and projects
                    </CardDescription>
                  </div>
                  <Link
                    href="/shards/create"
                    className="
            flex items-center
            px-3 py-2
            text-sm font-medium
            rounded-lg
            border border-lime-400/50 
            text-lime-400
            hover:bg-lime-400/10 
            hover:text-lime-300
            transition-colors duration-200
            shadow-[0_0_15px_-5px_rgba(163,230,53,0.3)]
          "
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Shard
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                  <Table>
                    <TableHeader className="sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-zinc-400">Title</TableHead>
                        <TableHead className="text-zinc-400">Created</TableHead>
                        <TableHead className="text-zinc-400">
                          Visibility
                        </TableHead>
                        <TableHead className="text-zinc-400">
                          <Icons.heart className="h-4 w-4 inline mr-1" />
                          Likes
                        </TableHead>
                        <TableHead className="text-zinc-400">
                          <Icons.bookmark className="h-4 w-4 inline mr-1" />
                          Saves
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userShards.map((shard) => (
                        <TableRow
                          key={shard.id}
                          className="border-zinc-800 hover:bg-zinc-800/50"
                        >
                          <TableCell className="font-medium text-white group">
                            <div className="flex items-center space-x-3 py-2">
                              <span className="group-hover:text-lime-400 transition-colors">
                                {shard.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-400">
                            {format(new Date(shard.created_at), "MMM d")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={shard.is_visible ? "default" : "outline"}
                              className={
                                shard.is_visible
                                  ? "bg-lime-400/10 text-lime-400 border-lime-400/30"
                                  : "border-zinc-700"
                              }
                            >
                              {shard.is_visible ? "Public" : "Private"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-zinc-400">
                            {shard.likes_count}
                          </TableCell>
                          <TableCell className="text-zinc-400">
                            {shard.saves_count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">
                    Engagement Analytics
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    <span className="text-rose-500">Likes</span>,{" "}
                    <span className="text-blue-500">saves</span>, and{" "}
                    <span className="text-lime-500">views</span> on your shards
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorLikes"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorSaves"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorViews"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#84cc16"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#84cc16"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3f3f46"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#71717a"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          format(new Date(value), "MMM d")
                        }
                      />
                      <YAxis
                        allowDecimals={false}
                        stroke="#71717a"
                        domain={["dataMin", "dataMax"]}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          borderColor: "#3f3f46",
                          borderRadius: "0.5rem",
                        }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(value, name) => [
                          value,
                          name === "likes"
                            ? "Likes"
                            : name === "saves"
                            ? "Saves"
                            : "Views",
                        ]}
                        labelFormatter={(label) =>
                          `Date: ${format(new Date(label), "MMM d, yyyy")}`
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="likes"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorLikes)"
                        name="likes"
                      />
                      <Area
                        type="monotone"
                        dataKey="saves"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSaves)"
                        name="saves"
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#84cc16"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        name="views"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div
                className="space-y-6 overflow-y-auto"
                style={{ maxHeight: "500px" }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Top Shards</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Your most engaged content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {userShards
                        .sort((a, b) => b.likes_count - a.likes_count)
                        .slice(0, 3)
                        .map((shard) => (
                          <div
                            key={shard.id}
                            className="flex items-start space-x-3"
                          >
                            <div className="bg-zinc-800 rounded-md p-2 flex-shrink-0">
                              <Code className="h-5 w-5 text-lime-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">
                                {shard.title}
                              </h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center text-sm text-zinc-400">
                                  <Icons.heart className="h-3 w-3 mr-1 text-rose-500" />
                                  {shard.likes_count} likes
                                </div>
                                <div className="flex items-center text-sm text-zinc-400">
                                  <Icons.bookmark className="h-3 w-3 mr-1 text-blue-500" />
                                  {shard.saves_count} saves
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <SavedShardsDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          savedShards={savedShards}
        />
      </div>
    </div>
  );
}
