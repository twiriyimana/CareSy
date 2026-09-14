import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { Hospital } from "../lib/data";

export function HospitalCard({ hospital, favorite, onToggleFavorite }: { hospital: Hospital; favorite: boolean; onToggleFavorite: () => void }) {
  return <View style={styles.card}>
    <View><Image source={{ uri: hospital.image }} style={styles.image} /><Pressable accessibilityLabel={favorite ? "Remove from favorites" : "Add to favorites"} onPress={onToggleFavorite} style={styles.heart}><Ionicons name={favorite ? "heart" : "heart-outline"} size={20} color={favorite ? colors.danger : colors.white} /></Pressable></View>
    <View style={styles.content}><Text style={styles.name}>{hospital.name}</Text><View style={styles.line}><Ionicons name="location-outline" size={15} color={colors.muted} /><Text style={styles.meta}>{hospital.address}</Text></View><View style={styles.line}><Text style={styles.rating}>{hospital.rating.toFixed(1)} ★★★★★</Text><Text style={styles.meta}> ({hospital.reviews} Reviews)</Text></View><View style={styles.divider} /><View style={styles.footer}><Text style={styles.meta}>⌘ {hospital.distance}</Text><Text style={styles.meta}>▣ {hospital.type}</Text></View></View>
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.md, overflow: "hidden", marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  image: { width: "100%", height: 122 },
  heart: { position: "absolute", right: 10, top: 10, backgroundColor: "rgba(24,51,52,0.38)", borderRadius: 20, padding: 7 },
  content: { padding: spacing.md, gap: 8 }, name: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  line: { flexDirection: "row", alignItems: "center", gap: 5 }, meta: { color: colors.muted, fontSize: 12 }, rating: { color: colors.ink, fontSize: 12, letterSpacing: 1 }, divider: { height: 1, backgroundColor: colors.border }, footer: { flexDirection: "row", justifyContent: "space-between" },
});