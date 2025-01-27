import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ServiceManProfileCard = ({
  profilePic,
  name,
  rating,
  experience,
  phoneNumber,
  onProfilePress,
}) => {
  const handleCallPress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
        Alert.alert("Error", "Unable to make a call.")
      );
    } else {
      Alert.alert("Info", "Phone number not available.");
    }
  };
  return (
    <TouchableOpacity style={styles.card} onPress={onProfilePress}>
      <Image source={{ uri: profilePic }} style={styles.profilePic} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{rating} / 5</Text>
        </View>
        <Text style={styles.experience}>{experience} years of experience</Text>
      </View>
      <TouchableOpacity onPress={handleCallPress}>
        <MaterialIcons
          name="call"
          size={30}
          color={"#3470E4"}
          style={{ marginRight: 15, padding:10 }}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 16,
    marginVertical: 2,
    // borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // elevation: 2,
  },
  profilePic: {
    width: 80,
    height: "100%",
    borderRadius: 5,
    // marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
    // backgroundColor:"red"
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily:"Exo-Bold"
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: "#555",
    fontFamily:"Exo-Regular",

  },
  experience: {
    fontSize: 14,
    color: "#777",
    fontFamily:"Exo-Regular",
  },
});

export default ServiceManProfileCard;
