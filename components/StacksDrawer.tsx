// components/StacksDrawer.tsx
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
import { Copy, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SavedStack {
  id: string;
  created_at: string;
  object: {
    title: string;
    backend: string;
    database: string;
    frontend: string;
    reasoning: string;
    deployment: string;
    authentication: string;
  };
}

interface StacksDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stacks: SavedStack[];
}

export default function StacksDrawer({
  open,
  onOpenChange,
  stacks,
}: StacksDrawerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Filter stacks based on search query
  const filteredStacks = stacks.filter((stack) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (stack.object.title || "").toLowerCase().includes(searchLower) ||
      stack.object.frontend.toLowerCase().includes(searchLower) ||
      stack.object.backend.toLowerCase().includes(searchLower) ||
      stack.object.database.toLowerCase().includes(searchLower) ||
      (stack.object.authentication || "").toLowerCase().includes(searchLower) ||
      (stack.object.deployment || "").toLowerCase().includes(searchLower) ||
      (stack.object.reasoning || "").toLowerCase().includes(searchLower) ||
      new Date(stack.created_at)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchLower)
    );
  });

  const copyToClipboard = async (stack: SavedStack) => {
    const text = `Frontend: ${stack.object.frontend}\nBackend: ${
      stack.object.backend
    }\nDatabase: ${stack.object.database}${
      stack.object.authentication
        ? `\nAuthentication: ${stack.object.authentication}`
        : ""
    }${
      stack.object.deployment ? `\nDeployment: ${stack.object.deployment}` : ""
    }${
      stack.object.reasoning ? `\nReasoning: ${stack.object.reasoning}` : ""
    }\nCreated: ${new Date(stack.created_at).toLocaleDateString()}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(stack.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

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

      // Check button visibility after scrolling
      setTimeout(() => checkScrollButtons(), 300);
    }
  };

  // Initialize scroll buttons on mount and when filtered stacks change
  useEffect(() => {
    checkScrollButtons();

    // Add event listener for scroll to update buttons
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      // Also check on resize in case container size changes
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [filteredStacks]);

  // Check scroll buttons when drawer opens
  useEffect(() => {
    if (open) {
      // Use a short timeout to ensure the DOM is fully rendered
      setTimeout(() => checkScrollButtons(), 100);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white dark:bg-black border-t border-purple-500/20 max-h-[85vh]">
        <div className="mx-auto w-full max-w-[80vw] relative">
          <DrawerHeader className="text-center">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <DrawerTitle className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  All Saved Tech Stacks
                </DrawerTitle>
                <DrawerDescription className="text-gray-600 dark:text-gray-400">
                  Browse through all your saved tech stacks
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
                placeholder="Search for stacks by title, technology, or date"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
              />
            </div>
          </div>

          <div className="p-4 pb-6 relative">
            {filteredStacks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "No stacks match your search."
                  : "No stacks saved yet."}
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
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-500/20 shadow-lg hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-800/30 dark:hover:to-indigo-800/30 backdrop-blur-sm h-10 w-10"
                  >
                    <ChevronLeft className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </Button>
                )}
                {showRightArrow && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("right")}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-500/20 shadow-lg hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-800/30 dark:hover:to-indigo-800/30 backdrop-blur-sm h-10 w-10"
                  >
                    <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </Button>
                )}
              </>
            )}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 horizontal-scroll"
              style={{ scrollbarGutter: "stable" }}
              onScroll={checkScrollButtons} // Added direct onScroll handler
            >
              <div
                className="flex space-x-5 min-h-min px-2"
                style={{ width: "max-content" }}
              >
                {filteredStacks.map((stack) => (
                  <div
                    key={stack.id}
                    ref={filteredStacks.length > 0 ? cardRef : null} // Only set ref if there are stacks
                    className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-500/20 shadow-lg w-100 flex-shrink-0 h-120 overflow-hidden flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-purple-800 dark:text-purple-200 text-lg">
                        {stack.object.title || "Tech Stack"}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {new Date(stack.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm space-y-2 mb-3 flex-1 overflow-y-auto">
                      <div>
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          Frontend:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-2">
                          {stack.object.frontend}
                        </p>
                      </div>
                      <div>
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          Backend:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-2">
                          {stack.object.backend}
                        </p>
                      </div>
                      <div>
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          Database:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-2">
                          {stack.object.database}
                        </p>
                      </div>
                      {stack.object.authentication && (
                        <div>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            Authentication:
                          </span>
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-2">
                            {stack.object.authentication}
                          </p>
                        </div>
                      )}
                      {stack.object.deployment && (
                        <div>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            Deployment:
                          </span>
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-2">
                            {stack.object.deployment}
                          </p>
                        </div>
                      )}
                      {stack.object.reasoning && (
                        <div>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            Reasoning:
                          </span>
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-3">
                            {stack.object.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(stack)}
                      variant="outline"
                      size="sm"
                      className="w-full border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-xs py-1 h-8"
                    >
                      {copiedId === stack.id ? (
                        "Copied!"
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Details
                        </>
                      )}
                    </Button>
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
