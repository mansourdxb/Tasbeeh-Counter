import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Svg, { Circle } from "react-native-svg";

// Simple icons using text (works everywhere). Later we can swap to @expo/vector-icons.
function IconText({ label }: { label: string }) {
  return <Text style={styles.iconText}>{label}</Text>;
}

type Props = {
  dhikrLabel: string; // e.g. "Allahu Akbar"
  count: number;
  target: number;
  today: number; // unused in this screen style
  allTime: number; // unused in this screen style
  onInc: () => void;
  onUndo: () => void;
  onReset: () => void;
  onOpenPresets: () => void;
  onOpenTarget: () => void;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// Optional mapping to Arabic labels (edit as you like)
const AR_TITLE: Record<string, string> = {
  "Allahu Akbar": "تكبير",
  SubhanAllah: "تسبيح",
  Alhamdulillah: "تحميد",
  "La ilaha illa Allah": "تهليل",
  "Astaghfirullah": "استغفار",
};

const AR_TEXT: Record<string, string> = {
  "Allahu Akbar": "الله اكبر الله اكبر",
  SubhanAllah: "سبحان الله",
  Alhamdulillah: "الحمد لله",
  "La ilaha illa Allah": "لا إله إلا الله",
  Astaghfirullah: "أستغفر الله",
};

export default function PremiumCounterScreen({
  dhikrLabel,
  count,
  target,
  onInc,
  onUndo,
  onReset,
  onOpenPresets,
}: Props) {
  const { width, height } = useWindowDimensions();

  // Keep it "mobile like" even on web
  const maxW = 420;
  const contentWidth = Math.min(width, maxW);

  const pct = clamp01(target > 0 ? count / target : 0);

  const ring = useMemo(() => {
    const size = Math.min(260, contentWidth - 40);
    const stroke = 18;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = c * pct;
    return { size, stroke, r, c, dash };
  }, [contentWidth, pct]);

  const titleAr = AR_TITLE[dhikrLabel] ?? "ذكر";
  const dhikrAr = AR_TEXT[dhikrLabel] ?? dhikrLabel;

  const handlePlus = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onInc();
  };

  const ripple = { color: "rgba(0,0,0,0.06)" };

  return (
    <View style={styles.root}>
      {/* Light header gradient like the screenshot */}
      <LinearGradient
        colors={["#7EC3E6", "#64B5E1"]}
        style={styles.header}
      >
        <View style={[styles.headerRow, { width: contentWidth }]}>
          {/* Left icons */}
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.headerIconBtn}
              onPress={onOpenPresets}
              android_ripple={ripple}
            >
              <IconText label="✕" />
            </Pressable>

            <Pressable style={styles.headerIconBtn} android_ripple={ripple}>
              <IconText label="↗" />
            </Pressable>

            <Pressable
              style={styles.headerIconBtn}
              onPress={onReset}
              android_ripple={ripple}
            >
              <IconText label="🗑" />
            </Pressable>
          </View>

          {/* Right title */}
          <Text style={styles.headerTitle} numberOfLines={1}>
            {titleAr}
          </Text>
        </View>
      </LinearGradient>

      {/* White card area */}
      <View style={[styles.card, { width: contentWidth }]}>
        {/* Dhikr text */}
        <Text style={styles.dhikrText} numberOfLines={2}>
          {dhikrAr}
        </Text>

        {/* Ring + numbers */}
        <View style={styles.ringWrap}>
          <Svg width={ring.size} height={ring.size}>
            {/* Track */}
            <Circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.r}
              stroke={"#E9EEF3"}
              strokeWidth={ring.stroke}
              fill="none"
              strokeLinecap="round"
            />
            {/* Progress */}
            <Circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.r}
              stroke={"#F1C56B"}
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
            <Text style={styles.bigNumber}>{count}</Text>
            <Text style={styles.ofText}>من {target}</Text>
          </View>
        </View>

        {/* Bottom controls row */}
        <View style={styles.bottomRow}>
          <Pressable style={styles.smallBtn} android_ripple={ripple}>
            <IconText label="📳" />
          </Pressable>

          <Pressable style={styles.smallBtn} onPress={onUndo} android_ripple={ripple}>
            <IconText label="−" />
          </Pressable>

          {/* Big + */}
          <Pressable
            style={({ pressed }) => [
              styles.plusBtn,
              pressed ? { transform: [{ scale: 0.98 }] } : null,
            ]}
            onPress={handlePlus}
          >
            <Text style={styles.plusText}>＋</Text>
          </Pressable>

          <Pressable style={styles.smallBtn} onPress={onReset} android_ripple={ripple}>
            <IconText label="↺" />
          </Pressable>

          <Pressable style={styles.smallBtn} android_ripple={ripple}>
            <IconText label="☀" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F3F5F8",
  },

  header: {
    width: "100%",
    paddingTop: 44,
    paddingBottom: 18,
    alignItems: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null),
  },

  iconText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  headerTitle: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "right",
  },

  card: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    alignItems: "center",
  },

  dhikrText: {
    color: "#101418",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 12,
    paddingHorizontal: 18,
  },

  ringWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  bigNumber: {
    fontSize: 78,
    fontWeight: "900",
    color: "#101418",
    lineHeight: 84,
  },

  ofText: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(16,20,24,0.45)",
  },

  bottomRow: {
    width: "100%",
    paddingHorizontal: 22,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  smallBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null),
  },

  plusBtn: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#F1C56B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  plusText: {
    color: "white",
    fontSize: 46,
    fontWeight: "900",
    marginTop: -2,
  },
});
