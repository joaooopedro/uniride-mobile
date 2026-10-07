import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import styled, { useTheme } from "styled-components/native";
import MotionPressable from "../components/MotionPressable";
import { Feather } from "@expo/vector-icons";
import { useCaronas } from "../context/CaronasContext";

const CAMPI = ["Campus Academia (Centro)", "Campus Estrela Sul"];
const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const OPCOES_VAGAS = [1, 2, 3, 4];
const REGRAS_CARRO = [
  "Sem fumo",
  "Aceita mochila no colo",
  "Ar-condicionado",
  "Música",
  "Porta-malas livre",
];
// Distâncias fixas aproximadas por bairro, sem consulta de rota.
const DISTANCIA_KM = {
  Cascatinha: { "Campus Academia (Centro)": 3.8, "Campus Estrela Sul": 3.0 },
  "São Mateus": { "Campus Academia (Centro)": 2.6, "Campus Estrela Sul": 3.4 },
  "Alto dos Passos": {
    "Campus Academia (Centro)": 2.2,
    "Campus Estrela Sul": 4.6,
  },
  "Santa Luzia": { "Campus Academia (Centro)": 5.4, "Campus Estrela Sul": 4.1 },
  Granbery: { "Campus Academia (Centro)": 1.4, "Campus Estrela Sul": 5.2 },
  Benfica: { "Campus Academia (Centro)": 15.8, "Campus Estrela Sul": 19.5 },
  Centro: { "Campus Academia (Centro)": 0.8, "Campus Estrela Sul": 5.8 },
  "Manoel Honório": {
    "Campus Academia (Centro)": 2.9,
    "Campus Estrela Sul": 7.6,
  },
};
const PRECO_LITRO_GASOLINA = 6.29;
const CONSUMO_KM_POR_LITRO = 11;
const HORARIO_VALIDO = /^([01]\d|2[0-3]):[0-5]\d$/;

const ofertaInicial = {
  bairroOrigem: "",
  pontoEncontro: "",
  campusDestino: "",
  horarioSaida: "",
  horarioRetorno: "",
  diasSemana: [],
  vagas: null,
  contribuicao: "",
  regras: [],
  observacoes: "",
};

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;
const Content = styled(ScrollView).attrs({
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: "handled",
  automaticallyAdjustKeyboardInsets: true,
  contentContainerStyle: { padding: 24, paddingBottom: 40 },
})``;
const PageTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 30px;
  font-weight: 700;
  line-height: 39px;
  letter-spacing: -0.8px;
  padding-top: 8px;
  font-family: ${(props) => props.theme.fonts.bold};
`;
const PageDescription = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 23px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 8px 0px 12px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const Section = styled.View`
  background-color: transparent;
  border-width: 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
  border-radius: 0px;
  padding: 24px 0px;
  margin-bottom: 12px;
`;
const SectionTitle = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: 600;
  line-height: 26px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const Field = styled.View`
  margin-bottom: 24px;
`;
const FieldLabel = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  line-height: 20px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const InputBox = styled.View`
  min-height: 52px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) =>
    props.invalido ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: 8px;
  padding-left: 12px;
`;
const Input = styled.TextInput`
  flex: 1;
  min-height: 52px;
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  padding: 12px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const InputPrefix = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: 600;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const TextArea = styled.TextInput`
  min-height: 88px;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: 20px;
  background-color: ${(props) => props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.sm}px;
  padding: ${(props) => props.theme.spacing.mdSm}px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const OptionsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: -${(props) => props.theme.spacing.sm}px;
`;
const OptionChip = styled(MotionPressable)`
  min-height: 48px;
  min-width: 52px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.selecionada
      ? props.theme.colors.secondaryLight
      : props.theme.colors.borderLight};
  border-radius: 8px;
  padding: 0px 14px;
  margin: 0px 8px 8px 0px;
`;
const OptionText = styled.Text`
  color: ${(props) =>
    props.selecionada
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  margin-left: ${(props) => (props.comIcone ? props.theme.spacing.xs : 0)}px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const TimeRow = styled.View`
  flex-direction: row;
