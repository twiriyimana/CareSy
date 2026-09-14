import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BottomNav } from "../../components/BottomNav";
import { HospitalCard } from "../../components/HospitalCard";
import { Screen } from "../../components/Screen";
import { colors } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { hospitals } from "../../lib/hospitals";

export default function Favorites() {
  const [tab, setTab] = useState<"doctors" | "hospitals">(
    "hospitals"
  );

  const {
    favoriteHospitalIds,
    toggleFavoriteHospital,
  } = useApp();

  // Get saved hospitals
  const savedHospitals = hospitals.filter((hospital) =>
    favoriteHospitalIds.includes(hospital.id)
  );

  return (
    <View style={styles.page}>
      <Screen>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={styles.back}
              onPress={() => router.back()}
            >
              ‹
            </Text>

            <Text style={styles.title}>
              Favorites
            </Text>

            <Text style={styles.placeholder}>
              {" "}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Text
              onPress={() => setTab("doctors")}
              style={[
                styles.tab,
                tab === "doctors" && styles.activeTab,
              ]}
            >
              Doctors
            </Text>

            <Text
              onPress={() => setTab("hospitals")}
              style={[
                styles.tab,
                tab === "hospitals" && styles.activeTab,
              ]}
            >
              Hospitals
            </Text>
          </View>

          {/* Hospitals Tab */}
          {tab === "hospitals" && (
            <>
              {savedHospitals.length > 0 ? (
                savedHospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    favorite={true}
                    onToggleFavorite={() =>
                      toggleFavoriteHospital(hospital.id)
                    }
                  />
                ))
              ) : (
                <View style={styles.empty}>
                  <Text style={styles.emptyIcon}>
                    ♡
                  </Text>

                  <Text style={styles.emptyTitle}>
                    No favorite hospitals yet
                  </Text>

                  <Text style={styles.emptyCopy}>
                    Save hospitals you trust and they
                    will appear here.
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Doctors Tab */}
          {tab === "doctors" && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>
                ♡
              </Text>

              <Text style={styles.emptyTitle}>
                No favorite doctors yet
              </Text>

              <Text style={styles.emptyCopy}>
                Save doctors you trust and they will
                appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </Screen>

      {/* Bottom Navigation */}
      <BottomNav
        active="favorites"
        items={navItems}
      />
    </View>
  );
}

/* --------------------------------
   Bottom Navigation
--------------------------------- */

const navItems = [
  {
    key: "home",
    label: "Home",
    icon: "⌂",
    onPress: () =>
      router.push("/patient/dashboard"),
  },

  {
    key: "doctors",
    label: "Doctors",
    icon: "✚",
    onPress: () =>
      router.push("/patient/doctors"),
  },

  {
    key: "hospitals",
    label: "Hospitals",
    icon: "▣",
    onPress: () =>
      router.push("/patient/hospitals"),
  },

  {
    key: "favorites",
    label: "Favorites",
    icon: "♡",
    onPress: () => {},
  },
];

/* --------------------------------
   Styles
--------------------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.canvas,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  back: {
    fontSize: 34,
    color: colors.ink,
    width: 32,
  },

  placeholder: {
    width: 32,
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.ink,
  },

  /* Tabs */

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },

  tab: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 28,
    paddingBottom: 14,
  },

  activeTab: {
    color: colors.deep,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  /* Empty State */

  empty: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 42,
    color: colors.primary,
  },

  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
    textAlign: "center",
  },

  emptyCopy: {
    color: colors.muted,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});