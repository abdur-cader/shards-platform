"use client";
import { Sparkles } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

const Countup = () => {
  const fasterEasing = (t: number, b: number, c: number, d: number) => {
    return c * Math.pow(t / d, 0.02) + b; // exponent <1 = faster at the end
  };

  return (
    <div className="bg-gradient-to-b from-[#0f0524] to-[#13082d] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-800/40 hover:border-purple-700/50">
      <div className="bg-[#160a33] p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md shadow-purple-800/20 border border-purple-700/30">
        <Sparkles className="text-purple-200" size={20} />
      </div>
      <h3 className="text-xl font-medium text-purple-50 mb-3">
        No-Cost Access
      </h3>
      <div className="flex items-baseline mb-2">
        <span className="text-3xl font-bold text-white mr-1">
          <CountUp
            end={20000}
            duration={6}
            easingFn={fasterEasing}
            enableScrollSpy
            scrollSpyOnce
          />
        </span>
      </div>
      <p className="text-purple-200 text-sm">free monthly AI credits.</p>
    </div>
  );
};

export default Countup;
