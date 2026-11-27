import { contar, describir, excedeLimite } from "./contador";
import "./estilo.css";

const texto = document.querySelector<HTMLTextAreaElement>("#texto")!;
const resultado = document.querySelector<HTMLParagraphElement>("#resultado")!;
const limpiar = document.querySelector<HTMLButtonElement>("#limpiar")!;

function actualizar(): void {
  const valor = texto.value;
  const excedido = excedeLimite(valor);
  const resumen = describir(contar(valor));
  resultado.classList.toggle("excedido", excedido);
  resultado.textContent = excedido ? `${resumen} · ⚠ más de 280 caracteres` : resumen;
}

texto.addEventListener("input", actualizar);
limpiar.addEventListener("click", () => {
  texto.value = "";
  actualizar();
  texto.focus();
});
actualizar();
