import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import styled, { useTheme } from "styled-components/native";
import MotionPressable from "../components/MotionPressable";
import { Feather } from "@expo/vector-icons";
import { useCaronas } from "../context/CaronasContext";
import CardEstatistica from "../components/CardEstatistica";
import TagPreferencia from "../components/TagPreferencia";


const gruposPreferencias = [
  {
    id: "estiloMusical",
    titulo: "Música",
    icone: "music",
    opcoes: ["Sertanejo", "Rock", "Pop", "Silêncio"],
  },
  {
    id: "climatizacao",
    titulo: "Climatização",
    icone: "wind",
    opcoes: ["Ar-condicionado ligado", "Vidro aberto"],
  },
  {
    id: "conversa",
    titulo: "Conversa",
    icone: "message-circle",
    opcoes: ["Adora bater papo", "Prefere focar nos estudos"],
  },
];

const Container = styled.ScrollView.attrs({
  contentContainerStyle: { padding: 24, paddingBottom: 40 },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const ProfileCard = styled.View`
  padding: 12px 0px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

const ProfileHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AvatarRing = styled.View`
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const AvatarClip = styled.View`
  width: 72px;
  height: 72px;
  border-radius: ${(props) => props.theme.radii.full}px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.primaryLight};
`;

const AvatarFallback = styled.Text`
  position: absolute;
  color: ${(props) => props.theme.colors.primary};
  font-size: 18px;
  font-weight: 700;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 21px;
  font-weight: 700;
  line-height: 30px;
  letter-spacing: -0.4px;
  font-family: ${(props) => props.theme.fonts.bold};
`;

const UserCourse = styled.Text`
  font-size: 12px;
  font-weight: 400;
  line-height: 21px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 6px;
  font-family: ${(props) => props.theme.fonts.regular};
`;

const EnrollmentBadge = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-top: 10px;
`;

const EnrollmentText = styled.Text`
  color: ${(props) => props.theme.colors.success};
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing.xs}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const EditButton = styled(MotionPressable)`
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.primaryLight};
  padding: 0px 16px;
  margin-top: 20px;
`;

const EditButtonText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-weight: 600;
  line-height: 21px;
  margin-left: 8px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;

const SectionTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 19px;
  font-weight: 600;
  line-height: 28px;
  margin: 32px 0px 12px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;

const MetricsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -4px;
`;

const InfoCard = styled.View`
  background-color: transparent;
  border-width: 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
  border-radius: 0px;
  padding: 24px 0px;
  margin-bottom: 12px;
`;

const InfoHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const InfoIcon = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const InfoTitle = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  line-height: ${(props) => props.theme.typography.cardTitle.lineHeight}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

const DetailLabel = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const DetailValue = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 700;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  text-align: right;
  margin-left: ${(props) => props.theme.spacing.md}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const PixBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.radii.sm}px;
  padding: ${(props) => props.theme.spacing.mdSm}px;
  margin-top: ${(props) => props.theme.spacing.md}px;
`;

const PixText = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  margin-left: ${(props) => props.theme.spacing.sm}px;

  font-family: ${(props) => props.theme.fonts.semibold};
`;

const PreferenceCard = styled(InfoCard)`
  margin-bottom: 12px;
`;

const PreferenceHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const PreferenceTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  line-height: ${(props) => props.theme.typography.cardTitle.lineHeight}px;
  margin-left: ${(props) => props.theme.spacing.sm}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const TagsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const FooterActions = styled.View`
  margin-top: ${(props) => props.theme.spacing.md}px;
`;

const LogoutButton = styled(MotionPressable)`
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) => props.theme.colors.dangerLight};
  padding: 0 ${(props) => props.theme.spacing.md}px;
`;

const LogoutText = styled.Text`
  color: ${(props) => props.theme.colors.danger};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing.sm}px;

  font-family: ${(props) => props.theme.fonts.bold};
`;

const TermsButton = styled(MotionPressable)`
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

const TermsText = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;

  font-family: ${(props) => props.theme.fonts.bold};
