import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { BottomNav } from "../../components/BottomNav";

import { useApp } from "../../context/AppContext";
import { colors } from "../../constants/theme";

import {
  logoutUser,
  updateUserProfile,
  uploadDoctorPhoto,
} from "../../lib/firebaseServices";

export default function Profile() {
  const { profile, user } = useApp();

  const [changingPhoto, setChangingPhoto] =
    React.useState(false);

  const [localPhoto, setLocalPhoto] =
    React.useState<string | null>(null);

  /* =====================================================
     PROFILE DATA
  ===================================================== */

  const name =
    profile?.name || "Doctor";

  const email =
    profile?.email || "";

  const phone =
    profile?.phone || "";

  const specialty =
    profile?.specialty ||
    "General Medicine";

  const experience =
    profile?.experience || "";

  const avatarLetter =
    name.charAt(0).toUpperCase() || "D";

  const profileImage =
    localPhoto ||
    profile?.image ||
    profile?.photoUrl ||
    "";

  /*
   * Doctor is Active when authenticated.
   */
  const isActive = !!user;

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = async () => {
    try {
      await logoutUser();

      router.replace("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      Alert.alert(
        "Logout failed",
        "Something went wrong while logging out."
      );
    }
  };

  /* =====================================================
     CHANGE DOCTOR PROFILE PHOTO
  ===================================================== */

  const changeProfilePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos so you can change your profile photo."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (
        result.canceled ||
        !result.assets ||
        result.assets.length === 0
      ) {
        return;
      }

      const selectedPhoto =
        result.assets[0].uri;

      const uid =
        profile?.uid ||
        profile?.id ||
        user?.uid;

      if (!uid) {
        Alert.alert(
          "Error",
          "Your profile could not be found."
        );

        return;
      }

      setChangingPhoto(true);

      /*
       * Show selected photo immediately.
       */
      setLocalPhoto(selectedPhoto);

      /*
       * Upload photo to Cloudinary.
       */
      const photoUrl =
        await uploadDoctorPhoto(
          selectedPhoto,
          uid
        );

      /*
       * Save Cloudinary URL to Firestore.
       */
      await updateUserProfile(
        uid,
        {
          image: photoUrl,
          photoUrl: photoUrl,
        }
      );

      /*
       * Keep permanent Cloudinary URL.
       */
      setLocalPhoto(photoUrl);

      Alert.alert(
        "Success",
        "Your profile photo has been updated successfully."
      );
    } catch (error) {
      console.error(
        "Change profile photo failed:",
        error
      );

      setLocalPhoto(null);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update your profile photo.";

      Alert.alert(
        "Change Photo",
        message
      );
    } finally {
      setChangingPhoto(false);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Profile
          </Text>
        </View>

        {/* =================================================
            PROFILE
        ================================================= */}

        <View style={styles.profileSection}>
          {/* Avatar */}

          <View style={styles.avatarWrapper}>
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {avatarLetter}
                </Text>
              </View>
            )}

            {/* Change Photo */}

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={
                changeProfilePhoto
              }
              disabled={changingPhoto}
              activeOpacity={0.8}
            >
              {changingPhoto ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={styles.cameraIcon}
                >
                  ✎
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Status */}

          {isActive && (
            <View style={styles.activeStatus}>
              <View
                style={styles.activeDot}
              />

              <Text
                style={styles.activeText}
              >
                Active
              </Text>
            </View>
          )}

          {/* Change Photo Text */}

          <TouchableOpacity
            onPress={
              changeProfilePhoto
            }
            disabled={changingPhoto}
            activeOpacity={0.7}
          >
            <Text
              style={styles.changePhoto}
            >
              {changingPhoto
                ? "Uploading..."
                : "Change Profile Photo"}
            </Text>
          </TouchableOpacity>

          {/* Name */}

          <Text style={styles.name}>
            {name}
          </Text>

          {/* Phone / Email */}

          <Text style={styles.phone}>
            {phone || email}
          </Text>

          {/* Specialty */}

          <Text
            style={styles.specialty}
          >
            {specialty}
          </Text>

          {/* Experience */}

          {experience ? (
            <Text
              style={styles.experience}
            >
              {experience} experience
            </Text>
          ) : null}
        </View>

        {/* =================================================
            PROFILE INFORMATION
        ================================================= */}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Name
            </Text>

            <Text style={styles.infoValue}>
              {name}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Email
            </Text>

            <Text
              style={styles.infoValue}
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>

          {phone ? (
            <>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text
                  style={styles.infoLabel}
                >
                  Phone
                </Text>

                <Text
                  style={styles.infoValue}
                >
                  {phone}
                </Text>
              </View>
            </>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Specialty
            </Text>

            <Text
              style={styles.infoValue}
              numberOfLines={1}
            >
              {specialty}
            </Text>
          </View>

          {experience ? (
            <>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text
                  style={styles.infoLabel}
                >
                  Experience
                </Text>

                <Text
                  style={styles.infoValue}
                >
                  {experience}
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text
            style={styles.logoutText}
          >
            Log Out
          </Text>
        </TouchableOpacity>

        {/* Footer */}

        <Text style={styles.footer}>
          Developed by jeanchris $$ divine  © 2026. All rights reserved.
        </Text>

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>

      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <BottomNav
        active="profile"
        items={[
          {
            key: "dashboard",
            label: "Dashboard",
            icon: "⌂",
            onPress: () =>
              router.push(
                "/doctor/dashboard"
              ),
          },

          {
            key: "appointments",
            label: "Appointments",
            icon: "□",
            onPress: () =>
              router.push(
                "/doctor/appointments"
              ),
          },

          {
            key: "patients",
            label: "Patients",
            icon: "♙",
            onPress: () =>
              router.push(
                "/doctor/patients"
              ),
          },

          {
            key: "profile",
            label: "Profile",
            icon: "●",
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
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 110,
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#263246",
  },

  /* =====================================================
     PROFILE
  ===================================================== */

  profileSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarImage: {
    width: 168,
    height: 168,
    borderRadius: 84,
  },

  avatarText: {
    fontSize: 58,
    fontWeight: "900",
    color: colors.primary,
  },

  /* =====================================================
     ACTIVE
  ===================================================== */

  activeStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    marginBottom: 3,
  },

  activeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },

  activeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#22C55E",
  },

  /* =====================================================
     PHOTO BUTTON
  ===================================================== */

  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 5,

    width: 40,
    height: 40,

    borderRadius: 11,

    backgroundColor: "#24344A",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  cameraIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  changePhoto: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 7,
    marginBottom: 9,
  },

  /* =====================================================
     NAME
  ===================================================== */

  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#07566A",
    marginTop: 2,
    textAlign: "center",
  },

  phone: {
    fontSize: 14,
    color: "#59657A",
    marginTop: 5,
    textAlign: "center",
  },

  specialty: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },

  experience: {
    fontSize: 12,
    color: "#7C8797",
    marginTop: 3,
    textAlign: "center",
  },

  /* =====================================================
     INFORMATION CARD
  ===================================================== */

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E1E5EA",
    paddingHorizontal: 16,
    marginTop: 4,
  },

  infoRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
  },

  infoLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: "700",
    color: "#59657A",
  },

  infoValue: {
    flex: 1,
    fontSize: 14,
    color: "#263246",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#E4E7EB",
  },

  /* =====================================================
     LOGOUT
  ===================================================== */

  logoutButton: {
    height: 52,
    borderRadius: 12,
    marginTop: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F5F6F8",
    borderWidth: 1,
    borderColor: "#E0E3E7",
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#263246",
  },

  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    textAlign: "center",
    color: "#0a0a0a",
    fontSize: 12,
    marginTop: 20,
    
  },

  bottomSpace: {
    height: 20,
  },
});