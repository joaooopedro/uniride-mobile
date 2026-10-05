import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useCaronas } from './CaronasContext';
import {
  AVISOS_RAPIDOS,
  CATEGORIAS_AVISO,
  TIPOS_MENSAGEM,
  avisosIniciais,
  mensagensChatIniciais,
} from '../services/mockData';

const AvisosContext = createContext({});

const ATRASO_RESPOSTA_MOTORISTA_MS = 2500;

const gerarId = (prefixo) => `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const descreverRota = (carona) => `${carona.bairroOrigem} → ${carona.campusDestino}`;

const criarAviso = (categoria, titulo, descricao) => ({
  id: gerarId('aviso'),
  categoria,
  titulo,
  descricao,
  criadoEm: new Date(),
  lido: false,
});

const temReserva = (listaReservas, caronaId) =>
  listaReservas.some((reserva) => reserva.caronaId === caronaId);

const temCarona = (listaCaronas, caronaId) => listaCaronas.some((carona) => carona.id === caronaId);

export function AvisosProvider({ children }) {
  const { usuarioLogado, caronasDisponiveis, reservas } = useCaronas();
  const [mensagensChat, setMensagensChat] = useState(mensagensChatIniciais);
  const [avisos, setAvisos] = useState(avisosIniciais);
  const reservasAnterioresRef = useRef(reservas);
  const caronasAnterioresRef = useRef(caronasDisponiveis);

  useEffect(() => {
    const reservasAnteriores = reservasAnterioresRef.current;
    const caronasAnteriores = caronasAnterioresRef.current;
    reservasAnterioresRef.current = reservas;
    caronasAnterioresRef.current = caronasDisponiveis;

    const buscarCarona = (caronaId) =>
      caronasDisponiveis.find((carona) => carona.id === caronaId) ||
      caronasAnteriores.find((carona) => carona.id === caronaId);
    const ehRotaDoUsuario = (carona) => carona.motorista === usuarioLogado.nome;

    const vagasConfirmadas = reservas
      .filter((reserva) => !temReserva(reservasAnteriores, reserva.caronaId))
      .map((reserva) => buscarCarona(reserva.caronaId))
      .filter(Boolean)
      .map((carona) =>
        criarAviso(
          CATEGORIAS_AVISO.reserva,
          'Vaga confirmada',
          `${descreverRota(carona)} com ${carona.motorista}, saída às ${carona.horarioSaida}.`,
        ),
      );

    const reservasCanceladas = reservasAnteriores
      .filter((reserva) => !temReserva(reservas, reserva.caronaId))
      .map((reserva) => buscarCarona(reserva.caronaId))
      .filter(Boolean)
      .map((carona) =>
        criarAviso(
          CATEGORIAS_AVISO.cancelamento,
          'Reserva cancelada',
          `Sua vaga em ${descreverRota(carona)} foi liberada.`,
        ),
      );

    const rotasPublicadas = caronasDisponiveis
      .filter((carona) => ehRotaDoUsuario(carona) && !temCarona(caronasAnteriores, carona.id))
      .map((carona) =>
        criarAviso(
          CATEGORIAS_AVISO.rota,
          'Rota publicada',
          `${descreverRota(carona)}, saída às ${carona.horarioSaida}.`,
        ),
      );

    const rotasCanceladas = caronasAnteriores
      .filter((carona) => ehRotaDoUsuario(carona) && !temCarona(caronasDisponiveis, carona.id))
      .map((carona) =>
        criarAviso(
          CATEGORIAS_AVISO.cancelamento,
          'Rota cancelada',
          `${descreverRota(carona)} saiu do feed de caronas.`,
        ),
      );

    const novosAvisos = [...vagasConfirmadas, ...reservasCanceladas, ...rotasPublicadas, ...rotasCanceladas];
    if (novosAvisos.length > 0) {
      setAvisos((avisosAtuais) => [...novosAvisos, ...avisosAtuais]);
    }
  }, [reservas, caronasDisponiveis, usuarioLogado.nome]);

  const mensagensNaoLidas = mensagensChat.filter((mensagem) => !mensagem.lida).length;
  const avisosNaoLidos = avisos.filter((aviso) => !aviso.lido).length;

  function adicionarMensagem(caronaId, autor, texto, tipo) {
    setMensagensChat((mensagensAtuais) => [
      ...mensagensAtuais,
      {
        id: gerarId('mensagem'),
        caronaId,
        autor,
        texto,
        tipo,
        enviadaEm: new Date(),
        lida: autor === usuarioLogado.nome,
      },
    ]);
  }

  function enviarMensagem(caronaId, texto, tipo = TIPOS_MENSAGEM.texto) {
    const textoMensagem = texto.trim();
    if (!textoMensagem) return;

    adicionarMensagem(caronaId, usuarioLogado.nome, textoMensagem, tipo);

    const avisoRapido = AVISOS_RAPIDOS.find((aviso) => aviso.texto === textoMensagem);
    const caronaDaConversa = caronasDisponiveis.find((carona) => carona.id === caronaId);
    if (avisoRapido && caronaDaConversa && caronaDaConversa.motorista !== usuarioLogado.nome) {
      setTimeout(
        () =>
          adicionarMensagem(
            caronaId,
            caronaDaConversa.motorista,
            avisoRapido.resposta,
            TIPOS_MENSAGEM.texto,
          ),
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

  return (
    <AvisosContext.Provider
      value={{
        mensagensChat,
        mensagensNaoLidas,
        avisos,
        avisosNaoLidos,
        enviarMensagem,
        marcarChatComoLido,
        marcarAvisosComoLidos,
      }}
    >
      {children}
    </AvisosContext.Provider>
  );
}

export function useAvisos() {
  return useContext(AvisosContext);
}
