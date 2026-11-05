import React from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import theme from "../../theme";
import MotionPressable from "../../components/MotionPressable";

// Peças mínimas das telas provisórias. Serão substituídas pelas telas das issues #29 a #32.
export function Pagina({ titulo, aviso, children }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={styles.flex}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.pagina, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
      >
        {!!aviso && <Text style={styles.aviso}>{aviso}</Text>}
        <Text style={styles.titulo}>{titulo}</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function Campo({ rotulo, erro, ...props }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput style={styles.input} placeholderTextColor={theme.colors.textMuted} accessibilityLabel={rotulo} {...props} />
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

export function Botao({ titulo, onPress, carregando, secundario, disabled }) {
  return (
    <MotionPressable
      style={[styles.botao, secundario && styles.botaoSecundario, (disabled || carregando) && styles.desabilitado]}
      onPress={onPress}
      disabled={disabled || carregando}
      accessibilityLabel={titulo}
    >
      {carregando ? (
        <ActivityIndicator color={secundario ? theme.colors.primary : theme.colors.surface} />
      ) : (
        <Text style={[styles.botaoTexto, secundario && styles.botaoTextoSecundario]}>{titulo}</Text>
      )}
    </MotionPressable>
  );
}

export function Mensagem({ texto, tipo = "erro" }) {
  if (!texto) return null;
  return <Text style={tipo === "erro" ? styles.erroGeral : styles.sucesso}>{texto}</Text>;
}

export const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  pagina: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.mdSm },
  aviso: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.warning, backgroundColor: theme.colors.warningLight, padding: theme.spacing.sm, borderRadius: theme.radii.sm },
  titulo: { fontFamily: theme.fonts.bold, fontSize: 26, lineHeight: 34, color: theme.colors.text, marginBottom: theme.spacing.sm },
  texto: { fontFamily: theme.fonts.regular, fontSize: 14, lineHeight: 22, color: theme.colors.textSecondary },
  campo: { gap: 6 },
  rotulo: { fontFamily: theme.fonts.semibold, fontSize: 13, color: theme.colors.text },
  input: { minHeight: 48, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, paddingHorizontal: theme.spacing.mdSm, fontFamily: theme.fonts.regular, fontSize: 15, color: theme.colors.text, backgroundColor: theme.colors.surface },
  erro: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.danger },
  erroGeral: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.danger, backgroundColor: theme.colors.dangerLight, padding: theme.spacing.sm, borderRadius: theme.radii.sm },
  sucesso: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.success, backgroundColor: theme.colors.successLight, padding: theme.spacing.sm, borderRadius: theme.radii.sm },
  botao: { minHeight: 52, borderRadius: theme.radii.md, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: theme.spacing.md },
  botaoSecundario: { backgroundColor: "transparent", borderWidth: 1, borderColor: theme.colors.border },
  desabilitado: { opacity: 0.55 },
  botaoTexto: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.surface },
  botaoTextoSecundario: { color: theme.colors.primary },
});
