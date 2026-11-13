import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MotionPressable from "../components/MotionPressable";
import { useAuth } from "../context/AuthContext";
import theme from "../theme";
import { formatarNota } from "../utils";
import { s } from "./acesso/ComponentesAcesso";
import { Avatar, Secao, useEntrada } from "./motorista/comum";
import { barrasDeNotas, calcularSelos, contarViagens } from "./detalhes/logica";

const DIRETRIZES = [
  {
    id: "ponto-encontro",
    titulo: "Pontos de encontro iluminados",
    icone: "map-pin",
    texto: "Combine saídas em locais movimentados, como portarias da UniAcademia, praças centrais ou áreas com boa iluminação.",
  },
  {
    id: "confirmacao-matricula",
    titulo: "Confirmação de matrícula",
    icone: "user-check",
    texto: "Antes de embarcar, confira nome, curso e status de aluno verificado no perfil do colega.",
  },
  {
    id: "suporte-campus",
    titulo: "Canais de suporte do campus",
    icone: "headphones",
    texto: "Em caso de atraso, mudança de rota ou desconforto, use o chat da carona e acione a recepção do campus mais próximo.",
  },
];

function Estrelas({ media }) {
  return (
    <View style={estilos.estrelas} accessibilityLabel={`Média ${formatarNota(media)} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={media >= n - 0.25 ? "star" : media >= n - 0.75 ? "star-half" : "star-outline"}
          size={20}
          color={theme.colors.warning}
        />
      ))}
    </View>
  );
}

function Barras({ barras }) {
  return (
    <View style={estilos.barras}>
      {barras.map((b) => (
        <View key={b.estrelas} style={estilos.barraLinha} accessibilityLabel={`${b.estrelas} estrelas: ${b.total}`}>
          <Text style={estilos.barraRotulo}>{b.estrelas}</Text>
          <Ionicons name="star" size={13} color={theme.colors.warning} />
          <View style={estilos.barraFundo}>
            <View style={[estilos.barraCheia, { width: `${b.percentual}%` }]} />
          </View>
          <Text style={estilos.barraTotal}>{b.total}</Text>
        </View>
      ))}
    </View>
  );
}

function Selo({ selo }) {
  const on = selo.conquistado;
  return (
    <View
      style={[estilos.selo, !on && estilos.seloApagado]}
      accessibilityLabel={`${selo.titulo}, ${on ? "conquistado" : `não conquistado. ${selo.falta}`}`}
    >
      <View style={[estilos.medalha, on && { backgroundColor: theme.colors.secondaryLight }]}>
        <Feather name={selo.icone} size={24} color={on ? theme.colors.secondary : theme.colors.textMuted} />
      </View>
      <View style={estilos.flex}>
        <Text style={[estilos.seloTitulo, !on && { color: theme.colors.textSecondary }]}>{selo.titulo}</Text>
        <Text style={s.secundario}>{on ? "Conquistado" : selo.falta}</Text>
      </View>
      {on ? <Feather name="check-circle" size={20} color={theme.colors.success} /> : null}
    </View>
  );
}

export default function TelaAvaliacoesSeguranca({ route }) {
  const insets = useSafeAreaInsets();
  const entrada = useEntrada();
  const { perfil, modo, emailVerificado } = useAuth();
  const [aberta, setAberta] = useState(DIRETRIZES[0].id);
  const params = route?.params || {};

  const deOutro = !!params.uid && params.uid !== perfil?.uid;
  const comoMotorista = deOutro || modo === "motorista";
  const nota = deOutro
    ? { media: Number(params.nota) || 0, total: null }
    : (comoMotorista ? perfil?.notaMotorista : perfil?.notaPassageiro) || { media: 0, total: 0 };
  const nome = deOutro ? params.nome : perfil?.nome;
  const curso = deOutro ? params.curso : perfil?.curso;
  const fotoBase64 = deOutro ? params.fotoBase64 : perfil?.fotoBase64;
  const barras = deOutro ? null : barrasDeNotas(perfil?.distribuicaoNotas);
  const selos = !deOutro && perfil
    ? calcularSelos({ emailVerificado, nota: perfil.notaMotorista, viagens: contarViagens(perfil) })
    : [];
  const temNota = nota.media > 0;

  return (
    <ScrollView
      style={s.flex}
      contentContainerStyle={[estilos.pagina, { paddingBottom: insets.bottom + theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.titulo}>{perfil || deOutro ? "Avaliações e segurança" : "Segurança"}</Text>

      {perfil || deOutro ? (
        <Animated.View entering={entrada(0)} style={estilos.resumo}>
          {nome ? (
            <View style={estilos.pessoa}>
              <Avatar nome={nome} fotoBase64={fotoBase64} tamanho={44} />
              <View style={estilos.flex}>
                <Text style={estilos.nome}>{nome}</Text>
                {curso ? <Text style={s.secundario}>{curso}</Text> : null}
              </View>
            </View>
          ) : null}
          <Text style={estilos.contexto}>{comoMotorista ? "Como motorista" : "Como passageiro"}</Text>
          {temNota ? (
            <View style={estilos.media}>
              <Text style={estilos.mediaNumero}>{formatarNota(nota.media)}</Text>
              <View style={estilos.flex}>
                <Estrelas media={nota.media} />
                {nota.total != null ? (
                  <Text style={s.secundario}>
                    {nota.total} {nota.total === 1 ? "avaliação" : "avaliações"}
                  </Text>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={estilos.semNota}>
              <Feather name="star" size={22} color={theme.colors.textMuted} />
              <Text style={s.secundario}>Ainda sem avaliações. A primeira chega depois de uma viagem concluída.</Text>
            </View>
          )}
          {barras ? <Barras barras={barras} /> : temNota && !deOutro ? (
            <Text style={s.secundario}>Distribuição por estrelas indisponível agora.</Text>
          ) : null}
        </Animated.View>
      ) : null}

      {selos.length ? (
        <Animated.View entering={entrada(1)}>
          <Secao icone="award" titulo="Selos">
            {selos.map((selo) => (
              <Selo key={selo.id} selo={selo} />
            ))}
          </Secao>
        </Animated.View>
      ) : null}

      <Animated.View entering={entrada(2)}>
        <Secao icone="shield" titulo="Regras de segurança">
          {DIRETRIZES.map((d) => {
            const aberto = aberta === d.id;
            return (
              <View key={d.id} style={estilos.diretriz}>
                <MotionPressable
                  onPress={() => setAberta(aberto ? null : d.id)}
                  accessibilityLabel={d.titulo}
                  accessibilityState={{ expanded: aberto }}
                  style={estilos.diretrizTopo}
                >
                  <Feather name={d.icone} size={19} color={theme.colors.primary} />
                  <Text style={[estilos.flex, estilos.diretrizTitulo]}>{d.titulo}</Text>
                  <Feather name={aberto ? "chevron-up" : "chevron-down"} size={20} color={theme.colors.textSecondary} />
                </MotionPressable>
                {aberto ? <Text style={estilos.diretrizTexto}>{d.texto}</Text> : null}
              </View>
            );
          })}
        </Secao>
      </Animated.View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  pagina: { padding: theme.spacing.md, gap: theme.spacing.md },
  resumo: { gap: theme.spacing.mdSm },
  pessoa: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm },
  nome: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
  contexto: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
  media: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm },
  mediaNumero: { fontFamily: theme.fonts.bold, fontSize: 56, lineHeight: 62, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  estrelas: { flexDirection: "row", gap: 2 },
  semNota: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm, minHeight: 48 },
  barras: { gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  barraLinha: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  barraRotulo: { width: 12, fontFamily: theme.fonts.semibold, fontSize: 13, color: theme.colors.primary },
  barraFundo: { flex: 1, height: 8, borderRadius: theme.radii.full, backgroundColor: theme.colors.borderLight, overflow: "hidden" },
  barraCheia: { height: 8, borderRadius: theme.radii.full, backgroundColor: theme.colors.warning },
  barraTotal: { width: 28, textAlign: "right", fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
  selo: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm, minHeight: 60 },
  seloApagado: { opacity: 0.6 },
  medalha: { width: 52, height: 52, borderRadius: theme.radii.full, backgroundColor: theme.colors.borderLight, alignItems: "center", justifyContent: "center" },
  seloTitulo: { fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.primary },
  diretriz: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  diretrizTopo: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm },
  diretrizTitulo: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  diretrizTexto: { fontFamily: theme.fonts.regular, fontSize: 14, lineHeight: 22, color: theme.colors.textSecondary, paddingBottom: theme.spacing.mdSm, paddingLeft: 31 },
});
