import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import {
  Preset,
  DailyLog,
  AppSettings,
  DEFAULT_PRESETS,
  DEFAULT_SETTINGS,
} from "@/types";

const STORAGE_KEYS = {
  PRESETS: "@tasbih_presets",
  CURRENT_PRESET_ID: "@tasbih_current_preset",
  DAILY_LOGS: "@tasbih_daily_logs",
  SETTINGS: "@tasbih_settings",
  ALL_TIME_TOTAL: "@tasbih_all_time_total",
};

interface AppContextType {
  presets: Preset[];
  currentPreset: Preset | null;
  settings: AppSettings;
  todayTotal: number;
  allTimeTotal: number;
  dailyLogs: DailyLog[];
  isLoading: boolean;
  lastCount: number | null;
  increment: () => void;
  undo: () => void;
  reset: () => void;
  setCurrentPreset: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addPreset: (
    preset: Omit<Preset, "id" | "createdAt" | "count" | "isBuiltIn">
  ) => void;
  updatePreset: (id: string, updates: Partial<Preset>) => void;
  deletePreset: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [currentPresetId, setCurrentPresetId] = useState<string>("subhanallah");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [allTimeTotal, setAllTimeTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCount, setLastCount] = useState<number | null>(null);
  const previousCountRef = useRef<number | null>(null);

  const currentPreset = presets.find((p) => p.id === currentPresetId) || null;

  // ✅ Safe fallback if current preset was deleted / missing
  const resolvedPreset: Preset | null = currentPreset ?? presets[0] ?? null;

  const getTodayDateString = () => new Date().toISOString().split("T")[0];

  const todayLog = dailyLogs.find((log) => log.date === getTodayDateString());
  const todayTotal = todayLog?.total || 0;

