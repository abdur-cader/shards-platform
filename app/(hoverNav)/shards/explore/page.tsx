import { supabase } from "@/lib/supabase";
import Hero from "@/components/Hero";
import ShardsClient from "./shardsClient";
import { BGPattern } from "@/components/bg-pattern";

export default async function ShardsPage() {
  const { data: shards, error } = await supabase
    .from("shards")
    .select("*, users(username)")
    .eq("is_visible", true)
    .order("title", { ascending: false });

  if (error) return <div>failed to load Shards: {error.message}</div>;
  if (!shards || shards.length === 0) return <div>no shards found</div>;

  return (
      <div className="min-h-screen 
                      relative
                      bg-gradient-to-br 
                      from-gray-50 via-gray-100 to-gray-200 
                      dark:from-[#0c0c0c] dark:via-[#4f6930]/7 dark:to-[#0c0c0c] 
                      shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.5)]">
        <BGPattern 
            variant="dots" 
            mask="fade-center" 
            className="absolute inset-0 z-0 pointer-events-none"
        />
        <ShardsClient shards={shards} />
      </div>
  );
}