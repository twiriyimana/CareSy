import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BottomNav } from "../../components/BottomNav";
import { Screen } from "../../components/Screen";
import { useApp } from "../../context/AppContext";
import { colors, radius } from "../../constants/theme";
import {
  getUsersByIds,
  subscribeAppointmentsForDoctor,
} from "../../lib/firebaseServices";
import { UserProfile } from "../../lib/data";

export default function Patients() {
  const { user } = useApp();

  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load confirmed patients from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeAppointmentsForDoctor(
      user.uid,
      async (items) => {
        try {
          const confirmedAppointments = items.filter(
            (appointment) =>
              appointment.status === "confirmed"
          );

          const patientIds = confirmedAppointments.map(
            (appointment) => appointment.patientId
          );

          // Remove duplicate patient IDs
          const uniquePatientIds = [
            ...new Set(patientIds),
          ];

          const result = await getUsersByIds(
            uniquePatientIds
          );

          setPatients(result);
        } catch (error) {
          console.error(
            "Failed to load patients:",
            error
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return (
    <View style={styles.page}>
      <Screen>
        {/* Header */}
        <Text style={styles.title}>My Patients</Text>

        <Text style={styles.copy}>
          Patients with confirmed appointments are linked
          to your doctor account.
        </Text>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text style={styles.loadingText}>
              Loading patients...
            </Text>
          </View>
        ) : patients.length > 0 ? (
          <View style={styles.list}>
            {patients.map((patient) => (
              <View
                key={patient.id}
                style={styles.card}
              >
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {patient.name
                      ?.charAt(0)
                      .toUpperCase() || "P"}
                  </Text>
                </View>

                {/* Patient information */}
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {patient.name || "Patient"}
                  </Text>

                  <Text style={styles.detail}>
                    {patient.email}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No confirmed patients
            </Text>

            <Text style={styles.empty}>
              Patients will appear here after you confirm
              their appointments.
            </Text>
          </View>
        )}
      </Screen>

      {/* Bottom Navigation */}
      <BottomNav
        active="patients"
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
            onPress: () =>
              router.push("/doctor/appointments"),
          },
          {
            key: "patients",
            label: "Patients",
            icon: "♙",
            onPress: () => {},
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

  list: {
    gap: 12,
  },

  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },

  detail: {
    color: colors.muted,
    marginTop: 4,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  loadingText: {
    color: colors.muted,
    marginTop: 10,
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
    lineHeight: 20,
  },
});