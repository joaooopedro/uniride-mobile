import React from "react";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const iniciaisDoNome = (nome) =>
  nome
    .split(" ")
    .slice(0, 2)
    .map((parteNome) => parteNome[0])
    .join("")
    .toUpperCase();

const formatarHorario = (data) =>
  `${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;

const LinhaMensagem = styled.View`
  flex-direction: ${(props) => (props.enviada ? "row-reverse" : "row")};
  align-items: flex-end;
  margin-bottom: ${(props) => props.theme.spacing.mdSm}px;
`;

const AvatarAutor = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.primaryLight};
`;

const IniciaisAutor = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};

  font-family: ${(props) => props.theme.fonts.bold};
`;

const ColunaMensagem = styled.View`
  max-width: 78%;
  margin: 0 ${(props) => props.theme.spacing.sm}px;
  align-items: ${(props) => (props.enviada ? "flex-end" : "flex-start")};
`;

const IdentificacaoAutor = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 500;
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.xs}px;

  font-family: ${(props) => props.theme.fonts.medium};
`;

const Balao = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm}px
    ${(props) => props.theme.spacing.mdSm}px;
  border-radius: ${(props) => props.theme.radii.md}px;
  border-bottom-left-radius: ${(props) =>
    props.enviada ? props.theme.radii.md : 4}px;
  border-bottom-right-radius: ${(props) =>
    props.enviada ? 4 : props.theme.radii.md}px;
  border-width: ${(props) => (props.enviada || props.aviso ? 0 : 1)}px;
  border-color: ${(props) => props.theme.colors.border};
  background-color: ${(props) => {
    if (props.enviada) return props.theme.colors.primary;
    if (props.aviso) return props.theme.colors.primaryLight;
    return props.theme.colors.surface;
  }};
`;

const TextoMensagem = styled.Text`
  flex-shrink: 1;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  font-weight: ${(props) => (props.aviso ? "600" : "400")};
  color: ${(props) => {
    if (props.enviada) return props.theme.colors.surface;
    if (props.aviso) return props.theme.colors.primary;
    return props.theme.colors.text;
  }};
  margin-left: ${(props) => (props.aviso ? props.theme.spacing.sm : 0)}px;

  font-family: ${(props) => props.theme.fonts.regular};
`;

export default function BalaoMensagem({
  mensagem,
  enviada,
  rotuloAutor,
  iconeAviso,
}) {
  const theme = useTheme();
  const ehAviso = Boolean(iconeAviso);

  return (
    <LinhaMensagem enviada={enviada}>
      <AvatarAutor>
        <IniciaisAutor>{iniciaisDoNome(mensagem.autor)}</IniciaisAutor>
      </AvatarAutor>
      <ColunaMensagem enviada={enviada}>
        <IdentificacaoAutor>
          {rotuloAutor} · {formatarHorario(mensagem.enviadaEm)}
        </IdentificacaoAutor>
        <Balao enviada={enviada} aviso={ehAviso}>
          {ehAviso && (
            <Ionicons
              name={iconeAviso}
              size={16}
              color={enviada ? theme.colors.surface : theme.colors.primary}
            />
          )}
          <TextoMensagem enviada={enviada} aviso={ehAviso}>
            {mensagem.texto}
          </TextoMensagem>
        </Balao>
      </ColunaMensagem>
    </LinhaMensagem>
  );
}
