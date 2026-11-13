import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EstadoTela from "../components/EstadoTela";
import MotionPressable from "../components/MotionPressable";
import { useAuth } from "../context/AuthContext";
import theme from "../theme";
import { mascararPlaca, mascararTelefone, validarNome, validarTelefone, validarTextoObrigatorio } from "../utils";
import { Acao, Campo, Mensagem, s } from "./acesso/ComponentesAcesso";
import { Avatar, Secao, useEntrada } from "./motorista/comum";
import { dataParaIso, isoParaBr, lerDataBr, mascararData, validarVeiculo } from "./motorista/logica";
import { calcularSelos, contarViagens } from "./detalhes/logica";

const LUGARES = [1, 2, 3, 4, 5, 6];

function validarPeriodo(valor) {
  const n = Number(valor);
  return Number.isInteger(n) && n >= 1 && n <= 12 ? null : "Informe o período de 1 a 12.";
}

function Linha({ icone, rotulo, valor }) {
  return (
    <View style={estilos.linha} accessibilityLabel={`${rotulo}: ${valor || "não informado"}`}>
      <Feather name={icone} size={18} color={theme.colors.textSecondary} />
      <View style={estilos.flex}>
        <Text style={estilos.linhaRotulo}>{rotulo}</Text>
        <Text style={estilos.linhaValor}>{valor || "Não informado"}</Text>
      </View>
    </View>
  );
}

function Atalho({ icone, texto, onPress, perigo, carregando, detalhe }) {
  const cor = perigo ? theme.colors.danger : theme.colors.primary;
  return (
    <MotionPressable onPress={onPress} disabled={carregando} accessibilityLabel={texto} style={estilos.atalho}>
      <Feather name={icone} size={20} color={cor} />
      <View style={estilos.flex}>
        <Text style={[estilos.atalhoTexto, { color: cor }]}>{texto}</Text>
        {detalhe ? <Text style={s.secundario}>{detalhe}</Text> : null}
      </View>
      {!perigo ? <Feather name="chevron-right" size={20} color={theme.colors.textMuted} /> : null}
    </MotionPressable>
  );
}

function BotaoEditar({ onPress, rotulo }) {
  return (
    <MotionPressable onPress={onPress} accessibilityLabel={rotulo} style={estilos.editar}>
      <Feather name="edit-2" size={16} color={theme.colors.secondary} />
      <Text style={estilos.editarTexto}>Editar</Text>
    </MotionPressable>
  );
}

