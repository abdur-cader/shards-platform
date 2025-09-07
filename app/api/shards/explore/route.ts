import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // First, get the total count of shards
    const { count: totalShards, error: countError } = await supabase
      .from("shards")
      .select("*", { count: 'exact', head: true })
      .eq("is_visible", true);

    if (countError) {
      return NextResponse.json(
        { error: countError.message },
        { status: 500 }
      );
    }

    // Calculate pagination values
    const totalPages = Math.ceil((totalShards || 0) / limit);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch paginated shards
    const { data: shards, error } = await supabase
      .from("shards")
      .select("*, users(username)")
      .eq("is_visible", true)
      .order("created_at", { ascending: false }) // Using created_at instead of title for better ordering
      .range(from, to);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!shards || shards.length === 0) {
      return NextResponse.json(
        { shards: [], totalPages: 0, totalShards: 0 },
        { status: 200 }
      );
    }

    return NextResponse.json({ 
      shards, 
      totalPages, 
      totalShards: totalShards || 0,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}