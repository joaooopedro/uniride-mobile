import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { repo } from "../services";
import { lerUltimasLeituras, marcarLeitura } from "../services/localStore";
import { paraData } from "../utils/formato";
import { useAuth } from "./AuthContext";

export const AVISOS_RAPIDOS = [
  { id: "cheguei-ponto", texto: "Cheguei no ponto de encontro", icone: "map-pin" },
  { id: "atraso", texto: "Atraso de 5 minutos, aguardem", icone: "clock" },
  { id: "saindo", texto: "Estou saindo agora", icone: "navigation" },
  { id: "transito", texto: "Trânsito pesado no caminho", icone: "alert-triangle" },
  { id: "cheguei-campus", texto: "Chegamos na portaria do campus", icone: "flag" },
];

const AvisosContext = createContext(null);

export function AvisosProvider({ children }) {
  const { usuario, perfil } = useAuth();
  const uid = usuario?.uid;
  const [caronas, setCaronas] = useState([]);
  const [mensagensPorCarona, setMensagensPorCarona] = useState({});
  const [leituras, setLeituras] = useState({});
  const inscricoes = useRef({});

  useEffect(() => {
    lerUltimasLeituras().then(setLeituras);
  }, []);

  useEffect(() => {
    if (!uid) {
      setCaronas([]);
      return undefined;
    }
    return repo.caronas.observarDoParticipante(
      uid,
      (lista) => setCaronas(lista.filter((carona) => carona.status !== "cancelada")),
      () => setCaronas([]),
    );
  }, [uid]);

  const chave = caronas.map((c) => c.id).sort().join("|");
  useEffect(() => {
    const desejados = new Set(chave ? chave.split("|") : []);
    Object.keys(inscricoes.current).forEach((id) => {
      if (!desejados.has(id)) {
        inscricoes.current[id]();
        delete inscricoes.current[id];
      }
    });
    desejados.forEach((id) => {
      if (inscricoes.current[id]) return;
      inscricoes.current[id] = repo.mensagens.observar(
        id,
        (lista) => setMensagensPorCarona((atual) => ({ ...atual, [id]: lista })),
        () => {},
      );
    });
  }, [chave]);

  useEffect(
    () => () => {
      Object.values(inscricoes.current).forEach((cancelar) => cancelar());
      inscricoes.current = {};
    },
    [],
  );

  const marcarComoLido = useCallback(async (caronaId) => {
    setLeituras(await marcarLeitura(caronaId));
  }, []);

  const enviarMensagem = useCallback(
    async (caronaId, texto, tipo = "texto") => {
      const limpo = String(texto || "").trim();
      if (!limpo) return;
      if (limpo.length > 500) throw new Error("A mensagem pode ter até 500 caracteres.");
      if (!perfil) throw new Error("Perfil ainda carregando. Tente de novo.");
      await repo.mensagens.enviar(caronaId, perfil, limpo, tipo);
    },
    [perfil],
  );

  const valor = useMemo(() => {
    const conversas = caronas
      .map((carona) => {
        const mensagens = mensagensPorCarona[carona.id] || [];
        const ultimaMensagem = mensagens[mensagens.length - 1] || null;
        const lidoEm = leituras[carona.id] || 0;
        const naoLidas = mensagens.filter(
          (m) => m.autorId !== uid && (paraData(m.criadoEm)?.getTime() || 0) > lidoEm,
        ).length;
        return { carona, ultimaMensagem, naoLidas };
      })
      .sort((a, b) => {
        const ta = paraData(a.ultimaMensagem?.criadoEm)?.getTime() || paraData(a.carona.saidaEm)?.getTime() || 0;
        const tb = paraData(b.ultimaMensagem?.criadoEm)?.getTime() || paraData(b.carona.saidaEm)?.getTime() || 0;
        return tb - ta;
      });
    return {
      conversas,
      naoLidasTotal: conversas.reduce((soma, c) => soma + c.naoLidas, 0),
      enviarMensagem,
      marcarComoLido,
      AVISOS_RAPIDOS,
    };
  }, [caronas, mensagensPorCarona, leituras, uid, enviarMensagem, marcarComoLido]);

  return <AvisosContext.Provider value={valor}>{children}</AvisosContext.Provider>;
}

export function useAvisos() {
  const contexto = useContext(AvisosContext);
  if (!contexto) throw new Error("useAvisos precisa do AvisosProvider.");
  return contexto;
}

export function useMensagens(caronaId) {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!caronaId) return undefined;
    setCarregando(true);
    setErro(null);
    return repo.mensagens.observar(
      caronaId,
      (lista) => {
        setMensagens(lista);
        setCarregando(false);
      },
      (falha) => {
        setErro(falha.message || "Não foi possível carregar a conversa.");
        setCarregando(false);
      },
    );
  }, [caronaId]);

  return { mensagens, carregando, erro };
}
