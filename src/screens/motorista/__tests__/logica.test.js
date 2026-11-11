import {
  acoesDaRota,
  ajustarValor,
  chaveDaRota,
  dataParaIso,
  ehErroSemVaga,
  errosOferta,
  lerDataBr,
  mascararData,
  mascararHora,
  mesclarEndereco,
  montarSaida,
  ofertaVazia,
  proximosDias,
  restaurarRascunho,
  resultadoResposta,
  rotuloStatus,
  separarRotas,
  validarVeiculo,
} from "../logica";

const dataBr = (data) => `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
const daquiDias = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const veiculo = (extra = {}) => ({
  marca: "Fiat",
  modelo: "Argo",
  cor: "Prata",
  placa: "ABC-1234",
  lugares: 3,
  cnhValidade: dataBr(daquiDias(365)),
  chavePix: "motorista@uniride.app",
  ...extra,
});

describe("datas digitadas", () => {
  test("mascararData monta dd/mm/aaaa", () => {
    expect(mascararData("1")).toBe("1");
    expect(mascararData("1503")).toBe("15/03");
    expect(mascararData("15032027")).toBe("15/03/2027");
    expect(mascararData("15/03/20279")).toBe("15/03/2027");
  });

  test("lerDataBr só aceita data que existe", () => {
    expect(lerDataBr("15/03/2027")).toEqual(new Date(2027, 2, 15));
    expect(lerDataBr("31/02/2027")).toBeNull();
    expect(lerDataBr("15/03")).toBeNull();
    expect(lerDataBr("")).toBeNull();
  });

  test("mascararHora e montarSaida", () => {
    expect(mascararHora("1830")).toBe("18:30");
    expect(montarSaida("2027-03-15", "18:30")).toEqual(new Date(2027, 2, 15, 18, 30));
    expect(montarSaida("2027-03-15", "25:00")).toBeNull();
    expect(montarSaida("", "18:30")).toBeNull();
  });

  test("proximosDias começa em Hoje e tem 14 dias", () => {
    const dias = proximosDias(new Date(2026, 10, 11, 9));
    expect(dias).toHaveLength(14);
    expect(dias[0]).toEqual({ iso: "2026-11-11", rotulo: "Hoje" });
    expect(dias[1].rotulo).toBe("Amanhã");
    expect(dias[2]).toEqual({ iso: "2026-11-13", rotulo: "sex 13/11" });
  });
});

describe("validarVeiculo", () => {
  test("aceita placa antiga e Mercosul", () => {
    expect(validarVeiculo(veiculo())).toEqual({});
    expect(validarVeiculo(veiculo({ placa: "ABC1D23" }))).toEqual({});
  });

  test("recusa placa curta, CNH vencida e campos vazios", () => {
    expect(validarVeiculo(veiculo({ placa: "ABC12" })).placa).toBeTruthy();
    expect(validarVeiculo(veiculo({ cnhValidade: dataBr(daquiDias(-1)) })).cnhValidade).toBe("A CNH está vencida.");
    expect(validarVeiculo(veiculo({ cnhValidade: "31/02/2030" })).cnhValidade).toBeTruthy();
    const vazio = validarVeiculo({ marca: "", modelo: "", cor: "", placa: "", lugares: 0, cnhValidade: "", chavePix: "" });
    expect(Object.keys(vazio).sort()).toEqual(["chavePix", "cnhValidade", "cor", "lugares", "marca", "modelo", "placa"]);
    expect(validarVeiculo(veiculo({ lugares: 7 })).lugares).toBeTruthy();
  });
});

describe("errosOferta", () => {
  const amanha = dataParaIso(daquiDias(1));
  const oferta = (extra = {}) => ({
    rua: "Rua Halfeld",
    bairro: "Centro",
    ponto: "",
    lat: -21.76,
    lng: -43.35,
    campusDestino: "Campus Estrela Sul",
    dia: amanha,
    hora: "18:30",
    vagas: 2,
    valorCentavos: 650,
    ...extra,
  });

  test("oferta completa passa", () => {
    expect(errosOferta(oferta(), 3)).toEqual({});
  });

  test("recusa saída no passado, falta de ponto no mapa e vagas acima do carro", () => {
    expect(errosOferta(oferta({ dia: dataParaIso(daquiDias(-1)) }), 3).saida).toBeTruthy();
    expect(errosOferta(oferta({ lat: null }), 3).mapa).toBeTruthy();
    expect(errosOferta(oferta({ lng: undefined }), 3).mapa).toBeTruthy();
    expect(errosOferta(oferta({ vagas: 4 }), 3).vagas).toBe("Escolha de 1 a 3 vagas.");
    expect(errosOferta(oferta({ vagas: 0 }), 3).vagas).toBeTruthy();
  });

  test("hora completa e inexistente tem mensagem própria", () => {
    expect(errosOferta(oferta({ hora: "25:00" }), 3).saida).toBe("Horário inválido. Use hh:mm entre 00:00 e 23:59.");
    expect(errosOferta(oferta({ hora: "18:3" }), 3).saida).toBe("Informe data e hora de saída.");
  });

  test("bairro, ponto, campus e valor", () => {
    expect(errosOferta(oferta({ bairro: " " }), 3).bairro).toBeTruthy();
    expect(errosOferta(oferta({ rua: "", ponto: "" }), 3).ponto).toBeTruthy();
    expect(errosOferta(oferta({ rua: "", ponto: "Padaria" }), 3).ponto).toBeUndefined();
    expect(errosOferta(oferta({ campusDestino: "" }), 3).campus).toBeTruthy();
    expect(errosOferta(oferta({ valorCentavos: 5050 }), 3).valor).toBe("Valor deve ficar entre R$ 0,00 e R$ 50,00.");
  });

  test("feriado não bloqueia a oferta", () => {
    jest.useFakeTimers({ now: new Date(2026, 10, 11, 9) });
    try {
      expect(errosOferta(oferta({ dia: "2026-11-15" }), 3)).toEqual({});
    } finally {
      jest.useRealTimers();
    }
  });
});

test("ajustarValor fica entre R$ 0,00 e R$ 50,00", () => {
  expect(ajustarValor(650, 50)).toBe(700);
  expect(ajustarValor(0, -50)).toBe(0);
  expect(ajustarValor(5000, 50)).toBe(5000);
  expect(ajustarValor(4980, 50)).toBe(5000);
});

describe("rotas do motorista", () => {
  const rota = (id, status, horas) => ({ id, status, saidaEm: new Date(2026, 10, 20, horas) });

  test("separarRotas ordena próximas e anteriores", () => {
    const { proximas, anteriores } = separarRotas([
      rota("a", "aberta", 18),
      rota("b", "concluida", 7),
      rota("c", "em_andamento", 8),
      rota("d", "cancelada", 9),
    ]);
    expect(proximas.map((r) => r.id)).toEqual(["c", "a"]);
    expect(anteriores.map((r) => r.id)).toEqual(["d", "b"]);
  });

  test("acoesDaRota por status", () => {
    expect(acoesDaRota("aberta")).toEqual(["iniciar", "cancelar", "conversa"]);
    expect(acoesDaRota("em_andamento")).toEqual(["concluir", "conversa"]);
    expect(acoesDaRota("concluida")).toEqual([]);
    expect(acoesDaRota("cancelada")).toEqual([]);
  });

  test("rotuloStatus e erro de vaga", () => {
    expect(rotuloStatus("aberta")).toBe("Aguardando Saída");
    expect(rotuloStatus("em_andamento")).toBe("Em Andamento");
    expect(ehErroSemVaga("Não há mais vagas nesta carona.")).toBe(true);
    expect(ehErroSemVaga("Esta carona já lotou.")).toBe(true);
    expect(ehErroSemVaga("Este pedido já foi respondido.")).toBe(false);
    expect(ehErroSemVaga("Você já pediu vaga nesta carona.")).toBe(false);
    expect(ehErroSemVaga("Não foi possível pedir a vaga.")).toBe(false);
  });
});

describe("rascunho", () => {
  const hoje = "2026-11-11";
  const salvo = (extra = {}) => ({ uid: "u1", salvoEm: 1, bairro: "Centro", dia: "2026-11-13", vagas: 2, ...extra });

  test("restaura do mesmo dono sem uid e salvoEm", () => {
    const oferta = restaurarRascunho(salvo(), 3, hoje, "u1");
    expect(oferta).toEqual({ ...ofertaVazia(3, hoje), bairro: "Centro", dia: "2026-11-13", vagas: 2 });
    expect(oferta).not.toHaveProperty("uid");
    expect(oferta).not.toHaveProperty("salvoEm");
  });

  test("campo faltando vem da oferta vazia", () => {
    const { rua, ...semRua } = salvo();
    expect(restaurarRascunho(semRua, 3, hoje, "u1").rua).toBe("");
  });

  test("dia passado vira hoje e vagas ficam no limite do carro", () => {
    const oferta = restaurarRascunho(salvo({ dia: "2026-11-01", vagas: 5 }), 3, hoje, "u1");
    expect(oferta.dia).toBe(hoje);
    expect(oferta.vagas).toBe(3);
  });

  test("outro dono, sem dono ou sem rascunho devolve null", () => {
    expect(restaurarRascunho(salvo(), 3, hoje, "u2")).toBeNull();
    expect(restaurarRascunho(salvo({ uid: undefined }), 3, hoje, "u1")).toBeNull();
    expect(restaurarRascunho(salvo(), 3, hoje, undefined)).toBeNull();
    expect(restaurarRascunho(null, 3, hoje, "u1")).toBeNull();
  });
});

describe("rota e CEP", () => {
  const campus = { id: "academia" };

  test("chaveDaRota muda com a origem e se mantém com a mesma origem", () => {
    expect(chaveDaRota(-21.7, -43.3, campus)).toBe(chaveDaRota(-21.7, -43.3, campus));
    expect(chaveDaRota(-21.7, -43.3, campus)).not.toBe(chaveDaRota(-21.71, -43.3, campus));
    expect(chaveDaRota(-21.7, -43.3, campus)).not.toBe(chaveDaRota(-21.7, -43.3, { id: "estrela-sul" }));
    expect(chaveDaRota(null, -43.3, campus)).toBeNull();
    expect(chaveDaRota(-21.7, -43.3, null)).toBeNull();
  });

  test("mesclarEndereco mantém o que já existia quando o CEP vem vazio ou parcial", () => {
    const anterior = { rua: "Rua A", bairro: "Centro", numero: "10" };
    expect(mesclarEndereco(anterior, { rua: "", bairro: "" })).toEqual(anterior);
    expect(mesclarEndereco(anterior, { rua: "Rua B", bairro: "" })).toEqual({ ...anterior, rua: "Rua B" });
    expect(mesclarEndereco(anterior, null)).toEqual(anterior);
  });
});

test("resultadoResposta só recusa quando o aceite falha por vaga", () => {
  expect(resultadoResposta("aceitar", "Esta carona já lotou.")).toBe("recusar_sem_vaga");
  expect(resultadoResposta("aceitar", "Não há mais vagas nesta carona.")).toBe("recusar_sem_vaga");
  expect(resultadoResposta("aceitar", "Este pedido já foi respondido.")).toBe("erro");
  expect(resultadoResposta("recusar", "Não há mais vagas nesta carona.")).toBe("erro");
});
