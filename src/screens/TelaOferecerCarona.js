import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md}px;
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
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const CardForm = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.md}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

const Label = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 6px;
  margin-top: ${(props) => (props.noMargin ? 0 : props.theme.spacing.sm)}px;
`;

const Input = styled.TextInput`
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.radii.sm}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing.sm}px ${(props) => props.theme.spacing.md}px;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.text};
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
`;

const OptionRow = styled.View`
  flex-direction: row;
  margin-top: 4px;
`;

const OptionButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  border-radius: ${(props) => props.theme.radii.sm}px;
  background-color: ${(props) => (props.selected ? props.theme.colors.primary : props.theme.colors.background)};
  border-width: 1px;
  border-color: ${(props) => (props.selected ? props.theme.colors.primary : props.theme.colors.border)};
  align-items: center;
  margin-right: ${(props) => (props.last ? 0 : '8px')};
`;

const OptionText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  color: ${(props) => (props.selected ? '#FFFFFF' : props.theme.colors.textSecondary)};
`;

const DaysRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
`;

const DayPill = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => (props.selected ? props.theme.colors.primary : props.theme.colors.background)};
  border-width: 1px;
  border-color: ${(props) => (props.selected ? props.theme.colors.primary : props.theme.colors.border)};
  align-items: center;
  justify-content: center;
`;

const DayText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  color: ${(props) => (props.selected ? '#FFFFFF' : props.theme.colors.textSecondary)};
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  height: ${(props) => props.theme.touchTarget.minHeight}px;
  border-radius: ${(props) => props.theme.radii.md}px;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing.sm}px;
  margin-bottom: ${(props) => props.theme.spacing.xl}px;
`;

const SubmitButtonText = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  color: #FFFFFF;
`;

export default function TelaOferecerCarona({ navigation }) {
  const theme = useTheme();
  const { adicionarCarona } = useCaronas();

  const [origem, setOrigem] = useState('');
  const [pontoEncontro, setPontoEncontro] = useState('');
  const [destino, setDestino] = useState('Campus Estrela Sul');
  const [horarioSaida, setHorarioSaida] = useState('18:30');
  const [turno, setTurno] = useState('Noite');
  const [vagas, setVagas] = useState('3');
  const [valorRateio, setValorRateio] = useState('R$ 5,00');
  const [diasSelecionados, setDiasSelecionados] = useState(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);

  const toggleDia = (dia) => {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter((d) => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  };

  const handleSubmit = () => {
    if (!origem.trim() || !pontoEncontro.trim()) {
      Alert.alert('Atenção', 'Preencha o bairro de origem e o ponto de encontro.');
      return;
    }

    adicionarCarona({
      origem,
      pontoEncontro,
      destino,
      pontoDesembarque: destino.includes('Estrela') ? 'Portaria Estrela Sul' : 'Portaria Centro',
      horarioSaida,
      tolerancia: '5 min',
      turno,
      valorRateio,
      vagasTotais: parseInt(vagas, 10) || 3,
      vagasDisponiveis: parseInt(vagas, 10) || 3,
      carro: 'Chevrolet Onix Plus Prata',
      comodidades: ['Ar-condicionado', 'Porta-malas livre'],
      diasSemana: diasSelecionados,
    });

    Alert.alert('Sucesso!', 'Sua rota de carona foi publicada no feed da comunidade.', [
      {
        text: 'Ir para o Feed',
        onPress: () => navigation.navigate('MainTabs', { screen: 'Explorar' }),
      },
    ]);
  };

  return (
    <Container>
      <Content showsVerticalScrollIndicator={false}>
        <Title>Oferecer Carona</Title>
        <Subtitle>Cadastre sua rota e divida os custos de combustível</Subtitle>

        <CardForm>
          <Label noMargin>Bairro de Partida</Label>
          <Input
            placeholder="Ex: São Mateus, Cascatinha, Granbery"
            placeholderTextColor={theme.colors.textMuted}
            value={origem}
            onChangeText={setOrigem}
          />

          <Label>Ponto de Embarque Exato</Label>
          <Input
            placeholder="Ex: Praça do São Mateus, Posto Shell"
            placeholderTextColor={theme.colors.textMuted}
            value={pontoEncontro}
            onChangeText={setPontoEncontro}
          />

          <Label>Campus de Destino</Label>
          <OptionRow>
            <OptionButton
              selected={destino === 'Campus Estrela Sul'}
              onPress={() => setDestino('Campus Estrela Sul')}
            >
              <OptionText selected={destino === 'Campus Estrela Sul'}>Campus Estrela Sul</OptionText>
            </OptionButton>
            <OptionButton
              last
              selected={destino === 'Campus Academia (Centro)'}
              onPress={() => setDestino('Campus Academia (Centro)')}
            >
              <OptionText selected={destino === 'Campus Academia (Centro)'}>Campus Centro</OptionText>
            </OptionButton>
          </OptionRow>

          <Label>Turno e Horário</Label>
          <OptionRow>
            <OptionButton
              selected={turno === 'Noite'}
              onPress={() => {
                setTurno('Noite');
                setHorarioSaida('18:30');
              }}
            >
              <OptionText selected={turno === 'Noite'}>Noite (18:30)</OptionText>
            </OptionButton>
            <OptionButton
              last
              selected={turno === 'Manhã'}
              onPress={() => {
                setTurno('Manhã');
                setHorarioSaida('07:15');
              }}
            >
              <OptionText selected={turno === 'Manhã'}>Manhã (07:15)</OptionText>
            </OptionButton>
          </OptionRow>

          <Label>Dias Recorrentes da Semana</Label>
          <DaysRow>
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia) => (
              <DayPill
                key={dia}
                selected={diasSelecionados.includes(dia)}
                onPress={() => toggleDia(dia)}
              >
                <DayText selected={diasSelecionados.includes(dia)}>{dia}</DayText>
              </DayPill>
            ))}
          </DaysRow>

          <Label>Vagas Disponíveis e Rateio Sugerido</Label>
          <OptionRow>
            <Input
              style={{ flex: 1, marginRight: 8 }}
              placeholder="Vagas (1-4)"
              keyboardType="numeric"
              value={vagas}
              onChangeText={setVagas}
            />
            <Input
              style={{ flex: 1 }}
              placeholder="Valor (R$)"
              value={valorRateio}
              onChangeText={setValorRateio}
            />
          </OptionRow>
        </CardForm>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Publicar Rota de Carona</SubmitButtonText>
        </SubmitButton>
      </Content>
    </Container>
  );
}
