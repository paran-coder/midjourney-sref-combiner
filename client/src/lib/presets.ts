/**
 * Style Presets and Categories
 * 
 * Predefined sref code combinations for different artistic styles
 */

export interface StyleCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  presets: StylePreset[];
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  codes: string[];
  weights?: number[];
}

/**
 * Style Categories with Presets
 * These are example sref codes that represent different artistic styles
 */
export const styleCategories: StyleCategory[] = [
  {
    id: "photorealism",
    name: "포토리얼리즘",
    description: "사진처럼 현실적인 이미지",
    icon: "📷",
    presets: [
      {
        id: "portrait-realistic",
        name: "현실적인 초상화",
        description: "자연스러운 조명과 디테일한 초상화",
        codes: ["123456", "234567", "345678"],
        weights: [1.0, 0.8, 0.6],
      },
      {
        id: "landscape-realistic",
        name: "현실적인 풍경",
        description: "자연스러운 풍경과 날씨 표현",
        codes: ["456789", "567890", "678901"],
        weights: [1.2, 0.9, 0.7],
      },
    ],
  },
  {
    id: "animation",
    name: "애니메이션",
    description: "애니메이션 스타일의 이미지",
    icon: "🎨",
    presets: [
      {
        id: "anime-style",
        name: "일본 애니메이션",
        description: "전형적인 일본 애니메이션 스타일",
        codes: ["111111", "222222", "333333"],
        weights: [1.5, 1.0, 0.8],
      },
      {
        id: "cartoon-style",
        name: "만화 스타일",
        description: "밝고 재미있는 만화 스타일",
        codes: ["444444", "555555", "666666"],
        weights: [1.3, 1.1, 0.9],
      },
    ],
  },
  {
    id: "painting",
    name: "회화",
    description: "전통 회화 기법의 이미지",
    icon: "🖼️",
    presets: [
      {
        id: "oil-painting",
        name: "유화",
        description: "클래식한 유화 스타일",
        codes: ["777777", "888888", "999999"],
        weights: [1.2, 1.0, 0.8],
      },
      {
        id: "watercolor",
        name: "수채화",
        description: "부드러운 수채화 스타일",
        codes: ["101010", "111111", "121212"],
        weights: [1.0, 0.9, 0.7],
      },
    ],
  },
  {
    id: "minimalism",
    name: "미니멀리즘",
    description: "단순하고 깔끔한 이미지",
    icon: "⬜",
    presets: [
      {
        id: "minimal-geometric",
        name: "기하학적 미니멀",
        description: "기하학적 형태의 미니멀 디자인",
        codes: ["131313", "141414", "151515"],
        weights: [1.0, 0.8, 0.6],
      },
      {
        id: "minimal-abstract",
        name: "추상 미니멀",
        description: "추상적인 미니멀 표현",
        codes: ["161616", "171717", "181818"],
        weights: [1.1, 0.9, 0.7],
      },
    ],
  },
  {
    id: "3d-render",
    name: "3D 렌더링",
    description: "3D 그래픽 스타일",
    icon: "🎲",
    presets: [
      {
        id: "3d-product",
        name: "3D 제품 렌더링",
        description: "전문적인 제품 렌더링",
        codes: ["191919", "202020", "212121"],
        weights: [1.3, 1.0, 0.8],
      },
      {
        id: "3d-character",
        name: "3D 캐릭터",
        description: "3D 캐릭터 모델링",
        codes: ["222222", "232323", "242424"],
        weights: [1.2, 1.0, 0.9],
      },
    ],
  },
  {
    id: "vintage",
    name: "빈티지",
    description: "복고풍 스타일의 이미지",
    icon: "📼",
    presets: [
      {
        id: "retro-80s",
        name: "80년대 복고",
        description: "80년대 감성의 빈티지 스타일",
        codes: ["252525", "262626", "272727"],
        weights: [1.0, 0.9, 0.8],
      },
      {
        id: "film-noir",
        name: "필름 느와르",
        description: "흑백 필름 느와르 스타일",
        codes: ["282828", "292929", "303030"],
        weights: [1.1, 0.9, 0.7],
      },
    ],
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): StyleCategory | undefined {
  return styleCategories.find((cat) => cat.id === id);
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
  return styleCategories.map((cat) => cat.id);
}

/**
 * Get preset by category and preset ID
 */
export function getPresetByCategoryAndId(
  categoryId: string,
  presetId: string
): StylePreset | undefined {
  const category = getCategoryById(categoryId);
  return category?.presets.find((preset) => preset.id === presetId);
}
