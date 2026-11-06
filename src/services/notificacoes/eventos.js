import { formatarHora } from "../../utils/formato";

// Transforma o estado atual (reservas, caronas e mensagens) em eventos que viram notificação.
// Cada evento tem uma chave estável: a mesma mudança nunca notifica duas vezes.

const PARA_MOTORISTA = {
  solicitada: (r) => ({ titulo: "Novo pedido de vaga", corpo: `${r.passageiro?.nome || "Um passageiro"} quer uma vaga na sua carona.` }),
  cancelada: (r) => r.canceladaPor === "passageiro" && { titulo: "Reserva cancelada", corpo: `${r.passageiro?.nome || "Um passageiro"} cancelou a reserva.` },
};

const PARA_PASSAGEIRO = {
  aceita: (r, c) => ({ titulo: "Vaga confirmada", corpo: c ? `Saída às ${formatarHora(c.saidaEm)} com ${c.motorista?.nome}.` : "O motorista aceitou seu pedido." }),
  recusada: () => ({ titulo: "Pedido recusado", corpo: "O motorista não pôde aceitar seu pedido. Procure outra carona." }),
  cancelada: (r) => r.canceladaPor === "motorista" && { titulo: "Carona cancelada", corpo: "O motorista cancelou a carona." },
};

export function eventosDasReservas({ uid, doMotorista = [], doPassageiro = [] }) {
  const eventos = [];
  doMotorista.forEach((reserva) => {
    const texto = PARA_MOTORISTA[reserva.status]?.(reserva);
    if (texto) eventos.push({ chave: `${reserva.id}:${reserva.status}`, ...texto, rota: "DetalhesCarona", parametros: { caronaId: reserva.caronaId } });
  });
  doPassageiro.forEach(({ reserva, carona }) => {
    if (reserva.passageiroId !== uid) return;
    const texto = PARA_PASSAGEIRO[reserva.status]?.(reserva, carona);
    if (texto) eventos.push({ chave: `${reserva.id}:${reserva.status}`, ...texto, rota: "DetalhesCarona", parametros: { caronaId: reserva.caronaId } });
    if (reserva.status === "aceita" && carona?.status === "em_andamento")
      eventos.push({ chave: `${carona.id}:em_andamento`, titulo: "Viagem iniciada", corpo: `${carona.motorista?.nome} começou a viagem.`, rota: "DetalhesCarona", parametros: { caronaId: carona.id } });
  });
  return eventos;
}

export function eventosDasMensagens({ uid, conversas = [] }) {
  return conversas
    .filter(({ ultimaMensagem }) => ultimaMensagem && ultimaMensagem.autorId !== uid)
    .map(({ carona, ultimaMensagem: m }) => ({
      chave: `msg:${carona.id}:${m.id}`,
      titulo: m.autorNome,
      corpo: m.texto,
      rota: "Conversa",
      parametros: { caronaId: carona.id },
    }));
}

// Separa o que é novo. Na primeira vez (sem histórico) só marca como visto, para não despejar o passado.
export function filtrarNovos(eventos, vistos, agora = Date.now()) {
  const primeiraVez = !vistos || !Object.keys(vistos).length;
  const atualizados = { ...(vistos || {}) };
  const novos = [];
  eventos.forEach((evento) => {
    if (atualizados[evento.chave]) return;
    atualizados[evento.chave] = agora;
    if (!primeiraVez) novos.push(evento);
  });
  // Esquece o que tem mais de 30 dias.
  Object.keys(atualizados).forEach((chave) => {
    if (agora - atualizados[chave] > 30 * 86400e3) delete atualizados[chave];
  });
  if (primeiraVez && !Object.keys(atualizados).length) atualizados["inicio"] = agora;
  return { novos, vistos: atualizados };
}

// Próxima carona aceita do passageiro que merece a notificação contínua:
// em viagem, ou saída em até 2 h.
export function viagemEmDestaque(doPassageiro = [], agora = Date.now()) {
  return (
    doPassageiro
      .filter(({ reserva, carona }) => reserva.status === "aceita" && carona)
      .filter(({ carona }) => carona.status === "em_andamento" || (carona.status === "aberta" && carona.saidaEm - agora < 2 * 3600e3 && carona.saidaEm - agora > -30 * 60e3))
      .sort((a, b) => a.carona.saidaEm - b.carona.saidaEm)[0] || null
  );
}
