import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { PlusCircle, X, Check, FileText, ListTodo, Link as LinkIcon, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Block } from '@shared/schema';

export function QuickCapture() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Set up keyboard shortcut (Ctrl+Space) to open quick capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus textarea when opened
  useEffect(() => {
    if (open && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.focus();
      }, 50);
    }
  }, [open, activeTab]);

  // Query mutation for creating a note
  const createNoteMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; tags: string[] }) => {
      const blocks: Block[] = [
        {
          id: `block-${Date.now()}-1`,
          type: 'heading-1',
          content: data.title,
          children: []
        },
        {
          id: `block-${Date.now()}-2`,
          type: 'paragraph',
          content: data.content,
          children: []
        }
      ];

      const payload = {
        title: data.title,
        blocks: JSON.stringify(blocks),
        tags: data.tags,
        emoji: '📝'
      };

      const response = await apiRequest('POST', '/api/documents', payload);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Nota criada',
        description: 'Sua nota foi criada com sucesso.'
      });
      resetForm();
      setOpen(false);
      // Navigate to the new document
      setLocation(`/documents/${data.id}`);
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a nota.',
        variant: 'destructive'
      });
    }
  });

  // Query mutation for creating a task
  const createTaskMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; tags: string[] }) => {
      const payload = {
        title: data.title,
        description: data.content,
        tags: data.tags,
        status: 'todo'
      };

      const response = await apiRequest('POST', '/api/tasks', payload);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: 'Tarefa criada',
        description: 'Sua tarefa foi criada com sucesso.'
      });
      resetForm();
      setOpen(false);
      // Navigate to the tasks page
      setLocation('/tasks');
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a tarefa.',
        variant: 'destructive'
      });
    }
  });

  // Query mutation for saving a bookmark
  const saveBookmarkMutation = useMutation({
    mutationFn: async (data: { title: string; url: string; tags: string[] }) => {
      const payload = {
        title: data.title,
        url: data.url,
        tags: data.tags
      };

      const response = await apiRequest('POST', '/api/bookmarks', payload);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      toast({
        title: 'Link salvo',
        description: 'Seu link foi salvo com sucesso.'
      });
      resetForm();
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o link.',
        variant: 'destructive'
      });
    }
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setUrl('');
    setTags([]);
    setTagInput('');
  };

  const handleSubmit = () => {
    switch (activeTab) {
      case 'note':
        if (title.trim() === '') {
          toast({
            title: 'Título obrigatório',
            description: 'Por favor, adicione um título para sua nota.',
            variant: 'destructive'
          });
          return;
        }
        createNoteMutation.mutate({ title, content, tags });
        break;
      case 'task':
        if (title.trim() === '') {
          toast({
            title: 'Título obrigatório',
            description: 'Por favor, adicione um título para sua tarefa.',
            variant: 'destructive'
          });
          return;
        }
        createTaskMutation.mutate({ title, content, tags });
        break;
      case 'link':
        if (url.trim() === '') {
          toast({
            title: 'URL obrigatória',
            description: 'Por favor, adicione uma URL para seu link.',
            variant: 'destructive'
          });
          return;
        }
        saveBookmarkMutation.mutate({ title: title || url, url, tags });
        break;
    }
  };

  const isLoading = createNoteMutation.isPending || createTaskMutation.isPending || saveBookmarkMutation.isPending;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
              <PlusCircle className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Captura Rápida</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="note" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Nota</span>
                </TabsTrigger>
                <TabsTrigger value="task" className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  <span>Tarefa</span>
                </TabsTrigger>
                <TabsTrigger value="link" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>Link</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-4 mt-4">
                {/* Title Field - All tabs */}
                <div>
                  <Input
                    placeholder={activeTab === 'link' ? 'Título (opcional)' : 'Título'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                {/* Link Tab URL */}
                {activeTab === 'link' && (
                  <div>
                    <Input
                      placeholder="URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                )}
                
                {/* Content Field - Note & Task tabs */}
                {(activeTab === 'note' || activeTab === 'task') && (
                  <div>
                    <Textarea
                      ref={contentRef}
                      placeholder={activeTab === 'note' ? 'Conteúdo da nota...' : 'Descrição da tarefa...'}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                )}
                
                {/* Tags */}
                <div>
                  <div className="flex">
                    <Input
                      placeholder="Adicionar tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addTag}
                      className="ml-2"
                    >
                      Adicionar
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(tag => (
                        <div
                          key={tag}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          <span>#{tag}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 rounded-full"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Salvar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Keyboard Shortcut Hint */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-6 left-6 z-50 rounded-full h-10 w-10 bg-card/80 backdrop-blur-sm hidden md:flex"
          >
            <span className="font-mono text-xs">⌘ ␣</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Captura Rápida</h4>
            <p className="text-sm text-muted-foreground">
              Pressione <span className="bg-muted px-2 py-1 rounded text-xs font-mono">Ctrl + Espaço</span> em qualquer lugar do app para abrir a captura rápida.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
} 