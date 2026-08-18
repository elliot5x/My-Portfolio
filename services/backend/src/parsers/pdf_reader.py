from pathlib import Path
from pypdf import PdfReader

def extraction_raw_text(pdf_path: str | Path) -> str:
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {path}")

    reader = PdfReader(path)
    pages_text = []

    for index, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            pages_text.append(text)

    return "\n--- QUEBRA DE PAGINA ---\n".join(pages_text)

if __name__ == "__main__":
    test_file = Path("PDF") # Coloque um arquivo do tipo PDF aqui.

    if test_file.exists():
        conteudo = extraction_raw_text(test_file)
        print("=== TEXTO EXTRAÍDO COM SUCESSO ===")
        print(conteudo[:500])
    else:
        print(f"Coloque um arquivo '{test_file.name}' em {Path.cwd()} para testar.")