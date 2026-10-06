import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../theme";
import MotionPressable from "./MotionPressable";
import Wordmark from "./Wordmark";
export default function AppHeader({ navigation, title, back = false }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <MotionPressable
          style={styles.button}
          accessibilityLabel={back ? "Voltar" : "Abrir menu"}
          onPress={() =>
            back
              ? navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate("MainTabs")
              : navigation.openDrawer()
          }
        >
          <Ionicons
            name={back ? "arrow-back-outline" : "menu-outline"}
            size={25}
            color={theme.colors.text}
          />
        </MotionPressable>
        <Wordmark width={112} />
        <Text numberOfLines={1} style={styles.location}>
          {title || "UniAcademia"}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background },
  row: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  button: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  location: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
    textAlign: "right",
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
