import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import MotionPressable from "../../components/MotionPressable";
import { useAuth } from "../../context/AuthContext";
import theme from "../../theme";
import { mascararPlaca } from "../../utils";
import { Acao, Campo, Link, Mensagem, PaginaAcesso, s, Titulo } from "../acesso/ComponentesAcesso";
import { Secao } from "./comum";
import { dataParaIso, isoParaBr, lerDataBr, mascararData, validarVeiculo } from "./logica";

const LUGARES = [1, 2, 3, 4, 5, 6];

function PlacaMercosul({ placa }) {
  return (
    <View style={estilos.placa} accessibilityLabel={`Prévia da placa ${placa || "vazia"}`}>
      <View style={estilos.placaFaixa}>
        <Text style={estilos.placaPais}>BRASIL</Text>
      </View>
      <Text style={[estilos.placaLetras, !placa && { color: theme.colors.textMuted }]}>
        {placa.replace("-", "") || "ABC1D23"}
      </Text>
    </View>
  );
}

export default function TelaCadastroMotorista({ navigation }) {
  const { perfil, salvarMotorista, definirModo } = useAuth();
  const atual = perfil?.motorista;
  const [veiculo, setVeiculo] = useState({
    marca: atual?.veiculo?.marca || "",
    modelo: atual?.veiculo?.modelo || "",
    cor: atual?.veiculo?.cor || "",
    placa: mascararPlaca(atual?.veiculo?.placa || ""),
    lugares: atual?.lugares || 3,
    cnhValidade: isoParaBr(atual?.cnhValidade),
    chavePix: atual?.chavePix || "",
  });
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState("");
  const [salvando, setSalvando] = useState(false);

  const mudar = (campo, mascara) => (valor) => {
    setVeiculo((anterior) => ({ ...anterior, [campo]: mascara ? mascara(valor) : valor }));
    setErros((anteriores) => ({ ...anteriores, [campo]: null }));
  };

  async function salvar() {
    const encontrados = validarVeiculo(veiculo);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;
    setSalvando(true);
    setFalha("");
    try {
      await salvarMotorista({
        veiculo: {
          marca: veiculo.marca.trim(),
          modelo: veiculo.modelo.trim(),
          cor: veiculo.cor.trim(),
          placa: veiculo.placa.replace("-", ""),
        },
        lugares: veiculo.lugares,
        cnhValidade: dataParaIso(lerDataBr(veiculo.cnhValidade)),
        chavePix: veiculo.chavePix.trim(),
      });
      if (navigation.canGoBack()) navigation.goBack();
    } catch (erro) {
      setFalha(erro.message || "Não foi possível salvar os dados do veículo.");
      setSalvando(false);
    }
  }

  return (
    <PaginaAcesso>
      <Titulo texto="Os passageiros veem o carro e a placa antes de embarcar, para saber com quem vão.">
        Dados do motorista
      </Titulo>

      <Secao icone="truck" titulo="Veículo">
        <PlacaMercosul placa={veiculo.placa} />
        <Campo label="Placa" icon="hash" value={veiculo.placa} onChangeText={mudar("placa", mascararPlaca)} autoCapitalize="characters" autoCorrect={false} placeholder="ABC1D23" error={erros.placa} />
        <Campo label="Marca" icon="truck" value={veiculo.marca} onChangeText={mudar("marca")} placeholder="Fiat" error={erros.marca} />
        <Campo label="Modelo" icon="tag" value={veiculo.modelo} onChangeText={mudar("modelo")} placeholder="Argo" error={erros.modelo} />
        <Campo label="Cor" icon="droplet" value={veiculo.cor} onChangeText={mudar("cor")} placeholder="Prata" error={erros.cor} />
      </Secao>

      <Secao icone="users" titulo="Lugares para passageiros">
        <View style={estilos.lugares}>
          {LUGARES.map((n) => {
            const ativo = veiculo.lugares === n;
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
      </Secao>

      <Secao icone="credit-card" titulo="Documento">
        <Campo label="Validade da CNH" icon="calendar" value={veiculo.cnhValidade} onChangeText={mudar("cnhValidade", mascararData)} keyboardType="number-pad" placeholder="dd/mm/aaaa" maxLength={10} error={erros.cnhValidade} />
      </Secao>

      <Secao icone="dollar-sign" titulo="Pagamento">
        <Campo label="Chave PIX" icon="key" value={veiculo.chavePix} onChangeText={mudar("chavePix")} autoCapitalize="none" autoCorrect={false} placeholder="E-mail, celular ou CPF" error={erros.chavePix} />
      </Secao>

      <Mensagem>{falha}</Mensagem>
      <Acao icone="check" carregando={salvando} onPress={salvar}>
        Salvar veículo
      </Acao>
      <Link onPress={() => definirModo("passageiro")}>Entrar como passageiro</Link>
    </PaginaAcesso>
  );
}

const estilos = StyleSheet.create({
  placa: {
    alignSelf: "center",
    width: 240,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    alignItems: "center",
  },
  placaFaixa: { alignSelf: "stretch", backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.xs, alignItems: "center" },
  placaPais: { color: theme.colors.surface, fontFamily: theme.fonts.bold, fontSize: 11, letterSpacing: 3 },
  placaLetras: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: 4,
    paddingVertical: theme.spacing.sm,
  },
  lugares: { flexDirection: "row", gap: theme.spacing.sm, flexWrap: "wrap" },
  lugar: {
    minWidth: 48,
    minHeight: 48,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  lugarAtivo: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  lugarTexto: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
});
