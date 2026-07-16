import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Copy, RefreshCw, Check, Sparkles, Heart, Database, Dices, Shuffle } from "lucide-react";
import { toast } from "sonner";
import {
  generateSrefCombination,
  createSrefCommand,
  type SrefGenerationMode,
  type GeneratedResult,
} from "@/lib/srefGenerator";
import { addToHistory, addToFavorites } from "@/lib/storage";
import { SREF_DATABASE_SIZE } from "@/lib/srefDatabase";

const MODE_OPTIONS: Array<{
  value: SrefGenerationMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof Database;
}> = [
  {
    value: "database",
    label: "DB 모드",
    shortLabel: "DB",
    description: `검수된 ${SREF_DATABASE_SIZE.toLocaleString()}개 코드 안에서만 선택`,
    icon: Database,
  },
  {
    value: "random",
    label: "완전 랜덤 모드",
    shortLabel: "랜덤",
    description: "기존 방식처럼 100000~999999 사이의 6자리 숫자를 생성",
    icon: Dices,
  },
  {
    value: "hybrid",
    label: "혼합 모드",
    shortLabel: "혼합",
    description: "검수된 DB 코드와 새로운 6자리 임의 숫자를 함께 조합",
    icon: Shuffle,
  },
];

function getModeOption(mode: SrefGenerationMode) {
  return MODE_OPTIONS.find((option) => option.value === mode) ?? MODE_OPTIONS[0];
}

/**
 * Main component for generating and combining Midjourney SREF codes.
 */
export function SrefCombiner() {
  const [codeCount, setCodeCount] = useState<number>(2);
  const [includeWeights, setIncludeWeights] = useState<boolean>(true);
  const [generationMode, setGenerationMode] = useState<SrefGenerationMode>("database");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const selectedMode = getModeOption(generationMode);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateSrefCombination(
        codeCount,
        includeWeights,
        generationMode
      );
      setResult(generated);
      setCopied(false);
      setIsGenerating(false);

      addToHistory(
        generated.codes.map((code) => code.code),
        generated.command,
        generated.codes.map((code) => code.weight || 1),
        getModeOption(generated.mode).label
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
    } catch (error) {
      toast.error("복사에 실패했습니다.");
      console.error("Failed to copy:", error);
    }
  };

  const handleAddToFavorites = () => {
    if (!result) return;

    addToFavorites(
      result.codes.map((code) => code.code),
      result.command,
      result.codes.map((code) => code.weight || 1),
      getModeOption(result.mode).label
    );
    toast.success("즐겨찾기에 추가되었습니다!");
  };

  const handleRegenerateWeights = () => {
    if (!result) return;

    setIsGenerating(true);
    setTimeout(() => {
      const updatedCodes = result.codes.map((item) => ({
        ...item,
        weight: includeWeights
          ? Math.round((Math.random() * 1.5 + 0.5) * 10) / 10
          : undefined,
      }));

      const updatedResult: GeneratedResult = {
        codes: updatedCodes,
        command: createSrefCommand(updatedCodes),
        mode: result.mode,
      };

      setResult(updatedResult);
      setCopied(false);
      setIsGenerating(false);
      toast.success("가중치가 재생성되었습니다!");

      addToHistory(
        updatedResult.codes.map((code) => code.code),
        updatedResult.command,
        updatedResult.codes.map((code) => code.weight || 1),
        getModeOption(updatedResult.mode).label
      );
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-6 hover:border-primary/30 transition-colors duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            sref 코드 조합기
          </CardTitle>
          <CardDescription className="text-xs">
            안정적인 DB 조합부터 새로운 숫자 탐색까지 생성 방식을 선택하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">생성 모드</Label>
            <RadioGroup
              value={generationMode}
              onValueChange={(value) => setGenerationMode(value as SrefGenerationMode)}
              className="grid gap-2"
            >
              {MODE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = generationMode === option.value;

                return (
                  <Label
                    key={option.value}
                    htmlFor={`mode-${option.value}`}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? "border-primary/60 bg-primary/10"
                        : "border-border/40 bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
                    }`}
                  >
                    <RadioGroupItem
                      id={`mode-${option.value}`}
                      value={option.value}
                      className="mt-0.5"
                    />
                    <Icon className={`mt-0.5 h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="space-y-0.5">
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
            {generationMode === "hybrid" && (
              <p className="text-xs text-muted-foreground">
                코드가 2개 이상이면 두 출처를 반드시 포함하며, 홀수 개는 DB 코드가 한 개 더 선택됩니다.
              </p>
            )}
          </div>

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

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium cursor-pointer">가중치 포함</Label>
              <p className="text-xs text-muted-foreground">각 코드에 무작위 가중치를 할당합니다</p>
            </div>
            <Switch checked={includeWeights} onCheckedChange={setIncludeWeights} />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full h-12 text-base glow-primary hover:glow-primary transition-all duration-300"
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "생성 중..." : `${selectedMode.shortLabel} 코드 생성`}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/30 bg-card/50 backdrop-blur-sm fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">생성된 코드</CardTitle>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {getModeOption(result.mode).label}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {result.codes.map((item, index) => (
                <div
                  key={`${item.code}-${index}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 hover:bg-muted/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      #{index + 1}
                    </span>
                    <code className="code-text text-sm font-semibold">{item.code}</code>
                    {item.source && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          item.source === "database"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {item.source === "database" ? "DB" : "랜덤"}
                      </span>
                    )}
                  </div>
                  {item.weight && (
                    <span className="text-xs font-medium text-accent">
                      가중치: <span className="text-primary">{item.weight}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>

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
