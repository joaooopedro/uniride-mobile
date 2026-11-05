import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth as firebaseAuth } from "../../config/firebase";
import { DOMINIO_PERMITIDO } from "../../config/regras";
import { erroAmigavel, erroNegocio } from "./erros";
import { googleDisponivel, obterIdTokenGoogle, sairDoGoogle } from "./google";
import { criarPerfil } from "./usuarios";

firebaseAuth.languageCode = "pt-BR";

const resumo = (user) =>
  user ? { uid: user.uid, email: user.email, emailVerificado: user.emailVerified } : null;

async function tentar(acao, padrao) {
  try {
    return await acao();
  } catch (falha) {
    throw erroAmigavel(falha, padrao);
  }
}

export const auth = {
  googleDisponivel,

  observarSessao(callback) {
    return onAuthStateChanged(firebaseAuth, (user) => callback(resumo(user)));
  },

  entrar({ email, senha }) {
    return tentar(async () => {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, email.trim(), senha);
      return resumo(user);
    }, "Não foi possível entrar.");
  },

  entrarComGoogle() {
    return tentar(async () => {
      const idToken = await obterIdTokenGoogle();
      if (!idToken) return null;
      const { user } = await signInWithCredential(firebaseAuth, GoogleAuthProvider.credential(idToken));
      return resumo(user);
    }, "Não foi possível entrar com o Google.");
  },

  cadastrar({ nome, email, senha, matricula, curso, periodo, telefone }) {
    return tentar(async () => {
      if (DOMINIO_PERMITIDO && !email.trim().toLowerCase().endsWith(DOMINIO_PERMITIDO))
        throw erroNegocio(`Use seu e-mail institucional (${DOMINIO_PERMITIDO}).`);
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), senha);
      await updateProfile(user, { displayName: nome.trim() });
      await criarPerfil(user.uid, { nome, email: user.email, matricula, curso, periodo, telefone });
      try {
        await sendEmailVerification(user);
      } catch {
        // A pessoa pode pedir o reenvio na tela de verificação.
      }
      return resumo(user);
    }, "Não foi possível criar a conta.");
  },

  completarPerfil(dados) {
    return tentar(async () => {
      const user = firebaseAuth.currentUser;
      if (!user) throw new Error("Sessão expirada.");
      await criarPerfil(user.uid, { ...dados, email: user.email });
    }, "Não foi possível salvar o cadastro.");
  },

  sair() {
    return tentar(async () => {
      await sairDoGoogle();
      await signOut(firebaseAuth);
    }, "Não foi possível sair.");
  },

  redefinirSenha(email) {
    return tentar(async () => {
      try {
        await sendPasswordResetEmail(firebaseAuth, email.trim());
      } catch (falha) {
        // Não revela se o e-mail existe.
        if (falha.code !== "auth/user-not-found") throw falha;
      }
    }, "Não foi possível enviar o e-mail.");
  },

  reenviarVerificacao() {
    return tentar(async () => {
      if (!firebaseAuth.currentUser) throw new Error("Sessão expirada.");
      await sendEmailVerification(firebaseAuth.currentUser);
    }, "Não foi possível reenviar o e-mail.");
  },

  atualizarVerificacao() {
    return tentar(async () => {
      const user = firebaseAuth.currentUser;
      if (!user) return false;
      await reload(user);
      // Token novo para as regras do banco enxergarem o e-mail verificado.
      if (user.emailVerified) await user.getIdToken(true);
      return user.emailVerified;
    }, "Não foi possível conferir a verificação.");
  },
};
