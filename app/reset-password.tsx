import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
} from "react-native";
import { router } from "expo-router";

import { AuthShell } from "../components/AuthShell";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";

import {
  sendResetEmail,
} from "../lib/firebaseServices";

export default function ResetPassword() {
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const sendResetLink = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert(
        "Reset Password",
        "Please enter your email address."
      );
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      Alert.alert(
        "Reset Password",
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setBusy(true);

      console.log(
        "Sending reset email to:",
        cleanEmail
      );

      await sendResetEmail(cleanEmail);

      Alert.alert(
        "Reset Email Sent",
        "We have sent a password reset link to your email. Please check your inbox and follow the instructions.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      console.error(
        "PASSWORD RESET ERROR:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to send reset email.";

      Alert.alert(
        "Reset Password",
        message
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      back
      onBack={() => router.back()}
      title="Forgot Password?"
      subtitle="Enter your email and we will send you a password reset link."
    >
      <AuthInput
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="Your Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        returnKeyType="send"
        onSubmitEditing={sendResetLink}
      />

      <AuthButton
        title={
          busy
            ? "Sending..."
            : "Send Reset Link"
        }
        onPress={sendResetLink}
        busy={busy}
      />

      <Text style={styles.note}>
        Check your email for the password reset link.
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  note: {
    textAlign: "center",
    fontSize: 12,
    color: "#969da1",
    marginTop: 8,
  },
});