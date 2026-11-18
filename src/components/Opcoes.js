import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import theme from "../theme";
import MotionPressable from "./MotionPressable";

// Controle segmentado: poucas opções lado a lado, uma selecionada.
export function Segmento({ rotulo, opcoes, valor, onMudar }) {
  return (
    <View style={estilos.grupo}>
      {rotulo ? <Text style={estilos.rotulo}>{rotulo}</Text> : null}
      <View style={estilos.segmento} accessibilityRole="radiogroup" accessibilityLabel={rotulo}>
        {opcoes.map((opcao) => {
          const ativo = valor === opcao.id;
          return (
            <MotionPressable
              key={String(opcao.id)}
              onPress={() => onMudar(opcao.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: ativo }}
              style={[estilos.opcao, ativo && estilos.opcaoAtiva]}
            >
              <Text style={[estilos.texto, ativo && estilos.textoAtivo]} numberOfLines={1}>
                {opcao.rotulo}
              </Text>
            </MotionPressable>
          );
        })}
      </View>
    </View>
  );
}

// Fileira rolável de dias ("Hoje", "Amanhã", "sex 20/11").
export function ChipsDia({ rotulo, dias, valor, onMudar }) {
  return (
    <View style={estilos.grupo}>
      {rotulo ? <Text style={estilos.rotulo}>{rotulo}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.chips} keyboardShouldPersistTaps="handled">
        {dias.map((dia) => {
          const ativo = valor === dia.iso;
          return (
            <MotionPressable
              key={dia.iso}
              onPress={() => onMudar(dia.iso)}
              accessibilityState={{ selected: ativo }}
              style={[estilos.chip, ativo && estilos.chipAtivo]}
            >
              <Text style={[estilos.chipTexto, ativo && estilos.chipTextoAtivo]}>{dia.rotulo}</Text>
            </MotionPressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { gap: 8 },
  rotulo: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  segmento: { flexDirection: "row", padding: 4, gap: 4, borderRadius: theme.radii.md, backgroundColor: theme.colors.primaryLight },
  opcao: { flex: 1, minHeight: 40, borderRadius: theme.radii.sm, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  opcaoAtiva: { backgroundColor: theme.colors.surface, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  texto: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.textSecondary },
  textoAtivo: { fontFamily: theme.fonts.semibold, color: theme.colors.primary },
  chips: { gap: 8 },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: theme.radii.sm, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, justifyContent: "center" },
  chipAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipTexto: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  chipTextoAtivo: { color: theme.colors.surface },
});
