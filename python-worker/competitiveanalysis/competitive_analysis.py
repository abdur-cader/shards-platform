import os
import openai
from typing import List, Dict, Any
from pydantic import BaseModel

# set the api key globally
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

class CompetitiveAnalysisRequest(BaseModel):
    project_description: str
    competitors: str = ""
    target_audience: str = ""

class CompetitiveAnalysisResponse(BaseModel):
    unique_value_proposition: List[str]
    competitive_advantages: List[str]
    target_audience_alignment: str
    recommended_positioning: str

class CompetitiveAnalyzer:
    def __init__(self):
        self.client = openai  # using openai module directly

    def generate_analysis(self, request: CompetitiveAnalysisRequest) -> Dict[str, Any]:
        """Generate competitive analysis using OpenAI API"""
        
        prompt = self._build_prompt(
            request.project_description,
            request.competitors,
            request.target_audience
        )
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a strategic business analyst specializing in competitive positioning and market analysis. Provide clear, actionable insights in JSON format."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
            )
            
            analysis_data = response.choices[0].message.content
            parsed_response = self._parse_response(analysis_data)
            
            # Return both the analysis and token usage
            return {
                "analysis": parsed_response,
                "used_tokens": response.usage.total_tokens if response.usage else 0
            }
            
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def _build_prompt(self, project_description: str, competitors: str, target_audience: str) -> str:
        """Build the prompt for competitive analysis"""
        
        prompt = f"""
Analyze the competitive positioning for the following project and provide a comprehensive analysis in JSON format with these exact keys:
- unique_value_proposition (array of strings)
- competitive_advantages (array of strings)
- target_audience_alignment (string)
- recommended_positioning (string)

Project Description: {project_description}
"""
        
        if competitors:
            prompt += f"\nCompetitors: {competitors}"
        
        if target_audience:
            prompt += f"\nTarget Audience: {target_audience}"
        
        prompt += """
        
Please provide:
1. 3-5 unique value propositions that differentiate this project
2. 3-5 competitive advantages compared to existing solutions
3. How the project aligns with and serves the target audience
4. Recommended market positioning strategy

Return only valid JSON without any additional text.
"""
        
        return prompt
    
    def _parse_response(self, response_text: str) -> CompetitiveAnalysisResponse:
        """Parse the OpenAI response into the structured format"""
        import json
        
        try:
            data = json.loads(response_text)
            return CompetitiveAnalysisResponse(
                unique_value_proposition=data.get("unique_value_proposition", []),
                competitive_advantages=data.get("competitive_advantages", []),
                target_audience_alignment=data.get("target_audience_alignment", ""),
                recommended_positioning=data.get("recommended_positioning", "")
            )
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse OpenAI response: {str(e)}")
        except Exception as e:
            raise Exception(f"Error parsing response: {str(e)}")
