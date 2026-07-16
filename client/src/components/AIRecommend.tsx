import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  generateAIRecommendation,
  getRecommendationSuggestions,
  isValidRecommendationInput,
} from "@/lib/aiRecommend";
import { createSrefCommand, type SrefCode } from "@/lib/srefGenerator";

interface AIRecommendProps {
  onRecommendation?: (codes: SrefCode[], command: string) => void;
}

/**
 * AIRecommend Component
 * 
 * AI-powered recommendation system for sref codes
 */
export function AIRecommend({ onRecommendation }: AIRecommendProps) {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.length > 0) {
      const sug = getRecommendationSuggestions(value);
      setSuggestions(sug);
    } else {
      setSuggestions([]);
    }
  };

  const handleRecommend = () => {
    if (!isValidRecommendationInput(input)) {
      toast.error("유효한 설명을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      const recommendation = generateAIRecommendation(input);
      const codes: SrefCode[] = recommendation.codes.map((code, idx) => ({
        code,
        weight: recommendation.weights[idx],
      }));
      const command = createSrefCommand(codes);

      setResult({
        codes,
        command,
        reasoning: recommendation.reasoning,
      });

      onRecommendation?.(codes, command);
      setIsLoading(false);
      toast.success("AI 추천이 생성되었습니다!");
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  const handleCopyCommand = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.command);
      setCopied(true);
      toast.success("명령어가 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI 추천
        </CardTitle>
        <CardDescription>스타일 키워드를 바탕으로 검수된 SREF DB에서 조합을 추천합니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">스타일 설명</label>
          <div className="flex gap-2">
            <Input
              placeholder="예: 따뜻한 톤의 초상화, 미니멀한 3D 렌더링..."
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleRecommend()}
              className="text-sm"
            />
            <Button
              onClick={handleRecommend}
              disabled={isLoading || !input.trim()}
              size="sm"
              className="flex-shrink-0"
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">추천 키워드:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3 p-3 rounded-lg bg-muted/20 border border-border/30">
            <p className="text-sm font-semibold text-foreground">추천 결과</p>
            <p className="text-xs text-muted-foreground">{result.reasoning}</p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">생성된 코드:</p>
              <div className="flex gap-2 flex-wrap">
                {result.codes.map((code: any, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-mono"
                  >
                    {code.code}
                    {code.weight !== 1 && <span className="ml-1">({code.weight})</span>}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 p-2 rounded bg-muted/30">
                <code className="code-text text-xs break-all flex-1 overflow-hidden">
                  {result.command}
                </code>
                <Button
                  onClick={handleCopyCommand}
                  size="sm"
                  variant="ghost"
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          💡 팁: portrait, anime, minimal, warm 같은 키워드를 포함하면 동일 키워드에 일관된 DB 조합이 선택됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
