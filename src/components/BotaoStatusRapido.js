import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const Botao = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  padding: 0 ${(props) => props.theme.spacing.md}px;
  margin-right: ${(props) => props.theme.spacing.sm}px;
  border-radius: ${(props) => props.theme.radii.full}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.surface};
`;

const TextoBotao = styled.Text`
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  color: ${(props) => props.theme.colors.text};
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
