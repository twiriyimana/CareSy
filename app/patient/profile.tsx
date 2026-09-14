import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomNav } from "../../components/BottomNav";
import { Button } from "../../components/Button";
import { Screen } from "../../components/Screen";

import { useApp } from "../../context/AppContext";
import { colors } from "../../constants/theme";
import { logoutUser } from "../../lib/firebaseServices";

export default function Profile() {
  const { profile } = useApp();

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = async () => {
    try {
      await logoutUser();
      router.replace("/login");
    } catch (error) {
      Alert.alert(
        "Logout failed",
        "Something went wrong while logging out."
      );
    }
  };

  /* =====================================================
     PROFILE DATA
  ===================================================== */

  const name =
    profile?.name || "Patient";

  const email =
    profile?.email || "No email";

  const phone =
    profile?.phone || "Not provided";

  const gender =
    profile?.gender || "Not provided";

  const dateOfBirth =
    profile?.dateOfBirth || "Not provided";

  const initial =
    name.charAt(0).toUpperCase() || "P";

  return (
    <View style={styles.page}>
      <Screen>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.header}>
            <Text style={styles.title}>
              My Profile
            </Text>

            <Text style={styles.headerSubtitle}>
              Manage your personal information
            </Text>
          </View>

          {/* =================================================
              AVATAR
          ================================================= */}

          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initial}
              </Text>
            </View>

            <Text style={styles.name}>
              {name}
            </Text>

            <View style={styles.patientBadge}>
              <Text style={styles.patientBadgeText}>
                PATIENT
              </Text>
            </View>

            <Text style={styles.email}>
              {email}
            </Text>
          </View>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Personal Information
            </Text>

            {/* Name */}

            <View style={styles.infoCard}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  👤
                </Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>
                  Full name
                </Text>

                <Text style={styles.value}>
                  {name}
                </Text>
              </View>
            </View>

            {/* Email */}

            <View style={styles.infoCard}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  ✉
                </Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>
                  Email address
                </Text>

                <Text style={styles.value}>
                  {email}
                </Text>
              </View>
            </View>

            {/* Phone */}

            <View style={styles.infoCard}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  ☎
                </Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>
                  Phone number
                </Text>

                <Text style={styles.value}>
                  {phone}
                </Text>
              </View>
            </View>

            {/* Gender */}

            <View style={styles.infoCard}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  ⚥
                </Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>
                  Gender
                </Text>

                <Text style={styles.value}>
                  {gender}
                </Text>
              </View>
            </View>

            {/* Date of Birth */}

            <View style={styles.infoCard}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  ◫
                </Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>
                  Date of birth
                </Text>

                <Text style={styles.value}>
                  {dateOfBirth}
                </Text>
              </View>
            </View>
          </View>
          {/* =================================================
              LOGOUT
          ================================================= */}

          <View style={styles.logoutContainer}>
            <Button
              title="Log out"
              variant="ghost"
              onPress={logout}
            />
          </View>
           <Text style={styles.footer}>
                    Developed by jeanchris $$ divine  © 2026. All rights reserved.
                  </Text>
          
                  <View
                    style={styles.bottomSpace}
                  />

          {/* Bottom spacing */}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </Screen>

      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}

      <BottomNav
        active="profile"
        items={[
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
            onPress: () => {},
          },
        ]}
      />
    </View>
    
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.canvas,
  },

  container: {
    paddingBottom: 30,
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.ink,
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: colors.muted,
  },

  /* =====================================================
     PROFILE HEADER
  ===================================================== */

  profileHeader: {
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 38,
    fontWeight: "900",
    color: colors.primary,
  },

  name: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.ink,
    textAlign: "center",
  },

  patientBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.mint,
  },

  patientBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 0.8,
  },

  email: {
    marginTop: 7,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },

  /* =====================================================
     SECTIONS
  ===================================================== */

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: colors.ink,
    marginBottom: 12,
  },

  /* =====================================================
     INFORMATION CARD
  ===================================================== */

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 2,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  icon: {
    fontSize: 20,
  },

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 3,
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  /* =====================================================
     LOGOUT
  ===================================================== */

  logoutContainer: {
    marginTop: 4,
  },

  bottomSpace: {
    height: 30,
  },
   footer: {
    textAlign: "center",
    color: "#0a0a0a",
    fontSize: 12,
    marginTop: 20,
    
  },
});