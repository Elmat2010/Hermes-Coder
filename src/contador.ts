export interface Estadisticas {
  palabras: number;
  caracteres: number;
  minutosLectura: number;
}

/** Velocidad media de lectura en español (palabras por minuto). */
export const PALABRAS_POR_MINUTO = 200;

export function contar(texto: string): Estadisticas {
  const limpio = texto.trim();
  const palabras = limpio === "" ? 0 : limpio.split(/\s+/u).length;
  return {
    palabras,
    caracteres: texto.length,
    minutosLectura: Math.ceil(palabras / PALABRAS_POR_MINUTO),
  };
}

export function describir(e: Estadisticas): string {
  return `${e.palabras} palabras · ${e.caracteres} caracteres · ${e.minutosLectura} min de lectura`;
}
