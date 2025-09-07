import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const sessionId = request.headers.get('session-id');
    
    if (!authHeader || !sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAccessToken = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
        },
      }
    );

    // Fetch saved shards for the current user
    const { data: savedShards, error } = await supabase
      .from('saves')
      .select(`
        id,
        created_at,
        shard:shards (
          id,
          title,
          desc,
          slug,
          github_repo,
          created_at,
          image_url,
          is_visible,
          user_id,
          content,
          updated_at,
          user:users (
            username,
            name,
            image
          )
        )
      `)
      .eq('user_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved shards:', error);
      return NextResponse.json({ error: 'Failed to fetch saved shards' }, { status: 500 });
    }

    // Transform the data to a more usable format
    const formattedShards = savedShards.map(save => ({
      id: save.id,
      saved_at: save.created_at,
      shard: save.shard
    }));

    return NextResponse.json({ savedShards: formattedShards });
  } catch (error) {
    console.error('Error in saved-shards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}