function DadosPessoais({ perfil, salvarPerfil }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState("");
  const [aviso, setAviso] = useState("");
  const [salvando, setSalvando] = useState(false);

  function abrir() {
    setForm({
      nome: perfil.nome || "",
      curso: perfil.curso || "",
      periodo: perfil.periodo ? String(perfil.periodo) : "",
      telefone: mascararTelefone(perfil.telefone || ""),
    });
    setErros({});
    setFalha("");
    setAviso("");
    setEditando(true);
  }

  const mudar = (campo, mascara) => (valor) => {
    setForm((f) => ({ ...f, [campo]: mascara ? mascara(valor) : valor }));
    setErros((e) => ({ ...e, [campo]: null }));
  };

  async function salvar() {
    const encontrados = {
      nome: validarNome(form.nome),
      curso: validarTextoObrigatorio(form.curso, "Curso", 60),
      periodo: validarPeriodo(form.periodo),
      telefone: validarTelefone(form.telefone),
    };
    setErros(encontrados);
    if (Object.values(encontrados).some(Boolean)) return;
    setSalvando(true);
    setFalha("");
    try {
      await salvarPerfil({
        nome: form.nome.trim(),
        curso: form.curso.trim(),
        periodo: Number(form.periodo),
        telefone: form.telefone,
      });
      setEditando(false);
      setAviso("Dados salvos.");
    } catch (e) {
      setFalha(e?.message || "Não foi possível salvar seus dados.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Secao icone="user" titulo="Dados pessoais">
      {editando ? (
        <>
          <Campo label="Nome" icon="user" value={form.nome} onChangeText={mudar("nome")} autoCapitalize="words" error={erros.nome} />
          <Campo label="Curso" icon="book-open" value={form.curso} onChangeText={mudar("curso")} error={erros.curso} />
          <Campo label="Período" icon="layers" value={form.periodo} onChangeText={mudar("periodo", (v) => v.replace(/\D/g, "").slice(0, 2))} keyboardType="number-pad" error={erros.periodo} />
          <Campo label="Telefone" icon="phone" value={form.telefone} onChangeText={mudar("telefone", mascararTelefone)} keyboardType="phone-pad" placeholder="(32) 99999-9999" error={erros.telefone} />
          <Mensagem>{falha}</Mensagem>
          <View style={estilos.botoes}>
            <Acao secundario disabled={salvando} onPress={() => setEditando(false)} style={estilos.flex}>
              Cancelar
            </Acao>
            <Acao icone="check" carregando={salvando} onPress={salvar} style={estilos.flex}>
              Salvar
            </Acao>
          </View>
        </>
      ) : (
        <>
          <Linha icone="mail" rotulo="E-mail" valor={perfil.email} />
          <Linha icone="hash" rotulo="Matrícula" valor={perfil.matricula} />
          <Linha icone="book-open" rotulo="Curso" valor={perfil.curso} />
          <Linha icone="layers" rotulo="Período" valor={perfil.periodo ? `${perfil.periodo}º período` : ""} />
          <Linha icone="phone" rotulo="Telefone" valor={perfil.telefone} />
          {aviso ? <Mensagem sucesso>{aviso}</Mensagem> : null}
          <BotaoEditar onPress={abrir} rotulo="Editar dados pessoais" />
        </>
      )}
    </Secao>
  );
}

function Veiculo({ perfil, salvarMotorista }) {
  const atual = perfil.motorista || {};
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState("");
  const [aviso, setAviso] = useState("");
  const [salvando, setSalvando] = useState(false);

  function abrir() {
    setForm({
      marca: atual.veiculo?.marca || "",
      modelo: atual.veiculo?.modelo || "",
      cor: atual.veiculo?.cor || "",
      placa: mascararPlaca(atual.veiculo?.placa || ""),
      lugares: atual.lugares || 3,
      cnhValidade: isoParaBr(atual.cnhValidade),
      chavePix: atual.chavePix || "",
    });
    setErros({});
    setFalha("");
    setAviso("");
    setEditando(true);
  }

  const mudar = (campo, mascara) => (valor) => {
    setForm((f) => ({ ...f, [campo]: mascara ? mascara(valor) : valor }));
    setErros((e) => ({ ...e, [campo]: null }));
  };

  async function salvar() {
    const encontrados = validarVeiculo(form);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;
    setSalvando(true);
    setFalha("");
    try {
      await salvarMotorista({
        veiculo: {
          marca: form.marca.trim(),
          modelo: form.modelo.trim(),
          cor: form.cor.trim(),
          placa: form.placa.replace("-", ""),
        },
        lugares: form.lugares,
        cnhValidade: dataParaIso(lerDataBr(form.cnhValidade)),
        chavePix: form.chavePix.trim(),
      });
      setEditando(false);
      setAviso("Veículo salvo.");
    } catch (e) {
      setFalha(e?.message || "Não foi possível salvar o veículo.");
    } finally {
      setSalvando(false);
    }
  }

  const v = atual.veiculo || {};
  return (
    <Secao icone="truck" titulo="Veículo">
      {editando ? (
        <>
          <Campo label="Placa" icon="hash" value={form.placa} onChangeText={mudar("placa", mascararPlaca)} autoCapitalize="characters" autoCorrect={false} placeholder="ABC1D23" error={erros.placa} />
          <Campo label="Marca" icon="truck" value={form.marca} onChangeText={mudar("marca")} error={erros.marca} />
          <Campo label="Modelo" icon="tag" value={form.modelo} onChangeText={mudar("modelo")} error={erros.modelo} />
          <Campo label="Cor" icon="droplet" value={form.cor} onChangeText={mudar("cor")} error={erros.cor} />
          <View style={{ gap: 5 }}>
            <Text style={s.label}>Lugares para passageiros</Text>
            <View style={estilos.lugares}>
              {LUGARES.map((n) => {
                const ativo = form.lugares === n;
                return (
                  <MotionPressable
                    key={n}
                    onPress={() => mudar("lugares")(n)}
                    accessibilityLabel={`${n} ${n === 1 ? "lugar" : "lugares"}`}
                    accessibilityState={{ selected: ativo }}
                    style={[estilos.lugar, ativo && estilos.lugarAtivo]}
                  >
                    <Text style={[estilos.lugarTexto, ativo && { color: theme.colors.surface }]}>{n}</Text>
                  </MotionPressable>
                );
              })}
            </View>
            {erros.lugares ? <Text style={s.error}>{erros.lugares}</Text> : null}
          </View>
          <Campo label="Validade da CNH" icon="calendar" value={form.cnhValidade} onChangeText={mudar("cnhValidade", mascararData)} keyboardType="number-pad" placeholder="dd/mm/aaaa" maxLength={10} error={erros.cnhValidade} />
          <Campo label="Chave PIX" icon="key" value={form.chavePix} onChangeText={mudar("chavePix")} autoCapitalize="none" autoCorrect={false} placeholder="E-mail, celular ou CPF" error={erros.chavePix} />
          <Mensagem>{falha}</Mensagem>
          <View style={estilos.botoes}>
            <Acao secundario disabled={salvando} onPress={() => setEditando(false)} style={estilos.flex}>
              Cancelar
            </Acao>
            <Acao icone="check" carregando={salvando} onPress={salvar} style={estilos.flex}>
              Salvar
            </Acao>
          </View>
        </>
      ) : (
        <>
          <Linha icone="truck" rotulo="Carro" valor={[v.marca, v.modelo].filter(Boolean).join(" ")} />
          <Linha icone="droplet" rotulo="Cor" valor={v.cor} />
          <Linha icone="hash" rotulo="Placa" valor={v.placa ? mascararPlaca(v.placa) : ""} />
          <Linha icone="users" rotulo="Lugares" valor={atual.lugares ? String(atual.lugares) : ""} />
          <Linha icone="calendar" rotulo="Validade da CNH" valor={isoParaBr(atual.cnhValidade)} />
          <Linha icone="key" rotulo="Chave PIX" valor={atual.chavePix} />
          {aviso ? <Mensagem sucesso>{aviso}</Mensagem> : null}
          <BotaoEditar onPress={abrir} rotulo="Editar veículo" />
        </>
      )}
    </Secao>
  );
}

export default function TelaPerfilUniversitario({ navigation }) {
  const insets = useSafeAreaInsets();
  const entrada = useEntrada();
  const { perfil, modo, emailVerificado, salvarPerfil, salvarMotorista, definirModo, sair } = useAuth();
  const [saindo, setSaindo] = useState(false);
  const [trocando, setTrocando] = useState(false);
  const [falha, setFalha] = useState("");

  if (!perfil) return <EstadoTela tipo="carregando" titulo="Carregando perfil" />;

  const selos = calcularSelos({ emailVerificado, nota: perfil.notaMotorista, viagens: contarViagens(perfil) }).filter((x) => x.conquistado);
  const destino = modo === "motorista" ? "passageiro" : "motorista";

  async function trocar() {
    setTrocando(true);
    setFalha("");
    try {
      await definirModo(destino);
    } catch (e) {
      setFalha(e?.message || "Não foi possível trocar de modo.");
      setTrocando(false);
    }
  }

  function confirmarSaida() {
    Alert.alert("Sair da conta", "Você precisará entrar de novo para usar o UniRide.", [
      { text: "Ficar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          setSaindo(true);
          setFalha("");
          try {
            await sair();
          } catch (e) {
            setFalha(e?.message || "Não foi possível sair agora.");
            setSaindo(false);
          }
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[estilos.pagina, { paddingBottom: insets.bottom + theme.spacing.lg }]}
      >
        <Animated.View entering={entrada(0)} style={estilos.cabecalho}>
          <Avatar nome={perfil.nome} fotoBase64={perfil.fotoBase64} tamanho={96} />
          <Text style={estilos.nome}>{perfil.nome}</Text>
          <Text style={s.secundario}>
            {[perfil.curso, perfil.periodo ? `${perfil.periodo}º período` : null].filter(Boolean).join(", ")}
          </Text>
          {selos.length ? (
            <View style={estilos.selos}>
              {selos.map((selo) => (
                <View key={selo.id} style={estilos.selo} accessibilityLabel={selo.titulo}>
                  <Feather name={selo.icone} size={14} color={theme.colors.secondary} />
                  <Text style={estilos.seloTexto}>{selo.titulo}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Animated.View>

        <Animated.View entering={entrada(1)}>
          <DadosPessoais perfil={perfil} salvarPerfil={salvarPerfil} />
        </Animated.View>

        {perfil.ehMotorista ? (
          <Animated.View entering={entrada(2)}>
            <Veiculo perfil={perfil} salvarMotorista={salvarMotorista} />
          </Animated.View>
        ) : null}

        <Animated.View entering={entrada(3)}>
          <Secao icone="compass" titulo="Atalhos">
            <Atalho icone="shield" texto="Avaliações e segurança" onPress={() => navigation.navigate("Avaliacoes")} />
            <Atalho
              icone="repeat"
              texto={destino === "motorista" ? "Trocar para modo motorista" : "Trocar para modo passageiro"}
              detalhe={destino === "motorista" && !perfil.ehMotorista ? "Você cadastra o veículo no próximo passo" : undefined}
              carregando={trocando}
              onPress={trocar}
            />
            <Atalho icone="log-out" texto="Sair" perigo carregando={saindo} onPress={confirmarSaida} />
            <Mensagem>{falha}</Mensagem>
          </Secao>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  pagina: { padding: theme.spacing.md, gap: theme.spacing.lg },
  cabecalho: { alignItems: "center", gap: theme.spacing.sm },
  nome: { fontFamily: theme.fonts.bold, fontSize: 26, lineHeight: 32, color: theme.colors.primary, textAlign: "center", marginTop: theme.spacing.xs },
  selos: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: theme.spacing.sm, marginTop: theme.spacing.xs },
  selo: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, minHeight: 32, paddingHorizontal: theme.spacing.mdSm, borderRadius: theme.radii.sm, backgroundColor: theme.colors.secondaryLight },
  seloTexto: { fontFamily: theme.fonts.semibold, fontSize: 12, color: theme.colors.primary },
  linha: { flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm, minHeight: 48 },
  linhaRotulo: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
  linhaValor: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  editar: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, alignSelf: "flex-start" },
  editarTexto: { fontFamily: theme.fonts.semibold, fontSize: 14, color: theme.colors.secondary },
  botoes: { flexDirection: "row", gap: theme.spacing.sm },
  atalho: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: theme.spacing.mdSm },
  atalhoTexto: { fontFamily: theme.fonts.semibold, fontSize: 15 },
  lugares: { flexDirection: "row", gap: theme.spacing.sm, flexWrap: "wrap" },
  lugar: { minWidth: 48, minHeight: 48, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, alignItems: "center", justifyContent: "center" },
  lugarAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  lugarTexto: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
});
