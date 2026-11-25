import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright para el taller.
 * - GitHub Actions: navegador descargado por `npx playwright install` (normal).
 * - Tablet (Termux): usa el Chromium del sistema vía CHROMIUM_PATH y PLAYWRIGHT_BROWSERS_PATH=0
 *   (scripts/verify.sh lo hace solo con E2E_LOCAL=1).
 * - BASE_URL: si existe (p.ej. preview de Netlify) se prueba contra esa URL; si no, levanta `vite preview`.
 * - Sin reintentos automáticos: si un test falla, se investiga (¿falló la app o el test?).
 */
const BASE_URL = process.env.BASE_URL;
const CHROMIUM_PATH = process.env.CHROMIUM_PATH;
const enCI = !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  retries: 0,
  workers: enCI ? 2 : 1,
  forbidOnly: enCI,
  reporter: enCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL || "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: CHROMIUM_PATH
          ? { executablePath: CHROMIUM_PATH, args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] }
          : {},
      },
    },
    {
      name: "movil",
      use: { ...devices["Pixel 7"] },
      grepInvert: CHROMIUM_PATH ? /.*/ : undefined, // en la tablet solo corre el proyecto "chromium"
    },
  ],
  webServer: BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run preview -- --port 4173 --strictPort --host 127.0.0.1",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !enCI,
        timeout: 180_000,
      },
});
