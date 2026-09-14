import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { sendEmailVerification } from "firebase/auth";

import { AuthShell } from "../components/AuthShell";
import { AuthButton } from "../components/AuthButton";
import { auth } from "../lib/firebase";

export default function Verify() {
  const [code, setCode] = React.useState("");

  const verify = () => {
    if (code.length !== 6) {
      Alert.alert(
        "Verify Code",
        "Enter the 6-digit verification code."
      );
      return;
    }

    router.replace("/fill-profile");
  };

  const resend = async () => {
    try {
      if (auth?.currentUser) {
        await sendEmailVerification(
          auth.currentUser
        );
      }

      Alert.alert(
        "Verification",
        "A new verification email was sent."
      );
    } catch (e) {
      Alert.alert(
        "Verification",
        (e as Error).message ||
          "Unable to resend email."
      );
    }
  };

  return (
    <AuthShell
      back
      onBack={() => router.back()}
      title="Verify Code"
      subtitle="Enter the 6-digit code sent to your email."
    >
      <View style={styles.codeRow}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <TextInput
            key={i}
            value={code[i] || ""}
            onChangeText={(v) => {
              const next = code.split("");

              next[i] = v.slice(-1);

              setCode(next.join(""));
            }}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.box}
          />
        ))}
      </View>

      <AuthButton
        title="Verify"
        onPress={verify}
      />

      <Text
        style={styles.resend}
        onPress={resend}
      >
        Didn’t get the code?{" "}
        <Text style={styles.link}>
          Resend
        </Text>
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  box: {
    width: 42,
    height: 48,
    borderWidth: 1,
    borderColor: "#e0e4e5",
    borderRadius: 7,
    textAlign: "center",
    fontSize: 18,
    color: "#126f78",
  },

  resend: {
    textAlign: "center",
    fontSize: 12,
    color: "#858c90",
    marginTop: 10,
  },

  link: {
    color: "#477dff",
    fontWeight: "700",
  },
});