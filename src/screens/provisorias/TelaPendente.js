import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import theme from "../../theme";

// Lugar reservado de cada tela nova. Quem pega a issue troca este componente pela tela real.
export function criarTelaPendente({ titulo, issue, responsavel, descricao }) {
  function TelaPendente() {
    return (
      <View style={styles.container}>
        <Feather name="tool" size={26} color={theme.colors.textMuted} />
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descricao}>{descricao}</Text>
        <Text style={styles.issue}>Issue #{issue} · {responsavel}</Text>
      </View>
    );
  }
  TelaPendente.displayName = `Pendente(${titulo})`;
  return TelaPendente;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.lg, gap: theme.spacing.sm, backgroundColor: theme.colors.background },
  titulo: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.text, textAlign: "center" },
  descricao: { fontFamily: theme.fonts.regular, fontSize: 14, lineHeight: 21, color: theme.colors.textSecondary, textAlign: "center", maxWidth: 320 },
  issue: { fontFamily: theme.fonts.semibold, fontSize: 12, color: theme.colors.secondary, marginTop: theme.spacing.sm },
});
