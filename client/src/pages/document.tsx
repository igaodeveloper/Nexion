import React, { useState, useEffect } from 'react';
import { PageEditor, Page } from '@/components/editor/page-editor';
import { Block } from '@/components/editor/block-editor';
import { AppLayout } from '@/layouts/app-layout';
import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { TemplateGallery, Template } from '@/components/template-gallery';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function DocumentPage() {
  const { id } = useParams();
  const [isCreating, setIsCreating] = useState(!id);
  const [showTemplateGallery, setShowTemplateGallery] = useState(!id);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);

  // Carregar página existente pelo ID
  const { data: page, isLoading } = useQuery<Page>({
    queryKey: [`/api/pages/${id}`],
    enabled: !!id,
  });

  useEffect(() => {
    if (page) {
      setCurrentPage(page);
    }
  }, [page]);

  // Criar nova página (mock - em uma aplicação real, seria a API)
  const createPageMutation = useMutation({
    mutationFn: async (newPage: Page) => {
      // Simulação de API - em um app real seria algo como:
      // const response = await apiRequest("POST", "/api/pages", newPage);
      // return response.json();
      
      // Mock de resposta
      return {
        ...newPage,
        id: `page-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    },
    onSuccess: (data) => {
      setCurrentPage(data);
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      setIsCreating(false);
    }
  });
  
  // Atualizar página existente
  const updatePageMutation = useMutation({
    mutationFn: async (updatedPage: Page) => {
      // Simulação de API - em um app real seria:
      // const response = await apiRequest("PATCH", `/api/pages/${updatedPage.id}`, updatedPage);
      // return response.json();
      
      // Mock de resposta
      return {
        ...updatedPage,
        updatedAt: new Date()
      };
    },
    onSuccess: (data) => {
      setCurrentPage(data);
      queryClient.invalidateQueries({ queryKey: [`/api/pages/${id}`] });
    }
  });

  // Manipulador para criar nova página a partir de um modelo
  const handleSelectTemplate = (template: Template) => {
    const initialBlocks: Block[] = [];
    
    // Adicionar blocos baseados no tipo de template
    if (template.category === 'note') {
      initialBlocks.push({
        id: `block-${Date.now()}-1`,
        type: 'paragraph',
        content: '',
        children: []
      });
    } else if (template.category === 'project') {
      initialBlocks.push({
        id: `block-${Date.now()}-1`,
        type: 'heading-1',
        content: 'Projeto',
        children: []
      });
      initialBlocks.push({
        id: `block-${Date.now()}-2`,
        type: 'paragraph',
        content: 'Descrição do projeto',
        children: []
      });
      initialBlocks.push({
        id: `block-${Date.now()}-3`,
        type: 'to-do',
        content: 'Tarefa a fazer',
        completed: false,
        children: []
      });
    }
    
    const newPage: Page = {
      id: '', // será gerado pelo servidor
      title: template.title,
      blocks: initialBlocks,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    createPageMutation.mutate(newPage);
    setShowTemplateGallery(false);
  };
  
  // Manipulador para atualizar a página atual
  const handleUpdatePage = (updatedPage: Page) => {
    if (updatedPage.id) {
      updatePageMutation.mutate(updatedPage);
    } else {
      createPageMutation.mutate(updatedPage);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  // Mostrar galeria de templates para criação de nova página
  if (showTemplateGallery) {
    return (
      <AppLayout>
        <TemplateGallery onSelectTemplate={handleSelectTemplate} />
      </AppLayout>
    );
  }

  // Criar página vazia se não tivermos nem página nem template
  if (!currentPage && !isCreating) {
    const emptyPage: Page = {
      id: '',
      title: 'Página sem título',
      blocks: [{
        id: `block-${Date.now()}`,
        type: 'paragraph',
        content: '',
        children: []
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return (
      <AppLayout>
        <PageEditor page={emptyPage} onUpdate={handleUpdatePage} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {currentPage && (
        <PageEditor page={currentPage} onUpdate={handleUpdatePage} />
      )}
      
      {/* Dialog de templates (pode ser aberto a partir do menu) */}
      <Dialog open={showTemplateGallery} onOpenChange={setShowTemplateGallery}>
        <DialogContent className="max-w-5xl">
          <TemplateGallery onSelectTemplate={handleSelectTemplate} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}