import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EstadoTela from "../components/EstadoTela";
import MapaRota from "../components/MapaRota";
import MotionPressable from "../components/MotionPressable";
import { useCaronas, useCarona } from "../context/CaronasContext";
import { previsaoNaHora } from "../services/api";
import theme from "../theme";
import { formatarDataHora, formatarDistancia, formatarDuracao, formatarHora, formatarMoeda, formatarNota } from "../utils";
import { Acao, Mensagem, s } from "./acesso/ComponentesAcesso";
import { Avatar, Secao, useEntrada } from "./motorista/comum";
import {
  enderecoCompleto,
  estadoDoPassageiro,
  STATUS_CARONA,
  STATUS_RESERVA,
  textoSaida,
  urlMapas,
  urlMapasWeb,
  urlTelefone,
  urlWhatsapp,
} from "./detalhes/logica";

const cor = (nome) => theme.colors[nome] || theme.colors.textSecondary;

function Clima({ saidaEm }) {
  const [estado, setEstado] = useState({ carregando: true, previsao: null });

  useEffect(() => {
    let ativo = true;
    setEstado({ carregando: true, previsao: null });
    previsaoNaHora(saidaEm)
      .then((previsao) => ativo && setEstado({ carregando: false, previsao }))
      .catch(() => ativo && setEstado({ carregando: false, previsao: null }));
    return () => {
      ativo = false;
    };
  }, [saidaEm?.getTime?.()]);

  if (estado.carregando)
    return (
      <View style={estilos.climaLinha}>
        <ActivityIndicator size="small" color={theme.colors.secondary} />
        <Text style={s.secundario}>Buscando previsão</Text>
      </View>
    );

  if (!estado.previsao)
    return (
      <View style={estilos.climaLinha}>
        <Feather name="cloud-off" size={18} color={theme.colors.textMuted} />
        <Text style={s.secundario}>Previsão indisponível agora</Text>
      </View>
    );

  const { temperatura, chanceChuva, descricao, icone } = estado.previsao;
  return (
    <View style={estilos.climaLinha} accessibilityLabel={`${descricao}, ${temperatura} graus, ${chanceChuva}% de chance de chuva`}>
      <Feather name={icone} size={26} color={theme.colors.secondary} />
      <Text style={estilos.temperatura}>{temperatura}°</Text>
      <View style={estilos.flex}>
        <Text style={estilos.climaTitulo}>{descricao}</Text>
        <Text style={s.secundario}>{chanceChuva}% de chance de chuva</Text>
      </View>
    </View>
  );
}

