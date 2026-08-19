import shutil
from fastapi import FastAPI, UploadFile, File
from pathlib import Path
from src.parsers.pdf_reader import extracao_padrao
from src.extraction.cv_parser import text_to_join

app = FastAPI()

@app.post("/api/upload-cv/")
async def upload_cv(file: UploadFile = File(...)):
    temp_path = Path(f"temp_{file.filename}")
    with temp_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        raw_text = extracao_padrao(temp_path)
        json_data = text_to_join(raw_text)
        return {"status": "sucesso", "dados": json_data}
    finally:
        if temp_path.exists():
            temp_path.unlink()