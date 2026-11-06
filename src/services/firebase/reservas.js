import { collection, doc, onSnapshot, query, runTransaction, serverTimestamp, where } from "firebase/firestore";

import { db } from "../../config/firebase";
import { mediaAvaliacao } from "../../utils/rateio";
import { reservaDoBanco } from "./conversao";
import { erroAmigavel, erroNegocio } from "./erros";

const colecao = collection(db, "reservas");
const ref = (id) => doc(db, "reservas", id);
const caronaRef = (id) => doc(db, "caronas", id);
const falha = (aoErrar, padrao) => (erro) => aoErrar?.(erroAmigavel(erro, padrao));

const lista = (callback) => (snap) => callback(snap.docs.map(reservaDoBanco));

async function transacao(acao, padrao) {
  try {
    return await runTransaction(db, acao);
  } catch (erro) {
    throw erroAmigavel(erro, padrao);
  }
}

export const reservas = {
  observarDoPassageiro(uid, callback, aoErrar) {
    return onSnapshot(query(colecao, where("passageiroId", "==", uid)), lista(callback), falha(aoErrar));
  },

  observarDoMotorista(uid, callback, aoErrar) {
    return onSnapshot(query(colecao, where("motoristaId", "==", uid)), lista(callback), falha(aoErrar));
  },

  observarDaCaronaComoMotorista(caronaId, uid, callback, aoErrar) {
    const consulta = query(colecao, where("caronaId", "==", caronaId), where("motoristaId", "==", uid));
    return onSnapshot(consulta, lista(callback), falha(aoErrar));
  },

  observarReserva(reservaId, callback, aoErrar) {
    return onSnapshot(ref(reservaId), (snap) => callback(reservaDoBanco(snap)), falha(aoErrar));
  },

  solicitar(carona, perfil) {
    const id = `${carona.id}_${perfil.uid}`;
    return transacao(async (tx) => {
      const [caronaSnap, reservaSnap] = await Promise.all([tx.get(caronaRef(carona.id)), tx.get(ref(id))]);
      if (!caronaSnap.exists()) throw erroNegocio("Esta carona não existe mais.");
      const atual = caronaSnap.data();
      if (atual.motoristaId === perfil.uid) throw erroNegocio("Você não pode reservar a própria carona.");
      if (atual.status !== "aberta") throw erroNegocio("Esta carona não aceita mais pedidos.");
      if (atual.saidaEm.toMillis() < Date.now()) throw erroNegocio("Esta carona já saiu.");
      if (atual.vagasRestantes < 1) throw erroNegocio("Esta carona já lotou.");
      const passageiro = {
        nome: perfil.nome,
        curso: `${perfil.curso}, ${perfil.periodo}º período`,
        nota: perfil.notaPassageiro?.media ?? mediaAvaliacao(perfil.notaPassageiro).media,
        fotoBase64: perfil.fotoBase64 || null,
      };
      if (reservaSnap.exists()) {
        const status = reservaSnap.data().status;
        if (status === "recusada") throw erroNegocio("O motorista recusou seu pedido nesta carona.");
        if (status !== "cancelada") throw erroNegocio("Você já pediu vaga nesta carona.");
        tx.update(ref(id), { status: "solicitada", passageiro, atualizadoEm: serverTimestamp() });
      } else {
        tx.set(ref(id), {
          caronaId: carona.id,
          passageiroId: perfil.uid,
          motoristaId: atual.motoristaId,
          passageiro,
          status: "solicitada",
          avaliadaPeloPassageiro: false,
          avaliadaPeloMotorista: false,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
        });
      }
      return id;
    }, "Não foi possível pedir a vaga.");
  },

  // Aceite e vaga mudam juntos: dois aceites ao mesmo tempo não passam do limite.
  aceitar(reservaId) {
    return transacao(async (tx) => {
      const reservaSnap = await tx.get(ref(reservaId));
      if (!reservaSnap.exists()) throw erroNegocio("Pedido não encontrado.");
      const reserva = reservaSnap.data();
      const caronaSnap = await tx.get(caronaRef(reserva.caronaId));
      const carona = caronaSnap.data();
      if (reserva.status !== "solicitada") throw erroNegocio("Este pedido já foi respondido.");
      if (carona.status !== "aberta") throw erroNegocio("Esta carona não aceita mais passageiros.");
      if (carona.vagasRestantes < 1) throw erroNegocio("Não há mais vagas nesta carona.");
      tx.update(caronaRef(reserva.caronaId), {
        vagasRestantes: carona.vagasRestantes - 1,
        participantes: [...carona.participantes, reserva.passageiroId],
        passageirosAceitos: [...carona.passageirosAceitos, { uid: reserva.passageiroId, nome: reserva.passageiro.nome }],
        atualizadoEm: serverTimestamp(),
      });
      tx.update(ref(reservaId), { status: "aceita", atualizadoEm: serverTimestamp() });
    }, "Não foi possível aceitar o pedido.");
  },

  recusar(reservaId) {
    return transacao(async (tx) => {
      const snap = await tx.get(ref(reservaId));
      if (!snap.exists() || snap.data().status !== "solicitada") throw erroNegocio("Este pedido já foi respondido.");
      tx.update(ref(reservaId), { status: "recusada", atualizadoEm: serverTimestamp() });
    }, "Não foi possível recusar o pedido.");
  },

  // Cancelamento pelo passageiro. Se já estava aceita, a vaga volta para a carona.
  cancelar(reservaId) {
    return transacao(async (tx) => {
      const reservaSnap = await tx.get(ref(reservaId));
      if (!reservaSnap.exists()) throw erroNegocio("Reserva não encontrada.");
      const reserva = reservaSnap.data();
      if (!["solicitada", "aceita"].includes(reserva.status)) throw erroNegocio("Esta reserva não está mais ativa.");
      if (reserva.status === "aceita") {
        const caronaSnap = await tx.get(caronaRef(reserva.caronaId));
        const carona = caronaSnap.data();
        if (carona.status !== "aberta") throw erroNegocio("A viagem já começou. Fale com o motorista pelo chat.");
        tx.update(caronaRef(reserva.caronaId), {
          vagasRestantes: carona.vagasRestantes + 1,
          participantes: carona.participantes.filter((uid) => uid !== reserva.passageiroId),
          passageirosAceitos: carona.passageirosAceitos.filter((p) => p.uid !== reserva.passageiroId),
          atualizadoEm: serverTimestamp(),
        });
      }
      tx.update(ref(reservaId), { status: "cancelada", canceladaPor: "passageiro", atualizadoEm: serverTimestamp() });
    }, "Não foi possível cancelar a reserva.");
  },
};
