import React, { forwardRef, useEffect, useRef } from "react";
import { Animated, Easing, Platform, Pressable } from "react-native";
import { useInterface } from "../context/InterfaceContext";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const MotionPressable = forwardRef(function MotionPressable(
  { style, onPressIn, onPressOut, disabled, activeOpacity, ...props },
  ref,
) {
  const escala = useRef(new Animated.Value(1)).current;
  const { podeAnimar } = useInterface();
  useEffect(() => {
    if (!podeAnimar || disabled) {
      escala.stopAnimation();
      escala.setValue(1);
    }
  }, [podeAnimar, disabled, escala]);
  const animar = (valor, duration) => {
    if (!podeAnimar || disabled) return;
    Animated.timing(escala, {
      toValue: valor,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    }).start();
  };
  return (
    <AnimatedPressable
      ref={ref}
      accessibilityRole="button"
      {...props}
      disabled={disabled}
      style={[style, { transform: [{ scale: escala }] }]}
      onPressIn={(event) => {
        animar(0.975, 90);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animar(1, 150);
        onPressOut?.(event);
      }}
    />
  );
});
export default MotionPressable;
