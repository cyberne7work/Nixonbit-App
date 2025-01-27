import { Redirect } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import "react-native-get-random-values";
import { useFonts } from "expo-font";
import React, { useCallback, useState, useEffect } from "react";
import SplashScreen from "./(root)/(auth)/splash";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    "Exo-Black": require("../assets/fonts/Exo-Black.ttf"),
    "Exo-BlackItalic": require("../assets/fonts/Exo-BlackItalic.ttf"),
    "Exo-Bold": require("../assets/fonts/Exo-Bold.ttf"),
    "Exo-BoldItalic": require("../assets/fonts/Exo-BoldItalic.ttf"),
    "Exo-ExtraBold": require("../assets/fonts/Exo-ExtraBold.ttf"),
    "Exo-ExtraBoldItalic": require("../assets/fonts/Exo-ExtraBoldItalic.ttf"),
    "Exo-ExtraLight": require("../assets/fonts/Exo-ExtraLight.ttf"),
    "Exo-ExtraLightItalic": require("../assets/fonts/Exo-ExtraLightItalic.ttf"),
    "Exo-Italic": require("../assets/fonts/Exo-Italic.ttf"),
    "Exo-Light": require("../assets/fonts/Exo-Light.ttf"),
    "Exo-LightItalic": require("../assets/fonts/Exo-LightItalic.ttf"),
    "Exo-Medium": require("../assets/fonts/Exo-Medium.ttf"),
    "Exo-MediumItalic": require("../assets/fonts/Exo-MediumItalic.ttf"),
    "Exo-Regular": require("../assets/fonts/Exo-Regular.ttf"),
    "Exo-SemiBold": require("../assets/fonts/Exo-SemiBold.ttf"),
    "Exo-SemiBoldItalic": require("../assets/fonts/Exo-SemiBoldItalic.ttf"),
    "Exo-Thin": require("../assets/fonts/Exo-Thin.ttf"),
    "Exo-ThinItalic": require("../assets/fonts/Exo-ThinItalic.ttf"),
    "Exo-VariableFont": require("../assets/fonts/Exo-VariableFont_wght.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // Hide splash screen after 2 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (!showSplash) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  return <SplashScreen/>;
}
