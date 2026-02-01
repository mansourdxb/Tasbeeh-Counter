import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Make sure the file exists at ../screens/SettingsScreen.tsx or ../screens/SettingsScreen/index.tsx
import SettingsScreen from "@/screens/SettingsScreen";

export type SettingsStackParamList = {
  Settings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
