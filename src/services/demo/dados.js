// Dados de exemplo do modo demonstração (EXPO_PUBLIC_MODO_DEMO=1).
const agora = Date.now();
const emHoras = (horas) => new Date(agora + horas * 60 * 60 * 1000);

const veiculo = (marca, modelo, cor, placa) => ({ marca, modelo, cor, placa });

export const USUARIO_DEMO = {
  uid: "demo-joao",
  email: "joao.demo@uniride.app",
  emailVerificado: true,
};

export function criarDadosIniciais() {
  const usuarios = {
    "demo-joao": {
      uid: "demo-joao",
      nome: "João Pedro Silva",
      email: USUARIO_DEMO.email,
      matricula: "202301842",
      curso: "Ciência da Computação",
      periodo: 5,
      telefone: "(32) 99812-3317",
      fotoBase64: null,
      ehMotorista: true,
      motorista: {
        veiculo: veiculo("Volkswagen", "Gol", "Branco", "RTA4F32"),
        lugares: 3,
        cnhValidade: "2029-05-10",
        chavePix: "joao.silva@uniride.app",
      },
      notaMotorista: { soma: 43, total: 9 },
      notaPassageiro: { soma: 24, total: 5 },
    },
    "demo-mariana": {
      uid: "demo-mariana",
      nome: "Mariana Costa",
      curso: "Administração",
      periodo: 5,
      ehMotorista: true,
      notaMotorista: { soma: 98, total: 20 },
      notaPassageiro: { soma: 0, total: 0 },
    },
    "demo-rafael": {
      uid: "demo-rafael",
      nome: "Rafael Mendes",
      curso: "Engenharia de Software",
      periodo: 6,
      ehMotorista: true,
      notaMotorista: { soma: 67, total: 14 },
      notaPassageiro: { soma: 9, total: 2 },
    },
    "demo-bianca": {
      uid: "demo-bianca",
      nome: "Bianca Reis",
      curso: "Psicologia",
      periodo: 4,
      ehMotorista: false,
      notaMotorista: { soma: 0, total: 0 },
      notaPassageiro: { soma: 29, total: 6 },
    },
  };

  const resumo = (uid) => {
    const u = usuarios[uid];
    const nota = u.notaMotorista.total ? u.notaMotorista.soma / u.notaMotorista.total : 0;
    return {
      nome: u.nome,
      curso: `${u.curso}, ${u.periodo}º período`,
      nota: Math.round(nota * 10) / 10,
      fotoBase64: null,
      veiculo: u.motorista?.veiculo || null,
    };
  };

  const carona = (id, motoristaId, dados) => ({
    id,
    motoristaId,
    motorista: resumo(motoristaId),
    participantes: [motoristaId],
    passageirosAceitos: [],
    status: "aberta",
    criadoEm: new Date(agora - 60 * 60 * 1000),
    ...dados,
  });

  usuarios["demo-mariana"].motorista = {
    veiculo: veiculo("Chevrolet", "Onix", "Prata", "ABC1234"),
    lugares: 4,
    chavePix: "mariana.costa@uniride.app",
  };
  usuarios["demo-rafael"].motorista = {
    veiculo: veiculo("Hyundai", "HB20", "Azul", "JFO4C21"),
    lugares: 3,
    chavePix: "rafael.mendes@uniride.app",
  };

  const caronas = {
    "demo-c1": carona("demo-c1", "demo-mariana", {
      origem: { cep: "36033-270", rua: "Rua José Lourenço Kelmer", numero: "1300", bairro: "São Pedro", ponto: "Em frente ao posto", lat: -21.7795, lng: -43.3702 },
      campusDestino: "Campus Academia (Centro)",
      destino: { lat: -21.7612, lng: -43.3496 },
      saidaEm: emHoras(3),
      vagasTotais: 3,
      vagasRestantes: 2,
      valorCentavos: 600,
      rota: { distanciaKm: 5.8, duracaoMin: 14, linha: [[-21.7795, -43.3702], [-21.772, -43.362], [-21.7612, -43.3496]] },
      passageirosAceitos: [{ uid: "demo-bianca", nome: "Bianca Reis" }],
      participantes: ["demo-mariana", "demo-bianca"],
    }),
    "demo-c2": carona("demo-c2", "demo-rafael", {
      origem: { cep: "36025-290", rua: "Rua Padre Café", numero: "", bairro: "São Mateus", ponto: "Praça do São Mateus, em frente à igreja", lat: -21.7735, lng: -43.3528 },
      campusDestino: "Campus Estrela Sul",
      destino: { lat: -21.7774, lng: -43.3711 },
      saidaEm: emHoras(5),
      vagasTotais: 3,
      vagasRestantes: 3,
      valorCentavos: 450,
      rota: { distanciaKm: 3.9, duracaoMin: 11, linha: [[-21.7735, -43.3528], [-21.776, -43.362], [-21.7774, -43.3711]] },
    }),
    "demo-c3": carona("demo-c3", "demo-joao", {
      origem: { cep: "36026-500", rua: "Rua Oscar Vidal", numero: "120", bairro: "Centro", ponto: "Em frente à padaria", lat: -21.7655, lng: -43.3466 },
      campusDestino: "Campus Estrela Sul",
      destino: { lat: -21.7774, lng: -43.3711 },
      saidaEm: emHoras(26),
      vagasTotais: 3,
      vagasRestantes: 3,
      valorCentavos: 500,
      rota: { distanciaKm: 4.6, duracaoMin: 13, linha: [[-21.7655, -43.3466], [-21.771, -43.359], [-21.7774, -43.3711]] },
    }),
  };

  const reservas = {
    "demo-c1_demo-joao": {
      id: "demo-c1_demo-joao", caronaId: "demo-c1", passageiroId: "demo-joao", motoristaId: "demo-mariana",
      passageiro: { nome: "João Pedro Silva", curso: "Ciência da Computação, 5º período", nota: 4.8, fotoBase64: null },
      status: "solicitada", avaliadaPeloPassageiro: false, avaliadaPeloMotorista: false,
      criadoEm: new Date(agora - 20 * 60 * 1000), atualizadoEm: new Date(agora - 20 * 60 * 1000),
    },
    "demo-c3_demo-bianca": {
      id: "demo-c3_demo-bianca", caronaId: "demo-c3", passageiroId: "demo-bianca", motoristaId: "demo-joao",
      passageiro: { nome: "Bianca Reis", curso: "Psicologia, 4º período", nota: 4.8, fotoBase64: null },
      status: "solicitada", avaliadaPeloPassageiro: false, avaliadaPeloMotorista: false,
      criadoEm: new Date(agora - 8 * 60 * 1000), atualizadoEm: new Date(agora - 8 * 60 * 1000),
    },
  };

  const mensagens = {
    "demo-c1": [
      { id: "m1", autorId: "demo-mariana", autorNome: "Mariana Costa", texto: "Boa tarde! Saio do posto pontualmente.", tipo: "texto", criadoEm: new Date(agora - 40 * 60 * 1000) },
      { id: "m2", autorId: "demo-bianca", autorNome: "Bianca Reis", texto: "Cheguei no ponto de encontro", tipo: "aviso_rapido", criadoEm: new Date(agora - 5 * 60 * 1000) },
    ],
  };

  return { usuarios, caronas, reservas, mensagens, avaliacoes: {} };
}
