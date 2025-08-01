"use client";

import { useState } from "react";
import ShardComponent from "@/components/Shard-component";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, LayoutGrid } from "lucide-react";
import FadeInOnScroll from "@/components/FadeInOnScroll";

interface Props {
  shards: any[];
}

export default function ShardsClient({ shards }: Props) {
  const [layout, setLayout] = useState<"masonry" | "grid">("masonry");

  return (
    <>
      <div className="flex items-center justify-end gap-2 px-6 mb-4">
        <Label
          htmlFor="layout-switch"
          className="text-sm text-gray-300 items-center font-mono flex gap-2 w-[90px]"
        >
          <span className="flex items-center justify-end gap-2 w-[90px] text-right">
            <span className="font-mono">
              {layout === "masonry" ? "Masonry" : "Grid"}
            </span>
            {layout === "masonry" ? (
              <LayoutDashboard className="w-6 h-6 shrink-0 stroke-orange-200" />
            ) : (
              <LayoutGrid className="w-6 h-6 shrink-0 stroke-green-200" />
            )}
          </span>
        </Label>
        <Switch
          id="layout-switch"
          checked={layout === "grid"}
          onCheckedChange={(checked) => setLayout(checked ? "grid" : "masonry")}
        />
      </div>
      <section
        className={`${
          layout === "masonry" ? "max-w-7xl" : "max-w-6xl"
        } mx-auto justify-center items-center`}
      >
        <div
          className={
            layout === "masonry"
              ? "columns-1 sm:columns-2 md:columns-4  gap-6 p-6"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 items-stretch"
          }
        >
          {shards.map((shard) => (
            <FadeInOnScroll
              key={shard.id}
              className={layout === "masonry" ? "break-inside-avoid mb-6" : ""}
            >
              <ShardComponent
                slug={shard.slug}
                title={shard.title}
                description={shard.desc}
                username={shard.users.username}
                lineClamp={layout === "masonry" ? false : true}
                image={shard.image_url?.[0]}
              />
            </FadeInOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
