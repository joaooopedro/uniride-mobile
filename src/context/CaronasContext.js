import React, { createContext, useContext, useState } from 'react';

const CaronasContext = createContext({});

const caronasMockadas = [
  ['carona-001', 'Mariana Costa', 'MC', '4.9', 'Cascatinha', 'Campus Academia (Centro)', 'Manhã', '07:10', 'Onix Prata', 'ABC-1234', 2, 'R$ 6,00'],
  ['carona-002', 'Rafael Mendes', 'RM', '4.8', 'São Mateus', 'Campus Estrela Sul', 'Noite', '18:20', 'HB20 Azul', 'JFO-4821', 1, 'R$ 7,00'],
  ['carona-003', 'Beatriz Almeida', 'BA', '5.0', 'Alto dos Passos', 'Campus Academia (Centro)', 'Manhã', '06:50', 'Fit Branco', 'DEF-9062', 3, 'R$ 5,50'],
  ['carona-004', 'Lucas Ferreira', 'LF', '4.7', 'Santa Luzia', 'Campus Estrela Sul', 'Noite', '18:40', 'Argo Cinza', 'GHI-7710', 0, 'R$ 6,50'],
  ['carona-005', 'Camila Rocha', 'CR', '4.9', 'Granbery', 'Campus Academia (Centro)', 'Noite', '18:00', 'Kwid Vermelho', 'JKL-3158', 2, 'R$ 5,00'],
  ['carona-006', 'Thiago Martins', 'TM', '4.6', 'Benfica', 'Campus Academia (Centro)', 'Manhã', '06:20', 'Sandero Preto', 'MNO-2246', 1, 'R$ 8,00'],
  ['carona-007', 'Juliana Nunes', 'JN', '4.8', 'Centro', 'Campus Estrela Sul', 'Manhã', '07:30', 'C3 Branco', 'PQR-6403', 2, 'R$ 6,00'],
  ['carona-008', 'Eduardo Lopes', 'EL', '4.9', 'Manoel Honório', 'Campus Academia (Centro)', 'Noite', '18:15', 'Corolla Prata', 'STU-1987', 0, 'R$ 7,50'],
].map(([id, motorista, iniciaisMotorista, notaMotorista, bairroOrigem, campusDestino, turno, horarioSaida, modeloCarro, placaCarro, vagasRestantes, valorRateio], indiceCarona) => ({
  id, motorista, iniciaisMotorista, notaMotorista, bairroOrigem, campusDestino, turno, horarioSaida, modeloCarro, placaCarro, vagasRestantes, valorRateio,
  alunoVerificado: true,
  pontoEncontro: indiceCarona === 1 ? 'Praça do São Mateus, em frente à Igreja' : `Ponto principal de ${bairroOrigem}`,
  destinoDetalhado: `UniAcademia, Portaria Principal ${campusDestino.replace('Campus ', '')}`,
  toleranciaMinutos: 5,
  marcaCarro: modeloCarro.split(' ')[0],
  corCarro: modeloCarro.split(' ').slice(1).join(' '),
  motoristaCurso: indiceCarona % 2 === 0 ? 'Administração, 5º período' : 'Engenharia de Software, 6º período',
  telefoneEmergencia: `(32) 9****-${String(4821 + indiceCarona * 317).slice(-4)}`,
  comodidades: ['Ar-condicionado', 'Música', 'Porta-malas livre'].slice(0, indiceCarona % 3 + 1),
  passageirosConfirmados: [
    { nome: 'Ana Clara', iniciais: 'AC' },
    { nome: 'Pedro Henrique', iniciais: 'PH' },
  ].slice(0, Math.min(indiceCarona % 3 + 1, 3)),
  chavePix: `${motorista.toLowerCase().replace(' ', '.')}@uniride.edu.br`,
}));

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState({ nome: 'João Pedro Silva', curso: 'Ciência da Computação', matricula: '202301842' });
  const [caronasDisponiveis, setCaronasDisponiveis] = useState(caronasMockadas);
  const [reservas, setReservas] = useState([]);

  const solicitarReserva = (caronaId) => {
    const caronaSelecionada = caronasDisponiveis.find((carona) => carona.id === caronaId);
    const reservaExistente = reservas.some((reserva) => reserva.caronaId === caronaId);
    if (!caronaSelecionada || caronaSelecionada.vagasRestantes < 1 || reservaExistente) return false;

    setReservas((reservasAtuais) => [...reservasAtuais, { caronaId, status: 'Confirmada' }]);
    setCaronasDisponiveis((caronasAtuais) => caronasAtuais.map((carona) => (
      carona.id === caronaId ? { ...carona, vagasRestantes: carona.vagasRestantes - 1 } : carona
    )));
    return true;
  };

  return <CaronasContext.Provider value={{ usuarioLogado, caronasDisponiveis, reservas, solicitarReserva }}>{children}</CaronasContext.Provider>;
}

export function useCaronas() {
  return useContext(CaronasContext);
}
