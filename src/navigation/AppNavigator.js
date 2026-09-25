import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from 'styled-components/native';

import TabNavigator from './TabNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import TelaDetalhesCarona from '../screens/TelaDetalhesCarona';
import TelaAvaliacoesSeguranca from '../screens/TelaAvaliacoesSeguranca';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: theme.colors.surface,
            width: 280,
          },
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: theme.colors.textSecondary,
        }}
      >
        <Drawer.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ title: 'Início' }}
        />
        <Drawer.Screen
          name="DetalhesCarona"
          component={TelaDetalhesCarona}
          options={{
            headerShown: true,
            title: 'Detalhes da Carona',
            headerStyle: {
              backgroundColor: theme.colors.surface,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            },
            headerTitleStyle: {
              fontSize: theme.typography.sectionHeader.fontSize,
              fontWeight: '700',
              color: theme.colors.text,
            },
            headerTintColor: theme.colors.primary,
          }}
        />
        <Drawer.Screen
          name="AvaliacoesSeguranca"
          component={TelaAvaliacoesSeguranca}
          options={{
            headerShown: true,
            title: 'Segurança e Avaliações',
            headerStyle: {
              backgroundColor: theme.colors.surface,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            },
            headerTitleStyle: {
              fontSize: theme.typography.sectionHeader.fontSize,
              fontWeight: '700',
              color: theme.colors.text,
            },
            headerTintColor: theme.colors.primary,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
