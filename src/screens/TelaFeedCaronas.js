import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCaronas } from "../context/CaronasContext";
import CardCarona from "../components/CardCarona";
import MotionPressable from "../components/MotionPressable";
import theme from "../theme";
const campi = [
  { label: "Todos", value: "Todos" },
  { label: "Academia", value: "Campus Academia (Centro)" },
  { label: "Estrela Sul", value: "Campus Estrela Sul" },
];
function normalizar(valor) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
export default function TelaFeedCaronas({ navigation }) {
  const { usuarioLogado, caronasDisponiveis } = useCaronas();
  const [textoBusca, setTextoBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [campusSelecionado, setCampusSelecionado] = useState("Todos");
  const [turnoSelecionado, setTurnoSelecionado] = useState(null);
  const [somenteComVagas, setSomenteComVagas] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setBuscaAplicada(textoBusca.trim()), 300);
    return () => clearTimeout(timer);
  }, [textoBusca]);
  const caronasFiltradas = useMemo(
    () =>
      caronasDisponiveis.filter((carona) => {
        const rota = normalizar(
          carona.bairroOrigem +
            " " +
            carona.campusDestino +
            " " +
            carona.motorista,
        );
        return (
          (!buscaAplicada || rota.includes(normalizar(buscaAplicada))) &&
          (campusSelecionado === "Todos" ||
            carona.campusDestino === campusSelecionado) &&
          (!turnoSelecionado || carona.turno === turnoSelecionado) &&
          (!somenteComVagas || carona.vagasRestantes > 0)
        );
      }),
    [
      buscaAplicada,
      campusSelecionado,
      caronasDisponiveis,
      somenteComVagas,
      turnoSelecionado,
    ],
  );
  const filtros = [
    {
      label: "Manhã",
      icon: "sunny-outline",
      selected: turnoSelecionado === "Manhã",
      press: () =>
        setTurnoSelecionado(turnoSelecionado === "Manhã" ? null : "Manhã"),
    },
    {
      label: "Noite",
      icon: "moon-outline",
      selected: turnoSelecionado === "Noite",
      press: () =>
        setTurnoSelecionado(turnoSelecionado === "Noite" ? null : "Noite"),
    },
    {
      label: "Com vagas",
      icon: "people-outline",
      selected: somenteComVagas,
      press: () => setSomenteComVagas(!somenteComVagas),
    },
  ];
  const limparFiltros = () => {
    setTextoBusca("");
    setBuscaAplicada("");
    setCampusSelecionado("Todos");
    setTurnoSelecionado(null);
    setSomenteComVagas(false);
  };
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      data={caronasFiltradas}
      keyExtractor={(carona) => carona.id}
      renderItem={({ item }) => (
        <CardCarona
          carona={item}
          onVerDetalhes={(carona) =>
            navigation.navigate("DetalhesCarona", { caronaId: carona.id })
          }
        />
      )}
      ListHeaderComponent={
        <View>
          <Text style={styles.greeting}>
            Olá, {usuarioLogado.nome.split(" ")[0]}
          </Text>
          <Text style={styles.title}>Encontre sua{"\n"}próxima carona.</Text>
          <View style={styles.search}>
            <Ionicons
              name="search-outline"
              size={21}
              color={theme.colors.accent}
            />
            <TextInput
              style={styles.input}
              value={textoBusca}
              onChangeText={setTextoBusca}
              placeholder="Bairro, campus ou motorista"
              placeholderTextColor={theme.colors.textMuted}
              accessibilityLabel="Buscar caronas"
              returnKeyType="search"
            />
            {textoBusca.length > 0 && (
              <MotionPressable
                style={styles.clear}
                accessibilityLabel="Limpar busca"
                onPress={() => setTextoBusca("")}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </MotionPressable>
            )}
          </View>
          <View style={styles.campi}>
            {campi.map((campus) => (
              <MotionPressable
                key={campus.value}
                style={[
                  styles.campus,
                  campusSelecionado === campus.value && styles.campusSelected,
                ]}
                onPress={() => setCampusSelecionado(campus.value)}
                accessibilityRole="tab"
                accessibilityLabel={
                  campus.value === "Todos" ? "Todos os campi" : campus.value
                }
                accessibilityState={{
                  selected: campusSelecionado === campus.value,
                }}
              >
                <Text
                  style={[
                    styles.campusText,
                    campusSelecionado === campus.value &&
                      styles.campusTextSelected,
                  ]}
                >
                  {campus.label}
                </Text>
              </MotionPressable>
            ))}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {filtros.map((filtro) => (
              <MotionPressable
                key={filtro.label}
                style={[
                  styles.filter,
                  filtro.selected && styles.filterSelected,
                ]}
                onPress={filtro.press}
                accessibilityLabel={"Filtrar: " + filtro.label}
                accessibilityState={{ selected: filtro.selected }}
              >
                <Ionicons
                  name={filtro.icon}
                  size={15}
                  color={
                    filtro.selected
                      ? theme.colors.accent
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterText,
                    filtro.selected && { color: theme.colors.accent },
                  ]}
                >
                  {filtro.label}
                </Text>
              </MotionPressable>
            ))}
          </ScrollView>
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Rotas disponíveis</Text>
            <Text style={styles.count}>
              {caronasFiltradas.length}{" "}
              {caronasFiltradas.length === 1 ? "carona" : "caronas"}
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons
            name="search-outline"
            size={32}
            color={theme.colors.accent}
          />
          <Text style={styles.emptyTitle}>Nenhuma carona por aqui</Text>
          <Text style={styles.emptyCopy}>
            Tente outro bairro ou ajuste os filtros.
          </Text>
          <MotionPressable style={styles.emptyAction} onPress={limparFiltros}>
            <Text style={styles.actionText}>Limpar filtros</Text>
          </MotionPressable>
        </View>
      }
    />
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  greeting: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 31,
    lineHeight: 38,
    letterSpacing: -1,
    color: theme.colors.text,
    marginTop: 8,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 10,
    paddingLeft: 16,
    marginTop: 24,
    minHeight: 54,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 54,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.text,
    paddingVertical: 12,
    paddingRight: 12,
  },
  clear: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  campi: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginTop: 18,
  },
  campus: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  campusSelected: { borderBottomColor: theme.colors.primary },
  campusText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  campusTextSelected: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  filters: { gap: 8, paddingVertical: 16 },
  filter: {
    minHeight: 48,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 8,
  },
  filterSelected: { backgroundColor: theme.colors.secondaryLight },
  filterText: {
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  results: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 14,
    paddingBottom: 4,
  },
  resultsTitle: {
    fontFamily: theme.fonts.semibold,
    fontSize: 16,
    color: theme.colors.text,
  },
  count: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  empty: { paddingVertical: 48, alignItems: "center", gap: 10 },
  emptyTitle: {
    fontFamily: theme.fonts.semibold,
    fontSize: 18,
    color: theme.colors.text,
  },
  emptyCopy: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  emptyAction: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  actionText: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    color: theme.colors.accent,
  },
});
