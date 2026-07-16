/**
 * Midjourney sref Code Generator
 * 
 * Generates random sref codes and combines them with weights
 * sref codes are 6-digit numeric identifiers used by Midjourney
 */

export interface SrefCode {
  code: string;
  weight?: number;
}

export interface GeneratedResult {
  codes: SrefCode[];
  command: string;
}

/**
 * Generate a random 6-digit sref code
 */
export function generateRandomSref(): string {
  return Math.floor(Math.random() * 900000 + 100000).toString();
}

/**
 * Generate multiple random sref codes
 */
export function generateMultipleSrefs(count: number): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateRandomSref());
  }
  return codes;
}

/**
 * Generate random weights for sref codes
 * Weights are typically between 0.5 and 2.0
 */
export function generateRandomWeights(count: number): number[] {
  const weights: number[] = [];
  for (let i = 0; i < count; i++) {
    // Generate weight between 0.5 and 2.0 with 1 decimal place
    const weight = Math.round((Math.random() * 1.5 + 0.5) * 10) / 10;
    weights.push(weight);
  }
  return weights;
}

/**
 * Create Midjourney command string from sref codes and weights
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
 * Generate a complete sref combination with optional weights
 */
export function generateSrefCombination(
  count: number,
  includeWeights: boolean = true
): GeneratedResult {
  const codes = generateMultipleSrefs(count);
  let weights: number[] = [];

  if (includeWeights) {
    weights = generateRandomWeights(count);
  }

  const srefCodes: SrefCode[] = codes.map((code, index) => ({
    code,
    weight: includeWeights ? weights[index] : undefined,
  }));

  return {
    codes: srefCodes,
    command: createSrefCommand(srefCodes),
  };
}

/**
 * Validate if a string is a valid sref code (6 digits)
 */
export function isValidSref(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Parse a sref command string and extract codes and weights
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
