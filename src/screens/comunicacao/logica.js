import { formatarData, paraData } from "../../utils";

export const LIMITE_MENSAGEM = 500;

const PROXIMAS = ["solicitada", "aceita"];

const dataOuAgora = (valor, agora) => paraData(valor) || agora;

// Próximas: pedidos em aberto ou aceitos de carona que ainda não terminou. O resto vai para o histórico.
export function separarReservas(itens = []) {
  const proximas = [];
  const historico = [];
  itens.forEach((item) => {
    const ativa = PROXIMAS.includes(item.reserva?.status) && !["concluida", "cancelada"].includes(item.carona?.status);
    (ativa ? proximas : historico).push(item);
  });
  const saida = (item) => paraData(item.carona?.saidaEm)?.getTime() || 0;
  proximas.sort((a, b) => saida(a) - saida(b));
  historico.sort((a, b) => saida(b) - saida(a));
  return { proximas, historico };
}

// Rótulo usado no EstadoViagem. A carona em andamento ou cancelada vence o status da reserva.
export function statusDaReserva(reserva, carona) {
  const status = reserva?.status;
  if (carona?.status === "cancelada" && status !== "recusada") return "Cancelada";
  if (status === "aceita" && carona?.status === "em_andamento") return "Em andamento";
  if (status === "aceita" && carona?.status === "concluida") return "Concluída";
  const rotulos = { solicitada: "Solicitada", aceita: "Aceita", recusada: "Recusada", cancelada: "Cancelada", concluida: "Concluída" };
  return rotulos[status] || "Solicitada";
}

export function acoesDaReserva(reserva, carona) {
  const acoes = ["detalhes"];
  const status = reserva?.status;
  if (status === "aceita" && carona?.status !== "cancelada") acoes.push("conversa");
  if (status === "concluida" && !reserva.avaliadaPeloPassageiro) acoes.push("avaliar");
  return acoes;
}

function mesmoDia(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function rotuloDia(valor, agora = new Date()) {
  const data = dataOuAgora(valor, agora);
  if (mesmoDia(data, agora)) return "Hoje";
  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);
  if (mesmoDia(data, ontem)) return "Ontem";
  return formatarData(data);
}

// Lista do chat com um separador antes da primeira mensagem de cada dia.
export function itensDoChat(mensagens = [], agora = new Date()) {
  const itens = [];
  let diaAtual = null;
  mensagens.forEach((mensagem) => {
    const dia = rotuloDia(mensagem.criadoEm, agora);
    if (dia !== diaAtual) {
      diaAtual = dia;
      itens.push({ tipo: "dia", id: `dia-${dia}-${mensagem.id}`, rotulo: dia });
    }
    itens.push({ tipo: "mensagem", id: mensagem.id, mensagem });
  });
  return itens;
}

// Hora na lista de conversas: "18:20" hoje, "Ontem", ou a data.
export function horaDaConversa(valor, agora = new Date()) {
  const data = paraData(valor);
  if (!data) return "";
  const dia = rotuloDia(data, agora);
  if (dia !== "Hoje") return dia;
  return `${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
}

export function previaDaMensagem(mensagem, uid) {
  if (!mensagem) return "Nenhuma mensagem ainda";
  const autor = mensagem.autorId === uid ? "Você" : String(mensagem.autorNome || "").split(" ")[0];
  return autor ? `${autor}: ${mensagem.texto}` : mensagem.texto;
}

export function rotuloAutor(mensagem, uid, motoristaId) {
  if (mensagem.autorId === uid) return "Você";
  return mensagem.autorId === motoristaId ? `${mensagem.autorNome}, motorista` : mensagem.autorNome;
}

export function podeEnviar(texto, enviando) {
  const limpo = String(texto || "").trim();
  return !enviando && limpo.length > 0 && limpo.length <= LIMITE_MENSAGEM;
}
