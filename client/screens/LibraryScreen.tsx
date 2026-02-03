import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { LibraryStackParamList } from "@/navigation/LibraryStackNavigator";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { typography } from "@/theme/typography";

import riyad from "@/constants/library/Riyad_Salheen.json";
import bulugh from "@/constants/library/bulugh_almaram.json";
import adab from "@/constants/library/aladab_almufrad.json";
import qudsi from "@/constants/library/qudsi40.json";

type LibraryTabKey = "quran" | "hadith";

function SegmentedTabs({
  value,
  onChange,
  width,
  colors,
  items,
}: {
  value: LibraryTabKey;
  onChange: (k: LibraryTabKey) => void;
  width: number;
  colors: {
    wrapBg: string;
    activeBg: string;
    text: string;
    textActive: string;
  };
  items: { key: LibraryTabKey; label: string }[];
}) {
  return (
    <View style={[styles.segmentWrap, { width, backgroundColor: colors.wrapBg }]}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={({ pressed }) => [
              styles.segmentBtn,
              active ? { backgroundColor: colors.activeBg } : null,
              pressed ? { opacity: 0.92 } : null,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                typography.sectionTitle,
                { color: colors.text },
                active ? { color: colors.textActive } : null,
              ]}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Card({
  children,
  outerStyle,
  innerStyle,
}: {
  children: React.ReactNode;
  outerStyle?: any;
  innerStyle?: any;
}) {
  return (
    <View style={[styles.cardOuter, outerStyle]}>
      <View style={[styles.cardInner, innerStyle]}>{children}</View>
    </View>
  );
}

function getCount(data: any) {
  if (Array.isArray(data)) return data.length;
  if (!data || typeof data !== "object") return 0;
  if (Array.isArray((data as any).items)) return (data as any).items.length;
  if (Array.isArray((data as any).hadiths)) return (data as any).hadiths.length;
  if (Array.isArray((data as any).ahadith)) return (data as any).ahadith.length;
  if (Array.isArray((data as any).chapters)) return (data as any).chapters.length;
  return Object.keys(data).length;
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { width } = useWindowDimensions();
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<LibraryStackParamList>>();

  const maxW = 430;
  const contentWidth = Math.min(width, maxW);

  const books = useMemo(
    () => [
      { key: "riyad" as const, label: "رياض الصالحين", data: riyad },
      { key: "bulugh" as const, label: "بلوغ المرام", data: bulugh },
      { key: "adab" as const, label: "الأدب المفرد", data: adab },
      { key: "qudsi" as const, label: "الأحاديث القدسية", data: qudsi },
    ],
    []
  );

  const [active, setActive] = useState<LibraryTabKey>("quran");

  const headerGradientColors = colors.headerGradient as [string, string, ...string[]];
  const pageBackground = colors.background;
  const sheetBackground = isDarkMode ? "#0D0F12" : "#F3F5F8";
  const cardOuterBackground = isDarkMode ? "#000000" : "#E7EDF4";
  const cardInnerBackground = isDarkMode ? "#2F2F30" : "#FFFFFF";
  const primaryText = isDarkMode ? "#FFFFFF" : "#111418";
  const secondaryText = isDarkMode ? "rgba(255,255,255,0.65)" : "rgba(17,20,24,0.55)";
  const segmentColors = {
    wrapBg: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
    activeBg: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.18)",
    text: isDarkMode ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.85)",
    textActive: "#FFFFFF",
  };

  return (
    <View style={[styles.root, { backgroundColor: pageBackground }]}>
      <LinearGradient
        colors={headerGradientColors}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerInner, { width: contentWidth }]}>
          <Text style={[styles.headerTitle, typography.screenTitle]}>
            {"المكتبة"}
          </Text>
          <SegmentedTabs
            value={active}
            onChange={setActive}
            width={contentWidth - 28}
            colors={segmentColors}
            items={[
              { key: "quran", label: "القران" },
              { key: "hadith", label: "الحديث" },
            ]}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={{ width: contentWidth }}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sheet, { backgroundColor: sheetBackground }]}>
          {active === "quran" ? (
            <Card
              outerStyle={{ backgroundColor: cardOuterBackground }}
              innerStyle={{ backgroundColor: cardInnerBackground }}
            >
              <Text style={[styles.cardTitle, { color: primaryText }, typography.sectionTitle]}>
                {"القرآن الكريم"}
              </Text>
              <Text style={[styles.cardSub, { color: secondaryText }, typography.itemSubtitle]}>
                {"محتوى القرآن سيتم إضافته هنا."}
              </Text>
            </Card>
          ) : null}

          {active === "hadith" ? (
            <>
                <View style={styles.hadithSectionHeader}>
                  <Pressable
                    onPress={() => navigation.navigate("Favorites")}
                    style={styles.favoritesButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="bookmark" size={18} color="#FFFFFF" />
                  </Pressable>
                  <Text
                    style={[
                      styles.hadithSectionTitle,
                      { color: primaryText },
                      typography.sectionTitle,
                    ]}
                  >
                    {"\u0643\u062a\u0628 \u0627\u0644\u062d\u062f\u064a\u062b \u0627\u0644\u062a\u0633\u0639\u0629"}
                  </Text>
                </View>
              <FlatList
                data={[
                  {
                    id: "bukhari",
                    title_ar: "صحيح البخاري",
                    subtitle_ar:
                      "محمد بن إسماعيل البخاري",
                  },
                  {
                    id: "muslim",
                    title_ar: "صحيح مسلم",
                    subtitle_ar:
                      "مسلم بن الحجاج النيسابوري",
                  },
                  {
                    id: "abudawud",
                    title_ar: "سنن أبي داود",
                    subtitle_ar: "أبو داود السجستاني",
                  },
                  {
                    id: "tirmidhi",
                    title_ar: "جامع الترمذي",
                    subtitle_ar: "أبو عيسى الترمذي",
                  },
                  {
                    id: "nasai",
                    title_ar: "سنن النسائي",
                    subtitle_ar: "أحمد بن شعيب النسائي",
                  },
                  {
                    id: "ibnmajah",
                    title_ar: "سنن ابن ماجه",
                    subtitle_ar: "محمد بن يزيد بن ماجه",
                  },
                  {
                    id: "malik",
                    title_ar: "موطأ الإمام مالك",
                    subtitle_ar: "مالك بن أنس",
                  },
                  {
                    id: "ahmad",
                    title_ar:
                      "مسند الإمام أحمد بن حنبل",
                    subtitle_ar: "أحمد بن حنبل",
                  },
                  {
                    id: "darimi",
                    title_ar: "سنن الدارمي",
                    subtitle_ar:
                      "عبد الله بن عبد الرحمن الدارمي",
                  },
                ]}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.hadithGridRow}
                contentContainerStyle={styles.hadithList}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      if (item.id === "bukhari") {
                        navigation.navigate("BukhariBooks");
                      } else if (item.id === "muslim") {
                        navigation.navigate("MuslimBooks");
                      } else if (item.id === "abudawud") {
                        navigation.navigate("AbuDawudBooks");
                      } else if (item.id === "tirmidhi") {
                        navigation.navigate("TirmidhiBooks");
                      } else if (item.id === "nasai") {
                        navigation.navigate("NasaiBooks");
                      } else if (item.id === "ibnmajah") {
                        navigation.navigate("IbnMajahBooks");
                      } else if (item.id === "malik") {
                        navigation.navigate("MalikBooks");
                      } else if (item.id === "ahmad") {
                        navigation.navigate("AhmedBooks");
                      } else if (item.id === "darimi") {
                        navigation.navigate("DarimiBooks");
                      }
                    }}
                    style={[
                      styles.hadithCardOuter,
                      styles.hadithCardOuterGrid,
                      { backgroundColor: cardOuterBackground },
                    ]}
                  >
                    <View
                      style={[styles.hadithCardInner, { backgroundColor: cardInnerBackground }]}
                    >
                      <Text
                        style={[
                          styles.hadithCardTitle,
                          { color: primaryText },
                          typography.itemTitle,
                        ]}
                      >
                        {item.title_ar}
                      </Text>
                      <Text
                        style={[
                          styles.hadithCardSub,
                          { color: secondaryText },
                          typography.itemSubtitle,
                        ]}
                      >
                        {item.subtitle_ar}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />

              <Card
                outerStyle={{ backgroundColor: cardOuterBackground, marginTop: 12 }}
                innerStyle={{ backgroundColor: cardInnerBackground }}
              >
                <Text style={[styles.cardTitle, { color: primaryText }, typography.sectionTitle]}>
                  {"كتب الحديث المحلية"}
                </Text>
                <Text style={[styles.cardSub, { color: secondaryText }, typography.itemSubtitle]}>
                  {"رياض الصالحين، بلوغ المرام، الأدب المفرد، الأحاديث القدسية"}
                </Text>
                <View style={styles.statRow}>
                  <Text style={[styles.statValue, { color: primaryText }, typography.numberText]}>
                    {books.reduce((acc, b) => acc + getCount(b.data), 0)}
                  </Text>
                  
                </View>
              </Card>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingBottom: 16,
    alignItems: "center",
  },
  headerInner: {
    paddingHorizontal: 14,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  segmentWrap: {
    flexDirection: "row-reverse",
    borderRadius: 18,
    padding: 4,
    alignSelf: "center",
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 16,
    paddingHorizontal: 14,
  },
  cardOuter: {
    borderRadius: 28,
    padding: 10,
    ...(Platform.OS === "web" ? ({ boxShadow: "0 12px 30px rgba(0,0,0,0.12)" } as any) : null),
  },
  cardInner: {
    borderRadius: 22,
    padding: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "right",
  },
  cardSub: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
  statRow: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
  },
  hadithList: {
    gap: 12,
  },
  hadithGridRow: {
    justifyContent: "space-between",
    gap: 12,
  },
  hadithCardOuterGrid: {
    flex: 1,
  },
  hadithSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "right",
    fontFamily: "CairoBold",
  },
  hadithSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
  },
  favoritesButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E8B5A",
  },
  hadithCardOuter: {
    borderRadius: 22,
    padding: 8,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0 10px 24px rgba(0,0,0,0.10)" } as any)
      : null),
  },
  hadithCardInner: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  hadithCardTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  hadithCardSub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridCardOuter: {
    width: "48%",
    borderRadius: 22,
    padding: 8,
    ...(Platform.OS === "web" ? ({ boxShadow: "0 10px 24px rgba(0,0,0,0.10)" } as any) : null),
  },
  gridCardInner: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  gridIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  gridText: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
});

