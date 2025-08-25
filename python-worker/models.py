from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class UserInput(BaseModel):
    description: Optional[str] = ""
    features: Optional[str] = ""

class Metadata(BaseModel):
    user_id: str
    project_name: str

class ReadmeRequest(BaseModel):
    github_repo: str
    user_input: UserInput
    shard_id: str
    metadata: Metadata
    github_token: Optional[str] = None

class ReadmeResponse(BaseModel):
    readme_json: Dict[str, Any]

class RepositoryAnalysis(BaseModel):
    overall_assessment: str
    strengths: List[str]
    improvement_areas: List[str]
    readme_suggestions: List[str]
    potential_use_cases: List[str]
    technical_complexity: str

class AnalysisResponse(BaseModel):
    analysis: Dict[str, Any]
    metadata: Dict[str, Any]
    success: bool