import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";
import theme from "../theme";
import AppHeader from "../components/AppHeader";
import TabNavigator from "./TabNavigator";
import CustomDrawerContent from "./CustomDrawerContent";
import TelaDetalhesCarona from "../screens/TelaDetalhesCarona";
import TelaAvaliacoesSeguranca from "../screens/TelaAvaliacoesSeguranca";
const Drawer = createDrawerNavigator();
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    primary: theme.colors.accent,
    text: theme.colors.text,
    border: theme.colors.border,
  },
};
export default function AppNavigator() {
  const { width } = useWindowDimensions();
  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "front",
          drawerStyle: {
            backgroundColor: theme.colors.surface,
            width: Math.min(320, width * 0.86),
          },
          overlayColor: "rgba(23,46,70,0.24)",
        }}
      >
        <Drawer.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ title: "Início" }}
        />
        <Drawer.Screen
          name="DetalhesCarona"
          component={TelaDetalhesCarona}
          options={{
            headerShown: true,
            header: ({ navigation }) => (
              <AppHeader navigation={navigation} title="Detalhes" back />
            ),
          }}
        />
        <Drawer.Screen
          name="AvaliacoesSeguranca"
          component={TelaAvaliacoesSeguranca}
          options={{
            headerShown: true,
            header: ({ navigation }) => (
              <AppHeader navigation={navigation} title="Comunidade" back />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
