import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import styled, { useTheme } from "styled-components/native";

import { useInterface } from "../context/InterfaceContext";
import MotionPressable from "./MotionPressable";

function EsqueletoLista() {
  const { podeAnimar } = useInterface();
  const opacidade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!podeAnimar) {
      opacidade.setValue(1);
      return;
    }

    const pulsacao = Animated.loop(
      Animated.sequence(
        [0.45, 1].map((toValue) =>
          Animated.timing(opacidade, {
            toValue,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== "web",
            isInteraction: false,
          }),
        ),
      ),
    );
    pulsacao.start();

    return () => {
      pulsacao.stop();
      opacidade.setValue(1);
    };
  }, [opacidade, podeAnimar]);

  return (
    <Esqueleto
      style={{ opacity: opacidade }}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      {[0, 1, 2].map((linha) => (
        <LinhaEsqueleto key={linha}>
          <AvatarEsqueleto />
          <DetalhesEsqueleto>
            <TopoEsqueleto>
              <BlocoEsqueleto $largura="42%" />
              <BlocoEsqueleto $largura="24%" />
            </TopoEsqueleto>
            <BlocoEsqueleto $largura={linha === 1 ? "72%" : "88%"} $menor />
            <BlocoEsqueleto $largura="55%" $menor />
          </DetalhesEsqueleto>
        </LinhaEsqueleto>
      ))}
    </Esqueleto>
  );
}

export default function EstadoTela({ tipo = "vazio", titulo, mensagem, acao, icone }) {
  const theme = useTheme();
  const [executando, setExecutando] = useState(false);
  const [erroAcao, setErroAcao] = useState(null);
  const acaoEmAndamento = useRef(false);
  const carregando = tipo === "carregando";
  const erro = tipo === "erro";
  const tituloExibido = titulo ?? (carregando ? "Carregando" : erro ? "Não foi possível carregar" : "Nada por aqui ainda");
  const temAcao = typeof acao?.onPress === "function";
  const rotuloAcao = acao?.rotulo || (erro ? "Tentar de novo" : "Continuar");

  async function executarAcao() {
    if (acaoEmAndamento.current) return;
    acaoEmAndamento.current = true;
    setExecutando(true);
    setErroAcao(null);
    try {
      await acao.onPress();
    } catch (error) {
      setErroAcao(error?.message || "Não foi possível concluir. Tente de novo.");
    } finally {
      acaoEmAndamento.current = false;
      setExecutando(false);
    }
  }

  return (
    <Container
      accessibilityLiveRegion="polite"
      accessible={carregando}
      accessibilityRole={carregando ? "progressbar" : undefined}
      accessibilityLabel={carregando ? [tituloExibido, mensagem].filter(Boolean).join(". ") : undefined}
      accessibilityState={{ busy: carregando }}
      aria-busy={carregando}
    >
      {carregando ? (
        <EsqueletoLista />
      ) : (
        <CirculoIcone accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Feather
            name={icone || (erro ? "alert-circle" : "inbox")}
            size={32}
            color={erro ? theme.colors.danger : theme.colors.primary}
          />
        </CirculoIcone>
      )}
      <Textos>
        {!!tituloExibido && <Titulo accessibilityRole="header">{tituloExibido}</Titulo>}
        {!!mensagem && <Mensagem>{mensagem}</Mensagem>}
      </Textos>
      {temAcao && (
        <Botao
          onPress={executarAcao}
          disabled={executando}
          accessibilityLabel={rotuloAcao}
          accessibilityState={{ disabled: executando, busy: executando }}
          aria-busy={executando}
          $erro={erro}
        >
          {executando ? <ActivityIndicator size="small" color={theme.colors.surface} /> : (
            <Feather name={erro ? "refresh-cw" : "arrow-right"} size={18} color={theme.colors.surface} />
          )}
          <TextoBotao>{rotuloAcao}</TextoBotao>
        </Botao>
      )}
      {!!erroAcao && <Mensagem accessibilityRole="alert">{erroAcao}</Mensagem>}
    </Container>
  );
}

const Container = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
}))`
  flex: 1;
  width: 100%;
`;

const CirculoIcone = styled.View`
  width: ${({ theme }) => theme.spacing.xl * 2}px;
  height: ${({ theme }) => theme.spacing.xl * 2}px;
  border-radius: ${({ theme }) => theme.radii.full}px;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  align-items: center;
  justify-content: center;
`;

const Textos = styled.View`
  width: 100%;
  max-width: 320px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Titulo = styled.Text`
  font-family: ${({ theme }) => theme.fonts.semibold};
  font-size: ${({ theme }) => theme.typography.sectionHeader.fontSize}px;
  line-height: ${({ theme }) => theme.typography.sectionHeader.lineHeight}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Mensagem = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const Botao = styled(MotionPressable)`
  min-height: ${({ theme }) => theme.touchTarget.minHeight}px;
  max-width: 320px;
  padding: ${({ theme }) => theme.spacing.mdSm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  background-color: ${({ theme, $erro }) => $erro ? theme.colors.danger : theme.colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const TextoBotao = styled.Text`
  flex-shrink: 1;
  font-family: ${({ theme }) => theme.fonts.semibold};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  line-height: ${({ theme }) => theme.typography.body.lineHeight}px;
  color: ${({ theme }) => theme.colors.surface};
  text-align: center;
`;

const Esqueleto = styled(Animated.View)`
  width: 100%;
  max-width: 400px;
`;

const LinhaEsqueleto = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px 0;
  gap: ${({ theme }) => theme.spacing.mdSm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.borderLight};
`;

const AvatarEsqueleto = styled.View`
  width: ${({ theme }) => theme.spacing.xl}px;
  height: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.radii.full}px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const DetalhesEsqueleto = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const TopoEsqueleto = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const BlocoEsqueleto = styled.View`
  width: ${({ $largura }) => $largura};
  height: ${({ theme, $menor }) => $menor ? theme.spacing.sm : theme.spacing.mdSm}px;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  background-color: ${({ theme }) => theme.colors.border};
`;
