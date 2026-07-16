import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { styleCategories, type StylePreset } from "@/lib/presets";
import { Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { createSrefCommand } from "@/lib/srefGenerator";

interface StylePresetsProps {
  onSelectPreset?: (preset: StylePreset) => void;
}

/**
 * StylePresets Component
 * 
 * Displays style categories and presets
 */
export function StylePresets({ onSelectPreset }: StylePresetsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(styleCategories[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentCategory = styleCategories.find((cat) => cat.id === selectedCategory);

  const handleCopyPreset = async (preset: StylePreset) => {
    try {
      const command = createSrefCommand(
        preset.codes.map((code, idx) => ({
          code,
          weight: preset.weights?.[idx],
        }))
      );
      await navigator.clipboard.writeText(command);
      setCopiedId(preset.id);
      toast.success("명령어가 복사되었습니다!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          스타일 프리셋
        </CardTitle>
        <CardDescription>인기 있는 스타일 조합을 선택하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {styleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg transition-all text-center ${
                selectedCategory === category.id
                  ? "bg-primary/20 border border-primary/50 text-primary"
                  : "bg-muted/20 border border-border/30 hover:border-primary/50 text-foreground"
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-xs font-medium">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Presets List */}
        {currentCategory && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{currentCategory.description}</p>
            <div className="space-y-2">
              {currentCategory.presets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">{preset.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {preset.codes.map((code, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-mono"
                          >
                            {code}
                            {preset.weights && preset.weights[idx] !== 1 && (
                              <span className="ml-1 text-muted-foreground">
                                ({preset.weights[idx]})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCopyPreset(preset)}
                      size="sm"
                      variant="outline"
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedId === preset.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
