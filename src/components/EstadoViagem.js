import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

const states = {
  Confirmada: { color: "success", icon: "check" },
  "Aguardando Saída": { color: "warning", icon: "clock" },
  "Em Andamento": { color: "secondary", icon: "navigation" },
  Concluída: { color: "textSecondary", icon: "check-circle" },
};

export default function EstadoViagem({ status }) {
  const theme = useTheme();
  const visual = states[status] || { color: "textSecondary", icon: "circle" };
  const color = theme.colors[visual.color];
  return (
    <View accessible accessibilityLabel={status} style={styles.row}>
      <Feather name={visual.icon} size={14} color={color} />
      <Text style={[styles.label, { color, fontFamily: theme.fonts.semibold }]}>
        {status}
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
