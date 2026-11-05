import React from "react";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import theme from "../theme";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";
import Abas from "./Abas";
import CustomDrawerContent from "./CustomDrawerContent";
import { navegacaoRef } from "./navegacao";
import { TELAS } from "./telas";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const temaNavegacao = {
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

function Principal() {
  const { width } = useWindowDimensions();
  const { modo } = useAuth();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: { backgroundColor: theme.colors.surface, width: Math.min(320, width * 0.86) },
        overlayColor: "rgba(23,46,70,0.24)",
      }}
    >
      <Drawer.Screen name="Abas" options={{ title: "Início" }}>
        {(props) => <Abas {...props} modo={modo} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const cabecalho = (titulo) => ({
  headerShown: true,
  header: ({ navigation }) => <AppHeader navigation={navigation} title={titulo} back />,
});

function Carregando() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
      <ActivityIndicator color={theme.colors.secondary} />
    </View>
  );
}

export default function RootNavigator({ onReady }) {
  const { carregando, usuario, perfil, emailVerificado, modo } = useAuth();

  if (carregando) return <Carregando />;

  let grupo;
  if (!usuario) grupo = "acesso";
  else if (!emailVerificado) grupo = "verificacao";
  else if (!perfil) grupo = "perfil";
  else if (modo === "motorista" && !perfil.ehMotorista) grupo = "motorista";
  else grupo = "app";

  return (
    <NavigationContainer ref={navegacaoRef} theme={temaNavegacao} onReady={onReady}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
        {grupo === "acesso" && (
          <Stack.Group>
            <Stack.Screen name="Entrada" component={TELAS.Entrada} />
            <Stack.Screen name="Login" component={TELAS.Login} />
            <Stack.Screen name="Cadastro" component={TELAS.Cadastro} />
            <Stack.Screen name="EsqueciSenha" component={TELAS.EsqueciSenha} />
          </Stack.Group>
        )}
        {grupo === "verificacao" && <Stack.Screen name="VerificarEmail" component={TELAS.VerificarEmail} />}
        {grupo === "perfil" && (
          <Stack.Screen name="Cadastro" component={TELAS.Cadastro} initialParams={{ modo, completar: true }} />
        )}
        {grupo === "motorista" && <Stack.Screen name="CadastroMotorista" component={TELAS.CadastroMotorista} />}
        {grupo === "app" && (
          <Stack.Group>
            <Stack.Screen name="Principal" component={Principal} />
            <Stack.Screen name="DetalhesCarona" component={TELAS.DetalhesCarona} options={cabecalho("Detalhes")} />
            <Stack.Screen name="Conversa" component={TELAS.Conversa} options={cabecalho("Conversa")} />
            <Stack.Screen name="AvaliarViagem" component={TELAS.AvaliarViagem} options={cabecalho("Avaliar")} />
            <Stack.Screen name="Avaliacoes" component={TELAS.Avaliacoes} options={cabecalho("Comunidade")} />
            <Stack.Screen name="CadastroMotorista" component={TELAS.CadastroMotorista} options={cabecalho("Veículo")} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
