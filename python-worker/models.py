from pydantic import BaseModel
from typing import Optional, Dict, Any

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

class ReadmeResponse(BaseModel):
    readme_json: Dict[str, Any]
