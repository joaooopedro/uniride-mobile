import React, { createContext, useContext, useState } from 'react';

const CaronasContext = createContext({});

const caronasMockadas = [
  { id: 'carona-001', motorista: 'Mariana Costa', iniciaisMotorista: 'MC', notaMotorista: '4.9', bairroOrigem: 'Cascatinha', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '07:10', modeloCarro: 'Onix Prata', marcaCarro: 'Chevrolet', corCarro: 'Prata', placaCarro: 'ABC-1234', pontoEncontro: 'Rua José Lourenço Kelmer, em frente ao posto', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', toleranciaMinutos: 5, vagasRestantes: 2, valorRateio: 'R$ 6,00', alunoVerificado: true, motoristaCurso: 'Administração, 5º período', telefoneEmergencia: '(32) 9****-4821', comodidades: ['Ar-condicionado', 'Música', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Ana Clara', iniciais: 'AC' }, { nome: 'Pedro Henrique', iniciais: 'PH' }], chavePix: 'mariana.costa@uniride.edu.br' },
  { id: 'carona-002', motorista: 'Rafael Mendes', iniciaisMotorista: 'RM', notaMotorista: '4.8', bairroOrigem: 'São Mateus', campusDestino: 'Campus Estrela Sul', turno: 'Noite', horarioSaida: '18:20', modeloCarro: 'HB20 Azul', marcaCarro: 'Hyundai', corCarro: 'Azul', placaCarro: 'JFO-4821', pontoEncontro: 'Praça do São Mateus, em frente à Igreja', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Estrela Sul', toleranciaMinutos: 5, vagasRestantes: 1, valorRateio: 'R$ 7,00', alunoVerificado: true, motoristaCurso: 'Engenharia de Software, 6º período', telefoneEmergencia: '(32) 9****-1098', comodidades: ['Ar-condicionado', 'Música'], passageirosConfirmados: [{ nome: 'Lucas Alves', iniciais: 'LA' }, { nome: 'Bianca Reis', iniciais: 'BR' }, { nome: 'Caio Moura', iniciais: 'CM' }], chavePix: 'rafael.mendes@uniride.edu.br' },
  { id: 'carona-003', motorista: 'Beatriz Almeida', iniciaisMotorista: 'BA', notaMotorista: '5.0', bairroOrigem: 'Alto dos Passos', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '06:50', modeloCarro: 'Fit Branco', marcaCarro: 'Honda', corCarro: 'Branco', placaCarro: 'DEF-9062', pontoEncontro: 'Avenida Rio Branco, próximo ao Carrefour', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', toleranciaMinutos: 5, vagasRestantes: 3, valorRateio: 'R$ 5,50', alunoVerificado: true, motoristaCurso: 'Direito, 7º período', telefoneEmergencia: '(32) 9****-7360', comodidades: ['Ar-condicionado', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Julia Souza', iniciais: 'JS' }], chavePix: 'beatriz.almeida@uniride.edu.br' },
  { id: 'carona-004', motorista: 'Lucas Ferreira', iniciaisMotorista: 'LF', notaMotorista: '4.7', bairroOrigem: 'Santa Luzia', campusDestino: 'Campus Estrela Sul', turno: 'Noite', horarioSaida: '18:40', modeloCarro: 'Argo Cinza', marcaCarro: 'Fiat', corCarro: 'Cinza', placaCarro: 'GHI-7710', pontoEncontro: 'Avenida Santa Luzia, em frente à praça', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Estrela Sul', toleranciaMinutos: 5, vagasRestantes: 0, valorRateio: 'R$ 6,50', alunoVerificado: true, motoristaCurso: 'Psicologia, 4º período', telefoneEmergencia: '(32) 9****-5512', comodidades: ['Música'], passageirosConfirmados: [{ nome: 'Rafaela Lima', iniciais: 'RL' }, { nome: 'Igor Dias', iniciais: 'ID' }, { nome: 'Nina Alves', iniciais: 'NA' }], chavePix: 'lucas.ferreira@uniride.edu.br' },
  { id: 'carona-005', motorista: 'Camila Rocha', iniciaisMotorista: 'CR', notaMotorista: '4.9', bairroOrigem: 'Granbery', campusDestino: 'Campus Academia (Centro)', turno: 'Noite', horarioSaida: '18:00', modeloCarro: 'Kwid Vermelho', marcaCarro: 'Renault', corCarro: 'Vermelho', placaCarro: 'JKL-3158', pontoEncontro: 'Rua Batista de Oliveira, próximo ao Granbery', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', toleranciaMinutos: 5, vagasRestantes: 2, valorRateio: 'R$ 5,00', alunoVerificado: true, motoristaCurso: 'Arquitetura, 8º período', telefoneEmergencia: '(32) 9****-8843', comodidades: ['Ar-condicionado', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Luana Castro', iniciais: 'LC' }], chavePix: 'camila.rocha@uniride.edu.br' },
  { id: 'carona-006', motorista: 'Thiago Martins', iniciaisMotorista: 'TM', notaMotorista: '4.6', bairroOrigem: 'Benfica', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '06:20', modeloCarro: 'Sandero Preto', marcaCarro: 'Renault', corCarro: 'Preto', placaCarro: 'MNO-2246', pontoEncontro: 'Terminal de Benfica, entrada principal', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', toleranciaMinutos: 5, vagasRestantes: 1, valorRateio: 'R$ 8,00', alunoVerificado: true, motoristaCurso: 'Sistemas de Informação, 6º período', telefoneEmergencia: '(32) 9****-4401', comodidades: ['Música'], passageirosConfirmados: [{ nome: 'Enzo Ribeiro', iniciais: 'ER' }, { nome: 'Maria Eduarda', iniciais: 'ME' }], chavePix: 'thiago.martins@uniride.edu.br' },
  { id: 'carona-007', motorista: 'Juliana Nunes', iniciaisMotorista: 'JN', notaMotorista: '4.8', bairroOrigem: 'Centro', campusDestino: 'Campus Estrela Sul', turno: 'Manhã', horarioSaida: '07:30', modeloCarro: 'C3 Branco', marcaCarro: 'Citroën', corCarro: 'Branco', placaCarro: 'PQR-6403', pontoEncontro: 'Parque Halfeld, em frente ao ponto de ônibus', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Estrela Sul', toleranciaMinutos: 5, vagasRestantes: 2, valorRateio: 'R$ 6,00', alunoVerificado: true, motoristaCurso: 'Engenharia Civil, 5º período', telefoneEmergencia: '(32) 9****-2674', comodidades: ['Ar-condicionado', 'Música', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Diego Martins', iniciais: 'DM' }], chavePix: 'juliana.nunes@uniride.edu.br' },
  { id: 'carona-008', motorista: 'Eduardo Lopes', iniciaisMotorista: 'EL', notaMotorista: '4.9', bairroOrigem: 'Manoel Honório', campusDestino: 'Campus Academia (Centro)', turno: 'Noite', horarioSaida: '18:15', modeloCarro: 'Corolla Prata', marcaCarro: 'Toyota', corCarro: 'Prata', placaCarro: 'STU-1987', pontoEncontro: 'Praça de Manoel Honório, próximo à banca', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', toleranciaMinutos: 5, vagasRestantes: 0, valorRateio: 'R$ 7,50', alunoVerificado: true, motoristaCurso: 'Engenharia de Software, 6º período', telefoneEmergencia: '(32) 9****-9135', comodidades: ['Ar-condicionado', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Nathalia Reis', iniciais: 'NR' }, { nome: 'Otávio Lima', iniciais: 'OL' }, { nome: 'Sofia Melo', iniciais: 'SM' }], chavePix: 'eduardo.lopes@uniride.edu.br' },
];

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState({ nome: 'João Pedro Silva', curso: 'Ciência da Computação', matricula: '202301842' });
  const [caronasDisponiveis, setCaronasDisponiveis] = useState(caronasMockadas);
  const [reservas, setReservas] = useState([]);

  const solicitarReserva = (caronaId) => {
    const caronaSelecionada = caronasDisponiveis.find((carona) => carona.id === caronaId);
    const reservaExistente = reservas.some((reserva) => reserva.caronaId === caronaId);

    if (!caronaSelecionada || caronaSelecionada.vagasRestantes === 0 || reservaExistente) return false;

    setReservas((reservasAtuais) => [...reservasAtuais, { caronaId, status: 'Confirmada' }]);
    setCaronasDisponiveis((caronasAtuais) => caronasAtuais.map((carona) => (
      carona.id === caronaId ? { ...carona, vagasRestantes: carona.vagasRestantes - 1 } : carona
    )));
    return true;
  };

  return (
    <CaronasContext.Provider value={{ usuarioLogado, caronasDisponiveis, reservas, solicitarReserva }}>
      {children}
    </CaronasContext.Provider>
  );
}

export function useCaronas() {
  return useContext(CaronasContext);
}
