import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import EstadoTela from "../../components/EstadoTela";
import EstadoViagem from "../../components/EstadoViagem";
import { useAuth } from "../../context/AuthContext";
import { useCaronas } from "../../context/CaronasContext";
import theme from "../../theme";
import { formatarData, formatarHora, formatarMoeda } from "../../utils";
import { Acao, s, Titulo } from "../acesso/ComponentesAcesso";
import { Avatar, useEntrada } from "../motorista/comum";
import { primeiroNome, saudacao } from "../motorista/logica";
import { acoesDaReserva, separarReservas, statusDaReserva } from "./logica";

const BOTOES = {
  detalhes: { rotulo: "Detalhes", icone: "file-text", secundario: true },
  conversa: { rotulo: "Conversa", icone: "message-circle" },
  avaliar: { rotulo: "Avaliar", icone: "star" },
};

function CartaoReserva({ reserva, carona, onAcao }) {
  const motorista = carona.motorista || {};
  const veiculo = motorista.veiculo ? [motorista.veiculo.modelo, motorista.veiculo.cor].filter(Boolean).join(", ") : null;
  return (
    <View style={estilos.cartao}>
      <View style={estilos.topo}>
        <View>
          <Text style={estilos.hora}>{formatarHora(carona.saidaEm)}</Text>
          <Text style={s.secundario}>{formatarData(carona.saidaEm)}</Text>
        </View>
        <View style={estilos.direita}>
          <Text style={estilos.preco}>{formatarMoeda(carona.valorCentavos)}</Text>
          <EstadoViagem status={statusDaReserva(reserva, carona)} />
        </View>
      </View>

      <View style={estilos.trajeto}>
        <View style={estilos.ponto}>
          <Feather name="map-pin" size={15} color={theme.colors.primary} />
          <Text style={estilos.pontoTexto} numberOfLines={1}>
            {[carona.origem?.bairro, carona.origem?.ponto].filter(Boolean).join(", ")}
          </Text>
        </View>
        <View style={estilos.ponto}>
          <Feather name="navigation" size={15} color={theme.colors.secondary} />
          <Text style={estilos.pontoTexto} numberOfLines={1}>{carona.campusDestino}</Text>
        </View>
      </View>

      <View style={estilos.motorista}>
        <Avatar nome={motorista.nome} fotoBase64={motorista.fotoBase64} tamanho={36} />
        <View style={estilos.flex}>
          <Text style={estilos.nome} numberOfLines={1}>{motorista.nome}</Text>
          {veiculo ? <Text style={s.secundario} numberOfLines={1}>{veiculo}</Text> : null}
        </View>
      </View>

      <View style={estilos.acoes}>
        {acoesDaReserva(reserva, carona).map((acao) => (
          <Acao
            key={acao}
            icone={BOTOES[acao].icone}
            secundario={BOTOES[acao].secundario}
            onPress={() => onAcao(acao, reserva, carona)}
            style={estilos.acao}
          >
            {BOTOES[acao].rotulo}
          </Acao>
        ))}
      </View>
    </View>
  );
}

export default function TelaMinhasReservas({ navigation }) {
  const { perfil } = useAuth();
  const { minhasReservas, carregandoCaronas, erroCaronas, recarregar } = useCaronas();
  const entrada = useEntrada();

  if (carregandoCaronas && !minhasReservas.length) return <EstadoTela tipo="carregando" titulo="Carregando suas reservas" />;
  if (erroCaronas && !minhasReservas.length)
    return <EstadoTela tipo="erro" mensagem={erroCaronas} acao={{ rotulo: "Tentar de novo", onPress: recarregar }} />;
  if (!minhasReservas.length)
    return (
      <EstadoTela
        tipo="vazio"
        icone="map"
        titulo="Você ainda não reservou carona"
        mensagem="Encontre uma carona para o campus e peça sua vaga."
        acao={{ rotulo: "Buscar caronas", onPress: () => navigation.navigate("Buscar") }}
      />
    );

  const { proximas, historico } = separarReservas(minhasReservas);

  function aoAcionar(acao, reserva, carona) {
    if (acao === "detalhes") navigation.navigate("DetalhesCarona", { caronaId: carona.id });
    if (acao === "conversa") navigation.navigate("Conversa", { caronaId: carona.id });
    if (acao === "avaliar") navigation.navigate("AvaliarViagem", { reservaId: reserva.id });
  }

  const resumo = `${saudacao()}, ${primeiroNome(perfil?.nome)}. ${proximas.length} ${proximas.length === 1 ? "reserva próxima" : "reservas próximas"}.`;
  let indice = 0;
  const secao = (titulo, itens, vazio) => (
    <View style={estilos.secao}>
      <Text style={estilos.secaoTitulo}>{titulo}</Text>
      {itens.length ? (
        itens.map(({ reserva, carona }) => (
          <Animated.View key={reserva.id} entering={entrada(indice++)}>
            <CartaoReserva reserva={reserva} carona={carona} onAcao={aoAcionar} />
          </Animated.View>
        ))
      ) : (
        <Text style={s.secundario}>{vazio}</Text>
      )}
    </View>
  );

  return (
    <ScrollView
      style={s.flex}
      contentContainerStyle={estilos.pagina}
      refreshControl={<RefreshControl refreshing={carregandoCaronas} onRefresh={recarregar} tintColor={theme.colors.secondary} />}
    >
      <Titulo texto={resumo}>Minhas reservas</Titulo>
      {secao("Próximas", proximas, "Nenhuma reserva para os próximos dias. Busque uma carona na aba Buscar.")}
      {historico.length ? secao("Histórico", historico) : null}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  pagina: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl, gap: theme.spacing.lg },
  secao: { gap: theme.spacing.mdSm },
  secaoTitulo: {
    fontFamily: theme.fonts.semibold,
    fontSize: theme.typography.sectionHeader.fontSize,
    lineHeight: theme.typography.sectionHeader.lineHeight,
    color: theme.colors.primary,
  },
  cartao: {
    gap: theme.spacing.mdSm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: theme.spacing.sm },
  direita: { alignItems: "flex-end", gap: theme.spacing.xs },
  hora: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.typography.display.fontSize,
    lineHeight: theme.typography.display.lineHeight,
    color: theme.colors.primary,
    fontVariant: ["tabular-nums"],
  },
  preco: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  trajeto: { gap: theme.spacing.xs },
  ponto: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  pontoTexto: { flex: 1, fontFamily: theme.fonts.medium, fontSize: theme.typography.body.fontSize, color: theme.colors.text },
  motorista: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.mdSm,
    paddingTop: theme.spacing.mdSm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  nome: { fontFamily: theme.fonts.semibold, fontSize: theme.typography.body.fontSize, color: theme.colors.primary },
  acoes: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  acao: { flexGrow: 1, minHeight: theme.touchTarget.minHeight },
});
