import { Timestamp } from "firebase/firestore";

import { paraData } from "../../utils/formato";

// O Firestore não guarda lista dentro de lista, então a linha da rota vira [{ lat, lng }].
export function linhaParaBanco(linha = []) {
  return linha.map(([lat, lng]) => ({ lat, lng }));
}

export function linhaDoBanco(linha = []) {
  return linha.map((ponto) => [ponto.lat, ponto.lng]);
}

export function caronaDoBanco(snap) {
  if (!snap.exists()) return null;
  const dados = snap.data();
  return {
    ...dados,
    id: snap.id,
    saidaEm: paraData(dados.saidaEm),
    criadoEm: paraData(dados.criadoEm),
    rota: dados.rota ? { ...dados.rota, linha: linhaDoBanco(dados.rota.linha) } : null,
  };
}

export function reservaDoBanco(snap) {
  if (!snap.exists()) return null;
  const dados = snap.data();
  return { ...dados, id: snap.id, criadoEm: paraData(dados.criadoEm), atualizadoEm: paraData(dados.atualizadoEm) };
}

export function mensagemDoBanco(snap) {
  const dados = snap.data({ serverTimestamps: "estimate" });
  return { ...dados, id: snap.id, criadoEm: paraData(dados.criadoEm) || new Date() };
}

export const paraTimestamp = (data) => Timestamp.fromDate(paraData(data));
