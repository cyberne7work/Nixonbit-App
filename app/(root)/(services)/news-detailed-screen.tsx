import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Define TypeScript interface for news data based on API structure
interface NewsItem {
  id: string;
  headline: string;
  content: string;
  source?: string; // Optional, not explicitly in API but assumed
  city: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
  publicationDate: string; // ISO timestamp
  postedBy: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Function to convert ISO timestamp to human-readable format
const formatTimestamp = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(",", " at"); // e.g., "March 21, 2025 at 10:50 AM"
};

export default function NewsDetailedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const news: NewsItem | null = params.news
    ? JSON.parse(params.news as string)
    : null;

  console.log("News data:", news);

  if (!news) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No news details available</Text>
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
          {news.headline}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.newsDetails}>
          <Text style={styles.headline}>{news.headline}</Text>

          {/* Image if available */}
          {news.imageUrl && (
            <Image
              source={{ uri: news.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          {/* Full Content */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Full Story</Text>
            <Text style={styles.content}>{news.content}</Text>
          </View>

          {/* Metadata */}
          <View style={styles.metaContainer}>
            {news.source && (
              <Text style={styles.metaText}>Source: {news.source}</Text>
            )}
            <Text style={styles.metaText}>City: {news.city}</Text>
            <Text style={styles.metaText}>Category: {news.category}</Text>
            <Text style={styles.metaText}>
              Published: {news.isPublished ? "Yes" : "No"}
            </Text>
            <Text style={styles.metaText}>
              Publication Date: {formatTimestamp(news.publicationDate)}
            </Text>
            <Text style={styles.metaText}>
              Posted By: {news.postedBy || "Unknown"}
            </Text>
            <Text style={styles.metaText}>
              Created At: {formatTimestamp(news.createdAt)}
            </Text>
            <Text style={styles.metaText}>
              Updated At: {formatTimestamp(news.updatedAt)}
            </Text>
          </View>
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
    flex: 1, // Ensures header takes available space
    paddingHorizontal: 40, // Prevents overlap with back button
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
  newsDetails: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#3470E4", // Secondary color
  },
  headline: {
    fontSize: 24,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    fontFamily: "Exo-Regular",
    color: "#666",
    lineHeight: 24,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 10,
  },
  metaText: {
    fontSize: 14,
    fontFamily: "Exo-Regular",
    color: "#3470E4", // Secondary color
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Exo-Regular",
    color: "#002045",
    textAlign: "center",
    marginTop: 20,
  },
});