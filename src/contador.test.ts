import { describe, expect, expectTypeOf, it } from "vitest";
import { contar, describir, excedeLimite, type Estadisticas } from "./contador";

describe("contar", () => {
  it("texto vacío da cero", () => {
    expectTypeOf<Estadisticas["parrafos"]>().toEqualTypeOf<number>();
    expect(contar("")).toEqual({ palabras: 0, caracteres: 0, minutosLectura: 0, parrafos: 0 });
  });
  it("solo espacios cuenta los caracteres pero no los párrafos", () => {
    expect(contar("   ")).toEqual({ palabras: 0, caracteres: 3, minutosLectura: 0, parrafos: 0 });
  });
  it.each([
    ["hola mundo", 1],
    ["a\n \nb", 2],
    ["\n\nhola\n\n", 1],
    ["primera línea\n\nsegunda línea", 2],
    ["solo un salto\nsin línea en blanco", 1],
  ])("cuenta los párrafos de %j", (texto, parrafos) => {
    expect(contar(texto).parrafos).toBe(parrafos);
  });
  it("cuenta palabras con espacios múltiples y saltos de línea", () => {
    expect(contar("hola   mundo\nañejo").palabras).toBe(3);
  });
  it("redondea el tiempo de lectura hacia arriba", () => {
    expect(contar("palabra ".repeat(201)).minutosLectura).toBe(2);
  });
});

describe("excedeLimite", () => {
  it.each([
    [279, false],
    [280, false],
    [281, true],
  ])("con %i caracteres y el límite por defecto devuelve %s", (longitud, esperado) => {
    expect(excedeLimite("a".repeat(longitud))).toBe(esperado);
  });

  it("respeta el límite personalizado y no avisa al igualarlo", () => {
    expect(excedeLimite("a".repeat(300), 10)).toBe(true);
    expect(excedeLimite("a".repeat(10), 10)).toBe(false);
    expect(excedeLimite("a".repeat(300), 301)).toBe(false);
  });

  it("usa la longitud de la cadena, incluidos espacios y saltos de línea", () => {
    expect(excedeLimite(" \n", 1)).toBe(true);
  });

  it("usa texto.length: un emoji de dos unidades UTF-16 supera el límite de uno", () => {
    expect(excedeLimite("😀", 1)).toBe(true);
    expect(excedeLimite("😀", 2)).toBe(false);
  });
});

describe("describir", () => {
  it("genera el texto visible", () => {
    expect(describir({ palabras: 2, caracteres: 10, minutosLectura: 1, parrafos: 3 })).toBe(
      "2 palabras · 10 caracteres · 3 párrafos · 1 min de lectura",
    );
  });
});
