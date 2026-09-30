import React, { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const Container = styled.View`flex: 1; background-color: ${(props) => props.theme.colors.background};`;
const Content = styled(ScrollView).attrs({ showsVerticalScrollIndicator: false, contentContainerStyle: { padding: 16, paddingBottom: 112 } })``;
const Intro = styled.View`margin-bottom: ${(props) => props.theme.spacing.md}px;`;
const Eyebrow = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; font-weight: 600;`;
const Title = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.display.fontSize}px; font-weight: 700; line-height: ${(props) => props.theme.typography.display.lineHeight}px; margin-top: 4px;`;
const Section = styled.View`background-color: ${(props) => props.theme.colors.surface}; border-width: 1px; border-color: ${(props) => props.theme.colors.border}; border-radius: ${(props) => props.theme.radii.md}px; padding: ${(props) => props.theme.spacing.md}px; margin-bottom: ${(props) => props.theme.spacing.md}px;`;
const SectionTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px; font-weight: 600; line-height: 26px; margin-bottom: ${(props) => props.theme.spacing.md}px;`;
const RouteRow = styled.View`flex-direction: row; align-items: flex-start;`;
const RouteIcon = styled.View`width: 32px; height: 32px; border-radius: ${(props) => props.theme.radii.full}px; background-color: ${(props) => props.tint}; align-items: center; justify-content: center; margin-right: ${(props) => props.theme.spacing.sm}px;`;
const RouteCopy = styled.View`flex: 1;`;
const Label = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; line-height: 16px;`;
const Value = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.body.fontSize}px; font-weight: 600; line-height: 20px; margin-top: 2px;`;
const Connector = styled.View`height: 18px; border-left-width: 1px; border-left-color: ${(props) => props.theme.colors.border}; margin-left: 16px;`;
const Schedule = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.primaryLight}; border-radius: ${(props) => props.theme.radii.sm}px; padding: ${(props) => props.theme.spacing.mdSm}px; margin-top: ${(props) => props.theme.spacing.md}px;`;
const ScheduleText = styled.Text`flex: 1; color: ${(props) => props.theme.colors.primary}; font-size: ${(props) => props.theme.typography.body.fontSize}px; font-weight: 600; margin-left: ${(props) => props.theme.spacing.sm}px;`;
const DriverHeader = styled.View`flex-direction: row; align-items: center;`;
const DriverAvatar = styled.View`width: 76px; height: 76px; border-radius: ${(props) => props.theme.radii.full}px; background-color: ${(props) => props.theme.colors.primaryLight}; align-items: center; justify-content: center; margin-right: ${(props) => props.theme.spacing.md}px;`;
const DriverInitials = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: 24px; font-weight: 700;`;
const DriverCopy = styled.View`flex: 1;`;
const DriverName = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 18px; font-weight: 600; line-height: 24px;`;
const Rating = styled.View`flex-direction: row; align-items: center; margin-top: 4px;`;
const RatingText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; margin-left: 4px;`;
const Verified = styled.View`flex-direction: row; align-items: center; align-self: flex-start; background-color: ${(props) => props.theme.colors.successLight}; border-radius: ${(props) => props.theme.radii.full}px; padding: 5px 8px; margin-top: ${(props) => props.theme.spacing.md}px;`;
const VerifiedText = styled.Text`color: ${(props) => props.theme.colors.success}; font-size: ${(props) => props.theme.typography.micro.fontSize}px; font-weight: 600; margin-left: 4px;`;
const ContactText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; margin-top: ${(props) => props.theme.spacing.md}px;`;
const VehicleGrid = styled.View`flex-direction: row; flex-wrap: wrap; margin-top: ${(props) => props.theme.spacing.lg}px;`;
const VehicleDetail = styled.View`width: 50%; margin-bottom: ${(props) => props.theme.spacing.md}px;`;
const VehicleLabel = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px;`;
const VehicleValue = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.body.fontSize}px; font-weight: 600; margin-top: 2px;`;
const Amenities = styled.View`flex-direction: row; flex-wrap: wrap;`;
const Amenity = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.background}; border-radius: ${(props) => props.theme.radii.sm}px; padding: 8px; margin: 0 8px 8px 0;`;
const AmenityText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; margin-left: 6px;`;
const PassengerRow = styled.View`flex-direction: row; align-items: center; margin-bottom: ${(props) => props.theme.spacing.sm}px;`;
const PassengerAvatar = styled.View`width: 36px; height: 36px; border-radius: ${(props) => props.theme.radii.full}px; background-color: ${(props) => props.theme.colors.secondaryLight}; align-items: center; justify-content: center; margin-right: ${(props) => props.theme.spacing.sm}px;`;
const PassengerInitials = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; font-weight: 700;`;
const PassengerName = styled.Text`flex: 1; color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.body.fontSize}px;`;
const Vacancies = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.successLight}; border-radius: ${(props) => props.theme.radii.sm}px; padding: 8px; margin-top: ${(props) => props.theme.spacing.sm}px;`;
const VacanciesText = styled.Text`color: ${(props) => props.theme.colors.success}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; font-weight: 600; margin-left: 6px;`;
const FinanceRow = styled.View`flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: ${(props) => props.theme.spacing.sm}px;`;
const FinanceLabel = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.body.fontSize}px;`;
const FinanceValue = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.body.fontSize}px; font-weight: 600;`;
const PixBox = styled.View`background-color: ${(props) => props.theme.colors.background}; border-radius: ${(props) => props.theme.radii.sm}px; padding: ${(props) => props.theme.spacing.md}px; margin-top: ${(props) => props.theme.spacing.sm}px;`;
const PixLabel = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px;`;
const PixKey = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.body.fontSize}px; font-weight: 600; margin-top: 4px;`;
const ActionBar = styled.View`position: absolute; left: 0; right: 0; bottom: 0; background-color: ${(props) => props.theme.colors.surface}; border-top-width: 1px; border-top-color: ${(props) => props.theme.colors.border}; padding: ${(props) => props.theme.spacing.md}px;`;
const ActionButton = styled.TouchableOpacity`min-height: ${(props) => props.theme.touchTarget.minHeight}px; border-radius: ${(props) => props.theme.radii.md}px; background-color: ${(props) => (props.disabled ? props.theme.colors.border : props.theme.colors.primary)}; flex-direction: row; align-items: center; justify-content: center;`;
const ActionText = styled.Text`color: ${(props) => (props.disabled ? props.theme.colors.textSecondary : props.theme.colors.surface)}; font-size: ${(props) => props.theme.typography.body.fontSize}px; font-weight: 700; margin-left: ${(props) => props.theme.spacing.sm}px;`;
const ModalBackdrop = styled.View`flex: 1; background-color: rgba(15, 23, 42, 0.45); align-items: center; justify-content: center; padding: ${(props) => props.theme.spacing.lg}px;`;
const ModalCard = styled.View`width: 100%; background-color: ${(props) => props.theme.colors.surface}; border-radius: ${(props) => props.theme.radii.lg}px; align-items: center; padding: ${(props) => props.theme.spacing.lg}px;`;
const ModalIcon = styled.View`width: 64px; height: 64px; border-radius: ${(props) => props.theme.radii.full}px; background-color: ${(props) => props.theme.colors.successLight}; align-items: center; justify-content: center; margin-bottom: ${(props) => props.theme.spacing.md}px;`;
const ModalTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px; font-weight: 600; text-align: center;`;
const ModalDescription = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.body.fontSize}px; line-height: 20px; text-align: center; margin-top: ${(props) => props.theme.spacing.sm}px;`;

