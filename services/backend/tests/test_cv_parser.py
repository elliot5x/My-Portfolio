from src.extraction.cv_parser import agrupar_experiencias


def test_agrupar_experiencias_descarta_resumo_e_une_atribuicoes():
    linhas = [
        "Desenvolvedor Backend focado no ecossistema .NET.",
        "Estagiário de TI — Prefeitura da Estância de Atibaia — Jun/2024 – Dez/2025",
        "Atuação em infraestrutura e suporte técnico.",
        "Desenvolvedor .NET — Empresa Exemplo — Jan/2023 – Mai/2024",
        "Desenvolvimento de APIs RESTful.",
    ]

    experiencias = agrupar_experiencias(linhas)

    assert experiencias == [
        "Estagiário de TI — Prefeitura da Estância de Atibaia — Jun/2024 – Dez/2025\nAtuação em infraestrutura e suporte técnico.",
        "Desenvolvedor .NET — Empresa Exemplo — Jan/2023 – Mai/2024\nDesenvolvimento de APIs RESTful.",
    ]
