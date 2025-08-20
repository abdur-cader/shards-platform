# services/readme_builder.py
from models import ReadmeRequest  # Remove the dots
from services.github_service import fetch_repo_metadata, fetch_important_files  # Remove the dots
from services.openai_service import generate_readme_from_context  # Remove the dots

async def generate_readme(req: ReadmeRequest):
    # 1. Fetch repo metadata
    repo_meta = await fetch_repo_metadata(req.github_repo)
    
    # 2. Fetch important files
    files = await fetch_important_files(req.github_repo)
    
    # 3. Build context for OpenAI
    context = {
        'repo_meta': repo_meta,
        'files': files,
        'user_input': {
            'description': req.user_input.description,
            'features': req.user_input.features
        },
        'metadata': req.metadata.dict()
    }
    
    # 4. Generate README with OpenAI
    readme_json = await generate_readme_from_context(context)
    
    return readme_json