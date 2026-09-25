import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
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

const SectionCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const SectionTitle = styled.Text`
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: ${(props) => props.theme.typography.sectionHeader.fontWeight};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

const DriverHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DriverPhoto = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.border};
`;

const DriverDetails = styled.View`
  margin-left: ${(props) => props.theme.spacing.md}px;
  flex: 1;
`;

const DriverName = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const DriverSub = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const VerifiedBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.successLight};
  padding: 2px 6px;
  border-radius: ${(props) => props.theme.radii.sm}px;
  align-self: flex-start;
  margin-top: 4px;
`;

const VerifiedText = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.success};
  margin-left: 4px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const InfoLabel = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-left: ${(props) => props.theme.spacing.sm}px;
  flex: 1;
`;

const InfoValue = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const PassengerPill = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.radii.full}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: 4px 10px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const PassengerAvatar = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: ${(props) => props.theme.radii.full}px;
  margin-right: 6px;
`;

const PassengerName = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;

const PassengersWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const PriceHighlight = styled.View`
  background-color: ${(props) => props.theme.colors.primaryLight};
  border-radius: ${(props) => props.theme.radii.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const PriceLabel = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
`;

const PriceLarge = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.disabled ? props.theme.colors.border : props.theme.colors.primary)};
  height: ${(props) => props.theme.touchTarget.minHeight}px;
  border-radius: ${(props) => props.theme.radii.md}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.xl}px;
`;

const ActionButtonText = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  color: #FFFFFF;
`;

export default function TelaDetalhesCarona({ route, navigation }) {
  const theme = useTheme();
  const { solicitarVaga } = useCaronas();
  const carona = route?.params?.carona;

  if (!carona) {
    return (
      <Container>
        <Content>
          <SectionCard>
            <SectionTitle>Carona não encontrada</SectionTitle>
            <InfoLabel>Selecione uma carona no feed para visualizar os detalhes.</InfoLabel>
          </SectionCard>
        </Content>
      </Container>
    );
  }

  const handleSolicitar = () => {
    const sucesso = solicitarVaga(carona.id);
    if (sucesso) {
      Alert.alert(
        'Vaga Confirmada!',
        `Sua reserva na carona de ${carona.motorista.nome} foi confirmada com sucesso. Acompanhe em Minhas Viagens.`,
        [
          {
            text: 'Ver Minhas Viagens',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Viagens' }),
          },
        ]
      );
    } else {
      Alert.alert('Aviso', 'Não há mais vagas disponíveis para esta carona.');
    }
  };

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <SectionCard>
          <DriverHeader>
            <DriverPhoto source={{ uri: carona.motorista.foto }} />
            <DriverDetails>
              <DriverName>{carona.motorista.nome}</DriverName>
              <DriverSub>{carona.motorista.curso}</DriverSub>
              <VerifiedBadge>
                <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
                <VerifiedText>Aluno Verificado</VerifiedText>
              </VerifiedBadge>
            </DriverDetails>
          </DriverHeader>
          <InfoRow>
            <Feather name="phone" size={16} color={theme.colors.textSecondary} />
            <InfoLabel>Contato de Emergência:</InfoLabel>
            <InfoValue>{carona.motorista.celular}</InfoValue>
          </InfoRow>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Trajeto e Horário</SectionTitle>
          <InfoRow>
            <Feather name="circle" size={16} color={theme.colors.primary} />
            <InfoLabel>Ponto de Embarque:</InfoLabel>
          </InfoRow>
          <InfoValue style={{ marginLeft: 24, marginBottom: 8 }}>{carona.pontoEncontro}</InfoValue>

          <InfoRow>
            <Feather name="map-pin" size={16} color={theme.colors.danger} />
            <InfoLabel>Destino no Campus:</InfoLabel>
          </InfoRow>
          <InfoValue style={{ marginLeft: 24, marginBottom: 8 }}>{carona.pontoDesembarque}</InfoValue>

          <InfoRow>
            <Feather name="clock" size={16} color={theme.colors.textSecondary} />
            <InfoLabel>Horário de Partida:</InfoLabel>
            <InfoValue>{carona.horarioSaida} (tolerância {carona.tolerancia})</InfoValue>
          </InfoRow>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Veículo e Comodidades</SectionTitle>
          <InfoRow>
            <Feather name="truck" size={16} color={theme.colors.textSecondary} />
            <InfoLabel>Veículo:</InfoLabel>
            <InfoValue>{carona.carro}</InfoValue>
          </InfoRow>
          {carona.comodidades?.map((comodidade, index) => (
            <InfoRow key={index}>
              <Feather name="check" size={16} color={theme.colors.success} />
              <InfoLabel>{comodidade}</InfoLabel>
            </InfoRow>
          ))}
        </SectionCard>

        <SectionCard>
          <SectionTitle>Passageiros Confirmados</SectionTitle>
          {carona.passageiros.length === 0 ? (
            <InfoLabel>Nenhum passageiro reservou ainda. Seja o primeiro!</InfoLabel>
          ) : (
            <PassengersWrap>
              {carona.passageiros.map((p) => (
                <PassengerPill key={p.id}>
                  <PassengerAvatar source={{ uri: p.foto }} />
                  <PassengerName>{p.nome}</PassengerName>
                </PassengerPill>
              ))}
            </PassengersWrap>
          )}
        </SectionCard>

        <PriceHighlight>
          <PriceLabel>Rateio sugerido de combustível</PriceLabel>
          <PriceLarge>{carona.valorRateio}</PriceLarge>
        </PriceHighlight>

        <ActionButton
          disabled={carona.vagasDisponiveis <= 0}
          onPress={handleSolicitar}
        >
          <ActionButtonText>
            {carona.vagasDisponiveis > 0 ? 'Solicitar Vaga nesta Carona' : 'Carona Lotada'}
          </ActionButtonText>
        </ActionButton>
      </Content>
    </Container>
  );
}
