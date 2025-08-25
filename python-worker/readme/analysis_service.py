# analysis_service.py
import os
import json
from openai import OpenAI
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import httpx
import base64

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

async def get_relevant_code_snippets(repo_url: str, github_token: Optional[str] = None) -> Dict[str, str]:
    """Extract the most relevant code snippets from a repository"""
    
    parts = repo_url.split('/')
    if len(parts) < 2:
        print(f"Invalid repo URL format: {repo_url}")
        return {"error": "Invalid repository URL format"}
    
    # Get the last two non-empty parts
    non_empty_parts = [p for p in parts if p.strip()]
    if len(non_empty_parts) < 2:
        print(f"Not enough parts in repo URL: {repo_url}")
        return {"error": "Invalid repository URL"}
    
    owner = non_empty_parts[-2]
    repo = non_empty_parts[-1]
    
    # Remove .git suffix if present
    if repo.endswith('.git'):
        repo = repo[:-4]
    
    headers = {}
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"
    elif os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {os.getenv('GITHUB_TOKEN')}"
    
    # Priority files that typically contain important code
    priority_files = [
        'main.py', 'app.py', 'index.js', 'server.js', 'app.js', 
        'src/main.py', 'src/app.js', 'src/index.js', 'lib/main.rb',
        'package.json', 'requirements.txt', 'setup.py', 'Dockerfile',
        'docker-compose.yml', '.env.example', 'config.py', 'settings.py',
        'utils.py', 'helpers.py', 'models.py', 'routes.py', 'controllers.py'
    ]
    
    snippets = {}
    
    async with httpx.AsyncClient() as client:
        for file_name in priority_files:
            if len(snippets) >= 5:  # Limit to 5 most relevant snippets
                break
                
            try:
                res = await client.get(
                    f"https://api.github.com/repos/{owner}/{repo}/contents/{file_name}",
                    headers=headers,
                    timeout=10.0
                )
                
                if res.status_code == 200:
                    file_data = res.json()
                    if file_data.get('content') and file_data.get('type') == 'file':
                        # Decode base64 content
                        content = base64.b64decode(file_data['content']).decode('utf-8')
                        
                        # Take first 300-500 characters for meaningful context
                        snippet_content = content[:500].strip()
                        if snippet_content:  # Only add if we got meaningful content
                            snippets[file_name] = snippet_content
                            
            except Exception as e:
                print(f"Error fetching {file_name}: {e}")
                continue
    
    return snippets if snippets else {"error": "No relevant code snippets found"}

async def analyze_repository_with_code(metadata: Dict[str, Any], files: list, repo_url: str, github_token: Optional[str] = None) -> Dict[str, Any]:
    """Analyze repository with actual code context for better feedback"""
    
    # Get relevant code snippets
    code_snippets = await get_relevant_code_snippets(repo_url, github_token)
    
    # Format code snippets for the prompt
    formatted_snippets = "No code snippets available"
    if code_snippets and "error" not in code_snippets:
        snippet_text = []
        for filename, content in code_snippets.items():
            # Determine language from file extension
            language = filename.split('.')[-1] if '.' in filename else 'text'
            snippet_text.append(f"📁 {filename}:\n```{language}\n{content}\n```\n")
        formatted_snippets = "\n".join(snippet_text)
    
    prompt = f"""
You are an expert software repository analyst. Analyze this GitHub repository and provide detailed, constructive feedback.

REPOSITORY OVERVIEW:
- Name: {metadata.get('repo_name', 'Unknown')}
- Owner: {metadata.get('owner', 'Unknown')}
- Description: {metadata.get('description', 'No description provided')}
- Primary Language: {metadata.get('language', 'Not specified')}
- Stars: {metadata.get('stars', 0)}
- Forks: {metadata.get('forks', 0)}
- Topics: {', '.join(metadata.get('topics', [])) or 'None'}
- Key Files: {', '.join(files[:15]) if files else 'None detected'}

CODE SNIPPETS:
{formatted_snippets}

ANALYSIS REQUEST:
Please provide a comprehensive analysis in the following JSON format:
{{
  "overall_assessment": "Detailed assessment of the repository's purpose and quality",
  "strengths": ["3-5 specific strengths based on code and structure"],
  "improvement_areas": ["3-5 actionable improvement suggestions"],
  "readme_suggestions": ["Specific README content recommendations based on actual code"],
  "potential_use_cases": ["Realistic use cases derived from the code structure"],
  "technical_complexity": "low/medium/high/expert",
  "code_quality_insights": ["2-3 observations about the code style and patterns"]
}}

Be specific, technical, and provide actionable feedback based on the actual code content.
Focus on what the code reveals about the project's purpose and quality.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a senior software architect providing detailed technical analysis. Focus on code quality, architecture patterns, and practical improvements."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        raw_response = response.choices[0].message.content
        if not raw_response:
            return {"error": "Empty response from analysis service"}
            
        analysis_result = json.loads(raw_response)
        
        return {
            "analysis": analysis_result,
            "metadata": metadata,
            "files_preview": files[:10],
            "code_snippets_used": len(code_snippets) if "error" not in code_snippets else 0,
            "snippet_files": list(code_snippets.keys()) if "error" not in code_snippets else []
        }
        
    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}

# Keep the original function for backward compatibility
async def analyze_repository(metadata: Dict[str, Any], files: list) -> Dict[str, Any]:
    """Legacy function - use analyze_repository_with_code for better analysis"""
    return await analyze_repository_with_code(metadata, files, "", None)