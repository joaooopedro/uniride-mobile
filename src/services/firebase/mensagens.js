import { addDoc, collection, limitToLast, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";

import { db } from "../../config/firebase";
import { mensagemDoBanco } from "./conversao";
import { erroAmigavel, erroNegocio } from "./erros";

const colecao = (caronaId) => collection(db, "caronas", caronaId, "mensagens");

export const mensagens = {
  observar(caronaId, callback, aoErrar) {
    const consulta = query(colecao(caronaId), orderBy("criadoEm"), limitToLast(200));
    return onSnapshot(
      consulta,
      (snap) => callback(snap.docs.map(mensagemDoBanco)),
      (erro) => aoErrar?.(erroAmigavel(erro, "Não foi possível carregar a conversa.")),
    );
  },

  async enviar(caronaId, perfil, texto, tipo = "texto") {
    if (!["texto", "aviso_rapido"].includes(tipo)) throw erroNegocio("Tipo de mensagem inválido.");
    try {
      await addDoc(colecao(caronaId), {
        autorId: perfil.uid,
        autorNome: perfil.nome,
        texto,
        tipo,
        criadoEm: serverTimestamp(),
      });
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível enviar a mensagem.");
    }
  },
};
