import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/images/nixonbiticon.png")}
        style={styles.logo}
      />
      <Text style={styles.tagline}>"Stay Safe, Stay Ahead."</Text>
      <View style={styles.footer}>
        <View style={styles.memoryContainer}>
          <Text style={styles.memory}>In the memory of Snowden ❤️</Text>
          <Image
            source={require("../../../assets/images/snow.png")}
            style={styles.snow}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginTop: "50%",
  },
  tagline: {
    fontSize: 18,
    fontWeight: "400",
    color: "#333",
    marginLeft: 20,
    fontFamily: "Exo-Regular",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20, // Space at the bottom
  },
  memoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  memory: {
    fontSize: 16,
    color: "#777",
    fontFamily: "Exo-Regular",
  },
  snow: {
    width: 50,
    height: 50,
    marginBottom: 20
  },
});
