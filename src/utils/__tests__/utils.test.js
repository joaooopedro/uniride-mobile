import {
  formatarDistancia, formatarDuracao, formatarMoeda, formatarNota, iniciais, mascararCep, mascararPlaca,
  mascararTelefone, paraData, turnoDaHora,
} from "../formato";
import { mediaAvaliacao, sugerirRateio } from "../rateio";
import {
  validarCep, validarCnhValidade, validarEmail, validarMatricula, validarNome, validarPlaca, validarSaida,
  validarSenha, validarTelefone, validarTextoObrigatorio,
} from "../validacao";

describe("formato", () => {
  test("moeda em reais com milhar e negativo", () => {
    expect(formatarMoeda(600)).toBe("R$ 6,00");
    expect(formatarMoeda(123456)).toBe("R$ 1.234,56");
    expect(formatarMoeda(-50)).toBe("-R$ 0,50");
    expect(formatarMoeda(undefined)).toBe("R$ 0,00");
  });

  test("distância, duração e nota", () => {
    expect(formatarDistancia(0.45)).toBe("450 m");
    expect(formatarDistancia(3.94)).toBe("3,9 km");
    expect(formatarDuracao(7.4)).toBe("7 min");
    expect(formatarDuracao(60)).toBe("1 h");
    expect(formatarDuracao(95)).toBe("1 h 35 min");
    expect(formatarNota(0)).toBe("Novo");
    expect(formatarNota(4.25)).toBe("4,3");
  });

  test("máscaras", () => {
    expect(mascararCep("36036000")).toBe("36036-000");
    expect(mascararTelefone("32999990000")).toBe("(32) 99999-0000");
    expect(mascararTelefone("3233330000")).toBe("(32) 3333-0000");
    expect(mascararPlaca("abc1234")).toBe("ABC-1234");
    expect(mascararPlaca("abc1d23")).toBe("ABC1D23");
  });

  test("iniciais, datas e turno", () => {
    expect(iniciais("ana maria ribeiro")).toBe("AR");
    expect(iniciais("")).toBe("?");
    expect(paraData({ seconds: 0 }).getTime()).toBe(0);
    expect(paraData({ toDate: () => new Date(5) }).getTime()).toBe(5);
    expect(paraData("lixo")).toBeNull();
    expect(turnoDaHora(new Date(2026, 10, 6, 7))).toBe("Manhã");
    expect(turnoDaHora(new Date(2026, 10, 6, 13))).toBe("Tarde");
    expect(turnoDaHora(new Date(2026, 10, 6, 19))).toBe("Noite");
  });
});

describe("validação", () => {
  test("e-mail, senha e nome", () => {
    expect(validarEmail("aluno@uniacademia.edu.br")).toBeNull();
    expect(validarEmail("aluno@")).toBe("E-mail inválido.");
    expect(validarSenha("abc12345")).toBeNull();
    expect(validarSenha("abcdefgh")).toBe("Use letras e números na senha.");
    expect(validarSenha("a1")).toMatch(/8 caracteres/);
    expect(validarNome("Ana")).toBe("Informe nome e sobrenome.");
    expect(validarNome("Ana Ribeiro")).toBeNull();
  });

  test("documentos e contato", () => {
    expect(validarMatricula("123456")).toBeNull();
    expect(validarMatricula("123")).toMatch(/entre 6 e 12/);
    expect(validarTelefone("(32) 99999-0000")).toBeNull();
    expect(validarTelefone("(32) 3333-0000")).toMatch(/celular/);
    expect(validarCep("36036-000")).toBeNull();
    expect(validarCep("3603")).toBe("O CEP tem 8 números.");
  });

  test("placa antiga e Mercosul", () => {
    expect(validarPlaca("ABC-1234")).toBeNull();
    expect(validarPlaca("abc1d23")).toBeNull();
    expect(validarPlaca("AB12345")).toMatch(/Placa inválida/);
  });

  test("datas de CNH e saída", () => {
    expect(validarCnhValidade(new Date(Date.now() + 86400e3))).toBeNull();
    expect(validarCnhValidade(new Date(2000, 0, 1))).toBe("A CNH está vencida.");
    expect(validarSaida(new Date(Date.now() + 3600e3))).toBeNull();
    expect(validarSaida(new Date(Date.now() - 60e3))).toMatch(/5 minutos/);
    expect(validarSaida(new Date(Date.now() + 61 * 86400e3))).toMatch(/60 dias/);
    expect(validarTextoObrigatorio("  ", "Bairro")).toBe("Bairro é obrigatório.");
  });
});

