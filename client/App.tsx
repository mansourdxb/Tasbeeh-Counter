import React, { useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { useFonts } from "expo-font";
import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import { Cairo_400Regular, Cairo_700Bold } from "@expo-google-fonts/cairo";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";

// Keep splash visible until we manually hide it
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Amiri: Amiri_400Regular,
    AmiriBold: Amiri_700Bold,
    Cairo: Cairo_400Regular,
    CairoBold: Cairo_700Bold,

    // ✅ Quran Uthmani font (use the file you already have)
    KFGQPCUthmanicScript: require("./assets/fonts/uthmanic_hafs_v20.ttf"),
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!fontsLoaded) return;
      } finally {
        if (!mounted) return;
        if (!fontsLoaded) return;

        setReady(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fontsLoaded]);

  // While splash is showing, render nothing
  if (!ready) return null;

  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.root}>
                <KeyboardProvider>
                  <ThemeProvider>
                    <AppProvider>
                      <NavigationContainer>
                        <RootStackNavigator />
                      </NavigationContainer>
                    </AppProvider>
                    <StatusBar style="auto" />
                  </ThemeProvider>
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

  // Phone frame (WEB ONLY) — clips anything that would exceed borders
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
