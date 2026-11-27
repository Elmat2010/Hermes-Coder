export interface Estadisticas {
  palabras: number;
  caracteres: number;
  minutosLectura: number;
  parrafos: number;
}

/** Velocidad media de lectura en español (palabras por minuto). */
export const PALABRAS_POR_MINUTO = 200;

export function contar(texto: string): Estadisticas {
  const limpio = texto.trim();
  const palabras = limpio === "" ? 0 : limpio.split(/\s+/u).length;
  const parrafos = texto.split(/\n\s*\n/u).filter((bloque) => bloque.trim() !== "").length;
  return {
    palabras,
    caracteres: texto.length,
    minutosLectura: Math.ceil(palabras / PALABRAS_POR_MINUTO),
    parrafos,
  };
}

export function excedeLimite(texto: string, limite = 280): boolean {
  return texto.length > limite;
}

export function describir(e: Estadisticas): string {
  return `${e.palabras} palabras · ${e.caracteres} caracteres · ${e.parrafos} párrafos · ${e.minutosLectura} min de lectura`;
}
