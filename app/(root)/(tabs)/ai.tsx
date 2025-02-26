import { CustomTextInput } from "@/components/CustomTextInput";
import gpt3 from "@/utils/gpt";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Ai() {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    console.log(message);
    const response = await gpt3(message);
    console.log(response);
  };
  const handleScreenTap = () => {
    // This function will close the screen when tapped outside of input or button
    Keyboard.dismiss(); // Dismiss the keyboard if it's open
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -50 : -50} // Adjust this value to change the space for Android
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>JARVIS</Text>
          <TouchableOpacity
            style={styles.backButton}
            // onPress={() => route.back()}
          >
            <MaterialIcons name="add" size={24} color="#002045" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContainer}>
          {/* <Image
            source={require("../../../assets/images/nixonbiticon.png")}
            style={{ width: 300, height: 200, marginBottom: 10 }}
          /> */}
             <Image
                  source={require("../../../assets/images/nixonbiticon.png")}
                  style={styles.logo}
                />
          <Text style={styles.mainText}>
            Hi User, I am JARVIS, Your personal AI assistant{" "}
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={handleScreenTap}>
          <View style={styles.buttomContainer}>
            <View style={styles.input}>
              <TextInput
                style={styles.inputText}
                onChangeText={(text) => {
                  setMessage(text);
                }}
                value={message}
                placeholder="Type your message here"
                multiline={true}
                placeholderTextColor={"#002045"}
              />
              <TouchableOpacity style={styles.inputButton} onPress={handleSend}>
                <MaterialIcons name="send" size={24} color="#3470E4" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
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
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // Vertically center the icon
  },
  mainContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
  },
  buttomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 60, // Adjust paddingBottom for space when keyboard is not active
  },
  mainText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Exo-Regular",
    color: "#002045",
  },
  button: {
    backgroundColor: "#3470E4",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10, // Add some margin at the bottom to ensure space when keyboard is active
  },
  inputText: {
    width: "90%",
    padding: 10,
    marginTop:10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontFamily: "Exo-Regular",
  },
  inputButton: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
