/**
 * AI Recommendation System
 * 
 * Generates sref code recommendations based on user input
 */

export interface RecommendationResult {
  codes: string[];
  weights: number[];
  reasoning: string;
}

/**
 * Style keywords mapping to sref code patterns
 */
const styleKeywords: Record<string, { codes: string[]; weights: number[] }> = {
  portrait: { codes: ["123456", "234567", "345678"], weights: [1.2, 0.9, 0.7] },
  landscape: { codes: ["456789", "567890", "678901"], weights: [1.1, 0.9, 0.8] },
  "3d": { codes: ["191919", "202020", "212121"], weights: [1.3, 1.0, 0.8] },
  anime: { codes: ["111111", "222222", "333333"], weights: [1.5, 1.0, 0.8] },
  cartoon: { codes: ["444444", "555555", "666666"], weights: [1.3, 1.1, 0.9] },
  painting: { codes: ["777777", "888888", "999999"], weights: [1.2, 1.0, 0.8] },
  watercolor: { codes: ["101010", "111111", "121212"], weights: [1.0, 0.9, 0.7] },
  minimal: { codes: ["131313", "141414", "151515"], weights: [1.0, 0.8, 0.6] },
  abstract: { codes: ["161616", "171717", "181818"], weights: [1.1, 0.9, 0.7] },
  vintage: { codes: ["252525", "262626", "272727"], weights: [1.0, 0.9, 0.8] },
  retro: { codes: ["252525", "262626", "272727"], weights: [1.0, 0.9, 0.8] },
  realistic: { codes: ["123456", "234567", "345678"], weights: [1.0, 0.8, 0.6] },
  photorealistic: { codes: ["123456", "234567", "345678"], weights: [1.0, 0.8, 0.6] },
  warm: { codes: ["789012", "890123", "901234"], weights: [1.1, 0.9, 0.7] },
  cool: { codes: ["012345", "123456", "234567"], weights: [1.1, 0.9, 0.7] },
  dark: { codes: ["282828", "292929", "303030"], weights: [1.1, 0.9, 0.7] },
  bright: { codes: ["444444", "555555", "666666"], weights: [1.2, 1.0, 0.8] },
};

/**
 * Generate AI recommendation based on user description
 */
export function generateAIRecommendation(description: string): RecommendationResult {
  const lowerDesc = description.toLowerCase();

  // Extract keywords from description
  const keywords = Object.keys(styleKeywords).filter((keyword) =>
    lowerDesc.includes(keyword)
  );

  // If keywords found, use them
  if (keywords.length > 0) {
    const selectedKeyword = keywords[0];
    const recommendation = styleKeywords[selectedKeyword];

    return {
      codes: recommendation.codes,
      weights: recommendation.weights,
      reasoning: `"${selectedKeyword}" 스타일에 맞는 코드 조합을 선택했습니다.`,
    };
  }

  // Default recommendation if no keywords match
  const defaultCodes = [
    Math.floor(Math.random() * 900000 + 100000).toString(),
    Math.floor(Math.random() * 900000 + 100000).toString(),
    Math.floor(Math.random() * 900000 + 100000).toString(),
  ];

  return {
    codes: defaultCodes,
    weights: [1.0, 0.8, 0.6],
    reasoning: "입력하신 설명에 맞는 무작위 코드 조합을 생성했습니다.",
  };
}

/**
 * Get recommendation suggestions based on partial input
 */
export function getRecommendationSuggestions(input: string): string[] {
  const lowerInput = input.toLowerCase();
  return Object.keys(styleKeywords)
    .filter((keyword) => keyword.includes(lowerInput) || lowerInput.includes(keyword))
    .slice(0, 5);
}

/**
 * Validate if input is suitable for recommendation
 */
export function isValidRecommendationInput(input: string): boolean {
  return input.trim().length > 0 && input.length < 200;
}
