import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ServiceCard = ({
  iconName,
  serviceName,
  description,
  price,
  availability,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.card]} onPress={onPress}>
      <MaterialIcons
        name={iconName}
        size={25}
        color={availability ? "#3470E4" : "#3470E4"}
      />
      <Text style={styles.serviceName}>{serviceName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    padding: 5,
    // borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // backgroundColor: "red",
    // margin: 5,
  },
  unavailable: {
    backgroundColor: "#eaeaea",
  },
  serviceName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Exo-Regular",
    color: "#002045",
  },
  description: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginVertical: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  availability: {
    fontSize: 12,
    color: "#0049D4",
    marginTop: 4,
  },
});

export default ServiceCard;
