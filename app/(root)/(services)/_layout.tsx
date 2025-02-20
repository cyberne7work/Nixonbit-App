import { Stack } from "expo-router";
import "react-native-reanimated";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="servicelist-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="servicelist-detail-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="services"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="lost-and-found-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="add-lost-and-found-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="emergency-alert-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="incident-reporting-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="incident-form-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="incident-details-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="transport-info"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="transport-details-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="weather-update-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="waste-management-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="job-listing-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="explore-detailed-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="medical-assistance-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="medical-assistance-detailed-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="taxi-services-screen"
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="taxi-services-detailed-screen"
      />
    </Stack>
  );
}
