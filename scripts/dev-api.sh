#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
backend_dir="$project_dir/services/backend"
python_bin="$backend_dir/.venv/bin/python"

if [[ ! -x "$python_bin" ]]; then
  echo "Ambiente do backend não encontrado em services/backend/.venv."
  echo "Execute npm run setup antes de executar npm run dev."
  exit 1
fi

cd "$backend_dir"
exec "$python_bin" -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
