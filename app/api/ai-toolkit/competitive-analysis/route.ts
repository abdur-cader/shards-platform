import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define the expected request body structure
interface CompetitiveAnalysisRequest {
  projectDescription: string;
  competitors?: string;
  targetAudience?: string;
}

// Define the response structure
interface CompetitiveAnalysisResponse {
  uniqueValueProposition: string[];
  competitiveAdvantages: string[];
  targetAudienceAlignment: string;
  recommendedPositioning: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CompetitiveAnalysisRequest = await request.json();
    const userId = request.headers.get('userid');
    const supabaseAccessToken = request.headers.get('sb-access-token');
    
    if (!userId || !supabaseAccessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { projectDescription, competitors, targetAudience } = body;
    
    // Validate required fields
    if (!projectDescription) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }

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
    
    // Call the Python worker API
    const workerResponse = await fetch(`${process.env.PYTHON_WORKER_URL}/competitive-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WORKER_API_KEY || '',
        'X-User-Credits': userCredits.toString()
      },
      body: JSON.stringify({
        project_description: projectDescription,
        competitors: competitors || '',
        target_audience: targetAudience || ''
      }),
    });
    
    if (!workerResponse.ok) {
      const errorData = await workerResponse.json();
      
      // Handle insufficient credits from worker
      if (errorData.error === 'insufficient_credits') {
        return NextResponse.json(
          { error: 'insufficient_credits' },
          { status: 402 }
        );
      }
      
      throw new Error(`Worker API error: ${JSON.stringify(errorData)}`);
    }
    
    const workerData = await workerResponse.json();
    
    if (!workerData.success) {
      throw new Error('Worker API returned unsuccessful response');
    }

    // Deduct used credits from user's account
    const usedCredits = workerData.used_credits || 0;
    if (usedCredits > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ ai_credits: userCredits - usedCredits })
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update user credits:', updateError);
      }
    }
    
    const analysis: CompetitiveAnalysisResponse = {
      uniqueValueProposition: workerData.uniqueValueProposition || [],
      competitiveAdvantages: workerData.competitiveAdvantages || [],
      targetAudienceAlignment: workerData.targetAudienceAlignment || '',
      recommendedPositioning: workerData.recommendedPositioning || ''
    };
    
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('Error in competitive analysis:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}