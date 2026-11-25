# AGENTS.md — practica-taller2

## Qué es
Proyecto de PRÁCTICA del taller: un contador de palabras en español (Vite + TypeScript, sin framework).
Sirve para aprender el flujo Hermes → Pi → revisión → PR → CI. Se despliega (opcional) en Netlify.

## Stack
Vite 7 · TypeScript 5.9 (strict) · Vitest 3 · Playwright (E2E en GitHub Actions) · Node 22+

## Comandos
- Instalar: `npm ci`
- **Verificar (definición de terminado)**: `./scripts/verify.sh` → tipos + pruebas + build
- Pruebas unitarias: `npm test` (archivos `src/**/*.test.ts`)
- E2E: `e2e/*.spec.ts` → corren en GitHub Actions. En la tablet solo con `E2E_LOCAL=1 ./scripts/verify.sh`.

## Mapa del código
- `src/contador.ts` lógica pura (aquí van las reglas de negocio; 100 % probada)
- `src/main.ts` conexión con el DOM (mínima)
- `src/estilo.css` estilos · `index.html` estructura
- `e2e/` recorridos de usuario (Playwright)

## Convenciones
- Lógica en funciones puras dentro de `src/*.ts` con su `*.test.ts` al lado; `main.ts` solo conecta.
- Textos de la interfaz en español. Accesible: cada control con `<label>` o texto visible.
- Cambios pequeños; sin dependencias nuevas salvo que la tarjeta lo pida.

## Prohibido
- Tocar `.github/workflows/`, `scripts/verify.sh`, `vite.config.ts` o `tsconfig.json` sin que la tarjeta lo pida.
- Desactivar o debilitar pruebas. Usar `any` para "arreglar" tipos.

## Entorno
Termux (Android, 6 GB RAM): rutas relativas, sin servidores en segundo plano, un proceso pesado a la vez.
