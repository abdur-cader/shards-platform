import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { projectType, requirements, preferences } = body;
    const userId = request.headers.get('userid');
    const supabaseAccessToken = request.headers.get('sb-access-token');

    if (!userId || !supabaseAccessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!projectType || !requirements) {
      return NextResponse.json(
        { error: 'Project type and requirements are required' },
        { status: 400 }
      );
    }

    // Get user's AI credits from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseAccessToken}`
          }
        }
      }
    );

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('ai_credits')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    const userCredits = userData.ai_credits;
    
    if (userCredits <= 0) {
      return NextResponse.json(
        { error: 'insufficient_credits' },
        { status: 402 }
      );
    }

    // Make API call to Python worker
    const workerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000';
    const apiKey = process.env.WORKER_API_KEY;

    if (!apiKey) {
      throw new Error('WORKER_API_KEY environment variable is not set');
    }

    const response = await fetch(`${workerUrl}/stack-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-User-Credits': userCredits.toString()
      },
      body: JSON.stringify({
        project_type: projectType,
        requirements: requirements,
        preferences: preferences || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle insufficient credits from worker
      if (errorData.error === 'insufficient_credits') {
        return NextResponse.json(
          { error: 'insufficient_credits' },
          { status: 402 }
        );
      }
      
      throw new Error(errorData.detail || 'Failed to generate stack recommendation');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Stack generation failed');
    }

    // Deduct used credits from user's account
    const usedCredits = data.used_credits || 0;
    if (usedCredits > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ ai_credits: userCredits - usedCredits })
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update user credits:', updateError);
      }
    }

    return NextResponse.json(data.recommendation);

  } catch (error) {
    console.error('Stack generation error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}