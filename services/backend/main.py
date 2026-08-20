import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from src.parsers.pdf_reader import extracao_padrao
from src.extraction.cv_parser import text_to_json
from src.api.github_api import fetch_github_repos

app = FastAPI(
    title="MyPortfolio API",
    description="API para parsing de currículo LinkedIn e integração com GitHub para geração de portfólios",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.post("/api/v1/curriculo/parse", tags=["Currículo"])
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

@app.get("/api/v1/github/repos", tags=["GitHub"])
async def get_github_repos(username: str):
    repos = await fetch_github_repos(username)
    return {
        "status": "sucesso",
        "total_repos": len(repos),
        "repos": repos
    }