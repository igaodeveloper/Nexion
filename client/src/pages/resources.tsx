import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Resource, ResourceFolder } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileIcon, 
  FolderIcon, 
  ImageIcon, 
  FileTextIcon, 
  FileAudioIcon, 
  FileVideoIcon, 
  LinkIcon, 
  MoreVertical,
  PlusIcon,
  UploadIcon,
  SearchIcon,
  Download,
  Edit,
  Trash,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResourcesPage() {
  const { toast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [uploadLink, setUploadLink] = useState('');
  const [uploadLinkName, setUploadLinkName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Fetch resources and folders
  const { data: resources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources', selectedFolder, searchQuery],
  });

  const { data: folders, isLoading: foldersLoading } = useQuery<ResourceFolder[]>({
    queryKey: ['/api/resource-folders'],
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest('POST', '/api/resource-folders', {
        name,
        parentId: selectedFolder
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resource-folders'] });
      setShowCreateFolderDialog(false);
      setNewFolderName('');
      toast({
        title: 'Pasta criada',
        description: 'Pasta criada com sucesso!'
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a pasta.',
        variant: 'destructive'
      });
    }
  });

  // Upload resource mutation
  const uploadResourceMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('POST', '/api/resources/upload', formData, false);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setShowUploadDialog(false);
      setUploadLink('');
      setUploadLinkName('');
      setSelectedFiles(null);
      toast({
        title: 'Recurso adicionado',
        description: 'Recurso adicionado com sucesso!'
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o recurso.',
        variant: 'destructive'
      });
    }
  });

  // Add link mutation
  const addLinkMutation = useMutation({
    mutationFn: async (data: { name: string; url: string }) => {
      const response = await apiRequest('POST', '/api/resources/link', {
        ...data,
        folderId: selectedFolder
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setShowUploadDialog(false);
      setUploadLink('');
      setUploadLinkName('');
      toast({
        title: 'Link adicionado',
        description: 'Link adicionado com sucesso!'
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o link.',
        variant: 'destructive'
      });
    }
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      const response = await apiRequest('DELETE', `/api/resources/${resourceId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      toast({
        title: 'Recurso excluído',
        description: 'Recurso excluído com sucesso!'
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o recurso.',
        variant: 'destructive'
      });
    }
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: number) => {
      const response = await apiRequest('DELETE', `/api/resource-folders/${folderId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resource-folders'] });
      toast({
        title: 'Pasta excluída',
        description: 'Pasta excluída com sucesso!'
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a pasta.',
        variant: 'destructive'
      });
    }
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolderMutation.mutate(newFolderName);
    }
  };

  const handleUpload = () => {
    if (uploadType === 'file' && selectedFiles && selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      if (selectedFolder) {
        formData.append('folderId', selectedFolder.toString());
      }
      uploadResourceMutation.mutate(formData);
    } else if (uploadType === 'link' && uploadLink) {
      addLinkMutation.mutate({
        name: uploadLinkName || uploadLink,
        url: uploadLink
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be handled by the useQuery hook
  };

  const handleDeleteResource = (resourceId: number) => {
    if (confirm('Tem certeza que deseja excluir este recurso?')) {
      deleteResourceMutation.mutate(resourceId);
    }
  };

  const handleDeleteFolder = (folderId: number) => {
    if (confirm('Tem certeza que deseja excluir esta pasta e todo o seu conteúdo?')) {
      deleteFolderMutation.mutate(folderId);
    }
  };

  const getResourceIcon = (resource: Resource) => {
    switch (resource.type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'pdf':
        return <FileTextIcon className="h-5 w-5 text-red-500" />;
      case 'audio':
        return <FileAudioIcon className="h-5 w-5 text-green-500" />;
      case 'video':
        return <FileVideoIcon className="h-5 w-5 text-purple-500" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getResourceThumbnail = (resource: Resource) => {
    if (resource.thumbnailUrl) {
      return (
        <div className="h-40 w-full rounded-md overflow-hidden">
          <img src={resource.thumbnailUrl} alt={resource.name} className="h-full w-full object-cover" />
        </div>
      );
    }

    return (
      <div className="h-40 w-full bg-muted rounded-md flex items-center justify-center">
        <div className="flex flex-col items-center">
          {getResourceIcon(resource)}
          <span className="mt-2 text-xs text-muted-foreground">{resource.type}</span>
        </div>
      </div>
    );
  };

  const currentFolderPath = () => {
    if (!selectedFolder) return 'Todos os recursos';

    if (!folders) return 'Carregando...';

    const buildPath = (folderId: number, path: string[] = []): string[] => {
      const folder = folders.find(f => f.id === folderId);
      if (!folder) return path;

      path.unshift(folder.name);
      if (folder.parentId) {
        return buildPath(folder.parentId, path);
      }
      return path;
    };

    const path = buildPath(selectedFolder);
    return path.join(' / ');
  };

  const filterFoldersByParentId = (parentId: number | null) => {
    if (!folders) return [];
    return folders.filter(folder => folder.parentId === parentId);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Repositório de Recursos</h1>
          <p className="text-muted-foreground">{currentFolderPath()}</p>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Recurso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Recurso</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="file" onValueChange={(v) => setUploadType(v as 'file' | 'link')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">Arquivo</TabsTrigger>
                  <TabsTrigger value="link">Link</TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="space-y-4 py-4">
                  <div className="flex flex-col gap-4">
                    <div className="border border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => setSelectedFiles(e.target.files)}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <UploadIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                        <p className="mb-1">Arraste arquivos ou clique para fazer upload</p>
                        <p className="text-sm text-muted-foreground">Suporta documentos, imagens, áudio e vídeo</p>
                      </label>
                    </div>
                    
                    {selectedFiles && selectedFiles.length > 0 && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">Arquivo selecionado: {selectedFiles[0].name}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="link" className="space-y-4 py-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nome (opcional)</label>
                      <Input
                        placeholder="Nome para o link"
                        value={uploadLinkName}
                        onChange={(e) => setUploadLinkName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">URL</label>
                      <Input
                        placeholder="https://"
                        value={uploadLink}
                        onChange={(e) => setUploadLink(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpload}>
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderIcon className="h-4 w-4 mr-2" />
                Nova Pasta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Pasta</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <Input
                  placeholder="Nome da pasta"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateFolder}>
                  Criar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex w-full max-w-lg">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" className="ml-2">
            Buscar
          </Button>
        </form>
      </div>
      
      <div className="flex gap-6">
        {/* Folders Sidebar */}
        <div className="w-64 shrink-0">
          <h2 className="text-lg font-medium mb-2">Pastas</h2>
          <div className="bg-card border rounded-md p-4">
            <div
              className={cn(
                "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted",
                !selectedFolder && "bg-muted"
              )}
              onClick={() => setSelectedFolder(null)}
            >
              <FolderIcon className="h-4 w-4 mr-2" />
              <span>Todos os recursos</span>
            </div>
            
            {foldersLoading ? (
              <div className="text-center py-4 text-muted-foreground">Carregando...</div>
            ) : (
              <div className="mt-2 space-y-1">
                {filterFoldersByParentId(null).map(folder => (
                  <div 
                    key={folder.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted",
                      selectedFolder === folder.id && "bg-muted"
                    )}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <div className="flex items-center">
                      <FolderIcon className="h-4 w-4 mr-2" />
                      <span>{folder.name}</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFolder(folder.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Resources Grid */}
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-2">Recursos</h2>
          
          {resourcesLoading ? (
            <div className="text-center py-20 text-muted-foreground">Carregando recursos...</div>
          ) : resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {resources.map(resource => (
                <div key={resource.id} className="bg-card border rounded-md overflow-hidden group">
                  {getResourceThumbnail(resource)}
                  
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getResourceIcon(resource)}
                        <h3 className="ml-2 font-medium truncate">{resource.name}</h3>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteResource(resource.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">{resource.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/50 rounded-md">
              <FileIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhum recurso encontrado</h3>
              <p className="text-muted-foreground mt-1">Adicione recursos usando o botão acima</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 