`;

export default function TelaPerfilUniversitario() {
  const theme = useTheme();
  const { usuarioLogado, caronasDisponiveis, reservas, historicoViagens } =
    useCaronas();
  const [preferenciasSelecionadas, setPreferenciasSelecionadas] = useState({
    estiloMusical: "Pop",
    climatizacao: "Ar-condicionado ligado",
    conversa: "Adora bater papo",
  });

  const metricasPerfil = useMemo(() => {
    const caronasAtivasDoUsuario = caronasDisponiveis.filter(
      (carona) => carona.motorista === usuarioLogado.nome,
    );
    const caronasHistoricasDoUsuario = historicoViagens.filter(
      (viagem) => viagem.papel === "Motorista",
    );
    const viagensRealizadas =
      historicoViagens.length +
      reservas.length +
      caronasAtivasDoUsuario.length +
      37;
    const caronasOferecidas =
      caronasAtivasDoUsuario.length + caronasHistoricasDoUsuario.length + 16;

    return [
      {
        titulo: "Viagens realizadas",
        valor: viagensRealizadas,
        descricao: "Entre reservas e histórico",
        icone: "map",
        cor: "primary",
        fundo: "primaryLight",
      },
      {
        titulo: "Caronas oferecidas",
        valor: caronasOferecidas,
        descricao: "Rotas compartilhadas",
        icone: "users",
        cor: "secondary",
        fundo: "secondaryLight",
      },
      {
        titulo: "Economia estimada",
        valor: "R$ 340,00",
        descricao: "Em combustível dividido",
        icone: "trending-down",
        cor: "success",
        fundo: "successLight",
      },
      {
        titulo: "Horas economizadas",
        valor: "14h",
        descricao: "Menos tempo no trânsito",
        icone: "clock",
        cor: "warning",
        fundo: "warningLight",
      },
    ];
  }, [
    caronasDisponiveis,
    historicoViagens,
    reservas.length,
    usuarioLogado.nome,
  ]);

  const selecionarPreferencia = (grupoId, preferencia) => {
    setPreferenciasSelecionadas((preferenciasAtuais) => ({
      ...preferenciasAtuais,
      [grupoId]: preferencia,
    }));
  };

  const abrirEdicaoPerfil = () => {
    Alert.alert(
      "Editar perfil",
      "Edição de perfil disponível na próxima integração do UniRide.",
    );
  };

  const abrirTermosUso = () => {
    Alert.alert(
      "Termos de uso",
      "O UniRide é restrito a alunos verificados da UniAcademia. Use caronas com respeito, pontualidade e responsabilidade.",
    );
  };

  const confirmarLogout = () => {
    Alert.alert(
      "Sair da conta",
      `Sessão de ${usuarioLogado.nome} na UniAcademia.`,
    );
  };

  return (
    <Container>
      <ProfileCard>
        <ProfileHeader>
          <AvatarRing>
            <AvatarClip>
              <AvatarFallback>{usuarioLogado.iniciais}</AvatarFallback>
            </AvatarClip>
          </AvatarRing>
          <ProfileInfo>
            <UserName>{usuarioLogado.nome}</UserName>
            <UserCourse>
              {usuarioLogado.curso} • {usuarioLogado.periodo}
            </UserCourse>
            <EnrollmentBadge>
              <Feather
                name="check-circle"
                size={13}
                color={theme.colors.success}
              />
              <EnrollmentText>
                Matrícula {usuarioLogado.matricula}
              </EnrollmentText>
            </EnrollmentBadge>
          </ProfileInfo>
        </ProfileHeader>
        <EditButton onPress={abrirEdicaoPerfil} activeOpacity={0.85}>
          <Feather name="edit-2" size={16} color={theme.colors.primary} />
          <EditButtonText>Editar perfil</EditButtonText>
        </EditButton>
      </ProfileCard>

      <SectionTitle>Métricas e impacto</SectionTitle>
      <MetricsGrid>
        {metricasPerfil.map((metricaPerfil) => (
          <CardEstatistica
            key={metricaPerfil.titulo}
            titulo={metricaPerfil.titulo}
            valor={metricaPerfil.valor}
            descricao={metricaPerfil.descricao}
            icone={metricaPerfil.icone}
            cor={metricaPerfil.cor}
            fundo={metricaPerfil.fundo}
          />
        ))}
      </MetricsGrid>

      <SectionTitle>Veículo e recebimento</SectionTitle>
      <InfoCard>
        <InfoHeader>
          <InfoIcon>
            <Feather name="truck" size={20} color={theme.colors.primary} />
          </InfoIcon>
          <InfoTitle>Carro cadastrado</InfoTitle>
        </InfoHeader>
        <DetailRow>
          <DetailLabel>Modelo</DetailLabel>
          <DetailValue>
            {usuarioLogado.veiculo.marca} {usuarioLogado.veiculo.modelo}
          </DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Cor</DetailLabel>
          <DetailValue>{usuarioLogado.veiculo.cor}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Placa</DetailLabel>
          <DetailValue>{usuarioLogado.veiculo.placa}</DetailValue>
        </DetailRow>
        <PixBox>
          <Feather name="credit-card" size={18} color={theme.colors.success} />
          <PixText>PIX: {usuarioLogado.chavePix}</PixText>
        </PixBox>
      </InfoCard>

      <SectionTitle>Preferências de convivência</SectionTitle>
      {gruposPreferencias.map((grupoPreferencia) => (
        <PreferenceCard key={grupoPreferencia.id}>
          <PreferenceHeader>
            <Feather
              name={grupoPreferencia.icone}
              size={20}
              color={theme.colors.primary}
            />
            <PreferenceTitle>{grupoPreferencia.titulo}</PreferenceTitle>
          </PreferenceHeader>
          <TagsWrap>
            {grupoPreferencia.opcoes.map((preferencia) => (
              <TagPreferencia
                key={preferencia}
                texto={preferencia}
                icone={grupoPreferencia.icone}
                ativa={
                  preferenciasSelecionadas[grupoPreferencia.id] === preferencia
                }
                onPress={() =>
                  selecionarPreferencia(grupoPreferencia.id, preferencia)
                }
              />
            ))}
          </TagsWrap>
        </PreferenceCard>
      ))}

      <FooterActions>
        <LogoutButton onPress={confirmarLogout} activeOpacity={0.85}>
          <Feather name="log-out" size={18} color={theme.colors.danger} />
          <LogoutText>Sair da conta</LogoutText>
        </LogoutButton>
        <TermsButton onPress={abrirTermosUso} activeOpacity={0.75}>
          <TermsText>Termos de uso</TermsText>
        </TermsButton>
      </FooterActions>
    </Container>
  );
}
