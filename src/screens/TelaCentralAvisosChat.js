import React, { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import styled, { useTheme } from "styled-components/native";
import MotionPressable from "../components/MotionPressable";
import EstadoViagem from "../components/EstadoViagem";
import { useInterface } from "../context/InterfaceContext";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";

import BalaoMensagem from "../components/BalaoMensagem";
import BotaoStatusRapido from "../components/BotaoStatusRapido";
import { useAvisos } from "../context/AvisosContext";
import { useCaronas } from "../context/CaronasContext";
import {
  AVISOS_RAPIDOS,
  CATEGORIAS_AVISO,
  TIPOS_MENSAGEM,
} from "../services/mockData";

const ABAS = {
  chat: "chat",
  avisos: "avisos",
};

const VISUAL_CATEGORIA_AVISO = {
  [CATEGORIAS_AVISO.transito]: {
    icone: "car-outline",
    cor: "warning",
    fundo: "warningLight",
  },
  [CATEGORIAS_AVISO.campus]: {
    icone: "school-outline",
    cor: "primary",
    fundo: "primaryLight",
  },
  [CATEGORIAS_AVISO.seguranca]: {
    icone: "shield-checkmark-outline",
    cor: "success",
    fundo: "successLight",
  },
  [CATEGORIAS_AVISO.reserva]: {
    icone: "checkmark-circle-outline",
    cor: "success",
    fundo: "successLight",
  },
  [CATEGORIAS_AVISO.rota]: {
    icone: "map-outline",
    cor: "secondary",
    fundo: "secondaryLight",
  },
  [CATEGORIAS_AVISO.cancelamento]: {
    icone: "close-circle-outline",
    cor: "danger",
    fundo: "dangerLight",
  },
};

const formatarTempoDecorrido = (data) => {
  const minutos = Math.floor((Date.now() - data.getTime()) / 60000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  return horas < 48 ? "ontem" : `há ${Math.floor(horas / 24)} dias`;
};

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const CartaoViagem = styled.View`
  margin: 12px 24px 0px;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

const CabecalhoCartao = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RotuloViagem = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.textSecondary};

  font-family: ${(props) => props.theme.fonts.medium};
`;

const Trajeto = styled.Text`
  margin-top: ${(props) => props.theme.spacing.xs}px;
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 600;
  line-height: ${(props) => props.theme.typography.cardTitle.lineHeight}px;
  color: ${(props) => props.theme.colors.text};

  font-family: ${(props) => props.theme.fonts.semibold};
`;

const LinhaMotorista = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;

const AvatarMotorista = styled.View`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.primaryLight};
`;

const IniciaisMotorista = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};

  font-family: ${(props) => props.theme.fonts.bold};
`;

const ConversaVazia = styled.Text`
  margin-top: ${(props) => props.theme.spacing.lg}px;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const DetalheMotorista = styled.Text`
  flex: 1;
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.textSecondary};

  font-family: ${(props) => props.theme.fonts.medium};
`;

const SeletorAbas = styled.View`
  flex-direction: row;
  margin: 12px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

const BotaoAba = styled(MotionPressable)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border-bottom-width: 2px;
  border-bottom-color: ${(props) =>
    props.ativa ? props.theme.colors.primary : "transparent"};
`;

const TextoAba = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: ${(props) => (props.ativa ? "600" : "500")};
  color: ${(props) =>
    props.ativa
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};

  font-family: ${(props) => props.theme.fonts.regular};
`;

const ContadorNaoLidos = styled.View`
  min-width: 18px;
  height: 18px;
  margin-left: 6px;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.danger};
`;

const TextoContador = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.surface};

  font-family: ${(props) => props.theme.fonts.bold};
`;

const CarrosselAvisosRapidos = styled.ScrollView.attrs((props) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  keyboardShouldPersistTaps: "handled",
  contentContainerStyle: {
    paddingHorizontal: props.theme.spacing.md,
    paddingBottom: props.theme.spacing.sm,
  },
}))`
  flex-grow: 0;
  flex-shrink: 0;
`;

const BarraEnvio = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm}px
    ${(props) => props.theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.surface};
`;

const CampoMensagem = styled.TextInput`
  flex: 1;
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  padding: 0 ${(props) => props.theme.spacing.mdSm}px;
  border-radius: ${(props) => props.theme.radii.sm}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.background};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  color: ${(props) => props.theme.colors.text};

  font-family: ${(props) => props.theme.fonts.regular};
`;

const BotaoEnviar = styled(MotionPressable)`
  width: 44px;
  height: 44px;
  margin-left: ${(props) => props.theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) =>
    props.habilitado ? props.theme.colors.primary : props.theme.colors.border};
`;

const CartaoAviso = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
  padding: 20px 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

const IconeCategoria = styled.View`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
`;

const ConteudoAviso = styled.View`
  flex: 1;
  margin-left: ${(props) => props.theme.spacing.mdSm}px;
`;

const TituloAviso = styled.Text`
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 600;
  line-height: ${(props) => props.theme.typography.cardTitle.lineHeight}px;
  color: ${(props) => props.theme.colors.text};

  font-family: ${(props) => props.theme.fonts.semibold};
