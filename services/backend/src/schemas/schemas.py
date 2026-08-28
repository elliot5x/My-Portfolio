from pydantic import BaseModel
from typing import List, Optional

class GitHubRepo(BaseModel):
    name: str
    description: Optional[str] = None
    html_url: str
    language: Optional[str] = None
    stars: int
    forks: int
    updated_at: str

class GitHubResponse(BaseModel):
    status: str
    total_repos: int
    repos: List[GitHubRepo]

class CurriculoData(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    telefone: Optional[str] = None
    habilidades: List[str] = []
    experiencias: List[str] = []

class CurriculoResponse(BaseModel):
    status: str
    dados: CurriculoData

class PersonalizacaoRequest(BaseModel):
    curriculo: CurriculoData
    repos: List[GitHubRepo]

class CardPersonalizado(BaseModel):
    area_inferida: Optional[str] = None
    linguagens_mais_usadas: List[str] = []
    skills_confirmadas: List[str] = []
    skills_apenas_citadas: List[str] = []
    melhores_repos: List[str] = []
    editado_manualmente: bool = False

class PersonalizacaoResponse(BaseModel):
    status: str
    dados: CardPersonalizado