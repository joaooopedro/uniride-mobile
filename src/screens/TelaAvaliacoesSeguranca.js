import React, { useMemo, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import MotionPressable from "../components/MotionPressable";
import { Feather } from "@expo/vector-icons";
import { useCaronas } from "../context/CaronasContext";

const distribuicaoNotas = [
  { estrelas: 5, total: 38, percentual: 76 },
  { estrelas: 4, total: 9, percentual: 18 },
  { estrelas: 3, total: 2, percentual: 4 },
  { estrelas: 2, total: 1, percentual: 2 },
  { estrelas: 1, total: 0, percentual: 0 },
];

const selosConfianca = [
  {
    id: "aluno-verificado",
    titulo: "Aluno verificado",
    descricao: "Matrícula e e-mail institucional checados.",
    icone: "check-circle",
    cor: "success",
    fundo: "successLight",
  },
  {
    id: "motorista-pontual",
    titulo: "Motorista pontual",
    descricao: "98% de partidas no horário exato.",
    icone: "clock",
    cor: "primary",
    fundo: "primaryLight",
  },
  {
    id: "embaixador-seguranca",
    titulo: "Embaixador da segurança",
    descricao: "+30 caronas com nota máxima.",
    icone: "shield",
    cor: "secondary",
    fundo: "secondaryLight",
  },
  {
    id: "eco-carona",
    titulo: "EcoCarona",
    descricao: "+200kg de CO2 evitados.",
    icone: "wind",
    cor: "success",
    fundo: "successLight",
  },
];

const avaliacoesRecentes = [
  {
    id: "avaliacao-001",
    nome: "Larissa Prado",
    iniciais: "LP",
    curso: "Direito, 4º período",
    dataCarona: "02/10",
    rota: "Alto dos Passos para Campus Estrela Sul",
    nota: "5.0",
    comentario:
      "Saída no horário combinado, direção tranquila e conversa respeitosa durante o trajeto.",
  },
  {
    id: "avaliacao-002",
    nome: "Gustavo Neves",
    iniciais: "GN",
    curso: "Engenharia Civil, 6º período",
    dataCarona: "30/09",
    rota: "Centro para Campus Academia",
    nota: "4.9",
    comentario:
      "Confirmou a rota antes da saída e manteve todos informados pelo chat da carona.",
  },
  {
    id: "avaliacao-003",
    nome: "Nathalia Reis",
    iniciais: "NR",
    curso: "Psicologia, 5º período",
    dataCarona: "27/09",
    rota: "Manoel Honório para Campus Academia",
    nota: "5.0",
    comentario:
      "Ponto de encontro fácil de achar, carro limpo e chegada com tempo para a primeira aula.",
  },
];

const diretrizesSeguranca = [
  {
    id: "ponto-encontro",
    titulo: "Pontos de encontro iluminados",
    icone: "map-pin",
    texto:
      "Combine saídas em locais movimentados, como portarias da UniAcademia, praças centrais ou áreas com boa iluminação.",
  },
  {
    id: "confirmacao-matricula",
    titulo: "Confirmação de matrícula",
    icone: "user-check",
    texto:
      "Antes de embarcar, confira nome, curso e status de aluno verificado no perfil do colega.",
  },
  {
    id: "suporte-campus",
    titulo: "Canais de suporte do campus",
    icone: "headphones",
    texto:
      "Em caso de atraso, mudança de rota ou desconforto, use o chat da carona e acione a recepção do campus mais próximo.",
  },
];

const Container = styled.ScrollView.attrs({
  contentContainerStyle: { padding: 24, paddingBottom: 40 },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const Eyebrow = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const ScreenTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 29px;
  font-weight: 700;
  line-height: 38px;
  letter-spacing: -0.8px;
  margin-top: 8px;
  font-family: ${(props) => props.theme.fonts.bold};
`;

const SectionTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: ${(props) => props.theme.typography.sectionHeader.fontWeight};
  line-height: ${(props) => props.theme.typography.sectionHeader.lineHeight}px;
  margin: ${(props) => props.theme.spacing.lg}px 0
    ${(props) => props.theme.spacing.sm}px;

  font-family: ${(props) => props.theme.fonts.semibold};
`;

const Card = styled.View`
  background-color: transparent;
  border-width: 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
  border-radius: 0px;
  padding: 24px 0px;
  margin-bottom: 12px;
`;

const ReputationHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingBadge = styled.View`
  width: 48px;
  height: 56px;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const RatingSummary = styled.View`
  flex: 1;
`;

const RatingValue = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 28px;
  font-weight: 700;
  line-height: 32px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const RatingLabel = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  margin-top: ${(props) => props.theme.spacing.xs}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const RatingMetaRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.spacing.mdSm}px;
`;

const MetaPill = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 8px;
`;

const MetaPillText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing.xs}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const DistributionList = styled.View`
  margin-top: ${(props) => props.theme.spacing.md}px;
`;

const DistributionRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

const StarsLabel = styled.Text`
  width: 42px;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;

  font-family: ${(props) => props.theme.fonts.semibold};
`;

const ProgressTrack = styled.View`
  flex: 1;
  height: 8px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.borderLight};
  overflow: hidden;
`;

const ProgressFill = styled.View`
  width: ${(props) => props.percentual}%;
  height: 8px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.primary};
`;

const DistributionTotal = styled.Text`
  width: 34px;
  text-align: right;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const BadgeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -4px;
`;

const BadgeCard = styled.View`
  width: 50%;
  padding: 4px;
`;

const BadgeCardInner = styled.View`
  min-height: 156px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.border};
  padding: 16px 8px 16px 0px;
