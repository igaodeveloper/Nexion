import React, { useState, useRef, useEffect } from 'react';
import { Block } from '@shared/schema';
import { PlusIcon, MoreHorizontal, AlignLeft, Heading1, Heading2, Heading3, ListOrdered, ListTodo, List, Image, Code, Table, PlusCircle, Trash2, ChevronUp, ChevronDown, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLinkDetection, SmartLinks } from './smart-links';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
}

export default function BlockEditor({ blocks, onChange, readOnly = false }: BlockEditorProps) {
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [showAddButton, setShowAddButton] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [showSmartLinks, setShowSmartLinks] = useState(false);
  const [smartLinkPosition, setSmartLinkPosition] = useState({ top: 0, left: 0 });

  const handleBlockContentChange = (id: string, content: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    onChange(updatedBlocks);
  };

  const handleAddBlock = (afterId: string) => {
    const index = blocks.findIndex(block => block.id === afterId);
    if (index === -1) return;

    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: 'paragraph',
      content: '',
      children: []
    };

    const newBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1)
    ];

    onChange(newBlocks);
    
    // Focus the new block after render
    setTimeout(() => {
      const blockElement = document.getElementById(newBlock.id);
      if (blockElement) {
        blockElement.focus();
      }
    }, 0);
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    const newBlocks = blocks.filter(block => block.id !== id);
    onChange(newBlocks);
  };

  const handleChangeBlockType = (blockId: string, newType: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, type: newType } : block
    );
    onChange(updatedBlocks);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, block: Block, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddBlock(block.id);
    } else if (e.key === 'Backspace' && 
               (e.currentTarget as HTMLDivElement).textContent === '' && 
               blocks.length > 1) {
      e.preventDefault();
      handleDeleteBlock(block.id);
      
      // Focus previous block if exists
      if (index > 0) {
        const prevBlockId = blocks[index - 1].id;
        setTimeout(() => {
          const prevBlock = document.getElementById(prevBlockId);
          if (prevBlock) {
            prevBlock.focus();
          }
        }, 0);
      }
    }
    
    // Detect text selection and suggest links (Cmd+K or Ctrl+K)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !readOnly) {
      e.preventDefault();
      
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const selectedText = selection.toString().trim();
        
        // Get the position of the selection for the popover
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(selectedText);
        setSelectedBlock(block.id);
        setSmartLinkPosition({
          top: rect.top + window.scrollY + rect.height,
          left: rect.left + window.scrollX
        });
        setShowSmartLinks(true);
      }
    }
  };

  // Function to create a link in a block's content
  const createLink = (documentId: number, documentTitle: string, anchorText: string) => {
    if (!selectedBlock) return;
    
    const updatedBlocks = blocks.map(block => {
      if (block.id === selectedBlock) {
        // Create a markdown-style link
        const linkText = `[${anchorText}](/documents/${documentId})`;
        
        // Replace the selected text with the link
        const newContent = block.content.replace(anchorText, linkText);
        
        return {
          ...block,
          content: newContent
        };
      }
      return block;
    });
    
    onChange(updatedBlocks);
    setShowSmartLinks(false);
  };

  // Render the appropriate block type icon
  const renderBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'paragraph': return <AlignLeft className="h-4 w-4" />;
      case 'heading-1': return <Heading1 className="h-4 w-4" />;
      case 'heading-2': return <Heading2 className="h-4 w-4" />;
      case 'heading-3': return <Heading3 className="h-4 w-4" />;
      case 'bullet-list': return <List className="h-4 w-4" />;
      case 'numbered-list': return <ListOrdered className="h-4 w-4" />;
      case 'todo-list': return <ListTodo className="h-4 w-4" />;
      case 'code': return <Code className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'table': return <Table className="h-4 w-4" />;
      default: return <AlignLeft className="h-4 w-4" />;
    }
  };

  // Block type options
  const blockTypeOptions = [
    { type: 'paragraph', label: 'Text', icon: <AlignLeft className="h-4 w-4 mr-2" /> },
    { type: 'heading-1', label: 'Heading 1', icon: <Heading1 className="h-4 w-4 mr-2" /> },
    { type: 'heading-2', label: 'Heading 2', icon: <Heading2 className="h-4 w-4 mr-2" /> },
    { type: 'heading-3', label: 'Heading 3', icon: <Heading3 className="h-4 w-4 mr-2" /> },
    { type: 'bullet-list', label: 'Bullet List', icon: <List className="h-4 w-4 mr-2" /> },
    { type: 'numbered-list', label: 'Numbered List', icon: <ListOrdered className="h-4 w-4 mr-2" /> },
    { type: 'todo-list', label: 'Todo List', icon: <ListTodo className="h-4 w-4 mr-2" /> },
    { type: 'code', label: 'Code', icon: <Code className="h-4 w-4 mr-2" /> }
  ];
  
  // Block type menu
  const renderBlockTypeMenu = (blockId: string, currentType: string) => (
    <div className="space-y-1 p-1">
      {blockTypeOptions.map(option => (
        <Button
          key={option.type}
          variant={currentType === option.type ? "secondary" : "ghost"}
          className="w-full justify-start text-sm"
          onClick={() => handleChangeBlockType(blockId, option.type)}
        >
          {option.icon}
          {option.label}
        </Button>
      ))}
    </div>
  );

  // Check for potential links using the useLinkDetection hook
  const detectLinksForBlock = (block: Block) => {
    const potentialLinks = useLinkDetection(block.content, !readOnly);
    
    if (potentialLinks && potentialLinks.length > 0) {
      // Show a suggestion indicator next to blocks with potential links
      return (
        <div className="absolute -left-10 top-1/2 transform -translate-y-1/2">
          <button 
            className="p-1 rounded-full text-primary hover:bg-primary/10"
            onClick={() => {
              // Suggest linking the first potential match
              setSelectedText(potentialLinks[0]);
              setSelectedBlock(block.id);
              
              // Position next to the block
              const blockElement = document.getElementById(block.id);
              if (blockElement) {
                const rect = blockElement.getBoundingClientRect();
                setSmartLinkPosition({
                  top: rect.top + window.scrollY,
                  left: rect.left + window.scrollX - 20
                });
                setShowSmartLinks(true);
              }
            }}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>
      );
    }
    
    return null;
  };

  // Block rendering
  const renderBlock = (block: Block, index: number) => {
    let className = "p-2 rounded-md focus:outline-none mb-1 w-full";
    let placeholderText = "Type '/' for commands...";
    
    // Adjust styling based on block type
    switch (block.type) {
      case 'heading-1':
        className += " text-3xl font-bold";
        placeholderText = "Heading 1";
        break;
      case 'heading-2':
        className += " text-2xl font-bold";
        placeholderText = "Heading 2";
        break;
      case 'heading-3':
        className += " text-xl font-bold";
        placeholderText = "Heading 3";
        break;
      case 'bullet-list':
        className += " ml-5 list-disc";
        placeholderText = "List item";
        break;
      case 'numbered-list':
        className += " ml-5 list-decimal";
        placeholderText = "List item";
        break;
      case 'todo-list':
        className += " ml-5 flex items-start";
        placeholderText = "To-do item";
        break;
      case 'code':
        className += " font-mono bg-muted p-3 rounded";
        placeholderText = "Code block";
        break;
    }

    return (
      <div 
        key={block.id} 
        className="relative group"
        onMouseEnter={() => setShowAddButton(block.id)}
        onMouseLeave={() => setShowAddButton(null)}
        id={`block-wrapper-${block.id}`}
      >
        {!readOnly && detectLinksForBlock(block)}
        
        <div className="flex">
          {block.type === 'todo-list' && (
            <div className="mr-2 mt-[0.4rem]">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300"
                checked={block.content.startsWith('[x]')}
                onChange={() => {
                  const isChecked = block.content.startsWith('[x]');
                  const newContent = isChecked 
                    ? block.content.replace('[x]', '[ ]') 
                    : block.content.replace(/^\[ \]|^/, '[ ]');
                  handleBlockContentChange(block.id, newContent);
                }}
                disabled={readOnly}
              />
            </div>
          )}
          
          <div
            id={block.id}
            className={className}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onFocus={() => setActiveBlock(block.id)}
            onBlur={() => setActiveBlock(null)}
            onInput={(e) => handleBlockContentChange(block.id, e.currentTarget.textContent || '')}
            onKeyDown={(e) => handleKeyDown(e, block, index)}
            dangerouslySetInnerHTML={{ __html: block.content }}
            data-placeholder={placeholderText}
            style={{ minHeight: '1.5rem' }}
          />
        </div>
        
        {/* Block controls */}
        {!readOnly && showAddButton === block.id && (
          <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                  {renderBlockTypeIcon(block.type)}
                </Button>
              </PopoverTrigger>
              <PopoverContent side="left" align="start" className="w-48 p-1">
                {renderBlockTypeMenu(block.id, block.type)}
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        {/* Add button between blocks */}
        {!readOnly && showAddButton === block.id && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 -top-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background border shadow-sm"
              onClick={() => handleAddBlock(block.id)}
            >
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={editorRef} className="relative min-h-[200px]">
      {blocks.map(renderBlock)}
      
      {!readOnly && (
        <button
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mt-4"
          onClick={() => handleAddBlock(blocks[blocks.length - 1].id)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add block
        </button>
      )}
      
      {/* Smart Links component */}
      {showSmartLinks && (
        <div 
          style={{ 
            position: 'absolute', 
            top: smartLinkPosition.top, 
            left: smartLinkPosition.left,
            zIndex: 100 
          }}
        >
          <SmartLinks 
            text={selectedText} 
            onCreateLink={createLink}
            onClose={() => setShowSmartLinks(false)}
          />
        </div>
      )}
    </div>
  );
}