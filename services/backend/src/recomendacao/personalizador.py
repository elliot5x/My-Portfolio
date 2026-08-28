from collections import Counter

from src.schemas.schemas import CurriculoData, GitHubRepo

MAPA_SKILL_AREA: dict[str, str] = {}


def definir_mapa_skill_area(mapa: dict[str, str]) -> None:
    global MAPA_SKILL_AREA
    MAPA_SKILL_AREA = mapa


def inferir_area(habilidades: list[str]) -> str | None:
    contagem = Counter()
    for skill in habilidades:
        area = MAPA_SKILL_AREA.get(skill.lower())
        if area:
            contagem[area] += 1

    if not contagem:
        return None

    mais_comuns = contagem.most_common()
    maior_contagem = mais_comuns[0][1]
    empatados = [area for area, qtd in mais_comuns if qtd == maior_contagem]
    return empatados[0] if len(empatados) == 1 else None


def linguagens_mais_usadas(repos: list[GitHubRepo], top_n: int = 3) -> list[str]:
    contagem = Counter(
        repo.language for repo in repos if repo.language and repo.language != "Outro"
    )
    return [linguagem for linguagem, _ in contagem.most_common(top_n)]


def melhores_repos(repos: list[GitHubRepo], top_n: int = 3) -> list[GitHubRepo]:
    return sorted(repos, key=lambda r: (r.stars, r.updated_at), reverse=True)[:top_n]


def separar_skills_confirmadas(habilidades: list[str], linguagens_usadas: list[str]) -> tuple[list[str], list[str]]:
    linguagens_lower = {l.lower() for l in linguagens_usadas}
    confirmadas = [s for s in habilidades if s.lower() in linguagens_lower]
    so_citadas = [s for s in habilidades if s not in confirmadas]
    return confirmadas, so_citadas


def gerar_personalizacao(curriculo: CurriculoData, repos: list[GitHubRepo]) -> dict:
    habilidades = curriculo.habilidades or []
    linguagens = linguagens_mais_usadas(repos)
    confirmadas, so_citadas = separar_skills_confirmadas(habilidades, linguagens)

    return {
        "area_inferida": inferir_area(habilidades),
        "linguagens_mais_usadas": linguagens,
        "skills_confirmadas": confirmadas,
        "skills_apenas_citadas": so_citadas,
        "melhores_repos": [r.name for r in melhores_repos(repos)],
        "editado_manualmente": False,
    }