import { MODO_DEMO } from "../config/modo";
import * as demo from "./demo";

// Ponto único de acesso aos dados. Contextos usam `repo`; telas nunca importam daqui.
export const repo = MODO_DEMO
  ? demo
  : {
      auth: demo.auth,
      usuarios: demo.usuarios,
      caronas: demo.caronas,
      reservas: demo.reservas,
      mensagens: demo.mensagens,
      avaliacoes: demo.avaliacoes,
    };
