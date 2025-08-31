"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ShardProps {
  title: string;
  description: string;
  username: string;
  slug: string;
  lineClamp: boolean;
  image?: string; // Optional image URL
  className?: string;
}

export default function ShardComponent({
  slug,
  title,
  description,
  username,
  lineClamp,
  image,
  className,
}: ShardProps) {
  return (
    <div className="h-full">
      <Link href={`/shards/${slug}`}>
        <div
          className={`${className} relative h-full w-full border border-gray-300 dark:border-gray-800 rounded-xl cursor-pointer group overflow-hidden bg-white dark:bg-[#0a0a0a] hover:rotate-1 hover:scale-105 transition-all duration-300 hover:border-lime-400 dark:hover:border-gray-700`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lime-100/40 to-emerald-200/30 dark:from-lime-400/8 dark:to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

          <div className="relative flex flex-col h-full p-4 space-y-4">
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-prompt font-[400] text-gray-800 dark:text-gray-100 group-hover:text-lime-600 dark:group-hover:text-lime-300 transition-colors duration-300">
                {title}
              </h2>

              {image && (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-32 object-cover rounded-lg group-hover:brightness-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/30 rounded-lg" />
                </div>
              )}

              <span className="inline-block px-2 py-1 text-xs font-mono font-medium text-lime-700 dark:text-lime-300 bg-lime-100/70 dark:bg-lime-400/10 rounded-md">
                /{slug}
              </span>

              <p
                className={`text-gray-600 dark:text-gray-400 ${
                  lineClamp ? "line-clamp-3" : ""
                } text-sm leading-relaxed break-words group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300`}
              >
                {description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 group-hover:border-lime-300 dark:group-hover:border-gray-700 transition-colors duration-300">
              <span className="inline-flex font-prompt items-center text-sm font-medium text-lime-600 dark:text-gray-500 group-hover:text-lime-700 dark:group-hover:text-lime-300 transition-colors">
                Explore
                <ChevronRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-2" />
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-600 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                Created by{" "}
                <span className="truncate max-w-[7rem] inline text-orange-600 dark:text-orange-700 group-hover:text-orange-700 dark:group-hover:text-orange-500">
                  @{username}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}