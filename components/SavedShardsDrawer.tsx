"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface SavedShard {
  id: string;
  saved_at: string;
  shard: {
    id: string;
    title: string;
    desc: string | null;
    slug: string;
    github_repo: string | null;
    created_at: string;
    image_url: string | null;
    is_visible: boolean;
    user_id: string;
    content: string | null;
    updated_at: string;
    user: {
      username: string;
      name: string;
      image: string;
    };
  };
}

interface SavedShardsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedShards: SavedShard[];
}

export default function SavedShardsDrawer({
  open,
  onOpenChange,
  savedShards,
}: SavedShardsDrawerProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Filter shards based on search query
  const filteredShards = savedShards.filter((savedShard) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (savedShard.shard.title || "").toLowerCase().includes(searchLower) ||
      (savedShard.shard.desc || "").toLowerCase().includes(searchLower) ||
      (savedShard.shard.user.username || "")
        .toLowerCase()
        .includes(searchLower) ||
      new Date(savedShard.saved_at)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth + 16; // card width + gap
      const scrollAmount = cardWidth;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(() => checkScrollButtons(), 300);
    }
  };

  useEffect(() => {
    checkScrollButtons();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [filteredShards]);

  useEffect(() => {
    if (open) {
      setTimeout(() => checkScrollButtons(), 100);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white dark:bg-black border-t border-lime-500/20 max-h-[85vh]">
        <div className="mx-auto w-full max-w-[80vw] relative">
          <DrawerHeader className="text-center">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <DrawerTitle className="text-2xl font-bold text-lime-700 dark:text-lime-400">
                  All Saved Shards
                </DrawerTitle>
                <DrawerDescription className="text-gray-600 dark:text-gray-400">
                  Browse through all your saved code shards
                </DrawerDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DrawerHeader>

          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for shards by title, description, or author"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-gray-300 dark:border-gray-600 focus:border-lime-500 dark:focus:border-lime-400"
              />
            </div>
          </div>

          <div className="p-4 pb-6 relative">
            {filteredShards.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "No shards match your search."
                  : "No shards saved yet."}
              </div>
            ) : (
              <>
                {/* Left fade shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none"></div>

                {/* Right fade shadow */}
                <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none"></div>

                {showLeftArrow && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("left")}
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 border border-lime-200 dark:border-lime-500/20 shadow-lg hover:from-lime-100 hover:to-green-100 dark:hover:from-lime-800/30 dark:hover:to-green-800/30 backdrop-blur-sm h-10 w-10"
                  >
                    <ChevronLeft className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                  </Button>
                )}
                {showRightArrow && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("right")}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 border border-lime-200 dark:border-lime-500/20 shadow-lg hover:from-lime-100 hover:to-green-100 dark:hover:from-lime-800/30 dark:hover:to-green-800/30 backdrop-blur-sm h-10 w-10"
                  >
                    <ChevronRight className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                  </Button>
                )}
              </>
            )}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 horizontal-scroll"
              style={{ scrollbarGutter: "stable" }}
              onScroll={checkScrollButtons}
            >
              <div
                className="flex space-x-5 min-h-min px-2"
                style={{ width: "max-content" }}
              >
                {filteredShards.map((savedShard) => (
                  <div
                    key={savedShard.id}
                    ref={filteredShards.length > 0 ? cardRef : null}
                    className="bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 p-5 rounded-lg border border-lime-200 dark:border-lime-500/20 shadow-lg w-80 flex-shrink-0 h-80 overflow-hidden flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lime-800 dark:text-lime-200 text-lg line-clamp-1">
                        {savedShard.shard.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {format(new Date(savedShard.saved_at), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={savedShard.shard.user.image}
                          alt={savedShard.shard.user.name}
                        />
                        <AvatarFallback>
                          {savedShard.shard.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        @{savedShard.shard.user.username}
                      </span>
                    </div>

                    <div className="text-sm space-y-2 mb-4 flex-1 overflow-y-auto">
                      <div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {savedShard.shard.desc || "No description provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/shards/${savedShard.shard.slug}`}
                        target="_blank"
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-lime-300 dark:border-lime-600 text-lime-700 dark:text-lime-300 hover:bg-lime-50 dark:hover:bg-lime-900/30 text-xs py-1 h-8"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Shard
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
