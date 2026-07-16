import { useState } from "react";
import { SrefCombiner } from "@/components/SrefCombiner";
import { HistoryPanel } from "@/components/HistoryPanel";
import { StylePresets } from "@/components/StylePresets";
import { CustomPresetManager } from "@/components/CustomPresetManager";
import { ShareAndCompare } from "@/components/ShareAndCompare";
import { AIRecommend } from "@/components/AIRecommend";
import { Zap, Copy, Sparkles, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StylePreset } from "@/lib/presets";
import type { SrefCode } from "@/lib/srefGenerator";

/**
 * Home Page
 * 
 * Main landing page for the Midjourney sref Combiner tool.
 * Features Binance design system with:
 * - Hero section with background
 * - Main sref combiner component
 * - History and favorites
 * - Style presets
 * - Custom presets
 * - AI recommendations
 * - Share and compare features
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState<"generator" | "presets" | "custom" | "ai" | "history">(
    "generator"
  );

  const handlePresetSelect = (preset: StylePreset) => {
    console.log("Selected preset:", preset);
  };

  const handleAIRecommendation = (codes: SrefCode[], command: string) => {
    console.log("AI Recommendation:", { codes, command });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg">
              <span className="text-background font-bold text-lg">M</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground">sref Combiner</h1>
              <p className="text-xs text-muted-foreground">Midjourney Style Reference</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="text-center space-y-4 mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                <Sparkles className="w-4 h-4" />
                AI 기반 스타일 참조 생성기
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                새로운 스타일을 발견하세요
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                미드저니의 스타일 참조 코드를 무작위로 생성하고 조합하여 독특한 창작 영감을 찾아보세요.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <Button
              onClick={() => setActiveTab("generator")}
              variant={activeTab === "generator" ? "default" : "outline"}
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              생성기
            </Button>
            <Button
              onClick={() => setActiveTab("presets")}
              variant={activeTab === "presets" ? "default" : "outline"}
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              프리셋
            </Button>
            <Button
              onClick={() => setActiveTab("custom")}
              variant={activeTab === "custom" ? "default" : "outline"}
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              커스텀
            </Button>
            <Button
              onClick={() => setActiveTab("ai")}
              variant={activeTab === "ai" ? "default" : "outline"}
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI 추천
            </Button>
            <Button
              onClick={() => setActiveTab("history")}
              variant={activeTab === "history" ? "default" : "outline"}
              size="sm"
            >
              <Clock className="w-4 h-4 mr-2" />
              히스토리
            </Button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "generator" && (
              <div className="flex justify-center">
                <SrefCombiner />
              </div>
            )}

            {activeTab === "presets" && (
              <div className="max-w-2xl mx-auto">
                <StylePresets onSelectPreset={handlePresetSelect} />
              </div>
            )}

            {activeTab === "custom" && (
              <div className="max-w-2xl mx-auto">
                <CustomPresetManager />
              </div>
            )}

            {activeTab === "ai" && (
              <div className="max-w-2xl mx-auto">
                <AIRecommend onRecommendation={handleAIRecommendation} />
              </div>
            )}

            {activeTab === "history" && (
              <div className="max-w-2xl mx-auto">
                <HistoryPanel />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-card/30 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-3 text-center group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">무작위 생성</h3>
              <p className="text-sm text-muted-foreground">
                매번 새로운 sref 코드 조합을 생성하여 무한한 창작 가능성을 탐험하세요.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3 text-center group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-all duration-300">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">AI 추천</h3>
              <p className="text-sm text-muted-foreground">
                원하는 스타일을 설명하면 AI가 최적의 sref 코드 조합을 추천해줍니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-3 text-center group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-all duration-300">
                <Copy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">한 번에 복사</h3>
              <p className="text-sm text-muted-foreground">
                생성된 명령어를 클립보드에 복사하여 미드저니에 바로 붙여넣으세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/20 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Midjourney sref Combiner • 스타일 참조 코드 조합 도구</p>
          <p className="mt-2 text-xs">
            이 도구는 미드저니 사용자들을 위해 만들어졌습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
