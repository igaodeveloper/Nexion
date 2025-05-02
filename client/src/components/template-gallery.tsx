import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

// Tipo de template
export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'note' | 'doc' | 'database' | 'project' | 'personal' | 'other';
  thumbnail: string;
  popular?: boolean;
}

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  // Lista de templates (normalmente viria de uma API)
  const templates: Template[] = [
    {
      id: '1',
      title: 'Página em branco',
      description: 'Comece com uma página em branco',
      category: 'note',
      thumbnail: 'https://via.placeholder.com/150?text=Blank',
      popular: true
    },
    {
      id: '2',
      title: 'Nota de reunião',
      description: 'Estrutura para anotar informações de reuniões',
      category: 'note',
      thumbnail: 'https://via.placeholder.com/150?text=Meeting',
      popular: true
    },
    {
      id: '3',
      title: 'Lista de tarefas',
      description: 'Acompanhe suas tarefas e projetos',
      category: 'project',
      thumbnail: 'https://via.placeholder.com/150?text=ToDo',
      popular: true
    },
    {
      id: '4',
      title: 'Documento',
      description: 'Para criar documentação longa e detalhada',
      category: 'doc',
      thumbnail: 'https://via.placeholder.com/150?text=Doc'
    },
    {
      id: '5',
      title: 'Base de conhecimento',
      description: 'Organize o conhecimento da sua equipe',
      category: 'database',
      thumbnail: 'https://via.placeholder.com/150?text=KB'
    },
    {
      id: '6',
      title: 'Journal pessoal',
      description: 'Acompanhe seu dia a dia',
      category: 'personal',
      thumbnail: 'https://via.placeholder.com/150?text=Journal'
    },
    {
      id: '7',
      title: 'Tabela de dados',
      description: 'Organize informações em formato tabular',
      category: 'database',
      thumbnail: 'https://via.placeholder.com/150?text=Table'
    },
    {
      id: '8',
      title: 'Board Kanban',
      description: 'Visualize tarefas no estilo Kanban',
      category: 'project',
      thumbnail: 'https://via.placeholder.com/150?text=Kanban'
    }
  ];

  const popularTemplates = templates.filter(t => t.popular);
  
  const getNoteTemplates = () => templates.filter(t => t.category === 'note');
  const getDocTemplates = () => templates.filter(t => t.category === 'doc');
  const getDatabaseTemplates = () => templates.filter(t => t.category === 'database');
  const getProjectTemplates = () => templates.filter(t => t.category === 'project');
  const getPersonalTemplates = () => templates.filter(t => t.category === 'personal');
  
  return (
    <div className="template-gallery w-full max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Iniciar uma nova página</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Pesquisar templates"
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="popular">
        <TabsList className="mb-4">
          <TabsTrigger value="popular">Populares</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="docs">Documentos</TabsTrigger>
          <TabsTrigger value="database">Banco de dados</TabsTrigger>
          <TabsTrigger value="project">Projetos</TabsTrigger>
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="popular" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelectTemplate({
                id: 'empty',
                title: 'Página em branco',
                description: 'Comece do zero',
                category: 'note',
                thumbnail: ''
              })}
            >
              <CardContent className="pt-6 flex flex-col items-center justify-center h-52">
                <Plus size={48} className="text-gray-400 mb-2" />
                <CardTitle className="text-center">Página em branco</CardTitle>
                <CardDescription className="text-center">Comece do zero</CardDescription>
              </CardContent>
            </Card>
            
            {popularTemplates.map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-gray-100 relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getNoteTemplates().map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-gray-100 relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getDocTemplates().map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-gray-100 relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="database" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getDatabaseTemplates().map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-gray-100 relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="project" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getProjectTemplates().map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-gray-100 relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="personal" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getPersonalTemplates().map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="p-0">
                  <div className="h-32 bg-gray-100 relative">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}