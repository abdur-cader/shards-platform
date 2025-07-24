"use client";

import DockDropdown from "./DockDropdown";
import React from "react";
import AnimatedDock from "./animata/container/animated-dock";
import { EllipsisVertical, Sparkles, Pencil, Link2, Eye, Trash } from "lucide-react";


interface Props {
  slug: string;
}

const Dock = ({ slug }: Props) => {
  return (
    <div className="relative flex h-60 w-full items-center justify-center">
      <AnimatedDock
        items={[
          {
            href: `/shards/${slug}/edit`,
            icon: <Pencil />,
            title: "Edit this Shard",
          },
          {
            href: "/search",
            icon: <Sparkles />,
            title: "AI Toolkit",
          },
          {
            icon: <EllipsisVertical />,
            title: "More",
            dropdown: (
              <>
                <DockDropdown slug={slug}/>
              </>
            ),
          },
        ]}
        largeClassName="max-w-lg"
        smallClassName="w-full"
      />
    </div>
  );
};

export default Dock;