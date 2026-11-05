import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";

import { db } from "../../config/firebase";
import { mascararTelefone, soDigitos } from "../../utils/formato";
import {
  validarCnhValidade,
  validarMatricula,
  validarNome,
  validarPlaca,
  validarTelefone,
  validarTextoObrigatorio,
} from "../../utils/validacao";
import { erroAmigavel, erroNegocio } from "./erros";

// usuarios/{uid}: dados públicos dentro do app (nome, curso, notas, veículo).
// usuarios/{uid}/privado/dados: matrícula, e-mail, telefone e chave PIX, só o dono lê.
const publico = (uid) => doc(db, "usuarios", uid);
const privado = (uid) => doc(db, "usuarios", uid, "privado", "dados");

function exigir(...erros) {
  const primeiro = erros.find(Boolean);
  if (primeiro) throw erroNegocio(primeiro);
}

function camposPessoais({ nome, curso, periodo }) {
  const numero = Number(periodo);
  exigir(
    validarNome(nome),
    validarTextoObrigatorio(curso, "Curso", 60),
    !Number.isInteger(numero) || numero < 1 || numero > 12 ? "Período inválido." : null,
  );
  return { nome: nome.trim(), curso: curso.trim(), periodo: numero };
}

export async function criarPerfil(uid, dados) {
  const pessoais = camposPessoais(dados);
  exigir(validarMatricula(dados.matricula), validarTelefone(dados.telefone));
  const lote = writeBatch(db);
  lote.set(publico(uid), {
    ...pessoais,
    fotoBase64: null,
    ehMotorista: false,
    motorista: null,
    notaMotorista: { soma: 0, total: 0 },
    notaPassageiro: { soma: 0, total: 0 },
    viagens: 0,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
  lote.set(privado(uid), {
    email: dados.email,
    matricula: soDigitos(dados.matricula),
    telefone: mascararTelefone(dados.telefone),
    chavePix: null,
    atualizadoEm: serverTimestamp(),
  });
  await lote.commit();
}

export const usuarios = {
  observarPerfil(uid, callback, aoErrar) {
    let dadosPublicos;
    let dadosPrivados;
    const emitir = () => {
      if (dadosPublicos === undefined || dadosPrivados === undefined) return;
      if (!dadosPublicos) return callback(null);
      const { chavePix, ...resto } = dadosPrivados || {};
      return callback({
        uid,
        ...dadosPublicos,
        ...resto,
        motorista: dadosPublicos.motorista ? { ...dadosPublicos.motorista, chavePix } : null,
      });
    };
    const falhou = (falha) => aoErrar?.(erroAmigavel(falha, "Não foi possível carregar o perfil."));
    const cancelarPublico = onSnapshot(
      publico(uid),
      (snap) => {
        dadosPublicos = snap.exists() ? snap.data() : null;
        emitir();
      },
      falhou,
    );
    const cancelarPrivado = onSnapshot(
      privado(uid),
      (snap) => {
        dadosPrivados = snap.exists() ? snap.data() : null;
        emitir();
      },
      falhou,
    );
    return () => {
      cancelarPublico();
      cancelarPrivado();
    };
  },

  async buscarPublico(uid) {
    try {
      const snap = await getDoc(publico(uid));
      return snap.exists() ? { uid, ...snap.data() } : null;
    } catch (falha) {
      throw erroAmigavel(falha);
    }
  },

  async salvarPerfil(uid, campos) {
    try {
      const atualPublico = {};
      const atualPrivado = {};
      if ("nome" in campos || "curso" in campos || "periodo" in campos) {
        const snap = await getDoc(publico(uid));
        Object.assign(atualPublico, camposPessoais({ ...snap.data(), ...campos }));
      }
      if ("fotoBase64" in campos) {
        if (campos.fotoBase64 && campos.fotoBase64.length > 300000)
          throw erroNegocio("A foto ficou grande demais. Escolha outra.");
        atualPublico.fotoBase64 = campos.fotoBase64 || null;
      }
      if ("telefone" in campos) {
        exigir(validarTelefone(campos.telefone));
        atualPrivado.telefone = mascararTelefone(campos.telefone);
      }
      if (Object.keys(atualPublico).length)
        await updateDoc(publico(uid), { ...atualPublico, atualizadoEm: serverTimestamp() });
      if (Object.keys(atualPrivado).length)
        await setDoc(privado(uid), { ...atualPrivado, atualizadoEm: serverTimestamp() }, { merge: true });
    } catch (falha) {
      throw erroAmigavel(falha, "Não foi possível salvar o perfil.");
    }
  },

  async salvarMotorista(uid, { veiculo, lugares, cnhValidade, chavePix }) {
    const placa = String(veiculo?.placa || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const numeroLugares = Number(lugares);
    exigir(
      validarTextoObrigatorio(veiculo?.marca, "Marca", 30),
      validarTextoObrigatorio(veiculo?.modelo, "Modelo", 30),
      validarTextoObrigatorio(veiculo?.cor, "Cor", 20),
      validarPlaca(placa),
      !Number.isInteger(numeroLugares) || numeroLugares < 1 || numeroLugares > 6
        ? "Escolha de 1 a 6 lugares."
        : null,
      validarCnhValidade(cnhValidade ? new Date(`${cnhValidade}T12:00:00`) : null),
      validarTextoObrigatorio(chavePix, "Chave PIX", 80),
    );
    try {
      const lote = writeBatch(db);
      lote.update(publico(uid), {
        ehMotorista: true,
        motorista: {
          veiculo: { marca: veiculo.marca.trim(), modelo: veiculo.modelo.trim(), cor: veiculo.cor.trim(), placa },
          lugares: numeroLugares,
          cnhValidade,
        },
        atualizadoEm: serverTimestamp(),
      });
      lote.set(privado(uid), { chavePix: chavePix.trim(), atualizadoEm: serverTimestamp() }, { merge: true });
      await lote.commit();
    } catch (falha) {
      throw erroAmigavel(falha, "Não foi possível salvar os dados do motorista.");
    }
  },
};
