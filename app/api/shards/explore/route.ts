import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );


  try {
    const { data: shards, error } = await supabase
      .from("shards")
      .select("*, users(username)")
      .eq("is_visible", true)
      .order("title", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!shards || shards.length === 0) {
      return NextResponse.json(
        { error: "No shards found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ shards });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}