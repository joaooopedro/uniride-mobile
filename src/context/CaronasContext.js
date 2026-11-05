import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { repo } from "../services";
import { useAuth } from "./AuthContext";

const CaronasContext = createContext(null);

// Mantém uma inscrição por carona e devolve o mapa { caronaId: carona }.
function useCaronasPorId(ids) {
  const [mapa, setMapa] = useState({});
  const inscricoes = useRef({});
  const chave = [...new Set(ids)].sort().join("|");

  useEffect(() => {
    const desejados = new Set(chave ? chave.split("|") : []);
    Object.keys(inscricoes.current).forEach((id) => {
      if (!desejados.has(id)) {
        inscricoes.current[id]();
        delete inscricoes.current[id];
        setMapa((atual) => {
          const { [id]: _removida, ...resto } = atual;
          return resto;
        });
      }
    });
    desejados.forEach((id) => {
      if (inscricoes.current[id]) return;
      inscricoes.current[id] = repo.caronas.observarCarona(id, (carona) =>
        setMapa((atual) => ({ ...atual, [id]: carona })),
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

  return mapa;
}

export function CaronasProvider({ children }) {
  const { usuario, perfil } = useAuth();
  const uid = usuario?.uid;

  const [abertas, setAbertas] = useState([]);
  const [carregandoCaronas, setCarregandoCaronas] = useState(true);
  const [erroCaronas, setErroCaronas] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const [reservasPassageiro, setReservasPassageiro] = useState([]);
  const [reservasMotorista, setReservasMotorista] = useState([]);
  const [minhasRotas, setMinhasRotas] = useState([]);

  useEffect(() => {
    if (!uid) return undefined;
    setCarregandoCaronas(true);
    setErroCaronas(null);
    return repo.caronas.observarAbertas(
      (lista) => {
        setAbertas(lista);
        setCarregandoCaronas(false);
      },
      (falha) => {
        setErroCaronas(falha.message || "Não foi possível carregar as caronas.");
        setCarregandoCaronas(false);
      },
    );
  }, [uid, tentativa]);

  useEffect(() => {
    if (!uid) return undefined;
    const cancelar = [
      repo.reservas.observarDoPassageiro(uid, setReservasPassageiro, () => {}),
      repo.reservas.observarDoMotorista(uid, setReservasMotorista, () => {}),
      repo.caronas.observarDoMotorista(uid, setMinhasRotas, () => {}),
    ];
    return () => cancelar.forEach((fn) => fn());
  }, [uid, tentativa]);

  useEffect(() => {
    if (uid) return;
    setAbertas([]);
    setReservasPassageiro([]);
    setReservasMotorista([]);
    setMinhasRotas([]);
  }, [uid]);

  const caronasDasReservas = useCaronasPorId(reservasPassageiro.map((r) => r.caronaId));

  const valor = useMemo(() => {
    const rotasPorId = Object.fromEntries(minhasRotas.map((rota) => [rota.id, rota]));
    const exigirPerfil = () => {
      if (!perfil) throw new Error("Perfil ainda carregando. Tente de novo.");
      return perfil;
    };
    return {
      caronasAbertas: abertas.filter((carona) => carona.motoristaId !== uid),
      carregandoCaronas,
      erroCaronas,
      recarregar: () => setTentativa((n) => n + 1),
      minhasReservas: reservasPassageiro
        .map((reserva) => ({ reserva, carona: caronasDasReservas[reserva.caronaId] }))
        .filter((item) => item.carona)
        .sort((a, b) => a.carona.saidaEm - b.carona.saidaEm),
      minhasRotas,
      solicitacoesPendentes: reservasMotorista
        .filter((reserva) => reserva.status === "solicitada" && rotasPorId[reserva.caronaId])
        .map((reserva) => ({ reserva, carona: rotasPorId[reserva.caronaId], passageiro: reserva.passageiro }))
        .sort((a, b) => a.reserva.criadoEm - b.reserva.criadoEm),
      oferecerCarona: (dados) => repo.caronas.criar(exigirPerfil(), dados),
      cancelarCarona: (caronaId) => repo.caronas.cancelar(caronaId),
      iniciarViagem: (caronaId) => repo.caronas.iniciar(caronaId),
      concluirViagem: (caronaId) => repo.caronas.concluir(caronaId),
      solicitarReserva: (caronaId) => {
        const carona = abertas.find((c) => c.id === caronaId) || caronasDasReservas[caronaId];
        if (!carona) throw new Error("Carona não encontrada.");
        return repo.reservas.solicitar(carona, exigirPerfil());
      },
      cancelarReserva: (caronaId) => repo.reservas.cancelar(`${caronaId}_${uid}`),
      aceitarReserva: (reservaId) => repo.reservas.aceitar(reservaId),
      recusarReserva: (reservaId) => repo.reservas.recusar(reservaId),
      avaliar: ({ reservaId, avaliadoId, nota, comentario }) =>
        repo.avaliacoes.avaliar({ reservaId, avaliador: exigirPerfil(), avaliadoId, nota, comentario }),
    };
  }, [abertas, carregandoCaronas, erroCaronas, reservasPassageiro, reservasMotorista, minhasRotas, caronasDasReservas, perfil, uid]);

  return <CaronasContext.Provider value={valor}>{children}</CaronasContext.Provider>;
}

export function useCaronas() {
  const contexto = useContext(CaronasContext);
  if (!contexto) throw new Error("useCaronas precisa do CaronasProvider.");
  return contexto;
}

// Detalhe de uma carona: dados, reservas visíveis ao usuário e contato liberado.
export function useCarona(caronaId) {
  const { usuario } = useAuth();
  const uid = usuario?.uid;
  const [carona, setCarona] = useState(undefined);
  const [reservas, setReservas] = useState([]);
  const [contato, setContato] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!caronaId) return undefined;
    setCarona(undefined);
    setErro(null);
    return repo.caronas.observarCarona(caronaId, setCarona, (falha) => setErro(falha.message));
  }, [caronaId]);

  const souMotorista = !!carona && carona.motoristaId === uid;

  useEffect(() => {
    if (!carona || !uid) return undefined;
    if (souMotorista)
      return repo.reservas.observarDaCaronaComoMotorista(caronaId, uid, setReservas, () => setReservas([]));
    return repo.reservas.observarReserva(
      `${caronaId}_${uid}`,
      (reserva) => setReservas(reserva ? [reserva] : []),
      () => setReservas([]),
    );
  }, [caronaId, uid, souMotorista, !!carona]);

  const participa = !!carona && !!uid && carona.participantes?.includes(uid);

  useEffect(() => {
    if (!participa) {
      setContato(null);
      return undefined;
    }
    return repo.caronas.observarContato(caronaId, setContato, () => setContato(null));
  }, [caronaId, participa]);

  return {
    carona: carona || null,
    reservas,
    minhaReserva: souMotorista ? null : reservas[0] || null,
    souMotorista,
    contato,
    carregando: carona === undefined && !erro,
    erro: erro || (carona === null ? "Esta carona não existe mais." : null),
  };
}
