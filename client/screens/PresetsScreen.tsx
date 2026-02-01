import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";


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

function getArabicTitle(name: string) {
  return AR_TITLE[name] ?? name;
}

function getArabicText(name: string) {
  return AR_TEXT[name] ?? "";
}

export default function PresetsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const { presets, setCurrentPreset } = useApp();
  const { width } = useWindowDimensions();

  // Keep your "mobile" feel on web by constraining content width
  const maxW = 460;
  const contentWidth = Math.min(width, maxW);

  const data = useMemo(() => presets, [presets]);

 const onPick = (id: string) => {
  setCurrentPreset(id);
  navigation.navigate("Counter"); // ✅ within the same stack
};


  const onAdd = () => {
    // Change this route name to your actual Add Zikr screen route if different
    // Example: navigation.navigate("AddZikr");
    // If AddZikr is in the Presets stack, this is correct:
    navigation.navigate("AddZikr");
  };

  const renderItem = ({ item }: any) => {
   const title = item.arabicName ?? getArabicTitle(item.name);
const sub = item.text || getArabicText(item.name);



    return (
      <Pressable
        onPress={() => onPick(item.id)}
        style={({ pressed }) => [
          styles.row,
          pressed ? { opacity: 0.85, transform: [{ scale: 0.995 }] } : null,
        ]}
      >
        <View style={styles.leftCircle}>
          <Text style={styles.leftCircleText}>{item.target}</Text>
        </View>

        <View style={styles.rowText}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          {sub ? (
            <Text style={styles.rowSub} numberOfLines={1}>
              {sub}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const ListHeader = () => (
    <View style={[styles.sheet, { width: contentWidth }]}>
      {/* Quote card */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteMarks}>”</Text>
        <Text style={styles.quoteText} numberOfLines={3}>
          خير الإخوان من إذا استغنيت عنه لم يزدك في المودة، وإذا احتجت إليه لم
          ينقصك منها.
        </Text>
        <Text style={styles.quoteBy} numberOfLines={1}>
          علي بن أبي طالب
        </Text>
      </View>
    </View>
  );

  return (
   <View style={styles.root}>

      {/* Header gradient */}
      <LinearGradient
        colors={["#7EC3E6", "#64B5E1"]}
        style={[styles.header, { paddingTop: insets.top }]}

      >
        <View style={[styles.headerRow, { width: contentWidth }]}>
          <Pressable style={styles.headerBtn} onPress={onAdd}>
            <Feather name="plus" size={26} color="white" />
          </Pressable>

          <Text style={styles.headerTitle}>ذكر</Text>
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        style={{ width: contentWidth }}
        
        data={data}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        // ✅ Critical: prevent last row from hiding behind the bottom tab bar
       contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}

        scrollIndicatorInsets={{
          bottom: tabBarHeight,
        }}
        
      />
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
    paddingBottom: 18,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "right",
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null),
  },

  sheet: {
    backgroundColor: "#F3F5F8",
    paddingTop: 14,
  },

  quoteCard: {
    backgroundColor: "#F1C56B",
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 14,
    marginBottom: 14,
  },
  quoteMarks: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "right",
    marginBottom: 4,
  },
  quoteText: {
    color: "white",
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  quoteBy: {
    marginTop: 10,
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "left",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF1F5",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginHorizontal: 14,
    marginBottom: 12,
  },
  leftCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E6EAF0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  leftCircleText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111418",
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111418",
    textAlign: "right",
  },
  rowSub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(17,20,24,0.45)",
    textAlign: "right",
  },
});
