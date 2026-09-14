import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../constants/theme";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const style =
    normalized === "confirmed"
      ? styles.confirmed
      : normalized === "rejected" || normalized === "cancelled"
      ? styles.rejected
      : styles.pending;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },

  pending: {
    backgroundColor: "#fff3d6",
  },

  confirmed: {
    backgroundColor: colors.mint,
  },

  rejected: {
    backgroundColor: "#ffe8ea",
  },

  text: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.deep,
  },
});