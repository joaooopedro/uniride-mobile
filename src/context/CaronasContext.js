import React, { createContext, useContext, useState } from 'react';

import {
  AVISOS_RAPIDOS,
  CATEGORIAS_AVISO,
  STATUS_VIAGEM,
  TIPOS_MENSAGEM,
  TURNOS,
  avaliacoesRecebidas,
  avisosIniciais,
  caronasIniciais,
  mensagensChatIniciais,
  usuarioLogadoInicial,
} from '../services/mockData';

const CaronasContext = createContext({});

const STATUS_ABERTOS_PARA_RESERVA = [STATUS_VIAGEM.confirmada, STATUS_VIAGEM.aguardandoSaida];

const ATRASO_RESPOSTA_MOTORISTA_MS = 2500;

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

const descreverRota = (carona) => `${carona.origem.bairro} → ${carona.destino.campus}`;

const estaAbertaParaReserva = (carona) => STATUS_ABERTOS_PARA_RESERVA.includes(carona.status);

const temPassageiro = (carona, estudanteId) =>
  carona.passageiros.some((passageiro) => passageiro.id === estudanteId);

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState(usuarioLogadoInicial);
  const [todasCaronas, setTodasCaronas] = useState(caronasIniciais);
  const [mensagensChat, setMensagensChat] = useState(mensagensChatIniciais);
  const [avisos, setAvisos] = useState(avisosIniciais);

  const caronas = todasCaronas.filter(estaAbertaParaReserva);

  const minhasViagens = todasCaronas
    .filter(
      (carona) => carona.motorista.id === usuarioLogado.id || temPassageiro(carona, usuarioLogado.id),
    )
    .map((carona) => ({
      ...carona,
      papel: carona.motorista.id === usuarioLogado.id ? 'motorista' : 'passageiro',
    }));

  const viagemAtiva = minhasViagens.find((viagem) => viagem.status === STATUS_VIAGEM.emAndamento);

  const mensagensNaoLidas = mensagensChat.filter((mensagem) => !mensagem.lida).length;
  const avisosNaoLidos = avisos.filter((aviso) => !aviso.lido).length;

  const podeSolicitarVaga = (carona) =>
    estaAbertaParaReserva(carona) &&
    carona.vagasDisponiveis > 0 &&
    carona.motorista.id !== usuarioLogado.id &&
    !temPassageiro(carona, usuarioLogado.id);

  const podeCancelarReserva = (carona) =>
    estaAbertaParaReserva(carona) && temPassageiro(carona, usuarioLogado.id);

  const buscarCarona = (caronaId) => todasCaronas.find((carona) => carona.id === caronaId);

  function registrarAviso(categoria, titulo, descricao) {
    setAvisos((avisosAtuais) => [
      { id: gerarId('aviso'), categoria, titulo, descricao, criadoEm: new Date(), lido: false },
      ...avisosAtuais,
    ]);
  }

  function adicionarMensagem(autor, texto, tipo) {
    setMensagensChat((mensagensAtuais) => [
      ...mensagensAtuais,
      {
        id: gerarId('mensagem'),
        autor,
        texto,
        tipo,
        enviadaEm: new Date(),
        lida: autor.id === usuarioLogado.id,
      },
    ]);
  }

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
    registrarAviso(
      CATEGORIAS_AVISO.rota,
      'Rota publicada',
      `${descreverRota(caronaPublicada)}, saída às ${horarioSaida}. ${vagasTotais} ${
        vagasTotais === 1 ? 'vaga aberta' : 'vagas abertas'
      }.`,
    );
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
    registrarAviso(
      CATEGORIAS_AVISO.reserva,
      'Vaga confirmada',
      `${descreverRota(caronaEscolhida)} com ${caronaEscolhida.motorista.nome}, saída às ${
        caronaEscolhida.horarioSaida
      }.`,
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
    registrarAviso(
      CATEGORIAS_AVISO.cancelamento,
      'Reserva cancelada',
      `Sua vaga em ${descreverRota(caronaReservada)} foi liberada.`,
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
    registrarAviso(
      CATEGORIAS_AVISO.cancelamento,
      'Rota cancelada',
      `${descreverRota(caronaOferecida)} saiu do feed de caronas.`,
    );
    return true;
  }

  function enviarMensagem(texto, tipo = TIPOS_MENSAGEM.texto) {
    const textoMensagem = texto.trim();
    if (!textoMensagem) return;

    adicionarMensagem(usuarioLogado, textoMensagem, tipo);

    const avisoRapido = AVISOS_RAPIDOS.find((aviso) => aviso.texto === textoMensagem);
    if (avisoRapido && viagemAtiva?.papel === 'passageiro') {
      setTimeout(
        () => adicionarMensagem(viagemAtiva.motorista, avisoRapido.resposta, TIPOS_MENSAGEM.texto),
        ATRASO_RESPOSTA_MOTORISTA_MS,
      );
    }
  }

  function marcarChatComoLido() {
    setMensagensChat((mensagensAtuais) =>
      mensagensAtuais.map((mensagem) => (mensagem.lida ? mensagem : { ...mensagem, lida: true })),
    );
  }

  function marcarAvisosComoLidos() {
    setAvisos((avisosAtuais) =>
      avisosAtuais.map((aviso) => (aviso.lido ? aviso : { ...aviso, lido: true })),
    );
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
        viagemAtiva,
        mensagensChat,
        mensagensNaoLidas,
        avisos,
        avisosNaoLidos,
        avaliacoesRecebidas,
        adicionarCarona,
        solicitarVaga,
        cancelarReserva,
        cancelarCarona,
        enviarMensagem,
        marcarChatComoLido,
        marcarAvisosComoLidos,
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
