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

// Caixa em volta de Juiz de Fora (oeste, norte, leste, sul) para a busca não sugerir rua de outra cidade.
const CAIXA_JF = "-43.52,-21.62,-43.22,-21.88";

export function lerSugestoes(lista) {
  if (!Array.isArray(lista)) return [];
  const vistos = new Set();
  return lista
    .map((item) => {
      const a = item.address || {};
      const rua = a.road || a.pedestrian || a.footway || item.name || "";
      const bairro = a.suburb || a.neighbourhood || a.quarter || a.city_district || "";
      return { rua, bairro, lat: Number(item.lat), lng: Number(item.lon) };
    })
    .filter((s) => {
      const chave = `${s.rua}|${s.bairro}`.toLowerCase();
      if (!s.rua || !Number.isFinite(s.lat) || vistos.has(chave)) return false;
      vistos.add(chave);
      return true;
    });
}

// Sugestões enquanto o motorista digita o nome da rua. Mesma fila de 1 pedido por segundo.
export async function buscarEnderecos(texto) {
  const termo = String(texto || "").trim();
  if (termo.length < 3) return [];
  const chave = `sugestoes:${termo.toLowerCase()}`;
  if (cache.has(chave)) return cache.get(chave);
  await aguardarVez();
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=br&bounded=1" +
    `&viewbox=${CAIXA_JF}&q=${encodeURIComponent(termo)}`;
  const sugestoes = lerSugestoes(await obterJson(url, { headers: CABECALHOS, servico: "A busca de endereço" }));
  cache.set(chave, sugestoes);
  return sugestoes;
}

// Nome da rua e do bairro de um ponto do mapa (para o ponto de encontro sugerido).
export async function enderecoDoPonto(lat, lng) {
  const chave = `reverso:${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (cache.has(chave)) return cache.get(chave);
  await aguardarVez();
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&addressdetails=1&lat=${lat}&lon=${lng}`;
  const dados = await obterJson(url, { headers: CABECALHOS, servico: "O mapa" });
  const [primeiro] = lerSugestoes([{ ...dados, lat: String(lat), lon: String(lng) }]);
  const endereco = primeiro || { rua: "", bairro: "", lat, lng };
  cache.set(chave, endereco);
  return endereco;
}
