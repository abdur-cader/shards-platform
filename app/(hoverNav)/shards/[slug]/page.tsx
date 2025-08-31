import Dock from "@/components/Dock";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ShardContent from "@/components/ShardContent";
import { Icons } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import { LikeButton } from "@/components/LikeButton";
import { SaveButton } from "@/components/SaveButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ShardDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (session?.supabaseAccessToken) {
    headers["sb-access-token"] = session?.supabaseAccessToken;
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/shards/${slug}`, {
    method: "GET",
    headers,
  });
  const json = await res.json();

  if (!res.ok || !json.shard) {
    notFound();
  }

  const shard = json.shard;
  const isOwner = session?.user?.id === shard.user_id;

  // Fetch like information
  let initialLiked = false;
  let initialLikeCount = 0;

  if (session?.user?.id) {
    // Check if current user has liked this shard
    const { data: likeData } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("shard_id", shard.id)
      .maybeSingle();

    initialLiked = !!likeData;
  }

  // Get total like count
  const { count: likeCount } = await supabase
    .from("likes")
    .select("*", { count: "exact" })
    .eq("shard_id", shard.id);

  initialLikeCount = likeCount || 0;

  let initialSaved = false;
  let initialSaveCount = 0;

  if (session?.user?.id) {
    // Check if current user has saved this shard
    const { data: saveData } = await supabase
      .from("saves")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("shard_id", shard.id)
      .maybeSingle();

    initialSaved = !!saveData;
  }

  // Get total save count
  const { count: saveCount } = await supabase
    .from("saves")
    .select("*", { count: "exact" })
    .eq("shard_id", shard.id);

  initialSaveCount = saveCount || 0;

  const iconBtnBase = `
    rounded-full
    bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700
    border border-gray-300 dark:border-gray-600
    text-zinc-800 dark:text-zinc-100
    shadow-md
    relative overflow-hidden
    transition-all duration-300 ease-in-out
    hover:scale-110
    hover:from-lime-200 hover:to-lime-300 dark:hover:from-lime-800 dark:hover:to-lime-700
    hover:border-lime-400 dark:hover:border-lime-500
    group
  `;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br py-50 from-zinc-50 via-zinc-100 to-zinc-50 dark:from-[#050505] dark:via-[#0a0a0a] dark:to-[#050505]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(180deg,white,transparent_90%)] opacity-10 dark:opacity-10" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-lime-500/20 rounded-full blur-3xl dark:bg-lime-500/10" />
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-lime-500/20 rounded-full blur-3xl dark:bg-lime-500/10" />
      </div>

      {/* Main container with adjusted spacing */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8 lg:gap-24 relative z-10">
        {/* Left content - unchanged position */}
        <div className="flex-1 space-y-8">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-lime-600 to-lime-700 dark:from-lime-200 dark:to-lime-400">
                {shard.title}
              </h1>
              {isOwner && (
                <Badge
                  variant="outline"
                  className="border-lime-500/50 text-lime-600 font-prompt bg-lime-200/80 font-[350] dark:border-lime-500/30 dark:text-lime-400 dark:bg-lime-800/30"
                >
                  Your Shard
                </Badge>
              )}
            </div>

            <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl">{shard.desc}</p>

            <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Icons.calendar className="h-4 w-4" />
                {formatDate(shard.created_at)}
              </span>
              {shard.updated_at && (
                <span className="flex items-center gap-1.5">
                  <Icons.edit className="h-4 w-4" />
                  Updated {formatDate(shard.updated_at)}
                </span>
              )}
            </div>
          </div>

          {/* Project Images */}
          {shard.image_url && shard.image_url.length > 0 && (
            <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 overflow-hidden bg-gradient-to-br from-zinc-100/50 to-zinc-200/30 dark:from-zinc-900/50 dark:to-zinc-800/20 max-w-4xl shadow-lg shadow-black/10 dark:shadow-black/50">
              <Carousel className="w-full">
                <CarouselContent>
                  {shard.image_url.map((url: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video">
                        <Image
                          src={url}
                          alt={`Project preview ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-100/60 via-transparent to-transparent dark:from-zinc-900/60" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {shard.image_url.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 bg-zinc-100/80 hover:bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
                    <CarouselNext className="right-4 bg-zinc-100/80 hover:bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
                  </>
                )}
              </Carousel>
            </div>
          )}

          {/* Content with animated border */}
          <div className="relative rounded-lg border border-neutral-300 dark:border-neutral-700 bg-zinc-100/50 dark:bg-zinc-800/50 p-6">
            <ShardContent
              initialMarkdown={shard.content || ""}
              slug={shard.slug}
            />
          </div>
        </div>

        {/* Sidebar - pushed further right */}
        <aside className="lg:w-[22rem] xl:w-[24rem] lg:ml-12 sticky top-28 h-fit space-y-8">
          <div className="space-y-8">
            {/* Project Actions Card */}
            <div className="bg-gradient-to-br from-zinc-100/80 to-zinc-200/60 dark:from-zinc-900/80 dark:to-zinc-800/50 rounded-xl border border-zinc-300 dark:border-zinc-800 p-6 space-y-6 shadow-lg shadow-black/10 dark:shadow-black/30">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">
                  {shard.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{shard.desc}</p>
              </div>

              {shard.github_repo && (
                <Button
                  asChild
                  className="w-full relative overflow-hidden rounded-lg 
                    border border-gray-300 dark:border-gray-600
                    bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 
                    text-zinc-800 dark:text-zinc-100 shadow-md 
                    transition-all duration-300 ease-in-out
                    hover:scale-105 
                    hover:from-lime-200 hover:to-lime-300 dark:hover:from-lime-800 dark:hover:to-lime-700
                    hover:border-lime-400 dark:hover:border-lime-500
                    group"
                >
                  <a
                    href={shard.github_repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2 relative z-10 flex items-center justify-center py-2"
                  >
                    <GithubIcon className="h-5 w-5" />
                    <span>View Repository</span>
                    <span
                      className="absolute inset-0 w-[200%]
                        bg-gradient-to-r from-transparent
                        via-[rgba(190,242,100,0.3)] to-transparent
                        -translate-x-full group-hover:translate-x-0
                        transition-transform duration-500 ease-in-out"
                    />
                  </a>
                </Button>
              )}

              <div className="flex items-center gap-4">
                <LikeButton
                  shardId={shard.id}
                  userId={session?.user?.id}
                  initialLiked={initialLiked}
                  initialLikeCount={initialLikeCount}
                />

                <SaveButton
                  shardId={shard.id}
                  userId={session?.user?.id}
                  initialSaved={initialSaved}
                  initialSaveCount={initialSaveCount}
                />

                <div className="h-8 w-px bg-gradient-to-b from-transparent via-zinc-400 dark:via-zinc-500 to-transparent" />

                <Button
                  variant="ghost"
                  size="icon"
                  className={`${iconBtnBase} cursor-pointer`}
                >
                  <Icons.share2 className="h-5 w-5 relative z-10" />
                  <span
                    className="absolute inset-0 w-[200%]
                      bg-gradient-to-r from-transparent
                      via-[rgba(190,242,100,0.3)] to-transparent
                      -translate-x-full group-hover:translate-x-0
                      transition-transform duration-500 ease-in-out"
                  />
                </Button>
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-gradient-to-br from-zinc-100/80 to-zinc-200/60 dark:from-zinc-900/80 dark:to-zinc-800/50 rounded-xl border border-zinc-300 dark:border-zinc-800 p-6 space-y-4 shadow-lg shadow-black/10 dark:shadow-black/30">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Created by
              </h3>
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Link href={`/user/${shard.users.username}`}>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <Avatar className="h-12 w-12 border-2 border-zinc-300 dark:border-zinc-600">
                        <AvatarImage src={shard.users.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-zinc-300/50 to-zinc-400/40 dark:from-zinc-500/20 dark:to-zinc-600/20">
                          {shard.users.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-zinc-800 group-hover:text-lime-600 dark:text-white dark:group-hover:text-lime-300 transition-colors">
                          {shard.users.name}
                        </p>
                        <p className="text-sm text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300">
                          @{shard.users.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-full bg-gradient-to-br from-zinc-100 via-zinc-200/80 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800/80 dark:to-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-xl rounded-xl backdrop-blur-sm"
                  side="left"
                >
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-14 w-14 border-2 border-zinc-300 dark:border-zinc-600">
                      <AvatarImage src={shard.users.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-zinc-300/50 to-zinc-400/40 dark:from-zinc-500/20 dark:to-zinc-600/20">
                        {shard.users.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-white">
                        {shard.users.name}
                      </h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        @{shard.users.username}
                      </p>
                      {shard.users.bio && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 pt-2">
                          {shard.users.bio}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 bg-zinc-200/50 border-zinc-300 hover:bg-zinc-300/50 text-zinc-700 dark:bg-zinc-800/50 dark:border-zinc-700 dark:hover:bg-zinc-700/50 dark:text-zinc-200"
                        asChild
                      >
                        <Link href={`/user/${shard.users.username}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </aside>
      </div>

      {/* Owner Dock */}
      {isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Dock slug={slug} />
        </div>
      )}
    </div>
  );
}