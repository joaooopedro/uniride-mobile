import { obterJson } from "./http";

export function lerOsrm(dados) {
  const rota = dados?.routes?.[0];
  if (dados?.code !== "Ok" || !rota) return null;
  return {
    distanciaKm: Math.round(rota.distance / 100) / 10,
    duracaoMin: Math.max(1, Math.round(rota.duration / 60)),
    // GeoJSON vem como [lng, lat]; o app usa [lat, lng].
    linha: rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
  };
}

export async function calcularRota(origem, destino) {
  const pontos = `${origem.lng},${origem.lat};${destino.lng},${destino.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${pontos}?overview=simplified&geometries=geojson`;
  const rota = lerOsrm(await obterJson(url, { servico: "O cálculo de rota" }));
  if (!rota) throw new Error("Não foi possível traçar a rota entre os dois pontos.");
  return rota;
}
