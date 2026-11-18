import React, { useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import EstadoTela from "../../components/EstadoTela";
import { useAuth } from "../../context/AuthContext";
import { useCaronas } from "../../context/CaronasContext";
import theme from "../../theme";
import { formatarDataHora, formatarNota, rotuloDia } from "../../utils";
import { Acao, Mensagem, s, Titulo } from "../acesso/ComponentesAcesso";
import { Avatar, Vazio, useEntrada } from "./comum";
import { montarSaida, primeiroNome, resultadoResposta } from "./logica";

function CartaoPedido({ pedido, ocupado, emAndamento, erro, onAceitar, onRecusar }) {
  const { passageiro = {}, carona } = pedido;
  return (
    <View style={estilos.cartao}>
      <View style={estilos.pessoa}>
        <Avatar nome={passageiro.nome} fotoBase64={passageiro.fotoBase64} tamanho={52} />
        <View style={estilos.flex}>
          <Text style={estilos.nome}>{passageiro.nome}</Text>
          {passageiro.curso ? <Text style={s.secundario}>{passageiro.curso}</Text> : null}
        </View>
        <View style={estilos.nota} accessibilityLabel={`Nota como passageiro ${formatarNota(passageiro.nota)}`}>
          <Feather name="star" size={16} color={theme.colors.warning} />
          <Text style={estilos.notaTexto}>{formatarNota(passageiro.nota)}</Text>
        </View>
      </View>

      <View style={estilos.carona}>
        <View style={estilos.linha}>
          <Feather name="clock" size={15} color={theme.colors.textSecondary} />
          <Text style={estilos.caronaTexto}>{formatarDataHora(carona.saidaEm)}</Text>
        </View>
        <View style={estilos.linha}>
          <Feather name="map-pin" size={15} color={theme.colors.primary} />
          <Text style={estilos.caronaTexto} numberOfLines={1}>{carona.origem?.bairro}</Text>
          <Feather name="arrow-right" size={14} color={theme.colors.textMuted} />
          <Feather name="navigation" size={15} color={theme.colors.secondary} />
          <Text style={estilos.caronaTexto} numberOfLines={1}>{carona.campusDestino}</Text>
        </View>
      </View>

      {erro ? <Text style={s.error}>{erro}</Text> : null}
      <View style={estilos.botoes}>
        <Acao icone="x" secundario carregando={emAndamento === "recusar"} disabled={ocupado} onPress={onRecusar} style={estilos.flex}>
          Recusar
        </Acao>
        <Acao icone="check" carregando={emAndamento === "aceitar"} disabled={ocupado} onPress={onAceitar} style={[estilos.flex, estilos.aceitar]}>
          Aceitar
        </Acao>
      </View>
    </View>
  );
}

// Aluno que avisou que precisa de carona; o motorista combina o ponto de encontro.
function CartaoInteresse({ interesse, onCombinar }) {
  const { passageiro = {}, origem = {} } = interesse;
  return (
    <View style={estilos.cartao}>
      <View style={estilos.pessoa}>
        <Avatar nome={passageiro.nome} fotoBase64={passageiro.fotoBase64} tamanho={48} />
        <View style={estilos.flex}>
          <Text style={estilos.nome}>{passageiro.nome}</Text>
          <Text style={estilos.quando}>
            {rotuloDia(montarSaida(interesse.dia, interesse.hora))}, {interesse.hora}
          </Text>
        </View>
      </View>
      <View style={estilos.carona}>
        <View style={estilos.linha}>
          <Feather name="map-pin" size={15} color={theme.colors.warning} />
          <Text style={estilos.caronaTexto} numberOfLines={1}>{[origem.rua, origem.bairro].filter(Boolean).join(", ")}</Text>
        </View>
        <View style={estilos.linha}>
          <Feather name="navigation" size={15} color={theme.colors.secondary} />
          <Text style={estilos.caronaTexto} numberOfLines={1}>{interesse.campusDestino}</Text>
        </View>
      </View>
      <Acao icone="map" onPress={onCombinar}>
        Combinar ponto de encontro
      </Acao>
    </View>
  );
}

export default function TelaSolicitacoes({ navigation }) {
  const { perfil } = useAuth();
  const { solicitacoesPendentes, interessesAbertos, minhasRotas, carregandoCaronas, erroCaronas, recarregar, aceitarReserva, recusarReserva } = useCaronas();
  const [ocupado, setOcupado] = useState(null);
  const [erros, setErros] = useState({});
  const [aviso, setAviso] = useState("");
  const entrada = useEntrada();

  const carregado = solicitacoesPendentes.length || minhasRotas.length || interessesAbertos.length;
  if (carregandoCaronas && !carregado) return <EstadoTela tipo="carregando" titulo="Carregando pedidos" />;
  if (erroCaronas && !carregado)
    return <EstadoTela tipo="erro" titulo="Não foi possível carregar" mensagem={erroCaronas} acao={{ rotulo: "Tentar de novo", onPress: recarregar }} />;

  const pedidos = solicitacoesPendentes;

  async function responder(pedido, acao) {
    const id = pedido.reserva.id;
    setOcupado({ id, acao });
    setErros((atuais) => ({ ...atuais, [id]: null }));
    setAviso("");
    try {
      await (acao === "aceitar" ? aceitarReserva(id) : recusarReserva(id));
    } catch (erro) {
      const mensagem = erro.message || "Não foi possível responder o pedido.";
      if (resultadoResposta(acao, mensagem) === "recusar_sem_vaga") {
        try {
          await recusarReserva(id);
          setAviso(`A carona lotou. O pedido de ${primeiroNome(pedido.passageiro?.nome)} foi recusado.`);
        } catch (falhaRecusa) {
          setErros((atuais) => ({ ...atuais, [id]: falhaRecusa.message || mensagem }));
        }
      } else {
        setErros((atuais) => ({ ...atuais, [id]: mensagem }));
      }
    } finally {
      setOcupado(null);
    }
  }

  function recusar(pedido) {
    Alert.alert(`Recusar o pedido de ${primeiroNome(pedido.passageiro?.nome)}?`, "O passageiro recebe o aviso e pode procurar outra carona.", [
      { text: "Voltar", style: "cancel" },
      { text: "Recusar", style: "destructive", onPress: () => responder(pedido, "recusar") },
    ]);
  }

  const resumo = pedidos.length === 0 ? "Nenhum pedido aguardando." : `${pedidos.length} ${pedidos.length === 1 ? "pedido aguardando" : "pedidos aguardando"}.`;

  return (
    <ScrollView
      style={s.flex}
      contentContainerStyle={estilos.pagina}
      refreshControl={<RefreshControl refreshing={carregandoCaronas} onRefresh={recarregar} tintColor={theme.colors.secondary} />}
    >
      <Titulo>Pedidos</Titulo>
      <Mensagem>{aviso}</Mensagem>
      {pedidos.length ? <Text style={estilos.secaoTitulo}>Querem entrar nas suas caronas</Text> : null}
      {pedidos.map((pedido, i) => (
          <Animated.View key={pedido.reserva.id} entering={entrada(i)}>
            <CartaoPedido
              pedido={pedido}
              ocupado={!!ocupado}
              emAndamento={ocupado?.id === pedido.reserva.id ? ocupado.acao : null}
              erro={erros[pedido.reserva.id]}
              onAceitar={() => responder(pedido, "aceitar")}
              onRecusar={() => recusar(pedido)}
            />
          </Animated.View>
      ))}
      {interessesAbertos.length ? (
        <>
          <Text style={estilos.secaoTitulo}>Precisam de carona</Text>
          {interessesAbertos.map((interesse) => (
            <CartaoInteresse key={interesse.id} interesse={interesse} onCombinar={() => navigation.navigate("Combinar", { interesseId: interesse.id })} />
          ))}
        </>
      ) : null}
      {!pedidos.length && !interessesAbertos.length ? (
        <Vazio
          icone="users"
          titulo="Nenhum pedido agora"
          frase="Pedidos de vaga e alunos que precisam de carona aparecem aqui."
          acao="Ver minhas rotas"
          iconeAcao="map"
          onAcao={() => navigation.navigate("Rotas")}
        />
      ) : null}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  secaoTitulo: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary, marginTop: 4 },
  quando: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.secondary },
  pagina: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl, gap: theme.spacing.md },
  flex: { flex: 1 },
  cartao: {
    gap: theme.spacing.mdSm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  pessoa: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm },
  nome: { fontFamily: theme.fonts.bold, fontSize: 16, lineHeight: 23, color: theme.colors.primary },
  nota: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  notaTexto: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  carona: { gap: theme.spacing.xs, paddingTop: theme.spacing.mdSm, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  linha: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  caronaTexto: { flexShrink: 1, fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.text },
  botoes: { flexDirection: "row", gap: theme.spacing.sm },
  aceitar: { backgroundColor: theme.colors.success },
});
