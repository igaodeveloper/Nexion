import React, { useState, useRef, useEffect } from 'react';
import { Block } from '@shared/schema';
import { PlusIcon, MoreHorizontal, AlignLeft, Heading1, Heading2, Heading3, ListOrdered, ListTodo, List, Image, Code, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

type BlockEditorProps = {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange, readOnly = false }) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showAddButton, setShowAddButton] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleBlockContentChange = (id: string, content: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    onChange(updatedBlocks);
  };

  const handleBlockTypeChange = (id: string, type: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, type } : block
    );
    onChange(updatedBlocks);
  };

  const handleDeleteBlock = (id: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== id);
    onChange(updatedBlocks);
  };

  const handleAddBlock = (afterId: string, type: string = 'paragraph') => {
    const index = blocks.findIndex(block => block.id === afterId);
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      content: '',
      children: []
    };
    
    const updatedBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1)
    ];
    
    onChange(updatedBlocks);
    setShowAddButton(null);
    
    // Focus the new block after render
    setTimeout(() => {
      const newBlockElement = document.getElementById(newBlock.id);
      if (newBlockElement) {
        setActiveBlockId(newBlock.id);
        newBlockElement.focus();
      }
    }, 10);
  };

  const renderBlockType = (type: string) => {
    switch (type) {
      case 'heading-1':
        return <Heading1 className="h-4 w-4" />;
      case 'heading-2':
        return <Heading2 className="h-4 w-4" />;
      case 'heading-3':
        return <Heading3 className="h-4 w-4" />;
      case 'bullet-list':
        return <List className="h-4 w-4" />;
      case 'numbered-list':
        return <ListOrdered className="h-4 w-4" />;
      case 'todo-list':
        return <ListTodo className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'table':
        return <Table className="h-4 w-4" />;
      default:
        return <AlignLeft className="h-4 w-4" />;
    }
  };

  const renderBlockTypeOptions = (blockId: string, currentType: string) => {
    const blockTypes = [
      { id: 'paragraph', label: 'Texto', icon: <AlignLeft className="h-4 w-4 mr-2" /> },
      { id: 'heading-1', label: 'Título 1', icon: <Heading1 className="h-4 w-4 mr-2" /> },
      { id: 'heading-2', label: 'Título 2', icon: <Heading2 className="h-4 w-4 mr-2" /> },
      { id: 'heading-3', label: 'Título 3', icon: <Heading3 className="h-4 w-4 mr-2" /> },
      { id: 'bullet-list', label: 'Lista com marcadores', icon: <List className="h-4 w-4 mr-2" /> },
      { id: 'numbered-list', label: 'Lista numerada', icon: <ListOrdered className="h-4 w-4 mr-2" /> },
      { id: 'todo-list', label: 'Lista de tarefas', icon: <ListTodo className="h-4 w-4 mr-2" /> },
      { id: 'code', label: 'Código', icon: <Code className="h-4 w-4 mr-2" /> }
    ];

    return (
      <div className="grid grid-cols-1 gap-1 p-1">
        {blockTypes.map(type => (
          <Button
            key={type.id}
            variant={currentType === type.id ? "secondary" : "ghost"}
            className="flex items-center justify-start px-2 py-1 h-8 text-xs"
            onClick={() => handleBlockTypeChange(blockId, type.id)}
          >
            {type.icon}
            {type.label}
          </Button>
        ))}
        <div className="px-2 pt-2 border-t mt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-center w-full text-destructive"
            onClick={() => handleDeleteBlock(blockId)}
          >
            Excluir
          </Button>
        </div>
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddBlock(blockId);
    } else if (e.key === 'Backspace' && 
               (e.currentTarget as HTMLDivElement).textContent === '' && 
               blocks.length > 1) {
      e.preventDefault();
      handleDeleteBlock(blockId);
      
      // Focus previous block if exists
      if (index > 0) {
        const prevBlockId = blocks[index - 1].id;
        setTimeout(() => {
          const prevBlock = document.getElementById(prevBlockId);
          if (prevBlock) {
            setActiveBlockId(prevBlockId);
            prevBlock.focus();
          }
        }, 10);
      }
    }
  };

  const renderBlock = (block: Block, index: number) => {
    let blockClassName = 'outline-none w-full p-1 my-0.5 rounded-md';
    let blockElement;

    if (activeBlockId === block.id) {
      blockClassName += ' bg-muted/50';
    }

    const placeholderText = block.content ? '' : getPlaceholderForBlockType(block.type, index === 0);

    switch (block.type) {
      case 'heading-1':
        blockElement = (
          <h1 
            id={block.id}
            className={`${blockClassName} text-3xl font-bold`}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
            onKeyDown={(e) => handleKeyDown(e, block.id, index)}
            dangerouslySetInnerHTML={{ __html: block.content }}
            data-placeholder={placeholderText}
          />
        );
        break;
      case 'heading-2':
        blockElement = (
          <h2 
            id={block.id}
            className={`${blockClassName} text-2xl font-bold`}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
            onKeyDown={(e) => handleKeyDown(e, block.id, index)}
            dangerouslySetInnerHTML={{ __html: block.content }}
            data-placeholder={placeholderText}
          />
        );
        break;
      case 'heading-3':
        blockElement = (
          <h3 
            id={block.id}
            className={`${blockClassName} text-xl font-bold`}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
            onKeyDown={(e) => handleKeyDown(e, block.id, index)}
            dangerouslySetInnerHTML={{ __html: block.content }}
            data-placeholder={placeholderText}
          />
        );
        break;
      case 'bullet-list':
        blockElement = (
          <div className="flex">
            <div className="mt-1.5 mr-2">•</div>
            <div 
              id={block.id}
              className={blockClassName}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyDown(e, block.id, index)}
              dangerouslySetInnerHTML={{ __html: block.content }}
              data-placeholder={placeholderText}
            />
          </div>
        );
        break;
      case 'numbered-list':
        blockElement = (
          <div className="flex">
            <div className="mt-1 mr-2">{index + 1}.</div>
            <div 
              id={block.id}
              className={blockClassName}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyDown(e, block.id, index)}
              dangerouslySetInnerHTML={{ __html: block.content }}
              data-placeholder={placeholderText}
            />
          </div>
        );
        break;
      case 'todo-list':
        blockElement = (
          <div className="flex items-start">
            <input 
              type="checkbox" 
              className="mt-1.5 mr-2" 
              checked={block.content.includes('[x]')}
              onChange={(e) => {
                const newContent = e.target.checked 
                  ? block.content.replace(/\[ \]/, '[x]') || '[x]' 
                  : block.content.replace(/\[x\]/, '[ ]') || '[ ]';
                handleBlockContentChange(block.id, newContent);
              }}
              disabled={readOnly}
            />
            <div 
              id={block.id}
              className={blockClassName}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyDown(e, block.id, index)}
              dangerouslySetInnerHTML={{ __html: block.content.replace(/\[x\]|\[ \]/g, '') }}
              data-placeholder={placeholderText}
            />
          </div>
        );
        break;
      case 'code':
        blockElement = (
          <pre>
            <code 
              id={block.id}
              className={`${blockClassName} font-mono bg-muted p-2 block`}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyDown(e, block.id, index)}
              dangerouslySetInnerHTML={{ __html: block.content }}
              data-placeholder={placeholderText}
            />
          </pre>
        );
        break;
      default:
        blockElement = (
          <p 
            id={block.id}
            className={blockClassName}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
            onKeyDown={(e) => handleKeyDown(e, block.id, index)}
            dangerouslySetInnerHTML={{ __html: block.content }}
            data-placeholder={placeholderText}
          />
        );
    }

    return (
      <div 
        key={block.id} 
        className="group relative flex"
        onMouseEnter={() => !readOnly && setShowAddButton(block.id)}
        onMouseLeave={() => !readOnly && setShowAddButton(null)}
        onClick={() => setActiveBlockId(block.id)}
      >
        {!readOnly && (
          <div className="absolute left-0 top-1/2 -translate-x-[calc(100%+4px)] -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {renderBlockType(block.type)}
                </Button>
              </PopoverTrigger>
              <PopoverContent side="left" className="w-52 p-1">
                <ScrollArea className="h-[300px]">
                  {renderBlockTypeOptions(block.id, block.type)}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <div className="flex-1">
          {blockElement}
        </div>
        
        {!readOnly && showAddButton === block.id && (
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background border-primary"
              onClick={() => handleAddBlock(block.id)}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const getPlaceholderForBlockType = (type: string, isFirst: boolean): string => {
    if (isFirst) {
      return 'Digite um título ou escreva algo...';
    }
    
    switch (type) {
      case 'heading-1':
      case 'heading-2':
      case 'heading-3':
        return 'Título';
      case 'bullet-list':
      case 'numbered-list':
        return 'Item da lista';
      case 'todo-list':
        return 'Item da tarefa';
      case 'code':
        return 'Digite ou cole o código...';
      default:
        return 'Digite algo...';
    }
  };

  return (
    <div 
      ref={editorRef}
      className="py-2 px-10 relative w-full max-w-4xl mx-auto"
      style={{
        '--placeholder-color': 'rgba(142, 142, 160, 0.5)'
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: var(--placeholder-color);
            font-style: italic;
          }
        `
      }} />
      
      {blocks.length === 0 && !readOnly ? (
        <div 
          className="border border-dashed border-muted-foreground p-8 rounded-lg text-center cursor-pointer"
          onClick={() => {
            const newBlock: Block = {
              id: `block-${Date.now()}`,
              type: 'paragraph',
              content: '',
              children: []
            };
            onChange([newBlock]);
          }}
        >
          <p className="text-muted-foreground">Clique para adicionar conteúdo</p>
        </div>
      ) : (
        blocks.map(renderBlock)
      )}
    </div>
  );
};

export default BlockEditor;