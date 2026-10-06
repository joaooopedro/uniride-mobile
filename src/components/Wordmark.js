import React from "react";
import { Image, StyleSheet, View } from "react-native";

// Exibe a assinatura do arquivo original, preservando as cores e o desenho das letras.
const source = require("../../assets/uniride-logo.png");
const artwork = { width: 1536, height: 1024 };
const signature = { x: 201, y: 674, width: 1153, height: 268 };

export default function Wordmark({ width = 120 }) {
  const scale = width / signature.width;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="UniRide"
      style={[styles.frame, { width, height: signature.height * scale }]}
    >
      <Image
        source={source}
        accessible={false}
        resizeMode="contain"
        style={{
          position: "absolute",
          width: artwork.width * scale,
          height: artwork.height * scale,
          left: -signature.x * scale,
          top: -signature.y * scale,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({ frame: { overflow: "hidden" } });
