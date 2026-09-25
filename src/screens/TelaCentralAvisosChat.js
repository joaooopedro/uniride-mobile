import React, { useState } from 'react';
import { FlatList } from 'react-native';
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

const Subtitle = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const QuickStatusScroll = styled.ScrollView`
  padding: 8px ${(props) => props.theme.spacing.md}px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const QuickStatusBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primaryLight};
  padding: 6px 12px;
  border-radius: ${(props) => props.theme.radii.full}px;
  margin-right: 8px;
`;

const QuickStatusText = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  margin-left: 4px;
`;

const MessageBubble = styled.View`
  max-width: 80%;
  padding: ${(props) => props.theme.spacing.sm}px ${(props) => props.theme.spacing.md}px;
  border-radius: ${(props) => props.theme.radii.md}px;
  margin-bottom: 8px;
  align-self: ${(props) => (props.propria ? 'flex-end' : 'flex-start')};
  background-color: ${(props) =>
    props.propria ? props.theme.colors.primary : props.theme.colors.surface};
  border-width: ${(props) => (props.propria ? 0 : '1px')};
  border-color: ${(props) => props.theme.colors.border};
`;

const MessageAuthor = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 700;
  color: ${(props) => (props.propria ? '#DBEAFE' : props.theme.colors.primary)};
  margin-bottom: 2px;
`;

const MessageText = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => (props.propria ? '#FFFFFF' : props.theme.colors.text)};
`;

const MessageTime = styled.Text`
  font-size: 10px;
  align-self: flex-end;
  color: ${(props) => (props.propria ? '#DBEAFE' : props.theme.colors.textMuted)};
  margin-top: 4px;
`;

const InputBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px ${(props) => props.theme.spacing.md}px;
  background-color: ${(props) => props.theme.colors.surface};
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.border};
`;

const TextInputField = styled.TextInput`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.radii.full}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  padding: 8px 16px;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.text};
  max-height: 80px;
`;

const SendButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

export default function TelaCentralAvisosChat() {
  const theme = useTheme();
  const { mensagensChat, enviarMensagem } = useCaronas();
  const [textoInput, setTextoInput] = useState('');

  const handleEnviar = () => {
    if (textoInput.trim().length === 0) return;
    enviarMensagem(textoInput.trim());
    setTextoInput('');
  };

  const handleStatusRapido = (status) => {
    enviarMensagem(status, 'status');
  };

  return (
    <Container>
      <Header>
        <Title>Central de Avisos</Title>
        <Subtitle>Chat da viagem ativa e avisos do ponto de encontro</Subtitle>
      </Header>

      <QuickStatusScroll horizontal showsHorizontalScrollIndicator={false}>
        <QuickStatusBtn onPress={() => handleStatusRapido('Cheguei no ponto de encontro!')}>
          <Feather name="map-pin" size={12} color={theme.colors.primary} />
          <QuickStatusText>Cheguei no ponto</QuickStatusText>
        </QuickStatusBtn>
        <QuickStatusBtn onPress={() => handleStatusRapido('Atraso de 5 min no trânsito!')}>
          <Feather name="clock" size={12} color={theme.colors.primary} />
          <QuickStatusText>Atraso de 5 min</QuickStatusText>
        </QuickStatusBtn>
        <QuickStatusBtn onPress={() => handleStatusRapido('Estou saindo agora!')}>
          <Feather name="navigation" size={12} color={theme.colors.primary} />
          <QuickStatusText>Saindo agora</QuickStatusText>
        </QuickStatusBtn>
        <QuickStatusBtn onPress={() => handleStatusRapido('Cheguei na portaria da faculdade!')}>
          <Feather name="check-circle" size={12} color={theme.colors.primary} />
          <QuickStatusText>Na portaria</QuickStatusText>
        </QuickStatusBtn>
      </QuickStatusScroll>

      <FlatList
        data={mensagensChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <MessageBubble propria={item.propria}>
            <MessageAuthor propria={item.propria}>{item.autor}</MessageAuthor>
            <MessageText propria={item.propria}>{item.texto}</MessageText>
            <MessageTime propria={item.propria}>{item.horario}</MessageTime>
          </MessageBubble>
        )}
      />

      <InputBar>
        <TextInputField
          placeholder="Digite uma mensagem rápida..."
          placeholderTextColor={theme.colors.textMuted}
          value={textoInput}
          onChangeText={setTextoInput}
        />
        <SendButton onPress={handleEnviar}>
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </SendButton>
      </InputBar>
    </Container>
  );
}
