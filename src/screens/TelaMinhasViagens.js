import React, { useState } from "react";
import { FlatList, Modal, RefreshControl } from "react-native";
import styled, { useTheme } from "styled-components/native";
import MotionPressable from "../components/MotionPressable";
import EstadoViagem from "../components/EstadoViagem";
import { useInterface } from "../context/InterfaceContext";
import { Feather } from "@expo/vector-icons";
import { useCaronas } from "../context/CaronasContext";

const ABAS = [
  { papel: "Passageiro", rotulo: "Passageiro" },
  { papel: "Motorista", rotulo: "Motorista" },
];

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;
const TabBar = styled.View`
  flex-direction: row;
  margin: 16px 24px 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;
const TabButton = styled(MotionPressable)`
  flex: 1;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 2px;
  border-bottom-color: ${(props) =>
    props.ativa ? props.theme.colors.primary : "transparent"};
`;
const TabText = styled.Text`
  color: ${(props) =>
    props.ativa
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const TripList = styled(FlatList).attrs({
  contentContainerStyle: { flexGrow: 1, padding: 24, paddingTop: 8 },
  showsVerticalScrollIndicator: false,
})``;
const Card = styled.View`
  background-color: transparent;
  border-width: 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
  border-radius: 0px;
  padding: 24px 0px;
  margin-bottom: 12px;
`;
const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Price = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 700;
  font-family: ${(props) => props.theme.fonts.bold};
`;
const RouteSection = styled.View`
  margin-top: 24px;
  padding: 0px;
  background-color: transparent;
`;
const RouteRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
const RouteText = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  line-height: 20px;
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const RouteArrow = styled.View`
  margin: 2px 0 2px 1px;
`;
const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;
const InfoText = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  line-height: 16px;
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const Actions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
`;
const ActionButton = styled(MotionPressable)`
  flex-grow: 1;
  flex-basis: 140px;
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.perigo
      ? props.theme.colors.dangerLight
      : props.theme.colors.primaryLight};
  border-radius: 8px;
  padding: 8px 12px;
`;
const ActionText = styled.Text`
  color: ${(props) =>
    props.perigo ? props.theme.colors.danger : props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  margin-left: 6px;
  flex-shrink: 1;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl}px
    ${(props) => props.theme.spacing.lg}px;
`;
const EmptyIcon = styled.View`
  width: 64px;
  height: 64px;
  border-radius: ${(props) => props.theme.radii.full}px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.primaryLight};
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;
const EmptyTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: 600;
  text-align: center;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const EmptyDescription = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: 20px;
  text-align: center;
  margin: ${(props) => props.theme.spacing.sm}px 0
    ${(props) => props.theme.spacing.lg}px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const PrimaryButton = styled(MotionPressable)`
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) => props.theme.colors.primary};
  padding: 0 ${(props) => props.theme.spacing.lg}px;
`;
const PrimaryButtonText = styled.Text`
  color: ${(props) => props.theme.colors.surface};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(15, 23, 42, 0.45);
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg}px;
`;
const ModalCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.radii.lg}px;
  padding: ${(props) => props.theme.spacing.lg}px;
`;
const ModalTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: 600;
  line-height: 26px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const ModalBody = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: 20px;
  margin-top: ${(props) => props.theme.spacing.sm}px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const ModalActions = styled.View`
  flex-direction: row;
  margin-top: ${(props) => props.theme.spacing.lg}px;
`;
const ModalButton = styled(MotionPressable)`
  flex: 1;
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) =>
    props.perigo ? props.theme.colors.danger : props.theme.colors.borderLight};
  margin-left: ${(props) => (props.perigo ? props.theme.spacing.sm : 0)}px;
`;
const ModalButtonText = styled.Text`
  color: ${(props) =>
    props.perigo ? props.theme.colors.surface : props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  font-family: ${(props) => props.theme.fonts.semibold};
`;

function totalPassageirosTexto(total) {
  return `${total} ${total === 1 ? "passageiro confirmado" : "passageiros confirmados"}`;
}

