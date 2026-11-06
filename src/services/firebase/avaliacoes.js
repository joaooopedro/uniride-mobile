import { collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, where } from "firebase/firestore";

import { db } from "../../config/firebase";
import { paraData } from "../../utils/formato";
import { erroAmigavel, erroNegocio } from "./erros";

export const avaliacoes = {
  // Grava a avaliação, marca a reserva e soma a nota no perfil do avaliado na mesma operação.
  async avaliar({ reservaId, avaliador, avaliadoId, nota, comentario = "" }) {
    const valor = Number(nota);
    if (!Number.isInteger(valor) || valor < 1 || valor > 5) throw erroNegocio("Escolha de 1 a 5 estrelas.");
    const texto = String(comentario || "").trim();
    if (texto.length > 280) throw erroNegocio("O comentário pode ter até 280 caracteres.");
    const avaliacaoId = `${reservaId}_${avaliador.uid}`;
    try {
      await runTransaction(db, async (tx) => {
        const reservaRef = doc(db, "reservas", reservaId);
        const avaliacaoRef = doc(db, "avaliacoes", avaliacaoId);
        const avaliadoRef = doc(db, "usuarios", avaliadoId);
        const [reservaSnap, avaliacaoSnap, avaliadoSnap] = await Promise.all([
          tx.get(reservaRef),
          tx.get(avaliacaoRef),
          tx.get(avaliadoRef),
        ]);
        if (!reservaSnap.exists()) throw erroNegocio("Viagem não encontrada.");
        if (avaliacaoSnap.exists()) throw erroNegocio("Você já avaliou esta viagem.");
        const reserva = reservaSnap.data();
        if (reserva.status !== "concluida") throw erroNegocio("Só dá para avaliar depois da viagem concluída.");
        const comoPassageiro = avaliador.uid === reserva.passageiroId;
        const esperado = comoPassageiro ? reserva.motoristaId : reserva.passageiroId;
        if (avaliadoId !== esperado) throw erroNegocio("Avaliação inválida para esta viagem.");
        const campoNota = comoPassageiro ? "notaMotorista" : "notaPassageiro";
        const atual = avaliadoSnap.data()[campoNota] || { soma: 0, total: 0 };
        tx.set(avaliacaoRef, {
          reservaId,
          caronaId: reserva.caronaId,
          avaliadorId: avaliador.uid,
          avaliadorNome: avaliador.nome,
          avaliadoId,
          papelAvaliado: comoPassageiro ? "motorista" : "passageiro",
          nota: valor,
          comentario: texto,
          criadoEm: serverTimestamp(),
        });
        tx.update(reservaRef, {
          [comoPassageiro ? "avaliadaPeloPassageiro" : "avaliadaPeloMotorista"]: true,
          atualizadoEm: serverTimestamp(),
        });
        tx.update(avaliadoRef, {
          [campoNota]: { soma: atual.soma + valor, total: atual.total + 1 },
          ultimaAvaliacao: avaliacaoId,
        });
      });
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível enviar a avaliação.");
    }
  },

  observarRecebidas(uid, callback, aoErrar) {
    const consulta = query(collection(db, "avaliacoes"), where("avaliadoId", "==", uid), orderBy("criadoEm", "desc"));
    return onSnapshot(
      consulta,
      (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data(), criadoEm: paraData(d.data().criadoEm) }))),
      (erro) => aoErrar?.(erroAmigavel(erro)),
    );
  },
};
