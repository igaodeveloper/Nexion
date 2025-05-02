import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  FileText,
  Database,
  Calendar,
  BarChart,
} from "lucide-react";

export interface Template {
  id: string;
  title: string;
  description: string;
  category: "note" | "doc" | "database" | "project" | "personal" | "other";
  thumbnail: string;
  popular?: boolean;
}

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentTab, setCurrentTab] = React.useState("all");

  // Sample templates
  const templates: Template[] = [
    {
      id: "empty-doc",
      title: "Documento em branco",
      description: "Comece do zero com um documento em branco.",
      category: "doc",
      thumbnail: "https://www.notion.so/images/page-cover/solid_blue.png",
      popular: true,
    },
    {
      id: "task-list",
      title: "Lista de tarefas",
      description: "Acompanhe suas tarefas diárias e projetos.",
      category: "note",
      thumbnail: "https://www.notion.so/images/page-cover/woodcuts_1.jpg",
      popular: true,
    },
    {
      id: "meeting-notes",
      title: "Notas de reunião",
      description:
        "Capture notas, decisões e próximos passos durante reuniões.",
      category: "note",
      thumbnail:
        "https://www.notion.so/images/page-cover/met_william_morris_1877_willow.jpg",
    },
    {
      id: "project-plan",
      title: "Plano de projeto",
      description: "Planeje e organize seus projetos do início ao fim.",
      category: "project",
      thumbnail: "https://www.notion.so/images/page-cover/gradients_10.jpg",
      popular: true,
    },
    {
      id: "weekly-planner",
      title: "Planejador semanal",
      description: "Organize sua agenda semanal e monitore seus objetivos.",
      category: "personal",
      thumbnail: "https://www.notion.so/images/page-cover/gradients_4.jpg",
    },
    {
      id: "content-calendar",
      title: "Calendário de conteúdo",
      description: "Planeje e agende seu calendário de conteúdo.",
      category: "database",
      thumbnail: "https://www.notion.so/images/page-cover/woodcuts_7.jpg",
    },
    {
      id: "habit-tracker",
      title: "Rastreador de hábitos",
      description: "Acompanhe e desenvolva hábitos diários.",
      category: "personal",
      thumbnail: "https://www.notion.so/images/page-cover/gradients_5.jpg",
    },
    {
      id: "reading-list",
      title: "Lista de leitura",
      description: "Organize os livros que você quer ler e já leu.",
      category: "personal",
      thumbnail:
        "https://www.notion.so/images/page-cover/met_william_morris_1875_marigold.jpg",
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    // Filter by search query
    if (
      searchQuery &&
      !template.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by category tab
    if (currentTab !== "all" && currentTab !== "popular") {
      return template.category === currentTab;
    }

    // Popular tab
    if (currentTab === "popular") {
      return template.popular;
    }

    // All templates
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "note":
        return <FileText className="h-4 w-4 mr-2" />;
      case "database":
        return <Database className="h-4 w-4 mr-2" />;
      case "project":
        return <BarChart className="h-4 w-4 mr-2" />;
      case "personal":
        return <Calendar className="h-4 w-4 mr-2" />;
      default:
        return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Escolha um template</h1>
        <Button variant="ghost" onClick={() => setLocation("/documents")}>
          Voltar
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block w-64 border-r p-4 overflow-auto">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant={currentTab === "all" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentTab("all")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Todos os templates
            </Button>
            <Button
              variant={currentTab === "popular" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentTab("popular")}
            >
              <Star className="h-4 w-4 mr-2" />
              Populares
            </Button>

            <h3 className="text-sm font-medium text-muted-foreground mt-4 mb-2">
              Categorias
            </h3>

            <Button
              variant={currentTab === "note" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentTab("note")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Notas
            </Button>
            <Button
              variant={currentTab === "project" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentTab("project")}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Projetos
            </Button>
            <Button
              variant={currentTab === "database" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentTab("database")}
            >
              <Database className="h-4 w-4 mr-2" />
              Banco de dados
            </Button>
            <Button
              variant={currentTab === "personal" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentTab("personal")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Pessoal
            </Button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden w-full p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar templates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="popular">Populares</TabsTrigger>
              <TabsTrigger value="note">Notas</TabsTrigger>
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Templates grid */}
        <div className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="h-32 bg-muted overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {template.title}
                      </CardTitle>
                      {template.popular && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getCategoryIcon(template.category)}
                      <span className="capitalize">{template.category}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription>{template.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Usar este template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default TemplateGallery;
