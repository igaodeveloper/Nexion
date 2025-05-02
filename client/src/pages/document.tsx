import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Document } from '@shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import PageEditor, { Page } from '@/components/editor/page-editor';
import { TemplateGallery, Template } from '@/components/template-gallery';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { CommentList } from '@/components/comments/comment-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, FileText, Save, BookText, Share2, MoreHorizontal, Clock, 
  Users, Star, Download, Printer, History, Tag, ArrowLeft, File, 
  Trash2, Lock, Settings, LayoutGrid, Settings2, User, Copy, Bookmark
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function DocumentPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("document");
  const [documentPermission, setDocumentPermission] = useState<'private' | 'shared'>('private');

  // Fetch document if we have an ID
  const { data: document, isLoading, error } = useQuery<Document>({
    queryKey: id ? ['/api/documents', parseInt(id)] : [],
    enabled: !!id,
  });

  // Fetch recent viewers (example data for now)
  const recentViewers = [
    { id: 1, name: 'John Doe', avatar: '/avatars/user-1.png' },
    { id: 2, name: 'Jane Smith', avatar: '/avatars/user-2.png' },
    { id: 3, name: 'Alex Johnson', avatar: '/avatars/user-3.png' }
  ];

  // Create thumbnail from document content
  const generateThumbnail = async () => {
    try {
      // Target the content area to capture
      if (!editorContainerRef.current) return null;
      
      // Capture the element as canvas and convert to base64 image
      const canvas = await html2canvas(editorContainerRef.current, {
        scale: 0.25, // Scale down for thumbnail size
        logging: false,
        useCORS: true,
      });
      
      return canvas.toDataURL('image/jpeg', 0.7);
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return null;
    }
  };

  // Create version history when updating document
  const createVersionMutation = useMutation({
    mutationFn: async ({ docId, page, thumbnail }: { docId: number, page: Page, thumbnail: string | null }) => {
      const versionData = {
        documentId: docId,
        blocks: JSON.stringify(page.blocks),
        title: page.title,
        emoji: page.emoji,
        coverImage: page.coverImage,
        thumbnail: thumbnail
      };
      
      const response = await apiRequest('POST', `/api/documents/${docId}/versions`, versionData);
      return await response.json();
    }
  });

  // Create new document mutation
  const createMutation = useMutation({
    mutationFn: async (newPage: Page) => {
      const response = await apiRequest('POST', '/api/documents', newPage);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Sucesso',
        description: 'Documento criado com sucesso!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setLocation(`/documents/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Falha ao criar documento',
        variant: 'destructive',
      });
    }
  });

  // Update existing document mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedPage: Page) => {
      const response = await apiRequest('PATCH', `/api/documents/${id}`, updatedPage);
      return await response.json();
    },
    onSuccess: async (data, variables) => {
      toast({
        title: 'Sucesso',
        description: 'Documento atualizado com sucesso!',
      });
      
      // Create a version history entry
      if (id) {
        try {
          // Generate thumbnail from the document content
          const thumbnail = await generateThumbnail();
          
          // Save version history
          await createVersionMutation.mutateAsync({
            docId: parseInt(id),
            page: variables,
            thumbnail
          });
        } catch (versionError) {
          console.error('Failed to create version history:', versionError);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/documents', parseInt(id!)] });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar documento',
        variant: 'destructive',
      });
    }
  });

  const handleSelectTemplate = (template: Template) => {
    // Create a new document based on selected template
    const newPage: Page = {
      title: template.title,
      blocks: [
        {
          id: `block-${Date.now()}-1`,
          type: 'heading-1',
          content: template.title,
          children: []
        },
        {
          id: `block-${Date.now()}-2`,
          type: 'paragraph',
          content: template.description,
          children: []
        }
      ],
      emoji: '📄'
    };
    
    createMutation.mutate(newPage);
    setShowTemplateGallery(false);
  };

  const handleUpdatePage = (updatedPage: Page) => {
    if (id) {
      updateMutation.mutate(updatedPage);
    } else {
      createMutation.mutate(updatedPage);
    }
  };

  const toggleDocumentFavorite = () => {
    if (!document || !id) return;
    
    // Update document to toggle favorite status
    const updatedPage: Page = {
      ...document,
      id: document.id,
      title: document.title || 'Untitled',
      blocks: document.blocks ? JSON.parse(document.blocks as string) : [],
      emoji: document.emoji,
      coverImage: document.coverImage,
      isFavorite: !document.isFavorite
    };
    
    updateMutation.mutate(updatedPage);
  };

  // If loading, show skeleton
  if (id && isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="space-y-2 max-w-4xl mx-auto w-full">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  // If error loading document, show error
  if (id && error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-4">
        <div className="text-destructive mb-4">
          <File className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Erro ao carregar documento</h1>
          <p className="text-muted-foreground mb-6">Não foi possível carregar o documento solicitado.</p>
        </div>
        <Button onClick={() => setLocation('/documents')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  // If no ID or document found, and we're not showing template gallery, create a new empty document
  if (!id && !showTemplateGallery) {
    const emptyPage: Page = {
      title: 'Sem título',
      blocks: [
        {
          id: `block-${Date.now()}`,
          type: 'paragraph',
          content: '',
          children: []
        }
      ]
    };

    return (
      <div className="flex flex-col min-h-screen bg-background editor-content" ref={editorContainerRef}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setLocation('/documents')} size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-medium">Novo Documento</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => setShowTemplateGallery(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Escolher Modelo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Escolha um modelo pré-definido
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button 
              variant="default"
              disabled={createMutation.isPending}
              onClick={() => handleUpdatePage(emptyPage)}
            >
              {createMutation.isPending ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
        <PageEditor
          page={emptyPage}
          onSave={handleUpdatePage}
          isLoading={createMutation.isPending}
        />
      </div>
    );
  }

  // If showing template gallery
  if (showTemplateGallery) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setShowTemplateGallery(false)} size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold">Galeria de Modelos</h2>
        </div>
        <TemplateGallery onSelectTemplate={handleSelectTemplate} />
      </div>
    );
  }

  // Otherwise, show the document editor with comments and properties
  return (
    <div className="editor-container" ref={editorContainerRef}>
      {document?.id ? (
        <div className="flex flex-col min-h-screen">
          {/* Document Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => setLocation('/documents')} size="icon" className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center mr-4">
                {document.emoji && (
                  <span className="text-2xl mr-2">{document.emoji}</span>
                )}
                <h2 className="text-xl font-medium truncate max-w-md">
                  {document.title || 'Sem título'}
                </h2>
              </div>

              <div className="hidden sm:flex items-center space-x-1">
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Editado {new Date(document.updatedAt).toLocaleDateString('pt-BR')}
                </Badge>
                
                <Badge variant={documentPermission === 'private' ? 'secondary' : 'outline'} className="text-xs">
                  {documentPermission === 'private' ? (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Privado
                    </>
                  ) : (
                    <>
                      <Users className="h-3 w-3 mr-1" />
                      Compartilhado
                    </>
                  )}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Version history button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Histórico de versões
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Share button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Compartilhar documento
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Favorite button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={toggleDocumentFavorite}
                      className={document.isFavorite ? "text-amber-500" : ""}
                    >
                      <Star className="h-4 w-4" fill={document.isFavorite ? "currentColor" : "none"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {document.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Save button */}
              <Button 
                variant={updateMutation.isPending ? "secondary" : "default"}
                disabled={updateMutation.isPending}
                onClick={() => {
                  if (document) {
                    const currentPage: Page = {
                      id: document.id,
                      title: document.title || 'Sem título',
                      blocks: document.blocks ? JSON.parse(document.blocks as string) : [],
                      emoji: document.emoji,
                      coverImage: document.coverImage,
                      isFavorite: document.isFavorite,
                      isStarred: document.isStarred,
                      organizationId: document.organizationId,
                      createdBy: document.createdBy,
                    };
                    handleUpdatePage(currentPage);
                  }
                }}
                className="flex items-center gap-1"
              >
                {updateMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </>
                )}
              </Button>
              
              {/* More actions dropdown */}
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      Mais ações
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar documento
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Adicionar tags
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir documento
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 p-4">
            <div className="flex-1">
              <PageEditor
                page={{
                  id: document?.id,
                  title: document?.title || 'Sem título',
                  blocks: document?.blocks ? JSON.parse(document.blocks as string) : [],
                  emoji: document?.emoji,
                  coverImage: document?.coverImage,
                  isFavorite: document?.isFavorite,
                  isStarred: document?.isStarred,
                  organizationId: document?.organizationId,
                  createdBy: document?.createdBy,
                  parentId: document?.parentId
                }}
                onSave={handleUpdatePage}
                isLoading={updateMutation.isPending}
              />
            </div>
            
            <div className="w-full lg:w-80 shrink-0 space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="document" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Detalhes</span>
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Comentários</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="document" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <BookText className="h-5 w-5 mr-2" />
                        Propriedades do Documento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Criado em</div>
                          <div className="font-medium flex items-center gap-1">
                            <span>{new Date(document.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Modificado</div>
                          <div className="font-medium">
                            {new Date(document.updatedAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Visibilidade</div>
                        <Badge variant={documentPermission === 'private' ? 'secondary' : 'outline'} className="text-xs">
                          {documentPermission === 'private' ? (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Privado
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3 mr-1" />
                              Compartilhado
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Proprietário</div>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="/avatar-placeholder.png" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Você</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Visualizações recentes</div>
                        <div className="flex -space-x-2">
                          {recentViewers.map(viewer => (
                            <TooltipProvider key={viewer.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="h-8 w-8 border-2 border-background">
                                    <AvatarImage src={viewer.avatar} />
                                    <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {viewer.name}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                        <Settings2 className="h-4 w-4" />
                        Configurações avançadas
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <LayoutGrid className="h-5 w-5 mr-2" />
                        Documentos relacionados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm text-muted-foreground text-center py-2">
                        Nenhum documento relacionado ainda.
                      </div>
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Vincular documento
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comments" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Discussão
                      </CardTitle>
                      <CardDescription>
                        Comentários e feedback sobre este documento
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CommentList documentId={document.id} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <PageEditor
          page={{
            title: 'Sem título',
            blocks: [],
            emoji: '📄'
          }}
          onSave={handleUpdatePage}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
}