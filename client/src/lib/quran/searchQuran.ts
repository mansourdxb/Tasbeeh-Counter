import { quranFiles } from "@/lib/quran/quranFiles";
import { getPageForAyah } from "@/src/lib/quran/mushaf";

export type SearchHit = {
  sura: number;
  aya: number;
  text: string;
  surahName: string;
  page: number;
};

type IndexedAyah = SearchHit & {
  normalized: string;
};

let indexBuilt = false;
let indexedAyat: IndexedAyah[] = [];

const HARAKAT_REGEX = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g;
const TATWEEL_REGEX = /\u0640/g;
const MULTISPACE_REGEX = /\s+/g;

export function normalizeArabic(value: string) {
  return (value || "")
    .replace(HARAKAT_REGEX, "")
    .replace(TATWEEL_REGEX, "")
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(MULTISPACE_REGEX, " ")
    .trim();
}

export async function buildQuranSearchIndexOnce() {
  if (indexBuilt) return;
  const collected: IndexedAyah[] = [];

  quranFiles.forEach((file) => {
    const data: any = file.data ?? {};
    const surahName = data?.surah ?? `سورة ${file.number}`;
    const ayahs = Array.isArray(data?.ayahs) ? data.ayahs : [];
    ayahs.forEach((ayah: any, idx: number) => {
      const aya = ayah?.ayah_number ?? idx + 1;
      const text = String(ayah?.text ?? "").trim();
      if (!text) return;
      collected.push({
        sura: file.number,
        aya,
        text,
        surahName,
        page: getPageForAyah(file.number, aya),
        normalized: normalizeArabic(text),
      });
    });
  });

  indexedAyat = collected;
  indexBuilt = true;
}

export async function searchQuran(query: string, limit = 50): Promise<SearchHit[]> {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery || normalizedQuery.length < 2) return [];
  if (!indexBuilt) await buildQuranSearchIndexOnce();

  const results: SearchHit[] = [];
  for (let i = 0; i < indexedAyat.length; i += 1) {
    const item = indexedAyat[i];
    if (!item.normalized.includes(normalizedQuery)) continue;
    results.push({
      sura: item.sura,
      aya: item.aya,
      text: item.text,
      surahName: item.surahName,
      page: item.page,
    });
    if (results.length >= limit) break;
  }
  return results;
}
