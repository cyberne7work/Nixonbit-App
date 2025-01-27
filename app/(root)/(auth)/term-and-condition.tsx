import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last Updated: [Insert Date]</Text>
        <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing or using Nixonbit, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service, as well
          as our Privacy Policy.
        </Text>
        <Text style={styles.sectionHeader}>2. App Overview</Text>
        <Text style={styles.text}>
          Nixonbit, developed by Nixonbit Pvt. Ltd., provides features such as
          safety and security tools, real-time incident reporting, safe route
          suggestions, a local directory, transport information, and additional
          community-driven features.
        </Text>
        <Text style={styles.sectionHeader}>3. User Accounts</Text>
        <Text style={styles.text}>
          Users must create an account to access certain features of the app
          and provide accurate and truthful information.
        </Text>
        <Text style={styles.sectionHeader}>4. Privacy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. By using the app, you agree to our
          Privacy Policy.
        </Text>
        {/* Add remaining sections similarly */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#002045",
    fontFamily: "Exo-Bold",
  },
  lastUpdated: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Exo-Regular",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#002045",
    fontFamily: "Exo-Bold",
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    fontFamily: "Exo-Regular",
    lineHeight: 20,
  },
});
