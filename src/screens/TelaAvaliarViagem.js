import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EstadoTela from "../components/EstadoTela";
import MotionPressable from "../components/MotionPressable";
import { useCaronas, useCarona } from "../context/CaronasContext";
import { useInterface } from "../context/InterfaceContext";
import theme from "../theme";
import { formatarDataHora } from "../utils";
import { Acao, Mensagem, s } from "./acesso/ComponentesAcesso";
import { Avatar } from "./motorista/comum";
import { ATALHOS_COMENTARIO, LIMITE_COMENTARIO, montarComentario, prefixoAtalhos, ROTULOS_NOTA } from "./detalhes/logica";

// O id da reserva é "<caronaId>_<uid do passageiro>".
const caronaDaReserva = (reservaId = "") => reservaId.slice(0, reservaId.lastIndexOf("_"));

function Estrela({ valor, nota, onPress }) {
  const { podeAnimar } = useInterface();
  const escala = useRef(new Animated.Value(1)).current;
  const ativa = valor <= nota;

  function tocar() {
    onPress(valor);
    if (!podeAnimar) return;
    escala.setValue(0.8);
    Animated.spring(escala, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
  }

  return (
    <MotionPressable
      onPress={tocar}
      accessibilityLabel={`${valor} de 5 estrelas`}
      accessibilityState={{ selected: valor === nota }}
      style={estilos.estrelaToque}
    >
      <Animated.View style={{ transform: [{ scale: escala }] }}>
        <Ionicons
          name={ativa ? "star" : "star-outline"}
          size={46}
          color={ativa ? theme.colors.warning : theme.colors.textMuted}
        />
      </Animated.View>
    </MotionPressable>
  );
}

function Conteudo({ navigation, reservaId, aoTentar }) {
  const insets = useSafeAreaInsets();
  const { avaliar } = useCaronas();
  const { carona, reservas, souMotorista, carregando, erro } = useCarona(caronaDaReserva(reservaId));
  const [nota, setNota] = useState(0);
  const [atalhos, setAtalhos] = useState([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState("");
  const [enviado, setEnviado] = useState(false);
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const reserva = useMemo(() => reservas.find((r) => r.id === reservaId) || null, [reservas, reservaId]);

  if (carregando) return <EstadoTela tipo="carregando" titulo="Carregando viagem" />;
  if (erro || !carona)
    return (
      <EstadoTela
        tipo="erro"
        titulo="Não foi possível abrir a viagem"
        mensagem={erro || "Tente de novo em instantes."}
        acao={{ rotulo: "Tentar de novo", onPress: aoTentar }}
      />
    );
  if (!reserva)
    return (
      <EstadoTela
        tipo="vazio"
        titulo="Viagem não encontrada"
        mensagem="Volte para Reservas e escolha uma viagem concluída."
        acao={{ rotulo: "Voltar", onPress: () => navigation.goBack() }}
      />
    );

  const jaAvaliou = souMotorista ? reserva.avaliadaPeloMotorista : reserva.avaliadaPeloPassageiro;
  if (reserva.status !== "concluida")
    return (
      <EstadoTela
        tipo="vazio"
        titulo="Viagem ainda não concluída"
        mensagem="A avaliação libera quando a viagem termina."
        acao={{ rotulo: "Voltar", onPress: () => navigation.goBack() }}
      />
    );
  if (jaAvaliou && !enviado && !enviando)
    return (
      <EstadoTela
        tipo="vazio"
        titulo="Você já avaliou esta viagem"
        mensagem="Cada viagem recebe uma avaliação sua."
        acao={{ rotulo: "Voltar", onPress: () => navigation.goBack() }}
      />
    );

  const outro = souMotorista
    ? { nome: reserva.passageiro?.nome, curso: reserva.passageiro?.curso, fotoBase64: reserva.passageiro?.fotoBase64 }
    : carona.motorista || {};
  const avaliadoId = souMotorista ? reserva.passageiroId : carona.motoristaId;
  const limiteTexto = Math.max(0, LIMITE_COMENTARIO - prefixoAtalhos(atalhos).length);
  const tamanho = montarComentario(texto, atalhos).length;

  function alternar(id) {
    setAtalhos((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]));
    setTexto((atual) => atual.slice(0, Math.max(0, LIMITE_COMENTARIO - prefixoAtalhos([...atalhos, id]).length)));
  }

  async function enviar() {
    if (!nota) {
      setFalha("Toque nas estrelas para dar uma nota.");
      return;
    }
    setEnviando(true);
    setFalha("");
    try {
      await avaliar({ reservaId, avaliadoId, nota, comentario: montarComentario(texto, atalhos) });
      setEnviado(true);
      temporizador.current = setTimeout(() => navigation.goBack(), 1600);
    } catch (e) {
      setFalha(e?.message || "Não foi possível enviar a avaliação.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado)
    return (
      <View style={estilos.obrigado}>
        <View style={estilos.obrigadoIcone}>
          <Feather name="check" size={38} color={theme.colors.success} />
        </View>
        <Text style={estilos.obrigadoTitulo}>Obrigado pela avaliação</Text>
        <Text style={[s.secundario, { textAlign: "center" }]}>Ela ajuda os outros alunos a escolher com quem viajar.</Text>
        <Acao icone="arrow-left" secundario onPress={() => navigation.goBack()} style={{ alignSelf: "stretch" }}>
          Voltar
        </Acao>
      </View>
    );

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[estilos.pagina, { paddingBottom: insets.bottom + theme.spacing.lg }]}
      >
        <Text style={s.titulo}>Como foi a viagem?</Text>

        <View style={estilos.pessoa}>
          <Avatar nome={outro.nome} fotoBase64={outro.fotoBase64} tamanho={56} />
          <View style={estilos.flex}>
            <Text style={estilos.nome}>{outro.nome}</Text>
            <View style={estilos.linha}>
              <Feather name="clock" size={14} color={theme.colors.textSecondary} />
              <Text style={s.secundario}>{formatarDataHora(carona.saidaEm)}</Text>
            </View>
            <View style={estilos.linha}>
              <Feather name="flag" size={14} color={theme.colors.textSecondary} />
              <Text style={s.secundario} numberOfLines={1}>{carona.campusDestino}</Text>
            </View>
          </View>
        </View>

        <View style={estilos.notaBloco}>
          <View style={estilos.estrelas} accessibilityRole="radiogroup">
            {[1, 2, 3, 4, 5].map((valor) => (
              <Estrela key={valor} valor={valor} nota={nota} onPress={setNota} />
            ))}
          </View>
          <Text style={[estilos.rotulo, !nota && { color: theme.colors.textMuted }]} accessibilityLiveRegion="polite">
            {nota ? ROTULOS_NOTA[nota] : "Toque para avaliar"}
          </Text>
        </View>

        <View style={estilos.bloco}>
          <Text style={s.label}>O que você destaca?</Text>
          <View style={estilos.atalhos}>
            {ATALHOS_COMENTARIO.map((a) => {
              const ativo = atalhos.includes(a.id);
              return (
                <MotionPressable
                  key={a.id}
                  onPress={() => alternar(a.id)}
                  accessibilityLabel={a.texto}
                  accessibilityState={{ selected: ativo }}
                  style={[estilos.atalho, ativo && estilos.atalhoAtivo]}
                >
                  <Feather name={ativo ? "check" : a.icone} size={16} color={ativo ? theme.colors.surface : theme.colors.primary} />
                  <Text style={[estilos.atalhoTexto, ativo && { color: theme.colors.surface }]}>{a.texto}</Text>
                </MotionPressable>
              );
            })}
          </View>
        </View>

        <View style={estilos.bloco}>
          <Text style={s.label}>Comentário (opcional)</Text>
          <View style={estilos.campo}>
            <TextInput
              accessibilityLabel="Comentário"
              value={texto}
              onChangeText={setTexto}
              maxLength={limiteTexto}
              multiline
              placeholder="Conte como foi a viagem"
              placeholderTextColor={theme.colors.textMuted}
              style={estilos.input}
              textAlignVertical="top"
            />
          </View>
          <Text style={[estilos.contador, tamanho >= LIMITE_COMENTARIO && { color: theme.colors.warning }]}>
            {tamanho}/{LIMITE_COMENTARIO}
          </Text>
        </View>

        <Mensagem>{falha}</Mensagem>
        <Acao icone="send" carregando={enviando} disabled={!nota} onPress={enviar}>
          Enviar avaliação
        </Acao>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function TelaAvaliarViagem({ navigation, route }) {
  const [tentativa, setTentativa] = useState(0);
  return (
    <Conteudo
      key={tentativa}
      navigation={navigation}
      reservaId={route.params?.reservaId}
      aoTentar={() => setTentativa((n) => n + 1)}
    />
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  pagina: { padding: theme.spacing.md, gap: theme.spacing.md },
  pessoa: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.colors.border },
  nome: { fontFamily: theme.fonts.bold, fontSize: 17, color: theme.colors.primary },
  linha: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, marginTop: 2 },
  notaBloco: { alignItems: "center", gap: theme.spacing.sm, paddingVertical: theme.spacing.sm },
  estrelas: { flexDirection: "row", justifyContent: "center" },
  estrelaToque: { width: 58, height: 58, alignItems: "center", justifyContent: "center" },
  rotulo: { fontFamily: theme.fonts.bold, fontSize: 22, lineHeight: 28, color: theme.colors.primary },
  bloco: { gap: theme.spacing.sm },
  atalhos: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  atalho: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.mdSm, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  atalhoAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  atalhoTexto: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  campo: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, backgroundColor: theme.colors.surface, padding: theme.spacing.mdSm },
  input: { minHeight: 96, fontFamily: theme.fonts.regular, fontSize: 15, lineHeight: 22, color: theme.colors.primary },
  contador: { alignSelf: "flex-end", fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
  obrigado: { flex: 1, alignItems: "center", justifyContent: "center", gap: theme.spacing.mdSm, padding: theme.spacing.md, backgroundColor: theme.colors.background },
  obrigadoIcone: { width: 84, height: 84, borderRadius: theme.radii.full, backgroundColor: theme.colors.successLight, alignItems: "center", justifyContent: "center" },
  obrigadoTitulo: { fontFamily: theme.fonts.bold, fontSize: 22, color: theme.colors.primary },
});
