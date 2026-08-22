import asyncio
import shutil
import uuid
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from src.schemas.schemas import CurriculoResponse, GitHubResponse
from src.parsers.pdf_reader import extracao_padrao
from src.extraction.cv_parser import text_to_json
from src.api.github_api import fetch_github_repos

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="My-Portfolio API",
    description="API para parsing de currículo LinkedIn e integração com GitHub para geração de portfólios",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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

MAX_FILE_SIZE = 5 * 1024 * 1024  # Limite de 5MB

@app.post("/api/v1/curriculo/parse", tags=["Currículo"], response_model=CurriculoResponse)
@limiter.limit("5/minute")
async def upload_cv(request: Request, file: UploadFile = File(...)):
    file.file.seek(0, 2)
    file_size = file.file.tell()
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Arquivo muito grande. Limite é de 5MB.")
    
    file.file.seek(0)
    
    magic_bytes = file.file.read(5)
    if magic_bytes != b"%PDF-":
        raise HTTPException(status_code=415, detail="Formato inválido. O arquivo deve ser um PDF real.")
        
    file.file.seek(0)
    
    temp_path = Path(f"temp_{uuid.uuid4().hex}.pdf")
    with temp_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        try:
            raw_text = await asyncio.to_thread(extracao_padrao, temp_path)
        except Exception:
            raise HTTPException(
                status_code=415,
                detail="Não foi possível ler o arquivo como PDF. Ele pode estar corrompido ou não ser um PDF válido."
            )
        json_data = await text_to_json(raw_text)
        return {"status": "sucesso", "dados": json_data}
    finally:
        if temp_path.exists():
            temp_path.unlink()

@app.get("/api/v1/github/repos", tags=["GitHub"], response_model=GitHubResponse)
@limiter.limit("10/minute")
async def get_github_repos(request: Request, username: str):
    repos = await fetch_github_repos(username)
    return {
        "status": "sucesso",
        "total_repos": len(repos),
        "repos": repos
    }