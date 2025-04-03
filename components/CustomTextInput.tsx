import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const CustomTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  errorMessage = "",
  showToggleIcon = false,
  keyboardType = "default",
  maxLength = 50,
  style = {},
  multiline = false, // Changed from 'multiple' to 'multiline'
  autoCapitalize,
}) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineInputContainer, // Added conditional styling
          errorMessage && styles.errorBorder,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.multilineInput, style]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          secureTextEntry={isPasswordHidden}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
          textAlignVertical={multiline ? "top" : "center"} // Align text to top for multiline
        />
        {showToggleIcon && secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            style={styles.toggleIconContainer}
          >
            <MaterialIcons
              name={isPasswordHidden ? "visibility" : "visibility-off"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 17,
    color: "#002045",
    marginBottom: 8,
    fontFamily: "Exo-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    // borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48, // Default height for single-line inputs
  },
  multilineInputContainer: {
    height: 'auto', // Remove fixed height for multiline
    minHeight: 120, // Minimum height for multiline
    alignItems: "flex-start", // Align content to top for multiline
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  multilineInput: {
    minHeight: 120, // Ensure input can grow
    paddingTop: 10,
    paddingBottom: 10,
  },
  toggleIconContainer: {
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    color: "red",
    fontSize: 12,
  },
  errorBorder: {
    borderColor: "red",
  },
});