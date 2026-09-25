import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const HeaderContainer = styled.View`
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

const Subtitle = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: ${(props) => props.theme.spacing.xs}px;
`;

const SearchBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: 0 ${(props) => props.theme.spacing.md}px;
  margin-top: ${(props) => props.theme.spacing.md}px;
  height: 46px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.text};
  margin-left: ${(props) => props.theme.spacing.sm}px;
`;

const FilterScroll = styled.ScrollView`
  margin-top: ${(props) => props.theme.spacing.mdSm}px;
`;

const FilterChip = styled.TouchableOpacity`
  padding: ${(props) => props.theme.spacing.sm}px ${(props) => props.theme.spacing.md}px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.surface)};
  border-width: 1px;
  border-color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.border)};
  margin-right: ${(props) => props.theme.spacing.sm}px;
`;

const FilterChipText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: ${(props) => props.theme.typography.caption.fontWeight};
  color: ${(props) => (props.active ? '#FFFFFF' : props.theme.colors.textSecondary)};
`;

const CaronaCard = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  margin: ${(props) => props.theme.spacing.sm}px ${(props) => props.theme.spacing.md}px;
  padding: ${(props) => props.theme.spacing.md}px;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DriverRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DriverAvatar = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.border};
`;

const DriverInfo = styled.View`
  margin-left: ${(props) => props.theme.spacing.sm}px;
`;

const DriverName = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: ${(props) => props.theme.typography.cardTitle.fontWeight};
  color: ${(props) => props.theme.colors.text};
`;

const DriverCourse = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const RatingBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.warningLight};
  padding: 4px 8px;
  border-radius: ${(props) => props.theme.radii.sm}px;
`;

const RatingText = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: ${(props) => props.theme.typography.micro.fontWeight};
  color: ${(props) => props.theme.colors.warning};
  margin-left: 2px;
`;

const RouteBlock = styled.View`
  margin-top: ${(props) => props.theme.spacing.md}px;
  padding-top: ${(props) => props.theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.borderLight};
`;

const RoutePoint = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const RouteText = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.text};
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-weight: ${(props) => (props.bold ? '600' : '400')};
`;

const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.md}px;
  padding-top: ${(props) => props.theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.borderLight};
`;

const VacancyBadge = styled.View`
  background-color: ${(props) => (props.hasSpots ? props.theme.colors.successLight : props.theme.colors.dangerLight)};
  padding: 4px 10px;
  border-radius: ${(props) => props.theme.radii.full}px;
`;

const VacancyText = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: ${(props) => props.theme.typography.micro.fontWeight};
  color: ${(props) => (props.hasSpots ? props.theme.colors.success : props.theme.colors.danger)};
`;

const PriceText = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl}px;
`;

const EmptyText = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: ${(props) => props.theme.spacing.md}px;
  text-align: center;
`;

export default function TelaFeedCaronas({ navigation }) {
  const theme = useTheme();
  const { filtrarCaronas } = useCaronas();
  const [busca, setBusca] = useState('');
  const [campusFiltro, setCampusFiltro] = useState('Todos');
  const [turnoFiltro, setTurnoFiltro] = useState('Todos');

  const caronasFiltradas = filtrarCaronas({
    campus: campusFiltro,
    turno: turnoFiltro,
    busca,
    apenasComVagas: false,
  });

  return (
    <Container>
      <HeaderContainer>
        <Title>Explorar Caronas</Title>
        <Subtitle>Rotas universitárias para os campi da UniAcademia</Subtitle>

        <SearchBox>
          <Feather name="search" size={20} color={theme.colors.textSecondary} />
          <SearchInput
            placeholder="Buscar por bairro, campus ou motorista..."
            placeholderTextColor={theme.colors.textMuted}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Feather name="x" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </SearchBox>

        <FilterScroll horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip
            active={campusFiltro === 'Todos'}
            onPress={() => setCampusFiltro('Todos')}
          >
            <FilterChipText active={campusFiltro === 'Todos'}>Todos os Campi</FilterChipText>
          </FilterChip>
          <FilterChip
            active={campusFiltro === 'Estrela Sul'}
            onPress={() => setCampusFiltro('Estrela Sul')}
          >
            <FilterChipText active={campusFiltro === 'Estrela Sul'}>Campus Estrela Sul</FilterChipText>
          </FilterChip>
          <FilterChip
            active={campusFiltro === 'Academia'}
            onPress={() => setCampusFiltro('Academia')}
          >
            <FilterChipText active={campusFiltro === 'Academia'}>Campus Academia (Centro)</FilterChipText>
          </FilterChip>
          <FilterChip
            active={turnoFiltro === 'Noite'}
            onPress={() => setTurnoFiltro(turnoFiltro === 'Noite' ? 'Todos' : 'Noite')}
          >
            <FilterChipText active={turnoFiltro === 'Noite'}>Turno Noite</FilterChipText>
          </FilterChip>
          <FilterChip
            active={turnoFiltro === 'Manhã'}
            onPress={() => setTurnoFiltro(turnoFiltro === 'Manhã' ? 'Todos' : 'Manhã')}
          >
            <FilterChipText active={turnoFiltro === 'Manhã'}>Turno Manhã</FilterChipText>
          </FilterChip>
        </FilterScroll>
      </HeaderContainer>

      <FlatList
        data={caronasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <CaronaCard
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DetalhesCarona', { carona: item })}
          >
            <CardHeader>
              <DriverRow>
                <DriverAvatar source={{ uri: item.motorista.foto }} />
                <DriverInfo>
                  <DriverName>{item.motorista.nome}</DriverName>
                  <DriverCourse>{item.motorista.curso}</DriverCourse>
                </DriverInfo>
              </DriverRow>
              <RatingBadge>
                <Ionicons name="star" size={14} color={theme.colors.warning} />
                <RatingText>{item.motorista.nota.toFixed(1)}</RatingText>
              </RatingBadge>
            </CardHeader>

            <RouteBlock>
              <RoutePoint>
                <Feather name="circle" size={14} color={theme.colors.primary} />
                <RouteText>{item.origem} • Saída {item.horarioSaida}</RouteText>
              </RoutePoint>
              <RoutePoint>
                <Feather name="map-pin" size={14} color={theme.colors.danger} />
                <RouteText bold>{item.destino}</RouteText>
              </RoutePoint>
            </RouteBlock>

            <CardFooter>
              <VacancyBadge hasSpots={item.vagasDisponiveis > 0}>
                <VacancyText hasSpots={item.vagasDisponiveis > 0}>
                  {item.vagasDisponiveis > 0
                    ? `${item.vagasDisponiveis} vaga${item.vagasDisponiveis > 1 ? 's' : ''} restante${item.vagasDisponiveis > 1 ? 's' : ''}`
                    : 'Lotado'}
                </VacancyText>
              </VacancyBadge>
              <PriceText>{item.valorRateio}</PriceText>
            </CardFooter>
          </CaronaCard>
        )}
        ListEmptyComponent={
          <EmptyContainer>
            <Feather name="search" size={48} color={theme.colors.textMuted} />
            <EmptyText>Nenhuma carona encontrada para os filtros selecionados.</EmptyText>
          </EmptyContainer>
        }
      />
    </Container>
  );
}
