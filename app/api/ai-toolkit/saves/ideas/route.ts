// app/api/ai-toolkit/saves/ideas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {

    const token = request.headers.get("sb-access-token");
    const userId = request.headers.get("user-id");

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );
    
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch saved ideas for the current user
    const { data, error } = await supabase
      .from('saved_ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved ideas:', error);
      return NextResponse.json({ error: 'Failed to fetch saved ideas' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in saved ideas API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}