export default function TelaDetalhesCarona({ navigation, route }) {
  const { caronasDisponiveis, reservas, solicitarReserva } = useCaronas();
  const [modalVisivel, setModalVisivel] = useState(false);
  const caronaId = route?.params?.caronaId;
  const caronaDetalhada = route?.params?.carona || caronasDisponiveis.find((carona) => carona.id === caronaId);
  const reservaExistente = reservas.some((reserva) => reserva.caronaId === caronaDetalhada?.id);
  const possuiVaga = Boolean(caronaDetalhada?.vagasRestantes > 0);

  useEffect(() => {
    if (!modalVisivel) return undefined;
    const navegacaoTimer = setTimeout(() => {
      setModalVisivel(false);
      navigation.navigate('MainTabs', { screen: 'Viagens' });
    }, 1400);
    return () => clearTimeout(navegacaoTimer);
  }, [modalVisivel, navigation]);

  if (!caronaDetalhada) {
    return <Container><Content><EmptyTitle>Carona não encontrada</EmptyTitle><EmptyDescription>Volte ao feed para escolher outra rota.</EmptyDescription></Content></Container>;
  }

  const handleSolicitarVaga = () => {
    if (solicitarReserva(caronaDetalhada.id)) setModalVisivel(true);
  };

  return (
    <Container>
      <Content>
        <Intro><Eyebrow>{caronaDetalhada.turno} · {caronaDetalhada.horarioSaida}</Eyebrow><Title>{caronaDetalhada.bairroOrigem} para {caronaDetalhada.campusDestino}</Title></Intro>
        <Section>
          <SectionTitle>Rota e horário</SectionTitle>
          <RouteRow><RouteIcon tint="#DBEAFE"><Feather name="map-pin" size={17} color="#2563EB" /></RouteIcon><RouteCopy><Label>Ponto de encontro</Label><Value>{caronaDetalhada.pontoEncontro}</Value></RouteCopy></RouteRow>
          <Connector />
          <RouteRow><RouteIcon tint="#D1FAE5"><Feather name="flag" size={17} color="#10B981" /></RouteIcon><RouteCopy><Label>Destino</Label><Value>{caronaDetalhada.destinoDetalhado}</Value></RouteCopy></RouteRow>
          <Schedule><Feather name="clock" size={20} color="#2563EB" /><ScheduleText>Saída {caronaDetalhada.horarioSaida} | Tolerância: {caronaDetalhada.toleranciaMinutos} min</ScheduleText></Schedule>
        </Section>
        <Section>
          <SectionTitle>Motorista e veículo</SectionTitle>
          <DriverHeader><DriverAvatar><DriverInitials>{caronaDetalhada.iniciaisMotorista}</DriverInitials></DriverAvatar><DriverCopy><DriverName>{caronaDetalhada.motorista}</DriverName><Rating><Ionicons name="star" size={15} color="#F59E0B" /><RatingText>{caronaDetalhada.notaMotorista} de avaliação</RatingText></Rating></DriverCopy></DriverHeader>
          <Verified><Ionicons name="shield-checkmark" size={14} color="#10B981" /><VerifiedText>Aluno Verificado</VerifiedText></Verified>
          <ContactText>{caronaDetalhada.motoristaCurso}</ContactText><ContactText>Telefone de emergência: {caronaDetalhada.telefoneEmergencia}</ContactText>
          <VehicleGrid><VehicleDetail><VehicleLabel>Marca</VehicleLabel><VehicleValue>{caronaDetalhada.marcaCarro}</VehicleValue></VehicleDetail><VehicleDetail><VehicleLabel>Modelo</VehicleLabel><VehicleValue>{caronaDetalhada.modeloCarro}</VehicleValue></VehicleDetail><VehicleDetail><VehicleLabel>Cor</VehicleLabel><VehicleValue>{caronaDetalhada.corCarro}</VehicleValue></VehicleDetail><VehicleDetail><VehicleLabel>Placa</VehicleLabel><VehicleValue>{caronaDetalhada.placaCarro}</VehicleValue></VehicleDetail></VehicleGrid>
          <Label>Comodidades</Label><Amenities>{caronaDetalhada.comodidades.map((comodidade) => <Amenity key={comodidade}><Feather name="check" size={14} color="#10B981" /><AmenityText>{comodidade}</AmenityText></Amenity>)}</Amenities>
        </Section>
        <Section>
          <SectionTitle>Passageiros confirmados</SectionTitle>
          {caronaDetalhada.passageirosConfirmados.map((passageiro) => <PassengerRow key={passageiro.nome}><PassengerAvatar><PassengerInitials>{passageiro.iniciais}</PassengerInitials></PassengerAvatar><PassengerName>{passageiro.nome}</PassengerName><Ionicons name="checkmark-circle" size={18} color="#10B981" /></PassengerRow>)}
          <Vacancies><Feather name="users" size={17} color="#10B981" /><VacanciesText>{caronaDetalhada.vagasRestantes} {caronaDetalhada.vagasRestantes === 1 ? 'vaga livre' : 'vagas livres'}</VacanciesText></Vacancies>
        </Section>
        <Section>
          <SectionTitle>Rateio e pagamento</SectionTitle>
          <FinanceRow><FinanceLabel>Rateio estimado de combustível</FinanceLabel><FinanceValue>{caronaDetalhada.valorRateio}</FinanceValue></FinanceRow>
          <Label>Valor dividido entre os passageiros, sem lucro para o motorista.</Label>
          <PixBox><PixLabel>Chave PIX para acerto pós-viagem</PixLabel><PixKey>{caronaDetalhada.chavePix}</PixKey></PixBox>
        </Section>
      </Content>
      <ActionBar><ActionButton disabled={!possuiVaga || reservaExistente} onPress={handleSolicitarVaga}><Feather name={reservaExistente ? 'check' : 'send'} size={18} color={possuiVaga && !reservaExistente ? '#FFFFFF' : '#64748B'} /><ActionText disabled={!possuiVaga || reservaExistente}>{reservaExistente ? 'Vaga solicitada' : possuiVaga ? 'Solicitar Vaga nesta Carona' : 'Carona sem vagas'}</ActionText></ActionButton></ActionBar>
      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}><ModalBackdrop><ModalCard><ModalIcon><Feather name="check" size={32} color="#10B981" /></ModalIcon><ModalTitle>Vaga solicitada</ModalTitle><ModalDescription>Sua reserva foi confirmada. Você será direcionado para Minhas Viagens.</ModalDescription></ModalCard></ModalBackdrop></Modal>
    </Container>
  );
}