describe("rateio e média", () => {
  test("sugestão respeita mínimo, máximo e arredonda para 50 centavos", () => {
    expect(sugerirRateio(1, 3)).toBe(300);
    expect(sugerirRateio(500, 1)).toBe(2500);
    expect(sugerirRateio(40, 3) % 50).toBe(0);
    expect(sugerirRateio(40, 3)).toBe(600);
  });

  test("média de avaliação", () => {
    expect(mediaAvaliacao(null)).toEqual({ media: 0, total: 0 });
    expect(mediaAvaliacao({ soma: 14, total: 3 })).toEqual({ media: 4.7, total: 3 });
  });
});

import { rotuloDia } from "../formato";

describe("rotuloDia", () => {
  const agora = new Date(2026, 10, 18, 11, 0);
  it("diz hoje, amanhã ou o dia da semana", () => {
    expect(rotuloDia(new Date(2026, 10, 18, 23, 0), agora)).toBe("Hoje");
    expect(rotuloDia(new Date(2026, 10, 19, 7, 0), agora)).toBe("Amanhã");
    expect(rotuloDia(new Date(2026, 10, 20, 7, 0), agora)).toBe("sex, 20/11");
  });
});

import { codigoPix, crc16 } from "../pix";

describe("pix", () => {
  it("calcula o CRC16-CCITT padrão", () => {
    expect(crc16("123456789")).toBe("29B1");
  });
  it("monta o código com chave, valor, nome e CRC no fim", () => {
    const codigo = codigoPix({ chave: "gabriel@uniride.app", nome: "Gabriel Caputo Morais", centavos: 450 });
    expect(codigo.startsWith("000201")).toBe(true);
    expect(codigo).toContain("0014br.gov.bcb.pix0119gabriel@uniride.app");
    expect(codigo).toContain("54044.50");
    expect(codigo).toContain("5921GABRIEL CAPUTO MORAIS");
    expect(codigo.slice(-4)).toBe(crc16(codigo.slice(0, -4)));
    expect(codigoPix({ chave: "", centavos: 100 })).toBe("");
  });
});

import { pontoDeEncontro, textoCaminhada } from "../encontro";

describe("pontoDeEncontro", () => {
  // Rota reta de oeste para leste; passageiro um pouco ao norte do meio dela.
  const linha = [
    [-21.76, -43.36],
    [-21.76, -43.34],
  ];
  it("projeta o passageiro no caminho do motorista", () => {
    const ponto = pontoDeEncontro(linha, { lat: -21.757, lng: -43.35 });
    expect(ponto.lat).toBeCloseTo(-21.76, 4);
    expect(ponto.lng).toBeCloseTo(-43.35, 4);
    expect(ponto.distancia).toBeGreaterThan(300);
    expect(ponto.distancia).toBeLessThan(370);
  });
  it("prende no fim da rota quando o passageiro está depois dele", () => {
    const ponto = pontoDeEncontro(linha, { lat: -21.76, lng: -43.3 });
    expect(ponto.lng).toBeCloseTo(-43.34, 4);
    expect(pontoDeEncontro([], { lat: 0, lng: 0 })).toBeNull();
  });
  it("descreve a caminhada", () => {
    expect(textoCaminhada(40)).toBe("Na porta do passageiro");
    expect(textoCaminhada(347)).toBe("350 m a pé para o passageiro");
    expect(textoCaminhada(1234)).toBe("1,2 km a pé para o passageiro");
  });
});

import { pedidoVencido } from "../encontro";

describe("pedidoVencido", () => {
  const agora = new Date(2026, 10, 18, 12, 0);
  it("vence meia hora depois do horário pedido", () => {
    expect(pedidoVencido({ dia: "2026-11-18", hora: "11:45" }, agora)).toBe(false);
    expect(pedidoVencido({ dia: "2026-11-18", hora: "11:20" }, agora)).toBe(true);
    expect(pedidoVencido({ dia: "2026-11-19", hora: "07:00" }, agora)).toBe(false);
    expect(pedidoVencido({ dia: "", hora: "" }, agora)).toBe(true);
  });
});
