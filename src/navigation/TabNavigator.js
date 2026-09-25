import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import TelaFeedCaronas from '../screens/TelaFeedCaronas';
import TelaOferecerCarona from '../screens/TelaOferecerCarona';
import TelaMinhasViagens from '../screens/TelaMinhasViagens';
import TelaCentralAvisosChat from '../screens/TelaCentralAvisosChat';
import TelaPerfilUniversitario from '../screens/TelaPerfilUniversitario';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ navigation }) {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
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
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => navigation.openDrawer()}
          >
            <Feather name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.typography.micro.fontSize,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Explorar"
        component={TelaFeedCaronas}
        options={{
          title: 'UniRide',
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Feather name="compass" size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Oferecer"
        component={TelaOferecerCarona}
        options={{
          title: 'Publicar Rota',
          tabBarLabel: 'Oferecer',
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Viagens"
        component={TelaMinhasViagens}
        options={{
          title: 'Minhas Viagens',
          tabBarLabel: 'Viagens',
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Avisos"
        component={TelaCentralAvisosChat}
        options={{
          title: 'Central de Avisos',
          tabBarLabel: 'Avisos',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-square" size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={TelaPerfilUniversitario}
        options={{
          title: 'Meu Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size || 22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
