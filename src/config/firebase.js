import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// A chave Web do Firebase identifica o projeto, não é segredo.
// Quem protege os dados são as regras em firestore.rules.
export const firebaseConfig = {
  apiKey: "AIzaSyDze0q8oRr3XE0s2RdEF2tN456HMliXsW0",
  authDomain: "uniride-uniacademia.firebaseapp.com",
  projectId: "uniride-uniacademia",
  storageBucket: "uniride-uniacademia.firebasestorage.app",
  messagingSenderId: "769246594269",
  appId: "1:769246594269:web:626dccbeffc10f63528734",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function criarAuth() {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Recarga rápida do Metro: a instância já existe.
    return getAuth(app);
  }
}

function criarFirestore() {
  try {
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return getFirestore(app);
  }
}

export const auth = criarAuth();
export const db = criarFirestore();
