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

// Define TypeScript interface for notice data
interface NoticeItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

// Mock data for notices (expanded from HomeScreen)
const noticeBoardData: NoticeItem[] = [
  {
    id: "1",
    title: "Road Closure Alert",
    content: "Main St closed 3/15-3/20 for repairs. Please use alternate routes during this period.",
    date: "2025-03-14",
  },
  {
    id: "2",
    title: "Community Meeting",
    content: "Join us on 3/25 at 7 PM at City Hall to discuss upcoming projects and community concerns.",
    date: "2025-03-20",
  },
  {
    id: "3",
    title: "Water Supply Maintenance",
    content: "Water supply will be interrupted on 3/18 from 9 AM to 2 PM for scheduled maintenance.",
    date: "2025-03-17",
  },
];

export default function NoticeListScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");

  // Filter notices based on title or content
  const filteredNotices: NoticeItem[] = noticeBoardData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.content.toLowerCase().includes(searchValue.toLowerCase())
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
      <Text style={styles.noticeContent}>{item.content}</Text>
      <Text style={styles.noticeDate}>{item.date}</Text>
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
    // borderWidth: 1,
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