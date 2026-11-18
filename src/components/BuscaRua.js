import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { buscarEnderecos } from "../services/api";
import theme from "../theme";
import { Campo } from "../screens/acesso/ComponentesAcesso";
import MotionPressable from "./MotionPressable";

// Campo de rua com sugestões do mapa de Juiz de Fora. Escolher devolve { rua, bairro, lat, lng }.
export default function BuscaRua({ rotulo = "Rua", valor, onMudarTexto, onEscolher, onBlur, placeholder = "Comece a digitar, ex.: Rua Halfeld" }) {
  const [sugestoes, setSugestoes] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState("");
  const pedido = useRef(0);
  const montado = useRef(true);
  useEffect(() => () => (montado.current = false), []);

  function mudar(texto) {
    onMudarTexto?.(texto);
    setErro("");
    const atual = ++pedido.current;
    const vigente = () => atual === pedido.current && montado.current;
    if (texto.trim().length < 3) {
      setSugestoes([]);
      setBuscando(false);
      return;
    }
    setBuscando(true);
    setTimeout(async () => {
      if (!vigente()) return;
      try {
        const lista = await buscarEnderecos(`${texto}, Juiz de Fora`);
        if (!vigente()) return;
        setSugestoes(lista);
        if (!lista.length) setErro("Nenhuma rua encontrada. Confira o nome.");
      } catch (e) {
        if (vigente()) setErro(e.message);
      } finally {
        if (vigente()) setBuscando(false);
      }
    }, 600);
  }

  function escolher(sugestao) {
    Keyboard.dismiss();
    pedido.current += 1;
    setSugestoes([]);
    setBuscando(false);
    setErro("");
    onEscolher(sugestao);
  }

  return (
    <View style={estilos.caixa}>
      <Campo
        label={rotulo}
        icon="search"
        value={valor}
        onChangeText={mudar}
        onBlur={onBlur}
        placeholder={placeholder}
        autoCorrect={false}
        error={erro}
        trailing={buscando ? <ActivityIndicator color={theme.colors.secondary} /> : null}
      />
      {sugestoes.length ? (
        <View style={estilos.sugestoes} accessibilityRole="menu">
          {sugestoes.map((sugestao, i) => (
            <MotionPressable
              key={`${sugestao.rua}-${sugestao.bairro}-${i}`}
              onPress={() => escolher(sugestao)}
              style={[estilos.sugestao, i > 0 && estilos.divisoria]}
              accessibilityLabel={`${sugestao.rua}, ${sugestao.bairro}`}
            >
              <Feather name="map-pin" size={16} color={theme.colors.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={estilos.rua} numberOfLines={1}>{sugestao.rua}</Text>
                {sugestao.bairro ? <Text style={estilos.bairro} numberOfLines={1}>{sugestao.bairro}</Text> : null}
              </View>
            </MotionPressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { gap: 8 },
  sugestoes: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, backgroundColor: theme.colors.surface, overflow: "hidden" },
  sugestao: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 52, paddingHorizontal: 16, paddingVertical: 8 },
  divisoria: { borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  rua: { fontFamily: theme.fonts.semibold, fontSize: 15, color: theme.colors.primary },
  bairro: { fontFamily: theme.fonts.medium, fontSize: 13, color: theme.colors.text },
});
