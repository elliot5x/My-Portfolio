import os
import re
import httpx
from fastapi import HTTPException, status

USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$')

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

async def fetch_github_repos(username: str) -> list[dict]:
    if not USERNAME_PATTERN.match(username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nome de usuário do GitHub inválido."
        )

    url = f"https://api.github.com/users/{username}/repos?sort=updated&direction=desc"    
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "MyPortfolio-App"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=10.0)
            
            if response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuário do GitHub '{username}' não encontrado."
                )
            
            response.raise_for_status()
            repos_raw = response.json()

            sanitized_repos = [
                {
                    "name": repo.get("name"),
                    "description": repo.get("description") or "Sem descrição fornecida.",
                    "html_url": repo.get("html_url"),
                    "language": repo.get("language") or "Outro",
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "updated_at": repo.get("updated_at"),
                }
                for repo in repos_raw
                if not repo.get("fork") and repo.get("name").lower() != username.lower()
            ]

            return sanitized_repos

        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail="Erro ao consultar a API do GitHub."
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Falha de conexão com o GitHub: {exc}"
            )