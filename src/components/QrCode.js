import React, { useMemo } from "react";
import { View } from "react-native";
import qrcode from "qrcode-generator";

// QR em Views puras: cada linha junta os módulos escuros vizinhos num bloco só.
export default function QrCode({ valor, tamanho = 240, cor = "#000", fundo = "#fff" }) {
  const linhas = useMemo(() => {
    if (!valor) return [];
    const qr = qrcode(0, "M");
    qr.addData(valor);
    qr.make();
    const n = qr.getModuleCount();
    return Array.from({ length: n }, (_, l) => {
      const blocos = [];
      for (let c = 0; c < n; c += 1) {
        if (!qr.isDark(l, c)) continue;
        const inicio = c;
        while (c + 1 < n && qr.isDark(l, c + 1)) c += 1;
        blocos.push([inicio, c - inicio + 1]);
      }
      return blocos;
    });
  }, [valor]);
  if (!linhas.length) return null;
  const margem = 4;
  const modulo = tamanho / (linhas.length + margem * 2);
  return (
    <View style={{ width: tamanho, height: tamanho, backgroundColor: fundo }} accessibilityLabel="QR code do Pix">
      {linhas.map((blocos, l) =>
        blocos.map(([c, largura]) => (
          <View
            key={`${l}-${c}`}
            style={{
              position: "absolute",
              left: (c + margem) * modulo,
              top: (l + margem) * modulo,
              width: largura * modulo + 0.5,
              height: modulo + 0.5,
              backgroundColor: cor,
            }}
          />
        )),
      )}
    </View>
  );
}
