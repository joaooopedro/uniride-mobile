import React, { useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import EstadoTela from "../../components/EstadoTela";
import MapaRota from "../../components/MapaRota";
import MotionPressable from "../../components/MotionPressable";
import { useCaronas } from "../../context/CaronasContext";
import theme from "../../theme";
import { formatarHora, formatarMoeda, rotuloDia } from "../../utils";
import { Acao, s, Titulo } from "../acesso/ComponentesAcesso";
import { Avatar, Vazio, useEntrada } from "./comum";
import { ehErroSemVaga, podeIniciar, primeiroNome, separarRotas } from "./logica";

const STATUS = {
  aberta: { icone: "clock", texto: "Aguardando saída", cor: "warning" },
  em_andamento: { icone: "navigation", texto: "Em andamento", cor: "secondary" },
  concluida: { icone: "flag", texto: "Concluída", cor: "textSecondary" },
  cancelada: { icone: "x-circle", texto: "Cancelada", cor: "danger" },
};

const origemTexto = (origem = {}) => [origem.rua, origem.bairro].filter(Boolean).join(", ") || origem.ponto || "Origem";

function Status({ status }) {
  const st = STATUS[status] || STATUS.aberta;
  return (
    <View style={estilos.status}>
      <Feather name={st.icone} size={15} color={theme.colors[st.cor]} />
      <Text style={[estilos.statusTexto, { color: theme.colors[st.cor] }]}>{st.texto}</Text>
    </View>
  );
}

function Trajeto({ rota }) {
  return (
    <View style={estilos.trajeto}>
      <View style={estilos.trajetoLinha}>
        <View style={[estilos.marco, { backgroundColor: theme.colors.primary }]} />
        <Text style={estilos.trajetoTexto} numberOfLines={1}>{origemTexto(rota.origem)}</Text>
      </View>
      <View style={estilos.trajetoLinha}>
        <View style={[estilos.marco, { backgroundColor: theme.colors.secondary }]} />
        <Text style={estilos.trajetoTexto} numberOfLines={1}>{rota.campusDestino}</Text>
      </View>
    </View>
  );
}

// Quem já está na carona e quem pediu para entrar, com resposta ali mesmo.
function Pessoas({ rota, pedidos, ocupado, onResponder }) {
  const aceitos = rota.passageirosAceitos || [];
  const aberta = rota.status === "aberta";
  return (
    <View style={estilos.pessoas}>
      <View style={estilos.pessoasTopo}>
        <Text style={estilos.pessoasTitulo}>Passageiros</Text>
        <Text style={estilos.pessoasConta}>
          {aceitos.length} de {rota.vagasTotais}
        </Text>
      </View>
      {aceitos.map((p) => (
        <View key={p.uid} style={estilos.pessoa}>
          <Avatar nome={p.nome} fotoBase64={p.fotoBase64} tamanho={40} />
          <Text style={estilos.pessoaNome} numberOfLines={1}>{p.nome}</Text>
          <Feather name="check-circle" size={20} color={theme.colors.success} accessibilityLabel="Confirmado" />
        </View>
      ))}
      {aberta &&
        pedidos.map((pedido) => {
          const id = pedido.reserva.id;
          return (
            <View key={id} style={[estilos.pessoa, estilos.pedido]}>
              <Avatar nome={pedido.passageiro?.nome} fotoBase64={pedido.passageiro?.fotoBase64} tamanho={40} />
              <View style={{ flex: 1 }}>
                <Text style={estilos.pessoaNome} numberOfLines={1}>{pedido.passageiro?.nome}</Text>
                <Text style={estilos.pedidoTexto}>Quer entrar</Text>
              </View>
              <MotionPressable
                onPress={() => onResponder(pedido, "recusar")}
                disabled={!!ocupado}
                accessibilityLabel={`Recusar ${pedido.passageiro?.nome}`}
                style={[estilos.resposta, estilos.recusar]}
              >
                <Feather name="x" size={20} color={theme.colors.danger} />
              </MotionPressable>
              <MotionPressable
                onPress={() => onResponder(pedido, "aceitar")}
                disabled={!!ocupado}
                accessibilityLabel={`Aceitar ${pedido.passageiro?.nome}`}
                style={[estilos.resposta, estilos.aceitar, ocupado === `aceitar-${id}` && { opacity: 0.6 }]}
              >
                <Feather name="check" size={20} color={theme.colors.surface} />
              </MotionPressable>
            </View>
          );
        })}
      {!aceitos.length && !(aberta && pedidos.length) ? <Text style={estilos.ninguem}>Ninguém pediu vaga ainda</Text> : null}
    </View>
  );
}

// A viagem em andamento, ou a próxima saída, fica no topo com mapa, passageiros e as ações.
function CartaoDestaque({ rota, pedidos, ocupado, erro, onAcao, onResponder, onAbrir }) {
  const emAndamento = rota.status === "em_andamento";
  const liberado = podeIniciar(rota);
  const pontos = [
    rota.origem?.lat != null && { lat: rota.origem.lat, lng: rota.origem.lng, titulo: rota.origem.ponto || rota.origem.bairro, tipo: "origem" },
    rota.destino?.lat != null && { lat: rota.destino.lat, lng: rota.destino.lng, titulo: rota.campusDestino, tipo: "destino" },
  ].filter(Boolean);
  return (
    <View style={[estilos.cartao, estilos.destaque]}>
      <MotionPressable onPress={() => onAbrir(rota)} accessibilityLabel="Ver detalhes da viagem" style={estilos.bloco}>
        <View style={estilos.linhaTopo}>
          <Text style={estilos.destaqueRotulo}>{emAndamento ? "Viagem em andamento" : "Próxima saída"}</Text>
          <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </View>
        <View style={estilos.horaLinha}>
          <Text style={estilos.horaGrande}>{formatarHora(rota.saidaEm)}</Text>
          <Text style={estilos.dia}>{rotuloDia(rota.saidaEm)}</Text>
          <Text style={estilos.preco}>{formatarMoeda(rota.valorCentavos)}</Text>
        </View>
        <Trajeto rota={rota} />
        <View pointerEvents="none">
          <MapaRota pontos={pontos} linha={rota.rota?.linha} altura={170} />
        </View>
      </MotionPressable>

      <Pessoas rota={rota} pedidos={pedidos} ocupado={ocupado} onResponder={onResponder} />

      {erro ? <Text style={s.error}>{erro}</Text> : null}
      {emAndamento ? (
        <Acao icone="flag" disabled={!!ocupado} onPress={() => onAcao(rota, "finalizar")}>
          Finalizar e receber
        </Acao>
      ) : (
        <Acao icone="play" carregando={ocupado === "iniciar"} disabled={!!ocupado || !liberado} onPress={() => onAcao(rota, "iniciar")}>
          {liberado ? "Iniciar viagem" : "Aceite alguém para iniciar"}
        </Acao>
      )}
      <View style={estilos.acoes}>
        <Acao icone="map" secundario onPress={() => onAbrir(rota)} style={estilos.acaoPequena}>
          Detalhes
        </Acao>
        <Acao icone="message-circle" secundario onPress={() => onAcao(rota, "conversa")} style={estilos.acaoPequena}>
          Conversa
        </Acao>
        {!emAndamento ? (
          <Acao icone="x" secundario disabled={!!ocupado} carregando={ocupado === "cancelar"} onPress={() => onAcao(rota, "cancelar")} style={estilos.acaoPequena}>
            Cancelar
          </Acao>
        ) : null}
      </View>
    </View>
  );
}

function CartaoRota({ rota, pedidos, onAbrir }) {
  const aceitos = rota.passageirosAceitos || [];
  const nomes = aceitos.map((p) => primeiroNome(p.nome)).join(", ");
  return (
    <MotionPressable onPress={() => onAbrir(rota)} accessibilityLabel="Ver detalhes da viagem" style={[estilos.cartao, estilos.bloco]}>
      <View style={estilos.horaLinha}>
        <Text style={estilos.horaMedia}>{formatarHora(rota.saidaEm)}</Text>
        <Text style={estilos.dia}>{rotuloDia(rota.saidaEm)}</Text>
        <Text style={estilos.precoMenor}>{formatarMoeda(rota.valorCentavos)}</Text>
      </View>
      <Trajeto rota={rota} />
      <View style={estilos.rodape}>
        <Status status={rota.status} />
        <Text style={estilos.rodapeNomes} numberOfLines={1}>
          {nomes || `${rota.vagasRestantes} ${rota.vagasRestantes === 1 ? "vaga livre" : "vagas livres"}`}
        </Text>
        {pedidos.length ? (
          <Text style={estilos.pedidosConta}>
            {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
          </Text>
        ) : null}
        <Feather name="chevron-right" size={18} color={theme.colors.textSecondary} />
      </View>
    </MotionPressable>
  );
}

export default function TelaMinhasRotas({ navigation }) {
  const {
    minhasRotas,
    solicitacoesPendentes,
    carregandoCaronas,
    erroCaronas,
    recarregar,
    iniciarViagem,
    concluirViagem,
    cancelarCarona,
    aceitarReserva,
    recusarReserva,
  } = useCaronas();
  const [ocupado, setOcupado] = useState(null);
  const [erros, setErros] = useState({});
  const entrada = useEntrada();

  if (carregandoCaronas && !minhasRotas.length) return <EstadoTela tipo="carregando" titulo="Carregando suas rotas" />;
  if (erroCaronas && !minhasRotas.length)
    return <EstadoTela tipo="erro" titulo="Não foi possível carregar" mensagem={erroCaronas} acao={{ rotulo: "Tentar de novo", onPress: recarregar }} />;

  const { proximas, anteriores } = separarRotas(minhasRotas);
  const destaque = proximas.find((r) => r.status === "em_andamento") || proximas[0];
  const demais = proximas.filter((r) => r !== destaque);
  const pedidosDe = (rota) => solicitacoesPendentes.filter((p) => (p.reserva?.caronaId || p.carona?.id) === rota.id);
  const abrir = (rota) => navigation.navigate("DetalhesCarona", { caronaId: rota.id });

  async function executar(rota, chave, funcao) {
    setOcupado({ id: rota.id, acao: chave });
    setErros((atuais) => ({ ...atuais, [rota.id]: null }));
    try {
      await funcao();
    } catch (erro) {
      setErros((atuais) => ({ ...atuais, [rota.id]: erro.message || "Não foi possível concluir a ação." }));
    } finally {
      setOcupado(null);
    }
  }

  function aoAcionar(rota, acao) {
    if (acao === "conversa") {
      navigation.navigate("Conversa", { caronaId: rota.id });
      return;
    }
    if (acao === "finalizar") {
      navigation.navigate("Cobranca", { caronaId: rota.id });
      return;
    }
    const funcoes = { iniciar: iniciarViagem, concluir: concluirViagem, cancelar: cancelarCarona };
    const confirmacoes = {
      iniciar: ["Iniciar a viagem agora?", "Pedidos sem resposta serão recusados.", "Iniciar", "default"],
      concluir: ["Concluir a viagem?", "Os passageiros vão poder pagar e avaliar.", "Concluir", "default"],
      cancelar: ["Cancelar a carona?", "Os passageiros confirmados serão avisados.", "Cancelar carona", "destructive"],
    };
    const [titulo, mensagem, confirmar, estilo] = confirmacoes[acao];
    Alert.alert(titulo, mensagem, [
      { text: "Voltar", style: "cancel" },
      { text: confirmar, style: estilo, onPress: () => executar(rota, acao, () => funcoes[acao](rota.id)) },
    ]);
  }

  function aoResponder(rota, pedido, acao) {
    const id = pedido.reserva.id;
    if (acao === "aceitar") {
      executar(rota, `aceitar-${id}`, async () => {
        try {
          await aceitarReserva(id);
        } catch (erro) {
          if (!ehErroSemVaga(erro.message)) throw erro;
          await recusarReserva(id);
          throw new Error(`A carona lotou. O pedido de ${primeiroNome(pedido.passageiro?.nome)} foi recusado.`);
        }
      });
      return;
    }
    Alert.alert(`Recusar ${primeiroNome(pedido.passageiro?.nome)}?`, "A pessoa recebe o aviso e pode procurar outra carona.", [
      { text: "Voltar", style: "cancel" },
      { text: "Recusar", style: "destructive", onPress: () => executar(rota, `recusar-${id}`, () => recusarReserva(id)) },
    ]);
  }

  let indice = 0;
  const secao = (titulo, rotas) =>
    rotas.length ? (
      <View style={estilos.secao}>
        <Text style={estilos.secaoTitulo}>{titulo}</Text>
        {rotas.map((rota) => (
          <Animated.View key={rota.id} entering={entrada(indice++)}>
            <CartaoRota rota={rota} pedidos={pedidosDe(rota)} onAbrir={abrir} />
          </Animated.View>
        ))}
      </View>
    ) : null;

  return (
    <ScrollView
      style={s.flex}
      contentContainerStyle={estilos.pagina}
      refreshControl={<RefreshControl refreshing={carregandoCaronas} onRefresh={recarregar} tintColor={theme.colors.secondary} />}
    >
      <Titulo>Minhas rotas</Titulo>
      {minhasRotas.length ? (
        <>
          {destaque ? (
            <Animated.View entering={entrada(indice++)}>
              <CartaoDestaque
                rota={destaque}
                pedidos={pedidosDe(destaque)}
                ocupado={ocupado?.id === destaque.id ? ocupado.acao : ocupado ? "outra" : null}
                erro={erros[destaque.id]}
                onAcao={aoAcionar}
                onResponder={(pedido, acao) => aoResponder(destaque, pedido, acao)}
                onAbrir={abrir}
              />
            </Animated.View>
          ) : null}
          {secao("Próximas", demais)}
          {secao("Anteriores", anteriores)}
        </>
      ) : (
        <Vazio
          icone="map"
          titulo="Nenhuma carona publicada"
          frase="Publique uma rota para receber pedidos de vaga."
          acao="Oferecer carona"
          iconeAcao="plus"
          onAcao={() => navigation.navigate("Oferecer")}
        />
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl, gap: theme.spacing.lg },
  secao: { gap: 12 },
  secaoTitulo: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.primary },
  cartao: { padding: 16, gap: 16, borderRadius: theme.radii.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  destaque: { borderColor: theme.colors.primary, borderWidth: 1.5 },
  bloco: { gap: 14 },
  linhaTopo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  destaqueRotulo: { fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.secondary },
  horaLinha: { flexDirection: "row", alignItems: "baseline", gap: 10 },
  horaGrande: { fontFamily: theme.fonts.bold, fontSize: 40, lineHeight: 46, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  horaMedia: { fontFamily: theme.fonts.bold, fontSize: 26, lineHeight: 32, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  dia: { flex: 1, fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.secondary },
  preco: { fontFamily: theme.fonts.bold, fontSize: 22, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  precoMenor: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  trajeto: { gap: 8 },
  trajetoLinha: { flexDirection: "row", alignItems: "center", gap: 10 },
  marco: { width: 8, height: 8, borderRadius: 4 },
  trajetoTexto: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 15, color: theme.colors.text },
  pessoas: { gap: 10, paddingTop: 14, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  pessoasTopo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pessoasTitulo: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
  pessoasConta: { fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  pessoa: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 },
  pessoaNome: { flex: 1, fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  pedido: { padding: 10, marginHorizontal: -10, borderRadius: theme.radii.md, backgroundColor: theme.colors.warningLight },
  pedidoTexto: { fontFamily: theme.fonts.semibold, fontSize: 13, color: theme.colors.warning },
  resposta: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  recusar: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  aceitar: { backgroundColor: theme.colors.success },
  ninguem: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.textSecondary },
  acoes: { flexDirection: "row", gap: 8 },
  acaoPequena: { flex: 1, minHeight: 48, paddingHorizontal: 8 },
  rodape: { flexDirection: "row", alignItems: "center", gap: 10 },
  status: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusTexto: { fontFamily: theme.fonts.semibold, fontSize: 13 },
  rodapeNomes: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.text, textAlign: "right" },
  pedidosConta: { fontFamily: theme.fonts.bold, fontSize: 13, color: theme.colors.warning },
});
