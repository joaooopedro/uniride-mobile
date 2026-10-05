import React, { createContext, useContext, useState } from 'react';

const CaronasContext = createContext({});

const caronasMockadas = [
  { id: 'carona-001', motorista: 'Mariana Costa', iniciaisMotorista: 'MC', notaMotorista: '4.9', bairroOrigem: 'Cascatinha', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '07:10', modeloCarro: 'Onix Prata', placaCarro: 'ABC-1234', vagasRestantes: 2, valorRateio: 'R$ 6,00', pontoEncontro: 'Rua José Lourenço Kelmer, em frente ao posto', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', motoristaCurso: 'Administração, 5º período', telefoneEmergencia: '(32) 9****-4821', marcaCarro: 'Chevrolet', corCarro: 'Prata', comodidades: ['Ar-condicionado', 'Música', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Ana Clara', iniciais: 'AC' }, { nome: 'Pedro Henrique', iniciais: 'PH' }], chavePix: 'mariana.costa@uniride.edu.br', alunoVerificado: true },
  { id: 'carona-002', motorista: 'Rafael Mendes', iniciaisMotorista: 'RM', notaMotorista: '4.8', bairroOrigem: 'São Mateus', campusDestino: 'Campus Estrela Sul', turno: 'Noite', horarioSaida: '18:20', modeloCarro: 'HB20 Azul', placaCarro: 'JFO-4821', vagasRestantes: 1, valorRateio: 'R$ 7,00', pontoEncontro: 'Praça do São Mateus, em frente à Igreja', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Estrela Sul', motoristaCurso: 'Engenharia de Software, 6º período', telefoneEmergencia: '(32) 9****-1098', marcaCarro: 'Hyundai', corCarro: 'Azul', comodidades: ['Ar-condicionado', 'Música'], passageirosConfirmados: [{ nome: 'Lucas Alves', iniciais: 'LA' }, { nome: 'Bianca Reis', iniciais: 'BR' }], chavePix: 'rafael.mendes@uniride.edu.br', alunoVerificado: true },
  { id: 'carona-003', motorista: 'Beatriz Almeida', iniciaisMotorista: 'BA', notaMotorista: '5.0', bairroOrigem: 'Alto dos Passos', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '06:50', modeloCarro: 'Fit Branco', placaCarro: 'DEF-9062', vagasRestantes: 3, valorRateio: 'R$ 5,50', pontoEncontro: 'Avenida Rio Branco, próximo ao Carrefour', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', motoristaCurso: 'Direito, 7º período', telefoneEmergencia: '(32) 9****-7360', marcaCarro: 'Honda', corCarro: 'Branco', comodidades: ['Ar-condicionado', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Julia Souza', iniciais: 'JS' }], chavePix: 'beatriz.almeida@uniride.edu.br', alunoVerificado: true },
  { id: 'carona-004', motorista: 'Lucas Ferreira', iniciaisMotorista: 'LF', notaMotorista: '4.7', bairroOrigem: 'Santa Luzia', campusDestino: 'Campus Estrela Sul', turno: 'Noite', horarioSaida: '18:40', modeloCarro: 'Argo Cinza', placaCarro: 'GHI-7710', vagasRestantes: 0, valorRateio: 'R$ 6,50', pontoEncontro: 'Avenida Santa Luzia, em frente à praça', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Estrela Sul', motoristaCurso: 'Psicologia, 4º período', telefoneEmergencia: '(32) 9****-5512', marcaCarro: 'Fiat', corCarro: 'Cinza', comodidades: ['Música'], passageirosConfirmados: [{ nome: 'Rafaela Lima', iniciais: 'RL' }, { nome: 'Igor Dias', iniciais: 'ID' }], chavePix: 'lucas.ferreira@uniride.edu.br', alunoVerificado: true },
  { id: 'carona-005', motorista: 'Camila Rocha', iniciaisMotorista: 'CR', notaMotorista: '4.9', bairroOrigem: 'Granbery', campusDestino: 'Campus Academia (Centro)', turno: 'Noite', horarioSaida: '18:00', modeloCarro: 'Kwid Vermelho', placaCarro: 'JKL-3158', vagasRestantes: 2, valorRateio: 'R$ 5,00', pontoEncontro: 'Rua Batista de Oliveira, próximo ao Granbery', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', motoristaCurso: 'Arquitetura, 8º período', telefoneEmergencia: '(32) 9****-8843', marcaCarro: 'Renault', corCarro: 'Vermelho', comodidades: ['Ar-condicionado', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Luana Castro', iniciais: 'LC' }], chavePix: 'camila.rocha@uniride.edu.br', alunoVerificado: true },
  { id: 'carona-006', motorista: 'Thiago Martins', iniciaisMotorista: 'TM', notaMotorista: '4.6', bairroOrigem: 'Benfica', campusDestino: 'Campus Academia (Centro)', turno: 'Manhã', horarioSaida: '06:20', modeloCarro: 'Sandero Preto', placaCarro: 'MNO-2246', vagasRestantes: 1, valorRateio: 'R$ 8,00', pontoEncontro: 'Terminal de Benfica, entrada principal', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', motoristaCurso: 'Sistemas de Informação, 6º período', telefoneEmergencia: '(32) 9****-4401', marcaCarro: 'Renault', corCarro: 'Preto', comodidades: ['Música'], passageirosConfirmados: [{ nome: 'Enzo Ribeiro', iniciais: 'ER' }], chavePix: 'thiago.martins@uniride.edu.br', alunoVerificado: true },
  { id: 'carona-007', motorista: 'Juliana Nunes', iniciaisMotorista: 'JN', notaMotorista: '4.8', bairroOrigem: 'Centro', campusDestino: 'Campus Estrela Sul', turno: 'Manhã', horarioSaida: '07:30', modeloCarro: 'C3 Branco', placaCarro: 'PQR-6403', vagasRestantes: 2, valorRateio: 'R$ 6,00', pontoEncontro: 'Parque Halfeld, em frente ao ponto de ônibus', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Estrela Sul', motoristaCurso: 'Engenharia Civil, 5º período', telefoneEmergencia: '(32) 9****-2674', marcaCarro: 'Citroën', corCarro: 'Branco', comodidades: ['Ar-condicionado', 'Música', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Diego Martins', iniciais: 'DM' }], chavePix: 'juliana.nunes@uniride.edu.br', alunoVerificado: true },
  { id: 'carona-008', motorista: 'Eduardo Lopes', iniciaisMotorista: 'EL', notaMotorista: '4.9', bairroOrigem: 'Manoel Honório', campusDestino: 'Campus Academia (Centro)', turno: 'Noite', horarioSaida: '18:15', modeloCarro: 'Corolla Prata', placaCarro: 'STU-1987', vagasRestantes: 0, valorRateio: 'R$ 7,50', pontoEncontro: 'Praça de Manoel Honório, próximo à banca', destinoDetalhado: 'UniAcademia, Portaria Principal Campus Academia', motoristaCurso: 'Engenharia de Software, 6º período', telefoneEmergencia: '(32) 9****-9135', marcaCarro: 'Toyota', corCarro: 'Prata', comodidades: ['Ar-condicionado', 'Porta-malas livre'], passageirosConfirmados: [{ nome: 'Nathalia Reis', iniciais: 'NR' }, { nome: 'Otávio Lima', iniciais: 'OL' }], chavePix: 'eduardo.lopes@uniride.edu.br', alunoVerificado: true },
];

