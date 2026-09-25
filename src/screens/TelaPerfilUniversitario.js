import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md}px;
`;

const ProfileCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const Avatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: ${(props) => props.theme.radii.full}px;
  border-width: 3px;
  border-color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const Name = styled.Text`
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const Course = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const Matricula = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.textMuted};
  margin-top: 2px;
`;

const MetricsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const MetricBox = styled.View`
  width: 48%;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  align-items: center;
`;

const MetricValue = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const MetricLabel = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const CardSection = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const SectionHeader = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const DetailText = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.text};
  margin-left: 8px;
`;

const PreferenceTag = styled.View`
  background-color: ${(props) => props.theme.colors.primaryLight};
  padding: 6px 12px;
  border-radius: ${(props) => props.theme.radii.full}px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const PreferenceText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

const TagsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export default function TelaPerfilUniversitario() {
  const theme = useTheme();
  const { usuarioLogado } = useCaronas();

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <ProfileCard>
          <Avatar source={{ uri: usuarioLogado.foto }} />
          <Name>{usuarioLogado.nome}</Name>
          <Course>{usuarioLogado.curso} • {usuarioLogado.periodo}</Course>
          <Matricula>Matrícula: {usuarioLogado.matricula}</Matricula>
        </ProfileCard>

        <MetricsRow>
          <MetricBox>
            <MetricValue>{usuarioLogado.totalCaronasDadas}</MetricValue>
            <MetricLabel>Caronas Oferecidas</MetricLabel>
          </MetricBox>
          <MetricBox>
            <MetricValue>{usuarioLogado.totalCaronasPagas}</MetricValue>
            <MetricLabel>Viagens como Passageiro</MetricLabel>
          </MetricBox>
        </MetricsRow>

        <MetricsRow>
          <MetricBox>
            <MetricValue>{usuarioLogado.economiaEstimada}</MetricValue>
            <MetricLabel>Economia Total</MetricLabel>
          </MetricBox>
          <MetricBox>
            <MetricValue>{usuarioLogado.co2Evitado}</MetricValue>
            <MetricLabel>CO₂ Evitado</MetricLabel>
          </MetricBox>
        </MetricsRow>

        <CardSection>
          <SectionHeader>Veículo e Chave PIX</SectionHeader>
          <DetailRow>
            <Feather name="truck" size={16} color={theme.colors.primary} />
            <DetailText>{usuarioLogado.veiculo.modelo} ({usuarioLogado.veiculo.placa})</DetailText>
          </DetailRow>
          <DetailRow>
            <Feather name="credit-card" size={16} color={theme.colors.primary} />
            <DetailText>PIX: {usuarioLogado.chavePix}</DetailText>
          </DetailRow>
        </CardSection>

        <CardSection style={{ marginBottom: 32 }}>
          <SectionHeader>Preferências na Viagem</SectionHeader>
          <TagsWrap>
            <PreferenceTag>
              <PreferenceText>🎵 {usuarioLogado.preferencias.musica}</PreferenceText>
            </PreferenceTag>
            <PreferenceTag>
              <PreferenceText>❄️ {usuarioLogado.preferencias.arCondicionado}</PreferenceText>
            </PreferenceTag>
            <PreferenceTag>
              <PreferenceText>💬 {usuarioLogado.preferencias.conversa}</PreferenceText>
            </PreferenceTag>
          </TagsWrap>
        </CardSection>
      </Content>
    </Container>
  );
}
