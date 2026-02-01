import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";

export default function App() {
  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.root}>
                <KeyboardProvider>
                  <AppProvider>
                    <NavigationContainer>
                      <RootStackNavigator />
                    </NavigationContainer>
                  </AppProvider>
                  <StatusBar style="auto" />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // On native: normal full screen
  // On web: center a phone frame
  webOuter: {
    flex: 1,
    backgroundColor: "#F3F5F8",
    ...(Platform.OS === "web"
      ? { alignItems: "center", justifyContent: "center" }
      : null),
  },

  // Phone frame (WEB ONLY) — IMPORTANT: clips anything that would exceed borders
  webInner: {
    flex: 1,
    width: "100%",
    ...(Platform.OS === "web"
      ? {
          maxWidth: 460,
          backgroundColor: "#F3F5F8",
          borderRadius: 28,
          overflow: "hidden",
        }
      : null),
  },

  root: {
    flex: 1,
  },
});
