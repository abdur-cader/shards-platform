import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { projectType, requirements, preferences } = body;

    // Validate required fields
    if (!projectType || !requirements) {
      return NextResponse.json(
        { error: 'Project type and requirements are required' },
        { status: 400 }
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
      },
      body: JSON.stringify({
        project_type: projectType,
        requirements: requirements,
        preferences: preferences || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate stack recommendation');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Stack generation failed');
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