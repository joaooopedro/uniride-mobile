import React from 'react';
import styled from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';

const CardContainer = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;
const DriverRow = styled.View`flex-direction: row; align-items: center;`;
const Avatar = styled.View`width: 44px; height: 44px; border-radius: ${(props) => props.theme.radii.full}px; background-color: ${(props) => props.theme.colors.primaryLight}; align-items: center; justify-content: center; margin-right: ${(props) => props.theme.spacing.sm}px;`;
const AvatarText = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: 14px; font-weight: 700;`;
const DriverInfo = styled.View`flex: 1;`;
const DriverName = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px; font-weight: 600; line-height: 22px;`;
const RatingRow = styled.View`flex-direction: row; align-items: center; margin-top: 2px;`;
const RatingText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; margin-left: 4px;`;
const VerifiedBadge = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.successLight}; border-radius: ${(props) => props.theme.radii.full}px; padding: 5px 8px;`;
const VerifiedText = styled.Text`color: ${(props) => props.theme.colors.success}; font-size: ${(props) => props.theme.typography.micro.fontSize}px; font-weight: 600; margin-left: 4px;`;
const RouteSection = styled.View`margin-top: ${(props) => props.theme.spacing.md}px; padding: ${(props) => props.theme.spacing.mdSm}px; background-color: ${(props) => props.theme.colors.background}; border-radius: ${(props) => props.theme.radii.sm}px;`;
const RouteRow = styled.View`flex-direction: row; align-items: center;`;
const RouteText = styled.Text`flex: 1; color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.body.fontSize}px; font-weight: 600; line-height: 20px; margin-left: ${(props) => props.theme.spacing.sm}px;`;
const RouteArrow = styled.View`align-items: center; margin: 3px 0;`;
const DetailGrid = styled.View`flex-direction: row; flex-wrap: wrap; margin-top: ${(props) => props.theme.spacing.md}px;`;
const DetailCell = styled.View`width: 50%; flex-direction: row; align-items: center; margin-bottom: ${(props) => props.theme.spacing.sm}px;`;
const DetailText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; margin-left: ${(props) => props.theme.spacing.sm}px;`;
const Footer = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-top: ${(props) => props.theme.spacing.sm}px;`;
const AvailabilityBadge = styled.View`background-color: ${(props) => (props.available ? props.theme.colors.successLight : props.theme.colors.dangerLight)}; border-radius: ${(props) => props.theme.radii.sm}px; padding: 6px 8px;`;
const AvailabilityText = styled.Text`color: ${(props) => (props.available ? props.theme.colors.success : props.theme.colors.danger)}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; font-weight: 600;`;
const Price = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px; font-weight: 700; margin-left: auto; margin-right: ${(props) => props.theme.spacing.md}px;`;
const DetailsButton = styled.TouchableOpacity`min-height: ${(props) => props.theme.touchTarget.minHeight}px; padding: 0 ${(props) => props.theme.spacing.md}px; border-radius: ${(props) => props.theme.radii.md}px; background-color: ${(props) => props.theme.colors.primary}; flex-direction: row; align-items: center; justify-content: center;`;
const DetailsButtonText = styled.Text`color: ${(props) => props.theme.colors.surface}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; font-weight: 700; margin-right: 6px;`;

export default function CardCarona({ carona, onVerDetalhes }) {
  const disponibilidadeAtiva = carona.vagasRestantes > 0;

  return (
    <CardContainer>
      <DriverRow>
        <Avatar><AvatarText>{carona.iniciaisMotorista}</AvatarText></Avatar>
        <DriverInfo>
          <DriverName>{carona.motorista}</DriverName>
          <RatingRow><Ionicons name="star" size={14} color="#F59E0B" /><RatingText>{carona.notaMotorista}</RatingText></RatingRow>
        </DriverInfo>
        {carona.alunoVerificado && <VerifiedBadge><Ionicons name="shield-checkmark" size={13} color="#10B981" /><VerifiedText>Aluno Verificado</VerifiedText></VerifiedBadge>}
      </DriverRow>
      <RouteSection>
        <RouteRow><Feather name="map-pin" size={18} color="#2563EB" /><RouteText>{carona.bairroOrigem}</RouteText></RouteRow>
        <RouteArrow><Feather name="arrow-down" size={14} color="#94A3B8" /></RouteArrow>
        <RouteRow><Feather name="flag" size={18} color="#10B981" /><RouteText>{carona.campusDestino}</RouteText></RouteRow>
      </RouteSection>
      <DetailGrid>
        <DetailCell><Feather name="clock" size={16} color="#64748B" /><DetailText>Saída: {carona.horarioSaida}</DetailText></DetailCell>
        <DetailCell><Feather name="calendar" size={16} color="#64748B" /><DetailText>{carona.turno}</DetailText></DetailCell>
        <DetailCell><Feather name="truck" size={16} color="#64748B" /><DetailText>{carona.modeloCarro}</DetailText></DetailCell>
        <DetailCell><Feather name="hash" size={16} color="#64748B" /><DetailText>{carona.placaCarro}</DetailText></DetailCell>
      </DetailGrid>
      <Footer>
        <AvailabilityBadge available={disponibilidadeAtiva}><AvailabilityText available={disponibilidadeAtiva}>{disponibilidadeAtiva ? `${carona.vagasRestantes} vagas restantes` : 'Sem vagas'}</AvailabilityText></AvailabilityBadge>
        <Price>{carona.valorRateio}</Price>
        <DetailsButton onPress={() => onVerDetalhes(carona)}><DetailsButtonText>Ver Detalhes</DetailsButtonText><Feather name="arrow-right" size={16} color="#FFFFFF" /></DetailsButton>
      </Footer>
    </CardContainer>
  );
}
