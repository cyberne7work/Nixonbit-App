import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function EventCard({ type, eventTitle, location,image,onPress }) {
  return (
    <View style={styles.card}>
      {/* Date Badge */}
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>{type}</Text>
      </View>

      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder}>
        <Image
          source={{ uri: image }} // Placeholder image
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Event Details */}
      <View style={styles.details}>
        <Text style={styles.eventTitle}>{eventTitle}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.type}>{type}</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Explore</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width:275,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 2,
    marginVertical: 8,
    marginRight:10
  },
  dateBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#3470E4",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dateText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "Exo-Regular",

  },
  imagePlaceholder: {
    backgroundColor: "#E7F0FE",
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  details: {
    marginBottom: 16,
    fontFamily: "Exo-Regular",

  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Exo-Bold",
  },
  location: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Exo-Regular",
  },
  type:{
    fontFamily: "Exo-Regular",
    color:"#3470E4"
  },
  button: {
    borderWidth: 1,
    borderColor: "#3470E4",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#3470E4",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Exo-Regular",
  },
});
