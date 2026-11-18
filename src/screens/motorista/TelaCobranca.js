import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EstadoTela from "../../components/EstadoTela";
import MotionPressable from "../../components/MotionPressable";
import QrCode from "../../components/QrCode";
import { useAuth } from "../../context/AuthContext";
import { useCarona, useCaronas } from "../../context/CaronasContext";
import theme from "../../theme";
import { codigoPix, formatarMoeda } from "../../utils";
import { Acao, Mensagem, s } from "../acesso/ComponentesAcesso";
import { Avatar } from "./comum";

// Fim da viagem no celular do motorista: o passageiro lê o QR, paga, e só então a viagem é finalizada.
export default function TelaCobranca({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { perfil } = useAuth();
  const { carona, carregando, erro } = useCarona(route.params?.caronaId);
  const { concluirViagem } = useCaronas();
  const [copiado, setCopiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState("");

  if (carregando) return <EstadoTela tipo="carregando" titulo="Preparando a cobrança" />;
  if (erro || !carona) return <EstadoTela tipo="erro" titulo="Não foi possível abrir a cobrança" mensagem={erro || "Tente de novo."} />;

  const chave = perfil?.motorista?.chavePix || "";
  const aceitos = carona.passageirosAceitos || [];
  const codigo = codigoPix({ chave, nome: perfil?.nome, centavos: carona.valorCentavos, identificador: `UNIRIDE${carona.id.slice(0, 8)}` });

  async function copiar() {
    try {
      await Clipboard.setStringAsync(chave);
      setCopiado(true);
    } catch {
      setFalha("Não foi possível copiar a chave.");
    }
  }

  function confirmar() {
    Alert.alert("Confirmar pagamento?", "A viagem será finalizada e os passageiros poderão avaliar.", [
      { text: "Voltar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          setEnviando(true);
          setFalha("");
          try {
            await concluirViagem(carona.id);
            navigation.goBack();
          } catch (e) {
            setFalha(e?.message || "Não foi possível finalizar a viagem.");
            setEnviando(false);
          }
        },
      },
    ]);
  }

  return (
    <View style={s.flex}>
      <ScrollView contentContainerStyle={estilos.pagina}>
        <View style={estilos.valorBloco}>
          <Text style={estilos.valorRotulo}>Cada passageiro paga</Text>
          <Text style={estilos.valor}>{formatarMoeda(carona.valorCentavos)}</Text>
        </View>

        {chave ? (
          <View style={estilos.qrCaixa}>
            <QrCode valor={codigo} tamanho={240} cor={theme.colors.primary} />
            <Text style={estilos.qrDica}>Aponte a câmera do app do banco para o código</Text>
            <MotionPressable onPress={copiar} style={estilos.chave} accessibilityLabel="Copiar chave Pix">
              <View style={{ flex: 1 }}>
                <Text style={estilos.chaveRotulo}>Chave Pix</Text>
                <Text style={estilos.chaveValor} numberOfLines={1}>{chave}</Text>
              </View>
              <Feather name={copiado ? "check" : "copy"} size={20} color={theme.colors.secondary} />
            </MotionPressable>
          </View>
        ) : (
          <Mensagem>Cadastre sua chave Pix no Perfil para mostrar o QR code.</Mensagem>
        )}

        <View style={estilos.lista}>
          <Text style={estilos.listaTitulo}>
            {aceitos.length === 1 ? "1 passageiro" : `${aceitos.length} passageiros`}
          </Text>
          {aceitos.map((p) => (
            <View key={p.uid} style={estilos.pessoa}>
              <Avatar nome={p.nome} fotoBase64={p.fotoBase64} tamanho={40} />
              <Text style={estilos.pessoaNome} numberOfLines={1}>{p.nome}</Text>
              <Text style={estilos.pessoaValor}>{formatarMoeda(carona.valorCentavos)}</Text>
            </View>
          ))}
        </View>
        <Mensagem>{falha}</Mensagem>
      </ScrollView>

      <View style={[estilos.barra, { paddingBottom: insets.bottom + 12 }]}>
        <Acao icone="check-circle" carregando={enviando} onPress={confirmar}>
          Confirmar pagamento
        </Acao>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: theme.spacing.md, gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  valorBloco: { alignItems: "center", gap: 4, paddingTop: theme.spacing.sm },
  valorRotulo: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.secondary },
  valor: { fontFamily: theme.fonts.bold, fontSize: 48, lineHeight: 56, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  qrCaixa: { alignItems: "center", gap: 16, padding: 20, borderRadius: theme.radii.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  qrDica: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary, textAlign: "center" },
  chave: { alignSelf: "stretch", flexDirection: "row", alignItems: "center", gap: 12, minHeight: 56, paddingHorizontal: 16, borderRadius: theme.radii.md, backgroundColor: theme.colors.primaryLight },
  chaveRotulo: { fontFamily: theme.fonts.semibold, fontSize: 13, color: theme.colors.secondary },
  chaveValor: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
  lista: { gap: 10 },
  listaTitulo: { fontFamily: theme.fonts.bold, fontSize: 17, color: theme.colors.primary },
  pessoa: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 },
  pessoaNome: { flex: 1, fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  pessoaValor: { fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  barra: { paddingHorizontal: theme.spacing.md, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
});
