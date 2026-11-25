import { test, expect } from "@playwright/test";

/** Recorrido de usuario: escribe un texto, ve el conteo, limpia. */
test("recorrido: el usuario escribe y ve el conteo actualizado", async ({ page }) => {
  await page.goto("/");
  const caja = page.getByLabel("Escribe o pega tu texto");
  await caja.fill("Hola mundo desde la tablet");
  await expect(page.locator("#resultado")).toHaveText("5 palabras · 26 caracteres · 1 min de lectura");
  await page.getByRole("button", { name: "Limpiar" }).click();
  await expect(caja).toHaveValue("");
  await expect(page.locator("#resultado")).toHaveText("0 palabras · 0 caracteres · 0 min de lectura");
});