`;

const BadgeIcon = styled.View`
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const BadgeTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  line-height: 23px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;

const BadgeDescription = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  margin-top: ${(props) => props.theme.spacing.xs}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const ReviewCard = styled(Card)`
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const ReviewHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AvatarWrap = styled.View`
  width: 48px;
  height: 48px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.primaryLight};
  align-items: center;
  justify-content: center;
  margin-right: ${(props) => props.theme.spacing.mdSm}px;
  overflow: hidden;
`;

const AvatarFallback = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  position: absolute;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const ReviewInfo = styled.View`
  flex: 1;
`;

const ReviewerName = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 600;
  line-height: ${(props) => props.theme.typography.cardTitle.lineHeight}px;

  font-family: ${(props) => props.theme.fonts.semibold};
`;

const ReviewerCourse = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const ReviewRating = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
`;

const ReviewRatingText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing.xs}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const ReviewRoute = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  margin-top: ${(props) => props.theme.spacing.mdSm}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const ReviewComment = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  margin-top: ${(props) => props.theme.spacing.sm}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const AccordionItem = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
  margin-bottom: 8px;
`;

const AccordionHeader = styled(MotionPressable)`
  min-height: 56px;
  flex-direction: row;
  align-items: center;
  padding: 16px 0px;
`;

const AccordionIcon = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const AccordionTitle = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 700;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const AccordionBody = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 23px;
  color: ${(props) => props.theme.colors.textSecondary};
  padding: 0px 0px 20px 36px;
  font-family: ${(props) => props.theme.fonts.regular};
