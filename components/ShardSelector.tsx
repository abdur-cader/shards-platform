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
  onShardSelect?: (shard: Shard) => void;
};

export default function ShardSelector({ userId, accessToken, onShardSelect }: ShardSelectorProps) {
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
        <Button 
          variant="outline" 
          className="w-64 justify-between bg-[#0a0a1a] border-purple-700 text-purple-200 hover:bg-purple-900 hover:text-white hover:border-purple-500"
        >
          {selectedShard ? selectedShard.slug : "Choose your Shard"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-[#0a0a1a] border border-purple-800 shadow-lg shadow-purple-900/20">
        {shards.length > 0 ? (
          shards.map((shard) => (
            <DropdownMenuCheckboxItem
                key={shard.id}
                checked={selectedShard?.id === shard.id}
                onCheckedChange={() => {
                    setSelectedShard(shard);
                    onShardSelect?.(shard);
                }}
                className={`flex justify-between items-center py-2 px-3 text-purple-200 hover:bg-purple-800 hover:text-white pl-8
                  ${selectedShard?.id === shard.id ? 
                    "bg-purple-900/30 text-white ring-1 ring-purple-500 shadow-md shadow-purple-500/30" : 
                    ""}`}
            >
              <span className="truncate max-w-[120px]">{shard.title}</span>
              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-1 w-8 justify-end">
                  <Heart className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-purple-300 w-4 text-right">
                    {shard.likes_count}
                  </span>
                </div>
                <div className="flex items-center gap-1 w-8 justify-end">
                  <Bookmark className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-purple-300 w-4 text-right">
                    {shard.saves_count}
                  </span>
                </div>
              </div>
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuItem 
            disabled 
            className="text-purple-300 opacity-70 pl-8"
          >
            No shards found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}