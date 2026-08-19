import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def text_to_join(raw_text: str) -> dict:
    if len(raw_text) < 50:
        return {"erro": "Texto insuficiente para analisar"}

    prompt = f"""Você é um assistente especializado em extração de dados de currículos.
    Analise o texto bruto do currículo abaixo e extraia as informações em formato JSON estrito.
    
    O JSON deve conter exatamente estas chaves:
    - "nome": string com o nome completo
    - "email": string com o email de contato
    - "skills": lista de strings com as tecnologias e habilidades
    - "experiencia": lista de objetos, cada um com "cargo", "empresa" e "periodo"
    - "objetivo": string com o cargo alvo ou resumo
    
    Retorne APENAS o JSON válido, sem formatação markdown (como ```json) ou textos adicionais.

    Texto do currículo:
    {raw_text}"""

    try:
        model = genai.GenerativeModel("gemini-3.7-flash")
        response = model.generate_content(prompt)

        texto_limpo = response.text.replace('```json', '').replace('```', '').strip()


        cv_data = json.loads(texto_limpo)
        return cv_data
    except Exception as e:
        print(f"Erro na API da IA: {e}")
        return {"erro": "Falha ao processar o currículo com a IA"}