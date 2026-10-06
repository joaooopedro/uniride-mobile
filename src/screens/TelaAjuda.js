import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MotionPressable from "../components/MotionPressable";
import theme from "../theme";

const questions = [
  {
    title: "Como reservar uma vaga?",
    answer:
      "Na aba Explorar, escolha uma carona e abra Detalhes. Confira o trajeto, o horário e o valor antes de tocar em Reservar esta carona. A reserva aparece em Viagens.",
  },
  {
    title: "Onde combino o embarque?",
    answer:
      "Abra Viagens e toque em Chat e ponto de encontro na carona escolhida. Use a conversa para combinar o local com o motorista. Os avisos rápidos ajudam a informar sua chegada ou um atraso.",
  },
  {
    title: "Como publico minha rota?",
    answer:
      "Na aba Oferecer, preencha o bairro, o ponto de embarque, o campus, os horários e os dias. Informe as vagas e a contribuição por pessoa, confira os dados e publique a rota.",
  },
  {
    title: "Como cancelo uma reserva?",
    answer:
      "Na aba Viagens, localize sua carona e toque em Cancelar reserva. Confira a confirmação antes de continuar. A opção não aparece quando a viagem já está em andamento.",
  },
];

export default function TelaAjuda() {
  const [open, setOpen] = useState(null);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Ajuda e orientações</Text>
      <Text style={styles.intro}>
        Encontre as respostas para organizar sua próxima carona.
      </Text>
      <Text style={styles.section}>Dúvidas frequentes</Text>
      {questions.map((question, index) => (
        <View key={question.title} style={styles.question}>
          <MotionPressable
            style={styles.questionButton}
            accessibilityLabel={question.title}
            accessibilityState={{ expanded: open === index }}
            onPress={() => setOpen(open === index ? null : index)}
          >
            <Text style={styles.questionTitle}>{question.title}</Text>
            <Ionicons
              name={open === index ? "remove" : "add"}
              size={21}
              color={theme.colors.accent}
            />
          </MotionPressable>
          {open === index && (
            <Text style={styles.answer}>{question.answer}</Text>
          )}
        </View>
      ))}
      <Text style={styles.section}>Para uma boa convivência</Text>
      <Text style={styles.tipTitle}>Combine antes de sair</Text>
      <Text style={styles.answer}>
        Confirme o ponto de encontro, o horário e o espaço disponível para a
        mochila.
      </Text>
      <Text style={styles.tipTitle}>Avise quando seus planos mudarem</Text>
      <Text style={styles.answer}>
        Uma mensagem no chat ajuda o grupo a se organizar quando houver atraso
        ou desistência.
      </Text>
      <Text style={styles.tipTitle}>Respeite as preferências do grupo</Text>
      <Text style={styles.answer}>
        Converse sobre música, temperatura e outras combinações para que a
        viagem seja confortável para todos.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24, paddingBottom: 48 },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.7,
    color: theme.colors.text,
    marginTop: 8,
  },
  intro: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 23,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  section: {
    fontFamily: theme.fonts.semibold,
    fontSize: 18,
    lineHeight: 26,
    color: theme.colors.text,
    marginTop: 36,
    marginBottom: 12,
  },
  question: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  questionButton: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  questionTitle: {
    flex: 1,
    fontFamily: theme.fonts.semibold,
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.text,
  },
  answer: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    paddingBottom: 18,
  },
  tipTitle: {
    fontFamily: theme.fonts.semibold,
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
});