`;
const TimeColumn = styled.View`
  flex: 1;
  margin-left: ${(props) => (props.segunda ? props.theme.spacing.mdSm : 0)}px;
`;
const ErrorRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;
const ErrorText = styled.Text`
  flex: 1;
  color: ${(props) => props.theme.colors.danger};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 500;
  line-height: 16px;
  margin-left: ${(props) => props.theme.spacing.xs}px;
  font-family: ${(props) => props.theme.fonts.medium};
`;
const SuggestionBox = styled.View`
  background-color: ${(props) => props.theme.colors.secondaryLight};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;
const SuggestionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const SuggestionValue = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 600;
  line-height: 22px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;
const SuggestionDetail = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  line-height: 16px;
  margin-top: ${(props) => props.theme.spacing.xs}px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const SuggestionHint = styled.Text`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  line-height: 16px;
  margin-bottom: ${(props) => props.theme.spacing.mdSm}px;
  font-family: ${(props) => props.theme.fonts.regular};
`;
const SuggestionButton = styled(MotionPressable)`
  min-height: ${(props) => props.theme.touchTarget.minHeight}px;
  justify-content: center;
  padding: 0 ${(props) => props.theme.spacing.sm}px;
`;
const SuggestionButtonText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  font-family: ${(props) => props.theme.fonts.bold};
`;
const FormAlert = styled.Text`
  color: ${(props) => props.theme.colors.danger};
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 500;
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.mdSm}px;
  font-family: ${(props) => props.theme.fonts.medium};
`;
const SubmitButton = styled(MotionPressable)`
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.md}px;
  background-color: ${(props) => props.theme.colors.primary};
  margin-top: ${(props) => props.theme.spacing.sm}px;
`;
const SubmitText = styled.Text`
  color: ${(props) => props.theme.colors.surface};
  font-size: ${(props) => props.theme.typography.cardTitle.fontSize}px;
  font-weight: 600;
  margin-left: ${(props) => props.theme.spacing.sm}px;
  font-family: ${(props) => props.theme.fonts.semibold};
