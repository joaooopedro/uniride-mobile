import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';

import theme from './src/theme';
import { CaronasProvider } from './src/context/CaronasContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <CaronasProvider>
          <StatusBar style="dark" backgroundColor={theme.colors.surface} />
          <AppNavigator />
        </CaronasProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
