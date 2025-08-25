# github_service.py
import httpx
import os
import re
from typing import Dict, Any, Optional

class RepoAccessError(Exception):
    pass

async def fetch_repo_metadata(repo_url: str, github_token: Optional[str] = None):
    owner, repo = extract_owner_repo(repo_url)
    
    headers = {}
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"  # Changed from "token" to "Bearer"
        print(f"Using GitHub token for authentication: {github_token[:10]}...")  # Debug log
    elif os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {os.getenv('GITHUB_TOKEN')}"
        print("Using environment GITHUB_TOKEN")
    else:
        print("No GitHub token provided, making unauthenticated request")
    
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(
                f"https://api.github.com/repos/{owner}/{repo}",
                headers=headers
            )
            
            print(f"GitHub API response status: {res.status_code}")
            
            if res.status_code == 401:
                print("GitHub API returned 401 Unauthorized - token may be invalid or expired")
                print(f"Response headers: {dict(res.headers)}")
                
            if res.status_code in (403, 404):
                raise RepoAccessError(
                    "The original GitHub Repository is private or inaccessible. Please make it public or select a different Shard."
                )
            
            res.raise_for_status()
            return res.json()
            
        except httpx.HTTPStatusError as e:
            print(f"GitHub API error: {e}")
            print(f"Response text: {e.response.text}")
            raise RepoAccessError(f"GitHub API error: {e}")

async def fetch_important_files(repo_url: str, github_token: Optional[str] = None):
    owner, repo = extract_owner_repo(repo_url)
    
    headers = {}
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"
    elif os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {os.getenv('GITHUB_TOKEN')}"
    
    async with httpx.AsyncClient() as client:
        # Get repository contents (root level)
        res = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contents",
            headers=headers
        )
        
        print(f"GitHub files API response status: {res.status_code}")
        
        if res.status_code == 200:
            contents = res.json()
            # Return just the file names for now
            return [item['name'] for item in contents if item['type'] == 'file']
        return []

# In github_service.py, improve the extract_code_snippets function:
async def extract_code_snippets(repo_url: str, files: list, github_token: Optional[str] = None):
    owner, repo = extract_owner_repo(repo_url)
    
    headers = {}
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"
    elif os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {os.getenv('GITHUB_TOKEN')}"
    
    snippets = {}
    async with httpx.AsyncClient() as client:
        # Prioritize files that are more likely to contain meaningful code
        priority_files = [f for f in files if any(f.endswith(ext) for ext in 
                         ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.json', '.yaml', '.yml'])]
        
        for file in priority_files[:8]:  # Limit to 8 most relevant files
            try:
                res = await client.get(
                    f"https://api.github.com/repos/{owner}/{repo}/contents/{file}",
                    headers=headers,
                    timeout=10.0
                )
                
                if res.status_code == 200:
                    content_data = res.json()
                    if 'content' in content_data and content_data.get('type') == 'file':
                        # Decode base64 content
                        import base64
                        content = base64.b64decode(content_data['content']).decode('utf-8')
                        
                        # Only include meaningful code (not empty or just comments)
                        if content.strip() and not content.strip().startswith('#'):
                            snippets[file] = content[:800]  # Slightly shorter snippets
                            
            except Exception as e:
                print(f"Error fetching {file}: {e}")
                continue
    
    return snippets if snippets else "No code snippets could be extracted"

def extract_owner_repo(repo_url: str):
    # Handle various GitHub URL formats
    match = re.search(r"github\.com[/:]([^/]+)/([^/]+?)(?:\.git)?$", repo_url)
    if match:
        return match.group(1), match.group(2)
    raise ValueError(f"Invalid GitHub URL: {repo_url}")

def normalize_github_metadata(raw_metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Extract and normalize only the fields we care about"""
    return {
        'owner': raw_metadata.get('owner', {}).get('login', ''),
        'repo_name': raw_metadata.get('name', ''),
        'description': raw_metadata.get('description', ''),
        'stars': raw_metadata.get('stargazers_count', 0),
        'forks': raw_metadata.get('forks_count', 0),
        'language': raw_metadata.get('language', ''),
        'topics': raw_metadata.get('topics', []),
        'license': raw_metadata.get('license', {}).get('name', '') if raw_metadata.get('license') else '',
        'created_at': raw_metadata.get('created_at', ''),
        'updated_at': raw_metadata.get('updated_at', ''),
        'html_url': raw_metadata.get('html_url', ''),
        'clone_url': raw_metadata.get('clone_url', '')
    }