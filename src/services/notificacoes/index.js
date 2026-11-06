import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";

import { useAuth } from "../../context/AuthContext";
import { useAvisos } from "../../context/AvisosContext";
import { useCaronas } from "../../context/CaronasContext";
import { navegarPara } from "../../navigation/navegacao";
import theme from "../../theme";
import { formatarHora } from "../../utils/formato";
import { repo } from "..";
import { lerEventosNotificados, salvarEventosNotificados } from "../localStore";
import { eventosDasMensagens, eventosDasReservas, filtrarNovos, viagemEmDestaque } from "./eventos";

// Conta gratuita da Apple não tem push remoto: o app escuta o Firestore
// e dispara notificação local no próprio aparelho.

const ID_VIAGEM = "viagem-em-destaque";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("avisos", {
    name: "Pedidos, reservas e mensagens",
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: theme.colors.secondary,
  }).catch(() => {});
  Notifications.setNotificationChannelAsync("viagem", {
    name: "Carona em andamento",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: theme.colors.secondary,
  }).catch(() => {});
}

// Explica antes do diálogo do sistema, e só pergunta uma vez.
async function pedirPermissao() {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted || !atual.canAskAgain) return atual.granted;
  const aceitou = await new Promise((resolve) =>
    Alert.alert(
      "Avisos das suas caronas",
      "O UniRide avisa quando pedem vaga, quando o motorista responde e quando chega mensagem. Os avisos ficam só neste aparelho.",
      [
        { text: "Agora não", style: "cancel", onPress: () => resolve(false) },
        { text: "Permitir", onPress: () => resolve(true) },
      ],
    ),
  );
  if (!aceitou) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

function abrir(resposta) {
  const { rota, parametros } = resposta?.notification?.request?.content?.data || {};
  // Espera a navegação montar quando o app abriu pelo toque.
  if (rota) setTimeout(() => navegarPara(rota, parametros), 300);
}

async function mostrarViagem(item) {
  if (!item) return Notifications.dismissNotificationAsync(ID_VIAGEM).catch(() => {});
  const { carona } = item;
  const veiculo = carona.motorista?.veiculo || {};
  const emViagem = carona.status === "em_andamento";
  await Notifications.scheduleNotificationAsync({
    identifier: ID_VIAGEM,
    content: {
      title: emViagem ? `Em viagem para ${carona.campusDestino}` : `Saída às ${formatarHora(carona.saidaEm)} · ${veiculo.placa || ""}`,
      body: `${carona.origem?.ponto || carona.origem?.bairro}. ${carona.motorista?.nome}, ${veiculo.modelo || ""} ${veiculo.cor || ""}, placa ${veiculo.placa || ""}.`,
      data: { rota: "Conversa", parametros: { caronaId: carona.id } },
      sticky: true,
      autoDismiss: false,
      sound: false,
    },
    trigger: Platform.OS === "android" ? { channelId: "viagem" } : null,
  });
}

export function useNotificacoes() {
  const { usuario, perfil } = useAuth();
  const uid = usuario?.uid;
  const { minhasReservas } = useCaronas();
  const { conversas } = useAvisos();
  const [permitido, setPermitido] = useState(false);
  const [doMotorista, setDoMotorista] = useState([]);
  const vistos = useRef(null);
  const fila = useRef(Promise.resolve());
  const viagemAtual = useRef("");

  useEffect(() => {
    if (!perfil) return;
    pedirPermissao().then(setPermitido).catch(() => {});
  }, [!!perfil]);

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then(abrir).catch(() => {});
    const inscricao = Notifications.addNotificationResponseReceivedListener(abrir);
    return () => inscricao.remove();
  }, []);

  useEffect(() => {
    if (!uid) return undefined;
    return repo.reservas.observarDoMotorista(uid, setDoMotorista, () => {});
  }, [uid]);

  useEffect(() => {
    if (!uid || !permitido) return;
    const eventos = [
      ...eventosDasReservas({ uid, doMotorista, doPassageiro: minhasReservas }),
      ...eventosDasMensagens({ uid, conversas }),
    ];
    // Uma checagem por vez, para duas mudanças seguidas não lerem o mesmo histórico.
    fila.current = fila.current.then(async () => {
      if (!vistos.current) vistos.current = await lerEventosNotificados();
      const resultado = filtrarNovos(eventos, vistos.current);
      vistos.current = resultado.vistos;
      await salvarEventosNotificados(resultado.vistos);
      for (const evento of resultado.novos) {
        await Notifications.scheduleNotificationAsync({
          content: { title: evento.titulo, body: evento.corpo, data: { rota: evento.rota, parametros: evento.parametros } },
          trigger: Platform.OS === "android" ? { channelId: "avisos" } : null,
        });
      }
    }).catch(() => {});
  }, [uid, permitido, doMotorista, minhasReservas, conversas]);

  // Notificação contínua da próxima carona aceita, no lugar da Live Activity (que exigiria código nativo).
  // ponytail: a janela de 2 h só é reavaliada quando as reservas mudam; um relógio resolveria se fizer falta.
  useEffect(() => {
    if (!permitido) return;
    const item = uid ? viagemEmDestaque(minhasReservas) : null;
    const chave = item ? `${item.carona.id}:${item.carona.status}` : "";
    if (chave === viagemAtual.current) return;
    viagemAtual.current = chave;
    mostrarViagem(item).catch(() => {});
  }, [uid, permitido, minhasReservas]);

  useEffect(() => {
    if (uid) return;
    vistos.current = null;
    Notifications.dismissAllNotificationsAsync().catch(() => {});
  }, [uid]);
}