`;

const DescricaoAviso = styled.Text`
  margin-top: 2px;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  color: ${(props) => props.theme.colors.textSecondary};

  font-family: ${(props) => props.theme.fonts.regular};
`;

const TempoAviso = styled.Text`
  margin-top: 6px;
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.textMuted};

  font-family: ${(props) => props.theme.fonts.medium};
`;

const EstadoVazio = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg}px;
`;

const IconeEstadoVazio = styled.View`
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.primaryLight};
`;

const TituloEstadoVazio = styled.Text`
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  text-align: center;

  font-family: ${(props) => props.theme.fonts.semibold};
`;

const DescricaoEstadoVazio = styled.Text`
  margin-top: ${(props) => props.theme.spacing.sm}px;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;

  font-family: ${(props) => props.theme.fonts.regular};
`;

const BotaoEstadoVazio = styled(MotionPressable)`
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  margin-top: ${(props) => props.theme.spacing.lg}px;
  padding: 0 ${(props) => props.theme.spacing.lg}px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) => props.theme.colors.primary};
`;

const TextoBotaoEstadoVazio = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.surface};

  font-family: ${(props) => props.theme.fonts.semibold};
`;

export default function TelaCentralAvisosChat({ navigation, route }) {
  const { podeAnimar } = useInterface();
  const theme = useTheme();
  const alturaCabecalho = useHeaderHeight();
  const telaEmFoco = useIsFocused();
  const listaMensagensRef = useRef(null);
  const [abaAtiva, setAbaAtiva] = useState(ABAS.chat);
  const [textoDigitado, setTextoDigitado] = useState("");
  const { usuarioLogado, caronasDisponiveis, reservas } = useCaronas();
  const {
    mensagensChat,
    mensagensNaoLidas,
    avisos,
    avisosNaoLidos,
    enviarMensagem,
    marcarChatComoLido,
    marcarAvisosComoLidos,
  } = useAvisos();

  const reservaEmAndamento = reservas.find(
    (reserva) => reserva.status === "Em Andamento",
  );
  const ultimaMensagem = mensagensChat[mensagensChat.length - 1];
  const caronaIdDaConversa =
    route.params?.caronaId ??
    reservaEmAndamento?.caronaId ??
    ultimaMensagem?.caronaId;
  const caronaDaConversa = caronasDisponiveis.find(
    (carona) => carona.id === caronaIdDaConversa,
  );
  const statusDaConversa =
    reservas.find((reserva) => reserva.caronaId === caronaIdDaConversa)
      ?.status ?? caronaDaConversa?.statusViagem;
  const mensagensDaConversa = mensagensChat.filter(
    (mensagem) => mensagem.caronaId === caronaIdDaConversa,
  );

  useEffect(() => {
    if (!telaEmFoco) return;
    if (abaAtiva === ABAS.chat && mensagensNaoLidas > 0) marcarChatComoLido();
    if (abaAtiva === ABAS.avisos && avisosNaoLidos > 0) marcarAvisosComoLidos();
  }, [
    telaEmFoco,
    abaAtiva,
    mensagensNaoLidas,
    avisosNaoLidos,
    marcarChatComoLido,
    marcarAvisosComoLidos,
  ]);

  const opcoesAbas = [
    { id: ABAS.chat, rotulo: "Chat da carona", naoLidos: mensagensNaoLidas },
    { id: ABAS.avisos, rotulo: "Avisos gerais", naoLidos: avisosNaoLidos },
  ];

  const textoPronto = textoDigitado.trim().length > 0;

  function enviarTextoDigitado() {
    enviarMensagem(caronaIdDaConversa, textoDigitado);
    setTextoDigitado("");
  }

  function identificarAutor(nomeAutor) {
    if (nomeAutor === usuarioLogado.nome) return "Você";
    if (nomeAutor === caronaDaConversa.motorista)
      return `${nomeAutor} · Motorista`;
    return nomeAutor;
  }

  function iconeDoAvisoRapido(mensagem) {
    if (mensagem.tipo !== TIPOS_MENSAGEM.aviso) return undefined;
    const avisoRapido = AVISOS_RAPIDOS.find(
      (aviso) => aviso.texto === mensagem.texto,
    );
    return avisoRapido ? avisoRapido.icone : "megaphone-outline";
  }

  return (
    <Container behavior="padding" keyboardVerticalOffset={alturaCabecalho}>
      {caronaDaConversa && (
        <CartaoViagem>
          <CabecalhoCartao>
            <RotuloViagem>
              {statusDaConversa === "Em Andamento" ? "Viagem ativa" : "Carona"}
            </RotuloViagem>
            {statusDaConversa && <EstadoViagem status={statusDaConversa} />}
          </CabecalhoCartao>
          <Trajeto>
            {caronaDaConversa.bairroOrigem} → {caronaDaConversa.campusDestino}
          </Trajeto>
          <LinhaMotorista>
            <AvatarMotorista>
              <IniciaisMotorista>
                {caronaDaConversa.iniciaisMotorista}
              </IniciaisMotorista>
            </AvatarMotorista>
            <DetalheMotorista numberOfLines={1}>
              {caronaDaConversa.motorista} · {caronaDaConversa.modeloCarro} ·
              Saída {caronaDaConversa.horarioSaida}
            </DetalheMotorista>
          </LinhaMotorista>
        </CartaoViagem>
      )}

      <SeletorAbas accessibilityRole="tablist">
        {opcoesAbas.map((opcaoAba) => (
          <BotaoAba
            key={opcaoAba.id}
            ativa={abaAtiva === opcaoAba.id}
            onPress={() => setAbaAtiva(opcaoAba.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: abaAtiva === opcaoAba.id }}
          >
            <TextoAba ativa={abaAtiva === opcaoAba.id}>
              {opcaoAba.rotulo}
            </TextoAba>
            {opcaoAba.naoLidos > 0 && (
              <ContadorNaoLidos>
                <TextoContador>{opcaoAba.naoLidos}</TextoContador>
              </ContadorNaoLidos>
            )}
          </BotaoAba>
        ))}
      </SeletorAbas>

      {abaAtiva === ABAS.chat && caronaDaConversa && (
        <>
          <CarrosselAvisosRapidos>
            {AVISOS_RAPIDOS.map((avisoRapido) => (
              <BotaoStatusRapido
                key={avisoRapido.id}
                texto={avisoRapido.texto}
                icone={avisoRapido.icone}
                onPress={() =>
                  enviarMensagem(
                    caronaIdDaConversa,
                    avisoRapido.texto,
                    TIPOS_MENSAGEM.aviso,
                  )
                }
              />
            ))}
          </CarrosselAvisosRapidos>

          <FlatList
            ref={listaMensagensRef}
            data={mensagensDaConversa}
            keyExtractor={(mensagem) => mensagem.id}
            renderItem={({ item: mensagem }) => (
              <BalaoMensagem
                mensagem={mensagem}
                enviada={mensagem.autor === usuarioLogado.nome}
                rotuloAutor={identificarAutor(mensagem.autor)}
                iconeAviso={iconeDoAvisoRapido(mensagem)}
              />
            )}
            contentContainerStyle={{ padding: theme.spacing.md }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <ConversaVazia>
                Nenhuma mensagem ainda. Use os avisos rápidos para falar com o
                grupo.
              </ConversaVazia>
            }
            onContentSizeChange={() =>
              listaMensagensRef.current?.scrollToEnd({ animated: podeAnimar })
            }
          />

          <BarraEnvio>
            <CampoMensagem
              value={textoDigitado}
              onChangeText={setTextoDigitado}
              placeholder="Mensagem para o grupo"
              placeholderTextColor={theme.colors.textMuted}
              returnKeyType="send"
              submitBehavior="submit"
              onSubmitEditing={enviarTextoDigitado}
              maxLength={280}
            />
            <BotaoEnviar
              habilitado={textoPronto}
              disabled={!textoPronto}
              onPress={enviarTextoDigitado}
              accessibilityRole="button"
              accessibilityLabel="Enviar mensagem"
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  textoPronto ? theme.colors.surface : theme.colors.textMuted
                }
              />
            </BotaoEnviar>
          </BarraEnvio>
        </>
      )}

      {abaAtiva === ABAS.chat && !caronaDaConversa && (
        <EstadoVazio>
          <IconeEstadoVazio>
            <Ionicons
              name="chatbubbles-outline"
              size={32}
              color={theme.colors.primary}
            />
          </IconeEstadoVazio>
          <TituloEstadoVazio>Nenhuma viagem em andamento</TituloEstadoVazio>
          <DescricaoEstadoVazio>
            Quando sua carona sair, o chat do ponto de encontro aparece aqui.
          </DescricaoEstadoVazio>
          <BotaoEstadoVazio onPress={() => navigation.navigate("Explorar")}>
            <TextoBotaoEstadoVazio>Buscar carona</TextoBotaoEstadoVazio>
          </BotaoEstadoVazio>
        </EstadoVazio>
      )}

      {abaAtiva === ABAS.avisos && (
        <FlatList
          data={avisos}
          keyExtractor={(aviso) => aviso.id}
          contentContainerStyle={{ padding: theme.spacing.md }}
          renderItem={({ item: aviso }) => {
            const visualCategoria = VISUAL_CATEGORIA_AVISO[aviso.categoria];
            return (
              <CartaoAviso>
                <IconeCategoria fundo={theme.colors[visualCategoria.fundo]}>
                  <Ionicons
                    name={visualCategoria.icone}
                    size={20}
                    color={theme.colors[visualCategoria.cor]}
                  />
                </IconeCategoria>
                <ConteudoAviso>
                  <TituloAviso>{aviso.titulo}</TituloAviso>
                  <DescricaoAviso>{aviso.descricao}</DescricaoAviso>
                  <TempoAviso>
                    {formatarTempoDecorrido(aviso.criadoEm)}
                  </TempoAviso>
                </ConteudoAviso>
              </CartaoAviso>
            );
          }}
        />
      )}
    </Container>
  );
}
