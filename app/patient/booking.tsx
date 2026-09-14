import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";
import { colors } from "../../constants/theme";
import {
  createAppointment,
  getDoctor,
} from "../../lib/firebaseServices";
import { useApp } from "../../context/AppContext";
import { UserProfile } from "../../lib/data";

const slots = [
  "09:00 AM",
  "10:30 AM",
  "02:30 PM",
  "04:00 PM",
];

const beds = [
  "Bed A1",
  "Bed A2",
  "Bed B1",
  "Bed B2",
];

export default function Booking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, userName } = useApp();

  const [doctor, setDoctor] = useState<UserProfile | null>(null);
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );
  const [time, setTime] = useState(slots[2]);
  const [bedName, setBedName] = useState(beds[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Get doctor information
  useEffect(() => {
    if (!id) return;

    getDoctor(id).then(setDoctor);
  }, [id]);

  // Get tomorrow's date
  const nextDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, []);

  // Submit appointment request
  const submit = async () => {
    if (!user || !doctor) return;

    try {
      setBusy(true);
      setError("");

      await createAppointment({
        patientId: user.uid,
        patientName: userName,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty || "General Medicine",
        date,
        time,
        bedName,
      });

      router.replace("/patient/appointments");
    } catch (e) {
      setError(
        (e as Error).message || "Unable to create appointment."
      );
    } finally {
      setBusy(false);
    }
  };

  // Loading state
  if (!doctor) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />

        <Text style={styles.loadingText}>
          Loading doctor...
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Book appointment</Text>

      <Text style={styles.doctor}>
        {doctor.name} · {doctor.specialty || "General Medicine"}
      </Text>

      {/* Date Selection */}
      <Text style={styles.label}>SELECT DATE</Text>

      <View style={styles.dates}>
        {[date, nextDate].map((d) => (
          <Pressable
            key={d}
            onPress={() => setDate(d)}
            style={[
              styles.date,
              date === d && styles.selected,
            ]}
          >
            <Text
              style={
                date === d
                  ? styles.selectedText
                  : styles.dateText
              }
            >
              {d}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Time Selection */}
      <Text style={styles.label}>SELECT TIME</Text>

      <View style={styles.times}>
        {slots.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTime(t)}
            style={[
              styles.time,
              time === t && styles.selected,
            ]}
          >
            <Text
              style={
                time === t
                  ? styles.selectedText
                  : styles.timeText
              }
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      {/* Bed Selection */}
      <Text style={styles.label}>SELECT BED</Text>

      <View style={styles.times}>
        {beds.map((bed) => (
          <Pressable
            key={bed}
            onPress={() => setBedName(bed)}
            style={[
              styles.time,
              bedName === bed && styles.selected,
            ]}
          >
            <Text
              style={
                bedName === bed
                  ? styles.selectedText
                  : styles.timeText
              }
            >
              {bed}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Submit Button */}
      <Button
        title={busy ? "Sending request..." : "Request appointment"}
        onPress={submit}
        disabled={busy}
      />

      <Text style={styles.note}>
        Your request starts as Pending. The doctor must accept
        or reject it.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.ink,
  },

  doctor: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deep,
  },

  label: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1,
  },

  dates: {
    flexDirection: "row",
    gap: 10,
  },

  date: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  dateText: {
    color: colors.deep,
    fontWeight: "700",
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
  },

  timeText: {
    color: colors.deep,
    fontWeight: "700",
  },

  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  selectedText: {
    color: colors.white,
    fontWeight: "800",
  },

  error: {
    color: colors.danger,
    fontWeight: "700",
  },

  note: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },

  loadingText: {
    color: colors.muted,
  },
});