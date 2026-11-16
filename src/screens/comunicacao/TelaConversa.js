import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BalaoMensagem from "../../components/BalaoMensagem";
import BotaoStatusRapido from "../../components/BotaoStatusRapido";
import EstadoTela from "../../components/EstadoTela";
import MotionPressable from "../../components/MotionPressable";
import { useAuth } from "../../context/AuthContext";
import { useAvisos, useMensagens } from "../../context/AvisosContext";
import { useCarona } from "../../context/CaronasContext";
import { useInterface } from "../../context/InterfaceContext";
import theme from "../../theme";
import { formatarDataHora } from "../../utils";
import { s } from "../acesso/ComponentesAcesso";
import { LIMITE_MENSAGEM, itensDoChat, podeEnviar, rotuloAutor } from "./logica";

function Cabecalho({ carona, onDetalhes }) {
  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.flex}>
        <View style={estilos.trajeto}>
          <Text style={estilos.trajetoTexto} numberOfLines={1}>{carona.origem?.bairro}</Text>
          <Feather name="arrow-right" size={14} color={theme.colors.textMuted} />
          <Text style={estilos.trajetoTexto} numberOfLines={1}>{carona.campusDestino}</Text>
        </View>
        <View style={estilos.trajeto}>
          <Feather name="clock" size={13} color={theme.colors.textSecondary} />
          <Text style={s.secundario}>{formatarDataHora(carona.saidaEm)}</Text>
        </View>
      </View>
      <MotionPressable onPress={onDetalhes} style={estilos.detalhes} accessibilityLabel="Ver detalhes da carona">
        <Feather name="info" size={18} color={theme.colors.primary} />
        <Text style={estilos.detalhesTexto}>Detalhes</Text>
      </MotionPressable>
    </View>
  );
}

