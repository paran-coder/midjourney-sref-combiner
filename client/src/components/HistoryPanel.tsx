import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Star, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  getHistory,
  getFavorites,
  removeFromHistory,
  removeFromFavorites,
  addToFavorites,
  type SavedCombination,
} from "@/lib/storage";

interface HistoryPanelProps {
  onSelectCombination?: (combination: SavedCombination) => void;
}

/**
 * HistoryPanel Component
 * 
 * Displays user's history and favorites
 */
export function HistoryPanel({ onSelectCombination }: HistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"history" | "favorites">("history");
  const [history, setHistory] = useState<SavedCombination[]>(getHistory());
  const [favorites, setFavorites] = useState<SavedCombination[]>(getFavorites());

  const handleCopyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      toast.success("명령어가 복사되었습니다!");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleRemoveFromHistory = (id: string) => {
    removeFromHistory(id);
    setHistory(getHistory());
    toast.success("히스토리에서 제거되었습니다.");
  };

  const handleRemoveFromFavorites = (id: string) => {
    removeFromFavorites(id);
    setFavorites(getFavorites());
    toast.success("즐겨찾기에서 제거되었습니다.");
  };

  const handleAddToFavorites = (combination: SavedCombination) => {
    if (!favorites.find((f) => f.id === combination.id)) {
      addToFavorites(
        combination.codes,
        combination.command,
        combination.weights,
        combination.label
      );
      setFavorites(getFavorites());
      toast.success("즐겨찾기에 추가되었습니다!");
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  const displayItems = activeTab === "history" ? history : favorites;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">저장된 조합</CardTitle>
        <CardDescription>히스토리 및 즐겨찾기</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border/30">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            히스토리 ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "favorites"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            즐겨찾기 ({favorites.length})
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {displayItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>아직 저장된 항목이 없습니다.</p>
            </div>
          ) : (
            displayItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {item.label && (
                      <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                    )}
                    <code className="code-text text-xs break-all">{item.command}</code>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(item.timestamp)}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {activeTab === "history" && (
                      <Button
                        onClick={() => handleAddToFavorites(item)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title="즐겨찾기 추가"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleCopyCommand(item.command)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="복사"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() =>
                        activeTab === "history"
                          ? handleRemoveFromHistory(item.id)
                          : handleRemoveFromFavorites(item.id)
                      }
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
