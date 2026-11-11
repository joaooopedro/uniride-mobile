import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MapaRota from "../../components/MapaRota";
import MotionPressable from "../../components/MotionPressable";
import { useAuth } from "../../context/AuthContext";
import { useCaronas } from "../../context/CaronasContext";
import { buscarCep, calcularRota, feriadoNaData, geocodificar } from "../../services/api";
import { descartarRascunho, lerRascunho, salvarRascunho } from "../../services/localStore";
import theme from "../../theme";
import {
  CAMPI,
  campusPorNome,
  formatarData,
  formatarDistancia,
  formatarDuracao,
  formatarMoeda,
  mascararCep,
  soDigitos,
  sugerirRateio,
} from "../../utils";
import { Acao, Campo, Mensagem, s, Titulo } from "../acesso/ComponentesAcesso";
import { Secao } from "./comum";
import {
  PASSO_VALOR,
  ajustarValor,
  chaveDaRota,
  dataParaIso,
  errosOferta,
  mascararHora,
  mesclarEndereco,
  montarSaida,
  ofertaVazia,
  proximosDias,
  restaurarRascunho,
} from "./logica";

const ALTURA_CABECALHO = 62;
const montarEndereco = (oferta) =>
  [oferta.rua, oferta.numero, oferta.bairro].map((parte) => parte.trim()).filter(Boolean).join(", ");

