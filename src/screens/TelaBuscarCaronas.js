import React, { useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";

import EstadoTela from "../components/EstadoTela";
import MapaRota from "../components/MapaRota";
import MotionPressable from "../components/MotionPressable";
import { Segmento } from "../components/Opcoes";
import { useCaronas } from "../context/CaronasContext";
import theme from "../theme";
import { formatarHora, formatarMoeda, iniciais, paraData, rotuloDia } from "../utils";
import { montarSaida } from "./motorista/logica";
import { CAMPI } from "../utils/campi";

const CAMPUS = [{ id: null, rotulo: "Todos" }, ...CAMPI.map((c) => ({ id: c.nome, rotulo: c.nome.replace("Campus ", "").replace(" (Centro)", "") }))];
const TURNOS = [
  { id: null, rotulo: "Qualquer" },
  { id: "manha", rotulo: "Manhã" },
  { id: "tarde", rotulo: "Tarde" },
  { id: "noite", rotulo: "Noite" },
];
const PRECOS = [
  { id: null, rotulo: "Qualquer" },
  { id: 500, rotulo: "Até R$ 5" },
  { id: 800, rotulo: "Até R$ 8" },
  { id: 1200, rotulo: "Até R$ 12" },
];

const normalizar = (texto = "") => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const turnoDe = (carona) => {
  const hora = paraData(carona.saidaEm)?.getHours() ?? -1;
  return hora < 12 ? "manha" : hora < 18 ? "tarde" : "noite";
};
const origemTexto = (origem = {}) => [origem.rua, origem.bairro].filter(Boolean).join(", ") || "Origem não informada";

// Topo da busca: pedir carona aos motoristas, ver o pedido ativo ou abrir a carona combinada.
function AvisoPedido({ interesse, navigation }) {
  if (interesse?.status === "combinado") {
    return (
      <MotionPressable onPress={() => navigation.navigate("DetalhesCarona", { caronaId: interesse.caronaId })} style={[estilos.aviso, estilos.avisoCombinado]}>
        <Feather name="check-circle" size={22} color={theme.colors.surface} />
        <View style={estilos.flex}>
          <Text style={[estilos.avisoTitulo, { color: theme.colors.surface }]}>{interesse.motorista?.nome?.split(" ")[0]} combinou uma carona com você</Text>
          <Text style={[estilos.avisoTexto, { color: theme.colors.surface }]}>Toque para ver o ponto e confirmar a vaga</Text>
        </View>
        <Feather name="chevron-right" size={20} color={theme.colors.surface} />
      </MotionPressable>
    );
  }
  if (interesse) {
    return (
      <MotionPressable onPress={() => navigation.navigate("PedirCarona")} style={estilos.aviso}>
        <Feather name="bell" size={20} color={theme.colors.secondary} />
        <View style={estilos.flex}>
          <Text style={estilos.avisoTitulo}>
            Pedido ativo: {rotuloDia(montarSaida(interesse.dia, interesse.hora))}, {interesse.hora}
          </Text>
          <Text style={estilos.avisoTexto} numberOfLines={1}>Os motoristas já veem que você precisa ir para {interesse.campusDestino}</Text>
        </View>
        <Feather name="edit-2" size={18} color={theme.colors.primary} />
      </MotionPressable>
    );
  }
  return (
    <MotionPressable onPress={() => navigation.navigate("PedirCarona")} style={estilos.aviso}>
      <Feather name="bell" size={20} color={theme.colors.secondary} />
      <Text style={[estilos.avisoTitulo, estilos.flex]}>Não achou? Avise os motoristas</Text>
      <Feather name="chevron-right" size={20} color={theme.colors.primary} />
    </MotionPressable>
  );
}

function LinhaCarona({ carona, onPress }) {
  const lotada = carona.vagasRestantes === 0;
  const nome = carona.motorista?.nome || "Motorista";
  const nota = carona.motorista?.nota;
  return (
    <MotionPressable
      onPress={onPress}
      style={[estilos.item, lotada && estilos.itemLotado]}
      accessibilityLabel={`Carona de ${nome}, ${rotuloDia(carona.saidaEm)} às ${formatarHora(carona.saidaEm)}, ${formatarMoeda(carona.valorCentavos)}`}
    >
      <View style={estilos.itemTopo}>
        <Text style={estilos.itemHora}>{formatarHora(carona.saidaEm)}</Text>
        <Text style={estilos.itemDia}>{rotuloDia(carona.saidaEm)}</Text>
        <Text style={estilos.itemPreco}>{formatarMoeda(carona.valorCentavos)}</Text>
      </View>
      <View style={estilos.trajeto}>
        <View style={estilos.trajetoLinha}>
          <View style={[estilos.marco, { backgroundColor: theme.colors.primary }]} />
          <Text numberOfLines={1} style={estilos.trajetoTexto}>{origemTexto(carona.origem)}</Text>
        </View>
        <View style={estilos.trajetoLinha}>
          <View style={[estilos.marco, { backgroundColor: theme.colors.secondary }]} />
          <Text numberOfLines={1} style={estilos.trajetoTexto}>{carona.campusDestino}</Text>
        </View>
      </View>
      <View style={estilos.itemRodape}>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarTexto}>{iniciais(nome)}</Text>
        </View>
        <Text numberOfLines={1} style={estilos.motorista}>{nome}</Text>
        <Feather name="star" size={14} color={theme.colors.warning} />
        <Text style={estilos.nota}>{nota ? Number(nota).toFixed(1).replace(".", ",") : "Novo"}</Text>
        <View style={estilos.flex} />
        <Text style={[estilos.vagas, lotada && estilos.vagasLotada]}>
          {lotada ? "Lotada" : `${carona.vagasRestantes} ${carona.vagasRestantes === 1 ? "vaga" : "vagas"}`}
        </Text>
      </View>
    </MotionPressable>
  );
}

