
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BottomNav } from "../../components/BottomNav";
import { DoctorCard } from "../../components/DoctorCard";
import { Screen } from "../../components/Screen";

import { colors, radius } from "../../constants/theme";
import { UserProfile } from "../../lib/data";
import { subscribeDoctors } from "../../lib/firebaseServices";

export default function Doctors() {
  const [doctors, setDoctors] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DOCTORS
  // =========================

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeDoctors(
      (items) => {
        console.log("Doctors loaded:", items.length);
        console.log("Doctors:", items);

        setDoctors(items);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Failed to load doctors:",
          error
        );

        setDoctors([]);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // =========================
  // SEARCH DOCTORS
  // =========================

  const filteredDoctors = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      const name =
        doctor.name?.toLowerCase() || "";

      const specialty =
        doctor.specialty?.toLowerCase() || "";

      const email =
        doctor.email?.toLowerCase() || "";

      return (
        name.includes(keyword) ||
        specialty.includes(keyword) ||
        email.includes(keyword)
      );
    });
  }, [doctors, search]);

  // =========================
  // RENDER
  // =========================

  return (
    <View style={styles.page}>
      <Screen>
        {/* =========================
            HEADER
        ========================== */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Find a doctor
          </Text>

          <Text style={styles.copy}>
            Choose the doctor you need.
          </Text>
        </View>

        {/* =========================
            SEARCH
        ========================== */}

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by doctor or specialty"
          placeholderTextColor="#8aa0a0"
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {/* =========================
            SECTION HEADER
        ========================== */}

        <View style={styles.sectionHeader}>
          <Text style={styles.label}>
            DOCTORS IN CARESYNC
          </Text>

          {!loading &&
            doctors.length > 0 && (
              <Text style={styles.count}>
                {filteredDoctors.length} doctor
                {filteredDoctors.length !== 1
                  ? "s"
                  : ""}
              </Text>
            )}
        </View>

        {/* =========================
            LOADING
        ========================== */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text style={styles.loadingText}>
              Loading doctors...
            </Text>
          </View>
        ) : filteredDoctors.length > 0 ? (
          /* =========================
             DOCTORS LIST
          ========================== */

          <View style={styles.doctorsList}>
            {filteredDoctors.map((doctor) => {
              const doctorId =
                doctor.id || doctor.uid;

              /*
               * Use ONLY the photo saved during
               * doctor registration.
               *
               * No default image is used.
               */
              const doctorImage =
                doctor.photoUrl ||
                doctor.image ||
                "";

              console.log(
                "Doctor photo:",
                doctor.name,
                doctorImage
              );

              return (
                <DoctorCard
                  key={doctorId}
                  doctor={{
                    ...doctor,

                    // DoctorCard will show
                    // "No Photo" if this is empty.
                    image: doctorImage
                      ? { uri: doctorImage }
                      : undefined,

                    available:
                      "Available for requests",
                  }}
                  onPress={() => {
                    if (!doctorId) {
                      console.error(
                        "Doctor ID is missing:",
                        doctor
                      );

                      return;
                    }

                    router.push(
                      `/patient/doctor/${doctorId}`
                    );
                  }}
                />
              );
            })}
          </View>
        ) : (
          /* =========================
             EMPTY STATE
          ========================== */

          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              🩺
            </Text>

            <Text style={styles.emptyTitle}>
              {search.trim()
                ? "No doctors found"
                : "No doctors yet"}
            </Text>

            <Text style={styles.emptyText}>
              {search.trim()
                ? "Try searching with another doctor name or specialty."
                : "Ask a doctor to register in CareSync. Their profile will appear here automatically."}
            </Text>
          </View>
        )}
      </Screen>

      {/* =========================
          BOTTOM NAVIGATION
      ========================== */}

      <BottomNav
        active="doctors"
        items={[
          {
            key: "home",
            label: "Home",
            icon: "⌂",
            onPress: () =>
              router.push(
                "/patient/dashboard"
              ),
          },

          {
            key: "doctors",
            label: "Doctors",
            icon: "✚",
            onPress: () => {},
          },

          {
            key: "appointments",
            label: "Appointments",
            icon: "□",
            onPress: () =>
              router.push(
                "/patient/appointments"
              ),
          },

          {
            key: "profile",
            label: "Profile",
            icon: "○",
            onPress: () =>
              router.push(
                "/patient/profile"
              ),
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

  header: {
    gap: 4,
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.ink,
  },

  copy: {
    color: colors.muted,
    lineHeight: 20,
    fontSize: 14,
  },

  search: {
    height: 54,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 15,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    color: colors.primary,
  },

  count: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600",
  },

  doctorsList: {
    gap: 12,
    paddingBottom: 20,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 10,
  },

  loadingText: {
    color: colors.muted,
    fontSize: 14,
  },

  empty: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 36,
    marginBottom: 4,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.ink,
    textAlign: "center",
  },

  emptyText: {
    color: colors.muted,
    lineHeight: 20,
    textAlign: "center",
    fontSize: 14,
  },
});