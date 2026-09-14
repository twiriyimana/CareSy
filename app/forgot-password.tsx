import React from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AuthShell } from "../components/AuthShell";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";

import { useApp } from "../context/AppContext";
import { updateUserProfile } from "../lib/firebaseServices";

const genderOptions = ["Male", "Female", "Other"];

export default function FillProfile() {
  const { user, profile, refreshProfile } = useApp();

  const [name, setName] = React.useState(
    profile?.name || ""
  );

  const [nick, setNick] = React.useState("");

  const [email] = React.useState(
    user?.email || profile?.email || ""
  );

  const [dob, setDob] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [showGender, setShowGender] = React.useState(false);

  // Save profile
  const save = async () => {
    if (!user) {
      router.replace("/login");
      return;
    }

    try {
      setBusy(true);

      await updateUserProfile(user.uid, {
        name: nicknameSafe(name),
        nickname: nick,
        dateOfBirth: dob,
        gender,
      });

      await refreshProfile();

      router.replace(
        profile?.role === "doctor"
          ? "/doctor/dashboard"
          : "/patient/dashboard"
      );
    } catch (e) {
      Alert.alert(
        "Profile",
        (e as Error).message ||
          "Unable to save profile."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      back
      onBack={() => router.back()}
      title="Fill Your Profile"
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={65}
          color="#dce0e4"
        />

        <TouchableOpacity style={styles.edit}>
          <Ionicons
            name="pencil"
            size={16}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <AuthInput
        icon="person-outline"
        value={name}
        onChangeText={setName}
        placeholder="Michael Jordan"
      />

      {/* Nickname */}
      <AuthInput
        icon="person-outline"
        value={nick}
        onChangeText={setNick}
        placeholder="Nickname"
      />

      {/* Email */}
      <AuthInput
        icon="mail-outline"
        value={email}
        editable={false}
        placeholder="name@example.com"
      />

      {/* Date of Birth */}
      <AuthInput
        icon="calendar-outline"
        value={dob}
        onChangeText={setDob}
        placeholder="Date of Birth"
      />

      {/* Gender Dropdown */}
      <TouchableOpacity
        style={styles.select}
        onPress={() => setShowGender(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.selectText,
            !gender && styles.placeholder,
          ]}
        >
          {gender || "Gender"}
        </Text>

        <Ionicons
          name="chevron-down"
          size={18}
          color="#92999d"
        />
      </TouchableOpacity>

      {/* Save */}
      <AuthButton
        title="Save"
        onPress={save}
        busy={busy}
      />

      {/* Gender Modal */}
      <Modal
        visible={showGender}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGender(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowGender(false)}
        >
          <Pressable
            style={styles.modal}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              Select Gender
            </Text>

            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  gender === option && styles.selectedOption,
                ]}
                onPress={() => {
                  setGender(option);
                  setShowGender(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>

                {gender === option && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#126f78"
                  />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </AuthShell>
  );
}

function nicknameSafe(value: string) {
  return value.trim() || "CareSync User";
}

const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: "#f4f5f7",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  edit: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: "#126f78",
    alignItems: "center",
    justifyContent: "center",
  },

  select: {
    height: 52,
    borderWidth: 1,
    borderColor: "#dfe3e5",
    borderRadius: 7,
    backgroundColor: "#fbfcfd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    marginBottom: 14,
  },

  selectText: {
    fontSize: 14,
    color: "#333",
  },

  placeholder: {
    color: "#a0a1a3",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#222",
    marginBottom: 12,
  },

  option: {
    minHeight: 52,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedOption: {
    backgroundColor: "#e8f5f5",
  },

  optionText: {
    fontSize: 15,
    color: "#333",
  },

  selectedOptionText: {
    color: "#126f78",
    fontWeight: "800",
  },
});