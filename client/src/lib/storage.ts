/**
 * Local Storage Management
 * 
 * Manages user history, favorites, and preferences
 */

export interface SavedCombination {
  id: string;
  codes: string[];
  weights?: number[];
  command: string;
  timestamp: number;
  label?: string;
  isFavorite: boolean;
}

export interface StorageData {
  history: SavedCombination[];
  favorites: SavedCombination[];
  preferences: {
    includeWeights: boolean;
    defaultCodeCount: number;
  };
}

const STORAGE_KEY = "sref_combiner_data";
const MAX_HISTORY = 50;

/**
 * Initialize storage with default values
 */
function initializeStorage(): StorageData {
  return {
    history: [],
    favorites: [],
    preferences: {
      includeWeights: true,
      defaultCodeCount: 2,
    },
  };
}

/**
 * Get all storage data
 */
export function getStorageData(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initializeStorage();
  } catch (error) {
    console.error("Failed to get storage data:", error);
    return initializeStorage();
  }
}

/**
 * Save storage data
 */
function saveStorageData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save storage data:", error);
  }
}

/**
 * Add combination to history
 */
export function addToHistory(
  codes: string[],
  command: string,
  weights?: number[],
  label?: string
): SavedCombination {
  const data = getStorageData();
  const combination: SavedCombination = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    codes,
    weights,
    command,
    timestamp: Date.now(),
    label,
    isFavorite: false,
  };

  data.history.unshift(combination);
  
  // Keep only recent 50 items
  if (data.history.length > MAX_HISTORY) {
    data.history = data.history.slice(0, MAX_HISTORY);
  }

  saveStorageData(data);
  return combination;
}

/**
 * Get history
 */
export function getHistory(): SavedCombination[] {
  return getStorageData().history;
}

/**
 * Add combination to favorites
 */
export function addToFavorites(
  codes: string[],
  command: string,
  weights?: number[],
  label?: string
): SavedCombination {
  const data = getStorageData();
  const combination: SavedCombination = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    codes,
    weights,
    command,
    timestamp: Date.now(),
    label,
    isFavorite: true,
  };

  data.favorites.push(combination);
  saveStorageData(data);
  return combination;
}

/**
 * Get favorites
 */
export function getFavorites(): SavedCombination[] {
  return getStorageData().favorites;
}

/**
 * Remove from favorites
 */
export function removeFromFavorites(id: string): void {
  const data = getStorageData();
  data.favorites = data.favorites.filter((item) => item.id !== id);
  saveStorageData(data);
}

/**
 * Remove from history
 */
export function removeFromHistory(id: string): void {
  const data = getStorageData();
  data.history = data.history.filter((item) => item.id !== id);
  saveStorageData(data);
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  const data = getStorageData();
  data.history = [];
  saveStorageData(data);
}

/**
 * Update preferences
 */
export function updatePreferences(preferences: Partial<StorageData["preferences"]>): void {
  const data = getStorageData();
  data.preferences = { ...data.preferences, ...preferences };
  saveStorageData(data);
}

/**
 * Get preferences
 */
export function getPreferences(): StorageData["preferences"] {
  return getStorageData().preferences;
}

/**
 * Export data as JSON
 */
export function exportData(): string {
  const data = getStorageData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.history && data.favorites && data.preferences) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to import data:", error);
    return false;
  }
}
