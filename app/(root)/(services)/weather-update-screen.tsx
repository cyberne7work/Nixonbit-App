import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import { getWeather } from "@/utils";

const WeatherUpdateScreen = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeather();
        if (!data) {
          throw new Error("No weather data received");
        }
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError("Failed to fetch weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchWeather();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3470E4" style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#002045" />
        </TouchableOpacity>
        <Text style={styles.header}>Weather Updates</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : weather ? (
          <View style={styles.weatherContainer}>
            <Text style={styles.city}>{weather.city}</Text>
            <Text style={styles.temperature}>{weather.temperature}°C</Text>
            <Text style={styles.description}>{weather.description}</Text>
          </View>
        ) : (
          <Text style={styles.errorText}>No weather data available.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 18,
    fontFamily: "Exo-Regular",
    textAlign: "center",
    color: "#002045",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  weatherContainer: {
    alignItems: "center",
    padding: 20,
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#002045",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#002045",
  },
  description: {
    fontSize: 18,
    fontStyle: "italic",
    marginTop: 10,
    color: "#002045",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#FF0000",
  },
  retryButton: {
    backgroundColor: "#3470E4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    minWidth: 120,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WeatherUpdateScreen;
