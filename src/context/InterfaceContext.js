import React, { createContext, useContext, useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
const InterfaceContext = createContext(null);
export function InterfaceProvider({ children }) {
  const [animacoesAtivas, setAnimacoesAtivas] = useState(true);
  const [movimentoReduzido, setMovimentoReduzido] = useState(true);
  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((valor) => {
        if (ativo) setMovimentoReduzido(valor);
      })
      .catch(() => {
        if (ativo) setMovimentoReduzido(true);
      });
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setMovimentoReduzido,
    );
    return () => {
      ativo = false;
      listener.remove();
    };
  }, []);
  return (
    <InterfaceContext.Provider
      value={{
        animacoesAtivas,
        setAnimacoesAtivas,
        movimentoReduzido,
        podeAnimar: animacoesAtivas && !movimentoReduzido,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
}
export function useInterface() {
  const contexto = useContext(InterfaceContext);
  if (!contexto) throw new Error("useInterface precisa do InterfaceProvider.");
  return contexto;
}
