import spacy
import re
import json
from pathlib import Path
from datetime import datetime, timezone

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "models" / "cv_ner_model_global"
CORRECOES_PATH = BASE_DIR / "dataset" / "correcoes.jsonl"


def carregar_modelo():
    if MODEL_PATH.exists():
        print(f"[cv_parser] Modelo treinado carregado de: {MODEL_PATH}")
        return spacy.load(MODEL_PATH)
    print(f"[cv_parser] AVISO: modelo não encontrado em {MODEL_PATH}, usando spacy.blank('pt')")
    return spacy.blank("pt")


nlp = carregar_modelo()

SKILLS_CONHECIDAS = [
    'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'typescript',
    'html', 'css', 'react', 'node.js', 'angular', 'vue', 'spring', 'django', 'flask', 'fastapi',
    'machine learning', 'deep learning', 'big data', 'sql', 'nosql', 'mongodb',
    'postgresql', 'mysql', 'redis', 'pandas', 'tensorflow',
    'aws', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'ci/cd',
    'jenkins', 'terraform', 'ansible', 'git', 'github', 'gitlab',
    'cibersegurança', 'cybersecurity', 'lgpd', 'gdpr', 'pentest', 'soc', 'siem',
    'linux', 'bash', 'shell script', 'kali linux', 'debian', 'arch linux', 'firewall',
    'project management', 'agile', 'scrum', 'kanban'
]

_PADROES_EXPERIENCIA = [
    re.compile(r'\bexperiences?\b', re.IGNORECASE),
    re.compile(r'\bwork\s+history\b', re.IGNORECASE),
    re.compile(r'\bwork\s+experience\b', re.IGNORECASE),
    re.compile(r'\bemployment\b', re.IGNORECASE),
    re.compile(r'\bprofissiona(l|is)\b', re.IGNORECASE),
    re.compile(r'\bprofessional\b', re.IGNORECASE),
    re.compile(r'\bexperi[eê]ncias?\s*profissionais?\b', re.IGNORECASE),
    re.compile(r'\bexperi[eê]ncias?\b', re.IGNORECASE),
    re.compile(r'\bexperi[eê]ncia\b', re.IGNORECASE),
    re.compile(r'\binternships?\b', re.IGNORECASE),
    re.compile(r'\best[aá]gios?\b', re.IGNORECASE),
]
_PADROES_HABILIDADES = [
    re.compile(r'\bskills?\b', re.IGNORECASE),
    re.compile(r'\bhabilidades?\b', re.IGNORECASE),
    re.compile(r'\bcompet[eê]nc[ia]as?\b', re.IGNORECASE),
    re.compile(r'\bqualifica[cç][õo]es?\b', re.IGNORECASE),
    re.compile(r'\bqualifications?\b', re.IGNORECASE),
    re.compile(r'\btecnologias?\b', re.IGNORECASE),
    re.compile(r'\btechnologies\b', re.IGNORECASE),
    re.compile(r'\bstack\b', re.IGNORECASE),
    re.compile(r'\bferramentas?\b', re.IGNORECASE),
    re.compile(r'\btools\b', re.IGNORECASE),
    re.compile(r'\bconhecimentos?\b', re.IGNORECASE),
    re.compile(r'\bknowledge\b', re.IGNORECASE),
]
_TITULOS_GENERICOS = {
    'curriculum vitae', 'cv', 'resume', 'resumé', 'résumé', 'currículo', 'curriculo'
}


def eh_linha_de_cabecalho(linha: str) -> bool:
    linha = linha.strip()
    if not linha or len(linha) > 45:
        return False
    if linha.endswith(('.', ',', ';', ':')):
        return False
        
    linha_lower = linha.lower()
    todos_os_padroes = _PADROES_EXPERIENCIA + _PADROES_HABILIDADES
    if any(p.search(linha_lower) for p in todos_os_padroes) and len(linha.split()) <= 4:
        return True
    letras = [c for c in linha if c.isalpha()]
    if not letras:
        return False
    maiusculas = sum(1 for c in letras if c.isupper())
    return (maiusculas / len(letras)) > 0.6


def segmentar_secoes(raw_text: str) -> dict:
    secoes = {}
    secao_atual = "cabecalho"
    secoes[secao_atual] = []
    for linha in raw_text.split('\n'):
        linha_limpa = linha.strip()
        if not linha_limpa:
            continue
        if eh_linha_de_cabecalho(linha_limpa):
            secao_atual = linha_limpa.lower()
            secoes.setdefault(secao_atual, [])
        else:
            secoes[secao_atual].append(linha_limpa)
    return secoes


def extrair_blocos_experiencia(secoes: dict) -> list:
    linhas_coletadas = []
    vistos = set()
    for titulo, linhas in secoes.items():
        if any(p.search(titulo) for p in _PADROES_EXPERIENCIA):
            for l in linhas:
                if l not in vistos:
                    vistos.add(l)
                    linhas_coletadas.append(l)
    return linhas_coletadas


def _dividir_respeitando_parenteses(linha: str) -> list:
    partes, atual, profundidade = [], [], 0
    for ch in linha:
        if ch == '(':
            profundidade += 1
            atual.append(ch)
        elif ch == ')':
            profundidade = max(0, profundidade - 1)
            atual.append(ch)
        elif ch in ',;•|' and profundidade == 0:
            partes.append(''.join(atual))
            atual = []
        else:
            atual.append(ch)
    if atual:
        partes.append(''.join(atual))
    return partes


