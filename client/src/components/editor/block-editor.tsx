import React, { useState, useRef, KeyboardEvent } from 'react';
import { PlusCircle, Heading1, Heading2, Heading3, List, ListOrdered, Table, Image, Check, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Tipos de blocos suportados pelo editor
export type BlockType = 
  | 'paragraph' 
  | 'heading-1' 
  | 'heading-2' 
  | 'heading-3' 
  | 'bullet-list' 
  | 'numbered-list'
  | 'to-do'
  | 'table'
  | 'image'
  | 'calendar'
  | 'file';

// Interface para blocos
export interface Block {
  id: string;
  type: BlockType;
  content: string;
  completed?: boolean; // Para to-do lists
  children?: Block[];
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [addingBlockAt, setAddingBlockAt] = useState<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Gerar ID único para novos blocos
  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Adicionar um novo bloco após o bloco com ID específico
  const addBlock = (afterId: string, type: BlockType = 'paragraph') => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: '',
      children: type === 'bullet-list' || type === 'numbered-list' ? [{ id: generateId(), type, content: '', children: [] }] : []
    };

    const newBlocks = [...blocks];
    const idx = newBlocks.findIndex(b => b.id === afterId);
    
    if (idx !== -1) {
      newBlocks.splice(idx + 1, 0, newBlock);
      onChange(newBlocks);
      
      // Focar no novo bloco após renderização
      setTimeout(() => {
        const element = blockRefs.current[newBlock.id];
        if (element) {
          element.focus();
        }
      }, 0);
    }
  };

  // Remover um bloco pelo ID
  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return; // Manter pelo menos um bloco
    
    const newBlocks = blocks.filter(b => b.id !== id);
    onChange(newBlocks);
    
    // Focar no bloco anterior
    const idx = blocks.findIndex(b => b.id === id);
    if (idx > 0) {
      setTimeout(() => {
        const prevBlock = blocks[idx - 1];
        const element = blockRefs.current[prevBlock.id];
        if (element) {
          element.focus();
        }
      }, 0);
    }
  };

  // Atualizar o conteúdo de um bloco
  const updateBlockContent = (id: string, content: string) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    onChange(newBlocks);
  };

  // Alternar o estado de conclusão de um bloco to-do
  const toggleTodoCompleted = (id: string) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, completed: !block.completed } : block
    );
    onChange(newBlocks);
  };

  // Alternar o tipo de um bloco
  const changeBlockType = (id: string, newType: BlockType) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, type: newType } : block
    );
    onChange(newBlocks);
    setAddingBlockAt(null);
  };

  // Manipular teclas especiais (Enter, Backspace, etc.)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    // Enter: criar novo bloco
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockId);
    }
    
    // Backspace: remover bloco vazio
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      removeBlock(blockId);
    }
    
    // Slash: mostrar menu de tipos de bloco
    if (e.key === '/' && block.content === '') {
      e.preventDefault();
      setAddingBlockAt(blockId);
    }
  };

  return (
    <div className="block-editor max-w-3xl mx-auto">
      {blocks.map(block => (
        <div 
          key={block.id} 
          className={`block-container relative group mb-1 p-1 rounded hover:bg-gray-50 ${focusedBlockId === block.id ? 'bg-gray-50' : ''}`}
        >
          {/* Botão para adicionar bloco (visível ao passar o mouse) */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Popover open={addingBlockAt === block.id} onOpenChange={(open) => !open && setAddingBlockAt(null)}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setAddingBlockAt(block.id)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start">
                <div className="grid gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'paragraph')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Texto
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'heading-1')}
                  >
                    <Heading1 className="mr-2 h-4 w-4" />
                    Título 1
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'heading-2')}
                  >
                    <Heading2 className="mr-2 h-4 w-4" />
                    Título 2
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'heading-3')}
                  >
                    <Heading3 className="mr-2 h-4 w-4" />
                    Título 3
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'bullet-list')}
                  >
                    <List className="mr-2 h-4 w-4" />
                    Lista com marcadores
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'numbered-list')}
                  >
                    <ListOrdered className="mr-2 h-4 w-4" />
                    Lista numerada
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'to-do')}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Lista de afazeres
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'table')}
                  >
                    <Table className="mr-2 h-4 w-4" />
                    Tabela
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'image')}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Imagem
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex justify-start"
                    onClick={() => changeBlockType(block.id, 'calendar')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendário
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Renderização do bloco baseado no tipo */}
          <div className="block-content ml-2">
            {block.type === 'paragraph' && (
              <div
                ref={el => blockRefs.current[block.id] = el}
                contentEditable
                suppressContentEditableWarning
                className="outline-none py-1 px-2"
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                onKeyDown={e => handleKeyDown(e, block.id)}
                onInput={e => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{ __html: block.content || 'Digite algo...' }}
              />
            )}

            {block.type === 'heading-1' && (
              <div
                ref={el => blockRefs.current[block.id] = el}
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-3xl font-bold py-1 px-2"
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                onKeyDown={e => handleKeyDown(e, block.id)}
                onInput={e => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{ __html: block.content || 'Título 1' }}
              />
            )}

            {block.type === 'heading-2' && (
              <div
                ref={el => blockRefs.current[block.id] = el}
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-2xl font-bold py-1 px-2"
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                onKeyDown={e => handleKeyDown(e, block.id)}
                onInput={e => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{ __html: block.content || 'Título 2' }}
              />
            )}

            {block.type === 'heading-3' && (
              <div
                ref={el => blockRefs.current[block.id] = el}
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-xl font-bold py-1 px-2"
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                onKeyDown={e => handleKeyDown(e, block.id)}
                onInput={e => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                dangerouslySetInnerHTML={{ __html: block.content || 'Título 3' }}
              />
            )}

            {block.type === 'bullet-list' && (
              <div className="flex items-start pl-2">
                <span className="mt-2 mr-2">•</span>
                <div
                  ref={el => blockRefs.current[block.id] = el}
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none py-1 px-2 flex-1"
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  onKeyDown={e => handleKeyDown(e, block.id)}
                  onInput={e => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                  dangerouslySetInnerHTML={{ __html: block.content || 'Item da lista' }}
                />
              </div>
            )}

            {block.type === 'numbered-list' && (
              <div className="flex items-start pl-2">
                <span className="mt-2 mr-2">1.</span>
                <div
                  ref={el => blockRefs.current[block.id] = el}
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none py-1 px-2 flex-1"
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  onKeyDown={e => handleKeyDown(e, block.id)}
                  onInput={e => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                  dangerouslySetInnerHTML={{ __html: block.content || 'Item da lista' }}
                />
              </div>
            )}

            {block.type === 'to-do' && (
              <div className="flex items-start pl-2">
                <input 
                  type="checkbox" 
                  className="mt-2 mr-2" 
                  checked={block.completed || false}
                  onChange={() => toggleTodoCompleted(block.id)}
                />
                <div
                  ref={el => blockRefs.current[block.id] = el}
                  contentEditable
                  suppressContentEditableWarning
                  className={`outline-none py-1 px-2 flex-1 ${block.completed ? 'line-through text-gray-400' : ''}`}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  onKeyDown={e => handleKeyDown(e, block.id)}
                  onInput={e => updateBlockContent(block.id, e.currentTarget.textContent || '')}
                  dangerouslySetInnerHTML={{ __html: block.content || 'Tarefa a fazer' }}
                />
              </div>
            )}

            {block.type === 'table' && (
              <div className="py-2">
                <div className="border rounded overflow-hidden my-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coluna 1</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coluna 2</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coluna 3</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Célula 1</td>
                        <td className="px-6 py-4 whitespace-nowrap">Célula 2</td>
                        <td className="px-6 py-4 whitespace-nowrap">Célula 3</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Célula 4</td>
                        <td className="px-6 py-4 whitespace-nowrap">Célula 5</td>
                        <td className="px-6 py-4 whitespace-nowrap">Célula 6</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {block.type === 'image' && (
              <div className="py-2 px-2">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <p className="text-gray-500">Clique para adicionar uma imagem</p>
                </div>
              </div>
            )}

            {block.type === 'calendar' && (
              <div className="py-2 px-2">
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h3 className="text-gray-700 font-medium">Maio 2025</h3>
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                      <div key={day} className="bg-gray-50 text-center py-2 text-xs text-gray-500">{day}</div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => (
                      <div key={i} className="bg-white h-16 p-1">
                        <span className="text-xs">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Botão para adicionar bloco no final */}
      <div className="flex justify-center mt-4">
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center text-gray-500 hover:text-gray-700"
          onClick={() => addBlock(blocks[blocks.length - 1].id)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Adicionar bloco
        </Button>
      </div>
    </div>
  );
}