function CardViagem({ viagem, onAbrirChat, onCancelar, onAvaliar }) {
  const theme = useTheme();
  const concluida = viagem.status === "Concluída";
  const textoCancelar =
    viagem.papel === "Passageiro" ? "Cancelar reserva" : "Cancelar rota";

  return (
    <Card>
      <CardHeader>
        <EstadoViagem status={viagem.status} />
        <Price>{viagem.valorRateio}</Price>
      </CardHeader>
      <RouteSection>
        <RouteRow>
          <Feather name="map-pin" size={16} color={theme.colors.primary} />
          <RouteText>{viagem.bairroOrigem}</RouteText>
        </RouteRow>
        <RouteArrow>
          <Feather name="arrow-down" size={14} color={theme.colors.textMuted} />
        </RouteArrow>
        <RouteRow>
          <Feather name="flag" size={16} color={theme.colors.success} />
          <RouteText>{viagem.campusDestino}</RouteText>
        </RouteRow>
      </RouteSection>
      <InfoRow>
        <Feather name="clock" size={16} color={theme.colors.textSecondary} />
        <InfoText>{viagem.quando}</InfoText>
      </InfoRow>
      <InfoRow>
        <Feather
          name={viagem.papel === "Passageiro" ? "user" : "users"}
          size={16}
          color={theme.colors.textSecondary}
        />
        <InfoText>{viagem.pessoas}</InfoText>
      </InfoRow>
      {viagem.pontoEncontro && (
        <InfoRow>
          <Feather
            name="navigation"
            size={16}
            color={theme.colors.textSecondary}
          />
          <InfoText>{viagem.pontoEncontro}</InfoText>
        </InfoRow>
      )}
      <Actions>
        {concluida ? (
          <ActionButton onPress={() => onAvaliar(viagem)}>
            <Feather name="star" size={16} color={theme.colors.primary} />
            <ActionText>Avaliar viagem</ActionText>
          </ActionButton>
        ) : (
          <>
            <ActionButton onPress={() => onAbrirChat(viagem)}>
              <Feather
                name="message-circle"
                size={16}
                color={theme.colors.primary}
              />
              <ActionText>Chat e ponto de encontro</ActionText>
            </ActionButton>
            {viagem.status !== "Em Andamento" && (
              <ActionButton perigo segundo onPress={() => onCancelar(viagem)}>
                <Feather
                  name="x-circle"
                  size={16}
                  color={theme.colors.danger}
                />
                <ActionText perigo>{textoCancelar}</ActionText>
              </ActionButton>
            )}
          </>
        )}
      </Actions>
    </Card>
  );
}

