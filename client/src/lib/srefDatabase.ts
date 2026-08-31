/**
 * Midjourney SREF database compatibility layer.
 *
 * v1.5.0 source flow:
 * data/imports/*.txt -> scripts/build-sref-db.mjs -> client/src/data/sref-database.json
 *
 * Do not hardcode SREF codes in this file. Add TXT files under data/imports instead.
 */

import databaseJson from "@/data/sref-database.json";

export interface SrefOccurrence {
  code: string;
  weight: number | null;
  niji: string | null;
  version: string | null;
  profile: string | null;
  sourceFile: string;
  line: number;
  raw: string;
}

export interface SrefDatabaseRecord {
  code: string;
  occurrences: SrefOccurrence[];
}

export interface SrefDatabaseDocument {
  schemaVersion: number;
  generatedAt: string;
  stats: {
    uniqueCodes: number;
    totalOccurrences: number;
    duplicateOccurrences: number;
    sourceFiles: number;
    weightedOccurrences: number;
    nijiOccurrences: number;
    versionOccurrences: number;
    profileOccurrences: number;
  };
  sources: Array<{
    file: string;
    occurrences: number;
    uniqueCodes: number;
  }>;
  codes: SrefDatabaseRecord[];
}

export const SREF_DATABASE = databaseJson as SrefDatabaseDocument;
export const SREF_RECORDS = SREF_DATABASE.codes;
export const SREF_CODES: readonly string[] = SREF_RECORDS.map((record) => record.code);
export const SREF_DATABASE_SIZE = SREF_CODES.length;

export const SREF_DATABASE_META = {
  source: "data/imports/*.txt",
  generatedAt: SREF_DATABASE.generatedAt,
  reviewedUniqueCodes: SREF_DATABASE_SIZE,
  totalOccurrences: SREF_DATABASE.stats.totalOccurrences,
  duplicateOccurrences: SREF_DATABASE.stats.duplicateOccurrences,
  sourceFiles: SREF_DATABASE.stats.sourceFiles,
} as const;

const SREF_RECORD_MAP = new Map(SREF_RECORDS.map((record) => [record.code, record]));

/** Return metadata and source occurrences for a reviewed code. */
export function getSrefRecord(code: string): SrefDatabaseRecord | undefined {
  return SREF_RECORD_MAP.get(code);
}

/** Return one random code from the reviewed database. */
export function getRandomSrefFromDatabase(): string {
  return SREF_CODES[Math.floor(Math.random() * SREF_CODES.length)];
}

/** Return unique random codes from the reviewed database. */
export function getRandomSrefsFromDatabase(count: number): string[] {
  const safeCount = Math.min(Math.max(Math.floor(count), 0), SREF_CODES.length);
  const pool = [...SREF_CODES];

  // Partial Fisher-Yates shuffle: only shuffle as many positions as needed.
  for (let index = 0; index < safeCount; index += 1) {
    const randomIndex = index + Math.floor(Math.random() * (pool.length - index));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }

  return pool.slice(0, safeCount);
}

/**
 * Create a deterministic, unique selection for a text seed.
 * Keyword recommendations therefore remain stable while using the generated DB.
 */
export function getSeededSrefsFromDatabase(seed: string, count: number): string[] {
  const safeCount = Math.min(Math.max(Math.floor(count), 0), SREF_CODES.length);

  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  const selected: string[] = [];
  const used = new Set<number>();
  let cursor = hash >>> 0;

  while (selected.length < safeCount) {
    cursor = (Math.imul(cursor, 1664525) + 1013904223) >>> 0;
    const databaseIndex = cursor % SREF_CODES.length;

    if (!used.has(databaseIndex)) {
      used.add(databaseIndex);
      selected.push(SREF_CODES[databaseIndex]);
    }
  }

  return selected;
}
