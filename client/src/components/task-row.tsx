import { Task, Project } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarIcon, AlertCircle, CheckCircle2, Activity } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";

interface TaskRowProps {
  task: Task;
  onStatusChange?: (taskId: number, newStatus: string) => void;
}

type PriorityInfo = {
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: JSX.Element;
  label: string;
};

type StatusInfo = {
  bgColor: string;
  textColor: string;
  borderColor: string;
  label: string;
};

export function TaskRow({ task, onStatusChange }: TaskRowProps) {
  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${task.projectId}`],
    enabled: !!task.projectId,
  });

  // Toggle task completion
  const handleToggleCompletion = async () => {
    const newStatus = task.completed ? "pending" : "complete";
    await apiRequest("PATCH", `/api/tasks/${task.id}`, {
      completed: !task.completed,
      status: newStatus
    });
    
    queryClient.invalidateQueries({ queryKey: [`/api/tasks/${task.id}`] });
    queryClient.invalidateQueries({ queryKey: ["/api/tasks/assigned"] });
    queryClient.invalidateQueries({ queryKey: [`/api/boards/${task.boardId}/tasks`] });
    
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  // Generate priority info
  const getPriorityInfo = (): PriorityInfo => {
    const map: Record<string, PriorityInfo> = {
      "alta": {
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1.5" />,
        label: "Alta"
      },
      "media": {
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
        icon: <Activity className="h-3.5 w-3.5 mr-1.5" />,
        label: "Média"
      },
      "baixa": {
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />,
        label: "Baixa"
      }
    };
    
    const priority = (task.priority || "media").toLowerCase();
    return map[priority as keyof typeof map] || map["media"];
  };

  // Generate status info
  const getStatusInfo = (): StatusInfo => {
    const map: Record<string, StatusInfo> = {
      "pending": {
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
        label: "Pendente"
      },
      "in_progress": {
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        label: "Em Progresso"
      },
      "complete": {
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        label: "Concluído"
      }
    };
    
    const status = (task.status || "pending").toLowerCase().replace('-', '_');
    return map[status as keyof typeof map] || map["pending"];
  };

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Sem data";
    
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMM", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Check if date is close or overdue
  const isDateCritical = (): boolean => {
    if (!task.dueDate) return false;
    
    try {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 2;
    } catch (e) {
      return false;
    }
  };

  const priorityInfo = getPriorityInfo();
  const statusInfo = getStatusInfo();
  
  // Corrigindo para usar apenas os tipos válidos para CheckedState: boolean | 'indeterminate'
  const isTaskCompleted: CheckedState = task.completed === true ? true : 
                                       task.completed === false ? false : 
                                       'indeterminate';

  return (
    <tr className="transition-colors hover:bg-accent/10 border-b border-border/50">
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Checkbox 
            checked={isTaskCompleted}
            onCheckedChange={handleToggleCompletion}
            className="mr-3 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
          />
          <span className={cn(
            "font-medium text-foreground transition-all", 
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className={cn(
          "text-sm text-muted-foreground max-w-xs truncate transition-all", 
          task.completed && "line-through opacity-70"
        )}>
          {task.description}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge 
          variant="outline" 
          className={cn(
            "font-normal border", 
            statusInfo.bgColor, 
            statusInfo.textColor,
            statusInfo.borderColor
          )}
        >
          {statusInfo.label}
        </Badge>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge 
          variant="outline" 
          className={cn(
            "font-normal border flex items-center", 
            priorityInfo.bgColor, 
            priorityInfo.textColor,
            priorityInfo.borderColor
          )}
        >
          {priorityInfo.icon}
          {priorityInfo.label}
        </Badge>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 ring-1 ring-background">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">JD</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>João Dias</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm text-muted-foreground">
        <div className="flex items-center">
          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary/80 mr-2"></span>
          <span className="font-medium text-foreground/80">
            {project?.name || "Friday Flow"}
          </span>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">
        <div className={cn(
          "flex items-center", 
          isDateCritical() ? "text-red-600" : "text-muted-foreground"
        )}>
          <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
          {formatDate(task.dueDate)}
        </div>
      </td>
    </tr>
  );
}
