import React from "react";
import styled, { useTheme } from "styled-components/native";
import MotionPressable from "./MotionPressable";
import { Ionicons } from "@expo/vector-icons";

const Botao = styled(MotionPressable)`
  flex-direction: row;
  align-items: center;
  min-height: 48px;
  padding: 0px 14px;
  margin-right: 8px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.primaryLight};
`;

const TextoBotao = styled.Text`
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  color: ${(props) => props.theme.colors.text};

  font-family: ${(props) => props.theme.fonts.semibold};
`;

export default function BotaoStatusRapido({ texto, icone, onPress }) {
  const theme = useTheme();

  return (
    <Botao
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Enviar aviso: ${texto}`}
    >
      <Ionicons name={icone} size={16} color={theme.colors.primary} />
      <TextoBotao>{texto}</TextoBotao>
    </Botao>
  );
}
