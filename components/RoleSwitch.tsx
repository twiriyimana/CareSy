import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../constants/theme";
import { Role } from "../lib/data";

export function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  return <View style={styles.wrap}>{(["patient", "doctor"] as Role[]).map(r =>
    <Pressable key={r} onPress={() => onChange(r)} style={[styles.option, role === r && styles.selected]}>
      <Text style={[styles.text, role === r && styles.selectedText]}>{r === "patient" ? "Patient" : "Doctor"}</Text>
    </Pressable>
  )}</View>;
}
const styles = StyleSheet.create({
  wrap: { flexDirection: "row", backgroundColor: colors.mint, borderRadius: radius.md, padding: 4 },
  option: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: radius.sm },
  selected: { backgroundColor: colors.white },
  text: { color: colors.muted, fontWeight: "700" },
  selectedText: { color: colors.deep },
});
