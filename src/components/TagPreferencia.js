import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

const TagButton = styled.TouchableOpacity`
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${(props) => (props.ativa ? props.theme.colors.primary : props.theme.colors.border)};
  background-color: ${(props) => (props.ativa ? props.theme.colors.primaryLight : props.theme.colors.surface)};
  border-radius: ${(props) => props.theme.radii.full}px;
  padding: 0 ${(props) => props.theme.spacing.md}px;
  margin-right: ${(props) => props.theme.spacing.sm}px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const TagText = styled.Text`
  color: ${(props) => (props.ativa ? props.theme.colors.primary : props.theme.colors.textSecondary)};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  margin-left: ${(props) => props.theme.spacing.sm}px;
`;

export default function TagPreferencia({ texto, icone, ativa, onPress }) {
  const theme = useTheme();
  const corIcone = ativa ? theme.colors.primary : theme.colors.textSecondary;

  return (
    <TagButton
      ativa={ativa}
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityState={{ selected: ativa }}
      accessibilityLabel={texto}
    >
      <Feather name={icone} size={16} color={corIcone} />
      <TagText ativa={ativa}>{texto}</TagText>
    </TagButton>
  );
}
