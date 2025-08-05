"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface LikeButtonProps {
  shardId: string;
  userId?: string;
  initialLiked: boolean;
  initialLikeCount: number;
}

export function LikeButton({
  shardId,
  userId,
  initialLiked,
  initialLikeCount,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const handleLike = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", userId)
          .eq("shard_id", shardId);

        if (!error) {
          setIsLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      } else {
        // Like
        const { error } = await supabase
          .from("likes")
          .insert([{ user_id: userId, shard_id: shardId }]);

        if (!error) {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconBtnBase = `
    rounded-full
    bg-gradient-to-r from-zinc-800 to-zinc-700
    border border-gray-600
    text-zinc-100
    shadow-md
    relative overflow-hidden
    transition-all duration-300 ease-in-out
    group
  `;

  if (!userId) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-not-allowed">
            <Button
              variant="ghost"
              size="icon"
              className={`${iconBtnBase} hover:scale-110 hover:from-lime-800 hover:to-lime-700 hover:border-lime-500`}
              disabled
            >
              <Icons.heart className="h-5 w-5 relative z-10" />
              <span
                className="absolute inset-0 w-[200%]
                  bg-gradient-to-r from-transparent
                  via-[rgba(190,242,100,0.2)] to-transparent
                  -translate-x-full group-hover:translate-x-0
                  transition-transform duration-500 ease-in-out"
              />
            </Button>
            <span className="text-sm text-zinc-400">{likeCount}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign in to interact with this Shard</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={`
          ${iconBtnBase}
          ${
            isLiked
              ? `
            [&_.icon-fill]:fill-lime-400 [&_.icon-fill]:text-lime-400
            hover:[&_.icon-fill]:fill-white hover:[&_.icon-fill]:text-white
            hover:scale-110 hover:cursor-pointer hover:from-lime-800 hover:to-lime-700 border-lime-500
          `
              : `
            hover:scale-110 hover:cursor-pointer hover:from-lime-800 hover:to-lime-700 hover:border-lime-500
          `
          }
        `}
        onClick={handleLike}
        disabled={isLoading}
      >
        <Icons.heart className="h-5 w-5 relative z-10 icon-fill" />
        <span
          className="absolute inset-0 w-[200%]
            bg-gradient-to-r from-transparent
            via-[rgba(190,242,100,0.2)] to-transparent
            -translate-x-full group-hover:translate-x-0
            transition-transform duration-500 ease-in-out"
        />
      </Button>
      <span className="text-sm text-zinc-400">{likeCount}</span>
    </div>
  );
}
