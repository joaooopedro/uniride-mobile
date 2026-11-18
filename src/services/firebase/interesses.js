import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";

import { db } from "../../config/firebase";
import { erroAmigavel, erroNegocio } from "./erros";

// Um pedido por passageiro: "preciso de carona neste dia, saindo daqui". Id do documento = uid.
const ref = (uid) => doc(db, "interesses", uid);
const falha = (aoErrar, padrao) => (erro) => aoErrar?.(erroAmigavel(erro, padrao));
const ler = (snap) => (snap.exists() ? { id: snap.id, ...snap.data() } : null);

export function validarInteresse(dados) {
  if (!dados?.origem?.rua || typeof dados.origem.lat !== "number") return "Escolha a rua de onde você sai.";
  if (!dados.campusDestino) return "Escolha o campus.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.dia || "")) return "Escolha o dia.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(dados.hora || "")) return "Horário inválido. Use hh:mm.";
  return null;
}

export const interesses = {
  observarMeu(uid, callback, aoErrar) {
    return onSnapshot(ref(uid), (snap) => callback(ler(snap)), falha(aoErrar, "Não foi possível carregar seu pedido."));
  },

  observarAbertos(callback, aoErrar) {
    return onSnapshot(
      query(collection(db, "interesses"), where("status", "==", "aberto")),
      (snap) => callback(snap.docs.map(ler)),
      falha(aoErrar, "Não foi possível carregar quem precisa de carona."),
    );
  },

  async salvar(perfil, dados) {
    const problema = validarInteresse(dados);
    if (problema) throw erroNegocio(problema);
    try {
      await setDoc(ref(perfil.uid), {
        passageiroId: perfil.uid,
        passageiro: { nome: perfil.nome, curso: `${perfil.curso}, ${perfil.periodo}° período`, fotoBase64: perfil.fotoBase64 || null },
        origem: { rua: dados.origem.rua, bairro: dados.origem.bairro || "", lat: dados.origem.lat, lng: dados.origem.lng },
        campusDestino: dados.campusDestino,
        dia: dados.dia,
        hora: dados.hora,
        status: "aberto",
        caronaId: null,
        motorista: null,
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      });
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível salvar seu pedido.");
    }
  },

  async cancelar(uid) {
    try {
      await deleteDoc(ref(uid));
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível cancelar o pedido.");
    }
  },

  // O motorista já publicou a carona com o ponto de encontro combinado; aqui só liga o pedido a ela.
  async combinar(interesse, caronaId, motorista) {
    try {
      await updateDoc(ref(interesse.passageiroId), {
        status: "combinado",
        caronaId,
        motorista: { uid: motorista.uid, nome: motorista.nome },
        atualizadoEm: serverTimestamp(),
      });
    } catch (erro) {
      throw erroAmigavel(erro, "A carona foi publicada, mas não deu para avisar o passageiro.");
    }
  },
};
