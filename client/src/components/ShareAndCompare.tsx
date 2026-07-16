import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { GeneratedResult } from "@/lib/srefGenerator";

interface ShareAndCompareProps {
  result?: GeneratedResult;
  onCompare?: () => void;
}

/**
 * ShareAndCompare Component
 * 
 * Provides sharing and comparison features
 */
export function ShareAndCompare({ result, onCompare }: ShareAndCompareProps) {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [showCompare, setShowCompare] = useState<boolean>(false);

  const generateShareUrl = () => {
    if (!result) return;

    // Create a shareable URL with encoded data
    const data = {
      codes: result.codes.map((c) => c.code),
      weights: result.codes.map((c) => c.weight || 1),
    };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}?share=${encoded}`;
    setShareUrl(url);
  };

  const handleCopyShareUrl = async () => {
    if (!shareUrl) {
      generateShareUrl();
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("공유 링크가 복사되었습니다!");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleExportImage = () => {
    if (!result) return;

    // Create a canvas with the command
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#7C3AED";
    ctx.font = "bold 32px 'Space Grotesk'";
    ctx.fillText("Midjourney sref Combiner", 40, 60);

    // Command
    ctx.fillStyle = "#06B6D4";
    ctx.font = "20px 'Fira Code'";
    const commandText = result.command;
    const maxWidth = canvas.width - 80;
    let y = 150;

    // Wrap text
    const words = commandText.split(" ");
    let line = "";
    words.forEach((word) => {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        ctx.fillText(line, 40, y);
        line = word + " ";
        y += 40;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 40, y);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sref-combination.png";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("이미지가 다운로드되었습니다!");
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">공유 및 비교</CardTitle>
        <CardDescription>조합을 공유하고 비교하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>먼저 코드를 생성해주세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Share URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">공유 링크</label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl || "클릭하여 생성"}
                  readOnly
                  className="text-xs"
                  onClick={generateShareUrl}
                />
                <Button
                  onClick={handleCopyShareUrl}
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                링크를 공유하면 다른 사람이 이 조합을 볼 수 있습니다
              </p>
            </div>

            {/* Export Image */}
            <Button onClick={handleExportImage} variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              이미지로 내보내기
            </Button>

            {/* Compare Mode */}
            <Button
              onClick={() => {
                setShowCompare(!showCompare);
                onCompare?.();
              }}
              variant="outline"
              className="w-full"
            >
              {showCompare ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  비교 모드 끄기
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  비교 모드 켜기
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
