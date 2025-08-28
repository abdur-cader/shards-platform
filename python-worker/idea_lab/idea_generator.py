import os
import json
from typing import List, Dict, Any
from enum import Enum
from openai import OpenAI

class ComplexityLevel(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    ANY = "any"

class IdeaGenerator:
    def __init__(self):
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        self.client = OpenAI(api_key=api_key)
    

    def _build_prompt(self, topic: str, skills: str, complexity: ComplexityLevel) -> str:

        complexity_map = {
            ComplexityLevel.BEGINNER: "1-2 weeks",
            ComplexityLevel.INTERMEDIATE: "1-3 months", 
            ComplexityLevel.ADVANCED: "3-6 months",
            ComplexityLevel.ANY: "variable time commitment"
        }
        
        time_estimate = complexity_map.get(complexity, "variable time commitment")
        
        prompt= f"""
            Generate 10 software project ideas based on the following criteria:
            - Topic/Interest: {topic}
            - Required Skills: {skills}
            - Complexity Level: {complexity.value}
            - Estimated Completion Time: {time_estimate}
            
            For each idea, provide:
            1. A creative title
            2. A detailed description (2-4+ sentences)
            3. An estimated completion time 
            
            Return the response as a JSON object with an "ideas" array containing objects with these fields:
            - title (string)
            - description (string) 
            - estimatedTime (string)
            
            Example format:
            {{
            "ideas": [
                {{
                "title": "Project Name",
                "description": "Detailed description of the project...",
                "estimatedTime": "2-3 weeks"
                }}
            ]
            }}
            - You may suggest ideas that involve technologies not listed in the user's skills. If additional skills are required,
            explicitly mention them in the description using the format: *Requires [Skill]*.
            
            - Avoid generic or overused ideas (e.g., to-do apps, calculators, blog platforms). Only suggest unique, creative projects
            that would stand out and impress in real-world technical people.
        """
        return prompt

    def generate_ideas(self, topic: str, skills: str, complexity: ComplexityLevel, max_tokens: int) -> Dict[str, Any]:
        print("idea_generator: func generate_ideas begun")
        prompt = self._build_prompt(topic, skills, complexity)
        print("Prompt generated")
        
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant designed to output JSON. "
                        "Generate software project ideas based on the user's prompt. "
                        "Your entire output must be a single, valid JSON object with an 'ideas' key, "
                        "which contains an array of idea objects."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.7,
            max_tokens=max_tokens
        )

        content = response.choices[0].message.content
        print("Response stored")
        
        # Check if response was truncated due to token limit
        if response.choices[0].finish_reason == "length":
            return {
                "error": "insufficient_credits",
                "message": "Not enough AI credits to complete the generation"
            }
        
        # This line will now reliably parse the JSON content.
        ideas_data = json.loads(content)
        print("Response converted to JSON")

        # Add IDs to ideas
        for i, idea in enumerate(ideas_data.get("ideas", [])):
            idea["id"] = i + 1
        print("IDs indexed")

        return {
            "ideas": ideas_data.get("ideas", []),
            "used_credits": response.usage.total_tokens if response.usage else 0
        }