import { test, expect } from "@playwright/test";

/**
 * Pruebas de HUMO (@humo): rápidas, corren en la tablet con E2E_LOCAL=1 y siempre en CI.
 * Las pruebas de RECORRIDO DE USUARIO van en archivos aparte (una por criterio importante),
 * p.ej. e2e/recorrido-test-de-escritura.spec.ts — ver la plantilla comentada al final.
 */

test("@humo la página carga sin errores de JavaScript", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errores.push(m.text());
  });
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
  expect(errores, `Errores en consola:\n${errores.join("\n")}`).toEqual([]);
});

test("@humo todos los botones tienen nombre accesible", async ({ page }) => {
  // Lección del video: un botón "X" sin nombre hizo fallar al agente de pruebas.
  await page.goto("/");
  const sinNombre = await page.locator("button, [role=button]").evaluateAll((els) =>
    els
      .filter((el) => {
        const nombre = el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent?.trim();
        const visible = (el as HTMLElement).offsetParent !== null;
        return visible && !nombre;
      })
      .map((el) => el.outerHTML.slice(0, 120)),
  );
  expect(sinNombre, `Botones sin nombre:\n${sinNombre.join("\n")}`).toEqual([]);
});

/* ── Plantilla de recorrido de usuario ─────────────────────────────────────────
test("recorrido: el usuario completa un test de escritura y ve su resultado", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /empezar/i }).click();
  await page.keyboard.type("texto de ejemplo");
  await expect(page.getByText(/palabras por minuto/i)).toBeVisible();
  // Estados intermedios importan: una tecla mal escrita NO debe quedar en verde
  // await expect(page.locator('[data-tecla="x"]')).not.toHaveClass(/correcta/);
});
──────────────────────────────────────────────────────────────────────────────── */
