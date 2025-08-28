"use client";
import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gradient-to-b from-[#0f0524] to-[#13082d] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-800/40 hover:border-purple-700/50">
      <div className="bg-[#160a33] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md shadow-purple-800/20 border border-purple-700/30">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-purple-50 mb-3">{title}</h3>
      <p className="text-purple-200 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
