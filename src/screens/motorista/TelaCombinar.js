import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BuscaRua from "../../components/BuscaRua";
import MapaRota from "../../components/MapaRota";
import { useAuth } from "../../context/AuthContext";
import { useCaronas } from "../../context/CaronasContext";
import { calcularRota, enderecoDoPonto } from "../../services/api";
import theme from "../../theme";
import { campusPorNome, distanciaMetros, formatarMoeda, pontoDeEncontro, rotuloDia, sugerirRateio, textoCaminhada } from "../../utils";
import { Acao, Campo, Mensagem, s } from "../acesso/ComponentesAcesso";
import { Avatar } from "./comum";
import { PASSO_VALOR, ajustarValor, mascararHora, montarSaida } from "./logica";

const texto = (e) => [e?.rua, e?.bairro].filter(Boolean).join(", ");

// O motorista diz de onde sai; o app traça a rota até o campus e sugere o ponto dela mais perto do passageiro.
export default function TelaCombinar({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { perfil } = useAuth();
  const { interessesAbertos, combinarInteresse } = useCaronas();
  const interesse = interessesAbertos.find((i) => i.id === route.params?.interesseId);
  const lugares = perfil?.motorista?.lugares || 3;

  const [rua, setRua] = useState("");
  const [saida, setSaida] = useState(null);
  const [rota, setRota] = useState(null);
  const [encontro, setEncontro] = useState(null);
  const [referencia, setReferencia] = useState("");
  const [hora, setHora] = useState(interesse?.hora || "07:00");
  const [valor, setValor] = useState(null);
  const [calculando, setCalculando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState("");
  const pedido = useRef(0);
  const campus = campusPorNome(interesse?.campusDestino);

  async function nomear(ponto) {
    const atual = pedido.current;
    try {
      const endereco = await enderecoDoPonto(ponto.lat, ponto.lng);
      if (atual === pedido.current) setEncontro((e) => e && { ...e, rua: endereco.rua, bairro: endereco.bairro });
    } catch {
      // Sem nome da rua o ponto continua valendo; o motorista escreve a referência.
    }
  }

  useEffect(() => {
    if (!saida || !campus || !interesse) return;
    const atual = ++pedido.current;
    setCalculando(true);
    setFalha("");
    calcularRota(saida, campus)
      .then((r) => {
        if (atual !== pedido.current) return;
        setRota(r);
        const ponto = pontoDeEncontro(r.linha, interesse.origem);
        setEncontro({ lat: ponto.lat, lng: ponto.lng, distancia: ponto.distancia, rua: "", bairro: "" });
        setValor((v) => v ?? sugerirRateio(r.distanciaKm, lugares));
        nomear(ponto);
      })
      .catch((e) => atual === pedido.current && setFalha(e.message))
      .finally(() => atual === pedido.current && setCalculando(false));
  }, [saida?.lat, saida?.lng]);

  if (!interesse) {
    return (
      <View style={[s.flex, estilos.pagina]}>
        <Text style={s.titulo}>Pedido indisponível</Text>
        <Text style={estilos.explica}>Outro motorista já combinou com essa pessoa, ou ela cancelou.</Text>
        <Acao icone="arrow-left" secundario onPress={() => navigation.goBack()}>
          Voltar
        </Acao>
      </View>
    );
  }

  const pontos = [
    saida && { lat: saida.lat, lng: saida.lng, titulo: "Você sai daqui", tipo: "origem" },
    { lat: interesse.origem.lat, lng: interesse.origem.lng, titulo: `${interesse.passageiro?.nome?.split(" ")[0]} sai daqui`, tipo: "carona" },
    encontro && { lat: encontro.lat, lng: encontro.lng, titulo: "Ponto de encontro", tipo: "encontro" },
    campus && { lat: campus.lat, lng: campus.lng, titulo: campus.nome, tipo: "destino" },
  ].filter(Boolean);
  const saidaEm = montarSaida(interesse.dia, hora);

  function moverPonto({ lat, lng }) {
    if (!rota) return;
    pedido.current += 1;
    const ponto = { lat, lng, distancia: distanciaMetros({ lat, lng }, interesse.origem), rua: "", bairro: "" };
    setEncontro(ponto);
    nomear(ponto);
  }

  async function publicar() {
    setEnviando(true);
    setFalha("");
    try {
      const trecho = await calcularRota(encontro, campus).catch(() => null);
      await combinarInteresse(interesse, {
        origem: {
          rua: encontro.rua || texto(interesse.origem),
          bairro: encontro.bairro || interesse.origem.bairro || "Juiz de Fora",
          ponto: referencia.trim() || `Combinado com ${interesse.passageiro?.nome?.split(" ")[0]}`,
          lat: encontro.lat,
          lng: encontro.lng,
        },
        campusDestino: campus.nome,
        destino: { lat: campus.lat, lng: campus.lng },
        saidaEm,
        vagasTotais: lugares,
        valorCentavos: valor,
        rota: trecho,
      });
      Alert.alert("Carona combinada", `${interesse.passageiro?.nome?.split(" ")[0]} recebe o aviso e confirma a vaga.`);
      navigation.navigate("Principal", { screen: "Abas", params: { screen: "Rotas" } });
    } catch (e) {
      setFalha(e?.message || "Não foi possível combinar.");
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.pagina}>
        <View style={estilos.pessoa}>
          <Avatar nome={interesse.passageiro?.nome} fotoBase64={interesse.passageiro?.fotoBase64} tamanho={52} />
          <View style={{ flex: 1 }}>
            <Text style={estilos.nome}>{interesse.passageiro?.nome}</Text>
            <Text style={estilos.quando}>
              {rotuloDia(montarSaida(interesse.dia, interesse.hora))}, {interesse.hora}
            </Text>
          </View>
        </View>
        <View style={estilos.trajeto}>
          <Linha cor={theme.colors.warning} texto={`Sai de ${texto(interesse.origem)}`} />
          <Linha cor={theme.colors.secondary} texto={interesse.campusDestino} />
        </View>

        <BuscaRua
          rotulo="De onde você sai"
          valor={rua}
          onMudarTexto={setRua}
          onEscolher={(r) => {
            setRua(r.rua);
            setSaida(r);
          }}
        />

        <MapaRota pontos={pontos} linha={rota?.linha} altura={260} onToque={moverPonto} />
        {calculando ? (
          <View style={estilos.dica}>
            <ActivityIndicator color={theme.colors.secondary} />
            <Text style={estilos.dicaTexto}>Traçando sua rota e o melhor ponto</Text>
          </View>
        ) : null}

        {encontro ? (
          <View style={estilos.encontro}>
            <View style={estilos.encontroTopo}>
              <Feather name="map-pin" size={18} color={theme.colors.success} />
              <Text style={estilos.encontroRotulo}>Ponto de encontro</Text>
            </View>
            <Text style={estilos.encontroRua}>{texto(encontro) || "Procurando o nome da rua"}</Text>
            <Text style={estilos.encontroCaminhada}>{textoCaminhada(encontro.distancia)}, no seu caminho</Text>
            <Text style={estilos.encontroDica}>Toque no mapa para mudar o ponto</Text>
          </View>
        ) : (
          <Text style={estilos.explica}>Diga de onde você sai. O app sugere um ponto no seu caminho, perto de onde a pessoa está.</Text>
        )}

        {encontro ? (
          <>
            <Campo label="Referência do ponto" icon="flag" value={referencia} onChangeText={setReferencia} maxLength={120} placeholder="Em frente à padaria" />
            <Campo label="Horário de saída" icon="clock" value={hora} onChangeText={(t) => setHora(mascararHora(t))} keyboardType="number-pad" maxLength={5} />
            <View style={estilos.valor}>
              <Text style={estilos.valorRotulo}>Valor por pessoa</Text>
              <Acao icone="minus" secundario onPress={() => setValor((v) => ajustarValor(v, -PASSO_VALOR))} style={estilos.valorBotao} />
              <Text style={estilos.valorNumero}>{formatarMoeda(valor || 0)}</Text>
              <Acao icone="plus" secundario onPress={() => setValor((v) => ajustarValor(v, PASSO_VALOR))} style={estilos.valorBotao} />
            </View>
          </>
        ) : null}
        <Mensagem>{falha}</Mensagem>
      </ScrollView>
      <View style={[estilos.barra, { paddingBottom: insets.bottom + 12 }]}>
        <Acao icone="send" carregando={enviando} disabled={!encontro || calculando || !saidaEm} onPress={publicar}>
          Combinar e publicar
        </Acao>
      </View>
    </KeyboardAvoidingView>
  );
}

function Linha({ cor, texto: valor }) {
  return (
    <View style={estilos.linha}>
      <View style={[estilos.marco, { backgroundColor: cor }]} />
      <Text style={estilos.linhaTexto} numberOfLines={1}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: theme.spacing.md, gap: theme.spacing.md, paddingBottom: theme.spacing.xl },
  explica: { fontFamily: theme.fonts.medium, fontSize: 15, lineHeight: 22, color: theme.colors.text },
  pessoa: { flexDirection: "row", alignItems: "center", gap: 12 },
  nome: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.primary },
  quando: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.secondary },
  trajeto: { gap: 8 },
  linha: { flexDirection: "row", alignItems: "center", gap: 10 },
  marco: { width: 8, height: 8, borderRadius: 4 },
  linhaTexto: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 15, color: theme.colors.text },
  dica: { flexDirection: "row", alignItems: "center", gap: 8 },
  dicaTexto: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.text },
  encontro: { gap: 4, padding: 16, borderRadius: theme.radii.lg, backgroundColor: theme.colors.successLight },
  encontroTopo: { flexDirection: "row", alignItems: "center", gap: 8 },
  encontroRotulo: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.success },
  encontroRua: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary },
  encontroCaminhada: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.text },
  encontroDica: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.success, marginTop: 4 },
  valor: { flexDirection: "row", alignItems: "center", gap: 10 },
  valorRotulo: { flex: 1, fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  valorBotao: { width: 48, minHeight: 48, paddingHorizontal: 0 },
  valorNumero: { minWidth: 76, textAlign: "center", fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  barra: { paddingHorizontal: theme.spacing.md, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
});
