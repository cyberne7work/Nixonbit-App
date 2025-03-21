import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CustomTextInput } from "@/components/CustomTextInput";
import { useUser } from "@clerk/clerk-expo";
import { apiRequest } from "@/utils/api";

// Define TypeScript interface for news data based on API structure
interface NewsItem {
  id: string;
  headline: string;
  content: string;
  source?: string; // Optional since not explicitly in API response, but assumed
  city: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
  publicationDate: string; // ISO timestamp
  postedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface for pagination metadata
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
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

export default function NewsListScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();

  // Check if the user is authorized to add news
  const isAuthorizedUser = user?.emailAddresses[0].emailAddress === "cyberne7work@gmail.com";

  // Fetch news from API with pagination
  const fetchNews = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(`/news/city/Motihari?page=${page}`, 'GET', null);
      console.log("News Response:", response);
      const { news: newNews, pagination } = response.data;

      // Append new news to existing list if not the first page
      setNews((prevNews) => 
        page === 1 ? newNews : [...prevNews, ...newNews]
      );
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error('[ERROR]: Failed to fetch news:', error);
      setNews((prevNews) => prevNews || []); // Keep existing data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchNews(1);
  }, []);

  // Load more news when reaching the end of the list
  const loadMoreNews = () => {
    if (!isLoading && currentPage < totalPages) {
      fetchNews(currentPage + 1);
    }
  };

  // Filter news based on headline or content (source not always present)
  const filteredNews: NewsItem[] = news.filter(
    (item) =>
      item.headline.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.content.toLowerCase().includes(searchValue.toLowerCase())
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
      <Text style={styles.newsSummary}>{item.content.slice(0, 100) + (item.content.length > 100 ? "..." : "")}</Text>
      <View style={styles.newsFooter}>
        {item.source && <Text style={styles.newsSource}>Source: {item.source}</Text>}
        <Text style={styles.newsDate}>{formatTimestamp(item.publicationDate)}</Text>
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
        {isAuthorizedUser && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(root)/(services)/add-news-screen")}
          >
            <MaterialIcons name="add" size={24} color="#002045" />
          </TouchableOpacity>
        )}
      </View>
      <CustomTextInput
        label={null}
        placeholder="Search news by headline or content"
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
        onEndReached={loadMoreNews}
        onEndReachedThreshold={0.5} // Trigger loadMoreNews when 50% from the bottom
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#3470E4" style={{ marginVertical: 20 }} />
          ) : (
            <View style={{ height: 100 }} />
          )
        }
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
  addButton: {
    position: "absolute",
    right: 10,
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