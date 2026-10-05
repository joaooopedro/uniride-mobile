import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';
import CardCarona from '../components/CardCarona';

const Container = styled.View`flex: 1; background-color: ${(props) => props.theme.colors.background};`;
const HeaderContent = styled.View`padding: ${(props) => props.theme.spacing.md}px ${(props) => props.theme.spacing.md}px ${(props) => props.theme.spacing.sm}px;`;
const Greeting = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.body.fontSize}px; line-height: 20px;`;
const Title = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.display.fontSize}px; font-weight: 700; line-height: ${(props) => props.theme.typography.display.lineHeight}px; margin-top: 2px;`;
const SearchField = styled.View`min-height: ${(props) => props.theme.touchTarget.minHeight}px; flex-direction: row; align-items: center; background-color: ${(props) => props.theme.colors.surface}; border-width: 1px; border-color: ${(props) => props.theme.colors.border}; border-radius: ${(props) => props.theme.radii.sm}px; padding-left: ${(props) => props.theme.spacing.md}px; margin-top: ${(props) => props.theme.spacing.md}px;`;
const SearchInput = styled.TextInput`flex: 1; min-height: 44px; color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.body.fontSize}px; padding: 0 ${(props) => props.theme.spacing.sm}px;`;
const ClearButton = styled.TouchableOpacity`width: 44px; height: 44px; align-items: center; justify-content: center;`;
const FiltersLabel = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px; font-weight: 600; margin: ${(props) => props.theme.spacing.lg}px ${(props) => props.theme.spacing.md}px ${(props) => props.theme.spacing.sm}px;`;
const FiltersScroll = styled.ScrollView.attrs({
  contentContainerStyle: { paddingRight: 16, alignItems: 'center' },
})`height: 52px; flex-grow: 0; flex-shrink: 0; padding-left: ${(props) => props.theme.spacing.md}px;`;
const FilterChip = styled.TouchableOpacity`min-height: ${(props) => props.theme.touchTarget.minHeight}px; flex-shrink: 0; flex-direction: row; align-items: center; border-width: 1px; border-color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.border)}; background-color: ${(props) => (props.active ? props.theme.colors.primaryLight : props.theme.colors.surface)}; border-radius: ${(props) => props.theme.radii.full}px; padding: 0 ${(props) => props.theme.spacing.md}px; margin-right: ${(props) => props.theme.spacing.sm}px;`;
const FilterChipText = styled.Text`color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.textSecondary)}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; font-weight: 600; flex-shrink: 0; margin-left: ${(props) => (props.hasIcon ? props.theme.spacing.sm : 0)}px;`;
const ResultsLabel = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.caption.fontSize}px; margin: ${(props) => props.theme.spacing.lg}px ${(props) => props.theme.spacing.md}px ${(props) => props.theme.spacing.sm}px;`;
const ResultsList = styled(FlatList).attrs({ contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 24 }, showsVerticalScrollIndicator: false })``;
const EmptyState = styled.View`align-items: center; padding: ${(props) => props.theme.spacing.xl}px ${(props) => props.theme.spacing.lg}px;`;
const EmptyIcon = styled.View`width: 64px; height: 64px; border-radius: ${(props) => props.theme.radii.full}px; align-items: center; justify-content: center; background-color: ${(props) => props.theme.colors.primaryLight}; margin-bottom: ${(props) => props.theme.spacing.md}px;`;
const EmptyTitle = styled.Text`color: ${(props) => props.theme.colors.text}; font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px; font-weight: 600; text-align: center;`;
const EmptyDescription = styled.Text`color: ${(props) => props.theme.colors.textSecondary}; font-size: ${(props) => props.theme.typography.body.fontSize}px; line-height: 20px; text-align: center; margin-top: ${(props) => props.theme.spacing.sm}px;`;

