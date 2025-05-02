import { useState } from "react";
import {
  BarChart,
  LineChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  BarChart2Icon,
  PieChartIcon,
  TrendingUpIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data for charts
const taskCompletionData = [
  { name: "Jan", completed: 45, pending: 24, total: 69 },
  { name: "Fev", completed: 52, pending: 18, total: 70 },
  { name: "Mar", completed: 49, pending: 22, total: 71 },
  { name: "Abr", completed: 62, pending: 15, total: 77 },
  { name: "Mai", completed: 55, pending: 21, total: 76 },
  { name: "Jun", completed: 68, pending: 12, total: 80 },
  { name: "Jul", completed: 61, pending: 17, total: 78 },
];

const teamPerformanceData = [
  { name: "Design", tasks: 120, completed: 105, efficiency: 87.5 },
  { name: "Develop", tasks: 185, completed: 152, efficiency: 82.2 },
  { name: "Marketing", tasks: 98, completed: 85, efficiency: 86.7 },
  { name: "Management", tasks: 76, completed: 70, efficiency: 92.1 },
];

const projectStatusData = [
  { name: "Em andamento", value: 5, color: "#6366F1" },
  { name: "Concluídos", value: 12, color: "#10B981" },
  { name: "Atrasados", value: 2, color: "#F43F5E" },
  { name: "Planejados", value: 8, color: "#F59E0B" },
];

const timeSpentData = [
  { name: "Seg", design: 3.2, development: 5.4, planning: 1.5, meetings: 2.3 },
  { name: "Ter", design: 4.1, development: 4.8, planning: 1.2, meetings: 1.9 },
  { name: "Qua", design: 3.8, development: 5.2, planning: 0.9, meetings: 2.5 },
  { name: "Qui", design: 3.5, development: 5.7, planning: 1.3, meetings: 1.8 },
  { name: "Sex", design: 2.9, development: 4.5, planning: 1.1, meetings: 1.5 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last-30");
  const [reportType, setReportType] = useState("tasks");

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Visualize o desempenho da sua equipe e projetos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Último mês
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <DownloadIcon className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Tabs defaultValue="overview" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="team">Equipe</TabsTrigger>
              <TabsTrigger value="projects">Projetos</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7">Últimos 7 dias</SelectItem>
                <SelectItem value="last-30">Últimos 30 dias</SelectItem>
                <SelectItem value="last-90">Últimos 90 dias</SelectItem>
                <SelectItem value="year-to-date">Ano até o momento</SelectItem>
                <SelectItem value="custom">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Tarefas Concluídas
              </CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">458</div>
              <p className="text-xs text-muted-foreground">
                +12.5% em relação ao mês anterior
              </p>
              <div className="mt-4 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Projetos Ativos
              </CardTitle>
              <BarChart2Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                3 projetos adicionados este mês
              </p>
              <div className="mt-4 h-1 w-full bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conclusão
              </CardTitle>
              <PieChartIcon className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85.2%</div>
              <p className="text-xs text-muted-foreground">
                +2.4% em relação ao mês anterior
              </p>
              <div className="mt-4 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Tempo de Resposta
              </CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3h</div>
              <p className="text-xs text-muted-foreground">
                -15% em relação ao mês anterior
              </p>
              <div className="mt-4 h-1 w-full bg-indigo-100 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: "62%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conclusão de Tarefas</CardTitle>
              <CardDescription>
                Total de tarefas concluídas vs pendentes por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskCompletionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="completed"
                      name="Concluídas"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      name="Pendentes"
                      fill="hsl(var(--muted))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho da Equipe</CardTitle>
              <CardDescription>
                Taxa de eficiência por departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={teamPerformanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="efficiency"
                      name="Eficiência (%)"
                      fill="hsl(var(--chart-1))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Projetos</CardTitle>
              <CardDescription>
                Distribuição de projetos por status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-full max-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tempo Gasto por Atividade</CardTitle>
              <CardDescription>
                Horas por dia e tipo de atividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSpentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="design"
                      name="Design"
                      stroke="#6366F1"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="development"
                      name="Desenvolvimento"
                      stroke="#10B981"
                    />
                    <Line
                      type="monotone"
                      dataKey="planning"
                      name="Planejamento"
                      stroke="#F59E0B"
                    />
                    <Line
                      type="monotone"
                      dataKey="meetings"
                      name="Reuniões"
                      stroke="#F43F5E"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
