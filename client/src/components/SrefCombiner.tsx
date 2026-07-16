import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";
import {
  generateSrefCombination,
  createSrefCommand,
  type SrefCode,
  type GeneratedResult,
} from "@/lib/srefGenerator";
import { addToHistory, addToFavorites } from "@/lib/storage";

/**
 * SrefCombiner Component
 * 
 * Main component for generating and combining Midjourney sref codes.
 * Features:
 * - Generate random sref codes (1-5 codes)
 * - Optional weight assignment
 * - Copy command to clipboard
 * - Visual display of generated codes
 * - Save to history and favorites
 */
export function SrefCombiner() {
  const [codeCount, setCodeCount] = useState<number>(2);
  const [includeWeights, setIncludeWeights] = useState<boolean>(true);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay for better UX
    setTimeout(() => {
      const generated = generateSrefCombination(codeCount, includeWeights);
      setResult(generated);
      setCopied(false);
      setIsGenerating(false);

      // Auto-save to history
      addToHistory(
        generated.codes.map((c) => c.code),
        generated.command,
        generated.codes.map((c) => c.weight || 1)
      );
    }, 300);
  };

  const handleCopyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.command);
      setCopied(true);
      toast.success("명령어가 클립보드에 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다.");
      console.error("Failed to copy:", err);
    }
  };

  const handleAddToFavorites = () => {
    if (!result) return;

    addToFavorites(
      result.codes.map((c) => c.code),
      result.command,
      result.codes.map((c) => c.weight || 1)
    );
    toast.success("즐겨찾기에 추가되었습니다!");
  };

  const handleRegenerateWeights = () => {
    if (!result) return;

    setIsGenerating(true);
    setTimeout(() => {
      // Regenerate weights for existing codes
      const updatedCodes = result.codes.map((item) => ({
        ...item,
        weight: includeWeights ? Math.round((Math.random() * 1.5 + 0.5) * 10) / 10 : undefined,
      }));

      const updatedResult: GeneratedResult = {
        codes: updatedCodes,
        command: createSrefCommand(updatedCodes),
      };

      setResult(updatedResult);
      setCopied(false);
      setIsGenerating(false);
      toast.success("가중치가 재생성되었습니다!");

      // Update history
      addToHistory(
        updatedResult.codes.map((c) => c.code),
        updatedResult.command,
        updatedResult.codes.map((c) => c.weight || 1)
      );
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Controls Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-6 hover:border-primary/30 transition-colors duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            sref 코드 조합기
          </CardTitle>
          <CardDescription className="text-xs">미드저니 스타일 참조 코드를 무작위로 생성하고 조합하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Count Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">생성할 코드 개수</Label>
              <span className="text-base font-semibold text-primary">{codeCount}</span>
            </div>
            <Slider
              value={[codeCount]}
              onValueChange={(value) => setCodeCount(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1개</span>
              <span>5개</span>
            </div>
          </div>

          {/* Include Weights Toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium cursor-pointer">가중치 포함</Label>
              <p className="text-xs text-muted-foreground">각 코드에 무작위 가중치를 할당합니다</p>
            </div>
            <Switch checked={includeWeights} onCheckedChange={setIncludeWeights} />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full h-12 text-base glow-primary hover:glow-primary transition-all duration-300"
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "생성 중..." : "코드 생성"}
          </Button>
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && (
        <Card className="border-primary/30 bg-card/50 backdrop-blur-sm fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">생성된 코드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Code List */}
            <div className="space-y-2">
              {result.codes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      #{index + 1}
                    </span>
                    <code className="code-text text-sm font-semibold">{item.code}</code>
                  </div>
                  {item.weight && (
                    <span className="text-xs font-medium text-accent">
                      가중치: <span className="text-primary">{item.weight}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Command Display */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">명령어</Label>
              <div className="code-block flex items-center justify-between gap-2 group hover:border-primary/50 transition-colors duration-200 p-3">
                <code className="code-text text-xs flex-1 overflow-hidden text-ellipsis">
                  {result.command}
                </code>
                <Button
                  onClick={handleCopyToClipboard}
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

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {includeWeights && (
                <Button
                  onClick={handleRegenerateWeights}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                  가중치 재생성
                </Button>
              )}
              <Button
                onClick={handleAddToFavorites}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Heart className="mr-2 h-4 w-4" />
                즐겨찾기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
