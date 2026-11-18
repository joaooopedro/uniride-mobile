import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BuscaRua from "../components/BuscaRua";
import MapaRota from "../components/MapaRota";
import { ChipsDia, Segmento } from "../components/Opcoes";
import { useCaronas } from "../context/CaronasContext";
import theme from "../theme";
import { CAMPI, campusPorNome } from "../utils";
import { Acao, Campo, Mensagem, s } from "./acesso/ComponentesAcesso";
import { dataParaIso, mascararHora, proximosDias } from "./motorista/logica";

const OPCOES_CAMPUS = CAMPI.map((c) => ({ id: c.nome, rotulo: c.nome.replace("Campus ", "").replace(" (Centro)", "") }));

// O passageiro deixa avisado de onde sai, para onde vai e quando. Motoristas veem e combinam o ponto.
export default function TelaPedirCarona({ navigation }) {
  const insets = useSafeAreaInsets();
  const { meuInteresse, salvarInteresse, cancelarInteresse } = useCaronas();
  const [form, setForm] = useState(() => ({
    rua: meuInteresse?.origem?.rua || "",
    origem: meuInteresse?.origem || null,
    campusDestino: meuInteresse?.campusDestino || CAMPI[0].nome,
    dia: meuInteresse?.dia || dataParaIso(new Date(Date.now() + 86400000)),
    hora: meuInteresse?.hora || "07:00",
  }));
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState("");
  const mudar = (campo) => (valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const campus = campusPorNome(form.campusDestino);
  const pontos = [
    form.origem && { lat: form.origem.lat, lng: form.origem.lng, titulo: "Você sai daqui", tipo: "carona" },
    campus && { lat: campus.lat, lng: campus.lng, titulo: campus.nome, tipo: "destino" },
  ].filter(Boolean);

  async function salvar() {
    setEnviando(true);
    setFalha("");
    try {
      await salvarInteresse({ origem: form.origem, campusDestino: form.campusDestino, dia: form.dia, hora: form.hora });
      navigation.goBack();
    } catch (e) {
      setFalha(e?.message || "Não foi possível salvar.");
      setEnviando(false);
    }
  }

  function cancelar() {
    Alert.alert("Cancelar o pedido?", "Os motoristas deixam de ver que você precisa de carona.", [
      { text: "Voltar", style: "cancel" },
      {
        text: "Cancelar pedido",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelarInteresse();
            navigation.goBack();
          } catch (e) {
            setFalha(e?.message || "Não foi possível cancelar.");
          }
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={estilos.pagina}>
        <Text style={s.titulo}>Preciso de carona</Text>
        <Text style={estilos.explica}>Os motoristas veem seu pedido e combinam com você um ponto de encontro no caminho deles.</Text>

        <BuscaRua
          rotulo="De onde você sai"
          valor={form.rua}
          onMudarTexto={(texto) => setForm((atual) => ({ ...atual, rua: texto, origem: null }))}
          onEscolher={(r) => setForm((atual) => ({ ...atual, rua: r.rua, origem: r }))}
        />
        {form.origem ? <MapaRota pontos={pontos} altura={180} /> : null}

        <Segmento rotulo="Para qual campus" opcoes={OPCOES_CAMPUS} valor={form.campusDestino} onMudar={mudar("campusDestino")} />
        <ChipsDia rotulo="Quando" dias={proximosDias()} valor={form.dia} onMudar={mudar("dia")} />
        <Campo
          label="Horário que precisa sair"
          icon="clock"
          value={form.hora}
          onChangeText={(t) => mudar("hora")(mascararHora(t))}
          keyboardType="number-pad"
          maxLength={5}
          placeholder="07:00"
        />
        <Mensagem>{falha}</Mensagem>
      </ScrollView>
      <View style={[estilos.barra, { paddingBottom: insets.bottom + 12 }]}>
        {meuInteresse ? (
          <View style={estilos.linha}>
            <Acao icone="x" secundario onPress={cancelar} style={{ flex: 1 }}>
              Cancelar pedido
            </Acao>
            <Acao icone="check" carregando={enviando} disabled={!form.origem} onPress={salvar} style={{ flex: 1 }}>
              Salvar
            </Acao>
          </View>
        ) : (
          <Acao icone="bell" carregando={enviando} disabled={!form.origem} onPress={salvar}>
            Avisar os motoristas
          </Acao>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: theme.spacing.md, gap: theme.spacing.md, paddingBottom: theme.spacing.xl },
  explica: { fontFamily: theme.fonts.medium, fontSize: 15, lineHeight: 22, color: theme.colors.text },
  barra: { paddingHorizontal: theme.spacing.md, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.background },
  linha: { flexDirection: "row", gap: 8 },
});
