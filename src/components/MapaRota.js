import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import theme from "../theme";

// Assinatura final do mapa. O mapa OpenStreetMap de verdade entra na issue #25;
// até lá este componente só ocupa o espaço e lista os pontos.
export default function MapaRota({ pontos = [], linha, altura = 220 }) {
  return (
    <View style={[styles.caixa, { height: altura }]} accessibilityLabel="Mapa">
      <Feather name="map" size={22} color={theme.colors.textMuted} />
      {pontos.slice(0, 3).map((ponto, indice) => (
        <Text key={`${ponto.lat}-${ponto.lng}-${indice}`} style={styles.ponto} numberOfLines={1}>
          {ponto.titulo || `${ponto.lat.toFixed(4)}, ${ponto.lng.toFixed(4)}`}
        </Text>
      ))}
      {!!linha?.length && <Text style={styles.ponto}>Rota com {linha.length} pontos</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { borderRadius: theme.radii.md, backgroundColor: theme.colors.primaryLight, alignItems: "center", justifyContent: "center", gap: 4, padding: theme.spacing.md },
  ponto: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
});
