import { router } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../constants/theme";
import { useApp } from "../context/AppContext";

export default function Splash() {
  const { loading, user, role } = useApp();

  // Redirect after loading
  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (user && role === "doctor") {
        router.replace("/doctor/dashboard");
      } else if (user && role === "patient") {
        router.replace("/patient/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [loading, user, role]);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require("../assets/images/caresync-cover.jpeg")}
        style={styles.image}
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        <Text style={styles.logo}>
          CareSync
        </Text>

        <Text style={styles.tag}>
          Healthcare, connected
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.12,
  },

  overlay: {
    alignItems: "center",
  },

  logo: {
    color: colors.white,
    fontSize: 42,
    fontWeight: "900",
  },

  tag: {
    color: colors.white,
    fontSize: 16,
    marginTop: 8,
  },
});