export default function TelaBuscarCaronas({ navigation }) {
  const { caronasAbertas = [], carregandoCaronas, erroCaronas, recarregar, meuInteresse } = useCaronas();
  const { height: alturaTela } = useWindowDimensions();
  const [busca, setBusca] = useState("");
  const [campus, setCampus] = useState(null);
  const [turno, setTurno] = useState(null);
  const [preco, setPreco] = useState(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [modo, setModo] = useState("lista");
  const [selecionada, setSelecionada] = useState(null);

  const ativos = [campus, turno, preco].filter((v) => v !== null).length;
  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    return caronasAbertas.filter((c) => {
      const local = normalizar(`${c.origem?.rua || ""} ${c.origem?.bairro || ""} ${c.origem?.ponto || ""}`);
      return (
        (!termo || local.includes(termo)) &&
        (!campus || c.campusDestino === campus) &&
        (!turno || turnoDe(c) === turno) &&
        (!preco || c.valorCentavos <= preco)
      );
    });
  }, [caronasAbertas, busca, campus, turno, preco]);
  const pontos = useMemo(
    () =>
      filtradas
        .filter((c) => c.origem?.lat != null && c.origem?.lng != null)
        .map((c) => ({ lat: c.origem.lat, lng: c.origem.lng, titulo: c.motorista?.nome || "Carona", tipo: "carona", carona: c })),
    [filtradas],
  );

  const abrir = (carona) => navigation.navigate("DetalhesCarona", { caronaId: carona.id });
  const limpar = () => {
    setBusca("");
    setCampus(null);
    setTurno(null);
    setPreco(null);
    setSelecionada(null);
  };

  if (carregandoCaronas && !caronasAbertas.length) return <EstadoTela tipo="carregando" titulo="Buscando caronas" />;
  if (erroCaronas && !caronasAbertas.length)
    return <EstadoTela tipo="erro" titulo="Não foi possível carregar as caronas" mensagem={erroCaronas} acao={{ rotulo: "Tentar de novo", onPress: recarregar }} />;

  return (
    <View style={estilos.tela}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo} accessibilityRole="header">Buscar carona</Text>
        <View style={estilos.alternar}>
          {[
            ["lista", "list"],
            ["mapa", "map"],
          ].map(([id, icone]) => (
            <MotionPressable
              key={id}
              onPress={() => setModo(id)}
              accessibilityLabel={id === "lista" ? "Ver em lista" : "Ver no mapa"}
              accessibilityState={{ selected: modo === id }}
              style={[estilos.alternarBotao, modo === id && estilos.alternarAtivo]}
            >
              <Feather name={icone} size={18} color={modo === id ? theme.colors.surface : theme.colors.primary} />
            </MotionPressable>
          ))}
        </View>
      </View>

      <View style={estilos.buscaLinha}>
        <View style={estilos.busca}>
          <Feather name="search" size={18} color={theme.colors.textSecondary} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Rua ou bairro de saída"
            placeholderTextColor={theme.colors.textMuted}
            style={estilos.buscaInput}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Buscar por rua ou bairro"
          />
          {busca ? (
            <MotionPressable onPress={() => setBusca("")} accessibilityLabel="Limpar busca" style={estilos.limparBusca}>
              <Feather name="x" size={18} color={theme.colors.textSecondary} />
            </MotionPressable>
          ) : null}
        </View>
        <MotionPressable
          onPress={() => setFiltrosAbertos((v) => !v)}
          accessibilityLabel={`Filtros${ativos ? `, ${ativos} ativos` : ""}`}
          accessibilityState={{ expanded: filtrosAbertos }}
          style={[estilos.botaoFiltro, (filtrosAbertos || ativos > 0) && estilos.botaoFiltroAtivo]}
        >
          <Feather name="sliders" size={18} color={filtrosAbertos || ativos ? theme.colors.surface : theme.colors.primary} />
          {ativos ? <Text style={estilos.botaoFiltroNumero}>{ativos}</Text> : null}
        </MotionPressable>
      </View>

      {filtrosAbertos ? (
        <View style={estilos.painel}>
          <Segmento rotulo="Campus" opcoes={CAMPUS} valor={campus} onMudar={setCampus} />
          <Segmento rotulo="Turno" opcoes={TURNOS} valor={turno} onMudar={setTurno} />
          <Segmento rotulo="Preço" opcoes={PRECOS} valor={preco} onMudar={setPreco} />
          {ativos ? (
            <MotionPressable onPress={limpar} style={estilos.limparFiltros}>
              <Text style={estilos.limparTexto}>Limpar filtros</Text>
            </MotionPressable>
          ) : null}
        </View>
      ) : null}

      {erroCaronas ? (
        <MotionPressable onPress={recarregar} style={estilos.erroAtualizacao}>
          <Text style={estilos.erroTexto}>{erroCaronas}</Text>
          <Text style={estilos.limparTexto}>Tentar de novo</Text>
        </MotionPressable>
      ) : null}

      <AvisoPedido interesse={meuInteresse} navigation={navigation} />

      {filtradas.length ? (
        <Text style={estilos.contagem}>
          {filtradas.length} {filtradas.length === 1 ? "carona" : "caronas"}
        </Text>
      ) : null}

      {filtradas.length === 0 ? (
        <EstadoTela
          tipo="vazio"
          titulo={caronasAbertas.length ? "Nenhuma carona com esses filtros" : "Nenhuma carona publicada ainda"}
          mensagem={caronasAbertas.length ? "Mude a busca ou limpe os filtros." : "Quando um motorista publicar, ela aparece aqui."}
          acao={caronasAbertas.length ? { rotulo: "Limpar filtros", onPress: limpar } : { rotulo: "Atualizar", onPress: recarregar }}
        />
      ) : modo === "lista" ? (
        <FlatList
          style={estilos.flex}
          data={filtradas}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <LinhaCarona carona={item} onPress={() => abrir(item)} />}
          contentContainerStyle={estilos.lista}
          ItemSeparatorComponent={() => <View style={estilos.separador} />}
          refreshControl={<RefreshControl refreshing={carregandoCaronas} onRefresh={recarregar} tintColor={theme.colors.secondary} />}
        />
      ) : (
        <View style={estilos.mapaArea}>
          <MapaRota pontos={pontos} altura={Math.max(220, Math.min(380, Math.floor(alturaTela * 0.45)))} onToquePonto={(p) => setSelecionada(p.carona)} />
          {selecionada ? (
            <LinhaCarona carona={selecionada} onPress={() => abrir(selecionada)} />
          ) : (
            <Text style={estilos.dica}>Toque num ponto para ver a carona</Text>
          )}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  cabecalho: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.mdSm },
  titulo: { fontFamily: theme.fonts.bold, fontSize: 28, lineHeight: 36, color: theme.colors.primary },
  alternar: { flexDirection: "row", padding: 4, gap: 4, borderRadius: theme.radii.md, backgroundColor: theme.colors.primaryLight },
  alternarBotao: { width: 40, height: 40, borderRadius: theme.radii.sm, alignItems: "center", justifyContent: "center" },
  alternarAtivo: { backgroundColor: theme.colors.primary },
  buscaLinha: { flexDirection: "row", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
  busca: { flex: 1, height: 52, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, paddingLeft: 16, paddingRight: 4, borderRadius: theme.radii.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  buscaInput: { flex: 1, height: 52, fontFamily: theme.fonts.medium, fontSize: 16, color: theme.colors.primary },
  limparBusca: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  botaoFiltro: { width: 52, height: 52, borderRadius: theme.radii.md, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 4, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  botaoFiltroAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  botaoFiltroNumero: { fontFamily: theme.fonts.bold, fontSize: 13, color: theme.colors.surface },
  painel: { marginHorizontal: theme.spacing.md, marginTop: theme.spacing.mdSm, padding: 16, gap: 16, borderRadius: theme.radii.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  limparFiltros: { alignSelf: "flex-start", minHeight: 40, justifyContent: "center" },
  limparTexto: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.secondary },
  erroAtualizacao: { marginHorizontal: theme.spacing.md, marginTop: theme.spacing.mdSm, padding: theme.spacing.mdSm, borderRadius: theme.radii.md, backgroundColor: theme.colors.dangerLight, flexDirection: "row", alignItems: "center", gap: 8 },
  erroTexto: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.danger },
  aviso: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: theme.spacing.md, marginTop: theme.spacing.mdSm, minHeight: 56, paddingHorizontal: 16, paddingVertical: 12, borderRadius: theme.radii.lg, backgroundColor: theme.colors.secondaryLight },
  avisoCombinado: { backgroundColor: theme.colors.secondary },
  avisoTitulo: { fontFamily: theme.fonts.bold, fontSize: 15, color: theme.colors.primary },
  avisoTexto: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.text, marginTop: 2 },
  contagem: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm, fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  lista: { paddingHorizontal: theme.spacing.md, paddingBottom: 40 },
  separador: { height: 12 },
  item: { padding: 16, gap: 14, borderRadius: theme.radii.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  itemLotado: { opacity: 0.6 },
  itemTopo: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  itemHora: { fontFamily: theme.fonts.bold, fontSize: 26, lineHeight: 32, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  itemDia: { flex: 1, fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.secondary },
  itemPreco: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.primary, fontVariant: ["tabular-nums"] },
  trajeto: { gap: 8 },
  trajetoLinha: { flexDirection: "row", alignItems: "center", gap: 10 },
  marco: { width: 8, height: 8, borderRadius: 4 },
  trajetoTexto: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 15, color: theme.colors.text },
  itemRodape: { flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: 2 },
  avatarTexto: { fontFamily: theme.fonts.bold, fontSize: 11, color: theme.colors.primary },
  motorista: { flexShrink: 1, fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  nota: { fontFamily: theme.fonts.semibold, fontSize: 13, color: theme.colors.primary },
  vagas: { fontFamily: theme.fonts.bold, fontSize: 14, color: theme.colors.success },
  vagasLotada: { color: theme.colors.textMuted },
  mapaArea: { flex: 1, paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md, gap: 12 },
  dica: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.textSecondary, textAlign: "center" },
});
