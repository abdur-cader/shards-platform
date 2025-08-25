import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Reuse the same schema for server-side validation
const ideaGeneratorSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 20 characters long"),
  skills: z.string().min(5, "Skills must be at least 20 characters long"),
  complexity: z.enum(["beginner", "intermediate", "advanced", "any"])
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validationResult = ideaGeneratorSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { topic, skills, complexity } = validationResult.data;

    // Call the Python worker API
    const pythonWorkerResponse = await fetch(`${process.env.PYTHON_WORKER_URL}/idea-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.WORKER_API_KEY || ''
      },
      body: JSON.stringify({ topic, skills, complexity })
    });

    if (!pythonWorkerResponse.ok) {
      throw new Error('Python worker API request failed');
    }

    const result = await pythonWorkerResponse.json();
    
    return NextResponse.json({ ideas: result.ideas });

  } catch (error) {
    console.error('Error in idea generator API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}