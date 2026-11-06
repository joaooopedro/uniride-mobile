import React, { useMemo, useState } from "react";
import { FlatList, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import MotionPressable from "../components/MotionPressable";
import MapaRota from "../components/MapaRota";
import EstadoTela from "../components/EstadoTela";
import { useCaronas } from "../context/CaronasContext";
import { formatarDataHora, formatarMoeda, iniciais, paraData } from "../utils";
import { CAMPI } from "../utils/campi";
import theme from "../theme";

const turnos=[{id:"manha",nome:"Manhã",icon:"sun"},{id:"tarde",nome:"Tarde",icon:"sunset"},{id:"noite",nome:"Noite",icon:"moon"}];
const normalizar=(s="")=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const hora=c=>paraData(c.saidaEm)?.getHours() ?? -1;
const turno=c=>hora(c)<12?"manha":hora(c)<18?"tarde":"noite";

function Ponto(carona) { return carona?.origem?.lat!=null&&carona?.origem?.lng!=null?{lat:carona.origem.lat,lng:carona.origem.lng,titulo:carona.motorista?.nome||"Carona",tipo:"carona",carona}:null; }
function LinhaCarona({carona,onPress,index}) {
 const lotada=carona.vagasRestantes===0, nome=carona.motorista?.nome||"Motorista", nota=carona.motorista?.nota;
 return <MotionPressable onPress={onPress} style={[styles.item,lotada&&{opacity:.68}]} accessibilityLabel={`Carona de ${nome}, ${formatarDataHora(carona.saidaEm)}, ${formatarMoeda(carona.valorCentavos)}`}>
  <View style={styles.topo}><View style={{flex:1}}><View style={styles.inline}><Feather name="clock" size={15} color={theme.colors.secondary}/><Text style={styles.horario}>{formatarDataHora(carona.saidaEm)}</Text></View><Text style={styles.preco}>{formatarMoeda(carona.valorCentavos)}<Text style={styles.porPessoa}> / pessoa</Text></Text></View><View style={[styles.avatar,lotada&&{backgroundColor:theme.colors.borderLight}]}><Text style={styles.avatarTexto}>{iniciais(nome)}</Text></View></View>
  <View style={styles.rota}><View style={styles.rotaIcones}><Feather name="map-pin" size={15} color={theme.colors.secondary}/><View style={styles.traco}/><Feather name="navigation" size={15} color={theme.colors.primary}/></View><View style={{flex:1,gap:7}}><Text numberOfLines={1} style={styles.endereco}>{carona.origem?.bairro||carona.origem?.rua||"Origem não informada"}</Text><Text numberOfLines={1} style={styles.endereco}>{carona.campusDestino}</Text></View></View>
  <View style={styles.rodape}><View style={{flexDirection:"row",alignItems:"center",gap:6,flex:1}}><Feather name="user" size={14} color={theme.colors.textSecondary}/><Text numberOfLines={1} style={styles.meta}>{nome}</Text><Feather name="star" size={13} color={theme.colors.warning}/><Text style={styles.meta}>{nota?Number(nota).toFixed(1).replace(".",","):"Novo"}</Text></View><Text style={[styles.vagas,lotada&&{color:theme.colors.textMuted}]}>{lotada?"Lotada":`${carona.vagasRestantes} ${carona.vagasRestantes===1?"vaga":"vagas"}`}</Text><Feather name="arrow-right" size={17} color={lotada?theme.colors.textMuted:theme.colors.primary}/></View>
 </MotionPressable>;
}

export default function TelaBuscarCaronas({navigation}) {
 const {caronasAbertas=[],carregandoCaronas,erroCaronas,recarregar}=useCaronas();
 const { height: alturaTela } = useWindowDimensions();
 const [busca,setBusca]=useState(""); const [campus,setCampus]=useState("Todos"); const [turn,setTurn]=useState(null); const [preco,setPreco]=useState("");const [modo,setModo]=useState("lista"); const [selecionada,setSelecionada]=useState(null);
 const filtradas=useMemo(()=>caronasAbertas.filter(c=>{
  const termo=normalizar(busca.trim()); const local=normalizar(`${c.origem?.bairro||""} ${c.origem?.rua||""}`); const limite=preco.trim()?Number(preco.replace(",","."))*100:Infinity;
  return (!termo||local.includes(termo))&&(campus==="Todos"||c.campusDestino===campus)&&(!turn||turno(c)===turn)&&(!Number.isFinite(limite)||c.valorCentavos<=limite);
 }),[caronasAbertas,busca,campus,turn,preco]);
 const pontos=useMemo(()=>filtradas.map(Ponto).filter(Boolean),[filtradas]);
 const abrir=c=>navigation.navigate("DetalhesCarona",{caronaId:c.id});
 const limpar=()=>{setBusca("");setCampus("Todos");setTurn(null);setPreco("");setSelecionada(null);};
 if(carregandoCaronas&&!caronasAbertas.length)return <EstadoTela tipo="carregando" titulo="Buscando caronas" mensagem="Estamos atualizando as opções para você."/>;
 if(erroCaronas&&!caronasAbertas.length)return <EstadoTela tipo="erro" titulo="Não foi possível carregar as caronas" mensagem={erroCaronas} acao={{rotulo:"Tentar de novo",onPress:recarregar}}/>;
 return <View style={styles.tela}>
  <View style={styles.cabecalho}><Text style={styles.titulo}>Encontre sua carona</Text><Text style={styles.subtitulo}>{filtradas.length} {filtradas.length===1?"opção disponível":"opções disponíveis"} para você</Text></View>
  <View style={styles.pesquisa}><Feather name="search" size={17} color={theme.colors.textSecondary}/><TextInput value={busca} onChangeText={setBusca} placeholder="Buscar por bairro de origem" placeholderTextColor={theme.colors.textMuted} style={styles.input} returnKeyType="search" accessibilityLabel="Buscar por bairro de origem"/></View>
  <GrupoFiltros rolagem style={styles.campusRail}>{[{label:"Todos os campi",value:"Todos",icon:"map"},...CAMPI.map(c=>({label:c.nome.replace("Campus ",""),value:c.nome,icon:"map-pin"}))].map(f=><Chip key={f.value} active={campus===f.value} icon={f.icon} onPress={()=>setCampus(f.value)}>{f.label}</Chip>)}</GrupoFiltros>
  <View style={styles.filtros}><GrupoFiltros style={styles.turnosRail}>{turnos.map(t=><Chip key={t.id} active={turn===t.id} icon={t.icon} onPress={()=>setTurn(turn===t.id?null:t.id)}>{t.nome}</Chip>)}</GrupoFiltros><View style={styles.precoInput}><Text style={styles.precoLabel}>Até R$</Text><TextInput value={preco} onChangeText={v=>setPreco(v.replace(/[^\d,\.]/g, ""))} keyboardType="decimal-pad" placeholder="qualquer" placeholderTextColor={theme.colors.textMuted} style={styles.precoText} accessibilityLabel="Preço máximo em reais"/></View></View>
  <View style={styles.segmento}>{[["lista","Lista","list"],["mapa","Mapa","map"]].map(([id,label,icon])=><MotionPressable key={id} onPress={()=>setModo(id)} style={[styles.segmentoOpcao,modo===id&&styles.segmentoAtivo]}><Feather name={icon} size={16} color={modo===id?theme.colors.surface:theme.colors.textSecondary}/><Text style={[styles.segmentoTexto,modo===id&&{color:theme.colors.surface}]}>{label}</Text></MotionPressable>)}</View>
  {erroCaronas?<View style={styles.erroAtualizacao}><Text style={styles.erroTexto}>{erroCaronas}</Text><MotionPressable onPress={recarregar} style={styles.tentar}><Text style={styles.ver}>Tentar de novo</Text></MotionPressable></View>:null}
  {filtradas.length===0?<EstadoTela tipo="vazio" titulo="Nenhuma carona com esses filtros" mensagem="Mude algum filtro ou limpe a busca para ver outras opções." acao={{rotulo:"Limpar filtros",onPress:limpar}}/>:modo==="lista"?<FlatList style={styles.listaFlex} data={filtradas} keyExtractor={c=>c.id} renderItem={({item,index})=><LinhaCarona carona={item} index={index} onPress={()=>abrir(item)}/>} contentContainerStyle={styles.lista} refreshControl={<RefreshControl refreshing={carregandoCaronas} onRefresh={recarregar} tintColor={theme.colors.secondary}/>} />:<View style={styles.mapaWrap}><MapaRota pontos={pontos} altura={Math.max(200,Math.min(360,Math.floor(alturaTela*0.42)))} onToquePonto={p=>setSelecionada(p.carona)} />{selecionada?<MotionPressable style={styles.resumo} onPress={()=>abrir(selecionada)}><View style={{flex:1}}><Text style={styles.resumoNome}>{selecionada.motorista?.nome||"Carona"} · {formatarMoeda(selecionada.valorCentavos)}</Text><Text style={styles.meta}>{selecionada.origem?.bairro} → {selecionada.campusDestino} · {formatarDataHora(selecionada.saidaEm)}</Text></View><Text style={styles.ver}>Ver detalhes</Text></MotionPressable>:<Text style={styles.dica}>Toque em um ponto para ver os detalhes da carona.</Text>}</View>}
 </View>;
}
function Chip({children,active,icon,onPress}){return <MotionPressable onPress={onPress} style={[styles.chip,active&&styles.chipAtivo]}><Feather name={icon} size={14} color={active?theme.colors.surface:theme.colors.primary}/><Text style={[styles.chipTexto,active&&{color:theme.colors.surface}]}>{children}</Text></MotionPressable>}
function GrupoFiltros({children,style,rolagem=false}){return rolagem&&Platform.OS!=="web"?<ScrollView horizontal style={[styles.rail,style]} contentContainerStyle={styles.railChips} showsHorizontalScrollIndicator={false}>{children}</ScrollView>:<View style={[styles.chipsWeb,style]}>{children}</View>}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: theme.colors.background },
  cabecalho: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xs },
  titulo: { fontFamily: theme.fonts.bold, fontSize: 23, color: theme.colors.primary },
  subtitulo: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  pesquisa: { minHeight: 46, marginHorizontal: theme.spacing.md, marginTop: theme.spacing.xs, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 9, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, backgroundColor: theme.colors.surface },
  input: { flex: 1, minHeight: 46, color: theme.colors.primary, fontFamily: theme.fonts.regular, fontSize: 14 },
  chipsWeb: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  rail: { flexGrow: 0, flexShrink: 1, minWidth: 0, height: 52 },
  railChips: { gap: 8, alignItems: "center", paddingHorizontal: theme.spacing.md },
  campusRail: { marginTop: theme.spacing.xs },
  turnosRail: { flex: 0 },
  chip: { minHeight: 44, flexShrink: 0, paddingHorizontal: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 22, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: theme.colors.surface },
  chipAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipTexto: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.primary },
  filtros: { flexDirection: "column", alignItems: "stretch", gap: theme.spacing.xs },
  precoInput: { alignSelf: Platform.OS === "web" ? "flex-start" : "auto", marginHorizontal: Platform.OS === "web" ? theme.spacing.md : 0, marginBottom: Platform.OS === "web" ? theme.spacing.sm : 0, minHeight: 44, minWidth: 106, paddingHorizontal: 9, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: theme.colors.surface },
  precoLabel: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
  precoText: { width: 56, minHeight: 38, color: theme.colors.primary, fontFamily: theme.fonts.semibold },
  segmento: { marginHorizontal: theme.spacing.md, marginTop: theme.spacing.xs, marginBottom: theme.spacing.sm, padding: 3, borderRadius: theme.radii.md, backgroundColor: theme.colors.primaryLight, flexDirection: "row" },
  segmentoOpcao: { flex: 1, minHeight: 44, borderRadius: theme.radii.sm, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  segmentoAtivo: { backgroundColor: theme.colors.primary },
  segmentoTexto: { fontFamily: theme.fonts.semibold, fontSize: 13, color: theme.colors.textSecondary },
  listaFlex: { flex: 1 },
  lista: { paddingHorizontal: theme.spacing.md, paddingBottom: 40 },
  item: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: 12 },
  topo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  inline: { flexDirection: "row", alignItems: "center", gap: 7 },
  horario: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
  preco: { fontFamily: theme.fonts.bold, fontSize: 22, color: theme.colors.primary, marginTop: 5 },
  porPessoa: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.textSecondary },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: theme.colors.primaryLight, alignItems: "center", justifyContent: "center" },
  avatarTexto: { fontFamily: theme.fonts.bold, color: theme.colors.primary, fontSize: 13 },
  rota: { flexDirection: "row", gap: 12 },
  rotaIcones: { alignItems: "center", justifyContent: "center", gap: 3, width: 18 },
  traco: { width: 1, height: 12, backgroundColor: theme.colors.border },
  endereco: { fontFamily: theme.fonts.medium, fontSize: 14, color: theme.colors.primary },
  rodape: { flexDirection: "row", alignItems: "center", gap: 8 },
  meta: { fontFamily: theme.fonts.regular, fontSize: 12, color: theme.colors.textSecondary },
  vagas: { fontFamily: theme.fonts.semibold, fontSize: 12, color: theme.colors.success },
  mapaWrap: { flex: 1, paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md, gap: 10 },
  resumo: { minHeight: 68, padding: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, backgroundColor: theme.colors.surface, flexDirection: "row", alignItems: "center", gap: 10 },
  resumoNome: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.primary },
  ver: { fontFamily: theme.fonts.bold, fontSize: 12, color: theme.colors.secondary },
  dica: { fontFamily: theme.fonts.regular, fontSize: 13, color: theme.colors.textSecondary, textAlign: "center" },
  erroAtualizacao: { marginHorizontal: theme.spacing.md, padding: theme.spacing.sm, borderRadius: theme.radii.sm, backgroundColor: theme.colors.dangerLight, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  erroTexto: { flex: 1, fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.danger },
  tentar: { minHeight: 48, justifyContent: "center", paddingHorizontal: 6 },
});

