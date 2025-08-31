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
      {/* Redesigned card with purple gradient and metallic effects */}
      <div className="bg-gradient-to-b from-[#0f0524] to-[#13082d] rounded-2xl p-6 max-w-xs text-center relative overflow-hidden border border-purple-800/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-700/50 hover:-translate-y-1 group">
        {/* Metallic highlight effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Icon container with purple metallic styling */}
        <div className="w-12 h-12 bg-[#160a33] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-purple-800/20 border border-purple-700/30 relative z-10">
          <div className="text-purple-200 group-hover:text-purple-100 transition-colors">
            {svg}
          </div>
        </div>

        <h3 className="text-purple-50 font-medium text-xl mb-3 group-hover:text-white transition-colors relative z-10">
          {title}
        </h3>
        <p className="text-purple-200 text-sm group-hover:text-purple-100 transition-colors relative z-10">
          {para}
        </p>
      </div>

      {/* number shown under the card - now with purple styling */}
      <div
        className={`mt-3 font-bold text-xl transition-all duration-300 text-purple-300 ${
          isHovered
            ? "opacity-100 translate-y-2 text-purple-200"
            : "opacity-0 translate-y-0 pointer-events-none"
        }`}
      >
        {step}.
      </div>
    </div>
  );
};