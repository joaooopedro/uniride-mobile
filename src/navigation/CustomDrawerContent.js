import React from 'react';
import { Alert, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCaronas } from '../context/CaronasContext';

const DrawerContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.surface};
`;

const HeaderSection = styled.View`
  padding: ${(props) => props.theme.spacing.lg}px ${(props) => props.theme.spacing.md}px;
  background-color: ${(props) => props.theme.colors.primaryLight};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

const UserAvatar = styled.Image`
  width: 58px;
  height: 58px;
  border-radius: ${(props) => props.theme.radii.full}px;
  border-width: 2px;
  border-color: ${(props) => props.theme.colors.primary};
  margin-bottom: 8px;
`;

const UserName = styled.Text`
  font-size: ${(props) => props.theme.typography.sectionHeader.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const UserCourse = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const VerifiedBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.successLight};
  padding: 3px 8px;
  border-radius: ${(props) => props.theme.radii.full}px;
  align-self: flex-start;
  margin-top: 6px;
`;

const VerifiedText = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.success};
  margin-left: 4px;
`;

const MenuList = styled.ScrollView`
  flex: 1;
  padding: ${(props) => props.theme.spacing.md}px 0;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px ${(props) => props.theme.spacing.md}px;
  background-color: ${(props) => (props.active ? props.theme.colors.primaryLight : 'transparent')};
  margin: 2px ${(props) => props.theme.spacing.sm}px;
  border-radius: ${(props) => props.theme.radii.sm}px;
`;

const MenuLabel = styled.Text`
  font-size: ${(props) => props.theme.typography.body.fontSize}px;
  font-weight: ${(props) => (props.active ? '700' : '500')};
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.text)};
  margin-left: ${(props) => props.theme.spacing.md}px;
  flex: 1;
`;

const FooterSection = styled.View`
  padding: ${(props) => props.theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.border};
`;

const AppVersion = styled.Text`
  font-size: ${(props) => props.theme.typography.micro.fontSize}px;
  color: ${(props) => props.theme.colors.textMuted};
  text-align: center;
  margin-top: 8px;
`;

const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: ${(props) => props.theme.radii.sm}px;
  background-color: ${(props) => props.theme.colors.dangerLight};
`;

const LogoutText = styled.Text`
  font-size: ${(props) => props.theme.typography.caption.fontSize}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.danger};
  margin-left: 6px;
`;

export default function CustomDrawerContent({ navigation, state }) {
  const theme = useTheme();
  const { usuarioLogado } = useCaronas();

  const handleLogout = () => {
    Alert.alert('UniRide', 'Sessão do estudante João Pedro Silva (UniAcademia).');
  };

  return (
    <DrawerContainer>
      <HeaderSection>
        <UserAvatar source={{ uri: usuarioLogado.foto }} />
        <UserName>{usuarioLogado.nome}</UserName>
        <UserCourse>{usuarioLogado.curso} • UniAcademia</UserCourse>
        <VerifiedBadge>
          <Ionicons name="shield-checkmark" size={12} color={theme.colors.success} />
          <VerifiedText>Aluno Verificado</VerifiedText>
        </VerifiedBadge>
      </HeaderSection>

      <MenuList showsVerticalScrollIndicator={false}>
        <MenuItem
          onPress={() => navigation.navigate('MainTabs', { screen: 'Explorar' })}
        >
          <Feather name="compass" size={20} color={theme.colors.primary} />
          <MenuLabel>Explorar Caronas</MenuLabel>
        </MenuItem>

        <MenuItem
          onPress={() => navigation.navigate('MainTabs', { screen: 'Oferecer' })}
        >
          <Feather name="plus-circle" size={20} color={theme.colors.primary} />
          <MenuLabel>Oferecer Carona</MenuLabel>
        </MenuItem>

        <MenuItem
          onPress={() => navigation.navigate('MainTabs', { screen: 'Viagens' })}
        >
          <Feather name="calendar" size={20} color={theme.colors.primary} />
          <MenuLabel>Minhas Viagens</MenuLabel>
        </MenuItem>

        <MenuItem
          onPress={() => navigation.navigate('MainTabs', { screen: 'Avisos' })}
        >
          <Feather name="message-square" size={20} color={theme.colors.primary} />
          <MenuLabel>Central de Avisos / Chat</MenuLabel>
        </MenuItem>

        <MenuItem
          onPress={() => navigation.navigate('AvaliacoesSeguranca')}
        >
          <Feather name="shield" size={20} color={theme.colors.primary} />
          <MenuLabel>Avaliações e Segurança</MenuLabel>
        </MenuItem>

        <MenuItem
          onPress={() => navigation.navigate('MainTabs', { screen: 'Perfil' })}
        >
          <Feather name="user" size={20} color={theme.colors.primary} />
          <MenuLabel>Perfil Universitário</MenuLabel>
        </MenuItem>
      </MenuList>

      <FooterSection>
        <LogoutButton onPress={handleLogout}>
          <Feather name="log-out" size={16} color={theme.colors.danger} />
          <LogoutText>Sair da Conta</LogoutText>
        </LogoutButton>
        <AppVersion>UniRide v1.0.0 • Desenvolvimento Móvel 2026-2</AppVersion>
      </FooterSection>
    </DrawerContainer>
  );
}
