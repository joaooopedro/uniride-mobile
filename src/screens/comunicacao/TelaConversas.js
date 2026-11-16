import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import EstadoTela from "../../components/EstadoTela";
import MotionPressable from "../../components/MotionPressable";
import { useAuth } from "../../context/AuthContext";
import { useAvisos } from "../../context/AvisosContext";
import theme from "../../theme";
import { formatarDataHora } from "../../utils";
import { s, Titulo } from "../acesso/ComponentesAcesso";
import { Avatar, useEntrada } from "../motorista/comum";
import { horaDaConversa, previaDaMensagem } from "./logica";

function LinhaConversa({ conversa, uid, onPress }) {
  const { carona, ultimaMensagem, naoLidas } = conversa;
  const souMotorista = carona.motoristaId === uid;
  const nome = souMotorista ? "Passageiros da sua carona" : carona.motorista?.nome;
  const temNovas = naoLidas > 0;
  return (
    <MotionPressable
      onPress={onPress}
      style={estilos.linha}
      accessibilityLabel={`Conversa ${nome}, ${carona.origem?.bairro} até ${carona.campusDestino}${temNovas ? `, ${naoLidas} não lidas` : ""}`}
    >
      {souMotorista ? (
        <View style={estilos.icone}>
          <Feather name="users" size={20} color={theme.colors.primary} />
        </View>
      ) : (
        <Avatar nome={nome} fotoBase64={carona.motorista?.fotoBase64} tamanho={48} />
      )}
      <View style={estilos.conteudo}>
        <View style={estilos.topo}>
          <Text style={estilos.nome} numberOfLines={1}>{nome}</Text>
          <Text style={[estilos.hora, temNovas && estilos.horaNova]}>
            {horaDaConversa(ultimaMensagem?.criadoEm)}
          </Text>
        </View>
        <View style={estilos.trajeto}>
          <Text style={estilos.trajetoTexto} numberOfLines={1}>{carona.origem?.bairro}</Text>
          <Feather name="arrow-right" size={12} color={theme.colors.textMuted} />
          <Text style={estilos.trajetoTexto} numberOfLines={1}>{carona.campusDestino}</Text>
        </View>
        <Text style={s.secundario}>{formatarDataHora(carona.saidaEm)}</Text>
        <View style={estilos.topo}>
          <Text style={[estilos.previa, temNovas && estilos.previaNova]} numberOfLines={1}>
            {previaDaMensagem(ultimaMensagem, uid)}
          </Text>
          {temNovas ? (
            <View style={estilos.bolinha}>
              <Text style={estilos.bolinhaTexto}>{naoLidas > 99 ? "99+" : naoLidas}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </MotionPressable>
  );
}

export default function TelaConversas({ navigation }) {
  const { usuario } = useAuth();
  const { conversas, naoLidasTotal } = useAvisos();
  const entrada = useEntrada();

  if (!conversas.length)
    return (
      <EstadoTela
        tipo="vazio"
        icone="message-circle"
        titulo="Nenhuma conversa ainda"
        mensagem="As conversas aparecem quando você tem uma reserva aceita ou uma carona com passageiros."
      />
    );

  const resumo = naoLidasTotal
    ? `${naoLidasTotal} ${naoLidasTotal === 1 ? "mensagem nova" : "mensagens novas"}.`
    : "Tudo lido.";

  return (
    <FlatList
      style={s.flex}
      contentContainerStyle={estilos.pagina}
      data={conversas}
      keyExtractor={(conversa) => conversa.carona.id}
      ListHeaderComponent={<View style={estilos.cabecalho}><Titulo texto={resumo}>Conversas</Titulo></View>}
      ItemSeparatorComponent={() => <View style={estilos.divisoria} />}
      renderItem={({ item, index }) => (
        <Animated.View entering={entrada(index)}>
          <LinhaConversa
            conversa={item}
            uid={usuario?.uid}
            onPress={() => navigation.navigate("Conversa", { caronaId: item.carona.id })}
          />
        </Animated.View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  cabecalho: { marginBottom: theme.spacing.md },
  divisoria: { height: 1, backgroundColor: theme.colors.border },
  linha: { flexDirection: "row", gap: theme.spacing.mdSm, paddingVertical: theme.spacing.mdSm, minHeight: theme.touchTarget.minHeight },
  icone: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: { flex: 1, gap: 2 },
  topo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  nome: { flex: 1, fontFamily: theme.fonts.bold, fontSize: theme.typography.cardTitle.fontSize, color: theme.colors.primary },
  hora: { fontFamily: theme.fonts.medium, fontSize: theme.typography.caption.fontSize, color: theme.colors.textMuted, fontVariant: ["tabular-nums"] },
  horaNova: { color: theme.colors.secondary, fontFamily: theme.fonts.semibold },
  trajeto: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  trajetoTexto: { flexShrink: 1, fontFamily: theme.fonts.medium, fontSize: theme.typography.body.fontSize, color: theme.colors.text },
  previa: { flex: 1, fontFamily: theme.fonts.regular, fontSize: theme.typography.body.fontSize, color: theme.colors.textSecondary },
  previaNova: { fontFamily: theme.fonts.semibold, color: theme.colors.text },
  bolinha: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  bolinhaTexto: { fontFamily: theme.fonts.bold, fontSize: theme.typography.micro.fontSize, color: theme.colors.surface },
});
