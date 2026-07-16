/**
 * Midjourney SREF Code Generator
 *
 * Supports three generation modes:
 * - database: select only from the reviewed SREF database
 * - random: generate unique six-digit identifiers (legacy behavior)
 * - hybrid: combine reviewed database codes with six-digit random identifiers
 */

import {
  getRandomSrefFromDatabase,
  getRandomSrefsFromDatabase,
  SREF_CODES,
} from "@/lib/srefDatabase";

export const RANDOM_SREF_MIN = 100000;
export const RANDOM_SREF_MAX = 999999;

export type SrefGenerationMode = "database" | "random" | "hybrid";
export type SrefCodeSource = "database" | "random";

function countExcludedRandomCodes(excludedCodes: ReadonlySet<string>): number {
  let count = 0;
  for (const code of excludedCodes) {
    if (/^\d{6}$/.test(code)) {
      const value = Number(code);
      if (value >= RANDOM_SREF_MIN && value <= RANDOM_SREF_MAX) {
        count += 1;
      }
    }
  }
  return count;
}

export interface SrefCode {
  code: string;
  weight?: number;
  source?: SrefCodeSource;
}

export interface GeneratedResult {
  codes: SrefCode[];
  command: string;
  mode: SrefGenerationMode;
}

interface SelectedSrefCode {
  code: string;
  source: SrefCodeSource;
}

/**
 * Generate one random six-digit SREF identifier.
 * Optional exclusions are useful for preventing duplicate combinations.
 */
export function generateRandomSref(
  excludedCodes: ReadonlySet<string> = new Set<string>()
): string {
  const rangeSize = RANDOM_SREF_MAX - RANDOM_SREF_MIN + 1;

  if (countExcludedRandomCodes(excludedCodes) >= rangeSize) {
    throw new Error("사용 가능한 임의 SREF 코드가 없습니다.");
  }

  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const code = Math.floor(Math.random() * rangeSize + RANDOM_SREF_MIN).toString();
    if (!excludedCodes.has(code)) {
      return code;
    }
  }

  // Extremely unlikely fallback when repeated random collisions occur.
  for (let value = RANDOM_SREF_MIN; value <= RANDOM_SREF_MAX; value += 1) {
    const code = value.toString();
    if (!excludedCodes.has(code)) {
      return code;
    }
  }

  throw new Error("임의 SREF 코드 생성에 실패했습니다.");
}

/**
 * Generate unique six-digit random SREF identifiers.
 */
export function generateRandomSrefs(
  count: number,
  excludedCodes: ReadonlySet<string> = new Set<string>()
): string[] {
  const safeCount = Math.min(
    Math.max(Math.floor(count), 0),
    RANDOM_SREF_MAX -
      RANDOM_SREF_MIN +
      1 -
      countExcludedRandomCodes(excludedCodes)
  );
  const used = new Set(excludedCodes);
  const codes: string[] = [];

  while (codes.length < safeCount) {
    const code = generateRandomSref(used);
    used.add(code);
    codes.push(code);
  }

  return codes;
}

/**
 * Return one random reviewed SREF code from the database.
 */
export function generateDatabaseSref(): string {
  return getRandomSrefFromDatabase();
}

/**
 * Select codes with source metadata for the requested generation mode.
 */
function selectSrefCodes(
  count: number,
  mode: SrefGenerationMode
): SelectedSrefCode[] {
  const safeCount = Math.max(Math.floor(count), 0);

  if (mode === "database") {
    return getRandomSrefsFromDatabase(safeCount).map((code) => ({
      code,
      source: "database" as const,
    }));
  }

  if (mode === "random") {
    return generateRandomSrefs(safeCount).map((code) => ({
      code,
      source: "random" as const,
    }));
  }

  if (safeCount === 0) {
    return [];
  }

  // With a single requested code, both sources cannot be represented.
  if (safeCount === 1) {
    if (Math.random() < 0.5) {
      return [{ code: generateDatabaseSref(), source: "database" }];
    }
    return [{ code: generateRandomSref(new Set(SREF_CODES)), source: "random" }];
  }

  // Hybrid mode guarantees both sources. For odd counts, DB receives one extra.
  const databaseCount = Math.ceil(safeCount / 2);
  const randomCount = safeCount - databaseCount;
  const databaseCodes = getRandomSrefsFromDatabase(databaseCount);

  // Exclude every reviewed DB entry so a random item is visibly distinct from DB data.
  const randomCodes = generateRandomSrefs(randomCount, new Set(SREF_CODES));
  const selected: SelectedSrefCode[] = [];

  for (let index = 0; index < databaseCount; index += 1) {
    selected.push({ code: databaseCodes[index], source: "database" });
    if (index < randomCodes.length) {
      selected.push({ code: randomCodes[index], source: "random" });
    }
  }

  return selected;
}

/**
 * Return multiple unique codes. Database mode remains the default so existing
 * recommendation features continue using reviewed data.
 */
export function generateMultipleSrefs(
  count: number,
  mode: SrefGenerationMode = "database"
): string[] {
  return selectSrefCodes(count, mode).map((item) => item.code);
}

/**
 * Generate random weights for SREF codes.
 * Weights are typically between 0.5 and 2.0.
 */
export function generateRandomWeights(count: number): number[] {
  const weights: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const weight = Math.round((Math.random() * 1.5 + 0.5) * 10) / 10;
    weights.push(weight);
  }
  return weights;
}

/**
 * Create a Midjourney command string from SREF codes and weights.
 */
export function createSrefCommand(codes: SrefCode[]): string {
  const parts = codes
    .map((item) => {
      if (item.weight && item.weight !== 1) {
        return `${item.code}::${item.weight}`;
      }
      return item.code;
    })
    .join(" ");

  return `--sref ${parts}`;
}

/**
 * Generate a complete SREF combination with optional weights.
 */
export function generateSrefCombination(
  count: number,
  includeWeights: boolean = true,
  mode: SrefGenerationMode = "database"
): GeneratedResult {
  const selectedCodes = selectSrefCodes(count, mode);
  const weights = includeWeights
    ? generateRandomWeights(selectedCodes.length)
    : [];

  const srefCodes: SrefCode[] = selectedCodes.map((item, index) => ({
    code: item.code,
    source: item.source,
    weight: includeWeights ? weights[index] : undefined,
  }));

  return {
    codes: srefCodes,
    command: createSrefCommand(srefCodes),
    mode,
  };
}

/**
 * Validate a numeric SREF identifier.
 * Reviewed source entries have varying digit lengths, including a one-digit code.
 */
export function isValidSref(code: string): boolean {
  return /^\d+$/.test(code.trim());
}

/**
 * Parse a SREF command string and extract codes and weights.
 */
export function parseSrefCommand(command: string): SrefCode[] {
  const match = command.match(/--sref\s+(.+)$/);
  if (!match) return [];

  const parts = match[1].split(/\s+/);
  return parts.map((part) => {
    const [code, weight] = part.split("::");
    return {
      code,
      weight: weight ? parseFloat(weight) : undefined,
    };
  });
}
