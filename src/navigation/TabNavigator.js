import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useInterface } from "../context/InterfaceContext";
import AppHeader from "../components/AppHeader";
import BarraAbas from "./BarraAbas";
import TelaFeedCaronas from "../screens/TelaFeedCaronas";
import TelaOferecerCarona from "../screens/TelaOferecerCarona";
import TelaMinhasViagens from "../screens/TelaMinhasViagens";
import TelaCentralAvisosChat from "../screens/TelaCentralAvisosChat";
import TelaPerfilUniversitario from "../screens/TelaPerfilUniversitario";
const Tab = createBottomTabNavigator();
export default function TabNavigator({ navigation }) {
  const { podeAnimar } = useInterface();
  return (
    <Tab.Navigator
      tabBar={(props) => <BarraAbas {...props} />}
      screenOptions={{
        header: () => <AppHeader navigation={navigation} />,
        animation: podeAnimar ? "fade" : "none",
        transitionSpec: { animation: "timing", config: { duration: 160 } },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Explorar"
        component={TelaFeedCaronas}
        options={{ tabBarLabel: "Explorar" }}
      />
      <Tab.Screen
        name="Oferecer"
        component={TelaOferecerCarona}
        options={{ tabBarLabel: "Oferecer" }}
      />
      <Tab.Screen
        name="Viagens"
        component={TelaMinhasViagens}
        options={{ tabBarLabel: "Viagens" }}
      />
      <Tab.Screen
        name="Avisos"
        component={TelaCentralAvisosChat}
        options={{ tabBarLabel: "Avisos" }}
      />
      <Tab.Screen
        name="Perfil"
        component={TelaPerfilUniversitario}
        options={{ tabBarLabel: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
