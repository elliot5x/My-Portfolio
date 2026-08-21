import pdfplumber
from pathlib import Path

MAX_PAGINAS = 20

def extrair_texto_base(pdf_path: str | Path) -> str:
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {path}")

    text_content = []
    with pdfplumber.open(path) as pdf:
        if len(pdf.pages) > MAX_PAGINAS:
            raise ValueError(
                f"PDF tem {len(pdf.pages)} páginas; limite máximo é {MAX_PAGINAS}."
            )
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                text_content.append(text)

    return "\n--- QUEBRA DE PAGINA ---\n".join(text_content)

def extracao_padrao(pdf_path: str | Path) -> str:
    return extrair_texto_base(pdf_path)

def extracao_linkedin(pdf_path: str | Path) -> str:
    texto_bruto = extrair_texto_base(pdf_path)
    return texto_bruto