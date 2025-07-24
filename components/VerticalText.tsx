import React from "react"

export function VerticalText() {
  return (
    <div className="relative group cursor-vertical-text">
      <div className="transform -rotate-90 inline-block whitespace-nowrap text-sm uppercase tracking-widest flex items-center text-gray-900 dark:text-white animate-float transition-transform">
        <span className="mr-1">←</span>
        start
      </div>
    </div>
  )
}
