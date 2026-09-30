import React, { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const Container = styled.View`flex: 1; background-color: ${(props) => props.theme.colors.background};`;
const Content = styled(ScrollView).attrs({ showsVerticalScrollIndicator: false, contentContainerStyle: { padding: 16, paddingBottom: 112 } })``;
const Intro = styled.View`margin-bottom: 16px;`;
const Eyebrow = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: 12px; font-weight: 600;`;
const PageTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 24px; font-weight: 700; line-height: 32px; margin-top: 4px;`;
const Section = styled.View`background-color: ${(props) => props.theme.colors.surface}; border-width: 1px; border-color: ${(props) => props.theme.colors.border}; border-radius: ${(props) => props.theme.radii.md}px; padding: 16px; margin-bottom: 16px;`;
const SectionTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 18px; font-weight: 600; line-height: 26px; margin-bottom: 16px;`;
const RouteRow = styled.View`flex-direction: row; align-items: flex-start;`;
const RouteIcon = styled.View`width: 32px; height: 32px; border-radius: 16px; background-color: ${(props) => props.tint}; align-items: center; justify-content: center; margin-right: 8px;`;
const RouteCopy = styled.View`flex: 1;`;
const Label = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 12px; line-height: 16px;`;
const Value = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 14px; font-weight: 600; line-height: 20px; margin-top: 2px;`;
const Connector = styled.View`height: 18px; border-left-width: 1px; border-left-color: ${(props) => props.theme.colors.border}; margin-left: 16px;`;
const Schedule = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.primaryLight}; border-radius: 8px; padding: 12px; margin-top: 16px;`;
const ScheduleText = styled.Text`flex: 1; color: ${(props) => props.theme.colors.primary}; font-size: 14px; font-weight: 600; line-height: 20px; margin-left: 8px;`;
const DriverHeader = styled.View`flex-direction: row; align-items: center;`;
const DriverAvatar = styled.View`width: 72px; height: 72px; border-radius: 36px; background-color: ${(props) => props.theme.colors.primaryLight}; align-items: center; justify-content: center; margin-right: 12px;`;
const DriverInitials = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: 24px; font-weight: 700;`;
const DriverCopy = styled.View`flex: 1;`;
const DriverName = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 18px; font-weight: 600; line-height: 24px;`;
const Rating = styled.View`flex-direction: row; align-items: center; margin-top: 4px;`;
const RatingText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 12px; margin-left: 4px;`;
const Verified = styled.View`flex-direction: row; align-items: center; align-self: flex-start; background-color: ${(props) => props.theme.colors.successLight}; border-radius: 999px; padding: 5px 8px; margin-top: 16px;`;
const VerifiedText = styled.Text`color: ${(props) => props.theme.colors.success}; font-size: 11px; font-weight: 600; margin-left: 4px;`;
const SecondaryText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 12px; line-height: 16px; margin-top: 12px;`;
const VehicleGrid = styled.View`flex-direction: row; flex-wrap: wrap; margin-top: 24px;`;
const VehicleDetail = styled.View`width: 50%; margin-bottom: 16px;`;
const VehicleValue = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 14px; font-weight: 600; margin-top: 2px;`;
const Amenities = styled.View`flex-direction: row; flex-wrap: wrap; margin-top: 8px;`;
const Amenity = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.background}; border-radius: 8px; padding: 8px; margin: 0 8px 8px 0;`;
const AmenityText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 12px; margin-left: 6px;`;
const PassengerRow = styled.View`flex-direction: row; align-items: center; margin-bottom: 8px;`;
const PassengerAvatar = styled.View`width: 36px; height: 36px; border-radius: 18px; background-color: ${(props) => props.theme.colors.secondaryLight}; align-items: center; justify-content: center; margin-right: 8px;`;
const PassengerInitials = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: 12px; font-weight: 700;`;
const PassengerName = styled.Text`flex: 1; color: ${(props) => props.theme.colors.text}; font-size: 14px;`;
const Vacancies = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.successLight}; border-radius: 8px; padding: 8px; margin-top: 8px;`;
const VacanciesText = styled.Text`color: ${(props) => props.theme.colors.success}; font-size: 12px; font-weight: 600; margin-left: 6px;`;
const FinanceRow = styled.View`flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 8px;`;
const FinanceLabel = styled.Text`flex: 1; color: ${(props) => props.theme.colors.textSecondary}; font-size: 14px; margin-right: 8px;`;
const FinanceValue = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 16px; font-weight: 700;`;
const PixBox = styled.View`background-color: ${(props) => props.theme.colors.background}; border-radius: 8px; padding: 12px; margin-top: 8px;`;
const PixKey = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 14px; font-weight: 600; margin-top: 4px;`;
const ActionBar = styled.View`position: absolute; left: 0; right: 0; bottom: 0; background-color: ${(props) => props.theme.colors.surface}; border-top-width: 1px; border-top-color: ${(props) => props.theme.colors.border}; padding: 16px;`;
const BackButton = styled.TouchableOpacity`min-height: 44px; flex-direction: row; align-items: center; justify-content: center; margin-bottom: 8px;`;
const BackText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 14px; font-weight: 600; margin-left: 8px;`;
const ActionButton = styled.TouchableOpacity`min-height: 44px; border-radius: 12px; background-color: ${(props) => (props.disabled ? props.theme.colors.border : props.theme.colors.primary)}; flex-direction: row; align-items: center; justify-content: center;`;
const ActionText = styled.Text`color: ${(props) => (props.disabled ? props.theme.colors.textSecondary : props.theme.colors.surface)}; font-size: 14px; font-weight: 700; margin-left: 8px;`;
const ModalBackdrop = styled.View`flex: 1; background-color: rgba(15, 23, 42, 0.45); align-items: center; justify-content: center; padding: 24px;`;
const ModalCard = styled.View`width: 100%; background-color: ${(props) => props.theme.colors.surface}; border-radius: 16px; align-items: center; padding: 24px;`;
const ModalIcon = styled.View`width: 64px; height: 64px; border-radius: 32px; background-color: ${(props) => props.theme.colors.successLight}; align-items: center; justify-content: center; margin-bottom: 16px;`;
const ModalTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 18px; font-weight: 600; text-align: center;`;
const ModalDescription = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 14px; line-height: 20px; text-align: center; margin-top: 8px;`;
const MissingState = styled.View`padding: 32px 16px; align-items: center;`;

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
    return <Container><MissingState><PageTitle>Carona não encontrada</PageTitle><SecondaryText>Volte ao feed para escolher outra rota.</SecondaryText></MissingState></Container>;
  }

  const handleSolicitarVaga = () => {
    if (solicitarReserva(caronaDetalhada.id)) setModalVisivel(true);
  };

  return (
    <Container>
      <Content>
        <Intro><Eyebrow>{caronaDetalhada.turno} · {caronaDetalhada.horarioSaida}</Eyebrow><PageTitle>{caronaDetalhada.bairroOrigem} para {caronaDetalhada.campusDestino}</PageTitle></Intro>
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
          <SecondaryText>{caronaDetalhada.motoristaCurso}</SecondaryText><SecondaryText>Telefone de emergência: {caronaDetalhada.telefoneEmergencia}</SecondaryText>
          <VehicleGrid><VehicleDetail><Label>Marca</Label><VehicleValue>{caronaDetalhada.marcaCarro}</VehicleValue></VehicleDetail><VehicleDetail><Label>Modelo</Label><VehicleValue>{caronaDetalhada.modeloCarro}</VehicleValue></VehicleDetail><VehicleDetail><Label>Cor</Label><VehicleValue>{caronaDetalhada.corCarro}</VehicleValue></VehicleDetail><VehicleDetail><Label>Placa</Label><VehicleValue>{caronaDetalhada.placaCarro}</VehicleValue></VehicleDetail></VehicleGrid>
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
          <PixBox><Label>Chave PIX para acerto pós-viagem</Label><PixKey>{caronaDetalhada.chavePix}</PixKey></PixBox>
        </Section>
      </Content>
      <ActionBar><BackButton onPress={() => navigation.goBack()} accessibilityLabel="Voltar"><Feather name="arrow-left" size={18} color="#64748B" /><BackText>Voltar</BackText></BackButton><ActionButton disabled={!possuiVaga || reservaExistente} onPress={handleSolicitarVaga}><Feather name={reservaExistente ? 'check' : 'send'} size={18} color={possuiVaga && !reservaExistente ? '#FFFFFF' : '#64748B'} /><ActionText disabled={!possuiVaga || reservaExistente}>{reservaExistente ? 'Vaga solicitada' : possuiVaga ? 'Solicitar Vaga nesta Carona' : 'Carona sem vagas'}</ActionText></ActionButton></ActionBar>
      <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}><ModalBackdrop><ModalCard><ModalIcon><Feather name="check" size={32} color="#10B981" /></ModalIcon><ModalTitle>Vaga solicitada</ModalTitle><ModalDescription>Sua reserva foi confirmada. Você será direcionado para Minhas Viagens.</ModalDescription></ModalCard></ModalBackdrop></Modal>
    </Container>
  );
}
