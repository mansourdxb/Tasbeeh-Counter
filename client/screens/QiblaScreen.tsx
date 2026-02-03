import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Animated,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useTheme } from "@/context/ThemeContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { typography } from "@/theme/typography";

export default function QiblaScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { width } = useWindowDimensions();
  const { colors, isDarkMode } = useTheme();

  const maxW = 430;
  const contentWidth = Math.min(width, maxW);
  const headerPadTop = useMemo(() => insets.top + 12, [insets.top]);

  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [heading, setHeading] = useState(0);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState("جاري التحديد...");
  const [magnetometerAvailable, setMagnetometerAvailable] = useState(true);
  
  const compassRotation = new Animated.Value(0);
  const headerGradientColors = colors.headerGradient as [string, string, ...string[]];

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("خطأ", "يرجى السماح بالوصول إلى الموقع لتحديد اتجاه القبلة");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        // Get location name (city)
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          setLocationName(address.city || address.region || "موقعك الحالي");
        }
      } catch (error) {
        console.error("Location error:", error);
        Alert.alert("خطأ", "تعذر الحصول على موقعك");
      }
    })();
  }, []);

  // Calculate Qibla direction
  useEffect(() => {
    if (location) {
      const qibla = calculateQiblaDirection(location.latitude, location.longitude);
      setQiblaDirection(qibla);
    }
  }, [location]);

  // Subscribe to magnetometer
  useEffect(() => {
    let subscription: any;
    
    const startMagnetometer = async () => {
      try {
        // Check if magnetometer is available
        const isAvailable = await Magnetometer.isAvailableAsync();
        
        if (!isAvailable) {
          setMagnetometerAvailable(false);
          Alert.alert(
            "البوصلة غير متوفرة",
            "جهازك لا يدعم البوصلة. سيتم عرض اتجاه القبلة بناءً على موقعك فقط."
          );
          return;
        }

        Magnetometer.setUpdateInterval(100);
        
        subscription = Magnetometer.addListener((data) => {
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          angle = angle < 0 ? angle + 360 : angle;
          setHeading(angle);
        });
      } catch (error) {
        console.error("Magnetometer error:", error);
        setMagnetometerAvailable(false);
      }
    };

    startMagnetometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Calculate angle difference for the compass
  const angleDifference = ((qiblaDirection - heading + 360) % 360);

  // Dynamic colors
  const cardBg = isDarkMode ? '#2B2B2B' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
  const secondaryTextColor = isDarkMode ? 'rgba(255,255,255,0.65)' : '#6B7280';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={headerGradientColors}
        style={[styles.header, { paddingTop: headerPadTop }]}
      >
        <View style={[styles.headerInner, { width: contentWidth }]}>
          <Text style={styles.headerTitle}>اتجاه القبلة</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={{ width: contentWidth }}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
        {/* Location Card */}
        <View style={[styles.locationCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.locationLabel, { color: secondaryTextColor }]}>موقعك الحالي</Text>
          <Text style={[styles.locationText, { color: textColor }]}>{locationName}</Text>
          {location && (
            <Text style={[styles.coordinates, { color: secondaryTextColor }]}>
              {location.latitude.toFixed(4)}°، {location.longitude.toFixed(4)}°
            </Text>
          )}
        </View>

        {/* Compass Container */}
        <View style={styles.compassContainer}>
          {/* Outer Circle with Degree Markings */}
          <View style={[styles.outerCircle, { borderColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
            {/* Degree Markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree) => (
              <View
                key={degree}
                style={[
                  styles.degreeMarker,
                  {
                    transform: [
                      { rotate: `${degree}deg` },
                      { translateY: -135 },
                    ],
                  },
                ]}
              >
                <View style={[styles.markerLine, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
              </View>
            ))}

            {/* Cardinal Directions */}
            <View style={[styles.cardinalDirection, styles.north]}>
              <Text style={[styles.cardinalText, { color: '#EF4444' }]}>N</Text>
            </View>
            <View style={[styles.cardinalDirection, styles.east]}>
              <Text style={[styles.cardinalText, { color: textColor }]}>E</Text>
            </View>
            <View style={[styles.cardinalDirection, styles.south]}>
              <Text style={[styles.cardinalText, { color: textColor }]}>S</Text>
            </View>
            <View style={[styles.cardinalDirection, styles.west]}>
              <Text style={[styles.cardinalText, { color: textColor }]}>W</Text>
            </View>
          </View>

          {/* Rotating Compass with Kaaba Icon */}
          <Animated.View
            style={[
              styles.compassNeedle,
              {
                transform: [{ rotate: `${angleDifference}deg` }],
              },
            ]}
          >
            {/* Kaaba Icon / Pointer */}
            <View style={styles.kaabaContainer}>
              <View style={styles.kaabaIcon}>
                <Text style={styles.kaabaText}>🕋</Text>
              </View>
              <View style={styles.arrow} />
            </View>
          </Animated.View>

          {/* Center Circle */}
          <View style={[styles.centerCircle, { backgroundColor: cardBg }]}>
            <Text style={[styles.degreeText, { color: textColor }]}>
              {Math.round(angleDifference)}°
            </Text>
            <Text style={[styles.degreeLabel, { color: secondaryTextColor }]}>اتجاه القبلة</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.instructionsCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.instructionText, { color: secondaryTextColor }]}>
            📱 قم بتدوير هاتفك حتى تتطابق الأيقونة 🕋 مع الشمال (N) للوصول إلى اتجاه القبلة
          </Text>
        </View>

        {/* Angle Indicator */}
        <View style={[styles.angleCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.angleLabel, { color: secondaryTextColor }]}>زاوية الانحراف</Text>
          <Text style={[styles.angleValue, { color: getAngleColor(angleDifference) }]}>
            {getDirectionText(angleDifference)}
          </Text>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Calculate Qibla direction from user's location
function calculateQiblaDirection(latitude: number, longitude: number): number {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;

  const lat1 = (latitude * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const dLon = ((kaabaLon - longitude) * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  return bearing;
}

// Get color based on angle
function getAngleColor(angle: number): string {
  if (angle < 10 || angle > 350) return '#10B981'; // Green - aligned
  if (angle < 30 || angle > 330) return '#F59E0B'; // Orange - close
  return '#EF4444'; // Red - off
}

// Get direction text
function getDirectionText(angle: number): string {
  if (angle < 10 || angle > 350) return 'متطابق ✓';
  if (angle < 180) return `${Math.round(angle)}° إلى اليمين ←`;
  return `${Math.round(360 - angle)}° إلى اليسار →`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
  },

  header: {
    width: "100%",
    paddingBottom: 18,
    alignItems: "center",
  },
  headerInner: {
    paddingHorizontal: 18,
    alignItems: "center",
  },
  headerTitle: {
    ...typography.screenTitle,
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
  },

  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  locationCard: {
    width: "100%",
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  locationLabel: {
    ...typography.itemSubtitle,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationText: {
    ...typography.itemTitle,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  coordinates: {
    ...typography.numberText,
    fontSize: 13,
    fontWeight: "500",
  },

  compassContainer: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  outerCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
  },

  degreeMarker: {
    position: "absolute",
    width: 2,
    height: 280,
    alignItems: "center",
    left: 139,
    top: 0,
  },
  markerLine: {
    width: 2,
    height: 12,
  },

  cardinalDirection: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  north: { top: -5 },
  east: { right: -5 },
  south: { bottom: -5 },
  west: { left: -5 },
  cardinalText: {
    ...typography.numberText,
    fontSize: 20,
    fontWeight: "900",
  },

  compassNeedle: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  kaabaContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  kaabaIcon: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 25,
  },
  kaabaText: {
    fontSize: 32,
  },
  arrow: {
    width: 0,
    height: 0,
    marginTop: 4,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#10B981",
  },

  centerCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  degreeText: {
    ...typography.numberText,
    fontSize: 24,
    fontWeight: "900",
  },
  degreeLabel: {
    ...typography.itemSubtitle,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  instructionsCard: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  instructionText: {
    ...typography.itemSubtitle,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "500",
  },

  angleCard: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  angleLabel: {
    ...typography.itemSubtitle,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  angleValue: {
    ...typography.numberText,
    fontSize: 20,
    fontWeight: "800",
  },
});
