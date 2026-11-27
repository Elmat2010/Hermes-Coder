import { test, expect } from "@playwright/test";

/** Recorrido de usuario: escribe un texto, ve el conteo, limpia. */
test("recorrido: el usuario escribe y ve el conteo actualizado", async ({ page }) => {
  await page.goto("/");
  const caja = page.getByLabel("Escribe o pega tu texto");
  await caja.fill("Hola mundo desde la tablet");
  await expect(page.locator("#resultado")).toHaveText("5 palabras · 26 caracteres · 1 párrafos · 1 min de lectura");
  await page.getByRole("button", { name: "Limpiar" }).click();
  await expect(caja).toHaveValue("");
  await expect(page.locator("#resultado")).toHaveText("0 palabras · 0 caracteres · 0 párrafos · 0 min de lectura");
});

test("recorrido: el usuario escribe dos párrafos y ve el conteo", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Escribe o pega tu texto").fill("primera línea\n\nsegunda línea");
  await expect(page.locator("#resultado")).toHaveText("4 palabras · 28 caracteres · 2 párrafos · 1 min de lectura");
});

test("recorrido: avisa al superar 280 caracteres sin bloquear la escritura", async ({ page }) => {
  await page.goto("/");
  const caja = page.getByLabel("Escribe o pega tu texto");
  const resultado = page.locator("#resultado");
  const clase = /(?:^|\s)excedido(?:\s|$)/;
  const aviso = "⚠ más de 280 caracteres";
  const colorAviso = "rgb(179, 38, 30)";
  const alLimite = "a".repeat(280);

  await caja.fill(alLimite);
  await expect(resultado).not.toHaveClass(clase);
  await expect(resultado).not.toContainText(aviso);

  await caja.press("Control+End");
  await caja.press("b");
  await expect(caja).toHaveValue(`${alLimite}b`);
  await expect(resultado).toHaveClass(clase);
  await expect(resultado).toContainText(aviso);
  await expect(resultado).toHaveCSS("color", colorAviso);

  await caja.press("c");
  await expect(caja).toHaveValue(`${alLimite}bc`);
  await expect(resultado).toContainText("282 caracteres");
  await expect(resultado).toHaveClass(clase);
  await expect(resultado).toContainText(aviso);

  await caja.press("Backspace");
  await expect(caja).toHaveValue(`${alLimite}b`);
  await expect(resultado).toHaveClass(clase);
  await expect(resultado).toContainText(aviso);

  await caja.press("Backspace");
  await expect(caja).toHaveValue(alLimite);
  await expect(resultado).not.toHaveClass(clase);
  await expect(resultado).not.toContainText(aviso);
  await expect(resultado).not.toHaveCSS("color", colorAviso);
});
