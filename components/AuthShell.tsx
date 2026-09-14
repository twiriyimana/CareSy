import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface AuthShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  back?: boolean;
  onBack?: () => void;
}

export function AuthShell({
  title,
  subtitle,
  children,
  back,
  onBack,
}: AuthShellProps) {
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.top}>
          {back ? (
            <Text
              onPress={onBack}
              style={styles.back}
            >
              ‹
            </Text>
          ) : null}
        </View>

        <Image
          source={require(
            "../assets/images/pakhi-medical-logo.png"
          )}
          style={styles.logo}
          resizeMode="contain"
        />

        {title ? (
          <>
            <Text style={styles.title}>
              {title}
            </Text>

            {subtitle ? (
              <Text style={styles.subtitle}>
                {subtitle}
              </Text>
            ) : null}
          </>
        ) : null}

        <View style={styles.body}>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 35,
    minHeight: 760,
  },

  top: {
    height: 35,
    justifyContent: "center",
  },

  back: {
    fontSize: 35,
    color: "#566064",
    fontWeight: "300",
  },

  logo: {
    width: 145,
    height: 82,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 22,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#176d76",
    marginBottom: 8,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 12,
    color: "#969da1",
    marginBottom: 20,
  },

  body: {
    width: "100%",
  },
});