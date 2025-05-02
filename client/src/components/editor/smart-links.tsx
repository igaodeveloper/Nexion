import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Link, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartLinksProps {
  text: string;
  onCreateLink: (
    documentId: number,
    documentTitle: string,
    anchorText: string,
  ) => void;
  onClose: () => void;
}

export function SmartLinks({ text, onCreateLink, onClose }: SmartLinksProps) {
  const [open, setOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents/search", text],
    enabled: open,
  });

  // Focus the input when the popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  // Preselect the text that matches
  useEffect(() => {
    setInputValue(text);
  }, [text]);

  // Close the popover when ESC is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close the popover when clicking outside
  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open, onClose]);

  const handleSelect = (documentId: number, documentTitle: string) => {
    onCreateLink(documentId, documentTitle, text);
    setOpen(false);
  };

  const handleCreateNewDocument = () => {
    // We would normally create a new document with the text as title
    // and then link to it, but for now we just close the popover
    setOpen(false);
    onClose();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="absolute left-0 top-0 opacity-0 pointer-events-none" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Pesquisar documentos..."
            value={inputValue}
            onValueChange={setInputValue}
            ref={inputRef}
          />
          {isLoading ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Buscando documentos...
              </p>
            </div>
          ) : (
            <>
              <CommandEmpty>
                <div className="py-3 px-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Nenhum documento encontrado com esse texto.
                  </p>
                  <button
                    className="flex items-center gap-2 p-2 rounded-md text-sm w-full hover:bg-primary/10 transition-colors"
                    onClick={handleCreateNewDocument}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Criar novo documento "{text}"</span>
                  </button>
                </div>
              </CommandEmpty>

              <CommandGroup heading="Documentos Sugeridos">
                {documents?.map((doc) => (
                  <CommandItem
                    key={doc.id}
                    onSelect={() => handleSelect(doc.id, doc.title)}
                    className="flex items-center gap-2 py-2"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="text-lg mr-1">{doc.emoji || "📄"}</div>
                      <span className="flex-1 truncate">{doc.title}</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// This component is used to detect potential links in text and suggest linking to existing documents
export function useLinkDetection(text: string, enabled = true) {
  const [potentialLinks, setPotentialLinks] = useState<string[]>([]);

  // Fetch all document titles
  const { data: allDocuments } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    enabled,
  });

  // Detect potential links in text
  useEffect(() => {
    if (!text || !allDocuments || !enabled) {
      setPotentialLinks([]);
      return;
    }

    // Find matching document titles in the text
    const matches = allDocuments
      .filter((doc) => doc.title.length > 3) // Ignore very short titles
      .filter((doc) => text.toLowerCase().includes(doc.title.toLowerCase()))
      .map((doc) => doc.title);

    // Also detect capitalized words that might be proper nouns (potential document titles)
    const words = text.split(/\s+/);
    const potentialTitles = words
      .filter((word) => word.length > 3)
      .filter((word) => word[0] === word[0].toUpperCase())
      .filter((word) => !matches.some((match) => match.includes(word)));

    setPotentialLinks([...matches, ...potentialTitles]);
  }, [text, allDocuments, enabled]);

  return potentialLinks;
}
