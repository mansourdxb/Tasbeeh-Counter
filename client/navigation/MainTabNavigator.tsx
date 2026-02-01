import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PresetsStackNavigator from "@/navigation/PresetsStackNavigator";
import StatsStackNavigator from "@/navigation/StatsStackNavigator";
import CalendarStackNavigator from "@/navigation/CalendarStackNavigator";
import SettingsStackNavigator from "@/navigation/SettingsStackNavigator";

export type MainTabParamList = {
  SettingsTab: undefined;
  CalendarTab: undefined;
  StatsTab: undefined;
  PresetsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabBarIcon({
  name,
  focused,
  color,
}: {
  name: keyof typeof Feather.glyphMap;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={styles.tabIconContainer}>
      <Feather name={name} size={22} color={color} />
      {focused ? <View style={styles.activeDot} /> : null}
    </View>
  );
}

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  // Reference-like colors
  const active = "#5EA7D4"; // blue like your screenshots
  const inactive = "rgba(0,0,0,0.35)";

  return (
    <Tab.Navigator
      initialRouteName="PresetsTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
        },
tabBarStyle: {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 14,
  height: 74,
  borderRadius: 24,

  // Make footer blend with screen (no “different background block”)
  // The pill itself is white, but anything outside stays screen color.
  backgroundColor: "#FFFFFF",

  borderTopWidth: 0,
  paddingTop: 6,

  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,

  // Helps keep it inside the phone frame on web
  overflow: "hidden",
},


        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
          ) : null,
      }}
    >
      {/* LEFTMOST (Settings) */}
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          title: "الإعدادات",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="settings" focused={focused} color={color} />
          ),
        }}
      />

      {/* 3rd from RIGHT (Calendar) */}
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStackNavigator}
        options={{
          title: "التقويم",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="calendar" focused={focused} color={color} />
          ),
        }}
      />

      {/* 2nd from RIGHT (Stats) */}
      <Tab.Screen
        name="StatsTab"
        component={StatsStackNavigator}
        options={{
          title: "الإحصائيات",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="bar-chart-2" focused={focused} color={color} />
          ),
        }}
      />

      {/* RIGHTMOST (Presets) */}
      <Tab.Screen
        name="PresetsTab"
        component={PresetsStackNavigator}
        options={{
          title: "ذكر",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="grid" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    backgroundColor: "#5EA7D4",
  },
});
