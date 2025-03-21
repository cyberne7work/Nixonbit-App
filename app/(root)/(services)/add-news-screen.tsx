import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CustomTextInput } from "@/components/CustomTextInput";

export default function AddNewsScreen() {
  const router = useRouter();
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const handleAddNews = () => {
    if (!headline || !summary || !source || !date || !content) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Save the news (you can replace this with your logic to save to a database or state)
    const newNews = {
      id: String(Math.random()), // Generate a unique ID
      headline,
      summary,
      source,
      date,
      content,
    };

    // For now, just log the new news
    console.log("New News Added:", newNews);

    // Navigate back to the NewsListScreen
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#002045" />
          </TouchableOpacity>
          <Text style={styles.header}>Add News</Text>
        </View>

        <CustomTextInput
          label="Headline"
          placeholder="Enter headline"
          value={headline}
          onChangeText={setHeadline}
          style={styles.input}
        />
        <CustomTextInput
          label="Summary"
          placeholder="Enter summary"
          value={summary}
          onChangeText={setSummary}
          style={styles.input}
          multiple={true}
        />
        <CustomTextInput
          label="Source"
          placeholder="Enter source"
          value={source}
          onChangeText={setSource}
          style={styles.input}
        />
        <CustomTextInput
          label="Date"
          placeholder="Enter date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />
        <CustomTextInput
          label="Content"
          placeholder="Enter content"
          value={content}
          onChangeText={setContent}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNews}
        >
          <Text style={styles.addButtonText}>Add News</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002045",
  },
  input: {
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#3470E4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});