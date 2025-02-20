import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  multiple = false,
  autoCapitalize
  
}) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          errorMessage && styles.errorBorder,
        ]}
      >

        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          secureTextEntry={isPasswordHidden}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          placeHolderStyle={{
            fontFamily: "Exo-Regular",
          }}
          multiline={multiple}
          autoCapitalize={autoCapitalize}
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
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  toggleIconContainer: {
    marginLeft: 8,
  },
  toggleIcon: {
    fontSize: 16,
    color: "#555",
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
