"use client";

import { useState } from "react";
import ShardComponent from "@/components/Shard-component";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, LayoutGrid } from "lucide-react";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface Shard {
  id: string | number;
  slug: string;
  title: string;
  desc: string;
  image_url?: string[];
  users: {
    username: string;
  };
}

interface Props {
  shards: Shard[];
  currentPage: number;
  totalPages: number;
  totalShards: number;
}

export default function ShardsClient({
  shards,
  currentPage,
  totalPages,
  totalShards,
}: Props) {
  const [layout, setLayout] = useState<"masonry" | "grid">("masonry");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const renderPaginationItems = () => {
    const items = [];

    // Always show Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) handlePageChange(currentPage - 1);
          }}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // Show page numbers only if there are multiple pages
    if (totalPages > 1) {
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust if we're near the beginning
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      // First page and ellipsis if needed
      if (startPage > 1) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );

        if (startPage > 2) {
          items.push(
            <PaginationItem key="ellipsis-start">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }

      // Page numbers
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Last page and ellipsis if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <PaginationItem key="ellipsis-end">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }

        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show just the current page when there's only one page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => e.preventDefault()}
            isActive={true}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) handlePageChange(currentPage + 1);
          }}
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="flex flex-col min-h-screen z-50">
      {/* Hero Section - Compact version */}
      <div className="mt-[20vh] h-[20vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="relative text-4xl md:text-5xl font-prompt font-[500] text-lime-900 dark:text-lime-200">
            {/* angled background word */}
            <span className="absolute top-[-10] left-10 -rotate-12 text-red-900/80 dark:text-lime-200/20 z-0 pointer-events-none select-none font-rsalt text-6xl md:text-7xl">
              Shards
            </span>

            {/* main word on top */}
            <span className="relative z-10">Explore</span>
          </h1>
          <p className="text-md md:text-lg text-gray-600 mt-10 dark:text-gray-300 max-w-md mx-auto">
            Discover what our community is building and sharing.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {shards.length} of {totalShards || 0} shards
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
                onCheckedChange={(checked) =>
                  setLayout(checked ? "grid" : "masonry")
                }
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
                className={
                  layout === "masonry" ? "break-inside-avoid mb-6" : ""
                }
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

        {/* Always show pagination, even with one page */}
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
