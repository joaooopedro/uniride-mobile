import React from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useInterface } from "../context/InterfaceContext";
import MotionPressable from "../components/MotionPressable";
import theme from "../theme";
export default function TelaConfiguracoes({ navigation }) {
  const { animacoesAtivas, setAnimacoesAtivas, movimentoReduzido } =
    useInterface();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Do seu jeito</Text>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.section}>Experiência</Text>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.name}>Animações suaves</Text>
          <Text style={styles.description}>
            {movimentoReduzido
              ? "O sistema está com movimento reduzido."
              : "Movimentos discretos ao tocar e navegar."}
          </Text>
        </View>
        <Switch
          accessibilityLabel="Animações suaves"
          disabled={movimentoReduzido}
          value={animacoesAtivas && !movimentoReduzido}
          onValueChange={setAnimacoesAtivas}
          trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
          thumbColor="#FFFFFF"
        />
      </View>
      <Text style={styles.note}>
        Essa preferência vale enquanto o app estiver aberto.
      </Text>
      <Text style={styles.section}>Conta e comunidade</Text>
      <MotionPressable
        style={styles.row}
        onPress={() => navigation.navigate("MainTabs", { screen: "Perfil" })}
        accessibilityLabel="Abrir meu perfil"
      >
        <Ionicons name="person-outline" size={22} color={theme.colors.accent} />
        <Text style={[styles.name, styles.link]}>Meu perfil</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textMuted}
        />
      </MotionPressable>
      <MotionPressable
        style={styles.row}
        onPress={() => navigation.navigate("AvaliacoesSeguranca")}
        accessibilityLabel="Abrir avaliações e segurança"
      >
        <Ionicons
          name="shield-checkmark-outline"
          size={22}
          color={theme.colors.accent}
        />
        <Text style={[styles.name, styles.link]}>Avaliações e segurança</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textMuted}
        />
      </MotionPressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24, paddingBottom: 48 },
  eyebrow: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 30,
    color: theme.colors.text,
    letterSpacing: -0.8,
    marginTop: 6,
  },
  section: {
    fontFamily: theme.fonts.semibold,
    fontSize: 18,
    color: theme.colors.text,
    marginTop: 40,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 16,
  },
  copy: { flex: 1 },
  name: {
    fontFamily: theme.fonts.semibold,
    fontSize: 14,
    color: theme.colors.text,
  },
  description: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 19,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  note: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    lineHeight: 18,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  link: { flex: 1 },
});
