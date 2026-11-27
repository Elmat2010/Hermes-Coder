import { describe, expect, expectTypeOf, it } from "vitest";
import { contar, describir, type Estadisticas } from "./contador";

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

describe("describir", () => {
  it("genera el texto visible", () => {
    expect(describir({ palabras: 2, caracteres: 10, minutosLectura: 1, parrafos: 3 })).toBe(
      "2 palabras · 10 caracteres · 3 párrafos · 1 min de lectura",
    );
  });
});
