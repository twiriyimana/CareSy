import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppointmentCard } from "../../components/AppointmentCard";
import { BottomNav } from "../../components/BottomNav";
import { Screen } from "../../components/Screen";
import { useApp } from "../../context/AppContext";
import {
  subscribeAppointmentsForDoctor,
  updateAppointmentStatus,
} from "../../lib/firebaseServices";
import { Appointment } from "../../lib/data";
import { colors } from "../../constants/theme";

export default function Appointments() {
  const { user } = useApp();

  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Load doctor's appointment requests from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeAppointmentsForDoctor(
      user.uid,
      (items) => {
        setData(items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // Accept or reject an appointment
  const respond = async (
    id: string,
    status: "confirmed" | "rejected"
  ) => {
    try {
      await updateAppointmentStatus(id, status);

      Alert.alert(
        "Success",
        status === "confirmed"
          ? "Appointment accepted successfully."
          : "Appointment rejected successfully."
      );
    } catch (e) {
      Alert.alert(
        "Could not update",
        e instanceof Error ? e.message : "Something went wrong."
      );
    }
  };

  return (
    <View style={styles.page}>
      <Screen>
        <Text style={styles.title}>Appointment Requests</Text>

        <Text style={styles.copy}>
          Patients create pending requests. Accept or reject them here.
          The patient's screen updates automatically.
        </Text>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>
              Loading appointments...
            </Text>
          </View>
        ) : data.length > 0 ? (
          <View style={styles.list}>
            {data.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                item={appointment}
                doctorView
                onAccept={() =>
                  respond(appointment.id, "confirmed")
                }
                onReject={() =>
                  respond(appointment.id, "rejected")
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No appointment requests
            </Text>

            <Text style={styles.empty}>
              You don't have any appointment requests yet.
            </Text>
          </View>
        )}
      </Screen>

      <BottomNav
        active="appointments"
        items={[
          {
            key: "dashboard",
            label: "Dashboard",
            icon: "⌂",
            onPress: () =>
              router.push("/doctor/dashboard"),
          },
          {
            key: "appointments",
            label: "Appointments",
            icon: "□",
            onPress: () => {},
          },
          {
            key: "patients",
            label: "Patients",
            icon: "♙",
            onPress: () =>
              router.push("/doctor/patients"),
          },
          {
            key: "profile",
            label: "Profile",
            icon: "○",
            onPress: () =>
              router.push("/doctor/profile"),
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
    marginBottom: 8,
  },

  copy: {
    color: colors.muted,
    lineHeight: 20,
    marginBottom: 20,
  },

  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 10,
  },

  loadingText: {
    color: colors.muted,
    fontSize: 14,
  },

  list: {
    gap: 14,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 6,
  },

  empty: {
    color: colors.muted,
    textAlign: "center",
  },
});