import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppointmentCard } from "../../components/AppointmentCard";
import { BottomNav } from "../../components/BottomNav";
import { Screen } from "../../components/Screen";
import { useApp } from "../../context/AppContext";
import { colors } from "../../constants/theme";
import { Appointment } from "../../lib/data";
import { subscribeAppointmentsForPatient } from "../../lib/firebaseServices";

export default function Appointments() {
  const { user } = useApp();

  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    return subscribeAppointmentsForPatient(
      user.uid,
      (items) => {
        setData(items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  }, [user]);

  return (
    <View style={styles.page}>
      <Screen>
        <Text style={styles.title}>My Appointments</Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : data.length > 0 ? (
          data.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              item={appointment}
            />
          ))
        ) : (
          <Text style={styles.empty}>
            You have no appointments yet. Find a doctor to request one.
          </Text>
        )}
      </Screen>

      <BottomNav
        active="appointments"
        items={[
          {
            key: "home",
            label: "Home",
            icon: "⌂",
            onPress: () => router.push("/patient/dashboard"),
          },
          {
            key: "doctors",
            label: "Doctors",
            icon: "✚",
            onPress: () => router.push("/patient/doctors"),
          },
          {
            key: "appointments",
            label: "Appointments",
            icon: "□",
            onPress: () => {},
          },
          {
            key: "profile",
            label: "Profile",
            icon: "○",
            onPress: () => router.push("/patient/profile"),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.canvas,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.ink,
  },

  empty: {
    color: colors.muted,
    lineHeight: 22,
  },
});