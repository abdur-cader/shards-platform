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
    console.log("Validation passed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    const { shardId, description, features } = validation.data;
    const headersList = await headers();
    const sbAccessToken = headersList.get('sb-access-token');
    const ghAccessToken = headersList.get('gh-access-token')
    const userid = headersList.get('session-id');
    
    if (!sbAccessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token provided' },
        { status: 401 }
      );
    }

    console.log("Access Token exists!!!!!!!!!!!!!!!!!!!!!!!!!")

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

    console.log("Client Created!!!!!!!!!!!!!!!!!!")

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
        project_name: shard.title // Assuming title exists in shard
      },
      github_token: ghAccessToken
    };
    console.log("WORKER_API_KEY seen by Next.js:", process.env.WORKER_API_KEY);
    // Call Python worker
    const workerResponse = await fetch(`${process.env.PYTHON_WORKER_URL}/readme-builder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WORKER_API_KEY!
      },
      body: JSON.stringify(payload)
    });

    if (!workerResponse.ok) {
      const error = await workerResponse.text();
      console.error('Python worker error:', error);
      return NextResponse.json(
        { error: 'README generation failed', details: error },
        { status: workerResponse.status }
      );
    }

    const workerData = await workerResponse.json();

    // Debug log to see the actual structure
    console.log("WorkerData FULL:::::::::::::", JSON.stringify(workerData, null, 2));

    // Check if readme_json exists
    if (!workerData.readme_json) {
      console.error('Invalid response structure from worker - missing readme_json:', workerData);
      return NextResponse.json(
        { error: 'Invalid response from README generation service - missing readme_json' },
        { status: 500 }
      );
    }

    // The readme_json IS the content, not a wrapper with content property
    const content = workerData.readme_json;

    // Additional validation to ensure it's proper TipTap JSON
    if (!content || typeof content !== 'object' || !content.type || content.type !== 'doc') {
      console.error('Invalid TipTap JSON structure:', content);
      return NextResponse.json(
        { error: 'Invalid TipTap JSON format from README generation service' },
        { status: 500 }
      );
    }

    console.log("Content extracted successfully");
    console.log("Content type:", content.type);
  
    console.log("JSON::::::::::::::::::::::::::::::\n", JSON.stringify(content, null, 2))

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
      { status: 'success', content },
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