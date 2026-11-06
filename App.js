import "react-native-gesture-handler";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";

import theme from "./src/theme";
import { AuthProvider } from "./src/context/AuthContext";
import { CaronasProvider } from "./src/context/CaronasContext";
import { AvisosProvider } from "./src/context/AvisosContext";
import { InterfaceProvider } from "./src/context/InterfaceContext";
import RootNavigator from "./src/navigation/RootNavigator";
import FaixaSemConexao from "./src/components/FaixaSemConexao";
import { useConexao } from "./src/services/conexao";
import { useNotificacoes } from "./src/services/notificacoes";

function Conteudo() {
  const online = useConexao();
  useNotificacoes();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <RootNavigator />
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
        <FaixaSemConexao visivel={!online} />
      </View>
    </View>
  );
}

export default function App() {
  const [fontesCarregadas, erroFonte] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  if (!fontesCarregadas && !erroFonte) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }
  const temaAtivo = erroFonte
    ? {
        ...theme,
        fonts: {
          regular: "System",
          medium: "System",
          semibold: "System",
          bold: "System",
        },
      }
    : theme;
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={temaAtivo}>
        <InterfaceProvider>
          <AuthProvider>
            <CaronasProvider>
              <AvisosProvider>
                <StatusBar style="dark" />
                <Conteudo />
              </AvisosProvider>
            </CaronasProvider>
          </AuthProvider>
        </InterfaceProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
