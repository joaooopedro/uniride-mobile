import React, { createContext, useContext, useState } from 'react';

import { useCaronas } from './CaronasContext';
import { TIPOS_MENSAGEM, avisosIniciais, mensagensChatIniciais } from '../services/mockData';

const AvisosContext = createContext({});

const gerarId = (prefixo) => `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AvisosProvider({ children }) {
  const { usuarioLogado } = useCaronas();
  const [mensagensChat, setMensagensChat] = useState(mensagensChatIniciais);
  const [avisos, setAvisos] = useState(avisosIniciais);

  const mensagensNaoLidas = mensagensChat.filter((mensagem) => !mensagem.lida).length;
  const avisosNaoLidos = avisos.filter((aviso) => !aviso.lido).length;

  function enviarMensagem(caronaId, texto, tipo = TIPOS_MENSAGEM.texto) {
    const textoMensagem = texto.trim();
    if (!textoMensagem) return;

    setMensagensChat((mensagensAtuais) => [
      ...mensagensAtuais,
      {
        id: gerarId('mensagem'),
        caronaId,
        autor: usuarioLogado.nome,
        texto: textoMensagem,
        tipo,
        enviadaEm: new Date(),
        lida: true,
      },
    ]);
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
