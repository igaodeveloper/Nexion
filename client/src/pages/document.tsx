import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Document } from '@shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import PageEditor, { Page } from '@/components/editor/page-editor';
import { TemplateGallery, Template } from '@/components/template-gallery';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function DocumentPage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  // Fetch document if we have an ID
  const { data: document, isLoading, error } = useQuery<Document>({
    queryKey: id ? ['/api/documents', parseInt(id)] : [],
    enabled: !!id,
  });

  // Create new document mutation
  const createMutation = useMutation({
    mutationFn: async (newPage: Page) => {
      const response = await apiRequest('POST', '/api/documents', newPage);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Document created successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setLocation(`/documents/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create document',
        variant: 'destructive',
      });
    }
  });

  // Update existing document mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedPage: Page) => {
      return await apiRequest(`/api/documents/${id}`, 'PATCH', updatedPage);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Document updated successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents', parseInt(id!)] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update document',
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

  // If loading, show skeleton
  if (id && isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-1/2 mx-auto" />
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
        <h1 className="text-2xl font-bold mb-4">Error loading document</h1>
        <p className="text-muted-foreground mb-4">The document could not be loaded.</p>
        <Button onClick={() => setLocation('/documents')}>Go Back</Button>
      </div>
    );
  }

  // If no ID or document found, and we're not showing template gallery, create a new empty document
  if (!id && !showTemplateGallery) {
    const emptyPage: Page = {
      title: 'Untitled',
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
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex justify-end p-4 bg-muted/50">
          <Button variant="outline" onClick={() => setShowTemplateGallery(true)}>
            Choose Template
          </Button>
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
    return <TemplateGallery onSelectTemplate={handleSelectTemplate} />;
  }

  // Otherwise, show the document editor
  return (
    <PageEditor
      page={{
        id: document?.id,
        title: document?.title || 'Untitled',
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
  );
}