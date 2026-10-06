import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCaronas } from "../context/CaronasContext";
import MotionPressable from "../components/MotionPressable";
import Wordmark from "../components/Wordmark";
import theme from "../theme";

const sections = [
  {
    title: "Comunidade",
    items: [
      {
        label: "Avaliações e segurança",
        description: "Reputação e confiança entre alunos",
        icon: "shield-checkmark-outline",
        route: "AvaliacoesSeguranca",
      },
      {
        label: "Ajuda e orientações",
        description: "Como aproveitar sua carona",
        icon: "help-circle-outline",
        route: "Ajuda",
      },
    ],
  },
  {
    title: "Aplicativo",
    items: [
      {
        label: "Configurações",
        description: "Ajustes da sua experiência",
        icon: "options-outline",
        route: "Configuracoes",
      },
      {
        label: "Sobre o UniRide",
        description: "O projeto e a comunidade",
        icon: "information-circle-outline",
        route: "Sobre",
      },
    ],
  },
];

export default function CustomDrawerContent({ navigation, state }) {
  const insets = useSafeAreaInsets();
  const { usuarioLogado } = useCaronas();
  const currentRoute = state.routes[state.index].name;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandRow}>
        <Wordmark width={150} />
        <MotionPressable
          style={styles.close}
          accessibilityLabel="Fechar menu"
          onPress={() => navigation.closeDrawer()}
        >
          <Ionicons
            name="close-outline"
            size={25}
            color={theme.colors.textSecondary}
          />
        </MotionPressable>
      </View>
      <View style={styles.identity}>
        <Text style={styles.name}>{usuarioLogado.nome}</Text>
        <Text style={styles.course}>{usuarioLogado.curso}</Text>
        <View style={styles.verified}>
          <Ionicons name="checkmark" size={14} color={theme.colors.success} />
          <Text style={styles.verifiedText}>Aluno verificado</Text>
        </View>
      </View>
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => {
            const selected = currentRoute === item.route;
            return (
              <MotionPressable
                key={item.route}
                style={styles.item}
                accessibilityLabel={item.label}
                accessibilityState={{ selected }}
                onPress={() => {
                  navigation.navigate(item.route);
                  navigation.closeDrawer();
                }}
              >
                {selected && <View style={styles.activeLine} />}
                <Ionicons
                  name={item.icon}
                  size={21}
                  color={
                    selected ? theme.colors.accent : theme.colors.textSecondary
                  }
                />
                <View style={styles.copy}>
                  <Text style={[styles.label, selected && styles.selected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={15}
                  color={theme.colors.textMuted}
                />
              </MotionPressable>
            );
          })}
        </View>
      ))}
      <View style={styles.footer}>
        <Text style={styles.footerText}>UniAcademia · Juiz de Fora</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { flexGrow: 1, paddingHorizontal: 28 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  close: {
    width: 48,
    height: 48,
    marginRight: -12,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: {
    paddingTop: 32,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  name: {
    fontFamily: theme.fonts.semibold,
    fontSize: 19,
    lineHeight: 27,
    letterSpacing: -0.4,
    color: theme.colors.text,
  },
  course: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 19,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  verifiedText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.success,
  },
  section: { paddingTop: 28 },
  sectionTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  item: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  copy: { flex: 1 },
  label: {
    fontFamily: theme.fonts.semibold,
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.text,
  },
  selected: { color: theme.colors.accent },
  description: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    lineHeight: 17,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  activeLine: {
    position: "absolute",
    width: 2,
    height: 28,
    left: -14,
    backgroundColor: theme.colors.accent,
  },
  footer: { marginTop: "auto", paddingTop: 40 },
  footerText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  version: {
    fontFamily: theme.fonts.regular,
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 8,
  },
});
