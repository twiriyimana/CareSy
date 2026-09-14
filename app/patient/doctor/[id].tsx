import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "../../../components/Button";
import { Screen } from "../../../components/Screen";
import { colors, radius } from "../../../constants/theme";
import { getDoctor } from "../../../lib/firebaseServices";
import { UserProfile } from "../../../lib/data";

export default function DoctorProfile() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const [doctor, setDoctor] =
    useState<UserProfile | null>(null);

  useEffect(() => {
    if (id) {
      getDoctor(id).then(setDoctor);
    }
  }, [id]);

  if (!doctor) {
    return (
      <Screen>
        <ActivityIndicator
          color={colors.primary}
        />

        <Text style={{ color: colors.muted }}>
          Loading doctor...
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.kicker}>
        DOCTOR PROFILE
      </Text>

      <View style={styles.head}>
        <Image
          source={
            doctor.image
              ? { uri: doctor.image }
              : require(
                  "../../../assets/images/doctor-maya.jpeg"
                )
          }
          style={styles.image}
        />

        <View style={styles.info}>
          <Text style={styles.name}>
            {doctor.name}
          </Text>

          <Text style={styles.meta}>
            {doctor.specialty || "General Medicine"} ·
            {" "}★ {doctor.rating || 5}
          </Text>
        </View>
      </View>

      <Text style={styles.bio}>
        {doctor.bio ||
          "Patient-centered care focused on safe, accessible healthcare."}
      </Text>

      <Text style={styles.label}>
        AVAILABLE TIMES
      </Text>

      <View style={styles.times}>
        <Text style={styles.time}>
          09:00
        </Text>

        <Text style={styles.time}>
          10:30
        </Text>

        <Text style={styles.time}>
          14:30
        </Text>
      </View>

      <Button
        title="Request appointment"
        onPress={() =>
          router.push(
            `/patient/booking?id=${doctor.id}`
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    color: colors.primary,
  },

  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  image: {
    width: 82,
    height: 82,
    borderRadius: 18,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.ink,
  },

  meta: {
    color: colors.deep,
    fontWeight: "700",
    marginTop: 4,
  },

  bio: {
    color: colors.muted,
    lineHeight: 22,
  },

  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    color: colors.primary,
  },

  times: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  time: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.deep,
    fontWeight: "800",
  },
});