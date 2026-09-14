import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
} from "../constants/theme";

import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";

export function AppointmentCard({
  item,
  doctorView = false,
  onAccept,
  onReject,
}: {
  item: any;
  doctorView?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  const canRespond =
    doctorView &&
    item.status === "pending";

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Patient name */}
        <Text style={styles.name}>
          {doctorView
            ? item.patientName
            : item.doctorName ||
              item.doctor}
        </Text>

        {/* Appointment information */}
        <Text style={styles.detail}>
          {item.specialty}
        </Text>

        <Text style={styles.detail}>
          {item.date} · {item.time}
        </Text>

        {item.bedName ? (
          <Text style={styles.bed}>
            Bed: {item.bedName}
          </Text>
        ) : null}

        {/* Patient information for Doctor */}
        {doctorView ? (
          <View style={styles.patientInfo}>
            <Text style={styles.sectionTitle}>
              Patient Information
            </Text>

            {item.patientEmail ? (
              <Text style={styles.patientDetail}>
                📧 {item.patientEmail}
              </Text>
            ) : null}

            {item.patientPhone ? (
              <Text style={styles.patientDetail}>
                📱 {item.patientPhone}
              </Text>
            ) : null}

            {item.patientGender ? (
              <Text style={styles.patientDetail}>
                ⚧ Gender: {item.patientGender}
              </Text>
            ) : null}

            {item.patientDateOfBirth ? (
              <Text style={styles.patientDetail}>
                🎂 Date of Birth:{" "}
                {item.patientDateOfBirth}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={styles.right}>
        <StatusBadge
          status={item.status}
        />

        {canRespond ? (
          <View style={styles.actions}>
            <Button
              title="Accept"
              onPress={
                onAccept ||
                (() => {})
              }
            />

            <Button
              title="Reject"
              variant="ghost"
              onPress={
                onReject ||
                (() => {})
              }
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:
      colors.white,

    borderRadius:
      radius.md,

    borderWidth: 1,

    borderColor:
      colors.border,

    padding:
      spacing.md,

    flexDirection:
      "row",

    alignItems:
      "flex-start",

    gap: 10,
  },

  content: {
    flex: 1,
    gap: 4,
  },

  right: {
    alignItems:
      "flex-end",

    gap: 8,

    maxWidth: 150,
  },

  actions: {
    flexDirection:
      "row",

    gap: 6,

    flexWrap:
      "wrap",

    justifyContent:
      "flex-end",
  },

  name: {
    fontWeight:
      "800",

    fontSize:
      16,

    color:
      colors.ink,
  },

  detail: {
    color:
      colors.muted,

    fontSize:
      13,
  },

  bed: {
    color: colors.deep,
    fontSize: 13,
    fontWeight: "800",
  },

  patientInfo: {
    marginTop: 12,

    paddingTop: 10,

    borderTopWidth: 1,

    borderTopColor:
      colors.border,

    gap: 5,
  },

  sectionTitle: {
    fontSize: 14,

    fontWeight: "800",

    color:
      colors.ink,

    marginBottom: 3,
  },

  patientDetail: {
    fontSize: 13,

    color:
      colors.muted,
  },
});