import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CustomTextInput } from "@/components/CustomTextInput";

// Define TypeScript interface for news data
interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  date?: string; // Optional: added for consistency with detailed view
  content?: string; // Optional: for detailed view
}

// Mock data for news (expanded from HomeScreen)
const newsData: NewsItem[] = [
  {
    id: "1",
    headline: "New Park Opening",
    summary: "City unveils new park downtown next month.",
    source: "City News",
    date: "2025-03-14",
    content: "The city council has announced the grand opening of a new park in the downtown area, featuring green spaces, playgrounds, and a community garden. The event is scheduled for next month with a ribbon-cutting ceremony.",
  },
  {
    id: "2",
    headline: "Tech Expo 2025",
    summary: "Annual tech expo scheduled for April.",
    source: "Tech Daily",
    date: "2025-03-20",
    content: "Tech Expo 2025 will showcase the latest innovations in AI, robotics, and renewable energy. Held annually, this event attracts thousands of tech enthusiasts and industry leaders from around the globe.",
  },
  {
    id: "3",
    headline: "Local Art Festival",
    summary: "Art festival to celebrate local talent this weekend.",
    source: "Art Weekly",
    date: "2025-03-15",
    content: "This weekend’s art festival will feature local artists, live performances, and interactive workshops. Don’t miss the chance to explore creativity in your community!",
  },
];

export default function NewsListScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");

  // Filter news based on headline or source
  const filteredNews: NewsItem[] = newsData.filter(
    (item) =>
      item.headline.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.source.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() =>
        router.push({
          pathname: "/(root)/(services)/news-detailed-screen",
          params: { news: JSON.stringify(item) },
        })
      }
    >
      <Text style={styles.newsHeadline}>{item.headline}</Text>
      <Text style={styles.newsSummary}>{item.summary}</Text>
      <View style={styles.newsFooter}>
        <Text style={styles.newsSource}>Source: {item.source}</Text>
        {item.date && <Text style={styles.newsDate}>{item.date}</Text>}
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.header}>News & Updates</Text>
      </View>
      <CustomTextInput
        label={null}
        placeholder="Search news by headline or source"
        value={searchValue}
        onChangeText={setSearchValue}
        autoCapitalize="none"
        style={styles.search}
      />
      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
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
  search: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // borderWidth: 1,
    // borderColor: "#3470E4", // Secondary color
  },
  newsHeadline: {
    fontSize: 18,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
    marginBottom: 5,
  },
  newsSummary: {
    fontSize: 14,
    fontFamily: "Exo-Regular",
    color: "#666",
    marginBottom: 10,
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  newsSource: {
    fontSize: 12,
    fontFamily: "Exo-Regular",
    color: "#3470E4", // Secondary color
  },
  newsDate: {
    fontSize: 12,
    fontFamily: "Exo-Regular",
    color: "#3470E4", // Secondary color
  },
});