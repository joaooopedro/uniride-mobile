import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FadeInDown } from "react-native-reanimated";

import { useInterface } from "../../context/InterfaceContext";
import theme from "../../theme";
import { iniciais } from "../../utils";
import { Acao, s } from "../acesso/ComponentesAcesso";

// Entrada em cascata dos itens de lista; some quando o sistema pede movimento reduzido.
export function useEntrada() {
  const { podeAnimar } = useInterface();
  return (indice) => (podeAnimar ? FadeInDown.delay(indice * 60) : undefined);
}

export function Secao({ numero, icone, titulo, ok, children }) {
  const cor = ok ? theme.colors.secondary : theme.colors.primary;
  return (
    <View style={estilos.secao}>
      <View style={estilos.divisoria} />
      <View style={estilos.secaoTopo}>
        <View style={[estilos.marcador, ok && { backgroundColor: theme.colors.secondaryLight }]}>
          {numero && !ok ? (
            <Text style={[estilos.numero, { color: cor }]}>{numero}</Text>
          ) : (
            <Feather name={ok ? "check" : icone} size={17} color={cor} />
          )}
        </View>
        <Text style={estilos.secaoTitulo}>{titulo}</Text>
      </View>
      {children}
    </View>
  );
}

export function Avatar({ nome, fotoBase64, tamanho = 44, sobreposto }) {
  const forma = { width: tamanho, height: tamanho, borderRadius: theme.radii.full };
  return (
    <View style={[estilos.avatar, forma, sobreposto && estilos.sobreposto]} accessibilityLabel={nome}>
      {fotoBase64 ? (
        <Image source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }} style={forma} />
      ) : (
        <Text style={[estilos.iniciais, { fontSize: Math.round(tamanho * 0.36) }]}>{iniciais(nome)}</Text>
      )}
    </View>
  );
}

// Estado vazio com ícone em círculo exigido pela #30; trocar por EstadoTela quando o definitivo da #32 aceitar ícone.
export function Vazio({ icone, titulo, frase, acao, onAcao, iconeAcao }) {
  return (
    <View style={estilos.vazio}>
      <View style={estilos.vazioIcone}>
        <Feather name={icone} size={34} color={theme.colors.primary} />
      </View>
      <Text style={estilos.vazioTitulo}>{titulo}</Text>
      <Text style={[s.secundario, { textAlign: "center" }]}>{frase}</Text>
      <Acao icone={iconeAcao} onPress={onAcao} style={estilos.vazioAcao}>
        {acao}
      </Acao>
    </View>
  );
}

export const estilos = StyleSheet.create({
  secao: { gap: theme.spacing.mdSm },
  divisoria: { height: 1, backgroundColor: theme.colors.border, marginBottom: theme.spacing.xs },
  secaoTopo: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm },
  marcador: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  numero: { fontFamily: theme.fonts.bold, fontSize: 15 },
  secaoTitulo: { fontFamily: theme.fonts.semibold, fontSize: 19, lineHeight: 27, color: theme.colors.primary },
  avatar: { backgroundColor: theme.colors.primaryLight, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  sobreposto: { marginLeft: -theme.spacing.mdSm, borderWidth: 2, borderColor: theme.colors.surface },
  iniciais: { fontFamily: theme.fonts.bold, color: theme.colors.primary },
  vazio: { alignItems: "center", gap: theme.spacing.mdSm, paddingVertical: theme.spacing.xl, paddingHorizontal: theme.spacing.md },
  vazioIcone: {
    width: 84,
    height: 84,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },
  vazioTitulo: { fontFamily: theme.fonts.bold, fontSize: 19, lineHeight: 27, color: theme.colors.primary, textAlign: "center" },
  vazioAcao: { marginTop: theme.spacing.sm, alignSelf: "stretch" },
});
