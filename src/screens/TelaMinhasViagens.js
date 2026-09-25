import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  padding: ${(props) => props.theme.spacing.md}px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

const Title = styled.Text`
  font-size: ${(props) => props.theme.typography.display.fontSize}px;
  font-weight: ${(props) => props.theme.typography.display.fontWeight};
  color: ${(props) => props.theme.colors.text};
`;

const TabsRow = styled.View`
  flex-direction: row;
  margin-top: ${(props) => props.theme.spacing.md}px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.radii.sm}px;
  padding: 4px;
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  padding: 8px 0;
  border-radius: ${(props) => props.theme.radii.sm}px;
  background-color: ${(props) => (props.active ? props.theme.colors.surface : 'transparent')};
  align-items: center;
`;

const TabText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: ${(props) => (props.active ? '700' : '500')};
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.textSecondary)};
`;

const ViagemCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  margin: ${(props) => props.theme.spacing.sm}px ${(props) => props.theme.spacing.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
`;

const CardTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StatusPill = styled.View`
  padding: 4px 8px;
  border-radius: ${(props) => props.theme.radii.sm}px;
  background-color: ${(props) => {
    if (props.status === 'Confirmada') return props.theme.colors.successLight;
    if (props.status === 'Aguardando Saída') return props.theme.colors.warningLight;
    return props.theme.colors.primaryLight;
  }};
`;

const StatusText = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 700;
  color: ${(props) => {
    if (props.status === 'Confirmada') return props.theme.colors.success;
    if (props.status === 'Aguardando Saída') return props.theme.colors.warning;
    return props.theme.colors.primary;
  }};
`;

const RoleTag = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  font-weight: 600;
`;

const RouteText = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const DetailsText = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const ActionsRow = styled.View`
  flex-direction: row;
  margin-top: ${(props) => props.theme.spacing.md}px;
  padding-top: ${(props) => props.theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.borderLight};
`;

const ActionBtn = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: ${(props) => props.theme.radii.sm}px;
  background-color: ${(props) => (props.danger ? props.theme.colors.dangerLight : props.theme.colors.primaryLight)};
  margin-right: ${(props) => (props.last ? 0 : '8px')};
`;

const ActionBtnText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  color: ${(props) => (props.danger ? props.theme.colors.danger : props.theme.colors.primary)};
  margin-left: 4px;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl}px;
`;

const EmptyText = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 12px;
  text-align: center;
`;

export default function TelaMinhasViagens({ navigation }) {
  const theme = useTheme();
  const { minhasViagens, cancelarReserva } = useCaronas();
  const [abaAtiva, setAbaAtiva] = useState('passageiro');
  const [refreshing, setRefreshing] = useState(false);

  const viagensFiltradas = minhasViagens.filter((v) => v.tipo === abaAtiva);

  const handleCancelar = (viagem) => {
    Alert.alert(
      'Cancelar Viagem',
      `Tem certeza que deseja cancelar sua ${viagem.tipo === 'passageiro' ? 'reserva' : 'oferta de carona'}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: () => cancelarReserva(viagem.id, viagem.caronaId),
        },
      ]
    );
  };

  return (
    <Container>
      <Header>
        <Title>Minhas Viagens</Title>
        <TabsRow>
          <TabButton
            active={abaAtiva === 'passageiro'}
            onPress={() => setAbaAtiva('passageiro')}
          >
            <TabText active={abaAtiva === 'passageiro'}>Como Passageiro</TabText>
          </TabButton>
          <TabButton
            active={abaAtiva === 'motorista'}
            onPress={() => setAbaAtiva('motorista')}
          >
            <TabText active={abaAtiva === 'motorista'}>Como Motorista</TabText>
          </TabButton>
        </TabsRow>
      </Header>

      <FlatList
        data={viagensFiltradas}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 500);
            }}
          />
        }
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <ViagemCard>
            <CardTop>
              <RoleTag>
                {item.tipo === 'passageiro' ? `Motorista: ${item.motoristaNome}` : 'Sua rota oferecida'}
              </RoleTag>
              <StatusPill status={item.status}>
                <StatusText status={item.status}>{item.status}</StatusText>
              </StatusPill>
            </CardTop>

            <RouteText>{item.origem} → {item.destino}</RouteText>
            <DetailsText>Saída: {item.horarioSaida} • Rateio: {item.valor}</DetailsText>
            <DetailsText>{item.carro}</DetailsText>

            <ActionsRow>
              <ActionBtn
                onPress={() => navigation.navigate('MainTabs', { screen: 'Avisos' })}
              >
                <Feather name="message-square" size={14} color={theme.colors.primary} />
                <ActionBtnText>Abrir Chat</ActionBtnText>
              </ActionBtn>
              <ActionBtn
                last
                danger
                onPress={() => handleCancelar(item)}
              >
                <Feather name="x-circle" size={14} color={theme.colors.danger} />
                <ActionBtnText>Cancelar</ActionBtnText>
              </ActionBtn>
            </ActionsRow>
          </ViagemCard>
        )}
        ListEmptyComponent={
          <EmptyState>
            <Feather name="calendar" size={44} color={theme.colors.textMuted} />
            <EmptyText>
              {abaAtiva === 'passageiro'
                ? 'Você não possui reservas ativas como passageiro.'
                : 'Você não está oferecendo nenhuma carona no momento.'}
            </EmptyText>
          </EmptyState>
        }
      />
    </Container>
  );
}
