#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# verify.sh — ÚNICA fuente de verdad de "terminado". Si pasa, la tarea está verificada.
# Rápido (< 3-5 min en la tablet). Lo pesado (E2E completos) corre en GitHub Actions.
#
# Variables opcionales:
#   E2E_LOCAL=1     ejecuta las pruebas @humo de Playwright con el Chromium de Termux
#   SKIP_BUILD=1    omite el build (útil si el build es muy pesado para la tablet)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
export CI="${CI:-true}"   # vitest/jest corren una vez (sin modo watch)

paso() { printf '\n▶ %s\n' "$*"; }
tiene_script() { node -e "const s=require('./package.json').scripts||{}; process.exit(s['$1']?0:1)" 2>/dev/null; }

if [ ! -f package.json ]; then
  echo "❌ No hay package.json. Adapta scripts/verify.sh a tu stack (Python, Go, etc.)."
  exit 1
fi
[ -d node_modules ] || { echo "❌ Faltan dependencias: npm ci"; exit 1; }

# 1. Calidad estática
for s in lint typecheck; do
  if tiene_script "$s"; then paso "npm run $s"; npm run "$s" --silent; fi
done
# Si no hay script typecheck pero hay TypeScript, compílalo sin emitir
if ! tiene_script typecheck && [ -f tsconfig.json ] && [ -x node_modules/.bin/tsc ]; then
  paso "tsc --noEmit"; node_modules/.bin/tsc --noEmit
fi

# 2. Pruebas unitarias
if tiene_script test; then paso "npm test"; npm test --silent; else echo "⚠ No hay script 'test' (recomendado: vitest)"; fi

# 3. Build (detecta errores que las pruebas no ven)
if [ "${SKIP_BUILD:-0}" != 1 ] && tiene_script build; then paso "npm run build"; npm run build --silent; fi

# 4. E2E de humo en la tablet (opcional; Chromium de Termux: pkg install x11-repo && pkg install chromium)
if [ "${E2E_LOCAL:-0}" = 1 ] && [ -f playwright.config.ts ]; then
  CHROMIUM_PATH="${CHROMIUM_PATH:-$(command -v chromium-browser || command -v chromium || true)}"
  if [ -n "$CHROMIUM_PATH" ]; then
    paso "Playwright @humo (Chromium del sistema: $CHROMIUM_PATH)"
    PLAYWRIGHT_BROWSERS_PATH=0 CHROMIUM_PATH="$CHROMIUM_PATH" npx playwright test --grep @humo --workers=1
  else
    echo "⚠ E2E_LOCAL=1 pero no encontré Chromium; omito E2E locales."
  fi
fi

# 5. Higiene: nada de secretos en archivos que git vaya a versionar
if command -v git >/dev/null && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  sospechosos="$(git ls-files -co --exclude-standard | grep -E '(^|/)\.env($|\.)|\.pem$|(^|/)id_(rsa|ed25519)' | grep -vE '\.(example|sample|template|ejemplo)$' || true)"
  if [ -n "$sospechosos" ]; then echo "❌ Archivos con posibles secretos sin ignorar:"; echo "$sospechosos"; exit 1; fi
  # Pruebas saltadas o enfocadas que se cuelan
  if git grep -nE '\b(it|test|describe)\.(only|skip)\(' -- '*.ts' '*.tsx' '*.js' '*.jsx' >/dev/null 2>&1; then
    echo "❌ Hay pruebas con .only/.skip:"; git grep -nE '\b(it|test|describe)\.(only|skip)\(' -- '*.ts' '*.tsx' '*.js' '*.jsx'; exit 1
  fi
fi

printf '\n✅ verify OK\n'
