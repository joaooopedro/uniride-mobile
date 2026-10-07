import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAvisos } from "../context/AvisosContext";
import { useInterface } from "../context/InterfaceContext";
import MotionPressable from "../components/MotionPressable";
import theme from "../theme";
const icons = {
  Explorar: ["compass-outline", "compass"],
  Oferecer: ["add-circle-outline", "add-circle"],
  Viagens: ["car-outline", "car"],
  Avisos: ["chatbubble-ellipses-outline", "chatbubble-ellipses"],
  Perfil: ["person-outline", "person"],
};
export default function PremiumTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { mensagensNaoLidas, avisosNaoLidos } = useAvisos();
  const { podeAnimar } = useInterface();
  const [largura, setLargura] = useState(0);
  const [tecladoAberto, setTecladoAberto] = useState(false);
  const posicao = useRef(new Animated.Value(0)).current;
  const total = mensagensNaoLidas + avisosNaoLidos;
  useEffect(() => {
    const mostrar = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setTecladoAberto(true),
    );
    const esconder = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setTecladoAberto(false),
    );
    return () => {
      mostrar.remove();
      esconder.remove();
    };
  }, []);
  useEffect(() => {
    Animated.timing(posicao, {
      toValue: (largura / state.routes.length) * (state.index + 0.5) - 14,
      duration: podeAnimar ? 180 : 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [state.index, state.routes.length, largura, podeAnimar, posicao]);
  if (tecladoAberto) return null;
  return (
    <View
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}
      onLayout={(event) => setLargura(event.nativeEvent.layout.width)}
    >
      {largura > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, { transform: [{ translateX: posicao }] }]}
        />
      )}
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key].options;
          return (
            <MotionPressable
              key={route.key}
              style={styles.item}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarLabel || route.name}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented)
                  navigation.navigate(route.name, route.params);
              }}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
            >
              <View>
                <Ionicons
                  name={icons[route.name][focused ? 1 : 0]}
                  size={23}
                  color={
                    focused ? theme.colors.accent : theme.colors.textSecondary
                  }
                />
                {route.name === "Avisos" && total > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {total > 9 ? "9+" : total}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                numberOfLines={1}
                style={[styles.label, focused && styles.selected]}
              >
                {options.tabBarLabel || route.name}
              </Text>
            </MotionPressable>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  row: { minHeight: 64, flexDirection: "row", alignItems: "center" },
  item: {
    flex: 1,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 3,
    width: 28,
    backgroundColor: theme.colors.accent,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 10,
    color: theme.colors.textSecondary,
    includeFontPadding: false,
  },
  selected: { fontFamily: theme.fonts.bold, color: theme.colors.primary },
  badge: {
    position: "absolute",
    top: -5,
    right: -11,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.surface,
  },
  badgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    color: theme.colors.surface,
    includeFontPadding: false,
  },
});
