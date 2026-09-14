import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { colors } from "../constants/theme";

type Props = TextInputProps & {
  icon: keyof typeof Ionicons.glyphMap;
};

export function AuthInput({
  icon,
  ...props
}: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons
        name={icon}
        size={18}
        color="#a0a1a3"
      />

      <TextInput
        {...props}
        placeholderTextColor="#a0a1a3"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 52,
    borderWidth: 1,
    borderColor: "#dfe3e5",
    borderRadius: 7,
    backgroundColor: "#fbfcfd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
    color: colors.ink,
  },
});