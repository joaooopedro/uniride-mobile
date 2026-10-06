import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Wordmark from "../components/Wordmark";
import theme from "../theme";
import { version } from "../../package.json";

export default function TelaSobre() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>Sobre o projeto</Text>
      <View style={styles.signature}>
        <Wordmark width={210} />
      </View>
      <Text style={styles.title}>
        {"O campus aproxima.\nA carona conecta."}
      </Text>
      <Text style={styles.body}>
        O UniRide é um projeto universitário para conectar alunos da UniAcademia
        que compartilham caminhos em Juiz de Fora.
      </Text>
      <Text style={styles.body}>
        Organize rotas, encontre companhia para a viagem e combine o embarque
        com o grupo.
      </Text>
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Comunidade</Text>
          <Text style={styles.value}>UniAcademia</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Cidade</Text>
          <Text style={styles.value}>Juiz de Fora, MG</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Versão</Text>
          <Text style={styles.value}>{version}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24, paddingBottom: 48 },
  eyebrow: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  signature: { marginTop: 32, marginBottom: 32 },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 27,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: theme.colors.text,
    marginBottom: 24,
  },
  body: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 24,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  details: { marginTop: 24 },
  row: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  value: {
    flex: 1,
    textAlign: "right",
    fontFamily: theme.fonts.semibold,
    fontSize: 13,
    color: theme.colors.text,
  },
});
