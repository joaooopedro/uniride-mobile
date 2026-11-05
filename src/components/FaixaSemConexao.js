import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import theme from "../theme";

// Versão provisória. Acabamento visual na issue #32.
export default function FaixaSemConexao({ visivel }) {
  const insets = useSafeAreaInsets();
  if (!visivel) return null;
  return (
    <View style={[styles.faixa, { paddingTop: insets.top + 4 }]} accessibilityRole="alert">
      <Feather name="wifi-off" size={14} color={theme.colors.warning} />
      <Text style={styles.texto}>Sem conexão. Mostrando os últimos dados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 6, paddingHorizontal: 16, backgroundColor: theme.colors.warningLight },
  texto: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.warning },
});
