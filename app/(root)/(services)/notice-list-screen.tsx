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
import { apiRequest } from "@/utils/api";

// Define TypeScript interface for notice data
interface NoticeItem {
  id: string;
  title: string;
  description: string;
  city: string;
  postedBy: string | null;
  category: string;
  isActive: boolean;
  expiryDate: string;
  createdAt: string;
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
  }).replace(",", " at"); // e.g., "March 21, 2025 at 10:48 AM"
};

export default function NoticeListScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch notices from API with pagination
  const fetchNotices = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(`/notices/city/Motihari?page=${page}`, 'GET', null);
      console.log("Notices Response:", response);
      const { notices: newNotices, pagination } = response.data;
      
      // Append new notices to existing list if not the first page
      setNotices((prevNotices) => 
        page === 1 ? newNotices : [...prevNotices, ...newNotices]
      );
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error('[ERROR]: Failed to fetch notices:', error);
      setNotices((prevNotices) => prevNotices || []); // Keep existing data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchNotices(1);
  }, []);

  // Load more notices when reaching the end of the list
  const loadMoreNotices = () => {
    if (!isLoading && currentPage < totalPages) {
      fetchNotices(currentPage + 1);
    }
  };

  // Filter notices based on title or description
  const filteredNotices: NoticeItem[] = notices.filter(
    (item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderNoticeItem = ({ item }: { item: NoticeItem }) => (
    <TouchableOpacity
      style={styles.noticeCard}
      onPress={() =>
        router.push({
          pathname: "/(root)/(services)/notice-detailed-screen",
          params: { notice: JSON.stringify(item) },
        })
      }
    >
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeContent}>{item.description}</Text>
      <Text style={styles.noticeDate}>{formatTimestamp(item.createdAt)}</Text>
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
        <Text style={styles.header}>Notice Board</Text>
      </View>
      <CustomTextInput
        label={null}
        placeholder="Search notices by title or content"
        value={searchValue}
        onChangeText={setSearchValue}
        autoCapitalize="none"
        style={styles.search}
      />
      <FlatList
        data={filteredNotices}
        keyExtractor={(item) => item.id}
        renderItem={renderNoticeItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMoreNotices}
        onEndReachedThreshold={0.5} // Trigger loadMoreNotices when 50% from the bottom
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
  search: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  noticeCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderColor: "#3470E4", // Secondary color
  },
  noticeTitle: {
    fontSize: 18,
    fontFamily: "Exo-Bold",
    color: "#002045", // Primary color
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 14,
    fontFamily: "Exo-Regular",
    color: "#666",
    marginBottom: 10,
  },
  noticeDate: {
    fontSize: 12,
    fontFamily: "Exo-Regular",
    color: "#3470E4", // Secondary color
  },
});