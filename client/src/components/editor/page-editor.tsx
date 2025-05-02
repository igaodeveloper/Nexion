import React, { useState, useRef } from "react";
import { Block } from "@shared/schema";
import BlockEditor from "./block-editor";
import { Button } from "@/components/ui/button";
import {
  SmileIcon,
  ImageIcon,
  StarIcon,
  HeartIcon,
  RefreshCw,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TimeMachine } from "./time-machine";
import { DocumentVersion } from "@shared/schema";
import { ZenModeToggle } from "@/components/zen-mode-toggle";
import { useZenMode } from "@/lib/zen-mode-provider";

export type Page = {
  id?: number;
  title: string;
  blocks: Block[];
  emoji?: string | null;
  coverImage?: string | null;
  isFavorite?: boolean | null;
  isStarred?: boolean | null;
  createdBy?: number;
  organizationId?: number;
  icon?: string | null;
  parentId?: number | null;
};

interface PageEditorProps {
  page: Page;
  onSave: (page: Page) => void;
  isLoading?: boolean;
  readOnly?: boolean;
}

export function PageEditor({
  page,
  onSave,
  isLoading = false,
  readOnly = false,
}: PageEditorProps) {
  const [currentPage, setCurrentPage] = useState<Page>(page);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const { zenMode } = useZenMode();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleBlocksChange = (blocks: Block[]) => {
    setCurrentPage((prev) => ({ ...prev, blocks }));
  };

  const handleSave = () => {
    if (!isLoading) {
      onSave(currentPage);
    }
  };

  const toggleStar = () => {
    if (readOnly) return;
    setCurrentPage((prev) => ({
      ...prev,
      isStarred: !prev.isStarred,
    }));
  };

  const toggleFavorite = () => {
    if (readOnly) return;
    setCurrentPage((prev) => ({
      ...prev,
      isFavorite: !prev.isFavorite,
    }));
  };

  const handleEmojiChange = (emoji: string) => {
    setCurrentPage((prev) => ({
      ...prev,
      emoji,
    }));
    setShowEmojiPicker(false);
  };

  const sampleEmojis = [
    "📝",
    "✅",
    "📊",
    "🎯",
    "💡",
    "🚀",
    "🎨",
    "🔍",
    "📌",
    "📚",
  ];

  const handleChangeCoverImage = (url: string) => {
    setCurrentPage((prev) => ({
      ...prev,
      coverImage: url,
    }));
  };

  // Unsplash sample cover images
  const coverImageOptions = [
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    "https://images.unsplash.com/photo-1589395937772-f67057e233b8",
    "https://images.unsplash.com/photo-1584270413639-d5ee397272cd",
    "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713",
  ];

  const handleRestoreVersion = (version: DocumentVersion) => {
    const restoredPage = {
      ...currentPage,
      title: version.title,
      emoji: version.emoji,
      coverImage: version.coverImage,
      blocks: JSON.parse(version.blocks),
    };

    setCurrentPage(restoredPage);
    onSave(restoredPage);
  };

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen bg-background",
        zenMode && "zen-fullscreen",
      )}
    >
      {/* Cover Image */}
      {currentPage.coverImage ? (
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <img
            src={currentPage.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {!readOnly && (
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Change Cover
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 grid grid-cols-2 gap-1 p-1"
                >
                  {coverImageOptions.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-16 cursor-pointer rounded-md overflow-hidden"
                      onClick={() => handleChangeCoverImage(url)}
                    >
                      <img
                        src={url}
                        alt={`Cover option ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <DropdownMenuItem className="col-span-2 justify-center text-center">
                    Remove Cover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ) : (
        !readOnly && (
          <div className="flex justify-end p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Cover
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 grid grid-cols-2 gap-1 p-1"
              >
                {coverImageOptions.map((url, index) => (
                  <div
                    key={index}
                    className="relative h-16 cursor-pointer rounded-md overflow-hidden"
                    onClick={() => handleChangeCoverImage(url)}
                  >
                    <img
                      src={url}
                      alt={`Cover option ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      )}

      <div className="flex flex-1 flex-col items-center mx-auto w-full max-w-4xl px-4">
        {/* Title & Emoji Row */}
        <div className="flex items-center space-x-2 w-full mt-8 mb-4">
          <div className="relative">
            {currentPage.emoji ? (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "text-3xl md:text-5xl h-10 w-10 md:h-12 md:w-12 rounded-lg",
                  readOnly ? "cursor-default" : "cursor-pointer",
                )}
                onClick={() => !readOnly && setShowEmojiPicker(true)}
                disabled={readOnly}
              >
                <span>{currentPage.emoji}</span>
              </Button>
            ) : (
              !readOnly && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 md:h-12 w-10 md:w-12 rounded-lg"
                  onClick={() => setShowEmojiPicker(true)}
                >
                  <SmileIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
              )
            )}

            {showEmojiPicker && (
              <div className="absolute z-10 top-full left-0 mt-1 bg-popover border rounded-md shadow-md p-2 grid grid-cols-5 gap-1">
                {sampleEmojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-xl"
                    onClick={() => handleEmojiChange(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            <Input
              ref={titleRef}
              value={currentPage.title}
              onChange={handleTitleChange}
              className="border-none text-2xl md:text-4xl font-bold bg-transparent px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Untitled"
              readOnly={readOnly}
            />
          </div>

          <div className="flex items-center space-x-2">
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center space-x-1",
                  currentPage.isStarred
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "",
                )}
                onClick={toggleStar}
              >
                <StarIcon className="h-4 w-4" />
                <span>{currentPage.isStarred ? "Destacado" : "Destacar"}</span>
              </Button>
            )}

            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center space-x-1",
                  currentPage.isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "",
                )}
                onClick={toggleFavorite}
              >
                <HeartIcon className="h-4 w-4" />
                <span>{currentPage.isFavorite ? "Favorito" : "Favoritar"}</span>
              </Button>
            )}

            {/* Time Machine Button */}
            {currentPage.id && (
              <TimeMachine
                documentId={currentPage.id}
                currentPage={currentPage}
                onRestore={handleRestoreVersion}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            "flex items-center justify-between w-full mb-6",
            zenMode && "zen-hidden",
          )}
        >
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center space-x-1",
                  currentPage.isStarred
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "",
                )}
                onClick={toggleStar}
              >
                <StarIcon className="h-4 w-4" />
                <span>{currentPage.isStarred ? "Destacado" : "Destacar"}</span>
              </Button>
            )}

            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center space-x-1",
                  currentPage.isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "",
                )}
                onClick={toggleFavorite}
              >
                <HeartIcon className="h-4 w-4" />
                <span>{currentPage.isFavorite ? "Favorito" : "Favoritar"}</span>
              </Button>
            )}

            {/* Time Machine Button */}
            {currentPage.id && (
              <TimeMachine
                documentId={currentPage.id}
                currentPage={currentPage}
                onRestore={handleRestoreVersion}
              />
            )}
          </div>

          {!readOnly && (
            <Button
              variant="default"
              disabled={isLoading}
              onClick={handleSave}
              className="flex items-center space-x-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span>Salvar</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Zen mode toggle button */}
        <div className="w-full flex justify-end mb-4">
          <ZenModeToggle showLabel />
        </div>

        {/* Zen mode exit button (only visible in zen mode) */}
        {zenMode && (
          <div className="zen-exit-button">
            <ZenModeToggle variant="ghost" />
          </div>
        )}

        {/* Document Blocks */}
        <div className="w-full">
          <BlockEditor
            blocks={currentPage.blocks}
            onChange={handleBlocksChange}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
}

export default PageEditor;
