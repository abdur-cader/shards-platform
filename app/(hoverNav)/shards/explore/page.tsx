import { supabase } from "@/lib/supabase";
import Hero from "@/components/Hero";
import { VerticalText } from "@/components/VerticalText";
import ShardsClient from "./shardsClient";

export default async function ShardsPage() {
  const { data: shards, error } = await supabase
    .from("shards")
    .select("*, users(username)")
    .eq("is_visible", true)
    .order("title", { ascending: false });

  if (error) return <div>failed to load Shards: {error.message}</div>;
  if (!shards || shards.length === 0) return <div>no shards found</div>;

  return (
    <div>
      <Hero />
      <div className="bg-gradient-to-br from-[#0c0c0c] via-[#4f6930]/7 to-[#0c0c0c]">
        <VerticalText />
        <ShardsClient shards={shards} />
      </div>
    </div>
  );
}
