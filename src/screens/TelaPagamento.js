import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EstadoTela from "../components/EstadoTela";
import MotionPressable from "../components/MotionPressable";
import { useCarona, useCaronas } from "../context/CaronasContext";
import theme from "../theme";
import { codigoPix, formatarHora, formatarMoeda, rotuloDia } from "../utils";
import { Acao, Mensagem, s } from "./acesso/ComponentesAcesso";
import { Avatar } from "./motorista/comum";

// Fim da viagem para o passageiro: paga o motorista pelo Pix e segue para a avaliação.
export default function TelaPagamento({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { carona, minhaReserva, contato, carregando, erro } = useCarona(route.params?.caronaId);
  const { marcarPago } = useCaronas();
  const [copiado, setCopiado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState("");

  if (carregando) return <EstadoTela tipo="carregando" titulo="Carregando pagamento" />;
  if (erro || !carona || !minhaReserva) return <EstadoTela tipo="erro" titulo="Não foi possível abrir o pagamento" mensagem={erro || "Tente de novo em instantes."} />;

  const motorista = carona.motorista || {};
  const chave = contato?.chavePix;
  const codigo = codigoPix({ chave, nome: motorista.nome, centavos: carona.valorCentavos, identificador: `UNIRIDE${carona.id.slice(0, 8)}` });
  const pago = !!minhaReserva.pagoEm;

  async function copiar(texto, qual) {
    try {
      await Clipboard.setStringAsync(texto);
      setCopiado(qual);
      setFalha("");
    } catch {
      setFalha("Não foi possível copiar.");
    }
  }

  async function confirmar() {
    setEnviando(true);
    setFalha("");
    try {
      await marcarPago(minhaReserva.id);
      navigation.replace("AvaliarViagem", { reservaId: minhaReserva.id });
    } catch (e) {
      setFalha(e?.message || "Não foi possível registrar o pagamento.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={s.flex}>
      <ScrollView contentContainerStyle={estilos.pagina}>
        <View style={estilos.valorBloco}>
          <Text style={estilos.valorRotulo}>{pago ? "Pago" : "Valor da viagem"}</Text>
          <Text style={estilos.valor}>{formatarMoeda(carona.valorCentavos)}</Text>
          <Text style={estilos.viagem}>
            {rotuloDia(carona.saidaEm)}, {formatarHora(carona.saidaEm)} até {carona.campusDestino}
          </Text>
        </View>

        <View style={estilos.para}>
          <Avatar nome={motorista.nome} fotoBase64={motorista.fotoBase64} tamanho={48} />
          <View style={{ flex: 1 }}>
            <Text style={estilos.paraRotulo}>Para</Text>
            <Text style={estilos.paraNome}>{motorista.nome}</Text>
          </View>
          <Feather name="check-circle" size={22} color={pago ? theme.colors.success : theme.colors.border} />
        </View>

        {chave ? (
          <View style={estilos.pix}>
            <View style={estilos.pixTopo}>
              <Feather name="zap" size={18} color={theme.colors.secondary} />
              <Text style={estilos.pixTitulo}>Pix</Text>
            </View>
            <Text style={estilos.codigo} numberOfLines={3} selectable>
              {codigo}
            </Text>
            <Acao icone={copiado === "codigo" ? "check" : "copy"} onPress={() => copiar(codigo, "codigo")}>
              {copiado === "codigo" ? "Código copiado" : "Copiar código Pix"}
            </Acao>
            <MotionPressable onPress={() => copiar(chave, "chave")} style={estilos.chave} accessibilityLabel="Copiar chave Pix">
              <Text style={estilos.chaveRotulo}>Chave</Text>
              <Text style={estilos.chaveValor} numberOfLines={1}>{chave}</Text>
              <Feather name={copiado === "chave" ? "check" : "copy"} size={18} color={theme.colors.secondary} />
            </MotionPressable>
            <Text style={estilos.passos}>Abra o app do seu banco, escolha Pix copia e cola e cole o código. O valor já vem preenchido.</Text>
          </View>
        ) : (
          <Mensagem>O motorista não cadastrou chave Pix. Combine o pagamento pela conversa.</Mensagem>
        )}

        <Mensagem>{falha}</Mensagem>
      </ScrollView>

      <View style={[estilos.barra, { paddingBottom: insets.bottom + 12 }]}>
        {pago ? (
          <Acao icone="star" onPress={() => navigation.replace("AvaliarViagem", { reservaId: minhaReserva.id })}>
            Avaliar viagem
          </Acao>
        ) : (
          <Acao icone="check" carregando={enviando} onPress={confirmar}>
            Já paguei
          </Acao>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: theme.spacing.md, gap: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  valorBloco: { alignItems: "center", gap: 6, paddingVertical: theme.spacing.md },
  valorRotulo: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.secondary },
  valor: { fontFamily: theme.fonts.bold, fontSize: 48, lineHeight: 56, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  viagem: { fontFamily: theme.fonts.medium, fontSize: 15, color: theme.colors.text, textAlign: "center" },
  para: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: theme.radii.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  paraRotulo: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.textSecondary },
  paraNome: { fontFamily: theme.fonts.bold, fontSize: 17, color: theme.colors.primary },
  pix: { gap: 14, padding: 16, borderRadius: theme.radii.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  pixTopo: { flexDirection: "row", alignItems: "center", gap: 8 },
  pixTitulo: { fontFamily: theme.fonts.bold, fontSize: 18, color: theme.colors.primary },
  codigo: { fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }), fontSize: 13, lineHeight: 19, color: theme.colors.text, padding: 12, borderRadius: theme.radii.md, backgroundColor: theme.colors.primaryLight },
  chave: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 48, paddingHorizontal: 12, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.border },
  chaveRotulo: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  chaveValor: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.text },
  passos: { fontFamily: theme.fonts.regular, fontSize: 14, lineHeight: 21, color: theme.colors.text },
  barra: { paddingHorizontal: theme.spacing.md, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
});
