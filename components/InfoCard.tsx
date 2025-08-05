"use client";
import React, { useState } from "react";

interface InfoCardProps {
  svg: React.ReactNode;
  title: string;
  para: string;
  step: number;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  svg,
  title,
  para,
  step,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* actual card - now with metallic zinc styling */}
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-6 max-w-xs text-center relative overflow-hidden border border-zinc-600/50 shadow-lg hover:-translate-y-4 transition-all duration-300 hover:duration-200 ease-[cubic-bezier(0.4,1.3,0.2,0.9)] hover:shadow-[0_10px_25px_-5px_rgba(82,82,91,0.4)] group">
        {/* Metallic highlight effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-600/10 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon container with metallic ring */}
        <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-500/30 shadow-inner relative z-10">
          <div className="text-zinc-200 group-hover:text-white transition-colors">
            {svg}
          </div>
        </div>

        <h3 className="text-zinc-100 font-semibold text-lg mb-2 group-hover:text-white transition-colors relative z-10">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm font-hind group-hover:text-zinc-300 transition-colors relative z-10">
          {para}
        </p>
      </div>

      {/* number shown under the card - now with zinc styling */}
      <div
        className={`mt-3 font-bold text-xl transition-all duration-300 text-white ${
          isHovered
            ? "opacity-100 translate-y-3 text-white"
            : "opacity-0 translate-y-0 pointer-events-none"
        }`}
      >
        {step}.
      </div>
    </div>
  );
};
