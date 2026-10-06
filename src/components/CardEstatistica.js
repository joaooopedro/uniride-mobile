import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

const Card = styled.View`
  width: 50%;
  padding: 4px;
`;

const CardInner = styled.View`
  min-height: 136px;
  background-color: ${(props) => props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors[props.fundo]};
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.mdSm}px;
`;

const Value = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 22px;
  font-weight: 700;
  line-height: 28px;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  margin-top: ${(props) => props.theme.spacing.xs}px;
`;

const Description = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  line-height: ${(props) => props.theme.typography.micro.lineHeight}px;
  margin-top: 2px;
`;

export default function CardEstatistica({ titulo, valor, descricao, icone, cor = 'primary', fundo = 'primaryLight' }) {
  const theme = useTheme();

  return (
    <Card>
      <CardInner>
        <IconContainer fundo={fundo}>
          <Feather name={icone} size={20} color={theme.colors[cor]} />
        </IconContainer>
        <Value>{valor}</Value>
        <Title>{titulo}</Title>
        <Description>{descricao}</Description>
      </CardInner>
    </Card>
  );
}
