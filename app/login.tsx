
import React from "react";
import { FirebaseError } from "firebase/app";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

import { AuthShell } from "../components/AuthShell";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";

import {
  getUserProfile,
  loginUser,
} from "../lib/firebaseServices";

import { useApp } from "../context/AppContext";

export default function Login() {
  const { refreshProfile } = useApp();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const login = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Login",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setBusy(true);

      const cleanEmail = email.trim().toLowerCase();

      console.log("=================================");
      console.log("LOGIN START");
      console.log("=================================");
      console.log("1. Logging in:", cleanEmail);

      // ---------------------------------
      // FIREBASE AUTHENTICATION
      // ---------------------------------

      const credential = await loginUser(
        cleanEmail,
        password
      );

      const uid = credential.user.uid;

      console.log(
        "2. Authentication successful:",
        uid
      );

      // ---------------------------------
      // GET FIRESTORE PROFILE
      // ---------------------------------

      console.log(
        "3. Looking for Firestore profile:",
        `users/${uid}`
      );

      const profile = await getUserProfile(uid);

      // ---------------------------------
      // PROFILE NOT FOUND
      // ---------------------------------

      if (!profile) {
        console.log(
          "4. Firestore profile NOT FOUND:",
          uid
        );

        Alert.alert(
          "Profile Not Found",
          "Your Firebase account exists, but your CareSync profile is missing. Please register again or contact the administrator."
        );

        return;
      }

      console.log(
        "4. Firestore profile FOUND:",
        profile
      );

      // ---------------------------------
      // REFRESH APP CONTEXT
      // ---------------------------------

      await refreshProfile();

      console.log("5. Profile refreshed");

      // ---------------------------------
      // CHECK ROLE
      // ---------------------------------

      if (profile.role === "doctor") {
        console.log(
          "6. Going to doctor dashboard"
        );

        router.replace("/doctor/dashboard");
      } else if (profile.role === "patient") {
        console.log(
          "6. Going to patient dashboard"
        );

        router.replace("/patient/dashboard");
      } else {
        console.log(
          "Invalid user role:",
          profile.role
        );

        Alert.alert(
          "Login Error",
          "Your profile has an invalid account type."
        );

        return;
      }

      console.log("=================================");
      console.log("LOGIN SUCCESS");
      console.log("=================================");
    } catch (error) {
      console.error("=================================");
      console.error("LOGIN ERROR");
      console.error(error);
      console.error("=================================");

      const code =
        error instanceof FirebaseError
          ? error.code
          : "";

      let message =
        "Unable to login. Please try again.";

      if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found"
      ) {
        router.replace("/register");
        return;
      } else if (code === "auth/wrong-password") {
        message =
          "Incorrect password.";
      } else if (code === "auth/invalid-email") {
        message =
          "Please enter a valid email.";
      } else if (code === "auth/too-many-requests") {
        message =
          "Too many login attempts. Please try again later.";
      } else if (
        code === "auth/network-request-failed"
      ) {
        message =
          "Network error. Please check your internet connection.";
      } else if (error instanceof Error) {
        message = error.message;
      }

      Alert.alert(
        "Login Failed",
        message
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="We are here to help you!"
    >
      <AuthInput
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="Your Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AuthInput
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <Text
        style={styles.forgot}
        onPress={() =>
          router.push("/reset-password")
        }
      >
        Forgot Password?
      </Text>

      <AuthButton
        title={
          busy
            ? "Logging in..."
            : "Login"
        }
        onPress={login}
        busy={busy}
      />

      <View style={styles.registerRow}>
        <Text style={styles.accountText}>
          Don't have an account?
        </Text>

        <Text
          style={styles.registerText}
          onPress={() =>
            router.push("/register")
          }
        >
          {" "}
          Create Account
        </Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  forgot: {
    textAlign: "right",
    marginTop: 8,
    marginBottom: 20,
    color: "#2F80ED",
    fontWeight: "600",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  accountText: {
    color: "#777",
  },

  registerText: {
    color: "#2F80ED",
    fontWeight: "700",
  },
});
