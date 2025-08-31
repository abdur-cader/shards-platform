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
    <div className="flex flex-col min-h-screen z-50">
      {/* Hero Section - Compact version */}
      <div className="mt-[20vh] h-[20vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-prompt font-[500] text-lime-900 dark:text-lime-200">
            Explore Shards
          </h1>
          <p className="text-md md:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Discover fragments of knowledge, inspiration, and creativity from our community
          </p>
        </div>
      </div>
      
      <div className="flex-1 pb-10">
        <div className="flex justify-end">
          <div className="px-2 py-1 bg-gray-900 rounded-full bg-neutral-700 mr-6">
            <div className="flex items-center justify-end gap-2 px-6">
              <Label
                htmlFor="layout-switch"
                className="text-sm text-gray-300 items-center font-mono flex gap-2 w-[90px]"
              >
                <span className="flex items-center rounded-full justify-end gap-2 w-[90px] text-right">
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
          </div>
        </div>
        
        <section
          className={`${
            layout === "masonry" ? "max-w-7xl" : "max-w-6xl"
          } mx-auto justify-center items-center`}
        >
          <div
            className={
              layout === "masonry"
                ? "columns-1 sm:columns-2 md:columns-4 gap-6 p-6"
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
      </div>
    </div>
  );
}