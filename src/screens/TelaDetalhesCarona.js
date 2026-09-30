import React, { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const Container = styled.View`flex: 1; background-color: ${(props) => props.theme.colors.background};`;
const Content = styled(ScrollView).attrs({ showsVerticalScrollIndicator: false, contentContainerStyle: { padding: 16, paddingBottom: 120 } })``;
const Section = styled.View`background-color: ${(props) => props.theme.colors.surface}; border-width: 1px; border-color: ${(props) => props.theme.colors.border}; border-radius: 12px; padding: 16px; margin-bottom: 16px;`;
const PageTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 24px; font-weight: 700; line-height: 32px; margin-bottom: 16px;`;
const Eyebrow = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: 12px; font-weight: 600; margin-bottom: 4px;`;
const SectionTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 18px; font-weight: 600; line-height: 26px; margin-bottom: 16px;`;
const Row = styled.View`flex-direction: row; align-items: flex-start;`;
const IconCircle = styled.View`width: 32px; height: 32px; border-radius: 16px; background-color: ${(props) => props.tint}; align-items: center; justify-content: center; margin-right: 8px;`;
const Copy = styled.View`flex: 1;`;
const Label = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 12px; line-height: 16px;`;
const Value = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 14px; font-weight: 600; line-height: 20px; margin-top: 2px;`;
const Connector = styled.View`height: 18px; border-left-width: 1px; border-left-color: ${(props) => props.theme.colors.border}; margin-left: 16px;`;
const Schedule = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.primaryLight}; border-radius: 8px; padding: 12px; margin-top: 16px;`;
const ScheduleText = styled.Text`flex: 1; color: ${(props) => props.theme.colors.primary}; font-size: 14px; font-weight: 600; margin-left: 8px;`;
const DriverRow = styled.View`flex-direction: row; align-items: center;`;
const Avatar = styled.View`width: 72px; height: 72px; border-radius: 36px; background-color: ${(props) => props.theme.colors.primaryLight}; align-items: center; justify-content: center; margin-right: 12px;`;
const Initials = styled.Text`color: ${(props) => props.theme.colors.primary}; font-size: 24px; font-weight: 700;`;
const DriverName = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 18px; font-weight: 600;`;
const Rating = styled.View`flex-direction: row; align-items: center; margin-top: 4px;`;
const SmallText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 12px; line-height: 16px; margin-top: 8px;`;
const Verified = styled.View`flex-direction: row; align-items: center; align-self: flex-start; background-color: ${(props) => props.theme.colors.successLight}; border-radius: 999px; padding: 5px 8px; margin-top: 16px;`;
const VerifiedText = styled.Text`color: ${(props) => props.theme.colors.success}; font-size: 11px; font-weight: 600; margin-left: 4px;`;
const Grid = styled.View`flex-direction: row; flex-wrap: wrap; margin-top: 20px;`;
const GridCell = styled.View`width: 50%; margin-bottom: 16px;`;
const GridValue = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 14px; font-weight: 600; margin-top: 2px;`;
const Tags = styled.View`flex-direction: row; flex-wrap: wrap; margin-top: 8px;`;
const Tag = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.background}; border-radius: 8px; padding: 8px; margin: 0 8px 8px 0;`;
const TagText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 12px; margin-left: 6px;`;
const Passenger = styled.View`flex-direction: row; align-items: center; margin-bottom: 8px;`;
const PassengerAvatar = styled.View`width: 36px; height: 36px; border-radius: 18px; background-color: ${(props) => props.theme.colors.secondaryLight}; align-items: center; justify-content: center; margin-right: 8px;`;
const PassengerText = styled.Text`flex: 1; color: ${(props) => props.theme.colors.text}; font-size: 14px;`;
const Vacancy = styled.View`flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.successLight}; border-radius: 8px; padding: 8px; margin-top: 8px;`;
const VacancyText = styled.Text`color: ${(props) => props.theme.colors.success}; font-size: 12px; font-weight: 600; margin-left: 6px;`;
const Finance = styled.View`flex-direction: row; justify-content: space-between; align-items: center;`;
const FinanceValue = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 16px; font-weight: 700;`;
const Pix = styled.View`background-color: ${(props) => props.theme.colors.background}; border-radius: 8px; padding: 12px; margin-top: 12px;`;
const PixValue = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 14px; font-weight: 600; margin-top: 4px;`;
const ActionBar = styled.View`position: absolute; left: 0; right: 0; bottom: 0; background-color: ${(props) => props.theme.colors.surface}; border-top-width: 1px; border-top-color: ${(props) => props.theme.colors.border}; padding: 12px 16px;`;
const BackButton = styled.TouchableOpacity`height: 44px; flex-direction: row; align-items: center; justify-content: center;`;
const BackText = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 14px; font-weight: 600; margin-left: 8px;`;
const ActionButton = styled.TouchableOpacity`min-height: 44px; border-radius: 12px; background-color: ${(props) => (props.disabled ? props.theme.colors.border : props.theme.colors.primary)}; flex-direction: row; align-items: center; justify-content: center;`;
const ActionText = styled.Text`color: ${(props) => (props.disabled ? props.theme.colors.textSecondary : props.theme.colors.surface)}; font-size: 14px; font-weight: 700; margin-left: 8px;`;
const ModalBackdrop = styled.View`flex: 1; background-color: rgba(15, 23, 42, 0.45); align-items: center; justify-content: center; padding: 24px;`;
const ModalCard = styled.View`width: 100%; background-color: ${(props) => props.theme.colors.surface}; border-radius: 16px; align-items: center; padding: 24px;`;
const ModalIcon = styled.View`width: 64px; height: 64px; border-radius: 32px; background-color: ${(props) => props.theme.colors.successLight}; align-items: center; justify-content: center;`;
const ModalTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: 18px; font-weight: 600; margin-top: 16px;`;
const ModalBody = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: 14px; text-align: center; line-height: 20px; margin-top: 8px;`;

