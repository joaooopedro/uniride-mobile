import { CIDADE } from "../../utils/campi";
import { obterJson } from "./http";

// Códigos WMO do Open-Meteo agrupados em texto e ícone do Feather.
const TEMPOS = [
  { codigos: [0], descricao: "Céu limpo", icone: "sun" },
  { codigos: [1, 2], descricao: "Parcialmente nublado", icone: "cloud" },
  { codigos: [3], descricao: "Nublado", icone: "cloud" },
  { codigos: [45, 48], descricao: "Neblina", icone: "cloud" },
  { codigos: [51, 53, 55, 56, 57], descricao: "Garoa", icone: "cloud-drizzle" },
  { codigos: [61, 63, 66, 80, 81], descricao: "Chuva", icone: "cloud-rain" },
  { codigos: [65, 67, 82], descricao: "Chuva forte", icone: "cloud-rain" },
  { codigos: [71, 73, 75, 77, 85, 86], descricao: "Neve", icone: "cloud-snow" },
  { codigos: [95, 96, 99], descricao: "Tempestade", icone: "cloud-lightning" },
];

export function traduzirTempo(codigo) {
  const tempo = TEMPOS.find((t) => t.codigos.includes(codigo));
  return tempo ? { descricao: tempo.descricao, icone: tempo.icone } : { descricao: "Sem descrição", icone: "cloud" };
}

// Hora cheia em Brasília (UTC-3, sem horário de verão desde 2019), no formato do Open-Meteo.
// ponytail: fuso fixo; trocar por Intl com timeZone se o Brasil voltar a ter horário de verão.
export function horaBrasilia(data) {
  return new Date(new Date(data).getTime() - 3 * 3600e3).toISOString().slice(0, 13) + ":00";
}

export function lerOpenMeteo(dados, data) {
  const horas = dados?.hourly?.time || [];
  const i = horas.indexOf(horaBrasilia(data));
  if (i < 0) return null;
  return {
    temperatura: Math.round(dados.hourly.temperature_2m[i]),
    chanceChuva: dados.hourly.precipitation_probability[i] ?? 0,
    ...traduzirTempo(dados.hourly.weather_code[i]),
  };
}

// Previsão só existe para os próximos 16 dias; fora disso devolve null.
export async function previsaoNaHora(data, local = CIDADE) {
  const alvo = new Date(data).getTime();
  if (alvo < Date.now() - 3600e3 || alvo > Date.now() + 15.5 * 86400e3) return null;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${local.lat}&longitude=${local.lng}` +
    "&hourly=temperature_2m,precipitation_probability,weather_code&timezone=America%2FSao_Paulo&forecast_days=16";
  return lerOpenMeteo(await obterJson(url, { servico: "A previsão do tempo" }), data);
}
