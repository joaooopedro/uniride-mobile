import { MODO_DEMO } from "../config/modo";
import * as demo from "./demo";
import { auth } from "./firebase/auth";
import { usuarios } from "./firebase/usuarios";

// Ponto único de acesso aos dados. Contextos usam `repo`; telas nunca importam daqui.
export const repo = MODO_DEMO
  ? demo
  : {
      auth,
      usuarios,
      caronas: demo.caronas,
      reservas: demo.reservas,
      mensagens: demo.mensagens,
      avaliacoes: demo.avaliacoes,
    };
