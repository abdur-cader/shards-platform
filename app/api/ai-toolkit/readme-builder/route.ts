import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Define input validation schema
const requestSchema = z.object({
  shardId: z.string().min(1),
  description: z.string().optional(),
  features: z.string().optional()
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = requestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { shardId, description, features } = validation.data;
    const headersList = await headers();
    const sbAccessToken = headersList.get('sb-access-token');
    const ghAccessToken = headersList.get('gh-access-token');
    const userid = headersList.get('session-id');
    
    if (!sbAccessToken || !userid) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token or user ID provided' },
        { status: 401 }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${sbAccessToken}`
          }
        } 
      }
    );

    // Get user's current credits
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('ai_credits')
      .eq('id', userid)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has sufficient credits
    if (user.ai_credits <= 0) {
      return NextResponse.json(
        { 
          error: 'insufficient_credits',
          message: 'Not enough AI credits to generate README'
        },
        { status: 402 }
      );
    }

    // Verify shard ownership
    const { data: shard, error: shardError } = await supabase
      .from('shards')
      .select('id, github_repo, user_id, title')
      .eq('id', shardId)
      .single();

    if (shardError || !shard) {
      return NextResponse.json(
        { error: 'Shard not found' },
        { status: 404 }
      );
    }

    if (shard.user_id !== userid) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not own this shard' },
        { status: 403 }
      );
    }

    if (!shard.github_repo) {
      return NextResponse.json(
        { error: 'No GitHub repository linked to this shard' },
        { status: 400 }
      );
    }

    // Prepare payload for Python worker
    const payload = {
      github_repo: shard.github_repo,
      user_input: {
        description: description || '',
        features: features || ''
      },
      shard_id: shardId,
      metadata: {
        user_id: userid,
        project_name: shard.title
      },
      github_token: ghAccessToken
    };

    // Call Python worker
    const workerResponse = await fetch(`${process.env.PYTHON_WORKER_URL}/readme-builder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WORKER_API_KEY!,
        'X-User-Credits': user.ai_credits.toString()
      },
      body: JSON.stringify(payload)
    });

    // Handle worker response
    if (!workerResponse.ok) {
      let errorData: any;
      
      try {
        errorData = await workerResponse.json();
      } catch (jsonError) {
        const errorText = await workerResponse.text();
        try {
          errorData = JSON.parse(errorText);
        } catch (_) {
          errorData = { message: errorText };
        }
      }

      if (workerResponse.status === 402 && errorData) {
        return NextResponse.json(
          { 
            error: 'insufficient_credits',
            message: errorData.message || 'Not enough AI credits to complete generation'
          },
          { status: 402 }
        );
      }

      console.error('Python worker error:', errorData);
      return NextResponse.json(
        { error: 'README generation failed', details: errorData },
        { status: workerResponse.status }
      );
    }

    // Parse successful response
    const workerData = await workerResponse.json();

    // Extract the readme content from the response structure
    let content;
    let usedCredits = 0;

    if (workerData.readme) {
      // Handle direct readme structure
      content = workerData.readme;
      usedCredits = workerData.used_credits || 0;
    } else {
      console.error('Invalid response structure from worker:', workerData);
      return NextResponse.json(
        { error: 'Invalid response from README generation service' },
        { status: 500 }
      );
    }

    // Validate TipTap JSON structure
    if (!content || typeof content !== 'object' || !content.type || content.type !== 'doc') {
      console.error('Invalid TipTap JSON structure:', content);
      return NextResponse.json(
        { error: 'Invalid TipTap JSON format from README generation service' },
        { status: 500 }
      );
    }

    // Update user credits if credits were used
    console.log("USED CREDITS:::::::::::::::::::::::::::::", usedCredits)
    if (usedCredits > 0) {
      const { error: creditUpdateError } = await supabase
        .from('users')
        .update({ 
          ai_credits: user.ai_credits - usedCredits,
        })
        .eq('id', userid);

      if (creditUpdateError) {
        console.error('Failed to update user credits:', creditUpdateError);
        // Continue with README update even if credit update fails
      }
    }

    // Update shard with generated README
    const { error: updateError } = await supabase
      .from('shards')
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', shardId);

    if (updateError) {
      throw new Error(`Failed to update shard: ${updateError.message}`);
    }

    return NextResponse.json(
      { 
        status: 'success', 
        content,
        used_credits: usedCredits,
        remaining_credits: user.ai_credits - usedCredits
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('README generation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}