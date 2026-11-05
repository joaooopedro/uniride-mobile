import { TurboModuleRegistry } from "react-native";

// O módulo nativo do Google só existe no app instalado (Xcode ou APK), não no Expo Go.
const IDS = {
  webClientId: "769246594269-vnj0kvpibgdm5bif29iivob6jmkpbhrb.apps.googleusercontent.com",
  iosClientId: "769246594269-gh55gq5obbf39v85mtgugqj2o6gnmdqa.apps.googleusercontent.com",
};

export const googleDisponivel = !!TurboModuleRegistry.get("RNGoogleSignin");

let modulo = null;
function carregar() {
  if (!googleDisponivel) return null;
  if (!modulo) {
    modulo = require("@react-native-google-signin/google-signin");
    modulo.GoogleSignin.configure({ webClientId: IDS.webClientId, iosClientId: IDS.iosClientId });
  }
  return modulo;
}

// Devolve o idToken do Google ou null se a pessoa cancelou.
export async function obterIdTokenGoogle() {
  const google = carregar();
  if (!google) throw new Error("Entrar com Google só funciona no app instalado.");
  await google.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const resposta = await google.GoogleSignin.signIn();
  if (resposta.type !== "success") return null;
  if (!resposta.data.idToken) throw new Error("O Google não devolveu a identificação. Tente de novo.");
  return resposta.data.idToken;
}

export async function sairDoGoogle() {
  const google = carregar();
  if (!google) return;
  try {
    await google.GoogleSignin.signOut();
  } catch {
    // Sessão do Google já encerrada.
  }
}
