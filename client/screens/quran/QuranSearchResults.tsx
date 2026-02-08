import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { arabicIndic } from "@/src/lib/quran/mushaf";
import type { SearchHit } from "@/src/lib/quran/searchQuran";
import { quranTheme } from "@/ui/quran/theme";

type Props = {
  results: SearchHit[];
  query: string;
  onSelect: (hit: SearchHit) => void;
  onShowMore?: () => void;
  canShowMore?: boolean;
};

function getSnippet(text: string, query: string) {
  const trimmed = text.trim();
  if (!query) return trimmed.slice(0, 120);
  const idx = trimmed.indexOf(query);
  if (idx < 0) return trimmed.slice(0, 120);
  const start = Math.max(0, idx - 32);
  const end = Math.min(trimmed.length, idx + query.length + 48);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < trimmed.length ? "…" : "";
  return `${prefix}${trimmed.slice(start, end)}${suffix}`;
}

function renderSnippet(snippet: string, query: string) {
  if (!query) return <Text style={styles.snippet}>{snippet}</Text>;
  const idx = snippet.indexOf(query);
  if (idx < 0) return <Text style={styles.snippet}>{snippet}</Text>;
  const before = snippet.slice(0, idx);
  const match = snippet.slice(idx, idx + query.length);
  const after = snippet.slice(idx + query.length);
  return (
    <Text style={styles.snippet}>
      {before}
      <Text style={styles.snippetHighlight}>{match}</Text>
      {after}
    </Text>
  );
}

export default function QuranSearchResults({ results, query, onSelect, onShowMore, canShowMore }: Props) {
  const trimmedQuery = query.trim();
  const list = useMemo(() => results, [results]);

  return (
    <View style={styles.panel}>
      <FlatList
        data={list}
        keyExtractor={(item) => `${item.sura}-${item.aya}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const snippet = getSnippet(item.text, trimmedQuery);
          return (
            <Pressable style={styles.row} onPress={() => onSelect(item)}>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{`${item.surahName} • ${arabicIndic(item.sura)}`}</Text>
                <Text style={styles.metaText}>{`آية ${arabicIndic(item.aya)}`}</Text>
              </View>
              {renderSnippet(snippet, trimmedQuery)}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>لا توجد نتائج</Text>
          </View>
        }
        ListFooterComponent={
          canShowMore && onShowMore ? (
            <Pressable style={styles.showMore} onPress={onShowMore}>
              <Text style={styles.showMoreText}>إظهار المزيد</Text>
            </Pressable>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "rgba(20, 55, 40, 0.85)",
    borderRadius: 18,
    padding: 12,
    maxHeight: 420,
  },
  list: {
    gap: 10,
    paddingBottom: 8,
  },
  row: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 12,
  },
  metaRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaText: {
    color: quranTheme.colors.textOnDark,
    fontFamily: "CairoBold",
    fontSize: 12,
  },
  snippet: {
    color: "#DDE9E1",
    fontFamily: "Cairo",
    fontSize: 13,
    lineHeight: 20,
    writingDirection: "rtl",
    textAlign: "right",
  },
  snippetHighlight: {
    color: "#FDE7B1",
    fontFamily: "CairoBold",
  },
  empty: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#DDE9E1",
    fontFamily: "Cairo",
    fontSize: 14,
  },
  showMore: {
    marginTop: 6,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  showMoreText: {
    color: quranTheme.colors.textOnDark,
    fontFamily: "CairoBold",
    fontSize: 12,
  },
});
