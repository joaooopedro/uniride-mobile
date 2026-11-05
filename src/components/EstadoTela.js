import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import theme from "../theme";
import MotionPressable from "./MotionPressable";

// Versão provisória. O componente definitivo, com esqueleto de carregamento, é da issue #32.
const ICONES = { vazio: "inbox", erro: "wifi-off" };

export default function EstadoTela({ tipo = "vazio", titulo, mensagem, acao }) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {tipo === "carregando" ? (
        <ActivityIndicator color={theme.colors.secondary} />
      ) : (
        <Feather
          name={ICONES[tipo] || "info"}
          size={28}
          color={tipo === "erro" ? theme.colors.danger : theme.colors.textMuted}
        />
      )}
      {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}
      {!!mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
      {!!acao && (
        <MotionPressable style={styles.botao} onPress={acao.onPress} accessibilityLabel={acao.rotulo}>
          <Text style={styles.botaoTexto}>{acao.rotulo}</Text>
        </MotionPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: theme.spacing.lg, gap: theme.spacing.sm },
  titulo: { fontFamily: theme.fonts.semibold, fontSize: 16, color: theme.colors.text, textAlign: "center", marginTop: theme.spacing.sm },
  mensagem: { fontFamily: theme.fonts.regular, fontSize: 14, lineHeight: 21, color: theme.colors.textSecondary, textAlign: "center", maxWidth: 300 },
  botao: { marginTop: theme.spacing.mdSm, minHeight: 48, paddingHorizontal: theme.spacing.md, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center" },
  botaoTexto: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
});
