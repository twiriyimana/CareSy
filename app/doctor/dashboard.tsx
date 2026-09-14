import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BottomNav } from "../../components/BottomNav";
import { AppointmentCard } from "../../components/AppointmentCard";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { useApp } from "../../context/AppContext";
import { colors, radius } from "../../constants/theme";
import {
  subscribeAppointmentsForDoctor,
  updateAppointmentStatus,
} from "../../lib/firebaseServices";
import { Appointment } from "../../lib/data";

export default function Dashboard() {
  const { user, userName, profile } = useApp();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to doctor's appointments from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    return subscribeAppointmentsForDoctor(
      user.uid,
      (items) => {
        setAppointments(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, [user]);

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
    } catch (error) {
      Alert.alert(
        "Could not update",
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  // Count pending appointments
  const pending = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "pending"
      ).length,
    [appointments]
  );

  // Count confirmed appointments
  const confirmed = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "confirmed"
      ).length,
    [appointments]
  );

  // Count unique patients
  const patients = useMemo(
    () =>
      new Set(
        appointments.map(
          (appointment) => appointment.patientId
        )
      ).size,
    [appointments]
  );

  return (
    <View style={styles.page}>
      <Screen>
        {/* Header */}
        <Text style={styles.kicker}>
          DOCTOR DASHBOARD
        </Text>

        <Text style={styles.welcome}>
          Welcome, {userName || "Doctor"}
        </Text>

        {/* Doctor information */}
        <View style={styles.status}>
          <Text style={styles.statusTitle}>
            Your CareSync practice
          </Text>

          <Text style={styles.muted}>
            {profile?.specialty || "General Medicine"} ·{" "}
            {profile?.verificationStatus || "approved"}
          </Text>

          <Button
            title="View appointment requests"
            onPress={() =>
              router.push("/doctor/appointments")
            }
          />
        </View>

        {/* Today's overview */}
        <Text style={styles.kicker}>
          TODAY AT A GLANCE
        </Text>

        <View style={styles.glance}>
          {/* Pending */}
          <View style={styles.stat}>
            <Text style={styles.number}>
              {pending}
            </Text>

            <Text style={styles.statLabel}>
              Pending requests
            </Text>
          </View>

          {/* Confirmed */}
          <View style={styles.stat}>
            <Text style={styles.number}>
              {confirmed}
            </Text>

            <Text style={styles.statLabel}>
              Confirmed
            </Text>
          </View>

          {/* Patients */}
          <View style={styles.stat}>
            <Text style={styles.number}>
              {patients}
            </Text>

            <Text style={styles.statLabel}>
              Patients
            </Text>
          </View>
        </View>

        <View style={styles.requestsHeader}>
          <Text style={styles.kicker}>RECENT APPOINTMENTS</Text>

          <Text
            style={styles.viewAll}
            onPress={() => router.push("/doctor/appointments")}
          >
            View all
          </Text>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : appointments.length > 0 ? (
          <View style={styles.appointments}>
            {appointments.slice(0, 3).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                item={appointment}
                doctorView
                onAccept={() => respond(appointment.id, "confirmed")}
                onReject={() => respond(appointment.id, "rejected")}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No recent appointments.</Text>
        )}
      </Screen>

      {/* Bottom navigation */}
      <BottomNav
        active="dashboard"
        items={[
          {
            key: "dashboard",
            label: "Dashboard",
            icon: "⌂",
            onPress: () => {},
          },
          {
            key: "appointments",
            label: "Appointments",
            icon: "□",
            onPress: () =>
              router.push("/doctor/appointments"),
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

  kicker: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },

  welcome: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.ink,
    marginBottom: 20,
  },

  status: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    marginBottom: 28,
  },

  statusTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.ink,
  },

  muted: {
    color: colors.muted,
    lineHeight: 21,
  },

  glance: {
    backgroundColor: colors.mint,
    padding: 14,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: 10,
  },

  stat: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 14,
    flex: 1,
  },

  number: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.ink,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },

  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  loadingText: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 13,
  },

  requestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
  },

  viewAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  appointments: {
    gap: 10,
  },

  emptyText: {
    color: colors.muted,
    paddingVertical: 18,
    textAlign: "center",
  },
});