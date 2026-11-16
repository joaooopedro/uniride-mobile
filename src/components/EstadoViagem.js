import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

const states = {
  Solicitada: { color: "warning", icon: "clock" },
  Aceita: { color: "success", icon: "check" },
  Recusada: { color: "danger", icon: "x" },
  Cancelada: { color: "danger", icon: "x" },
  "Em andamento": { color: "secondary", icon: "navigation" },
  Concluída: { color: "textSecondary", icon: "flag" },
  // Rótulos ainda usados pelas telas do motorista.
  "Aguardando Saída": { color: "warning", icon: "clock" },
  "Em Andamento": { color: "secondary", icon: "navigation" },
  Confirmada: { color: "success", icon: "check" },
};

export default function EstadoViagem({ status }) {
  const theme = useTheme();
  const visual = states[status] || { color: "textSecondary", icon: "circle" };
  const color = theme.colors[visual.color];
  // Rótulos antigos vêm com maiúscula no meio ("Aguardando Saída"); na tela fica só a primeira.
  const texto = status ? status.charAt(0) + status.slice(1).toLowerCase() : status;
  return (
    <View accessible accessibilityLabel={texto} style={styles.row}>
      <Feather name={visual.icon} size={14} color={color} />
      <Text style={[styles.label, { color, fontFamily: theme.fonts.semibold }]}>
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  label: {
    fontSize: 12,
    lineHeight: 18,
    includeFontPadding: false,
    flexShrink: 1,
  },
});
