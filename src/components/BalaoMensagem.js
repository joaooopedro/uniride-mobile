import React from "react";
import styled, { useTheme } from "styled-components/native";
import { Feather } from "@expo/vector-icons";

import { formatarHora, iniciais } from "../utils";

// Mensagem do chat no formato do contrato: { autorNome, texto, tipo, criadoEm }.
// Aviso rápido vira um cartão com ícone, igual para quem envia e quem recebe.
export default function BalaoMensagem({ mensagem, enviada, rotuloAutor, iconeAviso, pendente }) {
  const theme = useTheme();
  const ehAviso = Boolean(iconeAviso);
  const hora = pendente ? "enviando" : formatarHora(mensagem.criadoEm || new Date());

  return (
    <LinhaMensagem enviada={enviada}>
      {!enviada && (
        <AvatarAutor>
          <IniciaisAutor>{iniciais(mensagem.autorNome)}</IniciaisAutor>
        </AvatarAutor>
      )}
      <ColunaMensagem enviada={enviada}>
        {!enviada && <IdentificacaoAutor>{rotuloAutor}</IdentificacaoAutor>}
        <Balao enviada={enviada} aviso={ehAviso} style={pendente ? { opacity: 0.6 } : null}>
          {ehAviso && <Feather name={iconeAviso} size={18} color={theme.colors.secondary} />}
          <TextoMensagem enviada={enviada} aviso={ehAviso}>{mensagem.texto}</TextoMensagem>
        </Balao>
        <Hora>{hora}</Hora>
      </ColunaMensagem>
    </LinhaMensagem>
  );
}

const LinhaMensagem = styled.View`
  flex-direction: ${(props) => (props.enviada ? "row-reverse" : "row")};
  align-items: flex-end;
  margin-bottom: ${(props) => props.theme.spacing.mdSm}px;
`;

const AvatarAutor = styled.View`
  width: 32px;
  height: 32px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.full}px;
  background-color: ${(props) => props.theme.colors.primaryLight};
`;

const IniciaisAutor = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
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
  line-height: ${(props) => props.theme.typography.caption.lineHeight}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.xs}px;
  font-family: ${(props) => props.theme.fonts.medium};
`;

const Balao = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm}px;
  padding: ${(props) => props.theme.spacing.sm}px ${(props) => props.theme.spacing.mdSm}px;
  border-radius: ${(props) => props.theme.radii.lg}px;
  border-bottom-left-radius: ${(props) => (props.enviada || props.aviso ? props.theme.radii.lg : props.theme.spacing.xs)}px;
  border-bottom-right-radius: ${(props) => (props.enviada && !props.aviso ? props.theme.spacing.xs : props.theme.radii.lg)}px;
  border-width: ${(props) => (props.enviada && !props.aviso ? 0 : 1)}px;
  border-color: ${(props) => (props.aviso ? props.theme.colors.secondary : props.theme.colors.border)};
  background-color: ${(props) => {
    if (props.aviso) return props.theme.colors.secondaryLight;
    if (props.enviada) return props.theme.colors.primary;
    return props.theme.colors.surface;
  }};
`;

const TextoMensagem = styled.Text`
  flex-shrink: 1;
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  line-height: ${(props) => props.theme.typography.body.lineHeight}px;
  font-family: ${(props) => (props.aviso ? props.theme.fonts.semibold : props.theme.fonts.regular)};
  color: ${(props) => {
    if (props.aviso) return props.theme.colors.primary;
    if (props.enviada) return props.theme.colors.surface;
    return props.theme.colors.text;
  }};
`;

const Hora = styled.Text`
  margin-top: ${(props) => props.theme.spacing.xs}px;
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  color: ${(props) => props.theme.colors.textMuted};
  font-family: ${(props) => props.theme.fonts.medium};
`;
