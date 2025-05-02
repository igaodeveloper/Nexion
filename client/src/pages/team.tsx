import { useState } from "react";
import {
  Search,
  Plus,
  User,
  Mail,
  Phone,
  MoreHorizontal,
  Users,
  Briefcase,
  Filter,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  status: "active" | "offline" | "away";
  phone?: string;
  workload?: number;
  projects?: string[];
  joinedAt: Date;
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Mock data for team members
  const members: TeamMember[] = [
    {
      id: "1",
      name: "Carolina Silva",
      email: "carolina.silva@nexion.com",
      role: "UX Designer",
      department: "Design",
      avatar: "",
      status: "active",
      phone: "+55 11 98765-4321",
      workload: 85,
      projects: ["Website Redesign", "Mobile App"],
      joinedAt: new Date(2021, 5, 15),
    },
    {
      id: "2",
      name: "Rafael Mendes",
      email: "rafael.mendes@nexion.com",
      role: "Frontend Developer",
      department: "Engineering",
      avatar: "",
      status: "active",
      phone: "+55 11 91234-5678",
      workload: 70,
      projects: ["Dashboard", "Mobile App", "API Integration"],
      joinedAt: new Date(2020, 3, 10),
    },
    {
      id: "3",
      name: "Juliana Costa",
      email: "juliana.costa@nexion.com",
      role: "Project Manager",
      department: "Management",
      avatar: "",
      status: "offline",
      phone: "+55 21 98888-7777",
      workload: 90,
      projects: ["Website Redesign", "Marketing Campaign"],
      joinedAt: new Date(2019, 8, 22),
    },
    {
      id: "4",
      name: "Matheus Oliveira",
      email: "matheus.oliveira@nexion.com",
      role: "Backend Developer",
      department: "Engineering",
      avatar: "",
      status: "away",
      phone: "+55 11 97777-6666",
      workload: 65,
      projects: ["API Integration", "Database Migration"],
      joinedAt: new Date(2022, 1, 5),
    },
    {
      id: "5",
      name: "Amanda Ferreira",
      email: "amanda.ferreira@nexion.com",
      role: "Marketing Specialist",
      department: "Marketing",
      avatar: "",
      status: "active",
      phone: "+55 11 96666-5555",
      workload: 75,
      projects: ["Marketing Campaign", "Social Media Strategy"],
      joinedAt: new Date(2021, 10, 18),
    },
    {
      id: "6",
      name: "Lucas Santos",
      email: "lucas.santos@nexion.com",
      role: "UI Designer",
      department: "Design",
      avatar: "",
      status: "active",
      phone: "+55 11 95555-4444",
      workload: 80,
      projects: ["Website Redesign", "Brand Refresh"],
      joinedAt: new Date(2020, 7, 30),
    },
    {
      id: "7",
      name: "Fernanda Lima",
      email: "fernanda.lima@nexion.com",
      role: "Content Writer",
      department: "Marketing",
      avatar: "",
      status: "offline",
      phone: "+55 21 94444-3333",
      workload: 60,
      projects: ["Blog Articles", "SEO Optimization"],
      joinedAt: new Date(2022, 4, 12),
    },
    {
      id: "8",
      name: "Bruno Almeida",
      email: "bruno.almeida@nexion.com",
      role: "DevOps Engineer",
      department: "Engineering",
      avatar: "",
      status: "active",
      phone: "+55 11 93333-2222",
      workload: 85,
      projects: ["CI/CD Pipeline", "Cloud Migration"],
      joinedAt: new Date(2020, 9, 8),
    },
  ];

  // Filtering and sorting logic
  const filteredMembers = members
    .filter((member) => {
      // Filter by search query
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by tab
      const matchesTab =
        currentTab === "all" ||
        (currentTab === "active" && member.status === "active") ||
        (currentTab === "away" && member.status === "away") ||
        (currentTab === "offline" && member.status === "offline");

      // Filter by department
      const matchesDepartment =
        departmentFilter === "all" || member.department === departmentFilter;

      return matchesSearch && matchesTab && matchesDepartment;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "department") {
        return sortDirection === "asc"
          ? a.department.localeCompare(b.department)
          : b.department.localeCompare(a.department);
      } else if (sortBy === "joinedAt") {
        return sortDirection === "asc"
          ? a.joinedAt.getTime() - b.joinedAt.getTime()
          : b.joinedAt.getTime() - a.joinedAt.getTime();
      } else if (sortBy === "workload") {
        const aWorkload = a.workload || 0;
        const bWorkload = b.workload || 0;
        return sortDirection === "asc"
          ? aWorkload - bWorkload
          : bWorkload - aWorkload;
      }
      return 0;
    });

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "offline":
        return "bg-slate-300";
      case "away":
        return "bg-amber-400";
      default:
        return "bg-slate-300";
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600";
    if (workload >= 70) return "text-amber-600";
    return "text-emerald-600";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getDepartments = () => {
    const departments = members.map((member) => member.department);
    return Array.from(new Set(departments));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os membros da sua equipe e seus acessos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={() => setIsAddingMember(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou cargo..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>

            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos departamentos</SelectItem>
                {getDepartments().map((dept, i) => (
                  <SelectItem key={i} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          value={currentTab}
          onValueChange={setCurrentTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="relative">
              Todos
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {members.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Ativos
              <Badge
                variant="outline"
                className="ml-2 bg-emerald-100 text-emerald-800"
              >
                {members.filter((m) => m.status === "active").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="away">
              Ausentes
              <Badge
                variant="outline"
                className="ml-2 bg-amber-100 text-amber-800"
              >
                {members.filter((m) => m.status === "away").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="offline">
              Offline
              <Badge
                variant="outline"
                className="ml-2 bg-slate-100 text-slate-800"
              >
                {members.filter((m) => m.status === "offline").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">
                        <Button
                          variant="ghost"
                          className="p-0 font-medium flex items-center gap-1 hover:bg-transparent"
                          onClick={() => toggleSort("name")}
                        >
                          Membro
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 font-medium flex items-center gap-1 hover:bg-transparent"
                          onClick={() => toggleSort("department")}
                        >
                          Departamento
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 font-medium flex items-center gap-1 hover:bg-transparent"
                          onClick={() => toggleSort("workload")}
                        >
                          Carga
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 font-medium flex items-center gap-1 hover:bg-transparent"
                          onClick={() => toggleSort("joinedAt")}
                        >
                          Ingressou em
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span
                                  className={cn(
                                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                    getStatusColor(member.status),
                                  )}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span>{member.department}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.role}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "flex items-center gap-1.5",
                                member.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  : member.status === "away"
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                    : "bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  getStatusColor(member.status),
                                )}
                              />
                              {member.status === "active"
                                ? "Ativo"
                                : member.status === "away"
                                  ? "Ausente"
                                  : "Offline"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {member.projects && member.projects.length > 0 ? (
                              <div>
                                <div className="flex -space-x-2">
                                  {member.projects
                                    .slice(0, 3)
                                    .map((project, i) => (
                                      <div
                                        key={i}
                                        className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center border border-background text-[10px]"
                                        title={project}
                                      >
                                        {project.charAt(0)}
                                      </div>
                                    ))}
                                  {member.projects.length > 3 && (
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] border border-background">
                                      +{member.projects.length - 3}
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {member.projects.length} projetos
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                Nenhum
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {member.workload !== undefined && (
                              <div
                                className={cn(
                                  "font-medium",
                                  getWorkloadColor(member.workload),
                                )}
                              >
                                {member.workload}%
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-muted-foreground text-sm">
                              {formatDate(member.joinedAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <User className="h-4 w-4 mr-2" />
                                  <span>Ver perfil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  <span>Enviar email</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone className="h-4 w-4 mr-2" />
                                  <span>Ligar</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  Remover membro
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center p-8 text-muted-foreground"
                        >
                          <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                          <p>Nenhum membro encontrado.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery("");
                              setDepartmentFilter("all");
                            }}
                          >
                            Limpar filtros
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {/* Active members tab - same structure as "all" but filtered */}
            <Card>
              <CardContent className="p-0">
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Membro</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Carga</TableHead>
                      <TableHead>Ingressou em</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{/* Content same as first tab */}</TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="away" className="mt-0">
            {/* Away members tab - same structure */}
            <Card>
              <CardContent className="p-0">
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Membro</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Carga</TableHead>
                      <TableHead>Ingressou em</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{/* Content same as first tab */}</TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offline" className="mt-0">
            {/* Offline members tab - same structure */}
            <Card>
              <CardContent className="p-0">
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Membro</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Carga</TableHead>
                      <TableHead>Ingressou em</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{/* Content same as first tab */}</TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar novo membro</DialogTitle>
            <DialogDescription>
              Adicione um novo membro à sua equipe. Eles receberão um convite
              por email.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Nome</Label>
                <Input id="first-name" placeholder="Nome" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Sobrenome</Label>
                <Input id="last-name" placeholder="Sobrenome" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemplo.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Cargo</Label>
                <Input id="role" placeholder="ex: UX Designer" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Departamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="engineering">Engenharia</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="management">Gestão</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="access-level">Nível de acesso</Label>
              <Select defaultValue="member">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Nível de acesso determina o que esse usuário pode ver e editar
                no sistema.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingMember(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsAddingMember(false)}>
              Adicionar membro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
