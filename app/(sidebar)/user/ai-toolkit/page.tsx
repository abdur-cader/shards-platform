// app/(sidebar)/user/ai-toolkit/page.tsx
"use client";
import { useState, useEffect } from "react";
import ToolGrid from "@/app/(sidebar)/user/ai-toolkit/ToolGrid";
import Header from "@/app/(sidebar)/user/ai-toolkit/Header";
import { useSession } from "next-auth/react";
import { useRouter  } from "next/navigation";

export default function AIToolkitPage() {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  return (
    <div 
      className="min-h-screen min-w-screen text-gray-100 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(
            circle at ${gradientPos.x}% ${gradientPos.y}%, 
            rgba(139, 92, 246, 0.15) 0%, 
            rgba(16, 22, 37, 0.95) 30%,
            rgba(18, 11, 34, 0.95) 80%
          ),
          linear-gradient(
            to bottom right,
            rgba(15, 23, 42, 0.58) 0%,
            rgba(30, 27, 75, 1) 50%,
            rgba(15, 23, 42, 1) 100%
          )
        `
      }}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <Header />
        
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3">
            <ToolGrid />
          </section>
        </main>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
      `}</style>
    </div>
  );
}