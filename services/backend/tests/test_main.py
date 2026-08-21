from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app 

client = TestClient(app)

# ==========================
# Testes Funcionais
# ==========================
def test_get_github_repos_sucesso():
    response = client.get("/api/v1/github/repos?username=elliot5x")
    
    assert response.status_code == 200
    assert response.json()["status"] == "sucesso"
    assert "repos" in response.json()

# ==========================
# Testes de Segurança
# ==========================
def test_github_bloqueia_post():
    response = client.post("/api/v1/github/repos?username=elliot5x")
    
    assert response.status_code == 405

@patch("main.extracao_padrao")
@patch("main.text_to_json", new_callable=AsyncMock)
def test_upload_cv_sucesso(mock_text_to_json, mock_extracao):
    mock_extracao.return_value = "Texto cru do PDF"
    mock_text_to_json.return_value = {
        "nome": "Usuario Teste",
        "email": "teste@teste.com",
        "telefone": "11999999999",
        "habilidades": ["Linux", "Python"],
        "experiencias": ["Teste 123"]
    }
    
    fake_pdf = b"%PDF-1.4\n%fake pdf content for testing"
    
    response = client.post(
        "/api/v1/curriculo/parse",
        files={"file": ("curriculo_teste.pdf", fake_pdf, "application/pdf")}
    )
    
    assert response.status_code == 200
    assert response.json()["status"] == "sucesso"
    assert response.json()["dados"]["nome"] == "Usuario Teste"

def test_upload_cv_rejeita_arquivo_sem_magic_byte():
    fake_file = b"isso nao e um pdf de verdade"

    response = client.post(
        "/api/v1/curriculo/parse",
        files={"file": ("fake.pdf", fake_file, "application/pdf")}
    )

    assert response.status_code == 415

@patch("main.extracao_padrao")
def test_upload_cv_rejeita_pdf_corrompido(mock_extracao):
    mock_extracao.side_effect = Exception("PDF corrompido ou ilegível")

    fake_pdf = b"%PDF-1.4\n%conteudo corrompido de proposito"

    response = client.post(
        "/api/v1/curriculo/parse",
        files={"file": ("curriculo_corrompido.pdf", fake_pdf, "application/pdf")}
    )

    assert response.status_code == 415