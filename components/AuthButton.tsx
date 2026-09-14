import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { colors } from "../constants/theme";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  busy?: boolean;
  outline?: boolean;
}

export function AuthButton({
  title,
  onPress,
  busy = false,
  outline = false,
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={busy}
      style={[
        styles.button,
        outline && styles.outline,
      ]}
    >
      {busy ? (
        <ActivityIndicator
          color={
            outline ? colors.deep : "#fff"
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            outline && styles.outlineText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 28,
    backgroundColor: "#116f78",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },

  outline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e4e6",
  },

  outlineText: {
    color: "#146b74",
  },
});