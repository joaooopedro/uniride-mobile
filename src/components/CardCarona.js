import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MotionPressable from "./MotionPressable";
import theme from "../theme";

export default function CardCarona({ carona, onVerDetalhes }) {
  const disponivel = carona.vagasRestantes > 0;
  return (
    <View style={styles.card}>
      <View style={styles.summary}>
        <View>
          <Text style={styles.time}>{carona.horarioSaida}</Text>
          <Text style={styles.caption}>{carona.turno}</Text>
        </View>
        <View style={styles.priceColumn}>
          <Text style={styles.price}>{carona.valorRateio}</Text>
          <Text style={styles.caption}>por pessoa</Text>
        </View>
      </View>
      <View style={styles.route}>
        <View style={styles.timeline}>
          <View style={styles.startDot} />
          <View style={styles.line} />
          <View style={styles.endDot} />
        </View>
        <View style={styles.routeCopy}>
          <Text style={styles.origin}>{carona.bairroOrigem}</Text>
          <Text style={styles.destination}>{carona.campusDestino}</Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Ionicons
          name="car-outline"
          size={15}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.metaText}>
          {carona.modeloCarro} · {carona.placaCarro}
        </Text>
      </View>
      <View style={styles.meta}>
        <Ionicons
          name="people-outline"
          size={15}
          color={disponivel ? theme.colors.success : theme.colors.danger}
        />
        <Text
          style={[
            styles.metaText,
            { color: disponivel ? theme.colors.success : theme.colors.danger },
          ]}
        >
          {disponivel
            ? carona.vagasRestantes +
              (carona.vagasRestantes === 1
                ? " vaga disponível"
                : " vagas disponíveis")
            : "Sem vagas disponíveis"}
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{carona.iniciaisMotorista}</Text>
        </View>
        <View style={styles.driver}>
          <Text numberOfLines={1} style={styles.driverName}>
            {carona.motorista}
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={11} color={theme.colors.warning} />
            <Text style={styles.ratingText}>{carona.notaMotorista}</Text>
            {carona.alunoVerificado && (
              <Ionicons
                accessibilityLabel="Aluno verificado"
                name="checkmark-circle"
                size={13}
                color={theme.colors.success}
              />
            )}
          </View>
        </View>
        <MotionPressable
          onPress={() => onVerDetalhes(carona)}
          style={styles.details}
          accessibilityLabel={
            "Ver detalhes da carona de " +
            carona.motorista +
            ", saída " +
            carona.horarioSaida
          }
        >
          <Text style={styles.detailsText}>Detalhes</Text>
          <Ionicons
            name="arrow-forward"
            size={17}
            color={theme.colors.primary}
          />
        </MotionPressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    letterSpacing: -0.7,
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
  priceColumn: { alignItems: "flex-end" },
  price: {
    fontFamily: theme.fonts.bold,
    fontSize: 21,
    letterSpacing: -0.5,
    color: theme.colors.text,
    fontVariant: ["tabular-nums"],
  },
  caption: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  route: { flexDirection: "row", alignItems: "stretch", marginTop: 23 },
  timeline: {
    width: 15,
    alignItems: "center",
    marginRight: 13,
    paddingTop: 7,
    paddingBottom: 7,
  },
  startDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.accent,
  },
  line: {
    width: 1,
    flex: 1,
    minHeight: 19,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  endDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
  },
  routeCopy: { flex: 1, gap: 16 },
  origin: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.text,
  },
  destination: {
    fontFamily: theme.fonts.semibold,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 10 },
  metaText: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    lineHeight: 17,
    color: theme.colors.textSecondary,
    flexShrink: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 19,
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  initials: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.primary,
    textAlign: "center",
    includeFontPadding: false,
  },
  driver: { flex: 1, minWidth: 0 },
  driverName: {
    fontFamily: theme.fonts.semibold,
    fontSize: 12,
    color: theme.colors.text,
  },
  rating: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  ratingText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  details: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
  },
  detailsText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.primary,
  },
});
