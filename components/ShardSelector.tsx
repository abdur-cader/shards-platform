"use client";
import { useEffect, useState } from "react";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Shard = {
  id: string;
  title: string;
  slug: string;
  likes_count: number;
  saves_count: number;
};

type ShardSelectorProps = {
  userId: string;
  accessToken?: string | null;
};

export default function ShardSelector({ userId, accessToken }: ShardSelectorProps) {
  const [shards, setShards] = useState<Shard[]>([]);
  const [selectedShard, setSelectedShard] = useState<Shard | null>(null);
  type Checked = DropdownMenuCheckboxItemProps["checked"];

  const fetchShards = async () => {
    try {
      const res = await fetch(`/api/user/shards?user_id=${userId}`, {
        headers: {
          "sb-access-token": accessToken ?? "",
          "session-id": userId,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch shards");
      const data = await res.json();
      setShards(data.shards);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId && accessToken) {
      fetchShards();
    }
  }, [userId, accessToken]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-64 justify-between">
          {selectedShard ? selectedShard.slug : "Choose your Shard"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-[#0a0a1a]">
        {shards.length > 0 ? (
          shards.map((shard) => (
            <DropdownMenuCheckboxItem
              key={shard.id}
              checked={selectedShard?.id === shard.id}
              onCheckedChange={() => setSelectedShard(shard)}
              className="flex justify-between items-center"
            >
              <span className="truncate max-w-[120px]">{shard.title}</span>
              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-1 w-8 justify-end">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground w-4 text-right">
                    {shard.likes_count}
                  </span>
                </div>
                <div className="flex items-center gap-1 w-8 justify-end">
                  <Bookmark className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground w-4 text-right">
                    {shard.saves_count}
                  </span>
                </div>
              </div>
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No shards found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}