def _parece_item_de_lista(pedaco: str) -> bool:
    if not (1 < len(pedaco) <= 25):
        return False
    palavras = pedaco.split()
    if len(palavras) > 3:
        return False
    if pedaco.count('(') != pedaco.count(')'):
        return False
    return True


def extrair_habilidades_por_secao(secoes: dict) -> list:
    itens = []
    for titulo, linhas in secoes.items():
        titulo_lower = titulo.lower()
        if any(p.search(titulo_lower) for p in _PADROES_HABILIDADES):
            for linha in linhas:
                if ':' in linha:
                    linha = linha.split(':', 1)[1]
                for pedaco in _dividir_respeitando_parenteses(linha):
                    pedaco = pedaco.strip(' -•\t.')
                    if _parece_item_de_lista(pedaco):
                        itens.append(pedaco)
    return itens


def extrair_nome(linhas: list) -> str:
    ignorados = {
        'contato', 'Contato', 'contact', 'profile', 'perfil', 'curriculum vitae', 
        'cv', 'resume', 'resumé', 'résumé', 'currículo', 'curriculo', 'mobile',
        'endereço', 'address', 'telefone', 'phone'
    }
    for candidato in linhas[:15]:
        limpo = candidato.strip()
        chave = limpo.lower().strip('.:')
        if chave in ignorados or len(chave) <= 3:
            continue
        if '@' in limpo or ':' in limpo or re.search(r'\d', limpo):
            continue
        if eh_linha_de_cabecalho(limpo):
            continue
        return limpo
    return linhas[0] if linhas else ""


def extrair_telefone(raw_text: str) -> str:
    rotulo = re.search(
        r'(?:phone|tel(?:efone|\.)?|celular|mobile)\s*[:\-\/]?\s*(\(?\d{2}\)?\s*\d{4,5}[-.\s]?\d{4})',
        raw_text, re.IGNORECASE
    )
    if rotulo:
        return rotulo.group(1).strip().strip('/')
    
    nacional = re.search(r'\b(?:\+?55\s?)?(?:\([1-9]{2}\)|[1-9]{2})\s?9?[0-9]{4}[-.\s]?[0-9]{4}\b', raw_text)
    if nacional:
        return nacional.group(0).strip()
        
    generico = re.search(r'\+\d{1,3}[\d\s().-]{7,}\d', raw_text)
    if generico:
        return generico.group(0).strip()
    return ""


async def text_to_json(raw_text: str) -> dict:
    if len(raw_text) < 50:
        return {"erro": "Texto insuficiente"}

    cv_data = {
        "nome": "",
        "email": "",
        "telefone": "",
        "habilidades": [],
        "experiencias": []
    }

    email_match = re.search(r'[\w\.-]+@[\w\.-]+', raw_text)
    if email_match:
        cv_data["email"] = email_match.group(0)

    cv_data["telefone"] = extrair_telefone(raw_text)

    linhas = [linha.strip() for linha in raw_text.split('\n') if linha.strip()]
    cv_data["nome"] = extrair_nome(linhas)

    doc = nlp(raw_text)
    vistos_exp = set()
    experiencias_extraidas = []
    habilidades_extraidas = set()

    def _add_experiencia(texto_item: str):
        if texto_item not in vistos_exp:
            vistos_exp.add(texto_item)
            experiencias_extraidas.append(texto_item)

    for ent in doc.ents:
        label = ent.label_.lower()
        texto_ent = ent.text.strip()
        if label == "skills":
            habilidades_extraidas.add(texto_ent)
        elif label in ["companies worked at", "designation", "company"]:
            if len(texto_ent) > 2 and "birth" not in texto_ent.lower():
                _add_experiencia(texto_ent)

    texto_minusculo = raw_text.lower()
    for skill in SKILLS_CONHECIDAS:
        if re.search(rf'\b{re.escape(skill)}\b', texto_minusculo):
            habilidades_extraidas.add(skill.title())

    secoes = segmentar_secoes(raw_text)
    for l in extrair_blocos_experiencia(secoes):
        if len(l) > 5:
            _add_experiencia(l)
    for item in extrair_habilidades_por_secao(secoes):
        habilidades_extraidas.add(item)

    cv_data["habilidades"] = sorted(habilidades_extraidas)
    cv_data["experiencias"] = experiencias_extraidas

    return cv_data


def registrar_correcao_habilidades(texto: str, habilidades_corretas: list[str]) -> int:
    anotacoes = []
    texto_lower = texto.lower()
    for skill in habilidades_corretas:
        skill = skill.strip()
        if not skill:
            continue
        pos = texto_lower.find(skill.lower())
        if pos == -1:
            continue
        inicio, fim = pos, pos + len(skill)
        anotacoes.append({
            "label": ["Skills"],
            "points": [{"start": inicio, "end": fim - 1, "text": texto[inicio:fim]}]
        })

    if not anotacoes:
        return 0

    registro = {
        "content": texto,
        "annotation": anotacoes,
        "origem": "correcao_manual",
        "criado_em": datetime.now(timezone.utc).isoformat()
    }

    CORRECOES_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CORRECOES_PATH, 'a', encoding='utf-8') as f:
        f.write(json.dumps(registro, ensure_ascii=False) + '\n')

    return len(anotacoes)