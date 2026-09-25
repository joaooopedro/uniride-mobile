import React from 'react';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg}px;
`;

const IconCircle = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: ${(props) => props.theme.colors.primaryLight};
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const Title = styled.Text`
  font-size: ${(props) => props.theme.typography.display.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
`;

const Description = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

export default function TelaOferecerCarona() {
  return (
    <Container>
      <IconCircle>
        <Feather name="plus-circle" size={28} color="#2563EB" />
      </IconCircle>
      <Title>Oferecer Carona</Title>
      <Description>Formulário de publicação e oferta de carona solidária.</Description>
    </Container>
  );
}
