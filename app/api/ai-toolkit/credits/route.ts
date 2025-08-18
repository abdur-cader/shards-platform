import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: Request) {
  const token = req.headers.get("sb-access-token")
  const id = req.headers.get("user-id")
  
  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAccessToken = token;
  
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

  try {
    const { data, error } = await supabase
      .from('users')
      .select('ai_credits')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ credits: data?.ai_credits || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const token = await getToken({ req });
  
  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAccessToken = token.supabaseAccessToken;
  
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

  try {
    // Get current credits first
    const { data: currentData } = await supabase
      .from('users')
      .select('ai_credits')
      .eq('id', token.sub)
      .single();

    const currentCredits = currentData?.ai_credits || 0;
    const newCredits = currentCredits + 10; // Add 10 credits

    const { data, error } = await supabase
      .from('users')
      .update({ ai_credits: newCredits })
      .eq('id', token.sub)
      .select('ai_credits')
      .single();

    if (error) throw error;

    return NextResponse.json({ credits: data?.ai_credits || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add credits' },
      { status: 500 }
    );
  }
}