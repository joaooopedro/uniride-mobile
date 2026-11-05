import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

// true quando há internet. Começa otimista para não piscar a faixa ao abrir o app.
export function useConexao() {
  const [online, setOnline] = useState(true);
  useEffect(
    () =>
      NetInfo.addEventListener((estado) => {
        setOnline(estado.isConnected !== false && estado.isInternetReachable !== false);
      }),
    [],
  );
  return online;
}