export default function TelaDetalhesCarona({ navigation, route }) {
  const { caronasDisponiveis, reservas, solicitarReserva } = useCaronas();
  const [modalVisivel, setModalVisivel] = useState(false);
  const caronaId = route?.params?.caronaId;
  const carona = route?.params?.carona || caronasDisponiveis.find((caronaDisponivel) => caronaDisponivel.id === caronaId);
  const reservaExistente = reservas.some((reserva) => reserva.caronaId === carona?.id);
  const possuiVaga = Boolean(carona?.vagasRestantes > 0);

  useEffect(() => {
    if (!modalVisivel) return undefined;
    const navegacaoTimer = setTimeout(() => {
      setModalVisivel(false);
      navigation.navigate('MainTabs', { screen: 'Viagens' });
    }, 1400);
    return () => clearTimeout(navegacaoTimer);
  }, [modalVisivel, navigation]);

  if (!carona) return <Container><Content><PageTitle>Carona não encontrada</PageTitle><SmallText>Volte ao feed para escolher outra rota.</SmallText></Content></Container>;

  const solicitarVaga = () => {
    if (solicitarReserva(carona.id)) setModalVisivel(true);
  };

  return <Container>
    <Content>
      <Eyebrow>{carona.turno} · {carona.horarioSaida}</Eyebrow><PageTitle>{carona.bairroOrigem} para {carona.campusDestino}</PageTitle>
      <Section><SectionTitle>Rota e horário</SectionTitle><Row><IconCircle tint="#DBEAFE"><Feather name="map-pin" size={17} color="#2563EB" /></IconCircle><Copy><Label>Ponto de encontro</Label><Value>{carona.pontoEncontro}</Value></Copy></Row><Connector /><Row><IconCircle tint="#D1FAE5"><Feather name="flag" size={17} color="#10B981" /></IconCircle><Copy><Label>Destino</Label><Value>{carona.destinoDetalhado}</Value></Copy></Row><Schedule><Feather name="clock" size={20} color="#2563EB" /><ScheduleText>Saída {carona.horarioSaida} | Tolerância: 5 min</ScheduleText></Schedule></Section>
      <Section><SectionTitle>Motorista e veículo</SectionTitle><DriverRow><Avatar><Initials>{carona.iniciaisMotorista}</Initials></Avatar><Copy><DriverName>{carona.motorista}</DriverName><Rating><Ionicons name="star" size={15} color="#F59E0B" /><SmallText>{carona.notaMotorista} de avaliação</SmallText></Rating></Copy></DriverRow><Verified><Ionicons name="shield-checkmark" size={14} color="#10B981" /><VerifiedText>Aluno Verificado</VerifiedText></Verified><SmallText>{carona.motoristaCurso}</SmallText><SmallText>Telefone de emergência: {carona.telefoneEmergencia}</SmallText><Grid><GridCell><Label>Marca</Label><GridValue>{carona.marcaCarro}</GridValue></GridCell><GridCell><Label>Modelo</Label><GridValue>{carona.modeloCarro}</GridValue></GridCell><GridCell><Label>Cor</Label><GridValue>{carona.corCarro}</GridValue></GridCell><GridCell><Label>Placa</Label><GridValue>{carona.placaCarro}</GridValue></GridCell></Grid><Label>Comodidades</Label><Tags>{carona.comodidades.map((comodidade) => <Tag key={comodidade}><Feather name="check" size={14} color="#10B981" /><TagText>{comodidade}</TagText></Tag>)}</Tags></Section>
      <Section><SectionTitle>Passageiros confirmados</SectionTitle>{carona.passageirosConfirmados.map((passageiro) => <Passenger key={passageiro.nome}><PassengerAvatar><Initials>{passageiro.iniciais}</Initials></PassengerAvatar><PassengerText>{passageiro.nome}</PassengerText><Ionicons name="checkmark-circle" size={18} color="#10B981" /></Passenger>)}<Vacancy><Feather name="users" size={17} color="#10B981" /><VacancyText>{carona.vagasRestantes} {carona.vagasRestantes === 1 ? 'vaga livre' : 'vagas livres'}</VacancyText></Vacancy></Section>
      <Section><SectionTitle>Rateio e pagamento</SectionTitle><Finance><Label>Rateio estimado de combustível</Label><FinanceValue>{carona.valorRateio}</FinanceValue></Finance><SmallText>Valor dividido entre os passageiros, sem lucro para o motorista.</SmallText><Pix><Label>Chave PIX para acerto pós-viagem</Label><PixValue>{carona.chavePix}</PixValue></Pix></Section>
    </Content>
    <ActionBar><BackButton onPress={() => navigation.goBack()} accessibilityLabel="Voltar"><Feather name="arrow-left" size={18} color="#64748B" /><BackText>Voltar</BackText></BackButton><ActionButton disabled={!possuiVaga || reservaExistente} onPress={solicitarVaga}><Feather name={reservaExistente ? 'check' : 'send'} size={18} color={possuiVaga && !reservaExistente ? '#FFFFFF' : '#64748B'} /><ActionText disabled={!possuiVaga || reservaExistente}>{reservaExistente ? 'Vaga solicitada' : possuiVaga ? 'Solicitar Vaga nesta Carona' : 'Carona sem vagas'}</ActionText></ActionButton></ActionBar>
    <Modal visible={modalVisivel} transparent animationType="fade" onRequestClose={() => setModalVisivel(false)}><ModalBackdrop><ModalCard><ModalIcon><Feather name="check" size={32} color="#10B981" /></ModalIcon><ModalTitle>Vaga solicitada</ModalTitle><ModalBody>Sua reserva foi confirmada. Você será direcionado para Minhas Viagens.</ModalBody></ModalCard></ModalBackdrop></Modal>
  </Container>;
}
