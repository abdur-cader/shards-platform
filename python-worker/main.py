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

@app.post("/readme-builder", response_model=ReadmeResponse)
async def readme_builder(req: ReadmeRequest, auth=Depends(verify_api_key)):
    print("TEST FROM POST")
    try:
        result = await generate_readme(req)
        return {"readme_json": result["readme"]}
    except Exception as e:
        print(str(e))
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
async def idea_generator(req: IdeaGeneratorRequest, auth=Depends(verify_api_key)):
    try:
        complexity = ComplexityLevel(req.complexity.lower())
        generator = IdeaGenerator()
        ideas = generator.generate_ideas(req.topic, req.skills, complexity)
        return {
            "ideas": ideas,
            "success": True
        }
    except Exception as e:
        print(f"Error in idea generator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/stack-generator")
async def stack_generator_endpoint(req: StackGeneratorRequest, auth=Depends(verify_api_key)):
    try:
        generator = StackGenerator()
        recommendation = generator.generate_stack_recommendation(
            req.project_type,
            req.requirements,
            req.preferences
        )
        return {
            "recommendation": recommendation,
            "success": True
        }
    except Exception as e:
        print(f"Error in stack generator: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)