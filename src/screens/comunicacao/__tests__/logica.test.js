import {
  acoesDaReserva,
  horaDaConversa,
  itensDoChat,
  podeEnviar,
  previaDaMensagem,
  rotuloAutor,
  rotuloDia,
  separarReservas,
  statusDaReserva,
} from "../logica";

const agora = new Date(2026, 10, 18, 15, 0);
const horasAtras = (h) => new Date(agora.getTime() - h * 3600 * 1000);
const item = (id, status, saidaEm, caronaStatus = "aberta") => ({
  reserva: { id, status },
  carona: { id: `c-${id}`, status: caronaStatus, saidaEm },
});

describe("reservas", () => {
  test("separa próximas e histórico e ordena", () => {
    const { proximas, historico } = separarReservas([
      item("a", "aceita", horasAtras(-5)),
      item("b", "solicitada", horasAtras(-2)),
      item("c", "concluida", horasAtras(30), "concluida"),
      item("d", "recusada", horasAtras(10)),
      item("e", "cancelada", horasAtras(50)),
      item("f", "aceita", horasAtras(1), "cancelada"),
    ]);
    expect(proximas.map((i) => i.reserva.id)).toEqual(["b", "a"]);
    expect(historico.map((i) => i.reserva.id)).toEqual(["f", "d", "c", "e"]);
  });

  test("lista vazia ou sem argumento", () => {
    expect(separarReservas()).toEqual({ proximas: [], historico: [] });
  });

  test("status considera a carona", () => {
    expect(statusDaReserva({ status: "solicitada" }, { status: "aberta" })).toBe("Solicitada");
    expect(statusDaReserva({ status: "aceita" }, { status: "aberta" })).toBe("Aceita");
    expect(statusDaReserva({ status: "aceita" }, { status: "em_andamento" })).toBe("Em andamento");
    expect(statusDaReserva({ status: "aceita" }, { status: "concluida" })).toBe("Concluída");
    expect(statusDaReserva({ status: "aceita" }, { status: "cancelada" })).toBe("Cancelada");
    expect(statusDaReserva({ status: "recusada" }, { status: "cancelada" })).toBe("Recusada");
    expect(statusDaReserva({ status: "concluida" }, { status: "concluida" })).toBe("Concluída");
  });

  test("ações por status", () => {
    expect(acoesDaReserva({ status: "solicitada" }, { status: "aberta" })).toEqual(["detalhes"]);
    expect(acoesDaReserva({ status: "aceita" }, { status: "aberta" })).toEqual(["detalhes", "conversa"]);
    expect(acoesDaReserva({ status: "aceita" }, { status: "cancelada" })).toEqual(["detalhes"]);
    expect(acoesDaReserva({ status: "concluida", avaliadaPeloPassageiro: false }, {})).toEqual(["detalhes", "avaliar"]);
    expect(acoesDaReserva({ status: "concluida", avaliadaPeloPassageiro: true }, {})).toEqual(["detalhes"]);
    expect(acoesDaReserva({ status: "recusada" }, {})).toEqual(["detalhes"]);
  });
});

describe("chat", () => {
  test("rótulo do dia", () => {
    expect(rotuloDia(horasAtras(1), agora)).toBe("Hoje");
    expect(rotuloDia(horasAtras(20), agora)).toBe("Ontem");
    expect(rotuloDia(new Date(2026, 10, 10, 9), agora)).toBe("10/11");
    expect(rotuloDia(null, agora)).toBe("Hoje");
  });

  test("separador antes de cada dia", () => {
    const itens = itensDoChat(
      [
        { id: "1", criadoEm: horasAtras(26) },
        { id: "2", criadoEm: horasAtras(25) },
        { id: "3", criadoEm: horasAtras(1) },
        { id: "4", criadoEm: null },
      ],
      agora,
    );
    expect(itens.map((i) => (i.tipo === "dia" ? i.rotulo : i.id))).toEqual(["Ontem", "1", "2", "Hoje", "3", "4"]);
  });

  test("hora na lista de conversas", () => {
    expect(horaDaConversa(new Date(2026, 10, 18, 9, 5), agora)).toBe("09:05");
    expect(horaDaConversa(horasAtras(20), agora)).toBe("Ontem");
    expect(horaDaConversa(null, agora)).toBe("");
  });

  test("prévia e autor", () => {
    expect(previaDaMensagem(null, "u1")).toBe("Nenhuma mensagem ainda");
    expect(previaDaMensagem({ autorId: "u1", autorNome: "Ana Lima", texto: "Oi" }, "u1")).toBe("Você: Oi");
    expect(previaDaMensagem({ autorId: "u2", autorNome: "Bruno Reis", texto: "Saindo" }, "u1")).toBe("Bruno: Saindo");
    expect(rotuloAutor({ autorId: "u1", autorNome: "Ana" }, "u1", "m")).toBe("Você");
    expect(rotuloAutor({ autorId: "m", autorNome: "Carla" }, "u1", "m")).toBe("Carla, motorista");
    expect(rotuloAutor({ autorId: "u3", autorNome: "Davi" }, "u1", "m")).toBe("Davi");
  });

  test("pode enviar", () => {
    expect(podeEnviar("  ", false)).toBe(false);
    expect(podeEnviar("oi", true)).toBe(false);
    expect(podeEnviar("oi", false)).toBe(true);
    expect(podeEnviar("a".repeat(501), false)).toBe(false);
  });
});
