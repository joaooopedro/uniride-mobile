import { eventosDasMensagens, eventosDasReservas, filtrarNovos, viagemEmDestaque } from "../eventos";

const carona = (extra = {}) => ({ id: "c1", status: "aberta", saidaEm: new Date(Date.now() + 3600e3), motorista: { nome: "Ana" }, ...extra });
const reserva = (extra = {}) => ({ id: "c1_p", caronaId: "c1", passageiroId: "p", motoristaId: "m", passageiro: { nome: "Paulo" }, ...extra });

test("motorista recebe pedido e cancelamento do passageiro, não o próprio cancelamento", () => {
  const eventos = eventosDasReservas({
    uid: "m",
    doMotorista: [reserva({ status: "solicitada" }), reserva({ id: "c1_q", status: "cancelada", canceladaPor: "passageiro" }), reserva({ id: "c1_r", status: "cancelada", canceladaPor: "motorista" })],
  });
  expect(eventos.map((e) => e.chave)).toEqual(["c1_p:solicitada", "c1_q:cancelada"]);
  expect(eventos[0]).toMatchObject({ rota: "DetalhesCarona", parametros: { caronaId: "c1" } });
});

test("passageiro recebe aceite, recusa, cancelamento do motorista e início da viagem", () => {
  const eventos = eventosDasReservas({
    uid: "p",
    doPassageiro: [
      { reserva: reserva({ status: "aceita" }), carona: carona({ status: "em_andamento" }) },
      { reserva: reserva({ id: "c2_p", caronaId: "c2", status: "recusada" }), carona: carona({ id: "c2" }) },
      { reserva: reserva({ id: "c3_p", caronaId: "c3", status: "cancelada", canceladaPor: "passageiro" }), carona: carona({ id: "c3" }) },
      { reserva: reserva({ id: "c4_p", caronaId: "c4", status: "cancelada", canceladaPor: "motorista" }), carona: carona({ id: "c4" }) },
    ],
  });
  expect(eventos.map((e) => e.chave)).toEqual(["c1_p:aceita", "c1:em_andamento", "c2_p:recusada", "c4_p:cancelada"]);
});

test("mensagem do próprio usuário não notifica", () => {
  const conversas = [
    { carona: carona(), ultimaMensagem: { id: "1", autorId: "p", autorNome: "Paulo", texto: "oi" } },
    { carona: carona({ id: "c2" }), ultimaMensagem: { id: "2", autorId: "m", autorNome: "Ana", texto: "cheguei" } },
  ];
  expect(eventosDasMensagens({ uid: "p", conversas })).toEqual([
    { chave: "msg:c2:2", titulo: "Ana", corpo: "cheguei", rota: "Conversa", parametros: { caronaId: "c2" } },
  ]);
});

test("primeira carga só marca como visto; depois notifica uma vez cada evento", () => {
  const a = { chave: "a" }, b = { chave: "b" };
  const inicio = filtrarNovos([a], {});
  expect(inicio.novos).toEqual([]);
  const segunda = filtrarNovos([a, b], inicio.vistos);
  expect(segunda.novos).toEqual([b]);
  expect(filtrarNovos([a, b], segunda.vistos).novos).toEqual([]);
  expect(filtrarNovos([], {}).vistos).toHaveProperty("inicio");
});

test("viagem em destaque: aceita, perto da saída ou em andamento", () => {
  const agora = Date.now();
  const longe = { reserva: reserva({ status: "aceita" }), carona: carona({ saidaEm: new Date(agora + 5 * 3600e3) }) };
  const perto = { reserva: reserva({ status: "aceita" }), carona: carona({ id: "c2", saidaEm: new Date(agora + 3600e3) }) };
  const pedida = { reserva: reserva({ status: "solicitada" }), carona: carona({ id: "c3", saidaEm: new Date(agora + 600e3) }) };
  expect(viagemEmDestaque([longe, perto, pedida], agora).carona.id).toBe("c2");
  expect(viagemEmDestaque([longe], agora)).toBeNull();
});
