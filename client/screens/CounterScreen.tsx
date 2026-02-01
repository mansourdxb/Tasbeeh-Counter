import React, { useMemo } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Share,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

import { useApp } from "@/context/AppContext";

const AR_TITLE: Record<string, string> = {
  "Allahu Akbar": "تكبير",
  SubhanAllah: "تسبيح",
  Alhamdulillah: "تحميد",
  "La ilaha illa Allah": "تهليل",
  Astaghfirullah: "استغفار",
};

const AR_TEXT: Record<string, string> = {
  "Allahu Akbar": "الله أكبر الله أكبر",
  SubhanAllah: "سبحان الله",
  Alhamdulillah: "الحمد لله",
  "La ilaha illa Allah": "لا إله إلا الله",
  Astaghfirullah: "أستغفر الله",
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export default function CounterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

 const {
  currentPreset,
  increment,
  reset,
  deletePreset,
  setCurrentPreset,
} = useApp();


  // Mobile-first container width (helps web look like a phone)
  const maxW = 430;
  const contentWidth = Math.min(width, maxW);

  const name = currentPreset?.name ?? "SubhanAllah";
  const title = AR_TITLE[name] ?? name;
  const dhikrText =
  currentPreset?.text ||
  AR_TEXT[name] ||
  "";


  const count = currentPreset?.count ?? 0;
  const target = currentPreset?.target ?? 33;

  const pct = clamp01(target > 0 ? count / target : 0);

  const ring = useMemo(() => {
    const size = 260;
    const stroke = 18;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = c * pct;
    return { size, stroke, r, c, dash };
  }, [pct]);

 const goToPresets = () => {
  navigation.goBack();
};


  const onClose = () => {
    goToPresets();
  };

  const onShare = async () => {
    try {
      const msg = `${title}\n${dhikrText ? dhikrText + "\n" : ""}${count} / ${target}`;
      await Share.share({ message: msg });
    } catch {}
  };

 const onTrash = () => {
    if (!currentPreset) return;

    const isBuiltIn = Boolean((currentPreset as any).isBuiltIn);

    if (!isBuiltIn) {
      // Logic for Custom Presets (Delete)
      if (Platform.OS === 'web') {
        const confirmed = window.confirm("هل تريد حذف هذا الذكر؟");
        if (confirmed) {
          deletePreset(currentPreset.id);
          goToPresets();
        }
      } else {
        Alert.alert(
          "حذف الذكر",
          "هل تريد حذف هذا الذكر؟",
          [
            { text: "إلغاء", style: "cancel" },
            {
              text: "حذف",
              style: "destructive",
              onPress: () => {
                deletePreset(currentPreset.id);
                goToPresets();
              },
            },
          ],
          { cancelable: true }
        );
      }
    } else {
      // Logic for Built-in Presets (Reset only)
      if (Platform.OS === 'web') {
        const confirmed = window.confirm("هل تريد تصفير العدّاد؟");
        if (confirmed) reset();
      } else {
        Alert.alert(
          "تصفير العدّاد",
          "هل تريد تصفير العدّاد؟",
          [
            { text: "إلغاء", style: "cancel" },
            {
              text: "تصفير",
              style: "destructive",
              onPress: () => reset(),
            },
          ],
          { cancelable: true }
        );
      }
    }
  };

  const handleTap = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    increment();
  };

  return (
    <View style={styles.root}>
      {/* Background */}
      <View style={styles.pageBg} />

      {/* Phone-width container (prevents “web wide” look) */}
      <View style={[styles.phone, { width: contentWidth }]}>
        {/* Header */}
        <LinearGradient
          colors={["#7EC3E6", "#64B5E1"]}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerRow}>
            {/* Left icons */}
            <View style={styles.headerLeft}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [styles.hIconBtn, pressed && { opacity: 0.7 }]}
                hitSlop={10}
              >
                <Feather name="x" size={24} color="#fff" />
              </Pressable>

              <Pressable
                onPress={onShare}
                style={({ pressed }) => [styles.hIconBtn, pressed && { opacity: 0.7 }]}
                hitSlop={10}
              >
                <Feather name="share" size={22} color="#fff" />
              </Pressable>

              <Pressable
                onPress={onTrash}
                style={({ pressed }) => [styles.hIconBtn, pressed && { opacity: 0.7 }]}
                hitSlop={10}
              >
                <Feather name="trash-2" size={22} color="#fff" />
              </Pressable>
            </View>

            {/* Right title */}
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </LinearGradient>

        {/* White card area */}
        <View style={styles.card}>
          <Text style={styles.dhikrText} numberOfLines={2}>
            {dhikrText || " "}
          </Text>

          <View style={styles.ringWrap}>
            <Svg width={ring.size} height={ring.size}>
              <Circle
                cx={ring.size / 2}
                cy={ring.size / 2}
                r={ring.r}
                stroke="#E7EDF4"
                strokeWidth={ring.stroke}
                fill="none"
              />
              <Circle
                cx={ring.size / 2}
                cy={ring.size / 2}
                r={ring.r}
                stroke="#F1C56B"
                strokeWidth={ring.stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${ring.dash} ${ring.c - ring.dash}`}
                rotation={-90}
                originX={ring.size / 2}
                originY={ring.size / 2}
              />
            </Svg>

            <View style={styles.centerText}>
              <Text style={styles.big}>{count}</Text>
              <Text style={styles.from}>من {target}</Text>
            </View>
          </View>

          {/* Big + button */}
          <Pressable
            onPress={handleTap}
            style={({ pressed }) => [styles.plusBtn, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <Text style={styles.plus}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3F5F8" },

  // full-page background (helps on web)
  pageBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F3F5F8" },

  // Center phone container on web; full width on mobile will still look fine
  phone: {
    flex: 1,
    alignSelf: "center",
  },

  header: {
    width: "100%",
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  hIconBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null),
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "right",
    maxWidth: 220,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 22,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  dhikrText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111418",
    textAlign: "center",
    marginBottom: 18,
    paddingHorizontal: 6,
  },

  ringWrap: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  big: {
    fontSize: 56,
    fontWeight: "900",
    color: "#111418",
    lineHeight: 62,
  },
  from: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(17,20,24,0.55)",
  },

  plusBtn: {
    marginTop: 24,
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F1C56B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null),
  },
  plus: {
    fontSize: 50,
    fontWeight: "900",
    color: "#fff",
    marginTop: -2,
  },
});
