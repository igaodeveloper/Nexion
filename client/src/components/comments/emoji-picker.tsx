import React, { useRef, useEffect } from "react";
import { CustomReaction } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  customReactions?: CustomReaction[];
}

// Standard emoji categories and emojis
const emojiCategories = [
  {
    id: "common",
    label: "Comuns",
    emojis: ["👍", "👎", "❤️", "😂", "😍", "🎉", "🙌", "👀", "👏", "🔥"],
  },
  {
    id: "faces",
    label: "Rostos",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
    ],
  },
  {
    id: "gestures",
    label: "Gestos",
    emojis: [
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "👍",
      "👎",
      "✊",
      "👊",
      "🤛",
      "🤜",
      "👏",
    ],
  },
  {
    id: "objects",
    label: "Objetos",
    emojis: [
      "💯",
      "💢",
      "💬",
      "👁️‍🗨️",
      "🗨️",
      "🗯️",
      "💭",
      "💤",
      "💮",
      "♨️",
      "💈",
      "🛑",
      "🕛",
      "🕧",
      "🕐",
      "🕜",
      "🕑",
      "🕝",
      "🌀",
      "💠",
      "🌐",
      "♠️",
      "♥️",
      "♦️",
      "♣️",
      "🃏",
      "🀄",
    ],
  },
];

export function EmojiPicker({
  onSelect,
  onClose,
  customReactions = [],
}: EmojiPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState("");
  const [newEmoji, setNewEmoji] = React.useState("");
  const [newEmojiName, setNewEmojiName] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Create custom reaction mutation
  const createCustomReactionMutation = useMutation({
    mutationFn: async (newReaction: { emoji: string; name: string }) => {
      const response = await apiRequest(
        "POST",
        "/api/reactions/custom",
        newReaction,
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reactions/custom"] });
      setNewEmoji("");
      setNewEmojiName("");
      setShowAddForm(false);
    },
  });

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Filter emojis based on search
  const filteredEmojis = search
    ? emojiCategories.flatMap((category) =>
        category.emojis.filter((emoji) => emoji.includes(search.toLowerCase())),
      )
    : [];

  // Filter custom reactions based on search
  const filteredCustomReactions =
    search && customReactions
      ? customReactions.filter(
          (reaction) =>
            reaction.emoji.includes(search.toLowerCase()) ||
            reaction.name.toLowerCase().includes(search.toLowerCase()),
        )
      : customReactions;

  const handleAddCustomReaction = () => {
    if (!newEmoji || !newEmojiName) return;

    createCustomReactionMutation.mutate({
      emoji: newEmoji,
      name: newEmojiName,
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-50 right-0 top-full mt-1 bg-popover border rounded-md shadow-md w-64"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2">
        <Input
          placeholder="Buscar emoji"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

        {search ? (
          <div className="py-2">
            <div className="text-xs font-medium mb-1">Resultados</div>
            <div className="grid grid-cols-6 gap-1">
              {filteredEmojis.map((emoji, i) => (
                <Button
                  key={`${emoji}-${i}`}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-lg"
                  onClick={() => onSelect(emoji)}
                >
                  {emoji}
                </Button>
              ))}

              {filteredCustomReactions?.map((reaction) => (
                <Button
                  key={reaction.id}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-lg"
                  onClick={() => onSelect(reaction.emoji)}
                >
                  {reaction.emoji}
                </Button>
              ))}

              {filteredEmojis.length === 0 &&
                (!filteredCustomReactions ||
                  filteredCustomReactions.length === 0) && (
                  <div className="col-span-6 text-center text-xs text-muted-foreground py-2">
                    Nenhum emoji encontrado
                  </div>
                )}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="common">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="common">Comuns</TabsTrigger>
              <TabsTrigger value="custom">Personal.</TabsTrigger>
              <TabsTrigger value="faces">Rostos</TabsTrigger>
              <TabsTrigger value="gestures">Gestos</TabsTrigger>
            </TabsList>

            {emojiCategories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-2"
              >
                <div className="grid grid-cols-6 gap-1">
                  {category.emojis.map((emoji, i) => (
                    <Button
                      key={`${emoji}-${i}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-lg"
                      onClick={() => onSelect(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}

            <TabsContent value="custom" className="mt-2">
              <ScrollArea className="h-40">
                <div className="grid grid-cols-6 gap-1">
                  {customReactions?.map((reaction) => (
                    <Button
                      key={reaction.id}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-lg"
                      onClick={() => onSelect(reaction.emoji)}
                    >
                      {reaction.emoji}
                    </Button>
                  ))}

                  {(!customReactions || customReactions.length === 0) &&
                    !showAddForm && (
                      <div className="col-span-6 text-center text-xs text-muted-foreground py-4">
                        Nenhuma reação personalizada
                      </div>
                    )}
                </div>

                {showAddForm ? (
                  <div className="mt-2 p-2 border rounded-md bg-muted/50">
                    <div className="text-xs font-medium mb-2">
                      Adicionar reação
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Emoji (ex: 🚀)"
                        value={newEmoji}
                        onChange={(e) => setNewEmoji(e.target.value)}
                        className="text-center"
                      />
                      <Input
                        placeholder="Nome da reação"
                        value={newEmojiName}
                        onChange={(e) => setNewEmojiName(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAddCustomReaction}
                          disabled={!newEmoji || !newEmojiName}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-xs gap-1"
                    onClick={() => setShowAddForm(true)}
                  >
                    <PlusCircle className="h-3 w-3" />
                    <span>Adicionar reação customizada</span>
                  </Button>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
