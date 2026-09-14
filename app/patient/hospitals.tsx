import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BottomNav } from "../../components/BottomNav";
import { HospitalCard } from "../../components/HospitalCard";
import { Screen } from "../../components/Screen";
import { colors } from "../../constants/theme";
import { useApp } from "../../context/AppContext";
import { hospitals } from "../../lib/hospitals";

export default function Hospitals() {
  const [search, setSearch] = useState("");

  const {
    favoriteHospitalIds,
    toggleFavoriteHospital,
  } = useApp();

  // Filter hospitals based on search
  const filtered = hospitals.filter((hospital) => {
    const searchText = search.trim().toLowerCase();

    return `${hospital.name} ${hospital.address}`
      .toLowerCase()
      .includes(searchText);
  });

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
              Hospitals
            </Text>

            <Text style={styles.placeholder}>
              {" "}
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.copy}>
            Find trusted care close to you.
          </Text>

          {/* Search */}
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search hospitals or clinics"
            placeholderTextColor={colors.muted}
            style={styles.search}
          />

          {/* Section Header */}
          <View style={styles.section}>
            <Text style={styles.label}>
              NEARBY HOSPITALS
            </Text>

            <Text style={styles.count}>
              {filtered.length} places
            </Text>
          </View>

          {/* Hospital List */}
          {filtered.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              favorite={favoriteHospitalIds.includes(hospital.id)}
              onToggleFavorite={() =>
                toggleFavoriteHospital(hospital.id)
              }
            />
          ))}

          {/* No Results */}
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No hospitals found
              </Text>

              <Text style={styles.emptyText}>
                Try searching with another name or location.
              </Text>
            </View>
          )}
        </ScrollView>
      </Screen>

      {/* Bottom Navigation */}
      <BottomNav
        active="hospitals"
        items={navItems}
      />
    </View>
  );
}

/* --------------------------------
   Bottom Navigation Items
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
    onPress: () => {},
  },

  {
    key: "favorites",
    label: "Favorites",
    icon: "♡",
    onPress: () =>
      router.push("/patient/favorites"),
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
    marginBottom: 4,
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

  copy: {
    color: colors.muted,
    marginBottom: 16,
  },

  search: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    marginBottom: 18,
  },

  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  label: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  count: {
    color: colors.muted,
    fontSize: 12,
  },

  empty: {
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
});