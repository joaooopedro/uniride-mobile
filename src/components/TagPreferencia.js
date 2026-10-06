import React from "react";
import styled, { useTheme } from "styled-components/native";
import MotionPressable from "./MotionPressable";
import { Feather } from "@expo/vector-icons";

const TagButton = styled(MotionPressable)`
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) =>
    props.ativa
      ? props.theme.colors.secondaryLight
      : props.theme.colors.borderLight};
  border-radius: 8px;
  padding: 0px 14px;
  margin: 0px 8px 8px 0px;
`;

const TagText = styled.Text`
  color: ${(props) =>
    props.ativa ? props.theme.colors.accent : props.theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  font-family: ${(props) => props.theme.fonts.medium};
`;

export default function TagPreferencia({ texto, icone, ativa, onPress }) {
  const theme = useTheme();
  const corIcone = ativa ? theme.colors.primary : theme.colors.textSecondary;

  return (
    <TagButton
      ativa={ativa}
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityState={{ selected: ativa }}
      accessibilityLabel={texto}
    >
      <Feather
        name={ativa ? "check" : icone}
        size={14}
        color={corIcone}
        style={{ marginRight: 8 }}
      />
      <TagText ativa={ativa}>{texto}</TagText>
    </TagButton>
  );
}
