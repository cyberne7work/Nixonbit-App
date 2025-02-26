import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Define TypeScript interface for notice data (reused from list screen)
interface NoticeItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function NoticeDetailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const notice: NoticeItem | null = params.notice
    ? JSON.parse(params.notice as string)
    : null;

  console.log("Notice data:", notice);

  if (!notice) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No notice details available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#F0F2F5" // Near-white background
        barStyle="dark-content" // Dark text/icons for contrast
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header} numberOfLines={1}>
          {notice.title}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.noticeDetails}>
          <Text style={styles.title}>{notice.title}</Text>
          <Text style={styles.content}>{notice.content}</Text>
          <Text style={styles.date}>Date: {notice.date}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5", // Near-white background
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    color: "#002045",
    fontWeight: "bold",
    fontFamily: "Exo-Regular",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  noticeDetails: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // borderWidth: 1,
    borderColor: "#3470E4", // Secondary color
  },
  title: {
    fontSize: 24,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    fontFamily: "Exo-Regular",
    color: "#666",
    marginBottom: 15,
    lineHeight: 24,
  },
  date: {
    fontSize: 14,
    fontFamily: "Exo-Regular",
    color: "#3470E4", // Secondary color
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Exo-Regular",
    color: "#002045",
    textAlign: "center",
    marginTop: 20,
  },
});