export default function TelaMinhasViagens({ navigation }) {
  const { podeAnimar } = useInterface();
  const theme = useTheme();
  const {
    usuarioLogado,
    caronasDisponiveis,
    reservas,
    historicoViagens,
    cancelarReserva,
    cancelarRota,
  } = useCaronas();
  const [abaAtiva, setAbaAtiva] = useState("Passageiro");
  const [atualizando, setAtualizando] = useState(false);
  const [viagemParaCancelar, setViagemParaCancelar] = useState(null);

  const viagensConcluidas = historicoViagens.map((viagemPassada) => ({
    chave: viagemPassada.id,
    papel: viagemPassada.papel,
    status: "Concluída",
    bairroOrigem: viagemPassada.bairroOrigem,
    campusDestino: viagemPassada.campusDestino,
    valorRateio: viagemPassada.valorRateio,
    quando: `${viagemPassada.data}, saída ${viagemPassada.horarioSaida}`,
    pessoas:
      viagemPassada.papel === "Passageiro"
        ? `Motorista: ${viagemPassada.motorista}`
        : totalPassageirosTexto(viagemPassada.totalPassageiros),
  }));

  const viagemDaCarona = (carona, papel, status) => ({
    chave: carona.id,
    caronaId: carona.id,
    papel,
    status,
    bairroOrigem: carona.bairroOrigem,
    campusDestino: carona.campusDestino,
    valorRateio: carona.valorRateio,
    pontoEncontro: carona.pontoEncontro,
    quando: `${carona.turno}, saída ${carona.horarioSaida}`,
    pessoas:
      papel === "Passageiro"
        ? `Motorista: ${carona.motorista}`
        : totalPassageirosTexto(carona.passageirosConfirmados.length),
  });

  const viagensComoPassageiro = reservas
    .map((reserva) => {
      const caronaReservada = caronasDisponiveis.find(
        (carona) => carona.id === reserva.caronaId,
      );
      return (
        caronaReservada &&
        viagemDaCarona(caronaReservada, "Passageiro", reserva.status)
      );
    })
    .filter(Boolean);

  const viagensComoMotorista = caronasDisponiveis
    .filter((carona) => carona.motorista === usuarioLogado.nome)
    .map((caronaOferecida) =>
      viagemDaCarona(
        caronaOferecida,
        "Motorista",
        caronaOferecida.statusViagem || "Aguardando Saída",
      ),
    );

  const viagensPorPapel = {
    Passageiro: [
      ...viagensComoPassageiro,
      ...viagensConcluidas.filter((viagem) => viagem.papel === "Passageiro"),
    ],
    Motorista: [
      ...viagensComoMotorista,
      ...viagensConcluidas.filter((viagem) => viagem.papel === "Motorista"),
    ],
  };

  // ponytail: sem backend, o refresh só simula a busca; os dados já vêm atualizados do contexto
  const atualizarViagens = () => {
    setAtualizando(true);
    setTimeout(() => setAtualizando(false), 800);
  };

  const confirmarCancelamento = () => {
    if (viagemParaCancelar.papel === "Passageiro")
      cancelarReserva(viagemParaCancelar.caronaId);
    else cancelarRota(viagemParaCancelar.caronaId);
    setViagemParaCancelar(null);
  };

  const abrirChat = (viagem) =>
    navigation.navigate("Avisos", { caronaId: viagem.caronaId });
  const avaliarViagem = (viagem) =>
    navigation.navigate("AvaliacoesSeguranca", { viagemId: viagem.chave });
  const comoPassageiro = abaAtiva === "Passageiro";
  const cancelandoReserva = viagemParaCancelar?.papel === "Passageiro";

  return (
    <Container>
      <TabBar accessibilityRole="tablist">
        {ABAS.map((aba) => (
          <TabButton
            key={aba.papel}
            ativa={abaAtiva === aba.papel}
            onPress={() => setAbaAtiva(aba.papel)}
            accessibilityRole="tab"
            accessibilityState={{ selected: abaAtiva === aba.papel }}
          >
            <TabText ativa={abaAtiva === aba.papel}>
              {aba.rotulo} ({viagensPorPapel[aba.papel].length})
            </TabText>
          </TabButton>
        ))}
      </TabBar>
      <TripList
        data={viagensPorPapel[abaAtiva]}
        keyExtractor={(viagem) => viagem.chave}
        renderItem={({ item: viagem }) => (
          <CardViagem
            viagem={viagem}
            onAbrirChat={abrirChat}
            onCancelar={setViagemParaCancelar}
            onAvaliar={avaliarViagem}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={atualizarViagens}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState>
            <EmptyIcon>
              <Feather
                name={comoPassageiro ? "search" : "plus-circle"}
                size={32}
                color={theme.colors.primary}
              />
            </EmptyIcon>
            <EmptyTitle>
              {comoPassageiro
                ? "Nenhuma reserva por aqui"
                : "Você ainda não oferece rotas"}
            </EmptyTitle>
            <EmptyDescription>
              {comoPassageiro
                ? "Encontre uma carona saindo do seu bairro e reserve sua vaga."
                : "Publique sua rota para a UniAcademia e divida o custo do combustível."}
            </EmptyDescription>
            <PrimaryButton
              onPress={() =>
                navigation.navigate(comoPassageiro ? "Explorar" : "Oferecer")
              }
            >
              <Feather
                name={comoPassageiro ? "compass" : "plus"}
                size={20}
                color={theme.colors.surface}
              />
              <PrimaryButtonText>
                {comoPassageiro ? "Buscar caronas" : "Oferecer carona"}
              </PrimaryButtonText>
            </PrimaryButton>
          </EmptyState>
        }
      />
      <Modal
        visible={Boolean(viagemParaCancelar)}
        transparent
        animationType={podeAnimar ? "fade" : "none"}
        onRequestClose={() => setViagemParaCancelar(null)}
      >
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>
              {cancelandoReserva
                ? "Cancelar esta reserva?"
                : "Cancelar esta rota?"}
            </ModalTitle>
            <ModalBody>
              {cancelandoReserva
                ? "Sua vaga será liberada para outro aluno. Essa ação não pode ser desfeita."
                : "A rota sai do feed e as reservas dos passageiros serão canceladas. Essa ação não pode ser desfeita."}
            </ModalBody>
            <ModalActions>
              <ModalButton onPress={() => setViagemParaCancelar(null)}>
                <ModalButtonText>Manter</ModalButtonText>
              </ModalButton>
              <ModalButton perigo onPress={confirmarCancelamento}>
                <ModalButtonText perigo>
                  {cancelandoReserva ? "Cancelar reserva" : "Cancelar rota"}
                </ModalButtonText>
              </ModalButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      </Modal>
    </Container>
  );
}
