from fastapi import HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from typing import Dict, Any
import json

class StackRequest(BaseModel):
    project_type: str
    requirements: str
    preferences: str

class StackGenerator:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    def generate_stack_recommendation(self, project_type: str, requirements: str, preferences: str) -> Dict[str, Any]:
        """Generate a comprehensive tech stack recommendation using OpenAI"""
        
        prompt = f"""
        As an expert full-stack developer and modern stack architect, recommend a **practical and production-ready technology stack** for this project:

        Project Type: {project_type}
        Key Requirements: {requirements}
        Preferences: {preferences}

        Guidelines:
        - Focus only on modern, widely adopted tools that are actually used in production today (e.g., Next.js, Supabase, Auth.js).
        - Do NOT suggest outdated or barebones stacks like plain Express, raw SQL, or vanilla Node unless absolutely required.
        - Keep the output concise: one clear recommendation for frontend, backend, database, auth, and deployment — not multiple options.
        - The goal is a stack that balances speed of development, scalability, and maintainability.

        Return the response as a valid JSON object with this structure:
        {{
        "frontend": "string",
        "backend": "string",
        "database": "string",
        "authentication": "string",
        "deployment": "string",
        "reasoning": "string"
        }}
        """

        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert full-stack developer specializing in modern web technologies. Provide detailed, practical tech stack recommendations."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
            )
            
            # Extract and parse the JSON response
            content = response.choices[0].message.content
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            json_str = content[json_start:json_end]
            
            return json.loads(json_str)
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

# Create global instance
stack_generator = StackGenerator()