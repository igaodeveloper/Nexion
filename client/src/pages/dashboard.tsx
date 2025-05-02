import { useState } from "react";
import { Link } from "wouter";
import { Circle, BarChart2, Activity, Clock, Users, CheckSquare, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/sidebar";

// Sample data
const tasks = [
  { id: 1, title: "Redesign da página inicial", status: "in-progress", priority: "high", dueDate: "2023-08-15", assignee: "Carolina Silva" },
  { id: 2, title: "Otimização do banco de dados", status: "pending", priority: "medium", dueDate: "2023-08-18", assignee: "Rafael Mendes" },
  { id: 3, title: "Integração com a API de pagamentos", status: "complete", priority: "high", dueDate: "2023-08-10", assignee: "Matheus Oliveira" },
  { id: 4, title: "Criar campanha de marketing", status: "in-progress", priority: "medium", dueDate: "2023-08-20", assignee: "Amanda Ferreira" },
];

const projects = [
  { 
    id: 1, 
    name: "Website Redesign", 
    progress: 75, 
    tasks: { total: 24, completed: 18 }, 
    team: ["Carolina Silva", "Lucas Santos", "Amanda Ferreira"],
    daysLeft: 5
  },
  { 
    id: 2, 
    name: "Mobile App Development", 
    progress: 40, 
    tasks: { total: 35, completed: 14 }, 
    team: ["Rafael Mendes", "Matheus Oliveira", "Carolina Silva"],
    daysLeft: 14
  },
  { 
    id: 3, 
    name: "Marketing Campaign", 
    progress: 90, 
    tasks: { total: 18, completed: 16 }, 
    team: ["Amanda Ferreira", "Juliana Costa"],
    daysLeft: 2
  },
];

const activities = [
  { user: "Rafael Mendes", action: "completed task", target: "Implementar autenticação", time: "2 horas atrás" },
  { user: "Carolina Silva", action: "added comment on", target: "Redesign da página inicial", time: "4 horas atrás" },
  { user: "Juliana Costa", action: "created project", target: "Q3 Marketing Strategy", time: "ontem" },
  { user: "Lucas Santos", action: "updated document", target: "UI Design Guidelines", time: "ontem" },
  { user: "Matheus Oliveira", action: "resolved issue", target: "API integration bug", time: "2 dias atrás" },
];

export default function Dashboard() {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-emerald-500";
      case "in-progress": return "bg-indigo-500";
      case "pending": return "bg-amber-500";
      default: return "bg-slate-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-amber-500";
      case "low": return "text-emerald-500";
      default: return "text-slate-500";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar companyName="Nexion" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Bem-vindo ao Nexion, sua central de produtividade.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="font-medium">
                <Clock className="mr-2 h-4 w-4" />
                Agosto 2023
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                <BarChart2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 projetos adicionados este mês</p>
                <div className="mt-4 h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                <Activity className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65.8%</div>
                <p className="text-xs text-muted-foreground">+5.2% em relação ao mês anterior</p>
                <div className="mt-4 h-1 w-full bg-amber-200 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '65.8%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Membros da Equipe</CardTitle>
                <Users className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">2 novos membros este mês</p>
                <div className="mt-4 flex -space-x-2">
                  {["Carolina Silva", "Rafael Mendes", "Lucas Santos", "Amanda Ferreira"].map((name, i) => (
                    <Avatar key={i} className="border-2 border-background h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs">
                    +4
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
                <CheckSquare className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">384</div>
                <p className="text-xs text-muted-foreground">+12.5% em relação ao mês anterior</p>
                <div className="mt-4 h-1 w-full bg-emerald-200 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Projects and Tasks */}
            <div className="lg:col-span-4 space-y-6">
              <Tabs defaultValue="projects" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="projects">Projetos</TabsTrigger>
                  <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="projects" className="space-y-4 mt-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="hover-glow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {project.tasks.completed} de {project.tasks.total} tarefas concluídas
                            </p>
                          </div>
                          <div className="text-sm font-medium text-amber-600">
                            {project.daysLeft} dias restantes
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Progresso</span>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className={getProgressColor(project.progress)} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.team.map((member, i) => (
                              <Avatar key={i} className="border-2 border-background">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {getInitials(member)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${project.id}`} className="flex items-center gap-1">
                              Ver detalhes
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="tasks" className="mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Tarefas Pendentes</CardTitle>
                        <Button variant="outline" size="sm">Ver todas</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(task.status)}`}></div>
                              <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  Vence em {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                              </div>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(task.assignee)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Atividades Recentes</CardTitle>
                  <CardDescription>
                    Atividades da sua equipe
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-auto">
                  <div className="space-y-8">
                    {activities.map((activity, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <Avatar className="mt-0.5">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(activity.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="font-medium text-primary">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver todas as atividades
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
