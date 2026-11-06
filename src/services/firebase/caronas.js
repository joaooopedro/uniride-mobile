import {

  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "../../config/firebase";
import { mediaAvaliacao } from "../../utils/rateio";
import { validarSaida, validarTextoObrigatorio } from "../../utils/validacao";
import { caronaDoBanco, linhaParaBanco, paraTimestamp } from "./conversao";
import { erroAmigavel, erroNegocio } from "./erros";

const colecao = collection(db, "caronas");
const ref = (id) => doc(db, "caronas", id);
const contatoRef = (id) => doc(db, "caronas", id, "privado", "contato");

// As regras só deixam o motorista listar reservas filtrando pelo próprio uid.
function reservasDaCarona(caronaId, status) {
  const uid = auth.currentUser?.uid;
  return getDocs(
    query(
      collection(db, "reservas"),
      where("caronaId", "==", caronaId),
      where("motoristaId", "==", uid),
      where("status", "in", status),
    ),
  );
}

const falha = (aoErrar, padrao) => (erro) => aoErrar?.(erroAmigavel(erro, padrao));

function validarOferta(perfil, dados) {
  if (!perfil?.ehMotorista || !perfil.motorista?.veiculo)
    throw erroNegocio("Cadastre seu veículo antes de oferecer carona.");
  const saida = dados.saidaEm instanceof Date ? dados.saidaEm : new Date(dados.saidaEm);
  const vagas = Number(dados.vagasTotais);
  const valor = Number(dados.valorCentavos);
  const problema =
    validarSaida(saida) ||
    validarTextoObrigatorio(dados.origem?.bairro, "Bairro", 60) ||
    validarTextoObrigatorio(dados.origem?.ponto || dados.origem?.rua, "Ponto de encontro", 120) ||
    validarTextoObrigatorio(dados.campusDestino, "Campus de destino", 60) ||
    (typeof dados.origem?.lat !== "number" || typeof dados.origem?.lng !== "number"
      ? "Marque o ponto de encontro no mapa."
      : null) ||
    (!Number.isInteger(vagas) || vagas < 1 || vagas > (perfil.motorista.lugares || 6)
      ? `Escolha de 1 a ${perfil.motorista.lugares || 6} vagas.`
      : null) ||
    (!Number.isInteger(valor) || valor < 0 || valor > 5000 ? "Valor deve ficar entre R$ 0,00 e R$ 50,00." : null);
  if (problema) throw erroNegocio(problema);
  return { saida, vagas, valor };
}

export const caronas = {
  observarAbertas(callback, aoErrar) {
    const consulta = query(
      colecao,
      where("status", "==", "aberta"),
      where("saidaEm", ">", Timestamp.now()),
      orderBy("saidaEm"),
    );
    return onSnapshot(
      consulta,
      (snap) => {
        const agora = Date.now();
        callback(snap.docs.map(caronaDoBanco).filter((c) => c.saidaEm.getTime() > agora));
      },
      falha(aoErrar, "Não foi possível carregar as caronas."),
    );
  },

  observarCarona(caronaId, callback, aoErrar) {
    return onSnapshot(ref(caronaId), (snap) => callback(caronaDoBanco(snap)), falha(aoErrar, "Não foi possível carregar a carona."));
  },

  observarDoMotorista(uid, callback, aoErrar) {
    const consulta = query(colecao, where("motoristaId", "==", uid), orderBy("saidaEm", "desc"));
    return onSnapshot(consulta, (snap) => callback(snap.docs.map(caronaDoBanco)), falha(aoErrar));
  },

  observarDoParticipante(uid, callback, aoErrar) {
    const consulta = query(colecao, where("participantes", "array-contains", uid));
    return onSnapshot(consulta, (snap) => callback(snap.docs.map(caronaDoBanco)), falha(aoErrar));
  },

  observarContato(caronaId, callback, aoErrar) {
    return onSnapshot(
      contatoRef(caronaId),
      (snap) => callback(snap.exists() ? snap.data() : null),
      falha(aoErrar),
    );
  },

  async criar(perfil, dados) {
    const { saida, vagas, valor } = validarOferta(perfil, dados);
    try {
      const novo = doc(colecao);
      const lote = writeBatch(db);
      lote.set(novo, {
        motoristaId: perfil.uid,
        motorista: {
          nome: perfil.nome,
          curso: `${perfil.curso}, ${perfil.periodo}º período`,
          nota: perfil.notaMotorista?.media ?? mediaAvaliacao(perfil.notaMotorista).media,
          fotoBase64: perfil.fotoBase64 || null,
          veiculo: perfil.motorista.veiculo,
        },
        origem: {
          cep: dados.origem.cep || "",
          rua: dados.origem.rua || "",
          numero: dados.origem.numero || "",
          bairro: dados.origem.bairro.trim(),
          ponto: (dados.origem.ponto || "").trim(),
          lat: dados.origem.lat,
          lng: dados.origem.lng,
        },
        campusDestino: dados.campusDestino,
        destino: { lat: dados.destino.lat, lng: dados.destino.lng },
        saidaEm: paraTimestamp(saida),
        vagasTotais: vagas,
        vagasRestantes: vagas,
        valorCentavos: valor,
        rota: dados.rota
          ? {
              distanciaKm: dados.rota.distanciaKm,
              duracaoMin: dados.rota.duracaoMin,
              linha: linhaParaBanco(dados.rota.linha || []),
            }
          : null,
        participantes: [perfil.uid],
        passageirosAceitos: [],
        status: "aberta",
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      });
      lote.set(doc(db, "caronas", novo.id, "privado", "contato"), {
        motoristaId: perfil.uid,
        telefone: perfil.telefone || "",
        chavePix: perfil.motorista.chavePix || "",
      });
      await lote.commit();
      return novo.id;
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível publicar a carona.");
    }
  },

  async cancelar(caronaId) {
    try {
      // Cancela a carona e todas as reservas ativas dela de uma vez.
      const reservas = await reservasDaCarona(caronaId, ["solicitada", "aceita"]);
      const lote = writeBatch(db);
      lote.update(ref(caronaId), { status: "cancelada", atualizadoEm: serverTimestamp() });
      reservas.docs.forEach((reserva) =>
        lote.update(reserva.ref, { status: "cancelada", canceladaPor: "motorista", atualizadoEm: serverTimestamp() }),
      );
      await lote.commit();
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível cancelar a carona.");
    }
  },

  async iniciar(caronaId) {
    try {
      const lote = writeBatch(db);
      lote.update(ref(caronaId), { status: "em_andamento", atualizadoEm: serverTimestamp() });
      // Pedidos ainda sem resposta não embarcam.
      const pendentes = await reservasDaCarona(caronaId, ["solicitada"]);
      pendentes.docs.forEach((reserva) => lote.update(reserva.ref, { status: "recusada", atualizadoEm: serverTimestamp() }));
      await lote.commit();
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível iniciar a viagem.");
    }
  },

  async concluir(caronaId) {
    try {
      const aceitas = await reservasDaCarona(caronaId, ["aceita"]);
      const lote = writeBatch(db);
      lote.update(ref(caronaId), { status: "concluida", atualizadoEm: serverTimestamp() });
      aceitas.docs.forEach((reserva) => lote.update(reserva.ref, { status: "concluida", atualizadoEm: serverTimestamp() }));
      await lote.commit();
    } catch (erro) {
      throw erroAmigavel(erro, "Não foi possível concluir a viagem.");
    }
  },
};

