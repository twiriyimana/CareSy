import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppointmentCard } from "../../components/AppointmentCard";
import { BottomNav } from "../../components/BottomNav";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";

import { useApp } from "../../context/AppContext";
import { colors, radius, spacing } from "../../constants/theme";
import {
  subscribeAppointmentsForPatient,
  subscribeDoctors,
} from "../../lib/firebaseServices";

import { Appointment, UserProfile } from "../../lib/data";

export default function Dashboard() {
  const { user, userName } = useApp();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<UserProfile[]>([]);

  // Subscribe to patient's appointments
  useEffect(() => {
    if (!user) return;

    return subscribeAppointmentsForPatient(
      user.uid,
      setAppointments
    );
  }, [user]);

  // Subscribe to doctors
  useEffect(() => {
    return subscribeDoctors(setDoctors);
  }, []);

  // Find the next pending or confirmed appointment
  const upcoming = useMemo(
    () =>
      appointments.find(
        (appointment) =>
          appointment.status === "confirmed" ||
          appointment.status === "pending"
      ),
    [appointments]
  );

  return (
    <View style={styles.page}>
      <Screen>
        {/* Greeting */}
        <Text style={styles.hello}>
          Hello 👋, {userName.split(" ")[0] || "there"}
        </Text>

        {/* Upcoming Appointment */}
        <View style={styles.hero}>
          <Text style={styles.kicker}>
            UPCOMING APPOINTMENT
          </Text>

          {upcoming ? (
            <>
              <Text style={styles.appt}>
                {upcoming.doctorName} · {upcoming.date},{" "}
                {upcoming.time}
              </Text>

              <Text style={styles.status}>
                {upcoming.status.toUpperCase()}
              </Text>
            </>
          ) : (
            <Text style={styles.appt}>
              No appointment yet
            </Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.row}>
          <Button
            title="Find Doctor"
            onPress={() => router.push("/patient/doctors")}
          />

          <Button
            title="My Appointments"
            variant="secondary"
            onPress={() =>
              router.push("/patient/appointments")
            }
          />
        </View>

        <View style={styles.row}>
          <Button
            title="Find Hospital"
            variant="secondary"
            onPress={() => router.push("/patient/hospitals")}
          />
          <Button
            title="Favorites"
            variant="ghost"
            onPress={() => router.push("/patient/favorites")}
          />
        </View>

        {/* Doctors Section */}
        <Text style={styles.section}>
          CareSync Doctors
        </Text>

        <Text style={styles.muted}>
          {doctors.length} doctor
          {doctors.length === 1 ? "" : "s"} available numer of doctors.
        </Text>

        {doctors.slice(0, 2).map((doctor) => (
          <View key={doctor.id} style={styles.doctor}>
            <Text style={styles.doctorName}>
              {doctor.name}
            </Text>

            <Text style={styles.muted}>
              {doctor.specialty || "General Medicine"} · ★{" "}
              {doctor.rating || 5}
            </Text>
          </View>
        ))}

        {!doctors.length && (
          <ActivityIndicator color={colors.primary} />
        )}

        {/* Medical Profile */}
        <Text style={styles.section}>
          Medical Profile
        </Text>

        <View style={styles.profile}>
          <Text style={styles.profileTitle}>
            Your care at a glance
          </Text>

          <Text style={styles.muted}>
            Keep your contact details and preferences up to
            date.
          </Text>

          <Button
            title="Open profile"
            variant="ghost"
            onPress={() =>
              router.push("/patient/profile")
            }
          />
        </View>
      </Screen>

      {/* Bottom Navigation */}
      <BottomNav
        active="home"
        items={[
          {
            key: "home",
            label: "Home",
            icon: "⌂",
            onPress: () => {},
          },
          {
            key: "doctors",
            label: "Doctors",
            icon: "✚",
            onPress: () =>
              router.push("/patient/doctors"),
          },
          {
            key: "appointments",
            label: "Appointments",
            icon: "□",
            onPress: () =>
              router.push("/patient/appointments"),
          },
          {
            key: "profile",
            label: "Profile",
            icon: "○",
            onPress: () =>
              router.push("/patient/profile"),
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

  hello: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.ink,
    marginTop: 8,
  },

  hero: {
    backgroundColor: colors.mint,
    padding: 20,
    borderRadius: radius.lg,
    marginTop: 8,
    gap: 7,
  },

  kicker: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1,
  },

  appt: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },

  status: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.deep,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  section: {
    fontSize: 19,
    fontWeight: "900",
    color: colors.ink,
    marginTop: 8,
  },

  muted: {
    color: colors.muted,
  },

  doctor: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  doctorName: {
    fontWeight: "800",
    color: colors.ink,
  },

  profile: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },

  profileTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: colors.ink,
  },
});