import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: [Insert Date]</Text>
        <Text style={styles.sectionHeader}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect personal information such as your name, email address,
          phone number, and other details required for account creation.
        </Text>
        <Text style={styles.sectionHeader}>2. How We Use Your Data</Text>
        <Text style={styles.text}>
          Your data is used to provide core app features, improve app
          functionality, and send notifications about updates.
        </Text>
        <Text style={styles.sectionHeader}>3. Data Sharing</Text>
        <Text style={styles.text}>
          We do not sell your data. We may share data with trusted partners to
          provide services, but only in compliance with applicable laws.
        </Text>
        <Text style={styles.sectionHeader}>4. Data Security</Text>
        <Text style={styles.text}>
          User data is encrypted during transmission and storage, and we comply
          with data protection laws.
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
