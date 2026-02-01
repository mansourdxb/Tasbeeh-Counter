import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PresetsScreen from "@/screens/PresetsScreen";
import CounterScreen from "@/screens/CounterScreen";
import AddZikrScreen from "@/screens/AddZikrScreen";

export type PresetsStackParamList = {
  Presets: undefined;
  Counter: undefined;
  AddZikr: undefined;
};

const Stack = createNativeStackNavigator<PresetsStackParamList>();

export default function PresetsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Presets" component={PresetsScreen} />
      <Stack.Screen name="Counter" component={CounterScreen} />
      <Stack.Screen name="AddZikr" component={AddZikrScreen} />
    </Stack.Navigator>
  );
}