  const savePresets = useCallback(async (newPresets: Preset[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PRESETS,
        JSON.stringify(newPresets)
      );
    } catch (error) {
      console.error("Error saving presets:", error);
    }
  }, []);

  const saveDailyLogs = useCallback(async (newLogs: DailyLog[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.DAILY_LOGS,
        JSON.stringify(newLogs)
      );
    } catch (error) {
      console.error("Error saving daily logs:", error);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(newSettings)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }, []);

  const saveAllTimeTotal = useCallback(async (total: number) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ALL_TIME_TOTAL,
        total.toString()
      );
    } catch (error) {
      console.error("Error saving all time total:", error);
    }
  }, []);

  const saveCurrentPresetId = useCallback(async (id: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PRESET_ID, id);
    } catch (error) {
      console.error("Error saving current preset:", error);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [
        presetsData,
        currentPresetData,
        dailyLogsData,
        settingsData,
        allTimeTotalData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PRESETS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PRESET_ID),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.ALL_TIME_TOTAL),
      ]);

      if (presetsData) {
        const parsed: Preset[] = JSON.parse(presetsData);

        // Merge built-ins (keep default fields, but preserve saved counts)
        const merged = DEFAULT_PRESETS.map((defaultPreset) => {
          const saved = parsed.find((p) => p.id === defaultPreset.id);
          return saved ? { ...defaultPreset, count: saved.count } : defaultPreset;
        });

        const customPresets = parsed.filter((p) => !p.isBuiltIn);
        setPresets([...merged, ...customPresets]);
      }

      if (currentPresetData) setCurrentPresetId(currentPresetData);
      if (dailyLogsData) setDailyLogs(JSON.parse(dailyLogsData));
      if (settingsData) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(settingsData) });
      if (allTimeTotalData) setAllTimeTotal(parseInt(allTimeTotalData, 10));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (settings.keepScreenOn) activateKeepAwakeAsync();
    else deactivateKeepAwake();

    return () => {
      deactivateKeepAwake();
    };
  }, [settings.keepScreenOn]);

  // ✅ Auto-fix currentPresetId if it points to a deleted preset
  useEffect(() => {
    if (!currentPreset && presets.length > 0) {
      const nextId = presets[0].id;
      setCurrentPresetId(nextId);
      saveCurrentPresetId(nextId);
    }
  }, [currentPreset, presets, saveCurrentPresetId]);

  const increment = useCallback(() => {
    if (!resolvedPreset) return;

    if (settings.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    previousCountRef.current = resolvedPreset.count;

    const newPresets = presets.map((p) =>
      p.id === resolvedPreset.id ? { ...p, count: p.count + 1 } : p
    );
    setPresets(newPresets);
    savePresets(newPresets);

    setLastCount(resolvedPreset.count + 1);

    const today = getTodayDateString();
    const newLogs = [...dailyLogs];
    const idx = newLogs.findIndex((log) => log.date === today);
    if (idx >= 0) {
      newLogs[idx] = { ...newLogs[idx], total: newLogs[idx].total + 1 };
    } else {
      newLogs.push({ date: today, total: 1 });
    }
    setDailyLogs(newLogs);
    saveDailyLogs(newLogs);

    const newTotal = allTimeTotal + 1;
    setAllTimeTotal(newTotal);
    saveAllTimeTotal(newTotal);

    if (resolvedPreset.count + 1 === resolvedPreset.target && settings.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [
    resolvedPreset,
    presets,
    dailyLogs,
    allTimeTotal,
    settings.hapticEnabled,
    savePresets,
    saveDailyLogs,
    saveAllTimeTotal,
  ]);

  const undo = useCallback(() => {
    if (!resolvedPreset || previousCountRef.current === null || resolvedPreset.count === 0) return;

    if (settings.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const newPresets = presets.map((p) =>
      p.id === resolvedPreset.id ? { ...p, count: Math.max(0, p.count - 1) } : p
    );
    setPresets(newPresets);
    savePresets(newPresets);

    setLastCount(Math.max(0, resolvedPreset.count - 1));

    const today = getTodayDateString();
    const newLogs = dailyLogs.map((log) =>
      log.date === today ? { ...log, total: Math.max(0, log.total - 1) } : log
    );
    setDailyLogs(newLogs);
    saveDailyLogs(newLogs);

    const newTotal = Math.max(0, allTimeTotal - 1);
    setAllTimeTotal(newTotal);
    saveAllTimeTotal(newTotal);

    previousCountRef.current = null;
  }, [
    resolvedPreset,
    presets,
    dailyLogs,
    allTimeTotal,
    settings.hapticEnabled,
    savePresets,
    saveDailyLogs,
    saveAllTimeTotal,
  ]);

  const reset = useCallback(() => {
    if (!resolvedPreset) return;

    if (settings.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    const newPresets = presets.map((p) =>
      p.id === resolvedPreset.id ? { ...p, count: 0 } : p
    );
    setPresets(newPresets);
    savePresets(newPresets);

    setLastCount(0);
    previousCountRef.current = null;
  }, [resolvedPreset, presets, settings.hapticEnabled, savePresets]);

  const setCurrentPreset = useCallback(
    (id: string) => {
      setCurrentPresetId(id);
      saveCurrentPresetId(id);
      previousCountRef.current = null;
    },
    [saveCurrentPresetId]
  );

  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      saveSettings(newSettings);
    },
    [settings, saveSettings]
  );

  const addPreset = useCallback(
    (preset: Omit<Preset, "id" | "createdAt" | "count" | "isBuiltIn">) => {
      const newPreset: Preset = {
        ...preset,
        id: Date.now().toString(),
        count: 0,
        isBuiltIn: false,
        createdAt: new Date().toISOString(),
      };
      const newPresets = [...presets, newPreset];
      setPresets(newPresets);
      savePresets(newPresets);
    },
    [presets, savePresets]
  );

  const updatePreset = useCallback(
    (id: string, updates: Partial<Preset>) => {
      const newPresets = presets.map((p) => (p.id === id ? { ...p, ...updates } : p));
      setPresets(newPresets);
      savePresets(newPresets);
    },
    [presets, savePresets]
  );

  const deletePreset = useCallback(
    (id: string) => {
      const preset = presets.find((p) => p.id === id);
      if (preset?.isBuiltIn) return;

      const newPresets = presets.filter((p) => p.id !== id);
      setPresets(newPresets);
      savePresets(newPresets);

      // ✅ If we deleted the selected preset, switch to the first remaining preset
      if (currentPresetId === id) {
        const nextId = newPresets[0]?.id;
        if (nextId) {
          setCurrentPresetId(nextId);
          saveCurrentPresetId(nextId);
        }
      }
    },
    [presets, currentPresetId, savePresets, saveCurrentPresetId]
  );

  return (
    <AppContext.Provider
      value={{
        presets,
        // ✅ expose resolvedPreset so screens never get null after delete
        currentPreset: resolvedPreset,
        settings,
        todayTotal,
        allTimeTotal,
        dailyLogs,
        isLoading,
        lastCount,
        increment,
        undo,
        reset,
        setCurrentPreset,
        updateSettings,
        addPreset,
        updatePreset,
        deletePreset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
