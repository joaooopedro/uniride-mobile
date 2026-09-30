import React, { createContext, useContext, useState } from 'react';

const CaronasContext = createContext({});

const caronasMockadas = [
  { id: 'carona-001', motorista: 'Mariana Costa', iniciaisMotorista: 'MC', notaMotorista: '4.9', bairroOrigem: 'Cascatinha', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '07:10', modeloCarro: 'Onix Prata', placaCarro: 'ABC-1234', vagasRestantes: 2, valorRateio: 'R$ 6,00', alunoVerificado: true },
  { id: 'carona-002', motorista: 'Rafael Mendes', iniciaisMotorista: 'RM', notaMotorista: '4.8', bairroOrigem: 'São Mateus', campusDestino: 'Campus Estrela Sul', turno: 'Noite', horarioSaida: '18:20', modeloCarro: 'HB20 Azul', placaCarro: 'JFO-4821', vagasRestantes: 1, valorRateio: 'R$ 7,00', alunoVerificado: true },
  { id: 'carona-003', motorista: 'Beatriz Almeida', iniciaisMotorista: 'BA', notaMotorista: '5.0', bairroOrigem: 'Alto dos Passos', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '06:50', modeloCarro: 'Fit Branco', placaCarro: 'DEF-9062', vagasRestantes: 3, valorRateio: 'R$ 5,50', alunoVerificado: true },
  { id: 'carona-004', motorista: 'Lucas Ferreira', iniciaisMotorista: 'LF', notaMotorista: '4.7', bairroOrigem: 'Santa Luzia', campusDestino: 'Campus Estrela Sul', turno: 'Noite', horarioSaida: '18:40', modeloCarro: 'Argo Cinza', placaCarro: 'GHI-7710', vagasRestantes: 0, valorRateio: 'R$ 6,50', alunoVerificado: true },
  { id: 'carona-005', motorista: 'Camila Rocha', iniciaisMotorista: 'CR', notaMotorista: '4.9', bairroOrigem: 'Granbery', campusDestino: 'Campus Academia (Centro)', turno: 'Noite', horarioSaida: '18:00', modeloCarro: 'Kwid Vermelho', placaCarro: 'JKL-3158', vagasRestantes: 2, valorRateio: 'R$ 5,00', alunoVerificado: true },
  { id: 'carona-006', motorista: 'Thiago Martins', iniciaisMotorista: 'TM', notaMotorista: '4.6', bairroOrigem: 'Benfica', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '06:20', modeloCarro: 'Sandero Preto', placaCarro: 'MNO-2246', vagasRestantes: 1, valorRateio: 'R$ 8,00', alunoVerificado: true },
  { id: 'carona-007', motorista: 'Juliana Nunes', iniciaisMotorista: 'JN', notaMotorista: '4.8', bairroOrigem: 'Centro', campusDestino: 'Campus Estrela Sul', turno: 'Manhã', horarioSaida: '07:30', modeloCarro: 'C3 Branco', placaCarro: 'PQR-6403', vagasRestantes: 2, valorRateio: 'R$ 6,00', alunoVerificado: true },
  { id: 'carona-008', motorista: 'Eduardo Lopes', iniciaisMotorista: 'EL', notaMotorista: '4.9', bairroOrigem: 'Manoel Honório', campusDestino: 'Campus Academia (Centro)', turno: 'Noite', horarioSaida: '18:15', modeloCarro: 'Corolla Prata', placaCarro: 'STU-1987', vagasRestantes: 0, valorRateio: 'R$ 7,50', alunoVerificado: true },
];

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState({
    nome: 'João Pedro Silva',
    curso: 'Ciência da Computação',
    matricula: '202301842',
  });
  const [caronasDisponiveis] = useState(caronasMockadas);
  const [reservas] = useState([]);

  return (
    <CaronasContext.Provider value={{ usuarioLogado, caronasDisponiveis, reservas }}>
      {children}
    </CaronasContext.Provider>
  );
}

export function useCaronas() {
  return useContext(CaronasContext);
}
