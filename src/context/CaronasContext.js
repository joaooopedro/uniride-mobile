import React, { createContext, useContext, useState } from 'react';

import {
  STATUS_VIAGEM,
  TIPOS_MENSAGEM,
  TURNOS,
  avaliacoesRecebidas,
  caronasIniciais,
  mensagensChatIniciais,
  usuarioLogadoInicial,
} from '../services/mockData';

const CaronasContext = createContext({});

const STATUS_ABERTOS_PARA_RESERVA = [STATUS_VIAGEM.confirmada, STATUS_VIAGEM.aguardandoSaida];

const gerarId = (prefixo) => `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const normalizarTexto = (texto) =>
  texto
    .toLowerCase()
    .replace(/[áàâã]/g, 'a')
    .replace(/[éê]/g, 'e')
    .replace(/í/g, 'i')
    .replace(/[óôõ]/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ç/g, 'c')
    .trim();

const definirTurno = (horarioSaida) => {
  const horaSaida = Number(horarioSaida.split(':')[0]);
  if (horaSaida < 12) return TURNOS.manha;
  if (horaSaida < 18) return TURNOS.tarde;
  return TURNOS.noite;
};

const estaAbertaParaReserva = (carona) => STATUS_ABERTOS_PARA_RESERVA.includes(carona.status);

const temPassageiro = (carona, estudanteId) =>
  carona.passageiros.some((passageiro) => passageiro.id === estudanteId);

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState(usuarioLogadoInicial);
  const [todasCaronas, setTodasCaronas] = useState(caronasIniciais);
  const [mensagensChat, setMensagensChat] = useState(mensagensChatIniciais);

  const caronas = todasCaronas.filter(estaAbertaParaReserva);

  const minhasViagens = todasCaronas
    .filter(
      (carona) => carona.motorista.id === usuarioLogado.id || temPassageiro(carona, usuarioLogado.id),
    )
    .map((carona) => ({
      ...carona,
      papel: carona.motorista.id === usuarioLogado.id ? 'motorista' : 'passageiro',
    }));

  const podeSolicitarVaga = (carona) =>
    estaAbertaParaReserva(carona) &&
    carona.vagasDisponiveis > 0 &&
    carona.motorista.id !== usuarioLogado.id &&
    !temPassageiro(carona, usuarioLogado.id);

  const podeCancelarReserva = (carona) =>
    estaAbertaParaReserva(carona) && temPassageiro(carona, usuarioLogado.id);

  const buscarCarona = (caronaId) => todasCaronas.find((carona) => carona.id === caronaId);

  function adicionarCarona({
    bairro,
    pontoEncontro,
    campus,
    horarioSaida,
    horarioRetorno,
    diasSemana,
    vagasTotais,
    valorRateio,
    distanciaKm,
    comodidades = [],
    observacoes = '',
  }) {
    const caronaPublicada = {
      id: gerarId('carona'),
      motorista: usuarioLogado,
      origem: { bairro, pontoEncontro },
      destino: { campus, pontoChegada: 'Portaria Principal' },
      horarioSaida,
      horarioRetorno,
      toleranciaMinutos: 5,
      turno: definirTurno(horarioSaida),
      diasSemana,
      veiculo: usuarioLogado.veiculo,
      comodidades,
      vagasTotais,
      vagasDisponiveis: vagasTotais,
      passageiros: [],
      valorRateio,
      distanciaKm,
      chavePix: usuarioLogado.chavePix,
      observacoes,
      status: STATUS_VIAGEM.confirmada,
    };

    setTodasCaronas((caronasAtuais) => [caronaPublicada, ...caronasAtuais]);
    return caronaPublicada;
  }

  function solicitarVaga(caronaId) {
    const caronaEscolhida = buscarCarona(caronaId);
    if (!caronaEscolhida || !podeSolicitarVaga(caronaEscolhida)) return false;

    setTodasCaronas((caronasAtuais) =>
      caronasAtuais.map((carona) =>
        carona.id === caronaId && podeSolicitarVaga(carona)
          ? {
              ...carona,
              vagasDisponiveis: carona.vagasDisponiveis - 1,
              passageiros: [...carona.passageiros, usuarioLogado],
            }
          : carona,
      ),
    );
    return true;
  }

  function cancelarReserva(caronaId) {
    const caronaReservada = buscarCarona(caronaId);
    if (!caronaReservada || !podeCancelarReserva(caronaReservada)) return false;

    setTodasCaronas((caronasAtuais) =>
      caronasAtuais.map((carona) =>
        carona.id === caronaId && podeCancelarReserva(carona)
          ? {
              ...carona,
              vagasDisponiveis: carona.vagasDisponiveis + 1,
              passageiros: carona.passageiros.filter(
                (passageiro) => passageiro.id !== usuarioLogado.id,
              ),
            }
          : carona,
      ),
    );
    return true;
  }

  function cancelarCarona(caronaId) {
    const caronaOferecida = buscarCarona(caronaId);
    const podeCancelar =
      caronaOferecida &&
      caronaOferecida.motorista.id === usuarioLogado.id &&
      estaAbertaParaReserva(caronaOferecida);
    if (!podeCancelar) return false;

    setTodasCaronas((caronasAtuais) => caronasAtuais.filter((carona) => carona.id !== caronaId));
    return true;
  }

  function enviarMensagem(texto, tipo = TIPOS_MENSAGEM.texto) {
    const textoMensagem = texto.trim();
    if (!textoMensagem) return;

    setMensagensChat((mensagensAtuais) => [
      ...mensagensAtuais,
      {
        id: gerarId('mensagem'),
        autor: usuarioLogado,
        texto: textoMensagem,
        tipo,
        enviadaEm: new Date(),
      },
    ]);
  }

  function filtrarCaronas({ campus, turno, busca = '', apenasComVagas = false } = {}) {
    const termoBusca = normalizarTexto(busca);

    return caronas.filter((carona) => {
      const atendeCampus = !campus || campus === 'Todos' || carona.destino.campus === campus;
      const atendeTurno = !turno || carona.turno === turno;
      const atendeVagas = !apenasComVagas || carona.vagasDisponiveis > 0;
      const atendeBusca =
        !termoBusca ||
        [carona.origem.bairro, carona.origem.pontoEncontro, carona.destino.campus].some(
          (trechoRota) => normalizarTexto(trechoRota).includes(termoBusca),
        );

      return atendeCampus && atendeTurno && atendeVagas && atendeBusca;
    });
  }

  return (
    <CaronasContext.Provider
      value={{
        usuarioLogado,
        caronas,
        minhasViagens,
        mensagensChat,
        avaliacoesRecebidas,
        adicionarCarona,
        solicitarVaga,
        cancelarReserva,
        cancelarCarona,
        enviarMensagem,
        filtrarCaronas,
      }}
    >
      {children}
    </CaronasContext.Provider>
  );
}

export function useCaronas() {
  return useContext(CaronasContext);
}
