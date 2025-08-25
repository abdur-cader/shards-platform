// app/components/AiToolkitCard.tsx
"use client";
import { ChevronRight } from "lucide-react";

export default function AiToolkitCard({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}) {
  return (
    <button
      onClick={action}
      className="group relative bg-gray-800/50 hover:scale-110 hover:rotate-2 hover:bg-gray-700/60 rounded-xl p-8 transition-all m-2 duration-200 overflow-hidden border border-gray-700/50 hover:border-purple-400/40"
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_linear_infinite]"></div>
      </div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-3 rounded-lg bg-purple-500/15 group-hover:bg-purple-500/25 transition-all duration-300 shadow-sm shadow-purple-500/10 group-hover:shadow-purple-500/30">
          <Icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]" />
        </div>
        <div className="text-left">
          <h3 className="font-[500] font-prompt text-lg group-hover:text-purple-300 transition-colors drop-shadow-[0_0_5px_rgba(192,132,252,0.4)]">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>
      </div>
      <div className="relative z-10 flex justify-end mt-4">
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all drop-shadow-[0_0_3px_rgba(192,132,252,0.4)]" />
      </div>
    </button>
  );
}