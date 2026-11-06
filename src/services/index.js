import { MODO_DEMO } from "../config/modo";
import * as demo from "./demo";
import { auth } from "./firebase/auth";
import { avaliacoes } from "./firebase/avaliacoes";
import { caronas } from "./firebase/caronas";
import { mensagens } from "./firebase/mensagens";
import { reservas } from "./firebase/reservas";
import { usuarios } from "./firebase/usuarios";

// Ponto único de acesso aos dados. Contextos usam `repo`; telas nunca importam daqui.
export const repo = MODO_DEMO ? demo : { auth, usuarios, caronas, reservas, mensagens, avaliacoes };
