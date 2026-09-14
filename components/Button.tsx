import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "../constants/theme";

export function Button({ title, onPress, variant = "primary", loading = false, disabled = false }: {
  title: string; onPress: () => void; variant?: "primary" | "secondary" | "ghost"; loading?: boolean; disabled?: boolean;
}) {
  return (
    <Pressable disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color={variant === "primary" ? colors.white : colors.primary} /> : <Text style={[styles.text, variant !== "primary" && styles.darkText]}>{title}</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radius.md, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.mint },
  ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  text: { color: colors.white, fontWeight: "800", fontSize: 15 },
  darkText: { color: colors.deep },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.55 },
});
