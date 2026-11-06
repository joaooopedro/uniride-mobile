import { obterJson } from "./http";

// Política do Nominatim: identificar o app e no máximo 1 pedido por segundo.
const CABECALHOS = { "User-Agent": "UniRide/1.0 (projeto academico)", "Accept-Language": "pt-BR" };
const cache = new Map();
let fila = Promise.resolve();
let ultimo = 0;

function aguardarVez() {
  const vez = fila.then(async () => {
    const espera = ultimo + 1000 - Date.now();
    if (espera > 0) await new Promise((resolve) => setTimeout(resolve, espera));
    ultimo = Date.now();
  });
  fila = vez.catch(() => {});
  return vez;
}

export function lerNominatim(lista) {
  const primeiro = Array.isArray(lista) ? lista[0] : null;
  if (!primeiro) return null;
  return { lat: Number(primeiro.lat), lng: Number(primeiro.lon) };
}

export async function geocodificar(endereco) {
  const chave = String(endereco || "").trim().toLowerCase();
  if (!chave) throw new Error("Informe o endereço.");
  if (cache.has(chave)) return cache.get(chave);
  await aguardarVez();
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(endereco)}`;
  const ponto = lerNominatim(await obterJson(url, { headers: CABECALHOS, servico: "O mapa" }));
  if (!ponto) throw new Error("Endereço não encontrado no mapa. Toque no mapa para marcar o ponto.");
  cache.set(chave, ponto);
  return ponto;
}