function textoPesquisavel(valor) {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function TelaFeedCaronas({ navigation }) {
  const { usuarioLogado, caronasDisponiveis } = useCaronas();
  const [textoBusca, setTextoBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [campusSelecionado, setCampusSelecionado] = useState('Todos');
  const [turnoSelecionado, setTurnoSelecionado] = useState(null);
  const [somenteComVagas, setSomenteComVagas] = useState(false);

  useEffect(() => {
    const debounceBusca = setTimeout(() => setBuscaAplicada(textoBusca.trim()), 300);
    return () => clearTimeout(debounceBusca);
  }, [textoBusca]);

  const caronasFiltradas = useMemo(() => {
    const buscaNormalizada = textoPesquisavel(buscaAplicada);
    return caronasDisponiveis.filter((carona) => {
      const rotaPesquisavel = textoPesquisavel(`${carona.bairroOrigem} ${carona.campusDestino} ${carona.motorista}`);
      const atendeBusca = !buscaNormalizada || rotaPesquisavel.includes(buscaNormalizada);
      const atendeCampus = campusSelecionado === 'Todos' || carona.campusDestino === campusSelecionado;
      const atendeTurno = !turnoSelecionado || carona.turno === turnoSelecionado;
      const atendeVagas = !somenteComVagas || carona.vagasRestantes > 0;
      return atendeBusca && atendeCampus && atendeTurno && atendeVagas;
    });
  }, [buscaAplicada, campusSelecionado, caronasDisponiveis, somenteComVagas, turnoSelecionado]);

  const alternarTurno = (turno) => setTurnoSelecionado((turnoAtual) => (turnoAtual === turno ? null : turno));
  const abrirDetalhes = (carona) => navigation.navigate('DetalhesCarona', { caronaId: carona.id });

  return (
    <Container>
      <HeaderContent>
        <Greeting>Olá, {usuarioLogado.nome.split(' ')[0]}</Greeting>
        <Title>Encontre sua carona</Title>
        <SearchField>
          <Feather name="search" size={20} color="#64748B" />
          <SearchInput value={textoBusca} onChangeText={setTextoBusca} placeholder="Busque por bairro ou campus" placeholderTextColor="#94A3B8" returnKeyType="search" />
          {textoBusca.length > 0 && <ClearButton onPress={() => setTextoBusca('')} accessibilityLabel="Limpar busca"><Feather name="x-circle" size={20} color="#64748B" /></ClearButton>}
        </SearchField>
      </HeaderContent>
      <FiltersLabel>Filtros rápidos</FiltersLabel>
      <FiltersScroll horizontal showsHorizontalScrollIndicator={false}>
        <FilterChip active={campusSelecionado === 'Todos'} onPress={() => setCampusSelecionado('Todos')}><FilterChipText active={campusSelecionado === 'Todos'}>Todos</FilterChipText></FilterChip>
        <FilterChip active={campusSelecionado === 'Campus Academia (Centro)'} onPress={() => setCampusSelecionado('Campus Academia (Centro)')}><FilterChipText active={campusSelecionado === 'Campus Academia (Centro)'}>Campus Academia (Centro)</FilterChipText></FilterChip>
        <FilterChip active={campusSelecionado === 'Campus Estrela Sul'} onPress={() => setCampusSelecionado('Campus Estrela Sul')}><FilterChipText active={campusSelecionado === 'Campus Estrela Sul'}>Campus Estrela Sul</FilterChipText></FilterChip>
        <FilterChip active={turnoSelecionado === 'Manhã'} onPress={() => alternarTurno('Manhã')}><Feather name="sun" size={16} color={turnoSelecionado === 'Manhã' ? '#2563EB' : '#64748B'} /><FilterChipText active={turnoSelecionado === 'Manhã'} hasIcon>Manhã</FilterChipText></FilterChip>
        <FilterChip active={turnoSelecionado === 'Noite'} onPress={() => alternarTurno('Noite')}><Feather name="moon" size={16} color={turnoSelecionado === 'Noite' ? '#2563EB' : '#64748B'} /><FilterChipText active={turnoSelecionado === 'Noite'} hasIcon>Noite</FilterChipText></FilterChip>
        <FilterChip active={somenteComVagas} onPress={() => setSomenteComVagas((filtroAtivo) => !filtroAtivo)}><Feather name="users" size={16} color={somenteComVagas ? '#2563EB' : '#64748B'} /><FilterChipText active={somenteComVagas} hasIcon>Com vagas disponíveis</FilterChipText></FilterChip>
      </FiltersScroll>
      <ResultsLabel>{caronasFiltradas.length} {caronasFiltradas.length === 1 ? 'carona encontrada' : 'caronas encontradas'}</ResultsLabel>
      <ResultsList
        data={caronasFiltradas}
        keyExtractor={(carona) => carona.id}
        renderItem={({ item: carona }) => <CardCarona carona={carona} onVerDetalhes={abrirDetalhes} />}
        ListEmptyComponent={<EmptyState><EmptyIcon><Feather name="search" size={28} color="#2563EB" /></EmptyIcon><EmptyTitle>Nenhuma carona encontrada</EmptyTitle><EmptyDescription>Altere a busca ou remova algum filtro para ver outras rotas.</EmptyDescription></EmptyState>}
      />
    </Container>
  );
}
