import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
        const body = await request.json();
        const { object } = body;

        const headers = request.headers;

        const userId = headers.get("user-id")
        const accessToken = headers.get("sb-access-token")

    // Validate input
    if (!object || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: object or userId' },
        { status: 400 }
      );
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        }
    );

    // Insert into saved_stack table
    const { data, error } = await supabase
      .from('saved_stack')
      .insert([
        {
          object: object,
          user_id: userId,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save to database' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Stack saved successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in save endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}