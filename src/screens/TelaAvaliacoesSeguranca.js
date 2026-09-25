import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md}px;
`;

const Title = styled.Text`
  font-size: ${(props) => props.theme.typography.display.fontSize}px;
  font-weight: ${(props) => props.theme.typography.display.fontWeight};
  color: ${(props) => props.theme.colors.text};
`;

const Subtitle = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: ${(props) => props.theme.spacing.xs}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const ScoreCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const ScoreNumber = styled.Text`
  font-size: 36px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const StarsRow = styled.View`
  flex-direction: row;
  margin-top: 4px;
`;

const ScoreSub = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 6px;
`;

const SectionTitle = styled.Text`
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: ${(props) => props.theme.typography.sectionHeader.fontWeight};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const BadgesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const BadgeBox = styled.View`
  width: 48%;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const BadgeTitle = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  margin-top: 8px;
`;

const BadgeDesc = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;
  margin-top: 2px;
`;

const ReviewCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const ReviewHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ReviewerName = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const ReviewComment = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 6px;
`;

const GuideCard = styled.View`
  background-color: ${(props) => props.theme.colors.primaryLight};
  border-radius: ${(props) => props.theme.radii.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
  margin-bottom: ${(props) => props.theme.spacing.xl}px;
`;

const GuideTitle = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 6px;
`;

const GuideText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.text};
  line-height: 18px;
`;

export default function TelaAvaliacoesSeguranca() {
  const theme = useTheme();

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <Title>Segurança Comunitária</Title>
        <Subtitle>Reputação e selos de confiança no ecossistema UniRide</Subtitle>

        <ScoreCard>
          <ScoreNumber>4.9</ScoreNumber>
          <StarsRow>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name="star" size={20} color={theme.colors.warning} style={{ marginHorizontal: 2 }} />
            ))}
          </StarsRow>
          <ScoreSub>Média geral baseada em 42 avaliações da UniAcademia</ScoreSub>
        </ScoreCard>

        <SectionTitle>Selos e Conquistas</SectionTitle>
        <BadgesGrid>
          <BadgeBox>
            <Feather name="shield" size={28} color={theme.colors.primary} />
            <BadgeTitle>Aluno Verificado</BadgeTitle>
            <BadgeDesc>Matrícula e e-mail institucional validados</BadgeDesc>
          </BadgeBox>
          <BadgeBox>
            <Feather name="clock" size={28} color={theme.colors.success} />
            <BadgeTitle>Motorista Pontual</BadgeTitle>
            <BadgeDesc>98% de partidas rigorosamente no horário</BadgeDesc>
          </BadgeBox>
          <BadgeBox>
            <Feather name="award" size={28} color={theme.colors.warning} />
            <BadgeTitle>Embaixador UniRide</BadgeTitle>
            <BadgeDesc>Mais de 30 caronas com nota máxima</BadgeDesc>
          </BadgeBox>
          <BadgeBox>
            <Feather name="feather" size={28} color={theme.colors.secondary} />
            <BadgeTitle>Eco Carona</BadgeTitle>
            <BadgeDesc>+140kg de emissões de CO₂ evitados</BadgeDesc>
          </BadgeBox>
        </BadgesGrid>

        <SectionTitle>Depoimentos Recentes</SectionTitle>
        <ReviewCard>
          <ReviewHeader>
            <ReviewerName>Caio Castilho</ReviewerName>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
          </ReviewHeader>
          <ReviewComment>
            "Carona muito tranquila e pontual! Chegamos com folga para a aula no Campus Estrela Sul."
          </ReviewComment>
        </ReviewCard>

        <ReviewCard>
          <ReviewHeader>
            <ReviewerName>Mariana Duarte</ReviewerName>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
          </ReviewHeader>
          <ReviewComment>
            "Direção defensiva excelente, ar-condicionado ligado e boa conversa pelo caminho."
          </ReviewComment>
        </ReviewCard>

        <GuideCard>
          <GuideTitle>Diretrizes de Segurança no Campus</GuideTitle>
          <GuideText>
            • Combine sempre o embarque em pontos bem iluminados e movimentados.
            {'\n'}• Confirme o nome e o veículo do colega antes do embarque.
            {'\n'}• Utilize a Central de Avisos para avisar sobre qualquer imprevisto.
          </GuideText>
        </GuideCard>
      </Content>
    </Container>
  );
}
