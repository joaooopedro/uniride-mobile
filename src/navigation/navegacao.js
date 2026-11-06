import { createNavigationContainerRef } from "@react-navigation/native";

// Referência global usada por quem precisa navegar fora de uma tela (como as notificações).
export const navegacaoRef = createNavigationContainerRef();

export function navegarPara(rota, parametros) {
  if (navegacaoRef.isReady()) navegacaoRef.navigate(rota, parametros);
}
