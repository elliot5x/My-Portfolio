import shutil
from fastapi import FastAPI, UploadFile, File
from pathlib import Path
from src.parsers.pdf_reader import extracao_padrao
from src.extraction.cv_parser import text_to_json
from src.api.github_api import fetch_github_repos
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload-cv/")
async def upload_cv(file: UploadFile = File(...)):
    temp_path = Path(f"temp_{file.filename}")
    with temp_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        raw_text = extracao_padrao(temp_path)
        json_data = await text_to_json(raw_text)
        return {"status": "sucesso", "dados": json_data}
    finally:
        if temp_path.exists():
            temp_path.unlink()

@app.get("/api/github/{username}")
async def get_github_repos(username: str):
    repos = await fetch_github_repos(username)
    return {
        "status": "sucesso",
        "total_repos": len(repos),
        "repos": repos
    }