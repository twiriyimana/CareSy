import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { colors, radius } from "../constants/theme";

const errors = [
  [
    "Invalid email",
    "Enter a valid email address.",
  ],
  [
    "Weak password",
    "Use 8+ characters with a number.",
  ],
  [
    "Email in use",
    "Try signing in or reset your password.",
  ],
  [
    "No connection",
    "Check your network and try again.",
  ],
  [
    "Service unavailable",
    "We couldn’t complete the request.",
  ],
  [
    "Permission denied",
    "Your account cannot access this data.",
  ],
];

export default function Errors() {
  return (
    <Screen>
      <Text style={styles.title}>
        Errors that explain—and help recover
      </Text>

      {errors.map(([name, detail]) => (
        <View key={name} style={styles.card}>
          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.detail}>
            {detail}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.ink,
    marginBottom: 6,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 18,
    borderLeftWidth: 5,
    borderLeftColor: colors.danger,
    gap: 6,
  },

  name: {
    fontWeight: "900",
    fontSize: 16,
    color: colors.danger,
  },

  detail: {
    color: colors.muted,
  },
});