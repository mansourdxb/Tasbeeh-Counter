import AsyncStorage from "@react-native-async-storage/async-storage";

export const HADITH_FAVORITES_KEY = "@hadith/favorites";
export const HADITH_FAVORITES_ITEMS_KEY = "@hadith/favorites_items";

export type FavoritesMap = Record<string, true>;
export type FavoriteItem = {
  bookId: string;
  chapterId: number | string | undefined;
  idInBook: number | string | undefined;
  bookTitle: string;
  chapterTitle: string;
  arabicText: string;
  savedAt: number;
};
export type FavoriteItemsMap = Record<string, FavoriteItem>;

export function getFavoriteId(
  bookId: string,
  chapterId: number | string | undefined,
  hadithId: number | string | undefined
) {
  return `${bookId}:${chapterId ?? "0"}:${hadithId ?? "0"}`;
}

export async function loadFavorites(): Promise<FavoritesMap> {
  const raw = await AsyncStorage.getItem(HADITH_FAVORITES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as FavoritesMap;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export async function saveFavorites(map: FavoritesMap) {
  await AsyncStorage.setItem(HADITH_FAVORITES_KEY, JSON.stringify(map));
}

export async function loadFavoriteItems(): Promise<FavoriteItemsMap> {
  const raw = await AsyncStorage.getItem(HADITH_FAVORITES_ITEMS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as FavoriteItemsMap;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export async function saveFavoriteItems(map: FavoriteItemsMap) {
  await AsyncStorage.setItem(HADITH_FAVORITES_ITEMS_KEY, JSON.stringify(map));
}
