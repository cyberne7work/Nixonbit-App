import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ListItem = ({ name, onPress }) => {
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View style={styles.categoryRow}>
        <View style={styles.leftContent}>
          <MaterialIcons name="folder-open" size={25} color={"#3470E4"} />
          <Text style={styles.categoryText}>{name}</Text>
        </View>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={25}
          color={"#3470E4"}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 1,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 14,
    color: "#002045",
    fontFamily: "Exo-Regular",
    marginLeft: 10, // Add spacing between the icon and text
  },
});

export default ListItem;
