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

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/shards/${slug}`,
    { 
      method: "GET",
      headers,
    },
  );
  const json = await res.json();

  if (!res.ok || !json.shard) {
    notFound();
  }

  const shard = json.shard;
  const isOwner = session?.user?.id === shard.user_id;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[160px] pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4">
        {/* Project Title */}
        <h1 className="text-3xl font-bold tracking-tight">{shard.title}</h1>
        
        {/* Project Description */}
        <p className="text-muted-foreground">{shard.desc}</p>
        
        {/* Project Images - Compact Size */}
        {shard.image_url && shard.image_url.length > 0 && (
          <div className="rounded-lg border overflow-hidden bg-muted max-w-2xl">
            <Carousel className="w-full">
              <CarouselContent>
                {shard.image_url.map((url: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video">
                      <Image
                        src={url}
                        alt={`Project preview ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {shard.image_url.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="sticky top-24 space-y-6 bg-gradient-to-b from-emerald-500/5 to-purple-500/5 rounded-lg overflow-hidden">
          {/* Project Info Card */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">{shard.title}</h2>
            <p className="text-sm text-muted-foreground">{shard.desc}</p>
            
            {/* GitHub Link */}
            {shard.github_repo && (
              <Button asChild variant="outline" className="w-full gap-2">
                <a
                  href={shard.github_repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            )}

            {/* Author Info */}
            <div className="pt-4 border-t ">
              <h3 className="text-sm font-medium mb-2">Created by</h3>
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Link href={`/users/${shard.users.username}`}>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={shard.users.image || undefined} />
                        <AvatarFallback>
                          {shard.users.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium group-hover:text-primary hover:underline transition-colors">
                          {shard.users.name}
                        </p>
                        <p className="text-sm text-muted-foreground hover:underline">
                          @{shard.users.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-full bg-gradient-to-br from-zinc-900 via-zinc-500/10 to-zinc-900 border border-zinc-700 shadow-lg rounded-xl">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={shard.users.image || undefined} />
                      <AvatarFallback>
                        {shard.users.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{shard.users.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        @{shard.users.username}
                      </p>
                      {shard.users.bio && (
                        <p className="text-sm pt-2">
                          {shard.users.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>

          {/* Tags */}
          {shard.tags && shard.tags.length > 0 && (
            <div className="border rounded-lg p-6">
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {shard.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Owner Dock */}
      {isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Dock slug={slug} />
        </div>
      )}
    </div>
  );
}