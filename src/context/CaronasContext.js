import React, { createContext, useContext, useState } from 'react';
import { caronasIniciaisMock, mensagensIniciaisMock, usuarioAtualMock } from '../services/mockData';

const CaronasContext = createContext({});

export function CaronasProvider({ children }) {
  const [caronas, setCaronas] = useState(caronasIniciaisMock);
  const [usuarioLogado, setUsuarioLogado] = useState(usuarioAtualMock);
  const [mensagensChat, setMensagensChat] = useState(mensagensIniciaisMock);

  // Minhas viagens ativas (como passageiro ou motorista)
  const [minhasViagens, setMinhasViagens] = useState([
    {
      id: 'reserva-1',
      caronaId: 'carona-2',
      tipo: 'passageiro',
      status: 'Confirmada',
      origem: 'Cascatinha',
      destino: 'Campus Academia (Centro)',
      horarioSaida: '07:15',
      motoristaNome: 'Gabriel Caputo',
      carro: 'Fiat Pulse Branco',
      valor: 'R$ 5,50',
    },
    {
      id: 'oferta-1',
      caronaId: 'carona-joao-1',
      tipo: 'motorista',
      status: 'Aguardando Saída',
      origem: 'São Mateus',
      destino: 'Campus Estrela Sul',
      horarioSaida: '18:30',
      motoristaNome: 'João Pedro Silva',
      carro: 'Chevrolet Onix Plus',
      valor: 'R$ 5,00',
      vagasDisponiveis: 3,
    },
  ]);

  const adicionarCarona = (novaCarona) => {
    const caronaCompleta = {
      id: `carona-${Date.now()}`,
      motorista: {
        id: usuarioLogado.id,
        nome: usuarioLogado.nome,
        curso: usuarioLogado.curso,
        foto: usuarioLogado.foto,
        nota: usuarioLogado.reputacao,
        alunoVerificado: true,
        celular: '(32) 99999-0000',
      },
      passageiros: [],
      ...novaCarona,
    };

    setCaronas((anteriores) => [caronaCompleta, ...anteriores]);

    const novaViagemMotorista = {
      id: `oferta-${Date.now()}`,
      caronaId: caronaCompleta.id,
      tipo: 'motorista',
      status: 'Aguardando Saída',
      origem: novaCarona.origem,
      destino: novaCarona.destino,
      horarioSaida: novaCarona.horarioSaida,
      motoristaNome: usuarioLogado.nome,
      carro: novaCarona.carro || `${usuarioLogado.veiculo.modelo} (${usuarioLogado.veiculo.placa})`,
      valor: novaCarona.valorRateio,
      vagasDisponiveis: novaCarona.vagasDisponiveis,
    };

    setMinhasViagens((anteriores) => [novaViagemMotorista, ...anteriores]);
  };

  const solicitarVaga = (caronaId) => {
    let caronaSelecionada = null;

    setCaronas((anteriores) =>
      anteriores.map((carona) => {
        if (carona.id === caronaId && carona.vagasDisponiveis > 0) {
          caronaSelecionada = carona;
          return {
            ...carona,
            vagasDisponiveis: carona.vagasDisponiveis - 1,
            passageiros: [
              ...carona.passageiros,
              {
                id: usuarioLogado.id,
                nome: usuarioLogado.nome,
                curso: usuarioLogado.curso,
                foto: usuarioLogado.foto,
              },
            ],
          };
        }
        return carona;
      })
    );

    if (caronaSelecionada) {
      const novaReserva = {
        id: `reserva-${Date.now()}`,
        caronaId: caronaSelecionada.id,
        tipo: 'passageiro',
        status: 'Confirmada',
        origem: caronaSelecionada.origem,
        destino: caronaSelecionada.destino,
        horarioSaida: caronaSelecionada.horarioSaida,
        motoristaNome: caronaSelecionada.motorista.nome,
        carro: caronaSelecionada.carro,
        valor: caronaSelecionada.valorRateio,
      };

      setMinhasViagens((anteriores) => [novaReserva, ...anteriores]);
      return true;
    }

    return false;
  };

  const cancelarReserva = (reservaId, caronaId) => {
    setMinhasViagens((anteriores) =>
      anteriores.filter((viagem) => viagem.id !== reservaId)
    );

    if (caronaId) {
      setCaronas((anteriores) =>
        anteriores.map((carona) => {
          if (carona.id === caronaId) {
            return {
              ...carona,
              vagasDisponiveis: Math.min(carona.vagasTotais, carona.vagasDisponiveis + 1),
              passageiros: carona.passageiros.filter((p) => p.id !== usuarioLogado.id),
            };
          }
          return carona;
        })
      );
    }
  };

  const enviarMensagem = (texto, tipo = 'normal') => {
    const agora = new Date();
    const horario = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

    const novaMensagem = {
      id: `msg-${Date.now()}`,
      autor: usuarioLogado.nome,
      texto,
      horario,
      propria: true,
      tipo,
    };

    setMensagensChat((anteriores) => [...anteriores, novaMensagem]);
  };

  const filtrarCaronas = ({ campus, turno, busca, apenasComVagas }) => {
    return caronas.filter((carona) => {
      if (campus && campus !== 'Todos' && !carona.destino.includes(campus)) {
        return false;
      }
      if (turno && turno !== 'Todos' && carona.turno !== turno) {
        return false;
      }
      if (apenasComVagas && carona.vagasDisponiveis <= 0) {
        return false;
      }
      if (busca && busca.trim().length > 0) {
        const termo = busca.toLowerCase();
        const bateOrigem = carona.origem.toLowerCase().includes(termo);
        const bateDestino = carona.destino.toLowerCase().includes(termo);
        const bateMotorista = carona.motorista.nome.toLowerCase().includes(termo);
        if (!bateOrigem && !bateDestino && !bateMotorista) {
          return false;
        }
      }
      return true;
    });
  };

  return (
    <CaronasContext.Provider
      value={{
        caronas,
        usuarioLogado,
        minhasViagens,
        mensagensChat,
        adicionarCarona,
        solicitarVaga,
        cancelarReserva,
        enviarMensagem,
        filtrarCaronas,
      }}
    >
      {children}
    </CaronasContext.Provider>
  );
}

export function useCaronas() {
  const context = useContext(CaronasContext);
  if (!context) {
    throw new Error('useCaronas deve ser utilizado dentro de um CaronasProvider');
  }
  return context;
}
