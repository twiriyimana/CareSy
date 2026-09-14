import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, radius } from "../constants/theme";

export function Input({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#9aa9aa" {...props} style={[styles.input, error && styles.error]} />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: 7 },
  label: { color: colors.ink, fontWeight: "700" },
  input: { height: 52, backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 15, color: colors.ink },
  error: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12 },
});
