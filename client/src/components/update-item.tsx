import { TaskUpdate, User, Task } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpdateItemProps {
  update: TaskUpdate & { 
    user: User;
    task: Task;
  };
}

export function UpdateItem({ update }: UpdateItemProps) {
  // Função para formatação relativa da data (ex: "há 2 horas")
  const getRelativeTime = (timestamp: Date | string) => {
    if (!timestamp) return "recentemente";
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };
  
  // Determinar cor do status
  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusMap: Record<string, string> = {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Em Progresso': 'bg-blue-100 text-blue-800',
      'Concluído': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800'
    };
    
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <li className="p-4 transition-colors hover:bg-accent/10">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 ring-2 ring-background">
          <AvatarFallback className="bg-primary/10 text-primary">
            {update.user.firstName.charAt(0)}{update.user.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
            <div className="font-medium text-sm">
              {update.user.firstName} {update.user.lastName}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1 sm:mt-0">
              <ClockIcon className="h-3 w-3 mr-1" />
              {getRelativeTime(update.timestamp)}
            </div>
          </div>
          
          <p className="text-sm text-foreground/80 mb-1.5">
            Atualizou o status da tarefa <span className="font-medium">"{update.task.title}"</span>
          </p>
          
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className={cn("px-2 py-0.5 rounded-md", getStatusColor(update.oldStatus))}>
              {update.oldStatus || "Não definido"}
            </Badge>
            
            <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
            
            <Badge variant="outline" className={cn("px-2 py-0.5 rounded-md", getStatusColor(update.newStatus))}>
              {update.newStatus || "Não definido"}
            </Badge>
          </div>
        </div>
      </div>
    </li>
  );
}
