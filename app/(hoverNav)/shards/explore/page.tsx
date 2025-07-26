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
        <main>
            <Hero />
            <VerticalText />
            <ShardsClient shards={shards} />
        </main>
    );
}
