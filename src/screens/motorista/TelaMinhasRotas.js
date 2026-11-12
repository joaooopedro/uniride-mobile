import React, { useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import EstadoTela from "../../components/EstadoTela";
import EstadoViagem from "../../components/EstadoViagem";
import { useAuth } from "../../context/AuthContext";
import { useCaronas } from "../../context/CaronasContext";
import theme from "../../theme";
import { formatarData, formatarHora, formatarMoeda } from "../../utils";
import { Acao, s, Titulo } from "../acesso/ComponentesAcesso";
import { Avatar, Vazio, useEntrada } from "./comum";
import { acoesDaRota, primeiroNome, rotuloStatus, saudacao, separarRotas } from "./logica";

const BOTOES = {
  iniciar: { rotulo: "Iniciar viagem", icone: "play" },
  concluir: { rotulo: "Concluir viagem", icone: "check-circle" },
  cancelar: { rotulo: "Cancelar", icone: "x", secundario: true },
  conversa: { rotulo: "Conversa", icone: "message-circle", secundario: true },
};

function CartaoRota({ rota, ocupado, erro, onAcao }) {
  const ocupadas = rota.vagasTotais - rota.vagasRestantes;
  const aceitos = rota.passageirosAceitos || [];
  const acoes = acoesDaRota(rota.status);
  return (
    <View style={estilos.cartao}>
      <View style={estilos.topo}>
        <View>
          <Text style={estilos.hora}>{formatarHora(rota.saidaEm)}</Text>
          <Text style={s.secundario}>{formatarData(rota.saidaEm)}</Text>
        </View>
        <Text style={estilos.preco}>{formatarMoeda(rota.valorCentavos)}</Text>
      </View>

      <View style={estilos.trajeto}>
        <View style={estilos.ponto}>
          <Feather name="map-pin" size={15} color={theme.colors.primary} />
          <Text style={estilos.pontoTexto} numberOfLines={1}>{rota.origem?.bairro}</Text>
        </View>
        <View style={estilos.ponto}>
          <Feather name="navigation" size={15} color={theme.colors.secondary} />
          <Text style={estilos.pontoTexto} numberOfLines={1}>{rota.campusDestino}</Text>
        </View>
      </View>

      <View style={estilos.ocupacao}>
        <View style={estilos.barra}>
          <View style={[estilos.barraCheia, { width: `${rota.vagasTotais ? (ocupadas / rota.vagasTotais) * 100 : 0}%` }]} />
        </View>
        <Text style={s.secundario}>{ocupadas} de {rota.vagasTotais} vagas</Text>
      </View>

      <View style={estilos.rodape}>
        <EstadoViagem status={rotuloStatus(rota.status)} />
        {aceitos.length ? (
          <View style={estilos.avatares} accessibilityLabel={`Passageiros: ${aceitos.map((p) => p.nome).join(", ")}`}>
            {aceitos.map((passageiro, i) => (
              <Avatar key={passageiro.uid} nome={passageiro.nome} tamanho={32} sobreposto={i > 0} />
            ))}
          </View>
        ) : null}
      </View>

      {erro ? <Text style={s.error}>{erro}</Text> : null}
      {acoes.length ? (
        <View style={estilos.acoes}>
          {acoes.map((acao) => (
            <Acao
              key={acao}
              icone={BOTOES[acao].icone}
              secundario={BOTOES[acao].secundario}
              carregando={ocupado === acao}
              disabled={!!ocupado}
              onPress={() => onAcao(rota, acao)}
              style={estilos.acao}
            >
              {BOTOES[acao].rotulo}
            </Acao>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function TelaMinhasRotas({ navigation }) {
  const { perfil } = useAuth();
  const { minhasRotas, carregandoCaronas, erroCaronas, recarregar, iniciarViagem, concluirViagem, cancelarCarona } = useCaronas();
  const [ocupado, setOcupado] = useState(null);
  const [erros, setErros] = useState({});
  const entrada = useEntrada();

  if (carregandoCaronas && !minhasRotas.length) return <EstadoTela tipo="carregando" titulo="Carregando suas rotas" />;
  if (erroCaronas && !minhasRotas.length)
    return <EstadoTela tipo="erro" titulo="Não foi possível carregar" mensagem={erroCaronas} acao={{ rotulo: "Tentar de novo", onPress: recarregar }} />;

  const { proximas, anteriores } = separarRotas(minhasRotas);

  async function executar(rota, acao) {
    const funcoes = { iniciar: iniciarViagem, concluir: concluirViagem, cancelar: cancelarCarona };
    setOcupado({ id: rota.id, acao });
    setErros((atuais) => ({ ...atuais, [rota.id]: null }));
    try {
      await funcoes[acao](rota.id);
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
    const confirmacoes = {
      iniciar: ["Iniciar a viagem agora?", "Os pedidos sem resposta serão recusados.", "Iniciar viagem", "default"],
      concluir: ["Concluir a viagem?", "Não dá para desfazer.", "Concluir viagem", "default"],
      cancelar: ["Cancelar carona?", "Os passageiros aceitos serão avisados.", "Cancelar carona", "destructive"],
    };
    const [titulo, mensagem, confirmar, estilo] = confirmacoes[acao];
    Alert.alert(titulo, mensagem, [
      { text: "Voltar", style: "cancel" },
      { text: confirmar, style: estilo, onPress: () => executar(rota, acao) },
    ]);
  }

  const resumo = `${saudacao()}, ${primeiroNome(perfil?.nome)}. ${proximas.length} ${proximas.length === 1 ? "carona próxima" : "caronas próximas"}.`;
  let indice = 0;
  const secao = (titulo, rotas) =>
    rotas.length ? (
      <View style={estilos.secao}>
        <Text style={estilos.secaoTitulo}>{titulo}</Text>
        {rotas.map((rota) => (
          <Animated.View key={rota.id} entering={entrada(indice++)}>
            <CartaoRota
              rota={rota}
              ocupado={ocupado?.id === rota.id ? ocupado.acao : ocupado ? "outra" : null}
              erro={erros[rota.id]}
              onAcao={aoAcionar}
            />
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
      <Titulo texto={resumo}>Minhas rotas</Titulo>
      {minhasRotas.length ? (
        <>
          {secao("Próximas", proximas)}
          {secao("Anteriores", anteriores)}
        </>
      ) : (
        <Vazio
          icone="map"
          titulo="Você ainda não ofereceu carona"
          frase="Publique uma rota e os passageiros do seu caminho podem pedir vaga."
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
  secao: { gap: theme.spacing.mdSm },
  secaoTitulo: { fontFamily: theme.fonts.semibold, fontSize: 19, lineHeight: 27, color: theme.colors.primary },
  cartao: {
    gap: theme.spacing.mdSm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  topo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  hora: { fontFamily: theme.fonts.bold, fontSize: 30, lineHeight: 38, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  preco: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  trajeto: { gap: theme.spacing.xs },
  ponto: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  pontoTexto: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.text },
  ocupacao: { gap: theme.spacing.xs },
  barra: { height: 6, borderRadius: theme.radii.full, backgroundColor: theme.colors.borderLight, overflow: "hidden" },
  barraCheia: { height: 6, borderRadius: theme.radii.full, backgroundColor: theme.colors.secondary },
  rodape: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
  avatares: { flexDirection: "row" },
  acoes: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  acao: { flexGrow: 1, minHeight: 48 },
});
