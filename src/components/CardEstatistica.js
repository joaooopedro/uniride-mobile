import React from "react";
import styled, { useTheme } from "styled-components/native";
import { Feather } from "@expo/vector-icons";

const Card = styled.View`
  width: 50%;
  padding: 4px;
`;

const CardInner = styled.View`
  min-height: 142px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.border};
  padding: 16px 8px 12px 0px;
`;

const IconContainer = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const Value = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 33px;
  letter-spacing: -0.5px;
  font-family: ${(props) => props.theme.fonts.bold};
`;

const Title = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  margin-top: ${(props) => props.theme.spacing.xs}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const Description = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  line-height: ${(props) => props.theme.typography.micro.lineHeight}px;
  margin-top: 2px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

export default function CardEstatistica({
  titulo,
  valor,
  descricao,
  icone,
  cor = "primary",
  fundo = "primaryLight",
}) {
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
