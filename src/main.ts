import { contar, describir } from "./contador";
import "./estilo.css";

const texto = document.querySelector<HTMLTextAreaElement>("#texto")!;
const resultado = document.querySelector<HTMLParagraphElement>("#resultado")!;
const limpiar = document.querySelector<HTMLButtonElement>("#limpiar")!;

function actualizar(): void {
  resultado.textContent = describir(contar(texto.value));
}

texto.addEventListener("input", actualizar);
limpiar.addEventListener("click", () => {
  texto.value = "";
  actualizar();
  texto.focus();
});
actualizar();
