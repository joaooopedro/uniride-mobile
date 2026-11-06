import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import theme from "../theme";
import { CIDADE } from "../utils/campi";

const CORES = {
  origem: theme.colors.primary,
  destino: theme.colors.secondary,
  carona: theme.colors.warning,
};

// O HTML não muda depois de carregado: pontos e rota chegam por injectJavaScript,
// então trocar a origem não recarrega o mapa.
const HTML = `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #mapa { margin: 0; height: 100%; background: ${theme.colors.primaryLight}; }
  .leaflet-tooltip { font-family: -apple-system, Roboto, sans-serif; font-size: 12px; }
</style>
</head><body><div id="mapa"></div>
<script>
  var enviar = function (dados) { window.ReactNativeWebView.postMessage(JSON.stringify(dados)); };
  var mapa = L.map("mapa", { zoomControl: false }).setView([${CIDADE.lat}, ${CIDADE.lng}], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(mapa);
  var camada = L.layerGroup().addTo(mapa);
  var cores = ${JSON.stringify(CORES)};
  mapa.on("click", function (e) { enviar({ tipo: "toque", lat: e.latlng.lat, lng: e.latlng.lng }); });

  window.atualizar = function (dados) {
    camada.clearLayers();
    var limites = [];
    if (dados.linha && dados.linha.length > 1) {
      L.polyline(dados.linha, { color: "${theme.colors.secondary}", weight: 5, opacity: 0.85 }).addTo(camada);
      limites = limites.concat(dados.linha);
    }
    dados.pontos.forEach(function (ponto, indice) {
      var marcador = L.circleMarker([ponto.lat, ponto.lng], {
        radius: ponto.tipo === "carona" ? 9 : 8,
        color: "#FFFFFF", weight: 3, fillOpacity: 1,
        fillColor: cores[ponto.tipo] || cores.origem
      }).addTo(camada);
      if (ponto.titulo) {
        var rotulo = document.createElement("span");
        rotulo.textContent = ponto.titulo;
        marcador.bindTooltip(rotulo, { direction: "top", offset: [0, -8] });
      }
      marcador.on("click", function (e) {
        L.DomEvent.stopPropagation(e);
        enviar({ tipo: "ponto", indice: indice });
      });
      limites.push([ponto.lat, ponto.lng]);
    });
    if (limites.length > 1) mapa.fitBounds(limites, { padding: [28, 28], maxZoom: 16 });
    else if (limites.length === 1) mapa.setView(limites[0], 16);
  };
  enviar({ tipo: "pronto" });
</script></body></html>`;

// pontos: [{ lat, lng, titulo, tipo: 'origem' | 'destino' | 'carona' }], linha: [[lat, lng]]
export default function MapaRota({ pontos = [], linha, altura = 220, onToque, onToquePonto, style }) {
  const webview = useRef(null);
  const [pronto, setPronto] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const validos = pontos.filter((p) => Number.isFinite(p?.lat) && Number.isFinite(p?.lng));
  const chave = JSON.stringify([validos, linha || []]);

  useEffect(() => {
    if (!pronto) return;
    const dados = { pontos: validos.map(({ lat, lng, titulo, tipo }) => ({ lat, lng, titulo, tipo })), linha: linha || [] };
    webview.current?.injectJavaScript(`window.atualizar(${JSON.stringify(dados)}); true;`);
  }, [pronto, chave]);

  const receber = (evento) => {
    let dados;
    try {
      dados = JSON.parse(evento.nativeEvent.data);
    } catch {
      return;
    }
    if (dados.tipo === "pronto") setPronto(true);
    if (dados.tipo === "toque") onToque?.({ lat: dados.lat, lng: dados.lng });
    if (dados.tipo === "ponto" && validos[dados.indice]) onToquePonto?.(validos[dados.indice]);
  };

  return (
    <View style={[styles.caixa, { height: altura }, style]} accessibilityLabel="Mapa">
      <WebView
        ref={webview}
        source={{ html: HTML, baseUrl: "https://uniride.app" }}
        originWhitelist={["*"]}
        onMessage={receber}
        onError={() => setFalhou(true)}
        javaScriptEnabled
        scrollEnabled={false}
        setSupportMultipleWindows={false}
        style={styles.mapa}
      />
      {falhou && (
        <View style={styles.aviso}>
          <Text style={styles.textoAviso}>Mapa indisponível sem internet.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { borderRadius: theme.radii.md, overflow: "hidden", backgroundColor: theme.colors.primaryLight },
  mapa: { flex: 1, backgroundColor: "transparent" },
  aviso: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  textoAviso: { fontFamily: theme.fonts.medium, fontSize: 12, color: theme.colors.textSecondary },
});
