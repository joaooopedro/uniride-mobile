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