export default function TelaConversa({ navigation, route }) {
  const { caronaId } = route.params || {};
  const { usuario, perfil } = useAuth();
  const uid = usuario?.uid;
  const { enviarMensagem, marcarComoLido, AVISOS_RAPIDOS } = useAvisos();
  const { mensagens, carregando, erro } = useMensagens(caronaId);
  const { carona } = useCarona(caronaId);
  const { podeAnimar } = useInterface();
  const alturaCabecalho = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const lista = useRef(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pendentes, setPendentes] = useState([]);
  const [erroEnvio, setErroEnvio] = useState(null);

  // Zera as não lidas ao abrir, a cada mensagem que chega com a tela aberta e ao sair.
  useEffect(() => {
    if (!caronaId) return undefined;
    marcarComoLido(caronaId);
    return () => {
      marcarComoLido(caronaId);
    };
  }, [caronaId, mensagens.length, marcarComoLido]);

  const itens = useMemo(() => {
    const ids = new Set(mensagens.map((m) => m.id));
    return itensDoChat([...mensagens, ...pendentes.filter((p) => !ids.has(p.id))]);
  }, [mensagens, pendentes]);

  const iconeDoAviso = (mensagem) =>
    mensagem.tipo === "aviso_rapido" ? AVISOS_RAPIDOS.find((a) => a.texto === mensagem.texto)?.icone || "bell" : undefined;

  async function enviar(conteudo, tipo) {
    const limpo = conteudo.trim();
    if (!limpo || enviando) return;
    const local = { id: `local-${Date.now()}`, autorId: uid, autorNome: perfil?.nome, texto: limpo, tipo, criadoEm: new Date(), pendente: true };
    setEnviando(true);
    setErroEnvio(null);
    setPendentes((atuais) => [...atuais, local]);
    if (tipo === "texto") setTexto("");
    try {
      await enviarMensagem(caronaId, limpo, tipo);
    } catch (falha) {
      setErroEnvio(falha.message || "Não foi possível enviar. Tente de novo.");
      if (tipo === "texto") setTexto(limpo);
    } finally {
      setPendentes((atuais) => atuais.filter((p) => p.id !== local.id));
      setEnviando(false);
    }
  }

  const rolarParaFim = () => lista.current?.scrollToEnd({ animated: podeAnimar });

  if (carregando) return <EstadoTela tipo="carregando" titulo="Carregando a conversa" />;
  if (erro)
    return (
      <EstadoTela
        tipo="erro"
        mensagem={erro}
        acao={{ rotulo: "Tentar de novo", onPress: () => navigation.replace("Conversa", { caronaId }) }}
      />
    );

  const habilitado = podeEnviar(texto, enviando);

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={alturaCabecalho}
    >
      {carona ? <Cabecalho carona={carona} onDetalhes={() => navigation.navigate("DetalhesCarona", { caronaId })} /> : null}

      <FlatList
        ref={lista}
        style={estilos.flex}
        data={itens}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.mensagens}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={rolarParaFim}
        onLayout={rolarParaFim}
        ListEmptyComponent={
          <View style={estilos.vazio}>
            <Feather name="message-circle" size={28} color={theme.colors.textMuted} />
            <Text style={[s.secundario, estilos.centro]}>Nenhuma mensagem ainda. Mande um aviso rápido ou escreva abaixo.</Text>
          </View>
        }
        renderItem={({ item }) =>
          item.tipo === "dia" ? (
            <View style={estilos.dia} accessibilityRole="header">
              <Text style={estilos.diaTexto}>{item.rotulo}</Text>
            </View>
          ) : (
            <BalaoMensagem
              mensagem={item.mensagem}
              enviada={item.mensagem.autorId === uid}
              rotuloAutor={rotuloAutor(item.mensagem, uid, carona?.motoristaId)}
              iconeAviso={iconeDoAviso(item.mensagem)}
              pendente={item.mensagem.pendente}
            />
          )
        }
      />

      <View style={[estilos.rodape, { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.atalhos}>
          {AVISOS_RAPIDOS.map((aviso) => (
            <BotaoStatusRapido
              key={aviso.id}
              texto={aviso.texto}
              icone={aviso.icone}
              disabled={enviando}
              onPress={() => enviar(aviso.texto, "aviso_rapido")}
            />
          ))}
        </ScrollView>
        {erroEnvio ? <Text style={[s.error, estilos.erroEnvio]} accessibilityRole="alert">{erroEnvio}</Text> : null}
        <View style={estilos.envio}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva uma mensagem"
            placeholderTextColor={theme.colors.textMuted}
            multiline
            maxLength={LIMITE_MENSAGEM}
            accessibilityLabel="Mensagem"
            style={estilos.campo}
          />
          <MotionPressable
            onPress={() => enviar(texto, "texto")}
            disabled={!habilitado}
            accessibilityLabel="Enviar mensagem"
            accessibilityState={{ disabled: !habilitado, busy: enviando }}
            style={[estilos.enviar, !habilitado && estilos.enviarDesligado]}
          >
            {enviando ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Feather name="send" size={20} color={habilitado ? theme.colors.surface : theme.colors.textMuted} />
            )}
          </MotionPressable>
        </View>
        {texto.length > LIMITE_MENSAGEM - 50 ? (
          <Text style={estilos.contador}>{texto.length} de {LIMITE_MENSAGEM}</Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  centro: { textAlign: "center" },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.mdSm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  trajeto: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  trajetoTexto: { flexShrink: 1, fontFamily: theme.fonts.bold, fontSize: theme.typography.cardTitle.fontSize, color: theme.colors.primary },
  detalhes: {
    minHeight: theme.touchTarget.minHeight,
    minWidth: theme.touchTarget.minWidth,
    paddingHorizontal: theme.spacing.mdSm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  detalhesTexto: { fontFamily: theme.fonts.semibold, fontSize: theme.typography.caption.fontSize, color: theme.colors.primary },
  mensagens: { padding: theme.spacing.md, flexGrow: 1 },
  vazio: { flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
  dia: { alignItems: "center", marginVertical: theme.spacing.sm },
  diaTexto: {
    paddingHorizontal: theme.spacing.mdSm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.full,
    overflow: "hidden",
    backgroundColor: theme.colors.borderLight,
    fontFamily: theme.fonts.semibold,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  rodape: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  atalhos: { paddingHorizontal: theme.spacing.md },
  erroEnvio: { paddingHorizontal: theme.spacing.md },
  envio: { flexDirection: "row", alignItems: "flex-end", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
  campo: {
    flex: 1,
    minHeight: theme.touchTarget.minHeight,
    maxHeight: 120,
    paddingHorizontal: theme.spacing.mdSm,
    paddingTop: theme.spacing.mdSm,
    paddingBottom: theme.spacing.mdSm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.primary,
  },
  enviar: {
    width: theme.touchTarget.minWidth,
    height: theme.touchTarget.minHeight,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  enviarDesligado: { backgroundColor: theme.colors.borderLight },
  contador: {
    alignSelf: "flex-end",
    paddingHorizontal: theme.spacing.md,
    fontFamily: theme.fonts.medium,
    fontSize: theme.typography.micro.fontSize,
    color: theme.colors.textMuted,
  },
});
