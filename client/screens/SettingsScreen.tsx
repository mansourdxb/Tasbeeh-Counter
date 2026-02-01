import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RowProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
};

function CardRow({ title, subtitle, right, onPress }: RowProps) {
  const Container: any = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={({ pressed }: any) => [
        styles.row,
        onPress ? (pressed ? { opacity: 0.92 } : null) : null,
      ]}
    >
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>

      <View style={styles.rowRight}>{right}</View>
    </Container>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Keeps it “phone-like” even on web
  const maxW = 430;
  const contentWidth = Math.min(width, maxW);

  const [vibration, setVibration] = useState(true);
  const [sound, setSound] = useState(false);

  const headerPadTop = useMemo(() => insets.top + 12, [insets.top]);

  return (
    <View style={styles.root}>
      {/* Blue header like reference */}
      <LinearGradient
        colors={["#7EC3E6", "#64B5E1"]}
        style={[styles.header, { paddingTop: headerPadTop }]}
      >
        <View style={[styles.headerInner, { width: contentWidth }]}>
          <Text style={styles.headerTitle}>الإعدادات</Text>
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={[styles.body, { width: contentWidth, paddingBottom: insets.bottom + 22 }]}>
        {/* Card: counter feedback */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>تعليقات العداد</Text>

          <CardRow
            title="الاهتزاز"
            right={
              <Switch
                value={vibration}
                onValueChange={setVibration}
                trackColor={{ false: "#5b5b5b", true: "#7EC3E6" }}
                thumbColor={"#ffffff"}
              />
            }
          />

          <View style={styles.divider} />

          <CardRow
            title="الصوت"
            subtitle="تشغيل الصوت أثناء العد"
            right={
              <Switch
                value={sound}
                onValueChange={setSound}
                trackColor={{ false: "#5b5b5b", true: "#7EC3E6" }}
                thumbColor={"#ffffff"}
              />
            }
          />

          <View style={styles.divider} />

          <CardRow
            title="خيارات الصوت"
            subtitle="الحالي: هادئ"
            onPress={() => {
              // later: open a modal/picker
            }}
            right={<Feather name="chevron-left" size={20} color="rgba(255,255,255,0.65)" />}
          />
        </View>

        {/* Card: notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>الإشعارات</Text>

          <CardRow
            title="تفعيل الإشعارات"
            subtitle="اضغط للتفعيل"
            onPress={() => {
              // later: request permissions
            }}
            right={<Feather name="bell-off" size={18} color="rgba(255,255,255,0.65)" />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#E9EFF5",
    alignItems: "center",
  },

  header: {
    width: "100%",
    paddingBottom: 18,
    alignItems: "center",
  },
  headerInner: {
    paddingHorizontal: 18,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "right",
  },

  body: {
    flex: 1,
    paddingTop: 14,
  },

  card: {
    backgroundColor: "#2B2B2B",
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 14,
    marginBottom: 14,
    // soft shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "right",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    paddingLeft: 12,
  },
  rowTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
  },
  rowSub: {
    marginTop: 4,
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  rowRight: {
    minWidth: 52,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
});
