/**
 * Keyword-based recommendation helper.
 *
 * The UI calls this feature "AI 추천", but the local implementation uses
 * keyword matching and selects codes from the reviewed SREF database.
 */

import { generateMultipleSrefs } from "@/lib/srefGenerator";
import { getSeededSrefsFromDatabase } from "@/lib/srefDatabase";

export interface RecommendationResult {
  codes: string[];
  weights: number[];
  reasoning: string;
}

/**
 * Style keywords mapped to weighting patterns.
 * Code selection itself always comes from the reviewed database.
 */
const styleKeywords: Record<string, number[]> = {
  portrait: [1.2, 0.9, 0.7],
  landscape: [1.1, 0.9, 0.8],
  "3d": [1.3, 1.0, 0.8],
  anime: [1.5, 1.0, 0.8],
  cartoon: [1.3, 1.1, 0.9],
  painting: [1.2, 1.0, 0.8],
  watercolor: [1.0, 0.9, 0.7],
  minimal: [1.0, 0.8, 0.6],
  abstract: [1.1, 0.9, 0.7],
  vintage: [1.0, 0.9, 0.8],
  retro: [1.0, 0.9, 0.8],
  realistic: [1.0, 0.8, 0.6],
  photorealistic: [1.0, 0.8, 0.6],
  warm: [1.1, 0.9, 0.7],
  cool: [1.1, 0.9, 0.7],
  dark: [1.1, 0.9, 0.7],
  bright: [1.2, 1.0, 0.8],
};

/**
 * Generate a recommendation based on the user's description.
 */
export function generateAIRecommendation(description: string): RecommendationResult {
  const lowerDesc = description.toLowerCase();
  const keywords = Object.keys(styleKeywords).filter((keyword) =>
    lowerDesc.includes(keyword)
  );

  if (keywords.length > 0) {
    const selectedKeyword = keywords[0];
    return {
      codes: getSeededSrefsFromDatabase(selectedKeyword, 3),
      weights: styleKeywords[selectedKeyword],
      reasoning: `"${selectedKeyword}" 키워드를 기준으로 검수된 SREF DB에서 조합을 선택했습니다.`,
    };
  }

  return {
    codes: generateMultipleSrefs(3),
    weights: [1.0, 0.8, 0.6],
    reasoning: "검수된 SREF DB에서 무작위 조합을 선택했습니다.",
  };
}

/**
 * Get recommendation suggestions based on partial input.
 */
export function getRecommendationSuggestions(input: string): string[] {
  const lowerInput = input.toLowerCase();
  return Object.keys(styleKeywords)
    .filter((keyword) => keyword.includes(lowerInput) || lowerInput.includes(keyword))
    .slice(0, 5);
}

/**
 * Validate if input is suitable for recommendation.
 */
export function isValidRecommendationInput(input: string): boolean {
  return input.trim().length > 0 && input.length < 200;
}
