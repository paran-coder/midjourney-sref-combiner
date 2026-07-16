import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Trash2, Plus, Download, Upload, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  getCustomPresets,
  createCustomPreset,
  deleteCustomPreset,
  updateCustomPreset,
  exportCustomPresets,
  importCustomPresets,
  type CustomPreset,
} from "@/lib/customPresets";

interface CustomPresetManagerProps {
  onSelectPreset?: (preset: CustomPreset) => void;
}

/**
 * CustomPresetManager Component
 * 
 * Allows users to create, edit, and manage custom sref code presets
 */
export function CustomPresetManager({ onSelectPreset }: CustomPresetManagerProps) {
  const [presets, setPresets] = useState<CustomPreset[]>(getCustomPresets());
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    codes: "",
  });

  const handleAddPreset = () => {
    if (!formData.name.trim() || !formData.codes.trim()) {
      toast.error("이름과 코드를 입력해주세요.");
      return;
    }

    try {
      const codes = formData.codes
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);

      if (codes.length === 0) {
        toast.error("유효한 코드를 입력해주세요.");
        return;
      }

      createCustomPreset(formData.name, formData.description, codes, "");
      setPresets(getCustomPresets());
      setFormData({ name: "", description: "", codes: "" });
      setIsOpen(false);
      toast.success("프리셋이 저장되었습니다!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeletePreset = (id: string) => {
    if (deleteCustomPreset(id)) {
      setPresets(getCustomPresets());
      toast.success("프리셋이 삭제되었습니다.");
    }
  };

  const handleExport = () => {
    const data = exportCustomPresets();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sref-presets.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("프리셋이 내보내졌습니다!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (importCustomPresets(content)) {
          setPresets(getCustomPresets());
          toast.success("프리셋이 가져와졌습니다!");
        } else {
          toast.error("유효하지 않은 파일 형식입니다.");
        }
      } catch (error) {
        toast.error("파일을 읽을 수 없습니다.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          커스텀 프리셋
        </CardTitle>
        <CardDescription>자신만의 sref 코드 조합을 저장하고 관리하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1 min-w-[120px]">
                <Plus className="w-4 h-4 mr-2" />
                새 프리셋
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 프리셋 만들기</DialogTitle>
                <DialogDescription>
                  자주 사용하는 sref 코드 조합을 저장하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">프리셋 이름</label>
                  <Input
                    placeholder="예: 따뜻한 초상화"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">설명</label>
                  <Textarea
                    placeholder="이 프리셋의 특징을 설명해주세요"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">sref 코드 (쉼표로 구분)</label>
                  <Textarea
                    placeholder="예: 123456, 234567, 345678"
                    value={formData.codes}
                    onChange={(e) => setFormData({ ...formData, codes: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddPreset} className="w-full">
                  저장
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleExport}
            size="sm"
            variant="outline"
            className="flex-1 min-w-[120px]"
          >
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>

          <label>
            <Button size="sm" variant="outline" className="flex-1 min-w-[120px]" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                가져오기
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Presets List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {presets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>저장된 프리셋이 없습니다.</p>
              <p className="text-sm">새 프리셋을 만들어 시작하세요!</p>
            </div>
          ) : (
            presets.map((preset) => (
              <div
                key={preset.id}
                className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">{preset.name}</h4>
                    {preset.description && (
                      <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                    )}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {preset.codes.map((code, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-mono"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => onSelectPreset?.(preset)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="선택"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeletePreset(preset.id)}
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

        <p className="text-xs text-muted-foreground">
          💡 팁: 프리셋을 선택하면 코드 생성기에 자동으로 적용됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
