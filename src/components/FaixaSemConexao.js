import React from "react";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";

const MENSAGEM = "Sem conexão. Mostrando os últimos dados.";

export default function FaixaSemConexao({ visivel }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  if (!visivel) return null;

  return (
    <Faixa
      style={{
        paddingTop: insets.top + theme.spacing.xs,
        paddingLeft: insets.left + theme.spacing.md,
        paddingRight: insets.right + theme.spacing.md,
      }}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={MENSAGEM}
    >
      <Feather name="wifi-off" size={16} color={theme.colors.warning} accessible={false} />
      <Texto>{MENSAGEM}</Texto>
    </Faixa>
  );
}

const Faixa = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.warningLight};
`;

const Texto = styled.Text`
  flex-shrink: 1;
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  line-height: ${({ theme }) => theme.typography.caption.lineHeight}px;
  color: ${({ theme }) => theme.colors.warning};
`;
