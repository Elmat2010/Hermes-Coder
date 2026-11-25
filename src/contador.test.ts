import { describe, expect, it } from "vitest";
import { contar, describir } from "./contador";

describe("contar", () => {
  it("texto vacío da cero", () => {
    expect(contar("   ")).toEqual({ palabras: 0, caracteres: 3, minutosLectura: 0 });
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
    expect(describir({ palabras: 2, caracteres: 10, minutosLectura: 1 })).toBe("2 palabras · 10 caracteres · 1 min de lectura");
  });
});