export default function TelaOferecerCarona({ navigation }) {
  const insets = useSafeAreaInsets();
  const { usuario, perfil } = useAuth();
  const { oferecerCarona } = useCaronas();
  const lugares = perfil?.motorista?.lugares || 1;
  const uid = usuario?.uid;

  const [oferta, setOferta] = useState(() => ofertaVazia(lugares));
  const vazia = useRef(JSON.stringify(oferta));
  const [pronto, setPronto] = useState(false);
  const [restaurado, setRestaurado] = useState(false);
  const [tocados, setTocados] = useState({});
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [localizando, setLocalizando] = useState(false);
  const [erroMapa, setErroMapa] = useState("");
  const [calculando, setCalculando] = useState(false);
  const [erroRota, setErroRota] = useState("");
  const [feriado, setFeriado] = useState(null);
  const [publicando, setPublicando] = useState(false);
  const [falha, setFalha] = useState("");
  const montado = useRef(true);
  const pedidoCep = useRef(0);
  const pedidoGeo = useRef(0);
  const sugestaoAtual = useRef(null);
  const enviando = useRef(false);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const mudar = (campo) => (valor) => setOferta((atual) => ({ ...atual, [campo]: valor }));
  const tocar = (campo) => () => setTocados((atuais) => ({ ...atuais, [campo]: true }));

  useEffect(() => {
    lerRascunho().then((salvo) => {
      if (!montado.current) return;
      const restaurada = restaurarRascunho(salvo, lugares, dataParaIso(new Date()), uid);
      if (restaurada) {
        sugestaoAtual.current = restaurada.rota ? sugerirRateio(restaurada.rota.distanciaKm, lugares) : null;
        setOferta(restaurada);
        setRestaurado(true);
      } else if (salvo) {
        descartarRascunho();
      }
      setPronto(true);
    });
  }, []);

  useEffect(() => {
    if (!pronto || !uid) return undefined;
    const igualVazia = JSON.stringify(oferta) === vazia.current;
    const timer = setTimeout(() => (igualVazia ? descartarRascunho() : salvarRascunho({ ...oferta, uid })), 500);
    return () => clearTimeout(timer);
  }, [pronto, oferta, uid]);

  async function preencherPorCep(cep) {
    const pedido = ++pedidoCep.current;
    const atual = () => pedido === pedidoCep.current && montado.current;
    setBuscandoCep(true);
    setErroCep("");
    try {
      const endereco = await buscarCep(cep);
      if (atual()) setOferta((anterior) => mesclarEndereco(anterior, endereco));
    } catch (erro) {
      if (atual()) setErroCep(`${erro.message} Digite o endereço abaixo.`);
    } finally {
      if (atual()) setBuscandoCep(false);
    }
  }

  function mudarCep(texto) {
    const cep = mascararCep(texto);
    mudar("cep")(cep);
    setErroCep("");
    if (soDigitos(cep).length === 8) preencherPorCep(cep);
    else {
      pedidoCep.current += 1;
      setBuscandoCep(false);
    }
  }

  const endereco = montarEndereco(oferta);
  const temEndereco = !!(oferta.rua.trim() || oferta.bairro.trim());

  useEffect(() => {
    if (!pronto || !temEndereco || endereco === oferta.geoEndereco) return undefined;
    let ativo = true;
    // O toque no mapa incrementa pedidoGeo: a resposta que chega depois dele não move o ponto marcado à mão.
    const pedido = ++pedidoGeo.current;
    const vigente = () => ativo && pedido === pedidoGeo.current;
    setLocalizando(true);
    const timer = setTimeout(async () => {
      if (!vigente()) return;
      setErroMapa("");
      try {
        const ponto = await geocodificar(`${endereco}, Juiz de Fora, MG`);
        if (vigente()) setOferta((anterior) => ({ ...anterior, lat: ponto.lat, lng: ponto.lng, geoEndereco: endereco }));
      } catch (erro) {
        // Endereço mudou e não foi achado: o ponto antigo não vale mais. Publicar trava até tocar no mapa.
        if (vigente()) {
          setErroMapa(`${erro.message} Toque no mapa para marcar o ponto.`);
          setOferta((anterior) => ({ ...anterior, lat: null, lng: null, rota: null }));
        }
      } finally {
        if (vigente()) setLocalizando(false);
      }
    }, 800);
    return () => {
      ativo = false;
      clearTimeout(timer);
      setLocalizando(false);
    };
  }, [pronto, endereco]);

  const campus = campusPorNome(oferta.campusDestino);
  const marcado = typeof oferta.lat === "number" && typeof oferta.lng === "number";
  const chaveRota = chaveDaRota(oferta.lat, oferta.lng, campus);

  useEffect(() => {
    // O rascunho volta com a rota já calculada; recalcular aqui jogaria fora o valor ajustado.
    if (!pronto || !chaveRota || oferta.rota?.chave === chaveRota) return undefined;
    let ativo = true;
    setOferta((anterior) => ({ ...anterior, rota: null }));
    setErroRota("");
    setCalculando(true);
    calcularRota({ lat: oferta.lat, lng: oferta.lng }, { lat: campus.lat, lng: campus.lng })
      .then((rota) => {
        if (!ativo) return;
        const sugestaoAnterior = sugestaoAtual.current;
        const nova = sugerirRateio(rota.distanciaKm, lugares);
        sugestaoAtual.current = nova;
        // Valor ajustado à mão sobrevive à rota nova; só acompanha a sugestão quem ainda não mexeu.
        setOferta((anterior) => ({
          ...anterior,
          rota: { ...rota, chave: chaveRota },
          valorCentavos:
            anterior.valorCentavos === sugestaoAnterior || anterior.valorCentavos === sugerirRateio(0, lugares)
              ? nova
              : anterior.valorCentavos,
        }));
      })
      .catch((erro) => ativo && setErroRota(erro.message))
      .finally(() => ativo && setCalculando(false));
    return () => {
      ativo = false;
      setCalculando(false);
    };
  }, [pronto, chaveRota]);

  useEffect(() => {
    setFeriado(null);
    const meioDia = montarSaida(oferta.dia, "12:00");
    if (!meioDia) return undefined;
    let ativo = true;
    feriadoNaData(meioDia)
      .then((achado) => ativo && setFeriado(achado ? { ...achado, data: meioDia } : null))
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, [oferta.dia]);

  function recomecar() {
    pedidoCep.current += 1;
    pedidoGeo.current += 1;
    sugestaoAtual.current = null;
    const nova = ofertaVazia(lugares);
    vazia.current = JSON.stringify(nova);
    setOferta(nova);
    setRestaurado(false);
    setTocados({});
    setBuscandoCep(false);
    setLocalizando(false);
    setErroCep("");
    setErroMapa("");
    setErroRota("");
    setFalha("");
  }

  async function descartar() {
    await descartarRascunho().catch(() => {});
    recomecar();
  }

  const erros = errosOferta(oferta, lugares);
  const etapas = [
    !erros.bairro && !erros.ponto && !erros.mapa,
    !erros.campus,
    !erros.saida,
    !erros.vagas && !erros.valor,
  ];
  const tocouEndereco = tocados.cep || tocados.rua || tocados.bairro;
  const ocupado = buscandoCep || localizando || calculando;
  const pendencia = localizando
    ? "Procurando o endereço no mapa."
    : calculando
      ? "Calculando a rota."
      : buscandoCep
        ? "Buscando o CEP."
        : Object.values(erros)[0];
  const sugestao = oferta.rota ? sugerirRateio(oferta.rota.distanciaKm, lugares) : null;

  async function publicar() {
    if (enviando.current) return;
    enviando.current = true;
    setPublicando(true);
    setFalha("");
    try {
      const { chave, ...rota } = oferta.rota || {};
      await oferecerCarona({
        origem: {
          cep: oferta.cep,
          rua: oferta.rua.trim(),
          numero: oferta.numero.trim(),
          bairro: oferta.bairro.trim(),
          ponto: oferta.ponto.trim(),
          lat: oferta.lat,
          lng: oferta.lng,
        },
        campusDestino: campus.nome,
        destino: { lat: campus.lat, lng: campus.lng },
        saidaEm: montarSaida(oferta.dia, oferta.hora),
        vagasTotais: oferta.vagas,
        valorCentavos: oferta.valorCentavos,
        rota: oferta.rota ? rota : null,
      });
      // A carona já foi publicada: falha ao apagar o rascunho não pode virar erro (levaria a publicar duas vezes).
      await descartarRascunho().catch(() => {});
      if (!montado.current) return;
      recomecar();
      Alert.alert("Carona publicada", "Os passageiros já podem pedir vaga.");
      navigation.navigate("Rotas");
    } catch (erro) {
      if (montado.current) setFalha(erro.message || "Não foi possível publicar a carona.");
    } finally {
      enviando.current = false;
      if (montado.current) setPublicando(false);
    }
  }

  const pontos = [
    marcado && { lat: oferta.lat, lng: oferta.lng, titulo: "Ponto de encontro", tipo: "origem" },
    campus && { lat: campus.lat, lng: campus.lng, titulo: campus.nome, tipo: "destino" },
  ].filter(Boolean);
  const dias = proximosDias();

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + ALTURA_CABECALHO}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.pagina}>
        <Titulo texto={`Até ${lugares} ${lugares === 1 ? "lugar" : "lugares"} no seu carro. Preencha as 4 etapas.`}>
          Oferecer carona
        </Titulo>

        <View style={estilos.progresso} accessibilityLabel={`${etapas.filter(Boolean).length} de 4 etapas prontas`}>
          {etapas.map((ok, i) => (
            <View key={i} style={[estilos.etapa, ok && estilos.etapaOk]} />
          ))}
        </View>

        {restaurado ? (
          <View style={estilos.faixa}>
            <Feather name="file-text" size={18} color={theme.colors.primary} />
            <Text style={[estilos.faixaTexto, { color: theme.colors.primary }]}>Rascunho restaurado</Text>
            <MotionPressable onPress={descartar} style={estilos.faixaBotao} accessibilityLabel="Descartar rascunho">
              <Text style={s.linkTexto}>Descartar rascunho</Text>
            </MotionPressable>
          </View>
        ) : null}

        <Secao numero="1" titulo="Ponto de encontro" ok={etapas[0]}>
          <Campo
            label="CEP"
            icon="map-pin"
            value={oferta.cep}
            onChangeText={mudarCep}
            onBlur={tocar("cep")}
            keyboardType="number-pad"
            maxLength={9}
            placeholder="36000-000"
            error={erroCep}
            trailing={buscandoCep ? <ActivityIndicator color={theme.colors.secondary} /> : null}
          />
          <Campo label="Rua" icon="navigation-2" value={oferta.rua} onChangeText={mudar("rua")} onBlur={tocar("rua")} placeholder="Rua Halfeld" />
          <View style={estilos.linha}>
            <Campo label="Número" icon="hash" value={oferta.numero} onChangeText={mudar("numero")} keyboardType="numbers-and-punctuation" containerStyle={estilos.numero} />
            <Campo
              label="Bairro"
              icon="home"
              value={oferta.bairro}
              onChangeText={mudar("bairro")}
              onBlur={tocar("bairro")}
              maxLength={60}
              placeholder="Centro"
              error={tocados.bairro ? erros.bairro : null}
              containerStyle={estilos.flex}
            />
          </View>
          <Campo
            label="Referência do ponto"
            icon="flag"
            value={oferta.ponto}
            onChangeText={mudar("ponto")}
            onBlur={tocar("ponto")}
            maxLength={120}
            placeholder="Em frente à padaria"
            error={tocados.rua || tocados.ponto ? erros.ponto : null}
          />
          <MapaRota
            pontos={pontos}
            linha={oferta.rota?.linha}
            altura={240}
            onToque={({ lat, lng }) => {
              pedidoGeo.current += 1;
              setLocalizando(false);
              setErroMapa("");
              setOferta((anterior) => ({ ...anterior, lat, lng, geoEndereco: montarEndereco(anterior) }));
            }}
          />
          <View style={estilos.dica}>
            {localizando ? <ActivityIndicator color={theme.colors.secondary} /> : <Feather name="crosshair" size={15} color={theme.colors.textSecondary} />}
            <Text style={[s.secundario, estilos.flex]}>
              {localizando ? "Procurando o endereço no mapa." : "Toque no mapa para ajustar o ponto exato."}
            </Text>
          </View>
          {erroMapa ? <Text style={s.error}>{erroMapa}</Text> : null}
          {!erroMapa && !localizando && tocouEndereco && erros.mapa ? <Text style={s.error}>{erros.mapa}</Text> : null}
        </Secao>

        <Secao numero="2" titulo="Destino" ok={etapas[1]}>
          {CAMPI.map((opcao) => {
            const ativo = oferta.campusDestino === opcao.nome;
            return (
              <MotionPressable
                key={opcao.id}
                onPress={() => mudar("campusDestino")(opcao.nome)}
                accessibilityState={{ selected: ativo }}
                style={[estilos.opcao, ativo && estilos.opcaoAtiva]}
              >
                <Feather name={ativo ? "check-circle" : "circle"} size={20} color={ativo ? theme.colors.secondary : theme.colors.textMuted} />
                <View style={estilos.flex}>
                  <Text style={estilos.opcaoTitulo}>{opcao.nome}</Text>
                  <Text style={s.secundario}>{opcao.endereco}</Text>
                </View>
              </MotionPressable>
            );
          })}
          {(tocados.hora || tocados.vagas) && erros.campus ? <Text style={s.error}>{erros.campus}</Text> : null}
        </Secao>

        <Secao numero="3" titulo="Quando" ok={etapas[2]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.chips} keyboardShouldPersistTaps="handled">
            {dias.map((dia) => {
              const ativo = oferta.dia === dia.iso;
              return (
                <MotionPressable
                  key={dia.iso}
                  onPress={() => mudar("dia")(dia.iso)}
                  accessibilityState={{ selected: ativo }}
                  style={[estilos.chip, ativo && estilos.chipAtivo]}
                >
                  <Text style={[estilos.chipTexto, ativo && { color: theme.colors.surface }]}>{dia.rotulo}</Text>
                </MotionPressable>
              );
            })}
          </ScrollView>
          <Campo
            label="Horário de saída"
            icon="clock"
            value={oferta.hora}
            onChangeText={(texto) => mudar("hora")(mascararHora(texto))}
            onBlur={tocar("hora")}
            keyboardType="number-pad"
            maxLength={5}
            placeholder="18:30"
            error={oferta.hora.length === 5 || tocados.hora ? erros.saida : null}
          />
          {feriado ? (
            <View style={[estilos.faixa, { backgroundColor: theme.colors.warningLight }]}>
              <Feather name="alert-triangle" size={18} color={theme.colors.warning} />
              <Text style={[estilos.faixaTexto, { color: theme.colors.warning }]}>
                {`${formatarData(feriado.data)} é feriado (${feriado.nome}). Pode não haver aula.`}
              </Text>
            </View>
          ) : null}
        </Secao>

        <Secao numero="4" titulo="Vagas e valor" ok={etapas[3]}>
          {calculando ? (
            <View style={estilos.dica}>
              <ActivityIndicator color={theme.colors.secondary} />
              <Text style={s.secundario}>Calculando a rota.</Text>
            </View>
          ) : oferta.rota ? (
            <View style={estilos.rota}>
              <View style={estilos.dado}>
                <Feather name="map" size={16} color={theme.colors.secondary} />
                <Text style={estilos.dadoTexto}>{formatarDistancia(oferta.rota.distanciaKm)}</Text>
              </View>
              <View style={estilos.dado}>
                <Feather name="clock" size={16} color={theme.colors.secondary} />
                <Text style={estilos.dadoTexto}>{formatarDuracao(oferta.rota.duracaoMin)}</Text>
              </View>
            </View>
          ) : (
            <Text style={s.secundario}>Marque o ponto e escolha o campus para ver a rota e o valor sugerido.</Text>
          )}
          {erroRota ? <Text style={s.error}>{erroRota}</Text> : null}

          <Text style={s.label}>Valor por passageiro</Text>
          <View style={estilos.valorLinha}>
            <MotionPressable
              onPress={() => mudar("valorCentavos")(ajustarValor(oferta.valorCentavos, -PASSO_VALOR))}
              disabled={oferta.valorCentavos <= 0}
              accessibilityLabel="Diminuir R$ 0,50"
              style={[estilos.passo, oferta.valorCentavos <= 0 && estilos.apagado]}
            >
              <Feather name="minus" size={22} color={theme.colors.primary} />
            </MotionPressable>
            <Text style={estilos.valor}>{formatarMoeda(oferta.valorCentavos)}</Text>
            <MotionPressable
              onPress={() => mudar("valorCentavos")(ajustarValor(oferta.valorCentavos, PASSO_VALOR))}
              accessibilityLabel="Aumentar R$ 0,50"
              style={estilos.passo}
            >
              <Feather name="plus" size={22} color={theme.colors.primary} />
            </MotionPressable>
          </View>
          {sugestao != null ? (
            <View style={estilos.sugestao}>
              <Feather name="zap" size={16} color={theme.colors.secondary} />
              <Text style={estilos.sugestaoTexto}>Sugerido {formatarMoeda(sugestao)}</Text>
              {sugestao !== oferta.valorCentavos ? (
                <MotionPressable onPress={() => mudar("valorCentavos")(sugestao)} style={estilos.faixaBotao}>
                  <Text style={s.linkTexto}>Usar sugestão</Text>
                </MotionPressable>
              ) : null}
            </View>
          ) : null}

          <Text style={s.label}>Vagas oferecidas: {oferta.vagas}</Text>
          <View style={estilos.assentos}>
            {Array.from({ length: lugares }, (_, i) => i + 1).map((n) => (
              <MotionPressable
                key={n}
                onPress={() => {
                  mudar("vagas")(n);
                  tocar("vagas")();
                }}
                accessibilityLabel={`${n} ${n === 1 ? "vaga" : "vagas"}`}
                accessibilityState={{ selected: n <= oferta.vagas }}
                style={[estilos.assento, n <= oferta.vagas && estilos.assentoAceso]}
              >
                <MaterialCommunityIcons name="car-seat" size={26} color={n <= oferta.vagas ? theme.colors.secondary : theme.colors.textMuted} />
              </MotionPressable>
            ))}
          </View>
          {erros.vagas ? <Text style={s.error}>{erros.vagas}</Text> : null}
        </Secao>

        <Mensagem>{falha}</Mensagem>
        {pendencia ? (
          <View style={estilos.dica}>
            {ocupado ? <ActivityIndicator color={theme.colors.secondary} /> : <Feather name="info" size={15} color={theme.colors.textSecondary} />}
            <Text style={[s.secundario, estilos.flex]}>{pendencia}</Text>
          </View>
        ) : null}
        <Acao icone="send" disabled={!!pendencia} carregando={publicando} onPress={publicar}>
          Publicar carona
        </Acao>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl, gap: theme.spacing.md },
  flex: { flex: 1 },
  linha: { flexDirection: "row", gap: theme.spacing.mdSm },
  numero: { width: 112 },
  progresso: { flexDirection: "row", gap: theme.spacing.xs },
  etapa: { flex: 1, height: 6, borderRadius: theme.radii.full, backgroundColor: theme.colors.border },
  etapaOk: { backgroundColor: theme.colors.secondary },
  faixa: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.mdSm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primaryLight,
  },
  faixaTexto: { flex: 1, fontFamily: theme.fonts.semibold, fontSize: 13, lineHeight: 20 },
  faixaBotao: { minHeight: 48, justifyContent: "center", paddingHorizontal: theme.spacing.xs },
  dica: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  opcao: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.mdSm,
    padding: theme.spacing.mdSm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
  },
  opcaoAtiva: { borderColor: theme.colors.secondary, backgroundColor: theme.colors.secondaryLight },
  opcaoTitulo: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  chips: { gap: theme.spacing.sm },
  chip: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipTexto: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  rota: { flexDirection: "row", gap: theme.spacing.md },
  dado: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  dadoTexto: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  valorLinha: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.mdSm },
  passo: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  apagado: { opacity: 0.55 },
  valor: { flex: 1, textAlign: "center", fontFamily: theme.fonts.bold, fontSize: 31, lineHeight: 40, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  sugestao: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, flexWrap: "wrap" },
  sugestaoTexto: { flex: 1, fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.secondary },
  assentos: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  assento: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  assentoAceso: { borderColor: theme.colors.secondary, backgroundColor: theme.colors.secondaryLight },
});
