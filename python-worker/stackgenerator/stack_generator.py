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
            You are an expert developer and modern stack architect. Recommend a **practical and production-ready technology stack** for this project:

            Project Type: {project_type}
            Key Requirements: {requirements}
            Preferences: {preferences}

            ### Rules
            - Tailor the stack **directly to the project type**:
            - If it's a **website or web app**, recommend modern web stacks (e.g. Next.js, Remix, Nuxt).
            - If it's a **mobile application**, recommend **mobile-first stacks** (e.g. React Native, Expo, Flutter, Kotlin, Swift) and avoid suggesting web frameworks like Next.js/Nest.js unless the user explicitly wants a PWA.
            - If it's a **small/local/IDE project**, suggest lightweight tools/frameworks suited to that environment.
            - Only return **modern, production-ready technologies** actually used today.
            - Do NOT list multiple options — provide one clear recommendation for each.
            - Keep it realistic, balanced for speed of development, scalability, and maintainability.

            ### Output Format
            Return the response as a **valid JSON object** with this structure:
            {{
            "title": "string (a descriptive title for this project/stack)",
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
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            
            # Return both the recommendation and token usage
            return {
                "recommendation": json.loads(content),
                "used_tokens": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

stack_generator = StackGenerator()