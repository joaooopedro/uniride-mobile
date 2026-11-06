import React from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MotionPressable from "../../components/MotionPressable";
import theme from "../../theme";

export function PaginaAcesso({ children }) {
  const insets = useSafeAreaInsets();
  return <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.pagina, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 }]}>{children}</ScrollView>
  </KeyboardAvoidingView>;
}
export function Titulo({ children, texto }) { return <View style={{ gap: 6 }}><Text style={s.titulo}>{children}</Text>{texto ? <Text style={s.secundario}>{texto}</Text> : null}</View>; }
export function Acao({ children, onPress, secundario, disabled, carregando, icone, style }) {
  return <MotionPressable onPress={onPress} disabled={disabled || carregando} style={[s.acao, secundario && s.acaoSecundaria, (disabled || carregando) && { opacity: 0.55 }, style]}>
    {carregando ? <ActivityIndicator color={secundario ? theme.colors.primary : theme.colors.surface} /> : <>{icone ? <Feather name={icone} size={18} color={secundario ? theme.colors.primary : theme.colors.surface} /> : null}<Text style={[s.acaoTexto, secundario && s.acaoTextoSecundaria]}>{children}</Text></>}
  </MotionPressable>;
}
export function Link({ children, onPress }) { return <MotionPressable onPress={onPress} style={s.link}><Text style={s.linkTexto}>{children}</Text></MotionPressable>; }
export function Campo({ label, icon, error, trailing, containerStyle, ...props }) {
  return <View style={[{ gap: 5 }, containerStyle]}><Text style={s.label}>{label}</Text><View style={[s.campo, error && { borderColor: theme.colors.danger }]}><Feather name={icon} size={17} color={theme.colors.textSecondary} /><TextInput accessibilityLabel={label} placeholderTextColor={theme.colors.textMuted} style={s.input} {...props} />{trailing}</View>{error ? <Text style={s.error}>{error}</Text> : null}</View>;
}
export function Mensagem({ children, sucesso }) { return children ? <Text style={[s.mensagem, sucesso ? s.ok : s.erro]}>{children}</Text> : null; }
export const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background }, pagina: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.md },
  titulo: { fontFamily: theme.fonts.bold, fontSize: 30, lineHeight: 38, color: theme.colors.primary }, secundario: { color: theme.colors.textSecondary, fontFamily: theme.fonts.regular, fontSize: 14, lineHeight: 21 },
  label: { color: theme.colors.primary, fontFamily: theme.fonts.semibold, fontSize: 13 }, campo: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, backgroundColor: theme.colors.surface }, input: { flex: 1, minHeight: 48, paddingVertical: 8, color: theme.colors.primary, fontFamily: theme.fonts.regular, fontSize: 15 },
  error: { color: theme.colors.danger, fontFamily: theme.fonts.medium, fontSize: 12 }, mensagem: { padding: 12, borderRadius: theme.radii.sm, fontFamily: theme.fonts.medium, fontSize: 13, lineHeight: 20 }, ok: { color: theme.colors.success, backgroundColor: theme.colors.successLight }, erro: { color: theme.colors.danger, backgroundColor: theme.colors.dangerLight },
  acao: { minHeight: 52, paddingHorizontal: 16, borderRadius: theme.radii.md, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10 }, acaoTexto: { color: theme.colors.surface, fontFamily: theme.fonts.semibold, fontSize: 15 }, acaoSecundaria: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }, acaoTextoSecundaria: { color: theme.colors.primary },
  link: { minHeight: 48, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }, linkTexto: { color: theme.colors.secondary, fontFamily: theme.fonts.semibold, fontSize: 14 },
  escolha: { minHeight: 84, flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12 }, icone: { height: 48, width: 48, borderRadius: 24, backgroundColor: theme.colors.primaryLight, alignItems: "center", justifyContent: "center" }, escolhaTitulo: { color: theme.colors.primary, fontFamily: theme.fonts.bold, fontSize: 17, marginBottom: 3 },
  divider: { flexDirection: "row", alignItems: "center", gap: 12 }, linha: { height: 1, flex: 1, backgroundColor: theme.colors.border }, rodape: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }, periodo: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: theme.radii.sm, borderWidth: 1, borderColor: theme.colors.border }, periodoAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }, envelope: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.primaryLight }, email: { color: theme.colors.primary, fontFamily: theme.fonts.bold, fontSize: 17, textAlign: "center" },
});
