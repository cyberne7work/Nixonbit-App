import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { fetchAddressFromGoogle } from "@/utils"; // Ensure this function is implemented properly

export default function IncidentCard({ incident, onEdit, onDelete }) {
  const router = useRouter();
  const [address, setAddress] = useState("Loading address...");

  // Fetch address when the component mounts
  useEffect(() => {
    if (incident.location?.latitude && incident.location?.longitude) {
      fetchAddressFromGoogle(incident.location.latitude, incident.location.longitude)
        .then((addr) => setAddress(addr))
        .catch(() => setAddress("Address unavailable"));
    }
  }, [incident.location]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(root)/(services)/incident-details.screen",
          params: { incident: JSON.stringify({
            title: incident.title,
            description: incident.description,
            type: incident.type,
            address:address,
            date: incident.date,
            location: incident.location,
          }) },
        })
      }
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
            <View style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",  
            }}>
            <Text style={styles.incidentTitle}>{incident.title}</Text>
            <Text style={styles.incidentDate}>
            {incident.date ? new Date(incident.date).toLocaleDateString() : "Unknown Date"}
          </Text>
            </View>
          <Text style={styles.incidentDescription}>{incident.description}</Text>
          <Text style={styles.incidentLocation}>AT: {address}</Text>

          <Text style={styles.incidentType}>Type: {incident.type}</Text>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => onEdit(incident)}>
            <MaterialIcons name="edit" size={24} color="#3470E4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(incident.id)}>
            <MaterialIcons name="delete" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 15,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 16,
    color: "#002045",
    fontFamily: "Exo-Bold",
  },
  incidentDescription: {
    fontSize: 14,
    color: "#FF0000",
    marginVertical: 5,
    fontFamily: "Exo-Regular",
  },
  incidentType: {
    fontSize: 14,
    color: "#3470E4",
    marginVertical: 5,
    fontFamily: "Exo-Regular",
  },
  incidentLocation: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
    fontFamily: "Exo-Regular",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  incidentDate: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Exo-Regular",
  },
});