export function CaronasProvider({ children }) {
  const [usuarioLogado] = useState({ nome: 'João Pedro Silva', iniciais: 'JP', curso: 'Ciência da Computação', periodo: '5º período', matricula: '202301842', nota: '4.8', telefoneEmergencia: '(32) 9****-3317', chavePix: 'joao.silva@uniride.edu.br', veiculo: { marca: 'Volkswagen', modelo: 'Gol', cor: 'Branco', placa: 'RTA-4F32' } });
  const [caronasDisponiveis, setCaronasDisponiveis] = useState(caronasMockadas);
  const [reservas, setReservas] = useState([]);

  const adicionarCarona = (oferta) => {
    const { veiculo } = usuarioLogado;
    const novaCarona = {
      ...oferta,
      id: `carona-${Date.now()}`,
      motorista: usuarioLogado.nome,
      iniciaisMotorista: usuarioLogado.iniciais,
      notaMotorista: usuarioLogado.nota,
      motoristaCurso: `${usuarioLogado.curso}, ${usuarioLogado.periodo}`,
      telefoneEmergencia: usuarioLogado.telefoneEmergencia,
      chavePix: usuarioLogado.chavePix,
      marcaCarro: veiculo.marca,
      modeloCarro: `${veiculo.modelo} ${veiculo.cor}`,
      corCarro: veiculo.cor,
      placaCarro: veiculo.placa,
      destinoDetalhado: `UniAcademia, Portaria Principal ${oferta.campusDestino.replace(' (Centro)', '')}`,
      passageirosConfirmados: [],
      alunoVerificado: true,
    };
    setCaronasDisponiveis((caronasAtuais) => [novaCarona, ...caronasAtuais]);
    return novaCarona;
  };

  const solicitarReserva = (caronaId) => {
    const caronaSelecionada = caronasDisponiveis.find((carona) => carona.id === caronaId);
    const reservaExistente = reservas.some((reserva) => reserva.caronaId === caronaId);
    if (!caronaSelecionada || caronaSelecionada.vagasRestantes < 1 || reservaExistente) return false;
    setReservas((reservasAtuais) => [...reservasAtuais, { caronaId, status: 'Confirmada' }]);
    setCaronasDisponiveis((caronasAtuais) => caronasAtuais.map((carona) => carona.id === caronaId ? { ...carona, vagasRestantes: carona.vagasRestantes - 1 } : carona));
    return true;
  };

  return <CaronasContext.Provider value={{ usuarioLogado, caronasDisponiveis, reservas, solicitarReserva, adicionarCarona }}>{children}</CaronasContext.Provider>;
}

export function useCaronas() {
  return useContext(CaronasContext);
}
