import spacy
from spacy.training.example import Example
import random
import json
from pathlib import Path
import kagglehub
import warnings

warnings.filterwarnings("ignore")

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_OUTPUT_DIR = BASE_DIR / "models" / "cv_ner_model_global"
CORRECOES_PATH = BASE_DIR / "dataset" / "correcoes.jsonl"


def _parsear_anotacoes(texto: str, anotacoes: list) -> tuple:
    entidades_temp = []
    for ent in anotacoes:
        label_list = ent.get('label')
        pontos = ent.get('points')
        if not (label_list and pontos):
            continue
        label = label_list[0]
        inicio = pontos[0].get('start')
        fim = pontos[0].get('end') + 1

        span_text = texto[inicio:fim]
        while span_text and span_text[0].isspace():
            inicio += 1
            span_text = texto[inicio:fim]
        while span_text and span_text[-1].isspace():
            fim -= 1
            span_text = texto[inicio:fim]

        if inicio < fim:
            entidades_temp.append((inicio, fim, label))

    entidades_temp.sort(key=lambda x: (x[1] - x[0]), reverse=True)

    entidades_validas = []
    caracteres_ocupados = set()
    for inicio, fim, label in entidades_temp:
        intervalo = set(range(inicio, fim))
        if not intervalo.intersection(caracteres_ocupados):
            entidades_validas.append((inicio, fim, label))
            caracteres_ocupados.update(intervalo)

    return entidades_validas


def carregar_dados_kaggle(caminho_json):
    train_data = []
    with open(caminho_json, 'r', encoding='utf-8') as f:
        for linha in f:
            linha = linha.strip()
            if not linha:
                continue
            item = json.loads(linha)
            texto = item.get('content', '')
            anotacoes = item.get('annotation')
            if not anotacoes:
                continue
            
            entidades_validas = _parsear_anotacoes(texto, anotacoes)
            if entidades_validas:
                train_data.append((texto, {"entities": entidades_validas}))
    return train_data


def carregar_dados_correcoes(caminho_jsonl: Path):
    train_data = []
    if not caminho_jsonl.exists():
        return train_data
    with open(caminho_jsonl, 'r', encoding='utf-8') as f:
        for linha in f:
            linha = linha.strip()
            if not linha:
                continue
            item = json.loads(linha)
            texto = item.get('content', '')
            anotacoes = item.get('annotation')
            if not anotacoes:
                continue
            entidades_validas = _parsear_anotacoes(texto, anotacoes)
            if entidades_validas:
                train_data.append((texto, {"entities": entidades_validas}))
    return train_data


def treinar_modelo():
    nlp = spacy.blank("pt")
    ner = nlp.add_pipe("ner")

    path = kagglehub.dataset_download("dataturks/resume-entities-for-ner")
    caminho_json = f"{path}/Entity Recognition in Resumes.json"

    train_data = carregar_dados_kaggle(caminho_json)

    dados_correcoes = carregar_dados_correcoes(CORRECOES_PATH)
    if dados_correcoes:
        print(f"Incluindo {len(dados_correcoes)} exemplos de correção no treino.")
        train_data.extend(dados_correcoes)

    for _, annotations in train_data:
        for ent in annotations.get("entities"):
            ner.add_label(ent[2])

    optimizer = nlp.begin_training()

    for itn in range(50):
        random.shuffle(train_data)
        losses = {}
        for text, annotations in train_data:
            doc = nlp.make_doc(text)
            try:
                example = Example.from_dict(doc, annotations)
                nlp.update([example], sgd=optimizer, losses=losses)
            except Exception:
                continue

    MODEL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    nlp.to_disk(MODEL_OUTPUT_DIR)
    print(f"[treinamento_ner] Modelo treinado e salvo em: {MODEL_OUTPUT_DIR}")


if __name__ == "__main__":
    treinar_modelo()