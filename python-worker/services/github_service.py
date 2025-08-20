import httpx
import os
import re

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

async def fetch_repo_metadata(repo_url: str):
    owner, repo = extract_owner_repo(repo_url)
    
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}",
            headers={"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
        )
        res.raise_for_status()
        return res.json()

async def fetch_important_files(repo_url: str):
    owner, repo = extract_owner_repo(repo_url)
    
    async with httpx.AsyncClient() as client:
        # Get repository contents (root level)
        res = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contents",
            headers={"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
        )
        
        if res.status_code == 200:
            contents = res.json()
            # Return just the file names for now
            return [item['name'] for item in contents if item['type'] == 'file']
        return []

def extract_owner_repo(repo_url: str):
    # Handle various GitHub URL formats
    match = re.search(r"github\.com[/:]([^/]+)/([^/]+?)(?:\.git)?$", repo_url)
    if match:
        return match.group(1), match.group(2)
    raise ValueError(f"Invalid GitHub URL: {repo_url}")