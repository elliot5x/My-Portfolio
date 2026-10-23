#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backend_dir="$project_dir/services/backend"
tools_dir="$backend_dir/.tools"
uv_bin="$tools_dir/bin/uv"
venv_dir="$backend_dir/.venv"

command -v npm >/dev/null 2>&1 || {
  echo "Node.js e npm são necessários. Instale Node.js 20 ou superior e tente novamente."
  exit 1
}

echo "→ Instalando dependências do projeto..."
if [[ -f "$project_dir/package-lock.json" ]]; then
  npm --prefix "$project_dir" ci
else
  npm --prefix "$project_dir" install
fi

echo "→ Instalando dependências do frontend..."
if [[ -f "$project_dir/apps/web/package-lock.json" ]]; then
  npm --prefix "$project_dir/apps/web" ci
else
  npm --prefix "$project_dir/apps/web" install
fi

if [[ -x "$uv_bin" ]]; then
  :
elif command -v uv >/dev/null 2>&1; then
  uv_bin="$(command -v uv)"
else
  command -v curl >/dev/null 2>&1 || {
    echo "curl é necessário para preparar o ambiente Python automaticamente."
    exit 1
  }

  echo "→ Baixando o gerenciador Python local (uv)..."
  install_script="$(mktemp)"
  trap 'rm -f "$install_script"' EXIT
  curl --fail --location --proto '=https' --tlsv1.2 https://astral.sh/uv/install.sh --output "$install_script"
  mkdir -p "$tools_dir"
  UV_INSTALL_DIR="$tools_dir" UV_NO_MODIFY_PATH=1 sh "$install_script"
  uv_bin="$tools_dir/bin/uv"
fi

if [[ -x "$venv_dir/bin/python" ]]; then
  venv_version="$($venv_dir/bin/python -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
  if [[ "$venv_version" != "3.12" ]]; then
    echo "→ Recriando o ambiente Python $venv_version como Python 3.12..."
    rm -rf "$venv_dir"
  fi
fi

if [[ ! -x "$venv_dir/bin/python" ]]; then
  echo "→ Criando ambiente Python 3.12 para a API..."
  "$uv_bin" venv --python 3.12 "$venv_dir"
fi

echo "→ Instalando dependências da API..."
"$uv_bin" pip install --python "$venv_dir/bin/python" -r "$backend_dir/requirements.txt"

echo
echo "Pronto. Execute: npm run dev"
