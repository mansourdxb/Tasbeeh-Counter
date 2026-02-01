import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabKey = "summary" | "calendar" | "achievements";

function SegmentedTabs({
  value,
  onChange,
  width,
}: {
  value: TabKey;
  onChange: (k: TabKey) => void;
  width: number;
}) {
  const items: { key: TabKey; label: string }[] = [
    { key: "summary", label: "الملخص" },
    { key: "calendar", label: "التقويم" },
    { key: "achievements", label: "الإنجازات" },
  ];

  return (
    <View style={[styles.segmentWrap, { width }]}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={({ pressed }) => [
              styles.segmentBtn,
              active ? styles.segmentBtnActive : null,
              pressed ? { opacity: 0.92 } : null,
            ]}
          >
            <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function StatTile({
  icon,
  value,
  label,
}: {
  icon: string; // emoji or simple symbol
  value: number;
  label: string;
}) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // phone-like layout even on web
  const maxW = 430;
  const contentWidth = Math.min(width, maxW);

  const [tab, setTab] = useState<TabKey>("summary");

  // Dummy values (replace later with real data from your store)
  const total = 278;
  const avg = 69;
  const best = 152;

  const week = useMemo(
    () => [
      { day: "الأربعاء", v: 50 },
      { day: "الثلاثاء", v: 150 },
      { day: "الإثنين", v: 30 },
      { day: "الأحد", v: 60 },
      { day: "السبت", v: 10 },
      { day: "الجمعة", v: 5 },
      { day: "الخميس", v: 5 },
    ],
    []
  );

  const dailyGoal = 200;
  const todayDone = 120;
  const goalPct = Math.max(0, Math.min(1, todayDone / dailyGoal));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#7EC3E6", "#64B5E1"]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={[styles.headerInner, { width: contentWidth }]}>
          <Text style={styles.headerTitle}>الإحصائيات</Text>

          <SegmentedTabs value={tab} onChange={setTab} width={contentWidth - 28} />
        </View>
      </LinearGradient>

      <View style={[styles.body, { width: contentWidth, paddingBottom: insets.bottom + 18 }]}>
        {/* Large white sheet */}
        <View style={styles.sheet}>
          {tab === "summary" ? (
            <>
              {/* 3 tiles */}
              <View style={styles.tilesRow}>
                <StatTile icon="🏆" value={best} label="الأفضل" />
                <StatTile icon="📊" value={avg} label="المتوسط" />
                <StatTile icon="∑" value={total} label="المجموع" />
              </View>

              {/* Last 7 days chart card */}
              <Card>
                <Text style={styles.cardTitle}>اخر 7 أيام</Text>

                {/* Simple placeholder chart (replace with real chart later) */}
                <View style={styles.chartArea}>
                  <View style={styles.chartGrid} />
                  <View style={styles.chartLine} />
                </View>

                <View style={styles.daysRow}>
                  {week.map((d) => (
                    <Text key={d.day} style={styles.dayLabel} numberOfLines={1}>
                      {d.day}
                    </Text>
                  ))}
                </View>
              </Card>

              {/* Daily goal */}
              <Card style={{ marginTop: 14 }}>
                <Text style={styles.cardTitle}>الهدف اليومي</Text>

                <View style={styles.goalRow}>
                  <Text style={styles.goalText}>
                    {todayDone} / {dailyGoal}
                  </Text>
                  <Text style={styles.goalHint}>التقدم</Text>
                </View>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${goalPct * 100}%` }]} />
                </View>
              </Card>
            </>
          ) : null}

          {tab === "calendar" ? (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderTitle}>التقويم</Text>
              <Text style={styles.placeholderSub}>سنضيف عرض الأيام/الأشهر هنا لاحقاً.</Text>
            </View>
          ) : null}

          {tab === "achievements" ? (
            <View style={{ paddingTop: 10 }}>
              <Card>
                <AchievementRow
                  title="منضبط يومياً"
                  desc="أكمل تسبيحك اليومي 30 يوماً دون انقطاع"
                  progressText="مكتمل %13"
                  pct={0.13}
                />
                <Divider />
                <AchievementRow
                  title="مسبح مبتدئ"
                  desc="أكمل 1,000 تسبيحة"
                  progressText="مكتمل %27"
                  pct={0.27}
                />
                <Divider />
                <AchievementRow
                  title="مسبح محترف"
                  desc="أكمل 10,000 تسبيحة"
                  progressText="مكتمل %2"
                  pct={0.02}
                />
              </Card>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function AchievementRow({
  title,
  desc,
  progressText,
  pct,
}: {
  title: string;
  desc: string;
  progressText: string;
  pct: number;
}) {
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <View style={styles.achRow}>
      <View style={styles.achTextWrap}>
        <Text style={styles.achTitle}>{title}</Text>
        <Text style={styles.achDesc}>{desc}</Text>

        <View style={styles.achFooter}>
          <Text style={styles.achProgressText}>{progressText}</Text>
          <View style={styles.achTrack}>
            <View style={[styles.achFill, { width: `${clamped * 100}%` }]} />
          </View>
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
    paddingBottom: 16,
    alignItems: "center",
  },
  headerInner: {
    paddingHorizontal: 14,
    alignItems: "flex-end",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "right",
    marginBottom: 10,
  },

  segmentWrap: {
    flexDirection: "row-reverse",
    backgroundColor: "rgba(0,0,0,0.10)",
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
  segmentBtnActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  segmentText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    fontWeight: "800",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },

  body: {
    flex: 1,
    paddingTop: 12,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#F3F5F8",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 16,
    paddingHorizontal: 14,
  },

  tilesRow: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 14,
  },
  statTile: {
    flex: 1,
    backgroundColor: "#EEF1F5",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
    opacity: 0.85,
  },
  statValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#111418",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "800",
    color: "rgba(17,20,24,0.45)",
  },

  card: {
    backgroundColor: "#EEF1F5",
    borderRadius: 22,
    padding: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111418",
    textAlign: "right",
    marginBottom: 10,
  },

  chartArea: {
    height: 180,
    borderRadius: 18,
    backgroundColor: "#F6F8FB",
    overflow: "hidden",
    justifyContent: "center",
  },
  chartGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#AEB8C4",
  },
  chartLine: {
    position: "absolute",
    left: 18,
    right: 18,
    height: 2,
    backgroundColor: "#F1C56B",
    top: 80, // placeholder
    borderRadius: 1,
  },
  daysRow: {
    marginTop: 10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(17,20,24,0.55)",
  },

  goalRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  goalText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111418",
  },
  goalHint: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(17,20,24,0.45)",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "rgba(17,20,24,0.12)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F1C56B",
    borderRadius: 10,
  },

  placeholder: {
    paddingTop: 28,
    alignItems: "center",
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111418",
    marginBottom: 6,
  },
  placeholderSub: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(17,20,24,0.5)",
    textAlign: "center",
    paddingHorizontal: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(17,20,24,0.08)",
    marginVertical: 12,
  },

  achRow: {
    paddingVertical: 8,
  },
  achTextWrap: {
    alignItems: "flex-end",
  },
  achTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111418",
    textAlign: "right",
  },
  achDesc: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(17,20,24,0.55)",
    textAlign: "right",
  },
  achFooter: {
    width: "100%",
    marginTop: 10,
    alignItems: "flex-end",
  },
  achProgressText: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(17,20,24,0.45)",
    textAlign: "right",
    marginBottom: 8,
  },
  achTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(17,20,24,0.12)",
    borderRadius: 10,
    overflow: "hidden",
  },
  achFill: {
    height: "100%",
    backgroundColor: "#F1C56B",
    borderRadius: 10,
  },
});
