
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { FirebaseError } from "firebase/app";
import { router } from "expo-router";

import { AuthShell } from "../components/AuthShell";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";

import {
  registerUser,
  uploadDoctorPhoto,
  updateUserProfile,
} from "../lib/firebaseServices";

import { useApp } from "../context/AppContext";

export default function Register() {
  const { role, setRole } = useApp();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Patient information
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");

  // Doctor information
  const [specialty, setSpecialty] =
    React.useState("General Medicine");

  const [experience, setExperience] =
    React.useState("");

  const [bio, setBio] =
    React.useState("");

  const [photo, setPhoto] =
    React.useState<string | null>(null);

  const [busy, setBusy] =
    React.useState(false);

  // =========================
  // PICK DOCTOR PHOTO
  // =========================

  const pickDoctorPhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos."
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

      console.log(
        "PHOTO SELECTED:",
        selectedPhoto
      );

      setPhoto(selectedPhoto);
    } catch (error) {
      console.error(
        "PHOTO PICKER ERROR:",
        error
      );

      Alert.alert(
        "Photo Error",
        "Unable to select the photo."
      );
    }
  };

  // =========================
  // CREATE ACCOUNT
  // =========================

  const create = async () => {
    const selectedRole =
      role || "patient";

    // -------------------------
    // BASIC VALIDATION
    // -------------------------

    if (
      !name.trim() ||
      !email.trim() ||
      password.length < 6
    ) {
      Alert.alert(
        "Create Account",
        "Please enter your name, email and a password of at least 6 characters."
      );
      return;
    }

    // -------------------------
    // PATIENT PHONE REQUIRED
    // -------------------------

    if (
      selectedRole === "patient" &&
      !phone.trim()
    ) {
      Alert.alert(
        "Patient Information",
        "Please enter your phone number."
      );
      return;
    }

    // -------------------------
    // PATIENT GENDER REQUIRED
    // -------------------------

    if (
      selectedRole === "patient" &&
      !gender.trim()
    ) {
      Alert.alert(
        "Patient Information",
        "Please select your gender."
      );
      return;
    }

    // -------------------------
    // PATIENT DATE OF BIRTH
    // -------------------------

    if (
      selectedRole === "patient" &&
      !dateOfBirth.trim()
    ) {
      Alert.alert(
        "Patient Information",
        "Please enter your date of birth."
      );
      return;
    }

    // -------------------------
    // DOCTOR PHOTO REQUIRED
    // -------------------------

    if (
      selectedRole === "doctor" &&
      !photo
    ) {
      Alert.alert(
        "Profile Photo Required",
        "Please add your profile photo before creating your doctor account."
      );
      return;
    }

    // -------------------------
    // DOCTOR EXPERIENCE REQUIRED
    // -------------------------

    if (
      selectedRole === "doctor" &&
      !experience.trim()
    ) {
      Alert.alert(
        "Doctor Information",
        "Please enter your experience."
      );
      return;
    }

    try {
      setBusy(true);

      console.log(
        "=============================="
      );

      console.log(
        "REGISTER START"
      );

      console.log(
        "=============================="
      );

      console.log(
        "Name:",
        name.trim()
      );

      console.log(
        "Email:",
        email.trim().toLowerCase()
      );

      console.log(
        "Role:",
        selectedRole
      );

      console.log(
        "Phone:",
        phone.trim()
      );

      console.log(
        "Gender:",
        gender
      );

      console.log(
        "Date of Birth:",
        dateOfBirth
      );

      // =========================
      // STEP 1
      // CREATE AUTH + FIRESTORE
      // =========================

      console.log(
        "STEP 1: Creating account..."
      );

      const result =
        await registerUser(
          name,
          email,
          password,
          selectedRole,
          specialty,
          experience,
          bio,
          selectedRole === "doctor"
            ? ""
            : "",
          phone
        );

      const uid =
        result.user.uid;

      console.log(
        "AUTH ACCOUNT CREATED:",
        uid
      );

      // =========================
      // STEP 2
      // SAVE PATIENT INFORMATION
      // =========================

      if (
        selectedRole === "patient"
      ) {
        console.log(
          "STEP 2: Saving patient information..."
        );

        await updateUserProfile(
          uid,
          {
            phone: phone.trim(),
            gender: gender,
            dateOfBirth:
              dateOfBirth.trim(),
          }
        );

        console.log(
          "PATIENT INFORMATION SAVED"
        );
      }

      // =========================
      // STEP 3
      // UPLOAD DOCTOR PHOTO
      // =========================

      if (
        selectedRole === "doctor" &&
        photo
      ) {
        console.log(
          "STEP 3: Uploading doctor photo..."
        );

        console.log(
          "Local photo:",
          photo
        );

        const photoUrl =
          await uploadDoctorPhoto(
            photo,
            uid
          );

        console.log(
          "CLOUDINARY PHOTO URL:",
          photoUrl
        );

        if (!photoUrl) {
          throw new Error(
            "Photo upload completed but no Cloudinary URL was returned."
          );
        }

        // =========================
        // STEP 4
        // SAVE PHOTO URL
        // =========================

        console.log(
          "STEP 4: Saving photo URL to Firestore..."
        );

        await updateUserProfile(
          uid,
          {
            image: photoUrl,
            photoUrl: photoUrl,
          }
        );

        console.log(
          "PHOTO SAVED TO FIRESTORE:",
          photoUrl
        );
      }

      console.log(
        "=============================="
      );

      console.log(
        "REGISTER SUCCESS"
      );

      console.log(
        "=============================="
      );

      router.replace("/login");
    } catch (error) {
      console.error(
        "=============================="
      );

      console.error(
        "REGISTRATION ERROR:",
        error
      );

      console.error(
        "=============================="
      );

      const code =
        error instanceof FirebaseError
          ? error.code
          : "";

      let message =
        error instanceof Error &&
        error.message
          ? error.message
          : "Registration failed. Try again.";

      if (
        code ===
        "auth/email-already-in-use"
      ) {
        message =
          "This email is already registered. Please use another email.";
      } else if (
        code === "auth/invalid-email"
      ) {
        message =
          "Please enter a valid email address.";
      } else if (
        code === "auth/weak-password"
      ) {
        message =
          "Password is too weak. Use at least 6 characters.";
      } else if (
        code ===
        "auth/network-request-failed"
      ) {
        message =
          "Network error. Check your internet connection.";
      }

      Alert.alert(
        "Create Account",
        message
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="We are here to help you!"
    >
      {/* =========================
          NAME
      ========================== */}

      <AuthInput
        icon="person-outline"
        value={name}
        onChangeText={setName}
        placeholder="Your Name"
        autoCapitalize="words"
      />

      {/* =========================
          EMAIL
      ========================== */}

      <AuthInput
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="Your Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* =========================
          PASSWORD
      ========================== */}

      <AuthInput
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      {/* =========================
          ACCOUNT TYPE
      ========================== */}

      <Text style={styles.roleLabel}>
        Account type
      </Text>

      <View style={styles.roles}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            (!role ||
              role === "patient") &&
              styles.activeRole,
          ]}
          onPress={() =>
            setRole("patient")
          }
          disabled={busy}
        >
          <Text
            style={[
              styles.roleText,
              (!role ||
                role === "patient") &&
                styles.activeRoleText,
            ]}
          >
            Patient
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "doctor" &&
              styles.activeRole,
          ]}
          onPress={() =>
            setRole("doctor")
          }
          disabled={busy}
        >
          <Text
            style={[
              styles.roleText,
              role === "doctor" &&
                styles.activeRoleText,
            ]}
          >
            Doctor
          </Text>
        </TouchableOpacity>
      </View>

      {/* =========================
          PATIENT INFORMATION
      ========================== */}

      {role !== "doctor" && (
        <View style={styles.patientSection}>
          <Text style={styles.sectionTitle}>
            Patient Information
          </Text>

          {/* PHONE */}

          <Text style={styles.label}>
            Phone Number *
          </Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. 0788123456"
            keyboardType="phone-pad"
            editable={!busy}
          />

          {/* GENDER */}

          <Text style={styles.label}>
            Gender *
          </Text>

          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Male" &&
                  styles.activeGender,
              ]}
              onPress={() =>
                setGender("Male")
              }
              disabled={busy}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "Male" &&
                    styles.activeGenderText,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Female" &&
                  styles.activeGender,
              ]}
              onPress={() =>
                setGender("Female")
              }
              disabled={busy}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "Female" &&
                    styles.activeGenderText,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>

          {/* DATE OF BIRTH */}

          <Text style={styles.label}>
            Date of Birth *
          </Text>

          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="DD/MM/YYYY"
            keyboardType="numbers-and-punctuation"
            editable={!busy}
          />
        </View>
      )}

      {/* =========================
          DOCTOR INFORMATION
      ========================== */}

      {role === "doctor" && (
        <View style={styles.doctorSection}>
          <Text style={styles.sectionTitle}>
            Doctor Information
          </Text>

          {/* PHOTO */}

          <TouchableOpacity
            style={styles.photoContainer}
            onPress={pickDoctorPhoto}
            disabled={busy}
          >
            {photo ? (
              <Image
                source={{
                  uri: photo,
                }}
                style={styles.photo}
              />
            ) : (
              <>
                <Text
                  style={styles.cameraIcon}
                >
                  📷
                </Text>

                <Text
                  style={styles.photoText}
                >
                  Add Profile Photo *
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text
            style={styles.requiredHint}
          >
            * Profile photo is required
            for Doctor accounts
          </Text>

          {/* SPECIALTY */}

          <Text style={styles.label}>
            Specialty
          </Text>

          <TextInput
            style={styles.input}
            value={specialty}
            onChangeText={setSpecialty}
            placeholder="e.g. Cardiologist"
            editable={!busy}
          />

          {/* EXPERIENCE */}

          <Text style={styles.label}>
            Experience *
          </Text>

          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g. 5 years"
            editable={!busy}
          />

          {/* BIO */}

          <Text style={styles.label}>
            About You
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.bioInput,
            ]}
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!busy}
          />
        </View>
      )}

      {/* =========================
          CREATE BUTTON
      ========================== */}

      <AuthButton
        title={
          busy
            ? "Creating Account..."
            : "Create Account"
        }
        onPress={create}
        busy={busy}
      />

      {/* =========================
          LOGIN
      ========================== */}

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>
          Already have an account?
        </Text>

        <Text
          style={styles.loginLink}
          onPress={() => {
            if (!busy) {
              router.replace("/login");
            }
          }}
        >
          {" "}
          Login
        </Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  roleLabel: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  roles: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeRole: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
  },

  roleText: {
    color: "#555",
    fontWeight: "600",
  },

  activeRoleText: {
    color: "#fff",
  },

  patientSection: {
    marginBottom: 20,
  },

  doctorSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },

  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },

  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeGender: {
    backgroundColor: "#2F80ED",
    borderColor: "#2F80ED",
  },

  genderText: {
    color: "#555",
    fontWeight: "600",
  },

  activeGenderText: {
    color: "#fff",
  },

  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 8,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  cameraIcon: {
    fontSize: 30,
    marginBottom: 5,
  },

  photoText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },

  requiredHint: {
    textAlign: "center",
    fontSize: 11,
    color: "#D64545",
    marginBottom: 12,
  },

  bioInput: {
    minHeight: 100,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  loginText: {
    color: "#777",
  },

  loginLink: {
    color: "#2F80ED",
    fontWeight: "700",
  },
});
