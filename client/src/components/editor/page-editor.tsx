import React, { useState, useEffect } from 'react';
import { BlockEditor, Block, BlockType } from './block-editor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  MoreHorizontal, 
  Star, 
  Clock, 
  Bookmark, 
  FileText, 
  Plus, 
  Search 
} from 'lucide-react';

export interface Page {
  id: string;
  title: string;
  emoji?: string;
  coverImage?: string;
  icon?: string;
  blocks: Block[];
  createdAt: Date;
  updatedAt: Date;
  starred?: boolean;
  favorite?: boolean;
}

interface PageEditorProps {
  page: Page;
  onUpdate: (page: Page) => void;
}

export function PageEditor({ page, onUpdate }: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState(page.title);
  const [isStarred, setIsStarred] = useState(page.starred || false);
  const [isFavorite, setIsFavorite] = useState(page.favorite || false);

  useEffect(() => {
    // Se não houver blocos, inicialize com um bloco padrão
    if (page.blocks.length === 0) {
      const initialBlocks: Block[] = [
        {
          id: `block-${Date.now()}`,
          type: 'paragraph',
          content: '',
          children: []
        }
      ];
      setBlocks(initialBlocks);
      onUpdate({ ...page, blocks: initialBlocks });
    } else {
      setBlocks(page.blocks);
    }
  }, [page.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate({ ...page, title: newTitle });
  };

  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    onUpdate({ ...page, blocks: newBlocks });
  };

  const toggleStar = () => {
    setIsStarred(!isStarred);
    onUpdate({ ...page, starred: !isStarred });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onUpdate({ ...page, favorite: !isFavorite });
  };

  const addCoverImage = () => {
    // Em um app real, abriria um seletor de imagem
    const fakeCoverUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809';
    onUpdate({ ...page, coverImage: fakeCoverUrl });
  };

  const addIcon = () => {
    // Em um app real, abriria um seletor de emojis
    onUpdate({ ...page, emoji: '📝' });
  };

  return (
    <div className="page-editor w-full max-w-5xl mx-auto">
      {/* Imagem de capa */}
      {page.coverImage && (
        <div 
          className="cover-image h-40 w-full bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${page.coverImage})` }}
        />
      )}

      {/* Barra de ferramentas */}
      <div className="toolbar flex justify-between items-center py-2 px-4 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => {}} className="text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Atualizado {new Date(page.updatedAt).toLocaleDateString()}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleStar} className={isStarred ? "text-yellow-500" : "text-gray-500"}>
            <Star className="h-4 w-4 mr-1" />
            {isStarred ? "Marcado" : "Marcar com estrela"}
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleFavorite} className={isFavorite ? "text-blue-500" : "text-gray-500"}>
            <Bookmark className="h-4 w-4 mr-1" />
            {isFavorite ? "Favorito" : "Adicionar aos favoritos"}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex justify-start"
                  onClick={addCoverImage}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Adicionar Capa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex justify-start"
                  onClick={addIcon}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Ícone
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex justify-start"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Pesquisar na página
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Título e ícone da página */}
      <div className="page-header px-12 py-8">
        <div className="flex items-center mb-4">
          {page.emoji && (
            <div className="emoji text-4xl mr-3">{page.emoji}</div>
          )}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Página sem título"
            className="text-4xl font-bold px-0 border-none bg-transparent focus:outline-none focus:ring-0 w-full"
          />
        </div>
      </div>

      {/* Editor de blocos */}
      <div className="px-12 pb-24">
        <BlockEditor blocks={blocks} onChange={handleBlocksChange} />
      </div>
    </div>
  );
}