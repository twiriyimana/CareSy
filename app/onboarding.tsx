import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const slides = [
  {
    image: require("../assets/images/pers1.jpg"),
    title: "Meet Doctors Online",
    description: "Connect with Specialized Doctors Online for Convenient and Comprehensive Medical Consultations.",
  },
  {
    image: require("../assets/images/pers2.jpg"),
    title: "Connect with Specialists",
    description: "Connect with Specialist Doctors Online for Convenient Comprehensive Consultations.",
  },
  {
    image: require("../assets/images/doctor-maya.jpeg"),
    title: "Thousands of Online Specialists",
    description: "Explore a Vast Array of Online Medical Specialists, Offering an Extensive Range of Expertise Tailored to Your Healthcare Needs.",
  },
];

async function finishOnboarding() {
  await AsyncStorage.setItem("caresync-onboarding-complete", "true");
  router.replace("/login");
}

export default function Onboarding() {
  const [showIntro, setShowIntro] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;

  function nextSlide() {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }
    setSlideIndex((currentIndex) => currentIndex + 1);
  }

  if (showIntro) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.introBoard}>
          <View style={styles.photoGrid}>
            <Image source={slides[0].image} style={styles.gridPhoto} />
            <Image source={slides[1].image} style={styles.gridPhoto} />
            <Image source={slides[2].image} style={styles.gridPhoto} />
            <Image source={slides[1].image} style={styles.gridPhoto} />
            <View style={styles.medicalTile}><Text style={styles.medicalMark}>+</Text><Text style={styles.medicalText}>MEDICAL</Text></View>
            <Image source={slides[0].image} style={styles.gridPhoto} />
            <Image source={slides[2].image} style={styles.gridPhoto} />
            <Image source={slides[0].image} style={styles.gridPhoto} />
            <Image source={slides[1].image} style={styles.gridPhoto} />
          </View>
          <View style={styles.introContent}>
            <Text style={styles.introTitle}>Your care, connected</Text>
            <Text style={styles.introDescription}>Find trusted doctors and manage your healthcare in one place.</Text>
            <TouchableOpacity style={styles.nextButton} onPress={() => setShowIntro(false)}>
              <Text style={styles.nextText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        {slideIndex > 0 ? (
          <TouchableOpacity onPress={() => setSlideIndex((currentIndex) => currentIndex - 1)}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
        ) : <View />}
        <TouchableOpacity onPress={finishOnboarding}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.board}>
        <Image source={slide.image} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
            <Text style={styles.nextText}>{isLastSlide ? "Get Started" : "Next"}</Text>
          </TouchableOpacity>
          <View style={styles.dots}>
            {slides.map((_, index) => <View key={index} style={[styles.dot, index === slideIndex && styles.activeDot]} />)}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F7F7" },
  introBoard: { flex: 1, margin: 18, backgroundColor: "#FFFFFF", borderRadius: 8, overflow: "hidden", shadowColor: "#263238", shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  photoGrid: { flex: 1, flexDirection: "row", flexWrap: "wrap", backgroundColor: "#173F43" },
  gridPhoto: { width: "33.333%", height: "33.333%", borderWidth: 3, borderColor: "#FFFFFF" },
  medicalTile: { width: "33.333%", height: "33.333%", backgroundColor: "#D08B2E", borderWidth: 3, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  medicalMark: { color: "#116D78", fontSize: 32, fontWeight: "900", lineHeight: 30 },
  medicalText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900", marginTop: 3 },
  introContent: { alignItems: "center", paddingHorizontal: 22, paddingVertical: 18 },
  introTitle: { color: "#344246", fontSize: 18, fontWeight: "800", textAlign: "center", marginBottom: 6 },
  introDescription: { color: "#899396", fontSize: 11, lineHeight: 16, textAlign: "center", maxWidth: 280, marginBottom: 2 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 22, paddingVertical: 12 },
  back: { color: "#176B76", fontWeight: "700", fontSize: 14 },
  skip: { color: "#899396", fontSize: 13 },
  board: { flex: 1, marginHorizontal: 18, marginBottom: 18, backgroundColor: "#FFFFFF", borderRadius: 8, overflow: "hidden", shadowColor: "#263238", shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  image: { width: "100%", height: "58%" },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 22, paddingTop: 14 },
  title: { color: "#344246", fontSize: 16, fontWeight: "800", textAlign: "center", marginBottom: 8 },
  description: { color: "#899396", fontSize: 10, lineHeight: 15, textAlign: "center", maxWidth: 280 },
  nextButton: { backgroundColor: "#116D78", borderRadius: 22, width: "100%", paddingVertical: 11, alignItems: "center", marginTop: 18 },
  nextText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  dots: { flexDirection: "row", gap: 4, alignItems: "center", marginTop: 14 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#9DA6A8" },
  activeDot: { width: 13, borderRadius: 3, backgroundColor: "#F6A544" },
});
