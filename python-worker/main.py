from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from models import ReadmeRequest, ReadmeResponse
from readme.readme_builder import generate_readme
import os
from readme.github_service import (
    fetch_important_files,
    fetch_repo_metadata,
    normalize_github_metadata,
)
from readme.analysis_service import analyze_repository
from idea_lab.idea_generator import IdeaGenerator, ComplexityLevel
from stackgenerator.stack_generator import StackGenerator, StackRequest
from competitiveanalysis.competitive_analysis import CompetitiveAnalyzer, CompetitiveAnalysisRequest
from pydantic import BaseModel

app = FastAPI()

API_KEY = os.getenv("WORKER_API_KEY")

class IdeaGeneratorRequest(BaseModel):
    topic: str
    skills: str
    complexity: str

class StackGeneratorRequest(BaseModel):
    project_type: str
    requirements: str
    preferences: str

def verify_api_key(request: Request):
    key = request.headers.get("X-API-Key")
    if not key or key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@app.post("/readme-builder")
async def readme_builder(req: ReadmeRequest, request: Request, auth=Depends(verify_api_key)):
    print("README builder endpoint called")
    try:
        # Get user credits from headers
        user_credits = int(request.headers.get("X-User-Credits", 0))
        
        if user_credits <= 0:
            return JSONResponse(
                status_code=402,
                content={
                    "error": "insufficient_credits",
                    "message": "Not enough AI credits"
                }
            )
        
        result = await generate_readme(req)
        
        # Check if generation was successful
        if "error" in result:
            if result["error"] == "insufficient_credits":
                return JSONResponse(
                    status_code=402,
                    content={
                        "error": "insufficient_credits",
                        "message": "Not enough AI credits to complete generation"
                    }
                )
            else:
                raise HTTPException(status_code=500, detail=result["error"])
        
        # Extract the readme content and used credits
        readme_content = result.get("readme")
        used_credits = result.get("used_credits", 0)
        
        # Validate the readme content structure
        if not isinstance(readme_content, dict) or readme_content.get("type") != "doc":
            print(f"Invalid readme structure: {readme_content}")
            raise HTTPException(status_code=500, detail="Invalid README structure generated")
        
        # Return the direct TipTap JSON structure without nesting
        return {
            "readme": readme_content,  # This is the direct TipTap JSON
            "used_credits": used_credits,
            "success": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in readme builder: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/repository-analysis")
async def repository_analysis(req: ReadmeRequest, auth=Depends(verify_api_key)):
    try:
        github_token = req.github_token
        raw_metadata = await fetch_repo_metadata(req.github_repo, github_token)
        normalized_metadata = normalize_github_metadata(raw_metadata)
        files = await fetch_important_files(req.github_repo, github_token)
        analysis_result = await analyze_repository(normalized_metadata, files)
        return {
            "analysis": analysis_result,
            "metadata": normalized_metadata,
            "success": True
        }
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/idea-generator")
async def idea_generator(
    req: IdeaGeneratorRequest,
    request: Request,
    auth=Depends(verify_api_key)
):
    try:
        complexity = ComplexityLevel(req.complexity.lower())
        generator = IdeaGenerator()
        
        user_credits = int(request.headers.get("X-User-Credits", 0))
        
        if user_credits <= 0:
            return JSONResponse(
                status_code=402,
                content={
                    "error": "insufficient_credits",
                    "message": "Not enough AI credits"
                }
            )
        
        result = generator.generate_ideas(req.topic, req.skills, complexity, user_credits)
        
        if "error" in result and result["error"] == "insufficient_credits":
            return JSONResponse(
                status_code=402,
                content={
                    "error": "insufficient_credits",
                    "message": "Not enough AI credits to complete generation"
                }
            )
            
        return {
            "ideas": result["ideas"],
            "used_credits": result.get("used_credits", 0),
            "success": True
        }
    except Exception as e:
        print(f"Error in idea generator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stack-generator")
async def stack_generator_endpoint(req: StackGeneratorRequest, request: Request, auth=Depends(verify_api_key)):
    try:
        user_credits = int(request.headers.get("X-User-Credits", 0))
        
        if user_credits <= 0:
            return JSONResponse(
                status_code=402,
                content={
                    "error": "insufficient_credits",
                    "message": "Not enough AI credits"
                }
            )
        
        generator = StackGenerator()
        result = generator.generate_stack_recommendation(
            req.project_type,
            req.requirements,
            req.preferences
        )
        
        used_credits = result["used_tokens"]
        
        if used_credits > user_credits:
            return JSONResponse(
                status_code=402,
                content={
                    "error": "insufficient_credits",
                    "message": "Not enough AI credits to complete generation"
                }
            )
            
        return {
            "recommendation": result["recommendation"],
            "used_credits": used_credits,
            "success": True
        }
    except Exception as e:
        print(f"Error in stack generator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/competitive-analysis")
async def competitive_analysis(req: CompetitiveAnalysisRequest, request: Request, auth=Depends(verify_api_key)):
    try:
        user_credits = int(request.headers.get("X-User-Credits", 0))
        
        if user_credits <= 0:
            return JSONResponse(
                status_code=402,
                content={
                    "error": "insufficient_credits",
                    "message": "Not enough AI credits"
                }
            )
        
        analyzer = CompetitiveAnalyzer()
        result = analyzer.generate_analysis(req)
        
        used_credits = result["used_tokens"]
        
        if used_credits > user_credits:
            return JSONResponse(
                status_code=402,
                content={
                    "error": "insufficient_credits",
                    "message": "Not enough AI credits to complete generation"
                }
            )
            
        analysis = result["analysis"]
        return {
            "uniqueValueProposition": analysis.unique_value_proposition,
            "competitiveAdvantages": analysis.competitive_advantages,
            "targetAudienceAlignment": analysis.target_audience_alignment,
            "recommendedPositioning": analysis.recommended_positioning,
            "used_credits": used_credits,
            "success": True
        }
    except Exception as e:
        print(f"Error in competitive analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)