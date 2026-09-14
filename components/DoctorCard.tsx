
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "../constants/theme";
import { Button } from "./Button";

export function DoctorCard({
  doctor,
  onPress,
}: {
  doctor: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9 },
      ]}
    >
      {doctor.image ? (
        <Image
          source={doctor.image}
          style={styles.image}
        />
      ) : (
        <View style={styles.noPhoto}>
          <Text style={styles.noPhotoText}>
            No Photo
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>
          {doctor.name}
        </Text>

        <Text style={styles.meta}>
          {doctor.specialty} · ★ {doctor.rating}
        </Text>

        <Text style={styles.available}>
          {doctor.available}
        </Text>

        <Button
          title="Book appointment"
          onPress={onPress}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  image: {
    width: 86,
    height: 86,
    borderRadius: 14,
  },

  noPhoto: {
    width: 86,
    height: 86,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.border,
  },

  noPhotoText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
  },

  info: {
    flex: 1,
    gap: 5,
  },

  name: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },

  meta: {
    color: colors.ink,
    fontSize: 13,
  },

  available: {
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 6,
  },
});