`;

export default function TelaAvaliacoesSeguranca() {
  const theme = useTheme();
  const { usuarioLogado, historicoViagens } = useCaronas();
  const [diretrizAbertaId, setDiretrizAbertaId] = useState(
    diretrizesSeguranca[0].id,
  );

  const totalViagens = useMemo(
    () => historicoViagens.length + 48,
    [historicoViagens.length],
  );

  const alternarDiretriz = (diretrizId) => {
    setDiretrizAbertaId((diretrizAtualId) =>
      diretrizAtualId === diretrizId ? null : diretrizId,
    );
  };

  return (
    <Container>
      <Header>
        <Eyebrow>
          {usuarioLogado.nome} • {usuarioLogado.curso}
        </Eyebrow>
        <ScreenTitle>Avaliações e segurança</ScreenTitle>
      </Header>

      <Card>
        <ReputationHeader>
          <RatingBadge>
            <Feather name="star" size={30} color={theme.colors.warning} />
          </RatingBadge>
          <RatingSummary>
            <RatingValue>4.9 / 5.0</RatingValue>
            <RatingLabel>
              Baseada em {totalViagens} viagens avaliadas pela comunidade
              UniAcademia.
            </RatingLabel>
          </RatingSummary>
        </ReputationHeader>

        <RatingMetaRow>
          <MetaPill>
            <Feather
              name="check-circle"
              size={14}
              color={theme.colors.primary}
            />
            <MetaPillText>96% recomendam</MetaPillText>
          </MetaPill>
          <MetaPill>
            <Feather name="clock" size={14} color={theme.colors.primary} />
            <MetaPillText>98% pontualidade</MetaPillText>
          </MetaPill>
        </RatingMetaRow>

        <DistributionList>
          {distribuicaoNotas.map((faixaNota) => (
            <DistributionRow key={faixaNota.estrelas}>
              <StarsLabel>{faixaNota.estrelas} estrelas</StarsLabel>
              <ProgressTrack>
                <ProgressFill percentual={faixaNota.percentual} />
              </ProgressTrack>
              <DistributionTotal>{faixaNota.total}</DistributionTotal>
            </DistributionRow>
          ))}
        </DistributionList>
      </Card>

      <SectionTitle>Selos de confiança</SectionTitle>
      <BadgeGrid>
        {selosConfianca.map((seloConfianca) => (
          <BadgeCard key={seloConfianca.id}>
            <BadgeCardInner>
              <BadgeIcon fundo={seloConfianca.fundo}>
                <Feather
                  name={seloConfianca.icone}
                  size={22}
                  color={theme.colors[seloConfianca.cor]}
                />
              </BadgeIcon>
              <BadgeTitle>{seloConfianca.titulo}</BadgeTitle>
              <BadgeDescription>{seloConfianca.descricao}</BadgeDescription>
            </BadgeCardInner>
          </BadgeCard>
        ))}
      </BadgeGrid>

      <SectionTitle>Avaliações recentes</SectionTitle>
      {avaliacoesRecentes.map((avaliacaoRecente) => (
        <ReviewCard key={avaliacaoRecente.id}>
          <ReviewHeader>
            <AvatarWrap>
              <AvatarFallback>{avaliacaoRecente.iniciais}</AvatarFallback>
            </AvatarWrap>
            <ReviewInfo>
              <ReviewerName>{avaliacaoRecente.nome}</ReviewerName>
              <ReviewerCourse>{avaliacaoRecente.curso}</ReviewerCourse>
            </ReviewInfo>
            <ReviewRating>
              <Feather name="star" size={14} color={theme.colors.warning} />
              <ReviewRatingText>{avaliacaoRecente.nota}</ReviewRatingText>
            </ReviewRating>
          </ReviewHeader>
          <ReviewRoute>
            {avaliacaoRecente.dataCarona} • {avaliacaoRecente.rota}
          </ReviewRoute>
          <ReviewComment>{avaliacaoRecente.comentario}</ReviewComment>
        </ReviewCard>
      ))}

      <SectionTitle>Segurança comunitária</SectionTitle>
      {diretrizesSeguranca.map((diretrizSeguranca) => {
        const diretrizAberta = diretrizAbertaId === diretrizSeguranca.id;
        return (
          <AccordionItem key={diretrizSeguranca.id}>
            <AccordionHeader
              activeOpacity={0.8}
              onPress={() => alternarDiretriz(diretrizSeguranca.id)}
              accessibilityRole="button"
              accessibilityLabel={diretrizSeguranca.titulo}
            >
              <AccordionIcon>
                <Feather
                  name={diretrizSeguranca.icone}
                  size={20}
                  color={theme.colors.primary}
                />
              </AccordionIcon>
              <AccordionTitle>{diretrizSeguranca.titulo}</AccordionTitle>
              <Feather
                name={diretrizAberta ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.textSecondary}
              />
            </AccordionHeader>
            {diretrizAberta && (
              <AccordionBody>{diretrizSeguranca.texto}</AccordionBody>
            )}
          </AccordionItem>
        );
      })}
    </Container>
  );
}
