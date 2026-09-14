import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { colors } from "../../constants/theme";

export default function Confirmation() {
  const params = useLocalSearchParams();

  return (
    <Screen style={styles.center}>
      {/* Success Icon */}
      <View style={styles.check}>
        <Text style={styles.checkText}>✓</Text>
      </View>

      {/* Confirmation Message */}
      <Text style={styles.title}>
        Appointment Confirmed
      </Text>

      {/* Appointment Details */}
      <Text style={styles.detail}>
        {params.doctor} · {params.date} · {params.time}
      </Text>

      {/* Back to Dashboard */}
      <Button
        title="Back to dashboard"
        onPress={() => router.replace("/patient/dashboard")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  check: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  checkText: {
    fontSize: 70,
    color: colors.white,
    fontWeight: "300",
  },

  title: {
    fontSize: 29,
    fontWeight: "900",
    color: colors.ink,
    textAlign: "center",
  },

  detail: {
    color: colors.muted,
    textAlign: "center",
    marginBottom: 10,
  },
});