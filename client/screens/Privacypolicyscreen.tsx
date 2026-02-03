import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
type PrivacyPolicyScreenProps = {
  onClose: () => void;
};

export default function PrivacyPolicyScreen({ onClose }: PrivacyPolicyScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors, isDarkMode } = useTheme();

  const maxW = 430;
  const contentWidth = Math.min(width, maxW);
  
  // Dynamic colors
  const sectionBg = isDarkMode ? '#2B2B2B' : '#F3F5F8';
  const titleColor = isDarkMode ? '#FFFFFF' : '#1F2937';
  const textColor = isDarkMode ? 'rgba(255,255,255,0.85)' : '#4B5563';
  const headerGradientColors = colors.headerGradient as [string, string, ...string[]];

  return (
  <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Blue header */}
     <LinearGradient
  colors={headerGradientColors}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerInner, { width: contentWidth }]}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={32} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>سياسة الخصوصية...</Text>
        </View>
      </LinearGradient>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { width: contentWidth, paddingBottom: insets.bottom + 22 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Policy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>سياسة الخصوصية</Text>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <Text style={[styles.sectionHeading, { color: titleColor }]}>مقدمة</Text>
            <Text style={[styles.bodyText, { color: textColor }]}>
              مرحباً بك في تطبيق المسبحة. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
              ستخبرك سياسة الخصوصية هذه بكيفية الحفاظ على بياناتك الشخصية عند استخدامك
              للتطبيق واختياراتك بحقوق الخصوصية الخاصة بك.
            </Text>
          </View>
        </View>

        {/* Information We Collect Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>المعلومات التي نجمعها</Text>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <Text style={[styles.bodyText, { color: textColor }]}>
              نحن نجمع الحد الأدنى من المعلومات الشخصية لتقديم وتحسين خدماتنا. وهذا يشمل:
            </Text>
            <Text style={[styles.bulletText, { color: textColor }]}>
              • بيانات الاستخدام (مثل التفاعل مع ميزات التطبيق)
            </Text>
            <Text style={[styles.bulletText, { color: textColor }]}>
              • معلومات الجهاز (مثل نوع الجهاز، نظام التشغيل)
            </Text>
            <Text style={[styles.bulletText, { color: textColor }]}>
              • بيانات اختيارية إذا اخترت إنشاء حساب
            </Text>
          </View>
        </View>

        {/* How We Use Your Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>كيفية استخدام معلوماتك</Text>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <Text style={[styles.bodyText, { color: textColor }]}>نستخدم معلوماتك لـ:</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• توفير خدماتنا والحفاظ عليها</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• تحسين وتخصيص تجربتك</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>
              • تطوير ميزات جديدة بناءً على كيفية استخدام التطبيق
            </Text>
            <Text style={[styles.bulletText, { color: textColor }]}>
              • إرسال إشعارات تتعلق بنشاطك (فقط بموافقتك)
            </Text>
          </View>
        </View>

        {/* Data Storage Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>تخزين البيانات</Text>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <Text style={[styles.bodyText, { color: textColor }]}>
              يتم تخزين عدد التسابيح والإنجازات والإعدادات الخاصة بك محلياً على جهازك.
              إذا قمت بإنشاء حساب، فقد تتم مزامنة هذه البيانات مع خوادمنا الآمنة لأغراض
              النسخ الاحتياطي وتمكين الوصول متعدد الأجهزة.
            </Text>
          </View>
        </View>

        {/* Data Sharing Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>مشاركة البيانات</Text>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <Text style={[styles.bodyText, { color: textColor }]}>
              نحن لا نبيع معلوماتك الشخصية. قد نشارك البيانات المجمعة المجهولة مع أطراف
              ثالثة لأغراض تحليلية. نلتزم أي خدمات من طرف ثالث نستخدمها بقوانين الخصوصية
              المعمول بها.
            </Text>
          </View>
        </View>

        {/* Your Rights Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>حقوقك</Text>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <Text style={[styles.bodyText, { color: textColor }]}>لديك الحق في:</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• الوصول إلى بياناتك الشخصية</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• طلب تصحيح بياناتك الشخصية</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• طلب حذف بياناتك الشخصية</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• الاعتراض على معالجة بياناتك الشخصية</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• طلب تقييد معالجة بياناتك الشخصية</Text>
            <Text style={[styles.bulletText, { color: textColor }]}>• طلب نقل بياناتك الشخصية</Text>
          </View>
        </View>

        {/* Privacy Policy Changes Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>التغييرات على سياسة الخصوصية</Text>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <Text style={[styles.bodyText, { color: textColor }]}>
              قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات
              من خلال نشر سياسة الخصوصية الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث".
            </Text>
          </View>
        </View>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>آخر تحديث: 1 فبراير 2026</Text>
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
    paddingBottom: 18,
    alignItems: "center",
  },
  headerInner: {
    paddingHorizontal: 18,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    flex: 1,
    marginRight: 12,
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingTop: 14,
    alignSelf: "center",
  },

  section: {
    marginHorizontal: 14,
    marginBottom: 14,
  },
 sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "right",
    marginBottom: 10,
  },
  sectionContent: {
    borderRadius: 18,
    padding: 18,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 12,
  },
 bodyText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: "right",
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "right",
    marginBottom: 6,
  },

  lastUpdated: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "right",
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 20,
  },
});
