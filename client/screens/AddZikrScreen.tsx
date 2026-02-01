import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useApp } from "@/context/AppContext";

type CategoryKey = "general" | "morning" | "evening" | "tasbeeh" | "istighfar" | "custom";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "general", label: "عام" },
  { key: "morning", label: "صبح" },
  { key: "evening", label: "مساء" },
  { key: "tasbeeh", label: "تسبيح" },
  { key: "istighfar", label: "استغفار" },
  { key: "custom", label: "مخصص" },
];

export default function AddZikrScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { addPreset } = useApp();
  const { width } = useWindowDimensions();

  // ✅ Mobile-like layout when previewing on web (doesn't affect native apps)
  const maxW = 420;
  const contentWidth = Math.min(width, maxW);

  const [title, setTitle] = useState("");
  const [zikr, setZikr] = useState("");
  const [target, setTarget] = useState("33");
  const [category, setCategory] = useState<CategoryKey>("custom");
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => {
    const t = parseInt(target, 10);
    return title.trim().length > 0 && Number.isFinite(t) && t > 0;
  }, [title, target]);

  const onSave = () => {
    const t = parseInt(target, 10);

    if (!title.trim()) return setError("أدخل العنوان");
    if (!Number.isFinite(t) || t <= 0) return setError("أدخل رقم صحيح للعدد");

    setError(null);

    // ✅ Save basic fields only (safe with your current Preset type)
    addPreset({
      name: title.trim(),
      text: zikr.trim(),
      target: t,
      color: "#F1C56B",
    } as any);

    navigation.goBack();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header (full width like iOS) */}
      <LinearGradient colors={["#7EC3E6", "#64B5E1"]} style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.headerIconBtn, pressed && { opacity: 0.85 }]}
          hitSlop={12}
        >
          <Feather name="x" size={26} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>إضافة ذكر</Text>

        <View style={styles.headerIconBtn} />
      </LinearGradient>

      {/* Content centered & constrained (mobile feel on web preview) */}
      <View style={styles.centerWrap}>
        <View style={[styles.contentContainer, { width: contentWidth }]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              style={styles.sheet}
              contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.card}>
                <View style={styles.inputRow}>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="العنوان"
                    placeholderTextColor="rgba(17,20,24,0.35)"
                    style={styles.input}
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInput
                    value={zikr}
                    onChangeText={setZikr}
                    placeholder="الذكر"
                    placeholderTextColor="rgba(17,20,24,0.35)"
                    style={styles.input}
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInput
                    value={target}
                    onChangeText={setTarget}
                    placeholder="العدد"
                    placeholderTextColor="rgba(17,20,24,0.35)"
                    style={styles.input}
                    keyboardType="number-pad"
                    textAlign="right"
                  />
                </View>

                <Text style={styles.sectionTitle}>الصنف</Text>

                <View style={styles.chipsWrap}>
                  {CATEGORIES.map((c) => {
                    const active = c.key === category;
                    return (
                      <Pressable
                        key={c.key}
                        onPress={() => setCategory(c.key)}
                        style={({ pressed }) => [
                          styles.chip,
                          active && styles.chipActive,
                          pressed && { opacity: 0.9 },
                        ]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {c.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable
                  onPress={onSave}
                  disabled={!canSave}
                  style={({ pressed }) => [
                    styles.saveBtn,
                    !canSave && { opacity: 0.45 },
                    pressed && canSave && { opacity: 0.9 },
                  ]}
                >
                  <Text style={styles.saveText}>حفظ</Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3F5F8" },

  header: {
    height: 88,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null),
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "900" },

  // ✅ centers the phone-like card on web
  centerWrap: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },

  sheet: { flex: 1, paddingHorizontal: 14, paddingTop: 14 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
  },

  inputRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(17,20,24,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  input: { fontSize: 16, fontWeight: "700", color: "#111418" },

  sectionTitle: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "900",
    color: "#111418",
    textAlign: "center",
  },

  chipsWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#EEF1F5",
  },
  chipActive: { backgroundColor: "#F1C56B" },
  chipText: { fontSize: 14, fontWeight: "900", color: "rgba(17,20,24,0.65)" },
  chipTextActive: { color: "#FFFFFF" },

  error: {
    color: "#D64545",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  saveBtn: {
    marginTop: 4,
    backgroundColor: "#F1C56B",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
});
