import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export function BottomNav({ active, items }: { active: string; items: { key: string; label: string; icon: string; onPress: () => void }[] }) {
  return <View style={styles.nav}>{items.map(i => <Pressable key={i.key} onPress={i.onPress} style={styles.item}>
    <Text style={[styles.icon, active === i.key && styles.active]}>{i.icon}</Text>
    <Text style={[styles.label, active === i.key && styles.active]}>{i.label}</Text>
  </Pressable>)}</View>;
}
const styles = StyleSheet.create({
  nav: { flexDirection: "row", backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 10 },
  item: { flex: 1, alignItems: "center", gap: 3 },
  icon: { fontSize: 20, color: colors.muted },
  label: { fontSize: 11, color: colors.muted, fontWeight: "700" },
  active: { color: colors.primary },
});