`;

function formatarHorario(texto) {
  const digitos = texto.replace(/\D/g, "").slice(0, 4);
  return digitos.length > 2
    ? `${digitos.slice(0, 2)}:${digitos.slice(2)}`
    : digitos;
}

function formatarReais(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function definirTurno(horario) {
  const hora = Number(horario.slice(0, 2));
  if (hora < 12) return "Manhã";
  return hora < 18 ? "Tarde" : "Noite";
}

function calcularRateioSugerido({ bairroOrigem, campusDestino, vagas }) {
  if (!bairroOrigem || !campusDestino || !vagas) return null;
  const distanciaIdaVoltaKm = DISTANCIA_KM[bairroOrigem][campusDestino] * 2;
  const custoCombustivel =
    (distanciaIdaVoltaKm / CONSUMO_KM_POR_LITRO) * PRECO_LITRO_GASOLINA;
  return {
    distanciaIdaVoltaKm,
    valorPorPassageiro: custoCombustivel / (vagas + 1),
  };
}

function validarOferta(oferta) {
  const erros = {};
  const valorContribuicao = Number(oferta.contribuicao.replace(",", "."));
  if (!oferta.bairroOrigem)
    erros.bairroOrigem = "Escolha o bairro de onde você sai.";
  if (!oferta.pontoEncontro.trim())
    erros.pontoEncontro = "Informe onde os passageiros vão embarcar.";
  if (!oferta.campusDestino)
    erros.campusDestino = "Escolha o campus de destino.";
  if (!oferta.horarioSaida) erros.horarioSaida = "Informe o horário de saída.";
  else if (!HORARIO_VALIDO.test(oferta.horarioSaida))
    erros.horarioSaida = "Use o formato HH:MM, como 07:10.";
  if (!oferta.horarioRetorno)
    erros.horarioRetorno = "Informe o horário de retorno.";
  else if (!HORARIO_VALIDO.test(oferta.horarioRetorno))
    erros.horarioRetorno = "Use o formato HH:MM, como 12:30.";
  else if (!erros.horarioSaida && oferta.horarioRetorno <= oferta.horarioSaida)
    erros.horarioRetorno = "O retorno precisa ser depois da saída.";
  if (oferta.diasSemana.length === 0)
    erros.diasSemana = "Selecione pelo menos um dia da semana.";
  if (!oferta.vagas) erros.vagas = "Escolha quantas vagas você oferece.";
  if (!oferta.contribuicao.trim())
    erros.contribuicao = "Informe a contribuição ou use a sugestão.";
  else if (!(valorContribuicao > 0))
    erros.contribuicao = "Digite um valor válido, como 6,00.";
  return erros;
}

function Campo({ rotulo, erro, children }) {
  const theme = useTheme();
  return (
    <Field>
      <FieldLabel>{rotulo}</FieldLabel>
      {children}
      {erro && (
        <ErrorRow>
          <Feather name="alert-circle" size={16} color={theme.colors.danger} />
          <ErrorText>{erro}</ErrorText>
        </ErrorRow>
      )}
    </Field>
  );
}

function Opcao({ rotulo, icone, selecionada, onPress }) {
  const theme = useTheme();
  return (
    <OptionChip
      selecionada={selecionada}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: selecionada }}
    >
      {icone && (
        <Feather
          name={icone}
          size={16}
          color={
            selecionada ? theme.colors.primary : theme.colors.textSecondary
          }
        />
      )}
      <OptionText selecionada={selecionada} comIcone={Boolean(icone)}>
        {rotulo}
      </OptionText>
    </OptionChip>
  );
}

export default function TelaOferecerCarona({ navigation }) {
  const theme = useTheme();
  const { adicionarCarona } = useCaronas();
  const [oferta, setOferta] = useState(ofertaInicial);
  const [camposTocados, setCamposTocados] = useState({});
  const [tentouPublicar, setTentouPublicar] = useState(false);

  const erros = validarOferta(oferta);
  const formularioValido = Object.keys(erros).length === 0;
  const rateioSugerido = calcularRateioSugerido(oferta);
  const erroVisivel = (campo) =>
    (tentouPublicar || camposTocados[campo]) && erros[campo];

  const marcarTocado = (campo) =>
    setCamposTocados((tocadosAtuais) => ({ ...tocadosAtuais, [campo]: true }));
  const atualizarCampo = (campo, valor) =>
    setOferta((ofertaAtual) => ({ ...ofertaAtual, [campo]: valor }));
  const selecionarOpcao = (campo, valor) => {
    atualizarCampo(campo, valor);
    marcarTocado(campo);
  };
  const alternarNaLista = (campo, valor) => {
    setOferta((ofertaAtual) => {
      const listaAtual = ofertaAtual[campo];
      const novaLista = listaAtual.includes(valor)
        ? listaAtual.filter((valorAtual) => valorAtual !== valor)
        : [...listaAtual, valor];
      return { ...ofertaAtual, [campo]: novaLista };
    });
    marcarTocado(campo);
  };
  const aplicarSugestao = () =>
    selecionarOpcao(
      "contribuicao",
      rateioSugerido.valorPorPassageiro.toFixed(2).replace(".", ","),
    );

  const publicarCarona = () => {
    setTentouPublicar(true);
    if (!formularioValido) return;
    adicionarCarona({
      bairroOrigem: oferta.bairroOrigem,
      pontoEncontro: oferta.pontoEncontro.trim(),
      campusDestino: oferta.campusDestino,
      turno: definirTurno(oferta.horarioSaida),
      horarioSaida: oferta.horarioSaida,
      horarioRetorno: oferta.horarioRetorno,
      diasSemana: DIAS_SEMANA.filter((dia) => oferta.diasSemana.includes(dia)),
      vagasRestantes: oferta.vagas,
      valorRateio: formatarReais(Number(oferta.contribuicao.replace(",", "."))),
      comodidades: oferta.regras,
      observacoes: oferta.observacoes.trim(),
    });
    setOferta(ofertaInicial);
    setCamposTocados({});
    setTentouPublicar(false);
    Alert.alert(
      "Carona publicada",
      "Sua rota já está disponível no feed de caronas.",
    );
    navigation.navigate("Explorar");
  };

  return (
    <Container>
      <Content>
        <PageTitle>Oferecer carona</PageTitle>
        <PageDescription>
          Publique sua rota fixa e divida o custo do combustível com outros
          alunos.
        </PageDescription>

        <Section>
          <SectionTitle>Rota</SectionTitle>
          <Campo rotulo="Bairro de saída" erro={erroVisivel("bairroOrigem")}>
            <OptionsWrap>
              {Object.keys(DISTANCIA_KM).map((bairro) => (
                <Opcao
                  key={bairro}
                  rotulo={bairro}
                  selecionada={oferta.bairroOrigem === bairro}
                  onPress={() => selecionarOpcao("bairroOrigem", bairro)}
                />
              ))}
            </OptionsWrap>
          </Campo>
          <Campo rotulo="Ponto de embarque" erro={erroVisivel("pontoEncontro")}>
            <InputBox invalido={Boolean(erroVisivel("pontoEncontro"))}>
              <Feather
                name="map-pin"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Input
                value={oferta.pontoEncontro}
                onChangeText={(texto) => atualizarCampo("pontoEncontro", texto)}
                onBlur={() => marcarTocado("pontoEncontro")}
                placeholder="Ex.: Posto Shell da Av. Rio Branco"
                placeholderTextColor={theme.colors.textMuted}
                maxLength={80}
              />
            </InputBox>
          </Campo>
          <Campo rotulo="Campus de destino" erro={erroVisivel("campusDestino")}>
            <OptionsWrap>
              {CAMPI.map((campus) => (
                <Opcao
                  key={campus}
                  rotulo={campus}
                  icone="flag"
                  selecionada={oferta.campusDestino === campus}
                  onPress={() => selecionarOpcao("campusDestino", campus)}
                />
              ))}
            </OptionsWrap>
          </Campo>
        </Section>

        <Section>
          <SectionTitle>Horários e dias</SectionTitle>
          <TimeRow>
            <TimeColumn>
              <Campo rotulo="Saída da ida" erro={erroVisivel("horarioSaida")}>
                <InputBox invalido={Boolean(erroVisivel("horarioSaida"))}>
                  <Feather
                    name="clock"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                  <Input
                    value={oferta.horarioSaida}
                    onChangeText={(texto) =>
                      atualizarCampo("horarioSaida", formatarHorario(texto))
                    }
                    onBlur={() => marcarTocado("horarioSaida")}
                    placeholder="07:10"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </InputBox>
              </Campo>
            </TimeColumn>
            <TimeColumn segunda>
              <Campo
                rotulo="Retorno da volta"
                erro={erroVisivel("horarioRetorno")}
              >
                <InputBox invalido={Boolean(erroVisivel("horarioRetorno"))}>
                  <Feather
                    name="rotate-ccw"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                  <Input
                    value={oferta.horarioRetorno}
                    onChangeText={(texto) =>
                      atualizarCampo("horarioRetorno", formatarHorario(texto))
                    }
                    onBlur={() => marcarTocado("horarioRetorno")}
                    placeholder="12:30"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </InputBox>
              </Campo>
            </TimeColumn>
          </TimeRow>
          <Campo rotulo="Dias da semana" erro={erroVisivel("diasSemana")}>
            <OptionsWrap>
              {DIAS_SEMANA.map((dia) => (
                <Opcao
                  key={dia}
                  rotulo={dia}
                  selecionada={oferta.diasSemana.includes(dia)}
                  onPress={() => alternarNaLista("diasSemana", dia)}
                />
              ))}
            </OptionsWrap>
          </Campo>
        </Section>

        <Section>
          <SectionTitle>Vagas e contribuição</SectionTitle>
          <Campo rotulo="Vagas disponíveis" erro={erroVisivel("vagas")}>
            <OptionsWrap>
              {OPCOES_VAGAS.map((quantidade) => (
                <Opcao
                  key={quantidade}
                  rotulo={String(quantidade)}
                  icone="user"
                  selecionada={oferta.vagas === quantidade}
                  onPress={() => selecionarOpcao("vagas", quantidade)}
                />
              ))}
            </OptionsWrap>
          </Campo>
          <Campo
            rotulo="Contribuição por passageiro"
            erro={erroVisivel("contribuicao")}
          >
            {rateioSugerido ? (
              <SuggestionBox>
                <SuggestionHeader>
                  <SuggestionValue>
                    Sugestão: {formatarReais(rateioSugerido.valorPorPassageiro)}
                  </SuggestionValue>
                  <SuggestionButton onPress={aplicarSugestao}>
                    <SuggestionButtonText>Usar valor</SuggestionButtonText>
                  </SuggestionButton>
                </SuggestionHeader>
                <SuggestionDetail>
                  {rateioSugerido.distanciaIdaVoltaKm
                    .toFixed(1)
                    .replace(".", ",")}{" "}
                  km ida e volta. Combustível dividido entre você e{" "}
                  {oferta.vagas}{" "}
                  {oferta.vagas === 1 ? "passageiro" : "passageiros"}.
                </SuggestionDetail>
              </SuggestionBox>
            ) : (
              <SuggestionHint>
                Escolha bairro, campus e vagas para ver o rateio sugerido.
              </SuggestionHint>
            )}
            <InputBox invalido={Boolean(erroVisivel("contribuicao"))}>
              <InputPrefix>R$</InputPrefix>
              <Input
                value={oferta.contribuicao}
                onChangeText={(texto) =>
                  atualizarCampo("contribuicao", texto.replace(/[^\d,]/g, ""))
                }
                onBlur={() => marcarTocado("contribuicao")}
                placeholder="0,00"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="decimal-pad"
                maxLength={6}
              />
            </InputBox>
          </Campo>
        </Section>

        <Section>
          <SectionTitle>Regras do carro</SectionTitle>
          <Campo rotulo="Combinados com os passageiros">
            <OptionsWrap>
              {REGRAS_CARRO.map((regra) => (
                <Opcao
                  key={regra}
                  rotulo={regra}
                  icone={oferta.regras.includes(regra) ? "check" : undefined}
                  selecionada={oferta.regras.includes(regra)}
                  onPress={() => alternarNaLista("regras", regra)}
                />
              ))}
            </OptionsWrap>
          </Campo>
          <Campo rotulo="Observações (opcional)">
            <TextArea
              value={oferta.observacoes}
              onChangeText={(texto) => atualizarCampo("observacoes", texto)}
              placeholder="Ex.: Espero no máximo 5 minutos no ponto."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
          </Campo>
        </Section>

        {tentouPublicar && !formularioValido && (
          <FormAlert>Revise os campos destacados para publicar.</FormAlert>
        )}
        <SubmitButton onPress={publicarCarona} accessibilityRole="button">
          <Feather name="send" size={20} color={theme.colors.surface} />
          <SubmitText>Publicar Rota de Carona</SubmitText>
        </SubmitButton>
      </Content>
    </Container>
  );
}
