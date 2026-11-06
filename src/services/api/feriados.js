import { lerFeriadosCache, salvarFeriadosCache } from "../localStore";
import { obterJson } from "./http";

// Data local no formato AAAA-MM-DD, igual ao da BrasilAPI.
export function diaLocal(data) {
  const d = new Date(data);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function feriadoNaLista(lista, data) {
  const dia = diaLocal(data);
  const achado = (lista || []).find((feriado) => feriado.date === dia);
  return achado ? { nome: achado.name } : null;
}

// Um pedido por ano; a lista fica guardada no aparelho.
export async function feriadoNaData(data) {
  const ano = new Date(data).getFullYear();
  let lista = await lerFeriadosCache(ano);
  if (!lista) {
    lista = await obterJson(`https://brasilapi.com.br/api/feriados/v1/${ano}`, { servico: "A consulta de feriados" });
    await salvarFeriadosCache(ano, lista);
  }
  return feriadoNaLista(lista, data);
}
