import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  SkipBack,
  RotateCcw,
} from "lucide-react";
import { DocumentVersion } from "@shared/schema";
import { Page } from "./page-editor";
import BlockEditor from "./block-editor";
import { cn } from "@/lib/utils";

interface TimeMachineProps {
  documentId: number;
  currentPage: Page;
  onRestore: (version: DocumentVersion) => void;
}

export function TimeMachine({
  documentId,
  currentPage,
  onRestore,
}: TimeMachineProps) {
  const [open, setOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null,
  );
  const [sliderValue, setSliderValue] = useState(100); // 100 means current version
  const [viewMode, setViewMode] = useState<"slider" | "grid" | "compare">(
    "slider",
  );

  const { data: versions, isLoading } = useQuery<DocumentVersion[]>({
    queryKey: ["/api/documents", documentId, "versions"],
    enabled: open,
  });

  // Reset slider to latest version when dialog opens
  useEffect(() => {
    if (open) {
      setSliderValue(100);
      setSelectedVersionId(null);
    }
  }, [open]);

  // Update selected version when slider moves
  useEffect(() => {
    if (!versions || versions.length === 0) return;

    if (sliderValue === 100) {
      setSelectedVersionId(null);
      return;
    }

    // Map slider value (0-99) to version index
    const index = Math.floor((versions.length - 1) * (sliderValue / 100));
    setSelectedVersionId(versions[index].id);
  }, [sliderValue, versions]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  const selectedVersion =
    selectedVersionId && versions
      ? versions.find((v) => v.id === selectedVersionId)
      : null;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const handleRestore = () => {
    if (selectedVersion) {
      onRestore(selectedVersion);
      setOpen(false);
    }
  };

  const handleNextVersion = () => {
    if (!versions || versions.length === 0) return;

    if (selectedVersionId === null) return;

    const currentIndex = versions.findIndex((v) => v.id === selectedVersionId);
    if (currentIndex < versions.length - 1) {
      setSelectedVersionId(versions[currentIndex + 1].id);
      // Update slider position
      setSliderValue(
        Math.round(((currentIndex + 1) / (versions.length - 1)) * 100),
      );
    }
  };

  const handlePreviousVersion = () => {
    if (!versions || versions.length === 0) return;

    if (selectedVersionId === null) {
      // If viewing current version, go to the most recent saved version
      setSelectedVersionId(versions[versions.length - 1].id);
      setSliderValue(99); // Almost at the end
      return;
    }

    const currentIndex = versions.findIndex((v) => v.id === selectedVersionId);
    if (currentIndex > 0) {
      setSelectedVersionId(versions[currentIndex - 1].id);
      // Update slider position
      setSliderValue(
        Math.round(((currentIndex - 1) / (versions.length - 1)) * 100),
      );
    }
  };

  const renderVersionContent = (version: DocumentVersion | null) => {
    if (!version) {
      // Show current page
      return (
        <div className="border border-border rounded-md p-4 bg-card/50">
          <BlockEditor
            blocks={currentPage.blocks}
            onChange={() => {}}
            readOnly={true}
          />
        </div>
      );
    }

    // Show historical version
    const blocks = JSON.parse(version.blocks);
    return (
      <div className="border border-border rounded-md p-4 bg-card/50">
        <BlockEditor blocks={blocks} onChange={() => {}} readOnly={true} />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          <span>Histórico</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Histórico de Versões</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="slider"
          className="flex-1 flex flex-col"
          onValueChange={(value) => setViewMode(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="slider">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="grid">Miniaturas</TabsTrigger>
            <TabsTrigger value="compare">Comparação</TabsTrigger>
          </TabsList>

          {/* Slider Timeline View */}
          <TabsContent value="slider" className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
              {renderVersionContent(selectedVersion ?? null)}
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedVersion
                    ? `Versão ${selectedVersion.versionNumber} - ${formatDate(selectedVersion.createdAt)}`
                    : "Versão Atual"}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedVersionId(null)}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousVersion}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextVersion}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Slider
                defaultValue={[100]}
                value={[sliderValue]}
                max={100}
                step={1}
                onValueChange={handleSliderChange}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Versão Antiga</span>
                <span>Versão Atual</span>
              </div>
            </div>
          </TabsContent>

          {/* Grid View with Thumbnails */}
          <TabsContent value="grid" className="flex-1 overflow-auto">
            <div className="grid grid-cols-3 gap-4">
              {/* Current version first */}
              <div
                className={cn(
                  "border rounded-md p-2 cursor-pointer flex flex-col",
                  selectedVersionId === null
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
                onClick={() => setSelectedVersionId(null)}
              >
                <div className="aspect-video bg-card rounded overflow-hidden flex items-center justify-center mb-2">
                  {currentPage.coverImage ? (
                    <img
                      src={currentPage.coverImage}
                      alt="Current version"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-2xl">{currentPage.emoji || "📄"}</div>
                  )}
                </div>
                <p className="text-sm font-medium truncate">
                  {currentPage.title}
                </p>
                <p className="text-xs text-muted-foreground">Versão Atual</p>
              </div>

              {/* Versions */}
              {versions?.map((version) => (
                <div
                  key={version.id}
                  className={cn(
                    "border rounded-md p-2 cursor-pointer flex flex-col",
                    selectedVersionId === version.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => setSelectedVersionId(version.id)}
                >
                  <div className="aspect-video bg-card rounded overflow-hidden flex items-center justify-center mb-2">
                    {version.thumbnail ? (
                      <img
                        src={version.thumbnail}
                        alt={`Version ${version.versionNumber}`}
                        className="object-cover w-full h-full"
                      />
                    ) : version.coverImage ? (
                      <img
                        src={version.coverImage}
                        alt={`Version ${version.versionNumber}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-2xl">{version.emoji || "📄"}</div>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">
                    {version.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Versão {version.versionNumber} -{" "}
                    {formatDate(version.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Compare View */}
          <TabsContent
            value="compare"
            className="flex-1 grid grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <div className="text-center p-2 bg-muted mb-2 rounded-t-md">
                <p className="text-sm font-medium">
                  {selectedVersion
                    ? `Versão ${selectedVersion.versionNumber} - ${formatDate(selectedVersion.createdAt)}`
                    : "Versão Atual"}
                </p>
              </div>
              <div className="flex-1 overflow-auto border border-border rounded-b-md">
                {renderVersionContent(selectedVersion ?? null)}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-center p-2 bg-muted mb-2 rounded-t-md">
                <p className="text-sm font-medium">Versão Atual</p>
              </div>
              <div className="flex-1 overflow-auto border border-border rounded-b-md">
                {renderVersionContent(null)}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {selectedVersion && (
            <Button variant="default" onClick={handleRestore} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Restaurar esta versão</span>
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
