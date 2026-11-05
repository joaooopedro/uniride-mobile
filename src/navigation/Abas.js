import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useAvisos } from "../context/AvisosContext";
import { useCaronas } from "../context/CaronasContext";
import { useInterface } from "../context/InterfaceContext";
import AppHeader from "../components/AppHeader";
import BarraAbas from "./BarraAbas";
import { TELAS } from "./telas";

const Tab = createBottomTabNavigator();

const ABAS = {
  passageiro: [
    { nome: "Buscar", rotulo: "Buscar", icones: ["search-outline", "search"] },
    { nome: "Reservas", rotulo: "Reservas", icones: ["ticket-outline", "ticket"] },
    { nome: "Conversas", rotulo: "Conversas", icones: ["chatbubble-ellipses-outline", "chatbubble-ellipses"], badge: "mensagens" },
    { nome: "Perfil", rotulo: "Perfil", icones: ["person-outline", "person"] },
  ],
  motorista: [
    { nome: "Rotas", rotulo: "Rotas", icones: ["car-outline", "car"] },
    { nome: "Oferecer", rotulo: "Oferecer", icones: ["add-circle-outline", "add-circle"] },
    { nome: "Solicitacoes", rotulo: "Pedidos", icones: ["people-outline", "people"], badge: "solicitacoes" },
    { nome: "Conversas", rotulo: "Conversas", icones: ["chatbubble-ellipses-outline", "chatbubble-ellipses"], badge: "mensagens" },
    { nome: "Perfil", rotulo: "Perfil", icones: ["person-outline", "person"] },
  ],
};

export default function Abas({ navigation, modo }) {
  const { podeAnimar } = useInterface();
  const { naoLidasTotal } = useAvisos();
  const { solicitacoesPendentes } = useCaronas();
  const contadores = { mensagens: naoLidasTotal, solicitacoes: solicitacoesPendentes.length };
  const abas = ABAS[modo] || ABAS.passageiro;

  return (
    <Tab.Navigator
      key={modo}
      tabBar={(props) => <BarraAbas {...props} abas={abas} contadores={contadores} />}
      screenOptions={{
        header: () => <AppHeader navigation={navigation} title={modo === "motorista" ? "Modo motorista" : "Modo passageiro"} />,
        animation: podeAnimar ? "fade" : "none",
        transitionSpec: { animation: "timing", config: { duration: 160 } },
        tabBarHideOnKeyboard: true,
      }}
    >
      {abas.map((aba) => (
        <Tab.Screen key={aba.nome} name={aba.nome} component={TELAS[aba.nome]} options={{ tabBarLabel: aba.rotulo }} />
      ))}
    </Tab.Navigator>
  );
}
