"use client";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Header() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCredits = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        headers["user-id"] = session.user.id;

        if (session.supabaseAccessToken) {
          headers["sb-access-token"] = session.supabaseAccessToken;
        }

        const response = await fetch('/api/ai-toolkit/credits', {
          method: 'GET',
          headers,
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Failed to fetch credits');
        }

        const data = await response.json();
        if (isMounted) {
          setCredits(data.credits);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error('Error fetching credits:', error);
          setCredits(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Only fetch if we have a session and haven't loaded credits yet
    if (session && credits === null) {
      fetchCredits();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [session, credits]); // Only re-run if session or credits change

  const handleAddCredits = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        "user-id": session.user.id
      };

      if (session.supabaseAccessToken) {
        headers["sb-access-token"] = session.supabaseAccessToken;
      }

      const response = await fetch('/api/ai-toolkit/credits', {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to add credits');
      }

      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error('Error adding credits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-4xl font-bold font-prompt bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 tracking-tight drop-shadow-[0_0_15px_rgba(192,132,252,0.7)]">
          AI Toolkit
        </h1>
        <p className="text-gray-400 font-prompt mt-2 font-light">
          Essential AI tools to boost your profile
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-800/80 border border-purple-500/30 rounded-full px-4 py-2 backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
          <Zap className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
          {loading ? (
            <span className="font-medium">...</span>
          ) : (
            <span className="font-medium text-purple-200 drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]">
              {credits !== null ? credits.toLocaleString() : 'N/A'}
            </span>
          )}
          <span className="text-gray-400 text-sm">credits remaining</span>
        </div>
        <Button
          variant="outline"
          className="border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 hover:text-purple-200 transition-all duration-300 shadow-md shadow-purple-500/20 hover:shadow-purple-500/40"
          onClick={handleAddCredits}
          disabled={loading}
        >
          {loading ? "Processing..." : "Add credits"}
        </Button>
      </div>
    </header>
  );
}