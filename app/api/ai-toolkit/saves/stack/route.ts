// app/api/ai-toolkit/saves/stacks/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("user-id");
    const token = request.headers.get("sb-access-token");
    
    
    
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized no session' }, { status: 401 });
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    const { data, error } = await supabase
      .from('saved_stack')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved stacks:', error);
      return NextResponse.json({ error: 'Failed to fetch saved stacks' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in saved stacks API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}