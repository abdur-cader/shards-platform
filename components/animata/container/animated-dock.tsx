"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Link2, Eye, Trash, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface AnimatedDockProps {
  items: {
    title: string;
    icon: React.ReactNode;
    href?: string;
    dropdown?: React.ReactNode;
  }[];
  largeClassName?: string;
  smallClassName?: string;
}

export default function AnimatedDock({ items, largeClassName, smallClassName }: AnimatedDockProps) {
  return (
    <>
      <LargeDock items={items} className={largeClassName} />
      <SmallDock items={items} className={smallClassName} />
    </>
  );
}

const LargeDock = ({ items, className }: { items: AnimatedDockProps["items"]; className?: string }) => {
  const mouseXPosition = useMotionValue(Infinity);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.div
      onMouseMove={(e) => {
        if (!dropdownOpen) mouseXPosition.set(e.pageX);
      }}
      onMouseLeave={() => mouseXPosition.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-white/10 px-4 pb-3 dark:bg-black/10 md:flex",
        className,
        "border border-gray-200/30 backdrop-blur-sm dark:border-gray-800/30"
      )}
    >
      {items.map((item) =>
        item.dropdown ? (
          <DockDropdownIcon
            mouseX={mouseXPosition}
            key={item.title}
            title={item.title}
            icon={item.icon}
            setDropdownOpen={setDropdownOpen}
          >
            {item.dropdown}
          </DockDropdownIcon>
        ) : (
          <DockIcon mouseX={mouseXPosition} key={item.title} {...item} />
        )
      )}
    </motion.div>
  );
};

function DockIcon({ mouseX, title, icon, href = "#" }: { mouseX: MotionValue; title: string; icon: React.ReactNode; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const width = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), { mass: 0.1, stiffness: 150, damping: 12 });
  const iconWidth = useSpring(useTransform(distance, [-150, 0, 150], [20, 40, 20]), { mass: 0.1, stiffness: 150, damping: 12 });
  const iconHeight = useSpring(useTransform(distance, [-150, 0, 150], [20, 40, 20]), { mass: 0.1, stiffness: 150, damping: 12 });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-white/20 text-black shadow-lg backdrop-blur-md dark:bg-black/20 dark:text-white"
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit -translate-x-1/2 whitespace-pre rounded-md border border-gray-200 bg-white/80 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: iconWidth, height: iconHeight }} className="flex items-center justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}

function DockDropdownIcon({
  mouseX,
  title,
  icon,
  children,
  setDropdownOpen,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode; // this is the full dropdown content from Dock.tsx
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const width = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const height = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const iconWidth = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const iconHeight = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  const [isHovered, setIsHovered] = useState(false);

  return (
    <DropdownMenu onOpenChange={setDropdownOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <motion.div
          ref={ref}
          style={{ width, height }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex aspect-square items-center justify-center rounded-full bg-white/20 text-black shadow-lg backdrop-blur-md dark:bg-black/20 dark:text-white cursor-pointer"
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 2, x: "-50%" }}
                className="absolute -top-8 left-1/2 w-fit -translate-x-1/2 whitespace-pre rounded-md border border-gray-200 bg-white/80 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
              >
                {title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div style={{ width: iconWidth, height: iconHeight }} className="flex items-center justify-center">
            {icon}
          </motion.div>
        </motion.div>
      </DropdownMenuTrigger>

      {/* Simply render the dropdown passed from Dock.tsx here */}
      <DropdownMenuContent side="top" align="start">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const SmallDock = ({ items, className }: { items: AnimatedDockProps["items"]; className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div layoutId="nav" className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2">
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: index * 0.05 } }}
                transition={{ delay: (items.length - 1 - index) * 0.05 }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-black shadow-md backdrop-blur-md dark:bg-black/20 dark:text-white"
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </Link>
                ) : item.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-black shadow-md backdrop-blur-md dark:bg-black/20 dark:text-white">
                        <div className="h-4 w-4">{item.icon}</div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start">
                      {item.dropdown}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-black shadow-md backdrop-blur-md dark:bg-black/20 dark:text-white">
                    <div className="h-4 w-4">{item.icon}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-black shadow-md backdrop-blur-md dark:bg-black/20 dark:text-white"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
};