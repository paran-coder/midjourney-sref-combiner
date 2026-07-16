/**
 * Custom Presets Management
 * 
 * Allows users to create, save, and manage their own sref code presets
 */

export interface CustomPreset {
  id: string;
  name: string;
  description: string;
  codes: string[];
  weights?: number[];
  command: string;
  createdAt: number;
  updatedAt: number;
}

const CUSTOM_PRESETS_KEY = "sref_custom_presets";
const MAX_CUSTOM_PRESETS = 50;

/**
 * Get all custom presets
 */
export function getCustomPresets(): CustomPreset[] {
  try {
    const data = localStorage.getItem(CUSTOM_PRESETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get custom presets:", error);
    return [];
  }
}

/**
 * Save custom presets to storage
 */
function saveCustomPresets(presets: CustomPreset[]): void {
  try {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error("Failed to save custom presets:", error);
  }
}

/**
 * Create and save a new custom preset
 */
export function createCustomPreset(
  name: string,
  description: string,
  codes: string[],
  command: string,
  weights?: number[]
): CustomPreset {
  const presets = getCustomPresets();

  // Check if name already exists
  if (presets.some((p) => p.name === name)) {
    throw new Error(`"${name}" 이름의 프리셋이 이미 존재합니다.`);
  }

  // Check limit
  if (presets.length >= MAX_CUSTOM_PRESETS) {
    throw new Error(`최대 ${MAX_CUSTOM_PRESETS}개의 프리셋만 저장할 수 있습니다.`);
  }

  const newPreset: CustomPreset = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    codes,
    weights,
    command,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  presets.push(newPreset);
  saveCustomPresets(presets);

  return newPreset;
}

/**
 * Update an existing custom preset
 */
export function updateCustomPreset(
  id: string,
  updates: Partial<Omit<CustomPreset, "id" | "createdAt">>
): CustomPreset | null {
  const presets = getCustomPresets();
  const index = presets.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  presets[index] = {
    ...presets[index],
    ...updates,
    updatedAt: Date.now(),
  };

  saveCustomPresets(presets);
  return presets[index];
}

/**
 * Delete a custom preset
 */
export function deleteCustomPreset(id: string): boolean {
  const presets = getCustomPresets();
  const filtered = presets.filter((p) => p.id !== id);

  if (filtered.length === presets.length) {
    return false; // Not found
  }

  saveCustomPresets(filtered);
  return true;
}

/**
 * Get a custom preset by ID
 */
export function getCustomPresetById(id: string): CustomPreset | undefined {
  return getCustomPresets().find((p) => p.id === id);
}

/**
 * Search custom presets by name or description
 */
export function searchCustomPresets(query: string): CustomPreset[] {
  const lowerQuery = query.toLowerCase();
  return getCustomPresets().filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Duplicate a custom preset
 */
export function duplicateCustomPreset(id: string, newName: string): CustomPreset | null {
  const preset = getCustomPresetById(id);
  if (!preset) {
    return null;
  }

  try {
    return createCustomPreset(
      newName,
      `${preset.description} (복사)`,
      preset.codes,
      preset.command,
      preset.weights
    );
  } catch (error) {
    console.error("Failed to duplicate preset:", error);
    return null;
  }
}

/**
 * Export all custom presets as JSON
 */
export function exportCustomPresets(): string {
  const presets = getCustomPresets();
  return JSON.stringify(presets, null, 2);
}

/**
 * Import custom presets from JSON
 */
export function importCustomPresets(jsonString: string): boolean {
  try {
    const presets = JSON.parse(jsonString);

    if (!Array.isArray(presets)) {
      return false;
    }

    // Validate preset structure
    const isValid = presets.every(
      (p) =>
        p.id &&
        p.name &&
        p.codes &&
        Array.isArray(p.codes) &&
        p.command &&
        typeof p.createdAt === "number"
    );

    if (!isValid) {
      return false;
    }

    const currentPresets = getCustomPresets();
    const merged = [...currentPresets, ...presets].slice(0, MAX_CUSTOM_PRESETS);

    saveCustomPresets(merged);
    return true;
  } catch (error) {
    console.error("Failed to import presets:", error);
    return false;
  }
}

/**
 * Clear all custom presets
 */
export function clearAllCustomPresets(): void {
  saveCustomPresets([]);
}
