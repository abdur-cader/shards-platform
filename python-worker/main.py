# main.py
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from models import ReadmeRequest, ReadmeResponse  # Remove the dot
from services.readme_builder import generate_readme  # Remove the dot

import os

app = FastAPI()

API_KEY = "supersecretkey123" # os.getenv("WORKER_API_KEY")

def verify_api_key(request: Request):
    key = request.headers.get("X-API-Key")
    if not key or key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@app.post("/readme-builder", response_model=ReadmeResponse)
async def readme_builder(req: ReadmeRequest, auth=Depends(verify_api_key)):
    try:
        readme_json = await generate_readme(req)
        return {"readme_json": readme_json}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)