function LinhaTempo({ carona }) {
  const { origem = {}, rota } = carona;
  return (
    <View>
      <View style={estilos.no}>
        <View style={estilos.trilho}>
          <View style={[estilos.bolinha, { backgroundColor: theme.colors.primary }]}>
            <Feather name="map-pin" size={13} color={theme.colors.surface} />
          </View>
          <View style={estilos.fio} />
        </View>
        <View style={[estilos.flex, estilos.noTexto]}>
          <Text style={estilos.noRotulo}>Ponto de encontro</Text>
          <Text style={estilos.noTitulo}>{enderecoCompleto(origem) || "Endereço não informado"}</Text>
          {origem.ponto ? <Text style={s.secundario}>{origem.ponto}</Text> : null}
        </View>
      </View>

      {rota ? (
        <View style={estilos.no}>
          <View style={estilos.trilho}>
            <View style={estilos.fio} />
          </View>
          <View style={[estilos.rotaInfo, estilos.noTexto]}>
            <View style={estilos.rotaItem}>
              <Feather name="navigation-2" size={14} color={theme.colors.textSecondary} />
              <Text style={estilos.rotaTexto}>{formatarDistancia(rota.distanciaKm)}</Text>
            </View>
            <View style={estilos.rotaItem}>
              <Feather name="clock" size={14} color={theme.colors.textSecondary} />
              <Text style={estilos.rotaTexto}>{formatarDuracao(rota.duracaoMin)}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View style={estilos.no}>
        <View style={estilos.trilho}>
          <View style={[estilos.bolinha, { backgroundColor: theme.colors.secondary }]}>
            <Feather name="flag" size={13} color={theme.colors.surface} />
          </View>
        </View>
        <View style={[estilos.flex, estilos.noTexto]}>
          <Text style={estilos.noRotulo}>Destino</Text>
          <Text style={estilos.noTitulo}>{carona.campusDestino}</Text>
        </View>
      </View>
    </View>
  );
}

function Ferramenta({ icone, familia = "feather", rotulo, onPress, carregando }) {
  const Icone = familia === "fa" ? FontAwesome : Feather;
  return (
    <MotionPressable
      onPress={onPress}
      disabled={carregando}
      accessibilityLabel={rotulo}
      style={estilos.ferramenta}
    >
      <View style={estilos.ferramentaIcone}>
        <Icone name={icone} size={22} color={theme.colors.primary} />
      </View>
      <Text style={estilos.ferramentaTexto} numberOfLines={1}>
        {rotulo}
      </Text>
    </MotionPressable>
  );
}

function EstadoReserva({ icone, texto, cor: nomeCor }) {
  return (
    <View style={estilos.estado}>
      <Feather name={icone} size={18} color={cor(nomeCor)} />
      <Text style={[estilos.estadoTexto, { color: cor(nomeCor) }]}>{texto}</Text>
    </View>
  );
}

function abrirMapas(lat, lng, aoFalhar) {
  Linking.openURL(urlMapas(lat, lng, Platform.OS)).catch(() =>
    Linking.openURL(urlMapasWeb(lat, lng)).catch(() => aoFalhar("Não foi possível abrir o app de mapas.")),
  );
}

function Conteudo({ navigation, caronaId, aoTentar }) {
  const insets = useSafeAreaInsets();
  const entrada = useEntrada();
  const { carona, reservas, minhaReserva, souMotorista, contato, carregando, erro } = useCarona(caronaId);
  const { solicitarReserva, cancelarReserva } = useCaronas();
  const [ocupado, setOcupado] = useState(null);
  const [falha, setFalha] = useState("");
  const [aviso, setAviso] = useState("");
  const [agora, setAgora] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  if (carregando) return <EstadoTela tipo="carregando" titulo="Carregando carona" />;
  if (erro || !carona)
    return (
      <EstadoTela
        tipo="erro"
        titulo="Não foi possível abrir a carona"
        mensagem={erro || "Tente de novo em instantes."}
        acao={{ rotulo: "Tentar de novo", onPress: aoTentar }}
      />
    );

  const { motorista = {}, origem = {}, destino, rota } = carona;
  const veiculo = motorista.veiculo || {};
  const statusCarona = STATUS_CARONA[carona.status] || STATUS_CARONA.aberta;
  const estado = souMotorista ? null : estadoDoPassageiro(carona, minhaReserva);
  const pontos = [
    Number.isFinite(origem.lat) && { lat: origem.lat, lng: origem.lng, titulo: "Encontro", tipo: "origem" },
    destino && Number.isFinite(destino.lat) && { lat: destino.lat, lng: destino.lng, titulo: carona.campusDestino, tipo: "destino" },
  ].filter(Boolean);

  async function executar(chave, acao) {
    setOcupado(chave);
    setFalha("");
    setAviso("");
    try {
      await acao();
    } catch (e) {
      setFalha(e?.message || "Algo deu errado. Tente de novo.");
    } finally {
      setOcupado(null);
    }
  }

  function pedirVaga() {
    Alert.alert(
      "Solicitar vaga",
      `${formatarMoeda(carona.valorCentavos)} · ${formatarDataHora(carona.saidaEm)}\nO motorista precisa aceitar o pedido.`,
      [
        { text: "Agora não", style: "cancel" },
        { text: "Solicitar", onPress: () => executar("solicitar", () => solicitarReserva(carona.id)) },
      ],
    );
  }

  function cancelarPedido() {
    executar("cancelar", () => cancelarReserva(carona.id));
  }

  function cancelarVaga() {
    Alert.alert("Cancelar reserva", "Sua vaga será liberada para outro aluno.", [
      { text: "Manter reserva", style: "cancel" },
      { text: "Cancelar reserva", style: "destructive", onPress: () => executar("cancelar", () => cancelarReserva(carona.id)) },
    ]);
  }

  function abrirLink(url, mensagem) {
    Linking.openURL(url).catch(() => setFalha(mensagem));
  }

  async function copiarPix() {
    if (!contato?.chavePix) return;
    try {
      await Clipboard.setStringAsync(contato.chavePix);
      setFalha("");
      setAviso("Chave PIX copiada.");
    } catch {
      setFalha("Não foi possível copiar a chave PIX.");
    }
  }

  const irParaConversa = () => navigation.navigate("Conversa", { caronaId: carona.id });
  const abrirAvaliacoes = () =>
    navigation.navigate("Avaliacoes", {
      uid: carona.motoristaId,
      nome: motorista.nome,
      curso: motorista.curso,
      nota: motorista.nota,
      fotoBase64: motorista.fotoBase64,
    });

  const aceitos = carona.passageirosAceitos || [];
  const ocupadas = carona.vagasTotais - carona.vagasRestantes;

  return (
    <ScrollView style={s.flex} contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.lg }} showsVerticalScrollIndicator={false}>
      <MapaRota pontos={pontos} linha={rota?.linha} altura={240} style={estilos.mapa} />

      <View style={estilos.pagina}>
        <Animated.View entering={entrada(0)} style={estilos.topo}>
          <View style={estilos.flex}>
            <Text style={estilos.hora} accessibilityLabel={`Saída às ${formatarHora(carona.saidaEm)}`}>
              {formatarHora(carona.saidaEm)}
            </Text>
            <Text style={estilos.contagem}>{textoSaida(carona.saidaEm, agora)}</Text>
            <Text style={s.secundario}>{formatarDataHora(carona.saidaEm)}</Text>
          </View>
          <View style={estilos.precoCaixa}>
            <Text style={estilos.preco}>{formatarMoeda(carona.valorCentavos)}</Text>
            <Text style={s.secundario}>por pessoa</Text>
          </View>
        </Animated.View>
        <EstadoReserva icone={statusCarona.icone} texto={statusCarona.texto} cor={statusCarona.cor} />

        <Animated.View entering={entrada(1)}>
          <LinhaTempo carona={carona} />
        </Animated.View>

        <Animated.View entering={entrada(2)}>
          <Clima saidaEm={carona.saidaEm} />
        </Animated.View>

        <Animated.View entering={entrada(3)} style={estilos.ferramentas}>
          <Ferramenta
            icone="map"
            rotulo="Abrir no Maps"
            onPress={() => Number.isFinite(origem.lat) ? abrirMapas(origem.lat, origem.lng, setFalha) : setFalha("Esta carona não tem local no mapa.")}
          />
          {estado === "aceita" && contato?.telefone ? (
            <>
              <Ferramenta icone="phone" rotulo="Ligar" onPress={() => abrirLink(urlTelefone(contato.telefone), "Não foi possível abrir o telefone.")} />
              <Ferramenta
                icone="whatsapp"
                familia="fa"
                rotulo="WhatsApp"
                onPress={() => abrirLink(urlWhatsapp(contato.telefone), "Não foi possível abrir o WhatsApp.")}
              />
            </>
          ) : null}
          {estado === "aceita" && contato?.chavePix ? <Ferramenta icone="copy" rotulo="Copiar PIX" onPress={copiarPix} /> : null}
        </Animated.View>

        <Secao icone="user" titulo="Motorista">
          <MotionPressable
            onPress={abrirAvaliacoes}
            accessibilityLabel={`Ver avaliações de ${motorista.nome}`}
            style={estilos.motorista}
          >
            <Avatar nome={motorista.nome} fotoBase64={motorista.fotoBase64} tamanho={56} />
            <View style={estilos.flex}>
              <Text style={estilos.nome}>{motorista.nome}</Text>
              {motorista.curso ? <Text style={s.secundario}>{motorista.curso}</Text> : null}
              <View style={estilos.nota} accessibilityLabel={`Nota ${formatarNota(motorista.nota)}`}>
                <Feather name="star" size={15} color={theme.colors.warning} />
                <Text style={estilos.notaTexto}>{formatarNota(motorista.nota)}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
          </MotionPressable>
          {veiculo.modelo ? (
            <View style={estilos.veiculo}>
              <Feather name="truck" size={18} color={theme.colors.primary} />
              <Text style={[estilos.flex, estilos.veiculoTexto]}>
                {[veiculo.marca, veiculo.modelo].filter(Boolean).join(" ")}
                {veiculo.cor ? `, ${veiculo.cor}` : ""}
              </Text>
              {veiculo.placa ? (
                <View style={estilos.placa} accessibilityLabel={`Placa ${veiculo.placa}`}>
                  <Text style={estilos.placaTexto}>{veiculo.placa}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </Secao>

        {carona.comodidades?.length ? (
          <Secao icone="coffee" titulo="Comodidades">
            <View style={estilos.chips}>
              {carona.comodidades.map((item) => (
                <View key={item} style={estilos.chip}>
                  <Feather name="check" size={14} color={theme.colors.secondary} />
                  <Text style={estilos.chipTexto}>{item}</Text>
                </View>
              ))}
            </View>
          </Secao>
        ) : null}

        <Secao icone="users" titulo="Passageiros">
          <View style={estilos.passageiros}>
            <View style={estilos.avatares}>
              {aceitos.map((p, i) => (
                <Avatar key={p.uid || i} nome={p.nome} tamanho={40} sobreposto={i > 0} />
              ))}
            </View>
            <Text style={s.secundario}>
              {aceitos.length ? `${ocupadas} de ${carona.vagasTotais} vagas ocupadas` : `Nenhum passageiro ainda. ${carona.vagasRestantes} de ${carona.vagasTotais} vagas livres.`}
            </Text>
          </View>
        </Secao>

        {souMotorista ? (
          <Secao icone="list" titulo="Reservas">
            {reservas.length ? (
              reservas.map((r) => {
                const st = STATUS_RESERVA[r.status] || STATUS_RESERVA.solicitada;
                return (
                  <View key={r.id} style={estilos.reserva}>
                    <Avatar nome={r.passageiro?.nome} fotoBase64={r.passageiro?.fotoBase64} tamanho={44} />
                    <View style={estilos.flex}>
                      <Text style={estilos.nomePequeno}>{r.passageiro?.nome}</Text>
                      {r.passageiro?.curso ? <Text style={s.secundario}>{r.passageiro.curso}</Text> : null}
                    </View>
                    <EstadoReserva icone={st.icone} texto={st.texto} cor={st.cor} />
                  </View>
                );
              })
            ) : (
              <Text style={s.secundario}>Ninguém pediu vaga ainda. Os pedidos aparecem na aba Pedidos.</Text>
            )}
            <Acao icone="message-circle" secundario onPress={irParaConversa}>
              Abrir conversa
            </Acao>
          </Secao>
        ) : (
          <Secao icone="bookmark" titulo="Sua vaga">
            {estado === "solicitar" && (
              <Acao icone="check-circle" carregando={ocupado === "solicitar"} onPress={pedirVaga}>
                Solicitar vaga
              </Acao>
            )}
            {estado === "sem_vaga" && <EstadoReserva icone="users" texto="Esta carona está sem vagas" cor="textSecondary" />}
            {estado === "solicitada" && (
              <>
                <EstadoReserva icone="clock" texto="Aguardando o motorista" cor="warning" />
                <Acao icone="x" secundario carregando={ocupado === "cancelar"} onPress={cancelarPedido}>
                  Cancelar solicitação
                </Acao>
              </>
            )}
            {estado === "aceita" && (
              <>
                <EstadoReserva icone="check-circle" texto="Vaga confirmada" cor="success" />
                <Acao icone="message-circle" onPress={irParaConversa}>
                  Abrir conversa
                </Acao>
                <Acao icone="x" secundario carregando={ocupado === "cancelar"} onPress={cancelarVaga}>
                  Cancelar reserva
                </Acao>
              </>
            )}
            {estado === "recusada" && <Mensagem>O motorista recusou seu pedido. Procure outra carona.</Mensagem>}
            {estado === "avaliar" && (
              <Acao icone="star" onPress={() => navigation.navigate("AvaliarViagem", { reservaId: minhaReserva.id })}>
                Avaliar viagem
              </Acao>
            )}
            {estado === "avaliada" && <EstadoReserva icone="check-circle" texto="Você já avaliou esta viagem" cor="success" />}
            {(estado === "cancelada" || estado === "indisponivel") && (
              <EstadoReserva icone="info" texto="Esta carona não aceita novos pedidos" cor="textSecondary" />
            )}
          </Secao>
        )}

        {aviso ? <Mensagem sucesso>{aviso}</Mensagem> : null}
        <Mensagem>{falha}</Mensagem>
      </View>
    </ScrollView>
  );
}

export default function TelaDetalhesCarona({ navigation, route }) {
  const [tentativa, setTentativa] = useState(0);
  return (
    <Conteudo
      key={tentativa}
      navigation={navigation}
      caronaId={route.params?.caronaId}
      aoTentar={() => setTentativa((n) => n + 1)}
    />
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  mapa: { borderRadius: 0 },
  pagina: { padding: theme.spacing.md, gap: theme.spacing.md },
  topo: { flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.mdSm },
  hora: { fontFamily: theme.fonts.bold, fontSize: 44, lineHeight: 50, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  contagem: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.secondary },
  precoCaixa: { alignItems: "flex-end" },
  preco: { fontFamily: theme.fonts.bold, fontSize: 28, lineHeight: 34, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  estado: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, minHeight: 32 },
  estadoTexto: { fontFamily: theme.fonts.semibold, fontSize: 14 },
  no: { flexDirection: "row", gap: theme.spacing.mdSm },
  trilho: { width: 28, alignItems: "center" },
  bolinha: { width: 28, height: 28, borderRadius: theme.radii.full, alignItems: "center", justifyContent: "center" },
  fio: { flex: 1, width: 2, minHeight: 18, backgroundColor: theme.colors.border },
  noTexto: { paddingBottom: theme.spacing.mdSm },
  noRotulo: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
  noTitulo: { fontFamily: theme.fonts.semibold, fontSize: 16, lineHeight: 23, color: theme.colors.primary },
  rotaInfo: { flexDirection: "row", gap: theme.spacing.md, alignItems: "center" },
  rotaItem: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  rotaTexto: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.textSecondary },
  climaLinha: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm, minHeight: 48 },
  temperatura: { fontFamily: theme.fonts.bold, fontSize: 24, color: theme.colors.primary },
  climaTitulo: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  ferramentas: { flexDirection: "row", gap: theme.spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: theme.colors.border, paddingVertical: theme.spacing.mdSm },
  ferramenta: { flex: 1, minHeight: 72, alignItems: "center", justifyContent: "center", gap: theme.spacing.xs },
  ferramentaIcone: { width: 48, height: 48, borderRadius: theme.radii.full, backgroundColor: theme.colors.primaryLight, alignItems: "center", justifyContent: "center" },
  ferramentaTexto: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.primary },
  motorista: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm },
  nome: { fontFamily: theme.fonts.bold, fontSize: 17, color: theme.colors.primary },
  nomePequeno: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  nota: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, marginTop: 2 },
  notaTexto: { fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.primary },
  veiculo: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm, minHeight: 48 },
  veiculoTexto: { fontFamily: theme.fonts.medium, fontSize: 15, color: theme.colors.primary },
  placa: { borderWidth: 2, borderColor: theme.colors.primary, borderRadius: theme.radii.sm, paddingHorizontal: theme.spacing.mdSm, paddingVertical: theme.spacing.xs, backgroundColor: theme.colors.surface },
  placaTexto: { fontFamily: theme.fonts.bold, fontSize: 16, letterSpacing: 2, color: theme.colors.primary },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  chip: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, minHeight: 36, paddingHorizontal: theme.spacing.mdSm, borderRadius: theme.radii.sm, backgroundColor: theme.colors.secondaryLight },
  chipTexto: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.primary },
  passageiros: { gap: theme.spacing.sm },
  avatares: { flexDirection: "row", paddingLeft: theme.spacing.mdSm },
  reserva: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm, minHeight: 56 },
});
