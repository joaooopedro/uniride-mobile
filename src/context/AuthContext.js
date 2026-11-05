import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { repo } from "../services";
import { lerModo, salvarModo } from "../services/localStore";
import { mediaAvaliacao } from "../utils/rateio";

const AuthContext = createContext(null);

function montarPerfil(bruto) {
  if (!bruto) return null;
  return {
    ...bruto,
    notaMotorista: mediaAvaliacao(bruto.notaMotorista),
    notaPassageiro: mediaAvaliacao(bruto.notaPassageiro),
    notasBrutas: { motorista: bruto.notaMotorista, passageiro: bruto.notaPassageiro },
  };
}

export function AuthProvider({ children }) {
  // undefined = ainda carregando; null = não existe.
  const [usuario, setUsuario] = useState(undefined);
  const [perfilBruto, setPerfilBruto] = useState(undefined);
  const [modo, setModo] = useState(undefined);

  useEffect(() => repo.auth.observarSessao(setUsuario), []);

  useEffect(() => {
    lerModo().then((salvo) => setModo(salvo || null));
  }, []);

  useEffect(() => {
    if (!usuario) {
      setPerfilBruto(usuario === null ? null : undefined);
      return undefined;
    }
    setPerfilBruto(undefined);
    return repo.usuarios.observarPerfil(usuario.uid, setPerfilBruto, () => setPerfilBruto(null));
  }, [usuario?.uid]);

  const definirModo = useCallback(async (novo) => {
    setModo(novo);
    await salvarModo(novo);
  }, []);

  const sair = useCallback(async () => {
    await repo.auth.sair();
    await definirModo(null);
  }, [definirModo]);

  const atualizarVerificacao = useCallback(async () => {
    const verificado = await repo.auth.atualizarVerificacao();
    if (verificado) setUsuario((atual) => (atual ? { ...atual, emailVerificado: true } : atual));
    return verificado;
  }, []);

  const valor = useMemo(() => {
    const perfil = montarPerfil(perfilBruto);
    return {
      usuario: usuario || null,
      perfil,
      modo: modo || null,
      carregando: usuario === undefined || modo === undefined || (!!usuario && perfilBruto === undefined),
      emailVerificado: !!usuario?.emailVerificado,
      googleDisponivel: !!repo.auth.googleDisponivel,
      entrar: repo.auth.entrar,
      entrarComGoogle: repo.auth.entrarComGoogle,
      cadastrar: repo.auth.cadastrar,
      completarPerfil: repo.auth.completarPerfil,
      redefinirSenha: repo.auth.redefinirSenha,
      reenviarVerificacao: repo.auth.reenviarVerificacao,
      atualizarVerificacao,
      sair,
      definirModo,
      salvarPerfil: (campos) => repo.usuarios.salvarPerfil(usuario.uid, campos),
      salvarMotorista: (dados) => repo.usuarios.salvarMotorista(usuario.uid, dados),
    };
  }, [usuario, perfilBruto, modo, sair, definirModo, atualizarVerificacao]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa do AuthProvider.");
  return contexto;
}
