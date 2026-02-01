import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function clamp0(n: number) {
  return n < 0 ? 0 : n;
}

function getCountdown(target: Date): Countdown {
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const totalSec = clamp0(Math.floor(diffMs / 1000));

  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { days, hours, minutes, seconds };
}

function TimeCell({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.timeCell}>
      <Text style={styles.timeValue}>{String(value).padStart(2, "0")}</Text>
      <Text style={styles.timeLabel}>{label}</Text>
    </View>
  );
}

function CountdownCard({
  title,
  subtitle,
  target,
}: {
  title: string;
  subtitle: string;
  target: Date;
}) {
  const [cd, setCd] = useState<Countdown>(() => getCountdown(target));

  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown(target)), 1000);
    return () => clearInterval(t);
  }, [target]);

  const dateStr = `${target.getFullYear()}/${String(target.getMonth() + 1).padStart(2, "0")}/${String(
    target.getDate()
  ).padStart(2, "0")}`;

  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardInner}>
        <View style={styles.cardTopRow}>
          <Text style={styles.moonIcon}>🌙</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.timeRow}>
          <TimeCell value={cd.seconds} label="ثانية" />
          <TimeCell value={cd.minutes} label="دقيقة" />
          <TimeCell value={cd.hours} label="ساعة" />
          <TimeCell value={cd.days} label="يوم" />
        </View>

        <Text style={styles.dateText}>{dateStr}</Text>

        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Keep phone-like layout even on web
  const maxW = 430;
  const contentWidth = Math.min(width, maxW);

  // ✅ Replace these with your real dates (or compute from Hijri later)
  // For now, using upcoming example dates:
  const ramadanTarget = useMemo(() => {
    // Example: Feb 18, 2026 (matches your screenshot format)
    return new Date(2026, 1, 18, 0, 0, 0);
  }, []);

  const lastTenTarget = useMemo(() => {
    // Example: 10 days after Ramadan start (placeholder)
    const d = new Date(ramadanTarget);
    d.setDate(d.getDate() + 10);
    return d;
  }, [ramadanTarget]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#4C6F80", "#3D5E6D"]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerInner, { width: contentWidth }]}>
          <Text style={styles.headerTitle}>المواعيد الإسلامية</Text>
        </View>
      </LinearGradient>

      <View style={[styles.body, { width: contentWidth, paddingBottom: insets.bottom + 18 }]}>
        <View style={styles.sheet}>
          <CountdownCard
            title="رمضان"
            subtitle="العد التنازلي لرمضان"
            target={ramadanTarget}
          />

          <View style={{ height: 16 }} />

          <CountdownCard
            title="العشر الأواخر"
            subtitle="العد التنازلي للعشر الأواخر"
            target={lastTenTarget}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0D0F12",
    alignItems: "center",
  },

  header: {
    width: "100%",
    paddingBottom: 18,
    alignItems: "center",
  },
  headerInner: {
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "right",
  },

  body: {
    flex: 1,
    paddingTop: 12,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#0D0F12",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 18,
    paddingHorizontal: 14,
  },

  cardOuter: {
    backgroundColor: "#000000",
    borderRadius: 28,
    padding: 10,
    ...(Platform.OS === "web" ? ({ boxShadow: "0 12px 40px rgba(0,0,0,0.35)" } as any) : null),
  },
  cardInner: {
    backgroundColor: "#2F2F30",
    borderRadius: 22,
    padding: 18,
  },
  cardTopRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moonIcon: {
    fontSize: 22,
    opacity: 0.9,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "right",
  },
  cardDivider: {
    marginTop: 12,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  timeRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeCell: {
    width: "23%",
    alignItems: "center",
  },
  timeValue: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  timeLabel: {
    marginTop: 6,
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    fontWeight: "800",
  },

  dateText: {
    marginTop: 16,
    color: "rgba(255,255,255,0.55)",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "left",
  },

  cardSubtitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
});
